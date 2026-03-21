import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
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
        enum: ["pending", "approved", "completed", "cancelled"],
        default: "pending"
    },
    patient: {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true
        }
    }
});

const Appointment = mongoose.model("appointments", appointmentSchema);

export default Appointment;