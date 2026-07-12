import { Request, Response } from "express";
import { Phone } from "../models/Phone";
import { getPhoneSpecsFromGemini } from "../services/gemini.service";
import { generateSlug } from "../utils/helpers";
import { AuthRequest } from "../middlewares/auth";

// 1. Add Phone (Admin Only + Gemini AI)
export const addPhone = async (req: AuthRequest, res: Response) => {
  try {
    const { name, brand, images } = req.body;

    if (
      !name ||
      !brand ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, brand, and at least one image URL are required.",
      });
    }

    // Call Gemini AI to get specs
    const aiSpecs = await getPhoneSpecsFromGemini(name);

    // Validate required fields from AI
    if (!aiSpecs.price || !aiSpecs.shortDescription) {
      throw new Error("AI response missing critical fields.");
    }

    // Merge AI specs with Admin inputs
    const phoneData = {
      ...aiSpecs,
      name,
      brand,
      slug: generateSlug(name),
      images,
      releaseDate: new Date(aiSpecs.releaseDate),
      createdBy: req.user!.id,
    };

    const newPhone = await Phone.create(phoneData);
    res.status(201).json({
      success: true,
      message: "Phone added successfully!",
      phone: newPhone,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Phones (Public - with search, filter, sort, pagination)
export const getPhones = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const query: any = {};

    // Search
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }
    // Filter by Brand
    if (req.query.brand) {
      query.brand = { $in: (req.query.brand as string).split(",") };
    }
    // Filter by RAM
    if (req.query.ram) {
      query.ram = { $in: (req.query.ram as string).split(",") };
    }
    // Filter by Price Range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Sorting
    let sort: any = { createdAt: -1 }; // Default: Latest
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    if (req.query.sort === "rating") sort = { rating: -1 };

    const phones = await Phone.find(query).sort(sort).skip(skip).limit(limit);
    const total = await Phone.countDocuments(query);

    res.status(200).json({
      success: true,
      phones,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Single Phone by ID
export const getPhoneById = async (req: Request, res: Response) => {
  try {
    const phone = await Phone.findById(req.params.id);
    if (!phone)
      return res
        .status(404)
        .json({ success: false, message: "Phone not found." });
    res.status(200).json({ success: true, phone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Delete Phone (Admin Only)
export const deletePhone = async (req: AuthRequest, res: Response) => {
  try {
    const phone = await Phone.findByIdAndDelete(req.params.id);
    if (!phone)
      return res
        .status(404)
        .json({ success: false, message: "Phone not found." });
    res
      .status(200)
      .json({ success: true, message: "Phone deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePhone = async (req: AuthRequest, res: Response) => {
  try {
    const phone = await Phone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!phone)
      return res
        .status(404)
        .json({ success: false, message: "Phone not found." });
    res
      .status(200)
      .json({ success: true, message: "Phone updated successfully.", phone });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
