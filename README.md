# EventDrink Pro v4.0 🍹✨

O EventDrink Pro é um sofisticado calculador de bebidas e gerenciador de inventário para reuniões e eventos (full-stack), projetado para anfitriões premium e organizadores de eventos. O sistema oferece matrizes de planejamento inteligentes, um painel dinâmico de receitas de coquetéis, ferramentas personalizadas para criação de bebidas e recursos administrativos completos.

---

## 🏗️ Divisão da Arquitetura MVC (Requisitos Técnicos Obrigatórios)

Para cumprir com os rigorosos padrões arquiteturais de nível de produção, a aplicação implementa o padrão de design limpo **Model-View-Controller (MVC)**:

1. **Model (`/src/models/SupabaseModel.ts`)**:
   - Lida com as definições de dados de baixo nível, protocolos de conexão e consultas ao armazenamento em nuvem.
   - Encapsula as operações em nuvem para comunicação de banco de dados com o **Supabase**, incluindo mecanismos integrados de fallback de segurança para o armazenamento local caso as credenciais de conexão não estejam configuradas.

2. **Controller (`/src/controllers/AppController.ts`)**:
   - A máquina de estado centralizada que gerencia as regras de negócios, formatação de dados, multiplicadores algorítmicos e manipuladores de eventos.
   - Desacoplada de interações diretas com a DOM; fornece estado e ações (por exemplo, `addDownload`, `removeCourse`, `toggleUserTier`) para as camadas de apresentação.

3. **View (`/src/views/` & `/src/components/`)**:
   - Componentes visuais de alta fidelidade estilizados com **Tailwind CSS** e animados com **Motion**.
   - Escutam os estados do controller e disparam as ações dele a partir das interações diretas do usuário.

---

## 🌟 Principais Recursos

* **Calculadora Inteligente de Líquidos**: Insira a quantidade de convidados, a duração e o perfil de consumo para obter estimativas matematicamente precisas de cervejas, chopps, vinhos, espumantes, refrigerantes e gelo.
* **Canais VIP Exclusivos**: Acesso restrito para membros VIP e Administradores para baixar checklists avançados, assistir a videoaulas de masterclass e visualizar fórmulas exclusivas de receitas de vanguarda.
* **Painel Administrativo Completo com CRUD**:
  - **Criar (Create)**: Adicione arquivos personalizados do evento ou publique novos guias de vídeo de masterclass através de cartões administrativos reativos.
  - **Ler (Read)**: Listas dinâmicas e cartões de estatísticas detalhados para monitorar o inventário da plataforma.
  - **Atualizar (Update)**: Fluxos de edição baseados em modais para alterar títulos, tamanhos, formatos e instrutores em tempo real.
  - **Excluir (Delete)**: Remova com segurança manuais antigos ou recursos de vídeo inativos.
* **Aparência Visual Primorosa**: Um canvas moderno escuro de alta fidelidade com detalhes em âmbar quente, logotipos vetoriais personalizados, transições suaves e fotografias realistas (por exemplo, uma foto representativa perfeita para o nosso **Espresso Velvet Martini**, mostrando grãos de café flutuando sobre uma crema aveludada).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend**: React 19 + TypeScript + Vite
* **Animações**: Motion (`motion/react`)
* **Estilização**: Tailwind CSS
* **Banco de Dados & Armazenamento em Nuvem**: Supabase (utilizando tabelas reais e fallbacks em tempo real)
* **Suíte de Testes**: Cypress (automação de testes de ponta a ponta E2E)
* **Ícones**: Lucide React

---

## 🔐 Variáveis de Ambiente (`.env`)

Para máxima segurança, os segredos de API e links do backend são parametrizados usando arquivos de ambiente. As variáveis documentadas no arquivo `.env.example` incluem:

* `GEMINI_API_KEY`: Chaves de IA generativa para criações inteligentes de coquetéis (apenas no lado do servidor).
* `VITE_SUPABASE_URL`: Endpoint de API do gateway para o seu ambiente na nuvem do Supabase.
* `VITE_SUPABASE_ANON_KEY`: Credenciais anônimas de cliente para acesso seguro às tabelas remotas do banco de dados Supabase.

Para executar localmente, copie `.env.example` para `.env` e preencha as variáveis do Supabase.

---

## ♿ Acessibilidade & Responsividade

