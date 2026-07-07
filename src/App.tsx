import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wine, 
  GlassWater, 
  Settings, 
  HelpCircle, 
  History, 
  TrendingUp, 
  Sparkles, 
  ShoppingBag, 
  UtensilsCrossed, 
  Globe, 
  Award,
  CheckCircle2,
  MessageSquare,
  Menu,
  X,
  User,
  ShieldAlert
} from 'lucide-react';

import { useAppController } from './controllers/AppController';
import { Tab } from './types';

// Import Presentational Views
import LandingPageView from './views/LandingPageView';
import DashboardFreeView from './views/DashboardFreeView';
import DashboardVipView from './views/DashboardVipView';
import DashboardAdminView from './views/DashboardAdminView';
import ResultsView from './views/ResultsView';
import MenuView from './views/MenuView';
import CartView from './views/CartView';
import HistoryView from './views/HistoryView';
import HelpView from './views/HelpView';
import ConfigView from './views/ConfigView';
import VipClubView from './views/VipClubView';
import ProfileView from './views/ProfileView';

// VIP-specific views
import VipRecipesView from './views/VipRecipesView';
import VipVideosView from './views/VipVideosView';
import VipDownloadsView from './views/VipDownloadsView';

// Admin subviews
import {
  AdminEventsView,
  AdminFinancialView,
  AdminDownloadsView,
  AdminCoursesView,
  AdminIAView,
  AdminConfigView
} from './views/AdminSubViews';

import {
  AdminStockView,
  AdminOrdersView,
  AdminCouponsView,
  AdminLoyaltyView,
  AdminLogsView,
  AdminAnalyticsView
} from './views/AdminNewModules';

import AgeGateModal from './components/AgeGateModal';

// Original UI Sub-components
import ChatWidget from './components/ChatWidget';
import EventDrinkLogo from './components/EventDrinkLogo';
import UserLoginModal from './components/UserLoginModal';
import DrinkCreator from './components/DrinkCreator';
import MenuHarmonizer from './components/MenuHarmonizer';
import VIPLockView from './components/VIPLockView';

// Layouts
import MainLayout from './layouts/MainLayout';
import VipLayout from './layouts/VipLayout';
import AdminLayout from './layouts/AdminLayout';

