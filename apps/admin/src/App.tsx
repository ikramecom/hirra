import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { getApiKey } from '@/lib/api';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!getApiKey()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
