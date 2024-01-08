const { ClientService, UserService } = require('../services');
const { ErrorResponse } = require('../utils/common/');
const {StatusCodes} = require('http-status-codes');
const { verifyToken } = require('../utils/common/auth');
const AppError = require('../utils/errors/app-error')

async function checkUserAuth(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            throw new AppError('Missing jwt token', StatusCodes.BAD_REQUEST);
        }
        const response = verifyToken(token);
        const user = await UserService.getUserById(response.id);
        if (!user) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        req.body.user = user;
        console.log(req.body);
        next();
    } catch (error) {
        ErrorResponse.error = error
        return res.status(error.statusCode)
            .json(ErrorResponse)
    }
}

async function checkClientAuth(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            throw new AppError('Missing jwt token', StatusCodes.BAD_REQUEST);
        }
        const response = verifyToken(token);
        const client = await ClientService.getClientById(response.id);
        if (!client) {
            throw new AppError('No user found', StatusCodes.NOT_FOUND);
        }
        req.body.client = client;
        next();
    } catch (error) {
        ErrorResponse.error = error
        return res.status(error.statusCode)
            .json(ErrorResponse)
    }
}


module.exports = {
    checkUserAuth,
    checkClientAuth,
}