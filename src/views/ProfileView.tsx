import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Smartphone, 
  Shield, 
  Lock, 
  History, 
  Settings, 
  Check, 
  Award,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';
import { Language } from '../types';

interface ProfileViewProps {
  lang: Language;
  currentUser: {
    name: string;
    email: string;
    avatarInitials: string;
    isLoggedIn: boolean;
    badge: 'Premium Host' | 'VIP Member' | 'Basic Organizer';
    eventsCount: number;
    phone?: string;
  } | null;
  onLogout: () => void;
  onUpdateUser: (updatedUser: any) => void;
  triggerToast: (msg: string) => void;
}

export default function ProfileView({
  lang,
  currentUser,
  onLogout,
  onUpdateUser,
  triggerToast
}: ProfileViewProps) {
  const isVip = currentUser?.isLoggedIn && (currentUser.badge === 'VIP Member' || currentUser.badge === 'Premium Host');

  const text = {
    'pt-BR': {
      title: 'Seu Perfil de Host',
      sub: 'Gerencie suas credenciais, visualize seu plano e configure suas preferências do Clube.',
      tabDetails: 'Dados Pessoais',
      tabSecurity: 'Segurança & Senha',
      tabLogs: 'Histórico de Atividade',
      labelName: 'Nome Completo',
      labelEmail: 'E-mail Cadastrado',
      labelPhone: 'WhatsApp / Telefone',
      labelRole: 'Plano do Clube',
      labelEvents: 'Eventos Simulados',
      placeholderPhone: 'Ex: (11) 99999-9999',
      btnSave: 'Salvar Alterações',
      oldPassword: 'Senha Atual',
      newPassword: 'Nova Senha',
      confirmNewPassword: 'Confirmar Nova Senha',
      btnChangePassword: 'Alterar Senha',
      secDesc: 'Recomendamos o uso de senhas fortes com caracteres especiais para proteger sua assinatura VIP.',
      badgeVip: 'Clube Event Drink VIP ✨',
      badgeFree: 'Conta Grátis (Básica)',
      lblHistory: 'Histórico de Atividade',
      histEvent1: 'Orçamento de Casamento Gerado',
      histEvent2: 'Download de Menu PDF',
      histEvent3: 'Login efetuado no sistema',
      histLabelDate: 'Data',
      histLabelAction: 'Ação realizada',
      toastSave: 'Perfil atualizado com sucesso!',
      toastPass: 'Senha redefinida com segurança!'
    },
    'en': {
      title: 'Your Host Profile',
      sub: 'Manage your credentials, review subscription tiers, and configure security preferences.',
      tabDetails: 'Personal Info',
      tabSecurity: 'Security & Password',
      tabLogs: 'Activity Logs',
      labelName: 'Full Name',
      labelEmail: 'Registered Email',
      labelPhone: 'WhatsApp / Phone Number',
      labelRole: 'Club Plan',
      labelEvents: 'Simulated Estimates',
      placeholderPhone: 'e.g., +1 (555) 123-4567',
      btnSave: 'Save Personal Changes',
      oldPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      btnChangePassword: 'Change Password Now',
      secDesc: 'We recommend strong alpha-numeric access keys to protect your premium sommelier account.',
      badgeVip: 'VIP Club Member ✨',
      badgeFree: 'Free Basic Account',
      lblHistory: 'Recent Activity Logs',
      histEvent1: 'Wedding Estimate Created',
      histEvent2: 'Menu PDF Checklist Downloaded',
      histEvent3: 'Logged in to dashboard',
      histLabelDate: 'Date',
      histLabelAction: 'Action perform',
      toastSave: 'Profile successfully updated!',
      toastPass: 'Access password modified securely!'
    }
  }[lang];

  const [activeSubTab, setActiveSubTab] = useState<'details' | 'security' | 'history'>('details');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [logs, setLogs] = useState<{ date: string; action: string; status: string }[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_activity_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Update local context
    onUpdateUser({
      ...currentUser,
      name: name.trim(),
      phone: phone.trim(),
      avatarInitials: name.trim().slice(0, 2).toUpperCase()
    });

    // Log this action
    const newLog = {
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: lang === 'pt-BR' ? 'Perfil atualizado pelo Host' : 'Profile updated by Host',
      status: 'OK'
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    try {
      localStorage.setItem('eventdrink_activity_logs', JSON.stringify(updatedLogs));
    } catch (err) {}

    triggerToast(text.toastSave);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      triggerToast(lang === 'pt-BR' ? 'Senhas não conferem!' : 'Passwords do not match!');
      return;
    }

    // Log this action
    const newLog = {
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action: lang === 'pt-BR' ? 'Senha de acesso alterada' : 'Security credentials modified',
      status: 'OK'
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    try {
      localStorage.setItem('eventdrink_activity_logs', JSON.stringify(updatedLogs));
    } catch (err) {}

    triggerToast(text.toastPass);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left font-sans"
    >
      
      {/* Profile Overview Card */}
      <div className={`p-6 md:p-8 rounded-3xl border ${
        isVip 
          ? 'bg-gradient-to-r from-neutral-900 via-[#1c160d] to-neutral-950 border-amber-500/20' 
          : 'bg-neutral-900 border-neutral-800'
      } flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden`}>
        {isVip && (
          <div className="absolute right-[-10px] top-[-10px] w-36 h-36 rounded-full bg-amber-500/5 blur-[50px] pointer-events-none" />
        )}
        
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] text-black font-black text-2xl flex items-center justify-center font-mono shadow-xl shrink-0">
          {currentUser?.avatarInitials || 'CO'}
        </div>
        
        <div className="text-center sm:text-left space-y-2 flex-1">
          <h1 className="text-2xl font-black text-white tracking-tight leading-none">
            {currentUser?.name || (lang === 'pt-BR' ? 'Convidado Event Drink' : 'Event Drink Guest')}
          </h1>
          <p className="text-xs text-neutral-400 font-sans">
            {currentUser?.email || 'guest@eventdrink.com'}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1.5">
            <span className={`text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 border rounded-full uppercase ${
              isVip 
                ? 'bg-amber-500/10 text-[#fe9d00] border-amber-500/20' 
                : 'bg-neutral-800 text-neutral-400 border-neutral-700/60'
            }`}>
              {isVip ? text.badgeVip : text.badgeFree}
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-450 px-2.5 py-1 rounded-full uppercase">
              {currentUser?.badge || 'Basic Organizer'}
            </span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="sm:ml-auto flex items-center space-x-2 px-4 py-2.5 bg-neutral-950 hover:bg-red-500/10 border border-neutral-850 hover:border-red-500/20 text-xs font-bold text-neutral-400 hover:text-red-400 rounded-xl transition-all cursor-pointer shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>{lang === 'pt-BR' ? 'Sair da Conta' : 'Sign Out'}</span>
        </button>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-neutral-900 space-x-2 overflow-x-auto pb-px">
        {[
          { id: 'details', label: text.tabDetails },
          { id: 'security', label: text.tabSecurity },
          { id: 'history', label: text.tabLogs },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'border-[#fe9d00] text-[#fe9d00] font-extrabold'
                : 'border-transparent text-neutral-450 hover:text-neutral-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Forms Area */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 md:p-8">
        
        {/* TAB: Personal Details */}
        {activeSubTab === 'details' && (
          <form onSubmit={handleSaveDetails} className="space-y-6 max-w-xl text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">{text.labelName}</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#fe9d00]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">{text.labelEmail}</label>
                <input 
                  type="email" 
                  value={currentUser?.email || 'pedro@eventdrink.com'} 
                  disabled
                  className="w-full bg-neutral-900/50 border border-neutral-900 text-xs px-4 py-3 rounded-xl text-neutral-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">{text.labelPhone}</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={text.placeholderPhone}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#fe9d00]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 block">{text.labelEvents}</label>
                <input 
                  type="text" 
                  value={currentUser?.eventsCount || 0} 
                  disabled
                  className="w-full bg-neutral-900/50 border border-neutral-900 text-xs px-4 py-3 rounded-xl text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg inline-flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{text.btnSave}</span>
            </button>
          </form>
        )}

        {/* TAB: Change Password Security */}
        {activeSubTab === 'security' && (
          <form onSubmit={handleChangePasswordSubmit} className="space-y-6 max-w-md text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1 text-[#fe9d00] text-[10px] font-mono uppercase font-bold tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                <Shield className="w-3.5 h-3.5" />
                <span>SSL PROTECTED</span>
              </span>
              <p className="text-xs text-neutral-450 leading-relaxed font-sans">{text.secDesc}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">{text.oldPassword}</label>
                <input 
                  type="password" 
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#fe9d00]"
                />
              </div>
              
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-neutral-300 block">{text.newPassword}</label>
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#fe9d00]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-9 text-neutral-500 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 block">{text.confirmNewPassword}</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs px-4 py-3 rounded-xl text-white focus:outline-none focus:border-[#fe9d00]"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="bg-[#fe9d00] hover:bg-[#ff5d00] text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer shadow-lg inline-flex items-center space-x-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>{text.btnChangePassword}</span>
            </button>
          </form>
        )}

        {/* TAB: Local Logs History */}
        {activeSubTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white text-left">{text.lblHistory}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-400 font-sans border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4">{text.histLabelDate}</th>
                    <th className="py-3 px-4">{text.histLabelAction}</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-neutral-500 font-sans text-xs space-y-2">
                        <Shield className="w-8 h-8 text-neutral-600 mx-auto opacity-50" />
                        <p className="font-bold text-neutral-400">{lang === 'pt-BR' ? 'Nenhum Histórico de Auditoria' : 'No Audit Logs Recorded'}</p>
                        <p className="text-[10px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
                          {lang === 'pt-BR' 
                            ? 'O histórico de acessos e modificações de segurança de sua conta está vazio no momento.' 
                            : 'Security audit logs, session entries, and credentials modifications will appear here once executed.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, index) => (
                      <tr key={index} className="hover:bg-neutral-900/10">
                        <td className="py-3 px-4 font-mono text-[11px]">{log.date}</td>
                        <td className="py-3 px-4 font-bold text-neutral-200">{log.action}</td>
                        <td className="py-3 px-4"><span className="text-emerald-400 font-bold">● {log.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </motion.div>
  );
}
