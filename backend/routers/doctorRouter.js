import express from "express";
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctorStatus, updateDoctor } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/", createDoctor);
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:id", getDoctorById);
doctorRouter.put("/:id", updateDoctor);
doctorRouter.delete("/:id", deleteDoctor);
doctorRouter.put("/:id/status", updateDoctorStatus);

export default doctorRouter;