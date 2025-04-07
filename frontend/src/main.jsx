import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext' // Провайдер авторизации

// Это позволит react-snap правильно подхватывать страницы
if (import.meta.env.MODE === 'production') {
  window.snapSaveState = () => {
    // сохраняет состояние, если нужно (необязательно сейчас, но полезно для SSR)
  }
}

const rootElement = document.getElementById('root')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
