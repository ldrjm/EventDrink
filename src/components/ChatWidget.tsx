import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Headphones, 
  Sparkles, 
  Wine, 
  Clock, 
  HelpCircle,
  TrendingDown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Language, EventType, ConsumptionProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  time: string;
}

interface ChatWidgetProps {
  lang: Language;
  guests: number;
  eventType: EventType;
  duration: number;
  profile: ConsumptionProfile;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({
  lang,
  guests,
  eventType,
  duration,
  profile,
  isOpen,
  onClose
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Translate labels
  const t = {
    'pt-BR': {
      conciergeTitle: 'Concierge EventDrink Pro',
      statusOnline: 'Especialista Online',
      placeholder: 'Digite sua mensagem...',
      quickOptionsTitle: 'Dúvidas mais comuns:',
      msgWelcome: `Olá! Sou o Sommelier Virtual e Concierge EventDrink Pro. 🍷\n\nVejo que você está planejando um evento **${eventType.toUpperCase()}** de **${duration} horas** para **${guests} convidados** (perfil ${profile === 'intense' ? 'Alta intensidade' : 'Moderado'}).\n\nComo posso ajudar você com a seleção de bebidas ou simulação de preços agora?`,
      faqIce: 'Como é calculado o gelo para as bebidas?',
      faqPairing: 'Quais vinhos harmonizam melhor?',
      faqDelivery: 'Como funciona o frete e devoluções?',
      faqHuman: 'Falar com atendente humano premium',
      ansIce: `Para um evento de ${duration} horas com ${guests} pessoas, nosso algoritmo sugere cerca de **${Math.round(guests * (profile === 'intense' ? 0.15 : 0.1) * (duration / 6))} sacos de gelo** (especialmente se houver bar de drinks e destilados). Isso mantém suas long necks e drinks na temperatura sublime de consumo!`,
      ansPairing: `Para o seu evento ${eventType === 'aniversario' ? 'Aniversário 🎂' : 'Reunião/Social 💼'}, sugerimos:\n\n🍷 **Cabernet Sauvignon 2018** (Vinho tinto seco) - Ideal para acompanhar grelhados, queijos amarelos e massas.\n\n🥂 **Sauvignon Blanc Limited** (Vinho branco leve) - Excelente para canapés finos, salmão, camarão e sobremesas frescas.`,
      ansDelivery: `Sua entrega com o plano VIP é 100% programada e refrigerada! Entregamos os combos no endereço solicitado até 3 horas antes do evento para garantir a temperatura perfeita.\n\n🔄 **Logística Reversa**: Se sobrarem bebidas seladas e sem rasuras nas caixas estruturantes, nós recolhemos e reembolsamos em até 100% das garrafas intactas!`,
      ansHuman: 'Conectando ao canal premium de consultores concierge VIP... 🎧\n\nUm de nossos sommeliers humanos foi notificado e entrará em contato aqui em instantes. Para acelerar o processo, você prefere atendimento por WhatsApp ou ligação direta no seu cadastro?',
      typing: 'Sommelier está formulando resposta...',
      contactWhatsApp: 'Atender por WhatsApp',
      feedbackSent: 'Sabor de Atendimento nota 10!',
    },
    'en': {
      conciergeTitle: 'EventDrink Pro Concierge',
      statusOnline: 'Expert Online',
      placeholder: 'Type your message...',
      quickOptionsTitle: 'Popular Questions:',
      msgWelcome: `Hello there! I am the EventDrink Pro Virtual Sommelier & Concierge. 🍷\n\nI see you are planning a **${eventType.toUpperCase()}** event lasting **${duration} hours** for **${guests} guests** (consumption style: ${profile === 'intense' ? 'Heavy' : 'Moderate'}).\n\nHow can I assist you with catering calculations, custom quotes, or wine pairing recommendations?`,
      faqIce: 'How is ice quantity calculated?',
      faqPairing: 'Which wines pair best with my buffet?',
      faqDelivery: 'How do shipping and returns work?',
      faqHuman: 'Connect to an elite human assistant',
      ansIce: `For a ${duration}-hour event of ${guests} people, our algorithm recommends about **${Math.round(guests * (profile === 'intense' ? 0.15 : 0.1) * (duration / 6))} bags of premium ice** (especially for cocktail bars). This holds your cold beers and premium mixes at the perfect temperature!`,
      ansPairing: `For your ${eventType === 'aniversario' ? 'Birthday 🎂' : 'Social/Meeting 💼'} celebration, we highly recommend:\n\n🍷 **Cabernet Sauvignon 2018** (robust red wine) - Ideal for grilled meats, seasoned cheese boards, and pastas.\n\n🥂 **Sauvignon Blanc Limited** (dry white wine) - Superb for fine Hors d'oeuvres, seafood, and fresh salad starters.`,
      ansDelivery: `Your delivery with our VIP level is 100% scheduled and temperature-controlled! We deliver all cocktails pre-chilled up to 3 hours prior to guest arrival.\n\n🔄 **Consignment Guarantee**: Unopened, undamaged cases are fully eligible for return and swift reimbursement. Zero waste, zero stress!`,
      ansHuman: 'Securing a connection with a dedicated human concierge VIP specialist... 🎧\n\nAn experienced VIP coordinator is being summoned. While they connect, would you prefer us to reach you via WhatsApp text or direct audio call using your account details?',
      typing: 'Sommelier is typing an answer...',
      contactWhatsApp: 'Chat via WhatsApp',
      feedbackSent: 'Stellar customer service tier!',
    }
  }[lang];

  // Load initial welcome message when open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: t.msgWelcome,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, messages.length, lang, eventType, duration, guests, profile]);

  // Keep scroll at bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [messages, isOpen]);

  // Handle support clicks
  const handleQuickQuestion = (key: 'faqIce' | 'faqPairing' | 'faqDelivery' | 'faqHuman') => {
    const userText = t[key];
    const replyText = key === 'faqIce' ? t.ansIce :
                     key === 'faqPairing' ? t.ansPairing :
                     key === 'faqDelivery' ? t.ansDelivery : t.ansHuman;

    const userMsg: Message = {
      id: `u${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: `b${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Text send trigger
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    const userMsg: Message = {
      id: `u${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Dynamic smart reply simulator based on matches
    setTimeout(() => {
      let botAnswer = '';
      const textLower = userText.toLowerCase();

      if (textLower.includes('cerveja') || textLower.includes('beer') || textLower.includes('ipa')) {
        botAnswer = lang === 'pt-BR' 
          ? `Para cervejas, consideramos uma excelente margem! O cálculo indica ${Math.round(guests * (profile === 'intense' ? 6 : 4))} long necks de **Craft IPA**. Cervejas IPA amargam suavemente e harmonizam primorosamente com porções de aniversário e corporativos.`
          : `For beers, we consider an excellent margin! The calculations call for ${Math.round(guests * (profile === 'intense' ? 6 : 4))} bottles of **Craft IPA**. They pair delightfully with party finger-foods and corporate appetizers.`;
      } else if (textLower.includes('vinho') || textLower.includes('wine') || textLower.includes('cabernet')) {
        botAnswer = lang === 'pt-BR'
          ? `Excelente gosto gastronômico. O Cabernet Sauvignon tem uma estimativa de consumo base de 1 garrafa para cada 4 convidados em jantares. E o Sauvignon Blanc é maravilhoso como recepção! Deseja que eu adicione um combo especial de adega no seu orçamento?`
          : `Excellent culinary taste. The Cabernet Sauvignon estimation assumes 1 bottle for every 4 guests during main courses. Our Sauvignon Blanc is a beautiful selection as reception drink. Shall I add a private winery selection to your basket?`;
      } else if (textLower.includes('preço') || textLower.includes('valor') || textLower.includes('price') || textLower.includes('desconto') || textLower.includes('cupom')) {
        botAnswer = lang === 'pt-BR'
          ? `Como você possui o selo **Premium Host**, você já conta com 7% de desconto automático na sua simulação! Além disso, faturamos para CNPJ e parcelamos em até 10 vezes sem juros para pagamentos fechados nesta semana.`
          : `Since you hold the active **Premium Host** badge, you automatically enjoy 7% tier discount. We invoice corporate companies directly and support credit installments up to 10 months interest-free!`;
      } else if (textLower.includes('gelo') || textLower.includes('ice')) {
        botAnswer = t.ansIce;
      } else if (textLower.includes('ajuda') || textLower.includes('help') || textLower.includes('atendente') || textLower.includes('suporte')) {
        botAnswer = t.ansHuman;
      } else {
        botAnswer = lang === 'pt-BR'
          ? `Compreendo perfeitamente. Como concierge, posso ajustar sua cotação vip com taxas cortesia. Gostaria que eu simulasse a inclusão de bebidas sem álcool premium (águas gaseificadas finas) para balancear o buffet?`
          : `Fascinating request! As your dedicated concierge, I can request customized VIP quotes. Would you like me to simulate premium non-alcoholic options (like glass mineral sparkling waters) to complete the buffet pairing?`;
      }

      const botMsg: Message = {
        id: `b${Date.now()}`,
        sender: 'bot',
        text: botAnswer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="chat-concierge-container"
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100%-32px)] sm:w-[420px] max-w-[420px] h-[600px] max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-48px)] bg-[#0f0f0f] border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-neutral-900 via-[#161616] to-neutral-900 border-b border-neutral-800 p-4 shrink-0 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-left">
              <div className="relative">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] text-black">
                  <Headphones className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#a2d729] border-2 border-[#0f0f0f] rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide">
                  {t.conciergeTitle}
                </h4>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-[10px] text-[#a2d729] font-mono leading-none">●</span>
                  <span className="text-[10px] font-mono font-bold text-neutral-400">
                    {t.statusOnline}
                  </span>
                </div>
              </div>
            </div>

            <button
              id="close-chat-btn"
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-800/80 rounded-lg text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Prompt Directive indicator */}
          {(() => {
            const savedPrompt = localStorage.getItem('eventdrink_ai_prompt');
            if (savedPrompt) {
              return (
                <div className="bg-red-500/5 border-b border-red-500/10 px-4 py-2.5 flex items-center justify-between text-[9px] font-mono text-red-400 shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-red-400 animate-pulse" />
                    <span>{lang === 'pt-BR' ? 'DIRETIVAS DA IA ATIVAS' : 'CUSTOM AI DIRECTIVES ACTIVE'}</span>
                  </div>
                  <span className="text-neutral-500 max-w-[150px] truncate" title={savedPrompt}>{savedPrompt.slice(0, 30)}...</span>
                </div>
              );
            }
            return null;
          })()}

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0d0d0d]/40 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} text-left`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                    isUser 
                      ? 'bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] text-black font-semibold rounded-tr-none' 
                      : 'bg-neutral-900/90 text-neutral-200 border border-neutral-800/80 rounded-tl-none whitespace-pre-line'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] text-right font-mono ${isUser ? 'text-black/60' : 'text-neutral-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div id="concierge-typing-indicator" className="flex justify-start text-left">
                <div className="bg-neutral-900 border border-neutral-800/80 text-neutral-400 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe9d00] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe9d00] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe9d00] animate-bounce" />
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">{t.typing}</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick interactive helpers if state allows */}
          <div className="px-4 py-2 border-t border-neutral-900 bg-neutral-950 shrink-0 text-left">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-extrabold block mb-1.5">
              {t.quickOptionsTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                id="quick-ice-btn"
                onClick={() => handleQuickQuestion('faqIce')}
                disabled={isTyping}
                className="text-[10px] font-medium bg-neutral-900 hover:bg-neutral-800 hover:text-white border border-neutral-800 text-neutral-300 py-1.5 px-3 rounded-full transition-colors inline-flex items-center space-x-1"
              >
                <Clock className="w-3 h-3 text-[#fe9d00]" />
                <span>{lang === 'pt-BR' ? 'Cálculo de Gelo' : 'Ice Math'}</span>
              </button>
              <button
                id="quick-pairing-btn"
                onClick={() => handleQuickQuestion('faqPairing')}
                disabled={isTyping}
                className="text-[10px] font-medium bg-neutral-900 hover:bg-neutral-800 hover:text-white border border-neutral-800 text-neutral-300 py-1.5 px-3 rounded-full transition-colors inline-flex items-center space-x-1"
              >
                <Wine className="w-3 h-3 text-[#fe9d00]" />
                <span>{lang === 'pt-BR' ? 'Harmonização' : 'Wine Pairing'}</span>
              </button>
              <button
                id="quick-delivery-btn"
                onClick={() => handleQuickQuestion('faqDelivery')}
                disabled={isTyping}
                className="text-[10px] font-medium bg-neutral-900 hover:bg-neutral-800 hover:text-white border border-neutral-800 text-neutral-300 py-1.5 px-3 rounded-full transition-colors inline-flex items-center space-x-1"
              >
                <ShieldCheck className="w-3 h-3 text-neutral-400" />
                <span>{lang === 'pt-BR' ? 'De devolução' : 'Returns & Safe'}</span>
              </button>
              <button
                id="quick-human-btn"
                onClick={() => handleQuickQuestion('faqHuman')}
                disabled={isTyping}
                className="text-[10px] font-bold bg-[#fe9d00]/10 hover:bg-[#fe9d00]/20 text-[#fe9d00] border border-[#fe9d00]/20 py-1.5 px-3 rounded-full transition-colors inline-flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3 text-[#fe9d00]" />
                <span>{lang === 'pt-BR' ? 'Sommelier VIP' : 'Human VIP'}</span>
              </button>
            </div>
          </div>

          {/* Form Text Input Bar */}
          <form
            id="chat-concierge-form"
            onSubmit={handleSendMessage}
            className="p-3 border-t border-neutral-900 bg-neutral-950 shrink-0 flex items-center space-x-2"
          >
            <input
              id="chat-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeholder}
              className="flex-1 bg-[#121212] border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe9d00] transition-colors"
            />
            <button
              id="send-chat-message-btn"
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#fe9d00] hover:bg-[#ff5d00] active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none text-black transition-all"
            >
              <Send className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
