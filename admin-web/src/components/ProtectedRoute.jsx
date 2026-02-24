import { Navigate } from "react-router-dom";
import authService from "../services/auth.service";

const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;