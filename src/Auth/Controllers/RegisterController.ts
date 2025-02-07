import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";

interface RegisterBody {
    username: string,
    email: string,
    password: string,
}

class RegisterController {

    static async register(req:any, res:any) {
        
        try {
            const body:RegisterBody = req.body;

            let findUser = await prisma.user.findUnique({
                where: {
                    email: body.email
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
            const hashedPassword = await bcrypt.hash(body.password, salt);

            await prisma.user.create({
                data:{
                    username: body.username,
                    email: body.email,
                    password: hashedPassword,
                }
            })

        } catch (error) {
            return res.status(500).json({message:"Something went wrong, please try again!"})
        }
    }
}

export default RegisterController;