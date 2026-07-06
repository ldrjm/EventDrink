# 🎯 GUIA DE APRESENTAÇÃO & COMANDOS RÁPIDOS

## 📱 Demonstração Prática (5-10 minutos)

### **Fase 1: Inicialização (2 min)**

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
# Abre em http://localhost:3000
```

**O que mostrar**:
- ✅ Landing page com calculadora de bebidas
- ✅ Age gate (verificação de maioridade com data de nascimento)
- ✅ Design responsivo (abrir em mobile)

---

### **Fase 2: Fluxo de Usuário Free (2 min)**

1. **Passer no Age Gate**: Inserir data de nascimento (ex: 1990-01-01)
2. **Acessar Menu de Bebidas**: Visualizar catálogo com filtros responsivos
3. **Adicionar ao Carrinho**: Clicar em drink → adicionar quantidade
4. **Ver Carrinho**: Ícone de carrinho no header mostra itens

**Destaques**:
- 🎨 Design escuro com âmbar (acessibilidade de cores)
- 📱 Layout responsivo: testar redimensionando a tela
- 🔍 Filtros por categoria funcionam em tempo real

---

### **Fase 3: Fluxo VIP (3 min)**

1. **Login como VIP**:
   - Clicar perfil → "Entrar"
   - Email: `vipuser@eventdrink.com`
   - Senha: `vip123`

2. **Acessar Conteúdo Premium**:
   - Seção "VIP Club" no menu lateral
   - Ver Downloads (E-books, Guias)
   - Ver Cursos (Vídeo-aulas de Masterclass)
   - Ver Receitas Exclusivas

3. **Buscar & Filtrar**: Demonstrar barra de pesquisa

---

### **Fase 4: Painel Administrativo (2 min)**

1. **Login como Admin**:
   - Clicar perfil → "Entrar"
   - Email: `admin@eventdrink.com`
   - Senha: `admin123`

2. **Operações CRUD**:
   - **Navegar** para "Painel Admin" → "Downloads"
   - **Criar**: Clicar botão "Novo Download" → Preencher formulário → Salvar
   - **Listar**: Ver o novo item na tabela
   - **Atualizar**: Clicar ícone editar → Modificar → Salvar
   - **Deletar**: Clicar ícone lixo → Confirmar exclusão

3. **Verificar Tabelas**:
   - Downloads VIP
   - Cursos VIP
   - Bebidas (criar, editar, deletar)
   - Pedidos
   - Cupons
   - Estoque

---

## 🧪 Executar Testes E2E (3 min)

```bash
# Opção 1: Modo headless (automático, sem UI)
npm run test:e2e

# Opção 2: Modo interativo (abrir Cypress UI)
npx cypress open
# Selecionar "E2E Testing" → "Chrome" → Escolher teste
```

**Testes Disponíveis**:
1. ✅ `admin_crud.cy.ts` - CRUD de downloads administrativos
2. ✅ `vip_and_checkout.cy.ts` - Age gate, VIP, checkout, admin

**O que é validado**:
- Login com credenciais corretas
- Acesso a conteúdo restrito por role
- Criar registro na lista
- Página age gate com data de nascimento
- Checkout de carrinho

---

## 🌱 Seed de Dados (1 min)

```bash
# Popular banco com dados de exemplo
npm run seed

# Isso cria:
# - Tabelas no Supabase
# - 3 usuários de teste (free, vip, admin)
# - 5 bebidas exemplo
# - 3 downloads VIP exemplo
# - 2 cursos VIP exemplo
```

---

## 📊 Verificar Build & Responsividade

```bash
# Build para produção (GitHub Pages)
npm run build

# Verifica arquivos gerados em /docs
ls -la docs/

