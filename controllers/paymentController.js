import crypto from 'crypto';
import Order from '../models/Order.js';
import InstallmentPayment from '../models/InstallmentPayment.js';
import { initializePayment } from '../services/paystackService.js';

export const initiateInstallmentPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum payment amount is 100 NGN' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    if (order.remainingBalance <= 0) {
      return res.status(400).json({ message: 'Order is already fully paid' });
    }

    if (amount > order.remainingBalance) {
      return res.status(400).json({ message: 'Payment amount exceeds remaining balance' });
    }

    const metadata = {
      user_id: req.user._id.toString(),
      order_id: order._id.toString(),
    };

    const paystackData = await initializePayment(req.user.email, amount, metadata);

    await InstallmentPayment.create({
      orderId: order._id,
      userId: req.user._id,
      amount,
      paystackReference: paystackData.reference,
      status: 'PENDING',
    });

    res.status(200).json({
      authorization_url: paystackData.authorization_url,
      reference: paystackData.reference,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;
      
      const installment = await InstallmentPayment.findOne({ paystackReference: reference });
      
      if (!installment || installment.status === 'SUCCESS') {
        return res.status(200).json({ message: 'Webhook received' });
      }

      installment.status = 'SUCCESS';
      installment.paidAt = new Date();
      await installment.save();

      const order = await Order.findById(metadata.order_id);
      if (order) {
        // Paystack amount is in kobo, convert back to NGN for DB
        const paidAmountNGN = amount / 100;
        
        order.amountPaid += paidAmountNGN;
        order.remainingBalance = order.totalAmount - order.amountPaid;

        if (order.remainingBalance <= 0) {
          order.remainingBalance = 0;
          order.paymentStatus = 'FULLY_PAID';
        } else {
          order.paymentStatus = 'PARTIAL';
        }

        await order.save();
      }
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
};