import React from 'react';
import './Navbar.css';
import { Link, NavLink, Routes, Route, BrowserRouter as Router, useNavigate, useLocation, Navigate, Outlet, useParams } from 'react-router-dom'

const Navbar = () => {

  return (

    <section className="navbar">
      <NavLink to="/etusivu" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })} >ETUSIVU</NavLink>
      <NavLink to="/matkakohde" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>MATKAKOHDE</NavLink>
      <NavLink to='/porukanmatkat' className="navbar-item"  style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>PORUKANMATKAT</NavLink>
      <NavLink to="/omattiedot" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })} >OMAT TIEDOT</NavLink>
      <NavLink to="/jasenet" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>JÄSENET</NavLink>
      <NavLink to="/rekisteroidy" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>REKISTERÖIDY</NavLink>
      <NavLink to="/kirjaudu" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>KIRJAUDU</NavLink>

    </section>
  )
}
export default Navbar;
