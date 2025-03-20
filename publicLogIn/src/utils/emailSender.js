const nodemailer = require('nodemailer');
const {v4:uuidv4} = require('uuid');

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
            console.log('todo cul');
            console.log(success);
        }
    });
}

async function sendVerificationEmail(id, email, res) {
    const currentUrl = "http://localhost:3000/"

    const token = uuidv4() + id;

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject:'Verifica tu correo electrónico',
        html:`<p>Verifica tu correo electónico para completar el proceso de registro en la aplicación</p>
        <p>Verifica pulsando 
            <a href="${currentUrl +"api/auth/verify/"+id+"/"+token}">aquí</a>
        </p>
        `,
    }
}

module.exports={testEmailSender,sendVerificationEmail}