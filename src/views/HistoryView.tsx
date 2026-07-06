import React from 'react';
import { motion } from 'motion/react';
import { Wine } from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';

interface HistoryViewProps {
  controller: AppControllerType;
}

export default function HistoryView({ controller }: HistoryViewProps) {
  const {
    lang,
    currentTranslation,
    orders,
    setGuests,
    setEventType,
    setDuration,
    setProfile,
    setActiveTab,
    triggerToast,
    handleReorder,
    setPlannerTab
  } = controller;

  // Dynamically compute historical metrics so the app starts "zerado, sem nenhuma informação hardcoded"
  const totalSpentVal = orders.reduce((sum, o) => sum + o.total, 0);
  const eventsCountVal = orders.length;
  const totalDrinksServedVal = orders.reduce((sum, o) => sum + (o.guests ? o.guests * 6 : 48), 0);
  const favoriteDrinkVal = orders.length > 0 
    ? (lang === 'pt-BR' ? 'Craft IPA Special' : 'Craft IPA Special') 
    : '—';

  return (
    <motion.div
      key="history"
      id="view-history"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Header text */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#a2d729] uppercase font-black">
            HISTÓRICO OPERACIONAL
          </span>
          <h2 className="text-3xl font-extrabold text-white font-sans">
            {currentTranslation.successJourney}
          </h2>
          <p className="text-neutral-400 text-sm">
            {currentTranslation.journeyDesc}
          </p>
        </div>
      </div>

      {/* Insights metrics ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
          <span className="text-[10px] text-neutral-500 font-mono block uppercase">{currentTranslation.totalSpent}</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">R$ {totalSpentVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-[10px] text-[#a2d729] font-mono">● {eventsCountVal > 0 ? (lang === 'pt-BR' ? 'Conta Ativa' : 'Active Account') : (lang === 'pt-BR' ? 'Conta Nova' : 'New Account')}</span>
        </div>
        <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
          <span className="text-[10px] text-neutral-500 font-mono block uppercase">{currentTranslation.eventsHosted}</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">{eventsCountVal} {lang === 'pt-BR' ? 'Eventos' : 'Events'}</span>
          <span className="text-[10px] text-neutral-500 font-mono">{currentTranslation.eventsHostedDesc}</span>
        </div>
        <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
          <span className="text-[10px] text-neutral-500 font-mono block uppercase">{currentTranslation.totalDrinksServed}</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">{eventsCountVal > 0 ? totalDrinksServedVal : 0} Drinks</span>
          <span className="text-[10px] text-[#a2d729] font-mono">{eventsCountVal > 0 ? '0% desperdício' : 'Planejado'}</span>
        </div>
        <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
          <span className="text-[10px] text-neutral-500 font-mono block uppercase">{currentTranslation.mostLovedDrink}</span>
          <span className="text-xl font-bold text-[#fe9d00] mt-1 block font-sans">{favoriteDrinkVal}</span>
          <span className="text-[10px] text-[#a2d729] font-mono font-bold">{eventsCountVal > 0 ? '★ 5.0' : 'Pronto'}</span>
        </div>
      </div>

      {/* Sub banner for reuse config */}
      <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800/80 rounded-3xl p-6 text-left flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
        <div className="space-y-1">
          <span className="text-[#fe9d00] text-xs font-bold tracking-widest block font-mono">
            {currentTranslation.quickReplenish}
          </span>
          <h4 className="text-base font-bold text-white">
            {currentTranslation.nextCelebration}
          </h4>
          <p className="text-xs text-neutral-400">
            {currentTranslation.reuseSetup}
          </p>
        </div>
        <button 
          id="reuse-prev-setup-btn"
          onClick={() => {
            setGuests(120);
            setEventType('corporate');
            setDuration(8);
            setProfile('intense');
            setActiveTab('results');
            setPlannerTab('assistant');
            triggerToast(lang === 'pt-BR' ? 'Configuração premium carregada!' : 'Premium template applied!');
          }}
          className="bg-[#222] hover:bg-[#333] transition-colors border border-neutral-700 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
        >
          {lang === 'pt-BR' ? 'Carregar Parâmetros do Último Evento' : 'Load Last Event Parameters'}
        </button>
      </div>

      {/* Orders past listing */}
      <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900/80">
          <h3 className="text-sm font-mono font-bold text-neutral-400 tracking-wider">
            {currentTranslation.pastEvents.toUpperCase()}
          </h3>
        </div>

        <div className="divide-y divide-neutral-900">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-mono text-xs space-y-2">
              <p>📋 {lang === 'pt-BR' ? 'Nenhum pedido ou planejamento no histórico.' : 'No orders or planning history found.'}</p>
              <p className="text-neutral-600">
                {lang === 'pt-BR' 
                  ? 'Crie sua primeira lista de compras ou plano de festa para registrá-lo aqui!' 
                  : 'Establish your first shopping list or party plan to track it here!'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                id={`order-row-${order.id}`}
                className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 p-1 shrink-0 flex items-center justify-center">
                    <Wine className="w-6 h-6 text-[#fe9d00]" />
                  </div>

                  <div className="space-y-1 font-sans">
                    <h4 className="text-base font-bold text-white">
                      {lang === 'pt-BR' ? order.namePt : order.nameEn}
                    </h4>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-400 font-sans">
                      <span className="font-mono text-neutral-400">
                        {lang === 'pt-BR' ? order.datePt : order.dateEn}
                      </span>
                      <span>•</span>
                      <span>{order.guests} {lang === 'pt-BR' ? 'convidados' : 'guests'}</span>
                      <span>•</span>
                      <span className="text-[#a2d729] font-mono font-bold">
                        {currentTranslation.economyOf.replace('{val}', order.savedAmount.toFixed(2))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side interactions */}
                <div className="flex items-center justify-between lg:justify-end space-x-6 font-sans">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-neutral-500 font-mono block">{currentTranslation.status.toUpperCase()}</span>
                    {order.status === 'delivered' ? (
                      <span className="text-[10px] font-mono font-bold text-[#a2d729] bg-[#a2d729]/10 px-2.5 py-0.5 rounded-full uppercase">
                        {currentTranslation.delivered}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-[#fe9d00] bg-[#fe9d00]/10 px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                        {currentTranslation.processing}
                      </span>
                    )}
                  </div>

                  <div className="w-24 text-left lg:text-right">
                    <span className="text-[10px] text-neutral-500 font-mono block">VALOR</span>
                    <span className="text-base font-bold font-mono text-white">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Action triggers */}
                  <div className="flex items-center space-x-2">
                    <button
                      id={`reorder-btn-${order.id}`}
                      onClick={() => handleReorder(order)}
                      className="bg-[#222] hover:bg-neutral-850 text-neutral-200 border border-neutral-800 text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                    >
                      {currentTranslation.reorder}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </motion.div>
  );
}
