import Doctor from "../models/doctor.js";

export async function createDoctor(req, res) {

    if(req.user == null) {
        res.json({
            message: "Please login as admin to create Doctor"
        })
        return
    }

    if(req.user.role != "admin") {
        res.json({
            message: "Please login as admin to create Doctor"
        })
        return
    }

    const newDoctorData = new Doctor(req.body);

    try {
        await newDoctorData.save();

        res.json({
            message: "Doctor created successfully"
        })
    } catch(error) {
        res.json({
            message: "Doctor not created"
        })
    }
}

export async function getDoctors(req, res) {

    if(req.user.role != "admin" && req.user.role != "patient") {
        res.json({
            message: "Access denied"
        })
        return
    }

    try {
        const doctorList = await Doctor.find({isActive: true}).populate("userId", "name email phone");

        res.json({
            list: doctorList
        })
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}

export async function getDoctorById(req, res) {

    try {
        const doctor = await Doctor.findOne({_id: req.params._id});

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
        const doctor = await Doctor.findByIdAndUpdate(req.params._id, {isActive: false}, {new: true}).populate("userId", "name email phone");

        if(!doctor) {
            res.json({
                message: "Doctor not found"
            })
        } else {
            res.json({
                message: "Doctor deactivated successfully",
                doctor: doctor
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
                message: "Doctor activated successfully",
                doctor: doctor
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


 



