// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ role }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth/login" /> // Редиректим на логин, если нет пользователя
  }

  if (role && user.role !== role) {
    return <Navigate to="/" /> // Редиректим на главную, если роль не совпадает
  }

  return <Outlet /> // Если роль совпадает, отдаем компонент
}

export default PrivateRoute
