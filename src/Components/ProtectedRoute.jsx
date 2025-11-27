import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Si no hay token → al login
  if (!token) return <Navigate to="/login" />;

  // Si la ruta requiere rol admin → validar
  if (requiredRole && role !== requiredRole)
    return <Navigate to="/login" />;

  return children;
}
