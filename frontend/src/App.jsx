import AdminLayout from './layout/AdminLayout'
import TournamentLayout from './layout/TournamentLayout'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./features/userSlice";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout'
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
} from './pages'

const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={ <Layout /> }>
          <Route path='' element = { <Home /> } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify/:what' element={<Verify />} />
          <Route path='/auth/github/callback' element={<AuthGithub />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/dashboard' element={<Dashboard />} />
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
        <Route path='/admin/logout' element={<Logout />} />
  
        <Route path='/admin/dashboard' element={ <AdminLayout /> } >
          <Route path='' element = { <Home /> } />
          <Route path='add-tournament' element={<AddTournament />} />
          <Route path='update-tournament' element={<AddTournament isEditing={true}/>} />
          <Route path='tournaments' element={<Tournament isAdmin={true} />} />
        </Route>
      </>
    )
  )  

function App() {
    const dispatch = useDispatch();

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