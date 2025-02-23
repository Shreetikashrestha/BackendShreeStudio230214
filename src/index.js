import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors"; // Import cors
import { db } from "./database/index.js";
import { authRouter, userRouter } from "./route/index.js";
import { serviceRouter } from "./route/Services/ServicesRoutes.js";
import { authenticateToken } from "./middleware/token-middleware.js";
import { BookingRouter } from "./route/booking/BookingRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(authenticateToken);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/services", serviceRouter);
app.use("/api/bookings", BookingRouter);

app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(r.route.path);
  }
});

app.listen(port, async () => {
  console.log(`Project running on port ${port}`);
  await db();
});
