import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { approvePayment, rejectPayment } from "@/Api/Payment";

interface PaymentDetailModalProps {
  payment: any;
  isOpen: boolean;
  onClose: () => void;
  reloadPayments: () => Promise<void>;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "submitted":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  }
};

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  isOpen,
  onClose,
  reloadPayments,
}) => {
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  if (!payment) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approvePayment(payment._id);
      await reloadPayments();
      onClose();
    } catch (err) {
      // handle error (toast, etc)
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setLoading(true);
    try {
      await rejectPayment(payment._id, rejectReason);
      await reloadPayments();
      onClose();
    } catch (err) {
      // handle error (toast, etc)
    } finally {
      setLoading(false);
    }
  };

  const customer = payment.customerId || {};
  const items = payment.items || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <DialogTitle>Payment Request Details</DialogTitle>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Payment Info */}
          <div className="space-y-2 text-sm">
            <div>
              Session Number:{" "}
              <span className="font-mono">{payment.sessionNumber}</span>
            </div>
            <div>
              Payment ID: <span className="font-mono">{payment._id}</span>
            </div>
            <div>
              Status:{" "}
              <Badge className={getStatusColor(payment.paymentStatus)}>
                {payment.paymentStatus}
              </Badge>
            </div>
            <div>
              Created:{" "}
              {payment.createdAt
                ? new Date(payment.createdAt).toLocaleString()
                : "-"}
            </div>
            <div>
              Updated:{" "}
              {payment.updatedAt
                ? new Date(payment.updatedAt).toLocaleString()
                : "-"}
            </div>
            <div>
              Total:{" "}
              <span className="font-semibold">
                ₦{payment.totalAmount?.toLocaleString()}
              </span>
            </div>
            {/* <div>Shipping Fee: <span className="font-semibold">₦{payment.shippingFee?.toLocaleString()}</span></div> */}
            <div>
              Notes:{" "}
              {payment.notes || (
                <span className="italic text-gray-400">None</span>
              )}
            </div>
          </div>
          {/* Customer Info */}
          <div className="space-y-2 text-sm">
            <div>Name: {customer.fullName}</div>
            <div>Email: {customer.email}</div>
            <div>Phone: {customer.phone}</div>
          </div>
        </div>
        <Separator className="my-4" />
        {/* Items Table */}
        <div>
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
        <Separator className="my-4" />
        {/* Payment Proof */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Proof of Payment
          </h3>
          {payment.paymentProof ? (
            <a
              href={payment.paymentProof}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={payment.paymentProof}
                alt="Payment Proof"
                className="w-48 h-48 object-contain border rounded-lg"
              />
            </a>
          ) : (
            <span className="italic text-gray-400">No proof uploaded</span>
          )}
        </div>
        {/* Approve/Reject Actions */}
        {payment.paymentStatus === "submitted" && (
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? "Approving..." : "Approve Payment"}
            </Button>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Rejection reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              />
              <Button
                onClick={handleReject}
                disabled={loading || !rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? "Rejecting..." : "Reject Payment"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailModal;
