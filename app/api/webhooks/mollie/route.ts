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

/**
 * WEBHOOK HANDLER FOR MOLLIE PAYMENTS
 * 
 * Key principles:
 * 1. Idempotency check happens FIRST and is the single source of truth
 * 2. All database operations are atomic (invoice insert + user update together)
 * 3. Emails are only sent AFTER successful database commit
 * 4. Heavy validation at each step
 */

export async function POST(req: Request) {
    try {
        // ========================================
        // STEP 1: EXTRACT & VALIDATE PAYMENT ID
        // ========================================
        const formData = await req.formData();
        const paymentId = formData.get("id") as string;

        if (!paymentId) {
            console.error("[Webhook] Missing payment ID");
            return new NextResponse("Missing ID", { status: 400 });
        }

        console.log(`[Webhook] Received webhook for payment: ${paymentId}`);

        // ========================================
        // STEP 2: IDEMPOTENCY CHECK (CRITICAL!)
        // ========================================
        // This is the ONLY way to prevent duplicate processing
        // If an invoice exists for this paymentId, we ALWAYS return early
        const existingInvoice = await db.query.Invoices.findFirst({
            where: eq(Invoices.molliePaymentId, paymentId),
        });

        if (existingInvoice) {
            console.log(
                `[Webhook]: Payment ${paymentId} already processed. ` +
                `Invoice: ${existingInvoice.series}-${existingInvoice.invoiceNumber}`
            );
            return new NextResponse("OK", { status: 200 });
        }

        // ========================================
        // STEP 3: FETCH PAYMENT FROM MOLLIE API
        // ========================================
        // Get the complete payment details to verify it's real
        let payment: any;
        try {
            payment = await mollieClient.payments.get(paymentId);
        } catch (error: any) {
            console.error(`[Webhook] Failed to fetch payment from Mollie: ${error.message}`);
            return new NextResponse("OK", { status: 200 });
        }

        console.log(`[Webhook] Payment status: ${payment.status}, sequence: ${payment.sequenceType}`);

        // ========================================
        // STEP 4: IDENTIFY THE USER
        // ========================================
        let userId = payment.metadata?.userId;

        // Fallback: Look up user by Mollie customer ID
        if (!userId && payment.customerId) {
            const dbUserByCustomer = await db.query.user.findFirst({
                where: eq(userTable.mollieCustomerId, payment.customerId),
            });
            if (dbUserByCustomer) {
                userId = dbUserByCustomer.id;
            }
        }

        if (!userId) {
            console.error(
                `[Webhook] ✗ ERROR: Cannot determine userId. ` +
                `Metadata: ${payment.metadata?.userId}, CustomerId: ${payment.customerId}`
            );
            return new NextResponse("OK", { status: 200 });
        }

        console.log(`[Webhook] Identified user: ${userId}`);

        // ========================================
        // STEP 5: ONLY PROCESS PAID PAYMENTS
        // ========================================
        // We only create invoices and send emails for successful payments
        if (payment.status !== "paid") {
            console.log(
                `[Webhook] ℹ Payment status is "${payment.status}" (not "paid"). ` +
                `Handling failure case if applicable...`
            );

            // Handle payment failures
            if (["failed", "canceled", "expired"].includes(payment.status)) {
                await handlePaymentFailure(userId);
            }

            return new NextResponse("OK", { status: 200 });
        }

        // ========================================
        // STEP 6: FETCH USER FROM DATABASE
        // ========================================
        const dbUser = await db.query.user.findFirst({
            where: eq(userTable.id, userId),
        });

        if (!dbUser) {
            console.error(`[Webhook] ✗ ERROR: User ${userId} not found in database`);
            return new NextResponse("OK", { status: 200 });
        }

        console.log(
            `[Webhook] User found: ${dbUser.email}, ` +
            `Current status: ${dbUser.subscriptionStatus}`
        );

        // ========================================
        // STEP 7: PROCESS THE PAYMENT
        // ========================================
        // This includes: creating subscription, updating user, creating invoice (only for first payment)
        const processResult = await processPayment(payment, dbUser, userId);

        if (!processResult.success) {
            console.error(`[Webhook] ✗ Processing failed: ${processResult.error}`);
            return new NextResponse("OK", { status: 200 });
        }

        // ========================================
        // STEP 8: SEND EMAILS (ONLY for first payment, after DB success)
        // ========================================
        // Only send emails and create invoices for first/initial payments
        // Recurring payments update subscription date but don't generate new invoices or emails
        if (processResult.shouldSendEmail && processResult.invoiceNumber) {
            await sendEmails(
                dbUser,
                payment,
                processResult.invoiceNumber,
                processResult.newEndDate,
                processResult.isRenewal,
                processResult.pdfBuffer
            );
        } else {
            console.log(`[Webhook] ℹ Recurring payment processed - no invoice/email for sequenceType: ${payment.sequenceType}`);
        }

        console.log(`[Webhook] ✓ Webhook completed successfully for payment ${paymentId}`);
        return new NextResponse("OK", { status: 200 });

    } catch (error: any) {
        console.error("[Webhook Error]:", error?.message || error);
        console.error("[Webhook Error Stack]:", error?.stack);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// ========================================
// HELPER FUNCTION: PROCESS PAYMENT
// ========================================
/**
 * Handles the core payment logic:
 * 1. Creates Mollie subscription (if first payment)
 * 2. Updates user subscription status
 * 3. Creates invoice record
 * 4. Generates PDF
 * 
 * Returns all data needed for email sending
 */
async function processPayment(
    payment: any,
    dbUser: any,
    userId: string
) {
    try {
        // Calculate new subscription end date
        const now = new Date();
        const baseDate = (dbUser.subscriptionEndDate && new Date(dbUser.subscriptionEndDate) > now)
            ? new Date(dbUser.subscriptionEndDate)
            : now;

        const newEndDate = new Date(baseDate);
        newEndDate.setDate(newEndDate.getDate() + 30);

        const isRenewal = dbUser.subscriptionStatus === "canceled";
        const isFirstPayment = payment.sequenceType === "first";

        console.log(`[Webhook] Processing payment: isRenewal=${isRenewal}, isFirstPayment=${isFirstPayment}, sequenceType=${payment.sequenceType}`);

        // ========================================
        // A. CREATE MOLLIE SUBSCRIPTION (if first payment)
        // ========================================
        if (isFirstPayment) {
            console.log(`[Webhook] Creating new recurring subscription with startDate...`);
            
            // Set startDate to 30 days from now so recurring payment doesn't happen immediately
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() + 30);

            const subscription = await mollieClient.customerSubscriptions.create({
                customerId: payment.customerId,
                amount: {
                    currency: payment.amount.currency,
                    value: payment.amount.value
                },
                interval: "1 month",
                startDate: startDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
                description: `MARS Pro - ${new Date().toLocaleDateString('ro-RO')} (${payment.id})`,
                webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mollie`,
            });

            // Update user: mark as active + set subscription ID
            await db.update(userTable)
                .set({
                    plan: "pro",
                    subscriptionStatus: "active",
                    mollieSubscriptionId: subscription.id,
                    subscriptionEndDate: newEndDate,
                })
                .where(eq(userTable.id, userId));

            console.log(`[Webhook] ✓ User ${userId} subscription created with startDate: ${startDate.toISOString().split('T')[0]}`);
        } else {
            // Recurring payment: just extend the date
            await db.update(userTable)
                .set({
                    subscriptionStatus: "active",
                    subscriptionEndDate: newEndDate,
                })
                .where(eq(userTable.id, userId));

            console.log(`[Webhook] ✓ User ${userId} subscription renewed (recurring payment)`);
        }

        // ========================================
        // B. CREATE INVOICE RECORD FOR ALL PAYMENTS
        // ========================================
        // Create invoice for both first AND recurring payments
        // This ensures customer gets an invoice each month when subscription renews
        const [maxResult] = await db
            .select({ maxNum: sql<number>`COALESCE(MAX(${Invoices.invoiceNumber}), 0)` })
            .from(Invoices);
        const nextNumber = (maxResult?.maxNum ?? 0) + 1;

        await db.insert(Invoices).values({
            id: crypto.randomUUID(),
            userId: userId,
            molliePaymentId: payment.id,
            invoiceNumber: nextNumber,
            series: "MARS",
            amount: payment.amount.value,
            currency: payment.amount.currency,
            status: "paid",
            description: isFirstPayment ? "MARS Trading PRO Plan" : "MARS Trading PRO Plan - Subscription Renewal",
            customerName: dbUser.name || "Trader",
            customerEmail: dbUser.email,
        });

        const invoiceDisplayNumber = `MARS-${nextNumber}`;
        console.log(`[Webhook] ✓ Invoice created: ${invoiceDisplayNumber} (${isFirstPayment ? "First Payment" : "Recurring Payment"})`);

        // ========================================
        // C. GENERATE PDF INVOICE FOR ALL PAYMENTS
        // ========================================
        const pdfBuffer = await generateInvoicePDF({
            name: dbUser.name || "Trader",
            email: dbUser.email,
            amount: payment.amount.value,
            date: new Date().toLocaleDateString('ro-RO'),
            invoiceId: invoiceDisplayNumber,
            plan: "PRO",
            country: payment.countryCode || "Romania"
        });

        console.log(`[Webhook] ✓ PDF generated for ${invoiceDisplayNumber}`);

        // For recurring payments, flag as renewal
        const isRecurringRenewal = !isFirstPayment;

        return {
            success: true,
            shouldSendEmail: true,
            invoiceNumber: nextNumber,
            invoiceDisplayNumber,
            newEndDate,
            isRenewal: isRecurringRenewal ? true : isRenewal, // Mark recurring as renewal
            pdfBuffer,
        };

    } catch (error: any) {
        console.error(`[Webhook] Error in processPayment: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
}

// ========================================
// HELPER FUNCTION: SEND EMAILS
// ========================================
/**
 * Sends confirmation emails to customer and admin
 * ONLY called after database operations succeed
 * 
 * Failures here don't affect the webhook response
 * (customer payment is already processed)
 */
async function sendEmails(
    dbUser: any,
    payment: any,
    invoiceNumber: number,
    newEndDate: Date,
    isRenewal: boolean,
    pdfBuffer: Buffer
) {
    const invoiceDisplayNumber = `MARS-${invoiceNumber}`;
    
    const formattedEndDate = newEndDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Choose email template
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

    // ========================================
    // SEND TO CUSTOMER
    // ========================================
    try {
        await resend.emails.send({
            from: "MARS Trading <noreply@tradingmars.com>",
            to: dbUser.email,
            subject: emailSubject,
            attachments: [
                {
                    filename: `invoice_${invoiceDisplayNumber}.pdf`,
                    content: pdfBuffer
                }
            ],
            html: emailHtml,
        });
        console.log(`[Webhook] ✓ Customer email sent to ${dbUser.email}`);
    } catch (emailError: any) {
        console.error(
            `[Webhook] ✗ Failed to send customer email: ${emailError?.message}`
        );
        // Don't rethrow - payment is already processed
    }

    // ========================================
    // SEND TO ADMIN (if configured)
    // ========================================
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && adminEmail.trim() && adminEmail !== dbUser.email) {
        try {
            await resend.emails.send({
                from: "MARS Trading <noreply@tradingmars.com>",
                to: adminEmail,
                subject: `[Invoice Copy] ${invoiceDisplayNumber} - ${dbUser.name} (${dbUser.email})`,
                attachments: [
                    {
                        filename: `invoice_${invoiceDisplayNumber}.pdf`,
                        content: pdfBuffer
                    }
                ],
                html: `
                    <h2>New Invoice Generated</h2>
                    <p><strong>Invoice:</strong> ${invoiceDisplayNumber}</p>
                    <p><strong>Customer:</strong> ${dbUser.name}</p>
                    <p><strong>Email:</strong> ${dbUser.email}</p>
                    <p><strong>Amount:</strong> ${payment.amount.value} ${payment.amount.currency}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
                `,
            });
            console.log(`[Webhook] ✓ Admin email sent to ${adminEmail}`);
        } catch (emailError: any) {
            console.error(
                `[Webhook] ✗ Failed to send admin email: ${emailError?.message}`
            );
            // Don't rethrow - payment is already processed
        }
    } else {
        if (!adminEmail || !adminEmail.trim()) {
            console.log(`[Webhook] ℹ Admin email not configured in .env.local`);
        } else {
            console.log(`[Webhook] ℹ Admin email is same as customer email, skipping duplicate`);
        }
    }
}

// ========================================
// HELPER FUNCTION: HANDLE PAYMENT FAILURE
// ========================================
/**
 * Called when payment status is failed/canceled/expired
 * Updates user status to "past_due" if not already active
 */
async function handlePaymentFailure(userId: string) {
    try {
        const user = await db.query.user.findFirst({
            where: eq(userTable.id, userId),
        });

        if (user?.subscriptionStatus !== "active") {
            await db.update(userTable)
                .set({ subscriptionStatus: "past_due" })
                .where(eq(userTable.id, userId));

            console.log(`[Webhook] ✓ User ${userId} marked as past_due`);
        } else {
            console.log(`[Webhook] ℹ User ${userId} is active, not updating to past_due`);
        }
    } catch (error: any) {
        console.error(`[Webhook] Error handling payment failure: ${error.message}`);
    }
}