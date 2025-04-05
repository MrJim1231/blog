import { Link } from 'react-router-dom' // Импортируем Link для перехода
import '../styles/Header.css' // Стили для Header

export default function Header() {
  return (
    <header className="header-container">
      <h1 className="header-title">Guide 💡 Life Blog</h1>
      <p className="description">Рецепты здорового питания и вкусных блюд!</p>

      {/* Навигационное меню */}
      <nav className="navigation-container">
        <Link to="/" className="nav-link">
          Главная
        </Link>
        {/* Добавим ссылку на страницу категории */}
        <Link to="/category" className="nav-link">
          Категории
        </Link>
        <Link to="/login" className="nav-link">
          Логин
        </Link>
        <Link to="/register" className="nav-link">
          Регистрация
        </Link>
      </nav>
    </header>
  )
}
