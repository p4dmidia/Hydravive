import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AffiliateLanding from './pages/AffiliateLanding';
import Dashboard from './pages/Dashboard';
import Network from './pages/Network';
import Marketing from './pages/Marketing';
import Financial from './pages/Financial';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import RegisterReferral from './pages/RegisterReferral';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAffiliates from './pages/admin/AdminAffiliates';
import AdminProducts from './pages/admin/AdminProducts';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCategories from './pages/admin/AdminCategories';
import MMNConfig from './pages/admin/MMNConfig';
import AdminGraduations from './pages/admin/AdminGraduations';
import AdminProductPoints from './pages/admin/AdminProductPoints';
import AdminProductMMN from './pages/admin/AdminProductMMN';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';

// Componente de Proteção Admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Validando Acesso...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Componente de Proteção Afiliado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o afiliado está inativo (aguardando aprovação do admin), redireciona
  if (profile && !profile.is_active && profile.role === 'affiliate') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAdmin = location.pathname.startsWith('/admin');
  const isRegister = location.pathname === '/register';

  // Captura de Indicação (Referral Tracking)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('hydravive_ref', ref);
      console.log('Indicação detectada e salva:', ref);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      {(!isDashboard && !isAdmin && !isRegister) && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/affiliate" element={<AffiliateLanding />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/purifiers" element={<Shop />} />
          <Route path="/accessories" element={<Shop />} />
          <Route path="/support" element={<Home />} />
          
          {/* Admin Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/affiliates" element={<AdminRoute><AdminAffiliates /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/withdrawals" element={<AdminRoute><AdminWithdrawals /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/admin/mmn/levels" element={<AdminRoute><MMNConfig /></AdminRoute>} />
          <Route path="/admin/graduations" element={<AdminRoute><AdminGraduations /></AdminRoute>} />
          <Route path="/admin/product-points" element={<AdminRoute><AdminProductPoints /></AdminRoute>} />
          <Route path="/admin/mmn/products" element={<AdminRoute><AdminProductMMN /></AdminRoute>} />

          {/* Affiliate Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/register-referral" element={<ProtectedRoute><RegisterReferral /></ProtectedRoute>} />
          <Route path="/dashboard/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
          <Route path="/dashboard/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
          <Route path="/dashboard/financial" element={<ProtectedRoute><Financial /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </div>
      {(!isDashboard && !isAdmin && !isRegister) && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppContent />
  );
}
