import { createClient } from '@supabase/supabase-js';
import { Drink, PastOrder, StockMovement, Coupon, Review, AuditLog, UserRole } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safe initialization of Supabase client to prevent app crash if keys are missing
const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY');
export const supabase = hasSupabaseCredentials
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (supabase) {
  console.log('Supabase client initialized successfully!');
} else {
  console.warn('Supabase credentials not found or set to placeholder. Operating with secure local state fallback.');
}

export function getSupabaseStatus() {
  return {
    configured: hasSupabaseCredentials,
    url: supabaseUrl || null,
    hasAnonKey: Boolean(supabaseAnonKey),
  };
}

function isValidUuid(value: string | null | undefined): boolean {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function ensureUuid(value: string | null | undefined): string {
  if (isValidUuid(value)) return value!;
  const cryptoApi = globalThis.crypto as Crypto | undefined;
  if (typeof cryptoApi?.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return `00000000-0000-4000-8000-${Math.floor(Math.random() * 0xFFFFFFFFFFFF).toString(16).padStart(12, '0')}`;
}

function toSupabaseDrinkPayload(drink: Drink, categoryId: string | null): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    id: ensureUuid(drink.id),
    name_pt: drink.namePt,
    name_en: drink.nameEn,
    category_id: categoryId,
    category_label_pt: drink.categoryLabelPt,
    category_label_en: drink.categoryLabelEn,
    price: drink.price,
    image_url: drink.imageUrl,
    recommended_pt: drink.recommendedPt ?? null,
    recommended_en: drink.recommendedEn ?? null,
    in_stock: drink.inStock,
    unit_pt: drink.unitPt,
    unit_en: drink.unitEn,
    stock_quantity: drink.stockQuantity ?? 0,
    min_stock_quantity: drink.minStockQuantity ?? 0,
    purchase_price: drink.purchasePrice ?? 0,
    supplier_id: null,
    expiry_date: drink.expiryDate ?? null,
    batch: drink.batch ?? null,
    status: drink.status ?? 'active',
  };

  if (drink.supplier && isValidUuid(drink.supplier)) {
    payload.supplier_id = drink.supplier;
  }

  return payload;
}

async function getCategoryIdBySlug(slug: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('drink_categories').select('id').eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return data.id as string | null;
}

async function getStatusIdBySlug(slug: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('order_statuses').select('id').eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return data.id as string | null;
}

async function getBadgeIdByName(name: string): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('user_badges').select('id').eq('name', name).maybeSingle();
  if (error || !data) return null;
  return data.id as string | null;
}

async function getBadgeNameById(id: string | null): Promise<string | null> {
  if (!supabase || !id) return null;
  const { data, error } = await supabase.from('user_badges').select('name').eq('id', id).maybeSingle();
  if (error || !data) return null;
  return data.name as string | null;
}

function toVipDownloadRecord(download: VipDownload) {
  return {
    id: download.id,
    title: download.title,
    description: download.desc,
    type: download.type,
    format: download.format,
    size: download.size,
    downloads: download.downloads,
  };
}

function fromVipDownloadRecord(row: any): VipDownload {
  return {
    id: row.id,
    title: row.title,
    desc: row.description ?? row.desc,
    type: row.type,
    format: row.format,
    size: row.size,
    downloads: row.downloads ?? 0,
  };
}

function toVipCourseRecord(course: VipCourse) {
  return {
    id: course.id,
    title: course.title,
    author: course.author,
    duration: course.duration,
    difficulty: course.difficulty,
    image_url: course.img,
    views: course.views,
    description: course.desc,
  };
}

function fromVipCourseRecord(row: any): VipCourse {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    duration: row.duration,
    difficulty: row.difficulty,
    img: row.image_url ?? row.img,
    views: row.views,
    desc: row.description ?? row.desc,
  };
}

function toDrinkRecord(drink: Drink) {
  return {
    id: ensureUuid(drink.id),
    name_pt: drink.namePt,
    name_en: drink.nameEn,
    category: drink.category,
    category_label_pt: drink.categoryLabelPt,
    category_label_en: drink.categoryLabelEn,
    price: drink.price,
    image_url: drink.imageUrl,
    recommended_pt: drink.recommendedPt,
    recommended_en: drink.recommendedEn,
    in_stock: drink.inStock,
    unit_pt: drink.unitPt,
    unit_en: drink.unitEn,
    stock_quantity: drink.stockQuantity ?? 0,
    min_stock_quantity: drink.minStockQuantity ?? 0,
    purchase_price: drink.purchasePrice ?? 0,
    supplier: drink.supplier && isValidUuid(drink.supplier) ? drink.supplier : null,
    expiry_date: drink.expiryDate,
    batch: drink.batch,
    status: drink.status ?? 'active',
  };
}

function fromDrinkRecord(row: any): Drink {
  return {
    id: row.id,
    namePt: row.name_pt ?? row.namePt,
    nameEn: row.name_en ?? row.nameEn,
    category: row.category ?? row.category_slug ?? 'beers',
    categoryLabelPt: row.category_label_pt ?? row.categoryLabelPt ?? '',
    categoryLabelEn: row.category_label_en ?? row.categoryLabelEn ?? '',
    price: row.price,
    imageUrl: row.image_url ?? row.imageUrl,
    recommendedPt: row.recommended_pt ?? row.recommendedPt,
    recommendedEn: row.recommended_en ?? row.recommendedEn,
    inStock: row.in_stock ?? row.inStock ?? true,
    unitPt: row.unit_pt ?? row.unitPt,
    unitEn: row.unit_en ?? row.unitEn,
    stockQuantity: row.stock_quantity ?? row.stockQuantity ?? 0,
    minStockQuantity: row.min_stock_quantity ?? row.minStockQuantity ?? 0,
    purchasePrice: row.purchase_price ?? row.purchasePrice ?? 0,
    supplier: row.supplier ?? row.supplier_id,
    expiryDate: row.expiry_date ?? row.expiryDate,
    batch: row.batch,
    status: row.status ?? row.status_value ?? 'active',
  };
}

