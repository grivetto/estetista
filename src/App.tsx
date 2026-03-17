/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  Phone, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Star,
  Sparkles,
  Flower2,
  Heart,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SERVICES_DATA = [
  {
    title: "Trattamenti Viso",
    description: "Rituali rigeneranti e anti-age per una pelle luminosa e visibilmente più giovane.",
    icon: <Sparkles className="text-gold" size={32} />,
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Body Massage",
    description: "Massaggi decontratturanti e rilassanti per sciogliere le tensioni e ritrovare l'armonia.",
    icon: <Flower2 className="text-gold" size={32} />,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Epilazione Laser",
    description: "Tecnologia laser a diodo per una pelle liscia in modo permanente, sicuro ed efficace.",
    icon: <Heart className="text-gold" size={32} />,
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Manicure & Pedicure",
    description: "Cura professionale per mani e piedi con smalti semipermanenti e trattamenti spa.",
    icon: <Scissors className="text-gold" size={32} />,
    image: "https://images.unsplash.com/photo-1610992015732-2449b0c26670?auto=format&fit=crop&q=80&w=800"
  }
];

const Navbar = () => {
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
    { name: 'Contatti', href: '#contatti' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-serif tracking-widest text-gold">
          AURA
          <span className="block text-[10px] tracking-[0.3em] font-sans text-stone-400 -mt-1">BEAUTY & WELLNESS</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm uppercase tracking-widest hover:text-gold transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
          <button className="bg-gold text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-stone-800 transition-all duration-300">
            Prenota
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-stone-800" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl py-8 md:hidden flex flex-col items-center space-y-6"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-widest"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-gold text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest">
              Prenota Ora
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Spa Atmosphere" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-900/30"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block text-white uppercase tracking-[0.5em] text-sm mb-6"
        >
          L'essenza del benessere
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
        >
          <button className="bg-white text-stone-800 px-10 py-4 rounded-full text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl">
            Prenota un Trattamento
          </button>
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
            <span className="text-gold uppercase tracking-widest text-sm mb-4 block">La nostra filosofia</span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-snug">
              Un santuario di pace <br /> dedicato alla tua <span className="italic font-normal">bellezza</span>
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6 text-lg">
              In Aura Beauty & Wellness, crediamo che la vera bellezza nasca dall'equilibrio tra corpo e mente. Il nostro centro non è solo un luogo di trattamenti estetici, ma un rifugio dove il tempo si ferma per lasciar spazio alla cura di sé.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Il nostro team di esperti altamente qualificati utilizza tecnologie all'avanguardia e prodotti biologici di altissima qualità per garantirti risultati visibili in un'atmosfera di totale relax. Ogni percorso è personalizzato per rispondere alle tue esigenze uniche.
            </p>
            <div className="flex space-x-8">
              <div>
                <span className="block text-3xl font-serif text-gold">15+</span>
                <span className="text-xs uppercase tracking-widest text-stone-400">Anni di Esperienza</span>
              </div>
              <div>
                <span className="block text-3xl font-serif text-gold">5k+</span>
                <span className="text-xs uppercase tracking-widest text-stone-400">Clienti Felici</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="servizi" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold uppercase tracking-widest text-sm mb-4 block">I nostri servizi</span>
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
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl mb-3">{service.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <a href="#" className="text-xs uppercase tracking-widest text-gold font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                  Scopri di più <ChevronRight size={14} className="ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PriceList = () => {
  const categories = [
    {
      name: "Viso",
      items: [
        { name: "Pulizia Viso Profonda", price: "€ 55" },
        { name: "Trattamento Illuminante Vitamina C", price: "€ 75" },
        { name: "Radiofrequenza Viso", price: "€ 90" },
        { name: "Peeling Chimico", price: "€ 65" },
      ]
    },
    {
      name: "Corpo",
      items: [
        { name: "Massaggio Relax (50 min)", price: "€ 60" },
        { name: "Massaggio Linfodrenante", price: "€ 70" },
        { name: "Trattamento Fango Detox", price: "€ 80" },
        { name: "Scrub Corpo ai Sali Marini", price: "€ 45" },
      ]
    }
  ];

  return (
    <section id="listino" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Listino Trattamenti</h2>
          <p className="text-stone-400 italic">Prezzi trasparenti per la tua bellezza</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h3 className="text-2xl mb-8 text-gold italic border-b border-stone-100 pb-2">{cat.name}</h3>
              <div className="space-y-6">
                {cat.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-end group">
                    <div className="flex-1">
                      <span className="text-stone-800 group-hover:text-gold transition-colors">{item.name}</span>
                      <div className="border-b border-dotted border-stone-200 flex-1 mx-4 mb-1"></div>
                    </div>
                    <span className="font-medium text-stone-900">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="border border-gold text-gold px-10 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
            Scarica il Listino Completo (PDF)
          </button>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Elena Rossi",
      text: "Un'esperienza incredibile. Il massaggio è stato il migliore che abbia mai ricevuto. L'ambiente è raffinato e il personale gentilissimo.",
      rating: 5
    },
    {
      name: "Marco Bianchi",
      text: "Centro all'avanguardia. Ho iniziato il percorso laser e i risultati sono già visibili dopo poche sedute. Consigliatissimo!",
      rating: 5
    },
    {
      name: "Giulia Verdi",
      text: "La pulizia del viso è stata un vero rituale di bellezza. La mia pelle non è mai stata così luminosa. Tornerò sicuramente.",
      rating: 5
    }
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
              <p className="text-stone-600 italic mb-8 leading-relaxed">"{review.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold mr-3">
                  {review.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold uppercase tracking-widest">{review.name}</span>
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
            <h2 className="text-4xl mb-8">Prenota la tua Esperienza</h2>
            <p className="text-stone-500 mb-12">Siamo a tua disposizione per qualsiasi informazione o per fissare il tuo prossimo appuntamento di benessere.</p>
            
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
              <a href="#" className="w-12 h-12 border border-stone-200 rounded-full flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 border border-stone-200 rounded-full flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all">
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
                  <h3 className="text-2xl mb-4">Richiesta Ricevuta!</h3>
                  <p className="text-stone-500">Ti contatteremo al più presto per confermare il tuo appuntamento. Grazie per aver scelto Aura.</p>
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
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Nome Completo</label>
                      <input required type="text" className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none" placeholder="Il tuo nome" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Telefono</label>
                      <input required type="tel" className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none" placeholder="+39 000 0000000" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Email</label>
                    <input required type="email" className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none" placeholder="La tua email" />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Servizio</label>
                    <select required className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none appearance-none">
                      <option value="">Seleziona un servizio</option>
                      {SERVICES_DATA.map((service) => (
                        <option key={service.title} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Data</label>
                      <input required type="date" className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Orario</label>
                      <input required type="time" className="w-full bg-white border-none rounded-xl p-4 focus:ring-2 focus:ring-gold outline-none" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-gold text-white py-4 rounded-xl uppercase tracking-widest text-sm font-semibold hover:bg-stone-800 transition-all shadow-lg shadow-gold/20">
                    Prenota Ora
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

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <span className="text-2xl font-serif tracking-widest text-gold">AURA</span>
            <p className="text-stone-500 text-xs tracking-widest mt-2 uppercase">L'eccellenza del benessere a Roma</p>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest">Cookie Policy</a>
            <a href="#" className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-widest">Termini e Condizioni</a>
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

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <PriceList />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
