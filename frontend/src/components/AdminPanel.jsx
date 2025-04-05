import { useState } from 'react'
import '../styles/AdminPanel.css'

export default function AdminPanel() {
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost/blog/backend/api/add_category.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category }),
      })

      const result = await response.json()
      setMessage(result.message)
      setCategory('') // очищаем поле
    } catch (error) {
      setMessage('Ошибка при отправке запроса')
    }
  }

  return (
    <div className="admin-panel">
      <h2>Добавить новую категорию</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Введите название категории" required />
        <button type="submit">Добавить</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  )
}
