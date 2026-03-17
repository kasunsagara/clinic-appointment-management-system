import Doctor from "../models/doctor.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export async function createDoctor(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please login as admin to create doctor" });
        }
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can create doctor" });
        }

        const { name, email, password, phone, bio, specialization, availableDays, timeSlots, profilePicture } = req.body;

        if (!name || !email || !password || !phone || !bio || !specialization || !availableDays || !timeSlots) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: "doctor"
        });
        await user.save();

        const doctor = new Doctor({
            userId: user._id,
            bio,
            specialization,
            availableDays,
            timeSlots,
            profilePicture
        });
        await doctor.save();

        return res.status(201).json({ message: "Doctor created successfully", doctor });

    } catch (error) {
        console.error("Error creating doctor:", error);

        if (error?.userId) {
            await User.findByIdAndDelete(error.userId);
        }

        return res.status(500).json({
            message: "Doctor not created",
            error: error.message
        });
    }
}

export async function getDoctors(req, res) {

    // ✅ CHECK if user exists
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized - No user"
        });
    }

    // ✅ Role check
    if (req.user.role !== "admin" && req.user.role !== "patient") {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    try {
        const doctorList = await Doctor.find({ isActive: true })
        .populate("userId", "name email phone");

        res.json({
            list: doctorList
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

export async function getDoctorById(req, res) {

    try {
        const doctor = await Doctor.findOne({_id: req.params._id})
        .populate("userId", "name email phone");

        res.json({
            doctor: doctor
        })
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}

export async function deactivateDoctor(req, res) {

    if(req.user.role != "admin") {
        res.json({
            message: "Admin access only"
        })
        return
    }

    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params._id, {isActive: false}, {new: true})
        .populate("userId", "name email phone");

        if(!doctor) {
            res.json({
                message: "Doctor not found"
            })
        } else {
            res.json({
                message: "Doctor deactivated successfully"
            })
        }
    } catch(error) {
        res.json({
            message: "Doctor not deactivated"
        })
    }
}

export async function activateDoctor(req, res) {

    if(req.user.role != "admin") {
        res.json({
            message: "Admin access only"
        })
        return
    }

    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params._id, {isActive: true}, {new: true}).populate("userId", "name email phone");

        if(!doctor) {
            res.json({
                message: "Doctor not found"
            })
        } else {
            res.json({
                message: "Doctor activated successfully"
            })
        }
    } catch(error) {
        res.json({
            message: "Doctor not activated"
        })
    }
}

export async function deleteDoctor(req, res) {

    if(req.user.role != "admin") {
        res.json({
            message: "Please login as admin to delete doctor"
        })
        return
    }
    
    try {
        await Doctor.deleteOne({_id: req.params._id});

        res.json({
            message: "Doctor deleted successfully"
        })
    } catch(error) {
        res.json({
            message: "Doctor not deleted"
        })
    }
}


 



