const {UserController} = require('../../controllers')
const express = require('express')
const {validateRequestMiddleware, authMiddleware} = require('../../middlewares')
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.post('/signup', upload.single('uploaded_id'), validateRequestMiddleware.validateUserSignUpRequest, UserController.createUser);
router.post('/login',validateRequestMiddleware.validateLoginRequest, UserController.signin);
router.get('/auth/me',authMiddleware.checkUserAuth, UserController.authMe);

module.exports = router;