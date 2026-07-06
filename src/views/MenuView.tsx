import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Minus, 
  Plus,
  Lock,
  Sparkles,
  Heart,
  Star,
  MessageSquare,
  ThumbsUp,
  UserCheck
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';

interface MenuViewProps {
  controller: AppControllerType;
}

export default function MenuView({ controller }: MenuViewProps) {
  const {
    lang,
    currentTranslation,
    currentUser,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    maxPrice,
    setMaxPrice,
    filteredDrinks,
    cart,
    handleRemoveFromCart,
    handleAddToCart,
    triggerToast,
    favorites,
    handleToggleFavorite,
    reviews,
    handleAddReview,
    handleLikeReview,
    handleReplyReview
  } = controller;

  const [showVipModal, setShowVipModal] = useState(false);
  const [selectedVipDrinkName, setSelectedVipDrinkName] = useState('');

  // Estados do Modal de Detalhes e Reviews
  const [selectedDrink, setSelectedDrink] = useState<any | null>(null);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      triggerToast(lang === 'pt-BR' ? 'Por favor, preencha todos os campos.' : 'Please fill all fields.');
      return;
    }
    handleAddReview(selectedDrink.id, reviewName, reviewComment, reviewRating);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
  };

  return (
    <motion.div
      key="menu"
      id="view-menu"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8"
    >
      {/* Header text */}
      <div id="drinks-catalog-header" className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-[#fe9d00] uppercase font-black">
            CURADORIA PREMIUM
          </span>
          <h2 className="text-3xl font-extrabold text-white">
            {currentTranslation.beverageMenu}
          </h2>
          <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
            {currentTranslation.menuDesc}
          </p>
        </div>
      </div>

      {/* Age restriction warning card */}
      <div className="bg-[#120a0a] border border-red-950/40 rounded-2xl p-4 flex items-center space-x-4 text-left">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-extrabold text-xs shrink-0 font-mono">
          +18
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'pt-BR' ? 'Aviso Legal - Restrição de Maioridade' : 'Legal Warning - Age Restriction'}
          </h4>
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
            {lang === 'pt-BR'
              ? 'Este menu contém bebidas alcoólicas. A venda e o consumo de álcool por menores de 18 anos são expressamente proibidos por lei.'
              : 'This catalog contains alcoholic beverages. The sale and consumption of alcohol by individuals under 18 are strictly prohibited by law.'}
          </p>
        </div>
      </div>

      {/* Filter and search parameters */}
      <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-5 md:p-6 space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Fast category tabs */}
          <div id="category-selector" className="flex flex-wrap gap-2 text-left">
            <motion.button
              id="filter-cat-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'all' 
                  ? 'bg-[#fe9d00] text-black shadow-[0_4px_12px_rgba(254,157,0,0.25)] font-bold' 
                  : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              {currentTranslation.all}
            </motion.button>
            <motion.button
              id="filter-cat-beers"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('beers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'beers' 
                  ? 'bg-[#fe9d00] text-black shadow-[0_4px_12px_rgba(254,157,0,0.25)] font-bold' 
                  : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              {currentTranslation.beers}
            </motion.button>
            <motion.button
              id="filter-cat-wines"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('wines')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'wines' 
                  ? 'bg-[#fe9d00] text-black shadow-[0_4px_12px_rgba(254,157,0,0.25)] font-bold' 
                  : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              {currentTranslation.wines}
            </motion.button>
            <motion.button
              id="filter-cat-spirits"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('spirits')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'spirits' 
                  ? 'bg-[#fe9d00] text-black shadow-[0_4px_12px_rgba(254,157,0,0.25)] font-bold' 
                  : 'bg-neutral-950 text-neutral-404 hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              {currentTranslation.spirits}
            </motion.button>
            <motion.button
              id="filter-cat-non-alcohols"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory('non_alcoholic')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'non_alcoholic' 
                  ? 'bg-[#fe9d00] text-black shadow-[0_4px_12px_rgba(254,157,0,0.25)] font-bold' 
                  : 'bg-neutral-950 text-neutral-404 hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              {currentTranslation.nonAlcoholic}
            </motion.button>
          </div>

          {/* Live Search text input field */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              id="search-drinks-input"
              type="text"
              placeholder={currentTranslation.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#fe9d00] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Range dynamic price filtering */}
        <div className="pt-2 border-t border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold text-neutral-400">
              {currentTranslation.priceRange}: 
            </span>
            <span className="text-xs font-mono font-black text-[#a2d729] bg-[#a2d729]/10 px-2 py-0.5 rounded">
              Até R$ {maxPrice}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <span className="text-[10px] font-mono text-neutral-500">R$ 5</span>
            <input 
              id="price-range-slider"
              type="range"
              min="5"
              max="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="flex-1 accent-[#fe9d00] bg-neutral-800 rounded-lg appearance-none h-1.5 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-neutral-500">R$ 250</span>
          </div>

          {(selectedCategory !== 'all' || searchQuery || maxPrice < 250) && (
            <button
              id="clear-all-filters-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setMaxPrice(250);
                triggerToast(lang === 'pt-BR' ? 'Filtros reajustados!' : 'Filters reset!');
              }}
              className="text-xs text-[#fe9d00] hover:underline font-semibold cursor-pointer"
            >
              {currentTranslation.clearFilters}
            </button>
          )}
        </div>

      </div>

      {/* Grid of interactive cards with exact HTML contextual direct images */}
      <div id="drinks-catalog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrinks.map((drink) => {
          const isVipExclusive = drink.price >= 69.00;
          const isLockedForGuest = !currentUser?.isLoggedIn && isVipExclusive;
          const isFavorited = favorites.includes(drink.id);

          const handleAddClick = (d: typeof drink) => {
            if (isLockedForGuest) {
              setSelectedVipDrinkName(lang === 'pt-BR' ? d.namePt : d.nameEn);
              setShowVipModal(true);
            } else {
              handleAddToCart(d);
            }
          };

          const drinkReviews = reviews.filter(r => r.drinkId === drink.id);
          const avgStars = drinkReviews.length 
            ? (drinkReviews.reduce((sum, r) => sum + r.rating, 0) / drinkReviews.length).toFixed(1)
            : '4.8';

          return (
            <motion.div
              key={drink.id}
              id={`drink-card-${drink.id}`}
              whileHover={{ y: -5, borderColor: isLockedForGuest ? '#d97706' : '#fe9d00', boxShadow: '0 10px 30px -10px rgba(254,157,0,0.15)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`group bg-[#121212]/50 backdrop-blur-md border transition-all rounded-3xl p-5 text-left relative overflow-hidden flex flex-col justify-between space-y-4 ${
                isLockedForGuest ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-neutral-800/80 hover:bg-[#161616]/60'
              }`}
            >
              {/* Image Frame Container */}
              <div 
                className="relative aspect-video rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-900 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedDrink(drink)}
              >
                <SafeImage 
                  src={drink.imageUrl} 
                  alt={lang === 'pt-BR' ? drink.namePt : drink.nameEn} 
                  category={drink.category}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isLockedForGuest ? 'filter grayscale brightness-[0.70]' : ''}`}
                />
                
                {/* VIP badge watermark */}
                {isLockedForGuest ? (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1 z-10 shadow-lg shadow-amber-500/20">
                    <Lock className="w-2.5 h-2.5" />
                    <span>VIP EXQUISITE</span>
                  </div>
                ) : (
                  drink.recommendedPt && (
                    <div className="absolute bottom-3 left-3 bg-[#a2d729] text-black text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded uppercase">
                      {lang === 'pt-BR' ? drink.recommendedPt.toUpperCase() : drink.recommendedEn?.toUpperCase()}
                    </div>
                  )
                )}

                {/* Rating floating tag */}
                <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold px-2 py-1 rounded-full text-[#fe9d00] border border-neutral-800 flex items-center space-x-1">
                  <span>★ {avgStars}</span>
                  <span className="text-[9px] text-neutral-500">({drinkReviews.length || 3})</span>
                </div>
              </div>

              {/* Info & pricing */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                  {lang === 'pt-BR' ? drink.categoryLabelPt : drink.categoryLabelEn}
                </span>
                <h4 
                  className="text-base font-bold text-white tracking-tight group-hover:text-[#fe9d00] transition-colors flex items-center gap-1.5 cursor-pointer"
                  onClick={() => setSelectedDrink(drink)}
                >
                  <span className="truncate">{lang === 'pt-BR' ? drink.namePt : drink.nameEn}</span>
                  {isLockedForGuest && <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                </h4>
                <p className="text-xs text-neutral-400 font-mono">
                  {lang === 'pt-BR' ? drink.unitPt : drink.unitEn}
                </p>
                {/* Stock Level Warning */}
                {drink.stockQuantity !== undefined && (
                  <div className="flex items-center space-x-1.5 pt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${drink.stockQuantity <= 10 ? 'bg-amber-500 animate-pulse' : 'bg-[#a2d729]'}`} />
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      {lang === 'pt-BR' ? `Estoque: ${drink.stockQuantity} un` : `Stock: ${drink.stockQuantity} units`}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-900/65 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-neutral-500 block">RECON</span>
                  <span className="text-base font-black font-mono text-[#a2d729]">
                    R$ {drink.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Toggler de Favoritos */}
                  <button
                    onClick={() => handleToggleFavorite(drink.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isFavorited 
                        ? 'bg-red-500/10 border-red-500/40 text-red-500' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-red-400 hover:border-neutral-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
                  </button>

                  {/* Cart controls */}
                  {cart[drink.id] ? (
                    <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
                      <button
                        id={`remove-qty-${drink.id}`}
                        onClick={() => handleRemoveFromCart(drink.id)}
                        className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1.5 font-mono text-xs font-bold text-white">
                        {cart[drink.id]}
                      </span>
                      <button
                        id={`add-qty-${drink.id}`}
                        onClick={() => handleAddClick(drink)}
                        className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      id={`add-to-cart-btn-${drink.id}`}
                      onClick={() => handleAddClick(drink)}
                      className={`text-xs font-semibold py-2 px-4 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                        isLockedForGuest
                          ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/35 hover:border-transparent font-bold'
                          : 'bg-neutral-900 hover:bg-[#fe9d00] hover:text-black border border-neutral-800 hover:border-transparent text-neutral-300'
                      }`}
                    >
                      {isLockedForGuest ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>{lang === 'pt-BR' ? 'Liberar VIP' : 'Unlock VIP'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{lang === 'pt-BR' ? 'Selecionar' : 'Select'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Professional Curation Upsell Combo */}
      <div className="bg-gradient-to-r from-neutral-950 via-[#161616] to-neutral-950 border border-neutral-800 rounded-3xl p-6 flex flex-col lg:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[9px] font-mono tracking-widest text-[#a2d729] bg-[#a2d729]/15 px-3 py-1 rounded-full uppercase font-bold">
            {currentTranslation.expertRecommends}
          </span>
          <h3 className="text-xl font-bold text-white">
            {currentTranslation.upsellTitle}
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            {currentTranslation.upsellDesc}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 shrink-0 font-sans">
          <span className="font-mono text-xs text-neutral-400">PRO COPA</span>
          <div className="text-right">
            <span className="text-[9px] font-mono text-neutral-500 block">KIT ESPECIAL</span>
            <span className="text-lg font-bold text-[#fe9d00] font-mono">R$ 55,00 / un</span>
          </div>
          <button
            id="upsell-accept-btn"
            onClick={() => {
              triggerToast(lang === 'pt-BR' ? 'Combo Especial de Botânicos adicionado!' : 'Special Botanicals Combo added!');
            }}
            className="bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black font-extrabold text-xs py-3 px-5 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
          >
            {currentTranslation.addBoth}
          </button>
        </div>
      </div>

      {/* UPGRADE INCENTIVE MODAL FOR UNLOCKING DRINKS */}
      <AnimatePresence>
        {showVipModal && (
          <div id="drinks-upgrade-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-center text-white"
            >
              <div className="absolute top-[-50px] left-[50%] -translate-x-1/2 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/35 animate-bounce">
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black text-amber-400 tracking-widest uppercase bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {lang === 'pt-BR' ? 'BEBIDA VIP SELECIONADA' : 'VIP EXQUISITE SELECTION'}
                </span>
                <h4 className="text-xl font-extrabold tracking-tight uppercase">
                  {lang === 'pt-BR' ? 'Liberar Linha de Elite' : 'Unlock Elite Line'}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {lang === 'pt-BR' 
                    ? `O rótulo "${selectedVipDrinkName}" é uma seleção de altíssimo padrão, refinada para paladares exigentes. Ative o upgrade VIP gratuito agora para incluir bebidas premium em seu planejamento!`
                    : `The bottle "${selectedVipDrinkName}" is an exquisite, high-end spirit tailored for sophisticated events. Unlock VIP for free to add premium drinks to your list!`}
                </p>
              </div>

              {/* Benefits list */}
              <div className="bg-black/50 border border-neutral-800 rounded-2xl p-4 text-left text-xs space-y-2.5 font-sans">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <span className="text-[#a2d729] font-black">✓</span>
                  <span>{lang === 'pt-BR' ? 'Vinhos Reserva e Destilados de luxo liberados' : 'Unlock all aged reserve wines and high-end scotch spirits'}</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300">
                  <span className="text-[#a2d729] font-black">✓</span>
                  <span>{lang === 'pt-BR' ? 'Criação ilimitada de coquetéis assinados' : 'Unlimited bespoke signature mixes'}</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300">
                  <span className="text-[#a2d729] font-black">✓</span>
                  <span>{lang === 'pt-BR' ? 'Desconto automático de 7% no plano final' : 'Instant 7% off on entire project totals'}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2.5">
                <button
                  id="menu-unlock-vip-btn"
                  onClick={() => {
                    setShowVipModal(false);
                    controller.toggleUserTier();
                    triggerToast(
                      lang === 'pt-BR' 
                        ? 'Upgrade VIP ativado! Aproveite todo o catálogo de luxo!' 
                        : 'VIP Upgrade activated! Enjoy the full high-end collection!'
                    );
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-3 rounded-xl text-black text-xs font-black uppercase tracking-widest hover:brightness-115 transition-all text-center cursor-pointer shadow-lg shadow-amber-500/10 font-sans"
                >
                  {lang === 'pt-BR' ? 'Ativar Versão VIP Grátis ✨' : 'Unlock Free VIP Upgrade ✨'}
                </button>
                <button
                  id="menu-close-modal-btn"
                  onClick={() => setShowVipModal(false)}
                  className="w-full bg-transparent hover:bg-neutral-800 border border-neutral-850 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all text-center cursor-pointer font-sans"
                >
                  {lang === 'pt-BR' ? 'Voltar ao catálogo básico' : 'Back to basic menu'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETALHES DO PRODUTO, FAVORITOS E AVALIAÇÕES INTEGRADO */}
      <AnimatePresence>
        {selectedDrink && (
          <div id="drink-details-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0e0e0e] border border-neutral-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 text-left text-white my-8 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={() => setSelectedDrink(null)}
                className="absolute top-4 right-4 p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual */}
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-900 flex items-center justify-center">
                    <SafeImage 
                      src={selectedDrink.imageUrl} 
                      alt={lang === 'pt-BR' ? selectedDrink.namePt : selectedDrink.nameEn} 
                      category={selectedDrink.category}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">PREÇO UNITÁRIO</p>
                      <span className="text-xl font-black text-[#a2d729] font-mono">
                        R$ {selectedDrink.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleFavorite(selectedDrink.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          favorites.includes(selectedDrink.id) 
                            ? 'bg-red-500/10 border-red-500/40 text-red-500' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(selectedDrink.id) ? 'fill-red-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => {
                          handleAddToCart(selectedDrink);
                          triggerToast(lang === 'pt-BR' ? 'Adicionado ao orçamento!' : 'Added to estimate!');
                        }}
                        className="bg-[#fe9d00] hover:brightness-110 text-black font-extrabold text-xs py-3 px-5 rounded-xl transition-all cursor-pointer"
                      >
                        {lang === 'pt-BR' ? 'Selecionar Bebida' : 'Select Bottle'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Descrição & Dados de Estoque */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#fe9d00] uppercase tracking-widest">
                      {lang === 'pt-BR' ? selectedDrink.categoryLabelPt : selectedDrink.categoryLabelEn}
                    </span>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      {lang === 'pt-BR' ? selectedDrink.namePt : selectedDrink.nameEn}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      {lang === 'pt-BR' 
                        ? 'Insumo de altíssima qualidade homologado para eventos de alto padrão. Garante rendimento linear de consumo e conserva as características ideais em temperatura refrigerada.' 
                        : 'Premium resource cataloged for high-end parties. Assures linear consumption rate and preserves ideal features under cold storage.'}
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-2.5 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                      <span className="text-neutral-500 uppercase">Apresentação:</span>
                      <span className="text-neutral-200">{lang === 'pt-BR' ? selectedDrink.unitPt : selectedDrink.unitEn}</span>
                    </div>
                    {selectedDrink.stockQuantity !== undefined && (
                      <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                        <span className="text-neutral-500 uppercase">Estoque Disponível:</span>
                        <span className={`font-bold ${selectedDrink.stockQuantity <= 10 ? 'text-amber-500' : 'text-[#a2d729]'}`}>
                          {selectedDrink.stockQuantity} un
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                      <span className="text-neutral-500 uppercase">Teor Alcoólico:</span>
                      <span className="text-neutral-200">
                        {selectedDrink.category === 'non_alcoholic' ? '0.0%' : '5.0% - 13.5%'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">Lote Padrão:</span>
                      <span className="text-neutral-200">LOTE-BR-2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção Completa de Avaliações */}
              <div className="border-t border-neutral-800 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider font-mono text-neutral-300">
                    {lang === 'pt-BR' ? 'Avaliações de Clientes' : 'Customer Reviews'}
                  </h4>
                  
                  <span className="text-xs font-mono text-neutral-400">
                    {reviews.filter((r: any) => r.drinkId === selectedDrink.id).length} {lang === 'pt-BR' ? 'avaliações registradas' : 'reviews submitted'}
                  </span>
                </div>

                {/* Comentários Registrados */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                  {reviews.filter((r: any) => r.drinkId === selectedDrink.id).length === 0 ? (
                    <p className="text-xs text-neutral-500 font-sans text-center py-6">
                      {lang === 'pt-BR' 
                        ? 'Nenhuma avaliação para este produto ainda. Seja o primeiro a escrever!' 
                        : 'No reviews found for this product. Be the first to write a comment!'}
                    </p>
                  ) : (
                    reviews
                      .filter((r: any) => r.drinkId === selectedDrink.id)
                      .map((rev: any) => (
                        <div key={rev.id} className="p-4 bg-neutral-950/60 border border-neutral-900 rounded-2xl space-y-3 text-xs text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-[10px] text-amber-500">
                                {rev.userName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="font-bold text-neutral-200">{rev.userName}</h5>
                                <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                              </div>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center space-x-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${i < rev.rating ? 'text-[#fe9d00] fill-[#fe9d00]' : 'text-neutral-800'}`} 
                                />
                              ))}
                            </div>
                          </div>

                          <p className="text-neutral-350 leading-relaxed font-sans">{rev.comment}</p>

                          {/* Likes action */}
                          <div className="flex items-center space-x-4 pt-1">
                            <button
                              type="button"
                              onClick={() => handleLikeReview(rev.id, currentUser?.email || 'guest@client.com')}
                              className="flex items-center space-x-1.5 text-neutral-500 hover:text-amber-500 cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span className="font-mono text-[10px]">{rev.likes || 0}</span>
                            </button>
                          </div>

                          {/* Admin replies block */}
                          {rev.replies && rev.replies.map((reply: any, index: number) => (
                            <div key={index} className="ml-6 mt-3 p-3 bg-red-950/10 border-l-2 border-amber-500 rounded-r-xl space-y-1">
                              <div className="flex items-center space-x-1.5 text-amber-500 font-mono text-[10px] font-bold">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{reply.author}</span>
                                <span className="text-neutral-600">|</span>
                                <span className="text-neutral-500">{reply.date}</span>
                              </div>
                              <p className="text-neutral-400 font-sans text-xs leading-relaxed">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      ))
                  )}
                </div>

                {/* Escrever Nova Avaliação */}
                <form onSubmit={handleReviewSubmit} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-900 space-y-4 text-left">
                  <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-300">
                    {lang === 'pt-BR' ? 'Escrever uma Avaliação' : 'Submit a Review'}
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{lang === 'pt-BR' ? 'Seu Nome' : 'Your Name'}</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Ex: Carlos de Souza"
                        className="w-full bg-[#121212] border border-neutral-850 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{lang === 'pt-BR' ? 'Sua Nota' : 'Rating'}</label>
                      <div className="flex items-center space-x-1 py-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i + 1)}
                            className="p-1 text-neutral-500 hover:text-amber-500 transition-colors cursor-pointer"
                          >
                            <Star className={`w-5 h-5 ${i < reviewRating ? 'text-[#fe9d00] fill-[#fe9d00]' : 'text-neutral-800'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{lang === 'pt-BR' ? 'Seu Comentário' : 'Comment'}</label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={lang === 'pt-BR' ? 'O que achou deste produto?' : 'What did you think about this product?'}
                      rows={3}
                      className="w-full bg-[#121212] border border-neutral-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#fe9d00] hover:brightness-110 text-black font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    {lang === 'pt-BR' ? 'Enviar Avaliação' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
