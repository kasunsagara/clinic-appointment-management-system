import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function createUser(req, res) {

    const newUserData = req.body;

    if(newUserData.role === "admin") {
        if(!req.user) {
            res.json({
                message: "Please login as admin to create admin account"
            })
            return
        }
        if(req.user.role !== "admin") {
            res.json({
                message: "Only admin can create another admin account"
            })
            return
        }
    }

    if(newUserData.role === "doctor") {
        res.json({
            message: "Doctors cannot be created using this endpoint"
        })
        return
    }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);

    try {
        await user.save();

        res.json({
            message: "User created successfully"
        });
    } catch (error) {
        res.json({
            message: "User not created"
        });
    }
}

export async function loginUser(req, res) {

    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            res.user({
                message: "User not found"
            })
        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

            if(isPasswordCorrect) {
                const token = jwt.sign({user}, process.env.JWT_SECRET);

                res.json({
                    message: "User logged successfully",
                    token: token
                })
            } else {
                res.json({
                    message: "Wrong password"
                })
            }
        }
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}

export async function getUsers(req, res) {

    if(req.user.role != "admin") {
        res.json({
            message: "Please login as admin to view user details"
        })
        return
    }

    try {
        const userList = await User.find();

        res.json({
            list: userList
        })
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}

export async function getUserById(req, res) {

    try {
        const user = await User.findOne({_id: req.params._id});

        res.json({
            user: user
        })
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}

export async function deleteUser(req, res) {

    if(req.user.role != "admin") {
        res.json({
            message: "Please login as admin to delete user"
        })
        return
    }    

    try {
        await User.deleteOne({_id: req.params._id});

        res.json({
            message: "User deleted successfully"
        })
    } catch(error) {
        res.json({
            message: "User not deleted"
        })
    }
}






































