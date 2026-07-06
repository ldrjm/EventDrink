# 🖼️ GUIA: UPLOAD DE IMAGENS DE PRODUTOS

## ✅ Implementação Completa

O sistema de upload de imagens para produtos foi **totalmente implementado** com as seguintes funcionalidades:

---

## 📋 O QUE FOI ADICIONADO

### **1. Funções de Upload no SupabaseModel.ts**

```typescript
// Fazer upload de imagem
uploadDrinkImage(file: File, drinkId: string): Promise<string | null>

// Deletar imagem
deleteDrinkImage(filePath: string): Promise<boolean>

// Extrair file path de URL pública
extractFilePathFromUrl(publicUrl: string): string | null
```

### **2. Interface de Upload no AdminNewModules.tsx**

```
✅ Input file para selecionar imagens (JPG, PNG, WebP, GIF)
✅ Input URL para colar links de imagens públicas
✅ Preview da imagem em tempo real
✅ Botão para deletar imagem
✅ Status de upload (loading)
✅ Mensagens de sucesso/erro (toast)
```

---

## 🚀 COMO USAR

### **Passo 1: Admin vai para Painel Admin**
1. Fazer login como admin (`admin@eventdrink.com` / `admin123`)
2. Ir para "Painel Admin" → "Estoque"

### **Passo 2: Adicionar Novo Produto**
1. Clicar no botão **"Novo Produto"** (ou editar existente)
2. Preencher: Nome, Categoria, Preço, etc.

### **Passo 3: Upload de Imagem**

#### **Opção A: Upload de Arquivo**
```
1. Clique no campo "Escolher Arquivo"
2. Selecione uma imagem do seu computador
3. A imagem será enviada para Supabase Storage automaticamente
4. Um preview aparecerá no formulário
```

#### **Opção B: Colar URL Pública**
```
1. Clique no campo "Paste Image URL"
2. Cole uma URL pública (ex: imagens.unsplash.com)
3. A imagem aparecerá como preview
```

### **Passo 4: Salvar Produto**
1. Clique em **"Salvar no Estoque"**
2. A imagem e os dados serão salvos no banco

### **Passo 5: Editar ou Deletar Imagem**
```
✏️ Editar: Refaça upload com nova imagem
🗑️ Deletar: Clique no botão "Deletar" no preview
   (deleta do Supabase Storage + volta imagem padrão)
```

---

## 📊 LOCALIZAÇÃO NO CÓDIGO

| Arquivo | Função | Linha |
|---------|--------|-------|
| **SupabaseModel.ts** | `uploadDrinkImage()` | 1530-1584 |
| **SupabaseModel.ts** | `deleteDrinkImage()` | 1586-1615 |
| **SupabaseModel.ts** | `extractFilePathFromUrl()` | 1617-1628 |
| **AdminNewModules.tsx** | Import funções | Linha 34 |
| **AdminNewModules.tsx** | Estados upload | Linha 95-96 |
| **AdminNewModules.tsx** | Handler upload | Linha 188-218 |
| **AdminNewModules.tsx** | Handler delete | Linha 220-246 |
| **AdminNewModules.tsx** | UI Form | Linha 583-628 |

---

## ⚙️ CONFIGURAÇÃO SUPABASE (NECESSÁRIO)

### **1. Criar Bucket no Supabase**

No painel do Supabase:
```
1. Ir em Storage
2. Clicar "Create a new bucket"
3. Nome: "drinks_images"
4. Public? SIM (deixar público)
5. Criar
```

### **2. Configurar Policies de Segurança**

```sql
-- Permitir leitura pública
CREATE POLICY "Public Read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'drinks_images');

-- Permitir upload autenticado (opcional)
CREATE POLICY "Authenticated Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'drinks_images' 
  AND auth.role() = 'authenticated');
```

---

## 📝 ESPECIFICAÇÕES TÉCNICAS

| Aspecto | Detalhe |
|---------|---------|
| **Formatos suportados** | JPG, PNG, WebP, GIF |
| **Tamanho máximo** | 5 MB |
| **Bucket** | `drinks_images` (público) |
| **Estrutura** | `/drinks/{drinkId}/{timestamp}_{filename}` |
| **Tipo de autenticação** | Anônimo (público) |
| **Armazenamento** | Supabase Storage (PostgreSQL) |

---

## ✨ FUNCIONALIDADES EXTRAS

### **Preview em Tempo Real**
- Conforme você seleciona a imagem, um preview aparece
- Mostra antes de salvar no banco

### **Validação Automática**
- Tipo de arquivo validado
- Tamanho máximo 5MB
- Extensão verificada

### **Fallback Seguro**
- Se Supabase não estiver configurado, volta a aceitar URLs
- Função retorna `null` e avisa ao usuário

### **Integrações com Toasts**
- Mensagens de sucesso: "✅ Imagem enviada com sucesso!"
- Mensagens de erro: "❌ Erro ao enviar imagem"

---

## 🔧 TROUBLESHOOTING

### **❌ "Bucket não encontrado"**
**Solução**: Criar bucket `drinks_images` no Supabase (veja acima)

### **❌ "Arquivo muito grande"**
**Solução**: Use imagens menores que 5MB. Comprima em https://tinypng.com

### **❌ "Tipo de arquivo inválido"**
**Solução**: Use JPG, PNG, WebP ou GIF

### **❌ "Upload falhou sem erro"**
**Solução**: 
1. Verificar chaves SUPABASE no .env
2. Confirmar que bucket existe
3. Ver console (F12) para logs detalhados

---

## 📱 COMPATIBILIDADE

```
✅ Desktop (Chrome, Firefox, Safari, Edge)
✅ Mobile (iOS Safari, Android Chrome)
✅ Drag & Drop (alguns navegadores)
```

---

## 🎯 PRÓXIMOS PASSOS

Se quiser expandir:

```typescript
// 1. Adicionar validação de dimensões de imagem
// 2. Implementar crop/resize automático
// 3. Suportar múltiplos formatos (HEIC, SVG)
// 4. Adicionar watermark
// 5. Implementar CDN com cache
```

---

## 📞 SUPORTE

**Status**: ✅ Implementado e Testado

**Versão**: EventDrink Pro v4.0

**Data**: Julho 2026

Se tiver dúvidas, consulte o código nos arquivos mencionados acima.

---

**🎉 Pronto para usar!** O admin agora consegue fazer upload e deletar imagens de produtos direto do painel! 🚀
