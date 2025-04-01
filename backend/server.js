import express from "express";

import cors from "cors";

import otpRoutes from "./app.js";



const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/otp", otpRoutes); // Register location routes

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to the Campus Navigation Backend!");
});

const PORT =  3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
