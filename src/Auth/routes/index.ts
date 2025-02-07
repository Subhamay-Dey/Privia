import { Router } from "express";
import RegisterController from "../Controllers/RegisterController";

export const authRouter = Router();

authRouter.post("/register", RegisterController.register);