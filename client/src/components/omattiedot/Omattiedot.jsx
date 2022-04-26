import React from 'react'
import { Navbar, Header } from '../common';
//import React, { useState, Fragment } from "react";
import { nanoid } from "nanoid";
import "./Omattiedot.css";
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
//import data from "./omattiedottaulu.json";
import { useState, useEffect } from "react";
import axios from "axios"
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';








export const Omattiedot = () => {

  const [etunimi, setEtunimi] = useState("");
  const [sukunimi, setSukunimi] = useState("");
  const [nimimerkki, setNimimerkki] = useState("");
  const [id, setId] = useState("");
  const [paikkakunta, setPaikkakunta] = useState("");
  const [esittely, setEsittely] = useState("");
  const [kuva, setKuva] = useState("");
  const [jasen, setJasen] = useState([]);
  const [modifiedAsiakas, setModifiedAsiakas] = useState(null);
  const [asiakasmodified, setAsiakasModified] = useState(false);
  const [muutettavaid, setMuutettavaId] = useState(-1);

  useEffect(() => {
    const fetchJasen = async () => {
      const response = await fetch("http://localhost:3004/omattiedot");
      const data = await response.json();
      setJasen(data);
    }
     fetchJasen();
  }, [])

  useEffect(() => {
    const modifyAsiakas = async () => {
      const r = await fetch(
        "http://localhost:3004/matkakohde/" + modifiedAsiakas.id,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            etunimi: modifiedAsiakas.etunimi,
            sukunimi: modifiedAsiakas.sukunimi,
            nimimerkki: modifiedAsiakas.nimimerkki,
            paikkakunta: modifiedAsiakas.paikkakunta,
            esittely: modifiedAsiakas.esittely,
            kuva: modifiedAsiakas.kuva,
          }),
        }
      );
      console.log("MODIFY:", r);
      setModifiedAsiakas(null);
      setAsiakasModified(null);
    };
    if (modifiedAsiakas != null) modifyAsiakas();
  }, [modifiedAsiakas]);

  const onEdit = (asiakas) => {
    console.log("Setting asiakas", asiakas)
    setMuutettavaId(asiakas.idmatkaaja);

  };
  
  
 


  const rows = jasen.map((user,key) => (
    <TableRow key={key}>
      <TableCell>{user.idmatkaaja}</TableCell>
      <TableCell>{user.etunimi}</TableCell>
      <TableCell>{user.sukunimi}</TableCell>
      <TableCell>{user.nimimerkki}</TableCell>
      <TableCell>{user.paikkakunta}</TableCell>
      <TableCell>{user.esittely}</TableCell>
      <Avatar alt="Prof pic" src={user.kuva}  />
    </TableRow>
    
  ))

  return (
    
    <TableContainer sx={{ width: "80%", margin: "auto" }} component={Paper}>

      <Table sx={{}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
          <TableCell>ID</TableCell>
            <TableCell>Etunimi</TableCell>
            <TableCell>Sukunimi</TableCell>
            <TableCell>Nimimerkki</TableCell>
            <TableCell>Paikkakunta</TableCell>
            <TableCell>Esittely</TableCell>
            <TableCell>Kuva</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
    
  );
}

                      

        




export default Omattiedot;
