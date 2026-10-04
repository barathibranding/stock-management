import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, requireBranch = true }) {
  const { user, loading, selectedBranch } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireBranch && !selectedBranch) {
    return <Navigate to="/select-branch" replace />;
  }

  // If user has a branch (staff), and we're on select-branch, redirect to dashboard
  if (!requireBranch && !user.requires_branch_selection && user.branch) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
