import express from "express";
import { createUser, deleteUser, getUserAccount, getUsers, loginUser, logoutUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/", getUsers);
userRouter.get("/me", getUserAccount);
userRouter.delete("/:_id", deleteUser);

export default userRouter;