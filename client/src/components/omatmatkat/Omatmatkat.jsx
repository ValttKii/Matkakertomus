import React from 'react'
import { Navbar, Header } from '../common';
import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';



const doSearchQuery = (tarinat) => {
  let r = [];
  if (tarinat != "") r.push("tarinat=" + tarinat);

  // laitetaan AINA query-muuttujaan kellonaika millisekunteina (1.1.1970 lähtien)
  // näin joka kerta query:n sisältö on vähän erilainen kun painetaan Hae-nappia
  // REST-api ei välitä ylim. query-muuttujasta
  r.push(Date.now());

  return r.join("&");
};


export const Omatmatkat = () => {

  const [tarinat, setTarinat] = useState([]);

  const [query, setQuery] = useState("");

  const [idtarina, setIdtarina] = useState("");
  const [matkaInserted, setMatkaInserted] = useState(null);
  const [matkadeleted, setMatkaDeleted] = useState(null);
  const [matkamodified, setMatkaModified] = useState(null);
  const [kuvaInserted, setKuvaInserted] = useState(null);
  const [showEditForm, setshowEditForm] = useState(false);
  const [kuva, setKuva] = useState("");
  const [idmatkakohde, setIdMatkakohde] = useState();


  useEffect(() => {
    const fetchKohde = async () => {
      const response = await fetch("http://localhost:3004/tarina");
      let data = await response.json();
      //  const newdata = await Promise.all( data.map(async row => {
      //     const imagesresponse = await fetch("http://localhost:3004/tarina/" + row.idtarina + "/kuva");
      //     const imagesdata = await imagesresponse.json();

      //     return {...row, kuvat: imagesdata}

      //   }));
      let newdata = [];
      for (let row of data) {
        const imagesresponse = await fetch("http://localhost:3004/tarina/" + row.idtarina + "/kuva");
        const imagesdata = await imagesresponse.json();
        newdata.push({ ...row, kuvat: imagesdata })
      }
      setTarinat(newdata)

      console.log("data", newdata);
      //console.log()
    }
    fetchKohde();
  }, [])


  //-------------------POISTA----------------------------------

  console.log("tarinat", tarinat)

  useEffect(() => {
    console.log("matka del", matkadeleted)
    const deleteMatka = async () => {
      const r = await fetch(
        "http://localhost:3004/tarina/" + matkadeleted.idtarina,
        {
          method: "DELETE",
        }
      );
      console.log("DELETE:", r);
      setQuery(doSearchQuery(tarinat));
    };
    if (matkadeleted) deleteMatka();
  }, [matkadeleted]);

  const onDelete = (tarina) => {
    console.log("TARINA SAATANA", tarina);
    setMatkaDeleted(tarina);
  };

  const deleteClicked = (a) => {

    const r = window.confirm(`Haluatko varmasti poistaa tarinan ID:llä ${a.idtarina}?`);
    console.log("ärrä: ")
    if (r) onDelete(a);
  };

  //-----------------------------POISTA LOPPUU-------------

  //-----------------------------LISÄÄ---------------------


  useEffect(() => {
    const insertMatka = async () => {
      const r = await fetch("http://localhost:3004/tarina/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          idmatkakohde: matkaInserted.idmatkakohde,
          teksti: matkaInserted.teksti,
          pvm: matkaInserted.pvm,
          //kuvausteksti: matkaInserted.kuvausteksti,
          //kuva: matkaInserted.kuva,

        }),
      });
      console.log("INSERT:", r);
      setQuery(doSearchQuery(tarinat));
      setMatkaInserted(null);
    };
    if (matkaInserted != null) insertMatka();
  }, [matkaInserted]);

 /* useEffect(() => {
    const insertKuva = async () => {
      const r = await fetch("http://localhost:3004/tarina/kuva", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          idtarina: kuvaInserted.idtarina,
          kuva: kuvaInserted.kuva
          //kuvausteksti: matkaInserted.kuvausteksti,
          //kuva: matkaInserted.kuva,

        }),
      });
      console.log("INSERT:", r);
      setQuery(doSearchQuery(tarinat));
      setKuvaInserted(null);
    };
    if (kuvaInserted != null) insertKuva();
  }, [kuvaInserted]);*/

  //---------------------LISÄÄ LOPPUU-------------------

  const onCancel = () => {
    setshowEditForm(false);
    setMatkaModified(null);
  };

  const onSave = (newTarina) => {
    if (newTarina.id > 0) setMatkaModified(newTarina);
    else setMatkaInserted(newTarina);
    setshowEditForm(false);
  };

 /* const kuvaClicked = () =>{
    setKuvaInserted(true);
  }*/

  

  return (
    <Grid container spacing={2} sx={{ width: "80%", margin: "auto" }}>

      <Button variant="outlined" onClick={() => {
        setMatkaModified(undefined)
        setshowEditForm(true)
      }}>
        Lisää uusi
      </Button>
      {showEditForm ? (

        <KohdeForm
          onSave={onSave}
          onCancel={onCancel}
          tarina={matkamodified}
        />
      ) : (
        <div>

          {tarinat.length > 0 &&
            tarinat.map((tarina, i) => {
              return (
                <Grid sx={{ margin: "auto" }}>
                  <h3>Matka {tarina.kohdenimi} ID: {tarina.idmatkakohde}</h3>
                  <ImageList key={i} sx={{ width: 500, height: 200, margin: "auto" }} cols={3} rowHeight={164}>
                    {tarina.kuvat.map((item, i) => (

                      <ImageListItem key={i} sx={{ margin: "auto" }}>
                        <img
                          src={item.kuva}
                          // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          // alt={item.title}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                  <p>{tarina.teksti}</p>
                  <Button size="small" onClick={() => deleteClicked(tarina)}>
                    Poista {tarina.id}
                  </Button>
                  {/* <Button size="small" onClick={() => kuvaClicked()}>
                    LISÄÄ KUVA
                  </Button>
                  <TextField
                    label="Kuvan url"
                    id="filled-size-normal"
                    defaultValue=""
                    variant="filled"
                    value={kuva}
                    onChange={(e) => setKuva(e.target.value)}
                  />
                  <TextField
                    label="Matkakohde id"
                    id="filled-size-normal"
                    defaultValue=""
                    variant="filled"
                    value={idtarina}
                    onChange={(e) => setIdtarina(e.target.value)}
                  /> */}
                </Grid>
              )
            })}
        </div>
      )}
    </Grid >
  )

}

const KohdeForm = (props) => {
  const { onCancel, onSave, tarina } = props;

  const [teksti, setTeksti] = useState("");
  const [idmatkakohde, setIdMatkakohde] = useState("");
  const [pvm, setPvm] = useState("");
  const [kuvausteksti, setKuvausteksti] = useState("");
  const [kuva, setKuva] = useState("");


  const tallennaClicked = () => {
    let id = -1;
    if (tarina) id = tarina.idtarina;
    onSave({ id: id, teksti: teksti, pvm: pvm, idmatkakohde: idmatkakohde });
  };

  useEffect(() => {
    if (tarina) {
      console.log("iftarina", tarina)
      setIdMatkakohde(tarina.idmatkakohde);
      setPvm(tarina.pvm);
      setTeksti(tarina.teksti);

    }
  }, [tarina]);


  return (
    <Grid container spacing={5}
      direction={"column"}
      alignItems="center"
      justifyContent="center">
      {tarina ? (
        <Grid item >
          <h4>Matkan muokkaaminen</h4><br></br>
        </Grid>
      ) : (
        <Grid item>
          <br></br> <h3>Uuden matkan lisääminen</h3> <br></br>
        </Grid>
      )}
      <Grid item>
        <TextField
          label="id matkakohde"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={idmatkakohde}
          onChange={(e) => setIdMatkakohde(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="teksti"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={teksti}
          onChange={(e) => setTeksti(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Pvm"
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={pvm}
          onChange={(e) => setPvm(e.target.value)}
        />
      </Grid>

      {tarina ? (
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
      {tarina ? (
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
export default Omatmatkat;