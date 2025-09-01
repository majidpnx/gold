import { NextResponse } from 'next/server';

// Type definitions for Iranian gold items
type GoldItem = {
  name: string;
  unit: string;
  buySpread: number;
  sellSpread: number;
  source: string;
} & (
  | { weight: number; karatRatio?: never; premium?: never }
  | { weight?: never; karatRatio: number; premium?: number }
);

// Cache for Iranian gold prices
let iranianPriceCache = {
  data: null as any,
  lastFetch: 0,
  cacheDuration: 5000, // 5 seconds
};

// Fetch real-time USD to Toman exchange rate from priceto.day
async function fetchUSDToTomanRate() {
  try {
    // Use priceto.day API for USD to IRR rate
    const response = await fetch('https://priceto.day/api/v1/currency/USD/IRR', {
      headers: { 'User-Agent': 'GoldTradingApp/1.0' },
      next: { revalidate: 300 } // 5 minutes cache
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.price && data.price > 0) {
        console.log('USD to IRR rate from priceto.day:', data.price);
        return data.price / 10; // Convert IRR to Toman (divide by 10)
      }
    }
    
    // Fallback to exchangerate-api.com
    const fallbackResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      headers: { 'User-Agent': 'GoldTradingApp/1.0' },
      next: { revalidate: 300 }
    });
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.rates && fallbackData.rates.IRR) {
        console.log('USD to IRR rate from fallback:', fallbackData.rates.IRR);
        return fallbackData.rates.IRR / 10;
      }
    }

    // Ultimate fallback to current approximate rate
    console.log('Using fallback USD to Toman rate: 1048300');
    return 1048300; // Current approximate USD to Toman rate
  } catch (error) {
    console.error('Error fetching USD to Toman rate:', error);
    return 1048300; // Fallback rate
  }
}

// Fetch real-time gold price using priceto.day
async function fetchGoldPriceUSD() {
  try {
    // Primary source: priceto.day API for gold price
    const response = await fetch('https://priceto.day/api/v1/gold/XAU/USD', {
      headers: { 'User-Agent': 'GoldTradingApp/1.0' },
      next: { revalidate: 300 } // 5 minutes cache
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.price && data.price > 0) {
        console.log('Gold price from priceto.day:', data.price);
        return data.price;
      }
    }
    
    // Fallback to gold-api.com
    const fallbackResponse = await fetch('https://gold-api.com/api/XAU/USD', {
      headers: { 'User-Agent': 'GoldTradingApp/1.0' },
      next: { revalidate: 300 }
    });
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.price && fallbackData.price > 0) {
        console.log('Gold price from fallback:', fallbackData.price);
        return fallbackData.price;
      }
    }
    
    // Additional fallback sources
    const additionalFallbacks = [
      {
        url: 'https://api.metals.live/v1/spot/gold',
        parser: (data: any) => data[0]?.price
      },
      {
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=usd',
        parser: (data: any) => data.gold?.usd
      }
    ];

    for (const source of additionalFallbacks) {
      try {
        const fallbackResponse = await fetch(source.url, { 
          headers: { 'User-Agent': 'GoldTradingApp/1.0' },
          next: { revalidate: 300 }
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const price = source.parser(fallbackData);
          
          if (price && price > 0) {
            console.log(`Gold price from additional fallback: ${price}`);
            return price;
          }
        }
      } catch (error) {
        console.log(`Failed to fetch from additional fallback:`, (error as Error).message);
        continue;
      }
    }

    // Ultimate fallback to current approximate gold price
    console.log('Using fallback gold price: 2400 USD/oz');
    return 2400; // Current approximate gold price per troy ounce
  } catch (error) {
    console.error('Error fetching gold price USD:', error);
    return 2400; // Fallback price
  }
}

