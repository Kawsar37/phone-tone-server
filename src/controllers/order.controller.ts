import { Request, Response } from "express";
import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { Phone } from "../models/Phone";
import { AuthRequest } from "../middlewares/auth";

// 1. Create Order (Checkout)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { shippingAddress, paymentMethod = "cod" } = req.body;

    // Get user's cart
    const cartItems = await Cart.find({ userId }).populate("phoneId");

    if (cartItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const phone = item.phoneId as any;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "One or more phones no longer exist.",
        });
      }

      if (phone.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${phone.name}.`,
        });
      }

      const itemTotal = phone.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        phoneId: phone._id,
        quantity: item.quantity,
        price: phone.price,
      });

      // Reduce stock
      phone.stock -= item.quantity;
      await phone.save();
    }

    // Calculate delivery charge (Free over $500)
    const deliveryCharge = subtotal > 500 ? 0 : 20;
    const total = subtotal + deliveryCharge;

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      subtotal,
      deliveryCharge,
      total,
      paymentMethod,
      shippingAddress,
    });

    // Clear cart
    await Cart.deleteMany({ userId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get User's Orders
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const orders = await Order.find({ userId })
      .populate("items.phoneId", "name images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get All Orders (Admin Only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.phoneId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Order Status (Admin Only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(orderStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true },
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated.",
      order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Get Order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("items.phoneId", "name images price");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Check if user owns this order or is admin
    if (order.userId._id.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
