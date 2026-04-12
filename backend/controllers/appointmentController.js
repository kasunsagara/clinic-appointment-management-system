import { pool } from "../config/db.js";

export async function createAppointment(req, res) {
    if(req.user.role !== "patient") {
        return res.json({
            Message: "Please login as patient to create appointment"
        });
    }

    try {
        const [latestRows] = await pool.query("SELECT appointmentId FROM appointments ORDER BY id DESC LIMIT 1");
        
        let appointmentId;
        if(latestRows.length === 0) {
            appointmentId = "CA0001";
        } else {
            const currentAppointmentId = latestRows[0].appointmentId;
            const numberString = currentAppointmentId.replace("CA", "");
            const number = parseInt(numberString);
            const newNumber = (number + 1).toString().padStart(4, "0");
            appointmentId = "CA" + newNumber;
        }

        const { doctorId, date, time, patient } = req.body;

        const [lastDocAppt] = await pool.query(
            "SELECT appointmentNumber FROM appointments WHERE doctorId = ? AND date = ? AND time = ? ORDER BY appointmentNumber DESC LIMIT 1",
            [doctorId, date, time]
        );

        let appointmentNumber = 1;
        if (lastDocAppt.length > 0) {
            appointmentNumber = lastDocAppt[0].appointmentNumber + 1;
        }

        const userId = req.user.id || req.user._id;
        
        const patientName = patient?.name;
        const patientAge = patient?.age;
        const patientReason = patient?.reason;

        await pool.query(
            "INSERT INTO appointments (appointmentId, appointmentNumber, userId, doctorId, date, time, status, patient_name, patient_age, patient_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [appointmentId, appointmentNumber, userId, doctorId, date, time, "pending", patientName, patientAge, patientReason]
        );

        res.json({
            message: "Appointment created successfully",
            appointmentNumber: appointmentNumber 
        });

    } catch(error) {
        res.json({
            message: "Appointment not created",
            error: error.message
        });
    }
}

export async function getAppointments(req, res) {
    if(req.user.role !== "admin" && req.user.role !== "patient" && req.user.role !== "doctor") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        let query = `
            SELECT 
                a.*,
                p.id as _patient_id, p.name as patient_name_user, p.email as patient_email, p.phone as patient_phone,
                d.id as _doctor_id, d.specialization as doctor_spec,
                du.id as _du_id, du.name as doctor_name, du.email as doctor_email, du.phone as doctor_phone
            FROM appointments a
            JOIN users p ON a.userId = p.id
            JOIN doctors d ON a.doctorId = d.id
            JOIN users du ON d.userId = du.id
        `;
        let queryParams = [];

        const requestUserId = req.user.id || req.user._id;

        if (req.user.role === "patient") {
            query += " WHERE a.userId = ?";
            queryParams.push(requestUserId);
        } else if (req.user.role === "doctor") {
            const [docRows] = await pool.query("SELECT id FROM doctors WHERE userId = ?", [requestUserId]);
            if (docRows.length === 0) {
                return res.status(404).json({ message: "Doctor profile not found" });
            }
            query += " WHERE a.doctorId = ?";
            queryParams.push(docRows[0].id);
        }

        query += " ORDER BY a.appointmentId ASC";

        const [appointments] = await pool.query(query, queryParams);

        const formattedList = appointments.map(row => {
            return {
                _id: row.id,
                id: row.id,
                appointmentId: row.appointmentId,
                appointmentNumber: row.appointmentNumber,
                date: row.date,
                time: row.time,
                status: row.status,
                patient: {
                    name: row.patient_name,
                    age: row.patient_age,
                    reason: row.patient_reason
                },
                // Populate mappings
                userId: {
                    _id: row._patient_id,
                    name: row.patient_name_user,
                    email: row.patient_email,
                    phone: row.patient_phone
                },
                doctorId: {
                    _id: row._doctor_id,
                    specialization: row.doctor_spec,
                    userId: {
                        _id: row._du_id,
                        name: row.doctor_name,
                        email: row.doctor_email,
                        phone: row.doctor_phone
                    }
                }
            };
        });

        res.json({ list: formattedList });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateAppointmentStatus(req, res) {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const appointmentIdToUpdate = req.params.id || req.params._id;

        const [result] = await pool.query(
            "UPDATE appointments SET status = ? WHERE id = ?",
            [status, appointmentIdToUpdate]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Return updated object
        const [updatedApptRows] = await pool.query("SELECT * FROM appointments WHERE id = ?", [appointmentIdToUpdate]);
        
        res.json({ success: true, appointment: { ...updatedApptRows[0], _id: updatedApptRows[0].id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}