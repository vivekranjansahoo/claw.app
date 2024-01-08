const {ClientController} = require('../../controllers')
const express = require('express')
const {AuthRequestMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/signup', AuthRequestMiddleware.validateSignUpRequest, ClientController.createClient);
router.post('/login',AuthRequestMiddleware.validateLoginRequest, ClientController.signin);
router.get('/auth/me',AuthRequestMiddleware.validateAuthRequest, ClientController.isAuthenticated);

module.exports = router;