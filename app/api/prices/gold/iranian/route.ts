import { NextResponse } from 'next/server';

// BrsApi.ir API configuration
const BRS_API_BASE_URL = 'https://brsapi.ir/Api/Market';
const BRS_API_KEY = 'FreeSV0E1LSgB9RDjuf0QorSLViX8pPG';

// Cache for Iranian gold prices
let iranianPriceCache = {
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

// Process BrsApi data and return Iranian gold prices
function processIranianGoldPrices(brsData: any[]) {
  if (!brsData || !Array.isArray(brsData)) {
    return null;
  }

  const processedData: any = {
    gold_18k: null,
    gold_24k: null,
    coin_emami: null,
    coin_bahar: null,
    usd: null,
    eur: null,
  };

  // Map the data based on symbols
  brsData.forEach((item: any) => {
    switch (item.symbol) {
      case 'IR_GOLD_18K':
        processedData.gold_18k = {
          name: item.name || 'طلای ۱۸ عیار',
          price: item.price || 0,
          change_percent: item.change_percent || 0,
          unit: item.unit || 'تومان',
        };
        break;
      case 'IR_GOLD_24K':
        processedData.gold_24k = {
          name: item.name || 'طلای ۲۴ عیار',
          price: item.price || 0,
          change_percent: item.change_percent || 0,
          unit: item.unit || 'تومان',
        };
        break;
      case 'IR_COIN_EMAMI':
        processedData.coin_emami = {
          name: item.name || 'سکه امامی',
          price: item.price || 0,
          change_percent: item.change_percent || 0,
          unit: item.unit || 'تومان',
        };
        break;
      case 'IR_COIN_BAHAR':
        processedData.coin_bahar = {
          name: item.name || 'سکه بهار آزادی',
          price: item.price || 0,
          change_percent: item.change_percent || 0,
          unit: item.unit || 'تومان',
        };
        break;
      case 'USD':
        processedData.usd = {
          name: item.name || 'دلار آمریکا',
          price: item.price || 0,
          change_percent: item.change_percent || 0,
          unit: item.unit || 'ریال',
        };
        break;
      case 'EUR':
        processedData.eur = {
          name: item.name || 'یورو',
          price: item.price || 0,
          change_percent: item.change_percent || 0,
          unit: item.unit || 'ریال',
        };
        break;
    }
  });

  return processedData;
}

export async function GET() {
  try {
    const now = Date.now();
    
    // Check cache first
    if (iranianPriceCache.data && (now - iranianPriceCache.lastFetch) < iranianPriceCache.cacheDuration) {
      return NextResponse.json({
        success: true,
        data: iranianPriceCache.data,
        cached: true,
      });
    }

    // Fetch fresh data from BrsApi.ir
    const brsData = await fetchBrsApiPrices();
    
    if (!brsData) {
      // Return cached data if available, otherwise return error
      if (iranianPriceCache.data) {
        return NextResponse.json({
          success: true,
          data: iranianPriceCache.data,
          cached: true,
          warning: 'Using cached data due to API error',
        });
      }
      
      return NextResponse.json({
        success: false,
        message: 'خطا در دریافت قیمت‌ها از BrsApi.ir',
        data: null,
      }, { status: 500 });
    }

    // Process the data
    const processedData = processIranianGoldPrices(brsData);
    
    if (!processedData) {
      return NextResponse.json({
        success: false,
        message: 'خطا در پردازش داده‌های قیمت',
        data: null,
      }, { status: 500 });
    }

    // Add metadata
    const result = {
      ...processedData,
      lastUpdated: new Date().toISOString(),
      source: 'BrsApi.ir',
      iranianGoldPrice: processedData.gold_18k?.price || 0,
    };

    // Update cache
    iranianPriceCache.data = result;
    iranianPriceCache.lastFetch = now;

    return NextResponse.json({
      success: true,
      data: result,
      cached: false,
    });

  } catch (error) {
    console.error('Iranian gold prices API error:', error);
    
    // Return cached data if available
    if (iranianPriceCache.data) {
      return NextResponse.json({
        success: true,
        data: iranianPriceCache.data,
        cached: true,
        warning: 'Using cached data due to error',
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت قیمت‌های طلای ایرانی',
      data: null,
    }, { status: 500 });
  }
}