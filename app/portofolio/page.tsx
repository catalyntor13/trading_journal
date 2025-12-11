import React from 'react';
import { CheckCircle, Zap, Database, Mail, ArrowRight } from 'lucide-react'; // Presupunand ca folosesti lucide-react sau similar

const PortfolioStructure = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. HERO SECTION - Promisiunea (Hook-ul) */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          Nu doar un site web, ci un sistem de vânzări
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Transform Traficul în Clienți cu <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            Landing Page-uri Ultra-Rapide
          </span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10">
          Majoritatea site-urilor pierd 40% din clienți pentru că sunt lente. 
          Eu construiesc platforme care se încarcă instant, capturează lead-uri și trimit email-uri automat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition">
            Vreau o Ofertă Personalizată
          </button>
          <button className="px-8 py-4 bg-transparent border border-neutral-700 text-white font-medium rounded-lg hover:border-white transition">
            Vezi Portofoliul
          </button>
        </div>
      </section>

      {/* 2. THE PROBLEM vs SOLUTION - De ce tu? */}
      <section className="bg-neutral-900 py-20 border-y border-neutral-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">De ce site-urile vechi nu mai vând</h2>
              <div className="space-y-4 text-neutral-400">
                <p>❌ Site-urile WordPress sunt lente și vulnerabile la hackeri.</p>
                <p>❌ Formularele de contact adesea nu trimit datele unde trebuie.</p>
                <p>❌ Clientul intră, așteaptă 3 secunde, se plictisește și pleacă la concurență.</p>
              </div>
            </div>
            <div className="bg-neutral-950 p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-2xl font-bold mb-4 text-white">Abordarea Mea Modernă</h3>
              <ul className="space-y-4">
                <ListItem text="Scor 100/100 Google Lighthouse (Viteză Instantă)" />
                <ListItem text="Bază de date Securizată pentru Clienți (Nu se pierd date)" />
                <ListItem text="Automatizare Email (Clientul primește răspuns imediat)" />
                <ListItem text="Design Premium care inspiră încredere" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE STACK (Tradus pentru Business) - Aici stralucesti tu */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Tehnologie de nivel Enterprise pentru afacerea ta</h2>
          <p className="text-neutral-400 mt-4">Nu folosesc template-uri ieftine. Scriu cod personalizat pentru performanță maximă.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TechCard 
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="Next.js & Tailwind"
            desc="Aceeași tehnologie folosită de Netflix și TikTok. Asigură o viteză de încărcare sub 0.5 secunde."
          />
          <TechCard 
            icon={<Database className="w-8 h-8 text-green-400" />}
            title="Supabase & Security"
            desc="Datele clienților tăi sunt stocate criptat și securizat. Fără plugin-uri vulnerabile."
          />
          <TechCard 
            icon={<Mail className="w-8 h-8 text-blue-400" />}
            title="Automatizare Inteligentă"
            desc="Când un client completează formularul, primești notificare instant, iar el primește o ofertă pe email."
          />
        </div>
      </section>

      {/* 4. THE OFFER (Produsul Concret) - Aici filtrezi clientii */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <h2 className="text-3xl font-bold mb-4">Pachetul "Growth Engine"</h2>
          <p className="text-neutral-400 mb-8">Tot ce ai nevoie pentru a colecta clienți online, livrat în 5-7 zile.</p>
          
          <div className="text-5xl font-bold mb-2">€750 <span className="text-lg text-neutral-500 font-normal">/ one-time</span></div>
          <p className="text-sm text-neutral-500 mb-10">Plata: 50% avans, 50% la livrare</p>

          <div className="grid text-left gap-4 max-w-sm mx-auto mb-10">
            <CheckItem text="Landing Page Design Premium (Mobile Optimized)" />
            <CheckItem text="Integrare Formular Contact + Bază de Date" />
            <CheckItem text="1 Email Automatizat către client" />
            <CheckItem text="Hosting Gratuit & Domeniu conectat" />
            <CheckItem text="Tutorial Video cum să folosești platforma" />
          </div>

          <button className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 mx-auto">
            Rezervă un loc pentru luna asta <ArrowRight className="w-4 h-4" />
          </button>
          <p className="mt-4 text-xs text-neutral-600">Locuri limitate: Accept doar 2 proiecte pe lună pentru calitate maximă.</p>
        </div>
      </section>

      {/* 5. ABOUT ME (Scurt si la obiect) */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center border-t border-neutral-800">
        <h2 className="text-2xl font-bold mb-4">Cine sunt?</h2>
        <p className="text-neutral-400 leading-relaxed">
          Sunt un dezvoltator web axat pe performanță și un investitor disciplinat. 
          Aplic în dezvoltarea web aceeași rigoare și gestionare a riscului pe care o folosesc în piețele financiare.
          Nu caut să fac "site-uri drăguțe", ci active digitale care produc rezultate măsurabile.
        </p>
      </section>

    </div>
  );
};

// Componente ajutatoare mici pentru a pastra codul curat
const ListItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
    <span className="text-neutral-300">{text}</span>
  </li>
);

const CheckItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
      <CheckCircle className="w-3 h-3 text-indigo-400" />
    </div>
    <span className="text-neutral-300 text-sm">{text}</span>
  </div>
);

const TechCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800 hover:border-neutral-700 transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default PortfolioStructure;