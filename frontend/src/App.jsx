import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GiftsPage from './pages/GiftsPage'
import Header from './components/Header' // Подключаем Header

const App = () => {
  return (
    <Router>
      <Header /> {/* Заголовок будет отображаться на всех страницах */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gifts" element={<GiftsPage />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
