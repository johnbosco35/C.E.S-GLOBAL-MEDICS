
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
  items: number;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // Mock order items with images for demonstration
  const orderItems = order.orderItems || [
    { 
      name: 'Digital Stethoscope Pro', 
      quantity: 1, 
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
    },
    { 
      name: 'Blood Glucose Test Kit', 
      quantity: 2, 
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order & Customer Info */}
          <div className="space-y-4">
            {/* Order Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                  <p className="font-mono">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p>{order.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-lg font-semibold">₦{order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p>{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p>{order.customerEmail || 'john.doe@email.com'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p>{order.customerPhone || '+234 801 234 5678'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Order Items with Images */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Shipping & Payment */}
          <div className="space-y-4">
            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
              <p className="text-sm">{order.shippingAddress || '123 Lagos Street, Victoria Island, Lagos State, Nigeria'}</p>
            </div>

            <Separator />

            {/* Payment Info */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Method</p>
                  <p>{order.paymentMethod || 'Bank Transfer'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="font-semibold">₦{order.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
