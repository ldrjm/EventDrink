import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  Check,
  Wine,
  Beer,
  Zap,
  ShoppingBag,
  Lock
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import AssistantView from './AssistantView';

interface ResultsViewProps {
  controller: AppControllerType;
}

export default function ResultsView({ controller }: ResultsViewProps) {
  const {
    lang,
    currentTranslation,
    guests,
    duration,
    customQuantities,
    setCustomQuantities,
    handleQuantityAdjust,
    customTotals,
    handleConfirmPlan,
    showCheckOutSuccess,
    setShowCheckOutSuccess,
    setActiveTab,
    triggerToast,
    plannerTab,
    setPlannerTab,
    isCalculated,
    setIsCalculated,
    currentUser
  } = controller;

  // --- CONTROLES DE EXPERIÊNCIA ADICIONAIS VISUAIS (Persona de Cliente) ---
  const [addBartenders, setAddBartenders] = React.useState(false);
  const [bartendersCount, setBartendersCount] = React.useState(Math.max(1, Math.ceil(guests / 25)));
  const [premiumBarSetup, setPremiumBarSetup] = React.useState<'none' | 'standard' | 'luxury' | 'rustic'>('none');

  React.useEffect(() => {
    // Sincroniza recomendação de equipe com a quantidade de convidados
    setBartendersCount(Math.max(1, Math.ceil(guests / 25)));
  }, [guests]);

  // Cálculos dinâmicos dos serviços premium adicionados
  const bartendersCost = addBartenders ? bartendersCount * 380 : 0;
  const barSetupCost = 
    premiumBarSetup === 'standard' ? 250 :
    premiumBarSetup === 'luxury' ? 850 :
    premiumBarSetup === 'rustic' ? 550 : 0;

  const totalAdicionais = bartendersCost + barSetupCost;
  const subtotalGeral = customTotals.subtotal + totalAdicionais;
  
  // VIP loyalty discount of 7% ONLY applies to tier VIP (logged in users)
  const isVip = !!currentUser?.isLoggedIn;
  const descontoGeral = isVip ? Math.round(subtotalGeral * 0.07) : 0;
  const totalGeral = subtotalGeral - descontoGeral;

  // --- CALCULADORA DE COMBOS INTEGRADA (Sugestão de Experiência Inteligente) ---
  const ginC_gin = Math.max(1, Math.ceil(guests / 15));
  const ginC_tonica = Math.max(4, Math.ceil(guests / 15) * 6);
  const ginC_gelo = Math.max(1, Math.ceil(guests / 25));
  const ginC_price = ginC_gin * 110.00 + ginC_tonica * 5.00 + ginC_gelo * 12.00;

  const wineC_tinto = Math.max(1, Math.ceil(guests / 12));
  const wineC_branco = Math.max(1, Math.ceil(guests / 20));
  const wineC_espumante = Math.max(1, Math.ceil(guests / 18));
  const wineC_price = wineC_tinto * 69.00 + wineC_branco * 55.00 + wineC_espumante * 78.00;

  const beerC_pilsen = Math.max(12, Math.round(guests * 1.5));
  const beerC_ipa = Math.max(6, Math.round(guests * 0.8));
  const beerC_gelo = Math.max(1, Math.ceil(guests / 20));
  const beerC_price = beerC_pilsen * 8.50 + beerC_ipa * 16.00 + beerC_gelo * 12.00;

  const addComboToPlanner = (comboType: 'gin' | 'wine' | 'beer', items: { id: string; qty: number }[]) => {
    setCustomQuantities(prev => {
      return prev.map(item => {
        const match = items.find(it => it.id === item.id);
        if (match) {
          return { ...item, value: item.value + match.qty };
        }
        return item;
      });
    });
    
    const label = 
      comboType === 'gin' ? (lang === 'pt-BR' ? 'Combo Gin Tônica' : 'Premium Gin Tonic Combo') :
      comboType === 'wine' ? (lang === 'pt-BR' ? 'Combo Seleção do Sommelier' : 'Sommelier Wine Collection') :
      (lang === 'pt-BR' ? 'Combo Churrasco Premium' : 'Premium BBQ Beer Combo');
      
    triggerToast(lang === 'pt-BR' ? `+ ${label} integrado com sucesso ao seu planejamento!` : `+ ${label} integrated into your plan!`);
  };

  return (
    <motion.div
      key="results"
      id="view-results"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto"
    >
      <AnimatePresence mode="wait">
        {!isCalculated ? (
          <motion.div
            key="setup-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* 1. SEÇÃO DE AJUSTE DOS PARÂMETROS DA FESTA */}
            <AssistantView controller={controller} />
          </motion.div>
        ) : (
          <motion.div
            key="calculated-results-screen"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Visual Banner */}
            <div className="text-left space-y-2 bg-gradient-to-r from-neutral-900/40 to-transparent p-5 rounded-3xl border border-neutral-900/40">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#a2d729] bg-[#a2d729]/15 px-3 py-1 rounded-full uppercase">
                {lang === 'pt-BR' ? 'Cálculo Ativo' : 'Active Calculation'}
              </span>
              <h3 className="text-xl font-bold text-white leading-tight font-sans">
                {currentTranslation.perfectPlanReady}
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl font-sans">
                {currentTranslation.calculatedFor
                  .replace('{guests}', guests.toString())
                  .replace('{hours}', duration.toString())
                  .replace('{menu}', 'Concierge Premium Mix')
                }
              </p>
            </div>

            {/* Supply quantities with adjustable controls (+ / - buttons) */}
            <div id="quantities-list-panel" className="bg-[#161616]/70 border border-neutral-800/80 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="text-xs font-mono font-bold text-neutral-300 tracking-widest uppercase">
                  {currentTranslation.suggestedQuantities.toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-[#a2d729] bg-[#a2d729]/15 px-3 py-1 rounded-full uppercase font-black tracking-wide">
                  {currentTranslation.optimizedAlgorithm}
                </span>
              </div>

              <div className="divide-y divide-neutral-800/60">
                {customQuantities.map((item) => (
                  <div 
                    key={item.id} 
                    id={`quantity-row-${item.id}`}
                    className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                  >
                    <div className="space-y-1.5 max-w-md">
                      <h4 className="text-base font-bold text-white flex items-center space-x-2">
                        <span>{lang === 'pt-BR' ? item.namePt : item.nameEn}</span>
                      </h4>
                      <p className="text-xs text-[#a2d729] font-mono font-bold bg-[#a2d729]/10 w-fit px-2 py-0.5 rounded">
                        {lang === 'pt-BR' ? item.unitPt : item.unitEn}
                      </p>
                      <span className="text-xs text-neutral-300 font-sans block leading-relaxed">
                        {lang === 'pt-BR' ? item.descPt : item.descEn}
                      </span>
                    </div>

                    {/* Increment / Decrement controls */}
                    <div className="flex items-center justify-between sm:justify-end space-x-6 shrink-0">
                      <div className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl">
                        <button
                          id={`decrease-qty-${item.id}`}
                          type="button"
                          onClick={() => handleQuantityAdjust(item.id, false)}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-12 text-center font-mono font-black text-sm text-white">
                          {item.value}
                        </span>
                        <button
                          id={`increase-qty-${item.id}`}
                          type="button"
                          onClick={() => handleQuantityAdjust(item.id, true)}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-28 text-right">
                        <span className="text-[10px] text-neutral-400 block font-sans tracking-widest font-bold">SUBTOTAL</span>
                        <span className="text-base font-black font-mono text-[#fe9d00]">
                          R$ {(item.value * item.approxPriceUnit).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SEÇÃO DE COMBOS INTELIGENTES (Ajustado Conforme Recomendação do Usuário) --- */}
            <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-6 space-y-5 text-left backdrop-blur-md relative overflow-hidden">
              {!currentUser?.isLoggedIn && (
                <div id="results-combos-vip-lock" className="absolute inset-0 bg-[#0d0d0d]/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="max-w-md space-y-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-amber-400/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                      🔒 {lang === 'pt-BR' ? 'UPGRADE VIP REQUERIDO' : 'VIP TIER REQUIRED'}
                    </span>
                    <h5 className="text-xl font-bold text-white uppercase">
                      {lang === 'pt-BR' ? 'Acesso a Combos Prontos' : 'Access to Ready Combos'}
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {lang === 'pt-BR'
                        ? 'Nossos especialistas em coquetelaria montaram combinações prontas para acelerar a contratação da sua festa. Ative seu acesso VIP grátis para adicionar com um clique!'
                        : 'Our cocktail engineers structured complete combos to speed up your party setup. Unlock VIP to quickly apply combos in one tap!'}
                    </p>
                    <button
                      type="button"
                      onClick={controller.toggleUserTier}
                      className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black text-[11px] font-black uppercase tracking-widest py-3.5 px-6 rounded-xl hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      {lang === 'pt-BR' ? 'Ativar Versão VIP Grátis ✨' : 'Activate Free VIP Mode ✨'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-900 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#a2d729] bg-[#a2d729]/10 px-2.5 py-1 rounded-full uppercase">
                    {lang === 'pt-BR' ? 'UPGRADE DE EVENTO' : 'EVENT UPGRADES'}
                  </span>
                  <h4 className="text-base font-extrabold text-white font-sans">
                    {lang === 'pt-BR' ? '🍹 Combos Prontos Recomendados' : '🍹 Recommended Ready Combos'}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {lang === 'pt-BR' 
                      ? `Calibrados proporcionalmente para a sua escala de ${guests} pessoas.` 
                      : `Proportionately scaled to your setup for ${guests} guests.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* COMBO GIN TÔNICA */}
                <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4.5 flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#fe9d00] uppercase tracking-wider bg-[#fe9d00]/10 px-2 py-0.5 rounded-md">
                        GIN TÔNICA
                      </span>
                      <Zap className="w-4 h-4 text-[#fe9d00]" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed min-h-[50px]">
                      {lang === 'pt-BR' 
                        ? 'O queridinho dos eventos. Botânicos premium pareados com tônicas selecionadas e gelo de alta pureza.' 
                        : 'The benchmark party cocktail. Premium gin paired with top tonic waters and filtered ice.'}
                    </p>
                    <div className="border-t border-neutral-900/60 pt-3 space-y-1 font-mono text-[10px] text-neutral-300">
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Gin London Dry (750ml)' : 'London Dry Gin'}:</span>
                        <span className="font-bold text-white">{ginC_gin} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Tônicas Variadas' : 'Tonic Waters'}:</span>
                        <span className="font-bold text-white">{ginC_tonica} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Gelo em Cubos (5kg)' : 'Cubic Ice Pack'}:</span>
                        <span className="font-bold text-white">{ginC_gelo} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 pt-3 border-t border-neutral-900/45">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">Preço Estimado</span>
                      <span className="text-base font-black font-mono text-[#a2d729]">R$ {ginC_price.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addComboToPlanner('gin', [
                        { id: 'vodka', qty: ginC_gin },
                        { id: 'reco', qty: ginC_tonica },
                        { id: 'gelo', qty: ginC_gelo }
                      ])}
                      className="w-full bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-extrabold text-[10px] uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-black" />
                      <span>{lang === 'pt-BR' ? 'Adicionar Combo' : 'Apply Combo'}</span>
                    </button>
                  </div>
                </div>

                {/* COMBO VINHOS DO SOMMELIER */}
                <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4.5 flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md">
                        SOMMELIER COLLECTION
                      </span>
                      <Wine className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed min-h-[50px]">
                      {lang === 'pt-BR' 
                        ? 'Selecção de vinhos tintos secos reservas, brancos sauvignon blanc aromáticos e elegantes espumantes brut.' 
                        : 'Elite collection of reserves red dry wines, aromatic sauvignon blancs, and classic celebration brut.'}
                    </p>
                    <div className="border-t border-neutral-900/60 pt-3 space-y-1 font-mono text-[10px] text-neutral-300">
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Tinto Seco Reserva' : 'Reserve Dry Red'}:</span>
                        <span className="font-bold text-white">{wineC_tinto} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Sauvignon Blanc 750ml' : 'Sauvignon Blanc'}:</span>
                        <span className="font-bold text-white">{wineC_branco} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Espumante Brut' : 'Brut Sparkling'}:</span>
                        <span className="font-bold text-white">{wineC_espumante} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 pt-3 border-t border-neutral-900/45">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">Preço Estimado</span>
                      <span className="text-base font-black font-mono text-[#a2d729]">R$ {wineC_price.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addComboToPlanner('wine', [
                        { id: 'vinho', qty: wineC_tinto + wineC_branco + wineC_espumante }
                      ])}
                      className="w-full bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-extrabold text-[10px] uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-black" />
                      <span>{lang === 'pt-BR' ? 'Adicionar Combo' : 'Apply Combo'}</span>
                    </button>
                  </div>
                </div>

                {/* COMBO CHURRASCO BEER */}
                <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4.5 flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#a2d729] uppercase tracking-wider bg-[#a2d729]/10 px-2 py-0.5 rounded-md">
                        CHURRASCO & CERVEJA
                      </span>
                      <Beer className="w-4 h-4 text-[#a2d729]" />
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed min-h-[50px]">
                      {lang === 'pt-BR' 
                        ? 'Cerveja Pilsen leve, IPA artesanal lupulada e sacos de gelo calibrados para manter tudo trincando.' 
                        : 'Crisp pilsen beer, aromatic hoppy IPA and filtered ice.'}
                    </p>
                    <div className="border-t border-neutral-900/60 pt-3 space-y-1 font-mono text-[10px] text-neutral-300">
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Pilsen Premium (355ml)' : 'Pilsen Long Neck'}:</span>
                        <span className="font-bold text-white">{beerC_pilsen} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'IPA Artesanal (473ml)' : 'Hoppy Craft IPA'}:</span>
                        <span className="font-bold text-white">{beerC_ipa} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• {lang === 'pt-BR' ? 'Gelo em Cubos (5kg)' : 'Cubic Ice Pack'}:</span>
                        <span className="font-bold text-white">{beerC_gelo} {lang === 'pt-BR' ? 'un' : 'pcs'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2 pt-3 border-t border-neutral-900/45">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">Preço Estimado</span>
                      <span className="text-base font-black font-mono text-[#a2d729]">R$ {beerC_price.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addComboToPlanner('beer', [
                        { id: 'cerveja', qty: beerC_pilsen + beerC_ipa },
                        { id: 'gelo', qty: beerC_gelo }
                      ])}
                      className="w-full bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-extrabold text-[10px] uppercase py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-1 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-black" />
                      <span>{lang === 'pt-BR' ? 'Adicionar Combo' : 'Apply Combo'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- SEÇÃO ADICIONAL DE EXPERIÊNCIA & SERVIÇOS CONCIERGE (Baseado no Feedback do Cliente) --- */}
            <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6 text-left backdrop-blur-md relative overflow-hidden">
              {!currentUser?.isLoggedIn && (
                <div id="results-experience-vip-lock" className="absolute inset-0 bg-[#0d0d0d]/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                  <div className="max-w-md space-y-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-amber-400/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
                      🔒 {lang === 'pt-BR' ? 'CONCIERGE VIP REQUERIDO' : 'VIP CONCIERGE REQUIRED'}
                    </span>
                    <h5 className="text-xl font-bold text-white uppercase">
                      {lang === 'pt-BR' ? 'Equipe Professional & Estrutura de Bar' : 'Professional Staff & Bar Counters'}
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {lang === 'pt-BR'
                        ? 'Contrate bartenders de elite e selecione designs requintados de balcão (cobre, rustic metal ou LED). Faça o upgrade VIP para estender sua simulação a estes serviços!'
                        : 'Hire elite mixologists and choose exquisite bar structures (rustic wood, copper, or glowing LED). Upgrade to VIP to include staff and bars in your proposal!'}
                    </p>
                    <button
                      type="button"
                      onClick={controller.toggleUserTier}
                      className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black text-[11px] font-black uppercase tracking-widest py-3.5 px-6 rounded-xl hover:scale-102 active:scale-98 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      {lang === 'pt-BR' ? 'Ativar Versão VIP Grátis ✨' : 'Activate Free VIP Mode ✨'}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#fe9d00] bg-[#fe9d00]/10 px-2.5 py-1 rounded-full uppercase">
                    {lang === 'pt-BR' ? 'Serviços de Experiência' : 'Experience Add-ons'}
                  </span>
                  <h4 className="text-base font-extrabold text-white font-sans">
                    {lang === 'pt-BR' ? 'Equipe de Bartenders & Estrutura de Bar' : 'Mixology Team & Bar Setup'}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                {/* Contratação de Bartenders (Profissionais de Coquetelaria) */}
                <div className={`p-4.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${addBartenders ? 'bg-[#fe9d00]/5 border-[#fe9d00]/30' : 'bg-neutral-950/40 border-neutral-900'}`}>
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <label className="flex items-center space-x-2.5 text-xs font-bold text-white cursor-pointer select-none">
                        <input 
                          type="checkbox"
                          checked={addBartenders}
                          onChange={(e) => setAddBartenders(e.target.checked)}
                          className="accent-[#fe9d00] w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-sm font-bold">{lang === 'pt-BR' ? 'Contratar Bartenders Profissionais' : 'Hire Professional Bartenders'}</span>
                      </label>
                      <span className="text-[11px] font-mono font-bold text-[#fe9d00] bg-[#fe9d00]/10 px-2 py-0.5 rounded-full">R$ 380 / prof</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans mt-1">
                      {lang === 'pt-BR' 
                        ? 'Profissionais selecionados para preparar e servir seu menu com maestria, incluindo utensílios profissionais.' 
                        : 'Elite staff designated to craft and present your selected menu with premium cocktail tools.'}
                    </p>
                  </div>

                  {addBartenders && (
                    <div className="mt-4 pt-4 border-t border-neutral-900/60 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {lang === 'pt-BR' ? `Sugerido (${guests} conv.):` : `Recommended (${guests} guests):`}
                        <strong className="text-white ml-1">{Math.max(1, Math.ceil(guests / 25))} {lang === 'pt-BR' ? 'prof.' : 'pros.'}</strong>
                      </span>
                      <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-850 p-1 rounded-xl">
                        <button
                          id="decrease-bartenders"
                          type="button"
                          onClick={() => setBartendersCount(prev => Math.max(1, prev - 1))}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-xs text-white">
                          {bartendersCount}
                        </span>
                        <button
                          id="increase-bartenders"
                          type="button"
                          onClick={() => {
                            const isVip = !!currentUser?.isLoggedIn;
                            if (!isVip && bartendersCount >= 1) {
                              triggerToast(
                                lang === 'pt-BR' 
                                  ? 'Limite Grátis: Apenas 1 profissional permitido. Altere para VIP!' 
                                  : 'Free limit: Only 1 bartender allowed. Activate VIP!'
                              );
                            } else {
                              setBartendersCount(prev => prev + 1);
                            }
                          }}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Escolha do Estilo e Design do Balcão */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                    {lang === 'pt-BR' ? 'DESIGN E ESTRUTURA FÍSICA DO BAR' : 'BAR COUNTER STYLE & AMBIENCE'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPremiumBarSetup(premiumBarSetup === 'standard' ? 'none' : 'standard')}
                      className={`p-2 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-[95px] relative overflow-hidden ${
                        premiumBarSetup === 'standard' 
                          ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-md' 
                          : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase text-neutral-300 block">Classic</span>
                        <span className="text-[8px] leading-tight block mt-1 text-neutral-400">{lang === 'pt-BR' ? 'Balcão Rústico e Copos Vidro' : 'Glass Cups & Table'}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#fe9d00] block mt-2">R$ 250</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const isVip = !!currentUser?.isLoggedIn;
                        if (!isVip) {
                          triggerToast(
                            lang === 'pt-BR' 
                              ? 'Mobiliário Rustic Wood é exclusivo para contas VIP!' 
                              : 'Rustic Wood setups require a premium VIP account!'
                          );
                        } else {
                          setPremiumBarSetup(premiumBarSetup === 'rustic' ? 'none' : 'rustic');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-[95px] relative overflow-hidden ${
                        premiumBarSetup === 'rustic' 
                          ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-md' 
                          : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#fe9d00] flex items-center gap-1.5">
                          <span>Rustic Wood</span>
                          {!currentUser?.isLoggedIn && <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0" />}
                        </span>
                        <span className="text-[8px] leading-tight block mt-1 text-neutral-400">{lang === 'pt-BR' ? 'Madeira Nobre e Cobre vintage' : 'Noble Wood & Copper'}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#fe9d00] block mt-2">R$ 550</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const isVip = !!currentUser?.isLoggedIn;
                        if (!isVip) {
                          triggerToast(
                            lang === 'pt-BR' 
                              ? 'Balcão espelhado Led Mirror é exclusivo de usuários VIP!' 
                              : 'Led Mirror setups require a premium VIP account!'
                          );
                        } else {
                          setPremiumBarSetup(premiumBarSetup === 'luxury' ? 'none' : 'luxury');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between h-[95px] relative overflow-hidden ${
                        premiumBarSetup === 'luxury' 
                          ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-md' 
                          : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-800 text-neutral-450'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#a2d729] flex items-center gap-1.5">
                          <span>Led Mirror</span>
                          {!currentUser?.isLoggedIn && <Lock className="w-2.5 h-2.5 text-amber-500 shrink-0" />}
                        </span>
                        <span className="text-[8px] leading-tight block mt-1 text-neutral-400">{lang === 'pt-BR' ? 'Espelhado Premium & Luz Led' : 'Mirror & Led Panel'}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#fe9d00] block mt-2">R$ 850</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment subtotal calculations and print proposal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Total project card */}
              <div className="md:col-span-7 bg-[#161616]/70 border border-neutral-800/85 rounded-3xl p-6 md:p-8 space-y-5 text-left shadow-xl">
                <span className="text-xs font-mono font-bold text-[#fe9d00] tracking-widest block uppercase">
                  {currentTranslation.estimatedInvestment.toUpperCase()}
                </span>

                <div className="space-y-3.5 font-mono text-xs">
                  <div className="flex justify-between text-neutral-200 text-sm">
                    <span>{currentTranslation.subtotalProducts}</span>
                    <span className="font-bold text-white">R$ {customTotals.subtotal.toFixed(2)}</span>
                  </div>

                  {totalAdicionais > 0 && (
                    <div className="flex justify-between text-neutral-200 border-b border-neutral-800 pb-2.5 text-sm">
                       <span>{lang === 'pt-BR' ? 'Serviços de Bar & Equipe (Adicionais)' : 'Bar Services & Staff (Addons)'}</span>
                       <span className="text-white font-bold">+ R$ {totalAdicionais.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-neutral-200 text-sm">
                    <span>{currentTranslation.scheduledDelivery}</span>
                    <span className="text-xs bg-[#a2d729]/15 text-[#a2d729] font-black px-2.5 py-1 rounded font-mono uppercase tracking-wide">
                      {currentTranslation.freeBadge}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#fe9d00] py-2.5 border-t border-b border-neutral-800">
                    <span className="flex items-center gap-1.5 text-sm text-neutral-300 font-sans">
                      <span>{currentTranslation.loyaltyDiscount} (7%)</span>
                      {!currentUser?.isLoggedIn && (
                        <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black tracking-widest font-mono">
                          VIP 🔒
                        </span>
                      )}
                    </span>
                    {currentUser?.isLoggedIn ? (
                      <span className="text-[#fe9d00] font-black font-mono text-base">- R$ {descontoGeral.toFixed(2)}</span>
                    ) : (
                      <button
                        id="activate-discount-results-btn"
                        type="button"
                        onClick={() => {
                          controller.toggleUserTier();
                          triggerToast(
                            lang === 'pt-BR' 
                              ? 'Parabéns! Conta VIP ativada e desconto de 7% aplicado!' 
                              : 'Congratulations! VIP Account activated and 7% discount applied!'
                          );
                        }}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold font-sans underline cursor-pointer bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 hover:bg-amber-500/20 transition-all"
                      >
                        {lang === 'pt-BR' ? 'Ativar Desconto VIP' : 'Unlock VIP Discount'}
                      </button>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-800 flex justify-between items-baseline text-white">
                    <span className="font-sans text-base font-black uppercase tracking-wide text-neutral-200">{currentTranslation.projectTotal}</span>
                    <div className="text-right">
                      <p className="text-3xl font-black font-mono tracking-tight text-[#a2d729]">
                        R$ {totalGeral.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 gap-3 flex flex-col sm:flex-row font-sans">
                  <button
                    id="confirm-planning-btn"
                    onClick={handleConfirmPlan}
                    className="flex-1 bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black font-extrabold text-sm py-3 px-5 rounded-2xl hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{currentTranslation.confirmPlanningBtn}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    id="print-proposal-btn"
                    onClick={() => {
                      window.print();
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold text-xs p-3.5 rounded-2xl hover:bg-neutral-850 flex items-center justify-center cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[9px] font-mono text-neutral-500 block text-center uppercase">
                  * {currentTranslation.subjectToStock}
                </span>
              </div>

              {/* Right side helper insight info */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4 font-sans">
                <div className="p-5 bg-[#161616]/40 border border-[#fe9d00]/20 rounded-3xl text-left space-y-3 flex-1">
                  <div className="flex items-center space-x-2 text-[#fe9d00] text-xs font-bold tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#fe9d00]" />
                    <span>{currentTranslation.conciergeInsightTitle.toUpperCase()}</span>
                  </div>
                  <p className="text-neutral-300 text-xs leading-relaxed italic">
                    {currentTranslation.weatherTip}
                  </p>
                  
                  {/* Action trigger which adds 20% to ice item instantly */}
                  <button 
                    id="apply-weather-ice-tip"
                    onClick={() => {
                      setCustomQuantities(prev => 
                        prev.map(item => {
                          if (item.id === 'gelo') {
                            return { ...item, value: Math.ceil(item.value * 1.2) };
                          }
                          return item;
                        })
                      );
                      triggerToast(lang === 'pt-BR' ? 'Ajustado com sucesso!' : 'Successfully adjusted ice bags!');
                    }}
                    className="w-full bg-[#fe9d00]/10 hover:bg-[#fe9d00]/15 border border-[#fe9d00]/30 transition-colors text-neutral-300 py-2.5 px-4 rounded-xl text-center text-xs font-mono font-bold cursor-pointer font-sans"
                  >
                    {lang === 'pt-BR' ? 'Aplicar Ajuste de Gelo (+20%)' : 'Apply Ice Adjustment (+20%)'}
                  </button>
                </div>

                {/* Actions planning back transition */}
                <button
                  id="recalculate-back-btn"
                  type="button"
                  onClick={() => {
                    setIsCalculated(false);
                    triggerToast(lang === 'pt-BR' ? 'Retornando ao setup para ajustar dados' : 'Returning to setup to adjust parameters');
                  }}
                  className="bg-[#121212]/30 hover:bg-[#121212]/80 transition-colors border border-neutral-800 p-4 rounded-2xl text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer"
                >
                  {lang === 'pt-BR' ? '← Ajustar Dados da Festa' : '← Adjust Party Parameters'}
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout success simulator */}
      <AnimatePresence>
        {showCheckOutSuccess && (
          <motion.div 
            id="checkout-success-view-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 h-screen"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#141414] border border-neutral-800 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#a2d729]/15 border-2 border-[#a2d729] flex items-center justify-center mx-auto text-[#a2d729]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {lang === 'pt-BR' ? 'Planejamento Salvo!' : 'Plan Saved Successfully!'}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {lang === 'pt-BR' 
                    ? 'Sua proposta de bebidas foi computada. Os dados de entrega cortesia foram repassados para sua conta de anfitrião.' 
                    : 'Your drink proposal was captured successfully. Free shipping parameters have been associated with your manager account.'}
                </p>
              </div>

              <div className="space-y-3 font-sans">
                <button
                  id="success-go-to-cart-btn"
                  onClick={() => {
                    setShowCheckOutSuccess(false);
                    setActiveTab('cart');
                  }}
                  className="w-full bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] hover:brightness-110 text-black font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-[#fe9d00]/25 flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4 text-black fill-black" />
                  <span>{lang === 'pt-BR' ? 'Ir para o Carrinho & Finalizar Compra' : 'Go to Cart & Finish Purchase'}</span>
                </button>

                <div className="flex gap-3">
                  <button
                    id="success-view-history-btn"
                    onClick={() => {
                      setShowCheckOutSuccess(false);
                      setActiveTab('history');
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 font-bold text-[10px] py-2.5 rounded-xl cursor-pointer font-sans"
                  >
                    {lang === 'pt-BR' ? 'Ver no Histórico' : 'View History'}
                  </button>
                  <button
                    id="success-back-home-btn"
                    onClick={() => {
                      setShowCheckOutSuccess(false);
                      setActiveTab('dashboard');
                    }}
                    className="flex-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-300 font-bold text-[10px] py-2.5 rounded-xl cursor-pointer font-sans"
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
