import {Router} from "express";
import { authRouter } from "../Auth/routes";
import { rbacRouter } from "../rbac";
export const router = Router();

router.use("/authentication", authRouter)
router.use("/rbac", rbacRouter )

//Same for Subhbamay's auth router

