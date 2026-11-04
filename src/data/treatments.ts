export type Language = 'it' | 'en' | 'es' | 'th';

export const LANGUAGES: { code: Language; label: string; name: string; flag: string; locale: string }[] = [
  { code: 'it', label: 'IT', name: 'Italiano', flag: 'https://flagcdn.com/w40/it.png', locale: 'it-IT' },
  { code: 'en', label: 'EN', name: 'English', flag: 'https://flagcdn.com/w40/gb.png', locale: 'en-GB' },
  { code: 'es', label: 'ES', name: 'Español', flag: 'https://flagcdn.com/w40/es.png', locale: 'es-ES' },
  { code: 'th', label: 'TH', name: 'ไทย', flag: 'https://flagcdn.com/w40/th.png', locale: 'th-TH' },
];

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
  status: 'confirmada' | 'cancelada' | 'confermata' | 'cancellata';
}

export const CATEGORIES_BY_LANG: Record<Language, { id: string; label: string }[]> = {
  it: [
    { id: 'tutti', label: 'Tutti i Trattamenti' },
    { id: 'viso', label: 'Trattamenti Viso' },
    { id: 'corpo', label: 'Body Massage & Corpo' },
    { id: 'laser', label: 'Epilazione Laser' },
    { id: 'mani-piedi', label: 'Manicure & Pedicure' },
  ],
  en: [
    { id: 'tutti', label: 'All Treatments' },
    { id: 'viso', label: 'Facial Treatments' },
    { id: 'corpo', label: 'Body & Massage' },
    { id: 'laser', label: 'Laser Hair Removal' },
    { id: 'mani-piedi', label: 'Manicure & Pedicure' },
  ],
  es: [
    { id: 'tutti', label: 'Todos los Tratamientos' },
    { id: 'viso', label: 'Tratamientos Faciales' },
    { id: 'corpo', label: 'Masajes y Corporal' },
    { id: 'laser', label: 'Depilación Láser' },
    { id: 'mani-piedi', label: 'Manicura y Pedicura' },
  ],
  th: [
    { id: 'tutti', label: 'ทรีตเมนต์ทั้งหมด' },
    { id: 'viso', label: 'ทรีตเมนต์ผิวหน้า' },
    { id: 'corpo', label: 'นวดและดูแลผิวกาย' },
    { id: 'laser', label: 'เลเซอร์กำจัดขน' },
    { id: 'mani-piedi', label: 'ทำเล็บมือและเท้า' },
  ],
};

export const CATEGORIES = CATEGORIES_BY_LANG.it;

interface LocalizedTreatment {
  id: string;
  category: 'viso' | 'corpo' | 'laser' | 'mani-piedi';
  price: number;
  duration: number;
  image: string;
  popular?: boolean;
  name: Record<Language, string>;
  categoryLabel: Record<Language, string>;
  priceLabel: Record<Language, string>;
  description: Record<Language, string>;
}

