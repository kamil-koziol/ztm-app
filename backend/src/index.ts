import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { HealthController } from "./controllers/healthController";
import { AuthController } from "./controllers/authController";
import { AuthService } from "./services/authService";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const DB_DSN = process.env.DB_DSN || "mongodb://localhost:27017/testdb";

// DB
mongoose
  .connect(DB_DSN)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process if the connection fails
  });


// DI

let authService = new AuthService()

let healthController = new HealthController();
let authController = new AuthController(authService);

// Middleware
app.use(bodyParser.json());

app.get("/v1/health", (req, res) => healthController.getHealth(req, res));
app.post("/v1/register", (req,res) => authController.registerUser(req, res));
app.post("/v1/login", (req, res) => authController.loginUser(req, res));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
