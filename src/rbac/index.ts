import { Router } from "express";
import { adminRouter } from "./routes/adminRouter";

export const rbacRouter = Router();

rbacRouter.use("/", adminRouter);


