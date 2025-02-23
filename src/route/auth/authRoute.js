import express from "express";
import { authController } from "../../controller/index.js";
const router = express.Router();

router.get("/init", authController.init);
router.post("/register", authController.register);
router.post("/login", authController.login);

export { router as authRouter };