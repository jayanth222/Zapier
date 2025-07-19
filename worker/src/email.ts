import { Resend } from 'resend';
import dotenv from 'dotenv'
export const sendEmail = (to: string, body: string) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    resend.emails.send({
        from: 'jayanthaitha222@gmail.com',
        to: to,
        subject: 'Hello World',
        html: `<p>${body}</p>`
    });
    console.log("sent the mail check it")
}

