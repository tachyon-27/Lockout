import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RingLoader } from "react-spinners"; 


const AuthGithub = () => {
  const [searchParams] = useSearchParams();
  const githubCode = searchParams.get("code"); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast()

  useEffect(() => {
    if (githubCode) {
      const authenticate = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/github`, {
            method: "POST",
            credentials:'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: githubCode }),
          });
          if (response.ok) {
            toast({
              title: 'Successfully Logged In'
            })
            navigate('/');
          } else {
            const { message } = await response.json()
            toast({
              title: 'Error Logging in!',
              description: message,
            })
            navigate('/login');
          }
        } catch (error) {
          toast({
            title: 'Error during Authorization!'
          })
          navigate('/login');
        } finally {
          setLoading(true);
        }
      };

      authenticate();

    } else {
      console.warn("No code found in the URL!");
      toast({
        title: 'Error getting GithubCode!'
      })
      navigate('/login');
    }
  }, [githubCode, toast, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <RingLoader size={100} color="#36D7B7" />
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default AuthGithub;
