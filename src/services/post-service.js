const { PostRepository } = require('../repositories')
const { StatusCodes } = require('http-status-codes')
const AppError = require('../utils/errors/app-error')

const postRepository = new PostRepository();

async function createPost(data) {
    try {
        const post = await postRepository.create(data);
        return post;
    }
    catch (error) {
        console.log(error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPosts(){
    try {
        const post = await postRepository.get();
        return post;
    } catch (error) {
        console.log(error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getPostById(id) {
    try {
        const post = await postRepository.getPostById(id);
        return post;
    }
    catch (error) {
        console.log(error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updatePost(id, data) {
    try {
        const post = await postRepository.update(id, data);
        return post;
    }
    catch (error) {
        console.log(error);
        throw new AppError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}



module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
}