import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wine, Search, Sparkles, BookOpen, Clock, Award, Filter, X, Plus } from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';

interface VipRecipesViewProps {
  controller: AppControllerType;
}

export default function VipRecipesView({ controller }: VipRecipesViewProps) {
  const { lang, triggerToast } = controller;
  const isPt = lang === 'pt-BR';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'classic' | 'modern' | 'avant-garde'>('all');
  const [inspectRecipe, setInspectRecipe] = useState<any | null>(null);

  const translate = {
    pt: {
      title: 'Cartas de Coquetelaria VIP',
      sub: 'Receitas secretas e cocktails autorais elaborados por mixologistas premiados, exclusivos para membros VIP.',
      searchPlaceholder: 'Buscar receita exclusiva...',
      all: 'Todos',
      classic: 'Clássicos Refinados',
      modern: 'Moderna Autoral',
      garde: 'Vanguarda & Defumados',
      inspectTitle: 'Manual de Execução Prescritiva',
      ingredients: 'Ingredientes e Proporções',
      instructions: 'Instruções de Preparo',
      glass: 'Copo Recomendado',
      garnish: 'Guarnição Estética',
      addBudget: 'Adicionar Bebidas ao Orçamento'
    },
    en: {
      title: 'VIP Premium Beverage Cards',
      sub: 'Secret cocktail formulas and bespoke mixology records crafted by master bartenders, exclusive for VIP members.',
      searchPlaceholder: 'Search exclusive recipes...',
      all: 'All',
      classic: 'Refined Classics',
      modern: 'Modern Craft',
      garde: 'Avant-Garde & Smoked',
      inspectTitle: 'Prescriptive Execution Manual',
      ingredients: 'Ingredients & Proportions',
      instructions: 'Preparation Directions',
      glass: 'Glassware Pairing',
      garnish: 'Esthetic Garnish',
      addBudget: 'Add Ingredients to Budget'
    }
  }[isPt ? 'pt' : 'en'];

  const premiumRecipes = controller.courses.map((course, index) => ({
    id: course.id || `vr${index + 1}`,
    title: course.title,
    descPt: course.desc,
    descEn: course.desc,
    category: index % 2 === 0 ? 'avant-garde' : 'classic',
    difficultyPt: course.difficulty,
    difficultyEn: course.difficulty,
    time: course.duration,
    price: 35 + index * 3,
    imageUrl: course.img || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    ingredients: isPt ? ['Ingrediente principal disponível no catálogo do Supabase'] : ['Primary ingredient from Supabase catalog'],
    instructions: isPt ? ['Consulte a descrição do registro no Supabase para preparar.'] : ['Refer to the Supabase record description for preparation.'],
    glass: isPt ? 'Copo padrão' : 'Standard glass',
    garnish: isPt ? 'Guarnição conforme registro' : 'Garnish based on record'
  }));

  const filtered = useMemo(() => {
    return premiumRecipes.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.descPt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.descEn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left font-sans text-neutral-200"
    >
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="bg-[#fe9d00]/10 text-[#fe9d00] text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase border border-[#fe9d00]/20">
            VIP PRIVATE COLLECTION
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">{translate.title}</h1>
        <p className="text-xs text-neutral-450 max-w-2xl leading-relaxed">{translate.sub}</p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950 p-4 rounded-2xl border border-neutral-900">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-600 absolute left-3.5 top-[50%] -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translate.searchPlaceholder}
            className="w-full bg-black border border-neutral-900 focus:border-amber-500/40 outline-none rounded-xl pl-10 pr-4 py-2 text-xs text-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap w-full sm:w-auto">
          {[
            { id: 'all', label: translate.all },
            { id: 'classic', label: translate.classic },
            { id: 'modern', label: translate.modern },
            { id: 'avant-garde', label: translate.garde }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight transition-colors cursor-pointer ${
                selectedCategory === cat.id 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of VIP Recipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? filtered.map((r) => (
          <div key={r.id} className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden group hover:border-amber-500/15 transition-all flex flex-col justify-between">
            <div>
              <div className="aspect-video w-full overflow-hidden relative bg-neutral-900">
                <SafeImage src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" category="spirits" />
                <span className="absolute top-3 left-3 bg-[#fe9d00] text-black font-extrabold text-[9px] font-mono tracking-widest px-2 py-0.5 rounded uppercase">
                  VIP EXCLUSIVE
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase font-bold">
                  <span className="text-amber-400">{isPt ? r.difficultyPt : r.difficultyEn}</span>
                  <span>{r.time}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-all">{r.title}</h3>
                <p className="text-xs text-neutral-450 leading-relaxed line-clamp-2">
                  {isPt ? r.descPt : r.descEn}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                id={`inspect-recipe-btn-${r.id}`}
                onClick={() => setInspectRecipe(r)}
                className="w-full bg-neutral-900 hover:bg-amber-500 hover:text-black border border-neutral-850 transition-all font-bold text-[10px] uppercase py-2.5 rounded-xl cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isPt ? 'Manual de Preparo' : 'Preparation Guide'}</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="md:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-neutral-800 bg-black/30 p-6 text-center text-xs text-neutral-500">
            {isPt ? 'Nenhum dado disponível' : 'No data available'}
          </div>
        )}
      </div>

      {/* INSPECT MODAL FOR STEP-BY-STEP PREPARATION */}
      <AnimatePresence>
        {inspectRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectRecipe(null)}
              className="absolute inset-0 bg-black/85"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#121212] border border-amber-500/20 max-w-2xl w-full rounded-3xl overflow-hidden relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="aspect-video w-full relative bg-neutral-900">
                <SafeImage src={inspectRecipe.imageUrl} alt={inspectRecipe.title} className="w-full h-full object-cover" category="spirits" />
                <button
                  id="close-inspect-recipe-btn"
                  onClick={() => setInspectRecipe(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121212] to-transparent p-6 pt-16">
                  <span className="bg-amber-500 text-black text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded uppercase">VIP STANDARD FORMULA</span>
                  <h3 className="text-xl font-extrabold text-white mt-2">{inspectRecipe.title}</h3>
                </div>
              </div>

              <div className="p-6 space-y-6 text-left">
                <div className="grid grid-cols-2 gap-4 border-b border-neutral-900 pb-4">
                  <div>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase">{translate.glass}</p>
                    <p className="text-xs font-bold text-neutral-300 mt-1">{inspectRecipe.glass}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase">{translate.garnish}</p>
                    <p className="text-xs font-bold text-neutral-300 mt-1">{inspectRecipe.garnish}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">📋 {translate.ingredients}</h4>
                  <ul className="space-y-1.5 text-xs text-neutral-300 pl-4 list-disc">
                    {inspectRecipe.ingredients.map((ing: string, i: number) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">✨ {translate.instructions}</h4>
                  <ol className="space-y-2 text-xs text-neutral-400 pl-4 list-decimal leading-relaxed">
                    {inspectRecipe.instructions.map((inst: string, i: number) => (
                      <li key={i} className="pl-1">{inst}</li>
                    ))}
                  </ol>
                </div>

                <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3">
                  <button
                    id={`add-vip-ingr-budget-${inspectRecipe.id}`}
                    onClick={() => {
                      triggerToast(isPt ? 'Ingredientes de coquetel adicionados ao carrinho de orçamento!' : 'VIP recipe ingredients added to shopping cart!');
                      setInspectRecipe(null);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{translate.addBudget}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
