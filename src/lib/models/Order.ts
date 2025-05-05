import mongoose from "mongoose";
import type { Document } from "mongoose";

// Define the interface for Order document
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderDetails: OrderDetail;
  orderDate: Date;
  totalAmount: number;
  status: string;
  trackingNumber?: string;
  serviceType?: string;
  carrierName?: string;
}

// Define the interface for OrderDetail
export interface OrderDetail {
  CollectionAddress?: {
    City: string;
    Postcode: string;
    Country: { Title: string };
  };
  DeliveryAddress?: {
    City: string;
    Postcode: string;
    Country: { Title: string };
  };
  TransitTimeEstimate?: number;
  Consignment?: {
    Packages: Array<{
      Weight: number;
      Length: number;
      Width: number;
      Height: number;
    }>;
  };
  ServiceResults?: Array<{
    ServiceName: string;
    CarrierName: string;
    TransitTimeEstimate: number;
    TotalCost: {
      TotalCostGrossWithCollection: number;
    };
  }>;
}

// Create the Order schema
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // Add index for faster queries
    },
    orderDetails: {
      type: mongoose.Schema.Types.Mixed, // Allows storing any JSON structure
      required: [true, "Order details are required"],
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: {
      type: String,
      sparse: true, // Only index non-null values
    },
    serviceType: {
      type: String,
    },
    carrierName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Order model
// Check if the model has already been defined to prevent Mongoose overwrite model error
export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", orderSchema);
