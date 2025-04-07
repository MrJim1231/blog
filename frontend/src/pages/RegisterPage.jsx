import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost/blog/backend/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role: 'user' }),
      })
      const data = await res.json()
      if (data.message === 'Регистрация успешна') {
        navigate('/login')
      } else {
        setError(data.message || 'Ошибка регистрации')
      }
    } catch (err) {
      setError('Ошибка запроса')
    }
  }

  return (
    <div className="auth-page">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Имя пользователя" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
        <button type="submit">Зарегистрироваться</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default RegisterPage
