import React from 'react'
import {Navbar} from '../../common';
import './Header.css'
import {Navbar2} from '../../common'
import Button from '@mui/material/Button'
import {useState} from "react";


const Header = (props) => {

    const [kirjaudu, setKirjaudu] = useState(false);

    if(kirjaudu==false){
    return (
        <section className='header'>
            <section className='header-top'>
                <section className='header-top-logo'>
                    <a href="/" className='header-logo' >RS</a>
                </section>
                <section className='header-top__navbar'>
                    <section className='header-top__navigation'>
                    <Navbar2 />
                    <Button variant="outlined" onClick={() => setKirjaudu(true)}>
                    Testi kirjautuminen
                     </Button>
                </section>
                <hr className='header-top__seperator'/>
            </section>
            </section>
            
        </section>
    
        )
    }
    else
    return(
        <section className='header'>
        <section className='header-top'>
            <section className='header-top-logo'>
                <a href="/" className='header-logo' >RS</a>
            </section>
            <section className='header-top__navbar'>
                <section className='header-top__navigation'>
                <Navbar />
                <Button onClick={() => setKirjaudu(false)}>
                    Testi kirjautuminen ulos
                     </Button>
            </section>
            <hr className='header-top__seperator'/>
        </section>
        </section>
        
    </section>
    )
}
export default Header;