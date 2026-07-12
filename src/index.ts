import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "PhoneTone API is running smoothly 🚀",
    version: "1.0.0",
  });
});

// --- ROUTES WILL GO HERE ---
// app.use("/api/auth", authRoutes);
// app.use("/api/phones", phoneRoutes);

app.use("/api/auth", authRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --- START SERVER ---
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
