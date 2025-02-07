import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from "../../utils/prisma";

interface JwtPayload {
    id: string;
    email: string;
    username: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization token provided" });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(500).json({ message: "Something went wrong with authentication" });
    }
};