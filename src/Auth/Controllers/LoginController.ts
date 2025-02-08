import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

interface LoginPayloadType {
    email: string;
    password: string;
};

class LoginController {
    static async login(req:any, res:any) {
        try {
            const body:LoginPayloadType = req.body;

            if (!body) {
                return res.status(400).json({message: "Invalid request body"});
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: body.email,
                }
            });

            console.log("User search result:", user);

            if(!user) {
                return res.status(422).json({errors: {
                    email: "No user found with this email."
                }})
            }

            const isValid = await bcrypt.compare(body.password, user.password);
            if (!isValid) {
                return res.status(400).json({
                    message: "Invalid password"
                });
            }

            let JwtPayload = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            }

            const token = jwt.sign(JwtPayload, process.env.SECRET_KEY! , {expiresIn: "7d"});

            return res.json({
                message: "Logged in successfully",
                data:{
                    ...JwtPayload,
                    token: `Bearer ${token}`
                }
            });

        } catch (error) {
            console.error("Error during login:", error);
            if(error instanceof ZodError) {
                return res.status(422).json({message: "Invalid data", errors:error.errors});
            }
            return res.status(500).json({message: "Something went wrong, please try again!"})
        }
    }
}

export default LoginController;