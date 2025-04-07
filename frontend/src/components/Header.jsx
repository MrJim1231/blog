import { Link } from 'react-router-dom'
import styles from '../styles/Header.module.css'

export default function Header() {
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
        <Link to="/login" className={styles.navLink}>
          Логин
        </Link>
        <Link to="/register" className={styles.navLink}>
          Регистрация
        </Link>
      </nav>
    </header>
  )
}
