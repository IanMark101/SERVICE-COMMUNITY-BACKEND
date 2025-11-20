import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./prisma";
import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import adminRoutes from "./routes/adminRoutes";
import reportRoutes from "./routes/reportRoutes";
import userRoutes from "./routes/userRoutes";


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend connected to Prisma" });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
