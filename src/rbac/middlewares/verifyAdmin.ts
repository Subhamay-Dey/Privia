import { NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload{
    id: string;
    role: string;
    username: string;
    email: string;
}


export const verifyAdmin = (req:any, res:any, next:NextFunction) => {
    
    try {
 
        const token = req.headers.authorization?.split(" ")[1];
    
        if(!token) return res.status(400).json({
            message: "Token not found"
        })
    
        console.log(`Token found is: ${token}`);

        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;

        console.log(`Decoded role from token is = ${decoded.role}`);
        

        if(decoded.role !== 'ADMIN'){
            return res.status(404).json({
                message: "Forbidden! This is an Admin only route!"
            })
        }

        next();
    } catch (error) {
        console.log(`Admin Middleware error: ${error}`);
        
        return res.status(500).json({
            message: "Internal server error",
            error: error 
        })
    }

} 
