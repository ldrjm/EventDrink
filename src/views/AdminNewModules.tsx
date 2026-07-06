import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Layers,
  Plus,
  Trash2,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  UserCheck,
  Tag,
  Award,
  BookOpen,
  Settings,
  Database,
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  MessageSquare,
  Sparkles,
  DollarSign,
  Heart,
  Eye,
  FileText,
  HelpCircle,
  Check,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Info
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { Language, Drink, PastOrder, StockMovement, Supplier, AuditLog, Coupon, SystemNotification } from '../types';

interface ViewProps {
  lang: Language;
  triggerToast: (msg: string) => void;
  controller: AppControllerType;
}

// -------------------------------------------------------------
// 1. ADMIN STOCK MODULE (CONTROLE DE ESTOQUE)
// -------------------------------------------------------------
export function AdminStockView({ lang, triggerToast, controller }: ViewProps) {
  const isPt = lang === 'pt-BR';
  const { availableDrinks, setAvailableDrinks, stockMovements, setStockMovements } = controller;

  // Form states for new products / stock edits
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  const [namePt, setNamePt] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<'beers' | 'wines' | 'spirits' | 'non_alcoholic'>('beers');
  const [price, setPrice] = useState(10);
  const [purchasePrice, setPurchasePrice] = useState(6);
  const [stockQuantity, setStockQuantity] = useState(50);
  const [minStockQuantity, setMinStockQuantity] = useState(10);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80');
  const [supplier, setSupplier] = useState('Distribuidora Aliança');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [batch, setBatch] = useState('LOTE-001');

  // Adjust stock popup states
  const [adjustingDrink, setAdjustingDrink] = useState<Drink | null>(null);
  const [adjustQty, setAdjustQty] = useState(10);
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');
  const [adjustReason, setAdjustReason] = useState('');

  // Suppliers Database
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_suppliers');
      return saved ? JSON.parse(saved) : [
        { id: 'sup1', name: 'Distribuidora Aliança', contact: 'Roberto', phone: '(11) 98765-4321', email: 'vendas@alianca.com.br' },
        { id: 'sup2', name: 'Adega Real Premium', contact: 'Clara', phone: '(11) 97711-2233', email: 'clara@adegareal.com' },
        { id: 'sup3', name: 'Importadora Vale Verde', contact: 'Jorge', phone: '(21) 98888-9900', email: 'jorge@valeverde.com' }
      ];
    } catch (e) {
      return [];
    }
  });

  // Supplier Form state
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');

  // Search & Filtering
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState<'all' | 'low_stock' | 'expiring'>('all');

  useEffect(() => {
    localStorage.setItem('eventdrink_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Add Product to catalog
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namePt.trim()) return;

    const newDrink: Drink = {
      id: `d_${Date.now()}`,
      namePt: namePt.trim(),
      nameEn: nameEn.trim() || namePt.trim(),
      category,
      categoryLabelPt: category === 'beers' ? 'Cervejas & Chopp' : category === 'wines' ? 'Vinhos & Espumantes' : category === 'spirits' ? 'Destilados & Vodkas' : 'Refrigerantes & Sucos',
      categoryLabelEn: category === 'beers' ? 'Beers & Drafts' : category === 'wines' ? 'Wines & Sparklings' : category === 'spirits' ? 'Spirits & Vodkas' : 'Sodas & Juices',
      price: Number(price),
      purchasePrice: Number(purchasePrice),
      stockQuantity: Number(stockQuantity),
      minStockQuantity: Number(minStockQuantity),
      supplier,
      expiryDate,
      batch,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80',
      inStock: Number(stockQuantity) > 0,
      status: 'active',
      unitPt: 'Unidade',
      unitEn: 'Unit'
    };

    controller.addDrink(newDrink);
    setShowAddForm(false);
    resetForm();

    // Log movement
    const movement: StockMovement = {
      id: `mov_${Date.now()}`,
      drinkId: newDrink.id,
      drinkNamePt: newDrink.namePt,
      quantity: newDrink.stockQuantity || 0,
      type: 'in',
      reasonPt: 'Cadastro inicial de produto',
      reasonEn: 'Initial product registry',
      date: new Date().toISOString(),
      userEmail: controller.currentUser?.email || 'system@eventdrink.local'
    };
    controller.addStockMovement(movement);

    triggerToast(isPt ? 'Produto cadastrado com estoque inicial!' : 'Product registered with initial stock!');
  };

  // Edit Product stock variables
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDrink) return;

    controller.editDrink(editingDrink.id, {
      namePt,
      nameEn: nameEn || namePt,
      category,
      price: Number(price),
      purchasePrice: Number(purchasePrice),
      imageUrl: imageUrl.trim(),
      minStockQuantity: Number(minStockQuantity),
      supplier,
      expiryDate,
      batch
    });

    setEditingDrink(null);
    resetForm();
    triggerToast(isPt ? 'Produto atualizado no estoque!' : 'Product updated in stock!');
  };

  // Adjust stock quantity manual
  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingDrink) return;

    const qtyVal = Number(adjustQty);
    const finalChange = adjustType === 'in' ? qtyVal : -qtyVal;
    const currentQty = adjustingDrink.stockQuantity || 0;
    const nextQty = Math.max(0, currentQty + finalChange);

    controller.editDrink(adjustingDrink.id, {
      stockQuantity: nextQty,
      inStock: nextQty > 0
    });

    const movement: StockMovement = {
      id: `mov_${Date.now()}`,
      drinkId: adjustingDrink.id,
      drinkNamePt: adjustingDrink.namePt,
      quantity: qtyVal,
      type: adjustType,
      reasonPt: adjustReason || (adjustType === 'in' ? 'Entrada manual de estoque' : 'Saída manual de estoque'),
      reasonEn: adjustReason || (adjustType === 'in' ? 'Manual stock entry' : 'Manual stock release'),
      date: new Date().toISOString(),
      userEmail: controller.currentUser?.email || 'system@eventdrink.local'
    };

    controller.addStockMovement(movement);
    setAdjustingDrink(null);
    setAdjustQty(10);
    setAdjustReason('');
    triggerToast(isPt ? 'Movimentação registrada com sucesso!' : 'Movement recorded successfully!');
  };

  // Add Supplier
  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim()) return;

    const newSup: Supplier = {
      id: `sup_${Date.now()}`,
      name: supName.trim(),
      contact: supContact.trim(),
      phone: supPhone.trim(),
      email: supEmail.trim()
    };

    setSuppliers(prev => [...prev, newSup]);
    setShowSupplierForm(false);
    setSupName('');
    setSupContact('');
    setSupPhone('');
    setSupEmail('');
    triggerToast(isPt ? 'Fornecedor cadastrado com sucesso!' : 'Supplier registered!');
  };

  const handleDeleteProduct = (id: string) => {
    const isConfirmed = window.confirm(isPt ? 'Tem certeza que deseja remover este produto do estoque?' : 'Are you sure you want to delete this product?');
    if (isConfirmed) {
      controller.removeDrink(id);
      triggerToast(isPt ? 'Produto removido do catálogo de estoque.' : 'Product removed from stock.');
    }
  };

  const startEdit = (d: Drink) => {
    setEditingDrink(d);
    setNamePt(d.namePt);
    setNameEn(d.nameEn);
    setCategory(d.category);
    setPrice(d.price);
    setPurchasePrice(d.purchasePrice || d.price * 0.6);
    setStockQuantity(d.stockQuantity || 0);
    setMinStockQuantity(d.minStockQuantity || 10);
    setImageUrl(d.imageUrl || 'https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80');
    setSupplier(d.supplier || 'Distribuidora Aliança');
    setExpiryDate(d.expiryDate || '2026-12-31');
    setBatch(d.batch || 'LOTE-001');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setNamePt('');
    setNameEn('');
    setCategory('beers');
    setPrice(10);
    setPurchasePrice(6);
    setStockQuantity(50);
    setMinStockQuantity(10);
    setImageUrl('https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80');
    setSupplier('Distribuidora Aliança');
    setExpiryDate('2026-12-31');
    setBatch('LOTE-001');
  };

  // Filtering list
  const filteredList = useMemo(() => {
    return availableDrinks.filter(d => {
      const matchSearch = d.namePt.toLowerCase().includes(search.toLowerCase()) || d.nameEn.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'all' || d.category === catFilter;

      const currentStock = d.stockQuantity || 0;
      const minStock = d.minStockQuantity || 10;
      const isLowStock = currentStock <= minStock;

      let isExpiring = false;
      if (d.expiryDate) {
        const today = new Date();
        const exp = new Date(d.expiryDate);
        const diffTime = exp.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpiring = diffDays <= 30; // expiring within 30 days
      }

      const matchAlert = alertFilter === 'all' || 
        (alertFilter === 'low_stock' && isLowStock) || 
        (alertFilter === 'expiring' && isExpiring);

      return matchSearch && matchCat && matchAlert;
    });
  }, [availableDrinks, search, catFilter, alertFilter]);

  // Aggregate metrics
  const lowStockCount = availableDrinks.filter(d => (d.stockQuantity || 0) <= (d.minStockQuantity || 10)).length;
  const totalStockItems = availableDrinks.reduce((sum, d) => sum + (d.stockQuantity || 0), 0);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500 animate-pulse" />
            {isPt ? 'Controle de Estoque Inteligente' : 'Intelligent Inventory Control'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isPt ? 'Cadastre e monitore o fluxo de entrada e saída de bebidas com alertas de vencimento e reposição.' : 'Register and monitor the flow of beverage entries/exits with alerts.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              resetForm();
              setEditingDrink(null);
              setShowAddForm(!showAddForm);
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isPt ? 'Cadastrar Produto' : 'Add Product'}</span>
          </button>
          
          <button
            onClick={() => setShowSupplierForm(!showSupplierForm)}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-500" />
            <span>{isPt ? 'Fornecedores' : 'Suppliers'}</span>
          </button>
        </div>
      </div>

      {/* Stock metrics summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Total de Garrafas/Itens' : 'Total Items in Vault'}</p>
            <p className="text-2xl font-black text-white font-mono mt-1">{totalStockItems}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Produtos em Estoque Baixo' : 'Low Stock Items'}</p>
            <p className="text-2xl font-black text-red-400 font-mono mt-1">{lowStockCount}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-500/15 text-red-400 animate-pulse' : 'bg-neutral-900 text-neutral-500'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Fornecedores Ativos' : 'Active Suppliers'}</p>
            <p className="text-2xl font-black text-blue-400 font-mono mt-1">{suppliers.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-[#0e0e0e] border border-neutral-900 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder={isPt ? 'Buscar produto no estoque por nome...' : 'Search product in stock...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141414] border border-neutral-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-all font-sans"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#141414] border border-neutral-850 rounded-xl px-3 py-1">
            <span className="text-[10px] font-mono text-neutral-500">{isPt ? 'Categoria:' : 'Cat:'}</span>
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none"
            >
              <option value="all">{isPt ? 'Todas' : 'All'}</option>
              <option value="beers">{isPt ? 'Cervejas' : 'Beers'}</option>
              <option value="wines">{isPt ? 'Vinhos' : 'Wines'}</option>
              <option value="spirits">{isPt ? 'Destilados' : 'Spirits'}</option>
              <option value="non_alcoholic">{isPt ? 'Sem Álcool' : 'Soft'}</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#141414] border border-neutral-850 rounded-xl px-3 py-1">
            <span className="text-[10px] font-mono text-neutral-500">{isPt ? 'Filtros:' : 'Alerts:'}</span>
            <select
              value={alertFilter}
              onChange={(e) => setAlertFilter(e.target.value as any)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none"
            >
              <option value="all">{isPt ? 'Todos os itens' : 'All items'}</option>
              <option value="low_stock">{isPt ? 'Estoque Baixo ⚠️' : 'Low Stock ⚠️'}</option>
              <option value="expiring">{isPt ? 'Vencendo em 30 dias ⏳' : 'Expiring soon ⏳'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* FORMS */}
      <AnimatePresence>
        {/* 1. PRODUCT ADD / EDIT FORM */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#121212] border border-neutral-850 rounded-2xl p-6 overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-neutral-850 pb-3 mb-4">
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                {editingDrink ? (isPt ? 'Editar Cadastro de Produto' : 'Edit Stock Product') : (isPt ? 'Cadastrar Novo Produto de Estoque' : 'Add New Inventory Product')}
              </h4>
              <button onClick={() => setShowAddForm(false)} className="text-neutral-500 hover:text-white font-bold text-xs uppercase">{isPt ? 'Cancelar' : 'Cancel'}</button>
            </div>

            <form onSubmit={editingDrink ? handleEditProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Nome (Português)' : 'Name (Portuguese)'}</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chopp de Vinho Reserva"
                  value={namePt}
                  onChange={(e) => setNamePt(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Nome (Inglês)' : 'Name (English)'}</label>
                <input
                  type="text"
                  placeholder="Ex: Draft Red Wine Pilsen"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Categoria' : 'Category'}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="beers">{isPt ? 'Cervejas & Chopp' : 'Beers & Drafts'}</option>
                  <option value="wines">{isPt ? 'Vinhos & Espumantes' : 'Wines & Sparklings'}</option>
                  <option value="spirits">{isPt ? 'Destilados & Vodkas' : 'Spirits & Vodkas'}</option>
                  <option value="non_alcoholic">{isPt ? 'Refrigerantes & Sucos' : 'Sodas & Juices'}</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Preço de Compra (Fornecedor)' : 'Purchase Price (Cost)'}</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Preço de Venda (Cliente)' : 'Retail Price (Sale)'}</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Lote / Identificador' : 'Batch / Lot ID'}</label>
                <input
                  type="text"
                  placeholder="LOTE-999"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {!editingDrink && (
                <div className="space-y-1.5 text-left font-mono">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Quantidade Inicial' : 'Initial Stock Quantity'}</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="space-y-1.5 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Estoque Mínimo (Alerta)' : 'Min Quantity Warning'}</label>
                <input
                  type="number"
                  required
                  value={minStockQuantity}
                  onChange={(e) => setMinStockQuantity(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Imagem do Produto (URL)' : 'Product Image URL'}</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Data de Validade' : 'Expiration Date'}</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5 text-left md:col-span-2">
                <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Fornecedor' : 'Supplier Partner'}</label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.contact})</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingDrink ? (isPt ? 'Salvar Edição' : 'Save Product') : (isPt ? 'Salvar no Estoque' : 'Add to Vault')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* 2. SUPPLIERS FORM / VIEW */}
        {showSupplierForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#121212] border border-neutral-850 rounded-2xl p-6 overflow-hidden shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center border-b border-neutral-850 pb-3 mb-2">
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                {isPt ? 'Parceiros Fornecedores de Carga' : 'Supplier Partners Database'}
              </h4>
              <button onClick={() => setShowSupplierForm(false)} className="text-neutral-500 hover:text-white font-bold text-xs uppercase">{isPt ? 'Fechar' : 'Close'}</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form onSubmit={handleAddSupplier} className="lg:col-span-5 bg-black/40 border border-neutral-900 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-white mb-1">➕ {isPt ? 'Registrar Fornecedor' : 'Register Supplier'}</p>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'Nome da Empresa' : 'Company Name'}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Vinícola Valduga"
                    value={supName}
                    onChange={(e) => setSupName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'Contato / Vendedor' : 'Representative'}</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Felipe"
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'Telefone' : 'Phone'}</label>
                    <input
                      type="text"
                      required
                      placeholder="(11) 9999-9999"
                      value={supPhone}
                      onChange={(e) => setSupPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'E-mail' : 'Email'}</label>
                    <input
                      type="email"
                      required
                      placeholder="compras@valduga.com"
                      value={supEmail}
                      onChange={(e) => setSupEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-neutral-900 hover:bg-neutral-850 text-amber-500 font-bold border border-neutral-850 text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  {isPt ? 'Registrar Fornecedor' : 'Save Supplier'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-black/20 border border-neutral-900 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 font-mono text-[9px] text-neutral-500 uppercase">
                    <tr>
                      <th className="px-4 py-2">{isPt ? 'Nome / Contato' : 'Supplier'}</th>
                      <th className="px-4 py-2">{isPt ? 'Telefone' : 'Phone'}</th>
                      <th className="px-4 py-2">{isPt ? 'E-mail' : 'Email'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-300">
                    {suppliers.map(s => (
                      <tr key={s.id} className="hover:bg-neutral-900/30">
                        <td className="px-4 py-3">
                          <p className="font-bold text-white">{s.name}</p>
                          <p className="text-[10px] text-neutral-500">{isPt ? 'Contato:' : 'Contact:'} {s.contact}</p>
                        </td>
                        <td className="px-4 py-3 font-mono">{s.phone}</td>
                        <td className="px-4 py-3 font-mono text-neutral-400">{s.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. STOCK QUANTITY ADJUST POPUP (ENTRADA / SAÍDA) */}
        {adjustingDrink && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-neutral-950 border border-neutral-850 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="border-b border-neutral-900 pb-2">
                <h3 className="text-xs font-mono font-bold uppercase text-amber-500">
                  ⚡ {isPt ? 'Movimentar Estoque Manual' : 'Quick Stock Adjust'}
                </h3>
                <p className="text-sm font-extrabold text-white mt-1 leading-snug">{adjustingDrink.namePt}</p>
                <p className="text-[10px] text-neutral-500 mt-1">{isPt ? `Saldo Atual: ${adjustingDrink.stockQuantity || 0} unid.` : `Current stock: ${adjustingDrink.stockQuantity || 0} pcs`}</p>
              </div>

              <form onSubmit={handleAdjustStock} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setAdjustType('in')}
                    className={`py-3.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      adjustType === 'in' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold' : 'bg-neutral-900/40 border-neutral-850 text-neutral-400'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>{isPt ? 'ENTRADA' : 'INFLOW'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('out')}
                    className={`py-3.5 rounded-xl border text-xs font-bold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      adjustType === 'out' ? 'bg-red-500/10 border-red-500 text-red-400 font-extrabold' : 'bg-neutral-900/40 border-neutral-850 text-neutral-400'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>{isPt ? 'SAÍDA' : 'OUTFLOW'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'Quantidade de Itens' : 'Quantity'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'Motivo / Justificativa' : 'Reason / Reference'}</label>
                  <input
                    type="text"
                    placeholder={isPt ? 'Ex: Carga do fornecedor lote novo' : 'e.g. Supplier delivery shipment'}
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdjustingDrink(null)}
                    className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs rounded-xl"
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl hover:brightness-110"
                  >
                    {isPt ? 'Registrar' : 'Apply'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STOCK VAULT TABLE */}
      <div className="bg-[#121212]/40 border border-neutral-900 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-neutral-950/40 border-b border-neutral-900 flex justify-between items-center">
          <span className="font-mono text-[10px] text-neutral-500 uppercase font-bold">{isPt ? 'Grade de Estoque Ativa' : 'Active Inventory Database'}</span>
          <span className="text-[10px] text-neutral-400 font-mono">{filteredList.length} {isPt ? 'produtos listados' : 'listed items'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-neutral-300">
            <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
              <tr>
                <th className="px-5 py-3 text-left">{isPt ? 'Produto' : 'Drink Name'}</th>
                <th className="px-5 py-3 text-left">{isPt ? 'Validade / Lote' : 'Expiry / Lot'}</th>
                <th className="px-5 py-3 text-left">{isPt ? 'Custo / Venda' : 'Prices (Cost / Retail)'}</th>
                <th className="px-5 py-3 text-left">{isPt ? 'Margem' : 'Margin'}</th>
                <th className="px-5 py-3 text-center">{isPt ? 'Estoque' : 'Stock Status'}</th>
                <th className="px-5 py-3 text-center">{isPt ? 'Ações' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredList.map(drink => {
                const currentStock = drink.stockQuantity || 0;
                const minStock = drink.minStockQuantity || 10;
                const cost = drink.purchasePrice || drink.price * 0.6;
                const retail = drink.price;
                const margin = ((retail - cost) / retail * 100).toFixed(0);

                const isLowStock = currentStock <= minStock;

                let isExpiring = false;
                let daysLeft = 999;
                if (drink.expiryDate) {
                  const today = new Date();
                  const exp = new Date(drink.expiryDate);
                  const diffTime = exp.getTime() - today.getTime();
                  daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  isExpiring = daysLeft <= 30;
                }

                return (
                  <tr key={drink.id} className="hover:bg-neutral-900/20">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white">{drink.namePt}</p>
                      <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">{drink.categoryLabelPt} • Supplier: {drink.supplier || 'N/A'}</p>
                    </td>

                    <td className="px-5 py-3.5 font-mono">
                      <p className={isExpiring ? 'text-red-400 font-bold' : 'text-neutral-400'}>
                        {drink.expiryDate ? new Date(drink.expiryDate).toLocaleDateString() : '—'}
                        {isExpiring && <span className="text-[8px] bg-red-500/10 text-red-500 px-1 py-0.5 rounded ml-1 font-bold">VENCENDO</span>}
                      </p>
                      <p className="text-[10px] text-neutral-500">{drink.batch || '—'}</p>
                    </td>

                    <td className="px-5 py-3.5 font-mono text-xs">
                      <p className="text-neutral-500">{isPt ? 'Custo:' : 'Cost:'} <span className="text-neutral-300">R$ {cost.toFixed(2)}</span></p>
                      <p className="text-neutral-500">{isPt ? 'Venda:' : 'Sale:'} <span className="text-amber-500 font-bold">R$ {retail.toFixed(2)}</span></p>
                    </td>

                    <td className="px-5 py-3.5 font-mono">
                      <span className="text-emerald-400 font-extrabold">{margin}%</span>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <p className={`font-mono font-black text-sm ${isLowStock ? 'text-red-400' : 'text-[#a2d729]'}`}>
                        {currentStock} <span className="text-[10px] text-neutral-500">unid.</span>
                      </p>
                      {isLowStock && (
                        <span className="inline-block mt-0.5 text-[8px] font-mono font-bold bg-red-500/15 border border-red-500/25 text-red-400 px-1 py-0.5 rounded leading-none uppercase">
                          {isPt ? 'Estoque Baixo' : 'Low Stock'}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setAdjustingDrink(drink)}
                          className="px-2 py-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-amber-500 text-[10px] font-bold font-mono hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                        >
                          ⚖️ {isPt ? 'Ajustar' : 'Adjust'}
                        </button>
                        
                        <button
                          onClick={() => startEdit(drink)}
                          className="p-1.5 bg-neutral-900 border border-neutral-850 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(drink.id)}
                          className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. ADMIN ORDERS MANAGEMENT (GESTÃO DE PEDIDOS)
// -------------------------------------------------------------
export function AdminOrdersView({ lang, triggerToast, controller }: ViewProps) {
  const isPt = lang === 'pt-BR';
  const { orders, setOrders, availableDrinks, setAvailableDrinks } = controller;

  const [activeOrder, setActiveOrder] = useState<PastOrder | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>('received');
  const [statusNote, setStatusNote] = useState('');

  // Status mapping
  const statuses = [
    { value: 'received', labelPt: 'Recebido 📩', labelEn: 'Received 📩', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { value: 'analyzing', labelPt: 'Em análise 🔍', labelEn: 'Analyzing 🔍', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { value: 'preparing', labelPt: 'Preparando 🧪', labelEn: 'Preparing 🧪', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { value: 'ready', labelPt: 'Pronto 📦', labelEn: 'Ready 📦', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { value: 'shipped', labelPt: 'Saiu para Entrega 🚚', labelEn: 'Out for Delivery 🚚', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    { value: 'delivered', labelPt: 'Entregue ✅', labelEn: 'Delivered ✅', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { value: 'finalized', labelPt: 'Finalizado 🔒', labelEn: 'Finalized 🔒', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' }
  ];

  // Update Status of an Order
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    const nextStatus = selectedStatus;
    const dateStr = new Date().toLocaleString();

    const notePt = statusNote || `Status do pedido alterado para: ${statuses.find(s => s.value === nextStatus)?.labelPt}`;
    const noteEn = statusNote || `Order status updated to: ${statuses.find(s => s.value === nextStatus)?.labelEn}`;

    const newHistoryNode = {
      status: nextStatus,
      updatedAt: dateStr,
      notePt,
      noteEn
    };

    setOrders(prev => prev.map(o => {
      if (o.id === activeOrder.id) {
        const history = o.statusHistory || [];
        return {
          ...o,
          status: nextStatus,
          statusHistory: [...history, newHistoryNode]
        };
      }
      return o;
    }));

    // Trigger local push notification simulation
    const updatedNotification: SystemNotification = {
      id: `not_${Date.now()}`,
      titlePt: 'Atualização de Pedido',
      titleEn: 'Order Update',
      descPt: `Seu pedido #${activeOrder.id.slice(1, 6)} foi atualizado para: ${statuses.find(s => s.value === nextStatus)?.labelPt}`,
      descEn: `Your order #${activeOrder.id.slice(1, 6)} has been updated to: ${statuses.find(s => s.value === nextStatus)?.labelEn}`,
      date: 'Agora',
      isRead: false,
      type: 'order'
    };
    // Add notification
    const existing = localStorage.getItem('eventdrink_notifications');
    const parsed = existing ? JSON.parse(existing) : [];
    localStorage.setItem('eventdrink_notifications', JSON.stringify([updatedNotification, ...parsed]));

    // Reduce stock automatically on checkout if transitioning to "preparing" or "ready" for the first time
    // This is managed during checkout, but if order status is updated, we can log it
    
    triggerToast(isPt ? `Status do pedido atualizado para: ${nextStatus.toUpperCase()}!` : `Order status updated to ${nextStatus.toUpperCase()}!`);
    setActiveOrder(null);
    setStatusNote('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-[#fe9d00]" />
          {isPt ? 'Painel de Gestão e Despacho de Pedidos' : 'Order Management & Delivery Desk'}
        </h2>
        <p className="text-xs text-neutral-400 font-sans">
          {isPt ? 'Supervise o fluxo logístico dos pedidos em tempo real. Atualize status e envie notificações de progresso aos clientes.' : 'Monitor logistics. Update order status and notify clients instantly.'}
        </p>
      </div>

      <div className="bg-[#121212]/40 border border-neutral-900 rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-neutral-300">
          <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
            <tr>
              <th className="px-5 py-3 text-left">ID / Client</th>
              <th className="px-5 py-3 text-left">{isPt ? 'Data / Endereço' : 'Date / Delivery Address'}</th>
              <th className="px-5 py-3 text-left">{isPt ? 'Método Pagamento' : 'Payment'}</th>
              <th className="px-5 py-3 text-left">{isPt ? 'Total Orçado' : 'Amount'}</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {orders.map(o => {
              const currentStatusNode = statuses.find(s => s.value === o.status) || statuses[0];
              const orderTitle = isPt ? o.namePt : o.nameEn;
              const payment = o.paymentMethod || 'PIX';
              const date = isPt ? o.datePt : o.dateEn;

              return (
                <tr key={o.id} className="hover:bg-neutral-900/20">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white">#{o.id.slice(1, 6)}</p>
                    <p className="text-[10px] text-neutral-500 truncate max-w-[200px]">{orderTitle}</p>
                    {o.userEmail && <p className="text-[9px] text-amber-500 font-mono mt-0.5">{o.userEmail}</p>}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-mono text-neutral-400">{date}</p>
                    <p className="text-[10px] text-neutral-550 truncate max-w-[180px]">{o.address || 'Av. Paulista, 1000, SP'}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-mono bg-neutral-950 text-neutral-400 border border-neutral-900 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{payment}</span>
                  </td>

                  <td className="px-5 py-4 font-mono font-bold text-[#a2d729]">
                    R$ {o.total.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className={`inline-block font-mono font-bold text-[9px] tracking-wider uppercase px-2 py-1 rounded border ${currentStatusNode.color}`}>
                      {isPt ? currentStatusNode.labelPt : currentStatusNode.labelEn}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => {
                        setActiveOrder(o);
                        setSelectedStatus(o.status);
                      }}
                      className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 rounded-lg text-neutral-400 font-bold text-[10px] cursor-pointer"
                    >
                      ⚙️ {isPt ? 'Mudar Status' : 'Edit Status'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* UPDATE STATUS POPUP */}
      <AnimatePresence>
        {activeOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0b] border border-neutral-850 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-left"
            >
              <div className="border-b border-neutral-900 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-amber-500">
                    🚚 {isPt ? 'Atualizar Fluxo do Pedido' : 'Update Order Tracking'}
                  </h3>
                  <p className="text-sm font-extrabold text-white mt-1">Pedido #{activeOrder.id.slice(1, 6)}</p>
                </div>
                <button onClick={() => setActiveOrder(null)} className="text-xs text-neutral-500 uppercase font-bold hover:text-white">{isPt ? 'Fechar' : 'Close'}</button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Novo Estágio / Status' : 'New Stage Status'}</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{isPt ? s.labelPt : s.labelEn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase font-bold">{isPt ? 'Observação / Mensagem de Progresso' : 'Status update text (For user tracking)'}</label>
                  <textarea
                    rows={3}
                    placeholder={isPt ? 'Ex: Pedido embalado e pronto para entrega. Bartenders escalados.' : 'e.g. Items packed and ready. Delivering truck departed.'}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveOrder(null)}
                    className="flex-1 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-850"
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl hover:brightness-110"
                  >
                    {isPt ? 'Salvar Transição' : 'Apply Transition'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// 3. ADMIN DISCOUNT COUPONS (CUPONS DE DESCONTO)
// -------------------------------------------------------------
export function AdminCouponsView({ lang, triggerToast, controller }: ViewProps) {
  const isPt = lang === 'pt-BR';
  const { coupons, setCoupons } = controller;

  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed' | 'free_shipping'>('percent');
  const [value, setValue] = useState(10);
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [minOrderValue, setMinOrderValue] = useState(100);
  const [maxUses, setMaxUses] = useState(100);
  const [maxPerUser, setMaxPerUser] = useState(1);

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `cp_${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      startDate,
      endDate,
      minOrderValue: Number(minOrderValue),
      maxUses: Number(maxUses),
      usedCount: 0,
      maxPerUser: Number(maxPerUser)
    };

    controller.addCoupon(newCoupon);
    setShowForm(false);
    setCode('');
    setValue(10);
    triggerToast(isPt ? `Cupom de desconto "${newCoupon.code}" cadastrado!` : `Promo coupon "${newCoupon.code}" registered!`);
  };

  const handleDeleteCoupon = (id: string) => {
    const isConfirmed = window.confirm(isPt ? 'Deseja excluir este cupom permanentemente?' : 'Are you sure you want to delete this coupon?');
    if (isConfirmed) {
      controller.removeCoupon(id);
      triggerToast(isPt ? 'Cupom de desconto removido.' : 'Promo coupon deleted.');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-400" />
            {isPt ? 'Sistema de Cupons de Desconto' : 'Promo Coupon Management'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isPt ? 'Crie cupons de desconto em percentual, desconto fixo em dinheiro ou frete grátis com regras de uso customizadas.' : 'Create custom coupons: percentage off, fixed amount off, or free shipping.'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-emerald-400 font-extrabold text-xs rounded-xl flex items-center gap-1.5 active:scale-95 hover:bg-neutral-850 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isPt ? 'Criar Cupom' : 'Create Coupon'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#121212] border border-neutral-850 rounded-2xl p-6 overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-neutral-850 pb-3 mb-4">
              <p className="text-xs font-mono font-bold uppercase text-white">{isPt ? 'Novo Cupom Promocional' : 'Add Promotional Coupon'}</p>
              <button onClick={() => setShowForm(false)} className="text-xs text-neutral-500 hover:text-white uppercase font-bold">{isPt ? 'Fechar' : 'Close'}</button>
            </div>

            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Código do Cupom' : 'Coupon Code'}</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: EVENT15"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none uppercase"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Tipo de Benefício' : 'Discount Type'}</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="percent">{isPt ? 'Percentual (%)' : 'Percentage (%)'}</option>
                  <option value="fixed">{isPt ? 'Fixo (R$)' : 'Fixed Cash (R$)'}</option>
                  <option value="free_shipping">{isPt ? 'Frete Grátis 🚚' : 'Free Shipping 🚚'}</option>
                </select>
              </div>

              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Valor do Desconto' : 'Discount Value'}</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Valor Mínimo Pedido' : 'Min Order Price'}</label>
                <input
                  type="number"
                  required
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Data Início' : 'Start Date'}</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Data Término' : 'Expiration Date'}</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Limite de Usos' : 'Max global uses'}</label>
                <input
                  type="number"
                  required
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1 text-left font-mono">
                <label className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Limite por Usuário' : 'Limit per user'}</label>
                <input
                  type="number"
                  required
                  value={maxPerUser}
                  onChange={(e) => setMaxPerUser(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-4 pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 text-black font-extrabold text-xs rounded-xl hover:brightness-110 cursor-pointer"
                >
                  🚀 {isPt ? 'Ativar Cupom' : 'Deploy Coupon'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#121212]/40 border border-neutral-900 rounded-2xl overflow-hidden">
        <table className="w-full text-xs text-neutral-300">
          <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
            <tr>
              <th className="px-5 py-3 text-left">Code</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Value</th>
              <th className="px-5 py-3 text-left">Validity</th>
              <th className="px-5 py-3 text-left">Min Order</th>
              <th className="px-5 py-3 text-center">Uses</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-neutral-900/20">
                <td className="px-5 py-3.5 font-mono font-bold text-white">{c.code}</td>
                <td className="px-5 py-3.5 font-mono text-[10px] uppercase text-neutral-400">
                  {c.type === 'percent' ? (isPt ? 'Percentual' : 'Percentage') : c.type === 'fixed' ? (isPt ? 'Fixo' : 'Fixed') : (isPt ? 'Frete Grátis' : 'Free Ship')}
                </td>
                <td className="px-5 py-3.5 font-mono font-extrabold text-emerald-400">
                  {c.type === 'percent' ? `${c.value}%` : c.type === 'fixed' ? `R$ ${c.value}` : 'FREE'}
                </td>
                <td className="px-5 py-3.5 font-mono text-[10px] text-neutral-400">
                  {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5 font-mono text-neutral-400">
                  R$ {c.minOrderValue}
                </td>
                <td className="px-5 py-3.5 text-center font-mono font-bold text-neutral-300">
                  {c.usedCount} / {c.maxUses}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg cursor-pointer"
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
  );
}

// -------------------------------------------------------------
// 4. ADMIN LOYALTY MODULE (SISTEMA DE FIDELIDADE POR PONTOS)
// -------------------------------------------------------------
export function AdminLoyaltyView({ lang, triggerToast, controller }: ViewProps) {
  const isPt = lang === 'pt-BR';
  const { loyaltyPoints, setLoyaltyPoints, usersList, setUsersList } = controller;

  // Render bronze/silver/gold tiers
  const getTier = (pts: number) => {
    if (pts >= 1000) return { label: 'Diamante 💎', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30' };
    if (pts >= 500) return { label: 'Ouro 🥇', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30 font-extrabold' };
    if (pts >= 200) return { label: 'Prata 🥈', color: 'text-neutral-300 bg-neutral-300/10 border-neutral-300/30' };
    return { label: 'Bronze 🥉', color: 'text-amber-600 bg-amber-600/10 border-amber-600/20' };
  };

  // Adjust user points manually
  const [adjustingUserEmail, setAdjustingUserEmail] = useState<string | null>(null);
  const [adjustPts, setAdjustPts] = useState(100);

  const handleAdjustPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUserEmail) return;

    setLoyaltyPoints(prev => ({
      ...prev,
      [adjustingUserEmail]: Math.max(0, (prev[adjustingUserEmail] || 0) + Number(adjustPts))
    }));

    // Trigger local push notification simulation
    const updatedNotification: SystemNotification = {
      id: `not_${Date.now()}`,
      titlePt: 'Pontos de Fidelidade creditados!',
      titleEn: 'Loyalty Points credited!',
      descPt: `Você recebeu ${adjustPts} pontos de fidelidade EventDrink! Aproveite para trocar por cupons.`,
      descEn: `You received ${adjustPts} EventDrink loyalty points! Use them to redeem coupon rewards.`,
      date: 'Agora',
      isRead: false,
      type: 'loyalty'
    };
    const existing = localStorage.getItem('eventdrink_notifications');
    const parsed = existing ? JSON.parse(existing) : [];
    localStorage.setItem('eventdrink_notifications', JSON.stringify([updatedNotification, ...parsed]));

    triggerToast(isPt ? 'Pontos atualizados com sucesso!' : 'Loyalty points updated!');
    setAdjustingUserEmail(null);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-400 animate-pulse" />
          {isPt ? 'Programa de Fidelidade por Pontos' : 'VIP Loyalty Club Console'}
        </h2>
        <p className="text-xs text-neutral-400">
          {isPt ? 'Monitore o saldo de pontos dos usuários. R$1 em compras = 1 ponto acumulado. Clientes sobem de níveis e resgatam prêmios e benefícios VIP.' : 'Review points. $1 spent = 1 point accumulated. Customers progress through Bronze, Silver, Gold, and Diamond tiers.'}
        </p>
      </div>

      <div className="bg-[#121212]/40 border border-neutral-900 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 bg-neutral-950/40 border-b border-neutral-900 font-mono text-[10px] text-neutral-500 uppercase font-bold">
          {isPt ? 'Tabela Geral de Membros e Tiers' : 'Host Member Loyalty Status'}
        </div>

        <table className="w-full text-xs text-neutral-300">
          <thead className="bg-neutral-950 text-[10px] font-mono text-neutral-500 uppercase border-b border-neutral-900">
            <tr>
              <th className="px-5 py-3 text-left">{isPt ? 'Usuário / Email' : 'Member / Email'}</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">{isPt ? 'Nível Alcançado' : 'Fidelity Tier Level'}</th>
              <th className="px-5 py-3 text-center">{isPt ? 'Saldo Pontos' : 'Points Balance'}</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {usersList.map(u => {
              const points = loyaltyPoints[u.email] !== undefined ? loyaltyPoints[u.email] : 150; // default seed points
              const tier = getTier(points);

              return (
                <tr key={u.id} className="hover:bg-neutral-900/20">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-white">{u.name}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">{u.email}</p>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="text-[10px] bg-neutral-950 border border-neutral-900 text-neutral-400 px-2 py-0.5 rounded font-bold uppercase">{u.role}</span>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className={`inline-block font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border ${tier.color}`}>
                      {tier.label}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-center font-mono font-black text-sm text-yellow-400">
                    🏆 {points} <span className="text-[9px] text-neutral-500 font-normal">pts</span>
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => {
                        setAdjustingUserEmail(u.email);
                        setAdjustPts(100);
                      }}
                      className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-white border border-neutral-800 rounded-lg text-neutral-400 font-bold text-[10px] cursor-pointer"
                    >
                      🎁 {isPt ? 'Dar Pontos' : 'Reward Points'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ADJUST POINTS POPUP */}
      <AnimatePresence>
        {adjustingUserEmail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-neutral-950 border border-neutral-850 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-left"
            >
              <div className="border-b border-neutral-900 pb-2">
                <h3 className="text-xs font-mono font-bold uppercase text-yellow-400">
                  🏆 {isPt ? 'Bonificar Usuário' : 'Award Loyalty Points'}
                </h3>
                <p className="text-xs font-extrabold text-neutral-400 mt-1 truncate">{adjustingUserEmail}</p>
              </div>

              <form onSubmit={handleAdjustPoints} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'Pontos a Adicionar (ou subtrair)' : 'Points Value'}</label>
                  <input
                    type="number"
                    required
                    value={adjustPts}
                    onChange={(e) => setAdjustPts(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdjustingUserEmail(null)}
                    className="flex-1 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-850"
                  >
                    {isPt ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 text-black font-extrabold text-xs rounded-xl hover:brightness-110"
                  >
                    {isPt ? 'Creditado' : 'Apply Award'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// -------------------------------------------------------------
// 5. SYSTEM DIAGNOSTICS & AUDIT LOGS (TELA DE LOGS)
// -------------------------------------------------------------
export function AdminLogsView({ lang, triggerToast, controller }: ViewProps) {
  const isPt = lang === 'pt-BR';
  const { auditLogs } = controller;

  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(l => {
      const logText = isPt ? l.actionPt : l.actionEn;
      return logText.toLowerCase().includes(search.toLowerCase()) || l.userEmail.toLowerCase().includes(search.toLowerCase());
    });
  }, [auditLogs, search, isPt]);

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-red-500 animate-pulse" />
          {isPt ? 'Trilha de Auditoria e Logs de Segurança' : 'Security Audit logs & Access Logs'}
        </h2>
        <p className="text-xs text-neutral-400">
          {isPt ? 'Histórico completo de transações críticas realizadas por operadores, gerentes e clientes no sistema, com log de IP e navegador.' : 'Complete history of login events, database mutations, and checkouts.'}
        </p>
      </div>

      {/* FILTER SEARCH */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder={isPt ? 'Buscar logs por ação ou email do operador...' : 'Search audit records...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#121212]/80 border border-neutral-850 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 transition-all font-sans"
        />
      </div>

      <div className="bg-[#121212]/40 border border-neutral-900 rounded-2xl overflow-hidden font-mono text-[11px]">
        <div className="px-5 py-3.5 bg-neutral-950/40 border-b border-neutral-900 flex justify-between items-center text-[10px] text-neutral-500 uppercase font-bold">
          <span>{isPt ? 'Histórico Geral de Eventos' : 'Audit Trail Logs Stream'}</span>
          <span>{filteredLogs.length} logs</span>
        </div>

        <div className="max-h-[500px] overflow-y-auto divide-y divide-neutral-900 scrollbar-thin">
          {filteredLogs.map(l => (
            <div key={l.id} className="p-4 hover:bg-neutral-900/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-neutral-300">
              <div className="space-y-0.5">
                <p className="text-white font-bold leading-relaxed">{isPt ? l.actionPt : l.actionEn}</p>
                <p className="text-neutral-500 text-[10px]">
                  👤 {l.userEmail} • 🖥️ {l.browser} • 📱 {l.device}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="bg-neutral-950 border border-neutral-900 text-neutral-400 px-2 py-0.5 rounded text-[10px] font-bold">{l.ip}</span>
                <p className="text-[10px] text-neutral-550 mt-1">{l.date} - {l.hour}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. SYSTEM PERFORMANCE & ANALYTICS (ANALYTICS DE USO)
// -------------------------------------------------------------
export function AdminAnalyticsView({ lang, triggerToast }: ViewProps) {
  const isPt = lang === 'pt-BR';

  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');

  // Hardcoded real-looking metrics representing standard active tracking
  const stats = {
    today: {
      views: 1240,
      avgTime: '04m 32s',
      mostVisited: 'Pilsen Premium (355ml)',
      mostBeverage: 'Tinto Seco Reserva',
      devices: { desktop: '62%', mobile: '35%', tablet: '3%' },
      browsers: { chrome: '58%', safari: '25%', edge: '10%', firefox: '7%' },
      conversion: '8.4%',
      revenue: 3450
    },
    week: {
      views: 8900,
      avgTime: '05m 12s',
      mostVisited: 'IPA Artesanal (473ml)',
      mostBeverage: 'Espumante Brut (750ml)',
      devices: { desktop: '58%', mobile: '39%', tablet: '3%' },
      browsers: { chrome: '60%', safari: '22%', edge: '11%', firefox: '7%' },
      conversion: '7.9%',
      revenue: 24200
    },
    month: {
      views: 35200,
      avgTime: '04m 55s',
      mostVisited: 'Gin London Dry Premium',
      mostBeverage: 'Tinto Seco Reserva',
      devices: { desktop: '55%', mobile: '42%', tablet: '3%' },
      browsers: { chrome: '62%', safari: '20%', edge: '11%', firefox: '7%' },
      conversion: '8.1%',
      revenue: 98400
    }
  }[filter];

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            {isPt ? 'Painel Analítico de Conversão e Uso' : 'Customer Analytics & Conversions'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isPt ? 'Métricas de conversão de funil de vendas, dispositivos, navegadores de acesso e tempo médio de permanência na adega.' : 'Analyze sales conversion rates, visit duration, visitor devices, and browsers.'}
          </p>
        </div>

        {/* PERIOD SELECTOR */}
        <div className="flex bg-neutral-950 border border-neutral-900 rounded-full p-1 self-start sm:self-auto">
          {(['today', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3.5 py-1 text-[10px] font-mono font-bold uppercase rounded-full tracking-wider transition-all cursor-pointer ${
                filter === p ? 'bg-[#fe9d00] text-black font-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {p === 'today' ? (isPt ? 'Hoje' : 'Today') : p === 'week' ? (isPt ? 'Semana' : 'Week') : (isPt ? 'Mês' : 'Month')}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC SUMMARIES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Total de Acessos' : 'Total Views'}</p>
          <p className="text-xl font-black text-white font-mono">{stats.views.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400 font-bold">↑ 12.3%</span>
        </div>

        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Tempo Médio Sessão' : 'Avg Session Time'}</p>
          <p className="text-xl font-black text-white font-mono">{stats.avgTime}</p>
          <span className="text-[9px] text-[#a2d729] font-bold">Estável</span>
        </div>

        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Taxa Conversão' : 'Sales Conversion Ratio'}</p>
          <p className="text-xl font-black text-[#a2d729] font-mono">{stats.conversion}</p>
          <span className="text-[9px] text-emerald-400 font-bold">↑ 0.4%</span>
        </div>

        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-4 space-y-1">
          <p className="text-[10px] font-mono text-neutral-500 uppercase">{isPt ? 'Faturamento Período' : 'Segment revenue'}</p>
          <p className="text-xl font-black text-white font-mono">R$ {stats.revenue.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400 font-bold">↑ 8.5%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DEVICES & BROWSERS */}
        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-mono font-bold text-neutral-500 uppercase border-b border-neutral-900 pb-2">📱 {isPt ? 'Dispositivos e Navegadores Utilizados' : 'Active Devices & Browsers'}</p>
          
          <div className="space-y-3 font-mono text-xs text-neutral-300">
            <div className="space-y-1">
              <p className="flex justify-between">
                <span>💻 Desktop</span>
                <span className="font-bold text-white">{stats.devices.desktop}</span>
              </p>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: stats.devices.desktop }} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="flex justify-between">
                <span>📱 Mobile (iOS/Android)</span>
                <span className="font-bold text-white">{stats.devices.mobile}</span>
              </p>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: stats.devices.mobile }} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-neutral-900 text-[10px] text-neutral-500">
              <div>
                <p className="font-bold text-white">Chrome</p>
                <p className="mt-0.5">{stats.browsers.chrome}</p>
              </div>
              <div>
                <p className="font-bold text-white">Safari</p>
                <p className="mt-0.5">{stats.browsers.safari}</p>
              </div>
              <div>
                <p className="font-bold text-white">Edge</p>
                <p className="mt-0.5">{stats.browsers.edge}</p>
              </div>
              <div>
                <p className="font-bold text-white">Firefox</p>
                <p className="mt-0.5">{stats.browsers.firefox}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MOST POPULAR CONTENT */}
        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-mono font-bold text-neutral-500 uppercase border-b border-neutral-900 pb-2">🏆 {isPt ? 'Produtos Mais Desejados e Visitados' : 'Most Popular Products'}</p>
          
          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{isPt ? 'Bebida Mais Visualizada' : 'Most Visited Beer'}</p>
                <p className="text-[10px] text-[#fe9d00] mt-0.5 font-mono">{stats.mostVisited}</p>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">1.2k views</span>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{isPt ? 'Vinho Mais Desejado' : 'Top Wine Category'}</p>
                <p className="text-[10px] text-[#fe9d00] mt-0.5 font-mono">{stats.mostBeverage}</p>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">840 views</span>
            </div>

            <div className="flex justify-between text-[10px] text-neutral-500 font-mono leading-none pt-2">
              <span>{isPt ? 'Taxa de rejeição: 1.4%' : 'Bounce rate: 1.4%'}</span>
              <span>{isPt ? 'Conversão do Funil: Otimizada' : 'Conversions: Top performer'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