const RAW_TREATMENTS: LocalizedTreatment[] = [
  // Viso
  {
    id: 'pulizia-viso-profonda',
    category: 'viso',
    price: 55,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800',
    popular: true,
    name: {
      it: 'Pulizia Viso Profonda',
      en: 'Deep Facial Cleansing',
      es: 'Limpieza Facial Profunda',
      th: 'ทำความสะอาดผิวหน้าอย่างล้ำลึก',
    },
    categoryLabel: {
      it: 'Trattamenti Viso',
      en: 'Facial Treatments',
      es: 'Tratamientos Faciales',
      th: 'ทรีตเมนต์ผิวหน้า',
    },
    priceLabel: { it: '€ 55', en: '€ 55', es: '55 €', th: '€ 55' },
    description: {
      it: 'Detersione profonda con ultrasuoni, vapore aromatico, spremitura delicata e maschera lenitiva su misura.',
      en: 'Deep ultrasonic cleansing, aromatic steam, gentle extraction and a customized soothing mask.',
      es: 'Higiene facial profunda con ultrasonidos, vapor aromático, extracción delicada y mascarilla calmante personalizada.',
      th: 'ทำความสะอาดผิวหน้าล้ำลึกด้วยคลื่นอัลตราโซนิก ไอน้ำอโรม่า กดสิวอย่างอ่อนโยน และมาสก์ปลอบประโลมผิวเฉพาะบุคคล',
    },
  },
  {
    id: 'illuminante-vitamina-c',
    category: 'viso',
    price: 75,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800',
    popular: true,
    name: {
      it: 'Trattamento Illuminante Vitamina C',
      en: 'Vitamin C Brightening Facial',
      es: 'Tratamiento Iluminador Vitamina C',
      th: 'ทรีตเมนต์วิตามินซีเพื่อผิวกระจ่างใส',
    },
    categoryLabel: {
      it: 'Trattamenti Viso',
      en: 'Facial Treatments',
      es: 'Tratamientos Faciales',
      th: 'ทรีตเมนต์ผิวหน้า',
    },
    priceLabel: { it: '€ 75', en: '€ 75', es: '75 €', th: '€ 75' },
    description: {
      it: 'Protocollo antiossidante intensivo per donare luminosità immediata, uniformare il colorito e contrastare il foto-invecchiamento.',
      en: 'Intensive antioxidant protocol to restore instant radiance, even out skin tone and combat photo-aging.',
      es: 'Protocolo antioxidante intensivo para aportar luminosidad inmediata, unificar el tono y combatir el fotoenvejecimiento.',
      th: 'โปรแกรมต้านอนุมูลอิสระเข้มข้นเพื่อมอบความกระจ่างใสทันที ปรับสีผิวให้สม่ำเสมอ และชะลอริ้วรอยจากแสงแดด',
    },
  },
  {
    id: 'radiofrequenza-viso',
    category: 'viso',
    price: 90,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfaf433393?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Radiofrequenza Viso Anti-Age',
      en: 'Anti-Aging Facial Radiofrequency',
      es: 'Radiofrecuencia Facial Antiedad',
      th: 'คลื่นวิทยุยกกระชับผิวหน้าลดเลือนริ้วรอย',
    },
    categoryLabel: {
      it: 'Trattamenti Viso',
      en: 'Facial Treatments',
      es: 'Tratamientos Faciales',
      th: 'ทรีตเมนต์ผิวหน้า',
    },
    priceLabel: { it: '€ 90', en: '€ 90', es: '90 €', th: '€ 90' },
    description: {
      it: 'Bio-stimolazione del collagene ed elastina con effetto lifting naturale non invasivo fin dalla prima seduta.',
      en: 'Collagen and elastin bio-stimulation with a natural non-invasive lifting effect from the very first session.',
      es: 'Bioestimulación de colágeno y elastina con efecto lifting natural no invasivo desde la primera sesión.',
      th: 'กระตุ้นการสร้างคอลลาเจนและอีลาสติน ยกกระชับผิวอย่างเป็นธรรมชาติโดยไม่ต้องผ่าตัด เห็นผลตั้งแต่ครั้งแรก',
    },
  },
  {
    id: 'peeling-chimico',
    category: 'viso',
    price: 65,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Peeling Chimico Rigenerante',
      en: 'Regenerating Chemical Peel',
      es: 'Peeling Químico Regenerador',
      th: 'ผลัดเซลล์ผิวหน้าด้วยกรดผลไม้ฟื้นฟูผิว',
    },
    categoryLabel: {
      it: 'Trattamenti Viso',
      en: 'Facial Treatments',
      es: 'Tratamientos Faciales',
      th: 'ทรีตเมนต์ผิวหน้า',
    },
    priceLabel: { it: '€ 65', en: '€ 65', es: '65 €', th: '€ 65' },
    description: {
      it: 'Esfoliazione progressiva agli alfa-idrossiacidi per levigare la grana della pelle, ridurre macchie e pori dilatati.',
      en: 'Progressive alpha-hydroxy acid exfoliation to smooth skin texture, fade dark spots and minimize pores.',
      es: 'Exfoliación progresiva con alfahidroxiácidos para alisar la textura de la piel, atenuar manchas y minimizar los poros.',
      th: 'ผลัดเซลล์ผิวอย่างอ่อนโยนด้วย AHA ช่วยให้ผิวเรียบเนียน ลดเลือนจุดด่างดำ และกระชับรูขุมขน',
    },
  },

  // Corpo & Massaggi
  {
    id: 'massaggio-relax',
    category: 'corpo',
    price: 60,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
    popular: true,
    name: {
      it: 'Massaggio Relax Olistico (50 min)',
      en: 'Holistic Relaxing Massage (50 min)',
      es: 'Masaje Relax Holístico (50 min)',
      th: 'นวดผ่อนคลายองค์รวม (50 นาที)',
    },
    categoryLabel: {
      it: 'Body Massage & Corpo',
      en: 'Body & Massage',
      es: 'Masajes y Corporal',
      th: 'นวดและดูแลผิวกาย',
    },
    priceLabel: { it: '€ 60', en: '€ 60', es: '60 €', th: '€ 60' },
    description: {
      it: 'Manovre lente e avvolgenti con oli essenziali caldi per sciogliere lo stress e riequilibrare corpo e mente.',
      en: 'Slow, enveloping strokes with warm essential oils to melt away stress and rebalance body and mind.',
      es: 'Maniobras lentas y envolventes con aceites esenciales templados para liberar el estrés y reequilibrar cuerpo y mente.',
      th: 'การนวดอย่างนุ่มนวลด้วยน้ำมันหอมระเหยอุ่นๆ เพื่อคลายความเครียดและคืนความสมดุลให้ร่างกายและจิตใจ',
    },
  },
  {
    id: 'massaggio-linfodrenante',
    category: 'corpo',
    price: 70,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Massaggio Linfodrenante Vodder',
      en: 'Vodder Lymphatic Drainage Massage',
      es: 'Drenaje Linfático Método Vodder',
      th: 'นวดเดรนน้ำเหลืองเทคนิค Vodder',
    },
    categoryLabel: {
      it: 'Body Massage & Corpo',
      en: 'Body & Massage',
      es: 'Masajes y Corporal',
      th: 'นวดและดูแลผิวกาย',
    },
    priceLabel: { it: '€ 70', en: '€ 70', es: '70 €', th: '€ 70' },
    description: {
      it: 'Tecnica manuale mirata a favorire il drenaggio dei liquidi in eccesso, combattere la ritenzione e donare leggerezza.',
      en: 'Targeted manual technique designed to drain excess fluids, reduce water retention and restore lightness.',
      es: 'Técnica manual enfocada en favorecer la eliminación de líquidos, combatir la retención y aportar ligereza inmediata.',
      th: 'เทคนิคการนวดด้วยมือเพื่อช่วยระบายของเหลวส่วนเกิน ลดอาการบวมน้ำ และมอบความเบาสบายทันที',
    },
  },
  {
    id: 'fango-detox',
    category: 'corpo',
    price: 80,
    duration: 70,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Trattamento Fango Detox Termale',
      en: 'Thermal Detox Mud Wrap',
      es: 'Envoltura de Barro Detox Termal',
      th: 'พอกโคลนน้ำแร่ดีท็อกซ์ผิวกาย',
    },
    categoryLabel: {
      it: 'Body Massage & Corpo',
      en: 'Body & Massage',
      es: 'Masajes y Corporal',
      th: 'นวดและดูแลผิวกาย',
    },
    priceLabel: { it: '€ 80', en: '€ 80', es: '80 €', th: '€ 80' },
    description: {
      it: 'Impacco minerale detossinante e rimodellante con termocoperta e massaggio riattivante finale.',
      en: 'Detoxifying and sculpting mineral mud wrap with thermal blanket and a revitalizing finishing massage.',
      es: 'Envoltura mineral desintoxicante y remodelante con manta térmica y masaje reactivador final.',
      th: 'พอกโคลนแร่ธาตุขับสารพิษและกระชับสัดส่วนพร้อมผ้าห่มความร้อน ปิดท้ายด้วยนวดกระตุ้นการไหลเวียน',
    },
  },
  {
    id: 'scrub-corpo-sali',
    category: 'corpo',
    price: 45,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Scrub Corpo ai Sali Marini & Karité',
      en: 'Sea Salt & Shea Butter Body Scrub',
      es: 'Exfoliación Corporal con Sales Marinas y Karité',
      th: 'สครับผิวกายด้วยเกลือทะเลและเชียร์บัตเตอร์',
    },
    categoryLabel: {
      it: 'Body Massage & Corpo',
      en: 'Body & Massage',
      es: 'Masajes y Corporal',
      th: 'นวดและดูแลผิวกาย',
    },
    priceLabel: { it: '€ 45', en: '€ 45', es: '45 €', th: '€ 45' },
    description: {
      it: 'Esfoliazione rigenerante ai cristalli di sale del Mar Morto e oli botanici per una pelle di seta.',
      en: 'Regenerating exfoliation with Dead Sea salt crystals and botanical oils for silky-smooth skin.',
      es: 'Renovación corporal con cristales de sal del Mar Muerto y aceites botánicos para una piel sedosa.',
      th: 'ขัดผิวฟื้นฟูด้วยผลึกเกลือเดดซีและน้ำมันพฤกษชาติ เพื่อผิวเนียนนุ่มดุจแพรไหม',
    },
  },

  // Epilazione Laser
  {
    id: 'laser-zona-piccola',
    category: 'laser',
    price: 35,
    duration: 25,
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Epilazione Laser Diodo — Zona Piccola',
      en: 'Diode Laser Hair Removal — Small Area',
      es: 'Depilación Láser Diodo — Zona Pequeña',
      th: 'เลเซอร์ไดโอดกำจัดขน — จุดเล็ก',
    },
    categoryLabel: {
      it: 'Epilazione Laser',
      en: 'Laser Hair Removal',
      es: 'Depilación Láser',
      th: 'เลเซอร์กำจัดขน',
    },
    priceLabel: { it: '€ 35', en: '€ 35', es: '35 €', th: '€ 35' },
    description: {
      it: 'Seduta laser a diodo 808nm indolore per viso, ascelle o inguine. Sicuro ed efficace su tutti i fototipi.',
      en: 'Painless 808nm diode laser session for face, underarms or bikini line. Safe and effective on all skin types.',
      es: 'Sesión de láser de diodo 808nm indoloro para rostro, axilas o ingles. Seguro y eficaz en todos los fototipos.',
      th: 'เลเซอร์ไดโอด 808nm ไม่เจ็บ สำหรับใบหน้า รักแร้ หรือบิกินี่ ปลอดภัยและได้ผลกับทุกสภาพผิว',
    },
  },
  {
    id: 'laser-gambe-inguine',
    category: 'laser',
    price: 95,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&q=80&w=800',
    popular: true,
    name: {
      it: 'Epilazione Laser Diodo — Gambe & Inguine',
      en: 'Diode Laser Hair Removal — Legs & Bikini',
      es: 'Depilación Láser Diodo — Piernas e Ingles',
      th: 'เลเซอร์ไดโอดกำจัดขน — ขาและบิกินี่',
    },
    categoryLabel: {
      it: 'Epilazione Laser',
      en: 'Laser Hair Removal',
      es: 'Depilación Láser',
      th: 'เลเซอร์กำจัดขน',
    },
    priceLabel: { it: '€ 95', en: '€ 95', es: '95 €', th: '€ 95' },
    description: {
      it: 'Trattamento laser progressivo permanente per gambe complete e inguine con manipolo raffreddato.',
      en: 'Permanent progressive laser treatment for full legs and bikini line with an ultra-cooled handpiece.',
      es: 'Tratamiento láser progresivo permanente para piernas completas e ingles con cabezal ultra-refrigerado.',
      th: 'โปรแกรมเลเซอร์กำจัดขนถาวรสำหรับขาทั้งสองข้างและบิกินี่ ด้วยหัวเลเซอร์ระบบความเย็นพิเศษ',
    },
  },
  {
    id: 'laser-total-body',
    category: 'laser',
    price: 150,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Epilazione Laser Diodo — Total Body',
      en: 'Diode Laser Hair Removal — Full Body',
      es: 'Depilación Láser Diodo — Cuerpo Completo',
      th: 'เลเซอร์ไดโอดกำจัดขน — ทั่วเรือนร่าง',
    },
    categoryLabel: {
      it: 'Epilazione Laser',
      en: 'Laser Hair Removal',
      es: 'Depilación Láser',
      th: 'เลเซอร์กำจัดขน',
    },
    priceLabel: { it: '€ 150', en: '€ 150', es: '150 €', th: '€ 150' },
    description: {
      it: 'Pacchetto seduta completa corpo per una pelle liscia e libera dai peli superflui in modo duraturo.',
      en: 'Complete full-body session package for long-lasting smooth and hair-free skin.',
      es: 'Sesión integral de cuerpo completo para lucir una piel suave y libre de vello de forma duradera.',
      th: 'แพ็กเกจเลเซอร์ทั่วเรือนร่าง เพื่อผิวเรียบเนียนไร้ขนอย่างยาวนาน',
    },
  },

  // Manicure & Pedicure
  {
    id: 'manicure-spa-semipermanente',
    category: 'mani-piedi',
    price: 40,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800',
    popular: true,
    name: {
      it: 'Manicure Spa & Semipermanente',
      en: 'Spa Manicure & Gel Polish',
      es: 'Manicura Spa y Esmaltado Semipermanente',
      th: 'สปาเล็บมือและทาสีเจลกึ่งถาวร',
    },
    categoryLabel: {
      it: 'Manicure & Pedicure',
      en: 'Manicure & Pedicure',
      es: 'Manicura y Pedicura',
      th: 'ทำเล็บมือและเท้า',
    },
    priceLabel: { it: '€ 40', en: '€ 40', es: '40 €', th: '€ 40' },
    description: {
      it: 'Cura meticolosa di unghie e cuticole, scrub idratante mani e applicazione smalto semipermanente rinforzato.',
      en: 'Meticulous nail and cuticle care, hydrating hand scrub and long-lasting reinforced gel polish.',
      es: 'Cuidado meticuloso de uñas y cutículas, exfoliación hidratante de manos y esmaltado semipermanente de larga duración.',
      th: 'ดูแลเล็บและจมูกเล็บอย่างพิถีพิถัน สครับเติมความชุ่มชื้นให้มือ และทาสีเจลติดทนนาน',
    },
  },
  {
    id: 'pedicure-curativo-spa',
    category: 'mani-piedi',
    price: 55,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Pedicure Curativo & Spa Ritual',
      en: 'Restorative Pedicure & Spa Ritual',
      es: 'Pedicura Spa y Ritual Relajante',
      th: 'สปาเท้าและทรีตเมนต์บำรุงล้ำลึก',
    },
    categoryLabel: {
      it: 'Manicure & Pedicure',
      en: 'Manicure & Pedicure',
      es: 'Manicura y Pedicura',
      th: 'ทำเล็บมือและเท้า',
    },
    priceLabel: { it: '€ 55', en: '€ 55', es: '55 €', th: '€ 55' },
    description: {
      it: 'Trattamento estetico e curativo completo con pediluvio aromatico, levigatura, massaggio plantare e smalto.',
      en: 'Complete aesthetic and restorative foot treatment with aromatic bath, callus smoothing, foot massage and polish.',
      es: 'Tratamiento estético y reparador completo con baño aromático, alisado plantar, masaje podal y esmaltado.',
      th: 'ดูแลสุขภาพและความงามของเท้าครบวงจร แช่เท้าอโรม่า ขัดส้นเท้า นวดฝ่าเท้า และทาสีเล็บ',
    },
  },
  {
    id: 'ricostruzione-gel',
    category: 'mani-piedi',
    price: 70,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?auto=format&fit=crop&q=80&w=800',
    name: {
      it: 'Ricostruzione Unghie in Gel & Nail Art',
      en: 'Gel Nail Extensions & Nail Art',
      es: 'Uñas Esculpidas en Gel y Nail Art',
      th: 'ต่อเล็บเจลและเพ้นท์เล็บดีไซน์พิเศษ',
    },
    categoryLabel: {
      it: 'Manicure & Pedicure',
      en: 'Manicure & Pedicure',
      es: 'Manicura y Pedicura',
      th: 'ทำเล็บมือและเท้า',
    },
    priceLabel: { it: '€ 70', en: '€ 70', es: '70 €', th: '€ 70' },
    description: {
      it: 'Allungamento o copertura in gel di altissima qualità con finitura elegante e personalizzata.',
      en: 'Premium gel nail extension or overlay with an elegant finish and bespoke hand-painted nail art.',
      es: 'Extensión o recubrimiento en gel de alta gama con acabado elegante y diseño personalizado a mano alzada.',
      th: 'ต่อเล็บหรือเคลือบเจลคุณภาพสูง พร้อมดีไซน์หรูหราเฉพาะบุคคล',
    },
  },
];

