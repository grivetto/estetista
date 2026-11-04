/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Star,
  Sparkles,
  Flower2,
  Heart,
  Scissors,
  Check,
  Calendar as CalendarIcon,
  User,
  Coffee,
  Music,
  CheckCircle2,
  Trash2,
  Download,
  CalendarCheck,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TREATMENTS,
  SPECIALISTS,
  CATEGORIES,
  WELCOME_DRINKS,
  ATMOSPHERES,
  getAvailableTimeSlots,
  Booking,
} from './data/treatments';

const STORAGE_KEY = 'aura_estetista_bookings_v1';

const SERVICES_DATA = [
  {
    id: 'viso' as const,
    defaultTreatmentId: 'pulizia-viso-profonda',
    title: 'Trattamenti Viso',
    description: 'Rituali rigeneranti e anti-age per una pelle luminosa e visibilmente più giovane.',
    icon: <Sparkles className="text-gold" size={32} />,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'corpo' as const,
    defaultTreatmentId: 'massaggio-relax',
    title: 'Body Massage',
    description: "Massaggi decontratturanti e rilassanti per sciogliere le tensioni e ritrovare l'armonia.",
    icon: <Flower2 className="text-gold" size={32} />,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'laser' as const,
    defaultTreatmentId: 'laser-gambe-inguine',
    title: 'Epilazione Laser',
    description: 'Tecnologia laser a diodo per una pelle liscia in modo permanente, sicuro ed efficace.',
    icon: <Heart className="text-gold" size={32} />,
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'mani-piedi' as const,
    defaultTreatmentId: 'manicure-spa-semipermanente',
    title: 'Manicure & Pedicure',
    description: 'Cura professionale per mani e piedi con smalti semipermanenti e trattamenti spa.',
    icon: <Scissors className="text-gold" size={32} />,
    image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
  },
];

function getDefaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getUpcomingDays(count = 14) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const isSunday = d.getDay() === 0;
    days.push({
      dateStr,
      dayName: d.toLocaleDateString('it-IT', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('it-IT', { month: 'short' }),
      isSunday,
    });
  }
  return days;
}

