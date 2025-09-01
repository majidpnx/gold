import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Trade from '@/models/Trade';

export async function GET() {
  try {
    await connectDB();
    
    // Get counts
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const tradesCount = await Trade.countDocuments();
    
    // Get total sales from orders
    const ordersTotal = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    
    // Get total trades value
    const tradesTotal = await Trade.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    
    // Get recent activity
    const recentOrders = await Order.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentTrades = await Trade.find()
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      success: true,
      data: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        trades: tradesCount,
        salesTotal: ordersTotal[0]?.total || 0,
        tradesTotal: tradesTotal[0]?.total || 0,
        inventoryCount: productsCount,
        recentOrders,
        recentTrades,
      },
    });
    
  } catch (error) {
    console.error('Get admin stats error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'خطا در دریافت آمار',
    }, { status: 500 });
  }
}
