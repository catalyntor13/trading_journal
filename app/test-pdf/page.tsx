"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { InvoiceDocument } from "@/lib/invoice-generator";

// Dynamic import to avoid SSR issues with @react-pdf/renderer
const PDFViewer = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
    { ssr: false, loading: () => <p style={{ padding: 40, color: "#666" }}>Loading PDF viewer...</p> }
);

const sampleData = {
    name: "John Doe",
    email: "john@example.com",
    amount: "20.00",
    date: new Date().toLocaleDateString("ro-RO"),
    invoiceId: "tr_test12345678",
    plan: "Trading Pro Plan",
    country: "United States",
};

export default function TestPDFPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <PDFViewer width="100%" height="100%">
                <InvoiceDocument data={sampleData} />
            </PDFViewer>
        </div>
    );
}