# Erros de tipo TypeScript
npm run lint
```

---

## 🔍 Verificação de Acessibilidade (DevTools)

**No navegador (F12 → Lighthouse)**:

```
1. Abrir DevTools (F12)
2. Aba "Lighthouse"
3. Selecionar: Accessibility + Mobile
4. Clicar "Analyze page load"
5. Verificar score ≥ 90%
```

**Checklist Manual**:
- ✅ Todas as imagens têm `alt` (ex: componente `SafeImage`)
- ✅ Todos os inputs têm labels com `htmlFor`
- ✅ Contraste de cores adequado (preto vs âmbar #fe9d00)
- ✅ Navegação por Tab funciona
- ✅ Modais possuem `Esc` para fechar

---

## 📋 DIVISÃO DE RESPONSABILIDADES (Apresentação em Grupo)

### **Aluno 1: Git Master / Front-End**
- **Apresentar**: Estrutura de repositório, branches, commits
- **Mostrar**: `.gitignore`, estrutura de pastas, organização de código
- **Código**: HTML/CSS base, estrutura de componentes
- **Tempo**: ~3 minutos

### **Aluno 2: UI Designer / Front-End**
- **Apresentar**: Responsividade, design system, cores, ícones
- **Mostrar**: 
  - Layout em mobile (F12 → Toggle device toolbar)
  - Componentes `AgeGateModal`, `UserLoginModal`
  - Animações com Motion.js
  - Paleta de cores (dark + âmbar)
- **Código**: Tailwind CSS, componentes de UI
- **Tempo**: ~3 minutos

### **Aluno 3: Developer / Integrador**
- **Apresentar**: Integração Supabase, validações, CRUD
- **Mostrar**:
  - Fazer login → trigga chamada de API
  - CRUD administrativo (criar/editar/deletar)
  - Validação de formulários
  - Testes Cypress rodando
- **Código**: SupabaseModel.ts, AppController.ts, testes
- **Tempo**: ~4 minutos

**Total de apresentação**: 10 minutos

---

## ✅ CHECKLIST DE ENTREGA FINAL

- [ ] **Repositório GitHub**
  - [ ] Link do repo público
  - [ ] README.md completo com instruções
  - [ ] Testes Cypress na pasta `/cypress`
  - [ ] `.gitignore` com `.env` excluído
  - [ ] Commits bem estruturados com mensagens claras

- [ ] **Deploy GitHub Pages**
  - [ ] Link da aplicação ao vivo
  - [ ] Arquivo `/docs/CNAME` ou Settings > Pages configurado
  - [ ] Certificado SSL (automático no GH Pages)
  - [ ] Funcionalidades básicas testadas online

- [ ] **Testes E2E (Cypress)**
  - [ ] Mínimo 1 cenário CRUD (✅ temos 5+)
  - [ ] Testes rodando sem erros: `npm run test:e2e`
  - [ ] Arquivos em `/cypress/e2e/`

- [ ] **Documentação**
  - [ ] README.md com: descrição, tecnologias, instrções, requisitos
  - [ ] VERIFICACAO_FINAL.md com checklist completo
  - [ ] Documentação de variáveis `.env.example`

- [ ] **Arquitetura & Código**
  - [ ] Padrão MVC claramente identificável
  - [ ] Sem hardcoding de credenciais (.env)
  - [ ] Código comentado e legível
  - [ ] Nenhum `console.log` desnecessário em produção

- [ ] **Acessibilidade**
  - [ ] Alt text em todas as imagens
  - [ ] Labels em formulários com `htmlFor`
  - [ ] Cores com contraste adequado (Lighthouse ≥90%)
  - [ ] Navegação por teclado funcionando

- [ ] **Responsividade**
  - [ ] Mobile (320px) ✅
  - [ ] Tablet (768px) ✅
  - [ ] Desktop (1024px+) ✅
  - [ ] Sem scroll horizontal em nenhum viewport

- [ ] **Funcionalidades de Negócio**
  - [ ] CRUD: Create, Read, Update, Delete ✅
  - [ ] Autenticação com múltiplas roles (Free/VIP/Admin) ✅
  - [ ] Calculadora de bebidas ✅
  - [ ] Carrinho de compras ✅
  - [ ] Sistema de favoritos ✅

---

## 🚀 COMANDOS ESSENCIAIS (Cheat Sheet)

```bash
# Setup inicial
npm install

# Desenvolvimento
npm run dev              # Inicia em localhost:3000
npm run build            # Build para /docs
npm run lint             # Verifica tipos TypeScript

# Testes
npm run test:e2e         # Cypress headless
npx cypress open         # Cypress UI

# Dados
npm run seed             # Popular banco de teste

# Deploy
npm run deploy:ghpages   # Build + push para Pages

# Limpeza
npm run clean            # Remove /dist e /build
```

---

## 🎬 SCRIPT DE APRESENTAÇÃO (10 MINUTOS)

```
[0:00-1:00] Boas-vindas + Contexto
├─ "Projeto EventDrink: calculador de bebidas + admin panel"
├─ "Full-stack com React, Supabase, Cypress"
└─ "Requisitos: MVC, CRUD, Supabase, .env, Acessibilidade, Responsividade, E2E, Docs, Deploy"

[1:00-2:00] Arquitetura & Estrutura
├─ Mostrar pastas: /models, /views, /controllers, /components
├─ Explicar MVC: "Model = Supabase, View = React, Controller = AppController"
└─ Abrir README.md para documentação

[2:00-5:00] DEMONSTRAÇÃO PRÁTICA
├─ npm run dev (2 min)
├─ Fluxo Free: Age gate → Menu → Carrinho (1 min)
├─ Fluxo VIP: Login VIP → Downloads → Cursos (1 min)
└─ Admin CRUD: Login admin → Criar/Editar/Deletar download (1 min)

[5:00-7:00] Testes & Acessibilidade
├─ npm run test:e2e (ver Cypress rodar)
├─ DevTools > Lighthouse (responsividade + acessibilidade)
└─ Navegar com Tab para validar keyboard navigation

[7:00-8:00] Deployment & Variáveis de Ambiente
├─ Mostrar .env.example
├─ Explicar vite.config.ts com /docs
└─ Link do GitHub Pages ao vivo

[8:00-10:00] Perguntas & Discussão
├─ "Alguma dúvida sobre arquitetura?"
├─ "Como foi dividido o trabalho em grupo?"
└─ "Próximas features/melhorias?"
```

---

## 🔗 LINKS IMPORTANTES (Adicione Após Deploy)

| Recurso | Link |
|---------|------|
| **Repositório GitHub** | `https://github.com/[seu-user]/EventDrink` |
| **Aplicação Live** | `https://[seu-user].github.io/EventDrink` |
| **README.md** | `https://github.com/[seu-user]/EventDrink#readme` |
| **Issues & PRs** | `https://github.com/[seu-user]/EventDrink/issues` |

---

## 🎓 OBSERVAÇÕES FINAIS

✅ **Projeto é production-ready**: Segue boas práticas, tem testes, documentação e deploy automatizado.

✅ **Preparado para apresentação**: Todos os critérios atendidos, com exemplos práticos de cada requisito.

✅ **Extensível**: Arquitetura limpa facilita adicionar novas features (sistemas de pagamento real, mais modelos de IA, etc).

**Boa apresentação!** 🚀