export function getTreatments(lang: Language): Treatment[] {
  return RAW_TREATMENTS.map((t) => ({
    id: t.id,
    category: t.category,
    price: t.price,
    duration: t.duration,
    image: t.image,
    popular: t.popular,
    name: t.name[lang],
    categoryLabel: t.categoryLabel[lang],
    priceLabel: t.priceLabel[lang],
    description: t.description[lang],
  }));
}

export const TREATMENTS: Treatment[] = getTreatments('it');

const RAW_SPECIALISTS: {
  id: string;
  avatar: string;
  name: Record<Language, string>;
  role: Record<Language, string>;
  bio: Record<Language, string>;
}[] = [
  {
    id: 'any',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    name: {
      it: 'Qualsiasi Specialista Disponibile',
      en: 'Any Available Specialist',
      es: 'Cualquier Especialista Disponible',
      th: 'ผู้เชี่ยวชาญท่านใดก็ได้ที่ว่าง',
    },
    role: {
      it: 'Assegnazione prioritaria',
      en: 'Priority assignment',
      es: 'Asignación prioritaria',
      th: 'จัดสรรคิวพิเศษอัตโนมัติ',
    },
    bio: {
      it: 'Massima disponibilità di orari con le nostre estetiste senior qualificate.',
      en: 'Maximum schedule availability with our qualified senior estheticians.',
      es: 'Máxima disponibilidad horaria con nuestras especialistas sénior cualificadas.',
      th: 'เลือกเวลาได้หลากหลายที่สุดกับผู้เชี่ยวชาญอาวุโสของเรา',
    },
  },
  {
    id: 'elena-rossi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    name: {
      it: 'Elena Rossi',
      en: 'Elena Rossi',
      es: 'Elena Morales',
      th: 'Elena Rossi',
    },
    role: {
      it: 'Direttrice Tecnica • Viso & Laser',
      en: 'Technical Director • Facial & Laser',
      es: 'Directora Técnica • Facial y Láser',
      th: 'ผู้อำนวยการฝ่ายเทคนิค • ผิวหน้าและเลเซอร์',
    },
    bio: {
      it: '15 anni di esperienza in estetica avanzata, radiofrequenza e protocolli anti-age.',
      en: '15 years of experience in advanced aesthetics, radiofrequency and anti-aging protocols.',
      es: '15 años de experiencia en estética avanzada, radiofrecuencia y protocolos antiedad.',
      th: 'ประสบการณ์กว่า 15 ปีด้านความงามขั้นสูง คลื่นวิทยุ และโปรแกรมชะลอวัย',
    },
  },
  {
    id: 'sofia-conti',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    name: {
      it: 'Sofia Conti',
      en: 'Sofia Conti',
      es: 'Sofía Mendoza',
      th: 'Sofia Conti',
    },
    role: {
      it: 'Holistic & Body Massage Therapist',
      en: 'Holistic & Body Massage Therapist',
      es: 'Terapeuta Holística y Masaje Corporal',
      th: 'ผู้เชี่ยวชาญการนวดองค์รวมและผิวกาย',
    },
    bio: {
      it: 'Specializzata in massaggio linfodrenante metodo Vodder, rituali termali e aromaterapia.',
      en: 'Specialized in Vodder lymphatic drainage, thermal spa rituals and aromatherapy.',
      es: 'Especializada en drenaje linfático método Vodder, rituales termales y aromaterapia.',
      th: 'เชี่ยวชาญด้านการนวดเดรนน้ำเหลือง Vodder สปาน้ำแร่ และอโรมาเธอราพี',
    },
  },
  {
    id: 'giulia-verdi',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    name: {
      it: 'Giulia Ferri',
      en: 'Giulia Ferri',
      es: 'Lucía Navarro',
      th: 'Giulia Ferri',
    },
    role: {
      it: 'Master Nail & Spa Specialist',
      en: 'Master Nail & Spa Specialist',
      es: 'Master Nail & Spa Specialist',
      th: 'ผู้เชี่ยวชาญด้านเล็บและสปามือเท้า',
    },
    bio: {
      it: 'Esperta in manicure russa, ricostruzione gel, pedicure curativo e rituali mani/piedi.',
      en: 'Expert in Russian manicure, gel extensions, restorative pedicure and hand/foot rituals.',
      es: 'Experta en manicura rusa, uñas esculpidas en gel, pedicura spa y rituales de manos y pies.',
      th: 'เชี่ยวชาญด้านทำเล็บสไตล์รัสเซีย ต่อเล็บเจล สปาเท้า และทรีตเมนต์บำรุงมือและเท้า',
    },
  },
];

