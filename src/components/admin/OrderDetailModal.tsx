
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface OrderDetailModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'completed':
    case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'cancelled': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
    case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
};

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const items = order.items || [];
  const delivery = order.deliveryDetails || {};
  const customer = order.customerInfo || {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <DialogTitle>Order Details</DialogTitle>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Order & Customer Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Info</h3>
              <div className="space-y-1 text-sm">
                <div>Order ID: <span className="font-mono">#{order._id}</span></div>
                <div>Status: <Badge className={getStatusColor(order.status)}>{order.status}</Badge></div>
                <div>Payment: <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge></div>
                <div>Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
                <div>Total: <span className="font-semibold">₦{order.totalAmount?.toLocaleString()}</span></div>
                <div>Shipping Fee: <span className="font-semibold">₦{order.shippingFee?.toLocaleString()}</span></div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h3>
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery</h3>
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
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Items</h3>
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
                        {item.product?.productName || '-'}
                        <div className="text-xs text-gray-500">{item.product?.category}</div>
                      </td>
                      <td className="px-3 py-2">{item.brandName}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">₦{item.price?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right font-semibold">₦{(item.price * item.quantity)?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col md:flex-row justify-between text-xs text-gray-500">
          <div>Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}</div>
          <div>Updated: {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : '-'}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
