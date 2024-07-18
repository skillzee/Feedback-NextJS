import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs"
import { sendVerificarionEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request){
    await dbConnect()


    try {
        
        const {username, email, password} = await request.json();


        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isverified: true
        })

        if(existingUserVerifiedByUsername){
            
        }
    } catch (error) {
        console.error("Error Registering user", error)
        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status:  500
            }
        )
    }
}