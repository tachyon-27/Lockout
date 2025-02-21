import {  ModalContent, ModalFooter } from "@/components/ui/animated-modal";
import { useModal } from '@/components/ui/animated-modal'
import { FaCode } from "react-icons/fa";
import './TournamentRegister.css';
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
const TournamentRegister = ({ setAddID, tournamentId, setIsRegistered }) => {
  const [cfids, setCfids] = useState([])

  const {setOpen} = useModal();

  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false);

  useEffect( () => {
    const getCFIDs = async () => {
      const res = await axios.get('/api/user/get-cfids')

      setCfids(res.data.data.cfids)
    }
    getCFIDs()
  }, [])

  const registerTournament = async (cfid) => {
    try {
      setIsLoading(true);
      const res = await axios.post('/api/tournament/tournament-register', {
        _id: tournamentId,
        cfid,
      })
      console.log(res.data)
      if(res.data.success) {
          setOpen(false);
          toast({
            title: "User successfully registerd!",
          })
          setIsRegistered(true)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Registring!",
        description: error,
      })
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <>
      <ModalContent>
        {isLoading ? <ClipLoader color="#FFFFFF" className="m-auto" /> : (
          <>
            <p className="text-sm md:text-sm text-neutral-600 dark:text-neutral-100 font-bold text-left mb-8">
              Please add the Codeforces ID!
            </p>
            <div className="grid grid-cols-1 gap-y-2 max-h-40 overflow-y-auto px-2 scrollbar-beautiful">
              {cfids.map(
                (cf, idx) =>
                  cf.isVerified && (
                    <div key={idx} >
                      <div className="dark:hover:bg-neutral-800 px-2 py-2 rounded-lg" onClick={() => registerTournament(cf.cfid)}>
                        {cf.cfid}
                      </div>
                      <div className="w-full h-[1px] bg-gray-200/[0.3]"></div>
                    </div>
                  )
                )}
            </div>
          </>
        )}
      </ModalContent>

      <button
        onClick={() => setAddID(true)}
      >
        <ModalFooter className="gap-4 flex items-center justify-center dark:hover:bg-neutral-800">
          <div className="w-full h-full cursor-pointer flex items-center justify-center">
            <FaCode />
            <span>Add New Codeforces ID</span>
          </div>
        </ModalFooter>
      </button>
    </>
  );
};

export default TournamentRegister;
