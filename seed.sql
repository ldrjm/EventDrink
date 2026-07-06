-- Development seed data only. Do not run in production.
create extension if not exists pgcrypto;

insert into public.suppliers (id, name, contact, phone, email)
values
  ('6a4b14ba-1f4e-4f71-b74e-1d2b2f8bd111', 'Distribuidora Aliança', 'Roberto', '(11) 98765-4321', 'vendas@alianca.com.br'),
  ('f0f1eac3-d4b5-4ec5-9e7e-58f3a2c4d6b7', 'Adega Real Premium', 'Clara', '(11) 97711-2233', 'clara@adegareal.com'),
  ('d2b7e3c4-5f6a-4b8c-9d10-ef1234567890', 'Select Spirits Co.', 'Mariana', '(11) 99876-5432', 'mariana@selectspirits.com.br'),
  ('c4d3b2a1-6f78-4e9d-b01c-2f3456789012', 'Bebidas Sofisticadas Ltda.', 'Lucas', '(11) 96666-5555', 'lucas@bebidassofisticadas.com')
on conflict (id) do nothing;

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, is_super_admin, created_at, updated_at, is_sso_user, is_anonymous
)
values
  (
    '44444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'free@eventdrink.com',
    crypt('free123', gen_salt('bf')),
    current_timestamp,
    '{"name": "Usuário Free"}'::jsonb,
    '{}'::jsonb,
    false,
    current_timestamp,
    current_timestamp,
    false,
    false
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'authenticated',
    'authenticated',
    'vipuser@eventdrink.com',
    crypt('vip123', gen_salt('bf')),
    current_timestamp,
    '{"name": "Usuário VIP"}'::jsonb,
    '{}'::jsonb,
    false,
    current_timestamp,
    current_timestamp,
    false,
    false
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'authenticated',
    'authenticated',
    'admin@eventdrink.com',
    crypt('admin123', gen_salt('bf')),
    current_timestamp,
    '{"name": "Administrador"}'::jsonb,
    '{}'::jsonb,
    false,
    current_timestamp,
    current_timestamp,
    false,
    false
  )
on conflict (id) do nothing;

insert into public.user_badges (slug, name)
values
  ('premium-host', 'Premium Host'),
  ('vip-member', 'VIP Member'),
  ('basic-organizer', 'Basic Organizer')
on conflict (slug) do nothing;

insert into public.user_accounts (
  id, auth_id, name, email, password, phone, birth_date, badge_id, role, created_at, updated_at, is_active, events_count
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'Usuário Free',
    'free@eventdrink.com',
    'free123',
    '(11) 90000-0000',
    '1990-01-01',
    (select id from public.user_badges where slug = 'basic-organizer'),
    'FREE',
    current_timestamp,
    current_timestamp,
    true,
    0
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '55555555-5555-5555-5555-555555555555',
    'Usuário VIP',
    'vipuser@eventdrink.com',
    'vip123',
    '(11) 91111-1111',
    '1988-08-08',
    (select id from public.user_badges where slug = 'vip-member'),
    'VIP',
    current_timestamp,
    current_timestamp,
    true,
    0
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '66666666-6666-6666-6666-666666666666',
    'Administrador',
    'admin@eventdrink.com',
    'admin123',
    '(11) 92222-2222',
    '1985-05-05',
    (select id from public.user_badges where slug = 'premium-host'),
    'ADMIN',
    current_timestamp,
    current_timestamp,
    true,
    0
  )
on conflict (id) do nothing;

