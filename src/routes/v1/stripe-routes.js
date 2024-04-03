const express = require('express');
const { authMiddleware, validateRequestMiddleware } = require('../../middlewares');
const { StripeController } = require('../../controllers');
const router = express.Router();

router.post(
    "/create-payment-intent",
    validateRequestMiddleware.validateCreatePaymentRequest,
    authMiddleware.checkClientAuth,
    StripeController.createPaymentIntent
);

router.post("/webhook", StripeController.captureEvent);

module.exports = router;