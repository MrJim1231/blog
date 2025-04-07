import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/Header.module.css'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <header className={styles.headerContainer}>
      <h1 className={styles.headerTitle}>Guide 💡 Life Blog</h1>

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
          <>
            <Link to="/login" className={styles.navLink}>
              Логин
            </Link>
            <Link to="/register" className={styles.navLink}>
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
