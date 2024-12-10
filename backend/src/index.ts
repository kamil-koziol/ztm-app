import express from "express";
import bodyParser from "body-parser";
import { HealthController } from "./controllers/healthController";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

let healthController = new HealthController();

app.get("/v1/health", healthController.getHealth);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
