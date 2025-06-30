import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingBag,
  CreditCard,
  Plus,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import AdminAuthCheck from "../components/AdminAuthCheck";
import AdminBuyers from "../components/admin/AdminBuyers";
import AdminProducts from "../components/admin/AdminProducts";
import AdminOrders from "../components/admin/AdminOrders";
import AdminPayments from "../components/admin/AdminPayments";
import AdminNewProduct from "../components/admin/AdminNewProduct";
import AdminSettings from "../components/admin/AdminSettings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAdminInfo } from "@/Api/AdminAuth";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/adminSlices";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchAdmin = async () => {
  //     try {
  //       const res = await getAdminInfo();
  //       if (!res || !res.user) {
  //         throw new Error("No user found");
  //       }

  //       setAdminInfo(res.user); // optionally include `name`, `email`, etc.
  //     } catch (err) {
  //       console.error("Admin not authenticated:", err);
  //       navigate("/admin/login");
  //     }
  //   };

  //   fetchAdmin();
  // }, []);

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      setAdminInfo(JSON.parse(adminSession));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    dispatch(logout());
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Buyers", href: "/admin/buyers", icon: Users },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "New Product", href: "/admin/new-product", icon: Plus },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const stats = [
    {
      name: "Total Buyers",
      value: "2,345",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Products",
      value: "156",
      change: "+3%",
      changeType: "positive",
    },
    {
      name: "Total Orders",
      value: "1,234",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Revenue",
      value: "₦45,678,000",
      change: "+15%",
      changeType: "positive",
    },
  ];

  return (
    <AdminAuthCheck>
      <div
        className={`min-h-screen ${
          theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Admin Panel
              </h1>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout? You will be redirected to
                      the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r dark:border-gray-700">
            <div className="flex h-16 items-center px-4">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Admin Panel
              </h1>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout? You will be redirected to
                      the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Yes
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="flex h-16 items-center justify-between bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-500" />
            </button>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {adminInfo?.name || "Admin"}
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Dashboard Overview
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((stat) => (
                        <div
                          key={stat.name}
                          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                        >
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {stat.name}
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                          <div className="text-sm text-green-600">
                            {stat.change}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                }
              />
              <Route path="/buyers" element={<AdminBuyers />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/new-product" element={<AdminNewProduct />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/payments" element={<AdminPayments />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </main>
        </div>
      </div>
    </AdminAuthCheck>
  );
};

export default AdminDashboard;
