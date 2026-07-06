import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Calendar, Check, X, AlertOctagon } from 'lucide-react';
import { Language } from '../types';

interface AgeGateModalProps {
  lang: Language;
  onVerified: () => void;
}

export default function AgeGateModal({ lang, onVerified }: AgeGateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isMinor, setIsMinor] = useState(false);

  const isPt = lang === 'pt-BR';

  useEffect(() => {
    const verified = localStorage.getItem('eventdrink_age_verified');
    const expiry = localStorage.getItem('eventdrink_age_verified_expiry');
    const now = new Date().getTime();

    if (verified === 'true') {
      if (expiry && now < parseInt(expiry, 10)) {
        onVerified();
      } else {
        // Expired! Clear flags and reopen
        localStorage.removeItem('eventdrink_age_verified');
        localStorage.removeItem('eventdrink_age_verified_expiry');
        document.cookie = "eventdrink_age_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsOpen(true);
      }
    } else if (verified === 'false') {
      setIsMinor(true);
      setIsOpen(true);
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      setErrorMsg(isPt ? 'Por favor, insira sua data de nascimento.' : 'Please enter your birth date.');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (isNaN(age)) {
      setErrorMsg(isPt ? 'Data inválida.' : 'Invalid date.');
      return;
    }

    if (age >= 18) {
      const now = new Date().getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem('eventdrink_age_verified', 'true');
      localStorage.setItem('eventdrink_age_verified_expiry', (now + thirtyDaysMs).toString());
      
      // Cookie extra shield
      document.cookie = `eventdrink_age_verified=true; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Strict; Secure`;

      setIsOpen(false);
      onVerified();
    } else {
      localStorage.setItem('eventdrink_age_verified', 'false');
      document.cookie = "eventdrink_age_verified=false; path=/; SameSite=Strict; Secure";
      setIsMinor(true);
    }
  };

  const handleReject = () => {
    localStorage.setItem('eventdrink_age_verified', 'false');
    document.cookie = "eventdrink_age_verified=false; path=/; SameSite=Strict; Secure";
    setIsMinor(true);
  };

  const handleTryAgain = () => {
    localStorage.removeItem('eventdrink_age_verified');
    localStorage.removeItem('eventdrink_age_verified_expiry');
    document.cookie = "eventdrink_age_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsMinor(false);
    setBirthDate('');
    setErrorMsg('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#070505] backdrop-blur-2xl" />

      {/* Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#0d0d0d] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-center space-y-6 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />

        {isMinor ? (
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto animate-bounce">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {isPt ? 'Acesso Bloqueado' : 'Access Blocked'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {isPt
                  ? 'Desculpe, o acesso a este e-commerce de bebidas alcoólicas é restrito para maiores de 18 anos. Conforme a lei, proibimos a venda e consumo para menores.'
                  : 'We are sorry, but access to this liquor e-commerce is restricted to people aged 18 or older. Under the law, sales and consumption for minors are prohibited.'}
              </p>
            </div>
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
              ⚠️ {isPt ? 'Aviso legal: Venda proibida para menores de 18 anos' : 'Legal Warning: Sale prohibited to minors under 18'}
            </div>
            <button
              onClick={handleTryAgain}
              className="w-full mt-2 bg-gradient-to-tr from-amber-500 to-yellow-400 hover:brightness-110 text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              {isPt ? 'Tentar Novamente' : 'Try Again'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {isPt ? 'Verificação de Idade' : 'Age Verification'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {isPt
                  ? 'Para prosseguir e explorar nossa adega premium de bebidas e cocktails, confirme se você possui 18 anos de idade ou mais.'
                  : 'To proceed and explore our premium beverage cellar and cocktail list, please confirm that you are 18 years of age or older.'}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2 text-left">
                <label htmlFor="birthdate-input" className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
                  {isPt ? 'Data de Nascimento' : 'Date of Birth'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    id="birthdate-input"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(e.target.value);
                      setErrorMsg('');
                    }}
                    className="w-full bg-[#111111] border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-mono"
                  />
                </div>
                {errorMsg && <p className="text-[11px] text-red-400 mt-1">{errorMsg}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReject}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-300 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  {isPt ? 'Tenho menos de 18' : 'I am under 18'}
                </button>
                <button
                  id="age-gate-confirm-btn"
                  type="submit"
                  className="bg-gradient-to-tr from-amber-500 to-yellow-400 hover:brightness-110 active:scale-[0.98] text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-[0_4px_15px_rgba(245,158,11,0.2)] cursor-pointer"
                >
                  {isPt ? 'Confirmar e Entrar' : 'Confirm and Enter'}
                </button>
              </div>
            </form>

            <div className="text-[10px] text-neutral-550 leading-relaxed font-mono pt-2 border-t border-neutral-950">
              {isPt
                ? 'Ao entrar, você concorda com nossos termos. Bebidas alcoólicas devem ser consumidas com moderação. A idade poderá ser verificada na entrega.'
                : 'By entering, you agree to our terms. Alcoholic beverages should be consumed in moderation. Age may be verified upon delivery.'}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
