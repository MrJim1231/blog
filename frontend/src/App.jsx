import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Header from './components/Header'
import Categories from './components/Categories'
import AdminPanel from './components/AdminPanel' // <-- добавили импорт
import ArticlePage from './pages/ArticlePage' // <-- новый импорт
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
          <Route path="/article/:id" element={<ArticlePage />} /> {/* <-- новый маршрут */}
          <Route path="/admin" element={<AdminPanel />} /> {/* <-- добавили маршрут */}
        </Routes>
      </div>
    </>
  )
}

export default App
