import React, { useState, useEffect } from 'react';

export default function BookingSystem({ servicesData = [] }) {
  const [step, setStep] = useState(1); // 1: Usluga, 2: Termin, 3: Kontakt, 4: Uspjeh
  
  // State za odabrane podatke
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientData, setClientData] = useState({ name: "", phone: "", email: "", note: "" });

  // Izvlačimo sve pojedinačne usluge iz kategorija za brzi odabir
  const allServices = servicesData.flatMap(cat => 
    cat.items.map(item => ({
      name: item.name,
      category: cat.category,
      price: item.price,
      duration: "30-45 min" // Simulirano trajanje tretmana
    }))
  );

  // Dinamički generiramo sljedećih 5 radnih dana (preskačemo nedjelju)
  const getNextWorkingDays = () => {
    const days = [];
    const options = { weekday: 'short', day: 'numeric', month: 'numeric' };
    let current = new Date();

    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0) { // Ako nije nedjelja
        days.push({
          rawDate: current.toISOString().split('T')[0],
          formatted: current.toLocaleDateString('hr-HR', options),
          dayName: current.toLocaleDateString('hr-HR', { weekday: 'long' })
        });
      }
    }
    return days;
  };

  const availableDays = getNextWorkingDays();

  // Simulacija slobodnih termina ovisno o danu (u stvarnosti dolazi s backenda)
  const mockTimeSlots = {
    morning: ["08:30", "09:15", "10:00", "11:30"],
    afternoon: ["13:00", "14:15", "15:30", "17:00", "18:15", "19:00"]
  };

  // Automatski resetiraj vrijeme ako se promijeni datum
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    setStep(4); // Prikaz uspješne rezervacije
  };

  const formatSelectedDate = (rawDate) => {
    if (!rawDate) return "";
    const dateObj = new Date(rawDate);
    return dateObj.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section id="rezervacija" className="max-w-5xl mx-auto px-6 py-12 relative z-10">
      <div className="bg-[#F3ECE3]/60 rounded-3xl p-6 md:p-12 border border-[#E8E2D7] grid lg:grid-cols-12 gap-8 lg:gap-12 items-start relative overflow-hidden">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-20"></div>
        
        

        {/* DESNA STRANA: Produkcijski Booking Widget */}
        <div className="lg:col-span-8 w-full relative z-10">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] shadow-xs overflow-hidden transition-all duration-300">
            
            {/* PROGRESS BAR (Koraci) - sakriva se u uspješnom koraku */}
            {step < 4 && (
              <div className="bg-[#FAF7F2] border-b border-[#E8E2D7] px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-[#3E3530]/40">
                <button 
                  onClick={() => setStep(1)} 
                  className={`flex items-center gap-2 transition-colors cursor-pointer ${step >= 1 ? 'text-[#C5A880]' : ''}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border ${step >= 1 ? 'border-[#C5A880] bg-[#F3ECE3]' : 'border-neutral-200'}`}>1</span>
                  Usluga
                </button>
                <div className="h-px bg-[#E8E2D7] grow mx-4"></div>
                <button 
                  onClick={() => selectedService && setStep(2)} 
                  disabled={!selectedService}
                  className={`flex items-center gap-2 transition-colors ${step >= 2 ? 'text-[#C5A880]' : ''} disabled:opacity-50`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border ${step >= 2 ? 'border-[#C5A880] bg-[#F3ECE3]' : 'border-neutral-200'}`}>2</span>
                  Vrijeme
                </button>
                <div className="h-px bg-[#E8E2D7] grow mx-4"></div>
                <button 
                  onClick={() => selectedTime && setStep(3)}
                  disabled={!selectedTime}
                  className={`flex items-center gap-2 transition-colors ${step >= 3 ? 'text-[#C5A880]' : ''} disabled:opacity-50`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border ${step >= 3 ? 'border-[#C5A880] bg-[#F3ECE3]' : 'border-neutral-200'}`}>3</span>
                  Podaci
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8">
              
              {/* KORAK 1: Odabir Usluge */}
              {step === 1 && (
                <div className="animate-fade-in space-y-4">
                  <div className="text-center md:text-left mb-6">
                    <h4 className="font-serif-elegant text-xl font-medium text-[#3E3530]">Odaberi tretman</h4>
                    <p className="text-[10px] text-[#3E3530]/50 uppercase tracking-wider mt-1">Izaberi željenu uslugu za koju želiš rezervirati termin</p>
                  </div>
                  
                  <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2 scrollbar-none">
                    {allServices.map((svc, i) => (
                      <button
                        key={i}
                        onClick={() => handleServiceSelect(svc)}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer group ${
                          selectedService?.name === svc.name
                            ? 'border-[#C5A880] bg-[#FAF7F2]'
                            : 'border-[#E8E2D7] bg-white hover:border-[#C5A880]/50 hover:bg-[#FAF7F2]/30'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-[#3E3530] group-hover:text-[#C5A880] transition-colors">{svc.name}</p>
                          <p className="text-[10px] text-[#3E3530]/50 uppercase tracking-wider mt-1">{svc.category} • {svc.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold font-mono text-[#C5A880]">{svc.price} €</p>
                          <span className="text-[9px] text-[#C5A880] font-bold uppercase tracking-wider mt-0.5 block opacity-0 group-hover:opacity-100 transition-opacity">Odaberi →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KORAK 2: Slobodni datumi i vremena */}
              {step === 2 && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex justify-between items-center border-b border-[#FAF7F2] pb-4">
                    <div>
                      <h4 className="font-serif-elegant text-xl font-medium text-[#3E3530]">Odaberi termin</h4>
                      <p className="text-[10px] text-[#3E3530]/50 uppercase tracking-wider mt-1">Usluga: <span className="font-bold text-[#C5A880]">{selectedService?.name}</span></p>
                    </div>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[10px] font-bold text-[#3E3530]/40 uppercase tracking-wider hover:text-[#3E3530] transition-colors"
                    >
                      ← Promijeni
                    </button>
                  </div>

                  {/* Vodoravni odabir dana */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider mb-2 font-bold text-[#3E3530]/50">Dostupni datumi</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {availableDays.map((day, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedDate(day.rawDate)}
                          className={`flex flex-col items-center justify-center min-w-[75px] py-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                            selectedDate === day.rawDate
                              ? 'border-[#C5A880] bg-[#C5A880] text-white shadow-xs scale-102'
                              : 'border-[#E8E2D7] bg-white text-[#3E3530] hover:border-[#C5A880]/50'
                          }`}
                        >
                          <span className="text-[8px] uppercase tracking-wider opacity-70 font-semibold">{day.formatted.split(',')[0]}</span>
                          <span className="text-xs font-bold font-mono mt-0.5">{day.formatted.split(',')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prikaz slobodnih sati nakon odabira datuma */}
                  {selectedDate ? (
                    <div className="space-y-4 animate-fade-in">
                      {/* prijepodne */}
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider mb-2 font-bold text-[#3E3530]/50">Jutarnji termini</label>
                        <div className="grid grid-cols-4 gap-2">
                          {mockTimeSlots.morning.map((time, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`py-2 text-xs font-semibold rounded-lg border font-mono transition-all cursor-pointer text-center ${
                                selectedTime === time
                                  ? 'border-[#3E3530] bg-[#3E3530] text-white'
                                  : 'border-[#E8E2D7] bg-[#FAF7F2]/40 text-[#3E3530]/80 hover:border-[#C5A880]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* poslijepodne */}
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider mb-2 font-bold text-[#3E3530]/50">Poslijepodnevni termini</label>
                        <div className="grid grid-cols-4 gap-2">
                          {mockTimeSlots.afternoon.map((time, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`py-2 text-xs font-semibold rounded-lg border font-mono transition-all cursor-pointer text-center ${
                                selectedTime === time
                                  ? 'border-[#3E3530] bg-[#3E3530] text-white'
                                  : 'border-[#E8E2D7] bg-[#FAF7F2]/40 text-[#3E3530]/80 hover:border-[#C5A880]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-[#FAF7F2]/40 rounded-xl border border-dashed border-[#E8E2D7]">
                      <p className="text-xs text-[#3E3530]/50">Molimo odaberite datum kako biste vidjeli slobodna vremena.</p>
                    </div>
                  )}
                </div>
              )}

              {/* KORAK 3: Podaci za kontakt */}
              {step === 3 && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex justify-between items-center border-b border-[#FAF7F2] pb-4">
                    <div>
                      <h4 className="font-serif-elegant text-xl font-medium text-[#3E3530]">Kontakt podaci</h4>
                      <p className="text-[10px] text-[#3E3530]/50 uppercase tracking-wider mt-1">
                        Termin: <span className="font-bold text-[#C5A880]">{formatSelectedDate(selectedDate)} u {selectedTime}h</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="text-[10px] font-bold text-[#3E3530]/40 uppercase tracking-wider hover:text-[#3E3530] transition-colors"
                    >
                      ← Natrag
                    </button>
                  </div>

                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider mb-1.5 font-semibold text-[#3E3530]/50">Ime i Prezime</label>
                        <input 
                          type="text" required placeholder="Marija Horvat"
                          className="w-full text-xs p-3 rounded-lg border border-[#E8E2D7] bg-[#FAF7F2]/50 focus:outline-hidden focus:ring-1 focus:ring-[#C5A880] text-[#3E3530] transition-all"
                          value={clientData.name}
                          onChange={(e) => setClientData({...clientData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider mb-1.5 font-semibold text-[#3E3530]/50">Broj mobitela</label>
                        <input 
                          type="tel" required placeholder="099 123 4567"
                          className="w-full text-xs p-3 rounded-lg border border-[#E8E2D7] bg-[#FAF7F2]/50 focus:outline-hidden focus:ring-1 focus:ring-[#C5A880] text-[#3E3530] transition-all"
                          value={clientData.phone}
                          onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider mb-1.5 font-semibold text-[#3E3530]/50">E-mail adresa (za potvrdu)</label>
                      <input 
                        type="email" required placeholder="marija@gmail.com"
                        className="w-full text-xs p-3 rounded-lg border border-[#E8E2D7] bg-[#FAF7F2]/50 focus:outline-hidden focus:ring-1 focus:ring-[#C5A880] text-[#3E3530] transition-all"
                        value={clientData.email}
                        onChange={(e) => setClientData({...clientData, email: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-wider mb-1.5 font-semibold text-[#3E3530]/50">Napomena za salon (opcionalno)</label>
                      <textarea 
                        rows="2" placeholder="Imate li posebne napomene ili zahtjeve..."
                        className="w-full text-xs p-3 rounded-lg border border-[#E8E2D7] bg-[#FAF7F2]/50 focus:outline-hidden focus:ring-1 focus:ring-[#C5A880] text-[#3E3530] transition-all"
                        value={clientData.note}
                        onChange={(e) => setClientData({...clientData, note: e.target.value})}
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full mt-2 py-3.5 bg-[#3E3530] hover:bg-[#C5A880] text-white text-xs font-bold rounded-lg uppercase tracking-widest transition-all cursor-pointer shadow-xs active:scale-98">
                      Potvrdi i rezerviraj termin
                    </button>
                  </form>
                </div>
              )}

              {/* KORAK 4: Potvrda / Uspjeh (Prekrasna salonska kartica) */}
              {step === 4 && (
                <div className="animate-fade-in text-center py-6 space-y-6">
                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <div>
                    <h4 className="font-serif-elegant text-2xl font-light text-[#3E3530]">Vidimo se uskoro!</h4>
                    <p className="text-xs text-neutral-500 mt-2">Termin je uspješno zabilježen u našem rasporedu.</p>
                  </div>

                  {/* Sažetak rezervacije u obliku elegantne kartice */}
                  <div className="max-w-md mx-auto bg-[#FAF7F2] border border-[#E5DEC9] rounded-2xl p-5 text-left space-y-4 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5DEC9]/10 rounded-full -translate-y-6 translate-x-6"></div>
                    
                    <div className="border-b border-[#E5DEC9]/50 pb-3">
                      <p className="text-[9px] text-[#C5A880] uppercase tracking-widest font-bold">Potvrda Termina</p>
                      <h5 className="font-serif-elegant text-base text-[#3E3530] mt-0.5">{selectedService?.name}</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans text-[#3E3530]">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#3E3530]/50 font-bold mb-0.5">Datum i Vrijeme</p>
                        <p className="font-semibold">{formatSelectedDate(selectedDate)}</p>
                        <p className="font-mono text-xs text-[#C5A880] mt-0.5">{selectedTime} sati</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#3E3530]/50 font-bold mb-0.5">Klijent</p>
                        <p className="font-semibold">{clientData.name}</p>
                        <p className="text-[10px] text-[#3E3530]/60 mt-0.5">{clientData.phone}</p>
                      </div>
                    </div>

                    <div className="border-t border-[#E5DEC9]/50 pt-3 flex justify-between items-center">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#3E3530]/50 font-bold">Lokacija salona</p>
                        <p className="text-[10px] font-semibold text-[#3E3530]">Krbavska ulica 15, Osijek</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-wider text-[#3E3530]/50 font-bold">Cijena</p>
                        <p className="text-sm font-bold font-mono text-[#C5A880]">{selectedService?.price} €</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Potvrda s detaljima poslana je na adresu <strong className="font-semibold text-neutral-600">{clientData.email}</strong>. Ako trebate otkazati ili promijeniti termin, molimo kontaktirajte nas telefonski najkasnije 24h prije dolaska.
                  </p>

                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        setStep(1);
                        setSelectedService(null);
                        setSelectedDate("");
                        setSelectedTime("");
                        setClientData({ name: "", phone: "", email: "", note: "" });
                      }}
                      className="text-[9px] font-bold text-[#C5A880] uppercase tracking-widest hover:text-[#3E3530] transition-colors py-2 px-5 rounded-full border border-[#C5A880]/30 hover:border-[#3E3530]"
                    >
                      Rezerviraj novi termin
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}