const {ClientController} = require('../../controllers')
const express = require('express')
const {validateRequestMiddleware, authMiddleware} = require('../../middlewares')
const router = express.Router();

router.post('/signup', validateRequestMiddleware.validateSignUpRequest, ClientController.createClient);
router.post('/login',validateRequestMiddleware.validateLoginRequest, ClientController.signin);
router.get('/auth/me',authMiddleware.checkClientAuth, ClientController.authMe);

module.exports = router;