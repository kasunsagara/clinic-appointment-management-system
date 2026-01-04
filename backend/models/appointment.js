import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true,
        unique: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }, 
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        required: true
    },
    date: {
        type: String,
        required: true
    }, 
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "cancelled", "completed"],
        default: "pending"
    },
    note: {
        type: String
    }
})

const Appointment = mongoose.model("appointments", appointmentSchema);

export default Appointment;