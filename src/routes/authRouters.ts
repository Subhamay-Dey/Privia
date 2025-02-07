import {Router} from "express";

export const authRouter = Router();

authRouter.get("/", (req, res) => {
    res.status(201).json({
        message: "This is a basic GET route of authRouter :) "
    })
})

