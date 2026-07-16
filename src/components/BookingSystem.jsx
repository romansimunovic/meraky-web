import React, { useState, useEffect } from 'react';

export default function BookingSystem({ servicesData = [] }) {
  const [step, setStep] = useState(1); 
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientData, setClientData] = useState({ name: "", phone: "", email: "", note: "" });

  const allServices = servicesData.flatMap(cat => 
    cat.items.map(item => ({
      name: item.name,
      category: cat.category,
      price: item.price,
      duration: item.duration || "45 min"
    }))
  );

  const getNextWorkingDays = () => {
    const days = [];
    const options = { weekday: 'short', day: 'numeric', month: 'numeric' };
    let current = new Date();

    while (days.length < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0) { 
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

  const mockTimeSlots = {
    morning: ["08:30", "09:15", "10:00", "11:30"],
    afternoon: ["13:00", "14:15", "15:30", "17:00", "18:15", "19:00"]
  };

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
    setStep(4); 
  };

  const formatSelectedDate = (rawDate) => {
    if (!rawDate) return "";
    const dateObj = new Date(rawDate);
    return dateObj.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <section id="rezervacija" className="max-w-5xl mx-auto px-3 sm:px-6 py-8 sm:py-12 relative z-10 overflow-hidden">
      {/* Smanjen padding na mobitelu (p-3), zaobljenje prilagođeno ekranu (rounded-2xl) */}
      <div className="bg-[#F3ECE3]/60 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 md:p-12 border border-[#E8E2D7] grid lg:grid-cols-12 gap-6 lg:gap-12 items-start relative">
        <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-20"></div>

        {/* GLAVNI WIDGET */}
        <div className="lg:col-span-8 w-full relative z-10">
          <div className="bg-white rounded-2xl border border-[#E8E2D7] shadow-sm overflow-hidden transition-all duration-300">
            
            {/* KORACI - PROGRESS BAR (Responzivne veličine i manji razmaci) */}
            {step < 4 && (
              <div className="bg-[#FCFAF7] border-b border-[#E8E2D7] px-3 sm:px-6 py-4 flex justify-between items-center text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#2B231F]/40">
                <button 
                  onClick={() => setStep(1)} 
                  className={`flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${step >= 1 ? 'text-[#B89565]' : ''}`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] border ${step >= 1 ? 'border-[#B89565] bg-[#F3ECE3]' : 'border-neutral-200'}`}>1</span>
                  Usluga
                </button>
                <div className="h-px bg-[#E8E2D7] flex-1 mx-1.5 sm:mx-4"></div>
                <button 
                  onClick={() => selectedService && setStep(2)} 
                  disabled={!selectedService}
                  className={`flex items-center gap-1 sm:gap-1.5 transition-colors ${step >= 2 ? 'text-[#B89565]' : ''} disabled:opacity-50`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] border ${step >= 2 ? 'border-[#B89565] bg-[#F3ECE3]' : 'border-neutral-200'}`}>2</span>
                  Vrijeme
                </button>
                <div className="h-px bg-[#E8E2D7] flex-1 mx-1.5 sm:mx-4"></div>
                <button 
                  onClick={() => selectedTime && setStep(3)}
                  disabled={!selectedTime}
                  className={`flex items-center gap-1 sm:gap-1.5 transition-colors ${step >= 3 ? 'text-[#B89565]' : ''} disabled:opacity-50`}
                >
                  <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] border ${step >= 3 ? 'border-[#B89565] bg-[#F3ECE3]' : 'border-neutral-200'}`}>3</span>
                  Podaci
                </button>
              </div>
            )}

            {/* Unutarnji p-4 na mobitelu daje više prostora elementima */}
            <div className="p-4 sm:p-8">
              
              {/* KORAK 1: Odabir Usluge */}
              {step === 1 && (
                <div className="animate-fade-in space-y-4">
                  <div className="text-left mb-5">
                    <h4 className="font-serif-elegant text-xl sm:text-2xl font-medium text-[#2B231F]">Odaberi tretman</h4>
                    <p className="text-xs text-[#2B231F]/60 mt-1">Izaberi željenu uslugu iz našeg ritualnog cjenika</p>
                  </div>
                  
                  <div className="max-h-[360px] overflow-y-auto pr-1 space-y-3 scrollbar-none">
                    {allServices.map((svc, i) => (
                      <button
                        key={i}
                        onClick={() => handleServiceSelect(svc)}
                        className={`w-full p-3 sm:p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer group gap-3 ${
                          selectedService?.name === svc.name
                            ? 'border-[#B89565] bg-[#FCFAF7]'
                            : 'border-[#E8E2D7] bg-white hover:border-[#B89565]/60 hover:bg-[#FCFAF7]'
                        }`}
                      >
                        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-bold text-[#2B231F] group-hover:text-[#B89565] transition-colors truncate sm:whitespace-normal">{svc.name}</p>
                          <p className="text-[10px] sm:text-xs text-[#2B231F]/60 uppercase tracking-wider font-semibold truncate">{svc.category} • {svc.duration}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm sm:text-base font-bold font-mono text-[#B89565]">{svc.price} €</p>
                          <span className="text-[10px] text-[#B89565] font-bold uppercase tracking-wider mt-1 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">Odaberi →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KORAK 2: Odabir Datuma i Vremena */}
              {step === 2 && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex justify-between items-center border-b border-[#FAF7F2] pb-4 gap-4">
                    <div>
                      <h4 className="font-serif-elegant text-xl sm:text-2xl font-medium text-[#2B231F]">Odaberi termin</h4>
                      <p className="text-xs text-[#2B231F]/60 mt-1">Usluga: <span className="font-bold text-[#B89565]">{selectedService?.name}</span></p>
                    </div>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[11px] font-bold text-[#2B231F]/60 uppercase tracking-wider hover:text-[#2B231F] transition-colors flex-shrink-0"
                    >
                      ← Promijeni
                    </button>
                  </div>

                  {/* Kalendarski dani */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider mb-3 font-bold text-[#2B231F]/60">Dostupni datumi</label>
                    <div className="w-full overflow-x-auto pb-2 scrollbar-none touch-scroll">
                      <div className="flex gap-2 min-w-max px-1">
                        {availableDays.map((day, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedDate(day.rawDate)}
                            className={`flex flex-col items-center justify-center py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl border text-center transition-all cursor-pointer min-w-[68px] sm:min-w-[72px] ${
                              selectedDate === day.rawDate
                                ? 'border-[#B89565] bg-[#B89565] text-white shadow-sm'
                                : 'border-[#E8E2D7] bg-white text-[#2B231F] hover:border-[#B89565]/60'
                            }`}
                          >
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider opacity-85 font-semibold">{day.formatted.split(',')[0]}</span>
                            <span className="text-xs sm:text-sm font-bold font-mono mt-0.5 sm:mt-1">{day.formatted.split(',')[1]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vremenski slotovi (Promijenjeno na grid-cols-3 na mobitelu za uži, vertikalniji prikaz) */}
                  {selectedDate ? (
                    <div className="space-y-5 animate-fade-in">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2.5 font-bold text-[#2B231F]/60">Prijepodne</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {mockTimeSlots.morning.map((time, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl border font-mono transition-all cursor-pointer text-center ${
                                selectedTime === time
                                  ? 'border-[#2B231F] bg-[#2B231F] text-white'
                                  : 'border-[#E8E2D7] bg-[#FAF7F2]/60 text-[#2B231F]/90 hover:border-[#B89565]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2.5 font-bold text-[#2B231F]/60">Poslijepodne</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {mockTimeSlots.afternoon.map((time, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleTimeSelect(time)}
                              className={`py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl border font-mono transition-all cursor-pointer text-center ${
                                selectedTime === time
                                  ? 'border-[#2B231F] bg-[#2B231F] text-white'
                                  : 'border-[#E8E2D7] bg-[#FAF7F2]/60 text-[#2B231F]/90 hover:border-[#B89565]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-10 bg-[#FCFAF7] rounded-xl border border-dashed border-[#E8E2D7]">
                      <p className="text-xs sm:text-sm text-[#2B231F]/60 px-4">Molimo odaberite datum za prikaz slobodnih termina.</p>
                    </div>
                  )}
                </div>
              )}

              {/* KORAK 3: Kontakt forma */}
              {step === 3 && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex justify-between items-center border-b border-[#FAF7F2] pb-4 gap-4">
                    <div>
                      <h4 className="font-serif-elegant text-xl sm:text-2xl font-medium text-[#2B231F]">Kontakt podaci</h4>
                      <p className="text-xs text-[#2B231F]/70 mt-1">
                        Termin: <span className="font-bold text-[#B89565]">{formatSelectedDate(selectedDate)} u {selectedTime}h</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="text-[11px] font-bold text-[#2B231F]/60 uppercase tracking-wider hover:text-[#2B231F] transition-colors flex-shrink-0"
                    >
                      ← Natrag
                    </button>
                  </div>

                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Ime i Prezime</label>
                        <input 
                          type="text" required placeholder="Marija Horvat"
                          className="w-full text-base p-3 sm:p-3.5 rounded-xl border border-[#E8E2D7] bg-[#FCFAF7] focus:outline-none focus:ring-1 focus:ring-[#B89565] text-[#2B231F] transition-all"
                          value={clientData.name}
                          onChange={(e) => setClientData({...clientData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Broj mobitela</label>
                        <input 
                          type="tel" required placeholder="099 123 4567"
                          className="w-full text-base p-3 sm:p-3.5 rounded-xl border border-[#E8E2D7] bg-[#FCFAF7] focus:outline-none focus:ring-1 focus:ring-[#B89565] text-[#2B231F] transition-all"
                          value={clientData.phone}
                          onChange={(e) => setClientData({...clientData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">E-mail adresa (za potvrdu)</label>
                      <input 
                        type="email" required placeholder="marija@gmail.com"
                        className="w-full text-base p-3 sm:p-3.5 rounded-xl border border-[#E8E2D7] bg-[#FCFAF7] focus:outline-none focus:ring-1 focus:ring-[#B89565] text-[#2B231F] transition-all"
                        value={clientData.email}
                        onChange={(e) => setClientData({...clientData, email: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Napomena za salon (opcionalno)</label>
                      <textarea 
                        rows="2" placeholder="Posebne napomene..."
                        className="w-full text-base p-3 sm:p-3.5 rounded-xl border border-[#E8E2D7] bg-[#FCFAF7] focus:outline-none focus:ring-1 focus:ring-[#B89565] text-[#2B231F] transition-all"
                        value={clientData.note}
                        onChange={(e) => setClientData({...clientData, note: e.target.value})}
                      ></textarea>
                    </div>

                    <button type="submit" className="w-full mt-2 py-3.5 sm:py-4 bg-[#2B231F] hover:bg-[#B89565] text-white text-xs sm:text-sm font-bold rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-[0.98]">
                      Potvrdi i rezerviraj termin
                    </button>
                  </form>
                </div>
              )}

              {/* KORAK 4: Potvrda uspjeha */}
              {step === 4 && (
                <div className="animate-fade-in text-center py-4 space-y-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 sm:w-6 sm:h-6">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-serif-elegant text-2xl sm:text-3xl font-light text-[#2B231F]">Vidimo se uskoro!</h4>
                    <p className="text-xs sm:text-sm text-neutral-500 px-4">Termin je uspješno zabilježen u našem kalendaru.</p>
                  </div>

                  {/* Detalji potvrde (Prilagođeno da se slaže vertikalno na mobitelu) */}
                  <div className="max-w-md mx-auto bg-[#FCFAF7] border-2 border-[#E5DEC9] rounded-2xl p-4 sm:p-6 text-left space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#E5DEC9]/15 rounded-full -translate-y-6 translate-x-6"></div>
                    
                    <div className="border-b border-[#E5DEC9]/50 pb-3">
                      <p className="text-[9px] text-[#B89565] uppercase tracking-widest font-bold">Potvrda Termina</p>
                      <h5 className="font-serif-elegant text-base sm:text-lg text-[#2B231F] mt-0.5">{selectedService?.name}</h5>
                    </div>

                    {/* Prebačeno iz grid-cols-2 u grid-cols-1 na mobitelu */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#2B231F]">
                      <div className="space-y-0.5">
                        <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Datum i Vrijeme</p>
                        <p className="font-semibold">{formatSelectedDate(selectedDate)}</p>
                        <p className="font-mono text-xs sm:text-sm text-[#B89565] mt-0.5 font-bold">{selectedTime} h</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Klijent</p>
                        <p className="font-semibold">{clientData.name}</p>
                        <p className="text-xs text-[#2B231F]/70 mt-0.5">{clientData.phone}</p>
                      </div>
                    </div>

                    {/* Prebačeno u flex-col na mobitelu za čišći raspored bez gužvanja */}
                    <div className="border-t border-[#E5DEC9]/50 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                      <div className="text-left">
                        <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Lokacija salona</p>
                        <p className="text-xs sm:text-sm font-semibold text-[#2B231F]">Krbavska ulica 15, Osijek</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Cijena</p>
                        <p className="text-sm sm:text-lg font-bold font-mono text-[#B89565]">{selectedService?.price} €</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed px-4">
                    Detalji rezervacije poslani su na <strong className="font-semibold text-neutral-700">{clientData.email}</strong>. Ako trebate promjenu, nazovite nas najkasnije 24 sata ranije.
                  </p>

                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        setStep(1);
                        setSelectedService(null);
                        setSelectedDate("");
                        setSelectedTime("");
                        setClientData({ name: "", phone: "", email: "", note: "" });
                      }}
                      className="text-[10px] font-bold text-[#B89565] uppercase tracking-widest hover:text-[#2B231F] transition-colors py-2.5 px-5 sm:py-3 sm:px-6 rounded-full border-2 border-[#B89565]/40 hover:border-[#2B231F]"
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