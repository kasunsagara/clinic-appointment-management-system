import Appointment from "../models/appointment.js";

export async function createAppointment(req, res) {

    if(req.user.role != "patient") {
        res.json({
            Message: "Please login as patient to create appointment"
        })
        return
    }

    try {
        const latestAppointment = await Appointment.find().sort({createdAt : -1}).limit(1);

        let appointmentId;

        if(latestAppointment.length == 0) {
            appointmentId = "CAS0001"
        } else {
            const currentAppointmentId = latestAppointment[0].appointmentId;

            const numberString = currentAppointmentId.replace("CAS", "");

            const number = parseInt(numberString);

            const newNumber = (number + 1).toString().padStart(4, "0");

            appointmentId = "CAS" + newNumber;
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