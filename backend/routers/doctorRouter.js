import express from "express";
import { createDoctor, deleteDoctor, getDoctorById, getDoctors, updateDoctorStatus } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/", createDoctor);
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:_id", getDoctorById);
doctorRouter.delete("/:_id", deleteDoctor);
doctorRouter.put("/:id/status", updateDoctorStatus);

export default doctorRouter;