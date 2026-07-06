import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wine, 
  GlassWater, 
  Settings, 
  HelpCircle, 
  LayoutDashboard, 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  Globe, 
  Award,
  Calendar,
  Menu,
  X,
  User,
  Video,
  Download,
  Star,
  Home,
  Crown
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { Tab } from '../types';

interface VipLayoutProps {
  controller: AppControllerType;
  children: ReactNode;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function VipLayout({ controller, children, isMobileMenuOpen, setIsMobileMenuOpen }: VipLayoutProps) {
  const {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    currentUser,
    cartInfo,
    triggerToast
  } = controller;

  const isPt = lang === 'pt-BR';

  const renderNavButton = (tabName: Tab, icon: ReactNode, label: string) => {
    const isActive = activeTab === tabName;

    return (
      <button
        id={`nav-vip-${tabName}`}
        onClick={() => {
          setActiveTab(tabName);
          if (tabName === 'results') {
            controller.setPlannerTab('results');
          }
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative cursor-pointer text-left ${
          isActive 
            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/5 text-amber-400 border-l-4 border-amber-500 font-medium' 
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
        }`}
      >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-amber-400' : 'text-neutral-500 group-hover:text-amber-300'}`}>
          {icon}
        </div>
        <span className="text-sm tracking-wide flex-1">{label}</span>
        {tabName === 'cart' && cartInfo.count > 0 && (
          <span className="ml-auto bg-amber-500 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none">
            {cartInfo.count}
          </span>
        )}
        {isActive && (
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
        )}
      </button>
    );
  };

  return (
    <div id="vip-layout-root" className="flex-1 flex flex-col md:flex-row relative">
      
      {/* Sidebar Overlay on Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu-backdrop-vip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/90 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Panel */}
      <aside 
        id="app-sidebar-vip" 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#090909] p-4 pt-24 md:pt-4 flex flex-col justify-between overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:self-start md:w-64 md:translate-x-0 md:bg-transparent md:border-r border-amber-500/10
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-extrabold text-amber-500/60 tracking-widest font-mono uppercase px-4 mb-3">
            {isPt ? 'ÁREA VIP PREMIUM' : 'VIP PREMIUM PORTAL'}
          </p>
          <button
            id="nav-vip-home-tab"
            onClick={() => {
              setActiveTab('landing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-neutral-400 hover:text-white hover:bg-neutral-800/40 cursor-pointer text-left"
          >
            <Home className="w-4 h-4 text-neutral-500" />
            <span className="text-sm tracking-wide">{isPt ? 'Home (Apresentação)' : 'Home (Landing)'}</span>
          </button>

          {renderNavButton('dashboard', <LayoutDashboard className="w-4 h-4" />, isPt ? 'Home' : 'Home')}
          {renderNavButton('results', <Calendar className="w-4 h-4" />, isPt ? 'Planejar Evento' : 'Plan Event')}
          {renderNavButton('menu', <Wine className="w-4 h-4" />, isPt ? 'Menu de Bebidas' : 'Beverages')}
          {renderNavButton('drink-creator', <GlassWater className="w-4 h-4" />, isPt ? 'Criador de Drinks' : 'Mixology Lab')}
          {renderNavButton('menu-harmonizer', <Utensils className="w-4 h-4" />, isPt ? 'Harmonizador' : 'Food Matcher')}
          {renderNavButton('vip-club', <Crown className="w-4 h-4 text-amber-500" />, isPt ? 'Clube Event Drink' : 'Event Drink Club')}

          <p className="text-[10px] font-extrabold text-amber-500/60 tracking-widest font-mono uppercase px-4 pt-4 mb-2">
            {isPt ? 'MÍDIA E ARQUIVOS' : 'EXCLUSIVES'}
          </p>
          {renderNavButton('premium-recipes', <Star className="w-4 h-4 text-amber-500" />, isPt ? 'Receitas Premium' : 'Premium Recipes')}
          {renderNavButton('premium-videos', <Video className="w-4 h-4 text-amber-500" />, isPt ? 'Vídeos & Aulas' : 'Masterclass Videos')}
          {renderNavButton('downloads', <Download className="w-4 h-4 text-amber-500" />, isPt ? 'Downloads PDFs' : 'PDF Assets')}

          <p className="text-[10px] font-extrabold text-neutral-650 tracking-widest font-mono uppercase px-4 pt-4 mb-1">
            {isPt ? 'PREFERÊNCIAS' : 'PREFERENCES'}
          </p>
          {renderNavButton('profile', <User className="w-4 h-4" />, isPt ? 'Meu Perfil' : 'My Profile')}
          {renderNavButton('help', <HelpCircle className="w-4 h-4" />, isPt ? 'Ajuda' : 'Help Desk')}
          {renderNavButton('config', <Settings className="w-4 h-4" />, isPt ? 'Configurações' : 'Settings')}

          {/* Portable Language toggler */}
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-900 flex items-center justify-between px-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" /> {isPt ? 'IDIOMA' : 'LANGUAGE'}
            </span>
            <div className="flex items-center space-x-1 bg-neutral-950 border border-neutral-900 rounded-full p-1 h-9">
              <button
                onClick={() => {
                  setLang('pt-BR');
                  triggerToast('Idioma alterado para Português!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'pt-BR' ? 'bg-amber-500 text-black shadow-md font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                onClick={() => {
                  setLang('en');
                  triggerToast('Language updated to English!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'en' ? 'bg-amber-500 text-black shadow-md font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* VIP Status card indicators */}
        <div className="pt-4 border-t border-neutral-950 px-4">
          <div className="p-4 bg-gradient-to-r from-neutral-950 to-[#141007] border border-amber-500/10 rounded-2xl select-none text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-amber-500/5 blur-sm pointer-events-none" />
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isPt ? 'Membro VIP Ativo' : 'VIP Member Active'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-normal">
              {isPt ? 'Você tem 7% de desconto automático em orçamentos e frete cortesia ativado.' : 'Enjoy 7% inherent checkout discount and priority temperature shipping.'}
            </p>
            <button
              onClick={controller.toggleUserTier}
              className="w-full mt-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 text-[10px] uppercase py-2 rounded-lg transition-all cursor-pointer"
            >
              {isPt ? 'Voltar para Grátis 🔄' : 'Revert to Free 🔄'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main workspace container */}
      <main id="app-component-workspace-vip" className="flex-1 p-4 md:p-8 bg-[#121212]/30 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
