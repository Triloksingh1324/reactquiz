import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';


export const sendEmail = async({email, emailType, userId}) => {
    try {
      
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        console.log(emailType)
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000})
        } else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000})
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'thora.bahringer@ethereal.email',
                pass: 'wWwYg5dCYeqSkgCwTN'
            }
        });


        const mailOptions = {
            from: 'trilok@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/${emailType==="VERIFY"?"verifyemail":"resetpassword"}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/${emailType==="VERIFY"?"verifyemail":"resetpassword"}?token=${hashedToken}
            </p>`
        }

        const mailresponse = await transporter.sendMail
        (mailOptions);
        return mailresponse;

    } catch (error) {
        throw new Error(error.message);
    }
}