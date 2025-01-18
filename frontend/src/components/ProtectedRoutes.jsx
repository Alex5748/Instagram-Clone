import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.auth?.user); // Ensure you're selecting the correct user object
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true }); // Use replace to avoid adding to history stack
    }
  }, [user, navigate]);

  if (!user) return null; // Prevent rendering protected content while redirecting

  return <>{children}</>;
};

export default ProtectedRoute;
