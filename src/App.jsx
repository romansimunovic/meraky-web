import React, { useState } from 'react';
import { servicesData } from './data/servicesData';
import BookingSystem from './components/BookingSystem';

// POMOĆNA KOMPONENTA ZA LUKSUZNE iOS/SF SYMBOLS IKONE
function ServiceIcon({ type }) {
  const baseStyle = "w-4 h-4 transition-transform duration-300 group-hover:scale-110";
  
  switch (type) {
    case "face":
      return (
        // Elegantna iskra/sjaj (skincare)
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83"/>
        </svg>
      );
    case "massage":
      return (
        // Minimalistički cvijet lotusa / zen energija
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 22C12 22 17 17 17 13C17 9 12 5 12 5C12 5 7 9 7 13C7 17 12 22 12 22Z" />
          <path d="M12 22C12 22 21 18 21 13C21 8 12 7 12 7" />
          <path d="M12 22C12 22 3 18 3 13C3 8 12 7 12 7" />
        </svg>
      );
    case "foot":
      return (
        // Elegantna kapljica s mineralnim kamenom (njega i refleksologija)
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="6" r="2.5" />
          <path d="M12 10.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5-2.5-5.5-5.5-5.5z" />
          <path d="M8.5 16h7" />
        </svg>
      );
    case "smooth":
      return (
        // Jednostavan, profinjen organski list (glatkoća i priroda)
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 8.5C17 15 15 20 11 20z"/>
          <path d="M19 2c-2.26 4.33-5.27 7.14-8 10"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans-clean text-[#3E3530] selection:bg-[#E5DEC9] selection:text-[#3E3530]">
      
      {/* 1. LUKSUZNI MINIMALISTIČKI NAVBAR */}
      <header className="border-b border-[#E8E2D7] bg-[#FAF7F2]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif-elegant text-xl tracking-[0.15em] uppercase font-light text-[#3E3530]">
              Meraky
            </span>
            <span className="text-[7px] uppercase tracking-[0.3em] text-[#C5A880] -mt-1 font-bold">
              Beauty & Care
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold">
            <a href="#tretmani" className="hover:text-[#C5A880] transition-colors">Usluge</a>
            <a href="#o-salonu" className="hover:text-[#C5A880] transition-colors">O nama</a>
            <a href="#kontakt" className="hover:text-[#C5A880] transition-colors">Kontakt</a>
          </nav>

          <a 
            href="#rezervacija" 
            className="bg-[#3E3530] hover:bg-[#C5A880] text-white text-[9px] uppercase tracking-widest font-bold py-2.5 px-5 rounded-full transition-all duration-300 shadow-xs"
          >
            Rezerviraj termin
          </a>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-40"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold">Oaza mira u Osijeku</p>
          <h1 className="font-serif-elegant text-4xl sm:text-6xl font-light text-[#3E3530] leading-tight">
            Tvoj trenutak <br className="sm:hidden" /> potpunog sklada.
          </h1>
          <p className="font-serif-elegant text-lg sm:text-2xl text-[#3E3530]/70 italic max-w-2xl mx-auto font-light leading-relaxed">
            "Mjesto gdje se spajaju napredna kozmetologija, opuštajući rituali i mir koji ti je prijeko potreban."
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#rezervacija" 
              className="bg-[#3E3530] hover:bg-[#C5A880] text-white text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300"
            >
              Odaberi slobodan termin
            </a>
            <a 
              href="#tretmani" 
              className="border border-[#E8E2D7] hover:border-[#3E3530] bg-white/50 text-[#3E3530] text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300"
            >
              Istraži naš cjenik
            </a>
          </div>
        </div>
      </section>

      {/* 3. INTERAKTIVNI PREGLED USLUGA (S premium iOS ikonama) */}
      <section id="tretmani" className="max-w-5xl mx-auto px-6 py-16 border-t border-[#E8E2D7]/60">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold mb-2">Naš Ritualni Cjenik</p>
          <h2 className="font-serif-elegant text-3xl font-light text-[#3E3530]">Otkrij našu ponudu</h2>
          <p className="text-xs text-[#3E3530]/60 mt-2">Svakom tretmanu pristupamo individualno uz vrhunsku kozmetiku i holistički pristup.</p>
        </div>

        {/* Kategorije kao luksuzni tabovi s novim ikonama */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 justify-start md:justify-center scrollbar-none">
          {servicesData.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`group flex items-center gap-2.5 py-3 px-5 rounded-full text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#3E3530] text-white'
                  : 'bg-[#F3ECE3]/40 text-[#3E3530]/75 hover:bg-[#F3ECE3] border border-[#E8E2D7]/50'
              }`}
            >
              {/* Ovdje renderiramo iOS-style SVG ikonicu */}
              <span className={activeTab === idx ? 'text-[#C5A880]' : 'text-[#3E3530]/50 group-hover:text-[#3E3530]'}>
                <ServiceIcon type={cat.icon} />
              </span>
              {cat.category}
            </button>
          ))}
        </div>

        {/* Prikaz odabrane kategorije i njenih stavki */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 max-w-3xl mx-auto shadow-xs transition-all duration-300">
          <div className="mb-6 pb-4 border-b border-[#FAF7F2]">
            <p className="text-xs font-serif-elegant italic text-[#C5A880]">{servicesData[activeTab].subtitle}</p>
          </div>

          <div className="space-y-4">
            {servicesData[activeTab].items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#FAF7F2]/80 last:border-0">
                <div>
                  <h4 className="text-xs font-bold text-[#3E3530]">{item.name}</h4>
                  <p className="text-[10px] text-[#3E3530]/50 mt-0.5">Trajanje: {item.duration}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold font-mono text-[#C5A880]">{item.price} €</span>
                  <a 
                    href="#rezervacija" 
                    className="text-[9px] uppercase tracking-wider font-bold text-[#3E3530]/40 hover:text-[#C5A880] transition-colors"
                  >
                    Rezerviraj →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIUM "O NAMA" (O SALONU) SEKCIJA */}
      <section id="o-salonu" className="py-20 bg-white border-t border-[#E8E2D7]/60 relative overflow-hidden">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-10"></div>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Lijeva strana: Veliki senzorni citat */}
          <div className="md:col-span-5 space-y-4">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-bold">Filozofija Salona</p>
            <h3 className="font-serif-elegant text-3xl md:text-4xl font-light text-[#3E3530] leading-tight">
              Ljepota je u osjećaju usporavanja.
            </h3>
            <div className="w-12 h-px bg-[#C5A880] my-6"></div>
            <p className="font-serif-elegant italic text-base text-[#3E3530]/70 font-light">
              "Meraky nije samo kozmetički salon — to je prostor u kojem vanjski svijet nakratko prestaje postojati, a tvoje vrijeme postaje isključivo tvoje."
            </p>
          </div>

          {/* Desna strana: Priča i detaljan tekst */}
          <div className="md:col-span-7 space-y-6 text-xs sm:text-sm text-[#3E3530]/75 leading-relaxed">
            <p>
              Vjerujemo da se prava estetika krije u detaljima. Zato smo kreirali prostor u kojem se preklapaju vrhunsko stručno znanje, napredni dermatološki protokoli i čisti, opuštajući holistički rituali. Bez žurbe, bez stresa i s maksimalnim fokusom na potrebe tvog tijela i kože.
            </p>
            <p>
              Svaki naš tretman lica započinje detaljnom analizom kože kako bismo odabrali idealne aktivne sastojke, dok su naše masaže i pedikure osmišljene kao cjeloviti SPA rituali koji vraćaju lakoću koraku i mir umu. 
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#FAF7F2]">
              <div>
                <p className="font-serif-elegant text-xl text-[#C5A880] font-light">100%</p>
                <p className="text-[9px] uppercase tracking-wider text-[#3E3530]/50 font-bold mt-1">Individualno</p>
              </div>
              <div>
                <p className="font-serif-elegant text-xl text-[#C5A880] font-light">Premium</p>
                <p className="text-[9px] uppercase tracking-wider text-[#3E3530]/50 font-bold mt-1">Kozmetika</p>
              </div>
              <div>
                <p className="font-serif-elegant text-xl text-[#C5A880] font-light">Osijek</p>
                <p className="text-[9px] uppercase tracking-wider text-[#3E3530]/50 font-bold mt-1">Lokacija</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PRODUKCIJSKI REZERVACIJSKI SUSTAV */}
      <div className="bg-[#FAF7F2] py-8 border-t border-[#E8E2D7]/60">
        <BookingSystem servicesData={servicesData} />
      </div>

      {/* 6. FOOTER */}
      <footer id="kontakt" className="bg-[#3E3530] text-[#FAF7F2] py-12 border-t border-[#E8E2D7]/10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-3">
            <h4 className="font-serif-elegant text-xl tracking-wider uppercase font-light">Meraky</h4>
            <p className="text-[11px] text-[#FAF7F2]/60 leading-relaxed max-w-xs">
              Salon posvećen tvojoj ljepoti, zdravlju kože i potpunom opuštanju uma od svakodnevnog ubrzanog tempa.
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880]">Lokacija i Kontakt</h5>
            <p className="text-xs text-[#FAF7F2]/80">Krbavska ulica 15, 31000 Osijek</p>
            <p className="text-xs text-[#FAF7F2]/80">Telefon: 099 123 4567</p>
            <p className="text-xs text-[#FAF7F2]/80">E-mail: info@meraky-beauty.hr</p>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] uppercase tracking-widest font-bold text-[#C5A880]">Radno Vrijeme</h5>
            <p className="text-xs text-[#FAF7F2]/80">Pon - Pet: 08:00 - 20:00</p>
            <p className="text-xs text-[#FAF7F2]/80">Subota: 08:00 - 14:00</p>
            <p className="text-xs text-[#FAF7F2]/80">Nedjelja: Zatvoreno</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-[#FAF7F2]/10 text-center text-[10px] text-[#FAF7F2]/40">
          <p>© {new Date().getFullYear()} Meraky Beauty & Care. Sva prava pridržana.</p>
        </div>
      </footer>

    </div>
  );
}