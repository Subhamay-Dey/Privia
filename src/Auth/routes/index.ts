import { Router } from "express";
import RegisterController from "../Controllers/RegisterController";
import LoginController from "../Controllers/LoginController";

export const authRouter = Router();

authRouter.post("/register", RegisterController.register);

authRouter.post("/login", LoginController.login);