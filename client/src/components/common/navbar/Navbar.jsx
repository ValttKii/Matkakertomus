import React from 'react';
import './Navbar.css';


const Navbar = () => {

    return (

        <section className="navbar">
      <a href="/etusivu" className="navbar-item">ETUSIVU</a>
      <a href="/matkakohde" className="navbar-item">MATKAKOHDE</a>
      <a href="/porukanmatkat" className="navbar-item">PORUKAN MATKAT</a>
      <a href="/omattiedot" className="navbar-item">OMAT TIEDOT</a>
      <a href="/jasenet" className="navbar-item">JÄSENET</a>
      
  </section>
    )
}
export default Navbar;
