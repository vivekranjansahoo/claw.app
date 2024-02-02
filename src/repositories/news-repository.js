const { CrudRepository } = require(".");
const { News } = require("../models");

class NewsRespository extends CrudRepository {
    constructor() {
        super(News);
    }

    async deleteOlderThan(timestamp) {
        try {
            const deletedNews = await News.deleteMany({ createdAt: { $lte: timestamp } });
            return deletedNews;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = NewsRespository;