import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true   
    },
    education: {
        university: {
            type: String
        },
        degree: {
            type: String
        },
        experienceYears: {
            type: Number
        }
    },
    specialization: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_hybrid&w=740&q=80"
    },
    availableDays: {
        type: [String],
        default: []
    },
    timeSlots: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Doctor = mongoose.model("doctors", doctorSchema);

export default Doctor;