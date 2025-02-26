import {
  ModalContent,
  ModalFooter
} from "@/components/ui/animated-modal";
import {cn} from '@/lib/utils.js'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { useState } from "react";
import axios from "axios";
import { Loader2 } from 'lucide-react';

const AddCfID = ({ setAddID, setIsAuth, setHandle, setVerifyString }) => {
  const [cfid, setCfid] = useState("")
  const [isValid, setIsValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async () => {
    setIsSubmitting(true)
    setError("")
    try {
      await axios.get(`https://codeforces.com/api/user.info?handles=${cfid}`)
      
      const res = await axios.post('/api/cf/add-id', {cfid})
      console.log(res.data.data.verifyString)

      setHandle(cfid)
      setVerifyString(res.data.data.verifyString)

      setAddID(false)
      setIsAuth(true)
    } catch(error) {
      setIsValid(false);
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
        <ModalContent className="flex justify-center items-center">
          <LabelInputContainer>
            <Label>Enter your Codeforces ID:</Label>
            <Input 
              placeholder="Eg: TyroWhizz"
              type="text"
              required
              onChange = {(e) => { setCfid(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </LabelInputContainer>

          {!isValid ? (
            <div className="self-start">
              <span className="text-red-500 text-xs">
                Codeforces ID does not exist!
              </span>
            </div>
          ) : (<></>)}

          {!error ? (
            <div className="self-start">
              <span className="text-red-500 text-xs">
                {error}
              </span>
            </div>
          ) : (<></>)}

        </ModalContent>

        <ModalFooter className="gap-4 flex items-center justify-between ">
          <button 
            className="rounded-full p-2 dark:hover:bg-neutral-800"
            onClick={() => { setAddID(false) }}
          >
              &larr; Back
          </button>
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
                <span> Next &rarr; </span>
            )}
          </button>
        </ModalFooter>
      </>
  )
}

export default AddCfID

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
