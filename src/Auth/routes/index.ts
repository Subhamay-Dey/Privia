import { Router } from "express";
import RegisterController from "../Controllers/RegisterController";
import LoginController from "../Controllers/LoginController";
import { authMiddleware } from "../middlewares/middleware";
import LogoutController from "../Controllers/LogoutController";
import { refreshTokenController } from "../Controllers/RefreshController";
import { authRateLimiter } from "../middlewares/rateLimiter";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, RegisterController.register);

authRouter.post("/login", authRateLimiter, LoginController.login);

authRouter.post("/logout", authMiddleware, LogoutController.logout);

authRouter.post("/refresh", refreshTokenController);