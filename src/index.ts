import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import phoneRoutes from "./routes/phone.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect database once
connectDB().catch((err) => {
  console.error("MongoDB Connection Error:", err);
});

console.log("CLIENT_URL:", process.env.CLIENT_URL);

// CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Root Route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "PhoneTone API is running smoothly 🚀",
    version: "1.0.0",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/phones", phoneRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start local server only
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
