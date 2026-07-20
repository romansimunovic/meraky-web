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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [preselectedCategory, setPreselectedCategory] = useState("");
  const [preselectedItem, setPreselectedItem] = useState("");
  const [revealedCard, setRevealedCard] = useState(null);

  const toggleCard = (cardName) => {
  setRevealedCard(revealedCard === cardName ? null : cardName);
};

  const handleQuickBook = (categoryName, itemName) => {
    setPreselectedCategory(categoryName);
    setPreselectedItem(itemName);
    
    const bookingSection = document.getElementById('rezervacija');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans-clean text-brand-espresso selection:bg-brand-moss selection:text-brand-espresso overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className="border-b border-brand-sand bg-brand-cream/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* LOGO SALONA */}
          <a href="#" className="flex items-center transition-opacity hover:opacity-90">
            <img 
              src="/images/logo_salona.png" 
              alt="Meraky Beauty & Care Logo" 
              className="h-14 w-auto object-contain rounded-lg"
            />
          </a>
          
          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest font-bold">
            <a href="#tretmani" className="hover:text-brand-gold transition-colors text-brand-espresso">Usluge</a>
            <a href="#nas-rad" className="hover:text-brand-gold transition-colors text-brand-espresso">Naš rad</a>
            <a href="#kontakt" className="hover:text-brand-gold transition-colors text-brand-espresso">Kontakt</a>
          </nav>

          {/* SOCIJALNE IKONE (UMJESTO GUMBA REZERVIRAJ) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4 mr-2 md:mr-0">
              {/* INSTAGRAM LINK */}
              <a 
                href="https://www.instagram.com/merakycare/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-espresso hover:text-brand-gold transition-colors p-2"
                aria-label="Instagram profil"
              >
                <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* FACEBOOK LINK */}
              <a 
                href="https://www.facebook.com/p/Meraky-Beauty-and-Care-100094700135644/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-espresso hover:text-brand-gold transition-colors p-2"
                aria-label="Facebook stranica"
              >
                <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>

            {/* HAMBURGER GUMB ZA MOBITELE */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-espresso focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILNA NAVIGACIJA */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-sand bg-brand-cream px-4 pt-4 pb-6 space-y-3 shadow-inner animate-fade-in">
            <a 
              href="#tretmani" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold uppercase tracking-wider text-brand-espresso hover:text-brand-gold"
            >
              Usluge
            </a>
            <a 
              href="#nas-rad" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold uppercase tracking-wider text-brand-espresso hover:text-brand-gold"
            >
              Naš rad
            </a>
            <a 
              href="#kontakt" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold uppercase tracking-wider text-brand-espresso hover:text-brand-gold"
            >
              Kontakt
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <p className="text-[20px] uppercase tracking-[0.3em] text-brand-gold font-bold">Meraky Salon</p>
          <h1 className="font-serif-elegant text-4xl sm:text-6xl lg:text-7xl font-light text-brand-espresso leading-tight">
            Tvoj trenutak <br /> potpunog sklada.
          </h1>
          <p className="font-serif-elegant text-xl sm:text-3xl text-brand-espresso/80 italic max-w-2xl mx-auto font-light leading-relaxed">
            Mjesto gdje se spajaju napredna kozmetologija, opuštajući rituali i mir koji ti je prijeko potreban.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4 px-4">
            <a 
              href="#rezervacija" 
              className="bg-brand-espresso hover:bg-brand-gold text-white text-sm font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300 shadow-md text-center"
            >
              REZERVIRAJ
            </a>
            <a 
              href="#tretmani" 
              className="border-2 border-brand-sand hover:border-brand-espresso bg-white/70 text-brand-espresso text-sm font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-all duration-300 text-center"
            >
              USLUGE
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="tretmani" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-brand-sand/60">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[20px] uppercase tracking-[0.25em] text-brand-gold font-bold mb-2">Cjenik</p>
          <p className="text-sm sm:text-base text-brand-espresso/75 mt-2">Svakom tretmanu pristupamo individualno uz vrhunsku kozmetiku i holistički pristup.</p>
        </div>

        {/* Tabovi za kategorije */}
        <div className="w-full overflow-x-auto pb-4 mb-8 scrollbar-none touch-scroll">
          <div className="flex gap-3 px-1 md:justify-center min-w-max">
            {servicesData.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`group flex items-center gap-3 py-3 px-6 rounded-full text-xs uppercase font-bold tracking-wider transition-all cursor-pointer border ${
                  activeTab === idx
                    ? 'bg-brand-espresso text-white border-brand-espresso'
                    : 'bg-brand-clay/30 text-brand-espresso hover:bg-brand-clay/70 border-brand-sand'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Prikaz stavki unutar odabrane kategorije */}
        <div className="bg-white rounded-3xl border border-brand-sand p-6 sm:p-10 max-w-3xl mx-auto shadow-sm">
          <div className="space-y-6">
            {servicesData[activeTab].items.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-brand-clay last:border-0 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-brand-espresso">{item.name}</h4>
                  <p className="text-xs text-brand-espresso/60">Trajanje: {item.duration}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0">
                  <span className="text-sm sm:text-base font-semibold font-mono text-brand-gold">{item.price} €</span>
                  
                  <button 
                    onClick={() => handleQuickBook(servicesData[activeTab].category, item.name)}
                    className="text-xs uppercase tracking-wider font-bold text-brand-espresso/60 hover:text-brand-gold transition-colors cursor-pointer"
                  >
                    Rezerviraj →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKCIJA NAŠ RAD */}
      <section id="nas-rad" className="py-16 sm:py-20 bg-white border-t border-brand-sand/60 relative overflow-hidden">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-5"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Naslov sekcije */}
          <div className="text-center max-w-xl mx-auto mb-12 sm:text-center">
            <p className="text-[20px] uppercase tracking-[0.25em] text-brand-gold font-bold mb-2">Galerija</p>
            <h3 className="font-serif-elegant text-3xl sm:text-5xl font-light text-brand-espresso">
              Ambijent i Tretmani
            </h3>
            <div className="w-16 h-[2px] bg-brand-gold mx-auto mt-4"></div>
            <p className="text-sm sm:text-base text-brand-espresso/75 mt-4">
              Atmosfera i rezultati posvećeni ljepoti vaše kože.
            </p>
          </div>

          {/* Grid raspored: Na mobitelu jedno ispod drugog (col-1), na webu jedno pored drugog (md:grid-cols-3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-md mx-auto md:max-w-none">
            
            {/* 1. Vertikalni Video (720x1280) */}
            <div className="relative overflow-hidden rounded-3xl border border-brand-sand shadow-sm bg-brand-clay/20 aspect-[9/16] w-full">
              <video
  src="/images/demonstracija.mp4"
  autoPlay={true}
  loop={true}
  muted={true}
  playsInline={true}
  controls={false}
  className="w-full h-full object-cover pointer-events-none"
/>
              <div className="absolute inset-0 bg-brand-espresso/5 pointer-events-none"></div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-brand-sand/40">
                <p className="text-xs uppercase tracking-widest font-bold text-brand-espresso">Holistički pristup</p>
                <p className="text-[11px] text-brand-espresso/70 mt-0.5">Rituali opuštanja i njege lica</p>
              </div>
            </div>

            {/* 2. Kartica: Tretman lica */}
            <div 
              onClick={() => toggleCard('tretmani')}
              className="group relative overflow-hidden rounded-3xl border border-brand-sand shadow-sm aspect-[9/16] w-full cursor-pointer bg-brand-espresso text-white select-none"
            >
              <img 
                src="/images/tretmanlica.jpg" 
                alt="Tretman lica u Meraky salonu" 
                className={`w-full h-full object-cover transition-all duration-500 ${
                  revealedCard === 'tretmani' ? 'scale-105 blur-sm' : 'md:group-hover:scale-105 md:group-hover:blur-sm'
                }`}
              />
              
              {/* Crni veo / Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-brand-espresso/90 via-brand-espresso/40 to-brand-espresso/20 transition-opacity duration-500 ${
                revealedCard === 'tretmani' ? 'opacity-95' : 'opacity-40 md:group-hover:opacity-95'
              }`}></div>
              
              {/* Sadržaj i tekst */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className={`text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-1 transition-all duration-500 ${
                  revealedCard === 'tretmani' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0'
                }`}>
                  Njega Kože
                </span>
                <h4 className="font-serif-elegant text-2xl font-light text-white mb-2">
                  Tretmani lica
                </h4>
                <p className={`text-xs text-brand-cream/90 transition-all duration-500 leading-relaxed ${
                  revealedCard === 'tretmani' ? 'opacity-100 translate-y-0 h-auto mt-1' : 'opacity-0 translate-y-4 h-0 overflow-hidden md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:h-auto md:group-hover:mt-1'
                }`}>
                  Dubinska analiza, hidratacija i napredni dermatološki protokoli prilagođeni vašem tipu kože uz vrhunsku premium kozmetiku.
                </p>
                
                {/* Indikator za klik na mobitelu kad je zatvoreno */}
                {revealedCard !== 'tretmani' && (
                  <span className="text-[10px] text-brand-cream/50 mt-2 block md:hidden">Dodirnite za detalje →</span>
                )}
              </div>
            </div>

            {/* 3. Kartica: Oblikovanje obrva */}
            <div 
              onClick={() => toggleCard('obrve')}
              className="group relative overflow-hidden rounded-3xl border border-brand-sand shadow-sm aspect-[9/16] w-full cursor-pointer bg-brand-espresso text-white select-none"
            >
              <img 
                src="/images/obrve.jpg" 
                alt="Oblikovanje obrva u Meraky salonu" 
                className={`w-full h-full object-cover transition-all duration-500 ${
                  revealedCard === 'obrve' ? 'scale-105 blur-sm' : 'md:group-hover:scale-105 md:group-hover:blur-sm'
                }`}
              />
              
              {/* Crni veo / Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-brand-espresso/90 via-brand-espresso/40 to-brand-espresso/20 transition-opacity duration-500 ${
                revealedCard === 'obrve' ? 'opacity-95' : 'opacity-40 md:group-hover:opacity-95'
              }`}></div>
              
              {/* Sadržaj i tekst */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className={`text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-1 transition-all duration-500 ${
                  revealedCard === 'obrve' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0'
                }`}>
                  Estetika
                </span>
                <h4 className="font-serif-elegant text-2xl font-light text-white mb-2">
                  Oblikovanje obrva
                </h4>
                <p className={`text-xs text-brand-cream/90 transition-all duration-500 leading-relaxed ${
                  revealedCard === 'obrve' ? 'opacity-100 translate-y-0 h-auto mt-1' : 'opacity-0 translate-y-4 h-0 overflow-hidden md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:h-auto md:group-hover:mt-1'
                }`}>
                  Precizna definicija luka i bojanje koje naglašava prirodnu ljepotu vaših očiju i sklad cijelog lica.
                </p>
                
                {/* Indikator za klik na mobitelu kad je zatvoreno */}
                {revealedCard !== 'obrve' && (
                  <span className="text-[10px] text-brand-cream/50 mt-2 block md:hidden">Dodirnite za detalje →</span>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      

      {/* BOOKING SUSTAV */}
      <div id="rezervacija" className="bg-brand-clay py-8 border-t border-brand-sand/60">
        <BookingSystem 
          servicesData={servicesData} 
          initialCategory={preselectedCategory}
          initialItem={preselectedItem}
        />
      </div>

      {/* FOOTER */}
      <footer id="kontakt" className="bg-brand-espresso text-brand-cream py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* LOGO U FOOTERU */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <div className="bg-brand-cream/10 p-2.5 rounded-xl inline-block backdrop-blur-sm border border-white/5 shadow-inner">
              <img 
                src="/images/logo_salona.png" 
                alt="Meraky Beauty & Care" 
                className="h-14 w-auto object-contain rounded-lg"
              />
            </div>
            <p className="text-xs sm:text-sm text-brand-cream/70 leading-relaxed max-w-sm pt-2">
              Salon posvećen tvojoj ljepoti, zdravlju kože i potpunom opuštanju uma od svakodnevnog ubrzanog tempa.
            </p>
          </div>
          
          {/* LOKACIJA, KONTAKT I RADNO VRIJEME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-brand-gold">Lokacija i Kontakt</h5>
              <div className="space-y-1.5 text-sm text-brand-cream/90 flex flex-col items-center sm:items-start md:items-start">
                <p>Krbavska ulica 15, 31000 Osijek</p>
                <a 
                  href="tel:+385992781199" 
                  className="hover:text-brand-gold transition-colors duration-200"
                >
                  Telefon: 099 278 1199
                </a>
                <a 
                  href="mailto:merakycare@gmail.com" 
                  className="hover:text-brand-gold transition-colors duration-200"
                >
                  E-mail: merakycare@gmail.com
                </a>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-brand-gold">Radno Vrijeme</h5>
              <div className="space-y-1.5 text-sm text-brand-cream/90">
                <p>Pon - Pet: 08:00 - 20:00</p>
                <p>Subota: 08:00 - 14:00</p>
                <p>Nedjelja: Zatvoreno</p>
              </div>
            </div>
          </div>

          {/* GOOGLE MAPS */}
          <div className="space-y-4 w-full">
            <h5 className="text-xs uppercase tracking-widest font-bold text-brand-gold text-center md:text-left">Gdje se nalazimo</h5>
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2794.0176577218!2d18.68137427661016!3d45.549970327711264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ce798a6bcb3b5%3A0x2a4d7dc3d34c83c6!2sMeraky%20Beauty%20and%20Care!5e0!3m2!1sen!2shr!4v1784542639157!5m2!1sen!2shr" 
                className="w-full h-60 grayscale-[30%] contrast-[110%] transition-all duration-500 group-hover:grayscale-0 block"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-white/10 text-center text-xs text-brand-cream/50">
          <p>© {new Date().getFullYear()} Meraky Beauty & Care. Sva prava pridržana.</p>
        </div>
      </footer>

    </div>
  );
}