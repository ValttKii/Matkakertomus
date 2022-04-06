import React from 'react';
import './Navbar2.css';
import { Link, NavLink, Routes, Route, BrowserRouter as Router, useNavigate, useLocation, Navigate, Outlet, useParams } from 'react-router-dom'

const Navbar2 = () => {

  return (

    <section className="navbar">
      <NavLink to="/etusivu" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })} >ETUSIVU</NavLink>
      <NavLink to="/matkakohde" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>MATKAKOHDE</NavLink>
      <NavLink to="/rekisteroidy" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>REKISTERÖIDY</NavLink>
      <NavLink to="/kirjaudu" className="navbar-item" style={() => ({ fontSize: '20px', height: '100px', textDecoration: 'none' })}>KIRJAUDU</NavLink>

    </section>
  )
}
export default Navbar2;