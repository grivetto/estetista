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
  status: 'confirmada' | 'cancelada';
}

export const CATEGORIES = [
  { id: 'tutti', label: 'Todos los Tratamientos' },
  { id: 'viso', label: 'Tratamientos Faciales' },
  { id: 'corpo', label: 'Masajes y Corporal' },
  { id: 'laser', label: 'Depilación Láser' },
  { id: 'mani-piedi', label: 'Manicura y Pedicura' },
] as const;

export const TREATMENTS: Treatment[] = [
  // Tratamientos Faciales
  {
    id: 'pulizia-viso-profonda',
    name: 'Limpieza Facial Profunda',
    category: 'viso',
    categoryLabel: 'Tratamientos Faciales',
    price: 55,
    priceLabel: '55 €',
    duration: 60,
    description: 'Higiene facial profunda con ultrasonidos, vapor aromático, extracción delicada y mascarilla calmante personalizada.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'illuminante-vitamina-c',
    name: 'Tratamiento Iluminador Vitamina C',
    category: 'viso',
    categoryLabel: 'Tratamientos Faciales',
    price: 75,
    priceLabel: '75 €',
    duration: 60,
    description: 'Protocolo antioxidante intensivo para aportar luminosidad inmediata, unificar el tono y combatir el fotoenvejecimiento.',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'radiofrequenza-viso',
    name: 'Radiofrecuencia Facial Antiedad',
    category: 'viso',
    categoryLabel: 'Tratamientos Faciales',
    price: 90,
    priceLabel: '90 €',
    duration: 75,
    description: 'Bioestimulación de colágeno y elastina con efecto lifting natural no invasivo desde la primera sesión.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfaf433393?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'peeling-chimico',
    name: 'Peeling Químico Regenerador',
    category: 'viso',
    categoryLabel: 'Tratamientos Faciales',
    price: 65,
    priceLabel: '65 €',
    duration: 45,
    description: 'Exfoliación progresiva con alfahidroxiácidos para alisar la textura de la piel, atenuar manchas y minimizar los poros.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
  },

  // Masajes y Corporal
  {
    id: 'massaggio-relax',
    name: 'Masaje Relax Holístico (50 min)',
    category: 'corpo',
    categoryLabel: 'Masajes y Corporal',
    price: 60,
    priceLabel: '60 €',
    duration: 50,
    description: 'Maniobras lentas y envolventes con aceites esenciales templados para liberar el estrés y reequilibrar cuerpo y mente.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'massaggio-linfodrenante',
    name: 'Drenaje Linfático Método Vodder',
    category: 'corpo',
    categoryLabel: 'Masajes y Corporal',
    price: 70,
    priceLabel: '70 €',
    duration: 60,
    description: 'Técnica manual enfocada en favorecer la eliminación de líquidos, combatir la retención y aportar ligereza inmediata.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'fango-detox',
    name: 'Envoltura de Barro Detox Termal',
    category: 'corpo',
    categoryLabel: 'Masajes y Corporal',
    price: 80,
    priceLabel: '80 €',
    duration: 70,
    description: 'Envoltura mineral desintoxicante y remodelante con manta térmica y masaje reactivador final.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'scrub-corpo-sali',
    name: 'Exfoliación Corporal con Sales Marinas y Karité',
    category: 'corpo',
    categoryLabel: 'Masajes y Corporal',
    price: 45,
    priceLabel: '45 €',
    duration: 45,
    description: 'Renovación corporal con cristales de sal del Mar Muerto y aceites botánicos para una piel sedosa.',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
  },

  // Depilación Láser
  {
    id: 'laser-zona-piccola',
    name: 'Depilación Láser Diodo — Zona Pequeña',
    category: 'laser',
    categoryLabel: 'Depilación Láser',
    price: 35,
    priceLabel: '35 €',
    duration: 25,
    description: 'Sesión de láser de diodo 808nm indoloro para rostro, axilas o ingles. Seguro y eficaz en todos los fototipos.',
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'laser-gambe-inguine',
    name: 'Depilación Láser Diodo — Piernas e Ingles',
    category: 'laser',
    categoryLabel: 'Depilación Láser',
    price: 95,
    priceLabel: '95 €',
    duration: 50,
    description: 'Tratamiento láser progresivo permanente para piernas completas e ingles con cabezal ultra-refrigerado.',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'laser-total-body',
    name: 'Depilación Láser Diodo — Cuerpo Completo',
    category: 'laser',
    categoryLabel: 'Depilación Láser',
    price: 150,
    priceLabel: '150 €',
    duration: 75,
    description: 'Sesión integral de cuerpo completo para lucir una piel suave y libre de vello de forma duradera.',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
  },

  // Manicura y Pedicura
  {
    id: 'manicure-spa-semipermanente',
    name: 'Manicura Spa y Esmaltado Semipermanente',
    category: 'mani-piedi',
    categoryLabel: 'Manicura y Pedicura',
    price: 40,
    priceLabel: '40 €',
    duration: 50,
    description: 'Cuidado meticuloso de uñas y cutículas, exfoliación hidratante de manos y esmaltado semipermanente de larga duración.',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
    popular: true,
  },
  {
    id: 'pedicure-curativo-spa',
    name: 'Pedicura Spa y Ritual Relajante',
    category: 'mani-piedi',
    categoryLabel: 'Manicura y Pedicura',
    price: 55,
    priceLabel: '55 €',
    duration: 60,
    description: 'Tratamiento estético y reparador completo con baño aromático, alisado plantar, masaje podal y esmaltado.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'ricostruzione-gel',
    name: 'Uñas Esculpidas en Gel y Nail Art',
    category: 'mani-piedi',
    categoryLabel: 'Manicura y Pedicura',
    price: 70,
    priceLabel: '70 €',
    duration: 75,
    description: 'Extensión o recubrimiento en gel de alta gama con acabado elegante y diseño personalizado a mano alzada.',
    image: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?auto=format&fit=crop&q=80&w=800',
  },
];

