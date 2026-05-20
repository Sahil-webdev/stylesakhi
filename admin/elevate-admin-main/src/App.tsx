import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth, type PermissionModule } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Orders from "./pages/Orders.tsx";
import Products from "./pages/Products.tsx";
import AddProductGeneration from "./pages/AddProductGeneration.tsx";
import AddProductCategory from "./pages/AddProductCategory.tsx";
import AddProductDetails from "./pages/AddProductDetails.tsx";
import Customers from "./pages/Customers.tsx";
import Analytics from "./pages/Analytics.tsx";
import Payments from "./pages/Payments.tsx";
import Reviews from "./pages/Reviews.tsx";
import Settings from "./pages/Settings.tsx";
import Team from "./pages/Team.tsx";
import Banners from "./pages/Banners.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";

const queryClient = new QueryClient();

const moduleRouteMap: Record<string, PermissionModule> = {
  "/": "dashboard",
  "/orders": "orders",
  "/products": "products",
  "/products/add": "products",
  "/products/add/category": "products",
  "/products/add/details": "products",
  "/customers": "customers",
  "/analytics": "analytics",
  "/payments": "payments",
  "/reviews": "reviews",
  "/team": "team",
  "/settings": "settings",
  "/banners": "settings",
};

const ProtectedRoute = ({
  children,
  module,
  action = "can_view",
}: {
  children: JSX.Element;
  module?: PermissionModule;
  action?: "can_view" | "can_create" | "can_edit" | "can_delete";
}) => {
  const { loading, isAuthenticated, hasModuleAccess } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (module && !hasModuleAccess(module, action)) {
    const fallbackPath =
      Object.entries(moduleRouteMap).find(([, moduleKey]) => hasModuleAccess(moduleKey, "can_view"))?.[0] || "/login";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      }
    />
    <Route
      path="/"
      element={
        <ProtectedRoute module="dashboard">
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/orders"
      element={
        <ProtectedRoute module="orders">
          <Orders />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products"
      element={
        <ProtectedRoute module="products">
          <Products />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products/add"
      element={
        <ProtectedRoute module="products" action="can_create">
          <AddProductGeneration />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products/add/category"
      element={
        <ProtectedRoute module="products" action="can_create">
          <AddProductCategory />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products/add/details"
      element={
        <ProtectedRoute module="products" action="can_create">
          <AddProductDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/customers"
      element={
        <ProtectedRoute module="customers">
          <Customers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedRoute module="analytics">
          <Analytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payments"
      element={
        <ProtectedRoute module="payments">
          <Payments />
        </ProtectedRoute>
      }
    />
    <Route
      path="/reviews"
      element={
        <ProtectedRoute module="reviews">
          <Reviews />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute module="settings">
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/banners"
      element={
        <ProtectedRoute module="settings">
          <Banners />
        </ProtectedRoute>
      }
    />
    <Route
      path="/team"
      element={
        <ProtectedRoute module="team">
          <Team />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
