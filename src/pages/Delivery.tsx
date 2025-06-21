import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Delivery = () => {
  const { orderId } = useParams();
  const { theme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const foundOrder = orders.find((o: any) => o.id === Number(orderId));
    setOrder(foundOrder);
  }, [orderId]);

  const handleInputChange = (field: string, value: string) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitDelivery = () => {
    if (
      !deliveryInfo.fullName ||
      !deliveryInfo.phone ||
      !deliveryInfo.address
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Update order with delivery info
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = orders.map((o: any) =>
      o.id === Number(orderId)
        ? {
            ...o,
            deliveryInfo,
            status:
              order.status === "Completed"
                ? "Ready for Delivery"
                : "Awaiting Payment Confirmation",
          }
        : o
    );
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrder((prev) => ({
      ...prev,
      deliveryInfo,
      status:
        prev.status === "Completed"
          ? "Ready for Delivery"
          : "Awaiting Payment Confirmation",
    }));

    // Show success modal instead of alert
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to review page for the first item in the order
    if (order && order.items && order.items.length > 0) {
      navigate(`/review/${order.items[0].id}`);
    }
  };

  if (!order) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order not found
          </h1>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Payment":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "Ready for Delivery":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const canPlaceDelivery =
    order.status === "Completed" || order.status === "Ready for Delivery";

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            >
              C.E.S GLOBAL MEDICS
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Order ID</Label>
                <p className="text-lg font-mono">#{order.id}</p>
              </div>
              <div>
                <Label>Payment Status</Label>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <Label>Total Amount</Label>
                <p className="text-xl font-bold text-green-600">
                  ₦{order.total.toLocaleString()}
                </p>
              </div>
              {!canPlaceDelivery && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <Clock className="w-5 h-5" />
                    <p className="text-sm">
                      Waiting for admin to confirm payment before delivery can
                      be placed.
                    </p>
                  </div>
                </div>
              )}
              {canPlaceDelivery && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="w-5 h-5" />
                    <p className="text-sm">
                      Payment confirmed! You can now place your delivery order.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={deliveryInfo.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    disabled={!canPlaceDelivery}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={deliveryInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!canPlaceDelivery}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={deliveryInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!canPlaceDelivery}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={deliveryInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    disabled={!canPlaceDelivery}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={deliveryInfo.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    disabled={!canPlaceDelivery}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={deliveryInfo.additionalInfo}
                  onChange={(e) =>
                    handleInputChange("additionalInfo", e.target.value)
                  }
                  disabled={!canPlaceDelivery}
                  rows={2}
                />
              </div>
              <Button
                onClick={handleSubmitDelivery}
                disabled={!canPlaceDelivery}
                className="w-full"
              >
                {canPlaceDelivery
                  ? "Place Delivery Order"
                  : "Waiting for Payment Confirmation"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Delivery Request Sent Successfully!
            </DialogTitle>
            <DialogDescription>
              Your delivery information has been sent to the admin for
              processing. You will receive a confirmation once your order is
              dispatched.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleSuccessModalClose}>
              Continue to Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Delivery;
