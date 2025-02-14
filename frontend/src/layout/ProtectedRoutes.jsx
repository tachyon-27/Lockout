import { Navigate, Outlet } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"

const ProtectedRoutes = ({ allowed }) => {
    const { toast } = useToast()

    if (!allowed) {
      return (
        <div className="self-center">
          Access Denied
        </div>
      )
    }

    return <Outlet />;
};

export default ProtectedRoutes;
