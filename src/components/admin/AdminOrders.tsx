import React, { useEffect, useState } from "react";
import { Search, Eye, Loader } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import { getAllOrders, getOrderById } from "@/Api/OrderProduct";
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { orders, totalPages: apiTotalPages } = await getAllOrders({ status: statusFilter !== "All" ? statusFilter : undefined, page: currentPage });
      setOrders(orders);
      setTotalPages(apiTotalPages || 1);
      setLoading(false);
      console.log("Orders fetched successfully:", orders);
    } catch (err) {
      setLoading(false);
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [statusFilter, currentPage]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerInfo?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order._id || "").toString().includes(searchTerm);
    return matchesSearch;
  });

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

  const handleViewOrder = async (order: any) => {
    try {
      const { order: fullOrder } = await getOrderById(order._id);
      setSelectedOrder(fullOrder);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  return (
    <div>
      {/* Header + Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Orders
        </h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Items</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Shipping Fee</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Payment</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={8}>
                  <div className="py-4 flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader className="animate-spin w-5 h-5" />
                    <span>Loading Orders...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredOrders.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">{order.customerInfo?.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.items?.length}</td>
                  <td className="px-4 py-3 whitespace-nowrap">₦{order.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">₦{order.shippingFee?.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge className={order.paymentStatus === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}>{order.paymentStatus}</Badge></td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge className={getStatusColor(order.status)}>{order.status}</Badge></td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <span title="View Details"><Eye className="w-4 h-4" /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AdminOrders;
