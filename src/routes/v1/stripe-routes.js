const express = require('express');
const { authMiddleware } = require('../../middlewares');
const { ErrorResponse } = require('../../utils/common');
const router = express.Router();
// public test api key for sample implementation!
const stripe = require("stripe")(process.env.STRIPE_KEY);

const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

router.post("/create-payment-intent", async (req, res) => {
    try {

        const { items } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency: "INR",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(ErrorResponse({}, error))
    }
});

module.exports = router;