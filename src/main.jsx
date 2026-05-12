import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider
    clientId="112789694748-k0uitf2tr6jqvla794efnc4bc50vnogt.apps.googleusercontent.com"
  >

    <BrowserRouter>
      <App />
    </BrowserRouter>

  </GoogleOAuthProvider>
)