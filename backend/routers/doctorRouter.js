import express from "express";
import { createDoctor, getDoctorById, getDoctors } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/", createDoctor);
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:_id", getDoctorById);

export default doctorRouter;