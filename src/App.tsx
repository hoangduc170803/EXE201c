import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import ListingPage from '@/pages/ListingPage';
import ProfilePage from '@/pages/ProfilePage';
import HostPortalPage from '@/pages/HostPortalPage';
import ReservationsPage from '@/pages/ReservationsPage';
import DashboardPage from '@/pages/DashboardPage';
import MessagesPage from '@/pages/MessagesPage';
import CheckoutPage from '@/pages/CheckoutPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/listing/:id" element={<ListingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/host" element={<HostPortalPage />} />
      <Route path="/host/dashboard" element={<DashboardPage />} />
      <Route path="/host/reservations" element={<ReservationsPage />} />
    </Routes>
  );
};

export default App;
