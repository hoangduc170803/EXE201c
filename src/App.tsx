import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import LongTermListingsPage from '@/pages/LongTermListingsPage';
import ShortTermListingsPage from '@/pages/ShortTermListingsPage';
import AuthPage from '@/pages/AuthPage';
import ListingPage from '@/pages/ListingPage';
import ProfilePage from '@/pages/ProfilePage';
import HostPortalPage from '@/pages/HostPortalPage';
import ReservationsPage from '@/pages/ReservationsPage';
import DashboardPage from '@/pages/DashboardPage';
import MessagesPage from '@/pages/MessagesPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AddPropertyPage from '@/pages/AddPropertyPage';
import WalletPage from '@/pages/WalletPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminPaymentSettingsPage from '@/pages/AdminPaymentSettingsPage';
import AdminCommissionSettingsPage from '@/pages/AdminCommissionSettingsPage';
import AdminSettlementsQueuePage from '@/pages/AdminSettlementsQueuePage';
import HostEarningsPage from '@/pages/HostEarningsPage';
import AdminBankStatementsPage from '@/pages/AdminBankStatementsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="long-term-listings" element={<LongTermListingsPage />} />
        <Route path="short-term-listings" element={<ShortTermListingsPage />} />
          <Route path="/listing/:id" element={<ListingPage />} />
      </Route>

      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/host" element={<HostPortalPage />} />
      <Route path="/host/add-property" element={<AddPropertyPage />} />
      <Route path="/host/dashboard" element={<DashboardPage />} />
      <Route path="/host/reservations" element={<ReservationsPage />} />
      <Route path="/host/finance" element={<HostEarningsPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/payment-settings" element={<AdminPaymentSettingsPage />} />
      <Route path="/admin/commission-settings" element={<AdminCommissionSettingsPage />} />
      <Route path="/admin/settlements" element={<AdminSettlementsQueuePage />} />
      <Route path="/admin/bank-statements" element={<AdminBankStatementsPage />} />
     </Routes>
   );
 };

export default App;
