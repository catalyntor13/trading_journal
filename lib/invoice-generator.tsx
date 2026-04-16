import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

interface InvoiceData {
    name: string;
    email?: string;
    amount: string;
    date: string;
    invoiceId: string;
    plan?: string;
    country?: string;
    exchangeRateText?: string;
}

// ─── Colors ───
const colors = {
    black: '#000000',
    darkText: '#1a1a1a',
    bodyText: '#333333',
    mutedText: '#666666',
    lightText: '#999999',
    accent: '#d4a017',       // golden/amber for labels like "PAYMENT DUE"
    white: '#ffffff',
    borderLight: '#e0e0e0',
    borderMedium: '#cccccc',
    bgSubtle: '#f9f9f9',
};

const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: colors.white,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: colors.bodyText,
    },

    // ─── Top Header (two columns) ───
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    headerLeft: {
        flexDirection: 'column',
        width: '50%',
    },
    headerRight: {
        flexDirection: 'column',
        width: '45%',
    },
    brandName: {
        fontSize: 26,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
        letterSpacing: 1,
        marginBottom: 10,
    },
    companyDetail: {
        fontSize: 9.5,
        color: colors.bodyText,
        lineHeight: 1.6,
    },
    invoiceTitle: {
        fontSize: 28,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
        marginBottom: 14,
    },

    // ─── Invoice meta fields ───
    metaRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    metaLabel: {
        fontSize: 9.5,
        color: colors.bodyText,
        width: 110,
    },
    metaValue: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
    },

    // ─── Payment Due badge ───
    paymentDueLabel: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: colors.accent,
        marginTop: 10,
    },
    paymentDueSubtext: {
        fontSize: 9.5,
        color: colors.accent,
        marginTop: 2,
    },

    // ─── Billed To / Subscription row ───
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        marginBottom: 30,
    },
    infoBlock: {
        width: '45%',
    },
    sectionLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
        textTransform: 'uppercase' as any,
        letterSpacing: 1.5,
        marginBottom: 8,
        paddingBottom: 6,
        borderBottom: `1px solid ${colors.borderLight}`,
    },
    infoName: {
        fontSize: 11,
        color: colors.bodyText,
        marginBottom: 2,
    },
    infoDetail: {
        fontSize: 9.5,
        color: colors.mutedText,
        lineHeight: 1.6,
    },
    infoDetailRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    infoDetailLabel: {
        fontSize: 9.5,
        color: colors.mutedText,
    },
    infoDetailValue: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
    },

    // ─── Table ───
    table: {
        marginBottom: 0,
    },
    tableHeader: {
        flexDirection: 'row',
        borderTop: `1px solid ${colors.borderMedium}`,
        borderBottom: `1px solid ${colors.borderMedium}`,
        paddingVertical: 10,
        paddingHorizontal: 0,
    },
    tableHeaderText: {
        fontSize: 8.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.mutedText,
        textTransform: 'uppercase' as any,
        letterSpacing: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 0,
        borderBottom: `1px solid ${colors.borderLight}`,
    },
    colDescription: { width: '60%' },
    colPrice: { width: '20%', textAlign: 'right', paddingRight: 20 },
    colAmount: { width: '20%', textAlign: 'right' },
    cellText: {
        fontSize: 10,
        color: colors.bodyText,
    },
    cellTextBold: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
    },

    // ─── Totals ───
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 0,
        marginBottom: 0,
    },
    totalsBox: {
        width: '35%',
    },
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 0,
        borderBottom: `1px solid ${colors.borderLight}`,
    },
    totalsLabel: {
        fontSize: 10,
        color: colors.mutedText,
        textAlign: 'right',
    },
    totalsValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
        textAlign: 'right',
    },
    totalsValueMuted: {
        fontSize: 10,
        color: colors.mutedText,
        textAlign: 'right',
    },
    amountDueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 0,
        borderTop: `2px solid ${colors.darkText}`,
        borderBottom: `2px solid ${colors.darkText}`,
        marginTop: 4,
    },
    amountDueLabel: {
        fontSize: 14,
        color: colors.darkText,
    },
    amountDueCurrency: {
        fontSize: 10,
        color: colors.mutedText,
    },
    amountDueValue: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
    },

    // ─── Payments section ───
    paymentsSection: {
        marginTop: 30,
    },
    paymentsSectionLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
        textTransform: 'uppercase' as any,
        letterSpacing: 1.5,
        marginBottom: 6,
        paddingBottom: 6,
        borderBottom: `1px solid ${colors.borderLight}`,
    },
    paymentsText: {
        fontSize: 9.5,
        color: colors.bodyText,
        lineHeight: 1.6,
    },
    paymentsAmountBold: {
        fontSize: 9.5,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
    },

    // ─── Notes ───
    notesSection: {
        marginTop: 25,
    },
    notesSectionLabel: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: colors.darkText,
        textTransform: 'uppercase' as any,
        letterSpacing: 1.5,
        marginBottom: 6,
        paddingBottom: 6,
        borderBottom: `1px solid ${colors.borderLight}`,
    },
    notesText: {
        fontSize: 9,
        color: colors.mutedText,
        lineHeight: 1.6,
    },
    notesTextItalic: {
        fontSize: 8,
        color: colors.lightText,
        lineHeight: 1.6,
        marginTop: 8,
        fontFamily: 'Helvetica-Oblique',
    },

    // ─── Footer ───
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: `1px solid ${colors.borderLight}`,
        paddingTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: colors.lightText,
    },
    footerBrand: {
        fontSize: 8,
        color: colors.mutedText,
        fontFamily: 'Helvetica-Bold',
    },
});

