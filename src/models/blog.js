const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    subHeading: { type: String, required: true },
    content: { type: Array, default: [] },
}, { timestamps: true });

const Blog = new mongoose.model('Blog', blogSchema);

module.exports = Blog;