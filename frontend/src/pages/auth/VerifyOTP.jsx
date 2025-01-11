import { BackgroundLines } from '../components/ui/background-lines';
import { useDispatch, useSelector } from 'react-redux'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from 'react';
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { reset } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

function Verify() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState("")
  const info = useSelector(state => state.auth)
  const { toast } = useToast()

  const verify = () => {
    if(info.verifyOTP) {
     const res = axios.post('/api/auth/verify-email', {_id: info._id, otp})
     
     toast({
        title: res.data.success ? "SUCCESS" : "FAILURE",
        description: res.data.message
     })

     if(res.data.success) {
        dispatch(reset())
        navigate('/login')
     }
    }
  }

  const resend = () => {

  }

  return (
    < BackgroundLines className="relative flex justify-center items-center">
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
            <form className="flex flex-col gap-4 max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-700 w-full sm:w-auto">
                <p className="text-2xl font-semibold tracking-wide flex items-center relative">
                    <span className="absolute w-4 h-4 rounded-full bg-blue-400 left-0 animate-ping"></span>
                    <span className="absolute w-4 h-4 rounded-full bg-blue-500 left-0"></span>
                    <span className="pl-6">Enter OTP</span>
                </p>
                <p className="text-sm text-gray-400">
                    Check your email, we just sent the OTP on your email.
                </p>

                <div className='min-w-full flex justify-center items-center'>
                <InputOTP 
                    maxLength={6} 
                    value = {otp}
                    onChange = {value => setOtp(value)}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                </div>

                <button onClick={verify} className="py-2 px-4 mt-4 bg-blue-500 rounded-lg text-white font-medium hover:bg-blue-400 transition" disabled={otp.length() == 6}>
                    Verify
                </button>

                <p className="text-center text-sm text-gray-400">
                    Didn't received the OTP?{" "}
                    <button onClick={resend} className="text-blue-400 hover:underline">
                        Resend OTP
                    </button>
                </p>
            </form>
        </div>
    </BackgroundLines>
  );
}

export default Verify