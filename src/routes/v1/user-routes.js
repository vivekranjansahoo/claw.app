const {UserController} = require('../../controllers')
const express = require('express')
const {validateRequestMiddleware, authMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/signup', validateRequestMiddleware.validateSignUpRequest, UserController.createUser);
router.post('/login',validateRequestMiddleware.validateLoginRequest, UserController.signin);
router.get('/auth/me',authMiddleware.checkUserAuth, UserController.authMe);

module.exports = router;