function toOrderRecord(order: PastOrder) {
  return {
    id: order.id,
    user_email: order.userEmail,
    name_pt: order.namePt,
    name_en: order.nameEn,
    date_pt: order.datePt,
    date_en: order.dateEn,
    guests: order.guests,
    saved_amount: order.savedAmount,
    status: order.status,
    rating: order.rating,
    score: order.score,
    total: order.total,
    image_url: order.imageUrl,
    items: order.items ?? [],
    status_history: order.statusHistory ?? [],
    address: order.address,
    payment_method: order.paymentMethod,
  };
}

function fromOrderRecord(row: any): PastOrder {
  return {
    id: row.id,
    namePt: row.name_pt ?? row.namePt,
    nameEn: row.name_en ?? row.nameEn,
    datePt: row.date_pt ?? row.datePt,
    dateEn: row.date_en ?? row.dateEn,
    guests: row.guests ?? 0,
    savedAmount: row.saved_amount ?? row.savedAmount ?? 0,
    status: row.status ?? row.status_slug ?? 'received',
    rating: row.rating ?? 0,
    score: row.score ?? 0,
    total: row.total ?? 0,
    imageUrl: row.image_url ?? row.imageUrl,
    items: row.items ?? [],
    statusHistory: row.status_history ?? row.statusHistory ?? [],
    address: row.address,
    paymentMethod: row.payment_method ?? row.paymentMethod,
    userEmail: row.user_email ?? row.userEmail,
  };
}

function toStockMovementRecord(movement: StockMovement) {
  return {
    id: ensureUuid(movement.id),
    drink_id: movement.drinkId,
    drink_name_pt: movement.drinkNamePt,
    quantity: movement.quantity,
    type: movement.type,
    reason_pt: movement.reasonPt,
    reason_en: movement.reasonEn,
    date: movement.date,
    user_email: movement.userEmail,
  };
}

function fromStockMovementRecord(row: any): StockMovement {
  return {
    id: row.id,
    drinkId: row.drink_id ?? row.drinkId,
    drinkNamePt: row.drink_name_pt ?? row.drinkNamePt,
    quantity: row.quantity,
    type: row.type,
    reasonPt: row.reason_pt ?? row.reasonPt,
    reasonEn: row.reason_en ?? row.reasonEn,
    date: row.date,
    userEmail: row.user_email ?? row.userEmail,
  };
}

function toCouponRecord(coupon: Coupon) {
  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    start_date: coupon.startDate,
    end_date: coupon.endDate,
    min_order_value: coupon.minOrderValue,
    max_uses: coupon.maxUses,
    used_count: coupon.usedCount,
    max_per_user: coupon.maxPerUser,
  };
}

function fromCouponRecord(row: any): Coupon {
  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: row.value,
    startDate: row.start_date ?? row.startDate,
    endDate: row.end_date ?? row.endDate,
    minOrderValue: row.min_order_value ?? row.minOrderValue ?? 0,
    maxUses: row.max_uses ?? row.maxUses ?? 100,
    usedCount: row.used_count ?? row.usedCount ?? 0,
    maxPerUser: row.max_per_user ?? row.maxPerUser ?? 1,
  };
}

function toReviewRecord(review: Review) {
  return {
    id: review.id,
    drink_id: review.drinkId,
    user_name: review.userName,
    rating: review.rating,
    comment: review.comment,
    photo_url: review.photoUrl,
    date: review.date,
    likes: review.likes,
    likedBy: review.likedBy,
    replies: review.replies,
  };
}

function fromReviewRecord(row: any): Review {
  return {
    id: row.id,
    drinkId: row.drink_id ?? row.drinkId,
    userName: row.user_name ?? row.userName,
    rating: row.rating,
    comment: row.comment,
    photoUrl: row.photo_url ?? row.photoUrl,
    date: row.date,
    likes: row.likes ?? 0,
    likedBy: Array.isArray(row.liked_by) ? row.liked_by : Array.isArray(row.likedBy) ? row.likedBy : [],
    replies: Array.isArray(row.replies) ? row.replies : [],
  };
}

function toAuditLogRecord(log: AuditLog) {
  return {
    id: log.id,
    user_email: log.userEmail,
    action_pt: log.actionPt,
    action_en: log.actionEn,
    date: log.date,
    hour: log.hour,
    ip: log.ip,
    browser: log.browser,
    device: log.device,
  };
}

function fromAuditLogRecord(row: any): AuditLog {
  return {
    id: row.id,
    userEmail: row.user_email ?? row.userEmail,
    actionPt: row.action_pt ?? row.actionPt,
    actionEn: row.action_en ?? row.actionEn,
    date: row.date,
    hour: row.hour,
    ip: row.ip,
    browser: row.browser,
    device: row.device,
  };
}

function toUserAccountRecord(account: UserAccount) {
  return {
    id: ensureUuid(account.id),
    name: account.name,
    email: account.email,
    password: account.password,
    phone: account.phone,
    birth_date: account.birthDate,
    role: account.role,
    created_at: account.createdAt,
  };
}

function fromUserAccountRecord(row: any): UserAccount {
  const badgeName = row.badge ?? row.user_badges?.name ?? row.badge_name ?? 'Basic Organizer';
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    phone: row.phone,
    birthDate: row.birth_date ?? row.birthDate,
    badge: badgeName,
    role: row.role,
    createdAt: row.created_at ?? row.createdAt,
  };
}

// ---------------- VipDownload Entity Model ----------------