// Access Denied / 403 Forbidden Screen
function AccessDeniedView({ lang, onGoHome }: { lang: 'pt-BR' | 'en'; onGoHome: () => void }) {
  const isPt = lang === 'pt-BR';
  return (
    <div id="403-access-denied" className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          {isPt ? '403 - Acesso Negado' : '403 - Access Denied'}
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          {isPt 
            ? 'Seu perfil de usuário não possui as permissões necessárias para acessar este terminal corporativo.'
            : 'Your user profile does not hold the secure permissions required to access this corporate console.'
          }
        </p>
      </div>
      <button
        id="go-back-free-dashboard-btn"
        onClick={onGoHome}
        className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-white font-bold text-[10px] uppercase px-6 py-3 rounded-xl transition-all cursor-pointer tracking-wider"
      >
        {isPt ? 'Voltar para a Área Segura' : 'Return to Safe Zone'}
      </button>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL DO EVENTDRINK PRO ---
export default function App() {
  const controller = useAppController();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    isChatOpen,
    setIsChatOpen,
    currentUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    guests,
    eventType,
    duration,
    profile,
    cartInfo,
    toastMessage,
    currentTranslation,
    triggerToast
  } = controller;

  // Memoize callbacks to prevent infinite re-renders
  const handleAgeVerified = React.useCallback(() => {
    controller.setAgeVerified(true);
  }, [controller]);

  // Sync route so ADMIN is locked inside the Admin Console,
  // preventing them from seeing the client menus as per user instructions
  React.useEffect(() => {
    if (currentUser?.isLoggedIn && currentUser?.role === 'ADMIN' && !activeTab.startsWith('admin-')) {
      setActiveTab('admin-dashboard');
    }
  }, [currentUser, activeTab]);

  // Sincronização automatizada para redirecionar o fluxo para a aba de resultados
  React.useEffect(() => {
    if (activeTab === 'assistant') {
      setActiveTab('results');
      controller.setPlannerTab('assistant');
    }
  }, [activeTab]);

  // --- SEGURANÇA REFORÇADA: AGE GATE BLOCKS EVERYTHING ---
  if (!controller.ageVerified) {
    return (
      <div id="eventdrink-pro-root" className="min-h-screen bg-[#0d0d0d] text-neutral-100 flex flex-col font-sans selection:bg-[#fe9d00]/30 selection:text-white antialiased">
        <LandingPageView 
          lang={lang}
          onEnterSite={() => {}}
          onEnterVIP={() => {}}
          onOpenLogin={() => {}}
        />
        <AgeGateModal
          lang={lang}
          onVerified={handleAgeVerified}
        />
      </div>
    );
  }

  if (activeTab === 'landing') {
    return (
      <div id="eventdrink-pro-root" className="min-h-screen bg-[#0d0d0d] text-neutral-100 flex flex-col font-sans selection:bg-[#fe9d00]/30 selection:text-white antialiased">
        <LandingPageView 
          lang={lang}
          onEnterSite={() => {
            if (currentUser?.role === 'ADMIN') {
              setActiveTab('admin-dashboard');
            } else {
              setActiveTab('dashboard');
            }
          }}
          onEnterVIP={() => {
            if (currentUser?.role === 'ADMIN') {
              setActiveTab('admin-dashboard');
              triggerToast(lang === 'pt-BR' ? 'Administradores não entram na visualização de cliente.' : 'Administrators are locked within corporate panels.');
            } else {
              setActiveTab('vip-club');
              if (!currentUser?.isLoggedIn) {
                triggerToast(lang === 'pt-BR'
                  ? 'Faça login para acessar os benefícios VIP completos.'
                  : 'Please log in to access full VIP benefits.');
              }
            }
          }}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
        
        {/* Toast Notification for Landing Page */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              id="app-toast-message"
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-[#171717] border border-neutral-800 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#a2d729] animate-pulse" />
              <p className="text-sm font-medium text-neutral-200">{toastMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <UserLoginModal
          lang={lang}
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          currentUser={currentUser}
          onLoginSuccess={controller.handleLoginSuccess}
          onLogout={controller.handleLogout}
          triggerToast={triggerToast}
        />
      </div>
    );
  }

  // Route characteristics
  const isAdminTab = activeTab === 'admin' || activeTab.startsWith('admin-');
  const userRole = currentUser?.role || 'FREE';
  const isVip = userRole === 'VIP';
  const isAdmin = userRole === 'ADMIN';

  // RENDER SECTIONS CORRESPONDING TO CHOSEN TAB
  const renderWorkspaceContent = () => {
    // 1. GATED ADMIN SHIELD
    if (isAdminTab) {
      if (!isAdmin) {
        return (
          <AccessDeniedView 
            lang={lang} 
            onGoHome={() => setActiveTab('dashboard')} 
          />
        );
      }

      switch (activeTab) {
        case 'admin-dashboard':
          return <DashboardAdminView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-stock':
          return <AdminStockView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-orders':
          return <AdminOrdersView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-coupons':
          return <AdminCouponsView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-loyalty':
          return <AdminLoyaltyView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-analytics':
          return <AdminAnalyticsView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-logs':
          return <AdminLogsView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-events':
          return <AdminEventsView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-financial':
          return <AdminFinancialView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-downloads':
          return <AdminDownloadsView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-courses':
          return <AdminCoursesView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-ia':
          return <AdminIAView lang={lang} triggerToast={triggerToast} controller={controller} />;
        case 'admin-config':
          return <AdminConfigView lang={lang} triggerToast={triggerToast} controller={controller} />;
        default:
          return <DashboardAdminView lang={lang} triggerToast={triggerToast} controller={controller} />;
      }
    }

    // 2. VIP GATED CHANNELS
    if (activeTab === 'premium-recipes') {
      if (!isVip) {
        return (
          <VIPLockView 
            featureName={lang === 'pt-BR' ? 'Receitas Premium VIP' : 'Premium VIP Recipes'}
            desc={lang === 'pt-BR' ? 'Acesse cartas exclusivas de cocktails e fórmulas de vanguarda liberando o plano VIP.' : 'Check secret formulas and master recipes by becoming VIP.'}
            lang={lang}
            onUnlock={controller.toggleUserTier}
          />
        );
      }
      return <VipRecipesView controller={controller} />;
    }

    if (activeTab === 'premium-videos') {
      if (!isVip) {
        return (
          <VIPLockView 
            featureName={lang === 'pt-BR' ? 'Aulas & Masterclasses VIP' : 'Video VIP Masterclasses'}
            desc={lang === 'pt-BR' ? 'Aprenda técnicas de bar, cortes de gelo cristalino e defumação de copos.' : 'Acquire skills on wood-smoke setups and ice carvings.'}
            lang={lang}
            onUnlock={controller.toggleUserTier}
          />
        );
      }
      return <VipVideosView controller={controller} />;
    }

    if (activeTab === 'downloads') {
      if (!isVip) {
        return (
          <VIPLockView 
            featureName={lang === 'pt-BR' ? 'Downloads de Manuais VIP' : 'PDF Premium Assets'}
            desc={lang === 'pt-BR' ? 'Baixe checklists, planilhas inteligentes de custos e guias de harmonização.' : 'Download checklists and smart calculators immediately.'}
            lang={lang}
            onUnlock={controller.toggleUserTier}
          />
        );
      }
      return <VipDownloadsView controller={controller} />;
    }

    if (activeTab === 'vip-club' && !isVip) {
      return (
        <VIPLockView 
          featureName={lang === 'pt-BR' ? 'Clube Event Drink VIP' : 'Event Drink VIP Club'}
          desc={lang === 'pt-BR' ? 'Desbloqueie o assistente gerador de drinks, downloads ilimitados, vídeos e 7% de desconto.' : 'Access exclusive templates, continuous prompt scaling and 7% instant discount.'}
          lang={lang}
          onUnlock={controller.toggleUserTier}
        />
      );
    }

    // 3. COMMON INTERFACES
    switch (activeTab) {
      case 'dashboard':
        return isVip ? (
          <DashboardVipView controller={controller} />
        ) : (
          <DashboardFreeView controller={controller} />
        );

      case 'results':
        return <ResultsView controller={controller} />;

      case 'menu':
        return <MenuView controller={controller} />;

      case 'cart':
        return <CartView controller={controller} />;

      case 'history':
        return <HistoryView controller={controller} />;

      case 'drink-creator':
        return (
          <DrinkCreator 
            lang={lang} 
            triggerToast={triggerToast} 
            currentUser={currentUser}
            onUpgradeVip={controller.toggleUserTier}
            onAddCustomDrinkToMenu={(newDrink) => {
              controller.setAvailableDrinks(prev => [newDrink, ...prev]);
            }}
          />
        );

      case 'menu-harmonizer':
        return (
          <MenuHarmonizer 
            lang={lang} 
            triggerToast={triggerToast} 
            currentUser={currentUser}
            onUpgradeVip={controller.toggleUserTier}
            drinks={controller.availableDrinks}
            onSelectDrink={(drinkId) => {
              const matched = controller.availableDrinks.find(d => d.id === drinkId);
              if (matched) {
                controller.setSearchQuery(lang === 'pt-BR' ? matched.namePt : matched.nameEn);
                setActiveTab('menu');
              }
            }}
          />
        );

      case 'help':
        return <HelpView controller={controller} />;

      case 'config':
        return <ConfigView controller={controller} />;

      case 'vip-club':
        return (
          <VipClubView 
            lang={lang}
            controller={controller}
            currentUser={currentUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onToggleUserTier={controller.toggleUserTier}
          />
        );

      case 'profile':
        return (
          <ProfileView 
            lang={lang}
            currentUser={currentUser}
            onLogout={controller.handleLogout}
            onUpdateUser={controller.setCurrentUser}
            triggerToast={triggerToast}
          />
        );

      default:
        return isVip ? (
          <DashboardVipView controller={controller} />
        ) : (
          <DashboardFreeView controller={controller} />
        );
    }
  };

  return (
    <div id="eventdrink-pro-root" className="min-h-screen bg-[#0d0d0d] text-neutral-100 flex flex-col font-sans selection:bg-[#fe9d00]/30 selection:text-white antialiased">
      
      {/* 1. TOAST NOTIFICATIONS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            id="app-toast-message"
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-[#171717] border border-neutral-800 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#a2d729] animate-pulse" />
            <p className="text-sm font-medium text-neutral-200">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. TOP HEADER (HIDDEN FOR ADMIN LOGS & PANELS) */}
      {!isAdminTab && (
        <header id="app-header" className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-neutral-800 px-0 sm:px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-0">
            <button
              id="mobile-menu-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div 
              className="hidden sm:flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              <EventDrinkLogo size="md" />
              <span className="text-[9px] bg-[#a2d729] text-black font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest leading-none hidden sm:inline-block">
                PRO v4.0
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-full p-1 h-9 shadow-inner md:ml-3">
              <button
                id="xp-toggle-free"
                onClick={() => {
                  if (currentUser?.isLoggedIn) {
                    controller.toggleUserTier();
                  }
                }}
                className={`px-3 py-1 text-[10px] font-extrabold font-mono rounded-full uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  !currentUser?.isLoggedIn
                    ? 'bg-neutral-800 text-neutral-200 shadow-md scale-102 border border-neutral-700/60 font-black' 
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {lang === 'pt-BR' ? 'Grátis' : 'Free'}
              </button>
              <button
                id="xp-toggle-vip"
                onClick={() => {
                  if (!currentUser?.isLoggedIn) {
                    controller.toggleUserTier();
                  }
                }}
                className={`px-3 py-1 text-[10px] font-extrabold font-mono rounded-full uppercase tracking-widest transition-all duration-300 flex items-center space-x-1 cursor-pointer ${
                  currentUser?.isLoggedIn
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black shadow-md' 
                    : 'text-neutral-500 hover:text-amber-400'
                }`}
              >
                <span>VIP ✨</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Seletor internacional de idiomas */}
            <div className="hidden md:flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-full p-1 h-9">
              <button
                id="lang-toggle-pt"
                onClick={() => {
                  setLang('pt-BR');
                  triggerToast('Idioma alterado para Português!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'pt-BR' 
                    ? 'bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black shadow-md font-extrabold' 
                    : 'text-neutral-450 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                id="lang-toggle-en"
                onClick={() => {
                  setLang('en');
                  triggerToast('Language updated to English!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black shadow-md font-extrabold' 
                    : 'text-neutral-450 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Carrinho de Compras */}
            <motion.button
              id="header-prominent-cart-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveTab('cart');
                triggerToast(lang === 'pt-BR' ? 'Acessando o carrinho de compras.' : 'Opening shopping cart.');
              }}
              className={`flex items-center space-x-2 sm:space-x-2.5 px-3 sm:px-4 h-9 rounded-full border transition-all duration-300 cursor-pointer ${
                activeTab === 'cart'
                  ? 'bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] border-[#fe9d00] text-black font-extrabold shadow-md shadow-[#fe9d00]/10'
                  : 'bg-neutral-900/80 hover:bg-neutral-850 border-neutral-800 text-neutral-200'
              }`}
            >
              <div className="relative flex items-center">
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'cart' ? 'text-black' : 'text-[#fe9d00]'}`} />
                {cartInfo.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-bounce leading-none">
                    {cartInfo.count}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold font-sans tracking-tight">
                {lang === 'pt-BR' ? 'Carrinho' : 'Cart'}
              </span>
              <span className={`hidden sm:inline-flex text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'cart' 
                  ? 'bg-black/15 text-black' 
                  : 'text-[#fe9d00] bg-neutral-950 border border-neutral-800/80'
              }`}>
                R$ {cartInfo.total.toFixed(2)}
              </span>
            </motion.button>

            {/* Perfil Trigger */}
            <div 
              id="user-profile-trigger"
              onClick={() => {
                if (currentUser?.isLoggedIn) {
                  setActiveTab('profile');
                } else {
                  setIsLoginModalOpen(true);
                }
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] border border-neutral-800 flex items-center justify-center text-xs font-black text-black font-mono shadow-lg hover:brightness-110 active:scale-95 transition-all">
                {currentUser?.avatarInitials || 'CO'}
              </div>
              <div className="hidden sm:block text-left select-none">
                <p className="text-[10px] font-bold text-white truncate max-w-[120px] leading-none">
                  {currentUser?.isLoggedIn ? currentUser.name : (lang === 'pt-BR' ? 'Entrar' : 'Sign In')}
                </p>
                <p className="text-[9px] text-[#a2d729] font-mono leading-none mt-1 group-hover:underline">
                  {currentUser?.isLoggedIn ? currentUser.badge : (lang === 'pt-BR' ? 'Acessar Conta' : 'Access Account')}
                </p>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ADMIN TOP SECURE HEADER */}
      {isAdminTab && (
        <header id="admin-header" className="sticky top-0 z-50 bg-[#070404] border-b border-red-950/20 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              id="mobile-menu-hamburger-admin-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-3">
              <EventDrinkLogo size="md" />
              <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-full p-1 h-9">
              <button
                id="lang-toggle-admin-pt"
                onClick={() => {
                  setLang('pt-BR');
                  triggerToast('Idioma alterado para Português!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'pt-BR' 
                    ? 'bg-red-500 text-white shadow-md font-extrabold' 
                    : 'text-neutral-450 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                id="lang-toggle-admin-en"
                onClick={() => {
                  setLang('en');
                  triggerToast('Language updated to English!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-red-500 text-white shadow-md font-extrabold' 
                    : 'text-neutral-450 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center space-x-2.5 select-none">
              <span className="text-xs text-neutral-450 hidden md:inline font-mono">
                {currentUser?.name || 'Administrator'}
              </span>
              <div className="w-9 h-9 rounded-full bg-red-600 border border-red-700 flex items-center justify-center text-xs font-black text-white font-mono shadow-lg">
                AD
              </div>
            </div>
          </div>
        </header>
      )}

      {/* RENDER DYNAMIC LAYOUT CORRESPONDING TO ACTIVE ROLE */}
      {(() => {
        const layoutChildren = (
          <AnimatePresence mode="wait font-sans">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col"
            >
              {renderWorkspaceContent()}
            </motion.div>
          </AnimatePresence>
        );

        if (isAdminTab) {
          return (
            <AdminLayout 
              controller={controller} 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            >
              {layoutChildren}
            </AdminLayout>
          );
        }

        if (isVip) {
          return (
            <VipLayout 
              controller={controller} 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            >
              {layoutChildren}
            </VipLayout>
          );
        }

        return (
          <MainLayout 
            controller={controller} 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          >
            {layoutChildren}
          </MainLayout>
        );
      })()}

      {/* GLOBAL FOOTER */}
      <footer id="app-footer" className="bg-[#0c0c0c] border-t border-neutral-900 py-6 text-center text-xs text-neutral-550 font-mono">
        <p>© 2026 EventDrink Pro Corporation. Crafted with exquisite accuracy in Premium Workspace.</p>
      </footer>

      {/* Floating Support Chat Trigger Button */}
      {!isAdminTab && (
        <div className="fixed bottom-6 right-6 z-40 font-sans">
          <AnimatePresence>
            {!isChatOpen && (
              <motion.button
                id="global-floating-chat-trigger"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsChatOpen(true);
                  triggerToast(lang === 'pt-BR' ? 'Iniciando chat vip com suporte...' : 'Starting VIP support chat...');
                }}
                className="p-4 rounded-full bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] text-black shadow-2xl flex items-center justify-center relative group cursor-pointer"
              >
                <MessageSquare className="w-6 h-6 stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#a2d729] border-2 border-[#0d0d0d] rounded-full animate-pulse" />
                
                {/* Tooltip on hover */}
                <span className="absolute right-14 whitespace-nowrap bg-[#121212] border border-neutral-800 text-xs font-bold text-neutral-200 px-3 py-1.5 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none mr-2">
                  {lang === 'pt-BR' ? 'Atendimento Online' : 'Chat Support Live'}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main VIP Support Chat Window */}
      {!isAdminTab && (
        <ChatWidget 
          lang={lang}
          guests={guests}
          eventType={eventType}
          duration={duration}
          profile={profile}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* User Login Modal */}
      <UserLoginModal
        lang={lang}
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={controller.handleLoginSuccess}
        onLogout={controller.handleLogout}
        triggerToast={triggerToast}
      />

      {/* Verificação de Maioridade (Age Gate) */}
      <AgeGateModal
        lang={lang}
        onVerified={handleAgeVerified}
      />
    </div>
  );
}
