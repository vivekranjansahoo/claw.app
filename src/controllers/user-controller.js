const { UserService } = require('../services')
const { ErrorResponse, SuccessResponse } = require("../utils/common")
const { StatusCodes } = require('http-status-codes')


/**
 * POST:  /signup
 * req.body {username: 'username', email: 'user@gmail.com', password: "dsfj9sdjfoijw09"}
 **/
async function createUser(req, res) {
    try {
        // implement file upload and get the url
        const response = await UserService.createUser(req.body);
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    }
    catch (error) {
        ErrorResponse.error = error
        return res.status(error.statusCode)
            .json(ErrorResponse)
    }
}

async function verify(req, res) {
    try {
        const existing = await UserService.getUserByPhoneNumber(req.body.phoneNumber);
        if (!existing) {
            // create a new lawyer
            const response = await UserService.createUser(req.body);
            SuccessResponse.newUser = true;
            SuccessResponse.registered = false;
            return res.status(StatusCodes.CREATED).json(SuccessResponse)
        }
        SuccessResponse.newUser = false;
        SuccessResponse.registered = existing.registered;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.error = error;
        return res.status(error.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function signin(req, res) {
    try {
        const response = await UserService.signin({
            username: req.body.username,
            password: req.body.password
        });
        SuccessResponse.data = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse)
    }
    catch (error) {
        ErrorResponse.error = error
        return res.status(error.statusCode)
            .json(ErrorResponse)
    }
}

async function authMe(req, res) {
    try {
        const response = req.body.user;
        SuccessResponse.data = response;
        req.user = response;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    }
    catch (error) {
        ErrorResponse.error = error
        return res.status(error.statusCode)
            .json(ErrorResponse)
    }
}

module.exports = {
    createUser,
    signin,
    authMe,
    verify,
}