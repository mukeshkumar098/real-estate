import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './Components/Redux-Arch/Store.jsx'

import 'leaflet/dist/leaflet.css';




createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
