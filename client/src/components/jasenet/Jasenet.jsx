
import React from 'react'
import { Navbar, Header } from '../common';
import './Jasenet.css'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useState, useEffect } from "react";

const doSearchQuery = (etunimi, sukunimi, nimimerkki, paikkakunta, id) => {
  let r = [];
  if (etunimi != "") r.push("etunimi=" + etunimi);
  if (sukunimi != "") r.push("sukunimi=" + sukunimi);
  if (nimimerkki != "") r.push("nimimerkki=" + nimimerkki);
  if (paikkakunta != "") r.push("paikkakunta=" + paikkakunta);
  if (id != "") r.push("id=" + id);

  r.push(Date.now());

  return r.join("&");
};

export const Jasenet = () => {

  const [etunimi, setEtunimi] = useState("");
  const [sukunimi, setSukunimi] = useState("");
  const [nimimerkki, setNimimerkki] = useState("");
  const [id, setId] = useState("");
  const [paikkakunta, setPaikkakunta] = useState("");
  const [query, setQuery] = useState("");
  const [jasen, setJasen] = useState([]);
  const [jasenmodified, setKohdeModified] = useState(null);
  const [showEditForm, setshowEditForm] = useState(false);

  useEffect(() => {
    const fetchJasen = async () => {
      const response = await fetch("http://localhost:3004/jasenet?" + query);
      const data = await response.json();
      setJasen(data);
    }
    if (query != "") fetchJasen();
  }, [query])


  const haeClicked = () => {
    setQuery(doSearchQuery(etunimi, sukunimi, nimimerkki, id, paikkakunta));
  };

  const renderTable = () => {
    return <Jasen data={jasen} />;

  };

  return (<div>
    {showEditForm ? (
      <JasenForm
        jasentieto={jasenmodified}
      />
    ) : (
      <div>
        <label>
          Jäsen
          <input
            type="text"
            value={etunimi}
            onChange={(e) => setEtunimi(e.target.value)}
          />
        </label>


        <Button variant="contained" onClick={() => haeClicked()}>
          Hae
        </Button>

        <h4>Jäsenet</h4>
        {renderTable()}
      </div>
    )}
  </div>
  );
}
const JasenForm = (props) => {
  const { jasentie } = props;

  const [etunimi, setEtunimi] = useState("");
  const [sukunimi, setSukunimi] = useState("");
  const [paikkakunta, setPaikkakunta] = useState("");
  const [kuvaus, setKuvaus] = useState("");


  useEffect(() => {
    if (jasentie) {
      setEtunimi(jasentie.etunimi);
      setSukunimi(jasentie.sukunimi);
      setPaikkakunta(jasentie.paikkakunta);
      setKuvaus(jasentie.kuvaus);
    }
  }, [jasentie]);


  return (
    <div>
      <label>
      </label>
    </div>
  );
};
const Jasen = (props) => {
  console.log("kohteet: ", props)
  const { data, onDelete, onEdit } = props;

  const rows = data.map((t) => (
    <TableRow key={t.id}>
      <TableCell>{t.etunimi}</TableCell>
      <TableCell>{t.sukunimi}</TableCell>
      <TableCell>{t.nimimerkki}</TableCell>
      <TableCell>{t.paikkakunta}</TableCell>
      <TableCell>{t.id}</TableCell>
      <TableCell>{t.esittely}</TableCell>

    </TableRow>
  ))

  return (
    <TableContainer sx={{ width: "80%", margin: "auto" }} component={Paper}>

      <Table sx={{}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow  >
            <TableCell>Etunimi</TableCell>
            <TableCell>Sukunimi</TableCell>
            <TableCell>Nimimerkki</TableCell>
            <TableCell>Paikkakunta</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Esittely</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default Jasenet;