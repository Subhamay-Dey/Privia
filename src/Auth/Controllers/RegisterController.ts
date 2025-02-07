import prisma from "../../utils/prisma";

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

            await prisma.user.create({
                data:{
                    username: body.username,
                    email: body.email,
                    password: body.password,
                }
            })

        } catch (error) {
            return res.status(500).json({message:"Something went wrong, please try again!"})
        }
    }
}

export default RegisterController;