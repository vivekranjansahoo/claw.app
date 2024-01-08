const {PostController} = require('../../controllers');
const express = require('express');
const router = express.Router();


router.get('/', PostController.getPost);
router.post('/', PostController.createPost);
router.put('/', PostController.updatePost);

module.exports = router;