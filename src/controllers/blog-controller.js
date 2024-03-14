const { BlogService } = require('../services');
const { StatusCodes } = require('http-status-codes');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


async function getAllBlogs(req, res) {
    try {
        const blogs = await BlogService.getAllBlogs();
        return res.status(StatusCodes.OK).json(SuccessResponse(blogs));
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

async function getBlogByName(req, res) {
    try {
        const { blogName } = req.params;
        const response = await BlogService.getBlogByName(blogName);
        return res.status(StatusCodes.OK).json(SuccessResponse(response));
    } catch (error) {
        return res.status(error.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

async function getLinkingBlogs(req, res) {
    try {
        const { excludedBlogName } = req.params;
        const blogs = await BlogService.getLinkingBlogs(excludedBlogName);
        return res.status(StatusCodes.OK).json(SuccessResponse(blogs));
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}


async function createBlogs(req, res) {
    try {
        const { heading, subHeading, content, html } = req.body;
        const newBlog = await BlogService.createBlog({ heading, subHeading, content,html });
        return res.status(StatusCodes.CREATED).json(SuccessResponse(newBlog));
    } catch (error) {
        res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse({}, error));
    }
}

module.exports = {
    getAllBlogs,
    getLinkingBlogs,
    createBlogs,
    getBlogByName,
}