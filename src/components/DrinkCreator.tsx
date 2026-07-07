import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wine, 
  GlassWater, 
  Plus, 
  RotateCcw, 
  Check, 
  Printer, 
  Flame, 
  Share2, 
  Info, 
  Coins, 
  TrendingUp, 
  Heart, 
  Award,
  Lock
} from 'lucide-react';
import { Language, Drink } from '../types';
import { SafeImage } from './SafeImage';
import alquimistaBoxImage from '../assets/images/alquimista_box_1781916042625.jpg';

interface DrinkCreatorProps {
  lang: Language;
  triggerToast: (msg: string) => void;
  onAddCustomDrinkToMenu: (newDrink: Drink) => void;
  currentUser?: any;
  onUpgradeVip?: () => void;
}

// Ingredient types and properties
interface SelectionOption {
  id: string;
  namePt: string;
  nameEn: string;
  price: number;
  color: string; // Hex color representing the liquid/addition
  calories: number;
  alcStrengthPt: string;
  alcStrengthEn: string;
}

const BASE_SPIRITS: SelectionOption[] = [
  { id: 'gin', namePt: 'Gin Premium', nameEn: 'Premium Gin', price: 12.00, color: '#e2f1f7', calories: 110, alcStrengthPt: 'Alto (40%)', alcStrengthEn: 'Strong (40%)' },
  { id: 'vodka', namePt: 'Vodka Importada', nameEn: 'Imported Vodka', price: 10.00, color: '#f7fafc', calories: 95, alcStrengthPt: 'Alto (40%)', alcStrengthEn: 'Strong (40%)' },
  { id: 'whiskey', namePt: 'Whisky Single Malt', nameEn: 'Single Malt Whisky', price: 18.00, color: '#b5651d', calories: 120, alcStrengthPt: 'Alto (43%)', alcStrengthEn: 'Strong (43%)' },
  { id: 'cachaca', namePt: 'Cachaça Envelhecida', nameEn: 'Aged Cachaça', price: 8.50, color: '#fdd895', calories: 115, alcStrengthPt: 'Alto (38%)', alcStrengthEn: 'Strong (38%)' },
  { id: 'rum', namePt: 'Rum Spiced', nameEn: 'Spiced Rum', price: 9.50, color: '#8b5a2b', calories: 105, alcStrengthPt: 'Alto (37%)', alcStrengthEn: 'Strong (37%)' },
  { id: 'none', namePt: 'Sem Álcool (Mocktail)', nameEn: 'Non-Alcoholic (Mocktail)', price: 4.00, color: '#38bdf8', calories: 35, alcStrengthPt: 'Zero (0%)', alcStrengthEn: 'Zero (0%)' },
];

