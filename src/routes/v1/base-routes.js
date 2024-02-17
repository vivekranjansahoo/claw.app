const express = require('express');
const { SuccessResponse, ErrorResponse } = require('../../utils/common');
const AppError = require('../../utils/errors/app-error');
const { getNews } = require('../../services/news-service');
const { ClientController, UserController } = require('../../controllers');
const router = express.Router();

router.post('/news', async (req, res) => {
    try {
        const response = await getNews(parseInt(req.body.type));
        const successResponse = SuccessResponse(response);
        res.status(200).json(successResponse);
    } catch (error) {
        res.status(error.statusCode || 500).json(ErrorResponse({}, error));
    }
})

module.exports = router;