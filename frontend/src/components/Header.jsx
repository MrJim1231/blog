import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import styles from '../styles/Header.module.css'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const handleLogoutClick = () => {
    logout()
    setIsMenuOpen(false)
    navigate('/')
  }

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>Guide 💡 Life Blog</h1>

      <div className={styles.burgerIcon} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Мобильное меню */}
      <nav className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} onClick={handleLinkClick}>
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/category" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} onClick={handleLinkClick}>
              Категории
            </NavLink>
          </li>

          {user ? (
            <>
              <li>
                <NavLink to="#" className={styles.navLink} onClick={handleLinkClick}>
                  👋 {user.username}
                </NavLink>
              </li>
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} onClick={handleLinkClick}>
                    Админка
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="#" className={styles.navLink} onClick={handleLogoutClick}>
                  Выйти
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/auth/login" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} onClick={handleLinkClick}>
                Личный кабинет
              </NavLink>
            </li>
          )}
          <hr />
        </ul>
      </nav>

      {/* Десктоп-меню */}
      <nav className={styles.navigationContainer}>
        <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Главная
        </NavLink>
        <NavLink to="/category" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Категории
        </NavLink>

        {user ? (
          <>
            <NavLink to="#" className={styles.navLink}>
              👋 {user.username}
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
                Админка
              </NavLink>
            )}
            <NavLink to="#" className={styles.navLink} onClick={handleLogoutClick}>
              Выйти
            </NavLink>
          </>
        ) : (
          <NavLink to="/auth/login" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            Личный кабинет
          </NavLink>
        )}
      </nav>
    </header>
  )
}