export interface VipDownload {
  id: string;
  title: string;
  desc: string;
  type: string;
  format: string;
  size: string;
  downloads: number;
}

const DEFAULT_DOWNLOADS: VipDownload[] = [];

// Helper local routines
function getLocalDownloads(): VipDownload[] {
  try {
    const saved = localStorage.getItem('eventdrink_downloads');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [...DEFAULT_DOWNLOADS];
}

function saveLocalDownloads(data: VipDownload[]) {
  try {
    localStorage.setItem('eventdrink_downloads', JSON.stringify(data));
  } catch (e) {}
}

async function seedDownloads(data: VipDownload[]) {
  if (!supabase) return;
  try {
    await supabase.from('vip_downloads').insert(data.map(toVipDownloadRecord));
  } catch (err) {
    console.warn('Seeding vip_downloads failed:', err);
  }
}

// Model Action: Read Downloads (L)
export async function getDownloads(): Promise<VipDownload[]> {
  if (!supabase) {
    return getLocalDownloads();
  }
  try {
    const { data, error } = await supabase
      .from('vip_downloads')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'vip_downloads' não pôde ser consultada, usando fallback local seguro.
Se você estiver inicializando o Supabase, por favor execute a seguinte instrução DDL no seu Editor SQL do Supabase:

CREATE TABLE IF NOT EXISTS public.vip_downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  type TEXT NOT NULL,
  format TEXT NOT NULL,
  size TEXT NOT NULL,
  downloads INTEGER DEFAULT 0
);
ALTER TABLE public.vip_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON public.vip_downloads FOR ALL USING (true) WITH CHECK (true);

Detalhes do erro:`, error);
      return getLocalDownloads();
    }
    
    if (!data || data.length === 0) {
      const localData = getLocalDownloads();
      await seedDownloads(localData);
      return localData;
    }
    
    return (data || []).map(fromVipDownloadRecord) as VipDownload[];
  } catch (err) {
    console.warn('Erro inesperado ao buscar downloads do Supabase, utilizando fallback local seguro:', err);
    return getLocalDownloads();
  }
}

// Model Action: Create Download (C)
export async function insertDownload(download: Omit<VipDownload, 'downloads'> & { downloads?: number }): Promise<VipDownload> {
  const newDownload: VipDownload = {
    ...download,
    downloads: download.downloads ?? 0
  };

  // Always update local storage first as a safety net
  const local = getLocalDownloads();
  local.push(newDownload);
  saveLocalDownloads(local);

  if (!supabase) {
    return newDownload;
  }

  try {
    const { data, error } = await supabase
      .from('vip_downloads')
      .insert([toVipDownloadRecord(newDownload)])
      .select();

    if (error) {
      throw error;
    }
    return (data && data[0]) ? fromVipDownloadRecord(data[0]) : newDownload;
  } catch (err) {
    console.error('Error inserting into Supabase:', err);
    return newDownload;
  }
}

// Model Action: Update Download (U)
export async function updateDownload(id: string, updates: Partial<Omit<VipDownload, 'id'>>): Promise<VipDownload | null> {
  // Always update local storage
  const local = getLocalDownloads();
  const idx = local.findIndex(d => d.id === id);
  let updatedLocal: VipDownload | null = null;
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalDownloads(local);
    updatedLocal = local[idx];
  }

  if (!supabase) {
    return updatedLocal;
  }

  try {
    const { data, error } = await supabase
      .from('vip_downloads')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }
    return (data && data[0]) ? fromVipDownloadRecord(data[0]) : updatedLocal;
  } catch (err) {
    console.error('Error updating in Supabase:', err);
    return updatedLocal;
  }
}

// Model Action: Delete Download (D)
export async function deleteDownload(id: string): Promise<boolean> {
  // Always delete from local storage
  const local = getLocalDownloads();
  const filtered = local.filter(d => d.id !== id);
  saveLocalDownloads(filtered);

  if (!supabase) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('vip_downloads')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
    return true;
  } catch (err) {
    console.error('Error deleting from Supabase:', err);
    return true;
  }
}


// ---------------- VipCourse Entity Model ----------------

export interface VipCourse {
  id: string;
  title: string;
  author: string;
  duration: string;
  difficulty: string;
  img: string;
  views: string;
  desc: string;
}

const DEFAULT_COURSES: VipCourse[] = [];

function getLocalCourses(): VipCourse[] {
  try {
    const saved = localStorage.getItem('eventdrink_courses');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [...DEFAULT_COURSES];
}

function saveLocalCourses(data: VipCourse[]) {
  try {
    localStorage.setItem('eventdrink_courses', JSON.stringify(data));
  } catch (e) {}
}

async function seedCourses(data: VipCourse[]) {
  if (!supabase) return;
  try {
    await supabase.from('vip_courses').insert(data.map(toVipCourseRecord));
  } catch (err) {
    console.warn('Seeding vip_courses failed:', err);
  }
}

// Model Action: Read Courses (L)
export async function getCourses(): Promise<VipCourse[]> {
  if (!supabase) {
    return getLocalCourses();
  }
  try {
    const { data, error } = await supabase
      .from('vip_courses')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'vip_courses' não pôde ser consultada, usando fallback local seguro.
Se você estiver inicializando o Supabase, por favor execute a seguinte instrução DDL no seu Editor SQL do Supabase:

CREATE TABLE IF NOT EXISTS public.vip_courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  img TEXT NOT NULL,
  views TEXT NOT NULL,
  "desc" TEXT NOT NULL
);
ALTER TABLE public.vip_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON public.vip_courses FOR ALL USING (true) WITH CHECK (true);

Detalhes do erro:`, error);
      return getLocalCourses();
    }
    
    if (!data || data.length === 0) {
      const localData = getLocalCourses();
      await seedCourses(localData);
      return localData;
    }
    
    return (data || []).map(fromVipCourseRecord) as VipCourse[];
  } catch (err) {
    console.warn('Erro inesperado ao buscar cursos do Supabase, utilizando fallback local seguro:', err);
    return getLocalCourses();
  }
}

