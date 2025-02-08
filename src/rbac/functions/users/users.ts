import prisma from "../../../utils/prisma";

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
        const userId = req.params;
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