import { Router } from "express";

export const rbacRouter = Router();

rbacRouter.get("/", (req, res) => {
    res.status(201).json({
        message:"Rbac system router working successfully :)"
    })
})

