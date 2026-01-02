import User from "../models/user.js";
import bcrypt from "bcrypt";

export function createUser(req, res) {
    const newUserData = req.body

    newUserData.password = bcrypt.hashSync(newUserData.password, 10)

    const user = new User(newUserData)
    user.save().then(
        () => {
            res.json({
                message: "User created"
            })
        }
    ).catch(
        () => {
            res.json({
                message: "User not created"
            })
        }
    )
}

export function loginUser(req, res) {
    User.findOne({email: req.body.email}).then(
        user => {
            if(!user) {
                res.json({
                    message: "User not found"
                })
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password)

                if(isPasswordCorrect) {
                    res.json({
                        message: "User logged in"
                    })
                } else {
                    res.json({
                        message: "User not logged in (wrong password)"
                    })
                }
            }
        }
    )
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