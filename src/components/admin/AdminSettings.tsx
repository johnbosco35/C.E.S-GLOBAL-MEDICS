import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save, User, Settings as SettingsIcon, CreditCard } from "lucide-react";
import {
  getAdminSetting,
  updateBankDetails,
  updateStoreDetails,
} from "@/Api/AdminSetting";
import { getAdminInfo, updateAdminEmail } from "@/Api/AdminAuth";
import { Eye, EyeOff, Pencil } from "lucide-react";

const AdminSettings = () => {
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Super Admin",
  });
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); // For confirming identity
  const [isLoading, setIsLoading] = useState(false);

  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    storeDescription: "",
    storeAddress: "",
    storePhone: "",
    storeEmail: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
  });

  const [isPaymentEditable, setIsPaymentEditable] = useState(false);
  const [isStoreEditable, setIsStoreEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, adminRes] = await Promise.all([
          getAdminSetting(),
          getAdminInfo(),
        ]);

        const data = settingsRes?.data || settingsRes.settings;
        const admin = adminRes?.user;

        if (data?.storeInfo) {
          setStoreInfo({
            storeName: data.storeInfo.name || "",
            storeEmail: data.storeInfo.email || "",
            storePhone: data.storeInfo.phone || "",
            storeAddress: data.storeInfo.address || "",
            storeDescription: data.storeInfo.description || "",
          });
        }

        if (data?.bankInfo) {
          setPaymentInfo({
            bankName: data.bankInfo.bankName || "",
            accountNumber: data.bankInfo.accountNumber || "",
            accountName: data.bankInfo.accountName || "",
            sortCode: "",
          });
        }

        if (admin) {
          setAdminInfo({
            name: admin.name || "", // not provided in API
            email: admin.email || "",
            phone: admin.phoneNumber || "",
            role: "Super Admin",
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin or settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleAdminInfoChange = (field: string, value: string) => {
    setAdminInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleStoreInfoChange = (field: string, value: string) => {
    setStoreInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
      localStorage.setItem("storeInfo", JSON.stringify(storeInfo));
      localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

      if (isEmailEditable) {
        if (!currentPassword) {
          alert("Please enter your current password to update email.");
          return;
        }
      }

      // Update Email
      if (isEmailEditable && currentPassword) {
        await updateAdminEmail({
          email: adminInfo.email,
          password: currentPassword,
        });
        setIsEmailEditable(false);
        setCurrentPassword("");
      }

      // Update store details
      if (isStoreEditable) {
        await updateStoreDetails(storeInfo);
        setIsStoreEditable(false);
      }

      // Update payment details
      if (isPaymentEditable) {
        await updateBankDetails(paymentInfo);
        setIsPaymentEditable(false);
      }

      alert("Settings saved successfully!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Update failed:", error.response?.data || error.message);
      alert(
        `Failed to save settings: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Admin Information
            </CardTitle>
            <CardDescription>
              Update your personal admin account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminName">Full Name</Label>
              <Input
                id="adminName"
                value={adminInfo.name}
                disabled={true} // Admin name is not editable
                onChange={(e) => handleAdminInfoChange("name", e.target.value)}
              />
            </div>
            <div className="relative">
              <Label
                htmlFor="adminEmail"
                className="flex justify-between items-center"
              >
                Email
                <button
                  type="button"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={() => setIsEmailEditable(!isEmailEditable)}
                >
                  <Pencil className="w-4 h-4 mb-2" />
                </button>
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminInfo.email}
                disabled={!isEmailEditable}
                onChange={(e) => handleAdminInfoChange("email", e.target.value)}
              />
            </div>

            {isEmailEditable && (
              <div className="relative mt-4">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            <div>
              <Label htmlFor="adminPhone">Phone Number</Label>
              <Input
                id="adminPhone"
                type="tel"
                value={adminInfo.phone}
                disabled={true} // Phone number is not editable
                onChange={(e) => handleAdminInfoChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="adminRole">Role</Label>
              <Input
                id="adminRole"
                value={adminInfo.role}
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Store Information
            </CardTitle>
            <CardDescription>
              Manage your store details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["storeName", "Store Name"],
              ["storeEmail", "Store Email"],
              ["storePhone", "Store Phone"],
            ].map(([field, label]) => (
              <div key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  value={storeInfo[field as keyof typeof storeInfo]}
                  disabled={!isStoreEditable}
                  onChange={(e) => handleStoreInfoChange(field, e.target.value)}
                />
              </div>
            ))}
            <div>
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea
                id="storeDescription"
                rows={2}
                value={storeInfo.storeDescription}
                onChange={(e) =>
                  handleStoreInfoChange("storeDescription", e.target.value)
                }
                disabled={!isStoreEditable}
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea
                id="storeAddress"
                rows={2}
                value={storeInfo.storeAddress}
                onChange={(e) =>
                  handleStoreInfoChange("storeAddress", e.target.value)
                }
                disabled={!isStoreEditable}
              />
            </div>
            <div className="flex justify-end pr-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStoreEditable(!isStoreEditable)}
              >
                Edit Store Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Bank details for customer payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["bankName", "Bank Name"],
              ["accountName", "Account Name"],
              ["accountNumber", "Account Number"],
              ["sortCode", "Sort Code"],
            ].map(([field, label]) => (
              <div key={field}>
                <Label htmlFor={field}>{label}</Label>
                <Input
                  id={field}
                  value={paymentInfo[field as keyof typeof paymentInfo]}
                  onChange={(e) =>
                    handlePaymentInfoChange(field, e.target.value)
                  }
                  disabled={!isPaymentEditable}
                />
              </div>
            ))}
            <div className="flex justify-end pr-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaymentEditable(!isPaymentEditable)}
              >
                Edit Payment Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <span>
              <Save className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
