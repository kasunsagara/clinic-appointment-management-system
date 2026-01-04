import express from "express";
import { activateDoctor, createDoctor, deactivateDoctor, deleteDoctor, getDoctorById, getDoctors } from "../controllers/doctorController.js";

const doctorRouter = express.Router();

doctorRouter.post("/", createDoctor);
doctorRouter.get("/", getDoctors);
doctorRouter.get("/:_id", getDoctorById);
doctorRouter.delete("/:_id", deleteDoctor);
doctorRouter.delete("/state/:_id", deactivateDoctor);
doctorRouter.put("/state/:_id", activateDoctor);


export default doctorRouter;