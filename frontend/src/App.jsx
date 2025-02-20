import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./features/userSlice";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { 
  Layout,
  AdminLayout,
  TournamentLayout,
  ProtectedRoutes,
  RegisterLayout
} from "./layout";
import { 
  Home, 
  Login, 
  Register, 
  AuthGithub, 
  Verify, 
  ForgotPassword, 
  ResetPassword, 
  Dashboard, 
  AdminLogin, 
  AddTournament, 
  ViewTournament, 
  Tournament,
  Logout,
  ParticipantsList,
  Fixtures,
  AllMatches,
  Match,
  Settings,
  MatchSettings,
  Admins,
  UserSettings,
  NotFound404
} from './pages'
import { Loader } from '@/components';

function App() {
    const role = useSelector((state) => state.user.userRole);
    const dispatch = useDispatch();
    
    const router = createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route path='/' element={ <Layout /> }>
            <Route path='' element = { <Home /> } />
            <Route path='/user-settings' element={<UserSettings />} />

            <Route element={<RegisterLayout />} >
              <Route element={<ProtectedRoutes allowed={role != "verifiedUser"} />} > 
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/auth/github/callback' element={<AuthGithub />} />
              </Route>
            
              <Route element={<ProtectedRoutes allowed={role == "unverifiedUser"} />} > 
                  <Route path='/verify/email' element={<Verify what="email" />} />
                  <Route path='/verify/password' element={<Verify what="password" />} />
              </Route>
                  
              <Route element={<ProtectedRoutes allowed={role == "changePassword"} />} > 
                <Route path='/reset-password' element={<ResetPassword />} />
              </Route>
            </Route>

            <Route path='/dashboard' element={<Dashboard />} />+
            <Route path='/tournaments' element={ <Tournament />} />

            <Route path='/tournament' element={ <TournamentLayout />}>
              <Route path='view' element={ <ViewTournament /> } />
              <Route path='participants' element={ <ParticipantsList /> } />
              <Route path='all-matches' element={ <AllMatches /> } />
              <Route path='fixtures' element={ <Fixtures /> } />
              <Route path='match' element= { <Match /> } />
            </Route>
          </Route>

          <Route path='/admin' element={<AdminLogin />} />

          <Route element={<ProtectedRoutes allowed={role == "admin"} />} >
            <Route path='/admin/logout' element={<Logout />} />

            <Route path='/admin/dashboard' element={ <AdminLayout /> } >
              <Route path='' element = { <Home /> } />
              <Route path='add-tournament' element={<AddTournament />} />
              <Route path='update-tournament' element={<AddTournament isEditing={true}/>} />
              <Route path='tournaments' element={<Tournament isAdmin={role == "admin"} />} />
              <Route path='admins' element={<Admins />} />
              
              <Route path='tournament' element={ <TournamentLayout isAdmin={ role == "admin" } />}>
                <Route path='view' element={ <ViewTournament isAdmin={ role == "admin" } /> } />
                <Route path='participants' element={ <ParticipantsList isAdmin={ role == "admin" } /> } />
                <Route path='all-matches' element={ <AllMatches isAdmin={ role == "admin" } /> } />
                <Route path='fixtures' element={ <Fixtures /> } />
                <Route path='match' element= { <Match isAdmin={ role == "admin" } /> } />
                <Route path='match/settings' element= { <MatchSettings /> } />
                <Route path='settings' element= { <Settings /> } />
              </Route>
            </Route>


          </Route>
          <Route path='loading' element={ <Loader /> } />
          <Route path='*' element={ <NotFound404 />} />
        </>
      )
    )  

    useEffect(() => {
      const isLoggedIn = async() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        if (token && role) {
          const res = await axios.post('/api/user/refresh', {
            _id: token
          })

          if(res.data.success) {
            dispatch(loginSuccess({ token, role }));
          }
          else {
            dispatch(logout())
          }
        }
      }

      isLoggedIn()
    }, [dispatch]);

    useEffect(() => {
        const syncAuth = (event) => {
            if (event.key === "token") {
                window.location.reload();
            }
        };
    
        window.addEventListener("storage", syncAuth);
    
        return () => {
            window.removeEventListener("storage", syncAuth);
        };
    }, []);
    
    return (
      <RouterProvider router={router} />
    )
}

export default App