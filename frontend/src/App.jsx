import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticlePage from './pages/ArticlePage'
import CategoriesPage from './pages/CategoriesPage'
import Header from './components/Header'
import AdminPanel from './components/AdminPanel'
import AddArticle from './components/admin/AddArticle'
import UpdateArticle from './components/admin/UpdateArticle'
import LoginPage from './pages/LoginPage' // Добавляем страницу логина
import RegisterPage from './pages/RegisterPage' // Добавляем страницу регистрации
import PrivateRoute from './components/PrivateRoute' // Импортируем PrivateRoute
import NotFound from './pages/NotFound'

import './App.css'

function App() {
  return (
    <>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category" element={<CategoriesPage />} />
          <Route path="/category/:category" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="*" element={<NotFound />} />

          {/* Защищённые маршруты */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/editor" element={<AddArticle />} />
          </Route>

          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/edit-article/:id" element={<UpdateArticle />} />
          </Route>

          {/* Страницы логина и регистрации */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
