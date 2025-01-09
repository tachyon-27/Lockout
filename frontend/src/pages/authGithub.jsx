import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const authGithub = () => {
  const [searchParams] = useSearchParams();
  const githubCode = searchParams.get("code"); 
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (githubCode) {
      const authenticate = async () => {
        try {
          setLoading(true); 

          const response = await fetch(`${import.meta.env.VITE_BACKEND_URI}/api/auth/github`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: githubCode }),
          });

          if (response.ok) {
            console.log("Authentication successful, redirected.");
          } else {
            console.error("Authentication failed.");
            setIsError(true);
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          setIsError(true);
        } finally {
          setLoading(false);
        }
      };

      authenticate();
    } else {
      console.warn("No code found in the URL!");
      setIsError(true);
    }
  }, [githubCode]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Authentication failed!</p>
      ) : (
        <p>Authentication successful!</p>
      )}
    </div>
  );
};

export default authGithub;
