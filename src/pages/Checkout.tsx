import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, CreditCard, Building2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get admin payment info from localStorage
  const adminPaymentInfo = JSON.parse(
    localStorage.getItem("adminPaymentInfo") || "{}"
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleCheckout = async () => {
    if (!paymentProof) {
      alert("Please upload proof of payment");
      return;
    }

    setIsUploading(true);

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create order in localStorage
    const orderId = Date.now();
    const order = {
      id: orderId,
      items: cartItems,
      total: getTotalPrice(),
      status: "Pending Payment",
      date: new Date().toISOString().split("T")[0],
      paymentProof: paymentProof.name,
      customerName: "Current User",
      customerEmail: "user@example.com",
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Create payment record
    const payment = {
      id: Date.now() + 1,
      orderId: orderId,
      customer: "Current User",
      amount: getTotalPrice(),
      status: "Pending",
      method: "Bank Transfer",
      date: new Date().toISOString().split("T")[0],
      proofOfPayment: paymentProof.name,
    };

    const payments = JSON.parse(localStorage.getItem("payments") || "[]");
    payments.push(payment);
    localStorage.setItem("payments", JSON.stringify(payments));

    clearCart();
    setIsUploading(false);
    navigate(`/delivery/${orderId}`);
  };

  if (cartItems.length === 0) {
    return (
      <div
        className={`min-h-screen ${
          theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

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
            to="/cart"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Bank Name</Label>
                <p className="text-lg font-medium">
                  {adminPaymentInfo.bankName || "First Bank Nigeria"}
                </p>
              </div>
              <div>
                <Label>Account Name</Label>
                <p className="text-lg font-medium">
                  {adminPaymentInfo.accountName || "Medical Equipment Store"}
                </p>
              </div>
              <div>
                <Label>Account Number</Label>
                <p className="text-lg font-medium">
                  {adminPaymentInfo.accountNumber || "1234567890"}
                </p>
              </div>
              <div>
                <Label>Amount to Pay</Label>
                <p className="text-2xl font-bold text-green-600">
                  ₦{getTotalPrice().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Proof of Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Upload Proof of Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="paymentProof">Upload Receipt/Screenshot</Label>
                <Input
                  id="paymentProof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="mt-2"
                />
              </div>
              {paymentProof && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {paymentProof.name}
                  </p>
                </div>
              )}
              <Button
                onClick={handleCheckout}
                disabled={!paymentProof || isUploading}
                className="w-full"
              >
                {isUploading ? "Processing..." : "Proceed to Delivery Details"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {item.name} ({item.brand})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>₦{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
