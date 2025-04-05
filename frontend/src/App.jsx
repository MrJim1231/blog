import { Route, Routes } from 'react-router-dom' // Импортируем компоненты для маршрутизации
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Header from './components/Header' // Импортируем Header

function App() {
  return (
    <>
      {/* Добавляем Header на каждой странице */}
      <Header />
      {/* Настроим маршруты */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryPage />} />
      </Routes>
    </>
  )
}

export default App
