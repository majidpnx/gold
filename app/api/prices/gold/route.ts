import { NextResponse } from 'next/server';

// BrsApi.ir API configuration
const BRS_API_BASE_URL = 'https://brsapi.ir/Api/Market';
const BRS_API_KEY = 'FreeSV0E1LSgB9RDjuf0QorSLViX8pPG';

// Cache for gold price
let priceCache = {
  data: null as any,
  lastFetch: 0,
  cacheDuration: 30000, // 30 seconds
};

// Fetch prices from BrsApi.ir
async function fetchBrsApiPrices() {
  try {
    const response = await fetch(`${BRS_API_BASE_URL}/Gold_Currency.php?key=${BRS_API_KEY}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GoldTradingApp/1.0',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`BrsApi.ir responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from BrsApi.ir:', error);
    return null;
  }
}

// Process BrsApi data and return gold price
function processGoldPrice(brsData: any[]) {
  if (!brsData || !Array.isArray(brsData)) {
    return null;
  }

  let gold18k = null;
  let gold24k = null;
  let usd = null;

  // Find relevant data
  brsData.forEach((item: any) => {
    switch (item.symbol) {
      case 'IR_GOLD_18K':
        gold18k = item;
        break;
      case 'IR_GOLD_24K':
        gold24k = item;
        break;
      case 'USD':
        usd = item;
        break;
    }
  });

  // Use 18k gold price if available, otherwise calculate from 24k
  let unitPrice = 0;
  let source = 'BrsApi.ir';

  if (gold18k && gold18k.price > 0) {
    unitPrice = gold18k.price;
  } else if (gold24k && gold24k.price > 0) {
    // Convert 24k to 18k (18k = 24k * 0.75)
    unitPrice = Math.round(gold24k.price * 0.75);
  } else {
    // Fallback calculation
    unitPrice = 89407000; // Approximate 18k gold price
    source = 'fallback';
  }

  return {
    unitPrice,
    source,
    updatedAt: new Date().toISOString(),
    marketInfo: {
      gold18k: gold18k ? {
        price: gold18k.price,
        change_percent: gold18k.change_percent,
        name: gold18k.name,
      } : null,
      gold24k: gold24k ? {
        price: gold24k.price,
        change_percent: gold24k.change_percent,
        name: gold24k.name,
      } : null,
      usd: usd ? {
        price: usd.price,
        change_percent: usd.change_percent,
        name: usd.name,
      } : null,
      note: source === 'BrsApi.ir' ? 'قیمت بر اساس داده‌های BrsApi.ir' : 'استفاده از قیمت پیش‌فرض'
    }
  };
}

export async function GET() {
  try {
    const now = Date.now();
    
    // Check if cache is still valid
    if (priceCache.data && (now - priceCache.lastFetch) < priceCache.cacheDuration) {
      return NextResponse.json({
        success: true,
        data: priceCache.data,
        cached: true,
      });
    }

    // Fetch fresh data from BrsApi.ir
    const brsData = await fetchBrsApiPrices();
    
    let priceData;
    
    if (brsData) {
      // Process the data
      priceData = processGoldPrice(brsData);
    }
    
    // If processing failed or no data, use fallback
    if (!priceData) {
      priceData = {
        unitPrice: 89407000, // Fallback price
        source: 'emergency_fallback',
        updatedAt: new Date().toISOString(),
        marketInfo: {
          note: 'استفاده از قیمت پیش‌فرض به دلیل خطا در دریافت داده'
        }
      };
    }
    
    // Update cache
    priceCache.data = priceData;
    priceCache.lastFetch = now;

    return NextResponse.json({
      success: true,
      data: priceData,
      cached: false,
    });

  } catch (error) {
    console.error('Get gold price error:', error);
    
    // Return cached data if available
    if (priceCache.data) {
      return NextResponse.json({
        success: true,
        data: priceCache.data,
        cached: true,
        fallback: true,
      });
    }

    // Ultimate fallback
    const fallbackData = {
      unitPrice: 89407000,
      source: 'emergency_fallback',
      updatedAt: new Date().toISOString(),
      marketInfo: {
        note: 'استفاده از قیمت پیش‌فرض به دلیل خطا در سیستم'
      }
    };

    return NextResponse.json({
      success: true,
      data: fallbackData,
      cached: false,
      fallback: true,
    });
  }
}