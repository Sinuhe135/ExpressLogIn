const verificationExpirationTime = 5 * (60 * 1000); //minutes, value in milisencods

const reSendTokenMinTime = 30 * (1000); //seconds, value in miliseconds

function getVerificationExpirationTimeMili()
{
    return verificationExpirationTime;
}

function checkVerificationExpirationDate(date)
{
    const timeTranscurred = Date.now() - date;

    if(timeTranscurred > verificationExpirationTime)
    {
       return false;
    }

    return true;
}

function checkVerificationReSendDate(date)
{
    const timeTranscurred = Date.now() - date;

    if(timeTranscurred < reSendTokenMinTime)
    {
        return tokenMinTime - Date.now();
    }

    return 0;
}

module.exports={checkVerificationExpirationDate,checkVerificationReSendDate,getVerificationExpirationTimeMili};