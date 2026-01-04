import express from "express";
import { activateDoctor, createDoctor, deactivateDoctor, getDoctorById, getDoctors } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/", createDoctor);
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:_id", getDoctorById);
doctorRouter.delete("/:_id", deactivateDoctor);
doctorRouter.put("/:_id", activateDoctor);

export default doctorRouter;