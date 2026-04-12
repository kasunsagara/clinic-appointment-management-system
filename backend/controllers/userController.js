import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function createUser(req, res) {
    const { name, email, password, phone } = req.body;
    let role = req.body.role || "patient";
    let isMainAdmin = false;

    try {
        const [mainAdminRows] = await pool.query("SELECT * FROM users WHERE isMainAdmin = true");
        const existingMainAdmin = mainAdminRows.length > 0;

        if (!existingMainAdmin) {
            role = "admin";       
            isMainAdmin = true;  
        } else {
            if (role === "admin") {
                if (!req.user) {
                    return res.json({
                        message: "Please login as main admin to create admin account"
                    });
                }
                if (!req.user.isMainAdmin) {
                    return res.json({
                        message: "Only main admin can create another admin account"
                    });
                }
                isMainAdmin = false;
            }
        }

        if (role === "doctor") {
            return res.json({
                message: "Doctors cannot be created using this endpoint"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        await pool.query(
            "INSERT INTO users (name, email, password, phone, role, isMainAdmin) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, hashedPassword, phone, role, isMainAdmin]
        );

        res.json({
            message: "User created successfully"
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.json({
                message: "User not created",
                error: "Email already in use"
            });
        }
        res.json({
            message: "User not created",
            error: error.message
        });
    }
}

export async function loginUser(req, res) {
  try {
    const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [req.body.email]);
    const user = userRows[0];

    if (!user) {
      return res.json({
        message: "User not found"
      });
    }

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.json({
        message: "Wrong password"
      });
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          _id: user.id, // For backward compatibility with existing frontends/middleware
          name: user.name,
          email: user.email,
          role: user.role,
          isMainAdmin: !!user.isMainAdmin
        }
      },
      process.env.JWT_SECRET
    );

    res.json({
      message: "User logged successfully",
      token: token,
      user: {
        id: user.id,
        _id: user.id, // For backward compatibility
        name: user.name,
        email: user.email,
        role: user.role,
        isMainAdmin: !!user.isMainAdmin
      }
    });

  } catch (error) {
    res.json({
      error: error.message
    });
  }
}

export async function logoutUser(req, res) {
    try {
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed"
        });
    }
}

export async function getUsers(req, res) {
    if(req.user.role !== "admin") {
        res.json({
            message: "Please login as admin to view user details"
        })
        return
    }

    try {
        const [userList] = await pool.query("SELECT id, id as _id, name, email, phone, role, isMainAdmin FROM users");

        res.json({
            list: userList
        })
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}

export async function getUserAccount(req, res) {
  try {
    const email = req.query.email; 
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [userRows] = await pool.query("SELECT id, name, email, phone, role, isMainAdmin FROM users WHERE email = ?", [email]);
    const user = userRows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Adjusting for client expectations (_id mapping)
    const formattedUser = { ...user, _id: user.id };

    res.status(200).json({
      message: "User profile retrieved successfully",
      user: formattedUser,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
}

export async function deleteUser(req, res) {
    if (req.user.role !== "admin") {
        return res.json({
            message: "Please login as admin to delete user"
        });
    }

    try {
        // req.params._id holds the target user ID (from express routes /api/users/:_id)
        const targetId = req.params._id || req.params.id;
        
        const [userRows] = await pool.query("SELECT * FROM users WHERE id = ?", [targetId]);
        const user = userRows[0];

        if (!user) {
            return res.json({
                message: "User not found"
            });
        }

        if (user.isMainAdmin) {
            return res.json({
                message: "Main admin cannot be deleted"
            });
        }

        await pool.query("DELETE FROM users WHERE id = ?", [targetId]);

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.json({
            message: "User not deleted",
            error: error.message
        });
    }
}
