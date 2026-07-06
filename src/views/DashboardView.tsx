import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Plus, 
  Users, 
  GlassWater, 
  ArrowRight, 
  Award,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';
import { Drink } from '../types';

interface DashboardViewProps {
  controller: AppControllerType;
}

// COMPONENTE PRINCIPAL: DashboardView
// Representa a tela de visão geral (dashboard) com resumos estatísticos, atalhos de navegação bem como o Drink do Mês.
export default function DashboardView({ controller }: DashboardViewProps) {
  const {
    lang,
    currentUser,
    currentTranslation,
    setActiveTab,
    handleAddToCart,
    triggerToast,
    isCalculated,
    setPlannerTab,
    guests,
    eventType,
    duration,
    orders
  } = controller;

  return (
    <motion.div
      key="dashboard"
      id="view-dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 1. SEÇÃO DE CONVERT: Banner de boas vindas com chamada para ação primária (Planejamento) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-[#1a1a1a] to-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Efeitos visuais abstratos de fundo */}
        <div className="absolute right-[-40px] top-[-40px] w-48 h-48 rounded-full bg-[#fe9d00] opacity-10 blur-[80px]" />
        <div className="absolute left-[-40px] bottom-[-40px] w-48 h-48 rounded-full bg-[#a2d729] opacity-5 blur-[85px]" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-[11px] font-black tracking-widest text-[#fe9d00] bg-[#fe9d00]/10 px-3 py-1 rounded-full uppercase">
            CONCIERGE ONLINE
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans text-left">
            {currentUser?.isLoggedIn 
              ? `${lang === 'pt-BR' ? 'Olá' : 'Hello'}, ${currentUser.name.split(' ')[0]}!` 
              : currentTranslation.welcomeHost
            }
          </h1>
          <p className="text-neutral-300 text-sm leading-relaxed text-left">
            {currentTranslation.heroDesc}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Botão para iniciar o assistente passo a passo de planejamento */}
            <button
              id="hero-start-planning-btn"
              onClick={() => {
                setActiveTab('results');
                setPlannerTab('assistant');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-black font-extrabold px-6 py-3.5 rounded-2xl text-sm tracking-wide cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black text-black" />
              <span>{currentTranslation.startNewPlanning}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
            
            {/* Botão secundário de Guia Rápido */}
            <button
              id="hero-quick-guide-btn"
              onClick={() => setActiveTab('help')}
              className="flex items-center space-x-2 bg-[#1b1b1b] hover:bg-neutral-800 transition-colors border border-neutral-800 text-neutral-200 px-6 py-3.5 rounded-2xl text-sm cursor-pointer"
            >
              <span>{currentTranslation.viewQuickGuide}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. GRID INFORMATIVO: Destaque do coquetel do mês e métricas volumétricas de atendimento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Drink em Evidência (Cocktail Recomendado) */}
        <div className="lg:col-span-7 bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-neutral-400 text-xs tracking-wider uppercase font-mono">
              <Star className="w-4 h-4 text-[#fe9d00] fill-[#fe9d00]" />
              <span>{currentTranslation.drinkOfTheMonth}</span>
            </div>
            <span className="text-[10px] font-mono text-[#a2d729] bg-[#a2d729]/10 px-2.5 py-1 rounded-full font-bold">
              {currentTranslation.popularity}: {orders.length > 0 ? '98%' : (lang === 'pt-BR' ? 'Novo' : 'New Blend')}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <SafeImage 
              src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80" 
              alt="Old Fashioned Craft" 
              category="spirits"
              className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-2xl border border-neutral-800 p-2 bg-neutral-900"
            />
            <div className="flex-1 space-y-3 text-left">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {currentTranslation.oldFashionedTitle}
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                {currentTranslation.oldFashionedDesc}
              </p>
              <div className="flex items-center space-x-4 pt-1">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">{currentTranslation.estimatedStock}</span>
                  <span className="text-sm font-bold font-mono text-white">14 {currentTranslation.bottles}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">{currentTranslation.suggestedPrice}</span>
                  <span className="text-sm font-bold font-mono text-[#a2d729]">R$ 28,90 / un</span>
                </div>
              </div>
              <div className="pt-2">
                {/* Permite adicionar rapidamente o insumo ao carrinho de compras */}
                <button
                  id="add-of-to-menu-btn"
                  onClick={() => {
                    const ofDrink = controller.availableDrinks.find(d => d.id === '1' || d.nameEn.toLowerCase().includes('old fashioned')) 
                      || controller.availableDrinks[0];
                    if (ofDrink) {
                      handleAddToCart(ofDrink);
                    } else {
                      const fallbackOf: Drink = {
                        id: '1',
                        namePt: 'Cocktail Old Fashioned Oro',
                        nameEn: 'Cocktail Old Fashioned Oro',
                        category: 'spirits',
                        categoryLabelPt: 'Destilados & Coquetéis',
                        categoryLabelEn: 'Spirits & Cocktails',
                        price: 28.90,
                        imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
                        recommendedPt: '1 dose clássica com gelo translúcido',
                        recommendedEn: '1 classic pour over crystal ice',
                        inStock: true,
                        unitPt: 'garrafa',
                        unitEn: 'bottle',
                        stockQuantity: 14,
                        minStockQuantity: 5,
                        purchasePrice: 15.00,
                        supplier: 'Classic Drinks',
                        expiryDate: '2028-12-31',
                        batch: 'OF-2026',
                        status: 'active'
                      };
                      handleAddToCart(fallbackOf);
                    }
                  }}
                  className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-bold font-mono py-2 px-4 rounded-xl transition-colors inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#fe9d00]" />
                  <span>{currentTranslation.addToMenu}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas operacionais calculadas com barras interativas */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-6 text-left relative overflow-hidden">
            <div className="absolute right-4 top-4 text-neutral-700">
              <Users className="w-12 h-12 stroke-[1]" />
            </div>
            <p className="text-xs font-mono text-neutral-400 tracking-wider uppercase mb-2">
              {currentTranslation.upcoming}
            </p>
            {isCalculated ? (
              <>
                <h4 className="text-4xl font-black text-white font-mono tracking-tight leading-none">
                  {guests} <span className="text-xs font-sans font-medium text-neutral-400">{currentTranslation.people}</span>
                </h4>
                <p className="text-xs text-neutral-500 mt-2">
                  {lang === 'pt-BR' 
                    ? `Evento do tipo ${eventType === 'casual' ? 'casual' : eventType === 'aniversario' ? 'aniversário' : eventType === 'reuniao' ? 'reunião' : 'social'} com ${duration}h de duração.` 
                    : `${eventType} event lasting ${duration} hours.`}
                </p>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </>
            ) : (
              <>
                <h4 className="text-lg font-bold text-neutral-400 tracking-tight leading-none">
                  {lang === 'pt-BR' ? 'Sem Planejamentos Ativos' : 'No Active Plannings'}
                </h4>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {lang === 'pt-BR' 
                    ? 'Inicie o assistente ou acesse o menu para calcular os insumos do seu evento.' 
                    : 'Start the concierge assistant to estimate required alcohol, sodas, water, and ice.'}
                </p>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-neutral-800 h-full rounded-full" style={{ width: '0%' }} />
                </div>
              </>
            )}
          </div>

          {/* Cards Rápidos de favoritos e horário de maior consumo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider block uppercase">{currentTranslation.nightFavorite}</span>
              <span className="text-sm font-bold text-neutral-200 block mt-1">
                {isCalculated ? 'Gin & Tonic' : (lang === 'pt-BR' ? 'Aguardando' : 'Awaiting')}
              </span>
              <span className="text-[11px] text-[#a2d729] font-mono">
                {isCalculated ? '⚡ ' + (lang === 'pt-BR' ? 'Mais planejado' : 'Most planned') : (lang === 'pt-BR' ? 'Sem dados' : 'No calculation')}
              </span>
            </div>
            <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
              <span className="text-[10px] text-neutral-500 font-mono tracking-wider block uppercase">{lang === 'pt-BR' ? 'PICO DE CONSUMO' : 'PEAK DEMAND'}</span>
              <span className="text-sm font-bold text-neutral-200 block mt-1">
                {isCalculated ? '21h00 - 23h30' : (lang === 'pt-BR' ? 'Sem dados' : 'Awaiting')}
              </span>
              <span className="text-[11px] text-neutral-550 font-mono">
                {isCalculated ? (lang === 'pt-BR' ? 'Fluxo estimado' : 'Estimated flow') : (lang === 'pt-BR' ? 'Cálculo pendente' : 'Pending calculation')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONVENIENCE INSIGHTS PANEL: Históricos e dados analíticos da comunidade */}
      <div className="bg-[#161616]/30 border border-neutral-800/60 rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 text-left">{currentTranslation.galeraInsights}</h3>
        {orders.length > 0 || isCalculated ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#121212]/50 border border-neutral-800 rounded-2xl p-4 text-left">
              <p className="text-neutral-500 text-xs font-mono">{currentTranslation.averageFeedback}</p>
              {isCalculated ? (
                <>
                  <div className="flex items-center space-x-1 mt-1 text-white">
                    <span className="text-xl font-black font-mono">4.9</span>
                    <span className="text-neutral-500 text-xs">/ 5.0</span>
                  </div>
                  <div className="flex items-center text-xs text-[#fe9d00] mt-1 font-semibold leading-none">
                    ★★★★★ <span className="text-neutral-400 font-mono ml-2">(+124 reviews)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1 mt-1 text-neutral-550">
                    <span className="text-xl font-black font-mono">0.0</span>
                    <span className="text-[#333333] text-xs">/ 5.0</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1 font-semibold leading-none">
                    {lang === 'pt-BR' ? 'Sem avaliações ainda' : 'No ratings yet'}
                  </div>
                </>
              )}
            </div>
            <div className="bg-[#121212]/50 border border-neutral-800 rounded-2xl p-4 text-left">
              <p className="text-neutral-500 text-xs font-mono">{currentTranslation.generatedSavings}</p>
              {isCalculated ? (
                <>
                  <div className="flex items-baseline space-x-1 mt-1 text-white">
                    <span className="text-xl font-black font-mono">R$ {(guests * 12.5).toFixed(0)}</span>
                    <span className="text-neutral-500 text-xs">/ {lang === 'pt-BR' ? 'festa' : 'event'}</span>
                  </div>
                  <p className="text-[10px] text-[#a2d729] mt-1">✔ {lang === 'pt-BR' ? 'Cálculo cirúrgico ativo' : 'Precision math active'}</p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline space-x-1 mt-1 text-neutral-500">
                    <span className="text-xl font-black font-mono">R$ 0</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">{lang === 'pt-BR' ? 'Aguardando planejamento' : 'Awaiting event plan'}</p>
                </>
              )}
            </div>
            <div className="bg-[#121212]/50 border border-neutral-800 rounded-2xl p-4 text-left">
              <p className="text-neutral-500 text-xs font-mono">{lang === 'pt-BR' ? 'Desperdício Reajustado' : 'Avoided Waste'}</p>
              {isCalculated ? (
                <>
                  <div className="flex items-baseline space-x-1 mt-1 text-white">
                    <span className="text-xl font-black font-mono">~3.5%</span>
                  </div>
                  <p className="text-[10px] text-[#a2d729] mt-1">{lang === 'pt-BR' ? '⬇ Desperdício reduzido' : '⬇ Waste minimized'}</p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline space-x-1 mt-1 text-neutral-550">
                    <span className="text-xl font-black font-mono">0%</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">{lang === 'pt-BR' ? 'Cálculo pendente' : 'Pending event'}</p>
                </>
              )}
            </div>
            <div className="bg-[#121212]/50 border border-neutral-800 rounded-2xl p-4 text-left">
              <p className="text-neutral-500 text-xs font-mono">{lang === 'pt-BR' ? 'Sabor de Destaque' : 'Signature Spirit'}</p>
              {isCalculated ? (
                <>
                  <div className="flex items-baseline space-x-1 mt-1 text-white">
                    <span className="text-sm font-bold">{eventType === 'aniversario' ? 'Gin & Tonic' : 'Vodka & Citrus'}</span>
                  </div>
                  <p className="text-[10px] text-neutral-450 mt-1">{lang === 'pt-BR' ? 'Sugerido no plano' : 'Suggested in plan'}</p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline space-x-1 mt-1 text-neutral-550">
                    <span className="text-sm font-bold">{lang === 'pt-BR' ? 'Nenhum' : 'None'}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">{lang === 'pt-BR' ? 'Aguardando dados' : 'Awaiting data'}</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-neutral-800/80 bg-neutral-950/20 p-8 rounded-2xl text-center space-y-3">
            <TrendingUp className="w-8 h-8 text-neutral-500 mx-auto" />
            <h4 className="font-extrabold text-neutral-300 text-sm">
              {lang === 'pt-BR' ? 'Estatísticas de Consumo' : 'Consumption Statistics'}
            </h4>
            <p className="text-xs text-neutral-400">
              {lang === 'pt-BR' ? 'Ainda não há estatísticas disponíveis.' : 'No statistics available yet.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. DISPARADOR PREMIUM: Canal para acessar o Criador de Drinks Exclusivos personalizado */}
      <div className="grid grid-cols-1 gap-6 text-left">
        <div className="relative overflow-hidden bg-gradient-to-tr from-[#121212] via-[#171717] to-neutral-900 border border-neutral-800 hover:border-[#fe9d00]/40 transition-all rounded-3xl p-6 flex flex-col justify-between group">
          <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-[#fe9d00] opacity-5 blur-[50px]" />
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#fe9d00]/10 border border-[#fe9d00]/20 flex items-center justify-center text-[#fe9d00] mb-4">
              <GlassWater className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-bold text-[#fe9d00] uppercase tracking-wider block">VIP LAB R&D</span>
            <h4 className="text-lg font-bold text-white mt-1">
              {lang === 'pt-BR' ? 'Criador de Drinks Exclusivos' : 'Custom Drink Lab'}
            </h4>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              {lang === 'pt-BR' 
                ? 'Misture licores, guarnições cítricas e efeitos de fumaça artesanais em Tempo Real para gerar fichas técnicas requintadas e inventar o coquetel assinatura do seu evento!' 
                : 'Mix visual spirits, citrus slices and smoke accents in Real-Time to render bespoke cocktail recipes and invent your event\'s signature beverage!'
              }
            </p>
          </div>
          <div className="pt-5 flex font-sans">
            <button
              onClick={() => setActiveTab('drink-creator')}
              className="bg-neutral-800 group-hover:bg-[#fe9d00] text-[#fe9d00] group-hover:text-black font-extrabold text-[11px] uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <span>{lang === 'pt-BR' ? 'Iniciar Laboratório de Mixologia' : 'Enter Mixology Lab'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
