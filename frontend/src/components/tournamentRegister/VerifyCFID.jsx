import {
    ModalContent,
    ModalFooter
  } from "@/components/ui/animated-modal";
  import { useState } from "react";
  import axios from "axios";
  import { Loader2 } from 'lucide-react';
  import { FaRegCopy } from "react-icons/fa";
  import { FaCheck } from "react-icons/fa";
  
  const VerifyCfID = ({ setIsAuth, handle, verifyString }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [isCopied, setIsCopied] = useState(false);

    const copyText = () => {
      navigator.clipboard.writeText(verifyString)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1000);
        })
        .catch((error) => {
          setError(error.response.data.message || error.message)
        });
    };
  
    const onSubmit = async () => {
      setIsSubmitting(true)
      setError("")
      try {
        const res = await axios.post('/api/cf/verify-id', {cfid: handle})

        if(!res.data.success) {
          console.log(res.data.message)
          setError(res.data.message)
          return;
        }
        setIsAuth(false)
      } catch(err) {
        console.log(error)
        setError(err.response.data.message || err.message || err)
      } finally {
        setIsSubmitting(false)
      }
    }
  
    return (
      <>
          <ModalContent className="flex justify-center items-center">
            <ul className="flex flex-col w-full list-disc space-y-2">
              <li>Copy the below String</li>
              <div className="w-full flex justify-between bg-neutral-900 p-1 rounded-md">
              <input 
                type="text"
                value={verifyString} 
                className="hover:bg-neutral-950 bg-neutral-900"
                readOnly
              />
              <button
                onClick={copyText}
                className="flex items-center justify-center p-1"
              >
                {isCopied ? (
                  <FaCheck />
              ):(
                  <FaRegCopy />
                )}
              </button>
            </div>
            <li>Add the above String as your first name in Codeforces and Save</li>
              <span> Go to <a href="https://codeforces.com/settings/social" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Codeforces</a> </span>
              <li>Now verify your codeforces handle</li>
              </ul>
            
  
            {error ? (
              <div className="self-start">
                <span className="text-red-500 text-xs">
                  {error}
                </span>
              </div>
            ) : (<></>)}
  
          </ModalContent>
  
          <ModalFooter className="gap-4 flex items-center justify-center ">
            <button 
              className="dark:hover:bg-neutral-800 rounded-full p-2"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                  <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                  </div>
              ) : (
                  <span> Submit </span>
              )}
            </button>
          </ModalFooter>
        </>
    )
  }
  
  export default VerifyCfID