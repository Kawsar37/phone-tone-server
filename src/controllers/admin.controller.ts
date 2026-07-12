import { Request, Response } from "express";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { Phone } from "../models/Phone";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalRevenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const [totalOrders, totalUsers, totalPhones] = await Promise.all([
      Order.countDocuments({ orderStatus: { $ne: "cancelled" } }),
      User.countDocuments(),
      Phone.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        revenue: totalRevenueResult[0]?.total || 0,
        orders: totalOrders,
        users: totalUsers,
        phones: totalPhones,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyOrders = async (req: Request, res: Response) => {
  try {
    const monthlyData = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = monthlyData.map((item) => ({
      month: monthNames[item._id - 1],
      orders: item.orders,
      revenue: item.revenue,
    }));

    res.status(200).json({ success: true, chartData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
