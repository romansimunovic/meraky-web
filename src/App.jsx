import React, { useState } from 'react';
import { servicesData } from './data/servicesData';
import BookingSystem from './components/BookingSystem';

function ServiceIcon({ type }) {
  const baseStyle = "w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0";
  
  switch (type) {
    case "face":
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.34 6.34l2.83 2.83M14.83 14.83l2.83 2.83M6.34 17.66l2.83-2.83M14.83 9.17l2.83-2.83"/>
        </svg>
      );
    case "massage":
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M12 22C12 22 17 17 17 13C17 9 12 5 12 5C12 5 7 9 7 13C7 17 12 22 12 22Z" />
          <path d="M12 22C12 22 21 18 21 13C21 8 12 7 12 7" />
          <path d="M12 22C12 22 3 18 3 13C3 8 12 7 12 7" />
        </svg>
      );
    case "foot":
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="6" r="2.5" />
          <path d="M12 10.5c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5-2.5-5.5-5.5-5.5z" />
          <path d="M8.5 16h7" />
        </svg>
      );
    case "smooth":
      return (
        <svg className={baseStyle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="min-h-screen bg-[#FCFAF7] font-sans-clean text-[#2B231F] selection:bg-[#E5DEC9] selection:text-[#2B231F] overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className="border-b border-[#E8E2D7] bg-[#FCFAF7]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif-elegant text-2xl tracking-[0.15em] uppercase font-light text-[#2B231F]">
              Meraky
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#B89565] -mt-1 font-bold">
              Beauty & Care
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest font-bold">
            <a href="#tretmani" className="hover:text-[#B89565] transition-colors text-[#2B231F]">Usluge</a>
            <a href="#o-salonu" className="hover:text-[#B89565] transition-colors text-[#2B231F]">O nama</a>
            <a href="#kontakt" className="hover:text-[#B89565] transition-colors text-[#2B231F]">Kontakt</a>
          </nav>

          <a 
            href="#rezervacija" 
            className="bg-[#2B231F] hover:bg-[#B89565] text-white text-[11px] uppercase tracking-widest font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-sm active:scale-95"
          >
            Rezerviraj
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#B89565] font-bold">Oaza mira u Osijeku</p>
          <h1 className="font-serif-elegant text-4xl sm:text-6xl lg:text-7xl font-light text-[#2B231F] leading-tight">
            Tvoj trenutak <br /> potpunog sklada.
          </h1>
          <p className="font-serif-elegant text-xl sm:text-3xl text-[#2B231F]/80 italic max-w-2xl mx-auto font-light leading-relaxed">
            "Mjesto gdje se spajaju napredna kozmetologija, opuštajući rituali i mir koji ti je prijeko potreban."
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4 px-4">
            <a 
              href="#rezervacija" 
              className="bg-[#2B231F] hover:bg-[#B89565] text-white text-sm font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300 shadow-md text-center"
            >
              Odaberi slobodan termin
            </a>
            <a 
              href="#tretmani" 
              className="border-2 border-[#E8E2D7] hover:border-[#2B231F] bg-white/70 text-[#2B231F] text-sm font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300 text-center"
            >
              Istraži naš cjenik
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="tretmani" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[#E8E2D7]/60">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#B89565] font-bold mb-2">Naš Ritualni Cjenik</p>
          <h2 className="font-serif-elegant text-3xl sm:text-4xl font-light text-[#2B231F]">Otkrij našu ponudu</h2>
          <p className="text-sm sm:text-base text-[#2B231F]/75 mt-2">Svakom tretmanu pristupamo individualno uz vrhunsku kozmetiku i holistički pristup.</p>
        </div>

        {/* Kategorije kao luksuzni tabovi */}
        <div className="w-full overflow-x-auto pb-4 mb-8 scrollbar-none touch-scroll">
          <div className="flex gap-3 px-1 md:justify-center min-w-max">
            {servicesData.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`group flex items-center gap-3 py-3 px-6 rounded-full text-xs uppercase font-bold tracking-wider transition-all cursor-pointer border ${
                  activeTab === idx
                    ? 'bg-[#2B231F] text-white border-[#2B231F]'
                    : 'bg-[#F3ECE3]/30 text-[#2B231F] hover:bg-[#F3ECE3]/70 border-[#E8E2D7]'
                }`}
              >
                <span className={activeTab === idx ? 'text-[#B89565]' : 'text-[#2B231F]/60 group-hover:text-[#2B231F]'}>
                  <ServiceIcon type={cat.icon} />
                </span>
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Prikaz odabrane kategorije */}
        <div className="bg-white rounded-3xl border border-[#E8E2D7] p-6 sm:p-10 max-w-3xl mx-auto shadow-sm transition-all duration-300">
          
          {/* POPRAVLJENI DIO: Veći font, tamniji tekst i bolja linija razgraničenja */}
          <div className="mb-8 pb-5 border-b border-[#E8E2D7]/50">
            <p className="text-lg sm:text-xl font-serif-elegant italic text-[#2B231F] font-medium leading-relaxed">
              "{servicesData[activeTab].subtitle}"
            </p>
          </div>

          <div className="space-y-6">
            {servicesData[activeTab].items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-[#FAF7F2] last:border-0 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-[#2B231F]">{item.name}</h4>
                  <p className="text-xs text-[#2B231F]/60">Trajanje: {item.duration}</p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <span className="text-sm sm:text-base font-semibold font-mono text-[#B89565]">{item.price} €</span>
                  <a 
                    href="#rezervacija" 
                    className="text-xs uppercase tracking-wider font-bold text-[#2B231F]/60 hover:text-[#B89565] transition-colors"
                  >
                    Rezerviraj →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O NAMA SEKCIJA */}
      <section id="o-salonu" className="py-20 bg-white border-t border-[#E8E2D7]/60 relative overflow-hidden">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-5 space-y-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B89565] font-bold">Filozofija Salona</p>
            <h3 className="font-serif-elegant text-4xl sm:text-5xl font-light text-[#2B231F] leading-tight">
              Ljepota je u osjećaju usporavanja.
            </h3>
            <div className="w-16 h-[2px] bg-[#B89565] my-6"></div>
            <p className="font-serif-elegant italic text-lg sm:text-2xl text-[#2B231F]/80 font-light leading-relaxed">
              "Meraky prostor u kojem vanjski svijet nakratko prestaje postojati."
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-[#2B231F]/80 leading-relaxed">
            <p>
              Vjerujemo da se prava estetika krije u detaljima. Zato smo kreirali prostor u kojem se preklapaju vrhunsko stručno znanje, napredni dermatološki protokoli i čisti, opuštajući holistički rituali. Bez žurbe, bez stresa i s maksimalnim fokusom na potrebe tvog tijela i kože.
            </p>
            <p>
              Svaki naš tretman lica započinje detaljnom analizom kože kako bismo odabrali idealne aktivne sastojke, dok su naše masaže i pedikure osmišljene kao cjeloviti SPA rituali koji vraćaju lakoću koraku i mir umu. 
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#FAF7F2]">
              <div>
                <p className="font-serif-elegant text-2xl sm:text-3xl text-[#B89565] font-light">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-[#2B231F]/60 font-bold mt-1">Individualno</p>
              </div>
              <div>
                <p className="font-serif-elegant text-2xl sm:text-3xl text-[#B89565] font-light">Premium</p>
                <p className="text-[10px] uppercase tracking-wider text-[#2B231F]/60 font-bold mt-1">Kozmetika</p>
              </div>
              <div>
                <p className="font-serif-elegant text-2xl sm:text-3xl text-[#B89565] font-light">Osijek</p>
                <p className="text-[10px] uppercase tracking-wider text-[#2B231F]/60 font-bold mt-1">Lokacija</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BOOKING SUSTAV */}
      <div className="bg-[#FAF7F2] py-8 border-t border-[#E8E2D7]/60">
        <BookingSystem servicesData={servicesData} />
      </div>

      {/* FOOTER */}
      <footer id="kontakt" className="bg-[#2B231F] text-[#FCFAF7] py-16 border-t border-[#E8E2D7]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="font-serif-elegant text-2xl tracking-wider uppercase font-light">Meraky</h4>
            <p className="text-xs sm:text-sm text-[#FCFAF7]/70 leading-relaxed max-w-sm">
              Salon posvećen tvojoj ljepoti, zdravlju kože i potpunom opuštanju uma od svakodnevnog ubrzanog tempa.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-bold text-[#B89565]">Lokacija i Kontakt</h5>
            <p className="text-sm text-[#FCFAF7]/90">Krbavska ulica 15, 31000 Osijek</p>
            <p className="text-sm text-[#FCFAF7]/90">Telefon: 099 123 4567</p>
            <p className="text-sm text-[#FCFAF7]/90">E-mail: info@meraky-beauty.hr</p>
          </div>
          <div className="space-y-4">
            <h5 className="text-xs uppercase tracking-widest font-bold text-[#B89565]">Radno Vrijeme</h5>
            <p className="text-sm text-[#FCFAF7]/90">Pon - Pet: 08:00 - 20:00</p>
            <p className="text-sm text-[#FCFAF7]/90">Subota: 08:00 - 14:00</p>
            <p className="text-sm text-[#FCFAF7]/90">Nedjelja: Zatvoreno</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-[#FCFAF7]/10 text-center text-xs text-[#FCFAF7]/50">
          <p>© {new Date().getFullYear()} Meraky Beauty & Care. Sva prava pridržana.</p>
        </div>
      </footer>

    </div>
  );
}