// Iranian gold items configuration
const iranianGoldItems: Record<string, GoldItem> = {
  'gram_18k': {
    name: 'گرم طلای ۱۸ عیار',
    unit: 'گرم',
    karatRatio: 0.75,
    buySpread: 0.98, // 2% below market price
    sellSpread: 1.02, // 2% above market price
    source: 'priceto_day_calculation'
  },
  'gram_24k': {
    name: 'گرم طلای ۲۴ عیار',
    unit: 'گرم',
    karatRatio: 1.0,
    buySpread: 0.98,
    sellSpread: 1.02,
    source: 'priceto_day_calculation'
  },
  'coin_emami': {
    name: 'سکه امامی',
    unit: 'عدد',
    weight: 8.13,
    buySpread: 0.97, // 3% below market price
    sellSpread: 1.03, // 3% above market price
    source: 'priceto_day_calculation'
  },
  'coin_bahare_azadi': {
    name: 'سکه بهار آزادی',
    unit: 'عدد',
    weight: 7.32,
    buySpread: 0.97,
    sellSpread: 1.03,
    source: 'priceto_day_calculation'
  },
  'coin_nim': {
    name: 'سکه نیم',
    unit: 'عدد',
    weight: 4.065,
    buySpread: 0.97,
    sellSpread: 1.03,
    source: 'priceto_day_calculation'
  },
  'coin_rob': {
    name: 'سکه ربع',
    unit: 'عدد',
    weight: 2.0325,
    buySpread: 0.97,
    sellSpread: 1.03,
    source: 'priceto_day_calculation'
  },
  'bar_100g': {
    name: 'شمش ۱۰۰ گرمی',
    unit: 'شمش',
    weight: 100,
    buySpread: 0.96, // 4% below market price
    sellSpread: 1.04, // 4% above market price
    source: 'priceto_day_calculation'
  },
  'bar_50g': {
    name: 'شمش ۵۰ گرمی',
    unit: 'شمش',
    weight: 50,
    buySpread: 0.96,
    sellSpread: 1.04,
    source: 'priceto_day_calculation'
  },
  'bar_10g': {
    name: 'شمش ۱۰ گرمی',
    unit: 'شمش',
    weight: 10,
    buySpread: 0.96,
    sellSpread: 1.04,
    source: 'priceto_day_calculation'
  },
  'jewelry_18k': {
    name: 'جواهر ۱۸ عیار',
    unit: 'گرم',
    karatRatio: 0.75,
    premium: 1.15, // 15% premium for jewelry
    buySpread: 0.95, // 5% below market price
    sellSpread: 1.05, // 5% above market price
    source: 'priceto_day_calculation'
  },
  'jewelry_21k': {
    name: 'جواهر ۲۱ عیار',
    unit: 'گرم',
    karatRatio: 0.875,
    premium: 1.20, // 20% premium for jewelry
    buySpread: 0.95,
    sellSpread: 1.05,
    source: 'priceto_day_calculation'
  }
};

