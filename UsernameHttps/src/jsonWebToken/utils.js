const jwt = require('jsonwebtoken');

const key = process.env.JWT_KEY;

const accessMaxAge = 5*(60);
const refreshMaxAge = 365*(60*60*24);

function getAccessMaxAgeMili()
{
    return accessMaxAge * 1000;
}
function getRefreshMaxAgeMili()
{
    return refreshMaxAge * 1000;
}

function generateAccessToken(data)
{
    return jwt.sign(data,key,{expiresIn:accessMaxAge});
}

function generateRefreshToken(data)
{
    return jwt.sign(data,key,{expiresIn:refreshMaxAge});
}

function getKey()
{
    return key;
}


module.exports = {generateAccessToken,generateRefreshToken, getAccessMaxAgeMili,getRefreshMaxAgeMili, getKey};