insert into public.drinks (
  id, name_pt, name_en, category_id, category_label_pt, category_label_en, price, image_url,
  recommended_pt, recommended_en, in_stock, unit_pt, unit_en, stock_quantity, min_stock_quantity,
  purchase_price, supplier_id, expiry_date, batch, status
)
values
  (
    '7eb86a4a-6a83-4f5e-8c43-3cb7dbddb7d0', 'Gin Tônica Premium', 'Premium Gin Tonic',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 42.00,
    'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    'Ideal para eventos sofisticados.', 'Ideal for premium events.', true, 'Unidade', 'Unit', 24, 6,
    24.00, '6a4b14ba-1f4e-4f71-b74e-1d2b2f8bd111', current_date + interval '180 days', 'LOT-001', 'active'
  ),
  (
    '1df634f5-36c2-4fab-8c43-c28f39d84b7b', 'Espumante Rosé', 'Rosé Sparkling Wine',
    (select id from public.drink_categories where slug = 'wines'),
    'Vinhos & Espumantes', 'Wines & Sparklings', 68.00,
    'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=800&q=80',
    'Excelente para abertura de eventos.', 'Excellent for grand openings.', true, 'Garrafas', 'Bottles', 18, 4,
    39.00, 'f0f1eac3-d4b5-4ec5-9e7e-58f3a2c4d6b7', current_date + interval '240 days', 'LOT-002', 'active'
  ),
  (
    'ec9bfa3d-74f6-41d7-b0e2-1fc311d2a7ad', 'Cerveja IPA Artesanal', 'Craft IPA Beer',
    (select id from public.drink_categories where slug = 'beers'),
    'Cervejas & Chopp', 'Beers & Drafts', 29.50,
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    'Aroma cítrico e amargor equilibrado.', 'Citrus aroma and balanced bitterness.', true, 'Garrafas', 'Bottles', 32, 8,
    16.00, 'd2b7e3c4-5f6a-4b8c-9d10-ef1234567890', current_date + interval '120 days', 'LOT-003', 'active'
  ),
  (
    'b1f7c2d4-9e8f-4a0b-8c5d-3a2b1c4d5e6f', 'Vodka Premium Crystal', 'Premium Crystal Vodka',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 105.00,
    'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80',
    'Suave no paladar com final gelado.', 'Smooth on the palate with a crisp finish.', true, 'Garrafas', 'Bottles', 12, 4,
    58.00, 'c4d3b2a1-6f78-4e9d-b01c-2f3456789012', current_date + interval '240 days', 'LOT-004', 'active'
  ),
  (
    'd6a7e5b2-1f4c-4e5d-8f9b-2a3c4b5d6e7f', 'Suco de Uva Integral', 'Organic Grape Juice',
    (select id from public.drink_categories where slug = 'non_alcoholic'),
    'Refrigerantes & Sucos', 'Sodas & Juices', 22.00,
    'https://images.unsplash.com/photo-1519741497706-9d2b0b6f0b68?auto=format&fit=crop&w=800&q=80',
    'Refresco natural sem conservantes.', 'Natural refreshment with no preservatives.', true, 'Garrafas', 'Bottles', 26, 6,
    10.50, 'f0f1eac3-d4b5-4ec5-9e7e-58f3a2c4d6b7', current_date + interval '90 days', 'LOT-005', 'active'
  ),
  (
    'f3c1d2e4-5b6a-4f7c-8d9e-0a1b2c3d4e5f', 'Água Mineral Premium', 'Premium Mineral Water',
    (select id from public.drink_categories where slug = 'non_alcoholic'),
    'Refrigerantes & Sucos', 'Sodas & Juices', 8.50,
    'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80',
    'Água pura com pH equilibrado.', 'Pure water with balanced pH.', true, 'Garrafas', 'Bottles', 120, 24,
    3.20, 'c4d3b2a1-6f78-4e9d-b01c-2f3456789012', current_date + interval '360 days', 'LOT-006', 'active'
  )
on conflict (id) do nothing;

insert into public.vip_downloads (id, title, description, type, format, size, downloads)
values
  ('b457f511-4b6b-4df5-8f15-8f4f4ef3d442', 'Guia de Mixologia Premium', 'Checklist operacional e receitas exclusivas para eventos VIP.', 'E-book', 'PDF', '8.4 MB', 18),
  ('e2f61fd2-8d91-4b39-8d30-f53c3c9099ce', 'Planilha de Controle de Estoque', 'Modelo de cálculo de estoque para bares e eventos.', 'Calculator', 'XLSX', '1.2 MB', 7)
on conflict (id) do nothing;

