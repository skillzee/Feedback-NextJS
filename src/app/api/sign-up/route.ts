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
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{status: 400})
        }


        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000+Math.random() * 900000).toString()


        if(existingUserByEmail){
            if(existingUserByEmail.isverified){
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                },{status: 400})
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserByEmail.password = hashedPassword;

                existingUserByEmail.verifyCode = verifyCode;

                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000);

                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isverified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }


        // Send Verification email

        const emailResponse = await sendVerificarionEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 500})
        }
        
        return Response.json({
            success: true,
            message: "User Registered Successfully. Please Verify your email"
        },{status: 201})


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