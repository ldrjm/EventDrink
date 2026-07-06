import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Users, 
  GlassWater, 
  ArrowRight, 
  Wine, 
  TrendingUp, 
  HelpCircle,
  MessageSquare,
  Gift
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';

interface DashboardFreeViewProps {
  controller: AppControllerType;
}

export default function DashboardFreeView({ controller }: DashboardFreeViewProps) {
  const {
    lang,
    currentUser,
    currentTranslation,
    setActiveTab,
    handleAddToCart,
    triggerToast,
    isCalculated,
    guests,
    eventType,
    duration,
    filteredDrinks
  } = controller;

  const isPt = lang === 'pt-BR';

  // Get some drink highlights to show as "Favorites" or recommended for Free users
  const favoriteDrinks = filteredDrinks.slice(0, 3);

  const translate = {
    pt: {
      welcome: `Olá, ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Convidado'}`,
      subtitle: 'Bem-vindo ao EventDrink! Comece a planejar a sua festa perfeita gratuitamente.',
      nextEvent: 'Seu Próximo Evento',
      guests: 'Convidados',
      duration: 'Duração',
      type: 'Tipo',
      calculated: 'Cálculo Pronto!',
      pending: 'Cálculo Pendente',
      viewProposal: 'Ver Planejamento Completo',
      startPlanning: 'Iniciar Novo Planejamento',
      favoritesTitle: 'Drinks Populares / Favoritos',
      addBudget: 'Adicionar ao Orçamento',
      mixingTitle: 'Criador de Drinks',
      mixingDesc: 'Crie e misture ingredientes personalizados com as proporções corretas para o seu menu.',
      mixingBtn: 'Misturar Agora',
      aiTitle: 'Concierge Inteligente AI',
      aiDesc: 'Pergunte à nossa Inteligência Artificial como planejar insumos ou organizar as quantidades ideais para qualquer tema de festa.',
      aiPrompt1: 'Quantos barris de chopp para 40 convidados?',
      aiPrompt2: 'Ideia de cocktail refrescante com gin.',
      aiPrompt3: 'Dicas para organizar open bar de casamento.',
      vipUnlock: 'Desbloquear Clube Event Drink VIP ✨',
      vipPromoDesc: 'Obtenha frete premium cortesia, 7% de desconto automático no orçamento e receitas secretas desbloqueando a sua licença VIP de graça.'
    },
    en: {
      welcome: `Hello, ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Guest'}`,
      subtitle: 'Welcome to EventDrink! Design and budget your dream social gatherings for free.',
      nextEvent: 'Your Next Gathering',
      guests: 'Guests',
      duration: 'Duration',
      type: 'Event Type',
      calculated: 'Plan Calculated!',
      pending: 'Planning Pending',
      viewProposal: 'View Detailed Proposal',
      startPlanning: 'Start Live Planner',
      favoritesTitle: 'Trending & Favorite Cocktails',
      addBudget: 'Add to Event Budget',
      mixingTitle: 'Cocktail Creator Pro',
      mixingDesc: 'Mix customized drink ingredients, proportions, and ice sizes for your bespoke menu.',
      mixingBtn: 'Mix Cocktail',
      aiTitle: 'AI Virtual Concierge',
      aiDesc: 'Inquire our intelligent language model on how to organize premium ingredients or match party themes.',
      aiPrompt1: 'How many draft beers for 45 guests?',
      aiPrompt2: 'Show me refreshing gin cocktail ideas.',
      aiPrompt3: 'Tips on structuring a wedding open bar.',
      vipUnlock: 'Unlock Event Drink VIP Access ✨',
      vipPromoDesc: 'Gain free priority logistics, automatic 7% checkout discount, and exclusive recipes by unlocking your free VIP tier.'
    }
  }[isPt ? 'pt' : 'en'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-left"
    >
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-[#161616] to-[#0a0a0a] border border-neutral-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="absolute right-[-20px] top-[-20px] w-44 h-44 rounded-full bg-[#fe9d00] opacity-5 blur-[70px] pointer-events-none" />
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-black tracking-widest text-[#fe9d00] bg-[#fe9d00]/10 px-3 py-1 rounded-full uppercase">
            {currentUser?.badge || 'Basic Organizer'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans mt-2">
            {translate.welcome} 👋
          </h1>
          <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
            {translate.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Seu próximo evento & Planejamento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Event Status Card */}
        <div className="lg:col-span-6 bg-neutral-950 border border-neutral-900 rounded-3xl p-6 flex flex-col justify-between hover:border-neutral-850 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#fe9d00]" />
                {translate.nextEvent}
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isCalculated ? 'bg-[#a2d729]/10 text-[#a2d729] border border-[#a2d729]/20' : 'bg-neutral-900 text-neutral-500'
              }`}>
                {isCalculated ? translate.calculated : translate.pending}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-2 text-center">
              <div className="bg-[#121212] border border-neutral-900 rounded-xl p-3">
                <p className="text-[10px] font-mono text-neutral-500 uppercase">{translate.guests}</p>
                <p className="text-xl font-bold text-white mt-1">{guests || '--'}</p>
              </div>
              <div className="bg-[#121212] border border-neutral-900 rounded-xl p-3">
                <p className="text-[10px] font-mono text-neutral-500 uppercase">{translate.duration}</p>
                <p className="text-xl font-bold text-white mt-1">{duration ? `${duration}h` : '--'}</p>
              </div>
              <div className="bg-[#121212] border border-neutral-900 rounded-xl p-3">
                <p className="text-[10px] font-mono text-neutral-500 uppercase">{translate.type}</p>
                <p className="text-xs font-bold text-neutral-300 mt-2 truncate uppercase">{eventType || '--'}</p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            {isCalculated ? (
              <button
                id="free-dash-view-plan-btn"
                onClick={() => setActiveTab('results')}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-neutral-850 to-neutral-900 hover:to-neutral-800 border border-neutral-800 transition-all text-white font-bold py-3 px-4 rounded-xl text-xs cursor-pointer"
              >
                <span>{translate.viewProposal}</span>
                <ArrowRight className="w-4 h-4 text-[#fe9d00]" />
              </button>
            ) : (
              <button
                id="free-dash-start-plan-btn"
                onClick={() => {
                  setActiveTab('results');
                  controller.setPlannerTab('results');
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] hover:scale-[1.01] transition-transform text-black font-extrabold py-3 px-4 rounded-xl text-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black text-black" />
                <span>{translate.startPlanning}</span>
              </button>
            )}
          </div>
        </div>

        {/* Pro Upgrader Promo Box */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#121212] via-[#161616] to-[#121212] border border-amber-500/10 rounded-3xl p-6 flex flex-col justify-between relative group hover:border-amber-500/25 transition-all">
          <div className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{translate.vipUnlock}</h3>
            <p className="text-xs text-neutral-450 leading-relaxed">
              {translate.vipPromoDesc}
            </p>
          </div>
          <div className="pt-6">
            <button
              id="free-dash-unlock-vip-btn"
              onClick={controller.toggleUserTier}
              className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-105 active:scale-[0.99] transition-all text-black font-black py-3 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              Desbloquear VIP Grátis ✨
            </button>
          </div>
        </div>
      </div>

      {/* 3. Favorite Drinks Row */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Wine className="w-5 h-5 text-[#fe9d00]" />
          {translate.favoritesTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favoriteDrinks.map((drink) => (
            <div key={drink.id} className="bg-[#161616]/40 border border-neutral-900 rounded-2xl overflow-hidden group hover:border-neutral-800 transition-all flex flex-col justify-between">
              <div>
                <div className="aspect-video w-full overflow-hidden relative bg-neutral-950">
                  <SafeImage src={drink.imageUrl} alt={drink.namePt} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" category="spirits" />
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md border border-neutral-800 rounded-md px-2 py-0.5 text-[9px] font-bold text-[#fe9d00]">
                    R$ {drink.price.toFixed(2)} / {isPt ? drink.unitPt : drink.unitEn}
                  </div>
                </div>
                <div className="p-4 space-y-1 text-left">
                  <h4 className="text-sm font-bold text-white">{isPt ? drink.namePt : drink.nameEn}</h4>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase">
                    {isPt ? drink.categoryLabelPt : drink.categoryLabelEn}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  id={`free-dash-add-cart-${drink.id}`}
                  onClick={() => handleAddToCart(drink)}
                  className="w-full bg-neutral-900 hover:bg-[#fe9d00] hover:text-black transition-all border border-neutral-800 text-neutral-350 font-bold py-2 px-3 rounded-lg text-[10px] uppercase cursor-pointer"
                >
                  {translate.addBudget}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Actions (Criador de Drinks & IA virtual) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cocktail Creator shortcut */}
        <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 flex flex-col justify-between hover:border-neutral-850 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#fe9d00]/10 border border-[#fe9d00]/20 flex items-center justify-center text-[#fe9d00]">
              <GlassWater className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{translate.mixingTitle}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {translate.mixingDesc}
            </p>
          </div>
          <div className="pt-6">
            <button
              id="free-dash-mix-btn"
              onClick={() => setActiveTab('drink-creator')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#1b1b1b] hover:bg-neutral-800 transition-colors border border-neutral-800 text-neutral-200 px-5 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              <span>{translate.mixingBtn}</span>
              <ArrowRight className="w-4 h-4 text-[#fe9d00]" />
            </button>
          </div>
        </div>

        {/* AI Concierge Introduction */}
        <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 flex flex-col justify-between hover:border-neutral-850 transition-all">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">{translate.aiTitle}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {translate.aiDesc}
              </p>
            </div>

            {/* Prompt pills that open and insert into Chat Widget */}
            <div className="flex flex-col gap-2 pt-1">
              {[translate.aiPrompt1, translate.aiPrompt2, translate.aiPrompt3].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    controller.setIsChatOpen(true);
                    triggerToast(isPt ? 'Conectando ao assistente virtual...' : 'Connecting to chat concierge...');
                  }}
                  className="w-full text-left bg-[#161616]/60 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 rounded-xl p-2.5 text-[11px] text-neutral-450 transition-colors truncate cursor-pointer"
                >
                  ✨ "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
