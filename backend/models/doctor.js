import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true   
    },
    bio: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    availableDays: {
        type: [String],
        default: []
    },
    timeSlots: { 
        type: Map, 
        of: [String] 
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Doctor = mongoose.model("doctors", doctorSchema);

export default Doctor;