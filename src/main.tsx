import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'


const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={googleId}>
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
)
