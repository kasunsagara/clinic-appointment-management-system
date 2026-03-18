import express from "express";
import { createAppointment, getAppointments, updateAppointmentStatus } from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/", createAppointment);
appointmentRouter.get("/", getAppointments);
appointmentRouter.put("/:id/status", updateAppointmentStatus);

export default appointmentRouter;