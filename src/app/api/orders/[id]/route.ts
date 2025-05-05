import { type NextRequest, NextResponse } from "next/server";
import Order from "@/src/lib/models/Order";
import { verifyToken } from "@/src/lib/auth/jwt";

// GET handler to fetch a specific order
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // Fetch the order
    const order = await Order.findById(id);

    // Check if order exists
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if the order belongs to the current user
    if (order.userId.toString() !== userData.id) {
      return NextResponse.json(
        { message: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH handler to update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
    const updateData = await req.json();

    // Fetch the order
    const order = await Order.findById(id);

    // Check if order exists
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if the order belongs to the current user
    if (order.userId.toString() !== userData.id) {
      return NextResponse.json(
        { message: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // Update only allowed fields (e.g., status)
    if (updateData.status) {
      order.status = updateData.status;
    }

    // Save the updated order
    await order.save();

    return NextResponse.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Failed to update order" },
      { status: 500 }
    );
  }
}
