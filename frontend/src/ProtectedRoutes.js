// ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const AccessToken = localStorage.getItem("AccessToken");
  const isMfaVerified = localStorage.getItem("mfaVerified");
  let bool;
  if (AccessToken && isMfaVerified === "true") {
    bool = true;
  } else {
    bool = false;
  }
  return bool ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
