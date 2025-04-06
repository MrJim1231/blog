import { useState } from 'react'
import AddCategory from './admin/AddCategory'
import ArticleEditor from './admin/ArticleEditor' // ✅ добавляем импорт
import '../styles/AdminPanel.css'

const AdminPanel = () => {
  const [message, setMessage] = useState('')

  return (
    <div className="admin-panel">
      <AddCategory setMessage={setMessage} />
      <hr className="my-6" />
      <ArticleEditor setMessage={setMessage} /> {/* ✅ вставляем редактор статьи */}
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default AdminPanel
