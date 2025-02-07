import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "../validations/registerValidation";
import { Request, Response } from "express";

interface RegisterBody {
    username: string,
    email: string,
    password: string,
}

class RegisterController {

    static async register(req:any, res:any) {
        
        try {
            const body:RegisterBody = req.body;
            const payload = registerSchema.parse(body)

            console.log(payload);

            let findUser = await prisma.user.findUnique({
                where: {
                    email: payload.email
                }
            })
            if(findUser) {
                return res.status(422).json({
                    errors:{
                        email:"Email already taken, please use another one."
                    },
                })
            }

            //Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload.password, salt);

            await prisma.user.create({
                data:{
                    username: payload.username,
                    email: payload.email,
                    password: hashedPassword,
                }
            })

        } catch (error) {
            return res.status(500).json({message:"Something went wrong, please try again!"})
        }
    }
}

export default RegisterController;