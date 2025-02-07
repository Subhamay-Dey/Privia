"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'http://localhost:5173', 'deployed-frontend-url'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express_1.default.json());
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
app.use("/api", routes_1.router);
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
