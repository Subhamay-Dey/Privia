"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const authRouters_1 = require("./authRouters");
exports.router = (0, express_1.Router)();
exports.router.use("/authenticate", authRouters_1.authRouter);
