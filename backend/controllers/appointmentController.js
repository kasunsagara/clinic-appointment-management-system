import Appointment from "../models/appointment.js";

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

    if(req.user.role != "admin" && req.user.role != "patient") {
        res.json({
            message: "Access denied"
        })
        return
    }

    let appointmentList;

    try {
        if(req.user.role == "admin") {
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

            res.json({
                list: appointmentList
            })
        } else {
            appointmentList = await Appointment.find({patientId: req.user._id})
            .populate("patientId", "name email phone")
            .populate({
                path: "doctorId",
                select: "specialization",
                populate: {
                    path: "userId",
                    select: "name email phone"
                }
            }); 

            res.json({
                list: appointmentList
            })
        } 
    } catch(error) {
        res.json({
            error: error.message
        })
    }
}