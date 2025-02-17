import { TournamentRegister } from "@/components";
import { AddCfID } from "@/components";
import {
    ModalBody,
    Modal,
    ModalTrigger,
} from '@/components/ui/animated-modal';
import { useState } from "react";
import { FaLaptopCode } from "react-icons/fa";
import VerifyCfID from "./VerifyCFID";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RegistrButton = ({ tournamentId }) => {
    const [addID, setAddID] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [handle, setHandle] = useState("")
    const [verifyString, setVerifyString] = useState("")
    const isLoggedIn = useSelector(state => state.user.isAuthenticated)
    const navigate = useNavigate()

    const handleClick = () => {
      if(isLoggedIn) {
        setAddID(false)
        setIsAuth(false)
      }
      else {
        navigate('/login')
      }
    }

    return (
    <Modal>
      <div 
        className="p-0" 
        onClick={handleClick}
      >
          <ModalTrigger className="bg-black text-white flex justify-center group/modal-btn border border-solid border-white">
            <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500" >
              Register
            </span>
            <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
              <FaLaptopCode className="text-white" />
            </div>
          </ModalTrigger>
      </div>
          <ModalBody>
            {(addID) ? <AddCfID setAddID={setAddID} setIsAuth={setIsAuth} setHandle={setHandle} setVerifyString={setVerifyString} /> : isAuth ? <VerifyCfID handle={handle} verifyString={verifyString} setIsAuth={setIsAuth}/> : <TournamentRegister setAddID={setAddID} tournamentId={tournamentId}/>}
          </ModalBody>
        </Modal>
  )
}

export default RegistrButton