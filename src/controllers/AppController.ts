import { useState, useMemo, useEffect } from 'react';
import { Language, Tab, Drink, PastOrder, SuggestedQuantity, EventType, ConsumptionProfile, UserSession, UserRole, StockMovement, Coupon, Review, AuditLog, SystemNotification } from '../types';
import { calculatePlanejamento } from '../utils/calculator';
import { TRANSLATIONS } from '../utils/translations';
import {
  getDownloads,
  insertDownload,
  updateDownload,
  deleteDownload,
  getCourses,
  insertCourse,
  updateCourse,
  deleteCourse,
  VipDownload,
  VipCourse,
  getDrinks,
  insertDrink,
  updateDrink,
  deleteDrink,
  getOrders,
  insertOrder,
  updateOrder,
  deleteOrder,
  getStockMovements,
  insertStockMovement,
  getCoupons,
  insertCoupon,
  updateCoupon,
  deleteCoupon,
  getReviews,
  insertReview,
  updateReview,
  deleteReview,
  getAuditLogs,
  insertAuditLog,
  getUserAccounts
} from '../models/SupabaseModel';

export function useAppController() {
  // --- ESTADOS GLOBAIS DE IDIOMA E NAVEGAÇÃO ---
  // Define o idioma padrão da aplicação para Português (pt-BR)
  const [lang, setLang] = useState<Language>('pt-BR');

  // --- ESTADOS DE BANCO DE DADOS SUPABASE (MODEL DE ACESSO) ---
  const [downloads, setDownloads] = useState<VipDownload[]>([]);
  const [courses, setCourses] = useState<VipCourse[]>([]);
  const [loadingDownloads, setLoadingDownloads] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [loadingDrinks, setLoadingDrinks] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingStockMovements, setLoadingStockMovements] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);
  const [loadingUsersList, setLoadingUsersList] = useState(false);

  const loadDownloads = async () => {
    setLoadingDownloads(true);
    try {
      const data = await getDownloads();
      setDownloads(data);
    } catch (e) {
      console.error('Error loading downloads:', e);
    } finally {
      setLoadingDownloads(false);
    }
  };

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (e) {
      console.error('Error loading courses:', e);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadDrinks = async () => {
    setLoadingDrinks(true);
    try {
      const data = await getDrinks();
      setAvailableDrinks(data);
    } catch (e) {
      console.error('Error loading drinks:', e);
    } finally {
      setLoadingDrinks(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (e) {
      console.error('Error loading orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadStockMovements = async () => {
    setLoadingStockMovements(true);
    try {
      const data = await getStockMovements();
      setStockMovements(data);
    } catch (e) {
      console.error('Error loading stock movements:', e);
    } finally {
      setLoadingStockMovements(false);
    }
  };

  const loadCoupons = async () => {
    setLoadingCoupons(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (e) {
      console.error('Error loading coupons:', e);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await getReviews();
      setReviews(data);
    } catch (e) {
      console.error('Error loading reviews:', e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadAuditLogs = async () => {
    setLoadingAuditLogs(true);
    try {
      const data = await getAuditLogs();
      setAuditLogs(data);
    } catch (e) {
      console.error('Error loading audit logs:', e);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  const loadUsersList = async () => {
    setLoadingUsersList(true);
    try {
      const data = await getUserAccounts();
      setUsersList(data);
    } catch (e) {
      console.error('Error loading user accounts:', e);
    } finally {
      setLoadingUsersList(false);
    }
  };

  useEffect(() => {
    console.info('[Supabase] Status inicial:', {
      configured: !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      url: import.meta.env.VITE_SUPABASE_URL || null,
    });
    loadDownloads();
    loadCourses();
    loadDrinks();
    loadOrders();
    loadStockMovements();
    loadCoupons();
    loadReviews();
    loadAuditLogs();
    loadUsersList();
  }, []);

  const addDownload = async (dw: Omit<VipDownload, 'downloads'> & { downloads?: number }) => {
    const created = await insertDownload(dw);
    setDownloads(prev => [...prev.filter(x => x.id !== created.id), created]);
    return created;
  };

  const editDownload = async (id: string, updates: Partial<Omit<VipDownload, 'id'>>) => {
    const updated = await updateDownload(id, updates);
    if (updated) {
      setDownloads(prev => prev.map(d => d.id === id ? updated : d));
    }
    return updated;
  };

  const removeDownload = async (id: string) => {
    const success = await deleteDownload(id);
    if (success) {
      setDownloads(prev => prev.filter(d => d.id !== id));
    }
    return success;
  };

  const addCourse = async (co: VipCourse) => {
    const created = await insertCourse(co);
    setCourses(prev => [...prev.filter(x => x.id !== created.id), created]);
    return created;
  };

  const editCourse = async (id: string, updates: Partial<Omit<VipCourse, 'id'>>) => {
    const updated = await updateCourse(id, updates);
    if (updated) {
      setCourses(prev => prev.map(c => c.id === id ? updated : c));
    }
    return updated;
  };

  const removeCourse = async (id: string) => {
    const success = await deleteCourse(id);
    if (success) {
      setCourses(prev => prev.filter(c => c.id !== id));
    }
    return success;
  };
  // Define a tela ou aba ativa atualmente no workspace
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const savedTab = localStorage.getItem('eventdrink_active_tab');
    return (savedTab as Tab) || 'landing';
  });
  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_active_tab', activeTab);
    } catch (e) {}
  }, [activeTab]);

  // Controle de visibilidade do Widget de FAQ e Chat
  const [isChatOpen, setIsChatOpen] = useState(false);

  // --- CONTROLE DE AUTENTICAÇÃO E PERFIL DO USUÁRIO ---
  // Inicia a sessão a partir do localStorage quando disponível.
  // Isso permite manter o estado de login entre recarregamentos.
  const guestUser: UserSession = {
    name: '',
    email: '',
    avatarInitials: 'CO',
    isLoggedIn: false,
    badge: 'Basic Organizer',
    role: 'FREE',
    eventsCount: 0,
    phone: ''
  };

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_user_session');
      if (saved) {
        return JSON.parse(saved) as UserSession;
      }
    } catch (e) {
      console.warn('Não foi possível carregar a sessão de usuário do localStorage.', e);
    }
    return guestUser;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // --- PARÂMETROS DE ENTRADA DO PLANEJAMENTO (Zerar Padrões) ---
  // Tipo de evento (casual, aniversario, reuniao, outros)
  const [eventType, setEventType] = useState<EventType>('casual');
  // Duração estimada em horas (inicia zerado)
  const [duration, setDuration] = useState<number>(0);
  // Contabilidade de usuários que consomem álcool ou não
  const [drinkersCount, setDrinkersCount] = useState<number>(0);
  const [nonDrinkersCount, setNonDrinkersCount] = useState<number>(0);

  // Número de convidados (calculado de forma sincronizada)
  const guests = useMemo(() => drinkersCount + nonDrinkersCount, [drinkersCount, nonDrinkersCount]);

  const setGuests = (val: number) => {
    // Ao receber um número total, distribuímos 50% para quem bebe e 50% para quem não bebe
    const half = Math.floor(val / 2);
    setDrinkersCount(half);
    setNonDrinkersCount(val - half);
  };

  // Mantemos como mock estático para evitar quebras em outros componentes
  const [profile, setProfile] = useState<ConsumptionProfile>('moderate');

  // --- SISTEMA INTERATIVO DE QUANTIDADES DE SUPRIMENTOS ---
  // Lista editável de insumos gerados pelo algoritmo
  const [customQuantities, setCustomQuantities] = useState<SuggestedQuantity[]>([]);
  // Flag que determina se o usuário já executou o cálculo de insumos ativos
  const [isCalculated, setIsCalculated] = useState(false);
  // Sub-aba ativa dentro da Proposta de Festa (Plano Sugerido ou Assistente Conversacional AI)
  const [plannerTab, setPlannerTab] = useState<'results' | 'assistant'>('results');

  // --- ESTADO DO CARRINHO DE ORÇAMENTO PERSONALIZADO ---
  const [cart, setCart] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(250);

  // Histórico de pedidos (inicia vazio buscando dados do localStorage)
  const [orders, setOrders] = useState<PastOrder[]>([]);

  // Estágio de bebidas disponíveis no catálogo (suporta adições dinâmicas de receitas criadas e estoque)
  const [availableDrinks, setAvailableDrinks] = useState<Drink[]>([]);

  // Persistir bebidas e estoque
  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_available_drinks', JSON.stringify(availableDrinks));
    } catch (e) {}
  }, [availableDrinks]);

  // --- CONTROLE DE IDADE E MAIORIDADE (AGE GATE) ---
  const [ageVerified, setAgeVerified] = useState(() => {
    return localStorage.getItem('eventdrink_age_verified') === 'true';
  });

  // --- NOVOS ESTADOS INTEGRADOS ---
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_stock_movements', JSON.stringify(stockMovements));
    } catch (e) {}
  }, [stockMovements]);

  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_coupons', JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_reviews', JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {}
  }, [auditLogs]);

  const [loyaltyPoints, setLoyaltyPoints] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('eventdrink_loyalty_points');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_loyalty_points', JSON.stringify(loyaltyPoints));
    } catch (e) {}
  }, [loyaltyPoints]);

  const [usersList, setUsersList] = useState<{ id: string; name: string; email: string; role: UserRole }[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_users_list', JSON.stringify(usersList));
    } catch (e) {}
  }, [usersList]);

  // --- ACTIONS EXTRAS DE AUDITORIA ---
  const addAuditLog = async (userEmail: string, actionPt: string, actionEn: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const hourStr = new Date().toTimeString().slice(0, 5);
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      userEmail,
      actionPt,
      actionEn,
      date: todayStr,
      hour: hourStr,
      ip: '189.230.12.98',
      browser: 'Chrome / Safari',
      device: 'Desktop OS / Mobile'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    await insertAuditLog(newLog);
  };

  const handleToggleFavorite = (drinkId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(drinkId);
      const updated = exists ? prev.filter(id => id !== drinkId) : [...prev, drinkId];
      triggerToast(
        lang === 'pt-BR'
          ? (exists ? 'Removido dos Favoritos!' : 'Adicionado aos Favoritos! ❤️')
          : (exists ? 'Removed from Favorites' : 'Added to Favorites! ❤️')
      );
      return updated;
    });
  };

  const handleAddReview = async (drinkId: string, userName: string, comment: string, rating: number) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      drinkId,
      userName,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10),
      likes: 0,
      likedBy: [],
      replies: []
    };
    setReviews(prev => [newReview, ...prev]);
    await insertReview(newReview);
    addAuditLog(currentUser?.email || 'guest@client.com', `Adicionou avaliação para produto ID: ${drinkId}`, `Added review for product ID: ${drinkId}`);
    triggerToast(lang === 'pt-BR' ? 'Avaliação enviada com sucesso!' : 'Review submitted successfully!');
  };

  const handleLikeReview = async (reviewId: string, userEmail: string) => {
    let targetReview: Review | null = null;
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const alreadyLiked = r.likedBy.includes(userEmail);
        const likedBy = alreadyLiked ? r.likedBy.filter(e => e !== userEmail) : [...r.likedBy, userEmail];
        const likes = alreadyLiked ? r.likes - 1 : r.likes + 1;
        targetReview = {
          ...r,
          likedBy,
          likes
        };
        return targetReview;
      }
      return r;
    }));
    if (targetReview) {
      await updateReview(reviewId, { likedBy: (targetReview as Review).likedBy, likes: (targetReview as Review).likes });
    }
  };

  const handleReplyReview = async (reviewId: string, author: string, text: string) => {
    let targetReview: Review | null = null;
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        targetReview = {
          ...r,
          replies: [...r.replies, { author, text, date: new Date().toISOString().slice(0, 10) }]
        };
        return targetReview;
      }
      return r;
    }));
    if (targetReview) {
      await updateReview(reviewId, { replies: (targetReview as Review).replies });
    }
    triggerToast(lang === 'pt-BR' ? 'Resposta adicionada!' : 'Reply added!');
  };

  // --- MODEL CRUD WRAPPERS FOR DIRECT VIEW INTEGRATION ---
  const addDrink = async (dr: Drink) => {
    const created = await insertDrink(dr);
    setAvailableDrinks(prev => [created, ...prev.filter(x => x.id !== created.id)]);
    addAuditLog(currentUser?.email || 'system@eventdrink.local', `Cadastrou produto: ${dr.namePt}`, `Registered product: ${dr.nameEn}`);
    return created;
  };

  const editDrink = async (id: string, updates: Partial<Omit<Drink, 'id'>>) => {
    const updated = await updateDrink(id, updates);
    if (updated) {
      setAvailableDrinks(prev => prev.map(d => d.id === id ? updated : d));
      addAuditLog(currentUser?.email || 'system@eventdrink.local', `Editou produto ID: ${id}`, `Edited product ID: ${id}`);
    }
    return updated;
  };

  const removeDrink = async (id: string) => {
    const success = await deleteDrink(id);
    if (success) {
      setAvailableDrinks(prev => prev.filter(d => d.id !== id));
      addAuditLog(currentUser?.email || 'system@eventdrink.local', `Removeu produto ID: ${id}`, `Deleted product ID: ${id}`);
    }
    return success;
  };

  const addOrder = async (order: PastOrder) => {
    const created = await insertOrder(order);
    setOrders(prev => [created, ...prev.filter(x => x.id !== created.id)]);
    return created;
  };

  const editOrder = async (id: string, updates: Partial<Omit<PastOrder, 'id'>>) => {
    const updated = await updateOrder(id, updates);
    if (updated) {
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    }
    return updated;
  };

  const removeOrder = async (id: string) => {
    const success = await deleteOrder(id);
    if (success) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
    return success;
  };

  const addStockMovement = async (mov: StockMovement) => {
    const created = await insertStockMovement(mov);
    setStockMovements(prev => [created, ...prev.filter(x => x.id !== created.id)]);
    return created;
  };

  const addCoupon = async (cp: Coupon) => {
    const created = await insertCoupon(cp);
    setCoupons(prev => [created, ...prev.filter(x => x.id !== created.id)]);
    addAuditLog(currentUser?.email || 'system@eventdrink.local', `Criou cupom: ${cp.code}`, `Created coupon: ${cp.code}`);
    return created;
  };

  const editCoupon = async (id: string, updates: Partial<Omit<Coupon, 'id'>>) => {
    const updated = await updateCoupon(id, updates);
    if (updated) {
      setCoupons(prev => prev.map(c => c.id === id ? updated : c));
      addAuditLog(currentUser?.email || 'system@eventdrink.local', `Editou cupom ID: ${id}`, `Edited coupon ID: ${id}`);
    }
    return updated;
  };

  const removeCoupon = async (id: string) => {
    const success = await deleteCoupon(id);
    if (success) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      addAuditLog(currentUser?.email || 'system@eventdrink.local', `Removeu cupom ID: ${id}`, `Deleted coupon ID: ${id}`);
    }
    return success;
  };

  const backupDatabase = () => {
    const dbState = {
      availableDrinks,
      orders,
      stockMovements,
      coupons,
      favorites,
      reviews,
      auditLogs,
      loyaltyPoints,
      usersList
    };
    const jsonStr = JSON.stringify(dbState, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eventdrink_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    triggerToast(lang === 'pt-BR' ? 'Backup gerado com sucesso para download!' : 'Backup file exported successfully!');
  };

  const restoreDatabase = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.availableDrinks) setAvailableDrinks(parsed.availableDrinks);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.stockMovements) setStockMovements(parsed.stockMovements);
      if (parsed.coupons) setCoupons(parsed.coupons);
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.reviews) setReviews(parsed.reviews);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      if (parsed.loyaltyPoints) setLoyaltyPoints(parsed.loyaltyPoints);
      if (parsed.usersList) setUsersList(parsed.usersList);

      triggerToast(lang === 'pt-BR' ? 'Banco de dados restaurado com sucesso!' : 'Database restored successfully!');
      addAuditLog(currentUser?.email || 'system@eventdrink.local', 'Restaurou backup do sistema', 'Restored system backup');
    } catch (e) {
      triggerToast(lang === 'pt-BR' ? 'Erro ao restaurar backup. Formato inválido!' : 'Error restoring backup. Invalid file format!');
    }
  };
  
  // --- COMPONENTES DE NOTIFICAÇÃO E AGENDAMENTO DE ENTREGA ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCheckOutSuccess, setShowCheckOutSuccess] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('Av. Paulista, 1000 - Bela Vista, São Paulo, SP');
  const [deliveryDate, setDeliveryDate] = useState('2026-06-25');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [isFinishingPurchase, setIsFinishingPurchase] = useState(false);

  // Exibe notificações temporárias do aplicativo
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- CÁLCULO ALGORÍTMICO DOS INSUMOS ---
  // Memoriza os insumos ideais usando nossa matriz de consumo sempre que os filtros de entrada mudarem
  const basePlanning = useMemo(() => {
    return calculatePlanejamento({ eventType, guests, duration, drinkersCount, nonDrinkersCount });
  }, [eventType, guests, duration, drinkersCount, nonDrinkersCount]);

  // Sincroniza a lista de quantidades customizáveis sempre que um novo cálculo base for gerado
  useEffect(() => {
    setCustomQuantities(basePlanning.items);
  }, [basePlanning]);

  // Persiste o histórico de pedidos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventdrink_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // --- GESTÃO DE DIOCIONÁRIO DE TRADUÇÃO COMPACTA ---
  const currentTranslation = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS['pt-BR'];
  }, [lang]);

  // --- AJUSTE MANUAL DE QUANTIDADES ---
  // Permite clicar nos botões de mais e menos nas linhas da proposta para personalizar
  const handleQuantityAdjust = (itemId: string, increment: boolean) => {
    setCustomQuantities(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const newValue = increment ? item.value + 1 : Math.max(0, item.value - 1);
          return { ...item, value: newValue };
        }
        return item;
      })
    );
    triggerToast(lang === 'pt-BR' ? 'Quantidade ajustada!' : 'Quantity adjusted!');
  };

  // Recalculate dynamic totals from customized items
  const customTotals = useMemo(() => {
    let subtotal = 0;
    customQuantities.forEach(item => {
      subtotal += item.value * item.approxPriceUnit;
    });
    // Scale discount accordingly
    const discount = Math.round(subtotal * 0.07);
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [customQuantities]);

  // Reordering simulator
  const handleReorder = (order: PastOrder) => {
    setGuests(order.guests || 50);
    setEventType('social'); // fallback matching
    setDuration(6);
    setProfile('moderate');
    setActiveTab('results');
    triggerToast(lang === 'pt-BR' ? `Configurações do "${order.namePt}" aplicadas ao planejador!` : `"${order.nameEn}" configurations applied to the planner!`);
  };

  // Add Item to Estimate Cart from Drinks catalog
  const requireLoginForCartAction = (): boolean => {
    if (!currentUser?.isLoggedIn) {
      setIsLoginModalOpen(true);
      triggerToast(lang === 'pt-BR'
        ? 'Faça login para adicionar itens ao carrinho.'
        : 'Please log in to add items to the cart.');
      return true;
    }
    return false;
  };

  const handleAddToCart = (drink: Drink) => {
    if (requireLoginForCartAction()) return;

    setCart(prev => ({
      ...prev,
      [drink.id]: (prev[drink.id] || 0) + 1
    }));
    triggerToast(lang === 'pt-BR' ? `+1 ${drink.namePt} adicionado ao Orçamento!` : `+1 ${drink.nameEn} added to Estimate!`);
  };

  // Remove Item from Estimate Cart
  const handleRemoveFromCart = (drinkId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[drinkId] <= 1) {
        delete updated[drinkId];
      } else {
        updated[drinkId]--;
      }
      return updated;
    });
    triggerToast(lang === 'pt-BR' ? 'Item removido do orçamento.' : 'Item removed from estimate.');
  };

  // Floating Cart Calculations
  const cartInfo = useMemo(() => {
    let count = 0;
    let total = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const drink = availableDrinks.find(d => d.id === id);
      if (drink) {
        const itemQty = qty as number;
        count += itemQty;
        total += drink.price * itemQty;
      }
    });
    return { count, total };
  }, [cart, availableDrinks]);

  const isBeverageMenuItem = (drink: Drink) => {
    const normalizedName = `${drink.namePt} ${drink.nameEn}`.toLowerCase();

    const drinkOnlySpirits = drink.category === 'spirits' && (
      normalizedName.includes('gin') ||
      normalizedName.includes('vodka') ||
      normalizedName.includes('whisky') ||
      normalizedName.includes('whiskey')
    );

    const allowedNonAlcoholic = drink.category === 'non_alcoholic' && (
      normalizedName.includes('água') ||
      normalizedName.includes('water') ||
      normalizedName.includes('tônica') ||
      normalizedName.includes('tonic') ||
      normalizedName.includes('soda') ||
      normalizedName.includes('energético') ||
      normalizedName.includes('energy')
    );

    return drink.category === 'beers' || drink.category === 'wines' || drinkOnlySpirits || allowedNonAlcoholic;
  };

  // Filtered Drinks for Beverage catalog screen
  const filteredDrinks = useMemo(() => {
    return availableDrinks.filter(drink => {
      const matchesSearch = 
        drink.namePt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.categoryLabelPt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drink.categoryLabelEn.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || drink.category === selectedCategory;
      const matchesPrice = drink.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice && isBeverageMenuItem(drink);
    });
  }, [availableDrinks, searchQuery, selectedCategory, maxPrice]);

  // Interactive submit planning to Mock Event List
  const handleConfirmPlan = () => {
    if (!currentUser?.isLoggedIn) {
      setIsLoginModalOpen(true);
      triggerToast(lang === 'pt-BR'
        ? 'Faça login para concluir o planejamento e adicionar itens ao carrinho.'
        : 'Please log in to complete planning and add items to the cart.');
      return;
    }

    const newOrder: PastOrder = {
      id: `o${Date.now()}`,
      namePt: `Festa de ${guests} pessoas - ${eventType.toUpperCase()}`,
      nameEn: `${eventType.toUpperCase()} Party for ${guests} guests`,
      datePt: 'Hoje',
      dateEn: 'Today',
      guests: guests,
      savedAmount: customTotals.discount,
      status: 'received',
      rating: 0,
      score: 9.9,
      total: customTotals.total,
      imageUrl: 'https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80'
    };
    
    // Auto-populate cart with calculated quantities from party plan
    const fallbackDrinkIds: Record<string, string> = {
      cerveja: 'ec9bfa3d-74f6-41d7-b0e2-1fc311d2a7ad',
      vinho: '1df634f5-36c2-4fab-8c43-c28f39d84b7b',
      gelo: 'f3c1d2e4-5b6a-4f7c-8d9e-0a1b2c3d4e5f',
      vodka: 'b1f7c2d4-9e8f-4a0b-8c5d-3a2b1c4d5e6f',
      reco: 'd6a7e5b2-1f4c-4e5d-8f9b-2a3c4b5d6e7f',
      agua: 'f3c1d2e4-5b6a-4f7c-8d9e-0a1b2c3d4e5f'
    };

    const drinkIdMap: Record<string, string | undefined> = {
      cerveja: availableDrinks.find(d => d.category === 'beers')?.id ?? fallbackDrinkIds.cerveja,
      vinho: availableDrinks.find(d => d.category === 'wines')?.id ?? fallbackDrinkIds.vinho,
      gelo: availableDrinks.find(d => /gelo|ice/i.test(`${d.namePt} ${d.nameEn}`))?.id ?? fallbackDrinkIds.gelo,
      vodka: availableDrinks.find(d => /vodka|spirits|liquor/i.test(`${d.namePt} ${d.nameEn}`))?.id ?? availableDrinks.find(d => d.category === 'spirits')?.id ?? fallbackDrinkIds.vodka,
      reco: availableDrinks.find(d => /refrigerante|soda|cola|soft drink|tonic/i.test(`${d.namePt} ${d.nameEn}`))?.id ?? fallbackDrinkIds.reco,
      agua: availableDrinks.find(d => /água|water/i.test(`${d.namePt} ${d.nameEn}`))?.id ?? fallbackDrinkIds.agua,
    };

    setCart(prev => {
      const updated = { ...prev };
      customQuantities.forEach(item => {
        const drinkId = drinkIdMap[item.id];
        if (drinkId && item.value > 0) {
          updated[drinkId] = item.value;
        }
      });
      return updated;
    });

    addOrder(newOrder);
    setShowCheckOutSuccess(true);
  };

  // Delete item entirely from cart
  const handleDeleteFromCart = (drinkId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      delete updated[drinkId];
      return updated;
    });
    triggerToast(lang === 'pt-BR' ? 'Item removido completamente!' : 'Item completely removed!');
  };

  // Checkout com simulação e controle de estoque automatizado
  const handleCheckoutCart = () => {
    if (cartInfo.count === 0) return;
    if (!currentUser?.isLoggedIn) {
      setIsLoginModalOpen(true);
      triggerToast(lang === 'pt-BR'
        ? 'Faça login para finalizar o pedido.'
        : 'Please log in to complete the purchase.');
      return;
    }
    setIsFinishingPurchase(true);
    
    setTimeout(() => {
      // Build descriptive names for order
      const itemsDescriptionPt = Object.entries(cart)
        .map(([id, qty]) => {
          const drink = availableDrinks.find(d => d.id === id);
          return drink ? `${qty}x ${drink.namePt}` : '';
        })
        .filter(Boolean)
        .join(', ');

      const itemsDescriptionEn = Object.entries(cart)
        .map(([id, qty]) => {
          const drink = availableDrinks.find(d => d.id === id);
          return drink ? `${qty}x ${drink.nameEn}` : '';
        })
        .filter(Boolean)
        .join(', ');

      const saved = currentUser?.isLoggedIn ? Math.round(cartInfo.total * 0.07) : 0;
      const finalTotal = cartInfo.total - saved;

      const newOrder: PastOrder = {
        id: `o${Date.now()}`,
        namePt: `Compra: ${itemsDescriptionPt.slice(0, 40)}${itemsDescriptionPt.length > 40 ? '...' : ''}`,
        nameEn: `Purchase: ${itemsDescriptionEn.slice(0, 40)}${itemsDescriptionEn.length > 40 ? '...' : ''}`,
        datePt: 'Hoje',
        dateEn: 'Today',
        guests: 0,
        savedAmount: saved,
        status: 'received', // Inicia no estágio recebido de verdade
        rating: 0,
        score: 10.0,
        total: finalTotal,
        imageUrl: 'https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80',
        items: Object.entries(cart).map(([id, qty]) => {
          const dr = availableDrinks.find(d => d.id === id);
          return {
            drinkId: id,
            quantity: qty as number,
            price: Number(dr?.price || 0),
            namePt: String(dr?.namePt || ''),
            nameEn: String(dr?.nameEn || '')
          };
        }),
        statusHistory: [
          { status: 'received', updatedAt: new Date().toLocaleString(), notePt: 'Pedido recebido com sucesso!', noteEn: 'Order received successfully!' }
        ],
        address: deliveryAddress,
        paymentMethod: paymentMethod.toUpperCase(),
        userEmail: currentUser?.email || 'guest@client.com'
      };

      const firstItemId = Object.keys(cart)[0];
      const firstDrink = availableDrinks.find(d => d.id === firstItemId);
      if (firstDrink) {
        newOrder.imageUrl = firstDrink.imageUrl;
      }

      // --- DEPRECIAÇÃO AUTOMÁTICA DE ESTOQUE ---
      setAvailableDrinks(prev => prev.map(d => {
        const qtyInCart = cart[d.id] || 0;
        if (qtyInCart > 0) {
          const currentQty = d.stockQuantity || 0;
          const nextQty = Math.max(0, currentQty - qtyInCart);
          editDrink(d.id, { stockQuantity: nextQty, inStock: nextQty > 0 });
          return {
            ...d,
            stockQuantity: nextQty,
            inStock: nextQty > 0
          };
        }
        return d;
      }));

      // Criar registros de saída na movimentação
      Object.entries(cart).forEach(([id, qty]) => {
        const dr = availableDrinks.find(d => d.id === id);
        if (dr) {
          const movement: StockMovement = {
            id: `mov_${Date.now()}_${id}`,
            drinkId: id,
            drinkNamePt: dr.namePt,
            quantity: qty as number,
            type: 'out',
            reasonPt: `Saída por venda automatizada (Pedido #${newOrder.id.slice(1, 6)})`,
            reasonEn: `Sales auto-depletion (Order #${newOrder.id.slice(1, 6)})`,
            date: new Date().toISOString(),
            userEmail: currentUser?.email || 'guest@client.com'
          };
          addStockMovement(movement);
        }
      });

      // --- ACÚMULO AUTOMÁTICO DE PONTOS DE FIDELIDADE ---
      if (currentUser?.isLoggedIn && currentUser.email) {
        const ptsGained = Math.round(finalTotal);
        setLoyaltyPoints(prev => ({
          ...prev,
          [currentUser.email]: (prev[currentUser.email] || 0) + ptsGained
        }));
      }

      // --- LOG AUDIT EVENT ---
      addAuditLog(
        currentUser?.email || 'guest@client.com',
        `Efetuou checkout do carrinho no valor de R$ ${finalTotal.toFixed(2)}`,
        `Checked out cart of R$ ${finalTotal.toFixed(2)}`
      );

      addOrder(newOrder);
      setCart({});
      setIsFinishingPurchase(false);
      setShowCheckOutSuccess(true);
      triggerToast(lang === 'pt-BR' ? 'Pedido finalizado! O estoque e seus pontos VIP foram atualizados.' : 'Order finalized! Stock and VIP loyalty points updated.');
    }, 1200); // simulate network request
  };

  const handleLoginSuccess = (user: any) => {
    let role: UserRole = 'FREE';
    if (user.badge === 'Premium Host') {
      role = 'ADMIN';
    } else if (user.badge === 'VIP Member') {
      role = 'VIP';
    }
    const enrichedUser: UserSession = {
      ...user,
      role
    };
    setCurrentUser(enrichedUser);
    try {
      localStorage.setItem('eventdrink_user_session', JSON.stringify(enrichedUser));
    } catch (e) {}
  };

  const handleLogout = () => {
    const guestUser: UserSession = {
      name: '',
      email: '',
      avatarInitials: 'CO',
      isLoggedIn: false,
      badge: 'Basic Organizer' as const,
      role: 'FREE',
      eventsCount: 0
    };
    setCurrentUser(guestUser);
    try {
      localStorage.setItem('eventdrink_user_session', JSON.stringify(guestUser));
    } catch (e) {}
  };

  const toggleUserTier = () => {
    if (!currentUser?.isLoggedIn) {
      setIsLoginModalOpen(true);
      triggerToast(lang === 'pt-BR'
        ? 'Faça login para alternar para o modo VIP.'
        : 'Please log in to switch to VIP mode.');
      return;
    }

    const isVip = currentUser.badge === 'VIP Member' || currentUser.badge === 'Premium Host';
    if (isVip) {
      const freeUser: UserSession = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        avatarInitials: currentUser.avatarInitials || 'CO',
        isLoggedIn: true,
        badge: 'Basic Organizer' as const,
        role: 'FREE',
        eventsCount: currentUser.eventsCount || 0,
        phone: currentUser.phone || ''
      };
      setCurrentUser(freeUser);
      try {
        localStorage.setItem('eventdrink_user_session', JSON.stringify(freeUser));
      } catch (e) {}
      triggerToast(lang === 'pt-BR' ? 'Alternou para a versão Grátis.' : 'Switched to Free version.');
    } else {
      const vipUser: UserSession = {
        name: currentUser.name || (lang === 'pt-BR' ? 'Anfitrião VIP' : 'VIP Host'),
        email: currentUser.email || 'host.vip@eventdrink.com',
        avatarInitials: (currentUser.name || 'VIP').slice(0, 2).toUpperCase(),
        isLoggedIn: true,
        badge: 'VIP Member' as const,
        role: 'VIP',
        eventsCount: currentUser.eventsCount || 0,
        phone: currentUser.phone || ''
      };
      setCurrentUser(vipUser);
      try {
        localStorage.setItem('eventdrink_user_session', JSON.stringify(vipUser));
      } catch (e) {}
      triggerToast(lang === 'pt-BR' ? 'Acesso VIP Premium Desbloqueado! ✨' : 'VIP Premium Access Unlocked! ✨');
    }
  };

  return {
    lang,
    setLang,
    activeTab,
    setActiveTab,
    isChatOpen,
    setIsChatOpen,
    currentUser,
    setCurrentUser,
    isLoginModalOpen,
    setIsLoginModalOpen,
    eventType,
    setEventType,
    guests,
    setGuests,
    duration,
    setDuration,
    drinkersCount,
    setDrinkersCount,
    nonDrinkersCount,
    setNonDrinkersCount,
    profile,
    setProfile,
    customQuantities,
    setCustomQuantities,
    isCalculated,
    setIsCalculated,
    plannerTab,
    setPlannerTab,
    cart,
    setCart,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    orders,
    setOrders,
    availableDrinks,
    setAvailableDrinks,
    toastMessage,
    setToastMessage,
    showCheckOutSuccess,
    setShowCheckOutSuccess,
    deliveryAddress,
    setDeliveryAddress,
    deliveryDate,
    setDeliveryDate,
    paymentMethod,
    setPaymentMethod,
    isFinishingPurchase,
    setIsFinishingPurchase,
    basePlanning,
    currentTranslation,
    customTotals,
    cartInfo,
    filteredDrinks,
    triggerToast,
    handleQuantityAdjust,
    handleReorder,
    handleAddToCart,
    handleRemoveFromCart,
    handleConfirmPlan,
    handleDeleteFromCart,
    handleCheckoutCart,
    handleLoginSuccess,
    handleLogout,
    toggleUserTier,
    // Database states & actions
    downloads,
    setDownloads,
    courses,
    setCourses,
    loadingDownloads,
    loadingCourses,
    loadDownloads,
    loadCourses,
    addDownload,
    editDownload,
    removeDownload,
    addCourse,
    editCourse,
    removeCourse,
    // Loading indicators
    loadingDrinks,
    loadingOrders,
    loadingStockMovements,
    loadingCoupons,
    loadingReviews,
    loadingAuditLogs,
    loadingUsersList,
    // Database loaders
    loadDrinks,
    loadOrders,
    loadStockMovements,
    loadCoupons,
    loadReviews,
    loadAuditLogs,
    // CRUD action wrappers
    addDrink,
    editDrink,
    removeDrink,
    addOrder,
    editOrder,
    removeOrder,
    addStockMovement,
    addCoupon,
    editCoupon,
    removeCoupon,
    // Advanced Integrated elements
    ageVerified,
    setAgeVerified,
    stockMovements,
    setStockMovements,
    coupons,
    setCoupons,
    favorites,
    setFavorites,
    reviews,
    setReviews,
    auditLogs,
    setAuditLogs,
    loyaltyPoints,
    setLoyaltyPoints,
    usersList,
    setUsersList,
    addAuditLog,
    handleToggleFavorite,
    handleAddReview,
    handleLikeReview,
    handleReplyReview,
    backupDatabase,
    restoreDatabase
  };
}

export type AppControllerType = ReturnType<typeof useAppController>;
