import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldAlert, Check, Users, Gift, TrendingUp } from 'lucide-react';

interface VIPLockViewProps {
  featureName: string;
  desc: string;
  lang: 'pt-BR' | 'en';
  onUnlock: () => void;
}

export default function VIPLockView({ featureName, desc, lang, onUnlock }: VIPLockViewProps) {
  const isPt = lang === 'pt-BR';

  const benefits = isPt ? [
    { title: 'Sabor Sob Medida', desc: 'Edição de pesos, gradação alcoólica e ingredientes nobres do catálogo.' },
    { title: 'Harmonização AI Ilimitada', desc: 'Consulte nosso cérebro artificial para qualquer prato de buffet.' },
    { title: '7% Off Automático', desc: 'Ganhe desconto automático direto no fechamento do seu orçamento.' },
    { title: 'Entrega Pro Grátis', desc: 'Isenção de custos logísticos para o transporte de cargas trincando de gelo.' }
  ] : [
    { title: 'Bespoke Mixology', desc: 'Fine-tune parts, alcohol proof, and elite ingredients in real-time.' },
    { title: 'Infinite AI Matcher', desc: 'Query our advanced gastronomy engine for any banquet menu item.' },
    { title: 'Inherent 7% Savings', desc: 'Acquire automatic discounts applied directly at checkout proposal.' },
    { title: 'Complimentary Delivery', desc: 'Complete freight exemption, arriving structured and temperature-controlled.' }
  ];

  return (
    <div id="vip-gate-view" className="relative max-w-4xl mx-auto bg-gradient-to-b from-[#161616]/70 to-[#0d0d0d]/90 border border-amber-500/30 rounded-3xl p-8 md:p-12 text-center overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Background lights */}
      <div className="absolute top-[-100px] left-[50%] -translate-x-1/2 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px]" />
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center justify-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-mono font-black text-amber-400 tracking-widest uppercase">
            {isPt ? 'RECURSO DE NÍVEL PREMIUM VIP' : 'VIP PREMIUM LEVEL FEATURE'}
          </span>
        </div>

        <h3 className="text-3xl font-extrabold text-white tracking-tight uppercase">
          {featureName}
        </h3>

        <p className="text-sm text-neutral-400 leading-relaxed font-sans">
          {desc}
        </p>

        {/* Feature Lock Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 text-left font-sans">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-black/45 border border-neutral-850 p-4 rounded-2xl flex items-start space-x-3 hover:border-amber-500/20 transition-colors">
              <div className="w-5 h-5 rounded-full bg-[#a2d729]/15 flex items-center justify-center text-[#a2d729] shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{benefit.title}</h4>
                <p className="text-[10px] text-neutral-400 leading-normal">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-col items-center space-y-3 font-sans">
          <button
            id="gate-activate-vip-btn"
            onClick={onUnlock}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-black font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            {isPt ? 'Desbloquear Acesso VIP de Graça ✨' : 'Unlock Complimentary VIP License ✨'}
          </button>
          
          <p className="text-[10px] text-neutral-500 font-mono tracking-tight uppercase">
            {isPt ? 'Sem custos ocultos • Ativação imediata no preview para teste' : 'No credit card required • Instant unlock for inspection'}
          </p>
        </div>
      </div>
    </div>
  );
}
