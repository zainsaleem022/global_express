import { type NextRequest, NextResponse } from "next/server";
import Order from "@/src/lib/models/Order";
import { verifyToken } from "@/src/lib/auth/jwt";

// GET handler to fetch orders for the current user
export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userData = verifyToken(token);

    if (!userData) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch orders for the current user
    const orders = await Order.find({ userId: userData.id }).sort({
      orderDate: -1,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST handler to create a new order
export async function POST(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userData = verifyToken(token);

    if (!userData) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Parse request body
    const orderData = await req.json();

    // Extract relevant data from the API response
    const {
      orderDetails,
      totalAmount,
      serviceType,
      carrierName,
      trackingNumber,
    } = orderData;

    // Create a new order
    const newOrder = new Order({
      userId: userData.id,
      orderDetails,
      totalAmount,
      serviceType,
      carrierName,
      trackingNumber,
    });

    // Save the order to the database
    await newOrder.save();

    return NextResponse.json(
      { message: "Order created successfully", order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}
