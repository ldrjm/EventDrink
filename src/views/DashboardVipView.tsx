import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Download, 
  Wine, 
  Heart, 
  MessageSquare, 
  Video, 
  BookOpen, 
  TrendingUp, 
  User, 
  Cpu,
  Bookmark,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';

interface DashboardVipViewProps {
  controller: AppControllerType;
}

export default function DashboardVipView({ controller }: DashboardVipViewProps) {
  const {
    lang,
    currentUser,
    setActiveTab,
    triggerToast,
    filteredDrinks
  } = controller;

  const isPt = lang === 'pt-BR';

  // State for premium recipe generator AI simulator
  const [promptInput, setPromptInput] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const vipRecipes = controller.courses.slice(0, 3).map((course) => ({
    title: course.title,
    desc: course.desc,
    img: course.img,
    difficulty: isPt ? course.difficulty : course.difficulty,
    time: course.duration
  }));

  const vipVideos = controller.courses.slice(0, 2).map((course) => ({
    title: course.title,
    author: course.author,
    duration: course.duration,
    img: course.img
  }));

  const vipDownloads = controller.downloads.slice(0, 3).map((download) => ({
    title: download.title,
    size: download.size,
    type: download.type
  }));

  const hasVipContent = vipRecipes.length > 0 || vipVideos.length > 0 || vipDownloads.length > 0;

  // Simulated personal favorites list
  const personalFavorites = filteredDrinks.slice(1, 4);

  // Simulator handler for VIP AI Premium
  const handleAiPremiumSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsAiLoading(false);
      const isBr = lang === 'pt-BR';
      if (promptInput.toLowerCase().includes('morango') || promptInput.toLowerCase().includes('strawberry') || promptInput.toLowerCase().includes('doce') || promptInput.toLowerCase().includes('sweet')) {
        setAiResponse(isBr 
          ? `### ✨ Cocktail Sugerido: *Strawberry Royal Velvet*

*   **Ingredientes:** 50ml Vodka Premium, 25ml Licor de Frutas Vermelhas, 15ml Xarope de Morango Artesanal, 10ml Sumo de Limão Siciliano.
*   **Guarnição:** Morangos macerados e açúcar cristalizado dourado na borda.
*   **Apresentação:** Servido em taça Coupe gelada com gelo esculpido redondo.`
          : `### ✨ Suggested Cocktail: *Strawberry Royal Velvet*

*   **Ingredients:** 50ml Premium Vodka, 25ml Wild Berries Liqueur, 15ml Handcrafted Strawberry Nectar, 10ml Organic Lemon Juice.
*   **Garnish:** Macerated strawberries and gold-dusted sugar rim.
*   **Glassware:** Served in a chilled Coupe glass with hand-carved spherical ice.`
        );
      } else {
        setAiResponse(isBr
          ? `### 🥃 Cocktail Sugerido: *Elite Amber Negroni*

*   **Ingredientes:** 30ml Gin Envelhecido em Carvalho, 30ml Amaro Exclusivo, 30ml Vermute Branco Doce, 2 gotas de Bitter de Laranja.
*   **Guarnição:** Casca de laranja torcida levemente caramelizada.
*   **Apresentação:** Servido em copo baixo com cubo único de gelo transparente.`
          : `### 🥃 Suggested Cocktail: *Elite Amber Negroni*

*   **Ingredients:** 30ml Oak-Aged Craft Gin, 30ml Premium Amaro, 30ml Sweet White Vermouth, 2 drops of Orange Bitters.
*   **Garnish:** Lightly caramelized twisted orange peel.
*   **Glassware:** Rock glass with a single crystal-clear custom cube.`
        );
      }
      triggerToast(isBr ? 'Fórmula exclusiva gerada com sucesso!' : 'Exclusive VIP formula generated!');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-left"
    >
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1409] via-[#141414] to-[#0a0a0a] border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute right-[-40px] top-[-40px] w-56 h-56 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-1 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[10px] font-mono font-black tracking-widest text-amber-400 uppercase">
              {isPt ? 'MEMBRO VIP EXCLUSIVO' : 'VIP EXCLUSIVE MEMBER'}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans mt-2">
            {isPt ? 'Olá, Anfitrião VIP' : 'Hello, VIP Host'} {currentUser?.name ? currentUser.name.split(' ')[0] : ''}! ✨
          </h1>
          <p className="text-neutral-300 text-sm max-w-2xl leading-relaxed">
            {isPt 
              ? 'Seu acesso premium garante receitas autorais exclusivas, masterclasses com bartenders renomados e downloads ilimitados de ferramentas de mixologia.'
              : 'Your premium license unlocks exclusive craft recipes, masterclasses with renowned mixologists, and unlimited professional tool downloads.'
            }
          </p>
        </div>
      </div>

      {/* 2. Quick Actions Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          id="vip-tab-shortcut-recipes"
          onClick={() => setActiveTab('premium-recipes')}
          className="bg-neutral-950 border border-neutral-900 hover:border-amber-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-1 cursor-pointer space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Wine className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white tracking-tight">{isPt ? 'Receitas Premium' : 'Premium Recipes'}</p>
          <p className="text-[10px] text-neutral-500">{isPt ? 'Acessar Catálogo' : 'Access Catalog'}</p>
        </button>

        <button 
          id="vip-tab-shortcut-videos"
          onClick={() => setActiveTab('premium-videos')}
          className="bg-neutral-950 border border-neutral-900 hover:border-amber-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-1 cursor-pointer space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Video className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white tracking-tight">{isPt ? 'Vídeos & Aulas' : 'Video Classes'}</p>
          <p className="text-[10px] text-neutral-500">{isPt ? 'Assistir Agora' : 'Watch Now'}</p>
        </button>

        <button 
          id="vip-tab-shortcut-downloads"
          onClick={() => setActiveTab('downloads')}
          className="bg-neutral-950 border border-neutral-900 hover:border-amber-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-1 cursor-pointer space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white tracking-tight">{isPt ? 'Downloads PDFs' : 'PDF Downloads'}</p>
          <p className="text-[10px] text-neutral-500">{isPt ? 'Baixar Arquivos' : 'Download Files'}</p>
        </button>

        <button 
          id="vip-tab-shortcut-club"
          onClick={() => setActiveTab('vip-club')}
          className="bg-neutral-950 border border-neutral-900 hover:border-amber-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-1 cursor-pointer space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white tracking-tight">{isPt ? 'Clube Event Drink' : 'Vip Club Portal'}</p>
          <p className="text-[10px] text-neutral-500">{isPt ? 'Ver Benefícios' : 'View Benefits'}</p>
        </button>
      </div>

      {/* 3. Receitas Premium Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Wine className="w-5 h-5 text-amber-400" />
            {isPt ? 'Receitas Premium Exclusivas' : 'Exclusive Premium Recipes'}
          </h3>
          <button 
            id="vip-view-all-recipes-btn"
            onClick={() => setActiveTab('premium-recipes')}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
          >
            {isPt ? 'Ver todas' : 'View all'} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vipRecipes.length > 0 ? vipRecipes.map((recipe, idx) => (
            <div key={idx} className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden group hover:border-amber-500/20 transition-all flex flex-col justify-between">
              <div>
                <div className="aspect-video w-full overflow-hidden relative bg-neutral-900">
                  <SafeImage src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" category="spirits" />
                  <span className="absolute top-3 left-3 bg-[#fe9d00] text-black font-black text-[9px] font-mono tracking-widest px-2 py-0.5 rounded uppercase">
                    VIP GOLD
                  </span>
                </div>
                <div className="p-5 text-left space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 font-bold uppercase">
                    <span>{recipe.difficulty}</span>
                    <span>•</span>
                    <span>{recipe.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{recipe.title}</h4>
                  <p className="text-xs text-neutral-450 leading-relaxed truncate">{recipe.desc}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  id={`vip-dash-view-recipe-${idx}`}
                  onClick={() => triggerToast(isPt ? `Detalhes de "${recipe.title}" carregados!` : `"${recipe.title}" recipe details initialized!`)}
                  className="w-full flex items-center justify-center space-x-2 bg-neutral-900 border border-neutral-850 hover:border-amber-500/30 hover:bg-neutral-850 transition-all text-neutral-300 font-bold py-2 rounded-xl text-[10px] uppercase cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isPt ? 'Ver Passo a Passo' : 'View Step-by-Step'}</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="md:col-span-3 rounded-2xl border border-dashed border-neutral-800 bg-black/30 p-6 text-center text-xs text-neutral-500">
              {isPt ? 'Nenhum dado disponível' : 'No data available'}
            </div>
          )}
        </div>
      </div>

      {/* 4. IA Premium Generative Simulator & Favoritos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Generative AI Premium Console */}
        <div className="lg:col-span-7 bg-[#121212] border border-amber-500/15 rounded-3xl p-6 hover:border-amber-500/25 transition-colors flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{isPt ? 'IA Premium Mixologia' : 'Generative VIP Mixologist'}</h3>
                  <p className="text-[10px] text-neutral-500 font-mono uppercase">{isPt ? 'Cérebro Artificial Integrado' : 'AI Powered Mixology Core'}</p>
                </div>
              </div>
              <span className="bg-[#a2d729]/10 text-[#a2d729] text-[9px] font-mono px-2 py-0.5 rounded-full border border-[#a2d729]/20 uppercase">
                {isPt ? 'Ativo' : 'Online'}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              {isPt 
                ? 'Insira um sabor ou ingrediente específico de sua preferência para que a Inteligência Artificial Premium estruture uma receita exclusiva instantaneamente.'
                : 'Input a desired flavor profile or custom herb/ingredient to generate a unique, balanced recipe crafted by our artificial intelligence.'
              }
            </p>

            <form onSubmit={handleAiPremiumSimulate} className="flex gap-2">
              <input 
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={isPt ? 'Ex: Drink refrescante com gin, morango e toque azedo' : 'e.g., Refreshing gin cocktail with strawberry and a sour twist'}
                className="flex-1 bg-black border border-neutral-800 focus:border-amber-500/40 outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 transition-colors font-sans"
              />
              <button 
                id="vip-ai-prem-generate-btn"
                type="submit"
                disabled={isAiLoading}
                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer select-none flex items-center gap-1.5"
              >
                {isAiLoading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    <span>{isPt ? 'Gerar' : 'Craft'}</span>
                  </>
                )}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {aiResponse && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/55 border border-neutral-850 p-4 rounded-2xl text-xs text-neutral-300 leading-relaxed text-left font-sans space-y-2 overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 text-[#a2d729] font-bold text-[10px] font-mono uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> {isPt ? 'Fórmula Gerada com Sucesso' : 'Bespoke Recipe Complete'}
                  </div>
                  <p className="whitespace-pre-wrap">{aiResponse}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Favoritos (Personal Drink Favorites List) */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-3xl p-6 hover:border-neutral-850 transition-colors flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              {isPt ? 'Seus Favoritos' : 'Saved Favorites'}
            </h3>
            <p className="text-xs text-neutral-550 leading-relaxed">
              {isPt ? 'Sua lista personalizada de bebidas marcadas como favoritas para compras rápidas.' : 'Quick shortcuts to drinks you liked in the catalog.'}
            </p>

            <div className="space-y-3">
              {personalFavorites.map((drink) => (
                <div key={drink.id} className="bg-[#121212] border border-neutral-900 rounded-2xl p-3 flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 overflow-hidden shrink-0">
                      <SafeImage src={drink.imageUrl} alt={drink.namePt} className="w-full h-full object-cover" category="spirits" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">{isPt ? drink.namePt : drink.nameEn}</p>
                      <p className="text-[9px] text-neutral-500 font-mono uppercase">{isPt ? drink.categoryLabelPt : drink.categoryLabelEn}</p>
                    </div>
                  </div>
                  <button
                    id={`vip-dash-add-fav-${drink.id}`}
                    onClick={() => {
                      controller.handleAddToCart(drink);
                    }}
                    className="p-2 rounded-lg bg-neutral-950 hover:bg-[#fe9d00] hover:text-black border border-neutral-850 text-[#fe9d00] transition-all cursor-pointer flex items-center justify-center"
                    title={isPt ? 'Adicionar ao carrinho' : 'Add to cart'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. Cursos em Vídeo e Downloads side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Videos Masterclasses Column */}
        <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-400" />
              {isPt ? 'Vídeos & Masterclasses VIP' : 'Video Masterclasses'}
            </h3>
            <button 
              id="vip-view-all-videos-btn"
              onClick={() => setActiveTab('premium-videos')}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer font-mono"
            >
              {isPt ? 'Ver todos' : 'View all'}
            </button>
          </div>
          
          <div className="space-y-4">
            {vipVideos.length > 0 ? vipVideos.map((video, idx) => (
              <div key={idx} className="flex space-x-3 bg-black/45 border border-neutral-900 rounded-2xl p-3 group hover:border-amber-500/10 transition-colors">
                <div className="w-24 aspect-video rounded-xl overflow-hidden relative shrink-0 bg-neutral-900">
                  <SafeImage src={video.img} alt={video.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" category="spirits" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  </div>
                </div>
                <div className="text-left flex flex-col justify-center space-y-1">
                  <h4 className="text-xs font-bold text-white leading-snug group-hover:text-amber-400 transition-colors">{video.title}</h4>
                  <p className="text-[10px] text-neutral-500">{video.author} • {video.duration}</p>
                </div>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-neutral-800 bg-black/30 p-4 text-center text-[11px] text-neutral-500">
                {isPt ? 'Nenhum dado disponível' : 'No data available'}
              </div>
            )}
          </div>
        </div>

        {/* Downloads Column */}
        <div className="bg-[#121212] border border-neutral-900 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-amber-400" />
              {isPt ? 'Downloads & PDFs Técnicos' : 'Mixology PDF Assets'}
            </h3>
            <button 
              id="vip-view-all-downloads-btn"
              onClick={() => setActiveTab('downloads')}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer font-mono"
            >
              {isPt ? 'Ver todos' : 'View all'}
            </button>
          </div>

          <div className="space-y-3">
            {vipDownloads.length > 0 ? vipDownloads.map((down, idx) => (
              <div key={idx} className="flex items-center justify-between bg-black/45 border border-neutral-900 rounded-2xl p-3 hover:border-amber-500/10 transition-colors">
                <div className="text-left space-y-0.5 max-w-[70%]">
                  <p className="text-[9px] font-mono text-amber-400 uppercase tracking-wider">{down.type}</p>
                  <p className="text-xs font-bold text-white truncate">{down.title}</p>
                </div>
                <button
                  id={`vip-dash-download-${idx}`}
                  onClick={() => triggerToast(isPt ? `Download do PDF "${down.title}" iniciado!` : `PDF Download for "${down.title}" completed!`)}
                  className="flex items-center space-x-1 bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-850 px-3 py-1.5 rounded-xl text-[10px] font-bold text-amber-400 transition-all cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span className="font-mono">{down.size.split(' ')[0]}</span>
                </button>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-neutral-800 bg-black/30 p-4 text-center text-[11px] text-neutral-500">
                {isPt ? 'Nenhum dado disponível' : 'No data available'}
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
