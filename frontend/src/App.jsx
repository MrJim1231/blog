import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticlePage from './pages/ArticlePage'
import CategoriesPage from './pages/CategoriesPage'
import Header from './components/Header'
import AdminPanel from './components/AdminPanel'
import AddArticle from './components/admin/AddArticle'
import UpdateArticle from './components/admin/UpdateArticle'
import LoginPage from './pages/LoginPage' // Страница логина
import RegisterPage from './pages/RegisterPage' // Страница регистрации
import PrivateRoute from './components/PrivateRoute' // Защищённый маршрут
import NotFound from './pages/NotFound'
import AuthPage from './pages/AuthPage' // Страница авторизации (можно объединить login и register)

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
            <Route path="/edit-article/:id" element={<UpdateArticle />} />
          </Route>

          {/* Страницы логина и регистрации */}
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/register" element={<AuthPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