insert into public.vip_courses (id, title, author, duration, difficulty, image_url, views, description)
values
  ('3572d5d4-1f6e-4ad1-ab4f-159f6404fc14', 'Masterclass de Defumação', 'Ana Souza', '18 min', 'Intermediário', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', '128', 'Técnicas de defumação e apresentação para bartenders premium.'),
  ('c7214d0f-b655-4f4d-8f97-4c8f87ad11c9', 'Cortes de Gelo e Finalização', 'Mateus Leal', '12 min', 'Fácil', 'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?auto=format&fit=crop&w=800&q=80', '89', 'Aprenda cortes e acabamento visual para servir com estilo.')
on conflict (id) do nothing;

insert into public.coupons (id, code, type, value, start_date, end_date, min_order_value, max_uses, used_count, max_per_user)
values
  ('1f1576b0-8ece-4c43-a6d3-24a6e7b8e83b', 'WELCOME10', 'percent', 10.00, current_date, current_date + interval '90 days', 100.00, 100, 0, 1),
  ('8d2f5029-23bf-4f65-8d4f-d621f1d0f712', 'VIPSHIP', 'free_shipping', 0.00, current_date, current_date + interval '60 days', 80.00, 50, 0, 1)
on conflict (id) do nothing;

insert into public.reviews (id, drink_id, user_id, user_name, rating, comment, photo_url)
values
  ('2653787d-4e64-4f0c-9f9a-e4f6f5e91c1a', '7eb86a4a-6a83-4f5e-8c43-3cb7dbddb7d0', null, 'Cliente Demo', 5, 'Excelente para eventos sofisticados.', null),
  ('d7dbb97d-2f0f-40a6-a2f3-b1a0f2f942f4', '1df634f5-36c2-4fab-8c43-c28f39d84b7b', null, 'Organizador Demo', 4, 'Muito bem recebido em festas de abertura.', null)
on conflict (id) do nothing;

insert into public.orders (id, user_email, name_pt, name_en, date_pt, date_en, guests, saved_amount, status_id, rating, score, total, image_url, address, payment_method)
values
  (
    'd4d1f0d0-a7cf-4308-9f3d-b136b7b1b5ee', 'demo@eventdrink.com', 'Evento de Lançamento', 'Launch Event', 'Hoje', 'Today', 80, 150.00,
    (select id from public.order_statuses where slug = 'delivered'), 5, 9.8, 1420.00,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    'Rua das Festas, 120', 'credit_card'
  )
on conflict (id) do nothing;

insert into public.order_items (id, order_id, drink_id, quantity, price, name_pt, name_en)
values
  ('0a4b7d7a-7e55-4d23-a0b5-196f4cb36533', 'd4d1f0d0-a7cf-4308-9f3d-b136b7b1b5ee', '7eb86a4a-6a83-4f5e-8c43-3cb7dbddb7d0', 20, 42.00, 'Gin Tônica Premium', 'Premium Gin Tonic')
on conflict (id) do nothing;

insert into public.order_status_history (order_id, status_id, note_pt, note_en)
values
  ('d4d1f0d0-a7cf-4308-9f3d-b136b7b1b5ee', (select id from public.order_statuses where slug = 'delivered'), 'Pedido concluído', 'Order completed')
on conflict do nothing;

insert into public.vip_downloads (id, title, description, type, format, size, downloads)
values
  ('a8f3c7e2-4f1a-44d9-b0e7-1c2d3f4a5b6c', 'Checklist de Bar Móvel', 'Checklist compacto para montar um bar móvel eficiente em qualquer evento.', 'Checklist', 'PDF', '3.8 MB', 12),
  ('f5d8a1b4-9e3c-4b0f-8a6b-2c1d3e4f5a6b', 'Cardápio Sensorial de Drinks', 'Guia com combos de sabores e aromas para criar experiências memoráveis.', 'Guide', 'PDF', '5.6 MB', 9)
on conflict (id) do nothing;

insert into public.vip_courses (id, title, author, duration, difficulty, image_url, views, description)
values
  ('9c3d1f5e-6a2b-4c7d-8e9f-7b0a1c2d3e4f', 'Bartending para Eventos Exclusivos', 'Camila Ribeiro', '25 min', 'Intermediário', 'https://images.unsplash.com/photo-1523473827532-cc44c82bbf91?auto=format&fit=crop&w=800&q=80', '95', 'Técnicas para atendimento e coquetelaria em eventos exclusivos.'),
  ('d4e5f6a7-8b9c-4d0e-1f2a-3b4c5d6e7f8a', 'Mixologia de Coquetéis sem Álcool', 'Felipe Santos', '20 min', 'Fácil', 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=800&q=80', '74', 'Receitas criativas e decoração para drinks sem álcool.' )
on conflict (id) do nothing;

insert into public.coupons (id, code, type, value, start_date, end_date, min_order_value, max_uses, used_count, max_per_user)
values
  ('7b6a5d4c-3e2f-4a1b-9c8d-0e1f2a3b4c5d', 'EVENT20', 'percent', 20.00, current_date, current_date + interval '120 days', 120.00, 75, 0, 1),
  ('c3b2a1d0-9e8f-4c7b-6a5d-3f2e1d0c9b8a', 'FREESHIP', 'free_shipping', 0.00, current_date, current_date + interval '90 days', 150.00, 40, 0, 1)
on conflict (id) do nothing;

insert into public.orders (id, user_email, name_pt, name_en, date_pt, date_en, guests, saved_amount, status_id, rating, score, total, image_url, address, payment_method)
values
  (
    'b8c4d5e6-f7a1-4b2c-8d9e-0f1a2b3c4d5e', 'evento@demo.com', 'Cocktail Corporativo', 'Corporate Cocktail', 'Amanhã', 'Tomorrow', 120, 200.00,
    (select id from public.order_statuses where slug = 'preparing'), 0, 0, 1980.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'Avenida dos Eventos, 250', 'bank_transfer'
  )
on conflict (id) do nothing;

insert into public.order_items (id, order_id, drink_id, quantity, price, name_pt, name_en)
values
  ('e7d6c5b4-a3f2-4d1c-9e8f-7b6a5c4d3e2f', 'b8c4d5e6-f7a1-4b2c-8d9e-0f1a2b3c4d5e', '1df634f5-36c2-4fab-8c43-c28f39d84b7b', 18, 68.00, 'Espumante Rosé', 'Rosé Sparkling Wine'),
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'b8c4d5e6-f7a1-4b2c-8d9e-0f1a2b3c4d5e', 'd6a7e5b2-1f4c-4e5d-8f9b-2a3c4b5d6e7f', 20, 22.00, 'Suco de Uva Integral', 'Organic Grape Juice')
on conflict (id) do nothing;

insert into public.order_status_history (order_id, status_id, note_pt, note_en)
values
  ('b8c4d5e6-f7a1-4b2c-8d9e-0f1a2b3c4d5e', (select id from public.order_statuses where slug = 'preparing'), 'Pedido em preparação', 'Order in preparation')
on conflict do nothing;

insert into public.suppliers (id, name, contact, phone, email)
values
  ('2d8f6c4b-7e9a-4c1d-8b2f-0a9c8d7e6f5a', 'Importadora Prime', 'Sofia', '(11) 94567-1234', 'sofia@importadoraprime.com.br'),
  ('4c3b2a1d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Casa dos Drinks', 'Thiago', '(11) 93456-7890', 'thiago@casadosdrinks.com.br')
on conflict (id) do nothing;

insert into public.drinks (
  id, name_pt, name_en, category_id, category_label_pt, category_label_en, price, image_url,
  recommended_pt, recommended_en, in_stock, unit_pt, unit_en, stock_quantity, min_stock_quantity,
  purchase_price, supplier_id, expiry_date, batch, status
)
values
  (
    'c2d4e6f8-0a1b-4c2d-8e3f-5a6b7c8d9e0f', 'Caipirinha Clássica', 'Classic Caipirinha',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 35.00,
    'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=800&q=80',
    'Clássico obrigatório em eventos brasileiros.', 'Classic must-have at Brazilian events.', true, 'Copos', 'Glasses', 40, 10,
    18.00, '2d8f6c4b-7e9a-4c1d-8b2f-0a9c8d7e6f5a', current_date + interval '120 days', 'LOT-007', 'active'
  ),
  (
    'd9e8f7a6-5b4c-3d2e-1f0a-9b8c7d6e5f4a', 'Vinho Branco Seco', 'Dry White Wine',
    (select id from public.drink_categories where slug = 'wines'),
    'Vinhos & Espumantes', 'Wines & Sparklings', 55.00,
    'https://images.unsplash.com/photo-1497551060073-4c5ab6435f2e?auto=format&fit=crop&w=800&q=80',
    'Fresco e elegante para brunch e coquetéis.', 'Fresh and elegant for brunches and cocktails.', true, 'Garrafas', 'Bottles', 20, 5,
    28.00, '4c3b2a1d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', current_date + interval '210 days', 'LOT-008', 'active'
  ),
  (
    'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 'Mojito sem Álcool', 'Virgin Mojito',
    (select id from public.drink_categories where slug = 'non_alcoholic'),
    'Refrigerantes & Sucos', 'Sodas & Juices', 24.00,
    'https://images.unsplash.com/photo-1523473827532-cc44c82bbf91?auto=format&fit=crop&w=800&q=80',
    'Refrescância e sabor sem álcool.', 'Refreshing flavor without alcohol.', true, 'Copos', 'Glasses', 30, 8,
    11.00, '2d8f6c4b-7e9a-4c1d-8b2f-0a9c8d7e6f5a', current_date + interval '90 days', 'LOT-009', 'active'
  )
on conflict (id) do nothing;

insert into public.drinks (
  id, name_pt, name_en, category_id, category_label_pt, category_label_en, price, image_url,
  recommended_pt, recommended_en, in_stock, unit_pt, unit_en, stock_quantity, min_stock_quantity,
  purchase_price, supplier_id, expiry_date, batch, status
)
values
  (
    'a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d', 'Gin Premium', 'Premium Gin',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 12.00,
    'https://images.unsplash.com/photo-1545696911-30f376a7e449?auto=format&fit=crop&w=600&q=80',
    'Espírito base para coquetéis clássicos.', 'Base spirit for classic cocktails.', true, 'Unidade', 'Unit', 120, 12,
    6.00, '6a4b14ba-1f4e-4f71-b74e-1d2b2f8bd111', current_date + interval '360 days', 'LOT-010', 'active'
  ),
  (
    'b2c3d4e5-6f7a-4b8c-9d0e-1f2a3b4c5d6e', 'Vodka Importada', 'Imported Vodka',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 10.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    'Vodka neutra para misturas elegantes.', 'Neutral vodka for elegant blends.', true, 'Unidade', 'Unit', 140, 14,
    5.50, '6a4b14ba-1f4e-4f71-b74e-1d2b2f8bd111', current_date + interval '360 days', 'LOT-011', 'active'
  ),
  (
    'c3d4e5f6-7a8b-4c9d-0e1f-2a3b4c5d6e7f', 'Whisky Single Malt', 'Single Malt Whisky',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 18.00,
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
    'Notas amadeiradas e final prolongado.', 'Woody notes and long finish.', true, 'Unidade', 'Unit', 80, 10,
    11.00, 'c4d3b2a1-6f78-4e9d-b01c-2f3456789012', current_date + interval '360 days', 'LOT-012', 'active'
  ),
  (
    'd4e5f6a7-8b9c-4d0e-1f2a-3b4c5d6e7f8a', 'Rum Spiced', 'Spiced Rum',
    (select id from public.drink_categories where slug = 'spirits'),
    'Destilados & Vodkas', 'Spirits & Vodkas', 9.50,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
    'Aroma quente com notas de especiarias.', 'Warm aroma with spice notes.', true, 'Unidade', 'Unit', 110, 12,
    5.80, 'c4d3b2a1-6f78-4e9d-b01c-2f3456789012', current_date + interval '360 days', 'LOT-013', 'active'
  ),
  (
    'e5f6a7b8-9c0d-4e1f-2a3b-4c5d6e7f8a9b', 'Água Tônica de Gengibre', 'Ginger Tonic Water',
    (select id from public.drink_categories where slug = 'non_alcoholic'),
    'Refrigerantes & Sucos', 'Sodas & Juices', 5.50,
    'https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=600&q=80',
    'Tônica com toque de gengibre para misturas refrescantes.', 'Tonic water with ginger twist for refreshing mixes.', true, 'Unidade', 'Unit', 180, 20,
    2.60, 'f0f1eac3-d4b5-4ec5-9e7e-58f3a2c4d6b7', current_date + interval '360 days', 'LOT-014', 'active'
  ),
  (
    'f6a7b8c9-0d1e-4f2a-3b4c-5d6e7f8a9b0c', 'Club Soda Artesanal', 'Artisanal Club Soda',
    (select id from public.drink_categories where slug = 'non_alcoholic'),
    'Refrigerantes & Sucos', 'Sodas & Juices', 4.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    'Carbonatação leve e sabor neutro para misturas.', 'Light carbonation and neutral flavor for blends.', true, 'Unidade', 'Unit', 200, 24,
    1.80, 'f0f1eac3-d4b5-4ec5-9e7e-58f3a2c4d6b7', current_date + interval '360 days', 'LOT-015', 'active'
  )
on conflict (id) do nothing;

insert into public.vip_downloads (id, title, description, type, format, size, downloads)
values
  ('795e6d4c-3b2a-4f1e-9c8d-0a1b2c3d4e5f', 'Estratégias de Experiência VIP', 'Mapa de jornada do cliente VIP para eventos exclusivos.', 'E-book', 'PDF', '7.1 MB', 14),
  ('0f1e2d3c-4b5a-6c7d-8e9f-0a1b2c3d4e5f', 'Receitas de Coquetéis para Eventos', 'Coleção de coquetéis sazonais para festas e lançamentos.', 'E-book', 'PDF', '6.2 MB', 11)
on conflict (id) do nothing;

insert into public.vip_courses (id, title, author, duration, difficulty, image_url, views, description)
values
  ('1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d', 'Planejamento de Eventos Gastronômicos', 'Laura Nunes', '22 min', 'Avançado', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', '83', 'Como integrar bebidas e gastronomia em eventos memoráveis.'),
  ('2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d', 'Mixologia Visual', 'Renato Lima', '16 min', 'Intermediário', 'https://images.unsplash.com/photo-1519741497706-9d2b0b6f0b68?auto=format&fit=crop&w=800&q=80', '68', 'Decoração e apresentação visual para coquetéis sofisticados.' )
on conflict (id) do nothing;

insert into public.coupons (id, code, type, value, start_date, end_date, min_order_value, max_uses, used_count, max_per_user)
values
  ('5f4e3d2c-1b0a-4c5d-6e7f-8a9b0c1d2e3f', 'PRIVATE15', 'percent', 15.00, current_date, current_date + interval '75 days', 130.00, 60, 0, 1)
on conflict (id) do nothing;

insert into public.reviews (id, drink_id, user_id, user_name, rating, comment, photo_url)
values
  ('8a7b6c5d-4e3f-2d1c-0b9a-8e7d6c5b4a3f', 'c2d4e6f8-0a1b-4c2d-8e3f-5a6b7c8d9e0f', null, 'Organizador VIP', 5, 'Perfeita para crowd animado.', null),
  ('0b9a8c7d-6e5f-4d3c-2b1a-9f8e7d6c5b4a', 'd9e8f7a6-5b4c-3d2e-1f0a-9b8c7d6e5f4a', null, 'Apreciador de Vinhos', 4, 'Vinho branco elegante e fresco.', null)
on conflict (id) do nothing;

insert into public.orders (id, user_email, name_pt, name_en, date_pt, date_en, guests, saved_amount, status_id, rating, score, total, image_url, address, payment_method)
values
  (
    'c5d4e3f2-1b0a-4c5d-6e7f-8a9b0c1d2e3f', 'vip@demo.com', 'Jantar de Gala', 'Gala Dinner', 'Próxima Semana', 'Next Week', 200, 280.00,
    (select id from public.order_statuses where slug = 'preparing'), 0, 0, 3120.00,
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    'Rua do Luxo, 75', 'credit_card'
  ),
  (
    'd6c5b4a3-2f1e-4d3c-9b8a-7e6f5d4c3b2a', 'festa@demo.com', 'Noite de Lançamento', 'Launch Night', 'Hoje à Noite', 'Tonight', 150, 180.00,
    (select id from public.order_statuses where slug = 'delivered'), 4, 8.5, 1670.00,
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    'Avenida da Música, 45', 'credit_card'
  )
on conflict (id) do nothing;

insert into public.order_items (id, order_id, drink_id, quantity, price, name_pt, name_en)
values
  ('f0e1d2c3-b4a5-4c6d-8e7f-0a1b2c3d4e5f', 'c5d4e3f2-1b0a-4c5d-6e7f-8a9b0c1d2e3f', 'c2d4e6f8-0a1b-4c2d-8e3f-5a6b7c8d9e0f', 25, 35.00, 'Caipirinha Clássica', 'Classic Caipirinha'),
  ('1f2e3d4c-5b6a-4c7d-8e9f-0a1b2c3d4e5f', 'c5d4e3f2-1b0a-4c5d-6e7f-8a9b0c1d2e3f', 'd9e8f7a6-5b4c-3d2e-1f0a-9b8c7d6e5f4a', 22, 55.00, 'Vinho Branco Seco', 'Dry White Wine'),
  ('2e3d4c5b-6a7f-4b8c-9d0e-1f2a3b4c5d6e', 'd6c5b4a3-2f1e-4d3c-9b8a-7e6f5d4c3b2a', 'e1f2a3b4-c5d6-4e7f-8a9b-0c1d2e3f4a5b', 30, 24.00, 'Mojito sem Álcool', 'Virgin Mojito')
on conflict (id) do nothing;

insert into public.order_status_history (order_id, status_id, note_pt, note_en)
values
  ('c5d4e3f2-1b0a-4c5d-6e7f-8a9b0c1d2e3f', (select id from public.order_statuses where slug = 'preparing'), 'Pedido aguardando confirmação', 'Order awaiting confirmation'),
  ('d6c5b4a3-2f1e-4d3c-9b8a-7e6f5d4c3b2a', (select id from public.order_statuses where slug = 'delivered'), 'Pedido entregue com sucesso', 'Order delivered successfully')
on conflict do nothing;
