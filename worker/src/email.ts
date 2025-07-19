import { Resend } from 'resend';
import dotenv from 'dotenv'
export const sendEmail = async (to: string, body: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: 'jayanthaitha@resend.dev',
        to: to,
        subject: 'Hello World',
        html: `<p>${body}</p>`
    });
    console.log("sent the mail check it")
}

