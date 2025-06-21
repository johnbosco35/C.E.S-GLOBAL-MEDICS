
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Save, User, Settings as SettingsIcon, Shield, CreditCard } from 'lucide-react';

const AdminSettings = () => {
  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+234 801 234 5678',
    role: 'Super Admin',
  });

  const [storeInfo, setStoreInfo] = useState({
    storeName: 'Medical Equipment Store',
    storeDescription: 'Your trusted partner for quality medical equipment and laboratory supplies.',
    storeAddress: '123 Medical Plaza, Victoria Island, Lagos, Nigeria',
    storePhone: '+234 800 123 4567',
    storeEmail: 'info@medicalstore.com',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    bankName: 'First Bank Nigeria',
    accountName: 'Medical Equipment Store',
    accountNumber: '1234567890',
    sortCode: '011',
  });

  const [buyersStats, setBuyersStats] = useState({
    totalBuyers: 2345,
    activeBuyers: 1890,
    newBuyersThisMonth: 156,
  });

  useEffect(() => {
    // Load payment info from localStorage
    const savedPaymentInfo = localStorage.getItem('adminPaymentInfo');
    if (savedPaymentInfo) {
      setPaymentInfo(JSON.parse(savedPaymentInfo));
    }
  }, []);

  const handleAdminInfoChange = (field: string, value: string) => {
    setAdminInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleStoreInfoChange = (field: string, value: string) => {
    setStoreInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('adminPaymentInfo', JSON.stringify(paymentInfo));
    console.log('Saving admin settings:', { adminInfo, storeInfo, paymentInfo });
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

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
                onChange={(e) => handleAdminInfoChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminInfo.email}
                onChange={(e) => handleAdminInfoChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="adminPhone">Phone</Label>
              <Input
                id="adminPhone"
                value={adminInfo.phone}
                onChange={(e) => handleAdminInfoChange('phone', e.target.value)}
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
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={storeInfo.storeName}
                onChange={(e) => handleStoreInfoChange('storeName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeInfo.storeEmail}
                onChange={(e) => handleStoreInfoChange('storeEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={storeInfo.storePhone}
                onChange={(e) => handleStoreInfoChange('storePhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="storeDescription">Description</Label>
              <Textarea
                id="storeDescription"
                value={storeInfo.storeDescription}
                onChange={(e) => handleStoreInfoChange('storeDescription', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Address</Label>
              <Textarea
                id="storeAddress"
                value={storeInfo.storeAddress}
                onChange={(e) => handleStoreInfoChange('storeAddress', e.target.value)}
                rows={2}
              />
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
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={paymentInfo.bankName}
                onChange={(e) => handlePaymentInfoChange('bankName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={paymentInfo.accountName}
                onChange={(e) => handlePaymentInfoChange('accountName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={paymentInfo.accountNumber}
                onChange={(e) => handlePaymentInfoChange('accountNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sortCode">Sort Code</Label>
              <Input
                id="sortCode"
                value={paymentInfo.sortCode}
                onChange={(e) => handlePaymentInfoChange('sortCode', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buyers Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Buyers Overview
            </CardTitle>
            <CardDescription>
              Summary of buyer statistics and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {buyersStats.totalBuyers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Buyers</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {buyersStats.activeBuyers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Buyers</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {buyersStats.newBuyersThisMonth.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">New This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
