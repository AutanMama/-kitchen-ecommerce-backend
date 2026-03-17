import axios from 'axios';

const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const initializePayment = async (email, amount, metadata) => {
  try {
    // Paystack accepts amount in kobo, so multiply NGN by 100
    const response = await paystackApi.post('/transaction/initialize', {
      email,
      amount: amount * 100,
      metadata,
    });
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error initializing Paystack transaction';
    throw new Error(message);
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    return response.data.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error verifying Paystack transaction';
    throw new Error(message);
  }
};