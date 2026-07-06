import { PlanejamentoInputs, SuggestedQuantity } from '../types';

export function calculatePlanejamento(inputs: PlanejamentoInputs): {
  items: SuggestedQuantity[];
  subtotal: number;
  discount: number;
  total: number;
} {
  const { eventType, duration, drinkersCount, nonDrinkersCount } = inputs;
  const guests = drinkersCount + nonDrinkersCount;

  // Let's create an elegant baseline calculator corresponding to different event types:
  let modifierAlcohol = 1.0;
  let modifierNonAlcohol = 1.0;

  if (eventType === 'aniversario') {
    modifierAlcohol = 1.35;
    modifierNonAlcohol = 1.1;
  } else if (eventType === 'reuniao') {
    modifierAlcohol = 0.45;
    modifierNonAlcohol = 1.4;
  } else if (eventType === 'casual') {
    modifierAlcohol = 1.0;
    modifierNonAlcohol = 1.0;
  } else {
    modifierAlcohol = 0.9;
    modifierNonAlcohol = 1.0;
  }

  // Read safety margin, weather insights and default host profile from localStorage
  let safetyMarginPercent = 10; // Default standard margin
  let enableWeatherInsights = 'no'; // Default: off
  let defaultProfile = 'moderate'; // Default profile
  try {
    const savedMargin = localStorage.getItem('eventdrink_safety_margin');
    if (savedMargin) {
      safetyMarginPercent = parseInt(savedMargin, 10);
    }
    const savedWeather = localStorage.getItem('eventdrink_weather_insights');
    if (savedWeather) {
      enableWeatherInsights = savedWeather;
    }
    const savedProfile = localStorage.getItem('eventdrink_default_profile');
    if (savedProfile) {
      defaultProfile = savedProfile;
    }
  } catch (e) {}

  // Apply default profile modifiers
  let wineMultiplier = 1.0;
  let beerMultiplier = 1.0;

  if (defaultProfile === 'basic') {
    modifierAlcohol *= 0.60;
    modifierNonAlcohol *= 1.30;
  } else if (defaultProfile === 'intense') {
    modifierAlcohol *= 1.35;
  } else if (defaultProfile === 'sophisticated') {
    modifierAlcohol *= 1.10;
    wineMultiplier = 1.40;
    beerMultiplier = 0.70;
  }

  const safetyMultiplier = 1 + (safetyMarginPercent / 100);
  
  let iceMultiplier = 1.0;
  if (enableWeatherInsights === 'yes') {
    iceMultiplier = 1.20; // AI Satellite Sync
  } else if (enableWeatherInsights === 'manual_hot') {
    iceMultiplier = 1.10; // Manual hot weather preset (+10% ice/water)
  }

  // Adjust by duration (standard baseline assumes 6 hours)
  const durationModifier = duration / 6;
  
  // Calculate raw amounts with multipliers applied
  const beers = Math.round(drinkersCount * 1.8 * durationModifier * modifierAlcohol * safetyMultiplier * beerMultiplier);
  const wines = Math.round(drinkersCount * 0.4 * durationModifier * modifierAlcohol * safetyMultiplier * wineMultiplier);
  const spirits = drinkersCount > 0 ? Math.max(1, Math.round(drinkersCount * 0.1 * durationModifier * modifierAlcohol * safetyMultiplier)) : 0;
  
  const sodas = Math.round((drinkersCount * 0.8 + nonDrinkersCount * 1.8) * durationModifier * modifierNonAlcohol * safetyMultiplier);
  const water = Math.round((drinkersCount * 0.9 + nonDrinkersCount * 1.6) * durationModifier * modifierNonAlcohol * safetyMultiplier);
  const ice = Math.max(2, Math.round(guests * 0.15 * durationModifier * modifierNonAlcohol * safetyMultiplier * iceMultiplier));

  // Dynamic products
  const suggested: SuggestedQuantity[] = [
    {
      id: 'cerveja',
      namePt: 'Cervejas',
      nameEn: 'Beers',
      value: beers,
      unitPt: 'Garrafas (Pilsen Premium 355ml)',
      unitEn: 'Bottles (Premium Pilsen 355ml)',
      icon: 'sports_bar',
      descPt: beers > 0 ? 'Cálculo de ' + Math.ceil(beers / 12) + ' caixas sugeridas de long neck.' : 'Sem consumo de álcool.',
      descEn: beers > 0 ? 'Estimated ' + Math.ceil(beers / 12) + ' suggested crates of long neck.' : 'No alcohol consumption.',
      approxPriceUnit: 8.50
    },
    {
      id: 'vinho',
      namePt: 'Vinhos',
      nameEn: 'Wines',
      value: wines,
      unitPt: 'Garrafas (Tinto Seco Reserva 750ml)',
      unitEn: 'Bottles (Reserve Dry Red 750ml)',
      icon: 'wine_bar',
      descPt: wines > 0 ? 'Estilizados e armazenados em adegas climatizadas.' : 'Sem consumo de álcool.',
      descEn: wines > 0 ? 'Stylized and stored in climate-controlled cellars.' : 'No alcohol consumption.',
      approxPriceUnit: 69.00
    },
    {
      id: 'gelo',
      namePt: 'Sacos de Gelo',
      nameEn: 'Bags of Ice',
      value: ice,
      unitPt: 'Sacos (Gelo em Cubos 5kg)',
      unitEn: 'Bags (Cubic Ice 5kg)',
      icon: 'ac_unit',
      descPt: 'Ideal para resfriar bebidas e servir em copos.',
      descEn: 'Perfect for chilling drinks and serving in tumblers.',
      approxPriceUnit: 12.00
    },
    {
      id: 'vodka',
      namePt: 'Vodkas',
      nameEn: 'Spirits (Vodka)',
      value: spirits,
      unitPt: 'Garrafas (Importada 750ml)',
      unitEn: 'Bottles (Imported Vodka 750ml)',
      icon: 'liquor',
      descPt: spirits > 0 ? 'Destilado premium importado de alta pureza.' : 'Sem consumo de álcool.',
      descEn: spirits > 0 ? 'High purity premium imported spirit.' : 'No alcohol consumption.',
      approxPriceUnit: 98.00
    },
    {
      id: 'reco',
      namePt: 'Refrigerantes',
      nameEn: 'Sodas / Soft Drinks',
      value: sodas,
      unitPt: 'Latas (Variados 350ml)',
      unitEn: 'Cans (Assorted 350ml)',
      icon: 'local_cafe',
      descPt: 'Latas de Coca-Cola, Guaraná e água tônica.',
      descEn: 'Cans of Cola, Guaraná and tonic water.',
      approxPriceUnit: 5.00
    },
    {
      id: 'agua',
      namePt: 'Águas',
      nameEn: 'Water Bottles',
      value: water,
      unitPt: 'Garrafas (Sem Gás 500ml)',
      unitEn: 'Bottles (Still Mineral 500ml)',
      icon: 'water_drop',
      descPt: 'Garante hidratação impecável de todos convidados.',
      descEn: 'Ensures perfect hydration for all your guests.',
      approxPriceUnit: 3.00
    }
  ];

  // Calculate Subtotal dynamically
  let calculatedSubtotal = 0;
  suggested.forEach(item => {
    calculatedSubtotal += item.value * item.approxPriceUnit;
  });

  // Round subtotal to look professional
  calculatedSubtotal = Math.round(calculatedSubtotal);

  const discount = Math.round(calculatedSubtotal * 0.07); // ~7% discount
  const total = calculatedSubtotal - discount;

  return {
    items: suggested,
    subtotal: calculatedSubtotal,
    discount,
    total
  };
}
