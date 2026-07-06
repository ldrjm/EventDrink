import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Wine, 
  Users, 
  Plus, 
  Trash2, 
  DollarSign,
  Activity,
  UserCheck,
  CheckSquare
} from 'lucide-react';
import { Language } from '../types';
import { AppControllerType } from '../controllers/AppController';

interface DashboardAdminViewProps {
  lang: Language;
  triggerToast: (msg: string) => void;
  onSetTab?: (tab: any) => void;
  defaultTab?: 'recipes' | 'users' | 'plans' | 'logs';
  controller: AppControllerType;
}

export default function DashboardAdminView({ lang, triggerToast, onSetTab, defaultTab, controller }: DashboardAdminViewProps) {
  const isPt = lang === 'pt-BR';
  const { orders, usersList, availableDrinks } = controller;

  // --- DATABASE INITIALIZATION ---
  const [recipes, setRecipes] = useState<{ id: string; name: string; category: string; price: number }[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_premium_recipes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: 'FREE' | 'VIP' | 'ADMIN'; status: string }[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_users_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Forms states
  const [activeAdminTab, setActiveAdminTab] = useState<'recipes' | 'users'>('recipes');

  useEffect(() => {
    if (defaultTab === 'recipes' || defaultTab === 'users') {
      setActiveAdminTab(defaultTab);
    }
  }, [defaultTab]);

  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeCategory, setNewRecipeCategory] = useState('Spirits');
  const [newRecipePrice, setNewRecipePrice] = useState('35.00');

  useEffect(() => {
    if (recipes.length === 0 && availableDrinks.length > 0) {
      const mapped = availableDrinks.slice(0, 8).map((drink, index) => ({
        id: drink.id || `recipe-${index}`,
        name: drink.namePt || drink.nameEn,
        category: drink.categoryLabelPt || drink.categoryLabelEn,
        price: Number(drink.price || 0)
      }));
      setRecipes(mapped);
    }
  }, [availableDrinks, recipes.length]);

  useEffect(() => {
    if (users.length === 0 && usersList.length > 0) {
      const mapped = usersList.slice(0, 8).map((user, index) => ({
        id: user.id || `user-${index}`,
        name: user.name,
        email: user.email,
        role: (user.role || 'FREE') as 'FREE' | 'VIP' | 'ADMIN',
        status: 'Active'
      }));
      setUsers(mapped);
    }
  }, [usersList, users.length]);

  useEffect(() => {
    localStorage.setItem('eventdrink_premium_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('eventdrink_users_list', JSON.stringify(users));
  }, [users]);

  // CRUD Receitas
  const handleAddRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName.trim()) return;

    const newObj = {
      id: String(Date.now()),
      name: newRecipeName.trim(),
      category: newRecipeCategory,
      price: parseFloat(newRecipePrice) || 25.00
    };

    setRecipes(prev => [...prev, newObj]);
    setNewRecipeName('');
    triggerToast(isPt ? 'Receita premium adicionada com sucesso!' : 'Premium recipe added to db!');
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    triggerToast(isPt ? 'Receita removida com sucesso!' : 'Recipe deleted from db!');
  };

  // CRUD User roles
  const handleToggleUserRole = (userId: string) => {
    setUsers(prev => 
      prev.map(u => {
        if (u.id === userId) {
          const roles: ('FREE' | 'VIP' | 'ADMIN')[] = ['FREE', 'VIP', 'ADMIN'];
          const currentIndex = roles.indexOf(u.role);
          const nextIndex = (currentIndex + 1) % roles.length;
          const nextRole = roles[nextIndex];
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
    triggerToast(isPt ? 'Nível de privilégio do usuário alterado!' : 'User security permissions modified!');
  };

  const totalRevenueVal = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const displayRecipes = recipes.length > 0 ? recipes : availableDrinks.slice(0, 8).map((drink, index) => ({
    id: drink.id || `recipe-${index}`,
    name: drink.namePt || drink.nameEn,
    category: drink.categoryLabelPt || drink.categoryLabelEn,
    price: Number(drink.price || 0)
  }));
  const displayUsers = users.length > 0 ? users : usersList.slice(0, 8).map((user, index) => ({
    id: user.id || `user-${index}`,
    name: user.name,
    email: user.email,
    role: (user.role || 'FREE') as 'FREE' | 'VIP' | 'ADMIN',
    status: 'Active'
  }));
  const hasData = totalRevenueVal > 0 || displayUsers.length > 0 || displayRecipes.length > 0 || orders.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left font-sans text-neutral-200"
    >
      {/* 1. Header Admin banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-red-950/20 via-[#180f0d] to-neutral-950 border border-red-500/25 relative overflow-hidden">
        <div className="absolute right-[-10px] top-[-10px] w-36 h-36 rounded-full bg-red-500/5 blur-[50px] pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-bold tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full uppercase">
              CONSOLE CENTRAL ADMINISTRAÇÃO
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              {isPt ? 'Bem-vindo, Administrador' : 'Welcome Administrator'}
            </h1>
            <p className="text-xs text-neutral-450 max-w-3xl leading-relaxed">
              {isPt 
                ? 'Painel de controle total para gerenciar o ecossistema EventDrink: faturamento real, privilégios de usuários e catálogo de receitas premium.' 
                : 'Complete ecosystem dashboard to oversee real finances, host profiles, and recipe additions.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Faturamento */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-2">
          <p className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Faturamento Total' : 'Total Revenue'}</p>
          <div className="flex items-center space-x-1.5">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="text-2xl font-black text-white font-mono">
              R$ {totalRevenueVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[9px] text-[#a2d729] font-bold">{hasData ? (isPt ? 'Receita ativa real' : 'Real active cash') : (isPt ? 'Nenhum dado disponível' : 'No data available')}</span>
        </div>

        {/* Usuários Cadastrados */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-2">
          <p className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Usuários Cadastrados' : 'Registered Users'}</p>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-black text-white font-mono">
              {users.length}
            </span>
          </div>
          <span className="text-[9px] text-blue-400 font-bold">{displayUsers.length > 0 ? (isPt ? 'Contas ativas' : 'Active accounts') : (isPt ? 'Nenhum dado disponível' : 'No data available')}</span>
        </div>

        {/* Receitas Premium */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-2">
          <p className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Receitas Premium' : 'Premium Recipes'}</p>
          <div className="flex items-center space-x-2">
            <Wine className="w-5 h-5 text-amber-400" />
            <span className="text-2xl font-black text-white font-mono">
              {recipes.length}
            </span>
          </div>
          <span className="text-[9px] text-amber-400 font-bold">{displayRecipes.length > 0 ? (isPt ? 'Fórmulas customizadas' : 'Unique craft databases') : (isPt ? 'Nenhum dado disponível' : 'No data available')}</span>
        </div>

        {/* Total Planned Events */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-2">
          <p className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Eventos Planejados' : 'Planned Events'}</p>
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-red-400" />
            <span className="text-2xl font-black text-white font-mono">
              {orders.length}
            </span>
          </div>
          <span className="text-[9px] text-red-400 font-semibold">{orders.length > 0 ? (isPt ? 'Eventos sob demanda' : 'On-demand simulations') : (isPt ? 'Nenhum dado disponível' : 'No data available')}</span>
        </div>

      </div>

      {/* 3. Main Admin Workspaces Tab Area */}
      <div className="bg-[#141414]/40 border border-neutral-900 rounded-3xl p-6">
        
        {/* Navigation Admin Workspace */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-4 mb-6">
          <button
            id="admin-tab-recipes-btn"
            onClick={() => setActiveAdminTab('recipes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'recipes' 
                ? 'bg-red-500/10 border border-red-500/30 text-white' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            🍹 {isPt ? 'Gerenciar Receitas' : 'Recipes Database'}
          </button>
          
          <button
            id="admin-tab-users-btn"
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeAdminTab === 'users' 
                ? 'bg-red-500/10 border border-red-500/30 text-white' 
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            👥 {isPt ? 'Gerenciar Usuários' : 'User Security Access'}
          </button>
        </div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CRUD RECIPES */}
          {activeAdminTab === 'recipes' && (
            <motion.div
              key="recipes-crud"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Seed Recipes Form */}
                <form onSubmit={handleAddRecipe} className="lg:col-span-5 bg-black/40 border border-neutral-900 rounded-2xl p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white mb-2">{isPt ? 'Cadastrar Nova Receita Premium' : 'Add Premium Cocktail Record'}</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Nome do Drink' : 'Cocktail Title'}</label>
                    <input 
                      type="text"
                      required
                      value={newRecipeName}
                      onChange={(e) => setNewRecipeName(e.target.value)}
                      placeholder="Ex: Clericot de Champagne Rose"
                      className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Categoria' : 'Group'}</label>
                      <select
                        value={newRecipeCategory}
                        onChange={(e) => setNewRecipeCategory(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-3 py-2.5 text-xs text-white"
                      >
                        <option value="Spirits">Spirits</option>
                        <option value="Beers">Beers</option>
                        <option value="Wines">Wines</option>
                        <option value="Non-Alcoholic">Non-Alcoholic</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Preço Sugerido (R$)' : 'Est Price (R$)'}</label>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        value={newRecipePrice}
                        onChange={(e) => setNewRecipePrice(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-red-500/40 outline-none rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    id="admin-submit-recipe-btn"
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isPt ? 'Adicionar ao Banco de Dados' : 'Insert Record'}</span>
                  </button>
                </form>

                {/* Recipes Database Table */}
                <div className="lg:col-span-7 bg-black/20 border border-neutral-900 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-neutral-300">
                      <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
                        <tr>
                          <th className="px-5 py-3">{isPt ? 'Nome' : 'Title'}</th>
                          <th className="px-5 py-3">{isPt ? 'Categoria' : 'Category'}</th>
                          <th className="px-5 py-3">{isPt ? 'Preço' : 'Price'}</th>
                          <th className="px-5 py-3 text-center">{isPt ? 'Ações' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {displayRecipes.map((recipe) => (
                          <tr key={recipe.id} className="hover:bg-neutral-900/40">
                            <td className="px-5 py-3.5 font-bold text-white">{recipe.name}</td>
                            <td className="px-5 py-3.5"><span className="bg-neutral-900 text-neutral-400 font-mono px-2 py-0.5 rounded border border-neutral-850">{recipe.category}</span></td>
                            <td className="px-5 py-3.5 font-mono text-[#a2d729]">R$ {recipe.price.toFixed(2)}</td>
                            <td className="px-5 py-3.5 text-center">
                              <button
                                id={`admin-delete-recipe-${recipe.id}`}
                                onClick={() => handleDeleteRecipe(recipe.id)}
                                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer inline-flex items-center justify-center"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: USER SECURITY ACCESSIBILITY AND PRIVILEGES */}
          {activeAdminTab === 'users' && (
            <motion.div
              key="users-security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-black/20 border border-neutral-900 rounded-2xl overflow-hidden text-left"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
                    <tr>
                      <th className="px-5 py-3 text-left">{isPt ? 'Usuário / Nome' : 'Host / Member'}</th>
                      <th className="px-5 py-3 text-left">{isPt ? 'Email' : 'E-mail'}</th>
                      <th className="px-5 py-3 text-left">{isPt ? 'Função / Nível de Acesso' : 'Security Privilege'}</th>
                      <th className="px-5 py-3 text-center">{isPt ? 'Configuração' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {displayUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-900/40">
                        <td className="px-5 py-3.5 font-bold text-white flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-850 flex items-center justify-center text-[10px] font-mono text-neutral-400">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-neutral-400">{u.email}</td>
                        <td className="px-5 py-3.5">
                          <span className={`font-mono text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border ${
                            u.role === 'ADMIN' 
                              ? 'bg-red-500/15 border-red-500/30 text-red-400' 
                              : u.role === 'VIP' 
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 font-extrabold'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            id={`admin-toggle-user-${u.id}`}
                            onClick={() => handleToggleUserRole(u.id)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-bold tracking-tight text-[10px] transition-all cursor-pointer flex items-center justify-center mx-auto gap-1"
                          >
                            <UserCheck className="w-3 h-3 text-red-400" />
                            <span>{isPt ? 'Mudar Permissão' : 'Swap Role'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </motion.div>
  );
}
