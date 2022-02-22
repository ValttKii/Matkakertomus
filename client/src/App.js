import logo from './logo.svg';
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

asd
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {JSON.stringify(data)}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;


