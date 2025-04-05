import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Header from './components/Header'
import Categories from './components/Categories'
import './App.css' // если ты используешь внешние стили, добавь этот импорт

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
