"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteLayout from "../../../src/components/layout/site-layout";
import { useAuthStore } from "../../../src/lib/store/useAuthStore";
import { Button } from "../../../src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";
import { Badge } from "../../../src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../src/components/ui/tabs";
import { Skeleton } from "../../../src/components/ui/skeleton";
import { Package, Truck, Calendar, Clock, ShoppingBag } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface OrderDetail {
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

interface Order {
  _id: string;
  orderDate: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  serviceType?: string;
  carrierName?: string;
  orderDetails: OrderDetail;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated (this is a backup, middleware should handle this)
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: { orders: Order[] } = await response.json();
        setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <SiteLayout>
      <div className="container py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          <p className="mt-2 text-gray-600">
            View and track all your shipping orders
          </p>
        </div>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              // Loading skeletons
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <Skeleton className="mt-2 h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              // No orders message
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No orders found
                </h3>
                <p className="mt-1 text-gray-500">
                  {activeTab === "all"
                    ? "You haven't placed any orders yet."
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <Button
                  className="mt-6 bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/")}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              // Orders list
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order._id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="text-lg">
                          Order #{order._id.substring(order._id.length - 8)}
                        </CardTitle>
                        <Badge
                          className={`${getStatusColor(
                            order.status
                          )} capitalize`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Placed{" "}
                        {formatDistanceToNow(new Date(order.orderDate), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Order Date:</span>
                            <span>
                              {format(new Date(order.orderDate), "PPP")}
                            </span>
                          </div>
                          {order.trackingNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">
                                Tracking Number:
                              </span>
                              <span>{order.trackingNumber}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Carrier:</span>
                            <span>{order.carrierName || "Not specified"}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Service Type:</span>
                            <span>
                              {order.serviceType || "Standard Delivery"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Total Amount:</span>
                            <span className="font-bold text-blue-700">
                              £{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 px-6 py-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push(`/orders/${order._id}`)}
                      >
                        View Order Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SiteLayout>
  );
}
