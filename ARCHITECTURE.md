# 🏗️ Arquitetura MVC - EventDrink

## Estrutura Reorganizada

```
src/
├── pages/                    (V - Presentation Layer / Views)
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── DashboardFree.tsx
│   │   ├── DashboardVip.tsx
│   │   └── DashboardAdmin.tsx
│   ├── vip/
│   │   ├── VipClubPage.tsx
│   │   ├── VipRecipes.tsx
│   │   ├── VipVideos.tsx
│   │   └── VipDownloads.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminEvents.tsx
│   │   ├── AdminFinancial.tsx
│   │   ├── AdminDownloads.tsx
│   │   └── AdminCourses.tsx
│   ├── LandingPage.tsx
│   ├── ResultsPage.tsx
│   ├── MenuPage.tsx
│   ├── CartPage.tsx
│   ├── HistoryPage.tsx
│   ├── ProfilePage.tsx
│   ├── HelpPage.tsx
│   ├── ConfigPage.tsx
│   └── AssistantPage.tsx
│
├── components/               (V - Reusable Components)
│   ├── common/
│   │   ├── Logo.tsx
│   │   ├── SafeImage.tsx
│   │   └── ChatWidget.tsx
│   ├── modals/
│   │   ├── AgeGateModal.tsx
│   │   └── UserLoginModal.tsx
│   ├── features/
│   │   ├── DrinkCreator.tsx
│   │   ├── MenuHarmonizer.tsx
│   │   └── VIPLock.tsx
│   └── layout/
│       ├── MainLayout.tsx
│       ├── AdminLayout.tsx
│       └── VipLayout.tsx
│
├── controllers/              (C - Application Logic)
│   ├── AppController.ts      (Main orchestrator)
│   ├── drinkController.ts
│   ├── orderController.ts
│   ├── userController.ts
│   └── adminController.ts
│
├── services/                 (C - Business Logic)
│   ├── drinkService.ts
│   ├── orderService.ts
│   ├── userService.ts
│   ├── adminService.ts
│   ├── cartService.ts
│   ├── authService.ts
│   └── notificationService.ts
│
├── models/                   (M - Data Layer)
│   ├── SupabaseModel.ts      (Database client)
│   ├── entities/
│   │   ├── Drink.ts
│   │   ├── Order.ts
│   │   ├── User.ts
│   │   └── ...
│   └── repositories/
│       ├── DrinkRepository.ts
│       ├── OrderRepository.ts
│       └── UserRepository.ts
│
├── hooks/                    (React Hooks)
│   ├── useAppController.ts
│   ├── useDrinks.ts
│   ├── useOrders.ts
│   ├── useUser.ts
│   └── useCart.ts
│
├── utils/                    (Utilities)
│   ├── calculator.ts
│   ├── validators.ts
│   ├── formatters.ts
│   └── helpers.ts
│
├── constants/                (Constants)
│   ├── translations.ts
│   ├── config.ts
│   └── ...
│
├── types/                    (TypeScript Types)
│   ├── index.ts
│   └── entities.ts
│
├── assets/                   (Static Resources)
│   └── images/
│
├── App.tsx                   (Root component)
├── main.tsx                  (Entry point)
└── index.css                 (Global styles)
```

## Convenções de Naming

### Pages (V - View Layer)
- **Arquivo**: `PascalCase` + `Page.tsx`
- **Exemplo**: `DashboardPage.tsx`, `MenuPage.tsx`
- **Responsabilidade**: 
  - Renderizar tela completa
  - Orquestrar componentes
  - Chamar controllers/services
  - Passar dados para componentes filhos

### Components (V - Reusable UI)
- **Arquivo**: `PascalCase.tsx`
- **Exemplo**: `DrinkCreator.tsx`, `AgeGateModal.tsx`
- **Responsabilidade**:
  - Apresentação pura (UI)
  - Props bem definidas
  - Callbacks para eventos
  - NÃO chamar serviços direto

