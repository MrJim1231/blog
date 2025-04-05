import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import '../styles/Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen)
  }

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/" className="logo-link">
            Мой Блог
          </NavLink>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink to="/" onClick={toggleMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" onClick={toggleMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Категории
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={toggleMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Обо мне
            </NavLink>
          </li>
        </ul>

        <div className="burger-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </div>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={toggleMenu}>
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" onClick={toggleMenu}>
              Категории
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={toggleMenu}>
              Обо мне
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
