import React, { useState, useEffect } from 'react';

export default function BookingSystem({ servicesData = [], initialCategory, initialItem }) {
  const [step, setStep] = useState(1); 
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Mapiranje svih usluga u ravan niz kako bismo ih lakše pretraživali
  const allServices = servicesData.flatMap(cat => 
    cat.items.map(item => ({
      name: item.name,
      category: cat.category,
      price: item.price,
      duration: item.duration || "45 min"
    }))
  );

  // 2. Sinkronizacija stanja kada klijent klikne "Rezerviraj →" na vrhu stranice
  useEffect(() => {
    if (initialCategory && initialItem) {
      // Pronalazimo točan servis koji se podudara s imenom i kategorijom
      const foundService = allServices.find(
        s => s.name === initialItem && s.category === initialCategory
      );

      if (foundService) {
        setSelectedService(foundService);
        setStep(2); // Odmah preskačemo korak 1 i šaljemo klijenta na kalendar (korak 2)
      }
    }
  }, [initialCategory, initialItem, servicesData]); // Dodan servicesData kao dependency radi sigurnosti učitavanja

  // Podaci o klijentu i validacija
  const [clientData, setClientData] = useState({ name: "", phone: "", email: "", note: "" });
  const [touched, setTouched] = useState({ name: false, phone: false, email: false, note: false });

  // Regex pravila
  const nameRegex = /^[A-Za-zČĆŽŠĐčćžšđ\s'-]{2,50}$/;
  const phoneRegex = /^(\+385|0)\d{8,9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Evaluacija valjanosti polja
  const isNameValid = nameRegex.test(clientData.name);
  const isPhoneValid = phoneRegex.test(clientData.phone.replace(/\s+/g, ''));
  const isEmailValid = emailRegex.test(clientData.email);
  const isNoteValid = clientData.note.length <= 300;

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isNoteValid;

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
    if (!isFormValid) return;

    setIsSubmitting(true);
    // Simulacija slanja na backend (1.5 sekundu za premium spinner efekt)
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const formatSelectedDate = (rawDate) => {
    if (!rawDate) return "";
    const dateObj = new Date(rawDate);
    return dateObj.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Generiranje kalendarskih poveznica za Google, Outlook i Apple/iCal (.ics)
  const getCalendarUrls = () => {
    if (!selectedDate || !selectedTime || !selectedService) return {};
    
    const [year, month, day] = selectedDate.split("-");
    const [hours, minutes] = selectedTime.split(":");
    
    const startDate = new Date(year, month - 1, day, hours, minutes);
    let durationMin = 45;
    const durationMatch = selectedService.duration.match(/\d+/);
    if (durationMatch) {
      durationMin = parseInt(durationMatch[0], 10);
    }
    const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000);

    const formatToIsoNoSymbols = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startIso = formatToIsoNoSymbols(startDate);
    const endIso = formatToIsoNoSymbols(endDate);

    const title = encodeURIComponent(`Ritual: ${selectedService.name}`);
    const details = encodeURIComponent(`Vaš termin u salonu je potvrđen.\nUsluga: ${selectedService.name}\nTrajanje: ${selectedService.duration}\nCijena: ${selectedService.price} €\nKlijent: ${clientData.name}`);
    const location = encodeURIComponent("Krbavska ulica 15, Osijek");

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`;
    
    // iCal (.ics) dinamička datoteka
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${selectedService.name}`,
      `DTSTART:${startIso.replace("Z", "")}`,
      `DTEND:${endIso.replace("Z", "")}`,
      `DESCRIPTION:${clientData.name} - ${selectedService.name}`,
      "LOCATION:Krbavska ulica 15\\, Osijek",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");
    const icalUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

    return { googleUrl, outlookUrl, icalUrl };
  };

  const { googleUrl, outlookUrl, icalUrl } = getCalendarUrls();

  return (
    <section id="rezervacija" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
      {/* Stilovi za glatku tranziciju koraka bez ovisnosti o konfiguraciji Tailwind-a */}
      <style>{`
        @keyframes bookingFadeIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-booking-step {
          animation: bookingFadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl bg-[#F3ECE3]/60 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-[#E8E2D7] relative overflow-hidden">
          <div className="absolute inset-0 organic-leaf-shadow pointer-events-none opacity-20"></div>

          {/* GLAVNI WIDGET CARD */}
          <div className="w-full bg-white rounded-2xl border border-[#E8E2D7] shadow-sm overflow-hidden relative">
            
            {/* KORACI - PROGRESS BAR */}
            {step < 4 && (
              <div className="bg-[#FCFAF7] border-b border-[#E8E2D7] px-4 sm:px-6 py-4 flex justify-between items-center text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#2B231F]/40">
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

            {/* SADRŽAJ KORAKA S ANIMACIJOM */}
            <div className="p-4 sm:p-8 min-h-[380px] flex flex-col justify-between relative">
              
              {/* SPINNER PREKO CIJELOG SADRŽAJA DOK SE REZERVIRA */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#B89565] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-[#2B231F] uppercase tracking-wider">Rezerviram vaš termin...</p>
                </div>
              )}

              {/* KORAK 1: Odabir Usluge */}
              {step === 1 && (
                <div className="animate-booking-step space-y-4 flex-1">
                  <div className="text-left mb-5">
                    <h4 className="font-serif-elegant text-xl sm:text-2xl font-medium text-[#2B231F]">Rezerviraj svoj termin</h4>
                    <p className="text-base text-[#2B231F]/60 mt-1">Izaberi uslugu</p>
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
                <div className="animate-booking-step space-y-6 flex-1">
                  <div className="flex justify-between items-center border-b border-[#FAF7F2] pb-4 gap-4">
                    <div>
                      <h4 className="font-serif-elegant text-xl sm:text-2xl font-medium text-[#2B231F]">Odaberi termin</h4>
                      <p className="text-xs text-[#2B231F]/60 mt-1">Usluga: <span className="font-bold text-[#B89565]">{selectedService?.name}</span></p>
                    </div>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-[11px] font-bold text-[#2B231F]/60 uppercase tracking-wider hover:text-[#2B231F] transition-colors flex-shrink-0"
                    >
                      ← Promijeni tretman
                    </button>
                  </div>

                  {/* Kalendarski dani - bez horizontalnog scrollera */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider mb-3 font-bold text-[#2B231F]/60">Dostupni datumi</label>
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 w-full">
                      {availableDays.map((day, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedDate(day.rawDate)}
                          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedDate === day.rawDate
                              ? 'border-[#B89565] bg-[#B89565] text-white shadow-sm'
                              : 'border-[#E8E2D7] bg-white text-[#2B231F] hover:border-[#B89565]/60'
                          }`}
                        >
                          <span className="text-[9px] uppercase tracking-wider opacity-85 font-semibold">{day.formatted.split(',')[0]}</span>
                          <span className="text-xs sm:text-sm font-bold font-mono mt-0.5">{day.formatted.split(',')[1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vremenski slotovi - Responzivni raspored bez bježanja */}
                  {selectedDate ? (
                    <div className="space-y-4 animate-booking-step">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Prijepodne</label>
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
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
                        <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Poslijepodne</label>
                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
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
                    <div className="text-center py-8 bg-[#FCFAF7] rounded-xl border border-dashed border-[#E8E2D7]">
                      <p className="text-xs sm:text-sm text-[#2B231F]/60 px-4">Molimo odaberite datum za prikaz slobodnih termina.</p>
                    </div>
                  )}
                </div>
              )}

              {/* KORAK 3: Kontakt forma sa strogom Live Validacijom */}
              {step === 3 && (
                <div className="animate-booking-step space-y-6 flex-1">
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
                      {/* Ime i prezime */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Ime i Prezime</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Marija Horvat"
                          className={`w-full text-base p-3 rounded-xl border bg-[#FCFAF7] focus:outline-none text-[#2B231F] transition-all ${
                            touched.name 
                              ? isNameValid 
                                ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                                : 'border-red-500 focus:ring-1 focus:ring-red-500' 
                              : 'border-[#E8E2D7] focus:ring-1 focus:ring-[#B89565]'
                          }`}
                          value={clientData.name}
                          onBlur={() => setTouched({ ...touched, name: true })}
                          onChange={(e) => {
                            setClientData({...clientData, name: e.target.value});
                            if (!touched.name) setTouched({ ...touched, name: true });
                          }}
                        />
                        {touched.name && (
                          <p className={`text-[11px] mt-1 font-semibold ${isNameValid ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isNameValid ? '✓ Ime izgleda dobro' : '❌ Unesite valjano ime (samo slova, 2-50 znakova)'}
                          </p>
                        )}
                      </div>

                      {/* Broj mobitela */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">Broj mobitela</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="0991234567"
                          className={`w-full text-base p-3 rounded-xl border bg-[#FCFAF7] focus:outline-none text-[#2B231F] transition-all ${
                            touched.phone 
                              ? isPhoneValid 
                                ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                                : 'border-red-500 focus:ring-1 focus:ring-red-500' 
                              : 'border-[#E8E2D7] focus:ring-1 focus:ring-[#B89565]'
                          }`}
                          value={clientData.phone}
                          onBlur={() => setTouched({ ...touched, phone: true })}
                          onChange={(e) => {
                            setClientData({...clientData, phone: e.target.value});
                            if (!touched.phone) setTouched({ ...touched, phone: true });
                          }}
                        />
                        {touched.phone && (
                          <p className={`text-[11px] mt-1 font-semibold ${isPhoneValid ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isPhoneValid ? '✓ Broj mobitela je valjan' : '❌ Koristite format 09xxxxxxx ili +385xxxxxxx'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* E-mail */}
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">E-mail adresa (za potvrdu)</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="marija@gmail.com"
                        className={`w-full text-base p-3 rounded-xl border bg-[#FCFAF7] focus:outline-none text-[#2B231F] transition-all ${
                          touched.email 
                            ? isEmailValid 
                              ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500' 
                              : 'border-red-500 focus:ring-1 focus:ring-red-500' 
                            : 'border-[#E8E2D7] focus:ring-1 focus:ring-[#B89565]'
                        }`}
                        value={clientData.email}
                        onBlur={() => setTouched({ ...touched, email: true })}
                        onChange={(e) => {
                          setClientData({...clientData, email: e.target.value});
                          if (!touched.email) setTouched({ ...touched, email: true });
                        }}
                      />
                      {touched.email && (
                        <p className={`text-[11px] mt-1 font-semibold ${isEmailValid ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isEmailValid ? '✓ E-mail je ispravan' : '❌ Unesite ispravnu e-mail adresu'}
                        </p>
                      )}
                    </div>

                    {/* Napomena s brojačem znakova */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-[#2B231F]/60">Napomena za salon (opcionalno)</label>
                        <span className={`text-[11px] font-mono ${isNoteValid ? 'text-[#2B231F]/50' : 'text-red-500 font-bold'}`}>
                          {clientData.note.length} / 300
                        </span>
                      </div>
                      <textarea 
                        rows="2" 
                        placeholder="Imate li kakve napomene, alergije ili specifične želje?"
                        className={`w-full text-base p-3 rounded-xl border bg-[#FCFAF7] focus:outline-none text-[#2B231F] transition-all ${
                          isNoteValid ? 'border-[#E8E2D7] focus:ring-1 focus:ring-[#B89565]' : 'border-red-500 focus:ring-1 focus:ring-red-500'
                        }`}
                        value={clientData.note}
                        onChange={(e) => setClientData({...clientData, note: e.target.value})}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={!isFormValid}
                      className={`w-full mt-2 py-4 text-xs sm:text-sm font-bold rounded-xl uppercase tracking-widest transition-all shadow-md active:scale-[0.98] ${
                        isFormValid 
                          ? 'bg-[#2B231F] hover:bg-[#B89565] text-white cursor-pointer' 
                          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      Potvrdi i rezerviraj termin
                    </button>
                  </form>
                </div>
              )}

              {/* KORAK 4: Potvrda uspjeha */}
              {step === 4 && (
                <div className="animate-booking-step text-center py-2 space-y-6 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 sm:w-6 sm:h-6">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-serif-elegant text-2xl sm:text-3xl font-light text-[#2B231F]">Rezervacija zaprimljena!</h4>
                    <p className="text-xs sm:text-sm text-neutral-500 px-4">Vidimo se uskoro! Vaš termin je službeno zapisan.</p>
                  </div>

                  {/* Komercijalna kartica s detaljima */}
                  <div className="max-w-md mx-auto bg-[#FCFAF7] border-2 border-[#E5DEC9] rounded-2xl p-5 text-left space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#E5DEC9]/15 rounded-full -translate-y-6 translate-x-6"></div>
                    
                    <div className="border-b border-[#E5DEC9]/50 pb-3">
                      <p className="text-[9px] text-[#B89565] uppercase tracking-widest font-bold">Potvrda Termina</p>
                      <h5 className="font-serif-elegant text-base sm:text-lg text-[#2B231F] mt-0.5">{selectedService?.name}</h5>
                    </div>

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
                        <p className="text-xs text-[#2B231F]/70 truncate">{clientData.email}</p>
                      </div>
                    </div>

                    <div className="border-t border-[#E5DEC9]/50 pt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                      <div className="text-left">
                        <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Lokacija salona</p>
                        <p className="text-xs sm:text-sm font-semibold text-[#2B231F]">Krbavska ulica 15, Osijek</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Cijena tretmana</p>
                        <p className="text-sm sm:text-lg font-bold font-mono text-[#B89565]">{selectedService?.price} €</p>
                      </div>
                    </div>
                  </div>

                  {/* Važno upozorenje oko e-mail potvrde */}
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 max-w-md mx-auto text-center text-xs text-amber-800">
                    <p className="leading-relaxed">
                      Na e-mail <strong>{clientData.email}</strong> smo poslali potvrdu rezervacije. 
                      <span className="block mt-1 font-semibold">Ako ne vidite poruku, provjerite Spam ili Promocije.</span>
                    </p>
                  </div>

                  {/* Kalendar Integracije */}
                  <div className="max-w-md mx-auto pt-2 space-y-2">
                    <p className="text-[9px] uppercase tracking-widest text-[#2B231F]/60 font-bold">Spremi termin u kalendar</p>
                    <div className="grid grid-cols-3 gap-2">
                      <a 
                        href={googleUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E8E2D7] bg-white hover:border-[#B89565] transition-all text-[10px] font-bold text-[#2B231F] gap-1"
                      >
                        <span>Google</span>
                      </a>
                      <a 
                        href={icalUrl} 
                        download="tretman-rezervacija.ics"
                        className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E8E2D7] bg-white hover:border-[#B89565] transition-all text-[10px] font-bold text-[#2B231F] gap-1"
                      >
                        <span>Apple iCal</span>
                      </a>
                      <a 
                        href={outlookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E8E2D7] bg-white hover:border-[#B89565] transition-all text-[10px] font-bold text-[#2B231F] gap-1"
                      >
                        <span>Outlook</span>
                      </a>
                    </div>
                  </div>

                  {/* Gumb za ponovni početak */}
                  <div className="pt-4">
                    <button 
                      onClick={() => {
                        setStep(1);
                        setSelectedService(null);
                        setSelectedDate("");
                        setSelectedTime("");
                        setClientData({ name: "", phone: "", email: "", note: "" });
                        setTouched({ name: false, phone: false, email: false });
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