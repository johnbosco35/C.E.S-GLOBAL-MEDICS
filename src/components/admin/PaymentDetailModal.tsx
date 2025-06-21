
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, FileText } from 'lucide-react';

interface Payment {
  id: number;
  orderId: number;
  customer: string;
  amount: number;
  status: string;
  method: string;
  date: string;
  proofOfPayment?: string;
}

interface PaymentDetailModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (paymentId: number) => void;
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  payment,
  isOpen,
  onClose,
  onConfirmPayment,
}) => {
  console.log('PaymentDetailModal render:', { payment, isOpen });

  if (!payment) {
    console.log('No payment data, not rendering modal');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const handleConfirmPayment = () => {
    console.log('Confirming payment in modal:', payment.id);
    onConfirmPayment(payment.id);
    onClose();
  };

  const handleClose = () => {
    console.log('Closing modal');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Details - #{payment.id}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Payment ID</h3>
              <p className="text-lg font-mono">#{payment.id}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Order ID</h3>
              <p className="text-lg font-mono">#{payment.orderId}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Status</h3>
              <Badge className={getStatusColor(payment.status)}>
                {payment.status}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Amount</h3>
              <p className="text-lg font-semibold">₦{payment.amount.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Name</p>
                <p className="font-medium">{payment.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                <p className="font-medium">{payment.date}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Method</h3>
            <p className="font-medium">{payment.method}</p>
          </div>

          <Separator />

          {/* Proof of Payment */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Proof of Payment</h3>
            {payment.proofOfPayment ? (
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{payment.proofOfPayment}</span>
              </div>
            ) : (
              <p className="text-gray-500 italic">No proof of payment uploaded</p>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            {payment.status === 'Pending' && (
              <Button 
                onClick={handleConfirmPayment} 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Payment
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailModal;
