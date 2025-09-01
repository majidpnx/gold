import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

// Sample decorative gold products
const decorativeGoldProducts = [
  {
    name: 'دستبند طلای ۱۸ عیار',
    description: 'دستبند زیبای طلای ۱۸ عیار با طراحی مدرن و ظریف',
    price: 25000000,
    weightGrams: 8.5,
    karat: 18,
    category: 'jewelry',
    tags: ['دستبند', 'طلای زینتی', '۱۸ عیار'],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'گردنبند طلای ۲۱ عیار',
    description: 'گردنبند شیک طلای ۲۱ عیار با نگین فیروزه',
    price: 35000000,
    weightGrams: 12.3,
    karat: 21,
    category: 'jewelry',
    tags: ['گردنبند', 'طلای زینتی', '۲۱ عیار', 'فیروزه'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'انگشتر طلای ۱۸ عیار',
    description: 'انگشتر زیبای طلای ۱۸ عیار با نگین یاقوت',
    price: 18000000,
    weightGrams: 4.2,
    karat: 18,
    category: 'jewelry',
    tags: ['انگشتر', 'طلای زینتی', '۱۸ عیار', 'یاقوت'],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'گوشواره طلای ۲۱ عیار',
    description: 'گوشواره ظریف طلای ۲۱ عیار با نگین الماس',
    price: 42000000,
    weightGrams: 6.8,
    karat: 21,
    category: 'jewelry',
    tags: ['گوشواره', 'طلای زینتی', '۲۱ عیار', 'الماس'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'ساعت طلای ۱۸ عیار',
    description: 'ساعت لوکس طلای ۱۸ عیار با کیفیت سوئیسی',
    price: 85000000,
    weightGrams: 25.5,
    karat: 18,
    category: 'watches',
    tags: ['ساعت', 'طلای زینتی', '۱۸ عیار', 'لوکس'],
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'سنجاق سینه طلای ۲۱ عیار',
    description: 'سنجاق سینه شیک طلای ۲۱ عیار با نگین زمرد',
    price: 28000000,
    weightGrams: 7.2,
    karat: 21,
    category: 'jewelry',
    tags: ['سنجاق سینه', 'طلای زینتی', '۲۱ عیار', 'زمرد'],
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'پابند طلای ۱۸ عیار',
    description: 'پابند زیبای طلای ۱۸ عیار با زنجیر ظریف',
    price: 15000000,
    weightGrams: 5.8,
    karat: 18,
    category: 'jewelry',
    tags: ['پابند', 'طلای زینتی', '۱۸ عیار'],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'ست طلا ۲۱ عیار',
    description: 'ست کامل طلای ۲۱ عیار شامل دستبند، گردنبند و انگشتر',
    price: 120000000,
    weightGrams: 35.6,
    karat: 21,
    category: 'sets',
    tags: ['ست طلا', 'طلای زینتی', '۲۱ عیار', 'کامل'],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'سکه طلای بهار آزادی',
    description: 'سکه طلای بهار آزادی با وزن ۸.۱۳ گرم و عیار ۲۱.۶',
    price: 45000000,
    weightGrams: 8.13,
    karat: 21.6,
    category: 'coins',
    tags: ['سکه', 'بهار آزادی', 'طلای زینتی', '۲۱.۶ عیار'],
    images: [
      'https://images.unsplash.com/photo-1610375461369-d613b56394da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'شمش طلای ۲۴ عیار',
    description: 'شمش طلای خالص ۲۴ عیار با وزن ۱۰۰ گرم',
    price: 280000000,
    weightGrams: 100,
    karat: 24,
    category: 'bars',
    tags: ['شمش', 'طلای خالص', '۲۴ عیار', '۱۰۰ گرم'],
    images: [
      'https://images.unsplash.com/photo-1610375461369-d613b56394da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'زنجیر طلای ۱۸ عیار',
    description: 'زنجیر طلای ۱۸ عیار با طراحی کلاسیک و ظریف',
    price: 32000000,
    weightGrams: 15.2,
    karat: 18,
    category: 'jewelry',
    tags: ['زنجیر', 'طلای زینتی', '۱۸ عیار', 'کلاسیک'],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  },
  {
    name: 'ساعت مچی طلای ۱۸ عیار',
    description: 'ساعت مچی لوکس طلای ۱۸ عیار با کیفیت سوئیسی',
    price: 95000000,
    weightGrams: 28.5,
    karat: 18,
    category: 'watches',
    tags: ['ساعت مچی', 'طلای زینتی', '۱۸ عیار', 'لوکس'],
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    type: 'decorative'
  }
];

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    let query: any = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Get products from database
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Product.countDocuments(query);

    // If no products in database, return sample decorative products
    if (products.length === 0 && !category && !search) {
      return NextResponse.json({
        success: true,
        data: {
          products: decorativeGoldProducts,
          pagination: {
            page,
            limit,
            total: decorativeGoldProducts.length,
            pages: Math.ceil(decorativeGoldProducts.length / limit)
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت محصولات',
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const product = new Product(body);
    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطا در ایجاد محصول',
    }, { status: 500 });
  }
}
