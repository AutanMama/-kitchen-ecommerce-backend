import mongoose from 'mongoose';

const installmentPaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [100, 'Minimum payment amount is 100 NGN'],
    },
    paystackReference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const InstallmentPayment = mongoose.model('InstallmentPayment', installmentPaymentSchema);
export default InstallmentPayment;