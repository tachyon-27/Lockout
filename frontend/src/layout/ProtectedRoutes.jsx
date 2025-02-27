import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FaLock } from "react-icons/fa"; // Using a lock icon

const ProtectedRoutes = ({ allowed }) => {
  const { toast } = useToast();

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
