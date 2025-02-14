import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"

const ProtectedRoutes = ({ allowed }) => {
    const { toast } = useToast()

    if (!allowed) {
      toast({
        title: "You are not allowed to access this route."
      })
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
