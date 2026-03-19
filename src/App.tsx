/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AffiliateLanding from './pages/AffiliateLanding';
import Dashboard from './pages/Dashboard';
import Network from './pages/Network';
import Marketing from './pages/Marketing';
import Financial from './pages/Financial';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/affiliate" element={<AffiliateLanding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/network" element={<Network />} />
          <Route path="/dashboard/marketing" element={<Marketing />} />
          <Route path="/dashboard/financial" element={<Financial />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/purifiers" element={<Shop />} />
          <Route path="/accessories" element={<Shop />} />
          <Route path="/support" element={<Home />} />
        </Routes>
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}

