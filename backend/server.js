const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const aiRoutes = require("./routes/aiRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

app.use("/api/ai", aiRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to VoiceResolve API"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VoiceResolve backend is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();