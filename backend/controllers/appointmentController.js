import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";

export async function createAppointment(req, res) {

    if(req.user.role != "patient") {
        res.json({
            Message: "Please login as patient to create appointment"
        })
        return
    }

    try {
        const latestAppointment = await Appointment.find().sort({appointmentId : -1}).limit(1);

        let appointmentId;

        if(latestAppointment.length == 0) {
            appointmentId = "CA0001"
        } else {
            const currentAppointmentId = latestAppointment[0].appointmentId;

            const numberString = currentAppointmentId.replace("CA", "");
            const number = parseInt(numberString);

            const newNumber = (number + 1).toString().padStart(4, "0");

            appointmentId = "CA" + newNumber;
        }
        const newAppointmentData = req.body;
        newAppointmentData.appointmentId = appointmentId;
        newAppointmentData.patientId = req.user._id;

        const appointment = new Appointment(newAppointmentData);

        await appointment.save();

        res.json({
            message: "Appointment created successfully"
        })
    } catch(error) {
        res.json({
            message: "Appointment not created",
            error: error.message
        })
    }
}

export async function getAppointments(req, res) {

    if(req.user.role != "admin" && req.user.role != "patient" && req.user.role != "doctor") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        let appointmentList;

        if(req.user.role == "admin") {
            // Admin: see all appointments
            appointmentList = await Appointment.find()
                .populate("patientId", "name email phone")
                .populate({
                    path: "doctorId",
                    select: "specialization",
                    populate: {
                        path: "userId",
                        select: "name email phone"
                    }
                });
        } else if(req.user.role == "patient") {
            // Patient: see only their own appointments
            appointmentList = await Appointment.find({ patientId: req.user._id })
                .populate("patientId", "name email phone")
                .populate({
                    path: "doctorId",
                    select: "specialization",
                    populate: {
                        path: "userId",
                        select: "name email phone"
                    }
                });
        } else if(req.user.role == "doctor") {
            // Doctor: see only appointments assigned to them
            // Assuming doctorId in Appointment references the Doctor model which has userId = req.user._id
            const doctor = await Doctor.findOne({ userId: req.user._id });
            if (!doctor) {
                return res.status(404).json({ message: "Doctor profile not found" });
            }

            appointmentList = await Appointment.find({ doctorId: doctor._id })
                .populate("patientId", "name email phone")
                .populate({
                    path: "doctorId",
                    select: "specialization",
                    populate: {
                        path: "userId",
                        select: "name email phone"
                    }
                });
        }

        res.json({ list: appointmentList });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}