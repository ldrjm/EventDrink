# ✅ CHECKLIST DE TESTES - UPLOAD DE IMAGENS

## 🔧 PRÉ-REQUISITOS

- [ ] Supabase bucket "drinks_images" criado e público
- [ ] .env.local com credenciais Supabase
- [ ] `npm install` executado
- [ ] Projeto rodando (`npm run dev`)
- [ ] Browser com suporte a File API (Chrome, Firefox, Safari, Edge)

---

## 🧪 TESTES FUNCIONAIS

### Teste 1: Upload via Arquivo
```
Passos:
1. ✅ Ir para Admin → Painel Admin → Estoque
2. ✅ Clicar "Novo Produto"
3. ✅ Preencher: Nome (PT), Nome (EN), Categoria, Preços
4. ✅ Clicar em "Escolher Arquivo" (Upload)
5. ✅ Selecionar uma imagem do computador (JPG/PNG)
6. ✅ Esperar upload (deve mostrar loading)
7. ✅ Verificar preview da imagem no formulário
8. ✅ Clicar "Salvar no Estoque"
9. ✅ Verificar no MenuView se imagem aparece no produto

Resultado esperado:
- ✅ Preview aparece imediatamente
- ✅ Toast: "✅ Imagem enviada com sucesso!"
- ✅ Produto aparece com imagem no MenuView
- ✅ No Supabase, arquivo está em /drinks/{id}/{timestamp}_nome.jpg
```

### Teste 2: Upload via URL Pública
```
Passos:
1. ✅ Ir para Admin → Estoque
2. ✅ Clicar "Novo Produto"
3. ✅ Preencher dados do produto
4. ✅ No campo "Cola URL", colar:
   https://images.unsplash.com/photo-1608270861620-7b0106c1c5c0
5. ✅ Verificar preview
6. ✅ Salvar produto

Resultado esperado:
- ✅ Preview mostra imagem de URL
- ✅ Produto salvo com URL no campo imageUrl
- ✅ Não faz upload para Supabase (usa URL direta)
```

### Teste 3: Deletar Imagem
```
Passos:
1. ✅ Ir para Admin → Estoque
2. ✅ Editar um produto que tem imagem
3. ✅ Ver preview da imagem
4. ✅ Clicar "Deletar" (botão vermelho no preview)
5. ✅ Confirmar deleção no modal
6. ✅ Verificar que preview desapareceu
7. ✅ Clicar "Salvar Edição"

Resultado esperado:
- ✅ Modal de confirmação aparece
- ✅ Toast: "✅ Imagem deletada com sucesso!"
- ✅ Preview volta para imagem padrão
- ✅ Arquivo removido do Supabase
- ✅ Campo imageUrl tem URL padrão
```

### Teste 4: Editar Imagem (Trocar)
```
Passos:
1. ✅ Ir para Admin → Estoque
2. ✅ Editar produto existente com imagem
3. ✅ Fazer upload de nova imagem
4. ✅ Verificar novo preview
5. ✅ Clicar "Salvar Edição"

Resultado esperado:
- ✅ Nova imagem faz upload
- ✅ Preview atualiza
- ✅ Imagem antiga é deletada automaticamente
- ✅ Produto salvo com nova URL
```

---

## 🛡️ TESTES DE VALIDAÇÃO

### Validação 1: Arquivo Muito Grande
```
Passos:
1. ✅ Tentar fazer upload de imagem > 5MB
2. ✅ Esperar resposta

Resultado esperado:
- ✅ Toast de erro: "❌ Arquivo muito grande. Máximo 5MB."
- ✅ Upload não processa
- ✅ Preview não muda
```

### Validação 2: Tipo de Arquivo Inválido
```
Passos:
1. ✅ Tentar fazer upload de PDF, TXT ou outro tipo
2. ✅ Esperar resposta

Resultado esperado:
- ✅ Toast de erro: "❌ Tipo de arquivo inválido..."
- ✅ Upload bloqueado
- ✅ File input não aceita
```

### Validação 3: URL Inválida
```
Passos:
1. ✅ Colar URL quebrada/inexistente no campo URL
2. ✅ Tentar salvar produto

Resultado esperado:
- ✅ Produto salva mesmo assim (URL armazenada)
- ✅ Imagem não carrega no MenuView (quebrada)
- ✅ Aviso visual no componente
```

---

## 📱 TESTES RESPONSIVOS

### Desktop
```
- [ ] Upload em tela 1920x1080
- [ ] Preview se redimensiona bem
- [ ] Formulário com grid 3 colunas funciona
- [ ] Inputs lado a lado funcionam
```

