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
  Language,
  LANGUAGES,
  CATEGORIES_BY_LANG,
  WELCOME_DRINKS_BY_LANG,
  ATMOSPHERES_BY_LANG,
  getTreatments,
  getSpecialists,
  getAvailableTimeSlots,
  Booking,
  Treatment,
  Specialist,
} from './data/treatments';

const STORAGE_KEY = 'aura_estetista_bookings_v1';
const LANG_STORAGE_KEY = 'aura_estetista_lang';

const UI_TEXT: Record<
  Language,
  {
    nav: {
      home: string;
      about: string;
      services: string;
      priceList: string;
      book: string;
      contact: string;
      myBookings: string;
      bookNow: string;
      switchLangTitle: string;
    };
    hero: {
      badge: string;
      titleLine1: string;
      titleLine2: string;
      ctaBook: string;
      ctaPriceList: string;
      imgAlt: string;
    };
    about: {
      subtitle: string;
      titleLine1: string;
      titleHighlight: string;
      p1: string;
      p2: string;
      stat1Label: string;
      stat2Label: string;
      imgAlt: string;
    };
    services: {
      subtitle: string;
      title: string;
      bookNow: string;
      items: {
        id: 'viso' | 'corpo' | 'laser' | 'mani-piedi';
        defaultTreatmentId: string;
        title: string;
        description: string;
        image: string;
      }[];
    };
    priceList: {
      title: string;
      subtitle: string;
      duration: string;
      bookBtn: string;
      customBtn: string;
      sections: { id: 'viso' | 'corpo' | 'laser' | 'mani-piedi'; name: string }[];
    };
    booking: {
      conciergeBadge: string;
      titlePrefix: string;
      titleHighlight: string;
      subtitle: string;
      steps: [string, string, string];
      mostPopular: string;
      durationLabel: string;
      selected: string;
      select: string;
      step2SpecTitle: string;
      step2SpecDesc: string;
      step2DateTitle: string;
      step2DateDesc: string;
      closed: string;
      step2TimeTitle: string;
      step2TimeDesc: string;
      closedSundayTitle: string;
      closedSundayDesc: string;
      occupied: string;
      step3Title: string;
      step3Desc: string;
      formError: string;
      fullNameLabel: string;
      fullNamePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      customizeRitual: string;
      welcomeDrinkLabel: string;
      atmosphereLabel: string;
      notesLabel: string;
      notesPlaceholder: string;
      changeDateTime: string;
      confirmBookingBtn: string;
      confirmedBadge: string;
      thankYou: string;
      confirmedDesc: string;
      bookingCode: string;
      totalAmount: string;
      treatmentsLabel: string;
      dateTimeLabel: string;
      atTime: string;
      totalDurationLabel: string;
      minutes: string;
      specialistLabel: string;
      teamAura: string;
      saveIcs: string;
      newBooking: string;
      summaryBadge: string;
      yourRitual: string;
      selectAtLeastOne: string;
      dateLabel: string;
      timeLabel: string;
      totalLabel: string;
      chooseDateTimeBtn: string;
      continueWithDataBtn: string;
      selectSlotHint: string;
      addOrModifyBtn: string;
      instantConfirm: string;
      addressShort: string;
      supportPhone: string;
    };
    testimonials: {
      title: string;
      reviews: { name: string; text: string; rating: number }[];
    };
    contact: {
      title: string;
      subtitle: string;
      addressLabel: string;
      addressValue: string;
      phoneLabel: string;
      phoneValue: string;
      hoursLabel: string;
      hoursWeekdays: string;
      hoursSunday: string;
      msgReceivedTitle: string;
      msgReceivedDesc: string;
      writeMessageTitle: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      sendBtn: string;
    };
    drawer: {
      personalArea: string;
      title: string;
      noActiveTitle: string;
      noActiveDesc: string;
      confirmedCount: string;
      clientLabel: string;
      saveCalendar: string;
      cancelBtn: string;
      cancelledHistory: string;
      cancelledStatus: string;
    };
    footer: {
      tagline: string;
      privacy: string;
      cookies: string;
      terms: string;
      rights: string;
    };
  }