// Model Action: Create Course (C)
export async function insertCourse(course: VipCourse): Promise<VipCourse> {
  const local = getLocalCourses();
  local.push(course);
  saveLocalCourses(local);

  if (!supabase) {
    return course;
  }

  try {
    const { data, error } = await supabase
      .from('vip_courses')
      .insert([toVipCourseRecord(course)])
      .select();

    if (error) {
      throw error;
    }
    return (data && data[0]) ? fromVipCourseRecord(data[0]) : course;
  } catch (err) {
    console.error('Error inserting course into Supabase:', err);
    return course;
  }
}

// Model Action: Update Course (U)
export async function updateCourse(id: string, updates: Partial<Omit<VipCourse, 'id'>>): Promise<VipCourse | null> {
  const local = getLocalCourses();
  const idx = local.findIndex(c => c.id === id);
  let updatedLocal: VipCourse | null = null;
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalCourses(local);
    updatedLocal = local[idx];
  }

  if (!supabase) {
    return updatedLocal;
  }

  try {
    const { data, error } = await supabase
      .from('vip_courses')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }
    return (data && data[0]) ? fromVipCourseRecord(data[0]) : updatedLocal;
  } catch (err) {
    console.error('Error updating course in Supabase:', err);
    return updatedLocal;
  }
}

// Model Action: Delete Course (D)
export async function deleteCourse(id: string): Promise<boolean> {
  const local = getLocalCourses();
  const filtered = local.filter(c => c.id !== id);
  saveLocalCourses(filtered);

  if (!supabase) {
    return true;
  }

}

