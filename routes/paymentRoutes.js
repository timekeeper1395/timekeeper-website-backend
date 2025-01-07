const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Transaction = require("../models/Transaction");

const router = express.Router();

// Create Checkout Session
router.post("/checkout", async (req, res) => {
  const { amount, userName } = req.body;

  try {
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Your Cart Total", // You can customize this
            },
            unit_amount:amount*100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://timekeeper-website-frontend.onrender.com", // Replace with your success page URL
      cancel_url: "https://timekeeper-website-frontend.onrender.com/pages/cart.html", // Replace with your cart page URL
    });

    // Save the transaction to MongoDB
    const transaction = new Transaction({
      userName,
      amountPaid: amount,
    });

    await transaction.save();

    // Send the session ID to the frontend
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;
