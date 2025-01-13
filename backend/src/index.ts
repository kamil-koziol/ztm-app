import express, {Router} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { HealthController } from "./controllers/healthController";
import { AuthController } from "./controllers/authController";
import { AuthService } from "./services/authService";
import { UserController } from "./controllers/usersController";
import { UserService } from "./services/usersService";
import { StopsService } from "./services/stopsService";
import { CachingZTMClient, DefaultZTMClient } from "./lib/ztm/ztmClient";
import { Cache, MemoryCache } from "./lib/cache/cache";
import { StopsController } from "./controllers/stopsController";
import { authMiddleware } from "./controllers/middleware/authMiddleware";

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

let cache = new MemoryCache<string>()

let ztmClient = new CachingZTMClient(cache, new DefaultZTMClient())

let authService = new AuthService()
let stopsService = new StopsService(ztmClient)
let userService = new UserService(stopsService)

let healthController = new HealthController();
let authController = new AuthController(authService);
let userController = new UserController(userService)
let stopsController = new StopsController(stopsService)

// Middleware
app.use(bodyParser.json());

let publicRoutes = Router()

publicRoutes.get("/v1/health", (req, res) => healthController.getHealth(req, res));
publicRoutes.post("/v1/register", (req,res) => authController.registerUser(req, res));
publicRoutes.post("/v1/login", (req, res) => authController.loginUser(req, res));

let privateRoutes = Router()
privateRoutes.use(authMiddleware)

privateRoutes.get("/v1/users/:userId", (req, res) => userController.getUser(req, res))
privateRoutes.get("/v1/users", (req, res) => userController.getUsers(req, res))
privateRoutes.put("/v1/users/:userId", (req, res) => userController.updateUser(req, res))
privateRoutes.get("/v1/stops", (req, res) => stopsController.getStops(req, res))
privateRoutes.get("/v1/stops/:stopId", (req, res) => stopsController.getStop(req, res))

app.use(publicRoutes)
app.use(privateRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
