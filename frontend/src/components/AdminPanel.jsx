import { useState } from 'react'
import AddCategory from './admin/AddCategory'
import AddArticle from './admin/AddArticle'
import styles from '../styles/AdminPanel.module.css' // Подключаем CSS-модуль

const AdminPanel = () => {
  const [message, setMessage] = useState('')

  return (
    <div className={styles.adminPanel}>
      <AddCategory setMessage={setMessage} />
      <hr className="my-6" />
      <AddArticle setMessage={setMessage} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

export default AdminPanel
