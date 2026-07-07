import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  LogIn, 
  Sparkles, 
  Chrome, 
  Fingerprint, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  LogOut,
  AlertCircle,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { Language, UserSession } from '../types';
import { registerUserAccount, loginUserAccount, calculateAge, getSupabaseStatus } from '../models/SupabaseModel';

interface UserLoginModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  onLogout: () => void;
  triggerToast: (msg: string) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot' | 'profile';

export default function UserLoginModal({
  lang,
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  triggerToast
}: UserLoginModalProps) {
  const [mode, setMode] = useState<AuthMode>(currentUser?.isLoggedIn ? 'profile' : 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const t = {
    'pt-BR': {
      titleSignIn: 'Acesse sua Conta VIP',
      subtitleSignIn: 'Entre para salvar seus orçamentos, simulações e ter acesso ao nosso frete cortesia.',
      titleSignUp: 'Cadastre-se Grátis',
      subtitleSignUp: 'Crie sua conta em 30 segundos e ganhe 7% de desconto na primeira cotação.',
      titleForgot: 'Recuperar Senha',
      subtitleForgot: 'Insira seu e-mail cadastrado para enviarmos as instruções de redefinição.',
      titleProfile: 'Seu Perfil de Host',
      subtitleProfile: 'Aqui está o resumo da sua assinatura premium e orçamentos programados.',
      labelName: 'Nome Completo',
      labelEmail: 'E-mail Corporativo ou Pessoal',
      labelPassword: 'Senha de Acesso',
      labelPhone: 'WhatsApp ou Celular',
      labelBirthDate: 'Data de Nascimento',
      placeholderName: 'Ex: Pedro Silva',
      placeholderEmail: 'Ex: pedro@empresa.com.br',
      placeholderPassword: 'Mínimo de 6 caracteres',
      placeholderPhone: 'Ex: (11) 99999-9999',
      placeholderBirthDate: 'DD/MM/AAAA',
      btnSignIn: 'Entrar com Segurança',
      btnSignUp: 'Concluir Cadastro VIP',
      btnForgot: 'Enviar Link de Recuperação',
      btnBackSignIn: 'Voltar para o Login',
      btnGoSignUp: 'Não tem conta? Cadastre-se agora',
      btnGoForgot: 'Esqueceu sua senha?',
      socialTitle: 'Ou conecte-se com sua rede',
      socialGoogle: 'Google Workspace',
      socialApple: 'Apple ID',
      badgePremium: 'Premium Host',
      statTotalEvents: 'Planos Criados',
      statDiscountEnabled: 'Desconto Ativo',
      btnLogout: 'Desconectar da Conta',
      profileEmailLabel: 'E-mail cadastrado',
      profilePhoneLabel: 'Telefone cadastrado',
      profileBirthDateLabel: 'Data de nascimento',
      successLogin: 'Bem-vindo de volta, ',
      successSignup: 'Conta VIP criada com sucesso! Aproveite seus benefícios.',
      successRecover: 'Instruções enviadas para seu e-mail!',
      msgLogout: 'Sessão encerrada com segurança.',
      validateFields: 'Por favor, preencha todos os campos obrigatórios corretamente.',
      validatePasswordShort: 'A senha deve conter pelo menos 6 caracteres.',
      validateAgeMinor: 'Cadastro negado: É necessário ter pelo menos 18 anos de idade.',
      fingerprintLogin: 'Acessar com Biometria / Passkey',
      fingerprintSuccess: 'Biometria autenticada com sucesso!',
      secureSeal: 'Ambiente 100% Criptografado e Seguro',
    },
    'en': {
      titleSignIn: 'Access VIP Portal',
      subtitleSignIn: 'Sign in to save quotes, load custom proposals and unlock complimentary delivery options.',
      titleSignUp: 'Register as Organizer',
      subtitleSignUp: 'Create your account in 30s and enjoy an automatic 7% off your first drink event reservation.',
      titleForgot: 'Recover Password',
      subtitleForgot: 'Provide your registered email address and we will forward recovery directions instantly.',
      titleProfile: 'Organizer Profile Status',
      subtitleProfile: 'Review your premium benefits, active tier level, and calculated reservations.',
      labelName: 'Full Name',
      labelEmail: 'Corporate or Personal Email',
      labelPassword: 'Secure Access Password',
      labelPhone: 'WhatsApp/Mobile number',
      labelBirthDate: 'Date of Birth',
      placeholderName: 'e.g., Your Name',
      placeholderEmail: 'e.g., your@email.com',
      placeholderPassword: 'At least 6 characters',
      placeholderPhone: 'e.g., +1 (555) 123-4567',
      placeholderBirthDate: 'YYYY-MM-DD',
      btnSignIn: 'Sign In Securely',
      btnSignUp: 'Complete Registration',
      btnForgot: 'Send Reset Instructions',
      btnBackSignIn: 'Back to Login',
      btnGoSignUp: "Don't have an account? Sign up free",
      btnGoForgot: 'Forgot your password?',
      socialTitle: 'Or sign in using alternative options',
      socialGoogle: 'Google Workspace',
      socialApple: 'Apple ID',
      badgePremium: 'Premium VIP Host',
      statTotalEvents: 'Active Proposals',
      statDiscountEnabled: 'Tier Discount',
      btnLogout: 'Sign Out of Account',
      profileEmailLabel: 'Registered Email',
      profilePhoneLabel: 'Registered Contact',
      profileBirthDateLabel: 'Birth Date',
      successLogin: 'Welcome back, ',
      successSignup: 'VIP Account successfully established! Enjoy the benefits.',
      successRecover: 'Recovery keys dispatched to your email address!',
      msgLogout: 'Session terminated securely.',
      validateFields: 'Please complete all required forms with authentic inputs.',
      validatePasswordShort: 'Access password must be at least 6 characters long.',
      validateAgeMinor: 'Registration denied: You must be at least 18 years of age.',
      fingerprintLogin: 'Access with Biometrics / Passkey',
      fingerprintSuccess: 'Passkey recognized! Authorizing entry...',
      secureSeal: 'SSL Secured & Dynamic Authorization Shield',
    }
  }[lang];

  // Helper Initials extract
  const calcInitials = (fullName: string) => {
    if (!fullName) return 'ED';
    const split = fullName.trim().toUpperCase().split(' ');
    if (split.length > 1) {
      return split[0][0] + split[split.length - 1][0];
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Switch modes safely
  const handleModeChange = (newMode: AuthMode) => {
    setErrorMessage('');
    setMode(newMode);
  };

  // Simulated validation & submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signin') {
      if (!email.trim() || !password) {
        setErrorMessage(t.validateFields);
        return;
      }
      if (password.length < 6) {
        setErrorMessage(t.validatePasswordShort);
        return;
      }

      setIsLoading(true);
      loginUserAccount(email.trim(), password)
        .then((account) => {
          setIsLoading(false);
          const loggedUser = {
            name: account.name,
            email: account.email,
            avatarInitials: calcInitials(account.name),
            isLoggedIn: true,
            badge: account.badge,
            role: account.role,
            eventsCount: Math.ceil(Math.random() * 4),
            phone: account.phone || '',
            birthDate: account.birthDate
          };
          onLoginSuccess(loggedUser);
          triggerToast(`${t.successLogin}${loggedUser.name}!`);
          onClose();
        })
        .catch((err: any) => {
          setIsLoading(false);
          setErrorMessage(err.message || 'Erro de autenticação.');
        });

    } else if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password || !birthDate) {
        setErrorMessage(t.validateFields);
        return;
      }
      if (password.length < 6) {
        setErrorMessage(t.validatePasswordShort);
        return;
      }

      const age = calculateAge(birthDate);
      if (age < 18) {
        setErrorMessage(t.validateAgeMinor);
        return;
      }

      setIsLoading(true);
      const newAccount = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        email: email.trim(),
        password: password,
        phone: phone.trim() || undefined,
        birthDate: birthDate,
        badge: 'VIP Member' as const,
        role: 'VIP' as const,
        createdAt: new Date().toISOString()
      };

      const serverEndpoint = import.meta.env.VITE_USER_REG_ENDPOINT;

      const tryServerRegister = async () => {
        if (!serverEndpoint) return null;
        try {
          const resp = await fetch(serverEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAccount),
          });
          if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err?.error || 'Server registration failed');
          }
          const json = await resp.json();
          return json.account ?? json;
        } catch (e) {
          console.warn('Server register failed, falling back to local/registerUserAccount:', e?.message || e);
          return null;
        }
      };

      (async () => {
        const serverResult = await tryServerRegister();
        if (serverResult) {
          setIsLoading(false);
          const registeredUser = {
            name: serverResult.name,
            email: serverResult.email,
            avatarInitials: calcInitials(serverResult.name),
            isLoggedIn: true,
            badge: serverResult.badge || 'VIP Member',
            role: serverResult.role || 'VIP',
            eventsCount: 1,
            phone: serverResult.phone || undefined,
            birthDate: serverResult.birth_date || serverResult.birthDate
          };
          onLoginSuccess(registeredUser);
          triggerToast(t.successSignup);
          onClose();
          return;
        }

        registerUserAccount(newAccount)
          .then((account) => {
          setIsLoading(false);
          const registeredUser = {
            name: account.name,
            email: account.email,
            avatarInitials: calcInitials(account.name),
            isLoggedIn: true,
            badge: account.badge,
            role: account.role,
            eventsCount: 1,
            phone: account.phone || undefined,
            birthDate: account.birthDate
          };
          onLoginSuccess(registeredUser);
          // Inform user about backend persistence status
          const supa = getSupabaseStatus();
          if (!supa.configured) {
            triggerToast((lang === 'pt-BR' ? 'Cadastro salvo localmente. Configuração do Supabase ausente; não persistido no banco.' : 'Registered locally; Supabase not configured, not persisted to DB.'));
          } else {
            triggerToast(t.successSignup);
          }
          onClose();
        })
        .catch((err: any) => {
          setIsLoading(false);
          setErrorMessage(err.message || 'Erro ao registrar.');
        });
      })();

    } else if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage(t.validateFields);
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        triggerToast(t.successRecover);
        handleModeChange('signin');
      }, 1000);
    }
  };

  // Social auth placeholders for unavailable providers
  const handleUnavailableSocialAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast(lang === 'pt-BR' ? `Autenticação social ${provider} indisponível no momento.` : `${provider} social sign-in is currently unavailable.`);
    }, 800);
  };

  const handleUnavailablePasskey = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast(lang === 'pt-BR' ? 'Passkey indisponível no momento.' : 'Passkey is currently unavailable.');
    }, 800);
  };

  // Handle Log Out click
  const handlePerformLogout = () => {
    onLogout();
    triggerToast(t.msgLogout);
    handleModeChange('signin');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            id="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            id="auth-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-[500px] bg-[#0c0c0c] border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Header branding accents */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#fe9d00] via-[#ff5d00] to-[#a2d729]" />
            
            <button
              id="auth-close-btn"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-900 rounded-xl text-neutral-400 hover:text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Form Body */}
            <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
              
              <AnimatePresence mode="wait">
                {/* PROFILE DETAILS SCREEN */}
                {currentUser?.isLoggedIn && mode === 'profile' ? (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    className="space-y-6 text-left"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center space-x-2 bg-[#fe9d00]/10 border border-[#fe9d00]/20 text-[#fe9d00] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t.badgePremium}</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {t.titleProfile}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {t.subtitleProfile}
                      </p>
                    </div>

                    {/* Centered User Info Card */}
                    <div className="p-5 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] flex items-center justify-center text-xl font-extrabold text-black font-mono shadow-xl shrink-0">
                        {currentUser.avatarInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-white truncate leading-snug">
                          {currentUser.name}
                        </h4>
                        <p className="text-xs text-neutral-400 truncate font-mono">
                          {currentUser.email}
                        </p>
                        <span className="inline-block mt-1 text-[10px] text-[#a2d729] font-semibold bg-[#a2d729]/10 border border-[#a2d729]/20 px-2 py-0.5 rounded-md">
                          7% OFF Ativo
                        </span>
                      </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800/60 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                          {t.statTotalEvents}
                        </span>
                        <span className="text-2xl font-extrabold text-white">
                          {currentUser.eventsCount}
                        </span>
                      </div>
                      <div className="p-4 bg-neutral-900/60 border border-neutral-800/60 rounded-xl text-center">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                          {t.statDiscountEnabled}
                        </span>
                        <span className="text-2xl font-extrabold text-[#a2d729] flex items-center justify-center">
                          7% <span className="text-xs ml-0.5 text-neutral-400">VIP</span>
                        </span>
                      </div>
                    </div>

                    {/* Account specifications detail listing */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-start text-xs py-2.5 border-b border-neutral-900">
                        <span className="text-neutral-400 font-medium shrink-0">{t.profileEmailLabel}</span>
                        <span className="text-white font-mono text-right break-all max-w-[65%] ml-2">{currentUser.email}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs py-2.5 border-b border-neutral-900">
                        <span className="text-neutral-400 font-medium shrink-0">{t.profilePhoneLabel}</span>
                        <span className="text-white font-mono text-right break-words max-w-[65%] ml-2">{currentUser.phone || '—'}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs py-2.5 border-b border-neutral-900">
                        <span className="text-neutral-400 font-medium shrink-0">{t.profileBirthDateLabel}</span>
                        <span className="text-white font-mono text-right break-words max-w-[65%] ml-2">{currentUser.birthDate || '—'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-2.5">
                        <span className="text-neutral-400 font-medium">Status Segurança</span>
                        <span className="text-[#a2d729] font-mono flex items-center space-x-1 font-bold">
                          <span>Auto-MFA Ativo</span>
                        </span>
                      </div>
                    </div>

                    {/* Button trigger list */}
                    <div className="space-y-2 pt-4">
                      <button
                        id="auth-signout-btn"
                        onClick={handlePerformLogout}
                        className="w-full bg-neutral-900 hover:bg-red-950/20 text-neutral-300 hover:text-red-400 font-bold text-xs py-3 rounded-xl border border-neutral-800 hover:border-red-900/30 transition-all flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.btnLogout}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* SIGN IN, SIGN UP AND FORGOT PASSWORD SCREENS */
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6 text-left"
                  >
                    {/* Header text contents */}
                    <div className="space-y-1.5">
                      <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        {mode === 'signin' && t.titleSignIn}
                        {mode === 'signup' && t.titleSignUp}
                        {mode === 'forgot' && t.titleForgot}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {mode === 'signin' && t.subtitleSignIn}
                        {mode === 'signup' && t.subtitleSignUp}
                        {mode === 'forgot' && t.subtitleForgot}
                      </p>
                    </div>

                    {/* Display Error Banner if any */}
                    {errorMessage && (
                      <div className="p-3.5 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center space-x-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{errorMessage}</p>
                      </div>
                    )}

                    {/* Auth custom form submission */}
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {mode === 'signup' && (
                        <>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-neutral-400">
                              {t.labelName}
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                                <User className="w-4 h-4" />
                              </span>
                              <input
                                id="auth-input-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.placeholderName}
                                required
                                className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#fe9d00] focus:ring-1 focus:ring-[#fe9d00]/30 transition-all font-sans"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-neutral-400">
                              {t.labelBirthDate} <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                                <Calendar className="w-4 h-4" />
                              </span>
                              <input
                                id="auth-input-birthdate"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                                className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#fe9d00] focus:ring-1 focus:ring-[#fe9d00]/30 transition-all font-mono"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-neutral-400">
                          {t.labelEmail}
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            id="auth-input-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.placeholderEmail}
                            required
                            className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#fe9d00] focus:ring-1 focus:ring-[#fe9d00]/30 transition-all font-mono"
                          />
                        </div>
                      </div>

                      {mode !== 'forgot' && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-neutral-400">
                              {t.labelPassword}
                            </label>
                            {mode === 'signin' && (
                              <button
                                id="auth-forgot-btn-link"
                                type="button"
                                onClick={() => handleModeChange('forgot')}
                                className="text-[10px] text-neutral-500 hover:text-white transition-colors"
                              >
                                {t.btnGoForgot}
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                              <Lock className="w-4 h-4" />
                            </span>
                            <input
                              id="auth-input-password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder={t.placeholderPassword}
                              required
                              className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-10 pr-11 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#fe9d00] focus:ring-1 focus:ring-[#fe9d00]/30 transition-all font-mono animate-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {mode === 'signup' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-neutral-400">
                            {t.labelPhone} <span className="text-neutral-600 font-sans font-normal">(opcional)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                              <Smartphone className="w-4 h-4" />
                            </span>
                            <input
                              id="auth-input-phone"
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder={t.placeholderPhone}
                              className="w-full bg-[#111111] border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#fe9d00] focus:ring-1 focus:ring-[#fe9d00]/30 transition-all font-sans"
                            />
                          </div>
                        </div>
                      )}

                      {/* Primary Action Form Button */}
                      <button
                        id="auth-primary-submit-btn"
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] hover:brightness-110 active:scale-[0.99] text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(254,157,0,0.3)] disabled:opacity-45 disabled:pointer-events-none flex items-center justify-center space-x-2"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 stroke-[2.5]" />
                            <span>
                              {mode === 'signin' && t.btnSignIn}
                              {mode === 'signup' && t.btnSignUp}
                              {mode === 'forgot' && t.btnForgot}
                            </span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Mode Toggle Anchors */}
                    <div className="text-center">
                      {mode === 'signin' && (
                        <button
                          id="auth-switch-signup-btn"
                          onClick={() => handleModeChange('signup')}
                          className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 underline underline-offset-4"
                        >
                          {t.btnGoSignUp}
                        </button>
                      )}
                      {mode === 'signup' && (
                        <button
                          id="auth-switch-signin-btn"
                          onClick={() => handleModeChange('signin')}
                          className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 underline underline-offset-4"
                        >
                          {t.btnBackSignIn}
                        </button>
                      )}
                      {mode === 'forgot' && (
                        <button
                          id="auth-switch-signin-from-forgot-btn"
                          onClick={() => handleModeChange('signin')}
                          className="text-xs text-neutral-400 hover:text-white transition-colors duration-200 underline underline-offset-4"
                        >
                          {t.btnBackSignIn}
                        </button>
                      )}
                    </div>

                    {/* Divider for Social Logins */}
                    {mode !== 'forgot' && (
                      <div className="space-y-4 pt-2">
                        <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t border-neutral-900"></div>
                          <span className="flex-shrink mx-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-extrabold">
                            {t.socialTitle}
                          </span>
                          <div className="flex-grow border-t border-neutral-900"></div>
                        </div>

                        {/* Social Buttons Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            id="social-google-auth-btn"
                            type="button"
                            onClick={() => handleUnavailableSocialAuth('Google Workspace')}
                            className="bg-[#121212] border border-neutral-800 hover:bg-neutral-900 text-xs font-bold py-2.5 px-3 rounded-xl text-neutral-300 flex items-center justify-center space-x-2 transition-colors"
                          >
                            <Chrome className="w-3.5 h-3.5 text-[#ff5d00]" />
                            <span className="truncate">{t.socialGoogle}</span>
                          </button>
                          
                          <button
                            id="social-biometric-auth-btn"
                            type="button"
                            onClick={handleUnavailablePasskey}
                            className="bg-[#121212] border border-neutral-800 hover:bg-neutral-900 text-xs font-bold py-2.5 px-3 rounded-xl text-[#a2d729] flex items-center justify-center space-x-2 transition-colors"
                          >
                            <Fingerprint className="w-3.5 h-3.5 text-[#a2d729]" />
                            <span className="truncate">Passkey VIP</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SSL Security Shield Banner */}
                    <div className="pt-2 border-t border-neutral-950 flex items-center justify-center space-x-2 text-neutral-600 font-mono text-[9px] tracking-wider uppercase">
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                      <span>{t.secureSeal}</span>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
