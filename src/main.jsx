import { createRoot } from 'react-dom/client'
import { googleApiKey } from '../config.js'
import './index.css'
import App from './App.jsx'

const script = document.createElement('script')
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`
script.async = true
script.defer = true
document.head.appendChild(script)

createRoot(document.getElementById('root')).render(
  <App />
)
