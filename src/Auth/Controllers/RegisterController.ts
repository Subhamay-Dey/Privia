import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { registerSchema } from "../validations/registerValidation";
import { ZodError } from "zod";

interface RegisterBody {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

class RegisterController {

    static async register(req:any, res:any) {
        
        try {
            const body:RegisterBody = req.body;
            if(!body){
                return res.status(400).json({message: "Invalid request body"})
            };
            const payload = registerSchema.parse(body);
    
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

            return res.status(201).json({message: "User registered successfully"});

        } catch (error) {
            console.error("Error during registration:", error);
            if(error instanceof ZodError) {
                return res.status(422).json({errors: error.errors})
            }
            return res.status(500).json({message:"Something went wrong, please try again!"})
        }
    }
}

export default RegisterController;