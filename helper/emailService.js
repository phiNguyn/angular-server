// Import the Nodemailer library
const nodemailer = require('nodemailer');
// Create a transporter object
require('dotenv').config()

 const sendEmailService = async (email)  => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USERNAME ,
            pass: process.env.EMAIL_PASSWORD
        },
    }) 

    let info = await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Send email',
        text: 'ccccccccccc',
        html: `<b>Hello world</b>`
    })
    return info 
}
module.exports = sendEmailService