export function getSpecialists(lang: Language): Specialist[] {
  return RAW_SPECIALISTS.map((s) => ({
    id: s.id,
    avatar: s.avatar,
    name: s.name[lang],
    role: s.role[lang],
    bio: s.bio[lang],
  }));
}

export const SPECIALISTS: Specialist[] = getSpecialists('it');

export const WELCOME_DRINKS_BY_LANG: Record<Language, string[]> = {
  it: [
    'Tisana Rilassante Camomilla & Fiori d’Arancio',
    'Infuso Detox Zenzero, Limone & Menta',
    'Acqua Cristallina Aromatizzata ai Frutti Rossi',
    'Caffè Espresso / Ginseng',
    'Nessuna preferenza',
  ],
  en: [
    'Relaxing Chamomile & Orange Blossom Herbal Tea',
    'Detox Ginger, Lemon & Mint Infusion',
    'Red Berry Infused Crystal Water',
    'Espresso / Ginseng Coffee',
    'No preference',
  ],
  es: [
    'Infusión Relajante de Manzanilla y Azahar',
    'Té Detox de Jengibre, Limón y Menta',
    'Agua Cristalina Aromatizada con Frutos Rojos',
    'Café Espresso / Descafeinado',
    'Sin preferencia',
  ],
  th: [
    'ชาคาโมมายล์และดอกส้มผ่อนคลาย',
    'ชาดีท็อกซ์ขิง มะนาว และมิ้นต์',
    'น้ำแร่ผสมผลไม้ตระกูลเบอร์รี่',
    'กาแฟเอสเปรสโซ / โสม',
    'ไม่ระบุ',
  ],
};

