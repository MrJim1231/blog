import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticlePage from './pages/ArticlePage' // <-- новый импорт
import Header from './components/Header'
import Categories from './components/Categories'
import AdminPanel from './components/AdminPanel' // <-- путь исправлен
import './App.css'

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/article/:id" element={<ArticlePage />} /> {/* <-- маршрут статьи */}
          <Route path="/admin" element={<AdminPanel />} /> {/* <-- маршрут админки */}
        </Routes>
      </div>
    </>
  )
}

export default App
