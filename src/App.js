import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import BranchSelection from "./pages/BranchSelection";
import Dashboard from "./pages/Dashboard";
import StockMovements from "./pages/StockMovements";
// import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Createproduct from "./pages/Products/Createproduct";
import Listproduct from "./pages/Products/Listproduct";
import Deatilprodct from "./pages/Products/Deatilprodct";
import ListSupplier from "./pages/Supplier/Listsupplier";
import CreateSupplier from "./pages/Supplier/Createsupplier";
import Detailsupplier from "./pages/Supplier/Detailsupplier";
import ListPurchaseOrders from "./pages/PurchaseOrder/ListPurchaseOrders";
import CreatePurchaseOrder from "./pages/PurchaseOrder/CreatePurchaseOrder";
import PurchaseOrderDetails from "./pages/PurchaseOrder/PurchaseOrderDetails";
import ReceivePurchaseOrder from "./pages/PurchaseOrder/ReceivePurchaseOrder";
import ReceivingHistory from "./pages/PurchaseOrder/ReceivingHistory";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/select-branch"
        element={
          <PrivateRoute>
            <BranchSelection />
          </PrivateRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* <Route
        path="/purchase-orders"
        element={
          <PrivateRoute>
            <PurchaseOrders />
          </PrivateRoute>
        }
      /> */}
      {/* Suppliers */}
      <Route path="/suppliers" element={<ListSupplier />} />

      <Route path="/suppliers/create" element={<CreateSupplier />} />

      <Route path="/suppliers/:id" element={<Detailsupplier />} />

      <Route path="/suppliers/:id/edit" element={<CreateSupplier />} />

      {/* Purchase Orders */}
      <Route path="/purchase-orders" element={<ListPurchaseOrders />} />

      <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />

      <Route path="/purchase-orders/:id" element={<PurchaseOrderDetails />} />

      <Route
        path="/purchase-orders/:id/receive"
        element={<ReceivePurchaseOrder />}
      />

      <Route
        path="/purchase-orders/:id/receiving-history"
        element={<ReceivingHistory />}
      />
      <Route
        path="/stock-movements"
        element={
          <PrivateRoute>
            <StockMovements />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/suppliers"
        element={
          <PrivateRoute>
            <Suppliers />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <Listproduct />
          </PrivateRoute>
        }
      />

      <Route
        path="/products/create"
        element={
          <PrivateRoute>
            <Createproduct />
          </PrivateRoute>
        }
      />

      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <Deatilprodct />
          </PrivateRoute>
        }
      />

      <Route
        path="/products/:id/edit"
        element={
          <PrivateRoute>
            <Createproduct />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
