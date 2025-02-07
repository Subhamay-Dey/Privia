"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.get("/", (req, res) => {
    res.status(201).json({
        message: "This is a basic GET route of authRouter :) "
    });
});
