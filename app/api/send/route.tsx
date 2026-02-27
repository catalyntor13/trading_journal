"use server";

import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    const { email } = await request.json();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "[EMAIL_ADDRESS]",
        to: email,
        subject: "Hello world",
        react: <h1>Hello world</ h1 >,
    });

    if (error) {
        return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
}