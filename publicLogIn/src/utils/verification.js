const verificationExpirationTime = 5 * (60 * 1000); //minutes, value in milisencods

const reSendTokenMinTime = 30 * (1000); //seconds, value in miliseconds


function checkVerificationExpirationDate(date)
{
    const tokenLimitTime = date + verificationExpirationTime;

    if(Date.now() > tokenLimitTime)
    {
       return false;
    }

    return true;
}

function checkVerificationReSendDate(date)
{
    const tokenMinTime = date + reSendTokenMinTime;

    if(Date.now() < tokenMinTime)
    {
        return tokenMinTime - Date.now();
    }

    return 0;
}

module.exports={checkVerificationExpirationDate,checkVerificationReSendDate};