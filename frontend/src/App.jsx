import React from 'react'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <>
      <header className="header">
        <Navbar />
      </header>
      <main className="main-content">
        <Home />
      </main>
    </>
  )
}

export default App
