import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
    id: string;
    role: string;
    username: string;
    email: string;
}

export const verifyUserUpdate = async (req: any, res: any, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(400).json({
            message: "Token not found"
        })

        console.log(`Token found is: ${token}`);

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;

        console.log(`Decoded role from token is = ${decoded.role}`);

        if(decoded.role === 'ADMIN'){
            return next();
        }

        if(decoded.id === userId){
            return next();
        }

        return res.status(403).json({
            message: "Access Denied! You are not allowed to update this user"
        })
    } catch (error) {
        console.log(`Error at Verify User Update middleware: ${error}`);
        return res.status(500).json({
            message: "Internal server error at Verify User update middleware",
            error: error
        })
    }

}