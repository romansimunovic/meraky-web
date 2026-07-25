import React, { useEffect, useMemo, useState } from "react";

const MAX_NOTE_LENGTH = 300;
const SALON_LOCATION = "Krbavska ulica 15, Osijek";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const nameRegex = /^[A-Za-zČĆŽŠĐčćžšđ\s'-]{2,50}$/;
const phoneRegex = /^(\+385|0)\d{8,9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mockTimeSlots = {
  morning: ["08:30", "09:15", "10:00", "11:30"],
  afternoon: ["13:00", "14:15", "15:30", "17:00", "18:15", "19:00"],
};

function getNextWorkingDays(count = 5) {
  const days = [];
  const options = { weekday: "short", day: "numeric", month: "numeric" };
  const dayOptions = { weekday: "long" };
  const current = new Date();

  while (days.length < count) {
    current.setDate(current.getDate() + 1);
    if (current.getDay() !== 0) {
      days.push({
        rawDate: current.toISOString().split("T")[0],
        formatted: current.toLocaleDateString("hr-HR", options),
        dayName: current.toLocaleDateString("hr-HR", dayOptions),
      });
    }
  }

  return days;
}

function formatSelectedDate(rawDate) {
  if (!rawDate) return "";
  return new Date(rawDate).toLocaleDateString("hr-HR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getServiceDuration(duration = "45 min") {
  const match = duration.match(/\d+/);
  return match ? parseInt(match[0], 10) : 45;
}

function getCalendarUrls(selectedDate, selectedTime, selectedService, clientName) {
  if (!selectedDate || !selectedTime || !selectedService) return {};

  const [year, month, day] = selectedDate.split("-");
  const [hours, minutes] = selectedTime.split(":");

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const durationMin = getServiceDuration(selectedService.duration);
  const endDate = new Date(startDate.getTime() + durationMin * 60 * 1000);

  const formatToIsoNoSymbols = (date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const startIso = formatToIsoNoSymbols(startDate);
  const endIso = formatToIsoNoSymbols(endDate);

  const title = encodeURIComponent(`Ritual: ${selectedService.name}`);
  const details = encodeURIComponent(
    `Vaš termin u salonu je potvrđen.\nUsluga: ${selectedService.name}\nTrajanje: ${selectedService.duration}\nCijena: ${selectedService.price} €\nKlijent: ${clientName}`
  );
  const location = encodeURIComponent(SALON_LOCATION);

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${selectedService.name}`,
    `DTSTART:${startIso.replace("Z", "")}`,
    `DTEND:${endIso.replace("Z", "")}`,
    `DESCRIPTION:${clientName} - ${selectedService.name}`,
    `LOCATION:${SALON_LOCATION.replace(",", "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const icalUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return { googleUrl, outlookUrl, icalUrl };
}

function ServiceCard({ service, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(service)}
      className={`w-full rounded-2xl border px-3 py-3 sm:px-4 sm:py-3.5 text-left transition-all group snap-start ${
        selected
          ? "border-[#B89565] bg-[#FCFAF7] shadow-sm"
          : "border-[#E8E2D7] bg-white hover:border-[#B89565]/60 hover:bg-[#FCFAF7]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] sm:text-base font-semibold text-[#2B231F] leading-tight truncate group-hover:text-[#B89565]">
            {service.name}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-sm sm:text-base font-bold font-mono text-[#B89565]">
            {service.price} €
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#2B231F]/45 font-medium mt-0.5">
            {service.duration}
          </p>
        </div>
      </div>
    </button>
  );
}

function DateChip({ day, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(day.rawDate)}
      className={`flex flex-col items-center justify-center rounded-xl border px-2 py-2.5 transition-all ${
        selected
          ? "border-[#B89565] bg-[#B89565] text-white shadow-sm"
          : "border-[#E8E2D7] bg-white text-[#2B231F] hover:border-[#B89565]/60"
      }`}
    >
      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-85">
        {day.formatted.split(",")[0]}
      </span>
      <span className="mt-0.5 text-xs sm:text-sm font-bold font-mono">
        {day.formatted.split(",")[1]}
      </span>
    </button>
  );
}

function TimeChip({ time, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(time)}
      className={`rounded-xl border px-3 py-2 text-xs sm:text-sm font-bold font-mono transition-all ${
        selected
          ? "border-[#2B231F] bg-[#2B231F] text-white"
          : "border-[#E8E2D7] bg-[#FAF7F2]/60 text-[#2B231F]/90 hover:border-[#B89565]"
      }`}
    >
      {time}
    </button>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  touched,
  valid,
  successText,
  errorText,
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">
        {label}
      </label>
      <input
        type={type}
        required={type !== "email"}
        placeholder={placeholder}
        className={`w-full text-base p-3 rounded-xl border bg-[#FCFAF7] focus:outline-none text-[#2B231F] transition-all ${
          touched
            ? valid
              ? "border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              : "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-[#E8E2D7] focus:ring-1 focus:ring-[#B89565]"
        }`}
        value={value}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
      />
      {touched && (
        <p className={`text-[11px] mt-1 font-semibold ${valid ? "text-emerald-600" : "text-red-500"}`}>
          {valid ? `✓ ${successText}` : `❌ ${errorText}`}
        </p>
      )}
    </div>
  );
}

export default function BookingSystem({ servicesData = [], initialCategory, initialItem }) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientData, setClientData] = useState({ name: "", phone: "", email: "", note: "" });
  const [touched, setTouched] = useState({ name: false, phone: false, email: false, note: false });

  const allServices = useMemo(
    () =>
      servicesData.flatMap((cat) =>
        (cat.items || []).map((item) => ({
          id: item.id,
          name: item.name,
          category: cat.category,
          price: item.price,
          duration: item.duration || "45 min",
        }))
      ),
    [servicesData]
  );

  const groupedServices = useMemo(
    () =>
      servicesData
        .map((cat) => ({
          category: cat.category,
          items: (cat.items || []).map((item) => ({
            id: item.id,
            name: item.name,
            category: cat.category,
            price: item.price,
            duration: item.duration || "45 min",
          })),
        }))
        .filter((cat) => cat.items.length > 0),
    [servicesData]
  );

  const availableDays = useMemo(() => getNextWorkingDays(), []);

  useEffect(() => {
    if (initialCategory && initialItem && allServices.length) {
      const foundService = allServices.find(
        (s) => s.name === initialItem && s.category === initialCategory
      );
      if (foundService) {
        setSelectedService(foundService);
        setStep(2);
      }
    }
  }, [initialCategory, initialItem, allServices]);

  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const isNameValid = nameRegex.test(clientData.name.trim());
  const isPhoneValid = phoneRegex.test(clientData.phone.replace(/\s+/g, ""));
  const isEmailValid = clientData.email.trim() === "" || emailRegex.test(clientData.email.trim());
  const isNoteValid = clientData.note.length <= MAX_NOTE_LENGTH;
  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isNoteValid && !!selectedService && !!selectedDate && !!selectedTime;

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isFormValid || !selectedService?.id) return;

    setIsSubmitting(true);

    try {
      const localDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const dateTimeIso = localDateTime.toISOString();

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedService.id,
          dateTime: dateTimeIso,
          fullName: clientData.name.trim(),
          phone: clientData.phone.trim(),
          email: clientData.email.trim() || null,
          notes: clientData.note.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Došlo je do greške pri spremanju rezervacije.');
      }

      setStep(4);
    } catch (error) {
      console.error('Greška pri slanju rezervacije:', error);
      alert(error.message || 'Nije moguće poslati rezervaciju. Provjerite radi li backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { googleUrl, outlookUrl, icalUrl } = getCalendarUrls(
    selectedDate,
    selectedTime,
    selectedService,
    clientData.name
  );

  const resetBooking = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedDate("");
    setSelectedTime("");
    setClientData({ name: "", phone: "", email: "", note: "" });
    setTouched({ name: false, phone: false, email: false, note: false });
  };

  return (
    <section id="rezervacija" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
      <style>{`
        @keyframes bookingFadeIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.99); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-booking-step {
          animation: bookingFadeIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="w-full rounded-[2rem] bg-[#F3ECE3]/60 border border-[#E8E2D7] p-3 sm:p-6 md:p-8">
        <div className="w-full rounded-[2rem] bg-white border border-[#E8E2D7] shadow-sm overflow-hidden flex flex-col h-[min(86dvh,860px)]">
          {step < 4 && (
            <div className="sticky top-0 z-20 bg-[#FCFAF7]/95 backdrop-blur border-b border-[#E8E2D7] px-4 sm:px-6 py-4 shrink-0">
              <div className="flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#2B231F]/45 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]">
                <button onClick={() => setStep(1)} className={`flex items-center gap-1.5 ${step >= 1 ? "text-[#B89565]" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? "border-[#B89565] bg-[#F3ECE3]" : "border-neutral-200"}`}>1</span>
                  Usluga
                </button>
                <div className="h-px bg-[#E8E2D7] flex-1 min-w-6" />
                <button onClick={() => selectedService && setStep(2)} disabled={!selectedService} className={`flex items-center gap-1.5 disabled:opacity-40 ${step >= 2 ? "text-[#B89565]" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? "border-[#B89565] bg-[#F3ECE3]" : "border-neutral-200"}`}>2</span>
                  Vrijeme
                </button>
                <div className="h-px bg-[#E8E2D7] flex-1 min-w-6" />
                <button onClick={() => selectedTime && setStep(3)} disabled={!selectedTime} className={`flex items-center gap-1.5 disabled:opacity-40 ${step >= 3 ? "text-[#B89565]" : ""}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? "border-[#B89565] bg-[#F3ECE3]" : "border-neutral-200"}`}>3</span>
                  Podaci
                </button>
              </div>
            </div>
          )}

          <div className="relative flex-1 min-h-0 overflow-hidden p-4 sm:p-8 flex flex-col">
            {isSubmitting && (
              <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-[#B89565] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-[#2B231F] uppercase tracking-wider">
                  Rezerviram vaš termin...
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="animate-booking-step h-full min-h-0 flex flex-col gap-5">
                <div className="flex flex-col gap-2 shrink-0">
                  <h4 className="font-serif-elegant text-2xl sm:text-3xl font-medium text-[#2B231F]">
                    Rezerviraj svoj termin
                  </h4>
                  <p className="text-sm sm:text-base text-[#2B231F]/60">
                    Odaberi uslugu iz organiziranih kategorija.
                  </p>
                </div>

                <div
                  className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 sm:space-y-5 scroll-smooth overscroll-contain touch-pan-y [scrollbar-width:thin] [scrollbar-color:#B89565_#F3ECE3]"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {groupedServices.map((group) => (
                    <section key={group.category} className="space-y-2 sm:space-y-3">
                      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur py-1">
                        <h5 className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2B231F]/50">
                          {group.category}
                        </h5>
                      </div>

                      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                        {group.items.map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            selected={
                              selectedService?.id === service.id
                            }
                            onClick={handleServiceSelect}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-booking-step h-full min-h-0 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4 border-b border-[#FAF7F2] pb-4 shrink-0">
                  <div>
                    <h4 className="font-serif-elegant text-2xl sm:text-3xl font-medium text-[#2B231F]">
                      Odaberi termin
                    </h4>
                    <p className="text-xs sm:text-sm text-[#2B231F]/60 mt-1">
                      Usluga: <span className="font-bold text-[#B89565]">{selectedService?.name}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[11px] font-bold text-[#2B231F]/60 uppercase tracking-wider hover:text-[#2B231F]"
                  >
                    ← Promijeni
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] flex-1 min-h-0">
                  <div className="space-y-5 min-h-0 overflow-y-auto pr-1 overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: "touch" }}>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider mb-3 font-bold text-[#2B231F]/60">
                        Dostupni datumi
                      </label>
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2">
                        {availableDays.map((day) => (
                          <DateChip
                            key={day.rawDate}
                            day={day}
                            selected={selectedDate === day.rawDate}
                            onClick={setSelectedDate}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-[#E8E2D7] bg-[#FCFAF7] p-4">
                      {selectedDate ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">
                              Prijepodne
                            </p>
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                              {mockTimeSlots.morning.map((time) => (
                                <TimeChip
                                  key={time}
                                  time={time}
                                  selected={selectedTime === time}
                                  onClick={handleTimeSelect}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider mb-2 font-bold text-[#2B231F]/60">
                              Poslijepodne
                            </p>
                            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                              {mockTimeSlots.afternoon.map((time) => (
                                <TimeChip
                                  key={time}
                                  time={time}
                                  selected={selectedTime === time}
                                  onClick={handleTimeSelect}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-center text-[#2B231F]/60 py-6">
                          Odaberi datum za prikaz slobodnih termina.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-booking-step h-full min-h-0 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4 border-b border-[#FAF7F2] pb-4 shrink-0">
                  <div>
                    <h4 className="font-serif-elegant text-2xl sm:text-3xl font-medium text-[#2B231F]">
                      Kontakt podaci
                    </h4>
                    <p className="text-xs sm:text-sm text-[#2B231F]/70 mt-1">
                      Termin: <span className="font-bold text-[#B89565]">{formatSelectedDate(selectedDate)} u {selectedTime}h</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="text-[11px] font-bold text-[#2B231F]/60 uppercase tracking-wider hover:text-[#2B231F]"
                  >
                    ← Natrag
                  </button>
                </div>

                <form
                  className="flex-1 min-h-0 overflow-y-auto pr-1 overscroll-contain space-y-4 touch-pan-y"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  onSubmit={handleSubmitBooking}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Ime i prezime"
                      type="text"
                      placeholder="Marija Horvat"
                      value={clientData.name}
                      onChange={(v) => setClientData((s) => ({ ...s, name: v }))}
                      onBlur={() => setTouched((s) => ({ ...s, name: true }))}
                      touched={touched.name}
                      valid={isNameValid}
                      successText="Ime izgleda dobro"
                      errorText="Unesite valjano ime"
                    />
                    <Field
                      label="Broj mobitela"
                      type="tel"
                      placeholder="0991234567"
                      value={clientData.phone}
                      onChange={(v) => setClientData((s) => ({ ...s, phone: v }))}
                      onBlur={() => setTouched((s) => ({ ...s, phone: true }))}
                      touched={touched.phone}
                      valid={isPhoneValid}
                      successText="Broj mobitela je valjan"
                      errorText="Koristite format 09xxxxxxx ili +385xxxxxxx"
                    />
                  </div>

                  <Field
                    label="E-mail adresa (opcionalno)"
                    type="email"
                    placeholder="marija@gmail.com"
                    value={clientData.email}
                    onChange={(v) => setClientData((s) => ({ ...s, email: v }))}
                    onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                    touched={touched.email}
                    valid={isEmailValid}
                    successText="E-mail je ispravan"
                    errorText="Unesite ispravnu e-mail adresu"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#2B231F]/60">
                        Napomena za salon (opcionalno)
                      </label>
                      <span className={`text-[11px] font-mono ${isNoteValid ? "text-[#2B231F]/50" : "text-red-500 font-bold"}`}>
                        {clientData.note.length} / {MAX_NOTE_LENGTH}
                      </span>
                    </div>
                    <textarea
                      rows="3"
                      placeholder="Imate li kakve napomene, alergije ili specifične želje?"
                      className={`w-full text-base p-3 rounded-xl border bg-[#FCFAF7] focus:outline-none text-[#2B231F] transition-all ${
                        isNoteValid
                          ? "border-[#E8E2D7] focus:ring-1 focus:ring-[#B89565]"
                          : "border-red-500 focus:ring-1 focus:ring-red-500"
                      }`}
                      value={clientData.note}
                      onChange={(e) => setClientData((s) => ({ ...s, note: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full mt-2 py-4 text-xs sm:text-sm font-bold rounded-xl uppercase tracking-widest transition-all shadow-md active:scale-[0.98] ${
                      isFormValid
                        ? "bg-[#2B231F] hover:bg-[#B89565] text-white cursor-pointer"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60"
                    }`}
                  >
                    Potvrdi i rezerviraj termin
                  </button>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="animate-booking-step text-center py-2 space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-serif-elegant text-2xl sm:text-3xl font-light text-[#2B231F]">
                    Rezervacija zaprimljena!
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-500 px-4">
                    Vidimo se uskoro! Vaš termin je službeno zapisan.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-[#FCFAF7] border-2 border-[#E5DEC9] rounded-2xl p-5 text-left space-y-4 shadow-sm">
                  <div className="border-b border-[#E5DEC9]/50 pb-3">
                    <p className="text-[9px] text-[#B89565] uppercase tracking-widest font-bold">Potvrda termina</p>
                    <h5 className="font-serif-elegant text-base sm:text-lg text-[#2B231F] mt-0.5">{selectedService?.name}</h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#2B231F]">
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Datum i vrijeme</p>
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
                      <p className="text-xs sm:text-sm font-semibold text-[#2B231F]">{SALON_LOCATION}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] uppercase tracking-wider text-[#2B231F]/50 font-bold">Cijena tretmana</p>
                      <p className="text-sm sm:text-lg font-bold font-mono text-[#B89565]">{selectedService?.price} €</p>
                    </div>
                  </div>
                </div>

                {clientData.email && (
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 max-w-md mx-auto text-center text-xs text-amber-800">
                    <p className="leading-relaxed">
                      Na e-mail <strong>{clientData.email}</strong> smo poslali potvrdu rezervacije.
                      <span className="block mt-1 font-semibold">Ako ne vidite poruku, provjerite Spam ili Promocije.</span>
                    </p>
                  </div>
                )}

                <div className="max-w-md mx-auto pt-2 space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-[#2B231F]/60 font-bold">
                    Spremi termin u kalendar
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E8E2D7] bg-white hover:border-[#B89565] transition-all text-[10px] font-bold text-[#2B231F]">
                      Google
                    </a>
                    <a href={icalUrl} download="tretman-rezervacija.ics" className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E8E2D7] bg-white hover:border-[#B89565] transition-all text-[10px] font-bold text-[#2B231F]">
                      Apple iCal
                    </a>
                    <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-2 rounded-xl border border-[#E8E2D7] bg-white hover:border-[#B89565] transition-all text-[10px] font-bold text-[#2B231F]">
                      Outlook
                    </a>
                  </div>
                </div>

                <button
                  onClick={resetBooking}
                  className="text-[10px] font-bold text-[#B89565] uppercase tracking-widest hover:text-[#2B231F] transition-colors py-2.5 px-5 sm:py-3 sm:px-6 rounded-full border-2 border-[#B89565]/40 hover:border-[#2B231F]"
                >
                  Rezerviraj novi termin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}