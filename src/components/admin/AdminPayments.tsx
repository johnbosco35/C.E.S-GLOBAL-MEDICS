import React, { useEffect, useState } from "react";
import { getAllPaymentRequests } from "@/Api/Payment";
import { Eye, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import PaymentDetailModal from "./PaymentDetailModal";

const AdminPayment = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const { sessions, totalPages: apiTotalPages } =
        await getAllPaymentRequests({
          status: statusFilter !== "All" ? statusFilter : undefined,
          page: currentPage,
        });
      setPayments(sessions);
      setTotalPages(apiTotalPages || 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setPayments([]);
    }
  };

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line
  }, [statusFilter, currentPage]);

  const filteredPayments = payments.filter((payment) => {
    const customer = payment.customerId?.fullName || "";
    const matchesSearch =
      customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment._id || "").toString().includes(searchTerm);
    return matchesSearch;
  });

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Requests
        </h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by customer or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="py-4 flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader className="animate-spin w-5 h-5" />
                    <span>Loading Payments...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredPayments.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No payment requests found
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSelectedPayment(payment);
                    setIsModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {payment.customerId?.fullName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    ₦{payment.totalAmount?.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge className={getStatusColor(payment.paymentStatus)}>
                      {payment.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                    <span title="View Details">
                      <Eye className="w-4 h-4" />
                    </span>
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
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
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
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reloadPayments={loadPayments}
      />
    </div>
  );
};

export default AdminPayment;
