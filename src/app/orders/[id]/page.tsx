"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteLayout from "@/src/components/layout/site-layout";
import { useAuthStore } from "@/src/lib/store/useAuthStore";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Separator } from "@/src/components/ui/separator";
import { AlertCircle, ArrowLeft, Package, Truck } from "lucide-react";
import { format } from "date-fns";

interface Order {
  _id: string;
  orderDate: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingNumber?: string;
  serviceType?: string;
  carrierName?: string;
  orderDetails: any;
}

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // Redirect if not authenticated (this is a backup, middleware should handle this)
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Order not found");
          }
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, isAuthenticated, router]);

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
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4 flex items-center gap-2 pl-0 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Order Details
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          // Loading skeleton
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <Skeleton className="h-7 w-1/3" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="mt-2 h-4 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <Separator />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Summary Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle>
                    Order #{order._id.substring(order._id.length - 8)}
                  </CardTitle>
                  <Badge
                    className={`${getStatusColor(order.status)} capitalize`}
                  >
                    {order.status}
                  </Badge>
                </div>
                <CardDescription>
                  Placed on {format(new Date(order.orderDate), "PPP 'at' p")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Info Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Shipping Details */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      Shipping Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-medium min-w-24">Carrier:</span>
                        <span>{order.carrierName || "Not specified"}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium min-w-24">
                          Service Type:
                        </span>
                        <span>{order.serviceType || "Standard Delivery"}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-24">
                            Tracking Number:
                          </span>
                          <span className="font-mono">
                            {order.trackingNumber}
                          </span>
                        </div>
                      )}
                      {order.orderDetails?.CollectionAddress && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-24">From:</span>
                          <span>
                            {order.orderDetails.CollectionAddress.City || ""}{" "}
                            {order.orderDetails.CollectionAddress.Postcode ||
                              ""}
                            ,{" "}
                            {order.orderDetails.CollectionAddress.Country
                              ?.Title || ""}
                          </span>
                        </div>
                      )}
                      {order.orderDetails?.DeliveryAddress && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-24">To:</span>
                          <span>
                            {order.orderDetails.DeliveryAddress.City || ""}{" "}
                            {order.orderDetails.DeliveryAddress.Postcode || ""},{" "}
                            {order.orderDetails.DeliveryAddress.Country
                              ?.Title || ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-3 font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      Order Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-medium min-w-24">Status:</span>
                        <span className="capitalize">{order.status}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium min-w-24">
                          Order Date:
                        </span>
                        <span>{format(new Date(order.orderDate), "PPP")}</span>
                      </div>
                      {order.orderDetails?.TransitTimeEstimate && (
                        <div className="flex items-start gap-2">
                          <span className="font-medium min-w-24">
                            Transit Time:
                          </span>
                          <span>
                            {order.orderDetails.TransitTimeEstimate} days
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <span className="font-medium min-w-24">
                          Total Amount:
                        </span>
                        <span className="font-bold text-blue-700">
                          £{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Package Details */}
                {order.orderDetails?.Consignment?.Packages && (
                  <div>
                    <h3 className="mb-3 font-semibold flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      Package Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left font-medium text-gray-500">
                              Package
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500">
                              Weight
                            </th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500">
                              Dimensions (L×W×H)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orderDetails.Consignment.Packages.map(
                            (pkg: any, index: number) => (
                              <tr key={index} className="border-b">
                                <td className="px-4 py-3">
                                  Package {index + 1}
                                </td>
                                <td className="px-4 py-3">{pkg.Weight} kg</td>
                                <td className="px-4 py-3">
                                  {pkg.Length} × {pkg.Width} × {pkg.Height} cm
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Service Details */}
                {order.orderDetails?.ServiceResults &&
                  order.orderDetails.ServiceResults.length > 0 && (
                    <div>
                      <h3 className="mb-3 font-semibold flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        Service Details
                      </h3>
                      <div className="rounded-lg border p-4 bg-gray-50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Service Name:</span>
                            <span>
                              {order.orderDetails.ServiceResults[0].ServiceName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Carrier:</span>
                            <span>
                              {order.orderDetails.ServiceResults[0].CarrierName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Transit Time:</span>
                            <span>
                              {
                                order.orderDetails.ServiceResults[0]
                                  .TransitTimeEstimate
                              }{" "}
                              days
                            </span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between font-bold">
                            <span>Total Cost:</span>
                            <span className="text-blue-700">
                              £
                              {order.orderDetails.ServiceResults[0].TotalCost.TotalCostGrossWithCollection.toFixed(
                                2
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Tracking Status Card (if available) */}
            {order.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Tracking Information
                  </CardTitle>
                  <CardDescription>
                    Tracking Number:{" "}
                    <span className="font-mono">{order.trackingNumber}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-6">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        window.open(
                          `/track?number=${order.trackingNumber}`,
                          "_blank"
                        )
                      }
                    >
                      Track Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
            <h3 className="mt-4 text-lg font-medium text-red-800">
              Order Not Found
            </h3>
            <p className="mt-2 text-red-700">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button
              className="mt-6 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => router.push("/orders")}
            >
              Return to Orders
            </Button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
