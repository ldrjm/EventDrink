import React from 'react';
import { motion } from 'motion/react';
import { 
  Cake, 
  Users, 
  Wine, 
  GlassWater, 
  Minus, 
  Plus, 
  Sparkles, 
  Info,
  Clock,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { calculatePlanejamento } from '../utils/calculator';

interface AssistantViewProps {
  controller: AppControllerType;
}

export default function AssistantView({ controller }: AssistantViewProps) {
  const {
    lang,
    currentTranslation,
    eventType,
    setEventType,
    duration,
    setDuration,
    drinkersCount,
    setDrinkersCount,
    nonDrinkersCount,
    setNonDrinkersCount,
    setCustomQuantities,
    setIsCalculated,
    setActiveTab,
    triggerToast
  } = controller;

  const totalGuests = drinkersCount + nonDrinkersCount;

  const [formError, setFormError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!formError) return;
    if (totalGuests > 0 && duration > 0) {
      setFormError(null);
    }
  }, [totalGuests, duration, formError]);

  const handleQuickScale = (total: number) => {
    // Distribute 60% drinkers, 40% non-drinkers for quick setup
    const drinkers = Math.round(total * 0.6);
    const nonDrinkers = total - drinkers;
    setDrinkersCount(drinkers);
    setNonDrinkersCount(nonDrinkers);
    setFormError(null);
    triggerToast(
      lang === 'pt-BR' 
        ? `Preenchido com ${total} pessoas (${drinkers} bebem, ${nonDrinkers} não bebem)`
        : `Populated with ${total} guests (${drinkers} drinking, ${nonDrinkers} non-drinking)`
    );
  };

  const handleCalculate = () => {
    if (totalGuests === 0) {
      const message = lang === 'pt-BR'
        ? 'Por favor, adicione pelo menos 1 convidado para calcular.'
        : 'Please add at least 1 guest to calculate.';
      setFormError(message);
      triggerToast(message);
      return;
    }
    if (duration === 0) {
      const message = lang === 'pt-BR'
        ? 'Por favor, ajuste a duração do evento.'
        : 'Please specify the event duration.';
      setFormError(message);
      triggerToast(message);
      return;
    }

    setFormError(null);
    const output = calculatePlanejamento({
      eventType,
      guests: totalGuests,
      duration,
      drinkersCount,
      nonDrinkersCount
    });

    setCustomQuantities(output.items);
    setIsCalculated(true);
    setActiveTab('results');
    triggerToast(
      lang === 'pt-BR'
        ? 'Cálculo de insumos personalizado computado com sucesso! ✨'
        : 'Custom supply quantities successfully calculated! ✨'
    );
  };

  return (
    <motion.div
      key="assistant"
      id="view-assistant"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* HEADER SECTION */}
      <div className="space-y-2 text-left">
        <span className="text-[10px] font-mono tracking-widest text-[#a2d729] bg-[#a2d729]/10 px-3 py-1 rounded-full font-extrabold uppercase">
          {lang === 'pt-BR' ? 'Planejador de Bebidas Simplificado' : 'Simplified Drink Planner'}
        </span>
        <h2 className="text-2xl font-black tracking-tight text-white">
          {lang === 'pt-BR' ? 'Configure sua Festa de Forma Inteligente' : 'Configure Your Celebration Smartly'}
        </h2>
        <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl">
          {lang === 'pt-BR'
            ? 'Defina os parâmetros essenciais abaixo. Nosso algoritmo recalcula e distribui os volumes exatos de bebidas com álcool, sem álcool, refrigerantes e gelo para evitar desperdícios.'
            : 'Specify the key parameters below. Our algorithm calculates and distributes exact volumes of alcohol, soft drinks, water, and ice down to the last drop.'}
        </p>
      </div>

      {/* CORE CONTROLS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TYPE & DURATION (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* CARD 1: PARTY TYPE */}
          <div className="bg-[#161616]/70 border border-neutral-800/80 rounded-2xl p-5 md:p-6 space-y-4 text-left">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-3 rounded bg-[#fe9d00]" />
              <label className="text-xs font-mono font-black text-neutral-300 tracking-wider uppercase">
                {lang === 'pt-BR' ? '1. Tipo de Festa' : '1. Party Type'}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3" role="group" aria-label="Tipo de Festa">
              {/* CASUAL */}
              <button
                id="type-btn-casual"
                type="button"
                onClick={() => {
                  setEventType('casual');
                  triggerToast(lang === 'pt-BR' ? 'Estilo Casual selecionado.' : 'Casual style selected.');
                }}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer focus:outline-none ${
                  eventType === 'casual'
                    ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-[0_0_15px_rgba(254,157,0,0.15)] font-bold'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <GlassWater className={`w-5 h-5 mb-2 ${eventType === 'casual' ? 'text-[#fe9d00]' : 'text-neutral-500'}`} />
                <span className="text-xs font-extrabold">{lang === 'pt-BR' ? 'Casual' : 'Casual'}</span>
                <span className={`text-[10px] font-mono mt-0.5 leading-none ${eventType === 'casual' ? 'text-amber-300' : 'text-neutral-400'}`}>
                  {lang === 'pt-BR' ? 'Festa de amigos' : 'Friends gathering'}
                </span>
              </button>

              {/* ANIVERSÁRIO */}
              <button
                id="type-btn-aniversario"
                type="button"
                onClick={() => {
                  setEventType('aniversario');
                  triggerToast(lang === 'pt-BR' ? 'Estilo Aniversário selecionado.' : 'Birthday style selected.');
                }}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer focus:outline-none ${
                  eventType === 'aniversario'
                    ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-[0_0_15px_rgba(254,157,0,0.15)] font-bold'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Cake className={`w-5 h-5 mb-2 ${eventType === 'aniversario' ? 'text-[#fe9d00]' : 'text-neutral-500'}`} />
                <span className="text-xs font-extrabold">{lang === 'pt-BR' ? 'Aniversário' : 'Birthday'}</span>
                <span className={`text-[10px] font-mono mt-0.5 leading-none ${eventType === 'aniversario' ? 'text-amber-300' : 'text-neutral-400'}`}>
                  {lang === 'pt-BR' ? 'Comemorações' : 'Celebrations'}
                </span>
              </button>

              {/* REUNIÃO */}
              <button
                id="type-btn-reuniao"
                type="button"
                onClick={() => {
                  setEventType('reuniao');
                  triggerToast(lang === 'pt-BR' ? 'Estilo Reunião selecionado.' : 'Meeting style selected.');
                }}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer focus:outline-none ${
                  eventType === 'reuniao'
                    ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-[0_0_15px_rgba(254,157,0,0.15)] font-bold'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Users className={`w-5 h-5 mb-2 ${eventType === 'reuniao' ? 'text-[#fe9d00]' : 'text-neutral-500'}`} />
                <span className="text-xs font-extrabold">{lang === 'pt-BR' ? 'Reunião' : 'Meeting / Social'}</span>
                <span className={`text-[10px] font-mono mt-0.5 leading-none ${eventType === 'reuniao' ? 'text-amber-300' : 'text-neutral-400'}`}>
                  {lang === 'pt-BR' ? 'Foco corporativo' : 'Corporate focus'}
                </span>
              </button>

              {/* OUTROS */}
              <button
                id="type-btn-outros"
                type="button"
                onClick={() => {
                  setEventType('outros');
                  triggerToast(lang === 'pt-BR' ? 'Estilo Outros selecionado.' : 'Other style selected.');
                }}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer focus:outline-none ${
                  eventType === 'outros'
                    ? 'bg-[#fe9d00]/10 border-[#fe9d00] text-white shadow-[0_0_15px_rgba(254,157,0,0.15)] font-bold'
                    : 'border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Flame className={`w-5 h-5 mb-2 ${eventType === 'outros' ? 'text-[#fe9d00]' : 'text-neutral-500'}`} />
                <span className="text-xs font-extrabold">{lang === 'pt-BR' ? 'Outros' : 'Others'}</span>
                <span className={`text-[10px] font-mono mt-0.5 leading-none ${eventType === 'outros' ? 'text-amber-300' : 'text-neutral-400'}`}>
                  {lang === 'pt-BR' ? 'Demais ocasiões' : 'Dynamic events'}
                </span>
              </button>
            </div>
          </div>

          {/* CARD 2: DURATION */}
          <div className="bg-[#161616]/70 border border-neutral-800/80 rounded-2xl p-5 md:p-6 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-3 rounded bg-[#fe9d00]" />
                <label className="text-xs font-mono font-black text-neutral-300 tracking-wider uppercase">
                  {lang === 'pt-BR' ? '2. Duração do Evento' : '2. Event Duration'}
                </label>
              </div>
              <span className="bg-neutral-900 border border-neutral-800 text-[#fe9d00] font-mono font-black px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#fe9d00]" />
                {duration} {lang === 'pt-BR' ? 'Horas' : 'Hours'}
              </span>
            </div>

            <div className="space-y-4">
              <input 
                id="duration-slider-range"
                type="range"
                min="0"
                max="24"
                value={duration}
                onChange={(e) => {
                  setDuration(parseInt(e.target.value));
                  setFormError(null);
                }}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#fe9d00]"
              />
              <div className="flex justify-between font-mono text-[9px] text-neutral-500">
                <span>0H ({lang === 'pt-BR' ? 'Zerar' : 'Clear'})</span>
                <div className="flex gap-1.5">
                  {[2, 4, 6, 8, 12].map((hr) => (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => {
                        setDuration(hr);
                        setFormError(null);
                        triggerToast(`${hr} h`);
                      }}
                      className={`px-2 py-0.5 text-[9px] select-none rounded border transition-all cursor-pointer ${
                        duration === hr 
                          ? 'border-[#fe9d00] bg-[#fe9d00]/10 text-[#fe9d00] font-bold' 
                          : 'border-neutral-800 bg-neutral-900/40 text-neutral-450 hover:border-neutral-700'
                      }`}
                    >
                      {hr}h
                    </button>
                  ))}
                </div>
                <span>24 HORAS</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GUESTS & ALCOHOL SPLIT (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#161616]/70 border border-neutral-800/80 rounded-2xl p-5 md:p-6 space-y-5 text-left h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-3 rounded bg-[#fe9d00]" />
                <label className="text-xs font-mono font-black text-neutral-300 tracking-wider uppercase">
                  {lang === 'pt-BR' ? '3. Convidados & Álcool' : '3. Guests & Alcohol'}
                </label>
              </div>

              {/* CARD ALCOHOL CONSUMERS */}
              <div className="bg-gradient-to-tr from-amber-500/10 to-yellow-600/5 border border-amber-500/20 rounded-xl p-4 space-y-3 relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 transition-transform duration-500">
                  <Wine className="w-10 h-10 text-amber-500" />
                </div>

                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-xs font-black text-amber-400 uppercase tracking-wide">
                      {lang === 'pt-BR' ? 'Toma Álcool' : 'Drink Alcohol'}
                    </h3>
                    <p className="text-[10px] text-neutral-450">
                      {lang === 'pt-BR' ? 'Cerveja, vinho, destilados' : 'Beers, wines, spirits'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2.5 bg-black/40 border border-neutral-800/50 rounded-xl p-1 h-9 shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        setDrinkersCount(prev => Math.max(0, prev - 1));
                        setFormError(null);
                      }}
                      className="w-7 h-7 hover:bg-neutral-850/80 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="number"
                      value={drinkersCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setDrinkersCount(isNaN(val) ? 0 : Math.max(0, val));
                        setFormError(null);
                      }}
                      className="w-10 bg-transparent text-center text-sm font-black font-mono text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDrinkersCount(prev => prev + 1);
                        setFormError(null);
                      }}
                      className="w-7 h-7 hover:bg-neutral-850/80 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Consumer mini slider */}
                <input 
                  type="range"
                  min="0"
                  max="200"
                  value={drinkersCount}
                  onChange={(e) => setDrinkersCount(parseInt(e.target.value))}
                  className="w-full h-1 bg-amber-500/20 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              {/* CARD ALCOHOL-FREE CONSUMERS */}
              <div className="bg-gradient-to-tr from-cyan-500/10 to-teal-500/5 border border-cyan-500/20 rounded-xl p-4 space-y-3 relative overflow-hidden group">
                <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 transition-transform duration-500">
                  <GlassWater className="w-10 h-10 text-cyan-400" />
                </div>

                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wide">
                      {lang === 'pt-BR' ? 'Não Toma Álcool' : 'Alcohol-Free Only'}
                    </h3>
                    <p className="text-[10px] text-neutral-450">
                      {lang === 'pt-BR' ? 'Sucos, refrigerantes, água' : 'Juices, sodas, water'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2.5 bg-black/40 border border-neutral-800/50 rounded-xl p-1 h-9 shadow-inner">
                    <button
                      type="button"
                      onClick={() => {
                        setNonDrinkersCount(prev => Math.max(0, prev - 1));
                        setFormError(null);
                      }}
                      className="w-7 h-7 hover:bg-neutral-850/80 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="number"
                      value={nonDrinkersCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setNonDrinkersCount(isNaN(val) ? 0 : Math.max(0, val));
                        setFormError(null);
                      }}
                      className="w-10 bg-transparent text-center text-sm font-black font-mono text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNonDrinkersCount(prev => prev + 1);
                        setFormError(null);
                      }}
                      className="w-7 h-7 hover:bg-neutral-850/80 rounded-lg text-neutral-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Consumer mini slider */}
                <input 
                  type="range"
                  min="0"
                  max="200"
                  value={nonDrinkersCount}
                  onChange={(e) => setNonDrinkersCount(parseInt(e.target.value))}
                  className="w-full h-1 bg-cyan-500/20 rounded accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* TOTAL GUESTS INDICATOR */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col space-y-3">
              <div className="flex justify-between items-center text-left">
                <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">
                  {lang === 'pt-BR' ? 'Pessoas Presentes' : 'Total Guests'}
                </span>
                <span className="text-xl font-black text-white font-mono flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#a2d729]" />
                  {totalGuests}
                </span>
              </div>

              {/* Quick pre-select scale helpers */}
              <div className="flex flex-wrap gap-1.5">
                {[10, 25, 50, 100].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleQuickScale(num)}
                    className="px-2 py-1 text-[9px] font-mono tracking-tight font-bold rounded border border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-700 cursor-pointer hover:bg-neutral-800 transition-all select-none"
                  >
                    {num} p.
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {formError && (
          <div className="md:col-span-12 w-full bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-2xl font-mono text-sm">
            {formError}
          </div>
        )}

      </div>

      {/* FOOTER INFO BOX & CALL TO ACTION */}
      <div className="p-6 bg-[#161616]/70 border border-neutral-800/80 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start space-x-3 text-left">
          <Info className="w-5 h-5 text-[#a2d729] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-white block">
              {lang === 'pt-BR' ? 'Ajuste Dinâmico e Desperdício Zero' : 'Dynamic Adjustment & Zero Waste'}
            </span>
            <p className="text-neutral-450 text-[11px] leading-relaxed max-w-xl">
              {lang === 'pt-BR'
                ? 'Diferente dos calculadores antigos, nossa ferramenta ajusta o mix de bebidas separando bebedores e não bebedores, de modo que seu orçamento de bebidas não-alcoólicas e de bar seja calibrado com precisão impecável.'
                : 'Unlike legacy party estimators, we differentiate drinking guests to calibrate soft mixes and premium items perfectly, securing zero wasted bottles.'}
            </p>
          </div>
        </div>

        {/* TRIGGER CALCULATIONS */}
        <button
          id="trigger-planning-calculate"
          type="button"
          onClick={handleCalculate}
          className="w-full md:w-auto bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] hover:brightness-110 active:scale-95 text-black font-extrabold uppercase tracking-widest text-xs py-3.5 px-8 rounded-xl shadow-xl flex items-center justify-center space-x-2 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-black fill-black animate-pulse" />
          <span>{lang === 'pt-BR' ? 'CALCULAR AGORA' : 'CALCULATE NOW'}</span>
        </button>
      </div>

    </motion.div>
  );
}
