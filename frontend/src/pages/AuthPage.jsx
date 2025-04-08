import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoginPath = location.pathname === '/auth/login'

  const [isLogin, setIsLogin] = useState(isLoginPath)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setIsLogin(location.pathname === '/auth/login')
  }, [location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const url = isLogin ? 'http://localhost/blog/backend/api/login.php' : 'http://localhost/blog/backend/api/register.php'

    const body = isLogin ? { email, password } : { username, email, password, role: 'user' }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (isLogin) {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
          window.dispatchEvent(new Event('storage'))
          navigate('/')
        } else {
          setError(data.message || 'Неверный логин или пароль')
        }
      } else {
        if (data.message === 'Регистрация успешна') {
          navigate('/auth/login')
        } else {
          setError(data.message || 'Ошибка регистрации')
        }
      }
    } catch (err) {
      setError('Ошибка запроса к серверу')
    }
  }

  return (
    <div className="auth-page" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Личный кабинет</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Имя пользователя" required />}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        {isLogin ? (
          <>
            Нет аккаунта?{' '}
            <button onClick={() => navigate('/auth/register')} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
              Зарегистрироваться
            </button>
          </>
        ) : (
          <>
            Уже есть аккаунт?{' '}
            <button onClick={() => navigate('/auth/login')} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
              Войти
            </button>
          </>
        )}
      </p>
    </div>
  )
}

export default AuthPage
