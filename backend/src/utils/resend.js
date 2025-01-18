import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY
console.log(key)

export const resend =  new Resend(key)