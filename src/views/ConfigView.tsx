import React from 'react';
import { motion } from 'motion/react';
import { AppControllerType } from '../controllers/AppController';
import { 
  Settings, 
  Shield, 
  Globe, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  UserCheck 
} from 'lucide-react';

interface ConfigViewProps {
  controller: AppControllerType;
}

export default function ConfigView({ controller }: ConfigViewProps) {
  const { lang, setLang, currentTranslation, currentUser, toggleUserTier, triggerToast, setOrders, setCart } = controller;

  // React states initialized from localStorage with correct defaults
  const [safetyMargin, setSafetyMargin] = React.useState<number>(() => {
    const saved = localStorage.getItem('eventdrink_safety_margin');
    return saved ? parseInt(saved, 10) : 10;
  });

  const [weatherInsights, setWeatherInsights] = React.useState<string>(() => {
    return localStorage.getItem('eventdrink_weather_insights') || 'no';
  });

  const [defaultProfile, setDefaultProfile] = React.useState<string>(() => {
    return localStorage.getItem('eventdrink_default_profile') || 'moderate';
  });

  const isVip = currentUser?.role === 'VIP' || currentUser?.role === 'ADMIN';

  // Handlers for settings changes
  const handleLanguageChange = (newLang: 'pt-BR' | 'en') => {
    setLang(newLang);
    triggerToast(newLang === 'pt-BR' ? 'Idioma alterado para Português!' : 'Language changed to English!');
  };

  const handleSafetyMarginChange = (val: number) => {
    if (!isVip && val !== 5 && val !== 10) {
      triggerToast(lang === 'pt-BR' ? 'Ajustes de margens estendidos exclusivos para Membros VIP!' : 'Extended safety margin adjustments exclusive for VIP Members!');
      return;
    }
    setSafetyMargin(val);
    localStorage.setItem('eventdrink_safety_margin', val.toString());
    triggerToast(
      lang === 'pt-BR' 
        ? `Margem ajustada para ${val}%! Proposta recalculada.` 
        : `Safety margin adjusted to ${val}%! Party plan updated.`
    );
  };

  const handleWeatherInsightsChange = (val: string) => {
    if (!isVip && val !== 'no' && val !== 'manual_hot') {
      triggerToast(lang === 'pt-BR' ? 'Sincronização por satélite AI exclusiva para Membros VIP!' : 'Satellite AI sync exclusive for VIP Members!');
      return;
    }
    setWeatherInsights(val);
    localStorage.setItem('eventdrink_weather_insights', val);
    triggerToast(
      lang === 'pt-BR' 
        ? val === 'yes' ? 'Análise climática ativada! +20% de gelo preventivo adicionado.' : val === 'manual_hot' ? 'Ajuste de clima quente (+10% gelo/água) ativado.' : 'Análise climática padrão ativa.'
        : val === 'yes' ? 'Weather insights enabled! +20% preventive ice added.' : val === 'manual_hot' ? 'Manual hot climate adjustment (+10% ice/water) enabled.' : 'Standard climate preset active.'
    );
  };

  const handleDefaultProfileChange = (val: string) => {
    if (!isVip && val !== 'moderate' && val !== 'basic') {
      triggerToast(lang === 'pt-BR' ? 'Perfis de consumo avançados exclusivos para Membros VIP!' : 'Advanced consumption profiles exclusive for VIP Members!');
      return;
    }
    setDefaultProfile(val);
    localStorage.setItem('eventdrink_default_profile', val);
    triggerToast(
      lang === 'pt-BR' 
        ? 'Perfil de consumo padrão atualizado!' 
        : 'Default consumption profile updated!'
    );
  };

  // Safe reset routine
  const handleResetApplication = () => {
    if (window.confirm(lang === 'pt-BR' ? 'Deseja mesmo redefinir todas as configurações e limpar o histórico de pedidos?' : 'Are you sure you want to reset all configurations and clear order history?')) {
      localStorage.removeItem('eventdrink_safety_margin');
      localStorage.removeItem('eventdrink_weather_insights');
      localStorage.removeItem('eventdrink_default_profile');
      localStorage.removeItem('eventdrink_orders');
      localStorage.removeItem('eventdrink_user_session');
      setOrders([]);
      setCart({});
      setSafetyMargin(10);
      setWeatherInsights('no');
      setDefaultProfile('moderate');
      triggerToast(lang === 'pt-BR' ? 'Tudo redefinido com sucesso!' : 'All settings and cache cleared successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <motion.div
      key="config"
      id="view-config"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-3xl mx-auto space-y-8 px-4"
    >
      {/* Title */}
      <div className="space-y-1 text-left select-none">
        <span className="text-[10px] font-mono tracking-widest text-[#fe9d00] uppercase font-black">
          {lang === 'pt-BR' ? 'AJUSTES GLOBAIS' : 'GLOBAL SETTINGS'}
        </span>
        <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">
          {currentTranslation.settings}
        </h2>
        <p className="text-neutral-400 text-sm">
          {lang === 'pt-BR' 
            ? 'Ajuste os parâmetros de abastecimento e as políticas de consumo do planejador' 
            : 'Fine-tune supply margins and consumption profiles for the smart planner'}
        </p>
      </div>

      {/* VIP vs FREE Banner Card */}
      {!isVip ? (
        <div className="bg-gradient-to-r from-neutral-900 via-amber-950/20 to-neutral-900 border border-amber-500/30 rounded-3xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 shrink-0">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                  {lang === 'pt-BR' ? 'ACESSO GRÁTIS' : 'FREE ACCOUNT'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white font-sans">
                {lang === 'pt-BR' ? 'Desbloqueie o Planejador VIP' : 'Unlock the Premium VIP Planner'}
              </h4>
              <p className="text-neutral-300 text-xs leading-relaxed max-w-xl">
                {lang === 'pt-BR' 
                  ? 'Você está no modo gratuito. Torne-se VIP para liberar margens de desperdício customizadas, algoritmo inteligente com suporte climático (ajuste automático de gelo) e insights prioritários de barman.' 
                  : 'You are currently on the basic plan. Upgrade to VIP to unlock custom waste margins, weather-based automated scaling, and professional barman insights.'}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800/60 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">⚡ {lang === 'pt-BR' ? 'Margens de 0% a 30%' : 'Margins from 0% to 30%'}</span>
            <span className="flex items-center gap-1.5">🌤️ {lang === 'pt-BR' ? 'Suporte a Clima Quente' : 'Hot Weather Support'}</span>
            <span className="flex items-center gap-1.5">🤖 {lang === 'pt-BR' ? 'Chatbot Completo' : 'Unlimited AI Chat'}</span>
          </div>
          <button
            onClick={toggleUserTier}
            className="w-full bg-gradient-to-r from-amber-500 to-[#fe9d00] hover:from-amber-600 hover:to-[#ffaa00] text-black font-extrabold text-xs py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-amber-500/10 active:scale-[0.99] cursor-pointer font-sans text-center"
          >
            {lang === 'pt-BR' ? '⭐ ATIVAR ACESSO VIP GRÁTIS' : '⭐ ACTIVATE FREE VIP ACCESS'}
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-emerald-500/30 rounded-3xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
              <UserCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {lang === 'pt-BR' ? 'MEMBRO VIP ATIVO' : 'VIP MEMBER ACTIVE'}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">ID: #{currentUser?.email ? currentUser.email.split('@')[0] : 'host'}</span>
              </div>
              <h4 className="text-lg font-bold text-white font-sans">
                {lang === 'pt-BR' ? 'Privilégios Premium Ativos' : 'Premium Privileges Active'}
              </h4>
              <p className="text-neutral-300 text-xs leading-relaxed max-w-xl">
                {lang === 'pt-BR' 
                  ? 'Parabéns! Sua conta possui todos os privilégios de cálculo avançados liberados. Seus ajustes nos campos abaixo serão refletidos diretamente no planejamento de suas festas em tempo real.' 
                  : 'Congratulations! Your account has all calculation and customization features fully unlocked. Any adjustments below are live and directly applied to your planners in real time.'}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-sans">
              {lang === 'pt-BR' ? 'Quer testar a experiência básica?' : 'Want to test the basic free limits?'}
            </span>
            <button
              onClick={toggleUserTier}
              className="text-[10px] font-mono text-neutral-500 hover:text-red-400 transition-colors underline cursor-pointer bg-transparent border-none p-0"
            >
              {lang === 'pt-BR' ? 'Reverter para Conta Grátis' : 'Revert to Free Account'}
            </button>
          </div>
        </div>
      )}

      {/* Main Settings Form Card */}
      <div className="bg-[#161616]/40 border border-neutral-800/85 rounded-3xl p-6 space-y-6 text-left backdrop-blur-md font-sans">
        
        {/* Localization category */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
            <Globe className="w-4 h-4 text-[#fe9d00]" />
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">
              {lang === 'pt-BR' ? 'Idioma e Região' : 'Language & Region'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 block font-mono">
                {lang === 'pt-BR' ? 'IDIOMA DO SISTEMA' : 'SYSTEM LANGUAGE'}
              </label>
              <select 
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as 'pt-BR' | 'en')}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-200 focus:outline-none focus:border-[#fe9d00] transition-colors cursor-pointer"
              >
                <option value="pt-BR">🇧🇷 Português (pt-BR)</option>
                <option value="en">🇺🇸 English (en)</option>
              </select>
            </div>
            
            <div className="space-y-1.5 opacity-60">
              <label className="text-xs text-neutral-400 block font-mono">
                {lang === 'pt-BR' ? 'MOEDA PADRÃO' : 'DEFAULT CURRENCY'}
              </label>
              <div className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-500 select-none">
                {lang === 'pt-BR' ? 'R$ (Real Brasileiro)' : '$ (USD - Localized)'}
              </div>
            </div>
          </div>
        </div>

        {/* Algorithm category */}
        <div className="space-y-4 pt-4 border-t border-neutral-900">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
            <Settings className="w-4 h-4 text-[#fe9d00]" />
            <h3 className="text-sm font-bold text-white font-sans uppercase tracking-wider">
              {lang === 'pt-BR' ? 'Parâmetros do Planejador Inteligente' : 'Smart Planner Parameters'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Safety Margin */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs text-neutral-400 block font-mono uppercase">
                  {lang === 'pt-BR' ? 'Margem de Segurança (%)' : 'Safety Margin (%)'}
                </label>
                {!isVip && (
                  <span className="text-[9px] font-mono text-amber-500 flex items-center gap-1 font-bold">
                    <Sparkles className="w-2.5 h-2.5" /> FREE OPTIONS
                  </span>
                )}
              </div>
              
              <select 
                value={safetyMargin}
                onChange={(e) => handleSafetyMarginChange(parseInt(e.target.value, 10))}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 focus:border-[#fe9d00] rounded-xl p-3 text-sm transition-colors cursor-pointer"
              >
                {!isVip ? (
                  <>
                    <option value={5}>5% ({lang === 'pt-BR' ? 'Econômico - Grátis' : 'Economical - Free'})</option>
                    <option value={10}>10% ({lang === 'pt-BR' ? 'Padrão - Grátis' : 'Standard - Free'})</option>
                  </>
                ) : (
                  <>
                    <option value={0}>0% ({lang === 'pt-BR' ? 'Desperdício Zero / Eco-Friendly' : 'Zero Waste / Eco-Friendly'})</option>
                    <option value={5}>5% ({lang === 'pt-BR' ? 'Margem Econômica' : 'Economical Margin'})</option>
                    <option value={10}>10% ({lang === 'pt-BR' ? 'Padrão Recomendado' : 'Recommended Standard'})</option>
                    <option value={20}>20% ({lang === 'pt-BR' ? 'Festa Intensa / Alto Consumo' : 'Intense Party / High Volume'})</option>
                    <option value={30}>30% ({lang === 'pt-BR' ? 'Super Lotação / Abastecido' : 'Peak Capacity / Fully Stocked'})</option>
                  </>
                )}
              </select>
              <p className="text-[11px] text-neutral-500 leading-normal">
                {lang === 'pt-BR'
                  ? 'Acrescenta uma margem preventiva aos totais de insumos sugeridos para evitar que falte bebida.'
                  : 'Adds a preventive calculation cushion on top of recommended drink volumes.'}
              </p>
            </div>

            {/* Weather adjustment */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs text-neutral-400 block font-mono uppercase">
                  {lang === 'pt-BR' ? 'Suporte Climático Inteligente' : 'Smart Weather Insights'}
                </label>
                {!isVip && (
                  <span className="text-[9px] font-mono text-amber-500 flex items-center gap-1 font-bold">
                    <Sparkles className="w-2.5 h-2.5" /> FREE OPTIONS
                  </span>
                )}
              </div>

              <select 
                value={weatherInsights}
                onChange={(e) => handleWeatherInsightsChange(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 focus:border-[#fe9d00] rounded-xl p-3 text-sm transition-colors cursor-pointer"
              >
                {!isVip ? (
                  <>
                    <option value="no">OFF ({lang === 'pt-BR' ? 'Cálculo Climatológico Padrão' : 'Standard Climate Calculation'})</option>
                    <option value="manual_hot">ON ({lang === 'pt-BR' ? 'Ajustar para Clima Quente: +10% Gelo' : 'Hot Weather Adjustment: +10% Ice'})</option>
                  </>
                ) : (
                  <>
                    <option value="no">{lang === 'pt-BR' ? 'Não (Cálculo Físico Padrão)' : 'No (Standard Physical Calculation)'}</option>
                    <option value="manual_hot">{lang === 'pt-BR' ? 'Sim (Ajuste Manual Clima Quente: +10% Gelo)' : 'Yes (Manual Hot Climate: +10% Ice)'}</option>
                    <option value="yes">{lang === 'pt-BR' ? '✨ Sincronização AI Satélite (Tempo Real: +20% Gelo/Água)' : '✨ AI Satellite Sync (Real-time Forecast: +20% Ice/Water)'}</option>
                  </>
                )}
              </select>
              <p className="text-[11px] text-neutral-500 leading-normal">
                {lang === 'pt-BR'
                  ? 'Ajusta dinamicamente a proporção de insumos refrescantes de acordo com as estimativas meteorológicas.'
                  : 'Scales refreshing liquids and ice quantities based on seasonal weather expectations.'}
              </p>
            </div>

            {/* Default consumption profile */}
            <div className="space-y-1.5 relative md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-neutral-400 block font-mono uppercase">
                  {lang === 'pt-BR' ? 'Perfil de Consumo Padrão do Anfitrião' : 'Default Host Consumption Profile'}
                </label>
                {!isVip && (
                  <span className="text-[9px] font-mono text-amber-500 flex items-center gap-1 font-bold">
                    <Sparkles className="w-2.5 h-2.5" /> FREE OPTIONS
                  </span>
                )}
              </div>

              <select 
                value={defaultProfile}
                onChange={(e) => handleDefaultProfileChange(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 focus:border-[#fe9d00] rounded-xl p-3 text-sm transition-colors cursor-pointer"
              >
                {!isVip ? (
                  <>
                    <option value="moderate">{lang === 'pt-BR' ? 'Consumo Moderado (Padrão Equilibrado)' : 'Moderate Consumption (Balanced Baseline)'}</option>
                    <option value="basic">{lang === 'pt-BR' ? 'Consumo Básico (Priorizar Sem Álcool / Sucos)' : 'Basic Consumption (Prioritize Sodas & Juices)'}</option>
                  </>
                ) : (
                  <>
                    <option value="basic">{lang === 'pt-BR' ? 'Consumo Básico (Priorizar Sem Álcool)' : 'Basic Consumption (Prioritize Non-Alcoholic)'}</option>
                    <option value="moderate">{lang === 'pt-BR' ? 'Consumo Moderado (Equilíbrio Cerveja/Destilados)' : 'Moderate Consumption (Balanced Beer/Spirits)'}</option>
                    <option value="intense">{lang === 'pt-BR' ? '🔥 Consumo Intenso (Festa Open Bar Completo / Universitário)' : '🔥 Intense Consumption (Full Open Bar / College Style)'}</option>
                    <option value="sophisticated">{lang === 'pt-BR' ? '🍷 Consumo Sofisticado (Foco em Degustação de Vinhos e Champagnes)' : '🍷 Sophisticated Tasting (Premium Wines & Champagne Focus)'}</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* System & Cache Category */}
        <div className="space-y-4 pt-6 border-t border-neutral-900">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
            <Shield className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-400 font-sans uppercase tracking-wider">
              {lang === 'pt-BR' ? 'Armazenamento & Manutenção' : 'Storage & Data Management'}
            </h3>
          </div>

          <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 space-y-3 font-mono text-xs text-neutral-400">
            <div className="flex justify-between items-center">
              <span>{lang === 'pt-BR' ? 'CONTA ATIVA:' : 'ACTIVE ACCOUNT:'}</span>
              <span className={`font-bold ${isVip ? 'text-amber-400' : 'text-neutral-300'}`}>
                {isVip ? (lang === 'pt-BR' ? 'VIP PREMIUM' : 'VIP PREMIUM') : (lang === 'pt-BR' ? 'GRATUITA (BÁSICA)' : 'FREE (BASIC)')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>{lang === 'pt-BR' ? 'PEDIDOS EM CACHE LOCAL:' : 'ORDERS IN LOCAL STORAGE:'}</span>
              <span className="text-neutral-200">{controller.orders?.length || 0} {lang === 'pt-BR' ? 'eventos salvos' : 'saved events'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{lang === 'pt-BR' ? 'ESTADO DO PLANO:' : 'PLANNER SYNC:'}</span>
              <span className="text-neutral-500 font-mono">100% Client-Side Local Cache</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleResetApplication}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {lang === 'pt-BR' ? 'Redefinir Tudo & Limpar Cache' : 'Reset Everything & Clear Cache'}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
