import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beef, 
  Fish, 
  Pizza, 
  Flame, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  UtensilsCrossed, 
  Sliders, 
  Wine, 
  GlassWater, 
  Beer, 
  Scale, 
  AlertCircle,
  Lock
} from 'lucide-react';
import { Drink, Language } from '../types';
import { SafeImage } from './SafeImage';

interface MenuHarmonizerProps {
  lang: Language;
  triggerToast: (title: string, message: string, type: 'success' | 'info' | 'error') => void;
  onSelectDrink?: (drinkId: string) => void;
  currentUser?: any;
  onUpgradeVip?: () => void;
  drinks?: Drink[];
}

interface FoodType {
  id: string;
  namePt: string;
  nameEn: string;
  icon: any;
  descPt: string;
  descEn: string;
  // Default values for sliders [Spicy, Richness/Fat, Acidity, Sweetness] (0 to 100)
  defaults: {
    spicy: number;
    richness: number;
    acidity: number;
    sweetness: number;
  };
}

const FOOD_TYPES: FoodType[] = [
  {
    id: 'meats',
    namePt: 'Carnes Grelhadas & Churrasco',
    nameEn: 'Premium Meats & BBQ',
    icon: Beef,
    descPt: 'Cortes premium de carnes vermelhas, costelas defumadas e carnes suculentas com gordura selada.',
    descEn: 'Premium cuts of red meat, smoked ribs, and juicy meats with rich seared crusts.',
    defaults: { spicy: 25, richness: 85, acidity: 15, sweetness: 0 }
  },
  {
    id: 'seafood',
    namePt: 'Peixes & Frutos do Mar',
    nameEn: 'Fish & Seafood',
    icon: Fish,
    descPt: 'Camarões salteados, ostras frescas, bacalhau nobre ou peixes grelhados com ervas finas.',
    descEn: 'Sautéed shrimp, fresh oysters, noble codfish or grilled fish with fine herbs.',
    defaults: { spicy: 10, richness: 40, acidity: 50, sweetness: 10 }
  },
  {
    id: 'pasta',
    namePt: 'Massas, Risotos & Queijos',
    nameEn: 'Pastas, Risottos & Cheese',
    icon: Pizza,
    descPt: 'Massas ao molho carbonara fresco, risoto de queijos nobres ou tábua de queijos curados.',
    descEn: 'Fresh carbonara pasta, noble cheese risottos or premium cured cheese boards.',
    defaults: { spicy: 15, richness: 75, acidity: 35, sweetness: 15 }
  },
  {
    id: 'burgers',
    namePt: 'Hambúrgueres & Finger Foods',
    nameEn: 'Burgers & Pub Finger Foods',
    icon: UtensilsCrossed,
    descPt: 'Hambúrgueres artesanais grelhados na brasa, fritas crocantes com bacon e petiscos fritos.',
    descEn: 'Barbecue-grilled artisanal burgers, crispy fries with bacon, and deep-fried finger foods.',
    defaults: { spicy: 35, richness: 90, acidity: 20, sweetness: 20 }
  },
  {
    id: 'salads',
    namePt: 'Saladas & Pratos Verdes',
    nameEn: 'Fresh Salads & Green Plates',
    icon: Sparkles,
    descPt: 'Saladas mediterrâneas, pratos veganos leves com azeite de oliva e emulsões cítricas.',
    descEn: 'Mediterranean salads, light vegan creations, dressed with extra virgin olive oil.',
    defaults: { spicy: 5, richness: 20, acidity: 65, sweetness: 25 }
  },
  {
    id: 'desserts',
    namePt: 'Sobremesas & Doces Finos',
    nameEn: 'Fine Desserts & Sweets',
    icon: Wine,
    descPt: 'Trufas de chocolate belga, petit gâteau de caramelo ou tortas de frutas silvestres doces.',
    descEn: 'Belgian chocolate truffles, salted caramel petit gâteau, or wild sweet fruit tarts.',
    defaults: { spicy: 0, richness: 55, acidity: 20, sweetness: 90 }
  }
];

