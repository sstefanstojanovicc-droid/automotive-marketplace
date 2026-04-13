import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SessionProvider } from './context/Session'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ServicePage } from './pages/ServicePage'
import { SellerDashboard } from './pages/SellerDashboard'
import { SellerRequestDetailPage } from './pages/SellerRequestDetailPage'
import { AdminPage } from './pages/AdminPage'
import { BuyerDashboard } from './pages/BuyerDashboard'
import { NewRequestPage } from './pages/NewRequestPage'
import { BuyerRequestDetailPage } from './pages/BuyerRequestDetailPage'

function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="s/:id" element={<ServicePage />} />
            <Route path="buyer" element={<BuyerDashboard />} />
            <Route path="buyer/requests/new" element={<NewRequestPage />} />
            <Route path="buyer/requests/:id" element={<BuyerRequestDetailPage />} />
            <Route path="seller" element={<SellerDashboard />} />
            <Route path="seller/requests/:id" element={<SellerRequestDetailPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}

export default App
