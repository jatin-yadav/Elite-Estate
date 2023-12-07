import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  next();
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/listing", listingRoutes);

app.get("/", async (req, res) => {
  res.send("Hello from Elite Estate");
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server has started on port http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