export default function MenuHarmonizer({ 
  lang, 
  triggerToast, 
  onSelectDrink,
  currentUser,
  onUpgradeVip,
  drinks = []
}: MenuHarmonizerProps) {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('meats');
  
  // Interactive Tutorial States for Free Users
  const [tutFood, setTutFood] = useState<string>('steak');
  const [tutIsCalculating, setTutIsCalculating] = useState<boolean>(false);
  
  // Audio or sensory profile states (customized on top of food default presets)
  const [spicy, setSpicy] = useState<number>(FOOD_TYPES[0].defaults.spicy);
  const [richness, setRichness] = useState<number>(FOOD_TYPES[0].defaults.richness);
  const [acidity, setAcidity] = useState<number>(FOOD_TYPES[0].defaults.acidity);
  const [sweetness, setSweetness] = useState<number>(FOOD_TYPES[0].defaults.sweetness);
 
  const selectedFood = useMemo(() => {
    return FOOD_TYPES.find(f => f.id === selectedFoodId) || FOOD_TYPES[0];
  }, [selectedFoodId]);
 
  // Handle Preset quick selector click
  const handleSelectPreset = (food: FoodType) => {
    setSelectedFoodId(food.id);
    setSpicy(food.defaults.spicy);
    setRichness(food.defaults.richness);
    setAcidity(food.defaults.acidity);
    setSweetness(food.defaults.sweetness);
    
    triggerToast(
      lang === 'pt-BR' ? 'Prato Selecionado' : 'Dish Selected',
      lang === 'pt-BR' 
        ? `Injetando perfil de sabor para: ${food.namePt}` 
        : `Injecting flavor profile presets for: ${food.nameEn}`,
      'info'
    );
  };
 
  // Harmonization logic that reads the current flavor profile dynamic sliders and scores DRINKS
  const analyzedPairings = useMemo(() => {
    return drinks.map(drink => {
      let score = 50; // default baseline score
      let pairingNotePt = '';
      let pairingNoteEn = '';
      let isPerfectMatch = false;

      // Rule based sommelier matching index
      switch (drink.id) {
        case '1': // Craft IPA Special Reserve (High bitterness, crisp body, carbonation)
          // IPA cuts lipid fatty structures (richness) and highlights spicy notes!
          score += (richness * 0.4) + (spicy * 0.3);
          if (richness > 70 && spicy > 20) {
            score += 25;
            isPerfectMatch = true;
            pairingNotePt = 'A forte carbonatação e o amargor do lúpulo quebram com perfeição as fibras gordurosas de cortes bovinos e realçam o calor de receitas picantes.';
            pairingNoteEn = 'High carbonation and deep hop bitterness carve cleanly through fatty meats and amplify spicy elements beautifully.';
          } else {
            pairingNotePt = 'Excelente contraste para clarear o paladar após garfadas salgadas ou defumadas.';
            pairingNoteEn = 'Outstanding palate cleanser that resets your mouth after savory, smoked bites.';
          }
          break;

        case '2': // Premium London Dry Gin (Complex botanicals, high dry alcohol level)
          // Gin handles botanical balance, fits spicy foods or aromatic desserts
          score += (spicy * 0.3) + (sweetness * 0.3);
          if (spicy > 30) {
            score += 20;
            pairingNotePt = 'O zimbro e notas herbificadas neutralizam a pimenta na medida certa, criando um after-taste refrescante deslumbrante.';
            pairingNoteEn = 'The botanical juniper base neutralizes strong peppers, producing a chilling and refreshing after-taste.';
          } else {
            pairingNotePt = 'Drink ideal para coquetéis secos com petiscos aromáticos.';
            pairingNoteEn = 'An excellent pick for dry gin infusions paired alongside aromatic finger foods.';
          }
          break;

        case '3': // Cabernet Sauvignon 2018 (High tannin red wine, full body)
          // Red wine binds with proteins (richness) in red meats
          score += (richness * 0.5) - (acidity * 0.2);
          if (richness > 75) {
            score += 30;
            isPerfectMatch = true;
            pairingNotePt = 'Os taninos estruturados deste tinto abraçam as gorduras da carne vermelha, resultando em suavidade pura de ambas as partes na boca.';
            pairingNoteEn = 'The heavy, structural tannins from this Cabernet bind flawlessly with fatty red meat, forming a velvet-smooth textures on your tongue.';
          } else {
            pairingNotePt = 'Ideal para pratos suculentos e robustos com molhos encorpados e queijos maduros.';
            pairingNoteEn = 'Best suited for hearty, savory warm dishes with heavy reductions and aged cheese profiles.';
          }
          break;

        case '4': // Sauvignon Blanc Limited (High crisp acidity white wine)
          // White wine cuts through fatty fish acids or fresh salad dressings
          score += (acidity * 0.5) + (richness * 0.1) - (sweetness * 0.2);
          if (acidity > 40 && selectedFoodId === 'seafood') {
            score += 30;
            isPerfectMatch = true;
            pairingNotePt = 'Acidez mineral crocante que reverbera perfeitamente com frutos do mar salteados, simulando o efeito de raspas de limão siciliano fresco.';
            pairingNoteEn = 'Crisp, mineral-driven acidity that acts like a squeeze of fresh lemon, raising seafood notes onto a new tier.';
          } else if (selectedFoodId === 'salads') {
            score += 25;
            isPerfectMatch = true;
            pairingNotePt = 'Harmonização por semelhança! Notas herbáceas do vinho casam lindamente com temperos verdes e emulsões rústicas.';
            pairingNoteEn = 'Congruent pairing! Green herbal undertones of the wine blend naturally with olive garden herbs and olive oil dressings.';
          } else {
            pairingNotePt = 'Vinho branco leve e frutado de alta classe.';
            pairingNoteEn = 'Light, crisp high-end white wine to refresh the palate.';
          }
          break;

        case '5': // Craft IPA Premium Box
          score += (richness * 0.3) + (spicy * 0.2);
          pairingNotePt = 'Formato pack de cerveja ideal para acompanhar porções generosas de hambúrguer e petiscos fritos da galera.';
          pairingNoteEn = 'Beer pack format perfect for pairing with generous sharing portions of burgers and crispy treats.';
          break;

        case '6': // Master Mixology Kit (Citrus & spices cocktail prep)
          score += (sweetness * 0.3) + (acidity * 0.2);
          if (selectedFoodId === 'desserts') {
            score += 25;
            pairingNotePt = 'A acidez cítrica e os temperos secos cortam a untuosidade pesada de chocolates belgas, deixando a sobremesa leve e nada enjoativa.';
            pairingNoteEn = 'Heavy citrus and dry spice notes contrast well with dense Belgian chocolates, refreshing the palate between sweet bites.';
          } else {
            pairingNotePt = 'Kit de mixologia para criar misturas customizadas estimulantes que se adaptam a aperitivos leves.';
            pairingNoteEn = 'A proactive mixology workspace built to invent custom dynamic beverages suitable for appetizers.';
          }
          break;

        case '7': // Água das Pedras Premium Sparkling (100% natural gaseous water)
          score += (richness * 0.2) + (acidity * 0.2);
          pairingNotePt = 'Graças à sua gaseificação natural excepcional, esta mineral limpa as papilas gustativas de qualquer prato rico ou sobremesa caramelizada.';
          pairingNoteEn = 'Due to premium natural carbonation, this crystal reserve physically sweeps heavy oils, keeping your appetite refreshed.';
          break;
      }

      // Restructure math limit, clamp between 45 and 99
      const calculatedMatch = Math.min(Math.max(Math.round(score), 45), 99);

      return {
        drink,
        matchPercent: calculatedMatch,
        pairingNotePt,
        pairingNoteEn,
        perfect: isPerfectMatch
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);
  }, [selectedFoodId, spicy, richness, acidity, sweetness]);

  if (!currentUser?.isLoggedIn) {
    const isPt = lang === 'pt-BR';

    // Simulated Food data for the interactive harmonizer showcase
    const tutFoods = [
      {
        id: 'steak',
        namePt: 'Filet Mignon ao Molho Trufado 🥩',
        nameEn: 'Truffle Sauce Filet Mignon 🥩',
        spicy: 15, richness: 85, acidity: 10, sweetness: 5,
        match: 98,
        drinkPt: 'Cocktail Old Fashioned Oro',
        drinkEn: 'Cocktail Old Fashioned Oro',
        soundscapePt: 'Late Night Smooth Jazz & Double Bass (78 BPM) 🎷',
        soundscapeEn: 'Late Night Smooth Jazz & Double Bass (78 BPM) 🎷',
        notePt: 'Os taninos profundos do destilado envelhecido em carvalho quebram as cadeias de colágeno e gordura da carne nobre, deixando uma textura aveludada no paladar.',
        noteEn: 'Deep oak-matured tannins and charred wood esters split heavy meat proteins, creating a buttery velvet finish across your taste receptors.'
      },
      {
        id: 'salmon',
        namePt: 'Salmão Grelhado Finas Ervas 🐟',
        nameEn: 'Grilled Salmon with Fine Herbs 🐟',
        spicy: 5, richness: 60, acidity: 45, sweetness: 10,
        match: 94,
        drinkPt: 'Botanical Gin Tonic com Limão Cravo',
        drinkEn: 'Botanical Gin Tonic with Zesty Lime',
        soundscapePt: 'Organic Ambient Chillout & Seagull Sounds (105 BPM) 🌊',
        soundscapeEn: 'Organic Ambient Chillout & Seagull Sounds (105 BPM) 🌊',
        notePt: 'O frescor do botânico destilado e a acidez equilibrada da tônica neutralizam a gordura do salmão, renovando as papilas para a próxima mordida.',
        noteEn: 'Crisp juniper berries and cold quinine sparkling bubbles cleanly sweep fatty ocean oils, keeping your appetite refreshed and responsive.'
      },
      {
        id: 'taco',
        namePt: 'Tacos Mexicanos de Costela Apimentada 🌶️',
        nameEn: 'Spicy Smoked Rib Tacos 🌶️',
        spicy: 85, richness: 65, acidity: 30, sweetness: 20,
        match: 96,
        drinkPt: 'Mango Margarita Exótica',
        drinkEn: 'Bespoke Mango Margarita',
        soundscapePt: 'Upbeat Samba Electro-Lounge (120 BPM) 🪘',
        soundscapeEn: 'Upbeat Samba Electro-Lounge (120 BPM) 🪘',
        notePt: 'O dulçor frutado e o toque cítrico do drink neutralizam a capsaicina da pimenta, prevenindo a dormência da boca e intensificando o sabor do prato.',
        noteEn: 'Intense tropical fruit sweetness and citric acid guard physical tastebuds from spicy capsaicin burn, highlighting the food\'s wood-fired glaze.'
      },
      {
        id: 'dessert',
        namePt: 'Petit Gâteau de Chocolate Calda Quente 🍫',
        nameEn: 'Belgian Chocolate Lava Cake 🍫',
        spicy: 0, richness: 80, acidity: 15, sweetness: 90,
        match: 92,
        drinkPt: 'Porto Imperial Cask Reserve',
        drinkEn: 'Porto Imperial Cask Reserve',
        soundscapePt: 'Warm Acoustic Guitar Trio & Romance Suite (85 BPM) 🎸',
        soundscapeEn: 'Warm Acoustic Guitar Trio & Romance Suite (85 BPM) 🎸',
        notePt: 'O teor licoroso e notas torradas do vinho do Porto complementam o amargor do cacau selvagem, resultando em uma finalização de altíssimo luxo.',
        noteEn: 'Sophisticated mahogany sweet wine notes absorb roasted cocoa fat, giving an exceptionally balanced lingering aftertaste.'
      }
    ];

    const currentTutFood = tutFoods.find(f => f.id === tutFood) || tutFoods[0];

    const handleSelectTutFood = (foodId: string) => {
      setTutIsCalculating(true);
      setTutFood(foodId);
      setTimeout(() => {
        setTutIsCalculating(false);
      }, 450);
    };

    return (
      <div id="menu-harmonizer-tutorial-workspace" className="space-y-8 text-left">
        {/* Banner Preview info */}
        <div className="relative overflow-hidden bg-gradient-to-r from-lime-500/10 via-yellow-500/5 to-transparent border border-[#a2d729]/30 rounded-3xl p-6 shadow-xl relative">
          <div className="absolute right-[-20px] top-[-20px] w-48 h-48 rounded-full bg-[#a2d729]/10 blur-[80px]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center space-x-1.5 text-lime-400 text-[10px] uppercase font-bold tracking-widest font-mono bg-[#a2d729]/15 border border-[#a2d729]/25 px-2.5 py-1 rounded-full">
                <Wine className="w-3.5 h-3.5 animate-pulse" />
                <span>{isPt ? 'Demonstração Tecnológica VIP' : 'AI Sommelier Tech Showcase'}</span>
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {isPt ? 'Como Funciona o Harmonizador Inteligente?' : 'How Does the Smart Molecular Harmonizer Work?'}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                {isPt 
                  ? 'Nosso algoritmo de Inteligência Gustativa avalia o perfil químico do prato (gordura, pimenta, acidez e dulçor), recomendando o cocktail complementar perfeito e uma trilha sonora (Soundscape) para potencializar as papilas gustativas!' 
                  : 'Discover our advanced gastronomic matchmaking engine. It takes physical food profiles (richness, heat, acidity, sweet) to pinpoint the perfect complementing drinks and ambient music frequencies!'}
              </p>
            </div>
            <div className="shrink-0">
              <button
                id="tut-unlock-harmonizer-top-btn"
                onClick={onUpgradeVip}
                className="bg-gradient-to-r from-[#a2d729] to-lime-400 text-black text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-lime-500/10 font-sans"
              >
                {isPt ? 'Liberar VIP Grátis ✨' : 'Unlock Free VIP Upgrade ✨'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulator Panel for Harmonization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left partition: Choose Food items to match */}
          <div className="col-span-1 lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="bg-[#0c0c0c] border border-neutral-800/80 rounded-2xl p-5 space-y-4 font-sans">
              <div>
                <span className="text-[10px] font-mono text-[#a2d729] font-bold block uppercase tracking-widest">STEP 01</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">{isPt ? 'Selecione um Prato Gourmet para Teste' : 'Select a Gourmet Dish for Testing'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">{isPt ? 'Veja nossa Inteligência Gustativa simular a harmonização molecular ao vivo.' : 'Watch our sensory algorithm process molecular matching values in real-time.'}</p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {tutFoods.map(f => {
                  const isActive = tutFood === f.id;
                  return (
                    <button
                      key={f.id}
                      id={`tut-select-food-${f.id}`}
                      onClick={() => handleSelectTutFood(f.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isActive 
                          ? 'bg-[#a2d729]/10 border-[#a2d729]/40 text-white font-bold' 
                          : 'bg-neutral-950/60 border-neutral-900 hover:border-neutral-850 text-neutral-400'
                      }`}
                    >
                      <span className="text-xs">{isPt ? f.namePt : f.nameEn}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-[#a2d729]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VIP locked custom controls explanation */}
            <div className="bg-neutral-900/40 border border-neutral-850/70 rounded-2xl p-5 text-left font-sans">
              <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase font-mono mb-2 inline-block">
                ★ BENEFÍCIO VIP
              </span>
              <h4 className="text-xs font-bold text-white mb-1">
                {isPt ? 'Controles de Filtros Ilimitados' : 'Custom Molecular Sliders Unlocked'}
              </h4>
              <p className="text-[10px] text-neutral-400 leading-relaxed">
                {isPt 
                  ? 'No VIP, além de carregar pratos prontos, você mexe manualmente nos controles deslizantes de sabor, ou simplesmente digita os nomes dos itens do seu próprio buffet para nossa Inteligência calcular tudo instantaneamente.' 
                  : 'With a premium VIP account, easily customize flavor sliders manually or write names of items from your actual buffet menu to analyze and sort everything.'}
              </p>
            </div>
          </div>

          {/* Right partition: Live Match result representation */}
          <div className="col-span-1 lg:col-span-7">
            <div className="bg-gradient-to-b from-[#111] to-[#080808] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between space-y-6">
              
              <div className="absolute top-4 right-4 flex items-center space-x-1.5 text-xs text-amber-400 font-bold tracking-tight uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full z-10 scale-90">
                <Lock className="w-3 h-3 text-amber-400 inline shrink-0" />
                <span>AI MATCH PREVIEW</span>
              </div>

              {/* Molecular Bars & Ring Match percentage */}
              <div className="space-y-4 font-sans">
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">STEP 02</span>
                  <h3 className="text-sm font-bold text-white uppercase tracking-tight">{isPt ? 'Diagnóstico Químico de Sabor' : 'Molecular Flavor Analysis'}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-black/45 border border-neutral-900 p-4 rounded-2xl">
                  {/* Sliders previewing bars */}
                  <div className="space-y-2.5">
                    {[
                      { l: isPt ? 'PICÂNCIA' : 'SPICY', v: currentTutFood.spicy, c: 'bg-red-500' },
                      { l: isPt ? 'RIQUEZA/GORDURA' : 'RICHNESS/FAT', v: currentTutFood.richness, c: 'bg-[#fe9d00]' },
                      { l: isPt ? 'ACIDEZ' : 'ACIDITY', v: currentTutFood.acidity, c: 'bg-yellow-400' },
                      { l: isPt ? 'DULÇOR' : 'SWEETNESS', v: currentTutFood.sweetness, c: 'bg-[#a2d729]' }
                    ].map(bar => (
                      <div key={bar.l} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-neutral-400 font-bold">
                          <span>{bar.l}</span>
                          <span>{bar.v}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: tutIsCalculating ? 0 : `${bar.v}%` }}
                            transition={{ duration: 0.4 }}
                            className={`h-full ${bar.c}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Affinity Circular representation */}
                  <div className="flex flex-col items-center justify-center space-y-1 border-t md:border-t-0 md:border-l border-neutral-900 pt-3 md:pt-0">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      {/* Ring background track */}
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#1c1c1c" strokeWidth="8" fill="transparent" />
                        <motion.circle 
                          cx="48" 
                          cy="48" 
                          r="40" 
                          stroke="#a2d729" 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray="251.2"
                          animate={{ strokeDashoffset: tutIsCalculating ? 251.2 : 251.2 - (251.2 * currentTutFood.match) / 100 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </svg>
                      {/* Typing percentage text */}
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-black font-mono text-[#a2d729]">
                          {tutIsCalculating ? '--' : `${currentTutFood.match}%`}
                        </span>
                        <span className="text-[8px] font-bold text-neutral-500 font-mono tracking-wide uppercase">AFFINITY</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Result Recommendation Details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tutFood}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-neutral-950/80 border border-neutral-900 p-4 rounded-2xl space-y-3 font-sans text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase">{isPt ? 'DRINK RECOMENDADO' : 'PERFECT DRINK MATCH'}</span>
                      <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{isPt ? currentTutFood.drinkPt : currentTutFood.drinkEn}</span>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded hover:scale-105 border border-amber-500/25">VIP VIP</span>
                      </h4>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-350 leading-relaxed border-t border-neutral-900/60 pt-2 pb-1">
                    {isPt ? currentTutFood.notePt : currentTutFood.noteEn}
                  </p>

                  {/* Soundscape experience block */}
                  <div className="bg-[#a2d729]/5 border border-[#a2d729]/15 p-2.5 rounded-xl flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#a2d729]/20 flex items-center justify-center text-[#a2d729] shrink-0 animate-pulse">
                      <span>🎧</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-[#a2d729] font-black tracking-widest block uppercase">SYNESTHETIC SOUNDSCAPE (VIP ONLY)</span>
                      <span className="text-[10px] font-bold text-neutral-300 block leading-tight">{isPt ? currentTutFood.soundscapePt : currentTutFood.soundscapeEn}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Activation action */}
              <div className="pt-2">
                <button
                  id="tut-harmonizer-vip-act-btn"
                  onClick={onUpgradeVip}
                  className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.97] transition-all cursor-pointer font-sans shadow-xl shadow-amber-500/10"
                >
                  {isPt ? 'Liberar Harmonizador de Elite (VIP) ✨' : 'Unlock Complete Elite Harmonizer ✨'}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Benefits Comparison Grid */}
        <div className="bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-850 rounded-3xl p-6 md:p-8 space-y-6 font-sans">
          <div className="text-center max-w-md mx-auto space-y-1">
            <h4 className="text-lg font-extrabold text-white tracking-tight uppercase">
              {isPt ? 'Vantagens Sommelier VIP' : 'AI Harmonizer License Advantages'}
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              {isPt ? 'Entenda os benefícios exclusivos de contratar sua conta VIP gratuita para organizar o menu.' : 'Contrast custom molecular pairing attributes of standard packages against VIP accounts.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-neutral-350">
              <thead className="text-[10px] font-mono uppercase border-b border-neutral-800 text-neutral-400">
                <tr>
                  <th scope="col" className="px-4 py-3">{isPt ? 'RECURSO GUSTATIVO' : 'SOMMELIER ABILITY'}</th>
                  <th scope="col" className="px-4 py-3 text-neutral-500">{isPt ? 'PLANO GRÁTIS' : 'FREE PLAN'}</th>
                  <th scope="col" className="px-4 py-3 text-amber-400 text-right">🔒 {isPt ? 'UPGRADE VIP' : 'VIP UPGRADES'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{isPt ? 'Filtros Deslizantes Manuais' : 'Savor Sliders (Spicy, richness)'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">{isPt ? 'Bloqueado (Preset fixo)' : 'Locked (Fixed presets)'}</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {isPt ? 'Controle Total e Customizado' : 'Full continuous controls'}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{isPt ? 'Scan e Importação de Cardápio por Texto' : 'Text/Buffet File scanning'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">{isPt ? 'Não disponível' : 'Unavailable'}</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {isPt ? 'Varredura automática e classificação AI' : 'Parse whole menus with direct recommendations'}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{isPt ? 'Trilhas Sonoras Sinestésicas' : 'Synesthetic Soundscapes'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">{isPt ? 'Apenas Visualização / Preview' : 'Interactive demonstration only'}</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {isPt ? 'Acesso ilimitado e sugestões em Hertz' : 'Real-time Hertz/BPM recommendations for guests'}</td>
                </tr>
                <tr>
                  <th className="px-4 py-3.5 font-bold text-white">{isPt ? 'Desconto Especial em Vários Drinks' : 'Budget-wide compound rebate'}</th>
                  <td className="px-4 py-3.5 text-neutral-550">0%</td>
                  <td className="px-4 py-3.5 text-[#a2d729] text-right font-black">✓ {isPt ? '7% de Desconto em todo o planejamento' : '7% Off entire proposal estimates'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8 text-left" id="menu-harmonizer-panel">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-r from-neutral-900 to-[#0e0e0e] border border-neutral-800 rounded-3xl p-6 md:p-8">
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#a2d729]/10 opacity-30 blur-[60px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#a2d729]/10 text-[#a2d729] px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider">
              <Wine className="w-3.5 h-3.5 animate-pulse" />
              <span>{lang === 'pt-BR' ? 'INTELIGÊNCIA GUSTATIVA' : 'SOMMELIER ENGINE'}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
              {lang === 'pt-BR' ? 'Harmonizador de Cardápio' : 'Menu Harmonizer'}
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              {lang === 'pt-BR' 
                ? 'Conecte instantaneamente a gastronomia do seu buffet ao bar de bebidas. Selecione o tipo de comida que será servida, ajuste o perfil de tempero em tempo real e descubra quais rótulos geram a simbiose perfeita em boca.' 
                : 'Connect your food buffet gastronomy directly to your beverage counter. Select your culinary theme, customize seasoning metrics in real-time, and uncover which drinks foster the perfect symbiosis.'}
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center p-4 bg-neutral-950 border border-neutral-900 rounded-2xl">
            <UtensilsCrossed className="w-12 h-12 text-[#a2d729]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN 1: GASTRONOMY AND SLIDERS PANEL (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STEP 1: CHOOSE FOOD */}
          <div className="bg-[#121212] border border-neutral-800/85 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-neutral-300 font-mono tracking-wider uppercase flex items-center space-x-2">
              <span className="text-[#a2d729]">01.</span>
              <span>{lang === 'pt-BR' ? 'Escolha a Gastronomia' : 'Select Food Profile'}</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3" id="food-preset-grid">
              {FOOD_TYPES.map(food => {
                const Icon = food.icon;
                const isSelected = selectedFoodId === food.id;
                return (
                  <button
                    key={food.id}
                    id={`food-preset-${food.id}`}
                    onClick={() => handleSelectPreset(food)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#a2d729]/10 border-[#a2d729] text-[#a2d729]' 
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'scale-110 text-[#a2d729]' : ''}`} />
                    <span className="text-xs font-bold font-sans tracking-tight">{lang === 'pt-BR' ? food.namePt : food.nameEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected food description */}
            <div className="p-3 bg-neutral-950/60 border border-neutral-900 rounded-xl">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                {lang === 'pt-BR' ? 'Características do Prato' : 'Dish Characteristics'}
              </span>
              <p className="text-xs text-neutral-400 italic">
                {lang === 'pt-BR' ? selectedFood.descPt : selectedFood.descEn}
              </p>
            </div>
          </div>

          {/* STEP 2: TASTE PROFILE SLIDERS */}
          <div className="bg-[#121212] border border-neutral-800/85 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-300 font-mono tracking-wider uppercase flex items-center space-x-2">
                <span className="text-[#a2d729]">02.</span>
                <span>{lang === 'pt-BR' ? 'Ajustar Temperos' : 'Tune Gastric Balance'}</span>
              </h3>
              <div className="flex items-center space-x-1 text-xs text-[#a2d729] bg-[#a2d729]/10 py-1 px-2.5 rounded-full font-mono font-extrabold">
                <Sliders className="w-3.5 h-3.5" />
                <span>{lang === 'pt-BR' ? 'CUSTOMIZÁVEL' : 'CUSTOMIZABLE'}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400">
              {lang === 'pt-BR'
                ? 'Varie os parâmetros para coincidir com o cardápio exato das suas receitas (pimentas, molhos gordos, acidez de vinagretes ou doçura).'
                : 'Modify raw values to mirror precisely the culinary execution of your menu (spices, greasy reductions, vinaigrette acidity or sweetness).'}
            </p>

            <div className="space-y-4 pt-2">
              
              {/* Slider 1: Spicy */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-sans flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {lang === 'pt-BR' ? 'Picância / Calor' : 'Spiciness / Heat'}
                  </span>
                  <span className="font-mono text-[#a2d729] font-bold">{spicy}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={spicy}
                  onChange={(e) => setSpicy(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-[#a2d729]"
                />
              </div>

              {/* Slider 2: Richness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-sans flex items-center gap-1.5">
                    <Beef className="w-3.5 h-3.5 text-red-400" />
                    {lang === 'pt-BR' ? 'Gordura / Untuosidade' : 'Lipid Fat / Richness'}
                  </span>
                  <span className="font-mono text-[#a2d729] font-bold">{richness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={richness}
                  onChange={(e) => setRichness(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-[#a2d729]"
                />
              </div>

              {/* Slider 3: Acidity */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-sans flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    {lang === 'pt-BR' ? 'Acidez / Frescor' : 'Acidity / Sourness'}
                  </span>
                  <span className="font-mono text-[#a2d729] font-bold">{acidity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={acidity}
                  onChange={(e) => setAcidity(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-[#a2d729]"
                />
              </div>

              {/* Slider 4: Sweetness */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400 font-sans flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    {lang === 'pt-BR' ? 'Doçura / Dulçor' : 'Sweetness / Sugars'}
                  </span>
                  <span className="font-mono text-[#a2d729] font-bold">{sweetness}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sweetness}
                  onChange={(e) => setSweetness(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-[#a2d729]"
                />
              </div>

            </div>

            {/* Quick reset to preset defaults */}
            <div className="text-right pt-1">
              <button
                onClick={() => {
                  setSpicy(selectedFood.defaults.spicy);
                  setRichness(selectedFood.defaults.richness);
                  setAcidity(selectedFood.defaults.acidity);
                  setSweetness(selectedFood.defaults.sweetness);
                  triggerToast(
                    lang === 'pt-BR' ? 'Valores Restaurados' : 'Values Reset',
                    lang === 'pt-BR' ? 'Restaurado para padrão de receita gastronômica.' : 'Restored to gastronomy default metrics.',
                    'info'
                  );
                }}
                className="text-[10px] font-mono text-neutral-500 hover:text-[#a2d729] tracking-wider transition-colors uppercase font-extrabold cursor-pointer"
              >
                Reset {lang === 'pt-BR' ? 'para padrão' : 'to standard'} &infin;
              </button>
            </div>

          </div>

        </div>

        {/* COLUMN 2: SOMMELIER FINDINGS & REVENUE CONNECT (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121212]/80 border border-neutral-800/80 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-neutral-300 font-mono tracking-wider uppercase mb-6 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="text-[#a2d729]">03.</span>
                <span>{lang === 'pt-BR' ? 'Classificação Sommelier' : 'Pairing Performance Results'}</span>
              </span>
              <span className="text-[10px] text-neutral-500 lowercase">
                * {lang === 'pt-BR' ? 'ordenado por afinidade molecular' : 'sorted by taste matching efficiency'}
              </span>
            </h3>

            {/* Match Listings */}
            <div className="space-y-4" id="sommelier-result-stack">
              <AnimatePresence mode="popLayout">
                {analyzedPairings.map(({ drink, matchPercent, pairingNotePt, pairingNoteEn, perfect }, index) => {
                  const barColor = matchPercent >= 85 
                    ? 'bg-emerald-500' 
                    : matchPercent >= 70 
                    ? 'bg-[#fe9d00]' 
                    : 'bg-neutral-600';

                  const badgeBg = matchPercent >= 85 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                    : matchPercent >= 70 
                    ? 'bg-[#fe9d00]/15 text-[#fe9d00] border border-[#fe9d00]/20' 
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800';

                  const isLocked = !currentUser?.isLoggedIn && index >= 2;

                  return (
                    <motion.div
                      key={drink.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`relative overflow-hidden p-4 rounded-2xl border transition-all ${
                        perfect 
                          ? 'bg-neutral-950 border-[#a2d729]/40 hover:border-[#a2d729]' 
                          : 'bg-[#181818]/60 border-neutral-800 hover:border-neutral-700/80'
                      }`}
                    >
                      {/* LCK WATERMARK OVERLAY */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-[#0c0c0c]/90 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-[8px] font-mono font-black text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                            🔒 {lang === 'pt-BR' ? 'HARMONIZAÇÃO PREMIUM' : 'PREMIUM PAIRING'}
                          </span>
                          <h5 className="text-[11px] font-bold text-white uppercase tracking-tight">
                            {lang === 'pt-BR' ? `${drink.namePt} Bloqueado` : `${drink.nameEn} Locked`}
                          </h5>
                          <p className="text-[9px] text-neutral-400 max-w-xs leading-normal mt-0.5 mb-2">
                            {lang === 'pt-BR' 
                              ? 'Ative o modo VIP grátis para desbloquear todas as harmonizações gourmet!' 
                              : 'Enable free VIP access to unlock gourmet beverage pairing indices!'}
                          </p>
                          <button
                            type="button"
                            onClick={onUpgradeVip}
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                          >
                            {lang === 'pt-BR' ? 'Desbloquear VIP Grátis ✨' : 'Unlock Free VIP ✨'}
                          </button>
                        </div>
                      )}

                      <div className={`flex items-start gap-4 transition-all ${isLocked ? 'blur-xs select-none pointer-events-none opacity-25' : ''}`}>
                        {perfect && (
                          <div className="absolute top-0 right-0 bg-[#a2d729] text-black font-extrabold text-[8px] font-mono tracking-widest px-2.5 py-0.5 uppercase rounded-bl-xl flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>{lang === 'pt-BR' ? 'MATCH PERFEITO' : 'PERFECT MATCH'}</span>
                          </div>
                        )}

                        {/* Drink Small Thumbnail wrapper */}
                        <div className="w-16 h-16 shrink-0 aspect-square rounded-xl bg-neutral-950 overflow-hidden border border-neutral-800/80 flex items-center justify-center">
                          <SafeImage 
                            src={drink.imageUrl} 
                            alt={lang === 'pt-BR' ? drink.namePt : drink.nameEn} 
                            category={drink.category}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Middle Text Segment Info */}
                        <div className="flex-1 space-y-1.5 text-left">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div>
                              <span className="text-[10px] font-mono text-neutral-400 font-semibold tracking-wider uppercase">
                                {lang === 'pt-BR' ? drink.categoryLabelPt : drink.categoryLabelEn}
                              </span>
                              <h4 className="text-sm font-bold text-white tracking-tight">
                                {lang === 'pt-BR' ? drink.namePt : drink.nameEn}
                              </h4>
                            </div>
                            
                            {/* Match score badge */}
                            <div className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${badgeBg}`}>
                              {matchPercent}% Match
                            </div>
                          </div>

                          {/* Matching progress bar */}
                          <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${barColor}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${matchPercent}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                          </div>

                          {/* Gastronomic Pairing dynamic note */}
                          <p className="text-xs text-neutral-400 leading-relaxed italic bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-900 mt-2">
                            {lang === 'pt-BR' ? pairingNotePt : pairingNoteEn}
                          </p>

                          {/* Quick Add To Planning integration action */}
                          {onSelectDrink && (
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => {
                                  onSelectDrink(drink.id);
                                  triggerToast(
                                    lang === 'pt-BR' ? 'Bebida Integrada' : 'Drink Selection Connected',
                                    lang === 'pt-BR' 
                                      ? `Ficha de "${drink.namePt}" selecionada como foco de abastecimento do seu evento!`
                                      : `"${drink.nameEn}" set as priority drink supply guidelines in your cart!`,
                                    'success'
                                  );
                                }}
                                className="inline-flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 hover:border-[#a2d729] text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#a2d729]" />
                                <span>{lang === 'pt-BR' ? 'Priorizar no Planejamento' : 'Prioritize in Planning'}</span>
                              </button>
                            </div>
                          )}

                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Foot note explanation */}
            <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-neutral-950/50 border border-neutral-900 rounded-2xl text-xs text-neutral-400">
              <AlertCircle className="w-4 h-4 text-[#a2d729] shrink-0 mt-0.5" />
              <p className="leading-normal">
                {lang === 'pt-BR'
                  ? 'A ciência da harmonização (pairing) busca equilibrar a gordura através de taninos secos ou acidez cítrica e carbonatada, além de neutralizar e realçar açúcares para evitar a saturação das glândulas palatinas dos convidados.'
                  : 'The chemistry of pairing operates by neutralizing rich lipids using heavy structural tannins or sparkling acid carbonation, while balancing natural sweetness to sustain premium flavor accessibility throughout your celebration.'}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
