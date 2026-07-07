import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wine, 
  Sparkles, 
  Check, 
  Compass, 
  Clock, 
  Star, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Maximize2, 
  Layers, 
  X,
  Menu,
  Award,
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';
import { Language } from '../types';
import { SafeImage } from '../components/SafeImage';

import ginTonicGlassImage from '../assets/images/gin_tonic_glass_1781915165098.jpg'; // We can use the imported assets or standard ones
import whiskyGlassImage from '../assets/images/whisky_glass_1781915175904.jpg';
import redWineBottleImage from '../assets/images/red_wine_bottle_1781915117883.jpg';
import sparklingWineBottleImage from '../assets/images/sparkling_wine_bottle_1781915143116.jpg';

interface LandingPageViewProps {
  lang: Language;
  onEnterSite: () => void;
  onEnterVIP: () => void;
  onOpenLogin: () => void;
}

export default function LandingPageView({ 
  lang, 
  onEnterSite, 
  onEnterVIP,
  onOpenLogin 
}: LandingPageViewProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [compareVip, setCompareVip] = useState(true);

  // Smooth scroll and solid menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const text = {
    'pt-BR': {
      brand: 'Event Drink',
      brandSub: 'CLUBE EXCLUSIVO',
      heroTag: 'EXPERIÊNCIA PREMIUM DE ALTA CLASSE',
      heroTitle: 'A Arte de Celebrar com Cocktails Memoráveis',
      heroSub: 'Elevando casamentos, eventos corporativos e celebrações de elite através de bartenders premiados, ingredientes orgânicos exclusivos e tecnologia inteligente de logística.',
      ctaPrimary: 'Entrar no Planejador',
      ctaSecondary: 'Conhecer Clube Event Drink',
      socialProof: 'Sua plataforma inteligente de gestão e mixologia para eventos.',
      menuHome: 'Início',
      menuBenefits: 'Benefícios',
      menuHowItWorks: 'Como Funciona',
      menuEvents: 'Eventos',
      menuGallery: 'Galeria',
      menuTestimonials: 'Depoimentos',
      menuCompare: 'Clube',
      menuContact: 'Contato',
      menuLogin: 'Acessar Clube',
      benefitsTitle: 'Por que a Event Drink é incomparável?',
      benefitsSub: 'Compromisso obstinado com excelência estética, mixologia molecular e gestão impecável de estoque para o seu evento.',
      b1: 'Bartenders Campeões',
      b1Desc: 'Nossos profissionais são premiados e treinados para entregar alta hospitalidade teatral.',
      b2: 'Ingredientes Puros & Orgânicos',
      b2Desc: 'Xaropes botânicos artesanais, frutas selecionadas a vácuo e destilados de origem premium.',
      b3: 'Estrutura Completa de Design',
      b3Desc: 'Balcões iluminados em ardósia, copos de cristal lapidado e cardápios autorais requintados.',
      b4: 'Suporte & Atendimento 1-on-1',
      b4Desc: 'Planejador exclusivo de bebidas e concierge disponível via WhatsApp 24 horas por dia.',
      b5: 'Pontualidade Britânica',
      b5Desc: 'Logística digital monitorada por GPS e montagem com antecedência absoluta de 3 horas.',
      b6: 'Cálculo Inteligente de Suprimentos',
      b6Desc: 'Nosso algoritmo avançado elimina o desperdício, calibrando a quantidade exata de garrafas e gelo.',
      timelineTitle: 'Como Criamos Sua Experiência',
      timelineSub: 'Quatro passos fluidos do primeiro clique ao último brinde.',
      t1: 'Solicite o Orçamento',
      t1Desc: 'Use nossa inteligência artificial para planejar de acordo com o número de convidados.',
      t2: 'Escolha seu Cardápio',
      t2Desc: 'Explore e selecione receitas premium ou crie drinks autorais no laboratório.',
      t3: 'Preparamos Tudo',
      t3Desc: 'Cuidamos do frete, gelo, decoração, copos de cristal e bartenders.',
      t4: 'Seu Evento Acontece',
      t4Desc: 'Um show de mixologia inesquecível e celebração impecável para você e seus convidados.',
      eventsTitle: 'Experiências sob Medida para Celebrar',
      eventsSub: 'Adaptamos nossa coreografia para harmonizar perfeitamente com a alma do seu evento.',
      ev1: 'Casamentos Nobres',
      ev1Desc: 'Mixologia sofisticada e atendimento de gala para eternizar o grande dia com glamour.',
      ev2: 'Corporativos de Prestígio',
      ev2Desc: 'Cocktails elegantes, ativação de marcas e networking fluido para grandes empresas.',
      ev3: 'Formaturas Memoráveis',
      ev3Desc: 'Energia contagiante, agilidade máxima no bar e menus dinâmicos para a noite inteira.',
      ev4: 'Celebrações Privadas',
      ev4Desc: 'Experiências intimistas, aniversários e jantares exclusivos guiados por sommeliers.',
      galleryTitle: 'A Estética de Nossas Criações',
      gallerySub: 'Mosaico visual de cocktails reais, estruturas requintadas e noites memoráveis.',
      compareTitle: 'O Clube Event Drink',
      compareSub: 'Escolha a forma perfeita de se conectar ao ecossistema Event Drink. Do planejamento gratuito à alta coquetelaria exclusiva.',
      thColFree: 'Navegação Grátis',
      thColVip: 'Membro Clube VIP ✨',
      ctaFinalTitle: 'Pronto para Elevar Seu Próximo Evento?',
      ctaFinalSub: 'Seja simulando seu consumo em 30 segundos ou ingressando no Clube Event Drink para obter receitas secretas e consultorias exclusivas.',
      ctaFinalBtn: 'Iniciar Planejamento de Bebidas',
      lightboxClose: 'Fechar',
      lightboxCaption: 'Imagem Oficial do Portfólio Event Drink',
    },
    'en': {
      brand: 'Event Drink',
      brandSub: 'EXCLUSIVE CLUB',
      heroTag: 'HIGH-CLASS PREMIUM COCKTAIL EXPERIENCE',
      heroTitle: 'The True Art of Luxurious Craft Cocktails',
      heroSub: 'Elevating elite weddings, corporate summits, and high-society parties with award-winning bartenders, organic ingredients, and smart logistics.',
      ctaPrimary: 'Access Planner',
      ctaSecondary: 'Discover VIP Club',
      socialProof: 'Your intelligent logistics and mixology platform for premium events.',
      menuHome: 'Home',
      menuBenefits: 'Benefits',
      menuHowItWorks: 'How It Works',
      menuEvents: 'Events',
      menuGallery: 'Gallery',
      menuTestimonials: 'Reviews',
      menuCompare: 'Club Tiers',
      menuContact: 'Contact',
      menuLogin: 'Access Club',
      benefitsTitle: 'What Makes Us Indispensable',
      benefitsSub: 'An absolute obsession with visual harmony, molecular mixology, and impeccable event bar management.',
      b1: 'Award-Winning Mixologists',
      b1Desc: 'Our bar staff are champions of mixology, trained to offer theatrical service.',
      b2: 'Pure Organic Syrups',
      b2Desc: 'Artisanal botanical extracts, fresh organic fruits, and premium local spirits.',
      b3: 'High-End Setup & Glassware',
      b3Desc: 'Backlit luxury bar designs, cut crystal glassware, and gorgeous custom menus.',
      b4: '1-on-1 Concierge Care',
      b4Desc: 'Exclusive drink sommelier and support available via WhatsApp 24 hours a day.',
      b5: 'Flawless Punctuality',
      b5Desc: 'GPS-guided arrival times and absolute pre-setup of 3 hours before start.',
      b6: 'Smart Bottle Calculator',
      b6Desc: 'Our proprietary algorithm prevents wastage, suggesting the perfect count of ingredients.',
      timelineTitle: 'Our Flawless Process',
      timelineSub: 'Four seamless milestones from your first click to the final toast.',
      t1: 'Request Quote',
      t1Desc: 'Utilize our state-of-the-art calculator to project consumption limits easily.',
      t2: 'Curate Your Menu',
      t2Desc: 'Select gourmet recipe presets or customize unique flavors in our interactive lab.',
      t3: 'We Set Up Everything',
      t3Desc: 'We manage delivery, ice, decorations, crystal glasses, and professional staff.',
      t4: 'Celebrate Seamlessly',
      t4Desc: 'Enjoy theatrical beverage spectacles that your guests will talk about for years.',
      eventsTitle: 'Bespoke Themes for Every Occasion',
      eventsSub: 'We adapt our visual identity and choreography to match the heart of your party.',
      ev1: 'Luxury Weddings',
      ev1Desc: 'Sophisticated bar styling and premium service to cherish your special day forever.',
      ev2: 'Elite Corporate Events',
      ev2Desc: 'Polished client hosting, brand activations, and signature cocktails for corporations.',
      ev3: 'Exclusive Galas',
      ev3Desc: 'High-energy bartenders, elegant layouts, and lightning-fast serving speeds.',
      ev4: 'Private Celebrations',
      ev4Desc: 'Intimate birthdays, wine pairings, and luxury chef-dinners led by sommeliers.',
      galleryTitle: 'A Feast for the Senses',
      gallerySub: 'A beautiful visual display of real cocktails, setups, and exquisite nights.',
      compareTitle: 'The Event Drink Club',
      compareSub: 'Select the optimal tier for your event. From instant digital calculators to premium masterclass access.',
      thColFree: 'Free Digital Access',
      thColVip: 'VIP Club Member ✨',
      ctaFinalTitle: 'Ready to Host an Unforgettable Night?',
      ctaFinalSub: 'Whether budgeting your supply list in 30 seconds or joining the Club to unlock rare recipes.',
      ctaFinalBtn: 'Launch Beverage Planner Now',
      lightboxClose: 'Close',
      lightboxCaption: 'Official Event Drink Portfolio Photo',
    }
  }[lang];

  // Gallery items database
  const galleryItems = [
    {
      id: 'g1',
      title: lang === 'pt-BR' ? 'A Alquimia Perfeita' : 'The Perfect Mix',
      desc: lang === 'pt-BR' ? 'Gin tônica molecular com infusão cítrica.' : 'Molecular gin with citrus infusion.',
      url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g2',
      title: lang === 'pt-BR' ? 'Casamento Imperial' : 'Imperial Ballroom Setup',
      desc: lang === 'pt-BR' ? 'Balcão revestido em ardósia dourada.' : 'Golden backlit slate luxury bar setup.',
      url: 'https://images.unsplash.com/photo-1541256996761-85df2efee164?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g3',
      title: lang === 'pt-BR' ? 'Whisky Defumado' : 'Smoked Single-Malt',
      desc: lang === 'pt-BR' ? 'Dose premium com infusão de carvalho e canela.' : 'Premium oak and cinnamon-smoked presentation.',
      url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g4',
      title: lang === 'pt-BR' ? 'Ativação Corporativa' : 'Sleek Corporate Bar',
      desc: lang === 'pt-BR' ? 'Coquetelaria sutil e moderna para negócios.' : 'Polished branding bar for elite networks.',
      url: 'https://images.unsplash.com/photo-1530958212628-11b76d449f36?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g5',
      title: lang === 'pt-BR' ? 'Clube Secreto' : 'The Speakeasy Vibe',
      desc: lang === 'pt-BR' ? 'Serviço misterioso e sofisticado de bar.' : 'Deep, moody cocktail performance for private rooms.',
      url: 'https://images.unsplash.com/photo-1510626176961-4b57d4f40208?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g6',
      title: lang === 'pt-BR' ? 'Vinho & Harmonização' : 'Grand Fine Wine Cellar',
      desc: lang === 'pt-BR' ? 'Seleção impecável de tintos e espumantes.' : 'Curated vintage red wines and champagne tiers.',
      url: redWineBottleImage,
    }
  ];

  // Testimonials database loaded dynamically from local database (localStorage)
  const [testimonials, setTestimonials] = useState<{name: string; role: string; text: string; stars: number; avatar: string}[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_testimonials');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const benefitsList = [
    { title: text.b1, desc: text.b1Desc, icon: <Award className="w-6 h-6 text-[#fe9d00]" /> },
    { title: text.b2, desc: text.b2Desc, icon: <Flame className="w-6 h-6 text-orange-500" /> },
    { title: text.b3, desc: text.b3Desc, icon: <Wine className="w-6 h-6 text-yellow-400" /> },
    { title: text.b4, desc: text.b4Desc, icon: <Compass className="w-6 h-6 text-[#a2d729]" /> },
    { title: text.b5, desc: text.b5Desc, icon: <Clock className="w-6 h-6 text-cyan-400" /> },
    { title: text.b6, desc: text.b6Desc, icon: <Layers className="w-6 h-6 text-blue-400" /> },
  ];

  return (
    <div id="landing-page-root" className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-[#fe9d00]/30 overflow-hidden relative">
      
      {/* Golden spotlight ambient glows */}
      <div className="absolute top-[10%] left-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-64 h-64 sm:w-[500px] sm:h-[500px] rounded-full bg-orange-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[6%] w-64 h-64 sm:left-[20%] sm:w-96 sm:h-96 rounded-full bg-[#a2d729]/5 blur-[120px] pointer-events-none" />

      {/* 1. STICKY PREMIUM HEADER */}
      <header 
        id="landing-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-neutral-900 py-3 shadow-lg' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-0 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between">
          <div 
            className="hidden sm:flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#ff5d00] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Wine className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div className="text-left leading-none">
              <span className="text-sm font-extrabold uppercase tracking-wider text-white block">
                {text.brand}
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#fe9d00] font-bold block mt-0.5">
                {text.brandSub}
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wide text-neutral-400">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">{text.menuHome}</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors cursor-pointer">{text.menuBenefits}</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">{text.menuHowItWorks}</button>
            <button onClick={() => scrollToSection('events')} className="hover:text-white transition-colors cursor-pointer">{text.menuEvents}</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-white transition-colors cursor-pointer">{text.menuGallery}</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-white transition-colors cursor-pointer">{text.menuTestimonials}</button>
            <button onClick={() => scrollToSection('club-tiers')} className="hover:text-white transition-colors cursor-pointer">{text.menuCompare}</button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              id="landing-signin-btn"
              onClick={onOpenLogin}
              className="hidden sm:inline-flex items-center space-x-2 text-xs font-bold text-[#fe9d00] hover:text-white hover:bg-[#fe9d00]/10 px-4 py-2 rounded-full border border-[#fe9d00]/30 transition-all cursor-pointer"
            >
              <span>{text.menuLogin}</span>
            </button>

            <button
              id="landing-cta-top-btn"
              onClick={onEnterSite}
              className="bg-gradient-to-r from-amber-500 to-[#ff5d00] text-black font-extrabold text-xs px-5 py-2.5 rounded-full hover:brightness-110 shadow-lg active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>{lang === 'pt-BR' ? 'Acessar Workspace' : 'Go to App'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-black/95 backdrop-blur-2xl border-b border-neutral-900 p-6 flex flex-col space-y-4 lg:hidden"
          >
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuHome}</button>
            <button onClick={() => scrollToSection('benefits')} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuBenefits}</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuHowItWorks}</button>
            <button onClick={() => scrollToSection('events')} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuEvents}</button>
            <button onClick={() => scrollToSection('gallery')} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuGallery}</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuTestimonials}</button>
            <button onClick={() => scrollToSection('club-tiers')} className="text-left py-2 font-bold text-neutral-300 hover:text-[#fe9d00]">{text.menuCompare}</button>
            <hr className="border-neutral-900" />
            <div className="flex gap-4">
              <button onClick={onOpenLogin} className="flex-1 text-center py-2.5 text-xs font-bold text-[#fe9d00] bg-neutral-950 border border-neutral-800 rounded-xl">{text.menuLogin}</button>
              <button onClick={onEnterSite} className="flex-1 text-center py-2.5 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-[#ff5d00] rounded-xl">{lang === 'pt-BR' ? 'Roteador Pro' : 'Pro App'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAJESTIC HERO SECTION */}
      <section id="hero" className="pt-32 pb-20 md:py-36 min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 text-center sm:text-left space-y-6 max-w-xl mx-auto lg:mx-0">
              <span className="inline-flex items-center justify-center sm:justify-start space-x-2 bg-gradient-to-r from-amber-500/10 to-[#ff5d00]/10 border border-[#fe9d00]/20 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#fe9d00]" />
                <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#fe9d00]">{text.heroTag}</span>
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-black text-white tracking-tight leading-none">
                {text.heroTitle}
              </h1>
              
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-sans max-w-xl mx-auto sm:mx-0">
                {text.heroSub}
              </p>

              {/* Action Double CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 items-center sm:items-start justify-center sm:justify-start">
                <button
                  id="hero-planner-cta"
                  onClick={onEnterSite}
                  className="bg-gradient-to-r from-amber-500 to-[#ff5d00] text-black font-black text-base sm:text-sm px-10 sm:px-8 py-4 min-h-[56px] w-full sm:w-auto rounded-full hover:brightness-110 shadow-2xl active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2.5"
                >
                  <span>{text.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  id="hero-club-cta"
                  onClick={onEnterVIP}
                  className="bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold text-base sm:text-sm px-10 sm:px-8 py-4 min-h-[56px] w-full sm:w-auto rounded-full border border-neutral-800 transition-all cursor-pointer flex items-center justify-center space-x-2 hover:border-[#fe9d00]/30"
                >
                  <Sparkles className="w-4 h-4 text-[#fe9d00] animate-pulse" />
                  <span>{text.ctaSecondary}</span>
                </button>
              </div>

              {/* Social Proof */}
              {testimonials.length > 0 ? (
                <div className="pt-8 border-t border-neutral-950 flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono text-neutral-500 select-none">
                  <div className="flex -space-x-2">
                    {testimonials.slice(0, 4).map((t, i) => (
                      <SafeImage 
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-black object-cover" 
                        src={t.avatar}
                        alt="Reviewer" 
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center text-amber-400 gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                      <span className="text-white font-bold ml-1">5.0</span>
                    </div>
                    <span>{text.socialProof}</span>
                  </div>
                </div>
              ) : (
                <div className="pt-8 border-t border-neutral-950 text-xs font-mono text-neutral-500 text-left select-none">
                  <span>{lang === 'pt-BR' ? 'Ainda não há estatísticas disponíveis.' : 'No statistics available yet.'}</span>
                </div>
              )}
            </div>

            {/* Hero Right Visuals */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#fe9d00]/10 to-[#ff5d00]/20 blur-xl pointer-events-none opacity-80" />
              <div className="w-full max-w-[500px] sm:max-w-[460px] md:max-w-[520px] aspect-[4/5] rounded-3xl bg-neutral-950 overflow-hidden border border-neutral-800/80 shadow-2xl relative group mx-auto">
                <SafeImage 
                  src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80" 
                  alt="Bartender preparing premium drinks" 
                  className="w-full h-full object-cover brightness-90 group-hover:scale-102 transition-transform duration-700"
                  category="spirits"
                />
                
                {/* Elegant overlay card details */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/75 backdrop-blur-md rounded-2xl p-4 border border-neutral-800 text-left flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-[#fe9d00] font-black uppercase">BAR CURATORSHIP</span>
                    <h3 className="text-sm font-extrabold text-white mt-1">Gourmet Cocktail Catering</h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{lang === 'pt-BR' ? 'Doses calibradas, copos lapidados.' : 'Signature flavors, luxury custom bar glass.'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center animate-bounce">
                    <Wine className="w-5 h-5 text-black" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SEÇÃO BENEFÍCIOS */}
      <section id="benefits" className="py-24 bg-[#080808] border-y border-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-[#fe9d00] text-xs font-mono font-black tracking-widest uppercase">{lang === 'pt-BR' ? 'QUALIDADE ABSOLUTA' : 'UNCOMPROMISING SERVICE'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{text.benefitsTitle}</h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">{text.benefitsSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsList.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, borderColor: '#fe9d00/30' }}
                className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 text-left space-y-4 transition-all duration-300 relative group"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#fe9d00] transition-colors">{item.title}</h3>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA (TIMELINE) */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <span className="text-[#a2d729] text-xs font-mono font-black tracking-widest uppercase">{lang === 'pt-BR' ? 'PROCESSO SIMPLIFICADO' : 'STEP-BY-STEP FLOW'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{text.timelineTitle}</h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">{text.timelineSub}</p>
          </div>

          {/* Timeline Nodes */}
          <div className="relative">
            {/* Central path line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-[#a2d729] to-[#ff5d00] -translate-x-1/2 hidden md:block opacity-30" />

            <div className="space-y-12 md:space-y-20">
              
              {/* Step 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                <div className="text-left md:text-right space-y-3 pr-0 md:pr-12 md:col-start-1">
                  <div className="inline-flex w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#fe9d00] font-mono font-bold items-center justify-center text-sm mb-2">01</div>
                  <h3 className="text-xl font-bold text-white">{text.t1}</h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-md md:ml-auto">{text.t1Desc}</p>
                </div>
                <div className="hidden md:flex justify-start pl-12 md:col-start-2">
                  <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-xl">
                    <Compass className="w-10 h-10 text-amber-500 animate-spin-slow" />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                <div className="hidden md:flex justify-end pr-12 md:col-start-1">
                  <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-xl">
                    <Wine className="w-10 h-10 text-[#a2d729]" />
                  </div>
                </div>
                <div className="text-left space-y-3 pl-0 md:pl-12 md:col-start-2">
                  <div className="inline-flex w-10 h-10 rounded-full bg-[#a2d729]/10 border border-[#a2d729]/20 text-[#a2d729] font-mono font-bold items-center justify-center text-sm mb-2">02</div>
                  <h3 className="text-xl font-bold text-white">{text.t2}</h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-md">{text.t2Desc}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                <div className="text-left md:text-right space-y-3 pr-0 md:pr-12 md:col-start-1">
                  <div className="inline-flex w-10 h-10 rounded-full bg-[#ff5d00]/10 border border-[#ff5d00]/20 text-[#ff5d00] font-mono font-bold items-center justify-center text-sm mb-2">03</div>
                  <h3 className="text-xl font-bold text-white">{text.t3}</h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-md md:ml-auto">{text.t3Desc}</p>
                </div>
                <div className="hidden md:flex justify-start pl-12 md:col-start-2">
                  <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-xl">
                    <Clock className="w-10 h-10 text-[#ff5d00]" />
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                <div className="hidden md:flex justify-end pr-12 md:col-start-1">
                  <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 shadow-xl">
                    <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-left space-y-3 pl-0 md:pl-12 md:col-start-2">
                  <div className="inline-flex w-10 h-10 rounded-full bg-yellow-450/10 border border-yellow-450/20 text-yellow-400 font-mono font-bold items-center justify-center text-sm mb-2">04</div>
                  <h3 className="text-xl font-bold text-white">{text.t4}</h3>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-md">{text.t4Desc}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO EVENTOS */}
      <section id="events" className="py-24 bg-[#080808] border-y border-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-[#ff5d00] text-xs font-mono font-black tracking-widest uppercase">{lang === 'pt-BR' ? 'UNIVERSO EXCLUSIVO' : 'CELEBRATING IN STYLE'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{text.eventsTitle}</h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">{text.eventsSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'ev1', title: text.ev1, desc: text.ev1Desc, img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
              { id: 'ev2', title: text.ev2, desc: text.ev2Desc, img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80' },
              { id: 'ev3', title: text.ev3, desc: text.ev3Desc, img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80' },
              { id: 'ev4', title: text.ev4, desc: text.ev4Desc, img: 'https://images.unsplash.com/photo-1510626176961-4b57d4f40208?auto=format&fit=crop&w=400&q=80' }
            ].map((ev, index) => (
              <motion.div
                key={ev.id}
                whileHover={{ y: -6 }}
                className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden group shadow-lg flex flex-col text-left"
              >
                <div className="aspect-video w-full overflow-hidden relative">
                  <SafeImage 
                    src={ev.img} 
                    alt={ev.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    category="spirits"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#fe9d00] transition-colors">{ev.title}</h3>
                    <p className="text-[11px] text-neutral-450 mt-1 font-sans leading-relaxed">{ev.desc}</p>
                  </div>
                  <button onClick={onEnterSite} className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#fe9d00] flex items-center space-x-1.5 hover:text-white pt-2">
                    <span>{lang === 'pt-BR' ? 'Simular Orçamento' : 'Estimate Cost'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALERIA DE FOTOS (MOSAICO COM LIGHTBOX) */}
      <section id="gallery" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-amber-500 text-xs font-mono font-black tracking-widest uppercase">{lang === 'pt-BR' ? 'PORTFÓLIO VISUAL' : 'CRAFTED GALLERY'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{text.galleryTitle}</h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">{text.gallerySub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => {
                  setLightboxImage(item.url);
                  setLightboxTitle(item.title);
                }}
                whileHover={{ scale: 1.02 }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 cursor-pointer shadow-md"
              >
                <SafeImage 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  category="spirits"
                />
                {/* Overlay hover details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <Maximize2 className="w-5 h-5 text-[#fe9d00] absolute top-4 right-4" />
                  <span className="text-[9px] font-mono tracking-widest text-[#fe9d00] uppercase font-bold">PORTFOLIO</span>
                  <h4 className="text-sm font-extrabold text-white mt-1">{item.title}</h4>
                  <p className="text-[11px] text-neutral-300 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DEPOIMENTOS DE CLIENTES */}
      <section id="testimonials" className="py-24 bg-[#080808] border-y border-neutral-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-[#a2d729] text-xs font-mono font-black tracking-widest uppercase">{lang === 'pt-BR' ? 'PROVA DE EXCELÊNCIA' : 'REAL REVIEWS'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{lang === 'pt-BR' ? 'A Opinião de Quem Confia' : 'What Our Guests Say'}</h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">{lang === 'pt-BR' ? 'Relatos autênticos de contratantes extremamente satisfeitos com nossa entrega.' : 'Unfiltered recommendations from our luxury party organizers.'}</p>
          </div>

          {testimonials.length === 0 ? (
            <div className="col-span-full border border-dashed border-neutral-850 bg-neutral-950/25 p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto">
              <span className="text-3xl block animate-pulse">💬</span>
              <h4 className="font-extrabold text-neutral-200 text-sm">
                {lang === 'pt-BR' ? 'Depoimentos em Breve' : 'Reviews Coming Soon'}
              </h4>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {lang === 'pt-BR'
                  ? 'Nossos contratantes ainda não registraram avaliações no sistema de produção. Planeje seu primeiro evento e compartilhe seu feedback!'
                  : 'No customer testimonials have been registered in this system yet. Design your event and be the first to share your experience!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((test, index) => (
                <div 
                  key={index}
                  className="bg-neutral-950 border border-neutral-900 p-6 rounded-2xl text-left space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                    </div>
                    <p className="text-xs text-neutral-300 italic font-sans leading-relaxed">
                      "{test.text}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 pt-4 border-t border-neutral-900/60">
                    <SafeImage 
                      src={test.avatar} 
                      alt={test.name} 
                      className="w-10 h-10 rounded-full object-cover border border-neutral-800"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{test.name}</h4>
                      <p className="text-[10px] text-[#fe9d00] font-mono leading-none mt-1">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. COMPARATIVO FREE X VIP (CLUBE EVENT DRINK) */}
      <section id="club-tiers" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-0">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-[#fe9d00] text-xs font-mono font-black tracking-widest uppercase">{lang === 'pt-BR' ? 'ESCOLHA SUA JORNADA' : 'MEMBERSHIP ACCESS'}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{text.compareTitle}</h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed">{text.compareSub}</p>
          </div>

          {/* Comparison Table */}
          <div className="max-w-4xl mx-auto bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-900 text-left bg-neutral-900/30">
              <div className="md:col-span-6 p-6 flex items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{lang === 'pt-BR' ? 'Benefícios e Funcionalidades' : 'Features & Content'}</span>
              </div>
              <div className="md:col-span-3 p-6 text-center border-l border-neutral-900/40">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{text.thColFree}</span>
              </div>
              <div className="md:col-span-3 p-6 text-center bg-[#fe9d00]/5 border-l border-neutral-900/60 relative">
                <span className="text-xs font-black text-[#fe9d00] uppercase tracking-widest">{text.thColVip}</span>
              </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-900/60 text-left hover:bg-neutral-900/10">
              <div className="md:col-span-6 p-4 px-6">
                <p className="text-xs font-bold text-white">{lang === 'pt-BR' ? 'Planejamento Inteligente de Consumo' : 'Smart Event Alcohol Estimator'}</p>
                <p className="text-[10px] text-neutral-450 mt-0.5">{lang === 'pt-BR' ? 'Cálculo por quantidade de convidados e tipo de festa.' : 'Suggest core beer/wine ratios based on inputs.'}</p>
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center border-l border-neutral-900/40">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center bg-[#fe9d00]/5 border-l border-neutral-900/60">
                <Check className="w-5 h-5 text-[#fe9d00]" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-900/60 text-left hover:bg-neutral-900/10">
              <div className="md:col-span-6 p-4 px-6">
                <p className="text-xs font-bold text-white">{lang === 'pt-BR' ? 'Receitas de Cocktails' : 'Cocktail Recipes Catalogue'}</p>
                <p className="text-[10px] text-neutral-450 mt-0.5">{lang === 'pt-BR' ? 'Receitas básicas vs Fórmulas Autorais dos Bartenders' : 'Basic guides vs secret gourmet formulations.'}</p>
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center text-xs text-neutral-500 border-l border-neutral-900/40">
                {lang === 'pt-BR' ? 'Básicas' : 'Basic Only'}
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center bg-[#fe9d00]/5 border-l border-neutral-900/60 text-xs font-black text-[#fe9d00]">
                {lang === 'pt-BR' ? 'Completo & Autorais' : 'Premium Catalog'}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-900/60 text-left hover:bg-neutral-900/10">
              <div className="md:col-span-6 p-4 px-6">
                <p className="text-xs font-bold text-white">{lang === 'pt-BR' ? 'Desconto Automático' : 'Automatic Event Discounts'}</p>
                <p className="text-[10px] text-neutral-450 mt-0.5">{lang === 'pt-BR' ? 'Desconto de 7% de boas-vindas ativo em todos os insumos' : 'Automatic 7% off the generated event list.'}</p>
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center text-xs text-neutral-500 border-l border-neutral-900/40">
                -
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center bg-[#fe9d00]/5 border-l border-neutral-900/60">
                <Check className="w-5 h-5 text-[#fe9d00]" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-neutral-900/60 text-left hover:bg-neutral-900/10">
              <div className="md:col-span-6 p-4 px-6">
                <p className="text-xs font-bold text-white">{lang === 'pt-BR' ? 'Criador de Drinks & Harmonizador' : 'Custom Cocktail Lab & Food Pairing'}</p>
                <p className="text-[10px] text-neutral-450 mt-0.5">{lang === 'pt-BR' ? 'Acesso total às ferramentas premium PRO LAB' : 'Create bespoke cocktails and matching menus.'}</p>
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center text-xs text-neutral-500 border-l border-neutral-900/40">
                {lang === 'pt-BR' ? 'Apenas Visualizar' : 'View Only'}
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center bg-[#fe9d00]/5 border-l border-neutral-900/60">
                <Check className="w-5 h-5 text-[#fe9d00]" />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-12 text-left hover:bg-neutral-900/10">
              <div className="md:col-span-6 p-4 px-6">
                <p className="text-xs font-bold text-white">{lang === 'pt-BR' ? 'Cursos, Materiais, Downloads & Workshops' : 'Courses, Live Classes & PDFs'}</p>
                <p className="text-[10px] text-neutral-450 mt-0.5">{lang === 'pt-BR' ? 'Acesso ao acervo educativo completo do Clube' : 'Gourmet bar guides and mixologist certificates.'}</p>
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center text-xs text-neutral-500 border-l border-neutral-900/40">
                -
              </div>
              <div className="md:col-span-3 p-4 flex items-center justify-center bg-[#fe9d00]/5 border-l border-neutral-900/60">
                <Check className="w-5 h-5 text-[#fe9d00]" />
              </div>
            </div>

            {/* Footer triggers */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-neutral-900/40 border-t border-neutral-900 p-6 gap-4">
              <div className="md:col-span-6 text-xs text-neutral-450 text-left flex items-center">
                <span>{lang === 'pt-BR' ? 'Nenhuma cobrança oculta. Cancele sua assinatura gratuita quando quiser.' : 'No hidden fees. Cancel your club subscription profile anytime.'}</span>
              </div>
              <div className="md:col-span-3 flex justify-center">
                <button onClick={onEnterSite} className="w-full text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 py-3 px-4 rounded-xl border border-neutral-800 transition-colors cursor-pointer">{lang === 'pt-BR' ? 'Começar Grátis' : 'Start Free'}</button>
              </div>
              <div className="md:col-span-3 flex justify-center">
                <button onClick={onEnterVIP} className="w-full text-xs font-extrabold text-black bg-[#fe9d00] hover:bg-[#ff5d00] py-3 px-4 rounded-xl shadow-lg transition-colors cursor-pointer">{lang === 'pt-BR' ? 'Aderir ao Clube ✨' : 'Join VIP Club ✨'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA FINAL CHAMATIVA */}
      <section className="py-24 bg-gradient-to-b from-black to-[#090909] text-center relative overflow-hidden border-t border-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {text.ctaFinalTitle}
          </h2>
          <p className="text-sm md:text-base text-neutral-400 font-sans max-w-xl mx-auto leading-relaxed">
            {text.ctaFinalSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
            <button
              id="cta-final-planning"
              onClick={onEnterSite}
              className="flex-1 bg-gradient-to-r from-amber-500 to-[#ff5d00] text-black font-black text-sm py-4 px-6 rounded-full hover:brightness-110 shadow-2xl active:scale-95 transition-all cursor-pointer"
            >
              {text.ctaFinalBtn}
            </button>
            <button
              id="cta-final-vip"
              onClick={onEnterVIP}
              className="flex-1 bg-neutral-950 hover:bg-neutral-900 text-white font-extrabold text-xs py-4 px-6 rounded-full border border-neutral-800 hover:border-[#fe9d00]/30 transition-all cursor-pointer"
            >
              {text.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* 9.5. Persistent legal warning for age limit (+18) */}
      <footer className="py-6 bg-[#060606] border-t border-neutral-950 text-center text-[10px] text-neutral-500 font-mono tracking-wide uppercase px-4 leading-relaxed">
        {lang === 'pt-BR' 
          ? '⚠️ AVISO LEGAL: ESTE PORTAL É RESTRITO A MAIORES DE 18 ANOS. A VENDA E CONSUMO DE BEBIDAS ALCOÓLICAS POR MENORES DE IDADE SÃO PROIBIDOS POR LEI. SE BEBER, NÃO DIRIJA.' 
          : '⚠️ LEGAL NOTICE: THIS PLATFORM IS RESTRICTED TO AGES 18 AND OLDER. THE SALE AND CONSUMPTION OF ALCOHOLIC BEVERAGES BY MINORS IS STRICTLY PROHIBITED BY LAW. DRINK RESPONSIBLY.'}
      </footer>

      {/* 10. LIGHTBOX DIALOG */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-zoom-out"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="relative max-w-3xl w-full bg-[#0c0c0c] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                aria-label={text.lightboxClose}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video w-full overflow-hidden">
                <SafeImage 
                  src={lightboxImage || ''} 
                  alt={lightboxTitle} 
                  className="w-full h-full object-cover"
                  category="spirits"
                />
              </div>
              <div className="p-4 bg-neutral-950 text-left border-t border-neutral-900 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-extrabold text-white">{lightboxTitle}</h4>
                  <p className="text-[11px] text-neutral-450 mt-0.5">{text.lightboxCaption}</p>
                </div>
                <span className="text-[10px] font-mono tracking-wider bg-amber-500/10 text-[#fe9d00] px-2.5 py-1 border border-amber-500/20 rounded-full font-bold">
                  Event Drink
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
