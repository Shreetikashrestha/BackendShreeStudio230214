// import express from 'express'
// import { userController } from '../../controller/index.js';
// const router=express.Router();
// router.get("/",userController.getAll);
// router.post("/",userController.create);
// router.patch("/:id",userController.update);
// router.get("/:id",userController.getById);
// router.delete("/:id",userController.delelteById);

// export  {router as userRouter };

import express from "express";
import { userController } from "../../controller/index.js";
import userValidation from "../../validation/userValidation.js";

const router = express.Router();
router.get("/", userController.getAll);
router.post("/", userController.create);
router.patch("/:id", userValidation, userController.update);
router.get("/:id", userController.getById);
// src/route/user/userRoute.js
router.delete("/:id", userController.deleteById); // Correct spelling
export { router as userRouter };
