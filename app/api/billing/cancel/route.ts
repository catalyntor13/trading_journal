import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mollieClient } from "@/lib/mollie";
import { db } from "@/db/index";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { subscriptionCancelledEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    // 1. Verificăm sesiunea userului
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    // 2. Luăm datele din DB ca să avem ID-urile de Mollie
    const dbUser = await db.query.user.findFirst({
        where: eq(userTable.id, session.user.id),
    });

    if (!dbUser?.mollieSubscriptionId || !dbUser?.mollieCustomerId) {
        return NextResponse.json({ error: "Nu există un abonament activ de anulat" }, { status: 400 });
    }

    try {
        // 3. Încercăm să anulăm în Mollie
        await mollieClient.customerSubscriptions.cancel(
            dbUser.mollieSubscriptionId,
            { customerId: dbUser.mollieCustomerId }
        );

        console.log(`Subscription ${dbUser.mollieSubscriptionId} has been cancelled.`);

    } catch (error: any) {
        // GESTIONARE EROARE 422: Dacă abonamentul este deja anulat în Mollie
        // Nu vrem să dăm eroare userului, ci doar să ne sincronizăm baza de date.
        if (error.statusCode === 422) {
            console.warn("Subscription was already cancelled in Mollie.");
        } else {
            console.error("Unexpected error in Mollie:", error);
            return NextResponse.json({ error: "Error processing cancellation" }, { status: 500 });
        }
    }

    // 4. Actualizăm statusul în DB indiferent dacă Mollie a zis OK sau "deja anulat"
    await db.update(userTable)
        .set({ subscriptionStatus: "canceled" })
        .where(eq(userTable.id, session.user.id));

    // 5. Trimitem email de confirmare a anulării
    try {
        const endDate = dbUser.subscriptionEndDate
            ? new Date(dbUser.subscriptionEndDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            : "N/A";

        await resend.emails.send({
            from: "MARS Trading <onboarding@resend.dev>",
            to: dbUser.email,
            subject: "Subscription Cancelled — MARS Trading Journal",
            html: subscriptionCancelledEmail({
                name: dbUser.name || "Trader",
                endDate,
            }),
        });

        console.log(`[Cancel] Cancellation email sent to ${dbUser.email}`);
    } catch (emailError: any) {
        // Don't fail the cancellation if email fails
        console.error("[Cancel] Failed to send cancellation email:", emailError?.message || emailError);
    }

    return NextResponse.json({ success: true });
}