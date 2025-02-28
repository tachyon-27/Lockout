import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess } from "../../features/userSlice";
import { Loader } from "@/components";
import axios from "axios";

const AuthGithub = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const githubCode = searchParams.get("code"); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (githubCode) {
      const authenticate = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URI}/api/user/github`,
            { code: githubCode },
            { withCredentials: true }
          );
          
          toast({ title: 'Successfully Logged In' });
          dispatch(loginSuccess({ token: response.data.data._id, role: "verifiedUser" }));
          navigate('/tournaments');
        } catch (error) {
          toast({
            title: 'Error Logging in!',
            description: error.response?.data?.message || 'Something went wrong!',
          });
          navigate('/login');
        } finally {
          setLoading(true);
        }
      };

      authenticate();
    } else {
      toast({ title: 'Error getting GithubCode!' });
      navigate('/login');
    }
  }, [githubCode, toast, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? <Loader /> : <p>Redirecting...</p>}
    </div>
  );
};

export default AuthGithub;