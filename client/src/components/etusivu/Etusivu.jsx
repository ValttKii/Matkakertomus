import React from 'react'
import { Navbar, Header } from '../common';
import "./Etusivu.css";
import Ohjt1kuva from "./Kuvat/Ohjt1kuva.jpg"




import { useState, useEffect } from "react";

export const Etusivu = () => {
    return(<div className="matka">
        <img src ={Ohjt1kuva} alt="Travel" className="matka_kuva"/>
        <h1 className="matka_otsikko">Tervetuloa matkustamaan!</h1>
    </div>
    )
}

export default Etusivu;