import React from 'react'
import { Navbar, Header } from '../common';
import './Matkakohde.css'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { useState, useEffect } from "react";

const doSearchQuery = (maa) => {
  let r = [];
  if (maa != "") r.push("maa=" + maa);

  // laitetaan AINA query-muuttujaan kellonaika millisekunteina (1.1.1970 lähtien)
  // näin joka kerta query:n sisältö on vähän erilainen kun painetaan Hae-nappia
  // REST-api ei välitä ylim. query-muuttujasta
  r.push(Date.now());

  return r.join("&");
};

export const Asiakas = () => {

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
      const response = await fetch("http://localhost:3004/matkakohde?" + query);
      const data = await response.json();
      setKohteet(data);
    }
    if (query != "") fetchKohde();
  }, [query])

  useEffect(() => {
    const fetchAsiakasById = async () => {
      const r = await fetch("http://localhost:3004/matkakohde/" + muutettavaid);
      const data = await r.json();
      // Huomaa että tämä palvelu palauttaa VAIN yhden object:n
      // jos haet niin että url on muotoa http://localhost:3004/asiakas?id=200 -> palautuu TAULUKKO -> ota taulukon 1. alkio
      setKohdeModified(data);
      setshowEditForm(true);
    };
    if (muutettavaid > 0) fetchAsiakasById();
  }, [muutettavaid]);

  useEffect(() => {
    const deleteKohde = async () => {
      const r = await fetch(
        "http://localhost:3004/matkakohde/" + kohdedeleted.id,
        {
          method: "DELETE",
        }
      );
      console.log("DELETE:", r);
      setQuery(doSearchQuery(maa));
    };
    if (kohdedeleted != null) deleteKohde();
  }, [kohdedeleted]);

  useEffect(() => {
    const insertKohde = async () => {
      const r = await fetch("http://localhost:3004/matkakohde/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          kohdenimi: kohdeinserted.kohdenimi,
          maa: kohdeinserted.maa,
          paikkakunta: kohdeinserted.paikkakunta,
          kuvaus: kohdeinserted.kuvaus,
        }),
      });
      console.log("INSERT:", r);
      setQuery(doSearchQuery(maa));
      setKohdeInserted(null);
    };
    if (kohdeinserted != null) insertKohde();
  }, [kohdeinserted]);

  useEffect(() => {
    const modifyKohde = async () => {
      const r = await fetch(
        "http://localhost:3004/matkakohde/" + modifiedKohde.id,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            kohdenimi: modifiedKohde.nimi,
            maa: modifiedKohde.maa,
            paikkakunta: modifiedKohde.paikkakunta,
            kuvaus: modifiedKohde.kuvaus,
          }),
        }
      );
      console.log("MODIFY:", r);
      setQuery(doSearchQuery(maa));
      setModifiedKohde(null);
      setKohdeModified(null);
    };
    if (modifiedKohde != null) modifyKohde();
  }, [modifiedKohde]);


  const haeClicked = () => {
    setQuery(doSearchQuery(maa));
  };

  const onDelete = (matkakohde) => {
    setKohdeDeleted(matkakohde);
  };

  const onEdit = (matkakohde) => {
    setMuutettavaId(matkakohde.id);
    setshowEditForm(true);
  };

  const renderTable = () => {
    return <Kohteet data={kohteet} onDelete={onDelete} onEdit={onEdit} />;

  };
  const onCancel = () => {
    setshowEditForm(false);
    setKohdeModified(null);
  };

  const onSave = (newKohde) => {
    if (newKohde.id > 0) setModifiedKohde(newKohde);
    else setKohdeInserted(newKohde);
    setshowEditForm(false);
  };

  const mystyle = {

    padding: "10px",

  };

  return (<div>
    {showEditForm ? (

      <KohdeForm
        onSave={onSave}
        onCancel={onCancel}
        matkakohde={kohdemodified}
      />

    ) : (
      <div>
        <Grid
          container spacing={5}
          alignItems="center"
          justifyContent="center">

          <Grid item>
            <TextField
              label="Maa"
              id="filled-size-normal"
              defaultValue="dsfg"
              variant="filled"
              value={maa}

              onChange={(e) => setMaa(e.target.value)}
              InputProps={{
                endAdornment: <Button
                  variant="outlined" onClick={() => haeClicked()}>
                  Hae
                </Button>
              }}
            />
          </Grid>

          <Grid item>
            <Button variant="outlined" onClick={() => setshowEditForm(true)}>
              Lisää uusi
            </Button>
          </Grid>

        </Grid>
        <h4>KOHTEET</h4>
        {renderTable()}
      </div>
    )}
  </div>
  );
}
const KohdeForm = (props) => {
  const { onCancel, onSave, matkakohde } = props;

  const [kohdenimi, setKohdeNimi] = useState("");
  const [maa, setMaa] = useState("");
  const [paikkakunta, setPaikkakunta] = useState("");
  const [kuvaus, setKuvaus] = useState("");


  const tallennaClicked = () => {
    onSave({ id: -1, maa, kohdenimi, paikkakunta, kuvaus });
  };

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
    <Grid container spacing={5}
      direction={"column"}
      alignItems="center"
      justifyContent="center">
      {matkakohde ? (
        <Grid item >
          <h4>Matkakohteen muokkaaminen</h4><br></br>
        </Grid>
      ) : (
        <Grid item>
          <br></br> <h3>Uuden matkakohteen lisääminen</h3> <br></br>
        </Grid>
      )}
      <Grid item>
        <TextField
          label="Kohde nimi"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={kohdenimi}
          onChange={(e) => setKohdeNimi(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Kohde maa"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={maa}
          onChange={(e) => setMaa(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Paikkakunta"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={paikkakunta}
          onChange={(e) => setPaikkakunta(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Kuvaus"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={kuvaus}
          onChange={(e) => setKuvaus(e.target.value)}
        />
      </Grid>

      {matkakohde ? (
        <Grid item>
          <Button onClick={() => tallennaClicked()}>
            Tallenna muutos
          </Button>
        </Grid>
      ) : (
        <Grid item>
          <Button onClick={() => tallennaClicked()}>
            Tallenna
          </Button>
        </Grid>
      )}
      {matkakohde ? (
        <Grid item>
          <Button onClick={() => onCancel()}>
            Peruuta Muutos
          </Button>
        </Grid>
      ) : (
        <Grid item>
          <Button onClick={() => onCancel()}>
            Peruuta
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
const Kohteet = (props) => {
  console.log("kohteet: ", props)
  const { data, onDelete, onEdit } = props;

  const rows = data.map((t) => (
    <TableRow key={t.id}>
      <TableCell>{t.id}</TableCell>
      <TableCell>{t.kohdenimi}</TableCell>
      <TableCell>{t.maa}</TableCell>
      <TableCell>{t.paikkakunta}</TableCell>
      <TableCell>{t.kuvaus}</TableCell>
      <TableCell>
        <Button onClick={() => deleteClicked(t)}>
          Poista {t.id}
        </Button>
      </TableCell>
      <TableCell>
        <Button onClick={() => onEdit(t)}>
          Muokkaa kohdetta {t.id}
        </Button>
      </TableCell>
    </TableRow>
  ))

  const deleteClicked = (a) => {
    //Kommentoitu tehtävän 23 testitarkoistua varten
    //Muuta tehtävää ja tehtävänantoa niin että table häviää ja tilalle tulee varmistus
    const r = window.confirm(`Haluatko varmasti poistaa kohteen ${a.kohdenimi} maasta ${a.maa}?`);
    console.log("ärrä: ")
    if (r) onDelete(a);
  };

  return (
    <TableContainer sx={{ width: "80%", margin: "auto" }} component={Paper}>

      <Table sx={{}} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow  >
            <TableCell>Id</TableCell>
            <TableCell>Kohde</TableCell>
            <TableCell>Maa</TableCell>
            <TableCell>Paikkakunta</TableCell>
            <TableCell>Kuvaus</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
export default Asiakas;