// Импортируем необходимые хуки и функции из React
import { createContext, useContext, useEffect, useState } from 'react'

// Создаём контекст аутентификации
const AuthContext = createContext()

// Компонент-провайдер, который оборачивает приложение и предоставляет данные пользователя
export const AuthProvider = ({ children }) => {
  // Локальное состояние для хранения информации о текущем пользователе
  const [user, setUser] = useState(null)

  // useEffect вызывается при монтировании компонента
  useEffect(() => {
    // Пытаемся получить данные пользователя из localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      // Если пользователь найден — парсим JSON и сохраняем в состояние
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
    }

    // Обработчик изменений localStorage (например, если пользователь вошёл с другой вкладки)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'))
      setUser(updatedUser)
    }

    // Подписываемся на событие 'storage' — оно вызывается при изменении localStorage в другой вкладке
    window.addEventListener('storage', handleStorageChange)

    // Убираем подписку при размонтировании компонента
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Функция выхода пользователя: удаляет пользователя из localStorage и сбрасывает состояние
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  // Возвращаем контекст с доступом к user, setUser и logout
  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}

// Хук для использования контекста аутентификации в любом компоненте
export const useAuth = () => useContext(AuthContext)
