import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { getAllUsers, getSingleUser } from "../functions/users/users";

export const adminRouter = Router();

adminRouter.get("/users", verifyAdmin, getAllUsers)

adminRouter.get("/user/:userId", verifyAdmin, getSingleUser)