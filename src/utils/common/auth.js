const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { SECRET_KEY, EXPIRES_IN } = require('../../config/server-config');
 

function checkPassword(originalPassword, encryptedPassword){
    try{
        return bcrypt.compareSync(originalPassword, encryptedPassword);
    }
    catch(error){
        throw error;
    }
}


function createToken(payload){
    try{
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: EXPIRES_IN});
        return token;
    }
    catch(error){
        throw error;
    }
}

function verifyToken(token){
    try{
        return jwt.verify(token, SECRET_KEY);

    }
    catch(error){
        throw error;
    }
}

module.exports = {
    checkPassword,
    createToken,
    verifyToken,
}