import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { logout } from '@/features/userSlice';
import { useNavigate } from 'react-router-dom';
import {Loader} from '@/components';

const Logout = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const logoutHandler = async () => {
            try {
                const res = await axios.get('/api/user/logout');
    
                toast({
                    title: res.data.message,
                });
    
                if (res.data.success) {
                    dispatch(logout());
                    navigate('/')
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.response?.data?.message || error.message,
                });
            }
        };

        logoutHandler()
    }, [])
    
    return (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      );
}

export default Logout