* **Acessibilidade**: Implementa tags `htmlFor` explícitas em rótulos (labels) correspondentes a IDs únicos de elementos de entrada, contraste de cor adequado entre texto e fundo, atributos `alt` explícitos em imagens e navegação sequencial por teclado (tabulação).
* **Responsividade**: Layout totalmente fluido que se adapta a monitores desktop ultra-wide, laptops compactos e menus hambúrguer responsivos em smartphones.

---

## 🧪 Suíte de Testes E2E (Cypress)

Implementamos testes E2E validando as principais operações administrativas de CRUD.

### Executar os Testes:
Para iniciar o Cypress e executar os testes automatizados que simulam a autenticação de usuário e publicação de novos registros de download:

```bash
npm run test:e2e
```

### Seed de Desenvolvimento
Para popular o banco local, execute:

```bash
npm run seed
```

> Certifique-se de definir `DATABASE_URL` ou `SUPABASE_DB_URL` no seu `.env` com a string de conexão Postgres do Supabase.

Contas de teste criadas pelo seed:
- Free user: `free@eventdrink.com` / `free123`
- VIP user: `vipuser@eventdrink.com` / `vip123`
- Admin user: `admin@eventdrink.com` / `admin123`

---

## ✅ Checklist Rápido Pré-Deploy

- Garanta que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estejam configurados como secrets no CI/CD.
- Não versionar `.env` (use `.env.example` como referência).
- Executar `npm run build` e verificar warnings de chunk grande — considere code-splitting (já configurado em `vite.config.ts`).
- Executar a suíte E2E: `npx cypress run`.

## CI (GitHub Actions)
Uma ação de CI sugerida foi adicionada em `.github/workflows/ci.yml` para rodar build, lint e os testes E2E.

## Observações finais
- `src/models/SupabaseModel.ts` agora contém um fallback seguro com uma conta administrativa seed para ambientes locais sem Supabase. Remova ou substitua essa conta em produção.
- Se precisar, posso criar um script de rollout para aplicar DDLs no Supabase automaticamente — solicite quando pronto.

## Publicar no GitHub Pages

Opções suportadas:

- Publicar a partir da pasta `docs/` na branch `main` (simples): execute `npm run build:ghpages` e faça commit da pasta `docs/` no repositório. Em seguida, no GitHub → Settings → Pages, selecione `main` branch e `docs/` folder.
- Publicar via `gh-pages` (recomendado para CI): crie um workflow que rode `npm run build` e publique `docs/` ou `dist/` usando `peaceiris/actions-gh-pages`.

Observação: este repositório já está configurado para construir para `docs/` (veja `vite.config.ts`). Use `npm run deploy:ghpages` para gerar os arquivos que podem ser enviados ao GitHub.

### Supabase — DDL mínima e RLS (guia rápido)

1) Tabelas mínimas sugeridas (SQL de exemplo):

```sql
-- user_badges
CREATE TABLE IF NOT EXISTS public.user_badges (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
   name text NOT NULL
);

-- user_accounts
CREATE TABLE IF NOT EXISTS public.user_accounts (
   id text PRIMARY KEY,
   name text NOT NULL,
   email text UNIQUE NOT NULL,
   password text NOT NULL,
   phone text,
   "birthDate" text NOT NULL,
   badge_id uuid REFERENCES public.user_badges(id),
   role text NOT NULL,
   "createdAt" text NOT NULL
);

-- drinks (exemplo)
CREATE TABLE IF NOT EXISTS public.drinks (
   id text PRIMARY KEY,
   name_pt text,
   name_en text,
   category text,
   price numeric,
   image_url text
);
```

2) Habilitar RLS e criar políticas básicas (exemplo):

```sql
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
-- Policy to allow authenticated users to read their own row
CREATE POLICY "Users can manage their row" ON public.user_accounts
   FOR ALL USING (auth.role() = 'authenticated' AND email = auth.jwt() ->> 'email')
   WITH CHECK (auth.role() = 'authenticated' AND email = auth.jwt() ->> 'email');
```

3) Dicas práticas:
- Configure `anon` vs `service_role` com cuidado; use `anon` apenas para operações públicas e `service_role` para scripts de backend.
- Aplique índices em colunas frequentemente filtradas (ex.: `email`, `slug`).
- Teste queries e políticas no SQL Editor do Supabase antes de conectar a produção.

4) Sobre o fallback local:
- `src/models/SupabaseModel.ts` contém mensagens DDL de referência para facilitar a criação das tabelas no painel SQL do Supabase. Remova o usuário seed antes de subir em produção real.

Se quiser, eu gero um arquivo `supabase/ddl.sql` com todas as instruções necessárias adaptadas ao seu schema atual.
