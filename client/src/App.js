import logo from './logo.svg';

import  { Header } from './components/common'

import './App.css';

import {useEffect,useState} from "react";
import axios from "axios";

function App() {

  const [data,setData] = useState({})

  useEffect(()=>{
    axios.get("http://localhost:8080/json").then((res)=>{
      setData(res.data)
    })
    
  },[])


  return (
    <div className="App">
      <Header/>
        <p>
          {JSON.stringify(data)}
        </p>
    </div>
  );
}

export default App;
