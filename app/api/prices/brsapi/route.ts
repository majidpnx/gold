import { NextRequest, NextResponse } from 'next/server';

// BrsApi.ir API configuration
const BRS_API_BASE_URL = 'https://brsapi.ir/Api/Market';
const BRS_API_KEY = 'FreeSV0E1LSgB9RDjuf0QorSLViX8pPG'; // Free API key from documentation

interface BrsApiResponse {
  date: string;
  time: string;
  time_unix: number;
  symbol: string;
  name_en: string;
  name: string;
  price: number;
  change_value: number;
  change_percent: number;
  unit: string;
}

interface GoldCurrencyData {
  gold_18k: BrsApiResponse | null;
  gold_24k: BrsApiResponse | null;
  coin_emami: BrsApiResponse | null;
  coin_bahar: BrsApiResponse | null;
  usd: BrsApiResponse | null;
  eur: BrsApiResponse | null;
}

export async function GET(request: NextRequest) {
  try {
    // Fetch data from BrsApi.ir
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

    const data: BrsApiResponse[] = await response.json();

    // Process and organize the data
    const processedData: GoldCurrencyData = {
      gold_18k: null,
      gold_24k: null,
      coin_emami: null,
      coin_bahar: null,
      usd: null,
      eur: null,
    };

    // Map the data based on symbols
    data.forEach((item) => {
      switch (item.symbol) {
        case 'IR_GOLD_18K':
          processedData.gold_18k = item;
          break;
        case 'IR_GOLD_24K':
          processedData.gold_24k = item;
          break;
        case 'IR_COIN_EMAMI':
          processedData.coin_emami = item;
          break;
        case 'IR_COIN_BAHAR':
          processedData.coin_bahar = item;
          break;
        case 'USD':
          processedData.usd = item;
          break;
        case 'EUR':
          processedData.eur = item;
          break;
      }
    });

    // Calculate Iranian gold prices based on global gold and USD
    const globalGoldPrice = processedData.gold_24k?.price || 0;
    const usdPrice = processedData.usd?.price || 0;
    
    // Iranian gold calculation (simplified)
    const iranianGoldPrice = globalGoldPrice > 0 && usdPrice > 0 
      ? Math.round((globalGoldPrice * usdPrice) / 31.1035) // Convert from ounce to gram and apply USD rate
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...processedData,
        iranianGoldPrice,
        lastUpdated: new Date().toISOString(),
        source: 'BrsApi.ir',
      },
    });

  } catch (error) {
    console.error('BrsApi.ir fetch error:', error);
    
    // Return fallback data
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت قیمت‌ها از BrsApi.ir',
      data: {
        gold_18k: null,
        gold_24k: null,
        coin_emami: null,
        coin_bahar: null,
        usd: null,
        eur: null,
        iranianGoldPrice: 0,
        lastUpdated: new Date().toISOString(),
        source: 'fallback',
      },
    }, { status: 500 });
  }
}
