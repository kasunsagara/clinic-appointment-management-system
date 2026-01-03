import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function createUser(req, res) {

    const newUserData = req.body;

    if(newUserData.role == "admin") {

        if(req.user == null) {
            res.json({
                message: "Please login as admin to create admin account"
            })
            return
        }

        if(req.user.role != "admin") {
            res.json({
                message: "Please login as admin to create admin account"
            })
            return
        }
    }

    if(newUserData.role == "doctor") {

        if(req.user == null) {
            res.json({
                message: "Please login as admin to create doctor account"
            })
            return
        }

        if(req.user.role != "admin") {
            res.json({
                message: "Please login as admin to create doctor account"
            })
            return
        }
    }    

    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    const user = new User(newUserData);

    try {
        await user.save();

        res.json({
            message: "User created successfully"
        })
    } catch(error) {
        res.json({
            message: "Student not created"
        })
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








































export function getUsers(req, res) {
    User.find().then(
        (userList) => {
            res.json({
                list: userList
            })
        }
    ).catch(
        (error) => {
            res.json({
                message: error
            })
        }
    )
}