import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { db } from "@/db/index";
import { user as userTable } from "@/db/schema";
import { generateInvoicePDF } from "@/lib/invoice-generator";
import { paymentConfirmationEmail, subscriptionRenewedEmail } from "@/lib/email-templates";
import { Resend } from "resend";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const paymentId = formData.get("id") as string;

        if (!paymentId) return new NextResponse("Missing ID", { status: 400 });

        // 1. Luăm plata și logăm statusul pentru debug
        const payment: any = await mollieClient.payments.get(paymentId);
        console.log(`[Webhook] Processing payment ${paymentId}. Status: ${payment.status}`);

        // Try metadata first, then fall back to looking up user by Mollie customerId
        let userId = payment.metadata?.userId;

        if (!userId && payment.customerId) {
            console.log(`[Webhook] Metadata userId missing, looking up user by customerId: ${payment.customerId}`);
            const dbUserByCustomer = await db.query.user.findFirst({
                where: eq(userTable.mollieCustomerId, payment.customerId),
            });
            if (dbUserByCustomer) {
                userId = dbUserByCustomer.id;
                console.log(`[Webhook] Found user ${userId} via customerId.`);
            }
        }

        if (!userId) {
            console.error("[Webhook] ERROR: Could not determine userId from metadata or customerId!");
            return new NextResponse("OK", { status: 200 });
        }

        // 2. Dacă plata este PAID
        if (payment.status === "paid") {
            const dbUser = await db.query.user.findFirst({
                where: eq(userTable.id, userId),
            });

            if (!dbUser) {
                console.error(`[Webhook] Userul ${userId} nu a fost găsit în DB`);
                return new NextResponse("OK", { status: 200 });
            }

            // Calculăm data de expirare (Prelungire)
            const now = new Date();
            const baseDate = (dbUser.subscriptionEndDate && new Date(dbUser.subscriptionEndDate) > now)
                ? new Date(dbUser.subscriptionEndDate)
                : now;

            const newEndDate = new Date(baseDate);
            newEndDate.setDate(newEndDate.getDate() + 30);

            const isRenewal = dbUser.subscriptionStatus === "canceled";

            // VERIFICĂM DACĂ TREBUIE SĂ CREĂM UN ABONAMENT NOU (pentru Renew/First Payment)
            if (payment.sequenceType === "first") {
                console.log(`[Webhook] Creating new subscription for user ${userId}`);

                const subscription = await mollieClient.customerSubscriptions.create({
                    customerId: payment.customerId,
                    amount: {
                        currency: payment.amount.currency,
                        value: payment.amount.value
                    },
                    interval: "1 month",
                    description: `MARS Pro - ${new Date().toLocaleDateString('ro-RO')} (${payment.id})`,
                    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mollie`,
                });

                // Update DB: Schimbăm din 'canceled' în 'active' și punem noul Subscription ID
                await db.update(userTable)
                    .set({
                        plan: "pro",
                        subscriptionStatus: "active",
                        mollieSubscriptionId: subscription.id,
                        subscriptionEndDate: newEndDate,
                    })
                    .where(eq(userTable.id, userId));

                console.log(`[Webhook] Success! User ${userId} is now ACTIVE.`);
            } else {
                // Dacă e o plată recurentă automată, doar prelungim data
                await db.update(userTable)
                    .set({
                        subscriptionStatus: "active",
                        subscriptionEndDate: newEndDate,
                    })
                    .where(eq(userTable.id, userId));
                console.log(`[Webhook] Automatic renewal successful for ${userId}.`);
            }

            // Fetch customer to try and get country
            let country = undefined;
            if (payment.customerId) {
                try {
                    const customer = await mollieClient.customers.get(payment.customerId);
                    // Mollie customer doesn't natively guarantee country in base object unless custom meta
                    // Depending on how you collect it, maybe from billingAddress.country or metadata
                    // Not strictly standard but let's try if you map it
                } catch(e) {
                   // ignore
                }
            }

            // C. Generare Factură și Trimitere Email
            const pdfBuffer = await generateInvoicePDF({
                name: dbUser.name || "Trader",
                email: dbUser.email,
                amount: payment.amount.value,
                date: new Date().toLocaleDateString('ro-RO'),
                invoiceId: payment.id,
                plan: "Monthly",
                country: payment.countryCode || "Romania" // Mollie usually has countryCode on payment, else default or user meta
            });

            const formattedEndDate = newEndDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Choose the right email template based on whether this is a renewal or new payment
            const emailHtml = isRenewal
                ? subscriptionRenewedEmail({
                    name: dbUser.name || "Trader",
                    amount: payment.amount.value,
                    endDate: formattedEndDate,
                })
                : paymentConfirmationEmail({
                    name: dbUser.name || "Trader",
                    amount: payment.amount.value,
                    plan: "MARS Pro — Monthly",
                    endDate: formattedEndDate,
                });

            const emailSubject = isRenewal
                ? "Welcome Back! Your MARS Pro Subscription is Active"
                : "Payment Confirmation — MARS Trading Journal";

            await resend.emails.send({
                from: "MARS Trading <onboarding@resend.dev>",
                to: dbUser.email,
                subject: emailSubject,
                attachments: [{ filename: `invoice_${payment.id}.pdf`, content: pdfBuffer }],
                html: emailHtml,
            });
        }

        // 3. Dacă plata a eșuat/fost anulată
        else if (["failed", "canceled", "expired"].includes(payment.status)) {
            console.log(`[Webhook] Payment failed. Status: ${payment.status}`);
            const userInDb = await db.query.user.findFirst({ where: eq(userTable.id, userId) });
            if (userInDb?.subscriptionStatus !== "active") {
                await db.update(userTable)
                    .set({ subscriptionStatus: "past_due" })
                    .where(eq(userTable.id, userId));
            }
        }

        return new NextResponse("OK", { status: 200 });

    } catch (error: any) {
        console.error("[Webhook Error]:", error?.message || error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}