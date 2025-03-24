const nodemailer = require('nodemailer');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const {createToken} = require('../databaseUtils/userUtils/token')

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
    const frontVerificationUrl = "http://localhost:3000/verification/"

    const token = uuidv4();
    console.log(token);
// sexo
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject:'Verifica tu correo electrónico',
        html:`<p>Verifica tu correo electrónico para completar el proceso de registro en la aplicación</p>
        <p>Verifica pulsando 
            <a href="${frontVerificationUrl +id+"/"+token}">aquí</a>
        </p>
        `,
    }

    const tokenHash = await hashToken(token);

    const tokenId = await createToken(tokenHash, id);

    await transporter.sendMail(mailOptions);
}

async function hashToken(token) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(token.toString(),salt);
}

function checkExpirationDate(date)
{
    const expirationTime = 1 * (60 * 60 * 1000); //hours, value in seconds

    const tokenLimitTime = date + expirationTime;

    if(Date.now() > tokenLimitTime)
    {
        return false;
    }

    return true;
}

module.exports={testEmailSender,sendVerificationEmail,checkExpirationDate}