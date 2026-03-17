import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalOrders = await Order.countDocuments();
    
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: { $in: ['PARTIAL', 'FULLY_PAID'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$amountPaid' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    const pendingOrders = await Order.countDocuments({ deliveryStatus: 'PENDING' });
    const completedOrders = await Order.countDocuments({ deliveryStatus: 'DELIVERED' });

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};