import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout'
import { Home, Login, Register, authGithub } from './pages'
import { Provider } from 'react-redux'
import store from './app/store'
import Verify from './pages/VerifyOTP'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <Layout /> }>
      <Route path='' element = { <Home /> } />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/verify/:what' element={<Verify />} />
      <Route path='/auth/github/callback' element={<authGithub />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  </Provider>
)
