import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { updateOrderStatus } from "@/Api/OrderProduct";

interface OrderDetailModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
  reloadOrders?: () => Promise<void>;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    case "processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "completed":
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "cancelled":
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

const statusOptions = [
  { value: "processing", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  reloadOrders,
}) => {
  const [status, setStatus] = useState(order?.status || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  React.useEffect(() => {
    setStatus(order?.status || "");
    setError("");
    setSuccess("");
  }, [order]);

  if (!order) return null;

  const items = order.items || [];
  const delivery = order.deliveryDetails || {};
  const customer = order.customerInfo || {};

  const canEditStatus = !["completed", "delivered", "cancelled"].includes(
    (order.status || "").toLowerCase()
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await updateOrderStatus(order._id, status);
      console.log("Update response:", res);
      setSuccess("Order status updated successfully");
      if (reloadOrders) await reloadOrders();
      // Optionally update order.status in parent
    } catch (err: any) {
      setError(err.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <DialogTitle>Order Details</DialogTitle>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Order & Customer Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Order Info
              </h3>
              <div className="space-y-1 text-sm">
                <div>
                  Order ID: <span className="font-mono">#{order._id}</span>
                </div>
                <div className="flex items-center gap-2">
                  Status:{" "}
                  <Badge className={getStatusColor(status)}>{status}</Badge>
                  {canEditStatus && (
                    <>
                      <select
                        value={status}
                        onChange={handleStatusChange}
                        className="ml-2 border rounded px-2 py-1 text-xs"
                        disabled={loading}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleUpdateStatus}
                        disabled={loading || status === order.status}
                        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? "Updating..." : "Update"}
                      </button>
                    </>
                  )}
                </div>
                {error && (
                  <div className="text-xs text-red-600 mt-1">{error}</div>
                )}
                {success && (
                  <div className="text-xs text-green-600 mt-1">{success}</div>
                )}
                <div>
                  Payment:{" "}
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div>
                  Date:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : "-"}
                </div>
                <div>
                  Total:{" "}
                  <span className="font-semibold">
                    ₦{order.totalAmount?.toLocaleString()}
                  </span>
                </div>
                <div>
                  Shipping Fee:{" "}
                  <span className="font-semibold">
                    ₦{order.shippingFee?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Customer
              </h3>
              <div className="space-y-1 text-sm">
                <div>Name: {customer.fullName}</div>
                <div>Email: {customer.email}</div>
                <div>Phone: {customer.phone}</div>
                <div>Address: {customer.address}</div>
                <div>City: {customer.city}</div>
                <div>State: {customer.state}</div>
                <div>Zip: {customer.zipCode}</div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Delivery
              </h3>
              <div className="space-y-1 text-sm">
                <div>Name: {delivery.fullName}</div>
                <div>Phone: {delivery.phone}</div>
                <div>Address: {delivery.address}</div>
                <div>City: {delivery.city}</div>
                <div>State: {delivery.state}</div>
                <div>Zip: {delivery.zipCode}</div>
                <div>Landmark: {delivery.landmark}</div>
                <div>Instructions: {delivery.deliveryInstructions}</div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Product</th>
                    <th className="px-3 py-2 text-left">Brand</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-right">Price</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b dark:border-gray-700">
                      <td className="px-3 py-2">
                        {item.product?.productName || "-"}
                        <div className="text-xs text-gray-500">
                          {item.product?.category}
                        </div>
                      </td>
                      <td className="px-3 py-2">{item.brandName}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">
                        ₦{item.price?.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        ₦{(item.price * item.quantity)?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col md:flex-row justify-between text-xs text-gray-500">
          <div>
            Created:{" "}
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
          </div>
          <div>
            Updated:{" "}
            {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : "-"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
