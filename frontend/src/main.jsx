import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout'
import { Home, Login, Register, AuthGithub, Verify, ForgotPassword, ResetPassword, Dashboard, AdminLogin } from './pages'
import { Provider } from 'react-redux'
import store from './app/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from "@/components/ui/toaster"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <Layout /> }>
      <Route path='' element = { <Home /> } />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/verify/:what' element={<Verify />} />
      <Route path='/auth/github/callback' element={<AuthGithub />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/admin' element={<AdminLogin />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
      <Toaster />
    </GoogleOAuthProvider>,
  </Provider>
)
