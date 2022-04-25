import logo from './logo.svg';
import  { Header } from './components/common'
import  {Matkakohde, Etusivu, Jasenet, Omattiedot, Rekisteroidy, Kirjaudu, Porukanmatkat, Omatmatkat}   from './components'

import './App.css';

import {useEffect,useState} from "react";
import axios from "axios";
import { Link, NavLink, Routes, Route, BrowserRouter as Router, useNavigate, useLocation, Navigate, Outlet, useParams } from 'react-router-dom'





function App() {

  return (
    <div className="App">
      <Router>
      <Header/>
      
      <Routes>
        <Route path="/matkakohde" element={<Matkakohde/>}/>
        <Route path="/etusivu" element={<Etusivu/>}/>
        <Route path="/jasenet" element={<Jasenet/>}/>
        <Route path="/omattiedot" element={<Omattiedot/>}/>
        <Route path="/rekisteroidy" element={<Rekisteroidy/>}/>
        <Route path="/kirjaudu" element={<Kirjaudu/>}/>
        <Route path="/porukanmatkat" element={<Porukanmatkat/>}/>
        <Route path="/omatmatkat" element={<Omatmatkat/>}/>

      </Routes>
      </Router>
      
    </div>
  );
}

export default App;


