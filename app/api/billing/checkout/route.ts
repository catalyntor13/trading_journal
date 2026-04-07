import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { mollieClient } from "@/lib/mollie";
import { SequenceType } from "@mollie/api-client";
import { db } from "@/db/index";
import { user as userTable } from "@/db/schema"; // Atenție la importul numelui tabelului
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        // 1. Obținem sesiunea
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // 2. Căutăm userul în baza de date pentru a vedea statusul curent
        const dbUser = await db.query.user.findFirst({
            where: eq(userTable.id, userId),
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // --- PROTECȚIE DUBLĂ PLATĂ ---
        // Dacă userul e deja activ și NU a dat cancel, nu îl lăsăm să plătească iar
        if (dbUser.subscriptionStatus === "active") {
            return NextResponse.json(
                { error: "You already have an active subscription." },
                { status: 400 }
            );
        }

        // 3. Gestionare Mollie Customer ID
        let mollieCustomerId = dbUser.mollieCustomerId;

        if (!mollieCustomerId) {
            // Cream un client nou dacă nu există în DB
            const customer = await mollieClient.customers.create({
                name: dbUser.name || "Trader",
                email: dbUser.email,
            });
            mollieCustomerId = customer.id;

            // Salvăm ID-ul în baza de date
            await db.update(userTable)
                .set({ mollieCustomerId: mollieCustomerId })
                .where(eq(userTable.id, userId));
        }

        // 4. Creăm Plata (First Payment pentru Mandat)
        // Aceasta este ruta apelată și de "Upgrade" și de "Renew"
        const payment = await mollieClient.payments.create({
            amount: {
                currency: 'USD', // Folosește aceeași monedă ca în Webhook!
                value: '20.00',
            },
            customerId: mollieCustomerId,
            sequenceType: SequenceType.first,
            description: 'Subscription Setup - MARS Trading Journal',
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success`,
            webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mollie`, // Folosește variabila de webhook
            metadata: {
                userId: userId,
                type: 'subscription_setup'
            }
        });

        // 5. Trimitem URL-ul de checkout către client
        // Folosim metoda recomandată getCheckoutUrl()
        return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}