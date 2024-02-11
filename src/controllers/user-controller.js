const { AWS_S3_BUCKET_NAME, AWS_REGION } = require('../config/server-config');
const { UserService } = require('../services');
const { uploadFile } = require('../services/s3-service');
const { ErrorResponse, SuccessResponse } = require("../utils/common")
const { StatusCodes } = require('http-status-codes');
const path = require("path");
const { createToken } = require('../utils/common/auth');



async function registerUser(req, res) {
    try {
        const ext = path.extname(req.file.originalname);
        await uploadFile(req.file.buffer, `id_${req.body.barCouncilNo}${ext}`);

        const { phoneNumber, ...data } = req.body;
        data.id_url = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/id_${req.body.barCouncilNo}${ext}`;
        data.registered = true;
        const updatedUser = await UserService.updateUserByPhoneNumber(phoneNumber, data);

        const jwt = createToken({ id: updatedUser.id, email: updatedUser.email });
        const successResponse = SuccessResponse({ jwt });
        return res
            .status(StatusCodes.OK)
            .json(successResponse)
    }
    catch (error) {
        const errorResponse = ErrorResponse({}, error);
        return res.status(error.statusCode)
            .json(errorResponse)
    }
}

async function verify(req, res) {
    try {
        const existing = await UserService.getUserByPhoneNumber(req.body.phoneNumber);
        if (!existing) {
            // create a new lawyer
            await UserService.createUser(req.body);
            const successResponse = SuccessResponse({ newUser: true, registered: false, verified: req.body.verified });
            return res.status(StatusCodes.CREATED).json(successResponse)
        }
        const { verified } = req.body;
        await UserService.updateUserByPhoneNumber(req.body.phoneNumber, { verified });
        const successResponse = SuccessResponse({ newUser: false, registered: existing.registered, verified: verified })

        if (existing.registered) successResponse.data.jwt = createToken({ id: existing.id, email: existing.email });
        return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
        return res.status(error.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

// not in use
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

        const successResponse = SuccessResponse(req.body.user);
        return res
            .status(StatusCodes.OK)
            .json(successResponse);
    }
    catch (error) {
        const errorResponse = ErrorResponse({}, error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse)
    }
}

module.exports = {
    registerUser,
    signin,
    authMe,
    verify,
}