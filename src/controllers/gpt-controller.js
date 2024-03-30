const { GptServices } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common")
const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/app-error");

const { FLASK_API_ENDPOINT } = process.env;

async function fetchGptApi(body) {
    const response = await fetch(`${FLASK_API_ENDPOINT}/gpt/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

async function generateGptResponse(req, res) {
    try {
        const { prompt } = req.body;
        const gptApiResponse = await fetchGptApi({ prompt, context: "" });
        return res.status(StatusCodes.OK).json(SuccessResponse({ gptResponse: { message: gptApiResponse.gptResponse } }));
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

async function initGptUser(req, res) {
    try {
        const { _id, phoneNumber } = req.body.client;
        const newUser = await GptServices.createGptUser(phoneNumber, _id.toString());
        return res.status(StatusCodes.CREATED).json(SuccessResponse(newUser));

    } catch (error) {
        console.log(error);
        res.status(error.statusCode).json(ErrorResponse({}, error));
    }
}

async function startSession(req, res) {
    try {
        const { _id } = req.body.client;
        const userId = _id.toString();
        const { prompt, model } = req.body;
        // Fetch Context
        const session = await GptServices.createSession(userId, prompt, model);

        return res.status(StatusCodes.OK).json(SuccessResponse(session));

    } catch (error) {
        console.log(error);
        res.status(error.statusCode).json(ErrorResponse({}, error));
    }
}

async function appendMessage(req, res) {
    try {
        const { prompt, sessionId } = req.body;

        const { modelName, user } = await GptServices.fetchSessionBySessionId(sessionId);
        if (!modelName) throw new AppError("Invalid sessionId", StatusCodes.BAD_REQUEST);

        // Fetch Context
        const context = await GptServices.fetchContext(sessionId);

        // Save User Prompt
        const { token } = await GptServices.createMessage(sessionId, prompt, true, user.mongoId);

        // Make a call to gpt for generating response
        console.log("called by mode", modelName);
        const gptApiResponse = await fetchGptApi({ prompt, context });

        // Save Gpt Response
        const gptResponse = await GptServices.createMessage(sessionId, gptApiResponse.gptResponse, false);

        return res.status(StatusCodes.OK).json(SuccessResponse({ sessionId, gptResponse, token, relatedCases: gptApiResponse.relatedCases }));

    } catch (error) {
        console.log(error);
        res.status(error.statusCode).json(ErrorResponse({}, error));
    }
}

async function getUserSessions(req, res) {
    try {
        const { model } = req.params;
        const { _id } = req.body.client;
        const userId = _id.toString();
        const sessions = await GptServices.fetchSessions(userId, model);

        return res.status(StatusCodes.OK).json(SuccessResponse(sessions));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode, ErrorResponse({}, error));
    }
}

async function getSessionMessages(req, res) {
    try {
        const { sessionId } = req.params;
        const messages = await GptServices.fetchSessionMessages(sessionId);

        return res.status(StatusCodes.OK).json(SuccessResponse(messages));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode, ErrorResponse({}, error));
    }
}

async function createGptModel(req, res) {
    try {
        const { name, version } = req.body;
        const response = await GptServices.createModel(name, parseFloat(version));
        return res.status(StatusCodes.OK).json(SuccessResponse(response));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode, ErrorResponse({}, error));
    }
}
async function createGptPlan(req, res) {
    try {
        const { name, price, token } = req.body;
        const response = await GptServices.createPlan(name, parseInt(price), parseInt(token));
        return res.status(StatusCodes.OK).json(SuccessResponse(response));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode, ErrorResponse({}, error));
    }
}

async function createReferralCode(req, res) {
    try {
        const { _id } = req.body.client;
        const referralCode = await GptServices.createReferralCode(_id);
        return res.status(StatusCodes.OK).json(SuccessResponse({ referralCode, redeemCount: 0 }));
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

async function redeemReferralCode(req, res) {
    try {
        const { _id } = req.body.client;
        const { referralCode } = req.body;
        const response = await GptServices.redeemReferralCode(referralCode, _id);
        return res.status(StatusCodes.OK).json(SuccessResponse(response));
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}
async function fetchAmbassadorDetails(req, res) {
    try {
        const { _id, firstName, lastName, collegeName } = req.body.client;
        const response = await GptServices.fetchReferralDetails(_id);
        return res.status(StatusCodes.OK).json(SuccessResponse({ ...response, client: { firstName, lastName, collegeName } }));
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}



async function fetchGptUser(req, res) {
    try {
        const { _id } = req.body.client;
        if (!_id) return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse({}, { message: "Missing jwt for user authorization" }));
        const gptUser = await GptServices.fetchGptUser(_id);
        return res.status(StatusCodes.OK).json(SuccessResponse(gptUser));
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

async function fetchGptCases(id) {
    try {
        const response = await fetch(`${FLASK_API_ENDPOINT}/scrape/case/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const parsed = await response.json();
        return parsed;
    } catch (error) {
        console.log(error);
        throw new AppError("Failed to make api request to gpt.claw", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function fetchCaseDetails(req, res) {
    try {
        const { caseId } = req.params;
        const data = await fetchGptCases(caseId);
        return res.status(StatusCodes.OK).json(SuccessResponse(data));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

async function fetchGptCaseQuery(body) {
    try {
        const response = await fetch(`${FLASK_API_ENDPOINT}/search/case`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const parsed = await response.json();
        return parsed;
    } catch (error) {
        console.log(error);
        throw new AppError("Failed to make api request to gpt.claw", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function queryCase(req, res) {
    try {
        const { startDate = '01/01/1980', endDate = '01/01/2024', query = "", courtName = 'Supreme Court of India' } = req.body;
        if (!query) throw new AppError("Invalid query", StatusCodes.BAD_REQUEST);
        const response = await fetchGptCaseQuery({ startDate, endDate, query, courtName });
        return res.status(StatusCodes.OK).json(SuccessResponse(response));
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

module.exports = {
    startSession,
    getUserSessions,
    appendMessage,
    getSessionMessages,
    generateGptResponse,
    initGptUser,
    createGptModel,
    createGptPlan,
    createReferralCode,
    redeemReferralCode,
    fetchGptUser,
    fetchAmbassadorDetails,
    fetchCaseDetails,
    queryCase,
}