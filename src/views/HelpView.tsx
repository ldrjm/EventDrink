import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppControllerType } from '../controllers/AppController';
import { 
  HelpCircle, 
  Sparkles, 
  Shield, 
  ChevronDown, 
  Settings, 
  Calendar, 
  MessageSquare, 
  Zap, 
  Search, 
  BookOpen, 
  Sliders,
  CloudSun,
  Crown,
  Trash2
} from 'lucide-react';

interface HelpViewProps {
  controller: AppControllerType;
}

interface HelpTopic {
  id: string;
  category: 'planner' | 'ai' | 'tier';
  titlePt: string;
  titleEn: string;
  descPt: string;
  descEn: string;
  icon: React.ReactNode;
}

export default function HelpView({ controller }: HelpViewProps) {
  const { lang, currentTranslation, setIsChatOpen, triggerToast, currentUser } = controller;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'all' | 'planner' | 'ai' | 'tier'>('all');
  const [expandedId, setExpandedId] = React.useState<string | null>('q1');

  const isVip = currentUser?.role === 'VIP' || currentUser?.role === 'ADMIN';

  // Rich FAQ topics mapping current system features
  const faqTopics: HelpTopic[] = [
    {
      id: 'q1',
      category: 'planner',
      icon: <Sliders className="w-4 h-4 text-amber-500" />,
      titlePt: 'Como funciona o cálculo inteligente de bebidas?',
      titleEn: 'How does the smart drink calculation work?',
      descPt: 'Nosso algoritmo avançado cruza a quantidade de convidados (divididos entre consumidores e não-consumidores de álcool), o tipo de evento e a duração em horas. A partir deste cálculo de consumo base por pessoa/hora, aplicamos multiplicadores preventivos baseados no seu plano e preferências de margem.',
      descEn: 'Our advanced algorithm cross-references the guest count (split into drinkers and non-drinkers), event type, and duration in hours. Starting from this base per-person hourly rate, we apply preventative multipliers based on your tier and margin preferences.'
    },
    {
      id: 'q2',
      category: 'tier',
      icon: <Crown className="w-4 h-4 text-yellow-400" />,
      titlePt: 'Qual a diferença entre a conta Grátis e VIP?',
      titleEn: 'What is the difference between Free and VIP accounts?',
      descPt: 'Contas gratuitas possuem margem de segurança travada em 10%, cálculo climático desligado e perfil padrão de consumo. Usuários VIP ganham acesso completo para ajustar margens de segurança (0% a 30%), acionar o Suporte Climático Inteligente, definir o Perfil do Anfitrião (Moderado ou Intenso) e atendimento concierge de prioridade.',
      descEn: 'Free accounts have safety margins locked at 10%, weather adjustments off, and standard host profiles. VIP users unlock custom margins (0% to 30%), Smart Weather Insights, Host consumption profile selection (Moderate vs Intense), and priority concierge assistance.'
    },
    {
      id: 'q3',
      category: 'planner',
      icon: <CloudSun className="w-4 h-4 text-sky-400" />,
      titlePt: 'O que é o "Suporte Climático Inteligente"?',
      titleEn: 'What is "Smart Weather Insights"?',
      descPt: 'É um ajuste preditivo exclusivo para VIPs. Quando ativado nas Configurações, o planejador assume condições climáticas de calor e adiciona +20% de gelo e água mineral preventivamente sobre o volume padrão do evento, evitando falta de insumos refrescantes em dias quentes.',
      descEn: 'An exclusive predictive toggle for VIPs. When enabled in Settings, the planner anticipates high-temperature weather conditions and automatically provisions +20% more ice and bottled water, protecting you against beverage warming in hot climates.'
    },
    {
      id: 'q4',
      category: 'ai',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      titlePt: 'Como funcionam as "Diretivas da IA" no painel de administração?',
      titleEn: 'How do "AI Directives" work in the Admin Panel?',
      descPt: 'Administradores do sistema podem definir regras ou personalidades secretas (como "Falar apenas em rimas" ou "Agir como um pirata"). Quando salvas, essas diretivas modificam em tempo real o tom e as respostas do chat do assistente. Um indicador vermelho de atenção é exibido no topo do chat quando uma diretiva está em vigor.',
      descEn: 'System Administrators can define custom rules or hidden prompt scripts (e.g., "Speak like a pirate" or "Recommend premium gin"). Once saved, these instructions alter the AI response tone instantly. A red visual badge lights up in the chat window to indicate active custom directives.'
    },
    {
      id: 'q5',
      category: 'planner',
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      titlePt: 'Como enviar o plano para compras ou carrinho?',
      titleEn: 'How do I send my plan to the shopping cart?',
      descPt: 'Após rodar o cálculo na aba "Planejador", role a tela de resultados até a seção "Lista de Suprimentos Sugeridos". Você pode adicionar itens individuais ao carrinho clicando no ícone "+" ou enviar o kit completo com um único botão. O carrinho consolidará os volumes para fechamento simulado.',
      descEn: 'Once the calculation finishes in the "Planner" tab, scroll down to "Suggested Supplies List". You can add single items to your cart by clicking the "+" button or send the entire configured package with a single click. The cart aggregates all counts for simulated checkout.'
    },
    {
      id: 'q6',
      category: 'ai',
      icon: <MessageSquare className="w-4 h-4 text-pink-400" />,
      titlePt: 'O assistente do Chat consegue recalcular meu evento diretamente?',
      titleEn: 'Can the Chat assistant recalculate my event directly?',
      descPt: 'Sim! Nosso chatbot está totalmente integrado às APIs de cálculo e banco de dados local. Você pode pedir a ele frases livres como "Ajuste minha festa para 15 pessoas" ou "Gostaria de trocar cervejas por mais destilados", e ele responderá com a análise de consumo sugerida em formato descritivo.',
      descEn: 'Yes! Our chatbot is fully integrated with calculations and local storage APIs. You can ask queries like "Change my party count to 15 guests" or "Can you substitute beer for cocktails?", and the AI will analyze consumption and return detailed descriptive estimates.'
    }
  ];

  // Filtering logic
  const filteredTopics = faqTopics.filter(topic => {
    const title = lang === 'pt-BR' ? topic.titlePt : topic.titleEn;
    const desc = lang === 'pt-BR' ? topic.descPt : topic.descEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || topic.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      key="help"
      id="view-help"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-3xl mx-auto space-y-8 px-4"
    >
      {/* Title */}
      <div className="space-y-1 text-left select-none">
        <span className="text-[10px] font-mono tracking-widest text-[#fe9d00] uppercase font-black">
          {lang === 'pt-BR' ? 'CENTRAL DE CONHECIMENTO' : 'KNOWLEDGE HUB'}
        </span>
        <h2 className="text-3xl font-extrabold text-white font-sans tracking-tight">
          {lang === 'pt-BR' ? 'Como podemos ajudar?' : 'How can we help?'}
        </h2>
        <p className="text-neutral-450 text-sm">
          {lang === 'pt-BR' 
            ? 'Guia interativo para planejar seu bar de eventos com maestria' 
            : 'Interactive guide to plan your event beverages like a professional barman'}
        </p>
      </div>

      {/* Interactive Bento Search Bar */}
      <div className="bg-[#161616]/40 border border-neutral-800/85 rounded-3xl p-4 flex items-center gap-3 backdrop-blur-md">
        <Search className="w-5 h-5 text-neutral-500 shrink-0 ml-1" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'pt-BR' ? 'Pesquise por termos como "clima", "VIP", "diretivas" ou "carrinho"...' : 'Search for terms like "weather", "VIP", "directives" or "cart"...'}
          className="bg-transparent border-none outline-none text-sm text-neutral-200 w-full placeholder-neutral-600 font-sans"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs text-neutral-500 hover:text-neutral-300 font-mono underline cursor-pointer bg-transparent border-none p-0"
          >
            {lang === 'pt-BR' ? 'limpar' : 'clear'}
          </button>
        )}
      </div>

      {/* Quick Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-start">
        {[
          { id: 'all', labelPt: 'Ver Todos', labelEn: 'All Topics', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'planner', labelPt: 'Cálculo & Planejamento', labelEn: 'Drink Calculator', icon: <Sliders className="w-3.5 h-3.5" /> },
          { id: 'ai', labelPt: 'Assistente de IA', labelEn: 'AI Assistant', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'tier', labelPt: 'Planos (Grátis x VIP)', labelEn: 'VIP vs Free', icon: <Crown className="w-3.5 h-3.5" /> },
        ].map(pill => {
          const isActive = activeTab === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveTab(pill.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-amber-500 to-[#fe9d00] text-black shadow-md shadow-amber-500/10' 
                  : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-450 border border-neutral-800/60'
              }`}
            >
              {pill.icon}
              <span>{lang === 'pt-BR' ? pill.labelPt : pill.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion FAQ Area */}
      <div className="bg-[#161616]/40 border border-neutral-800/85 rounded-3xl p-6 md:p-8 space-y-4 backdrop-blur-md">
        {filteredTopics.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto animate-pulse" />
            <p className="text-neutral-400 text-sm font-sans">
              {lang === 'pt-BR' ? 'Nenhum resultado encontrado para sua busca.' : 'No results matching your query found.'}
            </p>
            <p className="text-neutral-550 text-xs font-mono">
              {lang === 'pt-BR' ? 'Tente buscar por palavras-chave mais simples' : 'Try searching with simpler terms'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-900 space-y-3.5">
            {filteredTopics.map((topic, index) => {
              const isExpanded = expandedId === topic.id;
              const title = lang === 'pt-BR' ? topic.titlePt : topic.titleEn;
              const desc = lang === 'pt-BR' ? topic.descPt : topic.descEn;

              return (
                <div 
                  key={topic.id} 
                  className={`pt-3.5 first:pt-0 text-left transition-all duration-250 ${
                    isExpanded ? 'bg-neutral-900/10 rounded-2xl p-4 border border-neutral-800/20' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleExpand(topic.id)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group py-1 border-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-950 border border-neutral-850 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                        {topic.icon}
                      </div>
                      <span className="font-sans font-bold text-white text-sm md:text-base group-hover:text-amber-400 transition-colors">
                        {title}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-amber-500' : 'group-hover:text-neutral-300'
                      }`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-13 pr-4 pt-3 pb-2 text-neutral-400 text-xs md:text-sm leading-relaxed font-sans space-y-3">
                          <p>{desc}</p>
                          <div className="flex items-center gap-2">
                            <span className="bg-neutral-950 text-neutral-500 text-[10px] font-mono px-2 py-0.5 rounded-md border border-neutral-900 capitalize">
                              {topic.category}
                            </span>
                            {topic.category === 'tier' && !isVip && (
                              <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                                ⚡ Upgrade VIP nas Configurações
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Feature Compare Banner (Free vs VIP) */}
      <div className="bg-gradient-to-r from-neutral-950 via-[#131313] to-neutral-950 border border-neutral-850 rounded-3xl p-6 text-left space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-bold text-white font-sans uppercase tracking-wider">
            {lang === 'pt-BR' ? 'Resumo da Tabela de Recursos' : 'Features Matrix'}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="bg-neutral-900/40 p-4 rounded-2xl border border-neutral-850 space-y-2">
            <span className="text-[10px] font-mono font-bold text-neutral-400 block uppercase">
              {lang === 'pt-BR' ? '🛡️ Conta Grátis' : '🛡️ Free Account'}
            </span>
            <ul className="space-y-1.5 text-neutral-400 list-inside list-disc">
              <li>{lang === 'pt-BR' ? 'Margem preventiva fixa de 10%' : 'Fixed 10% safety margin'}</li>
              <li>{lang === 'pt-BR' ? 'Perfil de consumo padrão' : 'Standard consumption profile'}</li>
              <li>{lang === 'pt-BR' ? 'Assistência básica no Chat da IA' : 'Basic Chat Assistant support'}</li>
              <li>{lang === 'pt-BR' ? 'Previsão de clima para gelo inativa' : 'No warm weather ice boost'}</li>
            </ul>
          </div>

          <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20 space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-500 animate-pulse" /> {lang === 'pt-BR' ? '⭐ Conta VIP' : '⭐ VIP Account'}
            </span>
            <ul className="space-y-1.5 text-amber-300 list-inside list-disc">
              <li>{lang === 'pt-BR' ? 'Margens flexíveis: de 0% a 30%' : 'Custom margins: 0% to 30%'}</li>
              <li>{lang === 'pt-BR' ? 'Perfis de consumo customizados' : 'Custom Host profiles'}</li>
              <li>{lang === 'pt-BR' ? 'Suporte Climático (+20% gelo)' : 'Smart Weather Boost (+20% ice)'}</li>
              <li>{lang === 'pt-BR' ? 'Livre de limites e Prioridade VIP' : 'No calculation caps & VIP Priority'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support Card contact */}
      <div className="bg-gradient-to-r from-neutral-900/60 to-[#121212] border border-neutral-800 rounded-3xl p-6 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans">
        <div className="space-y-1">
          <span className="text-xs text-amber-500 font-mono block font-bold">
            {lang === 'pt-BR' ? 'ATENDIMENTO PREMIUM' : 'PREMIUM CONCIERGE'}
          </span>
          <h4 className="text-base font-bold text-white">
            {lang === 'pt-BR' ? 'Dúvida específica? Pergunte ao Assistente de IA' : 'Specific question? Ask the AI Assistant'}
          </h4>
          <p className="text-xs text-neutral-450 font-sans">
            {lang === 'pt-BR' 
              ? 'Abra nossa gaveta flutuante do chat e peça cálculos descritivos, receitas ou harmonizações.' 
              : 'Open our floating chat drawer to receive custom recipes, drink advice, or custom counts.'}
          </p>
        </div>
        <button 
          onClick={() => {
            setIsChatOpen(true);
            triggerToast(lang === 'pt-BR' ? 'Iniciando chat vip com suporte...' : 'Starting VIP support chat...');
          }}
          className="bg-gradient-to-r from-amber-500 to-[#fe9d00] hover:from-amber-600 hover:to-[#ffaa00] text-black font-extrabold text-xs py-3.5 px-6 rounded-2xl shrink-0 cursor-pointer transition-all active:scale-[0.98] w-full md:w-auto text-center"
        >
          {lang === 'pt-BR' ? 'Abrir Chat com IA' : 'Open AI Chat'}
        </button>
      </div>
    </motion.div>
  );
}
