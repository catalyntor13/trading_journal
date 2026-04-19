import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { db } from "@/db/index";
import { user as userTable, Invoices } from "@/db/schema";
import { generateInvoicePDF } from "@/lib/invoice-generator";
import { paymentConfirmationEmail, subscriptionRenewedEmail } from "@/lib/email-templates";
import { Resend } from "resend";
import { eq, sql, } from "drizzle-orm";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const paymentId = formData.get("id") as string;

        if (!paymentId) return new NextResponse("Missing ID", { status: 400 });

        // IDEMPOTENCY CHECK: Check if this payment has already been processed FIRST
        // This prevents duplicate emails and invoices from concurrent webhook calls
        const existingInvoice = await db.query.Invoices.findFirst({
            where: eq(Invoices.molliePaymentId, paymentId),
        });

        if (existingInvoice) {
            console.log(`[Webhook] Payment ${paymentId} already processed. Invoice exists: ${existingInvoice.series}-${existingInvoice.invoiceNumber}`);
            return new NextResponse("OK", { status: 200 });
        }

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
                } catch (e) {
                    // ignore
                }
            }

            // C. Salvare factură în DB și generare PDF
            // We already verified the invoice doesn't exist above, so we can safely insert
            // Get next invoice number (MAX + 1)
            const [maxResult] = await db
                .select({ maxNum: sql<number>`COALESCE(MAX(${Invoices.invoiceNumber}), 0)` })
                .from(Invoices);
            const nextNumber = (maxResult?.maxNum ?? 0) + 1;

            // Insert new invoice record
            const insertResult = await db.insert(Invoices).values({
                id: crypto.randomUUID(),
                userId: userId,
                molliePaymentId: paymentId,
                invoiceNumber: nextNumber,
                series: "MARS",
                amount: payment.amount.value,
                currency: payment.amount.currency,
                status: "paid",
                description: "MARS Trading PRO Plan",
                customerName: dbUser.name || "Trader",
                customerEmail: dbUser.email,
            });

            const invoiceDisplayNumber = `MARS-${nextNumber}`;
            console.log(`[Webhook] Invoice saved: ${invoiceDisplayNumber}`, insertResult);

            const pdfBuffer = await generateInvoicePDF({
                name: dbUser.name || "Trader",
                email: dbUser.email,
                amount: payment.amount.value,
                date: new Date().toLocaleDateString('ro-RO'),
                invoiceId: invoiceDisplayNumber,
                plan: "PRO",
                country: payment.countryCode || "Romania"
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

            // Send email to customer
            await resend.emails.send({
                from: "MARS Trading <noreply@tradingmars.com>",
                to: dbUser.email,
                subject: emailSubject,
                attachments: [{ filename: `invoice_${invoiceDisplayNumber}.pdf`, content: pdfBuffer }],
                html: emailHtml,
            });
            console.log(`[Webhook] Email sent to customer ${dbUser.email}`);

            // Send invoice copy to admin
            const adminEmail = process.env.ADMIN_EMAIL;
            if (adminEmail && adminEmail.trim() && adminEmail !== dbUser.email) {
                try {
                    await resend.emails.send({
                        from: "MARS Trading <noreply@tradingmars.com>",
                        to: adminEmail,
                        subject: `[Invoice Copy] ${invoiceDisplayNumber} - ${dbUser.name} (${dbUser.email})`,
                        attachments: [{ filename: `invoice_${invoiceDisplayNumber}.pdf`, content: pdfBuffer }],
                        html: `<p>New invoice generated:</p><p><strong>${invoiceDisplayNumber}</strong></p><p>Customer: ${dbUser.name}</p><p>Email: ${dbUser.email}</p><p>Amount: ${payment.amount.value} ${payment.amount.currency}</p>`,
                    });
                    console.log(`[Webhook] Admin invoice copy sent to ${adminEmail}`);
                } catch (emailError: any) {
                    console.error(`[Webhook] Failed to send admin invoice email:`, emailError?.message || emailError);
                }
            } else {
                console.log(`[Webhook] Admin email not configured or is same as customer email. Skipping admin copy.`);
            }
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
        console.error("[Webhook Error Stack]:", error?.stack);
        console.error("[Webhook Error Cause]:", error?.cause);
        return new NextResponse("Internal Error", { status: 500 });
    }
}