import {Router} from "express";
import { authRouter } from "./authRouters";
export const router = Router();

router.use("/authenticate", authRouter)