import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import HowWorks from "@/components/landing/HowWorks";

export const metadata = {
  title: "MARS Trading Journal - Master Your Trading Strategy",
  description: "Join thousands of traders improving their strategy with our comprehensive trading journal. Track forex, crypto, and stocks easily.",
  openGraph: {
    title: "MARS Trading Journal - Master Your Trading Strategy",
    description: "Join thousands of traders improving their strategy with our comprehensive trading journal. Track forex, crypto, and stocks easily.",
  }
}

export default function Home() {
  return (
    <>
      <main className="bg-slate-950 min-h-screen selection:bg-orange-500/30">
        <Header />
        <Hero />
        <Features />
        <HowWorks />

        <Footer />
      </main>
    </>
  );
}