function downloadICS(booking: Booking) {
  const treatments = TREATMENTS.filter((t) => booking.treatmentIds.includes(t.id));
  const specialist = SPECIALISTS.find((s) => s.id === booking.specialistId);
  const title = `Aura Beauty: ${treatments.map((t) => t.name).join(' + ')}`;

  const [year, month, day] = booking.date.split('-').map(Number);
  const [hour, minute] = booking.time.split(':').map(Number);
  const start = new Date(year, month - 1, day, hour, minute);
  const end = new Date(start.getTime() + booking.totalDuration * 60000);

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aura Beauty & Wellness//Booking System//IT',
    'BEGIN:VEVENT',
    `UID:${booking.id}@aurabeauty.it`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:Codice Prenotazione: ${booking.code}\\nSpecialista: ${specialist?.name || 'Team Aura'}\\nTotale: €${booking.totalPrice}`,
    'LOCATION:Aura Beauty & Wellness, Via della Bellezza 12, Roma',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `prenotazione-${booking.code.toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Booking wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [activeCategory, setActiveCategory] = useState<string>('tutti');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(['pulizia-viso-profonda']);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(getDefaultDate);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Client form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [welcomeDrink, setWelcomeDrink] = useState(WELCOME_DRINKS[0]);
  const [atmosphere, setAtmosphere] = useState(ATMOSPHERES[0]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBookings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to read bookings', e);
    }
  }, []);

  const saveBookings = (next: Booking[]) => {
    setBookings(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to save bookings', e);
    }
  };

  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status === 'confermata'),
    [bookings]
  );

  const isSlotOccupied = (date: string, time: string, specialistId: string) => {
    const sameSlot = activeBookings.filter((b) => b.date === date && b.time === time);
    if (specialistId === 'any') {
      const realSpecialistsCount = SPECIALISTS.filter((s) => s.id !== 'any').length;
      return sameSlot.length >= realSpecialistsCount;
    }
    return sameSlot.some((b) => b.specialistId === specialistId);
  };

  const scrollToBooking = (options?: {
    category?: string;
    treatmentId?: string;
    targetStep?: 1 | 2;
  }) => {
    if (options?.category) {
      setActiveCategory(options.category);
    }
    if (options?.treatmentId) {
      setSelectedTreatments([options.treatmentId]);
    }
    if (options?.targetStep) {
      setStep(options.targetStep);
    } else if (step === 4) {
      setStep(1);
    }
    const el = document.getElementById('prenota');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTreatment = (id: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const chosenTreatmentObjects = useMemo(
    () => TREATMENTS.filter((t) => selectedTreatments.includes(t.id)),
    [selectedTreatments]
  );

  const totalPrice = useMemo(
    () => chosenTreatmentObjects.reduce((sum, t) => sum + t.price, 0),
    [chosenTreatmentObjects]
  );

  const totalDuration = useMemo(
    () => chosenTreatmentObjects.reduce((sum, t) => sum + t.duration, 0),
    [chosenTreatmentObjects]
  );

  const filteredTreatments = useMemo(() => {
    if (activeCategory === 'tutti') return TREATMENTS;
    return TREATMENTS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const upcomingDays = useMemo(() => getUpcomingDays(14), []);
  const availableTimeSlots = useMemo(() => getAvailableTimeSlots(selectedDate), [selectedDate]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
      setFormError('Compila tutti i campi obbligatori (Nome, Telefono, Email).');
      return;
    }
    setFormError('');

    let assignedSpecialist = selectedSpecialist;
    if (assignedSpecialist === 'any') {
      const availableSp = SPECIALISTS.find(
        (s) => s.id !== 'any' && !isSlotOccupied(selectedDate, selectedTime, s.id)
      );
      assignedSpecialist = availableSp?.id || 'elena-rossi';
    }

    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      code: `AURA-${codeNum}`,
      treatmentIds: selectedTreatments,
      specialistId: assignedSpecialist,
      date: selectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      welcomeDrink,
      atmosphere,
      notes: notes.trim() || undefined,
      totalPrice,
      totalDuration,
      createdAt: new Date().toISOString(),
      status: 'confermata',
    };

    saveBookings([newBooking, ...bookings]);
    setConfirmedBooking(newBooking);
    setStep(4);
    const el = document.getElementById('prenota');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelBooking = (id: string) => {
    saveBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: 'cancellata' as const } : b))
    );
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <Navbar
        activeCount={activeBookings.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onBookNow={() => scrollToBooking()}
      />

      {/* HERO */}
      <Hero onBookNow={() => scrollToBooking()} />

      {/* CHI SIAMO */}
      <About />

      {/* SERVIZI */}
      <Services
        onSelectCategory={(cat, defaultTreatmentId) =>
          scrollToBooking({ category: cat, treatmentId: defaultTreatmentId, targetStep: 1 })
        }
      />

      {/* LISTINO INTERATTIVO */}
      <PriceList
        onSelectTreatment={(id) => scrollToBooking({ treatmentId: id, targetStep: 2 })}
        onBookAll={() => scrollToBooking()}
      />

      {/* SISTEMA DI PRENOTAZIONE TRATTAMENTI */}
      <section id="prenota" className="py-24 bg-stone-50 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold uppercase tracking-widest text-sm mb-3 block">
              Concierge Online Aura Beauty
            </span>
            <h2 className="text-4xl md:text-5xl mb-4">
              Prenota il tuo <span className="italic font-normal">Trattamento</span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-sm leading-relaxed">
              Scegli uno o più rituali di bellezza, seleziona l&apos;estetista, la data e l&apos;orario che preferisci e ricevi subito il tuo pass di conferma.
            </p>

            {/* Stepper */}
            {step < 4 && (
              <div className="max-w-xl mx-auto mt-10 flex items-center justify-between px-2">
                {[
                  { num: 1, label: '1. Trattamenti' },
                  { num: 2, label: '2. Data e Orario' },
                  { num: 3, label: '3. I Tuoi Dati' },
                ].map((s, idx) => {
                  const isActive = step === s.num;
                  const isDone = step > s.num;
                  return (
                    <React.Fragment key={s.num}>
                      <button
                        type="button"
                        disabled={s.num > step}
                        onClick={() => {
                          if (s.num < step) setStep(s.num as 1 | 2 | 3);
                        }}
                        className={`flex items-center gap-2.5 ${
                          s.num < step ? 'cursor-pointer' : 'cursor-default'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-gold text-white shadow-md scale-110'
                              : isDone
                              ? 'bg-stone-800 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}
                        >
                          {isDone ? <Check size={15} /> : s.num}
                        </div>
                        <span
                          className={`text-xs uppercase tracking-widest hidden sm:inline ${
                            isActive
                              ? 'text-stone-900 font-semibold'
                              : isDone
                              ? 'text-stone-700'
                              : 'text-stone-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                      {idx < 2 && (
                        <div
                          className={`flex-1 h-[1px] mx-4 ${
                            step > s.num ? 'bg-gold' : 'bg-stone-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left / Wizard Main Column */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* STEP 1: TRATTAMENTI */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all cursor-pointer ${
                            activeCategory === cat.id
                              ? 'bg-gold text-white shadow-md'
                              : 'bg-white text-stone-600 hover:bg-cipria border border-stone-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Treatments Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredTreatments.map((t) => {
                        const isSelected = selectedTreatments.includes(t.id);
                        return (
                          <div
                            key={t.id}
                            onClick={() => toggleTreatment(t.id)}
                            className={`group rounded-2xl overflow-hidden bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-gold ring-2 ring-gold/30 shadow-lg'
                                : 'border-stone-200/80 hover:border-gold/60 shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="relative h-44 overflow-hidden">
                                <img
                                  src={t.image}
                                  alt={t.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                                {t.popular && (
                                  <span className="absolute top-3 left-3 bg-gold text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold">
                                    Più Richiesto
                                  </span>
                                )}
                                <div
                                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'bg-gold text-white'
                                      : 'bg-white/90 text-stone-400'
                                  }`}
                                >
                                  <Check size={16} />
                                </div>
                                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                                  <span className="text-[10px] uppercase tracking-widest bg-stone-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                    {t.categoryLabel}
                                  </span>
                                  <span className="text-lg font-serif font-bold">
                                    {t.priceLabel}
                                  </span>
                                </div>
                              </div>

                              <div className="p-5">
                                <h3 className="text-lg text-stone-800 mb-2">{t.name}</h3>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                  {t.description}
                                </p>
                              </div>
                            </div>

                            <div className="px-5 pb-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                              <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-gold" />
                                Durata: {t.duration} min
                              </span>
                              <span
                                className={`uppercase tracking-wider text-[10px] font-semibold ${
                                  isSelected ? 'text-gold' : 'text-stone-600'
                                }`}
                              >
                                {isSelected ? 'Selezionato ✓' : '+ Seleziona'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: SPECIALISTA, DATA E ORARIO */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-8"
                  >
                    {/* Specialist Picker */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/70 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <User className="text-gold" size={22} />
                        <div>
                          <h3 className="text-2xl text-stone-800">1. Scegli la tua Specialista</h3>
                          <p className="text-xs text-stone-400">
                            Seleziona la professionista che preferisci o lascia assegnazione prioritaria.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SPECIALISTS.map((sp) => {
                          const isSelected = selectedSpecialist === sp.id;
                          return (
                            <div
                              key={sp.id}
                              onClick={() => setSelectedSpecialist(sp.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                                isSelected
                                  ? 'border-gold bg-cipria/50 shadow-sm'
                                  : 'border-stone-200/70 hover:border-gold/50 bg-stone-50/50'
                              }`}
                            >
                              <img
                                src={sp.avatar}
                                alt={sp.name}
                                className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-base text-stone-800 truncate">{sp.name}</h4>
                                  {isSelected && <Check size={16} className="text-gold shrink-0" />}
                                </div>
                                <p className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">
                                  {sp.role}
                                </p>
                                <p className="text-xs text-stone-500 line-clamp-2">{sp.bio}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/70 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="text-gold" size={22} />
                          <div>
                            <h3 className="text-2xl text-stone-800">2. Seleziona la Data</h3>
                            <p className="text-xs text-stone-400">
                              Aperti dal Lunedì al Sabato dalle 09:00 alle 20:00 (Domenica chiuso).
                            </p>
                          </div>
                        </div>

                        <input
                          type="date"
                          value={selectedDate}
                          min={upcomingDays[0]?.dateStr}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime('');
                          }}
                          className="px-4 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 text-stone-800 outline-none focus:border-gold cursor-pointer"
                        />
                      </div>

                      <div className="flex gap-3 overflow-x-auto pb-3">
                        {upcomingDays.map((d) => {
                          const isSelected = selectedDate === d.dateStr;
                          return (
                            <button
                              key={d.dateStr}
                              type="button"
                              disabled={d.isSunday}
                              onClick={() => {
                                setSelectedDate(d.dateStr);
                                setSelectedTime('');
                              }}
                              className={`min-w-[76px] py-3 px-3 rounded-2xl border text-center transition-all shrink-0 ${
                                d.isSunday
                                  ? 'opacity-35 bg-stone-100 border-transparent cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-gold text-white border-gold shadow-md scale-105 cursor-pointer'
                                  : 'bg-stone-50 text-stone-800 border-stone-200/80 hover:border-gold cursor-pointer'
                              }`}
                            >
                              <span className="text-[10px] uppercase tracking-widest block opacity-75">
                                {d.dayName}
                              </span>
                              <span className="text-2xl font-serif font-bold block my-1">
                                {d.dayNum}
                              </span>
                              <span className="text-[10px] uppercase tracking-widest block opacity-75">
                                {d.isSunday ? 'Chiuso' : d.monthName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/70 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <Clock className="text-gold" size={22} />
                        <div>
                          <h3 className="text-2xl text-stone-800">3. Scegli l&apos;Orario</h3>
                          <p className="text-xs text-stone-400">
                            Disponibilità aggiornata in tempo reale per la data selezionata.
                          </p>
                        </div>
                      </div>

                      {availableTimeSlots.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-stone-50 text-center space-y-2">
                          <AlertCircle className="mx-auto text-gold" size={28} />
                          <p className="font-serif text-lg text-stone-800">
                            Centro chiuso di Domenica
                          </p>
                          <p className="text-xs text-stone-500">
                            Seleziona un giorno dal Lunedì al Sabato per visualizzare gli orari disponibili.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {availableTimeSlots.map((slot) => {
                            const occupied = isSlotOccupied(
                              selectedDate,
                              slot,
                              selectedSpecialist
                            );
                            const isSelected = selectedTime === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={occupied}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-3 px-4 rounded-xl text-xs font-medium border transition-all ${
                                  occupied
                                    ? 'bg-stone-100 text-stone-300 border-transparent line-through cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-gold text-white border-gold shadow-md scale-105 cursor-pointer'
                                    : 'bg-stone-50 text-stone-800 border-stone-200/80 hover:border-gold cursor-pointer'
                                }`}
                              >
                                {slot}
                                {occupied && (
                                  <span className="block text-[9px] uppercase tracking-tighter no-underline">
                                    Occupato
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DATI CLIENTE & COCCOLA DI BENVENUTO */}
                {step === 3 && (
                  <motion.form
                    key="step3"
                    onSubmit={handleConfirmBooking}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/70 shadow-sm space-y-8"
                  >
                    <div>
                      <h3 className="text-2xl md:text-3xl text-stone-800 mb-2">
                        I Tuoi Dati e Preferenze Benessere
                      </h3>
                      <p className="text-xs text-stone-500">
                        Inserisci i tuoi recapiti per confermare l&apos;appuntamento e personalizza la tua esperienza in cabina.
                      </p>
                    </div>

                    {formError && (
                      <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          Nome e Cognome *
                        </label>
                        <input
                          required
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="es. Giulia Verdi"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          Telefono / WhatsApp *
                        </label>
                        <input
                          required
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+39 333 1234567"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          Email *
                        </label>
                        <input
                          required
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="la-tua@email.it"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none"
                        />
                      </div>
                    </div>

                    {/* Bespoke Wellness Preferences */}
                    <div className="pt-6 border-t border-stone-100 space-y-6">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-gold" />
                        <h4 className="text-lg text-stone-800">
                          Personalizza il tuo Rituale (Incluso)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-400 mb-2">
                            <Coffee size={13} className="text-gold" />
                            Tisana / Welcome Drink
                          </label>
                          <select
                            value={welcomeDrink}
                            onChange={(e) => setWelcomeDrink(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none cursor-pointer"
                          >
                            {WELCOME_DRINKS.map((drink) => (
                              <option key={drink} value={drink}>
                                {drink}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-400 mb-2">
                            <Music size={13} className="text-gold" />
                            Atmosfera in Cabina
                          </label>
                          <select
                            value={atmosphere}
                            onChange={(e) => setAtmosphere(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none cursor-pointer"
                          >
                            {ATMOSPHERES.map((atm) => (
                              <option key={atm} value={atm}>
                                {atm}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          Note, Allergie o Desideri Particolari (Opzionale)
                        </label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Segnalaci eventuali allergie, sensibilità cutanee o richieste specifiche..."
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                        Modifica Data / Orario
                      </button>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-10 py-4 bg-gold text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-stone-800 transition-all shadow-lg shadow-gold/20 cursor-pointer"
                      >
                        Conferma Prenotazione • € {totalPrice}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 4: VOUCHER DI CONFERMA */}
                {step === 4 && confirmedBooking && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 md:p-12 rounded-3xl border border-gold/30 shadow-xl text-center space-y-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto text-gold">
                      <CheckCircle2 size={42} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.3em] text-gold block font-semibold">
                        Prenotazione Confermata
                      </span>
                      <h3 className="text-3xl md:text-5xl text-stone-800">
                        Grazie, <span className="italic font-normal">{confirmedBooking.clientName}</span>
                      </h3>
                      <p className="text-sm text-stone-500 max-w-md mx-auto">
                        Il tuo appuntamento da Aura Beauty & Wellness è stato registrato. Ti aspettiamo in Via della Bellezza 12, Roma.
                      </p>
                    </div>

                    <div className="max-w-lg mx-auto bg-stone-50 rounded-2xl p-6 border border-stone-200 text-left space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
                            Codice Prenotazione
                          </span>
                          <span className="font-mono text-lg font-bold text-gold">
                            {confirmedBooking.code}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
                            Totale Previsto
                          </span>
                          <span className="text-2xl font-serif font-bold text-stone-800">
                            € {confirmedBooking.totalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-stone-700">
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">Trattamenti:</span>
                          <span className="font-semibold text-right">
                            {TREATMENTS.filter((t) =>
                              confirmedBooking.treatmentIds.includes(t.id)
                            )
                              .map((t) => t.name)
                              .join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">Data e Ora:</span>
                          <span className="font-semibold">
                            {new Date(confirmedBooking.date + 'T00:00:00').toLocaleDateString(
                              'it-IT',
                              {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}{' '}
                            alle {confirmedBooking.time}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">Durata Complessiva:</span>
                          <span className="font-semibold">
                            {confirmedBooking.totalDuration} minuti
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">Specialista:</span>
                          <span className="font-semibold">
                            {SPECIALISTS.find((s) => s.id === confirmedBooking.specialistId)
                              ?.name || 'Team Aura'}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">Welcome Drink:</span>
                          <span className="font-medium">{confirmedBooking.welcomeDrink}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => downloadICS(confirmedBooking)}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-white text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all cursor-pointer shadow-md"
                      >
                        <Download size={15} />
                        Salva in Calendario (.ics)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="px-7 py-3.5 bg-stone-800 text-white text-xs uppercase tracking-widest rounded-full hover:bg-stone-700 transition-all cursor-pointer"
                      >
                        Le Mie Prenotazioni ({activeBookings.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmedBooking(null);
                          setSelectedTime('');
                          setStep(1);
                        }}
                        className="px-7 py-3.5 border border-stone-300 text-stone-700 text-xs uppercase tracking-widest rounded-full hover:border-gold hover:text-gold transition-all cursor-pointer"
                      >
                        Nuova Prenotazione
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right / Sticky Summary Sidebar */}
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-lg space-y-6">
                <div className="border-b border-stone-100 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold block font-semibold">
                    Riepilogo Appuntamento
                  </span>
                  <h3 className="text-2xl text-stone-800">Il Tuo Rituale</h3>
                </div>

                {chosenTreatmentObjects.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-4">
                    Seleziona almeno un trattamento per continuare.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {chosenTreatmentObjects.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-start justify-between gap-2 text-sm py-2 border-b border-stone-100 last:border-0"
                      >
                        <div>
                          <p className="font-serif text-stone-800">{t.name}</p>
                          <p className="text-[11px] text-stone-400">
                            {t.duration} min • {t.categoryLabel}
                          </p>
                        </div>
                        <span className="font-medium text-stone-900 shrink-0">
                          {t.priceLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-stone-50 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>Durata Complessiva:</span>
                    <span className="font-semibold text-stone-800">{totalDuration} min</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between text-stone-500">
                      <span>Data:</span>
                      <span className="font-semibold text-stone-800">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between text-stone-500">
                      <span>Orario:</span>
                      <span className="font-semibold text-gold">{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500">
                    <span>Specialista:</span>
                    <span className="font-semibold text-stone-800">
                      {SPECIALISTS.find((s) => s.id === selectedSpecialist)?.name}
                    </span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-2 flex justify-between items-baseline">
                    <span className="uppercase tracking-widest text-[10px] font-bold text-stone-400">
                      Totale
                    </span>
                    <span className="text-2xl font-serif font-bold text-gold">
                      € {totalPrice}
                    </span>
                  </div>
                </div>

                {step === 1 && (
                  <button
                    type="button"
                    disabled={selectedTreatments.length === 0}
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-gold text-white text-xs uppercase tracking-widest font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                  >
                    Scegli Data e Orario
                    <ChevronRight size={16} />
                  </button>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(3)}
                      className="w-full py-4 bg-gold text-white text-xs uppercase tracking-widest font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                    >
                      Procedi con i Tuoi Dati
                      <ChevronRight size={16} />
                    </button>
                    {!selectedTime && (
                      <p className="text-[11px] text-center text-stone-400">
                        Seleziona un orario disponibile per continuare
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      Aggiungi o Modifica Trattamenti
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-100 space-y-2.5 text-[11px] text-stone-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-gold shrink-0" />
                    <span>Conferma immediata • Pagamento in istituto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-gold shrink-0" />
                    <span>Via della Bellezza, 12 — Roma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-gold shrink-0" />
                    <span>Assistenza: +39 06 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENSIONI */}
      <Testimonials />

      {/* CONTATTI */}
      <Contact />

      {/* FOOTER */}
      <Footer />

      {/* DRAWER: LE MIE PRENOTAZIONI */}
      <BookingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        bookings={bookings}
        onCancel={cancelBooking}
        onNewBooking={() => {
          setIsDrawerOpen(false);
          scrollToBooking();
        }}
      />
    </div>
  );
}

const Navbar = ({
  activeCount,
  onOpenDrawer,
  onBookNow,
}: {
  activeCount: number;
  onOpenDrawer: () => void;
  onBookNow: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Chi Siamo', href: '#chi-siamo' },
    { name: 'Servizi', href: '#servizi' },
    { name: 'Listino', href: '#listino' },
    { name: 'Prenota', href: '#prenota' },
    { name: 'Contatti', href: '#contatti' },
  ];

  return (
    <nav
      className={`fixed w-full z-40 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-serif tracking-widest text-gold">
          AURA
          <span className="block text-[10px] tracking-[0.3em] font-sans text-stone-400 -mt-1">
            BEAUTY & WELLNESS
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-7 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-widest hover:text-gold transition-colors duration-300 ${
                scrolled ? 'text-stone-800' : 'text-white drop-shadow-sm'
              }`}
            >
              {link.name}
            </a>
          ))}

          <button
            type="button"
            onClick={onOpenDrawer}
            className={`relative inline-flex items-center gap-2 text-xs uppercase tracking-widest hover:text-gold transition-colors cursor-pointer ${
              scrolled ? 'text-stone-800' : 'text-white'
            }`}
          >
            <CalendarCheck size={17} />
            <span className="hidden lg:inline">Le Mie Prenotazioni</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {activeCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onBookNow}
            className="bg-gold text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-stone-800 transition-all duration-300 cursor-pointer shadow-sm"
          >
            Prenota Ora
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className={`relative p-2 ${scrolled ? 'text-stone-800' : 'text-white'}`}
            aria-label="Le Mie Prenotazioni"
          >
            <CalendarCheck size={22} />
            {activeCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold text-white text-[9px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className={scrolled ? 'text-stone-800' : 'text-white'}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-8 md:hidden flex flex-col items-center space-y-6 text-stone-800"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-widest hover:text-gold"
              >
                {link.name}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDrawer();
              }}
              className="text-xs uppercase tracking-widest text-gold font-semibold"
            >
              Le Mie Prenotazioni ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onBookNow();
              }}
              className="bg-gold text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest"
            >
              Prenota Ora
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onBookNow }: { onBookNow: () => void }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Spa Atmosphere"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-900/35"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block text-white uppercase tracking-[0.5em] text-sm mb-6"
        >
          L&apos;essenza del benessere
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight"
        >
          Ritrova la tua <br /> <span className="italic">Luce Interiore</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            type="button"
            onClick={onBookNow}
            className="bg-white text-stone-800 px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl cursor-pointer"
          >
            Prenota un Trattamento
          </button>
          <a
            href="#listino"
            className="bg-stone-900/40 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-stone-800 transition-all duration-500"
          >
            Scopri il Listino
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-[1px] h-12 bg-white/30 mx-auto"></div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="chi-siamo" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000"
                alt="Professional Esthetician"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-cipria rounded-2xl -z-10 hidden lg:block"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold uppercase tracking-widest text-sm mb-4 block">
              La nostra filosofia
            </span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-snug">
              Un santuario di pace <br /> dedicato alla tua{' '}
              <span className="italic font-normal">bellezza</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 text-lg">
              In Aura Beauty & Wellness, crediamo che la vera bellezza nasca dall&apos;equilibrio tra corpo e mente. Il nostro centro non è solo un luogo di trattamenti estetici, ma un rifugio dove il tempo si ferma per lasciar spazio alla cura di sé.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Il nostro team di esperti altamente qualificati utilizza tecnologie all&apos;avanguardia e prodotti biologici di altissima qualità per garantirti risultati visibili in un&apos;atmosfera di totale relax. Ogni percorso è personalizzato per rispondere alle tue esigenze uniche.
            </p>
            <div className="flex space-x-8">
              <div>
                <span className="block text-3xl font-serif text-gold">15+</span>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  Anni di Esperienza
                </span>
              </div>
              <div>
                <span className="block text-3xl font-serif text-gold">5k+</span>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  Clienti Felici
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = ({
  onSelectCategory,
}: {
  onSelectCategory: (category: string, defaultTreatmentId: string) => void;
}) => {
  return (
    <section id="servizi" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-sm mb-4 block">
            I nostri servizi
          </span>
          <h2 className="text-4xl md:text-5xl mb-4">Esperienze di Benessere</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectCategory(service.id, service.defaultTreatmentId)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 pb-4">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl mb-3">{service.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8">
                <span className="text-xs uppercase tracking-widest text-gold font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  Prenota ora <ChevronRight size={14} className="ml-1" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PriceList = ({
  onSelectTreatment,
  onBookAll,
}: {
  onSelectTreatment: (treatmentId: string) => void;
  onBookAll: () => void;
}) => {
  const sections = [
    { id: 'viso', name: 'Trattamenti Viso' },
    { id: 'corpo', name: 'Body Massage & Corpo' },
    { id: 'laser', name: 'Epilazione Laser Diodo' },
    { id: 'mani-piedi', name: 'Manicure & Pedicure Spa' },
  ] as const;

  return (
    <section id="listino" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Listino Trattamenti</h2>
          <p className="text-stone-400 italic">
            Prezzi trasparenti per la tua bellezza • Clicca su un trattamento per prenotarlo subito
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {sections.map((sec) => {
            const items = TREATMENTS.filter((t) => t.category === sec.id);
            return (
              <div key={sec.id}>
                <h3 className="text-2xl mb-8 text-gold italic border-b border-stone-100 pb-2">
                  {sec.name}
                </h3>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectTreatment(item.id)}
                      className="flex justify-between items-center group cursor-pointer py-1"
                    >
                      <div className="pr-3">
                        <span className="text-stone-800 group-hover:text-gold transition-colors font-medium block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Durata: {item.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-medium text-stone-900">{item.priceLabel}</span>
                        <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-gold/40 text-gold group-hover:bg-gold group-hover:text-white transition-all">
                          Prenota
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={onBookAll}
            className="border border-gold text-gold px-10 py-3.5 rounded-full text-xs uppercase tracking-widest hover:bg-gold hover:text-white transition-all cursor-pointer"
          >
            Componi il tuo Percorso Personalizzato
          </button>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: 'Elena Rossi',
      text: "Un'esperienza incredibile. Il massaggio è stato il migliore che abbia mai ricevuto. L'ambiente è raffinato e il personale gentilissimo.",
      rating: 5,
    },
    {
      name: 'Marco Bianchi',
      text: 'Centro all’avanguardia. Ho iniziato il percorso laser e i risultati sono già visibili dopo poche sedute. Consigliatissimo!',
      rating: 5,
    },
    {
      name: 'Giulia Verdi',
      text: 'La pulizia del viso è stata un vero rituale di bellezza. La mia pelle non è mai stata così luminosa. Tornerò sicuramente.',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-cipria/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 italic">Dicono di noi</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-sm relative"
            >
              <div className="flex mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold mr-1" />
                ))}
              </div>
              <p className="text-stone-600 italic mb-8 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold mr-3">
                  {review.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {review.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contatti" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24">
          <div>
            <h2 className="text-4xl mb-8">Contattaci</h2>
            <p className="text-stone-500 mb-12">
              Siamo a tua disposizione per qualsiasi informazione, consulenza personalizzata o richiesta speciale.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-gold/10 p-4 rounded-2xl text-gold mr-6">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Indirizzo</h4>
                  <p className="text-stone-500">Via della Bellezza, 12 - 00100 Roma (RM)</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gold/10 p-4 rounded-2xl text-gold mr-6">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Telefono</h4>
                  <p className="text-stone-500">+39 06 123 4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gold/10 p-4 rounded-2xl text-gold mr-6">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Orari di Apertura</h4>
                  <p className="text-stone-500">Lun - Sab: 09:00 - 20:00</p>
                  <p className="text-stone-500">Domenica: Chiuso</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex space-x-4">
              <a
                href="#"
                className="w-12 h-12 border border-stone-200 rounded-full flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 border border-stone-200 rounded-full flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="bg-stone-50 p-10 rounded-3xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-gold mb-6">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="text-2xl mb-4">Messaggio Ricevuto!</h3>
                  <p className="text-stone-500">
                    Ti risponderemo al più presto. Grazie per aver scelto Aura Beauty & Wellness.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h3 className="text-2xl text-stone-800 mb-2">Scrivici un Messaggio</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                        Nome Completo
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none"
                        placeholder="Il tuo nome"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                        Telefono
                      </label>
                      <input
                        required
                        type="tel"
                        className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none"
                        placeholder="+39 000 0000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none"
                      placeholder="La tua email"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      Messaggio o Richiesta Informazioni
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none resize-none"
                      placeholder="Come possiamo aiutarti?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold text-white py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-stone-800 transition-all shadow-lg shadow-gold/20 cursor-pointer"
                  >
                    Invia Messaggio
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const BookingsDrawer = ({
  isOpen,
  onClose,
  bookings,
  onCancel,
  onNewBooking,
}: {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancel: (id: string) => void;
  onNewBooking: () => void;
}) => {
  const active = bookings.filter((b) => b.status === 'confermata');
  const cancelled = bookings.filter((b) => b.status === 'cancellata');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-stone-50 text-stone-800 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold block font-semibold">
                  Area Personale
                </span>
                <h2 className="text-2xl font-serif text-stone-800">Le Mie Prenotazioni</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {active.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="text-xl font-serif mb-2">Nessun appuntamento attivo</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-8">
                    Non hai ancora prenotazioni attive. Scegli il tuo trattamento dal listino e riserva il tuo momento di benessere.
                  </p>
                  <button
                    type="button"
                    onClick={onNewBooking}
                    className="px-8 py-3.5 bg-gold text-white text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all cursor-pointer"
                  >
                    Prenota un Trattamento
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold block">
                    Appuntamenti Confermati ({active.length})
                  </span>

                  {active.map((booking) => {
                    const treatments = TREATMENTS.filter((t) =>
                      booking.treatmentIds.includes(t.id)
                    );
                    const specialist = SPECIALISTS.find((s) => s.id === booking.specialistId);

                    return (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-emerald-600" />
                            <span className="text-[11px] font-mono uppercase tracking-widest bg-cipria px-2.5 py-0.5 rounded-full text-gold font-bold">
                              {booking.code}
                            </span>
                          </div>
                          <span className="text-base font-serif font-bold text-stone-800">
                            € {booking.totalPrice}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif text-lg text-stone-800 leading-snug">
                            {treatments.map((t) => t.name).join(' + ')}
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Cliente: {booking.clientName}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={14} className="text-gold" />
                            <span>
                              {new Date(booking.date + 'T00:00:00').toLocaleDateString('it-IT', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gold" />
                            <span>
                              {booking.time} ({booking.totalDuration} min)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 col-span-2">
                            <User size={14} className="text-gold" />
                            <span>{specialist?.name || 'Team Aura'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => downloadICS(booking)}
                            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gold hover:text-stone-800 font-semibold transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                            Salva in Calendario
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancel(booking.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-red-500/80 hover:text-red-600 font-medium transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            Annulla
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {cancelled.length > 0 && (
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 block">
                    Storico Cancellate ({cancelled.length})
                  </span>
                  {cancelled.map((booking) => {
                    const treatments = TREATMENTS.filter((t) =>
                      booking.treatmentIds.includes(t.id)
                    );
                    return (
                      <div
                        key={booking.id}
                        className="p-4 rounded-xl bg-white/60 border border-stone-200/50 opacity-60 text-xs flex justify-between items-center"
                      >
                        <div>
                          <p className="font-serif line-through text-stone-700">
                            {treatments.map((t) => t.name).join(' + ')}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {booking.date} • {booking.time} ({booking.code})
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-red-500">
                          Annullata
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-stone-200 bg-white">
              <button
                type="button"
                onClick={onNewBooking}
                className="w-full py-4 bg-gold text-white text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-stone-800 transition-all cursor-pointer"
              >
                Nuova Prenotazione
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <span className="text-2xl font-serif tracking-widest text-gold">AURA</span>
            <p className="text-stone-500 text-xs tracking-widest mt-2 uppercase">
              L&apos;eccellenza del benessere a Roma
            </p>
          </div>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              Termini e Condizioni
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-stone-600 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Aura Beauty & Wellness. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};
