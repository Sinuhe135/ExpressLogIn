let properties = {httpOnly:true,secure:true};

if(process.env.NODE_ENV === 'production')
{
    if(!process.env.DOMAIN)
    {
        throw ('DOMAIN has not been set up');
    }

    properties.sameSite = 'lax';
    properties.domain = '.'+process.env.DOMAIN;
}
else if(process.env.NODE_ENV)
{
    properties.sameSite = 'None';
}
else
{
    throw('NODE_ENV has not been set up')
}

module.exports = properties;