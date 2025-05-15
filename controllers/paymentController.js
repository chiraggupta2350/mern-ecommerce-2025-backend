import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createPaymentIntent };
