"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const sendEmail = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    yield resend.emails.send({
        from: 'jayanthaitha@resend.dev',
        to: to,
        subject: 'Hello World',
        html: `<p>${body}</p>`
    });
    console.log("sent the mail check it");
});
exports.sendEmail = sendEmail;
