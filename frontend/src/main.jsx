import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './app/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from "@/components/ui/toaster"
import App from './App'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
      <Toaster />
    </GoogleOAuthProvider>,
  </Provider>
)