### Tablet
```
- [ ] Upload em tela 768px
- [ ] Preview visível
- [ ] Formulário se reorganiza bem
```

### Mobile
```
- [ ] Upload em tela 375px
- [ ] File picker abre corretamente
- [ ] Preview redimensionado
- [ ] Botões acessíveis (touch)
```

---

## 🔌 TESTES DE INTEGRAÇÃO

### Com Banco de Dados
```
- [ ] Produto com imagem salva em availableDrinks
- [ ] ID do produto correto na URL
- [ ] imageUrl persistente após refresh
- [ ] Histórico de edições registrado (AuditLog)
```

### Com LocalStorage Fallback
```
- [ ] Se Supabase desconectar, imagens ainda carregam
- [ ] Fallback não quebra o app
- [ ] Mensagem clara ao usuário
```

### Com MenuView
```
- [ ] Imagens carregam no CardDrink
- [ ] SafeImage mostra corretamente
- [ ] Hover effects funcionam
- [ ] Links para ComprarView OK
```

---

## 🔍 TESTES DE PERFORMANCE

### Upload Performance
```
- [ ] Arquivo 1MB: < 3 segundos
- [ ] Arquivo 2MB: < 5 segundos
- [ ] Arquivo 5MB: < 8 segundos
- [ ] Sem lag na UI durante upload
```

### Preview Performance
```
- [ ] Preview mostra em < 500ms após seleção
- [ ] Scroll suave com preview visível
- [ ] Sem memory leaks ao carregar muitos produtos
```

---

## 🐛 TESTES DE EDGE CASES

### Cancelar Upload
```
- [ ] Selecionar arquivo, não fazer upload
- [ ] Editar outro campo do formulário
- [ ] Resultado: Não deve quebrar
```

### Upload Duplo
```
- [ ] Fazer upload, antes de terminar fazer outro
- [ ] Resultado: Último upload vence ou fila
```

### Deletar Sem Salvar
```
- [ ] Fazer upload, deletar imagem, não salvar
- [ ] Resultado: Quando sair do form, imagem original mantém
```

### Salvar Sem Imagem
```
- [ ] Deixar campo vazio ou deletar tudo
- [ ] Resultado: Usa imagem padrão sem erro
```

---

## 🎯 TESTES DE UX

### Feedback Visual
```
- [ ] Loading spinner durante upload
- [ ] Desabilita botão/input durante upload
- [ ] Toast messages claras
- [ ] Cores consistentes com design
```

### Instruções
```
- [ ] Texto de ajuda é claro
- [ ] Máximo 5MB está escrito
- [ ] Formatos suportados listados
- [ ] Português e Inglês funciona
```

### Accessibilidade
```
- [ ] Teclado (Tab) navega tudo
- [ ] Labels associadas aos inputs
- [ ] Cores têm contraste suficiente
- [ ] Screen reader pode usar (se suportado)
```

---

## 📊 MATRIZ DE TESTES

| Teste | Desktop | Mobile | Status |
|-------|---------|--------|--------|
| Upload arquivo | ✓ | ✓ |  |
| Upload URL | ✓ | ✓ |  |
| Deletar | ✓ | ✓ |  |
| Editar | ✓ | ✓ |  |
| Validação tamanho | ✓ | ✓ |  |
| Validação tipo | ✓ | ✓ |  |
| Preview | ✓ | ✓ |  |
| Persiste dados | ✓ | ✓ |  |
| Performance | ✓ | ✓ |  |

---

## 📝 RELATÓRIO DE BUGS

Se encontrar problemas, preencha:

```
BUG #1:
Descrição: [O que aconteceu]
Passos: [Como reproduzir]
Resultado esperado: [O que deveria acontecer]
Resultado atual: [O que realmente aconteceu]
Navegador: [Chrome/Firefox/Safari/Edge]
Sistema: [Windows/Mac/Linux]
Screenshot: [Anexar se possível]
```

---

## ✨ APROVAÇÃO FINAL

Após completar TODOS os testes:

```
Data: ____________________
Testador: ________________
Navegador: _______________

Funcionalidade aprovada? [ ] SIM  [ ] NÃO

Observações:
_______________________________
_______________________________
_______________________________

Pronto para produção? [ ] SIM  [ ] NÃO
```

---

## 🚀 DEPLOY

Quando aprovado:

```bash
# 1. Criar bucket no Supabase Production
# 2. Atualizar .env.production
# 3. Testar novamente em staging
# 4. Fazer git commit
git add .
git commit -m "feat: image upload/delete for products"

# 5. Push para main
git push origin main

# 6. Deploy em production
```

---

**Versão**: EventDrink Pro v4.0 | **Data**: Julho 2026 | **Status**: 🔄 Pronto para testes
