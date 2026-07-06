import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Database, 
  Users, 
  Briefcase, 
  DollarSign, 
  Download, 
  BookOpen, 
  Cpu, 
  Terminal, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Home,
  CheckSquare,
  Sparkles,
  Wine,
  Package,
  Truck,
  Tag,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { Tab } from '../types';

interface AdminLayoutProps {
  controller: AppControllerType;
  children: ReactNode;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function AdminLayout({ controller, children, isMobileMenuOpen, setIsMobileMenuOpen }: AdminLayoutProps) {
  const {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    currentUser,
    handleLogout,
    triggerToast
  } = controller;

  const isPt = lang === 'pt-BR';

  const renderNavButton = (tabName: Tab, icon: ReactNode, label: string) => {
    const isActive = activeTab === tabName;

    return (
      <button
        id={`nav-admin-${tabName}`}
        onClick={() => {
          setActiveTab(tabName);
          setIsMobileMenuOpen(false);
        }}
        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative cursor-pointer text-left ${
          isActive 
            ? 'bg-red-500/15 text-red-400 border-l-4 border-red-500 font-medium' 
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/30'
        }`}
      >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-red-400' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
          {icon}
        </div>
        <span className="text-xs tracking-wide flex-1">{label}</span>
        {isActive && (
          <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        )}
      </button>
    );
  };

  return (
    <div id="admin-layout-root" className="flex-1 flex flex-col md:flex-row relative">
      
      {/* Sidebar Overlay on Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            id="mobile-menu-backdrop-admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/95 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Panel for Admin Console */}
      <aside 
        id="app-sidebar-admin" 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#0a0606] p-4 pt-24 md:pt-4 flex flex-col justify-between overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:self-start md:w-64 md:translate-x-0 md:bg-transparent md:border-r border-red-500/10
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="space-y-1 text-left">
          <div className="px-4 pb-3 border-b border-red-950/20 mb-3 flex items-center space-x-2 text-red-400 select-none">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-xs font-black font-mono tracking-widest uppercase">
              {isPt ? 'PAINEL ADMIN' : 'ADMIN CONSOLE'}
            </span>
          </div>

          {renderNavButton('admin-dashboard', <Database className="w-4 h-4" />, isPt ? 'Dashboard' : 'Dashboard')}
          {renderNavButton('admin-stock', <Package className="w-4 h-4 text-amber-500" />, isPt ? 'Estoque' : 'Inventory')}
          {renderNavButton('admin-orders', <Truck className="w-4 h-4 text-[#fe9d00]" />, isPt ? 'Gestão de Pedidos' : 'Orders')}
          {renderNavButton('admin-coupons', <Tag className="w-4 h-4 text-emerald-400" />, isPt ? 'Cupons' : 'Coupons')}
          {renderNavButton('admin-loyalty', <Award className="w-4 h-4 text-yellow-400" />, isPt ? 'Fidelidade' : 'Loyalty')}
          {renderNavButton('admin-analytics', <TrendingUp className="w-4 h-4 text-emerald-400" />, isPt ? 'Analytics' : 'Analytics')}
          {renderNavButton('admin-logs', <FileText className="w-4 h-4 text-red-400" />, isPt ? 'Auditoria (Logs)' : 'Audit Logs')}
          {renderNavButton('admin-events', <CheckSquare className="w-4 h-4" />, isPt ? 'Eventos' : 'Events')}
          {renderNavButton('admin-financial', <DollarSign className="w-4 h-4" />, isPt ? 'Financeiro' : 'Financials')}
          {renderNavButton('admin-downloads', <Download className="w-4 h-4" />, isPt ? 'Downloads' : 'Downloads')}
          {renderNavButton('admin-courses', <BookOpen className="w-4 h-4" />, isPt ? 'Cursos' : 'Courses')}
          {renderNavButton('admin-ia', <Cpu className="w-4 h-4" />, isPt ? 'Diretivas da IA' : 'AI Directives')}
          {renderNavButton('admin-config', <Settings className="w-4 h-4" />, isPt ? 'Configurações' : 'Settings')}

          {/* Portable Language toggler */}
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-900 flex items-center justify-between px-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> {isPt ? 'IDIOMA' : 'LANGUAGE'}
            </span>
            <div className="flex items-center space-x-1 bg-neutral-950 border border-neutral-800 rounded-full p-1 h-9">
              <button
                onClick={() => {
                  setLang('pt-BR');
                  triggerToast('Idioma alterado para Português!');
                }}
                className={`px-3 py-1 text-[10px] font-bold font-mono rounded-full uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  lang === 'pt-BR' ? 'bg-red-500 text-white shadow-md font-extrabold' : 'text-neutral-400 hover:text-white'
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
                  lang === 'en' ? 'bg-red-500 text-white shadow-md font-extrabold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Exit Admin Command panel */}
        <div className="pt-4 border-t border-red-950/20 px-4">
          <div className="p-4 bg-neutral-950/50 border border-red-950/20 rounded-2xl select-none text-left">
            <div className="flex items-center space-x-1.5 text-red-400 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                {isPt ? 'Sessão Administrador' : 'Secure Admin Mode'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 leading-normal">
              {isPt ? 'Você está navegando em ambiente corporativo seguro.' : 'Avoid sharing screen details outside of company channels.'}
            </p>
            <button
              onClick={() => {
                handleLogout();
                setActiveTab('landing');
                triggerToast(isPt ? 'Encerrou sessão segura de administração.' : 'Admin secure session closed.');
              }}
              className="w-full mt-3 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-extrabold text-[10px] uppercase py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isPt ? 'Sair do Sistema' : 'Exit Admin'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main workspace container */}
      <main id="app-component-workspace-admin" className="flex-1 p-4 md:p-8 bg-[#180f0d]/10 overflow-y-auto flex flex-col justify-between min-h-[calc(100vh-73px)]">
        <div>
          {children}
        </div>

        {/* Rodapé de Aviso Legal de Maioridade */}
        <footer className="mt-12 pt-6 border-t border-red-950/20 text-center space-y-2 select-none">
          <p className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">
            {lang === 'pt-BR' 
              ? '⚠️ SEÇÃO ADMINISTRATIVA EVENTDRINK - PRODUTOS PARA MAIORES DE 18 ANOS' 
              : '⚠️ EVENTDRINK ADMIN ZONE - FOR AGES 18+ ONLY'}
          </p>
          <p className="text-[10px] text-neutral-600 max-w-2xl mx-auto leading-relaxed font-sans">
            {lang === 'pt-BR'
              ? 'Ambiente de monitoramento de vendas e faturamento de bebidas alcoólicas. Lembre-se: é proibido vender, ofertar ou fornecer bebidas alcoólicas para menores de 18 anos.'
              : 'Alcoholic beverage commerce monitoring and operations dashboard. Remember: sales, marketing or delivery to minors under 18 is strictly prohibited.'}
          </p>
        </footer>
      </main>

    </div>
  );
}
