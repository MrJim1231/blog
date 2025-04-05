import { useState } from 'react'
import AddCategory from './admin/AddCategory'
import AddArticle from './admin/AddArticle'
import '../styles/AdminPanel.css'

const AdminPanel = () => {
  const [message, setMessage] = useState('')

  return (
    <div className="admin-panel">
      <AddCategory setMessage={setMessage} />
      <AddArticle setMessage={setMessage} />
      {message && <p className="message">{message}</p>}
    </div>
  )
}

export default AdminPanel
