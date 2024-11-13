const sendEmailService = require("../helper/emailService")

const emailController = {
        postEmail : async (req,res) => {
            try {
                const {email} = req.body
                if(email) {
                    const resp = await sendEmailService(email)
                    return res.json({resp, message: 'Da gui email '})
                }
                return res.status(404).json({
                message: 'Invalid email address'
                })
            } catch (error) {
                console.log(error);
                
            }
        }
}
module.exports = emailController