const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
});

function testEmailSender(){
    transporter.verify((error, success)=>{
        if(error)
        {
            console.log(error);

        }
        else
        {
            console.log(success);
        }
    });
}

async function sendEmail(emailAdress,subject, html) {
    
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: emailAdress,
        subject:subject,
        html:html,
    }
    
    await transporter.sendMail(mailOptions);
}

module.exports={testEmailSender,sendEmail}