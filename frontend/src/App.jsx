import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./features/userSlice";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { 
  Layout,
  AdminLayout,
  TournamentLayout,
  ProtectedRoutes
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
  UserSettings
} from './pages'

function App() {
    const role = useSelector((state) => state.user.userRole);
    const dispatch = useDispatch();
    
    const router = createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route path='/' element={ <Layout /> }>
            <Route path='' element = { <Home /> } />
            
            <Route element={<ProtectedRoutes allowed={role != "verifiedUser"} />} > 
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/auth/github/callback' element={<AuthGithub />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/user-settings' element={<UserSettings />} />
            </Route>
            
            <Route element={<ProtectedRoutes allowed={role == "unverifiedUser"} />} > 
              <Route path='/verify/:what' element={<Verify />} />
            </Route>
                  
            <Route element={<ProtectedRoutes allowed={role == "changePassword"} />} > 
              <Route path='/reset-password' element={<ResetPassword />} />
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
        </>
      )
    )  

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token && role) {
            dispatch(loginSuccess({ token, role }));
        }
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