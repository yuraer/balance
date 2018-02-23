"use strict";

function ExtractJwt(req) {
    let token = null;
    if(req.cookies && req.cookies.token != void(0)){
        token = req.cookies['token'];
    }

    return token;
}

module.exports ={
    jwt: {
        jwtFromRequest: ExtractJwt,
        secretOrKey: 'usepasswordgenerator'
    },
    expiresIn: '1 day',
    secret:'secretkey',
    connectionUrl: 'mongodb://admin:admin@ds145283.mlab.com:45283/balance'
};