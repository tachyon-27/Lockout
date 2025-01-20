import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RingLoader } from "react-spinners";

const Logout = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const res = await axios.get('/api/user/logout');
    
                toast({
                    title: res.data.message,
                });
    
                if (res.data.success) {
                    navigate('/')
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message || error.message,
                });
            }
        };

        logout()
    }, [])
    
    return (
        <div className="flex items-center justify-center">
          <RingLoader size={100} color="#2563EB" />
        </div>
      );
}

export default Logout