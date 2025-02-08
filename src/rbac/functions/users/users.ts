import prisma from "../../../utils/prisma";
import { JwtPayload } from "../../middlewares/verifyUserUpdate";
import jwt from "jsonwebtoken"

export const getAllUsers = async (req:any, res:any) => {
    try {
        const allUsers = await prisma.user.findMany();
        return res.status(200).json({
            message: "All useres fetched successfully",
            data: allUsers
        })
    } catch (error) {
        console.log(`Error in GET all users admin route: ${error}`);
        return res.status(500).json({
            message: "Internal swrver error in GET all users admin route",
            error: error
        })
    }
}

export const getSingleUser = async(req:any, res:any) => {
    try {
        const { userId } = req.params;
        if(!userId){
            return res.status(400).json({
                message: "User id not found"
            })
        }

        const foundUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!foundUser){
            return res.status(401).json({
                message: "User not found"
            })
        }

        res.status(201).json({
            message: "User found",
            data: foundUser 
        })
    } catch (error) {
        console.log(`Error in GET single user admin route: ${error}`);
        return res.status(500).json({
            message: "Internal server error in GET single user admin route",
            error: error
        })
        
    }
}

export const updateUser = async(req:any, res:any) => {
    try {
        const { userId } = req.params;
        const {username, email, role} = req.body;

        const token = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;     

        if(decoded.role === 'ADMIN'){
            const updatedRole = role;

            const adminUpdatedUser = await prisma.user.update({
                where: {
                    id: decoded.id
                },
                data:{
                    username: username,
                    email: email,
                    role: updatedRole
                }
            });

            res.status(201).json({
                message: "User updated successfully by Admin",
                updateUser: updateUser
            })
        }
        
       const selfUpdatedUser = await prisma.user.update({
            where:{
                id: userId
            },
            data:{
                username: username,
                email: email
            }
        });

        res.status(201).json({
            message: "User updated successfully only with username and email",
            selfUpdatedUser: selfUpdatedUser
        })
        
    } catch (error) {
        console.log(`Internal server error in Updating users: ${error}`);
        return res.status(500).json({
            message: "Internal server error in Updating users",
            error: error
        })
    }
}