export const SPECIALISTS: Specialist[] = [
  {
    id: 'any',
    name: 'Cualquier Especialista Disponible',
    role: 'Asignación prioritaria',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    bio: 'Máxima disponibilidad horaria con nuestras especialistas sénior cualificadas.',
  },
  {
    id: 'elena-rossi',
    name: 'Elena Morales',
    role: 'Directora Técnica • Facial y Láser',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    bio: '15 años de experiencia en estética avanzada, radiofrecuencia y protocolos antiedad.',
  },
  {
    id: 'sofia-conti',
    name: 'Sofía Mendoza',
    role: 'Terapeuta Holística y Masaje Corporal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    bio: 'Especializada en drenaje linfático método Vodder, rituales termales y aromaterapia.',
  },
  {
    id: 'giulia-verdi',
    name: 'Lucía Navarro',
    role: 'Master Nail & Spa Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bio: 'Experta en manicura rusa, uñas esculpidas en gel, pedicura spa y rituales de manos y pies.',
  },
];

export const WELCOME_DRINKS = [
  'Infusión Relajante de Manzanilla y Azahar',
  'Té Detox de Jengibre, Limón y Menta',
  'Agua Cristalina Aromatizada con Frutos Rojos',
  'Café Espresso / Descafeinado',
  'Sin preferencia',
];

export const ATMOSPHERES = [
  'Música Ambient y Sonidos de la Naturaleza',
  'Silencio Total (Silent Appointment)',
  'Jazz Suave y Lounge Relajante',
  'Asesoramiento Beauty Personalizado',
];

export function getAvailableTimeSlots(dateStr: string): string[] {
  if (!dateStr) return [];
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getDay() === 0) {
    return []; // Cerrado los domingos
  }
  return [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];
}
