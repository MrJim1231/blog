// src/App.jsx
import { Route, Routes } from 'react-router-dom' // Импортируем компоненты для маршрутизации
import Home from './pages/Home' // Страница главная
import CategoryPage from './pages/CategoryPage' // Страница категории
import Header from './components/Header' // Импортируем Header
import Categories from './components/Categories' // Импортируем компонент Categories

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Categories />} /> {/* Путь для отображения всех категорий */}
        <Route path="/category/:category" element={<CategoryPage />} /> {/* Страница для конкретной категории */}
      </Routes>
    </>
  )
}

export default App
