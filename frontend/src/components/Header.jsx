import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import styles from '../styles/Header.module.css'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>Guide 💡 Life Blog</h1>

      {/* Иконка бургер-меню */}
      <div className={styles.burgerIcon} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Мобильное меню */}
      <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <Link to="/" className={styles.navLink} onClick={handleLinkClick}>
              Главная
            </Link>
          </li>
          <li>
            <Link to="/category" className={styles.navLink} onClick={handleLinkClick}>
              Категории
            </Link>
          </li>

          {user ? (
            <>
              <li className={styles.navLink}>👋 {user.username}</li>
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin" className={styles.navLink} onClick={handleLinkClick}>
                    Админка
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={() => {
                    handleLogout()
                    handleLinkClick()
                  }}
                  className={styles.navLink}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/auth/login" className={styles.navLink} onClick={handleLinkClick}>
                Личный кабинет
              </Link>
            </li>
          )}
          <hr />
        </ul>
      </nav>

      {/* Обычная навигация (для десктопа) */}
      <nav className={styles.navigationContainer}>
        <Link to="/" className={styles.navLink}>
          Главная
        </Link>
        <Link to="/category" className={styles.navLink}>
          Категории
        </Link>

        {user ? (
          <>
            <span className={styles.navLink}>👋 {user.username}</span>
            {user.role === 'admin' && (
              <Link to="/admin" className={styles.navLink}>
                Админка
              </Link>
            )}
            <button onClick={handleLogout} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              Выйти
            </button>
          </>
        ) : (
          <Link to="/auth/login" className={styles.navLink}>
            Личный кабинет
          </Link>
        )}
      </nav>
    </header>
  )
}
