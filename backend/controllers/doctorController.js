import { pool } from "../config/db.js";
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

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [existingUser] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
            if (existingUser.length > 0) {
                await connection.rollback();
                connection.release();
                return res.status(400).json({ message: "Email already in use" });
            }

            const hashedPassword = bcrypt.hashSync(password, 10);
            
            const [userResult] = await connection.query(
                "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
                [name, email, hashedPassword, phone, "doctor"]
            );
            
            const userId = userResult.insertId;

            // availableDays and timeSlots must be stringified to insert into JSON columns if using execute,
            // though depending on mysql2 config, sending object directly might work. Safest to JSON.stringify.
            const availableDaysStr = JSON.stringify(availableDays);
            const timeSlotsStr = JSON.stringify(timeSlots);

            const [doctorResult] = await connection.query(
                "INSERT INTO doctors (userId, bio, specialization, availableDays, timeSlots, profilePicture) VALUES (?, ?, ?, ?, ?, ?)",
                [userId, bio, specialization, availableDaysStr, timeSlotsStr, profilePicture || null]
            );

            await connection.commit();
            connection.release();

            const createdDoctor = {
                id: doctorResult.insertId,
                userId,
                bio,
                specialization,
                availableDays,
                timeSlots,
                profilePicture,
                isActive: true
            };

            return res.status(201).json({ message: "Doctor created successfully", doctor: createdDoctor });

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error("Error creating doctor:", error);

        return res.status(500).json({
            message: "Doctor not created",
            error: error.message
        });
    }
}

export async function getDoctors(req, res) {
  if (!req.user) {
    return res.status(401).json({ 
        message: "Unauthorized - No user" 
    });
  }

  if (req.user.role !== "admin" && req.user.role !== "patient") {
    return res.status(403).json({ 
        message: "Access denied" 
    });
  }

  try {
    const [doctors] = await pool.query(`
        SELECT d.*, 
               u.name, u.email, u.phone 
        FROM doctors d 
        JOIN users u ON d.userId = u.id
    `);

    // Format for frontend
    const formattedList = doctors.map(doc => {
       const { name, email, phone, ...doctorData } = doc;
       
       let parsedDays = doctorData.availableDays;
       if (typeof parsedDays === 'string') {
           try { parsedDays = JSON.parse(parsedDays); } catch(e) { parsedDays = []; }
       }
       
       let parsedSlots = doctorData.timeSlots;
       if (typeof parsedSlots === 'string') {
           try { parsedSlots = JSON.parse(parsedSlots); } catch(e) { parsedSlots = {}; }
       }
       
       return {
           ...doctorData,
           _id: doctorData.id, // backwards compatibility
           availableDays: parsedDays,
           timeSlots: parsedSlots,
           userId: {
               _id: doc.userId,
               id: doc.userId,
               name,
               email,
               phone
           }
       };
    });

    res.json({ list: formattedList });

  } catch (error) {
    res.status(500).json({ 
        error: error.message 
    });
  }
}

export async function getDoctorById(req, res) {
  try {
    const [doctors] = await pool.query(`
        SELECT d.*, 
               u.name, u.email, u.phone 
        FROM doctors d 
        JOIN users u ON d.userId = u.id 
        WHERE d.id = ?
    `, [req.params.id]);

    const doc = doctors[0];

    if (!doc) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { name, email, phone, ...doctorData } = doc;
    
    // Ensure JSON parsing fallback
    let timeSlotsObj = doctorData.timeSlots;
    if (typeof timeSlotsObj === 'string') {
        try { timeSlotsObj = JSON.parse(timeSlotsObj); } catch(e) { timeSlotsObj = {}; }
    }

    // Prepare structure to closely match Mongoose populate
    let parsedDays = doctorData.availableDays;
    if (typeof parsedDays === 'string') {
        try { parsedDays = JSON.parse(parsedDays); } catch(e) { parsedDays = []; }
    }
    
    const formattedDoctor = {
        ...doctorData,
        _id: doctorData.id, // DB compatibility alias
        timeSlots: timeSlotsObj || {},
        availableDays: parsedDays,
        userId: {
            _id: doc.userId,
            id: doc.userId,
            name,
            email,
            phone
        }
    };

    res.json({
      doctor: formattedDoctor
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

export async function updateDoctor(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please login as admin to edit doctor" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admin can edit doctor" });
        }

        const doctorId = req.params.id; 
        const { name, email, password, phone, bio, specialization, availableDays, timeSlots, profilePicture } = req.body;

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [docRows] = await connection.query("SELECT * FROM doctors WHERE id = ?", [doctorId]);
            const doctor = docRows[0];
            if (!doctor) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ message: "Doctor not found" });
            }

            const [userRows] = await connection.query("SELECT * FROM users WHERE id = ?", [doctor.userId]);
            const user = userRows[0];
            if (!user) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ message: "Associated user not found" });
            }

            // Update User fields
            let newPassword = user.password;
            if (password) {
                newPassword = bcrypt.hashSync(password, 10);
            }
            
            await connection.query(
                "UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), password = ? WHERE id = ?",
                [name || null, email || null, phone || null, newPassword, user.id]
            );

            // Update Doctor fields
            const newAvailableDays = availableDays ? JSON.stringify(availableDays) : JSON.stringify(doctor.availableDays);
            const newTimeSlots = timeSlots ? JSON.stringify(timeSlots) : JSON.stringify(doctor.timeSlots);
            
            await connection.query(
                "UPDATE doctors SET bio = COALESCE(?, bio), specialization = COALESCE(?, specialization), profilePicture = COALESCE(?, profilePicture), availableDays = ?, timeSlots = ? WHERE id = ?",
                [bio || null, specialization || null, profilePicture || null, newAvailableDays, newTimeSlots, doctor.id]
            );

            await connection.commit();
            connection.release();

            return res.status(200).json({ message: "Doctor updated successfully" });

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error("Error updating doctor:", error);
        return res.status(500).json({ message: "Doctor not updated", error: error.message });
    }
}

export async function deleteDoctor(req, res) {
    if(req.user.role !== "admin") {
        res.json({
            message: "Please login as admin to delete doctor"
        })
        return
    }
    
    try {
        const targetId = req.params._id || req.params.id;
        
        // cascade delete from users? If we delete doctor, should we delete user?
        // In Mongoose code: await Doctor.deleteOne({_id: req.params._id}); 
        // We will just match that behaviour and delete from doctor (or users cascade)
        await pool.query("DELETE FROM doctors WHERE id = ?", [targetId]);

        res.json({
            message: "Doctor deleted successfully"
        })
    } catch(error) {
        res.json({
            message: "Doctor not deleted",
            error: error.message
        })
    }
}

export async function updateDoctorStatus(req, res) {
  try {
    const { id } = req.params;

    const [docRows] = await pool.query("SELECT isActive FROM doctors WHERE id = ?", [id]);
    const doctor = docRows[0];

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newStatus = !doctor.isActive;

    await pool.query("UPDATE doctors SET isActive = ? WHERE id = ?", [newStatus, id]);

    res.json({
      message: newStatus
        ? "Doctor activated successfully"
        : "Doctor deactivated successfully",
      doctor: { id, isActive: newStatus },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
