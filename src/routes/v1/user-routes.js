const {UserController} = require('../../controllers')
const express = require('express')
const {AuthRequestMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/signup', AuthRequestMiddleware.validateSignUpRequest, UserController.createUser);
router.post('/login',AuthRequestMiddleware.validateLoginRequest, UserController.signin);
router.get('/auth/me',AuthRequestMiddleware.validateAuthRequest, UserController.isAuthenticated);

module.exports = router;