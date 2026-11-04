export interface Treatment {
  id: string;
  name: string;
  category: 'viso' | 'corpo' | 'laser' | 'mani-piedi';
  categoryLabel: string;
  price: number;
  priceLabel: string;
  duration: number; // minutes
  description: string;
  image: string;
  popular?: boolean;
}

export interface Specialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Booking {
  id: string;
  code: string;
  treatmentIds: string[];
  specialistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  welcomeDrink: string;
  atmosphere: string;
  notes?: string;
  totalPrice: number;
  totalDuration: number;
  createdAt: string;
  status: 'confermata' | 'cancellata';
}

export const CATEGORIES = [
  { id: 'tutti', label: 'Tutti i Trattamenti' },
  { id: 'viso', label: 'Trattamenti Viso' },
  { id: 'corpo', label: 'Body Massage & Corpo' },
  { id: 'laser', label: 'Epilazione Laser' },
  { id: 'mani-piedi', label: 'Manicure & Pedicure' },
] as const;

export const TREATMENTS: Treatment[] = [
  // Viso
  {
    id: 'pulizia-viso-profonda',
    name: 'Pulizia Viso Profonda',
    category: 'viso',
    categoryLabel: 'Trattamenti Viso',
    price: 55,
    priceLabel: '€ 55',
    duration: 60,
    description: 'Detersione profonda con ultrasuoni, vapore aromatico, spremitura delicata e maschera lenitiva su misura.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'illuminante-vitamina-c',
    name: 'Trattamento Illuminante Vitamina C',
    category: 'viso',
    categoryLabel: 'Trattamenti Viso',
    price: 75,
    priceLabel: '€ 75',
    duration: 60,
    description: 'Protocollo antiossidante intensivo per donare luminosità immediata, uniformare il colorito e contrastare il foto-invecchiamento.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'radiofrequenza-viso',
    name: 'Radiofrequenza Viso Anti-Age',
    category: 'viso',
    categoryLabel: 'Trattamenti Viso',
    price: 90,
    priceLabel: '€ 90',
    duration: 75,
    description: 'Bio-stimolazione del collagene ed elastina con effetto lifting naturale non invasivo fin dalla prima seduta.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfaf433393?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'peeling-chimico',
    name: 'Peeling Chimico Rigenerante',
    category: 'viso',
    categoryLabel: 'Trattamenti Viso',
    price: 65,
    priceLabel: '€ 65',
    duration: 45,
    description: 'Esfoliazione progressiva agli alfa-idrossiacidi per levigare la grana della pelle, ridurre macchie e pori dilatati.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
  },

  // Corpo & Massaggi
  {
    id: 'massaggio-relax',
    name: 'Massaggio Relax Olistico (50 min)',
    category: 'corpo',
    categoryLabel: 'Body Massage & Corpo',
    price: 60,
    priceLabel: '€ 60',
    duration: 50,
    description: 'Manovre lente e avvolgenti con oli essenziali caldi per sciogliere lo stress e riequilibrare corpo e mente.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'massaggio-linfodrenante',
    name: 'Massaggio Linfodrenante Vodder',
    category: 'corpo',
    categoryLabel: 'Body Massage & Corpo',
    price: 70,
    priceLabel: '€ 70',
    duration: 60,
    description: 'Tecnica manuale mirata a favorire il drenaggio dei liquidi in eccesso, combattere la ritenzione e donare leggerezza.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fango-detox',
    name: 'Trattamento Fango Detox Termale',
    category: 'corpo',
    categoryLabel: 'Body Massage & Corpo',
    price: 80,
    priceLabel: '€ 80',
    duration: 70,
    description: 'Impacco minerale detossinante e rimodellante con termocoperta e massaggio riattivante finale.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'scrub-corpo-sali',
    name: 'Scrub Corpo ai Sali Marini & Karité',
    category: 'corpo',
    categoryLabel: 'Body Massage & Corpo',
    price: 45,
    priceLabel: '€ 45',
    duration: 45,
    description: 'Esfoliazione rigenerante ai cristalli di sale del Mar Morto e oli botanici per una pelle di seta.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
  },

  // Epilazione Laser
  {
    id: 'laser-zona-piccola',
    name: 'Epilazione Laser Diodo — Zona Piccola',
    category: 'laser',
    categoryLabel: 'Epilazione Laser',
    price: 35,
    priceLabel: '€ 35',
    duration: 25,
    description: 'Seduta laser a diodo 808nm indolore per viso, ascelle o inguine. Sicuro ed efficace su tutti i fototipi.',
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'laser-gambe-inguine',
    name: 'Epilazione Laser Diodo — Gambe & Inguine',
    category: 'laser',
    categoryLabel: 'Epilazione Laser',
    price: 95,
    priceLabel: '€ 95',
    duration: 50,
    description: 'Trattamento laser progressivo permanente per gambe complete e inguine con manipolo raffreddato.',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'laser-total-body',
    name: 'Epilazione Laser Diodo — Total Body',
    category: 'laser',
    categoryLabel: 'Epilazione Laser',
    price: 150,
    priceLabel: '€ 150',
    duration: 75,
    description: 'Pacchetto seduta completa corpo per una pelle liscia e libera dai peli superflui in modo duraturo.',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
  },

  // Manicure & Pedicure
  {
    id: 'manicure-spa-semipermanente',
    name: 'Manicure Spa & Semipermanente',
    category: 'mani-piedi',
    categoryLabel: 'Manicure & Pedicure',
    price: 40,
    priceLabel: '€ 40',
    duration: 50,
    description: 'Cura meticolosa di unghie e cuticole, scrub idratante mani e applicazione smalto semipermanente rinforzato.',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'pedicure-curativo-spa',
    name: 'Pedicure Curativo & Spa Ritual',
    category: 'mani-piedi',
    categoryLabel: 'Manicure & Pedicure',
    price: 55,
    priceLabel: '€ 55',
    duration: 60,
    description: 'Trattamento estetico e curativo completo con pediluvio aromatico, levigatura, massaggio plantare e smalto.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'ricostruzione-gel',
    name: 'Ricostruzione Unghie in Gel & Nail Art',
    category: 'mani-piedi',
    categoryLabel: 'Manicure & Pedicure',
    price: 70,
    priceLabel: '€ 70',
    duration: 75,
    description: 'Allungamento o copertura in gel di altissima qualità con finitura elegante e personalizzata.',
    image: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?auto=format&fit=crop&q=80&w=800',
  },
];

