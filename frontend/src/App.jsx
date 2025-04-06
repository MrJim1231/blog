import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ArticlesPage from './pages/ArticlesPage'
import ArticlePage from './pages/ArticlePage'
import Header from './components/Header'
import Categories from './pages/Categories'
import AdminPanel from './components/AdminPanel'
import ArticleEditor from './components/admin/ArticleEditor'
import EditArticle from './components/admin/EditArticle'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/category/:category" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/editor" element={<ArticleEditor />} /> {/* <-- маршрут редактора */}
          <Route path="/edit-article/:id" element={<EditArticle />} />
        </Routes>
      </div>
    </>
  )
}

export default App
