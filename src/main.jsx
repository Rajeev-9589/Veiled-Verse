import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import { SubscriptionProvider } from './contexts/SubscriptionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <UserProvider>   
      <SubscriptionProvider>
         <App />
         </SubscriptionProvider>
         </UserProvider>

    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
