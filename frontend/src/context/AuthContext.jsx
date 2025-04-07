import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Загружаем пользователя из localStorage при монтировании компонента
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      console.log('Роль пользователя:', parsedUser.role)
    } else {
      console.log('Пользователь не авторизован')
    }

    // Обновляем данные пользователя, если произошли изменения в localStorage (например, после логина на другой вкладке)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user'))
      setUser(updatedUser)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Функция выхода из системы (удаляем пользователя из localStorage и сбрасываем состояние)
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
