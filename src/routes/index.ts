import {Router} from "express";
import { rbacRouter } from "../rbac";
export const router = Router();

router.use("/rbac", rbacRouter )

//Same for Subhbamay's auth router