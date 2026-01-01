import express from "express";
import { createStudent, deleteStudent, getStudents } from "../controllers/studentController.js";   

const studentRouter = express.Router();

studentRouter.post("/", createStudent);
studentRouter.get("/", getStudents);
studentRouter.delete("/", deleteStudent)

export default studentRouter;