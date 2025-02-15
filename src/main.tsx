import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="352684891907-u7coiggpdoeo928jdlm7hb08nnfqm81m.apps.googleusercontent.com">
  <StrictMode>
    <App />
  </StrictMode>
  </GoogleOAuthProvider>
)