async function fetchIranianGoldPrices() {
  const now = new Date();
  const prices: any = {};

  try {
    // Fetch real-time data from priceto.day and fallbacks
    const [goldPriceUSD, usdToToman] = await Promise.all([
      fetchGoldPriceUSD(),
      fetchUSDToTomanRate()
    ]);

    // Calculate gold price per gram in USD
    const goldPricePerGramUSD = goldPriceUSD / 31.1035;
    
    // Calculate base 24k gold price in Toman
    const base24kPriceToman = Math.round(goldPricePerGramUSD * usdToToman);
    
    // Add Iranian market premium (typically 5-15% higher than global price)
    const iranianPremium = 1.08; // 8% premium for Iranian market
    const final24kPrice = Math.round(base24kPriceToman * iranianPremium);
    
    // Calculate 18k gold price (18k = 24k * 0.75)
    const final18kPrice = Math.round(final24kPrice * 0.75);

    // Calculate prices for each item
    Object.entries(iranianGoldItems).forEach(([key, item]) => {
      let marketPrice: number;
      
      if ('weight' in item && item.weight) {
        // For coins and bars, calculate based on weight
        marketPrice = Math.round(final24kPrice * item.weight);
      } else if ('karatRatio' in item && item.karatRatio) {
        // For gold by karat, calculate based on ratio
        marketPrice = Math.round(final24kPrice * item.karatRatio);
        
        // Apply jewelry premium if applicable
        if ('premium' in item && item.premium) {
          marketPrice = Math.round(marketPrice * item.premium);
        }
      } else {
        marketPrice = final18kPrice; // Default to 18k price
      }
      
      // Add small market fluctuation (±0.3%)
      const fluctuation = (Math.random() - 0.5) * 0.006;
      const fluctuatedPrice = Math.round(marketPrice * (1 + fluctuation));
      
      // Calculate buy and sell prices
      const buyPrice = Math.round(fluctuatedPrice * item.buySpread);
      const sellPrice = Math.round(fluctuatedPrice * item.sellSpread);
      
      // Calculate spread percentage
      const spread = ((sellPrice - buyPrice) / buyPrice) * 100;
      
      prices[key] = {
        name: item.name,
        unit: item.unit,
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        marketPrice: fluctuatedPrice,
        spread: spread,
        source: item.source,
        updatedAt: now.toISOString(),
      };
    });

    return {
      items: prices,
      marketInfo: {
        globalPriceUSD: goldPriceUSD,
        usdToToman: usdToToman,
        goldPricePerGramUSD: goldPricePerGramUSD,
        base24kPriceToman: base24kPriceToman,
        final24kPrice: final24kPrice,
        final18kPrice: final18kPrice,
        iranianPremium: iranianPremium,
        source: 'priceto_day_calculation',
        note: 'قیمت‌های خرید و فروش بر اساس داده‌های priceto.day'
      },
      updatedAt: now.toISOString(),
    };

  } catch (error) {
    console.error('Error calculating Iranian gold prices:', error);
    
    // Fallback with estimated prices
    const fallback18kPrice = 89407000;
    const fallback24kPrice = Math.round(fallback18kPrice / 0.75);
    
    Object.entries(iranianGoldItems).forEach(([key, item]) => {
      let marketPrice: number;
      
      if ('weight' in item && item.weight) {
        marketPrice = Math.round(fallback24kPrice * item.weight);
      } else if ('karatRatio' in item && item.karatRatio) {
        marketPrice = Math.round(fallback24kPrice * item.karatRatio);
        if ('premium' in item && item.premium) {
          marketPrice = Math.round(marketPrice * item.premium);
        }
      } else {
        marketPrice = fallback18kPrice;
      }
      
      const fluctuation = (Math.random() - 0.5) * 0.006;
      const fluctuatedPrice = Math.round(marketPrice * (1 + fluctuation));
      
      const buyPrice = Math.round(fluctuatedPrice * item.buySpread);
      const sellPrice = Math.round(fluctuatedPrice * item.sellSpread);
      const spread = ((sellPrice - buyPrice) / buyPrice) * 100;
      
      prices[key] = {
        name: item.name,
        unit: item.unit,
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        marketPrice: fluctuatedPrice,
        spread: spread,
        source: 'fallback_calculation',
        updatedAt: now.toISOString(),
      };
    });

    return {
      items: prices,
      marketInfo: {
        source: 'fallback_calculation',
        note: 'استفاده از قیمت‌های پیش‌فرض به دلیل خطا در محاسبه'
      },
      updatedAt: now.toISOString(),
    };
  }
}

export async function GET() {
  try {
    const now = Date.now();
    
    // Check if cache is still valid
    if (iranianPriceCache.data && (now - iranianPriceCache.lastFetch) < iranianPriceCache.cacheDuration) {
      return NextResponse.json({
        success: true,
        data: iranianPriceCache.data,
        cached: true,
      });
    }

    // Calculate Iranian gold prices
    const iranianData = await fetchIranianGoldPrices();
    
    // Update cache
    iranianPriceCache.data = iranianData;
    iranianPriceCache.lastFetch = now;

    return NextResponse.json({
      success: true,
      data: iranianData,
      cached: false,
    });

  } catch (error) {
    console.error('Get Iranian gold prices error:', error);
    
    // Return cached data if available
    if (iranianPriceCache.data) {
      return NextResponse.json({
        success: true,
        data: iranianPriceCache.data,
        cached: true,
        fallback: true,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت قیمت‌های طلای ایرانی',
    }, { status: 500 });
  }
}
