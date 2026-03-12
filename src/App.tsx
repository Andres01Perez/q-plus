import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PropertyList from "./pages/admin/properties/PropertyList";
import PropertyCreate from "./pages/admin/properties/PropertyCreate";
import PropertyEdit from "./pages/admin/properties/PropertyEdit";
import BlocksConfig from "./pages/admin/configuracion/BlocksConfig";
import Inversiones from "./pages/Inversiones";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/propiedades" element={<Properties />} />
            <Route path="/propiedad/:slug" element={<PropertyDetail />} />
            <Route path="/inversiones" element={<Inversiones />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="propiedades" element={<PropertyList />} />
              <Route path="propiedades/nueva" element={<PropertyCreate />} />
              <Route path="propiedades/:id" element={<PropertyEdit />} />
              <Route path="configuracion/bloques" element={<BlocksConfig />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