const MIXERS: SelectionOption[] = [
  { id: 'tonic', namePt: 'Água Tônica de Gengibre', nameEn: 'Ginger Tonic Water', price: 5.50, color: '#d9f2fa', calories: 45, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'soda', namePt: 'Club Soda Artesanal', nameEn: 'Artisanal Club Soda', price: 4.00, color: '#f1f5f9', calories: 0, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'orange', namePt: 'Suco de Laranja Natural', nameEn: 'Natural Orange Juice', price: 6.00, color: '#f97316', calories: 85, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'energy', namePt: 'Energético de Cranberry', nameEn: 'Cranberry Energy Drink', price: 8.00, color: '#ec4899', calories: 110, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'coconut', namePt: 'Água de Coco Integral', nameEn: 'Organic Coconut Water', price: 5.00, color: '#f8fafc', calories: 40, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
];

const FLAVORS_SYRUPS: SelectionOption[] = [
  { id: 'none', namePt: 'Nenhuma Infusão ou Xarope', nameEn: 'No Infusion/Syrup', price: 0.00, color: '#f8fafc', calories: 0, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'strawberry', namePt: 'Xarope de Morango Silvestre', nameEn: 'Wild Strawberry Syrup', price: 3.50, color: '#dc2626', calories: 60, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'lemon', namePt: 'Xarope de Limão Siciliano', nameEn: 'Sicilian Lemon Syrup', price: 3.00, color: '#bef264', calories: 50, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'passion', namePt: 'Polpa de Maracujá Fresca', nameEn: 'Fresh Passion Fruit', price: 4.00, color: '#fbbf24', calories: 45, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'mint', namePt: 'Infusão Pura de Hortelã', nameEn: 'Pure Mint Infusion', price: 2.50, color: '#16a34a', calories: 15, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'vanilla', namePt: 'Extrato Macio de Baunilha', nameEn: 'Smooth Vanilla Extract', price: 4.50, color: '#f59e0b', calories: 55, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
];

const GARNISHES: SelectionOption[] = [
  { id: 'lemon_wheel', namePt: 'Rodela de Limão Tahiti', nameEn: 'Tahiti Lime Wheel', price: 1.50, color: '#a2d729', calories: 2, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'orange_twist', namePt: 'Torção de Casca de Laranja', nameEn: 'Orange Peel Twist', price: 2.00, color: '#f97316', calories: 3, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'rosemary', namePt: 'Ramo de Alecrim Fresco', nameEn: 'Fresh Rosemary Sprig', price: 2.20, color: '#15803d', calories: 1, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'cherry', namePt: 'Cereja Amarena em Calda', nameEn: 'Amarena Glazed Cherry', price: 3.50, color: '#991b1b', calories: 25, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'cinnamon', namePt: 'Bastão de Canela Tostado', nameEn: 'Toasted Cinnamon Stick', price: 2.80, color: '#78350f', calories: 4, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
];

const PREMIUM_TOUCHES: SelectionOption[] = [
  { id: 'gold_flakes', namePt: 'Flocos de Ouro 24k Comestíveis', nameEn: '24k Edible Gold Flakes', price: 15.00, color: '#fcd34d', calories: 0, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'smoke', namePt: 'Defumação com Madeira de Carvalho', nameEn: 'Oakwood Smoke Infusion', price: 7.50, color: '#78716c', calories: 0, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'chili_rim', namePt: 'Borda de Pimenta Spicy & Flor de Sal', nameEn: 'Spicy Chili & Sea Salt Rim', price: 4.00, color: '#ef4444', calories: 5, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'glitter', namePt: 'Brilho Perolado Cósmico (Glitter)', nameEn: 'Cosmic Pearlescent Glitter', price: 5.50, color: '#ec4899', calories: 0, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
  { id: 'dry_ice', namePt: 'Névoa Criogênica (Efeito Fumegante)', nameEn: 'Cryogenic Mist (Dry Ice Effect)', price: 9.00, color: '#e0f2fe', calories: 0, alcStrengthPt: 'Nenhum', alcStrengthEn: 'None' },
];

// Showcase area of physical bartender kit containing raw customized ingredients 
const BartenderBoxShowcase: React.FC<{ lang: Language }> = ({ lang }) => {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-850 rounded-3xl p-6 md:p-8 mt-8 relative overflow-hidden transition-all duration-300">
      <div className="absolute right-[-40px] top-[-40px] w-56 h-56 rounded-full bg-amber-500/10 blur-[80px]" />
      <div className="absolute left-[-45px] bottom-[-45px] w-56 h-56 rounded-full bg-orange-500/10 blur-[80px]" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Box Image Showcase */}
        <div className="col-span-1 lg:col-span-12 xl:col-span-5 flex justify-center">
          <div className="group relative aspect-video xl:aspect-square w-full max-w-[440px] rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-805 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
            <SafeImage 
              src={alquimistaBoxImage} 
              alt={lang === 'pt-BR' ? 'Maleta do Bartender O Alquimista' : 'O Alquimista Bartender Box'} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              category="spirits"
            />
            {/* Elegant watermark branding badge */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md rounded-xl p-3 border border-neutral-850 text-left">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#fe9d00] uppercase block">
                {lang === 'pt-BR' ? 'COQUETELARIA FÍSICA' : 'PHYSICAL MIXOLOGY'}
              </span>
              <span className="text-xs font-extrabold text-white">
                {lang === 'pt-BR' ? 'Maleta O Alquimista' : 'The Alchemist Box'}
              </span>
            </div>
          </div>
        </div>

        {/* Box Details Content */}
        <div className="col-span-1 lg:col-span-12 xl:col-span-7 text-left space-y-5">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 text-[#fe9d00] text-[10px] uppercase font-mono font-black tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 fill-[#fe9d00]" />
              <span>{lang === 'pt-BR' ? 'Da Tela para o seu Evento' : 'From Canvas to Celebration'}</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {lang === 'pt-BR' 
                ? 'Sua Maleta do Alquimista' 
                : 'Your Alchemist Box'
              }
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-sans mt-2">
              {lang === 'pt-BR'
                ? 'Ao fechar o planejamento do seu bar ou salvar criações autorais, nosso sistema gera um kit de produção real. Receba uma maleta sob medida contendo fracionados puros, doses calibradas e as mesmas decorações que você desenhou acima.'
                : 'When finalizing your event budget or saving signature mixes, our warehouse prepares a matching retail set. Your custom box delivers premium single-malts, precise modifiers, and the identical garnishes you formulated above.'
              }
            </p>
          </div>

          {/* Grid of box items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs pt-2">
            <div className="flex items-start space-x-3 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Wine className="w-4 h-4 text-[#fe9d00]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">
                  {lang === 'pt-BR' ? 'Doses & Calibragens' : 'Calibrated Spirits'}
                </h4>
                <p className="text-neutral-400 leading-relaxed text-[11px] mt-0.5">
                  {lang === 'pt-BR'
                    ? 'Frascos de vidro lacrados com as doses de destilados selecionadas (ex: 50ml de Gin Premium).'
                    : 'Sterilized glass vials containing single servings of your chosen base spirits.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">
                  {lang === 'pt-BR' ? 'Xaropes & Infusões' : 'Bespoke Modifiers'}
                </h4>
                <p className="text-neutral-400 leading-relaxed text-[11px] mt-0.5">
                  {lang === 'pt-BR'
                    ? 'Xaropes botânicos e diluentes frescos de alta qualidade envasados a vácuo.'
                    : 'Craft cordials, fresh syrups, and herbal tonics customized for your formula.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                <GlassWater className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">
                  {lang === 'pt-BR' ? 'Insumos Frescos Certificados' : 'Garnishes & Citrus'}
                </h4>
                <p className="text-neutral-400 leading-relaxed text-[11px] mt-0.5">
                  {lang === 'pt-BR'
                    ? 'Fatias cítricas selecionadas e guarnições preservadas prontas para aromatizar.'
                    : 'Freshly dehydrated premium fruit wheels, spices, and sprigs for a gorgeous finish.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-neutral-900/40 p-3.5 rounded-xl border border-neutral-850">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">
                  {lang === 'pt-BR' ? 'Manual do Alquimista' : 'Instructional Guide'}
                </h4>
                <p className="text-neutral-400 leading-relaxed text-[11px] mt-0.5">
                  {lang === 'pt-BR'
                    ? 'Fichas técnicas físicas com QR Codes impressas para guiar o preparo rápido.'
                    : 'Textured paper cards with physical step-by-step mixology formulas and QR setup guides.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Step-by-Step Toggle Button */}
          <div className="pt-3 flex justify-start">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex items-center space-x-2 bg-amber-500/10 hover:bg-[#fe9d00] hover:text-black border border-amber-500/30 hover:border-[#fe9d00] text-[#fe9d00] font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>
                {showSteps 
                  ? (lang === 'pt-BR' ? 'Ocultar Passo a Passo' : 'Hide Step-by-Step Instructions')
                  : (lang === 'pt-BR' ? 'Como utilizar o Kit? Ver Passo a Passo' : 'How to use the Kit? See Step-by-Step')
                }
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Step-by-Step Interactive Guide */}
      <AnimatePresence>
        {showSteps && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden mt-6 bg-neutral-950/70 border border-neutral-850 rounded-2xl p-5 md:p-6 space-y-5 text-left relative z-10"
          >
            <div className="border-b border-neutral-850 pb-3">
              <h4 className="text-xs font-black text-white tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fe9d00]" />
                {lang === 'pt-BR' ? 'Guia do Alquimista: Passo a Passo' : 'Alchemist Guide: Step-by-Step Instruction'}
              </h4>
              <p className="text-[11px] text-neutral-400 mt-1 font-sans leading-relaxed">
                {lang === 'pt-BR' 
                  ? 'Siga estas instruções recomendadas pelos nossos mestres mixologistas para obter a máxima qualidade e sofisticação no preparo do seu coquetel.'
                  : 'Follow these curated instructions to achieve professional-grade flavor profiles and structural cocktail aesthetics.'}
              </p>
            </div>

            <div className="relative border-l-2 border-[#fe9d00]/25 pl-6 ml-3 space-y-6 text-xs font-sans">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#fe9d00] border-2 border-black flex items-center justify-center text-[9px] font-black text-black">
                  1
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-white text-xs">
                    {lang === 'pt-BR' ? '1. Resfriamento Prévio (Mise en Place)' : '1. Chill and Prepare (Mise en Place)'}
                  </h5>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {lang === 'pt-BR'
                      ? 'Retire os insumos e xaropes da maleta. Coloque os copos no congelador por 5 minutos ou preencha-os com gelo cristalino para resfriar as paredes do copo antes de verter os líquidos.'
                      : 'Unpack your customized modifiers and spirits. Place your glassware in the freezer for 5 minutes or pack with raw ice cubes to pre-chill the glass rim.'}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#fe9d00] border-2 border-black flex items-center justify-center text-[9px] font-black text-black">
                  2
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-white text-xs">
                    {lang === 'pt-BR' ? '2. Dosagem Fina (The Perfect Pour)' : '2. Micro-Dosing (The Perfect Pour)'}
                  </h5>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {lang === 'pt-BR'
                      ? 'Abra o frasco de vidro correspondente à dose do destilado premium do seu kit (ex: 50ml). Despeje na coqueteleira ou diretamente no copo de servir.'
                      : 'Open the single-dose 50ml glass bottle of your signature base spirit. Pour directly into your mixing glass or highball packed to the brim with fresh clear ice.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#fe9d00] border-2 border-black flex items-center justify-center text-[9px] font-black text-black">
                  3
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-white text-xs">
                    {lang === 'pt-BR' ? '3. Integração de Aromas (Xaropes & Diluentes)' : '3. Scent & Sugar Integration'}
                  </h5>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {lang === 'pt-BR'
                      ? 'Incorpore o xarope artesanal flutuando na dose. Em seguida, complete com o diluente correspondente (Club Soda, Tônica ou Suco Natural) bem gelado e misture suavemente com a colher bailarina.'
                      : 'Integrate the vacuum-sealed cordials or herbal syrups. Top with your chilled organic mixers (club soda, ginger tonic) and give a brief, gentle lift stir.'}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#fe9d00] border-2 border-black flex items-center justify-center text-[9px] font-black text-black">
                  4
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-white text-xs">
                    {lang === 'pt-BR' ? '4. Guarnição e Toque Premium Final' : '4. Aesthetic Plating & Touches'}
                  </h5>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {lang === 'pt-BR'
                      ? 'Finalize dispondo as fatias de frutas cítricas selecionadas ou especiarias na borda ou superfície. Se o seu kit contiver flocos de ouro comestíveis, pó de brilho ou defumador, aplique-os por último.'
                      : 'Position your pristine dried fruit wheel or rosemary sprig on the surface. If your custom kit features premium additions, scatter the gold flakes or invoke the smoke cloud.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DrinkCreator({ 
  lang, 
  triggerToast, 
  onAddCustomDrinkToMenu, 
  currentUser, 
  onUpgradeVip 
}: DrinkCreatorProps) {
  // Option selection states
  const [selectedBase, setSelectedBase] = useState<string>('gin');
  const [selectedMixer, setSelectedMixer] = useState<string>('tonic');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('mint');
  const [selectedGarnishes, setSelectedGarnishes] = useState<string[]>(['lemon_wheel']);
  const [selectedPremiums, setSelectedPremiums] = useState<string[]>(['none']);
  const [drinkName, setDrinkName] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Interactive Tutorial States for Free Users
  const [tutStep, setTutStep] = useState<number>(0);
  const [tutBase, setTutBase] = useState<string>('gin');
  const [tutMixer, setTutMixer] = useState<string>('tonic');
  const [tutTouch, setTutTouch] = useState<string>('none');
  const [tutName, setTutName] = useState<string>('');

  // Free Tier limitations states
  const [createdCount, setCreatedCount] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [modalReason, setModalReason] = useState<'limit' | 'premium' | null>(null);

  // Retrieve actual selected details
  const baseObj = useMemo(() => BASE_SPIRITS.find(o => o.id === selectedBase) || BASE_SPIRITS[0], [selectedBase]);
  const mixerObj = useMemo(() => MIXERS.find(o => o.id === selectedMixer) || MIXERS[0], [selectedMixer]);
  const flavorObj = useMemo(() => FLAVORS_SYRUPS.find(o => o.id === selectedFlavor) || FLAVORS_SYRUPS[0], [selectedFlavor]);
  const garnishObjs = useMemo(() => GARNISHES.filter(o => selectedGarnishes.includes(o.id)), [selectedGarnishes]);
  const premiumObjs = useMemo(() => PREMIUM_TOUCHES.filter(o => selectedPremiums.includes(o.id)), [selectedPremiums]);

  // Dynamic Liquid Blend Color Helper (blends base color, mixer color and flavor color)
  const visualLiquidColor = useMemo(() => {
    // Basic weight-based solid blend simulation for realistic visual display
    // Base is 40%, Mixer is 40%, Syrup is 20%
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const parsedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsedHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };

    const c1 = hexToRgb(baseObj.color);
    const c2 = hexToRgb(mixerObj.color);
    const c3 = hexToRgb(flavorObj.color);

    const r = Math.round(c1.r * 0.4 + c2.r * 0.4 + c3.r * 0.2);
    const g = Math.round(c1.g * 0.4 + c2.g * 0.4 + c3.g * 0.2);
    const b = Math.round(c1.b * 0.4 + c2.b * 0.4 + c3.b * 0.2);

    return `rgb(${r}, ${g}, ${b})`;
  }, [baseObj, mixerObj, flavorObj]);

  // Total Unit Price Calculation
  const unitPrice = useMemo(() => {
    const p1 = baseObj.price;
    const p2 = mixerObj.price;
    const p3 = flavorObj.price;
    const p4 = garnishObjs.reduce((acc, g) => acc + g.price, 0);
    const p5 = premiumObjs.reduce((acc, p) => acc + p.price, 0);
    return p1 + p2 + p3 + p4 + p5;
  }, [baseObj, mixerObj, flavorObj, garnishObjs, premiumObjs]);

  // Dynamic Popularity/VIP score generator based on combinations
  const formulaVIPScore = useMemo(() => {
    let score = 8.5;
    if (selectedBase === 'gin' && selectedMixer === 'tonic') score += 0.8;
    if (selectedFlavor === 'mint' && selectedGarnishes.includes('lemon_wheel')) score += 0.5;
    if (selectedPremiums.some(p => p !== 'none')) score += 0.6;
    return Math.min(10.0, score).toFixed(1);
  }, [selectedBase, selectedMixer, selectedFlavor, selectedGarnishes, selectedPremiums]);

  // AI Cocktail Name Generator Simulator
  const handleGenerateAIName = () => {
    const prefixesPt = ['Aurora', 'Brisa', 'Eclipse', 'Néctar', 'Oráculo', 'Sinfonia', 'Sussurro', 'Fogo', 'Névoa', 'Essência'];
    const prefixesEn = ['Aurora', 'Breeze', 'Eclipse', 'Nectar', 'Oracle', 'Symphony', 'Whisper', 'Fire', 'Mist', 'Essence'];

    const suffixesPt = ['dourado(a)', 'tropical', 'real', 'das galáxias', 'sunset', 'imperial', 'proibido(a)', 'vintage', 'de elite', 'sensorial'];
    const suffixesEn = ['Golden', 'Tropical', 'Royal', 'Galaxy', 'Sunset', 'Imperial', 'Forbidden', 'Vintage', 'Elite', 'Sensory'];

    const baseIndex = Math.floor(Math.random() * prefixesPt.length);
    const mixIndex = Math.floor(Math.random() * suffixesPt.length);

    const titlePt = `${prefixesPt[baseIndex]} ${suffixesPt[mixIndex]} com ${garnishObjs[0]?.namePt.split(' ')[2] || 'Toque Pro'}`;
    const titleEn = `The ${suffixesEn[mixIndex]} ${prefixesEn[baseIndex]}`;

    setDrinkName(lang === 'pt-BR' ? titlePt : titleEn);
    triggerToast(lang === 'pt-BR' ? 'Título exclusivo criado com sucesso!' : 'Exclusive cocktail title composed with success!');
  };

  // Reset formulation state
  const handleResetFormulation = () => {
    setSelectedBase('gin');
    setSelectedMixer('tonic');
    setSelectedFlavor('mint');
    setSelectedGarnishes(['lemon_wheel']);
    setSelectedPremiums(['none']);
    setDrinkName('');
    setIsSaved(false);
    triggerToast(lang === 'pt-BR' ? 'Criação reiniciada!' : 'Formulation restarted!');
  };

  // Safe Save formulation click
  const handleSaveToMenu = () => {
    const isVip = currentUser?.isLoggedIn;

    // First, check premium touches selected by Free user
    const hasPremiumTouch = selectedPremiums.some(p => p !== 'none');
    if (!isVip && hasPremiumTouch) {
      setModalReason('premium');
      setShowUpgradeModal(true);
      return;
    }

    // Second, check Free limit of 1 custom drink
    if (!isVip && createdCount >= 1) {
      setModalReason('limit');
      setShowUpgradeModal(true);
      return;
    }

    const finalName = drinkName.trim() || (lang === 'pt-BR' ? `Mix Premium de ${baseObj.namePt}` : `${baseObj.nameEn} Custom Mix`);
    
    const garnishesTextPt = garnishObjs.length > 0 
      ? garnishObjs.map(g => g.namePt).join(' & ') 
      : (lang === 'pt-BR' ? 'sem guarnição' : 'without Garnish');
    
    const garnishesTextEn = garnishObjs.length > 0 
      ? garnishObjs.map(g => g.nameEn).join(' & ') 
      : 'without Garnish';

    const flavorNamePt = flavorObj.id === 'none' ? (lang === 'pt-BR' ? 'Sem xarope/infusão' : 'No syrup/infusion') : flavorObj.namePt;
    const flavorNameEn = flavorObj.id === 'none' ? 'No syrup/infusion' : flavorObj.nameEn;

    // Create new Drink item
    const createdDrink: Drink = {
      id: `custom-${Date.now()}`,
      namePt: finalName,
      nameEn: finalName,
      category: 'spirits',
      categoryLabelPt: 'Criação Exclusiva',
      categoryLabelEn: 'Exclusive Creation',
      price: unitPrice,
      imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80',
      recommendedPt: `${flavorNamePt} com guarnição de ${garnishesTextPt}.`,
      recommendedEn: `${flavorNameEn} with ${garnishesTextEn}.`,
      inStock: true,
      unitPt: 'Dose / Taça',
      unitEn: 'Glass'
    };

    onAddCustomDrinkToMenu(createdDrink);
    setIsSaved(true);
    if (!isVip) {
      setCreatedCount(prev => prev + 1);
    }
    triggerToast(lang === 'pt-BR' 
      ? `"${finalName}" salvo e adicionado ao seu cardápio com sucesso!` 
      : `"${finalName}" successfully compiled and appended to your active Menu!`
    );
  };

  const handlePrintRecipe = () => {
    const el = document.getElementById('drink-recipe-printable');
    if (el) {
      el.classList.remove('hidden');
      (el as HTMLElement).style.display = 'block';
    }

    const after = () => {
      if (el) {
        el.classList.add('hidden');
        (el as HTMLElement).style.display = '';
      }
      window.removeEventListener('afterprint', after);
    };

    window.addEventListener('afterprint', after);
    window.print();
  };

  if (!currentUser?.isLoggedIn) {
    // Simulated live updates for liquid color rendering in the tutorial
    const tutColors: Record<string, string> = {
      gin: 'from-cyan-500/70 via-blue-600/50 to-indigo-950/90',
      vodka: 'from-slate-100/40 via-blue-300/30 to-indigo-950/80',
      whisky: 'from-amber-500/70 via-yellow-600/50 to-amber-950/95',
      rum: 'from-amber-600/80 via-orange-700/60 to-orange-950/95'
    };

    const handleTutNext = () => {
      if (tutStep < 3) {
        setTutStep(prev => prev + 1);
      } else {
        triggerToast(
          lang === 'pt-BR'
            ? 'Demonstração concluída! Ative o VIP para salvar suas receitas!'
            : 'Walkthrough complete! Activate VIP to lock in your custom configurations!'
        );
      }
    };

    return (
      <div id="drink-creator-tutorial-workspace" className="space-y-8 text-left">
        {/* Tutorial Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 rounded-3xl p-6 shadow-xl relative">
          <div className="absolute right-[-20px] top-[-20px] w-48 h-48 rounded-full bg-amber-500/10 blur-[80px]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center space-x-1.5 text-amber-400 text-[10px] uppercase font-bold tracking-widest font-mono bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                <span>{lang === 'pt-BR' ? 'Demonstração Interativa VIP' : 'Interactive VIP Showcase'}</span>
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {lang === 'pt-BR' ? 'Como Funciona o Criador de Drinks VIP?' : 'How Does the VIP Custom Drink Creator Work?'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {lang === 'pt-BR' 
                  ? 'Experimente nossa simulação passo-a-passo. Veja como a conta VIP permite formular, temperar e decorar coquetéis sob medida com toques nobres e receitas totalmente personalizáveis!'
                  : 'Walk through our live mock simulator step-by-step. Discover how a VIP account lets you structure, spice, and decorate handcrafted drinks with premier active effects!'}
              </p>
            </div>
            <div className="shrink-0">
              <button
                id="tut-unlock-top-btn"
                onClick={onUpgradeVip}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-amber-500/10 font-sans"
              >
                {lang === 'pt-BR' ? 'Liberar VIP Grátis ✨' : 'Unlock Free VIP Upgrade ✨'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulator Content splitting */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Steps workflow controller */}
          <div className="col-span-1 lg:col-span-7 space-y-6">
            
            {/* Steps indicator tabs */}
            <div className="flex items-center justify-between bg-neutral-900/50 p-1.5 border border-neutral-850 rounded-2xl">
              {[0, 1, 2, 3].map((s) => {
                const labelsPt = ['Base', 'Aromáticos', 'Premium', 'AI Nome'];
                const labelsEn = ['Spirit', 'Infusion', 'Premium', 'AI Label'];
                const isActive = tutStep === s;
                return (
                  <button
                    key={s}
                    id={`tut-step-tab-${s}`}
                    onClick={() => setTutStep(s)}
                    className={`flex-1 text-center py-2.5 rounded-xl text-[11px] font-bold tracking-tight transition-all uppercase cursor-pointer ${
                      isActive 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <span className="font-mono text-[9px] block opacity-60">0{s+1}</span>
                    <span>{lang === 'pt-BR' ? labelsPt[s] : labelsEn[s]}</span>
                  </button>
                );
              })}
            </div>

            {/* Simulated Interactive Controls based on tutStep */}
            <AnimatePresence mode="wait">
              {tutStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-4 font-sans"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      1. {lang === 'pt-BR' ? 'Escolha do Álcool de Origem' : 'Select Native Base Spirit'}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === 'pt-BR' 
                        ? 'O coração do coquetel. Na conta VIP, você escolhe entre single malts envelhecidos, gins botânicos de Londres, ou vodkas triplo-filtradas.' 
                        : 'The molecular bulk. High VIP accounts offer choices of copper-pot scotches, craft botanical gins, or ultra-purified vodkas.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {[
                      { id: 'gin', labelPt: 'Modern Gin Botânico', labelEn: 'Craft Botanical Gin', color: '#00f0ff', desc: 'Acidez refrescante e zimbro' },
                      { id: 'vodka', labelPt: 'Vodka Icy Triple-Filtrada', labelEn: 'Triple-Filtered Vodka', color: '#ffffff', desc: 'Neutralidade e pureza absoluta' },
                      { id: 'whisky', labelPt: 'Aged Single Malt Whisky', labelEn: 'Aged Single Malt', color: '#f59e0b', desc: 'Estilo defumado e amadeirado' },
                      { id: 'rum', labelPt: 'Caribenho Cask Rum', labelEn: 'Caribbean Cask Rum', color: '#b45309', desc: 'Notas tropicais adocicadas' }
                    ].map(item => (
                      <button
                        key={item.id}
                        id={`tut-select-base-${item.id}`}
                        onClick={() => setTutBase(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          tutBase === item.id 
                            ? 'bg-amber-500/10 border-amber-500/40 text-white' 
                            : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{lang === 'pt-BR' ? item.labelPt : item.labelEn}</span>
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        </div>
                        <p className="text-[9px] text-[#a2d729] font-mono mt-1">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {tutStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-4 font-sans"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      2. {lang === 'pt-BR' ? 'Infusões e Diluentes Finos' : 'Fine Infusions & Mixers'}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === 'pt-BR' 
                        ? 'Defina o volume diluente. Usuários VIP combinam águas tónicas artesanais, xaropes de botânicos raros, e infusões florais.' 
                        : 'Calibrate your liquid volume. VIP accounts customize with high-grade Indian tonics, rare botanical syrups, and herbal infusions.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {[
                      { id: 'tonic', labelPt: 'Água Tônica Premium', labelEn: 'Premium Bitter Tonic', desc: 'Quinado natural importado' },
                      { id: 'citrus', labelPt: 'Brisa de Citrus Saborizada', labelEn: 'Zesty Citrus Splendor', desc: 'Limão cravo e tangerina' },
                      { id: 'soda', labelPt: 'Soda Artesanal de Hibisco', labelEn: 'Craft Hibiscus Soda', desc: 'Combinação floral azedinha' },
                      { id: 'cranberry', labelPt: 'Cranberry Selvagem Purificado', labelEn: 'Wild Cranberry Essence', desc: 'Frutos vermelhos e refrescância' }
                    ].map(item => (
                      <button
                        key={item.id}
                        id={`tut-select-mixer-${item.id}`}
                        onClick={() => setTutMixer(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          tutMixer === item.id 
                            ? 'bg-amber-500/10 border-amber-500/40 text-white' 
                            : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <span className="text-xs font-bold block">{lang === 'pt-BR' ? item.labelPt : item.labelEn}</span>
                        <span className="text-[9px] text-[#fe9d00] font-mono block mt-1">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {tutStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-4 font-sans"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      3. {lang === 'pt-BR' ? 'Toques Sensoriais de Elite' : 'Elite Sensory Upgrades'}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === 'pt-BR' 
                        ? 'O grande diferencial da coquetelaria moderna. Adicione efeitos espetaculares de névoa criogênica fumegante, pó perolado brilhante ou flocos de ouro 24k!' 
                        : 'Elevate chemistry into physical theater. Upgrade to VIP to include vaporous dry ice smoke, gold glitter leaf sheets, or pearlescent dynamic shine.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
                    {[
                      { id: 'gold', labelPt: 'Ouro 24k Comestível', labelEn: '24k Edible Gold Leaf', bonus: 'Luz e luxo visual' },
                      { id: 'mist', labelPt: 'Névoa Criogênica ❄️', labelEn: 'Cryogenic Vapor Fog ❄️', bonus: 'Efeito espetáculo' },
                      { id: 'pearl', labelPt: 'Pó Perolado Glitter', labelEn: 'Pearlescent Shimmer', bonus: 'Redemoinho estelar' }
                    ].map(item => (
                      <button
                        key={item.id}
                        id={`tut-select-touch-${item.id}`}
                        onClick={() => setTutTouch(item.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          tutTouch === item.id 
                            ? 'bg-amber-500/10 border-amber-500/40 text-white animate-pulse' 
                            : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-800 text-neutral-400'
                        }`}
                      >
                        <span className="text-xs font-extrabold block text-amber-400">{lang === 'pt-BR' ? item.labelPt : item.labelEn}</span>
                        <span className="text-[9px] text-[#a2d729] font-mono block mt-1">✓ {item.bonus}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {tutStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-6 space-y-4 font-sans"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      4. {lang === 'pt-BR' ? 'Batismo da Criação com Inteligência Artificial' : 'AI Naming & Technical Formulation sheets'}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === 'pt-BR' 
                        ? 'Nossa IA analisa a harmonia dos compostos químicos dos ingredientes ecológicos simulados e sugere um nome poético e luxuoso, compondo a ficha técnica completa pro bar!' 
                        : 'Our server intelligence inspects molecular density percentages of customized botanicals to suggest high-grade titles and assemble printable barista formulas!'}
                    </p>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-white">
                      {tutName || (lang === 'pt-BR' ? 'Aguardando batismo..' : 'Press Compose to name...')}
                    </span>
                    <button
                      id="tut-generate-ai-name-btn"
                      onClick={() => {
                        const samples = lang === 'pt-BR' 
                          ? ['Sussurro da Nebulosa', 'Glow de Ouro Single Malt', 'Brisa de Hibisco Alquimia', 'Aurora de Zimbro Premium'] 
                          : ['Whisper of the Nebula', 'Gold Crest Malt Shimmer', 'Hibiscus Alchemist Bloom', 'Starlight Juniper Frost'];
                        const idx = Math.floor(Math.random() * samples.length);
                        setTutName(samples[idx]);
                        triggerToast(lang === 'pt-BR' ? 'IA Batizou seu Drink de Luxo!' : 'AI Composed the Bespoke Cocktail Title!');
                      }}
                      className="bg-amber-500 hover:bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      {lang === 'pt-BR' ? 'Batizar com IA ✨' : 'Compose with AI ✨'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next step slider controls */}
            <div className="flex justify-between items-center bg-neutral-900/30 p-4 rounded-2xl border border-neutral-850">
              <span className="text-[10px] text-neutral-400 font-mono">
                {lang === 'pt-BR' ? `PASSO ${tutStep + 1} DE 4` : `STEP ${tutStep + 1} OF 4`}
              </span>
              <div className="flex gap-2">
                {tutStep > 0 && (
                  <button
                    id="tut-prev-step-btn"
                    onClick={() => setTutStep(prev => prev - 1)}
                    className="bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold text-xs"
                  >
                    {lang === 'pt-BR' ? 'Anterior' : 'Back'}
                  </button>
                )}
                <button
                  id="tut-next-step-btn"
                  onClick={handleTutNext}
                  className="bg-amber-500 text-black rounded-lg px-4 py-1.5 text-[11px] font-black uppercase tracking-wide cursor-pointer hover:bg-yellow-400 duration-200"
                >
                  {tutStep === 3 ? (lang === 'pt-BR' ? 'Instruções VIP ✓' : 'VIP Tour Complete ✓') : (lang === 'pt-BR' ? 'Próximo Passo' : 'Next Step')}
                </button>
              </div>
            </div>

          </div>

          {/* Right panel: Live Glass simulation mockup */}
          <div className="col-span-1 lg:col-span-5">
            <div className="bg-gradient-to-b from-[#111] to-[#080808] border border-neutral-800 rounded-3xl p-6 text-center space-y-6 relative overflow-hidden shadow-2xl">
              
              <div className="absolute top-2 right-2 flex items-center space-x-1.5 text-xs text-amber-400 font-bold tracking-tight uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full z-10 scale-90">
                <Lock className="w-3 h-3 text-amber-400 inline shrink-0" />
                <span>VIP LIVE DESIGNER</span>
              </div>

              {/* Dynamic drink fluid goblet mockup representation */}
              <div id="fluid-goblet-visualizer" className="mx-auto w-36 h-52 relative group mt-4">
                {/* Visual Glass Edge Outline representation */}
                <div className="absolute inset-0 border-r border-l border-b border-neutral-700/80 rounded-b-[42px] z-10 pointer-events-none rounded-t-[10px]">
                  {/* Rim light highlight */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-neutral-600/35 rounded-t-[10px] filter blur-[0.5px]" />
                </div>
                {/* Stem of goblet */}
                <div className="absolute bottom-[-18px] left-[50%] -translate-x-1/2 w-2 bg-neutral-700/60 h-8 font-mono" />
                <div className="absolute bottom-[-22px] left-[50%] -translate-x-1/2 w-16 bg-neutral-700/50 h-1 rounded-full" />

                {/* Simulated Fluid Liquid */}
                <div className="absolute inset-x-2 bottom-2 rounded-b-[36px] overflow-hidden bg-neutral-950 border-t border-white/10" style={{ height: '70%' }}>
                  <div className={`w-full h-full bg-gradient-to-t transition-all duration-700 ${tutColors[tutBase]}`}>
                    {/* Simulated Bubbles flowing */}
                    <div className="absolute inset-0 flex justify-between px-4 pb-2 select-none pointer-events-none opacity-40">
                      <span className="text-[7px] text-white/50 animate-bounce delay-75">◌</span>
                      <span className="text-[9px] text-[#fe9d00] animate-pulse">✨</span>
                      <span className="text-[6px] text-white/40 animate-bounce delay-500">◦</span>
                      <span className="text-[8px] text-[#a2d729] animate-bounce">◈</span>
                      <span className="text-[5px] text-white/80 animate-ping delay-1000">◌</span>
                    </div>

                    {/* Pearlescent glitter swirl effect if active */}
                    <div className="absolute inset-x-0 bottom-4 text-center">
                      <span className="text-[9px] tracking-widest text-[#fe9d00] font-black block opacity-85 uppercase font-mono animate-pulse">
                        {tutTouch === 'pearl' && '✨ PEARL SHIMMER ✨'}
                        {tutTouch === 'gold' && '⚜ 24K GOLD FLECK ⚜'}
                        {tutTouch === 'mist' && '❄️ CRYO COLD MIST ❄️'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cryo vapor simulation overlaying the top rim */}
                {tutTouch === 'mist' && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: [0.3, 0.6, 0.3], y: [-5, 0, -5] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-x-[-15px] top-[10%] h-12 bg-gradient-to-b from-blue-300/10 via-slate-100/15 to-transparent blur-md z-30 pointer-events-none"
                  />
                )}
              </div>

              {/* Informative specs cards */}
              <div className="space-y-2 pt-2 border-t border-neutral-900 text-left font-sans">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-neutral-500 font-mono">BASE</span>
                  <span className="text-white font-bold">{tutBase.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-neutral-500 font-mono">DILUENTE</span>
                  <span className="text-white font-bold">{tutMixer.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-neutral-500 font-mono">EFEITOS VIP</span>
                  <span className="text-amber-400 font-black tracking-wide font-mono uppercase">{tutTouch.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs border-t border-neutral-900/50 pt-2 text-[#a2d729] font-mono">
                  <span>ESTIMATED UNIT</span>
                  <span className="font-bold">R$ 38,50</span>
                </div>
              </div>

              {/* Big CTA */}
              <div className="pt-2">
                <button
                  id="tut-activate-vip-action"
                  onClick={onUpgradeVip}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-97 transition-all cursor-pointer font-sans shadow-xl shadow-amber-500/10"
                >
                  {lang === 'pt-BR' ? 'Ativar Criador Completo (VIP) ✨' : 'Unlock Complete VIP Builder ✨'}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Benefits Comparison Table showcase */}
        <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-850 rounded-3xl p-6 md:p-8 space-y-6 font-sans">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h4 className="text-lg font-extrabold text-white tracking-tight uppercase">
              {lang === 'pt-BR' ? 'Matriz de Vantagens da Ferramenta' : 'Feature Comparison Grid'}
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              {lang === 'pt-BR' ? 'Veja a diferença fundamental de controle ao ativar o modo VIP gratuito!' : 'Spot the fundamental control differences when unlocking our complimentary VIP license.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-350">
              <thead className="text-[10px] font-mono uppercase border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th scope="col" className="px-4 py-3">{lang === 'pt-BR' ? 'RECURSO DE CRIAÇÃO' : 'CREATIVE PERKS'}</th>
                  <th scope="col" className="px-4 py-3 text-neutral-500">{lang === 'pt-BR' ? 'PLANO GRÁTIS' : 'FREE PLAN'}</th>
                  <th scope="col" className="px-4 py-3 text-amber-400 text-right">🔒 {lang === 'pt-BR' ? 'UPGRADE VIP' : 'VIP LICENSES'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{lang === 'pt-BR' ? 'Rótulos Destilados' : 'Native spirits selection'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">{lang === 'pt-BR' ? 'Apenas Visualização / Tutorial' : 'Guided Demo Walkthrough'}</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {lang === 'pt-BR' ? 'Ilimitados de Luxo' : 'Infinite Luxury Selection'}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{lang === 'pt-BR' ? 'Quantidade de Receitas Salvas' : 'Saved Signature catalogs'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">{lang === 'pt-BR' ? 'Nenhuma (Apenas simulação)' : '0 (simulation and showcase)'}</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {lang === 'pt-BR' ? 'Sem limites (+ Cardápio Ativo)' : 'Infinite saved and indexed recipes'}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{lang === 'pt-BR' ? 'Efeitos Especiais de Bar' : 'Active Sensory Touches'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">{lang === 'pt-BR' ? 'Indisponível' : 'Unavailable'}</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {lang === 'pt-BR' ? 'Ouro 24k, Névoas, Brilho Perolado' : '24k Gold leaf, cryogenic dry-ice vapor'}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{lang === 'pt-BR' ? 'Desconto Estrutural Financeiro' : 'Built-in rebate multiplier'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">0%</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {lang === 'pt-BR' ? '7% de Desconto deduzido no fechamento' : '7% Deducted automatically from total events fee'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <BartenderBoxShowcase lang={lang} />

      </div>
    );
  }

  return (
    <div id="drink-creator-workspace" className="space-y-8 text-left">
      {/* Introduction Banner header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#171717] to-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
        <div className="absolute right-[-20px] top-[-20px] w-36 h-36 rounded-full bg-[#fe9d00] opacity-10 blur-[60px]" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 text-[#fe9d00] text-[10px] uppercase font-bold tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5 fill-[#fe9d00]" />
              <span>{lang === 'pt-BR' ? 'Menu R&D Exclusivo' : 'Exclusive R&D Menu Development'}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {lang === 'pt-BR' ? 'Criador de Drinks Exclusivos' : 'Exclusive Drink Creator Lab'}
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {lang === 'pt-BR' 
                ? 'Desenvolva coquetéis autorais refinados para o seu bar de eventos. Escolha álcool de base, diluente, infusões, guarnições e finalize com nossos efeitos premium.' 
                : 'Formulate bespoke signature cocktails for your event bar. Select base spirits, modifiers, infusions, garnishes and apply premium sensory final touches.'
              }
            </p>
          </div>
          <div className="shrink-0">
            <button
              id="reset-formulation-btn"
              onClick={handleResetFormulation}
              className="flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'pt-BR' ? 'Limpar Criação' : 'Reset Formula'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Ingredient Mixer Selection Configurator (8/12 space) */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          
          {/* STEP 1: BASE SPIRIT */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-5 space-y-3.5">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2.5">
              <span className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest">
                01. {lang === 'pt-BR' ? 'Destilado de Base' : 'Base Spirit / Core'}
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 font-mono bg-neutral-900 px-2 py-0.5 rounded-md">
                {lang === 'pt-BR' ? 'Selecione 1 opção' : 'Pick 1 Option'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BASE_SPIRITS.map(spirit => {
                const isSelected = selectedBase === spirit.id;
                return (
                  <button
                    id={`spirit-select-${spirit.id}`}
                    key={spirit.id}
                    onClick={() => { setSelectedBase(spirit.id); setIsSaved(false); }}
                    className={`p-3 rounded-xl border flex flex-col items-start text-left transition-all relative ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#fe9d00]/10 to-[#ff5d00]/5 border-[#fe9d00] text-white' 
                        : 'bg-[#121212]/50 border-neutral-800/80 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="w-full flex justify-between items-start gap-1">
                      <span className="text-xs font-bold text-neutral-200">{lang === 'pt-BR' ? spirit.namePt : spirit.nameEn}</span>
                      <span className="text-[9px] bg-amber-500/10 text-[#fe9d00] px-1.5 py-0.5 rounded-md font-mono font-black shrink-0">50 ml</span>
                    </div>
                    <span className="text-[10px] mt-1 text-neutral-500 font-mono">+{spirit.alcStrengthPt}</span>
                    <div className="flex justify-between items-center w-full mt-2 pt-1 border-t border-neutral-900/40 text-[10px] font-mono">
                      <span className="text-neutral-500">{spirit.calories} cal</span>
                      <span className={isSelected ? 'text-[#fe9d00] font-bold' : 'text-neutral-500'}>R${spirit.price.toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: MIXERS */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-5 space-y-3.5">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2.5">
              <span className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest">
                02. {lang === 'pt-BR' ? 'Diluente / Mixer' : 'Mixer / Soft Addition'}
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 font-mono bg-neutral-900 px-2 py-0.5 rounded-md">
                {lang === 'pt-BR' ? 'Influencia na cor' : 'Liquid Modifier'}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {MIXERS.map(mixer => {
                const isSelected = selectedMixer === mixer.id;
                return (
                  <button
                    id={`mixer-select-${mixer.id}`}
                    key={mixer.id}
                    onClick={() => { setSelectedMixer(mixer.id); setIsSaved(false); }}
                    className={`p-3 rounded-xl border flex flex-col items-start text-left transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#fe9d00]/10 to-[#ff5d00]/5 border-[#fe9d00] text-white' 
                        : 'bg-[#121212]/50 border-neutral-800/80 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-start space-x-1.5 w-full">
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: mixer.color }} />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-neutral-200 break-words whitespace-normal leading-tight block">{lang === 'pt-BR' ? mixer.namePt : mixer.nameEn}</span>
                        <span className="text-[9px] bg-neutral-900 text-amber-400 border border-neutral-850 px-1 py-0.2 mt-1 rounded font-mono font-bold inline-block">120 ml</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full mt-3 pt-1 border-t border-neutral-900/40 text-[10px] font-mono">
                      <span className="text-neutral-500">{mixer.calories} cal</span>
                      <span className={isSelected ? 'text-[#fe9d00] font-bold' : 'text-neutral-400'}>R${mixer.price.toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: FLAVORS & SYRUPS */}
          <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-5 space-y-3.5">
            <div className="flex justify-between items-center border-b border-neutral-900 pb-2.5">
              <span className="text-xs font-mono font-black text-neutral-400 uppercase tracking-widest">
                03. {lang === 'pt-BR' ? 'Infusões & Xaropes' : 'Flavors & Secret Syrups'}
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 font-mono bg-neutral-900 px-2 py-0.5 rounded-md">
                {lang === 'pt-BR' ? 'Identidade aromática' : 'Scent Core'}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {FLAVORS_SYRUPS.map(flavor => {
                const isSelected = selectedFlavor === flavor.id;
                return (
                  <button
                    id={`flavor-select-${flavor.id}`}
                    key={flavor.id}
                    onClick={() => { setSelectedFlavor(flavor.id); setIsSaved(false); }}
                    className={`p-3 rounded-xl border flex flex-col items-start text-left transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-[#fe9d00]/10 to-[#ff5d00]/5 border-[#fe9d00] text-white' 
                        : 'bg-[#121212]/50 border-neutral-800/80 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-start space-x-1.5 w-full">
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: flavor.color }} />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-neutral-200 break-words whitespace-normal leading-tight block">{lang === 'pt-BR' ? flavor.namePt : flavor.nameEn}</span>
                        <span className="text-[9px] bg-neutral-900 text-amber-400 border border-neutral-850 px-1 py-0.2 mt-1 rounded font-mono font-bold inline-block">
                          {flavor.id === 'none' ? '0 ml' : '20 ml'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center w-full mt-3 pt-1 border-t border-neutral-900/40 text-[10px] font-mono">
                      <span className="text-neutral-500">{flavor.calories} cal</span>
                      <span className={isSelected ? 'text-[#fe9d00] font-bold' : 'text-neutral-450'}>R${flavor.price.toFixed(2)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CO-STEP 4: GARNISH & SHIELD */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-4 space-y-3">
              <span className="block text-xs font-mono font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                04. {lang === 'pt-BR' ? 'Guarnição' : 'Cocktail Garnish'}
              </span>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto scrollbar-thin">
                <button
                  id="garnish-none"
                  onClick={() => { setSelectedGarnishes(['none']); setIsSaved(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex justify-between items-center transition-all ${
                    selectedGarnishes.includes('none') 
                      ? 'border-[#fe9d00] bg-[#fe9d00]/10 text-white font-bold' 
                      : 'border-neutral-900 bg-neutral-950/40 text-neutral-400'
                  }`}
                >
                  <span>{lang === 'pt-BR' ? 'Nenhuma Guarnição' : 'No Garnish'}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">R$0.00</span>
                </button>
                {GARNISHES.map(garnish => {
                  const isSelected = selectedGarnishes.includes(garnish.id);
                  return (
                    <button
                      id={`garnish-select-${garnish.id}`}
                      key={garnish.id}
                      onClick={() => {
                        setIsSaved(false);
                        if (isSelected) {
                          const nextGarnishes = selectedGarnishes.filter(id => id !== garnish.id);
                          setSelectedGarnishes(nextGarnishes.length === 0 ? ['none'] : nextGarnishes);
                        } else {
                          const nextGarnishes = [...selectedGarnishes.filter(id => id !== 'none'), garnish.id];
                          setSelectedGarnishes(nextGarnishes);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex justify-between items-center transition-all ${
                        isSelected 
                          ? 'border-[#fe9d00] bg-[#fe9d00]/10 text-white font-bold' 
                          : 'border-neutral-900 bg-neutral-950/40 text-neutral-400'
                      }`}
                    >
                      <span>{lang === 'pt-BR' ? garnish.namePt : garnish.nameEn}</span>
                      <span className="text-[10px] font-mono text-[#fe9d00]">R${garnish.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-4 space-y-3">
              <span className="block text-xs font-mono font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                05. {lang === 'pt-BR' ? 'Toque Premium' : 'Sensory Final Touch'}
              </span>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto scrollbar-thin">
                <button
                  id="premium-touch-none"
                  onClick={() => { setSelectedPremiums(['none']); setIsSaved(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex justify-between items-center transition-all ${
                    selectedPremiums.includes('none') 
                      ? 'border-[#fe9d00] bg-[#fe9d00]/10 text-white font-bold' 
                      : 'border-neutral-900 bg-neutral-950/40 text-neutral-400'
                  }`}
                >
                  <span>{lang === 'pt-BR' ? 'Nenhum Toque Especial' : 'No Premium Accent'}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">R$0.00</span>
                </button>
                {PREMIUM_TOUCHES.map(pt => {
                  const isSelected = selectedPremiums.includes(pt.id);
                  return (
                    <button
                      id={`premium-select-${pt.id}`}
                      key={pt.id}
                      onClick={() => {
                        setIsSaved(false);
                        if (isSelected) {
                          const nextPremiums = selectedPremiums.filter(id => id !== pt.id);
                          setSelectedPremiums(nextPremiums.length === 0 ? ['none'] : nextPremiums);
                        } else {
                          const nextPremiums = [...selectedPremiums.filter(id => id !== 'none'), pt.id];
                          setSelectedPremiums(nextPremiums);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex justify-between items-center transition-all ${
                        isSelected 
                          ? 'border-[#fe9d00] bg-[#fe9d00]/10 text-white font-bold' 
                          : 'border-neutral-900 bg-neutral-950/40 text-neutral-400'
                      }`}
                    >
                      <span className="truncate flex items-center space-x-1.5">
                        <span>{lang === 'pt-BR' ? pt.namePt : pt.nameEn}</span>
                        {!currentUser?.isLoggedIn && (
                          <span className="text-[8px] scale-90 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-black tracking-widest font-mono shrink-0">VIP</span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-[#fe9d00] shrink-0">R${pt.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive SVG Preview, Calculations, Actions (5/12 space) */}
        <div className="col-span-1 lg:col-span-5 space-y-6">
          
          {/* INTERACTIVE DRINK PREVIEW GLASS CARD */}
          <div className="bg-gradient-to-b from-[#111111] to-[#0c0c0c] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
            {/* Ambient Background Highlights based on Liquid components */}
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${visualLiquidColor} 0%, transparent 70%)`
              }}
            />

            {/* Glowing VIP Score badge */}
            <div className="absolute top-4 left-4 inline-flex items-center space-x-1 bg-black/60 backdrop-blur border border-[#a2d729]/30 rounded-full px-2.5 py-1 z-10 text-[10px] font-black text-[#a2d729] font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>SCORE: {formulaVIPScore}/10</span>
            </div>

            {/* Title / Scent Spec indicators */}
            <div className="w-full text-center space-y-1 z-10 mt-2 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#fe9d00] font-bold block">
                {lang === 'pt-BR' ? 'CARDÁPIO AUTORAL VIP' : ' Bespoke Signature Recipe'}
              </span>
              <h3 className="text-xl font-bold font-sans text-white px-4 leading-snug">
                {drinkName.trim() || (lang === 'pt-BR' ? 'Sem Nome' : 'Unnamed Elixir')}
              </h3>
            </div>

            {/* THE EXPERIMENTAL COCKTAIL GLASS VISUALIZER (SVG DYNAMICS) */}
            <div className="relative w-48 h-56 flex items-center justify-center z-10 my-4">
              <svg 
                viewBox="0 0 160 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
              >
                {/* Dry Ice smoke effect elements */}
                {selectedPremiums.includes('dry_ice') && (
                  <g opacity="0.45" id="cryogenic-smoke">
                    <path d="M 40,30 Q 50,10 70,30 T 100,20" stroke="#f0fdf4" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6">
                      <animate attributeName="d" dur="3s" repeatCount="indefinite" values="M 40,30 Q 50,10 70,30 T 100,20; M 40,25 Q 60,5 80,25 T 110,25; M 40,30 Q 50,10 70,30 T 100,20" />
                    </path>
                    <path d="M 50,40 Q 70,15 90,40 T 130,30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4">
                      <animate attributeName="d" dur="3.5s" repeatCount="indefinite" values="M 50,40 Q 70,15 90,40 T 130,30; M 50,35 Q 80,10 100,35 T 120,35; M 50,40 Q 70,15 90,40 T 130,30" />
                    </path>
                  </g>
                )}

                {/* Cocktail Glass Base */}
                <path d="M 50,180 L 110,180" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
                {/* Glass Stem */}
                <line x1="80" y1="110" x2="80" y2="180" stroke="#FFFFFF" strokeWidth="4.5" opacity="0.35" strokeLinecap="round" />

                {/* Glass Cup Outer Outline */}
                <path d="M 28,40 L 80,110 L 132,40 Z" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" opacity="0.45" />

                {/* Sparkling Glitter Dust of premium effects */}
                {selectedPremiums.includes('glitter') && (
                  <g id="sparkling-pearls">
                    <circle cx="65" cy="60" r="1.5" fill="#ec4899">
                      <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="95" cy="75" r="1.5" fill="#ec4899">
                      <animate attributeName="opacity" values="1;0.1;1" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="80" cy="55" r="2" fill="#ffd700">
                      <animate attributeName="opacity" values="0.1;0.9;0.1" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}

                {/* Golden Flakes floating rendering */}
                {selectedPremiums.includes('gold_flakes') && (
                  <g id="gold-luxury-flakes">
                    <polygon points="60,65 64,63 62,68" fill="#fbbf24" opacity="0.9">
                      <animate attributeName="transform" type="translate" values="0,0; 0,8; 0,0" dur="4s" repeatCount="indefinite" />
                    </polygon>
                    <polygon points="90,55 95,57 91,62" fill="#fbbf24" opacity="0.9">
                      <animate attributeName="transform" type="translate" values="0,0; -4,12; 0,0" dur="5s" repeatCount="indefinite" />
                    </polygon>
                    <polygon points="75,85 78,82 77,88" fill="#fbbf24" opacity="0.8">
                      <animate attributeName="transform" type="translate" values="0,0; 2,-6; 0,0" dur="4.2s" repeatCount="indefinite" />
                    </polygon>
                  </g>
                )}

                {/* Interactive Dynamic Color Blend Liquid Fill inside glass cup */}
                {/* Points: M 43,60 (liquid top surface) -> L 80,110 -> 117,60 Z */}
                <path d="M 43,62 L 80,110 L 117,62 Z" fill={visualLiquidColor} opacity="0.88" />

                {/* Liquid top surface wave / froth line */}
                <path d="M 43,62 Q 80,68 117,62" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" fill="none" />

                {/* Mini garnish representation (mounted or floating) */}
                {selectedGarnishes.includes('lemon_wheel') && (
                  <circle cx="123" cy="40" r="12" fill="#a2d729" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.95" />
                )}
                {selectedGarnishes.includes('cherry') && (
                  <circle cx="80" cy="70" r="7.5" fill="#991b1b" stroke="#ffffff" strokeWidth="1" opacity="0.95" />
                )}
                {selectedGarnishes.includes('orange_twist') && (
                  <path d="M 112,38 C 122,35 125,50 135,46" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.95" />
                )}
                {selectedGarnishes.includes('rosemary') && (
                  <line x1="60" y1="30" x2="100" y2="85" stroke="#15803d" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                )}
                {selectedGarnishes.includes('cinnamon') && (
                  <line x1="50" y1="25" x2="105" y2="95" stroke="#78350f" strokeWidth="5.5" strokeLinecap="round" opacity="0.9" />
                )}

                {/* Spicy Rim Glass decoration helper */}
                {selectedPremiums.includes('chili_rim') && (
                  <path d="M 28,40 Q 80,48 132,40" stroke="#ef4444" strokeWidth="5.5" opacity="0.9" strokeLinecap="round" fill="none" />
                )}
              </svg>
            </div>

            {/* Cocktail Spec quick cards summary */}
            <div className="w-full bg-neutral-950/60 border border-neutral-900 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between items-start text-neutral-400">
                <span className="shrink-0">{lang === 'pt-BR' ? 'Componente de Base' : 'Core Alcohol'}</span>
                <div className="text-right">
                  <span className="text-white font-semibold font-mono text-right break-words block">{lang === 'pt-BR' ? baseObj.namePt : baseObj.nameEn}</span>
                  <span className="text-[10px] text-[#fe9d00] font-bold font-mono">50 ml</span>
                </div>
              </div>
              <div className="flex justify-between items-start text-neutral-400">
                <span className="shrink-0">{lang === 'pt-BR' ? 'Diluente Utilizado' : 'Carbonation Mixer'}</span>
                <div className="text-right">
                  <span className="text-white font-semibold font-mono text-right break-words block">{lang === 'pt-BR' ? mixerObj.namePt : mixerObj.nameEn}</span>
                  <span className="text-[10px] text-[#fe9d00] font-bold font-mono">120 ml</span>
                </div>
              </div>
              <div className="flex justify-between items-start text-neutral-400">
                <span className="shrink-0">{lang === 'pt-BR' ? 'Aroma Secundário' : 'Flavor Infusion'}</span>
                <div className="text-right">
                  <span className="text-white font-semibold font-mono text-right break-words block">{lang === 'pt-BR' ? flavorObj.namePt : flavorObj.nameEn}</span>
                  <span className="text-[10px] text-[#fe9d00] font-bold font-mono">{flavorObj.id === 'none' ? '0 ml' : '20 ml'}</span>
                </div>
              </div>
              <div className="flex justify-between items-start text-neutral-400">
                <span className="shrink-0">{lang === 'pt-BR' ? 'Guarnição(ões)' : 'Garnish(es)'}</span>
                <span className="text-white font-semibold font-mono text-right break-words max-w-[65%] ml-2">
                  {garnishObjs.length > 0 ? garnishObjs.map(g => lang === 'pt-BR' ? g.namePt : g.nameEn).join(', ') : (lang === 'pt-BR' ? 'Nenhuma' : 'None')}
                </span>
              </div>
              <div className="flex justify-between items-start text-neutral-400">
                <span className="shrink-0">{lang === 'pt-BR' ? 'Toques Premium' : 'Premium Touches'}</span>
                <span className="text-white font-semibold font-mono text-right break-words max-w-[65%] ml-2">
                  {premiumObjs.length > 0 ? premiumObjs.map(p => lang === 'pt-BR' ? p.namePt : p.nameEn).join(', ') : (lang === 'pt-BR' ? 'Nenhuns' : 'None')}
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-400 pt-1 border-t border-neutral-900/60 font-mono">
                <span>{lang === 'pt-BR' ? 'Volume Total' : 'Total Volume'}</span>
                <span className="text-amber-400 font-bold">
                  {50 + 120 + (flavorObj.id === 'none' ? 0 : 20)} ml
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>{lang === 'pt-BR' ? 'Calorias Estimadas' : 'Estimated Calories'}</span>
                <span className="text-[#a2d729] font-bold font-mono">
                  {baseObj.calories + mixerObj.calories + flavorObj.calories + garnishObjs.reduce((acc, g) => acc + g.calories, 0) + premiumObjs.reduce((acc, p) => acc + p.calories, 0)} kcal
                </span>
              </div>
            </div>

          </div>

          {/* DYNAMIC FORMULATION COST & NAMING CARD */}
          <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 space-y-4">
            
            {/* Cocktail Custom Name Composer Section */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-neutral-400 block">
                {lang === 'pt-BR' ? 'Nome do seu Cocktail Autoral' : 'Draft Cocktail Custom Title'}
              </label>
              
              <div className="flex space-x-2">
                <input
                  id="custom-drink-name-input"
                  type="text"
                  value={drinkName}
                  onChange={(e) => { setDrinkName(e.target.value); setIsSaved(false); }}
                  placeholder={lang === 'pt-BR' ? 'Ex: Sunset VIP Gold' : 'e.g., Mystic Twilight Blend'}
                  className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-[#fe9d00] rounded-xl px-4 py-3 text-xs text-white focus:outline-none placeholder-neutral-605"
                />
                <button
                  id="ai-generate-name-btn"
                  onClick={handleGenerateAIName}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 shrink-0"
                  title={lang === 'pt-BR' ? 'Gerar Nome com Inteligência Artificial' : 'Decompose Cocktail Title via AI rules'}
                >
                  <Sparkles className="w-4 h-4 text-[#fe9d00] fill-[#fe9d00]" />
                  <span className="hidden sm:inline">AI</span>
                </button>
              </div>
            </div>

            {/* Calculations & Pricing Grid */}
            <div className="border-t border-neutral-900 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block leading-none mb-1">
                  {lang === 'pt-BR' ? 'Custo de Produção / Dose' : 'Production Cost / Glass'}
                </span>
                <span className="text-3xl font-extrabold text-[#a2d729] font-mono">
                  R$ {unitPrice.toFixed(2)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block leading-none mb-1">
                  {lang === 'pt-BR' ? 'Status Ativo' : 'Current Status'}
                </span>
                <span className="text-[10px] bg-[#fe9d00]/10 text-[#fe9d00] font-extrabold px-2.5 py-1 rounded-full border border-[#fe9d00]/20">
                  {lang === 'pt-BR' ? 'Pronto para o Bar' : 'Mixology Ready'}
                </span>
              </div>
            </div>

            {/* Actions CTA panel */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              <button
                id="save-recipe-card-btn"
                onClick={handleSaveToMenu}
                disabled={isSaved}
                className="col-span-1 bg-gradient-to-tr from-[#fe9d00] to-[#ff5d00] hover:brightness-110 active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none text-black font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(254,157,0,0.3)] flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{lang === 'pt-BR' ? 'Compilar Drink' : 'Compile cocktail'}</span>
              </button>

              <button
                id="print-drink-recipe-btn"
                onClick={() => {
                  handlePrintRecipe();
                  triggerToast(lang === 'pt-BR' ? 'Gerando ficha técnica do drink para o bar...' : 'Generating standard barista formulation recipes...');
                }}
                className="col-span-1 bg-[#151515] hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'pt-BR' ? 'Imprimir Ficha' : 'Print Recipe'}</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* PRINTABLE RECIPE CARD - only visible when printing */}
      <div id="drink-recipe-printable" className="hidden">
        <div className="min-h-screen bg-white text-black p-8">
          <div className="max-w-3xl mx-auto border border-black/10 rounded-3xl p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-black mb-2">{drinkName.trim() || (lang === 'pt-BR' ? 'Cocktail Sem Nome' : 'Unnamed Cocktail')}</h1>
              <p className="text-sm text-neutral-600">{lang === 'pt-BR' ? 'Ficha técnica de drink criada pelo bartender digital' : 'Recipe card created by the digital bartender'}</p>
            </div>
            <div className="grid gap-4 text-sm text-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Base' : 'Base'}</span>
                  <span>{lang === 'pt-BR' ? baseObj.namePt : baseObj.nameEn}</span>
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Diluente' : 'Mixer'}</span>
                  <span>{lang === 'pt-BR' ? mixerObj.namePt : mixerObj.nameEn}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Xarope/Infusão' : 'Flavor'}</span>
                  <span>{lang === 'pt-BR' ? flavorObj.namePt : flavorObj.nameEn}</span>
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Volume Total' : 'Total Volume'}</span>
                  <span>{50 + 120 + (flavorObj.id === 'none' ? 0 : 20)} ml</span>
                </div>
              </div>
              <div className="grid gap-4">
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Guarnição(ões)' : 'Garnish(es)'}</span>
                  <span>{garnishObjs.length > 0 ? garnishObjs.map(g => lang === 'pt-BR' ? g.namePt : g.nameEn).join(', ') : (lang === 'pt-BR' ? 'Nenhuma' : 'None')}</span>
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Toques Premium' : 'Premium Touches'}</span>
                  <span>{premiumObjs.length > 0 ? premiumObjs.map(p => lang === 'pt-BR' ? p.namePt : p.nameEn).join(', ') : (lang === 'pt-BR' ? 'Nenhuns' : 'None')}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/10 text-sm">
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Calorias' : 'Calories'}</span>
                  <span>{baseObj.calories + mixerObj.calories + flavorObj.calories + garnishObjs.reduce((acc, g) => acc + g.calories, 0) + premiumObjs.reduce((acc, p) => acc + p.calories, 0)} kcal</span>
                </div>
                <div>
                  <span className="block font-bold">{lang === 'pt-BR' ? 'Custo Estimado' : 'Estimated Cost'}</span>
                  <span>R$ {unitPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 text-sm leading-relaxed text-black">
              <h2 className="font-bold mb-3">{lang === 'pt-BR' ? 'Modo de Preparo' : 'Preparation'}</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>{lang === 'pt-BR' ? 'Misture a base com o diluente e o xarope ou infusão em uma coqueteleira ou copo alto.' : 'Combine the base spirit with the mixer and syrup or infusion in a shaker or highball glass.'}</li>
                <li>{lang === 'pt-BR' ? 'Adicione gelo e mexa delicadamente para equilibrar aromas sem diluir demais.' : 'Add ice and stir gently to balance aromas without over-diluting.'}</li>
                <li>{lang === 'pt-BR' ? 'Finalize com a(s) guarnição(ões) e o(s) toque(s) premium selecionado(s).' : 'Finish with the selected garnish(es) and premium touch(es).'} </li>
                <li>{lang === 'pt-BR' ? 'Sirva imediatamente e compartilhe sua criação com o bar.' : 'Serve immediately and share your creation with the bar.'}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <BartenderBoxShowcase lang={lang} />
      <AnimatePresence>
        {showUpgradeModal && (
          <div id="creator-upgrade-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-center text-white"
            >
              <div className="absolute top-[-50px] left-[50%] -translate-x-1/2 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
              
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/35">
                <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-black text-amber-400 tracking-widest uppercase bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {lang === 'pt-BR' ? 'UPGRADE EXCLUSIVO DISPONÍVEL' : 'EXCLUSIVE PREMIUM UPGRADE AVAILABLE'}
                </span>
                <h4 className="text-xl font-extrabold tracking-tight uppercase">
                  {modalReason === 'premium' 
                    ? (lang === 'pt-BR' ? 'Liberar Efeitos Elite' : 'Unlock Elite Accents')
                    : (lang === 'pt-BR' ? 'Limite do Plano Grátis' : 'Free Action Quota Met')}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {modalReason === 'premium' ? (
                    lang === 'pt-BR' 
                      ? 'Nossa névoa fria, pó perolado e flocos de ouro são recursos refinados de mixologia. Faça o upgrade VIP para adicionar estas jóias sensoriais ao cardápio da sua festa!'
                      : 'Our ambient fog, pearlescent particles, and edible 24k gold are high-grade bar practices. Upgrade to VIP to include these outstanding details in your party planner!'
                  ) : (
                    lang === 'pt-BR'
                      ? 'No plano gratuito o limite é de 1 criação autoral simultânea. Desbloqueie o acesso VIP gratuitamente para inventar um catálogo ilimitado de receitas autorais!'
                      : 'Under the Free plan, you can save 1 signature cocktail at a time. Upgrade to our VIP layout for free to invent an infinite stream of premium drink recipes!'
                  )}
                </p>
              </div>

              {/* Benefits list */}
              <div className="bg-black/50 border border-neutral-800 rounded-2xl p-4 text-left text-xs space-y-2.5 font-sans">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <span className="text-[#a2d729] font-black">✓</span>
                  <span>{lang === 'pt-BR' ? 'Criação ilimitada de coquetéis autorais' : 'Unlimited custom cocktails workspace'}</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300">
                  <span className="text-[#a2d729] font-black">✓</span>
                  <span>{lang === 'pt-BR' ? 'Acesso gratuito a todos os Toques Premium' : 'Free access to all Premium Sensory Touch effects'}</span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300">
                  <span className="text-[#a2d729] font-black">✓</span>
                  <span>{lang === 'pt-BR' ? 'Desconto extra de 7% aplicado no orçamento total' : 'Extra 7% inherent client discount on setup totals'}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-2.5">
                <button
                  id="modal-unlock-vip-btn"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    if (onUpgradeVip) onUpgradeVip();
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-3 rounded-xl text-black text-xs font-black uppercase tracking-widest hover:brightness-115 transition-all text-center cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {lang === 'pt-BR' ? 'Quero Acesso VIP Grátis ✨' : 'Unlock Free VIP Upgrade ✨'}
                </button>
                <button
                  id="modal-close-btn"
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-transparent hover:bg-neutral-800 border border-neutral-850 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all text-center cursor-pointer"
                >
                  {lang === 'pt-BR' ? 'Voltar e ajustar cocktail' : 'Back to adjust recipe'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
