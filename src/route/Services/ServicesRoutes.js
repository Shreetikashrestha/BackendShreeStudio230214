import express from "express";
import { findAll, findById, deleteById, save, update } from "../../controller/services/ServicesController.js";
import serviceValidation from "../../validation/serviceValidation.js";

const router = express.Router();

// Routes
router.get("/view_services", findAll);
router.post("/",serviceValidation, save); // Assuming 'save' is for creating a new service
router.get("/:id", findById);
router.put("/:id", update); // Changed to PUT for updating
router.delete("/:id", deleteById);

export { router as serviceRouter };
