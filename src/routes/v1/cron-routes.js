const express = require('express');
const { SuccessResponse, ErrorResponse } = require('../../utils/common');
const { fetchNews } = require('../../scripts/newsapi');
const { StatusCodes } = require('http-status-codes');
const router = express.Router();

router.post('/news', async (req, res) => {
    try {
        await fetchNews(0);
        await fetchNews(1);
        return res.sendStatus(StatusCodes.OK);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
})

module.exports = router;