import admin from "firebase-admin";
import express from "express";
import nodemailer from "nodemailer";


import { getAuth } from "firebase-admin/auth";



// Initialize Firebase Admin SDK
import serviceAccount from "./service_account.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const router = express.Router();

// Generate OTP function
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to another SMTP service
  auth: {
    user: "hollyghana@gmail.com", // Replace with your email
    pass: "mzne ajcf zbuz oeul", // Replace with your email password or app password
  },
  tls: {
    rejectUnauthorized: false, // Bypass SSL check
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "VIRTUAL-GUIDE <hollyghana@gmail.com>",
    to: email,
    subject: "Your One-Time Password (OTP)",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4CAF50;">Your OTP Code</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 18px; font-weight: bold;">Your OTP is:</p>
        <h1 style="color: #333; background-color: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h1>
        <p style="font-size: 14px;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr>
        <p style="font-size: 12px; color: #777;">If you did not request this OTP, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};


// Endpoint to handle OTP generation, sending, and storage
router.post("/generate-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min expiration

    // Send OTP via email
    await sendOTPEmail(email, otp);

    // Store OTP in Firestore only after the email is sent
    await db.collection("otps").doc(email).set({
      email,
      otp,
      createdAt: admin.firestore.Timestamp.now(),
      expiresAt: admin.firestore.Timestamp.fromMillis(expiresAt),
    });

    res.json({ success: true, message: "OTP sent and stored successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ NEW: Endpoint to verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Fetch OTP record from Firestore
    const doc = await db.collection("otps").doc(email).get();

    if (!doc.exists) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const { otp: storedOtp, expiresAt } = doc.data();

    // Check if OTP matches and is not expired
    if (storedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > expiresAt.toMillis()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // OTP is valid, respond successfully
    res.json({ success: true, message: "OTP verified successfully" });

    // Optionally: Delete OTP after successful verification
    await db.collection("otps").doc(email).delete();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Register User Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, indexNumber, email, username, password } = req.body;

    if (!firstName || !lastName || !indexNumber || !email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").doc(email).get();
    if (existingUser.exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Register user in Firebase Authentication
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store user details in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      firstName,
      lastName,
      indexNumber,
      email,
      username,
      createdAt: admin.firestore.Timestamp.now(),
    });

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




export default router;
