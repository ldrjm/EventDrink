import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wine, 
  GlassWater, 
  Settings, 
  HelpCircle, 
  History, 
  LayoutDashboard, 
  Sparkles, 
  ShoppingBag, 
  Utensils, 
  Globe, 
  Award,
  Calendar,
  MessageSquare,
  Menu,
  X,
  User,
  Home,
  Crown
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { Tab } from '../types';
import EventDrinkLogo from '../components/EventDrinkLogo';

interface MainLayoutProps {
  controller: AppControllerType;
  children: ReactNode;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function MainLayout({ controller, children, isMobileMenuOpen, setIsMobileMenuOpen }: MainLayoutProps) {
  const {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    currentUser,
    setIsLoginModalOpen,
    cartInfo,
    currentTranslation,
    triggerToast
  } = controller;

  const renderNavButton = (tabName: Tab, icon: ReactNode, label: string) => {
    const isActive = activeTab === tabName;
    const isLocked = tabName === 'vip-club';

    return (
      <button
        id={`nav-free-${tabName}`}
        onClick={() => {
          setActiveTab(tabName);
          if (tabName === 'results') {
            controller.setPlannerTab('results');
          }
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative cursor-pointer text-left ${
          isActive 
            ? 'bg-gradient-to-r from-[#fe9d00]/20 to-[#ff5d00]/10 text-white border-l-4 border-[#fe9d00] font-medium' 
            : 'text-neutral-450 hover:text-white hover:bg-neutral-800/50'
        }`}
      >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-[#fe9d00]' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
          {icon}
        </div>
        <span className="text-sm tracking-wide flex-1">{label}</span>
        {tabName === 'cart' && cartInfo.count > 0 && (
          <span className="ml-auto bg-[#fe9d00] text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-5 text-center leading-none">
            {cartInfo.count}
          </span>
        )}
        {isLocked && (
          <span className="ml-auto bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase font-mono tracking-wider flex items-center space-x-0.5 animate-pulse">
            <span>🔒</span> <span>VIP</span>
          </span>
        )}
        {!isLocked && isActive && (
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#a2d729] animate-ping" />
        )}
      </button>
    );
  };

  return (
    <div id="main-layout-root" className="flex-1 flex flex-col md:flex-row relative">
      
      {/* Sidebar Overlay on Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu-backdrop-free"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/85 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Panel */}
      <aside 
        id="app-sidebar-free" 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#0d0d0d] p-4 pt-24 md:pt-4 flex flex-col justify-between overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:self-start md:w-64 md:translate-x-0 md:bg-transparent md:border-r border-neutral-800
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-1.5 text-left">
          <p className="text-[10px] font-extrabold text-neutral-500 tracking-widest font-mono uppercase px-4 mb-3">
            {lang === 'pt-BR' ? 'MENU PRINCIPAL' : 'MAIN MENU'}
          </p>
          <button
            id="nav-free-home-tab"
            onClick={() => {
              setActiveTab('landing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-neutral-450 hover:text-white hover:bg-neutral-800/50 cursor-pointer text-left"
          >
            <Home className="w-4 h-4 text-neutral-500" />
            <span className="text-sm tracking-wide">{lang === 'pt-BR' ? 'Home (Apresentação)' : 'Home (Landing)'}</span>
          </button>

          {renderNavButton('dashboard', <LayoutDashboard className="w-4 h-4" />, lang === 'pt-BR' ? 'Dashboard' : 'Dashboard')}
          {renderNavButton('results', <Calendar className="w-4 h-4" />, lang === 'pt-BR' ? 'Planejar Evento' : 'Party Proposal')}
          {renderNavButton('menu', <Wine className="w-4 h-4" />, lang === 'pt-BR' ? 'Menu de Bebidas' : 'Beverage Menu')}
          {renderNavButton('drink-creator', <GlassWater className="w-4 h-4" />, lang === 'pt-BR' ? 'Criador de Drinks' : 'Cocktail Creator')}
          {renderNavButton('menu-harmonizer', <Utensils className="w-4 h-4" />, lang === 'pt-BR' ? 'Harmonizador' : 'Menu Pairing')}
          {renderNavButton('vip-club', <Crown className="w-4 h-4 text-amber-500" />, lang === 'pt-BR' ? 'Clube Event Drink 🔒' : 'Event Drink Club 🔒')}

          <p className="text-[10px] font-extrabold text-neutral-500 tracking-widest font-mono uppercase px-4 pt-4 mb-2">
            {lang === 'pt-BR' ? 'CONTA' : 'ACCOUNT'}
          </p>
          {renderNavButton('profile', <User className="w-4 h-4" />, lang === 'pt-BR' ? 'Meu Perfil' : 'My Profile')}
          {renderNavButton('help', <HelpCircle className="w-4 h-4" />, lang === 'pt-BR' ? 'Ajuda' : 'Help')}
          {renderNavButton('config', <Settings className="w-4 h-4" />, lang === 'pt-BR' ? 'Configurações' : 'Settings')}

          {/* Portable Language toggler */}
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-900 flex items-center justify-between px-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#fe9d00]" /> {lang === 'pt-BR' ? 'IDIOMA' : 'LANGUAGE'}
            </span>
            <div className="flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-full p-1 h-9">
              <button
                onClick={() => {
                  setLang('pt-BR');
                  triggerToast('Idioma alterado para Português!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'pt-BR' ? 'bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black shadow-md font-extrabold' : 'text-neutral-400 hover:text-white'
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
                  lang === 'en' ? 'bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black shadow-md font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Guest access invite badge */}
        <div className="pt-4 border-t border-neutral-900 px-4">
          <div className="p-4 bg-gradient-to-r from-[#121212] to-[#1c1c1c] border border-neutral-800/80 rounded-2xl select-none text-left">
            <div className="flex items-center space-x-2 text-[#fe9d00] mb-1">
              <Award className="w-4 h-4 text-[#fe9d00]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === 'pt-BR' ? 'Acesso Básico' : 'Basic Access'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              {lang === 'pt-BR' ? 'Desbloqueie o acesso VIP para obter 7% de desconto automático no fechamento.' : 'Unlock VIP tier to claim automatic 7% checkout discount and secret catalog.'}
            </p>
            <button
              id="layout-unlock-vip-btn"
              onClick={controller.toggleUserTier}
              className="w-full mt-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-105 text-black font-extrabold text-[10px] uppercase py-2 rounded-lg transition-all cursor-pointer"
            >
              {lang === 'pt-BR' ? 'Ativar VIP de Graça ✨' : 'Unlock VIP Free ✨'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main workspace container */}
      <main id="app-component-workspace-free" className="flex-1 p-4 md:p-8 bg-[#121212]/30 overflow-y-auto flex flex-col justify-between min-h-[calc(100vh-73px)]">
        <div>
          {children}
        </div>

        {/* Rodapé de Aviso Legal de Maioridade */}
        <footer className="mt-12 pt-6 border-t border-neutral-900 text-center space-y-2 select-none">
          <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">
            {lang === 'pt-BR' 
              ? '⚠️ EVENTDRINK - VENDA EXCLUSIVA PARA MAIORES DE 18 ANOS' 
              : '⚠️ EVENTDRINK - EXCLUSIVE FOR ADULTS AGED 18 OR OLDER'}
          </p>
          <p className="text-[10px] text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
            {lang === 'pt-BR'
              ? 'A venda e o consumo de bebidas alcoólicas são proibidos para menores de 18 anos. Beba com moderação e responsabilidade. Atenção: no ato da entrega, a idade do recebedor deverá ser obrigatoriamente comprovada mediante apresentação de documento oficial de identificação com foto.'
              : 'The sale and consumption of alcoholic beverages are prohibited to minors under 18. Enjoy responsibly. Please note: upon delivery, the recipient’s age must be verified with an official photo ID.'}
          </p>
        </footer>
      </main>

    </div>
  );
}
