import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost/blog/backend/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.user) {
        // сохраняем пользователя
        localStorage.setItem('user', JSON.stringify(data.user))
        // уведомим другие вкладки (если нужно)
        window.dispatchEvent(new Event('storage'))
        navigate('/')
      } else {
        setError(data.message || 'Неверный логин или пароль')
      }
    } catch (error) {
      setError('Ошибка запроса к серверу')
    }
  }

  return (
    <div className="auth-page">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
        <button type="submit">Войти</button>
        {error && (
          <p className="error" style={{ color: 'red' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  )
}

export default LoginPage
