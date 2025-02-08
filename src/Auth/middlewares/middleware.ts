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

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "No authorization token provided" });
            return;
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: "Invalid token format" });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
            const user = await prisma.user.findUnique({
                where: { id: decoded.id }
            });

            if (!user) {
                res.status(401).json({ message: "User no longer exists" });
                return;
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Token has expired" });
            return;
        }
        res.status(500).json({ message: "Something went wrong with authentication" });
        return;
    }
};