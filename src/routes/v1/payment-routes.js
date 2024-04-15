const express = require('express');
const { authMiddleware, validateRequestMiddleware } = require('../../middlewares');
const { CashfreeController } = require('../../controllers');
const router = express.Router();

router.post(
    "/create-payment-order",
    validateRequestMiddleware.validateCreatePaymentRequest,
    authMiddleware.checkClientAuth,
    CashfreeController.createOrder
);

module.exports = router;