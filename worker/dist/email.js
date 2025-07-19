"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const sendEmail = (to, body) => {
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    resend.emails.send({
        from: 'jayanthaitha222@gmail.com',
        to: to,
        subject: 'Hello World',
        html: `<p>${body}</p>`
    });
    console.log("sent the mail check it");
};
exports.sendEmail = sendEmail;
