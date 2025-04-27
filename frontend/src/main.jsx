import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID = "1002653775098-klrpdsn4j8b390i17rvovptvgc01kqp1.apps.googleusercontent.com"; 
createRoot(document.getElementById('root')).render(
  
<GoogleOAuthProvider clientId={CLIENT_ID}>
<StrictMode>
    <App />
  </StrictMode>,
    </GoogleOAuthProvider>
  
)