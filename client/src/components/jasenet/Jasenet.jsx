
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
    // laitetaan AINA query-muuttujaan kellonaika millisekunteina (1.1.1970 lähtien)
    // näin joka kerta query:n sisältö on vähän erilainen kun painetaan Hae-nappia
    // REST-api ei välitä ylim. query-muuttujasta
    r.push(Date.now());

    return r.join("&");
};

export const Jasenet = () => {

    const [etunimi, setEtunimi] = useState ("");
    const [sukunimi, setSukunimi] = useState ("");
    const [nimimerkki, setNimimerkki] = useState ("");
    const [id, setId] = useState ("");
    const [kohdenimi, setKohdeNimi] = useState("");
    const [osoite, setOsoite] = useState("");
    const [maa, setMaa] = useState("");
    const [paikkakunta, setPaikkakunta] = useState("");
    const [kuvaus, setKuvaus] = useState("");
    const [query, setQuery] = useState("");
    const [kohteet, setKohteet] = useState([]);
    const [kohdedeleted, setKohdeDeleted] = useState(null);
    const [kohdeinserted, setKohdeInserted] = useState(null);
    const [kohdemodified, setKohdeModified] = useState(null);
    const [modifiedKohde, setModifiedKohde] = useState(null);
    const [showEditForm, setshowEditForm] = useState(false);
    const [muutettavaid, setMuutettavaId] = useState(-1);

    useEffect(() => {
        const fetchKohde = async () => {
            const response = await fetch("http://localhost:3004/jasenet?" + query);
            const data = await response.json();
            setKohteet(data);
        }
        if (query != "") fetchKohde();
    }, [query])


    const haeClicked = () => {
        setQuery(doSearchQuery(etunimi, sukunimi, nimimerkki, id, paikkakunta));
    };

    const renderTable = () => {
        return <Kohteet data={kohteet} />;

    };

    return ( <div>
    {showEditForm ? (
      <KohdeForm
        matkakohde={kohdemodified}
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
const KohdeForm = (props) => {
    const {matkakohde } = props;
  
    const [kohdenimi, setKohdeNimi] = useState("");
    const [maa, setMaa] = useState("");
    const [paikkakunta, setPaikkakunta] = useState("");
    const [kuvaus, setKuvaus] = useState("");
    
  
    useEffect(() => {
      if (matkakohde) {
        setKohdeNimi(matkakohde.kohdenimi);
        setMaa(matkakohde.maa);
        setPaikkakunta(matkakohde.paikkakunta);
        setKuvaus(matkakohde.kuvaus);
      }
    }, [matkakohde]);
  
    //console.log("Asiakasform:", asiakas);
  
    return (
      <div>
        <label>
          Kohde nimi:
          <input
            type="text"
            value={kohdenimi}
            onChange={(e) => setKohdeNimi(e.target.value)}
          />
        </label>
        <label>
          Kohde maa: 
          <input
            type="text"
            value={maa}
            onChange={(e) => setMaa(e.target.value)}
          />
        </label>
        <label>
          Paikkakunta:
          <input
            type="text"
            value={paikkakunta}
            onChange={(e) => setPaikkakunta(e.target.value)}
          />
        </label>
        <label>
          Kuvaus:
          <input
          type="text"
            value={kuvaus}
            onChange={(e) => setKuvaus(e.target.value)}
          />
        </label>
      </div>
    );
  };
const Kohteet = (props) => {
    console.log("kohteet: ", props)
    const { data , onDelete, onEdit} = props;

    const rows = data.map((t) => (
        <TableRow key={t.id}>
            <TableCell>{t.etunimi}</TableCell>
            <TableCell>{t.sukunimi}</TableCell>
            <TableCell>{t.nimimerkki}</TableCell>
            <TableCell>{t.paikkakunta}</TableCell>
            <TableCell>{t.id}</TableCell>
            <TableCell>{t.esittely}</TableCell>
            <TableCell>{t.kuva}</TableCell>
    </TableRow>
    ))

    return (
        <TableContainer sx={{width: "80%", margin: "auto"}} component={Paper}>

            <Table sx={{ }} size="small"  aria-label="a dense table">
                <TableHead>
                    <TableRow  >
                        <TableCell>Etunimi</TableCell>
                        <TableCell>Sukunimi</TableCell>
                        <TableCell>Nimimerkki</TableCell>
                        <TableCell>Paikkakunta</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Esittely</TableCell>
                        <TableCell>Kuva</TableCell>
                        
                    </TableRow>
                </TableHead>
                <TableBody>{rows}</TableBody>
            </Table>
        </TableContainer>
    );
}

export default Jasenet;