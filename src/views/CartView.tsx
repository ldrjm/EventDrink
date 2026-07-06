import React from 'react';
import { motion } from 'motion/react';
import { 
  Minus, 
  Plus, 
  Check, 
  Award, 
  ShoppingBag 
} from 'lucide-react';
import { AppControllerType } from '../controllers/AppController';
import { SafeImage } from '../components/SafeImage';

interface CartViewProps {
  controller: AppControllerType;
}

export default function CartView({ controller }: CartViewProps) {
  const {
    lang,
    currentUser,
    cart,
    availableDrinks,
    cartInfo,
    deliveryAddress,
    setDeliveryAddress,
    deliveryDate,
    setDeliveryDate,
    paymentMethod,
    setPaymentMethod,
    isFinishingPurchase,
    handleRemoveFromCart,
    handleAddToCart,
    handleDeleteFromCart,
    handleCheckoutCart,
    setActiveTab
  } = controller;

  return (
    <motion.div
      key="cart"
      id="view-cart"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 text-left"
    >
      {/* Header title */}
      <div className="space-y-1">
        <span className="text-[10px] font-mono tracking-widest text-[#fe9d00] uppercase font-black">
          {lang === 'pt-BR' ? 'FECHAMENTO / CHECKOUT' : 'CHECKOUT OUTLINE'}
        </span>
        <h2 className="text-3xl font-extrabold text-white">
          {lang === 'pt-BR' ? 'Seu Carrinho de Compras' : 'Your Shopping Cart'}
        </h2>
        <p className="text-neutral-400 text-sm">
          {lang === 'pt-BR' 
            ? 'Revise os rótulos premium selecionados e informe os dados para entrega programada do seu pedido.'
            : 'Review your selected premium labels and enter your info for scheduling dispatch and delivery.'}
        </p>
      </div>

      {/* Checkout Age restriction warning card */}
      <div className="bg-[#120a0a] border border-red-950/40 rounded-2xl p-4 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-extrabold text-xs shrink-0 font-mono">
          +18
        </div>
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'pt-BR' ? 'Aviso Importante: Entrega Restrita a Maiores de 18 Anos' : 'Important Notice: Delivery Restricted to Ages 18+'}
          </h4>
          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
            {lang === 'pt-BR'
              ? 'A entrega de bebidas alcoólicas exige a apresentação de documento original com foto para comprovação da maioridade. Não realizamos entregas a menores de idade.'
              : 'The delivery of alcoholic beverages requires a government-issued photo ID for age verification. We do not deliver to minors.'}
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      {cartInfo.count === 0 ? (
        /* Empty state card */
        <div id="cart-empty-state" className="bg-[#161616]/30 border border-neutral-800/40 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
            <ShoppingBag className="w-8 h-8 font-bold" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {lang === 'pt-BR' ? 'Seu carrinho está vazio' : 'Your cart is empty'}
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans">
              {lang === 'pt-BR' 
                ? 'Selecione bebidas especiais no nosso menu premium de marcas consagradas para começar a montar o checkout.'
                : 'Select specialty drinks from our premium list of renowned brands to assemble your purchase.'}
            </p>
          </div>
          <button
            id="cart-empty-go-to-menu-btn"
            onClick={() => setActiveTab('menu')}
            className="bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {lang === 'pt-BR' ? 'Explorar Bebidas' : 'Explore Drinks Menu'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left side: Cart List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-neutral-800/50 pb-3">
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {lang === 'pt-BR' ? 'PRODUTO' : 'PRODUCT'}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-400">
                  {lang === 'pt-BR' ? 'SUBTOTAL' : 'SUBTOTAL'}
                </span>
              </div>

              <div className="divide-y divide-neutral-850">
                {Object.entries(cart).map(([id, qty]) => {
                  const drink = availableDrinks.find(d => d.id === id);
                  if (!drink) return null;
                  const itemQty = qty as number;
                  return (
                    <div key={drink.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-2 last:pb-2">
                      {/* Thumbnail and Details */}
                      <div className="flex items-center space-x-4">
                        <SafeImage 
                          src={drink.imageUrl} 
                          alt={drink.namePt} 
                          category={drink.category}
                          className="w-16 h-16 object-cover rounded-xl border border-neutral-850 px-1 bg-neutral-900"
                        />
                        <div className="text-left font-sans">
                          <span className="text-[9px] font-mono font-bold text-[#a2d729] bg-[#a2d729]/10 px-2 py-0.5 rounded-full uppercase">
                            {lang === 'pt-BR' ? drink.categoryLabelPt : drink.categoryLabelEn}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">
                            {lang === 'pt-BR' ? drink.namePt : drink.nameEn}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                            {lang === 'pt-BR' ? drink.unitPt : drink.unitEn} • R$ {drink.price.toFixed(2)}/un
                          </p>
                        </div>
                      </div>

                      {/* Controls & Total */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 font-sans">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1 shrink-0">
                          <button
                            id={`cart-decrease-${drink.id}`}
                            onClick={() => handleRemoveFromCart(drink.id)}
                            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold font-mono text-white">
                            {itemQty}
                          </span>
                          <button
                            id={`cart-increase-${drink.id}`}
                            onClick={() => handleAddToCart(drink)}
                            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Calculated Price */}
                        <div className="text-right shrink-0 min-w-[80px]">
                          <span className="text-sm font-bold font-mono text-white block">
                            R$ {(drink.price * itemQty).toFixed(2)}
                          </span>
                          {/* Delete Button */}
                          <button 
                            id={`cart-delete-${drink.id}`}
                            onClick={() => handleDeleteFromCart(drink.id)}
                            className="block text-[10px] text-red-500 hover:text-red-400 hover:underline font-mono ml-auto mt-1 cursor-pointer"
                          >
                            {lang === 'pt-BR' ? 'Excluir' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Go back to menu helper */}
            <button
              id="cart-back-to-menu-btn"
              onClick={() => setActiveTab('menu')}
              className="bg-[#1a1a1a]/40 hover:bg-neutral-900 transition-colors border border-neutral-800 text-xs text-neutral-400 hover:text-white px-5 py-3 rounded-2xl flex items-center space-x-2 cursor-pointer font-sans"
            >
              <span>{lang === 'pt-BR' ? '← Continuar Escolhendo Bebidas' : '← Continue Choosing Drinks'}</span>
            </button>
          </div>

          {/* Right side: Checkout Sidebar Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Financial Summary Card */}
            <div className="bg-[#161616]/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6 backdrop-blur-md relative overflow-hidden text-left font-sans">
              <h3 className="text-lg font-bold text-white">
                {lang === 'pt-BR' ? 'Resumo do Pedido' : 'Order Summary'}
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>{lang === 'pt-BR' ? 'Subtotal de Produtos' : 'Subtotal'}</span>
                  <span className="text-white">R$ {cartInfo.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-neutral-400">
                  <span>{lang === 'pt-BR' ? 'Entrega Programada' : 'Scheduled Delivery'}</span>
                  <span className="text-[#a2d729] font-bold uppercase">{lang === 'pt-BR' ? 'CORTESIA' : 'FREE'}</span>
                </div>

                {currentUser?.isLoggedIn && (
                  <div className="flex justify-between text-neutral-400">
                    <span className="flex items-center text-[#fe9d00]">
                      <Award className="w-3.5 h-3.5 mr-1" />
                      {lang === 'pt-BR' ? 'Desconto Especial VIP (7%)' : 'VIP Discount (7%)'}
                    </span>
                    <span className="text-[#fe9d00]">- R$ {(cartInfo.total * 0.07).toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-neutral-800 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-sans font-bold text-white">TOTAL</span>
                  <span className="text-2xl font-bold font-mono text-[#a2d729]">
                    R$ {(currentUser?.isLoggedIn ? cartInfo.total * 0.93 : cartInfo.total).toFixed(2)}
                  </span>
                </div>

                {!currentUser?.isLoggedIn && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl flex flex-col space-y-2 mt-2 text-left">
                    <p className="text-[11px] text-amber-300 leading-normal font-sans">
                      💡 <strong>{lang === 'pt-BR' ? 'Economia VIP Disponível!' : 'VIP Savings Ready!'}</strong> {lang === 'pt-BR' ? 'Ative o modo VIP agora e obtenha 7% de desconto imediato (R$' : 'Become a VIP now and instantly save 7% (R$'} {(cartInfo.total * 0.07).toFixed(2)}) {lang === 'pt-BR' ? 'neste orçamento.' : 'on this cart.'}
                    </p>
                    <button
                      type="button"
                      onClick={controller.toggleUserTier}
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-black font-extrabold text-[10px] uppercase py-2 rounded-xl transition-all cursor-pointer text-center"
                    >
                      {lang === 'pt-BR' ? 'Ativar Desconto VIP Grátis ✨' : 'Activate Free VIP Discount ✨'}
                    </button>
                  </div>
                )}
              </div>

              {/* Delivery Configuration Inputs Form */}
              <div className="border-t border-neutral-800/60 pt-5 space-y-4 text-left">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
                  {lang === 'pt-BR' ? 'Dados de Entrega & Pagamento' : 'Dispatch & Payment Details'}
                </h4>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase">
                    {lang === 'pt-BR' ? 'Endereço de Entrega' : 'Delivery Address'}
                  </label>
                  <input 
                    id="checkout-delivery-address"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#fe9d00] transition-colors"
                  />
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase">
                    {lang === 'pt-BR' ? 'Data de Entrega' : 'Scheduled Date'}
                  </label>
                  <input 
                    id="checkout-delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#fe9d00] transition-colors font-mono"
                  />
                </div>

                {/* Payment Method select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block">
                    {lang === 'pt-BR' ? 'Método de Pagamento' : 'Payment Method'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['pix', 'credit_card', 'boleto'].map((method) => {
                      const isActive = paymentMethod === method;
                      let label = '';
                      if (method === 'pix') label = 'PIX';
                      if (method === 'credit_card') label = lang === 'pt-BR' ? 'Cartão' : 'Card';
                      if (method === 'boleto') label = 'Boleto';

                      return (
                        <button
                          key={method}
                          id={`payment-method-${method}`}
                          onClick={() => setPaymentMethod(method as any)}
                          type="button"
                          className={`py-2 px-1 text-center rounded-xl border text-[10px] font-bold font-mono transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-[#fe9d00]/15 border-[#fe9d00] text-white' 
                              : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Finalize checkout button */}
              <div className="pt-4">
                <button
                  id="checkout-finalize-btn"
                  disabled={isFinishingPurchase}
                  onClick={handleCheckoutCart}
                  className={`w-full bg-gradient-to-r from-[#fe9d00] to-[#ff5d00] text-black font-extrabold text-sm py-4 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer ${
                    isFinishingPurchase ? 'brightness-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isFinishingPurchase ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                      <span className="uppercase tracking-wider">{lang === 'pt-BR' ? 'Processando transação...' : 'Processing Transaction...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span className="uppercase tracking-wider">{lang === 'pt-BR' ? 'Finalizar Compra / Checkout' : 'Finalize Purchase'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