### Controllers (C - Orchestration)
- **Arquivo**: `camelCase` + `Controller.ts`
- **Exemplo**: `appController.ts`, `drinkController.ts`
- **Responsabilidade**:
  - Orquestrar chamadas de serviços
  - Gerenciar estado compartilhado
  - Coordenar lógica de negócio
  - NÃO conter lógica de UI

### Services (C - Business Logic)
- **Arquivo**: `camelCase` + `Service.ts`
- **Exemplo**: `drinkService.ts`, `userService.ts`
- **Responsabilidade**:
  - Lógica de negócio pura
  - Validações
  - Orquestração de repositories
  - NÃO ser específico a UI

### Models (M - Data Layer)
- **Arquivo**: `camelCase` + `.ts`
- **Exemplo**: `SupabaseModel.ts`
- **Responsabilidade**:
  - Comunicação com banco
  - CRUD operations
  - Queries
  - NÃO conter lógica de negócio

### Hooks (React Custom Hooks)
- **Arquivo**: `camelCase` + `.ts`
- **Exemplo**: `useDrinks.ts`, `useCart.ts`
- **Responsabilidade**:
  - Lógica reutilizável React
  - Estado e side effects
  - Custom logic encapsulado

## Fluxo de Dados

```
User Interaction (Page/Component)
    ↓
Event Handler (onClick, onChange, etc)
    ↓
Controller (AppController, drinkController, etc)
    ↓
Service (drinkService, userService, etc)
    ↓
Repository (DrinkRepository, UserRepository, etc)
    ↓
Model (SupabaseModel - DB Client)
    ↓
Database (Supabase)

Response Flow:
Database → Model → Repository → Service → Controller → State/Hook → Component/Page
```

## Exemplos de Chamadas

### ✅ Correto - Separação clara

**Page** (DashboardPage.tsx):
```typescript
const { drinks, orders, loading } = useAppController();
return <DashboardContent drinks={drinks} orders={orders} />;
```

**Component** (DrinkCard.tsx):
```typescript
const DrinkCard = ({ drink, onSelect }) => (
  <button onClick={() => onSelect(drink)}>
    {drink.name}
  </button>
);
```

**Controller** (drinkController.ts):
```typescript
export const getDrinksForEvent = async (eventType) => {
  return drinkService.filterByEventType(eventType);
};
```

**Service** (drinkService.ts):
```typescript
export const filterByEventType = async (eventType) => {
  const drinks = await DrinkRepository.getAll();
  return drinks.filter(d => d.eventTypes.includes(eventType));
};
```

**Repository** (DrinkRepository.ts):
```typescript
export const getAll = async () => {
  return SupabaseModel.getDrinks();
};
```

### ❌ Errado - Mistura de responsabilidades

```typescript
// ❌ Components chamando services direto
<button onClick={() => drinkService.getDrinks()}>

// ❌ Views com lógica de negócio
const events = drinks.filter(...).sort(...).map(...);

// ❌ Components com estado global
const [globalState, setGlobalState] = useState({...app});

// ❌ Models com lógica de validação complexa
supabase.from('drinks').where('event_type', 'eq', eventType);
```

## Benefícios

1. **Clareza**: Cada arquivo tem responsabilidade única
2. **Testabilidade**: Fácil testar services e controllers sem UI
3. **Reusabilidade**: Componentes podem ser usados em diferentes contextos
4. **Manutenibilidade**: Bug em UI? Procure em components/pages
5. **Escalabilidade**: Fácil adicionar novas features
6. **Onboarding**: Novo dev entende estrutura rápido

## Migração

**Fase 1**: Renomear e mover (sem mudar código)
**Fase 2**: Separar responsabilidades
**Fase 3**: Criar repositories
**Fase 4**: Criar services
**Fase 5**: Refatorar controllers
**Fase 6**: Testar tudo
