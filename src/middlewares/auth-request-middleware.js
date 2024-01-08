const {ErrorResponse} = require('../utils/common');
const {UserService} = require('../services')
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes');

function validateSignUpRequest(req, res, next){
    if(!req.body.username){
        ErrorResponse.message = "Something went wrong  while authenticating";
        ErrorResponse.error = new AppError(["username not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }

    if(!req.body.email){
        ErrorResponse.message = "Something went wrong  while authenticating";
        ErrorResponse.error = new AppError(["email not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    
    if(!req.body.password){
        ErrorResponse.message = "Something went wrong while authenticating";
        ErrorResponse.error = new AppError(["password not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}

function validateLoginRequest(req, res, next){
    if(!req.body.username){
        ErrorResponse.message = "Something went wrong  while authenticating";
        ErrorResponse.error = new AppError(["username not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    
    if(!req.body.password){
        ErrorResponse.message = "Something went wrong while authenticating";
        ErrorResponse.error = new AppError(["password not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}


async function validateAuthRequest(req, res, next){
    if(!req.headers['authorization']){
        ErrorResponse.message = "Something went wrong while verifying token";
        ErrorResponse.error = new AppError(["token not found in the incoming request"],StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}

module.exports = {
    validateSignUpRequest,
    validateLoginRequest,
    validateAuthRequest,
}