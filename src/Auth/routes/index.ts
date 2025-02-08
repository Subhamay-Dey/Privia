import { Router } from "express";
import RegisterController from "../Controllers/RegisterController";
import LoginController from "../Controllers/LoginController";
import { authMiddleware } from "../middlewares/middleware";
import LogoutController from "../Controllers/LogoutController";

export const authRouter = Router();

authRouter.post("/register", RegisterController.register);

authRouter.post("/login", LoginController.login);

authRouter.post("/logout", authMiddleware, LogoutController.logout)