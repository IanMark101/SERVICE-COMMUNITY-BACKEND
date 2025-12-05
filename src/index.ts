import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import serviceRoutes from "./routes/services";
import adminRoutes from "./routes/adminRoutes";
import reportRoutes from "./routes/reportRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Configure CORS properly
app.use(cors({
  origin: [
    'http://localhost:4000',                      // Local frontend for testing
    'https://service-community-frontend.vercel.app',     // Your Vercel Frontend (NO trailing slash)
    'https://service-community-frontend.vercel.app/'     // Sometimes browsers send the slash, safe to add both
  ],
  credentials: true, // This allows cookies/sessions to work
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
