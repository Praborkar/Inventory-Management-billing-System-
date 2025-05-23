
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import context providers
import { AuthProvider } from "@/contexts/AuthContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { InvoiceProvider } from "@/contexts/InvoiceContext";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import ProductAdd from "./pages/ProductAdd";
import ProductView from "./pages/ProductView";
import ProductEdit from "./pages/ProductEdit";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";
import InvoiceView from "./pages/InvoiceView";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <InventoryProvider>
          <InvoiceProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Main Application Routes */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/add" element={<ProductAdd />} />
                <Route path="/inventory/:id" element={<ProductView />} />
                <Route path="/inventory/:id/edit" element={<ProductEdit />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/create-invoice" element={<CreateInvoice />} />
                <Route path="/invoices/:id" element={<InvoiceView />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Catch-all and redirect routes */}
                <Route path="/index" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </InvoiceProvider>
        </InventoryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
