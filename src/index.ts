import express from "express";
import dotenv from "dotenv";
import { router } from "./routes";
import cors from "cors"

const app = express();

app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:5173', 'deployed-frontend-url'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }));

app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
});
