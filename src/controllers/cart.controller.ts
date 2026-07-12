// src/controllers/cart.controller.ts
import { Request, Response } from "express";
import { Cart } from "../models/Cart";
import { Phone } from "../models/Phone";
import { AuthRequest } from "../middlewares/auth";

// 1. Get User's Cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const cartItems = await Cart.find({ userId }).populate({
      path: "phoneId",
      select: "name images price brand stock",
    });

    // Filter out any cart items where the phone was deleted
    const validItems = cartItems.filter((item) => item.phoneId !== null);

    res.status(200).json({
      success: true,
      cart: validItems,
      totalItems: validItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Add Item to Cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { phoneId, quantity = 1 } = req.body;

    if (!phoneId) {
      return res
        .status(400)
        .json({ success: false, message: "Phone ID is required." });
    }

    // Check if phone exists and is in stock
    const phone = await Phone.findById(phoneId);
    if (!phone) {
      return res
        .status(404)
        .json({ success: false, message: "Phone not found." });
    }
    if (phone.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock." });
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({ userId, phoneId });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await Cart.create({ userId, phoneId, quantity });
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart.",
      cartItem,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove Item from Cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { cartItemId } = req.params;

    const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, userId });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found." });
    }

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Cart Item Quantity
export const updateCartQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be at least 1." });
    }

    const cartItem = await Cart.findOne({ _id: cartItemId, userId });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found." });
    }

    // Check stock
    const phone = await Phone.findById(cartItem.phoneId);
    if (!phone || phone.stock < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stock." });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: "Cart updated.",
      cartItem,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Clear Cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await Cart.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared.",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
