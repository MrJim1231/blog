import styles from '../styles/HomePage.module.css' // подключаем CSS-модуль

export default function Home() {
  return (
    <div className={styles.container}>
      <p>Главная страница</p>
    </div>
  )
}
