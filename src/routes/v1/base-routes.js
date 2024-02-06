const express = require('express');
const { SuccessResponse, ErrorResponse } = require('../../utils/common');
const AppError = require('../../utils/errors/app-error');
const { getNews } = require('../../services/news-service');
const pythonProcess = require('../../../child_processes/python');
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

router.post('/search', (req, res) => {
    try {
        const { query } = req.body;
        if (!query) throw new AppError("Query param missing", 400);
        pythonProcess.stdin.write(JSON.stringify({ search_line: query }) + '\n');

        pythonProcess.stdout.once('data', (data) => {
            const matched_indices = JSON.parse(data);
            const successResponse = SuccessResponse(matched_indices);
            res.status(200).json(successResponse);
        });
    } catch (error) {
        res.status(error.statusCode || 500).json(ErrorResponse({}, error.toString()));
    }
})

module.exports = router;