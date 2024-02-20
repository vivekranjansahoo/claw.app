const CrudRepository = require('./crud-repository');
const { Blog } = require('../models');
const AppError = require('../utils/errors/app-error');


class BlogRepository extends CrudRepository {
    constructor() {
        super(Blog);
    }

    async getBlogById(blogId) {
        try {
            return await this.model.find({ "_id": blogId });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getLinkingBlogs(excludedId) {
        try {
            const response = await this.model.find({ "_id": { "$ne": excludedId } }).select('-content');
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = BlogRepository;