// ─── Invoice Document Component ───
export const InvoiceDocument = ({ data }: { data: InvoiceData }) => {
    const invoiceNumber = data.invoiceId; // e.g. "MARS-1", "MARS-2"...
    const amountNum = parseFloat(data.amount);
    const totalAmount = amountNum;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* ─── Header ─── */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.brandName}>MARS Journal</Text>
                        <Text style={styles.companyDetail}>IDTORO SRL</Text>
                        <Text style={styles.companyDetail}>CUI: RO51081026</Text>
                        <Text style={styles.companyDetail}>Reg. Com: J2024051439004</Text>
                        <Text style={styles.companyDetail}>Ramnicu Valcea, Str Dem Radulescu, Nr 15, BL X2, Sc. A, Et 5, AP 37, judetul Valcea</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>

                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Invoice #</Text>
                            <Text style={styles.metaValue}>{invoiceNumber}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Invoice Date</Text>
                            <Text style={styles.metaValue}>{data.date}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Invoice Amount</Text>
                            <Text style={styles.metaValue}>${totalAmount.toFixed(2)} USD</Text>
                        </View>
                        {data.email && (
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Customer Email</Text>
                                <Text style={styles.metaValue}>{data.email}</Text>
                            </View>
                        )}

                        <Text style={styles.paymentDueLabel}>PAID</Text>
                        <Text style={styles.paymentDueSubtext}>(Payment Completed)</Text>
                    </View>
                </View>

                {/* ─── Billed To / Subscription Info ─── */}
                <View style={styles.infoRow}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.sectionLabel}>Billed To</Text>
                        <Text style={styles.infoName}>{data.name}</Text>
                        {data.email && (
                            <Text style={styles.infoDetail}>{data.email}</Text>
                        )}
                        {data.country && (
                            <Text style={styles.infoDetail}>{data.country}</Text>
                        )}
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.sectionLabel}>Subscription</Text>
                        <View style={styles.infoDetailRow}>
                            <Text style={styles.infoDetailLabel}>Plan  </Text>
                            <Text style={styles.infoDetailValue}>MARS Trading PRO Plan</Text>
                        </View>
                        <View style={styles.infoDetailRow}>
                            <Text style={styles.infoDetailLabel}>Billing Period  </Text>
                            <Text style={styles.infoDetailValue}>{data.plan || 'Monthly'}</Text>
                        </View>
                    </View>
                </View>

                {/* ─── Items Table ─── */}
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colDescription]}>Description</Text>
                        <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
                        <Text style={[styles.tableHeaderText, styles.colAmount]}>Amount (USD)</Text>
                    </View>
                    {/* Row */}
                    <View style={styles.tableRow}>
                        <Text style={[styles.cellTextBold, styles.colDescription]}>
                            MARS Trading PRO Plan
                        </Text>
                        <Text style={[styles.cellText, styles.colPrice]}>${amountNum.toFixed(2)}</Text>
                        <Text style={[styles.cellTextBold, styles.colAmount]}>${amountNum.toFixed(2)}</Text>
                    </View>
                </View>

                {/* ─── Totals ─── */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Subtotal</Text>
                            <Text style={styles.totalsValue}>${totalAmount.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.totalsRow, { paddingBottom: 16, alignItems: 'flex-start' as any }]}>
                            <Text style={styles.totalsLabel}>VAT (0%)</Text>
                            <View style={{ alignItems: 'flex-end' as any }}>
                                <Text style={styles.totalsValue}>$0.00</Text>
                                <Text style={{ fontSize: 8, color: '#666666', marginTop: 4 }}>
                                    (Export of Services)
                                </Text>
                            </View>
                        </View>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Total</Text>
                            <Text style={styles.totalsValue}>${totalAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.amountDueRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' as any, gap: 4 }}>
                                <Text style={styles.amountDueLabel}>Amount Due </Text>
                                <Text style={styles.amountDueCurrency}>(USD)</Text>
                            </View>
                            <Text style={styles.amountDueValue}>${totalAmount.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* ─── Payments ─── */}
                <View style={styles.paymentsSection}>
                    <Text style={styles.paymentsSectionLabel}>Payments</Text>
                    <Text style={styles.paymentsText}>
                        <Text style={styles.paymentsAmountBold}>${totalAmount.toFixed(2)} USD</Text>
                        {' '}payment was completed on {data.date}.
                    </Text>
                    {data.exchangeRateText && (
                        <Text style={[styles.paymentsText, { marginTop: 4 }]}>
                            Exchange Rate: {data.exchangeRateText}
                        </Text>
                    )}
                </View>

                {/* ─── Notes ─── */}
                <View style={styles.notesSection}>
                    <Text style={styles.notesSectionLabel}>Notes</Text>
                    <Text style={styles.notesText}>
                        Thank you for your subscription to MARS Journal.{'\n'}
                        Your subscription renews automatically. You can manage your subscription{'\n'}
                        at any time from the Settings page in your dashboard.{'\n'}

                    </Text>
                    <Text style={styles.notesTextItalic}>
                        This invoice is issued without signature and stamp according to Law 227/2015, Art. 319, para. 29. / Aceasta factura circula fara semnatura si stampila conform Legii 227/2015 privind Codul Fiscal, art. 319, alin. 29.
                    </Text>
                </View>

                {/* ─── Footer ─── */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        © {new Date().getFullYear()} MARS TRADING JOURNAL — All rights reserved
                    </Text>

                </View>
            </Page>
        </Document>
    );
};

// ─── Export: Called from Webhook ───
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
    try {
        const response = await fetch('https://www.cursbnr.ro/api/json.php?currency=USD');
        const json = await response.json();
        if (json?.value) {
            data.exchangeRateText = `1 USD = ${json.value} RON`;
        }
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
    }

    const buffer = await renderToBuffer(<InvoiceDocument data={data} />);
    return Buffer.from(buffer);
}