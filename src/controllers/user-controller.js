const { AWS_S3_BUCKET_NAME, AWS_REGION } = require('../config/server-config');
const { UserService } = require('../services');
const { uploadFile } = require('../services/s3-service');
const { ErrorResponse, SuccessResponse } = require("../utils/common")
const { StatusCodes } = require('http-status-codes');
const path = require("path");



async function registerUser(req, res) {
    try {
        // implement file upload and get the url
        const ext = path.extname(req.file.originalname);
        const uploadResponse = await uploadFile(req.file.buffer, `id_${req.body.barCouncilId}${ext}`);
        const { phoneNumber, ...data } = req.body;
        data.id_url = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/id_${req.body.barCouncilId}${ext}`;
        await UserService.updateUserByPhoneNumber(phoneNumber, data);
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
    registerUser,
    signin,
    authMe,
    verify,
}