import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { getAllUsers, getSingleUser, updateUser } from "../functions/users/users";
import { verifyUserUpdate } from "../middlewares/verifyUserUpdate";

export const adminRouter = Router();

adminRouter.get("/users", verifyAdmin, getAllUsers)

adminRouter.get("/user/:userId", verifyAdmin, getSingleUser);

adminRouter.patch("/user/:userId", verifyUserUpdate, updateUser)