// --- Local Storage Fallback Helpers ---
function getLocalDrinks(): Drink[] {
  try {
    const saved = localStorage.getItem('eventdrink_available_drinks');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalDrinks(data: Drink[]) {
  try {
    localStorage.setItem('eventdrink_available_drinks', JSON.stringify(data));
  } catch (e) {}
}

function getLocalOrders(): PastOrder[] {
  try {
    const saved = localStorage.getItem('eventdrink_orders');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalOrders(data: PastOrder[]) {
  try {
    localStorage.setItem('eventdrink_orders', JSON.stringify(data));
  } catch (e) {}
}

function getLocalStockMovements(): StockMovement[] {
  try {
    const saved = localStorage.getItem('eventdrink_stock_movements');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalStockMovements(data: StockMovement[]) {
  try {
    localStorage.setItem('eventdrink_stock_movements', JSON.stringify(data));
  } catch (e) {}
}

function getLocalCoupons(): Coupon[] {
  try {
    const saved = localStorage.getItem('eventdrink_coupons');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalCoupons(data: Coupon[]) {
  try {
    localStorage.setItem('eventdrink_coupons', JSON.stringify(data));
  } catch (e) {}
}

function getLocalReviews(): Review[] {
  try {
    const saved = localStorage.getItem('eventdrink_reviews');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalReviews(data: Review[]) {
  try {
    localStorage.setItem('eventdrink_reviews', JSON.stringify(data));
  } catch (e) {}
}

function getLocalAuditLogs(): AuditLog[] {
  try {
    const saved = localStorage.getItem('eventdrink_audit_logs');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}
function saveLocalAuditLogs(data: AuditLog[]) {
  try {
    localStorage.setItem('eventdrink_audit_logs', JSON.stringify(data));
  } catch (e) {}
}

// ---------------- Drink Entity Model (Catalog) ----------------
export async function getDrinks(): Promise<Drink[]> {
  if (!supabase) return getLocalDrinks();
  try {
    const { data, error } = await supabase.from('drinks').select('*, drink_categories!category_id (slug)').order('id', { ascending: true });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'drinks' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.drinks (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  "namePt" TEXT NOT NULL,\n` +
        `  "nameEn" TEXT NOT NULL,\n` +
        `  category TEXT NOT NULL,\n` +
        `  "categoryLabelPt" TEXT NOT NULL,\n` +
        `  "categoryLabelEn" TEXT NOT NULL,\n` +
        `  price NUMERIC NOT NULL,\n` +
        `  "imageUrl" TEXT NOT NULL,\n` +
        `  "recommendedPt" TEXT,\n` +
        `  "recommendedEn" TEXT,\n` +
        `  "inStock" BOOLEAN DEFAULT true,\n` +
        `  "unitPt" TEXT NOT NULL,\n` +
        `  "unitEn" TEXT NOT NULL,\n` +
        `  "stockQuantity" INTEGER DEFAULT 0,\n` +
        `  "minStockQuantity" INTEGER DEFAULT 0,\n` +
        `  "purchasePrice" NUMERIC DEFAULT 0,\n` +
        `  supplier TEXT,\n` +
        `  "expiryDate" TEXT,\n` +
        `  batch TEXT,\n` +
        `  status TEXT DEFAULT 'active'\n` +
        `);\n` +
        `ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.drinks FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalDrinks();
    }
    return (data || []).map((row: any) => {
      const mapped = fromDrinkRecord(row);
      if (row.drink_categories?.slug) {
        mapped.category = row.drink_categories.slug;
      }
      return mapped;
    }) as Drink[];
  } catch (e) {
    return getLocalDrinks();
  }
}

export async function insertDrink(drink: Drink): Promise<Drink> {
  const normalizedDrink: Drink = { ...drink, id: ensureUuid(drink.id) };
  const local = getLocalDrinks();
  local.push(normalizedDrink);
  saveLocalDrinks(local);
  if (!supabase) return normalizedDrink;
  try {
    const categoryId = await getCategoryIdBySlug(normalizedDrink.category);
    const payload = toSupabaseDrinkPayload(normalizedDrink, categoryId);
    const { error } = await supabase.from('drinks').insert([payload]);
    if (error) {
      console.error('Error inserting drink into Supabase:', error.message || error);
      return normalizedDrink;
    }
  } catch (e) {
    console.error('Error inserting drink into Supabase:', e);
  }
  return normalizedDrink;
}

export async function updateDrink(id: string, updates: Partial<Omit<Drink, 'id'>>): Promise<Drink | null> {
  const local = getLocalDrinks();
  const idx = local.findIndex(d => d.id === id);
  let updatedLocal: Drink | null = null;
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalDrinks(local);
    updatedLocal = local[idx];
  }
  if (!supabase) return updatedLocal;
  try {
    const payload = updates as Partial<Omit<Drink, 'id'>>;
    const normalized: any = { ...payload };
    if (payload.category) normalized.category_id = await getCategoryIdBySlug(payload.category);
    if (payload.namePt !== undefined) normalized.name_pt = payload.namePt;
    if (payload.nameEn !== undefined) normalized.name_en = payload.nameEn;
    if (payload.categoryLabelPt !== undefined) normalized.category_label_pt = payload.categoryLabelPt;
    if (payload.categoryLabelEn !== undefined) normalized.category_label_en = payload.categoryLabelEn;
    if (payload.imageUrl !== undefined) normalized.image_url = payload.imageUrl;
    if (payload.recommendedPt !== undefined) normalized.recommended_pt = payload.recommendedPt;
    if (payload.recommendedEn !== undefined) normalized.recommended_en = payload.recommendedEn;
    if (payload.inStock !== undefined) normalized.in_stock = payload.inStock;
    if (payload.unitPt !== undefined) normalized.unit_pt = payload.unitPt;
    if (payload.unitEn !== undefined) normalized.unit_en = payload.unitEn;
    if (payload.stockQuantity !== undefined) normalized.stock_quantity = payload.stockQuantity;
    if (payload.minStockQuantity !== undefined) normalized.min_stock_quantity = payload.minStockQuantity;
    if (payload.purchasePrice !== undefined) normalized.purchase_price = payload.purchasePrice;
    if (payload.supplier !== undefined) normalized.supplier = payload.supplier;
    if (payload.expiryDate !== undefined) normalized.expiry_date = payload.expiryDate;
    if (payload.batch !== undefined) normalized.batch = payload.batch;
    if (payload.status !== undefined) normalized.status = payload.status;
    if (payload.price !== undefined) normalized.price = payload.price;
    await supabase.from('drinks').update(normalized).eq('id', id);
  } catch (e) {
    console.error('Error updating drink in Supabase:', e);
  }
  return updatedLocal;
}

export async function deleteDrink(id: string): Promise<boolean> {
  const local = getLocalDrinks();
  const filtered = local.filter(d => d.id !== id);
  saveLocalDrinks(filtered);
  if (!supabase) return true;
  try {
    await supabase.from('drinks').delete().eq('id', id);
    return true;
  } catch (e) {
    console.error('Error deleting drink from Supabase:', e);
    return false;
  }
}

// ---------------- PastOrder Entity Model ----------------
export async function getOrders(): Promise<PastOrder[]> {
  if (!supabase) return getLocalOrders();
  try {
    const { data, error } = await supabase.from('orders').select('*, order_statuses!status_id (slug)').order('id', { ascending: false });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'orders' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.orders (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  "namePt" TEXT NOT NULL,\n` +
        `  "nameEn" TEXT NOT NULL,\n` +
        `  "datePt" TEXT NOT NULL,\n` +
        `  "dateEn" TEXT NOT NULL,\n` +
        `  guests INTEGER DEFAULT 0,\n` +
        `  "savedAmount" NUMERIC DEFAULT 0,\n` +
        `  status TEXT NOT NULL,\n` +
        `  rating INTEGER DEFAULT 0,\n` +
        `  score NUMERIC DEFAULT 0,\n` +
        `  total NUMERIC NOT NULL,\n` +
        `  "imageUrl" TEXT NOT NULL,\n` +
        `  items JSONB,\n` +
        `  "statusHistory" JSONB,\n` +
        `  address TEXT,\n` +
        `  "paymentMethod" TEXT,\n` +
        `  "userEmail" TEXT\n` +
        `);\n` +
        `ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.orders FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalOrders();
    }
    return (data || []).map((row: any) => {
      const mapped = fromOrderRecord(row);
      if (row.order_statuses?.slug) {
        mapped.status = row.order_statuses.slug;
      }
      return mapped;
    }) as PastOrder[];
  } catch (e) {
    return getLocalOrders();
  }
}

export async function insertOrder(order: PastOrder): Promise<PastOrder> {
  const local = getLocalOrders();
  local.push(order);
  saveLocalOrders(local);
  if (!supabase) return order;
  try {
    const statusId = await getStatusIdBySlug(order.status);
    const payload = { ...toOrderRecord(order), status_id: statusId ?? undefined };
    await supabase.from('orders').insert([payload]);
  } catch (e) {
    console.error('Error inserting order into Supabase:', e);
  }
  return order;
}

export async function updateOrder(id: string, updates: Partial<Omit<PastOrder, 'id'>>): Promise<PastOrder | null> {
  const local = getLocalOrders();
  const idx = local.findIndex(o => o.id === id);
  let updatedLocal: PastOrder | null = null;
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalOrders(local);
    updatedLocal = local[idx];
  }
  if (!supabase) return updatedLocal;
  try {
    const payload: any = { ...updates };
    if (updates.status) payload.status_id = await getStatusIdBySlug(updates.status);
    if (updates.namePt !== undefined) payload.name_pt = updates.namePt;
    if (updates.nameEn !== undefined) payload.name_en = updates.nameEn;
    if (updates.datePt !== undefined) payload.date_pt = updates.datePt;
    if (updates.dateEn !== undefined) payload.date_en = updates.dateEn;
    if (updates.guests !== undefined) payload.guests = updates.guests;
    if (updates.savedAmount !== undefined) payload.saved_amount = updates.savedAmount;
    if (updates.rating !== undefined) payload.rating = updates.rating;
    if (updates.score !== undefined) payload.score = updates.score;
    if (updates.total !== undefined) payload.total = updates.total;
    if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
    if (updates.items !== undefined) payload.items = updates.items;
    if (updates.statusHistory !== undefined) payload.status_history = updates.statusHistory;
    if (updates.address !== undefined) payload.address = updates.address;
    if (updates.paymentMethod !== undefined) payload.payment_method = updates.paymentMethod;
    if (updates.userEmail !== undefined) payload.user_email = updates.userEmail;
    await supabase.from('orders').update(payload).eq('id', id);
  } catch (e) {
    console.error('Error updating order in Supabase:', e);
  }
  return updatedLocal;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const local = getLocalOrders();
  const filtered = local.filter(o => o.id !== id);
  saveLocalOrders(filtered);
  if (!supabase) return true;
  try {
    await supabase.from('orders').delete().eq('id', id);
    return true;
  } catch (e) {
    console.error('Error deleting order from Supabase:', e);
    return false;
  }
}

// ---------------- StockMovement Entity Model ----------------
export async function getStockMovements(): Promise<StockMovement[]> {
  if (!supabase) return getLocalStockMovements();
  try {
    const { data, error } = await supabase.from('stock_movements').select('*').order('date', { ascending: false });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'stock_movements' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.stock_movements (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  "drinkId" TEXT NOT NULL,\n` +
        `  "drinkNamePt" TEXT NOT NULL,\n` +
        `  quantity INTEGER NOT NULL,\n` +
        `  type TEXT NOT NULL,\n` +
        `  "reasonPt" TEXT NOT NULL,\n` +
        `  "reasonEn" TEXT NOT NULL,\n` +
        `  date TEXT NOT NULL,\n` +
        `  "userEmail" TEXT NOT NULL\n` +
        `);\n` +
        `ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.stock_movements FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalStockMovements();
    }
    return (data || []).map(fromStockMovementRecord) as StockMovement[];
  } catch (e) {
    return getLocalStockMovements();
  }
}

export async function insertStockMovement(movement: StockMovement): Promise<StockMovement> {
  const local = getLocalStockMovements();
  local.unshift(movement);
  saveLocalStockMovements(local);
  if (!supabase) return movement;
  try {
    await supabase.from('stock_movements').insert([toStockMovementRecord(movement)]);
  } catch (e) {
    console.error('Error inserting stock movement:', e);
  }
  return movement;
}

// ---------------- Coupon Entity Model ----------------
export async function getCoupons(): Promise<Coupon[]> {
  if (!supabase) return getLocalCoupons();
  try {
    const { data, error } = await supabase.from('coupons').select('*').order('code', { ascending: true });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'coupons' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.coupons (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  code TEXT UNIQUE NOT NULL,\n` +
        `  type TEXT NOT NULL,\n` +
        `  value NUMERIC NOT NULL,\n` +
        `  "startDate" TEXT NOT NULL,\n` +
        `  "endDate" TEXT NOT NULL,\n` +
        `  "minOrderValue" NUMERIC DEFAULT 0,\n` +
        `  "maxUses" INTEGER DEFAULT 100,\n` +
        `  "usedCount" INTEGER DEFAULT 0,\n` +
        `  "maxPerUser" INTEGER DEFAULT 1\n` +
        `);\n` +
        `ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.coupons FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalCoupons();
    }
    return (data || []).map(fromCouponRecord) as Coupon[];
  } catch (e) {
    return getLocalCoupons();
  }
}

export async function insertCoupon(coupon: Coupon): Promise<Coupon> {
  const local = getLocalCoupons();
  local.push(coupon);
  saveLocalCoupons(local);
  if (!supabase) return coupon;
  try {
    await supabase.from('coupons').insert([toCouponRecord(coupon)]);
  } catch (e) {
    console.error('Error inserting coupon:', e);
  }
  return coupon;
}

export async function updateCoupon(id: string, updates: Partial<Omit<Coupon, 'id'>>): Promise<Coupon | null> {
  const local = getLocalCoupons();
  const idx = local.findIndex(c => c.id === id);
  let updatedLocal: Coupon | null = null;
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalCoupons(local);
    updatedLocal = local[idx];
  }
  if (!supabase) return updatedLocal;
  try {
    const payload: any = { ...updates };
    if (updates.startDate !== undefined) payload.start_date = updates.startDate;
    if (updates.endDate !== undefined) payload.end_date = updates.endDate;
    if (updates.minOrderValue !== undefined) payload.min_order_value = updates.minOrderValue;
    if (updates.maxUses !== undefined) payload.max_uses = updates.maxUses;
    if (updates.usedCount !== undefined) payload.used_count = updates.usedCount;
    if (updates.maxPerUser !== undefined) payload.max_per_user = updates.maxPerUser;
    await supabase.from('coupons').update(payload).eq('id', id);
  } catch (e) {
    console.error('Error updating coupon:', e);
  }
  return updatedLocal;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const local = getLocalCoupons();
  const filtered = local.filter(c => c.id !== id);
  saveLocalCoupons(filtered);
  if (!supabase) return true;
  try {
    await supabase.from('coupons').delete().eq('id', id);
    return true;
  } catch (e) {
    console.error('Error deleting coupon:', e);
    return false;
  }
}

// ---------------- Review Entity Model ----------------
export async function getReviews(): Promise<Review[]> {
  if (!supabase) return getLocalReviews();
  try {
    const { data, error } = await supabase.from('reviews').select('*').order('date', { ascending: false });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'reviews' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.reviews (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  "drinkId" TEXT NOT NULL,\n` +
        `  "userName" TEXT NOT NULL,\n` +
        `  rating INTEGER NOT NULL,\n` +
        `  comment TEXT NOT NULL,\n` +
        `  "photoUrl" TEXT,\n` +
        `  date TEXT NOT NULL,\n` +
        `  likes INTEGER DEFAULT 0,\n` +
        `  "likedBy" TEXT[],\n` +
        `  replies JSONB DEFAULT '[]'\n` +
        `);\n` +
        `ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.reviews FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalReviews();
    }
    return (data || []).map(fromReviewRecord) as Review[];
  } catch (e) {
    return getLocalReviews();
  }
}

export async function insertReview(review: Review): Promise<Review> {
  const local = getLocalReviews();
  local.unshift(review);
  saveLocalReviews(local);
  if (!supabase) return review;
  try {
    await supabase.from('reviews').insert([toReviewRecord(review)]);
  } catch (e) {
    console.error('Error inserting review:', e);
  }
  return review;
}

export async function updateReview(id: string, updates: Partial<Omit<Review, 'id'>>): Promise<Review | null> {
  const local = getLocalReviews();
  const idx = local.findIndex(r => r.id === id);
  let updatedLocal: Review | null = null;
  if (idx !== -1) {
    local[idx] = { ...local[idx], ...updates };
    saveLocalReviews(local);
    updatedLocal = local[idx];
  }
  if (!supabase) return updatedLocal;
  try {
    const payload: any = { ...updates };
    if (updates.drinkId !== undefined) payload.drink_id = updates.drinkId;
    if (updates.userName !== undefined) payload.user_name = updates.userName;
    if (updates.photoUrl !== undefined) payload.photo_url = updates.photoUrl;
    await supabase.from('reviews').update(payload).eq('id', id);
  } catch (e) {
    console.error('Error updating review:', e);
  }
  return updatedLocal;
}

export async function deleteReview(id: string): Promise<boolean> {
  const local = getLocalReviews();
  const filtered = local.filter(r => r.id !== id);
  saveLocalReviews(filtered);
  if (!supabase) return true;
  try {
    await supabase.from('reviews').delete().eq('id', id);
    return true;
  } catch (e) {
    console.error('Error deleting review:', e);
    return false;
  }
}

// ---------------- AuditLog Entity Model ----------------
export async function getAuditLogs(): Promise<AuditLog[]> {
  if (!supabase) return getLocalAuditLogs();
  try {
    const { data, error } = await supabase.from('audit_logs').select('*').order('date', { ascending: false });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'audit_logs' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.audit_logs (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  "userEmail" TEXT NOT NULL,\n` +
        `  "actionPt" TEXT NOT NULL,\n` +
        `  "actionEn" TEXT NOT NULL,\n` +
        `  date TEXT NOT NULL,\n` +
        `  hour TEXT NOT NULL,\n` +
        `  ip TEXT NOT NULL,\n` +
        `  browser TEXT NOT NULL,\n` +
        `  device TEXT NOT NULL\n` +
        `);\n` +
        `ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalAuditLogs();
    }
    return (data || []).map(fromAuditLogRecord) as AuditLog[];
  } catch (e) {
    return getLocalAuditLogs();
  }
}

export async function insertAuditLog(log: AuditLog): Promise<AuditLog> {
  const local = getLocalAuditLogs();
  local.unshift(log);
  saveLocalAuditLogs(local);
  if (!supabase) return log;
  try {
    await supabase.from('audit_logs').insert([toAuditLogRecord(log)]);
  } catch (e) {
    console.error('Error inserting audit log:', e);
  }
  return log;
}

// =============== SUPABASE STORAGE: DRINK IMAGES ===============

/**
 * Upload de imagem de bebida para Supabase Storage
 * @param file Arquivo de imagem (PNG, JPG, WebP, etc)
 * @param drinkId ID da bebida (para organizar pasta)
 * @returns URL pública da imagem ou null se erro
 */
export async function uploadDrinkImage(file: File, drinkId: string): Promise<string | null> {
  if (!supabase) {
    console.warn('Supabase não está configurado. Upload de imagem não disponível.');
    return null;
  }

  try {
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo inválido. Use JPG, PNG, WebP ou GIF.');
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo 5MB.');
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${drinkId}_${timestamp}_${file.name}`;
    const filePath = `drinks/${drinkId}/${fileName}`;

    console.log(`Uploading ${filePath}...`);

    // Upload do arquivo
    const { data, error } = await supabase.storage
      .from('drinks_images') // Nome do bucket (precisa ser criado no Supabase)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }

    // Gerar URL pública
    const { data: publicUrlData } = supabase.storage
      .from('drinks_images')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;
    console.log('Upload bem-sucedido! URL:', publicUrl);

    return publicUrl || null;
  } catch (err: any) {
    console.error('Erro no upload de imagem:', err);
    return null;
  }
}

/**
 * Deletar imagem de bebida do Supabase Storage
 * @param filePath Caminho completo do arquivo (ex: drinks/drink123/image.jpg)
 * @returns true se sucesso, false se erro
 */
export async function deleteDrinkImage(filePath: string): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase não está configurado. Delete de imagem não disponível.');
    return false;
  }

  try {
    if (!filePath) return false;

    console.log(`Deletando ${filePath}...`);

    const { error } = await supabase.storage
      .from('drinks_images')
      .remove([filePath]);

    if (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }

    console.log('Imagem deletada com sucesso!');
    return true;
  } catch (err: any) {
    console.error('Erro ao deletar imagem:', err);
    return false;
  }
}

/**
 * Extrair file path de uma URL pública de imagem
 * Útil para deletar imagens usando apenas a URL pública
 * @param publicUrl URL pública completa
 * @returns File path ou null
 */
export function extractFilePathFromUrl(publicUrl: string): string | null {
  try {
    // URL formato: https://xxxxx.supabase.co/storage/v1/object/public/drinks_images/drinks/drinkId/filename
    const parts = publicUrl.split('/drinks_images/');
    if (parts.length > 1) {
      return 'drinks_images/' + parts[1];
    }
    return null;
  } catch (err) {
    return null;
  }
}

// =============== END SUPABASE STORAGE ===============

// ---------------- UserAccounts Entity Model ----------------

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthDate: string;
  badge: 'Premium Host' | 'VIP Member' | 'Basic Organizer' | 'Gerente Geral' | 'Funcionário Operacional';
  role: UserRole;
  createdAt: string;
}

export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const DEFAULT_ADMIN_ACCOUNT: UserAccount = {
  id: 'admin-default',
  name: 'Administrador EventDrink',
  email: 'admin@eventdrink.com',
  password: '123456',
  birthDate: '1990-01-01',
  badge: 'Premium Host',
  role: 'ADMIN',
  createdAt: new Date().toISOString(),
};

export function getLocalUserAccounts(): UserAccount[] {
  try {
    const saved = localStorage.getItem('eventdrink_users_accounts_list');
    if (saved) {
      const parsed = JSON.parse(saved) as UserAccount[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}

  const seeded = [DEFAULT_ADMIN_ACCOUNT];
  saveLocalUserAccounts(seeded);
  return seeded;
}

export function saveLocalUserAccounts(accounts: UserAccount[]) {
  try {
    localStorage.setItem('eventdrink_users_accounts_list', JSON.stringify(accounts));
  } catch (e) {}
}

export async function getUserAccounts(): Promise<UserAccount[]> {
  if (!supabase) return getLocalUserAccounts();
  try {
    const { data, error } = await supabase.from('user_accounts').select('*, user_badges(name)').order('created_at', { ascending: false });
    if (error) {
      console.warn(`[Configuração Supabase] A tabela 'user_accounts' não pôde ser consultada. DDL para criar:\n` +
        `CREATE TABLE IF NOT EXISTS public.user_accounts (\n` +
        `  id TEXT PRIMARY KEY,\n` +
        `  name TEXT NOT NULL,\n` +
        `  email TEXT UNIQUE NOT NULL,\n` +
        `  password TEXT NOT NULL,\n` +
        `  phone TEXT,\n` +
        `  "birthDate" TEXT NOT NULL,\n` +
        `  badge_id UUID REFERENCES public.user_badges(id),\n` +
        `  role TEXT NOT NULL,\n` +
        `  "createdAt" TEXT NOT NULL,\n` +
        `  CONSTRAINT check_age CHECK (\n` +
        `    (cast("birthDate" as date)) <= (CURRENT_DATE - INTERVAL '18 years')\n` +
        `  )\n` +
        `);\n` +
        `ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;\n` +
        `CREATE POLICY "Allow public access" ON public.user_accounts FOR ALL USING (true) WITH CHECK (true);`);
      return getLocalUserAccounts();
    }
    return (data || []).map(fromUserAccountRecord) as UserAccount[];
  } catch (e) {
    return getLocalUserAccounts();
  }
}

export async function registerUserAccount(account: UserAccount): Promise<UserAccount> {
  const age = calculateAge(account.birthDate);

  if (age < 18) {
    throw new Error('Cadastro negado: Você deve ter pelo menos 18 anos de idade.');
  }

  // Não permite cadastro sem conexão com o Supabase
  if (!supabase) {
    throw new Error('Supabase não está configurado.');
  }

  // Verifica se o e-mail já existe no banco
  const { data: existing, error: checkError } = await supabase
    .from('user_accounts')
    .select('id')
    .eq('email', account.email)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existing) {
    throw new Error('E-mail já cadastrado.');
  }

  const badgeId = await getBadgeIdByName(account.badge);

  const payload = {
    ...toUserAccountRecord(account),
    badge_id: badgeId ?? null
  };

  const { error } = await supabase
    .from('user_accounts')
    .insert(payload);

  if (error) {
    if (error.message?.includes('check_age')) {
      throw new Error('Cadastro recusado: usuário menor de 18 anos.');
    }

    throw new Error(error.message);
  }

  return account;
}

export async function loginUserAccount(email: string, passwordStr: string): Promise<UserAccount> {
  const local = getLocalUserAccounts();
  const foundLocal = local.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === passwordStr);
  
  if (foundLocal) {
    const age = calculateAge(foundLocal.birthDate);
    if (age < 18) {
      throw new Error('Acesso recusado no servidor: Usuário menor de idade verificado no backend.');
    }
  }

  if (!supabase) {
    if (foundLocal) return foundLocal;
    throw new Error('Credenciais inválidas ou conta não encontrada.');
  }

  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*, user_badges(name)')
      .eq('email', email)
      .eq('password', passwordStr)
      .limit(1);

    if (error) {
      if (foundLocal) return foundLocal;
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      if (foundLocal) return foundLocal;
      throw new Error('Credenciais inválidas ou conta não encontrada.');
    }

    const account = fromUserAccountRecord(data[0]);
    const age = calculateAge(account.birthDate);
    if (age < 18) {
      throw new Error('Acesso bloqueado no backend (Supabase): Usuário menor de 18 anos.');
    }

    return account;
  } catch (e: any) {
    console.error('Error logging in user:', e);
    throw e;
  }
}


