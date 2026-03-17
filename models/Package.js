import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Package description is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    discountPrice: {
      type: Number,
      required: [true, 'Discount price is required'],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    images: [
      {
        type: String,
        required: [true, 'At least one image URL is required'],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;