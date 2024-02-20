const express = require("express");
const { getAllBlogs, getLinkingBlogs, createBlogs, getBlogById } = require("../../controllers/blog-controller");
const router = express.Router();


router.get("/", getAllBlogs);
router.get("/:blogId", getBlogById);
router.post("/linkingBlogs", getLinkingBlogs);
router.post("/create", createBlogs);

module.exports = router;