const express = require('express');
const { GptController } = require('../../controllers/index');
const { authMiddleware } = require('../../middlewares');
const router = express.Router();


// routes to manage models for prompt generation
// router.get('/model/:modelId');
// router.get('/models');

// router.post('/model');

// router.delete('/model')

// routes to create/manage sessions
router.get('/user', authMiddleware.checkClientAuth, GptController.fetchGptUser);
router.get('/session/:sessionId', authMiddleware.checkClientAuth, GptController.getSessionMessages);
router.get('/sessions/:model', authMiddleware.checkClientAuth, GptController.getUserSessions);
router.post('/user', authMiddleware.checkClientAuth, GptController.initGptUser);

router.post('/createModel', GptController.createGptModel);
router.post('/createPlan', GptController.createGptPlan);

router.post('/referralCode/generate', GptController.createReferralCode);
router.post('/referralCode/redeem', GptController.redeemReferralCode);

// router.post('/conversation', GptController.generateGptResponse);
router.post('/session', authMiddleware.checkClientAuth, GptController.startSession);
router.post('/session/prompt', authMiddleware.checkClientAuth, GptController.appendMessage);

// router.delete('/session/sessionId');

module.exports = router;