> = {
  it: {
    nav: {
      home: 'Home',
      about: 'Chi Siamo',
      services: 'Servizi',
      priceList: 'Listino',
      book: 'Prenota',
      contact: 'Contatti',
      myBookings: 'Le Mie Prenotazioni',
      bookNow: 'Prenota Ora',
      switchLangTitle: 'Cambia lingua',
    },
    hero: {
      badge: "L'essenza del benessere",
      titleLine1: 'Ritrova la tua',
      titleLine2: 'Luce Interiore',
      ctaBook: 'Prenota un Trattamento',
      ctaPriceList: 'Scopri il Listino',
      imgAlt: 'Luxury Spa Atmosphere',
    },
    about: {
      subtitle: 'La nostra filosofia',
      titleLine1: 'Un santuario di pace dedicato alla tua',
      titleHighlight: 'bellezza',
      p1: "In Aura Beauty & Wellness, crediamo che la vera bellezza nasca dall'equilibrio tra corpo e mente. Il nostro centro non è solo un luogo di trattamenti estetici, ma un rifugio dove il tempo si ferma per lasciar spazio alla cura di sé.",
      p2: "Il nostro team di esperti altamente qualificati utilizza tecnologie all'avanguardia e prodotti biologici di altissima qualità per garantirti risultati visibili in un'atmosfera di totale relax. Ogni percorso è personalizzato per rispondere alle tue esigenze uniche.",
      stat1Label: 'Anni di Esperienza',
      stat2Label: 'Clienti Felici',
      imgAlt: 'Estetista Professionista',
    },
    services: {
      subtitle: 'I nostri servizi',
      title: 'Esperienze di Benessere',
      bookNow: 'Prenota ora',
      items: [
        {
          id: 'viso',
          defaultTreatmentId: 'pulizia-viso-profonda',
          title: 'Trattamenti Viso',
          description: 'Rituali rigeneranti e anti-age per una pelle luminosa e visibilmente più giovane.',
          image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'corpo',
          defaultTreatmentId: 'massaggio-relax',
          title: 'Body Massage',
          description: "Massaggi decontratturanti e rilassanti per sciogliere le tensioni e ritrovare l'armonia.",
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'laser',
          defaultTreatmentId: 'laser-gambe-inguine',
          title: 'Epilazione Laser',
          description: 'Tecnologia laser a diodo per una pelle liscia in modo permanente, sicuro ed efficace.',
          image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'mani-piedi',
          defaultTreatmentId: 'manicure-spa-semipermanente',
          title: 'Manicure & Pedicure',
          description: 'Cura professionale per mani e piedi con smalti semipermanenti e trattamenti spa.',
          image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
    priceList: {
      title: 'Listino Trattamenti',
      subtitle: 'Prezzi trasparenti per la tua bellezza • Clicca su un trattamento per prenotarlo subito',
      duration: 'Durata',
      bookBtn: 'Prenota',
      customBtn: 'Componi il tuo Percorso Personalizzato',
      sections: [
        { id: 'viso', name: 'Trattamenti Viso' },
        { id: 'corpo', name: 'Body Massage & Corpo' },
        { id: 'laser', name: 'Epilazione Laser Diodo' },
        { id: 'mani-piedi', name: 'Manicure & Pedicure Spa' },
      ],
    },
    booking: {
      conciergeBadge: 'Concierge Online Aura Beauty',
      titlePrefix: 'Prenota il tuo',
      titleHighlight: 'Trattamento',
      subtitle: "Scegli uno o più rituali di bellezza, seleziona l'estetista, la data e l'orario che preferisci e ricevi subito il tuo pass di conferma.",
      steps: ['1. Trattamenti', '2. Data e Orario', '3. I Tuoi Dati'],
      mostPopular: 'Più Richiesto',
      durationLabel: 'Durata',
      selected: 'Selezionato ✓',
      select: '+ Seleziona',
      step2SpecTitle: '1. Scegli la tua Specialista',
      step2SpecDesc: 'Seleziona la professionista che preferisci o lascia assegnazione prioritaria.',
      step2DateTitle: '2. Seleziona la Data',
      step2DateDesc: 'Aperti dal Lunedì al Sabato dalle 09:00 alle 20:00 (Domenica chiuso).',
      closed: 'Chiuso',
      step2TimeTitle: "3. Scegli l'Orario",
      step2TimeDesc: 'Disponibilità aggiornata in tempo reale per la data selezionata.',
      closedSundayTitle: 'Centro chiuso di Domenica',
      closedSundayDesc: 'Seleziona un giorno dal Lunedì al Sabato per visualizzare gli orari disponibili.',
      occupied: 'Occupato',
      step3Title: 'I Tuoi Dati e Preferenze Benessere',
      step3Desc: "Inserisci i tuoi recapiti per confermare l'appuntamento e personalizza la tua esperienza in cabina.",
      formError: 'Compila tutti i campi obbligatori (Nome, Telefono, Email).',
      fullNameLabel: 'Nome e Cognome *',
      fullNamePlaceholder: 'es. Giulia Verdi',
      phoneLabel: 'Telefono / WhatsApp *',
      phonePlaceholder: '+39 333 1234567',
      emailLabel: 'Email *',
      emailPlaceholder: 'la-tua@email.it',
      customizeRitual: 'Personalizza il tuo Rituale (Incluso)',
      welcomeDrinkLabel: 'Tisana / Welcome Drink',
      atmosphereLabel: 'Atmosfera in Cabina',
      notesLabel: 'Note, Allergie o Desideri Particolari (Opzionale)',
      notesPlaceholder: 'Segnalaci eventuali allergie, sensibilità cutanee o richieste specifiche...',
      changeDateTime: 'Modifica Data / Orario',
      confirmBookingBtn: 'Conferma Prenotazione',
      confirmedBadge: 'Prenotazione Confermata',
      thankYou: 'Grazie,',
      confirmedDesc: 'Il tuo appuntamento da Aura Beauty & Wellness è stato registrato. Ti aspettiamo in Via della Bellezza 12, Roma.',
      bookingCode: 'Codice Prenotazione',
      totalAmount: 'Totale Previsto',
      treatmentsLabel: 'Trattamenti:',
      dateTimeLabel: 'Data e Ora:',
      atTime: 'alle',
      totalDurationLabel: 'Durata Complessiva:',
      minutes: 'minuti',
      specialistLabel: 'Specialista:',
      teamAura: 'Team Aura',
      saveIcs: 'Salva in Calendario (.ics)',
      newBooking: 'Nuova Prenotazione',
      summaryBadge: 'Riepilogo Appuntamento',
      yourRitual: 'Il Tuo Rituale',
      selectAtLeastOne: 'Seleziona almeno un trattamento per continuare.',
      dateLabel: 'Data:',
      timeLabel: 'Orario:',
      totalLabel: 'Totale',
      chooseDateTimeBtn: 'Scegli Data e Orario',
      continueWithDataBtn: 'Procedi con i Tuoi Dati',
      selectSlotHint: 'Seleziona un orario disponibile per continuare',
      addOrModifyBtn: 'Aggiungi o Modifica Trattamenti',
      instantConfirm: 'Conferma immediata • Pagamento in istituto',
      addressShort: 'Via della Bellezza, 12 — Roma',
      supportPhone: 'Assistenza: +39 06 123 4567',
    },
    testimonials: {
      title: 'Dicono di noi',
      reviews: [
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
      ],
    },
    contact: {
      title: 'Contattaci',
      subtitle: 'Siamo a tua disposizione per qualsiasi informazione, consulenza personalizzata o richiesta speciale.',
      addressLabel: 'Indirizzo',
      addressValue: 'Via della Bellezza, 12 - 00100 Roma (RM)',
      phoneLabel: 'Telefono',
      phoneValue: '+39 06 123 4567',
      hoursLabel: 'Orari di Apertura',
      hoursWeekdays: 'Lun - Sab: 09:00 - 20:00',
      hoursSunday: 'Domenica: Chiuso',
      msgReceivedTitle: 'Messaggio Ricevuto!',
      msgReceivedDesc: 'Ti risponderemo al più presto. Grazie per aver scelto Aura Beauty & Wellness.',
      writeMessageTitle: 'Scrivici un Messaggio',
      nameLabel: 'Nome Completo',
      namePlaceholder: 'Il tuo nome',
      emailLabel: 'Email',
      emailPlaceholder: 'La tua email',
      messageLabel: 'Messaggio o Richiesta Informazioni',
      messagePlaceholder: 'Come possiamo aiutarti?',
      sendBtn: 'Invia Messaggio',
    },
    drawer: {
      personalArea: 'Area Personale',
      title: 'Le Mie Prenotazioni',
      noActiveTitle: 'Nessun appuntamento attivo',
      noActiveDesc: 'Non hai ancora prenotazioni attive. Scegli il tuo trattamento dal listino e riserva il tuo momento di benessere.',
      confirmedCount: 'Appuntamenti Confermati',
      clientLabel: 'Cliente',
      saveCalendar: 'Salva in Calendario',
      cancelBtn: 'Annulla',
      cancelledHistory: 'Storico Cancellate',
      cancelledStatus: 'Annullata',
    },
    footer: {
      tagline: "L'eccellenza del benessere a Roma",
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      terms: 'Termini e Condizioni',
      rights: 'Tutti i diritti riservati.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      priceList: 'Price List',
      book: 'Book',
      contact: 'Contact',
      myBookings: 'My Bookings',
      bookNow: 'Book Now',
      switchLangTitle: 'Switch language',
    },
    hero: {
      badge: 'The essence of wellness',
      titleLine1: 'Rediscover your',
      titleLine2: 'Inner Glow',
      ctaBook: 'Book a Treatment',
      ctaPriceList: 'View Price List',
      imgAlt: 'Luxury Spa Atmosphere',
    },
    about: {
      subtitle: 'Our philosophy',
      titleLine1: 'A sanctuary of peace dedicated to your',
      titleHighlight: 'beauty',
      p1: 'At Aura Beauty & Wellness, we believe true beauty stems from harmony between body and mind. Our center is more than a beauty salon—it is a tranquil haven where time stands still for your self-care.',
      p2: 'Our team of highly qualified specialists combines state-of-the-art technology with organic luxury skincare to deliver visible results in an atmosphere of complete serenity.',
      stat1Label: 'Years of Experience',
      stat2Label: 'Happy Clients',
      imgAlt: 'Professional Esthetician',
    },
    services: {
      subtitle: 'Our services',
      title: 'Wellness Experiences',
      bookNow: 'Book now',
      items: [
        {
          id: 'viso',
          defaultTreatmentId: 'pulizia-viso-profonda',
          title: 'Facial Treatments',
          description: 'Regenerating and anti-aging rituals for radiant, visibly younger-looking skin.',
          image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'corpo',
          defaultTreatmentId: 'massaggio-relax',
          title: 'Body Massage',
          description: 'Deep-tissue and relaxing massages to release tension and restore inner harmony.',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'laser',
          defaultTreatmentId: 'laser-gambe-inguine',
          title: 'Laser Hair Removal',
          description: 'Diode laser technology for permanently smooth, safe and painless skin.',
          image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'mani-piedi',
          defaultTreatmentId: 'manicure-spa-semipermanente',
          title: 'Manicure & Pedicure',
          description: 'Professional hand and foot care with long-lasting gel polish and spa rituals.',
          image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
    priceList: {
      title: 'Treatment Menu & Prices',
      subtitle: 'Transparent pricing for your beauty • Click on any treatment to book immediately',
      duration: 'Duration',
      bookBtn: 'Book',
      customBtn: 'Build Your Custom Ritual',
      sections: [
        { id: 'viso', name: 'Facial Treatments' },
        { id: 'corpo', name: 'Body & Massage' },
        { id: 'laser', name: 'Diode Laser Hair Removal' },
        { id: 'mani-piedi', name: 'Spa Manicure & Pedicure' },
      ],
    },
    booking: {
      conciergeBadge: 'Aura Beauty Online Concierge',
      titlePrefix: 'Book Your',
      titleHighlight: 'Treatment',
      subtitle: 'Choose one or more beauty rituals, select your preferred specialist, date and time, and receive your confirmation pass right away.',
      steps: ['1. Treatments', '2. Date & Time', '3. Your Details'],
      mostPopular: 'Most Popular',
      durationLabel: 'Duration',
      selected: 'Selected ✓',
      select: '+ Select',
      step2SpecTitle: '1. Choose Your Specialist',
      step2SpecDesc: 'Select your preferred professional or leave priority automatic assignment.',
      step2DateTitle: '2. Select the Date',
      step2DateDesc: 'Open Monday to Saturday from 09:00 to 20:00 (Closed on Sundays).',
      closed: 'Closed',
      step2TimeTitle: '3. Choose the Time',
      step2TimeDesc: 'Real-time availability for your selected date.',
      closedSundayTitle: 'Closed on Sundays',
      closedSundayDesc: 'Please select a day from Monday to Saturday to view available time slots.',
      occupied: 'Booked',
      step3Title: 'Your Details & Wellness Preferences',
      step3Desc: 'Enter your contact information to confirm the appointment and customize your cabin experience.',
      formError: 'Please fill in all required fields (Name, Phone, Email).',
      fullNameLabel: 'Full Name *',
      fullNamePlaceholder: 'e.g. Emily Carter',
      phoneLabel: 'Phone / WhatsApp *',
      phonePlaceholder: '+39 333 1234567',
      emailLabel: 'Email *',
      emailPlaceholder: 'your@email.com',
      customizeRitual: 'Customize Your Ritual (Included)',
      welcomeDrinkLabel: 'Herbal Tea / Welcome Drink',
      atmosphereLabel: 'Cabin Atmosphere',
      notesLabel: 'Notes, Allergies or Special Requests (Optional)',
      notesPlaceholder: 'Let us know about any allergies, skin sensitivities or special preferences...',
      changeDateTime: 'Change Date / Time',
      confirmBookingBtn: 'Confirm Booking',
      confirmedBadge: 'Booking Confirmed',
      thankYou: 'Thank you,',
      confirmedDesc: 'Your appointment at Aura Beauty & Wellness has been registered. We look forward to welcoming you at Via della Bellezza 12, Rome.',
      bookingCode: 'Booking Code',
      totalAmount: 'Total Amount',
      treatmentsLabel: 'Treatments:',
      dateTimeLabel: 'Date & Time:',
      atTime: 'at',
      totalDurationLabel: 'Total Duration:',
      minutes: 'minutes',
      specialistLabel: 'Specialist:',
      teamAura: 'Aura Team',
      saveIcs: 'Save to Calendar (.ics)',
      newBooking: 'New Booking',
      summaryBadge: 'Appointment Summary',
      yourRitual: 'Your Ritual',
      selectAtLeastOne: 'Select at least one treatment to continue.',
      dateLabel: 'Date:',
      timeLabel: 'Time:',
      totalLabel: 'Total',
      chooseDateTimeBtn: 'Choose Date & Time',
      continueWithDataBtn: 'Continue to Your Details',
      selectSlotHint: 'Select an available time slot to continue',
      addOrModifyBtn: 'Add or Modify Treatments',
      instantConfirm: 'Instant confirmation • Pay at the salon',
      addressShort: 'Via della Bellezza, 12 — Rome',
      supportPhone: 'Support: +39 06 123 4567',
    },
    testimonials: {
      title: 'What Our Clients Say',
      reviews: [
        {
          name: 'Elena Rossi',
          text: 'An incredible experience. The holistic massage was the best I have ever had. The ambiance is refined and the staff is wonderfully kind.',
          rating: 5,
        },
        {
          name: 'Marco Bianchi',
          text: 'State-of-the-art center. I started the laser hair removal sessions and results are already visible after a few visits. Highly recommended!',
          rating: 5,
        },
        {
          name: 'Giulia Verdi',
          text: 'The facial cleansing was a true beauty ritual. My skin has never looked so radiant and hydrated. I will definitely be back.',
          rating: 5,
        },
      ],
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'We are at your disposal for any inquiries, complimentary skin consultations or special requests.',
      addressLabel: 'Address',
      addressValue: 'Via della Bellezza, 12 - 00100 Rome, Italy',
      phoneLabel: 'Phone',
      phoneValue: '+39 06 123 4567',
      hoursLabel: 'Opening Hours',
      hoursWeekdays: 'Mon - Sat: 09:00 - 20:00',
      hoursSunday: 'Sunday: Closed',
      msgReceivedTitle: 'Message Received!',
      msgReceivedDesc: 'We will get back to you shortly. Thank you for choosing Aura Beauty & Wellness.',
      writeMessageTitle: 'Send Us a Message',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your name',
      emailLabel: 'Email',
      emailPlaceholder: 'Your email',
      messageLabel: 'Message or Inquiry',
      messagePlaceholder: 'How can we help you?',
      sendBtn: 'Send Message',
    },
    drawer: {
      personalArea: 'Personal Area',
      title: 'My Bookings',
      noActiveTitle: 'No active appointments',
      noActiveDesc: 'You have no active bookings yet. Choose your treatment from our menu and reserve your wellness moment.',
      confirmedCount: 'Confirmed Appointments',
      clientLabel: 'Client',
      saveCalendar: 'Save to Calendar',
      cancelBtn: 'Cancel',
      cancelledHistory: 'Cancelled History',
      cancelledStatus: 'Cancelled',
    },
    footer: {
      tagline: 'Wellness excellence in Rome',
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      terms: 'Terms & Conditions',
      rights: 'All rights reserved.',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      about: 'Nosotros',
      services: 'Servicios',
      priceList: 'Tarifas',
      book: 'Reservar',
      contact: 'Contacto',
      myBookings: 'Mis Reservas',
      bookNow: 'Reservar Ahora',
      switchLangTitle: 'Cambiar idioma',
    },
    hero: {
      badge: 'La esencia del bienestar',
      titleLine1: 'Redescubre tu',
      titleLine2: 'Luz Interior',
      ctaBook: 'Reservar un Tratamiento',
      ctaPriceList: 'Ver Tarifas',
      imgAlt: 'Atmósfera de Spa de Lujo',
    },
    about: {
      subtitle: 'Nuestra filosofía',
      titleLine1: 'Un santuario de paz dedicado a tu',
      titleHighlight: 'belleza',
      p1: 'En Aura Beauty & Wellness creemos que la verdadera belleza nace del equilibrio entre cuerpo y mente. Nuestro centro no es solo un espacio de tratamientos estéticos, sino un refugio donde el tiempo se detiene para dedicarte al cuidado personal.',
      p2: 'Nuestro equipo de especialistas altamente cualificadas combina aparatología de última generación y cosmética botánica de alta gama para garantizarte resultados visibles en una atmósfera de absoluta serenidad.',
      stat1Label: 'Años de Experiencia',
      stat2Label: 'Clientas Satisfechas',
      imgAlt: 'Especialista en Estética',
    },
    services: {
      subtitle: 'Nuestros servicios',
      title: 'Experiencias de Bienestar',
      bookNow: 'Reservar ahora',
      items: [
        {
          id: 'viso',
          defaultTreatmentId: 'pulizia-viso-profonda',
          title: 'Tratamientos Faciales',
          description: 'Rituales regeneradores y antiedad para una piel luminosa y visiblemente más joven.',
          image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'corpo',
          defaultTreatmentId: 'massaggio-relax',
          title: 'Masajes y Corporal',
          description: 'Masajes descontracturantes y relajantes para liberar tensiones y recuperar la armonía interior.',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'laser',
          defaultTreatmentId: 'laser-gambe-inguine',
          title: 'Depilación Láser',
          description: 'Tecnología láser de diodo para una piel suave de forma permanente, segura e indolora.',
          image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'mani-piedi',
          defaultTreatmentId: 'manicure-spa-semipermanente',
          title: 'Manicura y Pedicura',
          description: 'Cuidado profesional para manos y pies con esmaltes semipermanentes y rituales spa.',
          image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
    priceList: {
      title: 'Carta de Tratamientos y Tarifas',
      subtitle: 'Precios transparentes para tu cuidado • Haz clic en cualquier tratamiento para reservarlo al instante',
      duration: 'Duración',
      bookBtn: 'Reservar',
      customBtn: 'Configurar tu Ritual Personalizado',
      sections: [
        { id: 'viso', name: 'Tratamientos Faciales' },
        { id: 'corpo', name: 'Masajes y Corporal' },
        { id: 'laser', name: 'Depilación Láser Diodo' },
        { id: 'mani-piedi', name: 'Manicura y Pedicura Spa' },
      ],
    },
    booking: {
      conciergeBadge: 'Concierge Online Aura Beauty',
      titlePrefix: 'Reserva tu',
      titleHighlight: 'Tratamiento',
      subtitle: 'Elige uno o varios rituales de belleza, selecciona tu especialista, la fecha y la hora que prefieras y recibe al instante tu pase de confirmación.',
      steps: ['1. Tratamientos', '2. Fecha y Hora', '3. Tus Datos'],
      mostPopular: 'Más Solicitado',
      durationLabel: 'Duración',
      selected: 'Seleccionado ✓',
      select: '+ Seleccionar',
      step2SpecTitle: '1. Elige tu Especialista',
      step2SpecDesc: 'Selecciona tu profesional de confianza o deja la asignación prioritaria automática.',
      step2DateTitle: '2. Selecciona la Fecha',
      step2DateDesc: 'Abierto de lunes a sábado de 09:00 a 20:00 (domingos cerrado).',
      closed: 'Cerrado',
      step2TimeTitle: '3. Elige la Hora',
      step2TimeDesc: 'Disponibilidad actualizada en tiempo real para la fecha seleccionada.',
      closedSundayTitle: 'Centro cerrado los domingos',
      closedSundayDesc: 'Selecciona un día de lunes a sábado para ver los horarios disponibles.',
      occupied: 'Ocupado',
      step3Title: 'Tus Datos y Preferencias de Bienestar',
      step3Desc: 'Introduce tus datos de contacto para confirmar la cita y personaliza tu experiencia en cabina.',
      formError: 'Por favor, completa todos los campos obligatorios (Nombre, Teléfono, Email).',
      fullNameLabel: 'Nombre y Apellidos *',
      fullNamePlaceholder: 'ej. Carmen García',
      phoneLabel: 'Teléfono / WhatsApp *',
      phonePlaceholder: '+34 600 123 456',
      emailLabel: 'Correo Electrónico *',
      emailPlaceholder: 'tu-correo@email.es',
      customizeRitual: 'Personaliza tu Ritual (Incluido)',
      welcomeDrinkLabel: 'Infusión / Bebida de Bienvenida',
      atmosphereLabel: 'Ambiente en Cabina',
      notesLabel: 'Notas, Alergias o Peticiones Especiales (Opcional)',
      notesPlaceholder: 'Indícanos cualquier alergia, sensibilidad cutánea o preferencia especial...',
      changeDateTime: 'Modificar Fecha / Hora',
      confirmBookingBtn: 'Confirmar Reserva',
      confirmedBadge: 'Reserva Confirmada',
      thankYou: 'Gracias,',
      confirmedDesc: 'Tu cita en Aura Beauty & Wellness ha quedado registrada. Te esperamos en Calle Serrano 42, Madrid.',
      bookingCode: 'Código de Reserva',
      totalAmount: 'Importe Total',
      treatmentsLabel: 'Tratamientos:',
      dateTimeLabel: 'Fecha y Hora:',
      atTime: 'a las',
      totalDurationLabel: 'Duración Total:',
      minutes: 'minutos',
      specialistLabel: 'Especialista:',
      teamAura: 'Equipo Aura',
      saveIcs: 'Guardar en Calendario (.ics)',
      newBooking: 'Nueva Reserva',
      summaryBadge: 'Resumen de la Cita',
      yourRitual: 'Tu Ritual',
      selectAtLeastOne: 'Selecciona al menos un tratamiento para continuar.',
      dateLabel: 'Fecha:',
      timeLabel: 'Hora:',
      totalLabel: 'Total',
      chooseDateTimeBtn: 'Elegir Fecha y Hora',
      continueWithDataBtn: 'Continuar con tus Datos',
      selectSlotHint: 'Selecciona un horario disponible para continuar',
      addOrModifyBtn: 'Añadir o Modificar Tratamientos',
      instantConfirm: 'Confirmación inmediata • Pago en el centro',
      addressShort: 'Calle Serrano, 42 — Madrid',
      supportPhone: 'Atención al cliente: +34 910 123 456',
    },
    testimonials: {
      title: 'Lo que dicen de nosotros',
      reviews: [
        {
          name: 'Elena Morales',
          text: 'Una experiencia increíble. El masaje holístico ha sido el mejor que he recibido nunca. El ambiente es exquisito y el trato inmejorable.',
          rating: 5,
        },
        {
          name: 'Carlos Mendoza',
          text: 'Centro a la última vanguardia. Empecé con las sesiones de depilación láser y los resultados son visibles desde el primer mes. ¡100% recomendable!',
          rating: 5,
        },
        {
          name: 'Lucía Serrano',
          text: 'La limpieza facial con vitamina C fue un auténtico ritual de belleza. Mi piel nunca ha estado tan luminosa e hidratada. Volveré sin duda.',
          rating: 5,
        },
      ],
    },
    contact: {
      title: 'Contacto',
      subtitle: 'Estamos a tu disposición para cualquier consulta, diagnóstico facial gratuito o solicitud especial.',
      addressLabel: 'Dirección',
      addressValue: 'Calle Serrano, 42 - 28001 Madrid, España',
      phoneLabel: 'Teléfono',
      phoneValue: '+34 910 123 456',
      hoursLabel: 'Horario de Apertura',
      hoursWeekdays: 'Lun - Sáb: 09:00 - 20:00',
      hoursSunday: 'Domingo: Cerrado',
      msgReceivedTitle: '¡Mensaje Recibido!',
      msgReceivedDesc: 'Te responderemos a la mayor brevedad. Gracias por confiar en Aura Beauty & Wellness.',
      writeMessageTitle: 'Escríbenos un Mensaje',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Tu nombre',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'Tu email',
      messageLabel: 'Mensaje o Consulta',
      messagePlaceholder: '¿En qué podemos ayudarte?',
      sendBtn: 'Enviar Mensaje',
    },
    drawer: {
      personalArea: 'Área Personal',
      title: 'Mis Reservas',
      noActiveTitle: 'No tienes citas activas',
      noActiveDesc: 'Aún no tienes reservas activas. Elige tu tratamiento de nuestra carta y reserva tu momento de bienestar.',
      confirmedCount: 'Citas Confirmadas',
      clientLabel: 'Cliente',
      saveCalendar: 'Guardar en Calendario',
      cancelBtn: 'Cancelar',
      cancelledHistory: 'Historial de Canceladas',
      cancelledStatus: 'Cancelada',
    },
    footer: {
      tagline: 'La excelencia del bienestar en Madrid',
      privacy: 'Política de Privacidad',
      cookies: 'Política de Cookies',
      terms: 'Términos y Condiciones',
      rights: 'Todos los derechos reservados.',
    },
  },
  th: {
    nav: {
      home: 'หน้าแรก',
      about: 'เกี่ยวกับเรา',
      services: 'บริการ',
      priceList: 'อัตราค่าบริการ',
      book: 'จองคิว',
      contact: 'ติดต่อเรา',
      myBookings: 'การจองของฉัน',
      bookNow: 'จองคิวตอนนี้',
      switchLangTitle: 'เปลี่ยนภาษา',
    },
    hero: {
      badge: 'แก่นแท้แห่งความงามและการพักผ่อน',
      titleLine1: 'ค้นพบความเปล่งประกาย',
      titleLine2: 'จากภายในของคุณ',
      ctaBook: 'จองคิวทรีตเมนต์',
      ctaPriceList: 'ดูอัตราค่าบริการ',
      imgAlt: 'บรรยากาศสปาหรู',
    },
    about: {
      subtitle: 'ปรัชญาของเรา',
      titleLine1: 'พื้นที่แห่งความสงบเพื่อ',
      titleHighlight: 'ความงามของคุณ',
      p1: 'ที่ Aura Beauty & Wellness เราเชื่อว่าความงามที่แท้จริงเกิดจากความสมดุลระหว่างร่างกายและจิตใจ ศูนย์ของเราไม่ใช่เพียงสถาบันเสริมความงาม แต่เป็นพื้นที่พักผ่อนที่ให้คุณได้ดูแลตัวเองอย่างเต็มที่',
      p2: 'ทีมผู้เชี่ยวชาญของเราผสานเทคโนโลยีความงามล้ำสมัยเข้ากับผลิตภัณฑ์ออร์แกนิกคุณภาพสูง เพื่อผลลัพธ์ที่ชัดเจนในบรรยากาศสุดผ่อนคลาย',
      stat1Label: 'ปีแห่งประสบการณ์',
      stat2Label: 'ลูกค้าที่ประทับใจ',
      imgAlt: 'ผู้เชี่ยวชาญด้านความงาม',
    },
    services: {
      subtitle: 'บริการของเรา',
      title: 'ประสบการณ์แห่งความผ่อนคลาย',
      bookNow: 'จองตอนนี้',
      items: [
        {
          id: 'viso',
          defaultTreatmentId: 'pulizia-viso-profonda',
          title: 'ทรีตเมนต์ผิวหน้า',
          description: 'ฟื้นฟูและลดเลือนริ้วรอย เพื่อผิวกระจ่างใสและแลดูอ่อนเยาว์อย่างเห็นได้ชัด',
          image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'corpo',
          defaultTreatmentId: 'massaggio-relax',
          title: 'นวดและดูแลผิวกาย',
          description: 'นวดคลายกล้ามเนื้อและนวดอโรม่าเพื่อปลดปล่อยความตึงเครียดและคืนความสมดุล',
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'laser',
          defaultTreatmentId: 'laser-gambe-inguine',
          title: 'เลเซอร์กำจัดขน',
          description: 'เทคโนโลยีไดโอดเลเซอร์เพื่อผิวเรียบเนียนถาวร ปลอดภัย และไร้ความเจ็บปวด',
          image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 'mani-piedi',
          defaultTreatmentId: 'manicure-spa-semipermanente',
          title: 'ทำเล็บมือและเท้า',
          description: 'ดูแลมือและเท้าอย่างมืออาชีพด้วยสีเจลคุณภาพสูงและสปาทรีตเมนต์',
          image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
    priceList: {
      title: 'รายการทรีตเมนต์และราคา',
      subtitle: 'ราคาโปร่งใสเพื่อการดูแลคุณ • คลิกที่ทรีตเมนต์เพื่อจองคิวได้ทันที',
      duration: 'ระยะเวลา',
      bookBtn: 'จองคิว',
      customBtn: 'ออกแบบโปรแกรมความงามเฉพาะคุณ',
      sections: [
        { id: 'viso', name: 'ทรีตเมนต์ผิวหน้า' },
        { id: 'corpo', name: 'นวดและดูแลผิวกาย' },
        { id: 'laser', name: 'เลเซอร์ไดโอดกำจัดขน' },
        { id: 'mani-piedi', name: 'สปาเล็บมือและเท้า' },
      ],
    },
    booking: {
      conciergeBadge: 'ระบบจองคิวออนไลน์ Aura Beauty',
      titlePrefix: 'จองคิว',
      titleHighlight: 'ทรีตเมนต์ของคุณ',
      subtitle: 'เลือกโปรแกรมความงาม ผู้เชี่ยวชาญ วันที่และเวลาที่คุณสะดวก พร้อมรับบัตรยืนยันการจองทันที',
      steps: ['1. เลือกทรีตเมนต์', '2. วันและเวลา', '3. ข้อมูลของคุณ'],
      mostPopular: 'ยอดนิยม',
      durationLabel: 'ระยะเวลา',
      selected: 'เลือกแล้ว ✓',
      select: '+ เลือก',
      step2SpecTitle: '1. เลือกผู้เชี่ยวชาญของคุณ',
      step2SpecDesc: 'เลือกผู้เชี่ยวชาญที่คุณต้องการ หรือให้ระบบจัดสรรคิวที่ว่างให้อัตโนมัติ',
      step2DateTitle: '2. เลือกวันที่',
      step2DateDesc: 'เปิดบริการ วันจันทร์ - วันเสาร์ เวลา 09:00 - 20:00 น. (ปิดวันอาทิตย์)',
      closed: 'ปิดทำการ',
      step2TimeTitle: '3. เลือกเวลา',
      step2TimeDesc: 'ตารางเวลาว่างอัปเดตแบบเรียลไทม์สำหรับวันที่เลือก',
      closedSundayTitle: 'ศูนย์ปิดทำการในวันอาทิตย์',
      closedSundayDesc: 'กรุณาเลือกวันจันทร์ถึงวันเสาร์เพื่อดูเวลาที่ว่าง',
      occupied: 'ไม่ว่าง',
      step3Title: 'ข้อมูลติดต่อและตัวเลือกความผ่อนคลาย',
      step3Desc: 'กรอกข้อมูลติดต่อเพื่อยืนยันการนัดหมาย และเลือกบรรยากาศในห้องทรีตเมนต์',
      formError: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อ, โทรศัพท์, อีเมล)',
      fullNameLabel: 'ชื่อ - นามสกุล *',
      fullNamePlaceholder: 'เช่น พิมพ์ชนก สุขใจ',
      phoneLabel: 'โทรศัพท์ / WhatsApp *',
      phonePlaceholder: '+66 81 234 5678',
      emailLabel: 'อีเมล *',
      emailPlaceholder: 'your@email.com',
      customizeRitual: 'ปรับแต่งความผ่อนคลายของคุณ (รวมในบริการ)',
      welcomeDrinkLabel: 'เครื่องดื่มต้อนรับ / ชาสมุนไพร',
      atmosphereLabel: 'บรรยากาศในห้องทรีตเมนต์',
      notesLabel: 'หมายเหตุ ประวัติการแพ้ หรือคำขอพิเศษ (ไม่บังคับ)',
      notesPlaceholder: 'แจ้งประวัติการแพ้ ความบอบบางของผิว หรือความต้องการพิเศษ...',
      changeDateTime: 'เปลี่ยนวัน / เวลา',
      confirmBookingBtn: 'ยืนยันการจอง',
      confirmedBadge: 'ยืนยันการจองสำเร็จ',
      thankYou: 'ขอบคุณค่ะ คุณ',
      confirmedDesc: 'การนัดหมายของคุณที่ Aura Beauty & Wellness ได้รับการบันทึกแล้ว แล้วพบกันที่ Via della Bellezza 12, Rome',
      bookingCode: 'รหัสการจอง',
      totalAmount: 'ยอดรวม',
      treatmentsLabel: 'ทรีตเมนต์:',
      dateTimeLabel: 'วันและเวลา:',
      atTime: 'เวลา',
      totalDurationLabel: 'ระยะเวลารวม:',
      minutes: 'นาที',
      specialistLabel: 'ผู้เชี่ยวชาญ:',
      teamAura: 'ทีมงาน Aura',
      saveIcs: 'บันทึกลงปฏิทิน (.ics)',
      newBooking: 'จองคิวใหม่',
      summaryBadge: 'สรุปการนัดหมาย',
      yourRitual: 'โปรแกรมของคุณ',
      selectAtLeastOne: 'กรุณาเลือกอย่างน้อย 1 ทรีตเมนต์เพื่อดำเนินการต่อ',
      dateLabel: 'วันที่:',
      timeLabel: 'เวลา:',
      totalLabel: 'ยอดรวม',
      chooseDateTimeBtn: 'เลือกวันและเวลา',
      continueWithDataBtn: 'ดำเนินการกรอกข้อมูล',
      selectSlotHint: 'กรุณาเลือกเวลาที่ว่างเพื่อดำเนินการต่อ',
      addOrModifyBtn: 'เพิ่มหรือแก้ไขทรีตเมนต์',
      instantConfirm: 'ยืนยันทันที • ชำระเงินที่ศูนย์บริการ',
      addressShort: 'Via della Bellezza, 12 — Rome',
      supportPhone: 'ฝ่ายบริการลูกค้า: +39 06 123 4567',
    },
    testimonials: {
      title: 'เสียงตอบรับจากลูกค้า',
      reviews: [
        {
          name: 'Elena Rossi',
          text: 'ประสบการณ์ที่ยอดเยี่ยมมาก การนวดผ่อนคลายดีที่สุดเท่าที่เคยได้รับ บรรยากาศหรูหราและพนักงานดูแลดีมากค่ะ',
          rating: 5,
        },
        {
          name: 'Marco Bianchi',
          text: 'ศูนย์ทันสมัยมาก เริ่มทำเลเซอร์กำจัดขนและเห็นผลลัพธ์ชัดเจนตั้งแต่ช่วงแรก แนะนำเลยครับ!',
          rating: 5,
        },
        {
          name: 'Giulia Verdi',
          text: 'ทรีตเมนต์ทำความสะอาดผิวหน้าวิตามินซีดีมาก ผิวดูสว่างกระจ่างใสและชุ่มชื้นขึ้นทันที จะกลับมาอีกแน่นอนค่ะ',
          rating: 5,
        },
      ],
    },
    contact: {
      title: 'ติดต่อเรา',
      subtitle: 'เราพร้อมให้คำปรึกษา วิเคราะห์สภาพผิวฟรี หรือรับฟังความต้องการพิเศษของคุณ',
      addressLabel: 'ที่อยู่',
      addressValue: 'Via della Bellezza, 12 - 00100 Rome, Italy',
      phoneLabel: 'โทรศัพท์',
      phoneValue: '+39 06 123 4567',
      hoursLabel: 'เวลาทำการ',
      hoursWeekdays: 'จันทร์ - เสาร์: 09:00 - 20:00 น.',
      hoursSunday: 'อาทิตย์: ปิดทำการ',
      msgReceivedTitle: 'ได้รับข้อความแล้ว!',
      msgReceivedDesc: 'เราจะติดต่อกลับโดยเร็วที่สุด ขอบคุณที่ไว้วางใจ Aura Beauty & Wellness',
      writeMessageTitle: 'ส่งข้อความถึงเรา',
      nameLabel: 'ชื่อ - นามสกุล',
      namePlaceholder: 'ชื่อของคุณ',
      emailLabel: 'อีเมล',
      emailPlaceholder: 'อีเมลของคุณ',
      messageLabel: 'ข้อความหรือเรื่องที่ต้องการสอบถาม',
      messagePlaceholder: 'ให้เราช่วยดูแลเรื่องใดคะ?',
      sendBtn: 'ส่งข้อความ',
    },
    drawer: {
      personalArea: 'พื้นที่ส่วนบุคคล',
      title: 'การจองของฉัน',
      noActiveTitle: 'ยังไม่มีการนัดหมาย',
      noActiveDesc: 'คุณยังไม่มีรายการจองที่ใช้งานอยู่ เลือกทรีตเมนต์ที่คุณชื่นชอบและจองเวลาพักผ่อนของคุณได้เลย',
      confirmedCount: 'การนัดหมายที่ยืนยันแล้ว',
      clientLabel: 'ลูกค้า',
      saveCalendar: 'บันทึกลงปฏิทิน',
      cancelBtn: 'ยกเลิก',
      cancelledHistory: 'ประวัติการยกเลิก',
      cancelledStatus: 'ยกเลิกแล้ว',
    },
    footer: {
      tagline: 'ความเป็นเลิศด้านความงามและสปาในกรุงโรม',
      privacy: 'นโยบายความเป็นส่วนตัว',
      cookies: 'นโยบายคุกกี้',
      terms: 'ข้อกำหนดและเงื่อนไข',
      rights: 'สงวนลิขสิทธิ์',
    },
  },
};

const SERVICE_ICONS: Record<'viso' | 'corpo' | 'laser' | 'mani-piedi', React.ReactNode> = {
  viso: <Sparkles className="text-gold" size={32} />,
  corpo: <Flower2 className="text-gold" size={32} />,
  laser: <Heart className="text-gold" size={32} />,
  'mani-piedi': <Scissors className="text-gold" size={32} />,
};

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

function getUpcomingDays(locale: string, count = 14) {
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
      dayName: d.toLocaleDateString(locale, { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString(locale, { month: 'short' }),
      isSunday,
    });
  }
  return days;
}

function downloadICS(booking: Booking, treatmentsList: Treatment[], specialistsList: Specialist[]) {
  const treatments = treatmentsList.filter((t) => booking.treatmentIds.includes(t.id));
  const specialist = specialistsList.find((s) => s.id === booking.specialistId);
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
    `DESCRIPTION:Booking Code: ${booking.code}\\nSpecialist: ${specialist?.name || 'Team Aura'}\\nTotal: €${booking.totalPrice}`,
    'LOCATION:Aura Beauty & Wellness, Via della Bellezza 12, Roma',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aura-${booking.code.toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
      if (saved && ['it', 'en', 'es', 'th'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'it';
  });

  const handleSetLang = (next: Language) => {
    setLang(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const t = UI_TEXT[lang];
  const locale = LANGUAGES.find((l) => l.code === lang)?.locale || 'it-IT';
  const treatmentsList = useMemo(() => getTreatments(lang), [lang]);
  const specialistsList = useMemo(() => getSpecialists(lang), [lang]);
  const categoriesList = CATEGORIES_BY_LANG[lang];
  const welcomeDrinksList = WELCOME_DRINKS_BY_LANG[lang];
  const atmospheresList = ATMOSPHERES_BY_LANG[lang];

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
  const [welcomeDrinkIdx, setWelcomeDrinkIdx] = useState(0);
  const [atmosphereIdx, setAtmosphereIdx] = useState(0);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('aura_estetista_bookings_es_v1');
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
    () => bookings.filter((b) => b.status === 'confermata' || b.status === 'confirmada'),
    [bookings]
  );

  const isSlotOccupied = (date: string, time: string, specialistId: string) => {
    const sameSlot = activeBookings.filter((b) => b.date === date && b.time === time);
    if (specialistId === 'any') {
      const realSpecialistsCount = specialistsList.filter((s) => s.id !== 'any').length;
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
    () => treatmentsList.filter((tr) => selectedTreatments.includes(tr.id)),
    [treatmentsList, selectedTreatments]
  );

  const totalPrice = useMemo(
    () => chosenTreatmentObjects.reduce((sum, tr) => sum + tr.price, 0),
    [chosenTreatmentObjects]
  );

  const totalDuration = useMemo(
    () => chosenTreatmentObjects.reduce((sum, tr) => sum + tr.duration, 0),
    [chosenTreatmentObjects]
  );

  const filteredTreatments = useMemo(() => {
    if (activeCategory === 'tutti') return treatmentsList;
    return treatmentsList.filter((tr) => tr.category === activeCategory);
  }, [activeCategory, treatmentsList]);

  const upcomingDays = useMemo(() => getUpcomingDays(locale, 14), [locale]);
  const availableTimeSlots = useMemo(() => getAvailableTimeSlots(selectedDate), [selectedDate]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientEmail.trim()) {
      setFormError(t.booking.formError);
      return;
    }
    setFormError('');

    let assignedSpecialist = selectedSpecialist;
    if (assignedSpecialist === 'any') {
      const availableSp = specialistsList.find(
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
      welcomeDrink: welcomeDrinksList[welcomeDrinkIdx] || welcomeDrinksList[0],
      atmosphere: atmospheresList[atmosphereIdx] || atmospheresList[0],
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
        lang={lang}
        onSetLang={handleSetLang}
        activeCount={activeBookings.length}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onBookNow={() => scrollToBooking()}
      />

      {/* HERO */}
      <Hero lang={lang} onBookNow={() => scrollToBooking()} />

      {/* ABOUT */}
      <About lang={lang} />

      {/* SERVICES */}
      <Services
        lang={lang}
        onSelectCategory={(cat, defaultTreatmentId) =>
          scrollToBooking({ category: cat, treatmentId: defaultTreatmentId, targetStep: 1 })
        }
      />

      {/* INTERACTIVE PRICE LIST */}
      <PriceList
        lang={lang}
        treatmentsList={treatmentsList}
        onSelectTreatment={(id) => scrollToBooking({ treatmentId: id, targetStep: 2 })}
        onBookAll={() => scrollToBooking()}
      />

      {/* BOOKING SYSTEM */}
      <section id="prenota" className="py-24 bg-stone-50 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold uppercase tracking-widest text-sm mb-3 block">
              {t.booking.conciergeBadge}
            </span>
            <h2 className="text-4xl md:text-5xl mb-4">
              {t.booking.titlePrefix}{' '}
              <span className="italic font-normal">{t.booking.titleHighlight}</span>
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-sm leading-relaxed">
              {t.booking.subtitle}
            </p>

            {/* Stepper */}
            {step < 4 && (
              <div className="max-w-xl mx-auto mt-10 flex items-center justify-between px-2">
                {[
                  { num: 1, label: t.booking.steps[0] },
                  { num: 2, label: t.booking.steps[1] },
                  { num: 3, label: t.booking.steps[2] },
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
                {/* STEP 1: TREATMENTS */}
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
                      {categoriesList.map((cat) => (
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
                      {filteredTreatments.map((tr) => {
                        const isSelected = selectedTreatments.includes(tr.id);
                        return (
                          <div
                            key={tr.id}
                            onClick={() => toggleTreatment(tr.id)}
                            className={`group rounded-2xl overflow-hidden bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-gold ring-2 ring-gold/30 shadow-lg'
                                : 'border-stone-200/80 hover:border-gold/60 shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="relative h-44 overflow-hidden">
                                <img
                                  src={tr.image}
                                  alt={tr.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                                {tr.popular && (
                                  <span className="absolute top-3 left-3 bg-gold text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold">
                                    {t.booking.mostPopular}
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
                                    {tr.categoryLabel}
                                  </span>
                                  <span className="text-lg font-serif font-bold">
                                    {tr.priceLabel}
                                  </span>
                                </div>
                              </div>

                              <div className="p-5">
                                <h3 className="text-lg text-stone-800 mb-2">{tr.name}</h3>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                  {tr.description}
                                </p>
                              </div>
                            </div>

                            <div className="px-5 pb-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                              <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-gold" />
                                {t.booking.durationLabel}: {tr.duration} min
                              </span>
                              <span
                                className={`uppercase tracking-wider text-[10px] font-semibold ${
                                  isSelected ? 'text-gold' : 'text-stone-600'
                                }`}
                              >
                                {isSelected ? t.booking.selected : t.booking.select}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: SPECIALIST, DATE & TIME */}
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
                          <h3 className="text-2xl text-stone-800">{t.booking.step2SpecTitle}</h3>
                          <p className="text-xs text-stone-400">{t.booking.step2SpecDesc}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {specialistsList.map((sp) => {
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
                            <h3 className="text-2xl text-stone-800">{t.booking.step2DateTitle}</h3>
                            <p className="text-xs text-stone-400">{t.booking.step2DateDesc}</p>
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
                                {d.isSunday ? t.booking.closed : d.monthName}
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
                          <h3 className="text-2xl text-stone-800">{t.booking.step2TimeTitle}</h3>
                          <p className="text-xs text-stone-400">{t.booking.step2TimeDesc}</p>
                        </div>
                      </div>

                      {availableTimeSlots.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-stone-50 text-center space-y-2">
                          <AlertCircle className="mx-auto text-gold" size={28} />
                          <p className="font-serif text-lg text-stone-800">
                            {t.booking.closedSundayTitle}
                          </p>
                          <p className="text-xs text-stone-500">{t.booking.closedSundayDesc}</p>
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
                                    {t.booking.occupied}
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

                {/* STEP 3: CLIENT DETAILS & PREFERENCES */}
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
                        {t.booking.step3Title}
                      </h3>
                      <p className="text-xs text-stone-500">{t.booking.step3Desc}</p>
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
                          {t.booking.fullNameLabel}
                        </label>
                        <input
                          required
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder={t.booking.fullNamePlaceholder}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          {t.booking.phoneLabel}
                        </label>
                        <input
                          required
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder={t.booking.phonePlaceholder}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          {t.booking.emailLabel}
                        </label>
                        <input
                          required
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder={t.booking.emailPlaceholder}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none"
                        />
                      </div>
                    </div>

                    {/* Bespoke Wellness Preferences */}
                    <div className="pt-6 border-t border-stone-100 space-y-6">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-gold" />
                        <h4 className="text-lg text-stone-800">{t.booking.customizeRitual}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-400 mb-2">
                            <Coffee size={13} className="text-gold" />
                            {t.booking.welcomeDrinkLabel}
                          </label>
                          <select
                            value={welcomeDrinkIdx}
                            onChange={(e) => setWelcomeDrinkIdx(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none cursor-pointer"
                          >
                            {welcomeDrinksList.map((drink, idx) => (
                              <option key={idx} value={idx}>
                                {drink}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-stone-400 mb-2">
                            <Music size={13} className="text-gold" />
                            {t.booking.atmosphereLabel}
                          </label>
                          <select
                            value={atmosphereIdx}
                            onChange={(e) => setAtmosphereIdx(Number(e.target.value))}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm focus:border-gold outline-none cursor-pointer"
                          >
                            {atmospheresList.map((atm, idx) => (
                              <option key={idx} value={idx}>
                                {atm}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                          {t.booking.notesLabel}
                        </label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={t.booking.notesPlaceholder}
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
                        {t.booking.changeDateTime}
                      </button>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-10 py-4 bg-gold text-white text-xs uppercase tracking-widest font-semibold rounded-full hover:bg-stone-800 transition-all shadow-lg shadow-gold/20 cursor-pointer"
                      >
                        {t.booking.confirmBookingBtn} • € {totalPrice}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* STEP 4: CONFIRMATION VOUCHER */}
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
                        {t.booking.confirmedBadge}
                      </span>
                      <h3 className="text-3xl md:text-5xl text-stone-800">
                        {t.booking.thankYou}{' '}
                        <span className="italic font-normal">{confirmedBooking.clientName}</span>
                      </h3>
                      <p className="text-sm text-stone-500 max-w-md mx-auto">
                        {t.booking.confirmedDesc}
                      </p>
                    </div>

                    <div className="max-w-lg mx-auto bg-stone-50 rounded-2xl p-6 border border-stone-200 text-left space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
                            {t.booking.bookingCode}
                          </span>
                          <span className="font-mono text-lg font-bold text-gold">
                            {confirmedBooking.code}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-stone-400 block">
                            {t.booking.totalAmount}
                          </span>
                          <span className="text-2xl font-serif font-bold text-stone-800">
                            € {confirmedBooking.totalPrice}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs text-stone-700">
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">{t.booking.treatmentsLabel}</span>
                          <span className="font-semibold text-right">
                            {treatmentsList
                              .filter((tr) => confirmedBooking.treatmentIds.includes(tr.id))
                              .map((tr) => tr.name)
                              .join(', ')}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">{t.booking.dateTimeLabel}</span>
                          <span className="font-semibold">
                            {new Date(confirmedBooking.date + 'T00:00:00').toLocaleDateString(
                              locale,
                              {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}{' '}
                            {t.booking.atTime} {confirmedBooking.time}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">{t.booking.totalDurationLabel}</span>
                          <span className="font-semibold">
                            {confirmedBooking.totalDuration} {t.booking.minutes}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">{t.booking.specialistLabel}</span>
                          <span className="font-semibold">
                            {specialistsList.find((s) => s.id === confirmedBooking.specialistId)
                              ?.name || t.booking.teamAura}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-stone-400">{t.booking.welcomeDrinkLabel}:</span>
                          <span className="font-medium">{confirmedBooking.welcomeDrink}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => downloadICS(confirmedBooking, treatmentsList, specialistsList)}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold text-white text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all cursor-pointer shadow-md"
                      >
                        <Download size={15} />
                        {t.booking.saveIcs}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className="px-7 py-3.5 bg-stone-800 text-white text-xs uppercase tracking-widest rounded-full hover:bg-stone-700 transition-all cursor-pointer"
                      >
                        {t.nav.myBookings} ({activeBookings.length})
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
                        {t.booking.newBooking}
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
                    {t.booking.summaryBadge}
                  </span>
                  <h3 className="text-2xl text-stone-800">{t.booking.yourRitual}</h3>
                </div>

                {chosenTreatmentObjects.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-4">
                    {t.booking.selectAtLeastOne}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {chosenTreatmentObjects.map((tr) => (
                      <div
                        key={tr.id}
                        className="flex items-start justify-between gap-2 text-sm py-2 border-b border-stone-100 last:border-0"
                      >
                        <div>
                          <p className="font-serif text-stone-800">{tr.name}</p>
                          <p className="text-[11px] text-stone-400">
                            {tr.duration} min • {tr.categoryLabel}
                          </p>
                        </div>
                        <span className="font-medium text-stone-900 shrink-0">
                          {tr.priceLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-stone-50 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <span>{t.booking.totalDurationLabel}</span>
                    <span className="font-semibold text-stone-800">{totalDuration} min</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between text-stone-500">
                      <span>{t.booking.dateLabel}</span>
                      <span className="font-semibold text-stone-800">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString(locale, {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between text-stone-500">
                      <span>{t.booking.timeLabel}</span>
                      <span className="font-semibold text-gold">{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500">
                    <span>{t.booking.specialistLabel}</span>
                    <span className="font-semibold text-stone-800">
                      {specialistsList.find((s) => s.id === selectedSpecialist)?.name}
                    </span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-2 flex justify-between items-baseline">
                    <span className="uppercase tracking-widest text-[10px] font-bold text-stone-400">
                      {t.booking.totalLabel}
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
                    {t.booking.chooseDateTimeBtn}
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
                      {t.booking.continueWithDataBtn}
                      <ChevronRight size={16} />
                    </button>
                    {!selectedTime && (
                      <p className="text-[11px] text-center text-stone-400">
                        {t.booking.selectSlotHint}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full py-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                      {t.booking.addOrModifyBtn}
                    </button>
                  </div>
                )}

                <div className="pt-4 border-t border-stone-100 space-y-2.5 text-[11px] text-stone-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-gold shrink-0" />
                    <span>{t.booking.instantConfirm}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-gold shrink-0" />
                    <span>{t.booking.addressShort}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-gold shrink-0" />
                    <span>{t.booking.supportPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials lang={lang} />

      {/* CONTACT */}
      <Contact lang={lang} />

      {/* FOOTER */}
      <Footer lang={lang} />

      {/* DRAWER: MY BOOKINGS */}
      <BookingsDrawer
        lang={lang}
        locale={locale}
        treatmentsList={treatmentsList}
        specialistsList={specialistsList}
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
  lang,
  onSetLang,
  activeCount,
  onOpenDrawer,
  onBookNow,
}: {
  lang: Language;
  onSetLang: (l: Language) => void;
  activeCount: number;
  onOpenDrawer: () => void;
  onBookNow: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = UI_TEXT[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const cycleLanguage = () => {
    const idx = LANGUAGES.findIndex((l) => l.code === lang);
    const next = LANGUAGES[(idx + 1) % LANGUAGES.length];
    onSetLang(next.code);
  };

  const navLinks = [
    { name: t.nav.home, href: '#' },
    { name: t.nav.about, href: '#chi-siamo' },
    { name: t.nav.services, href: '#servizi' },
    { name: t.nav.priceList, href: '#listino' },
    { name: t.nav.book, href: '#prenota' },
    { name: t.nav.contact, href: '#contatti' },
  ];

  return (
    <nav
      className={`fixed w-full z-40 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="#" className="text-2xl font-serif tracking-widest text-gold">
            AURA
            <span className="block text-[10px] tracking-[0.3em] font-sans text-stone-400 -mt-1">
              BEAUTY & WELLNESS
            </span>
          </a>

          <button
            type="button"
            onClick={cycleLanguage}
            title={t.nav.switchLangTitle}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
              scrolled
                ? 'bg-stone-50 border-stone-200 text-stone-800 hover:border-gold shadow-sm'
                : 'bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-sm'
            }`}
          >
            <img
              src={currentLangObj.flag}
              alt={currentLangObj.name}
              className="w-4 h-3 object-cover rounded-[2px]"
            />
            <span>{currentLangObj.label}</span>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
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
            <span className="hidden lg:inline">{t.nav.myBookings}</span>
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
            {t.nav.bookNow}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className={`relative p-2 ${scrolled ? 'text-stone-800' : 'text-white'}`}
            aria-label={t.nav.myBookings}
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
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-widest hover:text-gold"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => onSetLang(l.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase border transition-all cursor-pointer ${
                    lang === l.code
                      ? 'bg-gold text-white border-gold'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <img
                    src={l.flag}
                    alt={l.name}
                    className="w-4 h-3 object-cover rounded-[2px]"
                  />
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDrawer();
              }}
              className="text-xs uppercase tracking-widest text-gold font-semibold"
            >
              {t.nav.myBookings} ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onBookNow();
              }}
              className="bg-gold text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest"
            >
              {t.nav.bookNow}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ lang, onBookNow }: { lang: Language; onBookNow: () => void }) => {
  const t = UI_TEXT[lang].hero;
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=2000"
          alt={t.imgAlt}
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
          {t.badge}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight"
        >
          {t.titleLine1} <br /> <span className="italic">{t.titleLine2}</span>
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
            {t.ctaBook}
          </button>
          <a
            href="#listino"
            className="bg-stone-900/40 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-stone-800 transition-all duration-500"
          >
            {t.ctaPriceList}
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

const About = ({ lang }: { lang: Language }) => {
  const t = UI_TEXT[lang].about;
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
                alt={t.imgAlt}
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
              {t.subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-snug">
              {t.titleLine1} <span className="italic font-normal">{t.titleHighlight}</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 text-lg">{t.p1}</p>
            <p className="text-stone-600 leading-relaxed mb-8">{t.p2}</p>
            <div className="flex space-x-8">
              <div>
                <span className="block text-3xl font-serif text-gold">15+</span>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  {t.stat1Label}
                </span>
              </div>
              <div>
                <span className="block text-3xl font-serif text-gold">5k+</span>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  {t.stat2Label}
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
  lang,
  onSelectCategory,
}: {
  lang: Language;
  onSelectCategory: (category: string, defaultTreatmentId: string) => void;
}) => {
  const t = UI_TEXT[lang].services;
  return (
    <section id="servizi" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-sm mb-4 block">
            {t.subtitle}
          </span>
          <h2 className="text-4xl md:text-5xl mb-4">{t.title}</h2>
          <div className="w-24 h-[1px] bg-gold mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.items.map((service, index) => (
            <motion.div
              key={service.id}
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
                  <div className="mb-4">{SERVICE_ICONS[service.id]}</div>
                  <h3 className="text-xl mb-3">{service.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8">
                <span className="text-xs uppercase tracking-widest text-gold font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  {t.bookNow} <ChevronRight size={14} className="ml-1" />
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
  lang,
  treatmentsList,
  onSelectTreatment,
  onBookAll,
}: {
  lang: Language;
  treatmentsList: Treatment[];
  onSelectTreatment: (treatmentId: string) => void;
  onBookAll: () => void;
}) => {
  const t = UI_TEXT[lang].priceList;

  return (
    <section id="listino" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">{t.title}</h2>
          <p className="text-stone-400 italic">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {t.sections.map((sec) => {
            const items = treatmentsList.filter((tr) => tr.category === sec.id);
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
                          {t.duration}: {item.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-medium text-stone-900">{item.priceLabel}</span>
                        <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-gold/40 text-gold group-hover:bg-gold group-hover:text-white transition-all">
                          {t.bookBtn}
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
            {t.customBtn}
          </button>
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ lang }: { lang: Language }) => {
  const t = UI_TEXT[lang].testimonials;

  return (
    <section className="py-24 bg-cipria/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4 italic">{t.title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.reviews.map((review, idx) => (
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

const Contact = ({ lang }: { lang: Language }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = UI_TEXT[lang].contact;

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
            <h2 className="text-4xl mb-8">{t.title}</h2>
            <p className="text-stone-500 mb-12">{t.subtitle}</p>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-gold/10 p-4 rounded-2xl text-gold mr-6">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t.addressLabel}</h4>
                  <p className="text-stone-500">{t.addressValue}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gold/10 p-4 rounded-2xl text-gold mr-6">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t.phoneLabel}</h4>
                  <p className="text-stone-500">{t.phoneValue}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gold/10 p-4 rounded-2xl text-gold mr-6">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t.hoursLabel}</h4>
                  <p className="text-stone-500">{t.hoursWeekdays}</p>
                  <p className="text-stone-500">{t.hoursSunday}</p>
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
                  <h3 className="text-2xl mb-4">{t.msgReceivedTitle}</h3>
                  <p className="text-stone-500">{t.msgReceivedDesc}</p>
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
                  <h3 className="text-2xl text-stone-800 mb-2">{t.writeMessageTitle}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                        {t.nameLabel}
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none"
                        placeholder={t.namePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                        {t.phoneLabel}
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
                      {t.emailLabel}
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none"
                      placeholder={t.emailPlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      {t.messageLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none resize-none"
                      placeholder={t.messagePlaceholder}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold text-white py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-stone-800 transition-all shadow-lg shadow-gold/20 cursor-pointer"
                  >
                    {t.sendBtn}
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
  lang,
  locale,
  treatmentsList,
  specialistsList,
  isOpen,
  onClose,
  bookings,
  onCancel,
  onNewBooking,
}: {
  lang: Language;
  locale: string;
  treatmentsList: Treatment[];
  specialistsList: Specialist[];
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onCancel: (id: string) => void;
  onNewBooking: () => void;
}) => {
  const t = UI_TEXT[lang].drawer;
  const tb = UI_TEXT[lang].booking;
  const active = bookings.filter((b) => b.status === 'confermata' || b.status === 'confirmada');
  const cancelled = bookings.filter((b) => b.status === 'cancellata' || b.status === 'cancelada');

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
                  {t.personalArea}
                </span>
                <h2 className="text-2xl font-serif text-stone-800">{t.title}</h2>
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
                  <h3 className="text-xl font-serif mb-2">{t.noActiveTitle}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed mb-8">{t.noActiveDesc}</p>
                  <button
                    type="button"
                    onClick={onNewBooking}
                    className="px-8 py-3.5 bg-gold text-white text-xs uppercase tracking-widest rounded-full hover:bg-stone-800 transition-all cursor-pointer"
                  >
                    {UI_TEXT[lang].hero.ctaBook}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold block">
                    {t.confirmedCount} ({active.length})
                  </span>

                  {active.map((booking) => {
                    const treatments = treatmentsList.filter((tr) =>
                      booking.treatmentIds.includes(tr.id)
                    );
                    const specialist = specialistsList.find((s) => s.id === booking.specialistId);

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
                            {treatments.map((tr) => tr.name).join(' + ')}
                          </h4>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {t.clientLabel}: {booking.clientName}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={14} className="text-gold" />
                            <span>
                              {new Date(booking.date + 'T00:00:00').toLocaleDateString(locale, {
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
                            <span>{specialist?.name || tb.teamAura}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <button
                            type="button"
                            onClick={() => downloadICS(booking, treatmentsList, specialistsList)}
                            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gold hover:text-stone-800 font-semibold transition-colors cursor-pointer"
                          >
                            <Download size={13} />
                            {t.saveCalendar}
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancel(booking.id)}
                            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-red-500/80 hover:text-red-600 font-medium transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                            {t.cancelBtn}
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
                    {t.cancelledHistory} ({cancelled.length})
                  </span>
                  {cancelled.map((booking) => {
                    const treatments = treatmentsList.filter((tr) =>
                      booking.treatmentIds.includes(tr.id)
                    );
                    return (
                      <div
                        key={booking.id}
                        className="p-4 rounded-xl bg-white/60 border border-stone-200/50 opacity-60 text-xs flex justify-between items-center"
                      >
                        <div>
                          <p className="font-serif line-through text-stone-700">
                            {treatments.map((tr) => tr.name).join(' + ')}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {booking.date} • {booking.time} ({booking.code})
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-red-500">
                          {t.cancelledStatus}
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
                {tb.newBooking}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Footer = ({ lang }: { lang: Language }) => {
  const t = UI_TEXT[lang].footer;
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <span className="text-2xl font-serif tracking-widest text-gold">AURA</span>
            <p className="text-stone-500 text-xs tracking-widest mt-2 uppercase">{t.tagline}</p>
          </div>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              {t.privacy}
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              {t.cookies}
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
            >
              {t.terms}
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-stone-600 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Aura Beauty & Wellness. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
