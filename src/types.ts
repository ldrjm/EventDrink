export type Language = 'pt-BR' | 'en';

export type Tab = 'landing' | 'dashboard' | 'assistant' | 'results' | 'menu' | 'combos' | 'history' | 'help' | 'config' | 'drink-creator' | 'menu-harmonizer' | 'cart' | 'vip-club' | 'profile' | 'admin'
  // VIP specific tabs
  | 'premium-recipes' | 'premium-videos' | 'downloads'
  // Favorites
  | 'favorites'
  // Admin specific tabs
  | 'admin-dashboard' | 'admin-recipes' | 'admin-events' | 'admin-users' | 'admin-plans' | 'admin-financial' | 'admin-downloads' | 'admin-courses' | 'admin-ia' | 'admin-logs' | 'admin-config'
  // New Admin tabs
  | 'admin-stock' | 'admin-orders' | 'admin-coupons' | 'admin-loyalty' | 'admin-analytics';

export type UserRole = 'FREE' | 'VIP' | 'ADMIN' | 'GERENTE' | 'FUNCIONARIO' | 'CLIENTE';

export interface UserSession {
  name: string;
  email: string;
  avatarInitials: string;
  isLoggedIn: boolean;
  badge: 'Premium Host' | 'VIP Member' | 'Basic Organizer' | 'Gerente Geral' | 'Funcionário Operacional';
  role: UserRole;
  eventsCount: number;
  phone?: string;
  birthDate?: string;
  points?: number;
}

export type EventType = 'casual' | 'aniversario' | 'reuniao' | 'outros';

export type ConsumptionProfile = 'moderate' | 'intense';

export interface Drink {
  id: string;
  namePt: string;
  nameEn: string;
  category: 'beers' | 'wines' | 'spirits' | 'non_alcoholic';
  categoryLabelPt: string;
  categoryLabelEn: string;
  price: number;
  imageUrl: string;
  recommendedPt?: string;
  recommendedEn?: string;
  inStock: boolean;
  unitPt: string;
  unitEn: string;
  // Stock extension
  stockQuantity?: number;
  minStockQuantity?: number;
  purchasePrice?: number;
  supplier?: string;
  expiryDate?: string;
  batch?: string;
  status?: 'active' | 'inactive';
}

export interface PastOrder {
  id: string;
  namePt: string;
  nameEn: string;
  datePt: string;
  dateEn: string;
  guests: number;
  savedAmount: number;
  status: 'received' | 'analyzing' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'finalized';
  rating: number;
  score: number; // e.g. 9.8 or 10.0
  total: number;
  imageUrl: string;
  // Order detailed fields
  items?: { drinkId: string; quantity: number; price: number; namePt: string; nameEn: string }[];
  statusHistory?: { status: string; updatedAt: string; notePt: string; noteEn: string }[];
  address?: string;
  paymentMethod?: string;
  userEmail?: string;
}

export interface PlanejamentoInputs {
  eventType: EventType;
  guests: number;
  duration: number;
  drinkersCount: number;
  nonDrinkersCount: number;
}

export interface SuggestedQuantity {
  id: string;
  namePt: string;
  nameEn: string;
  value: number;
  unitPt: string;
  unitEn: string;
  icon: string;
  descPt: string;
  descEn: string;
  approxPriceUnit: number;
}

// ------------------------------------------
// NEW INTEGRATED SYSTEM TYPES
// ------------------------------------------

export interface StockMovement {
  id: string;
  drinkId: string;
  drinkNamePt: string;
  quantity: number;
  type: 'in' | 'out'; // in = entrada, out = saída
  reasonPt: string;
  reasonEn: string;
  date: string;
  userEmail: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  actionPt: string;
  actionEn: string;
  date: string;
  hour: string;
  ip: string;
  browser: string;
  device: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number; // e.g., 10 for 10% or R$ 10
  startDate: string;
  endDate: string;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  maxPerUser: number;
}

export interface Review {
  id: string;
  drinkId: string;
  userName: string;
  rating: number;
  comment: string;
  photoUrl?: string;
  date: string;
  likes: number;
  likedBy: string[]; // List of user emails who liked this review
  replies: { author: string; text: string; date: string }[];
}

export interface SystemNotification {
  id: string;
  titlePt: string;
  titleEn: string;
  descPt: string;
  descEn: string;
  date: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'stock' | 'loyalty' | 'coupon';
}

