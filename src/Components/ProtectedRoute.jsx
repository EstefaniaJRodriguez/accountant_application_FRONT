// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

// Función para validar token y expiración
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // JWT = header.payload.signature
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    // Verificar expiración
    if (decoded.exp * 1000 < Date.now()) {
      console.warn("⛔ Token expirado");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al verificar token:", error);
    return false;
  }
};

export default function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