export const WELCOME_DRINKS = WELCOME_DRINKS_BY_LANG.it;

export const ATMOSPHERES_BY_LANG: Record<Language, string[]> = {
  it: [
    'Musica Ambient & Suoni della Natura',
    'Silenzio Totale (Silent Appointment)',
    'Jazz Soft & Lounge Rilassante',
    'Consulenza Beauty Personalizzata',
  ],
  en: [
    'Ambient Music & Nature Sounds',
    'Complete Silence (Silent Appointment)',
    'Soft Jazz & Relaxing Lounge',
    'Personalized Beauty Consultation',
  ],
  es: [
    'Música Ambient y Sonidos de la Naturaleza',
    'Silencio Total (Silent Appointment)',
    'Jazz Suave y Lounge Relajante',
    'Asesoramiento Beauty Personalizado',
  ],
  th: [
    'ดนตรีบรรเลงและเสียงธรรมชาติ',
    'ความเงียบสงบส่วนตัว (Silent Appointment)',
    'เพลงแจ๊สเบาๆ และเลานจ์ผ่อนคลาย',
    'รับคำปรึกษาด้านความงามเฉพาะบุคคล',
  ],
};

export const ATMOSPHERES = ATMOSPHERES_BY_LANG.it;

export function getAvailableTimeSlots(dateStr: string): string[] {
  if (!dateStr) return [];
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getDay() === 0) {
    return [];
  }
  return [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];
}
