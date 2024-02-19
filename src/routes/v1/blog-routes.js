const express = require("express");
const { getAllBlogs, getLinkingBlogs, createBlogs } = require("../../controllers/blog-controller");
const router = express.Router();


router.get("/", getAllBlogs);
router.post("/linkingBlogs", getLinkingBlogs);
router.post("/create", createBlogs);

module.exports = router;