export const SPECIALISTS: Specialist[] = [
  {
    id: 'any',
    name: 'Qualsiasi Specialista Disponibile',
    role: 'Assegnazione prioritaria',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Massima disponibilità di orari con le nostre estetiste senior qualificate.',
  },
  {
    id: 'elena-rossi',
    name: 'Elena Rossi',
    role: 'Direttrice Tecnica • Viso & Laser',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    bio: '15 anni di esperienza in estetica avanzata, radiofrequenza e protocolli anti-age.',
  },
  {
    id: 'sofia-conti',
    name: 'Sofia Conti',
    role: 'Holistic & Body Massage Therapist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    bio: 'Specializzata in massaggio linfodrenante metodo Vodder, rituali termali e aromaterapia.',
  },
  {
    id: 'giulia-verdi',
    name: 'Giulia Ferri',
    role: 'Master Nail & Spa Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Esperta in manicure russa, ricostruzione gel, pedicure curativo e rituali mani/piedi.',
  },
];

export const WELCOME_DRINKS = [
  'Tisana Rilassante Camomilla & Fiori d’Arancio',
  'Infuso Detox Zenzero, Limone & Menta',
  'Acqua Cristallina Aromatizzata ai Frutti Rossi',
  'Caffè Espresso / Ginseng',
  'Nessuna preferenza',
];

export const ATMOSPHERES = [
  'Musica Ambient & Suoni della Natura',
  'Silenzio Totale (Silent Appointment)',
  'Jazz Soft & Lounge Rilassante',
  'Consulenza Beauty Personalizzata',
];

export function getAvailableTimeSlots(dateStr: string): string[] {
  if (!dateStr) return [];
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getDay() === 0) {
    return []; // Closed on Sunday
  }
  return [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];
}
