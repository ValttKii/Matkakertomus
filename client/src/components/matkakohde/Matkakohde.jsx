import React from 'react'
import { Navbar, Header } from '../common';
import './Matkakohde.css'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

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

export const Matkakohde = () => {


  const [maa, setMaa] = useState("");
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
      const response = await fetch("http://localhost:3004/matkakohde");
      const data = await response.json();
      setKohteet(data);
    }
    fetchKohde();
  }, [])

  useEffect(() => {
    const fetchKohde = async () => {
      const response = await fetch("http://localhost:3004/matkakohde?" + query);
      const data = await response.json();
      setKohteet(data);
    }
    if (query != "") fetchKohde();
  }, [query])

  useEffect(() => {
    const fetchMatkakohdeById = async () => {
      const r = await fetch("http://localhost:3004/matkakohde/" + muutettavaid);
      const data = await r.json();
    
      setKohdeModified(data);
      setshowEditForm(true);
    };
    if (muutettavaid > 0) fetchMatkakohdeById();
  }, [muutettavaid]);

  useEffect(() => {
    console.log("kohde del", kohdedeleted)
    const deleteKohde = async () => {
      const r = await fetch(
        "http://localhost:3004/matkakohde/" + kohdedeleted.idmatkakohde,
        {
          method: "DELETE",
        }
      )
      if(r.status === 400){
        
        window.confirm(`Kyseisellä matkakohteella on tarina, joten sitä ei voi poistaa. `);
      }
      console.log("DELETE:", r);
      setQuery(doSearchQuery(maa));
    };
    
    if (kohdedeleted) deleteKohde();
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
          kuvausteksti: kohdeinserted.kuvausteksti,
          kuva: kohdeinserted.kuva,

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
            kohdenimi: modifiedKohde.kohdenimi,
            maa: modifiedKohde.maa,
            paikkakunta: modifiedKohde.paikkakunta,
            kuvausteksti: modifiedKohde.kuvausteksti,
            kuva: modifiedKohde.kuva
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
    console.log("Setting matkakohde", matkakohde)
    setMuutettavaId(matkakohde.idmatkakohde);
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
            <Button variant="outlined" onClick={() => {
              setKohdeModified(undefined)
              setshowEditForm(true)
            }}>
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
  const [kuvausteksti, setKuvausteksti] = useState("");
  const [kuva, setKuva] = useState("");


  const tallennaClicked = () => {
    let id = -1;
    if (matkakohde) id = matkakohde.idmatkakohde;
    onSave({ id: id, maa, kohdenimi, paikkakunta, kuvausteksti, kuva });
  };

  useEffect(() => {
    if (matkakohde) {
      console.log("ifmatkakohde", matkakohde)
      setKohdeNimi(matkakohde.kohdenimi);
      setMaa(matkakohde.maa);
      setPaikkakunta(matkakohde.paikkakunta);
      setKuvausteksti(matkakohde.kuvausteksti);
      setKuva(matkakohde.kuva)
    }
  }, [matkakohde]);


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
          label="Kuvausteksti"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={kuvausteksti}
          onChange={(e) => setKuvausteksti(e.target.value)}
        />

      </Grid>
      <Grid item>
        <TextField
          id="filled-multiline-flexible"
          label="Kuvan url"
          multiline
          maxRows={4}
          variant="filled"
          value={kuva}
          onChange={(e) => setKuva(e.target.value)}
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

  /* <TableCell>{t.id}</TableCell>
    <TableCell>{t.kohdenimi}</TableCell>
    <TableCell>{t.maa}</TableCell>
    <TableCell>{t.paikkakunta}</TableCell>
    <TableCell>{t.kuvausteksti}</TableCell>
    <TableCell>
      <Button onClick={() => deleteClicked(t)}>
        Poista {t.id}
      </Button>
    </TableCell>
    <TableCell>
      <Button onClick={() => onEdit(t)}>
        Muokkaa kohdetta {t.id}
      </Button>
    </TableCell>  */
  const rows = data.map((t) => (
    <Grid item xs={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="Kuva"
          height="140"
          image={t.kuva}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {t.kohdenimi} - {t.maa} - {t.paikkakunta}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t.kuvausteksti}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => deleteClicked(t)}>
            Poista {t.id}
          </Button>
          <Button size="small" onClick={() => onEdit(t)}>
            Muokkaa kohdetta {t.id}
          </Button>
        </CardActions>
      </Card >
    </Grid>
  ))

  const deleteClicked = (a) => {
    
    const r = window.confirm(`Haluatko varmasti poistaa kohteen ${a.kohdenimi} maasta ${a.maa}?`);
    console.log("ärrä: ")
    if (r) onDelete(a);
  };

  return (
    <Grid container spacing={2} sx={{ width: "80%", margin: "auto" }}>
      {rows}
    </Grid>
  );
}
export default Matkakohde;