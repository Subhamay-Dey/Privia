import {Router} from "express";
import { authRouter } from "../Auth/routes";
export const router = Router();

router.use("/authentication", authRouter)