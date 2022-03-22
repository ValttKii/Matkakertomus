import logo from './logo.svg';
import  { Header } from './components/common'
import  {Asiakas, Etusivu, Jäsenet}   from './components'

import './App.css';

import {useEffect,useState} from "react";
import axios from "axios";
import { Link, NavLink, Routes, Route, BrowserRouter as Router, useNavigate, useLocation, Navigate, Outlet, useParams } from 'react-router-dom'





function App() {

  const [data,setData] = useState({})

  useEffect(()=>{
    axios.get("http://localhost:8080/json").then((res)=>{
      setData(res.data)
    })
    
  },[])


  return (
    <div className="App">
      <Router>
      <Header/>
      
      <Routes>
        <Route path="/matkakohde" element={<Asiakas/>}/>
        <Route path="/etusivu" element={<Etusivu/>}/>
        <Route path="/jäsenet" element={<Jäsenet/>}/>

      </Routes>
      </Router>
      
        <p>
          {JSON.stringify(data)}
        </p>
    </div>
  );
}

export default App;


