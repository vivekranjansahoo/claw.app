const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

const userSignupSchema = require('../schema/userSignupSchema');
const lawyerVerifySchema = require('../schema/lawyerVerifySchema');
const AppError = require('../utils/errors/app-error');
const { ErrorResponse } = require('../utils/common');


async function validateLawyerVerifyRequest(req, res, next) {
    try {
        req.body.phoneNumber = req.body.phoneNumber.toString();
        await lawyerVerifySchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).send(error);
    }
}

async function validateLawyerRegisterRequest(req, res, next) {
    try {
        req.body.barCouncilNo = parseInt(req.body.barCouncilNo);
        req.body.barCouncilYear = parseInt(req.body.barCouncilYear);
        req.body.pincode = parseInt(req.body.pincode);
        req.body.phoneNumber = req.body.phoneNumber.toString();
        if (!req.file?.buffer) throw new AppError("Missing identification attachment");
        if (req.lawyer.registered) throw new AppError("Lawyer already registered");
        await userSignupSchema.validateAsync(req.body);
        next();
    }
    catch (error) {
        console.log(error)
        res.status(StatusCodes.BAD_REQUEST).send(error);
    }
}

function validateSignUpRequest(req, res, next) {
    if (!req.body.username) {
        ErrorResponse.message = "Something went wrong  while authenticating";
        ErrorResponse.error = new AppError(["username not found in the incoming request"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }

    if (!req.body.email) {
        ErrorResponse.message = "Something went wrong  while authenticating";
        ErrorResponse.error = new AppError(["email not found in the incoming request"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }

    if (!req.body.password) {
        ErrorResponse.message = "Something went wrong while authenticating";
        ErrorResponse.error = new AppError(["password not found in the incoming request"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}

function validateLoginRequest(req, res, next) {
    if (!req.body.username) {
        ErrorResponse.message = "Something went wrong  while authenticating";
        ErrorResponse.error = new AppError(["username not found in the incoming request"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }

    if (!req.body.password) {
        ErrorResponse.message = "Something went wrong while authenticating";
        ErrorResponse.error = new AppError(["password not found in the incoming request"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}


async function validateAuthRequest(req, res, next) {
    if (!req.headers['authorization']) {
        ErrorResponse.message = "Something went wrong while verifying token";
        ErrorResponse.error = new AppError(["token not found in the incoming request"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}

function validatePostRequest(req, res, next) {
    if (!req.body.description || req.body.description === "") {
        ErrorResponse.message = "Description can't be empty.";
        ErrorResponse.error = new AppError(["Description is not found in the incoming message"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    if (!req.body.price_range || req.body.price_range === "") {
        ErrorResponse.message = "Price Range can't be empty.";
        ErrorResponse.error = new AppError(["Price Range is not found in the incoming message"], StatusCodes.BAD_REQUEST);
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(ErrorResponse)
    }
    next();
}

function validatePostUpdateRequest(req, res, next) {
    if (!req.body.id && req.body.id === "" && req.query.id === "") {
        ErrorResponse.message = "Post Id cannot be empty";
        ErrorResponse.error = new AppError("Post id not found in the incoming message", StatusCodes.BAD_REQUEST);
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
    validatePostRequest,
    validatePostUpdateRequest,
    validateLawyerRegisterRequest,
    validateLawyerVerifyRequest,
}