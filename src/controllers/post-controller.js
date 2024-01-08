const { PostService } = require('../services')
const { ErrorResponse, SuccessResponse } = require("../utils/common")
const { StatusCodes } = require('http-status-codes')


/**
 * POST:  /post
 * req.body {description: "", price_range: ""}
 **/
async function createPost(req, res) {
    try {
        const response = await PostService.createPost({
            description: req.body.description,
            price_range: req.body.price_range,
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


/**
 * GET:  /post/:id
 **/
async function getPost(req, res) {
    try {
        const id = req.params.id;
        let response;
        if(id == undefined){
            response = await PostService.getPosts();
        }
        response = await PostService.getPostById(id);
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

/**
 * PUT:  /post/:id
 * req.body: {}
 **/
async function updatePost(req, res) {
    try {
        const id = req.body.id;
        const data = req.body.data;
        response = await PostService.updatePost(id, data);
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


module.exports = {
    createPost,
    getPost,
    updatePost,
}