import React from 'react'
import { Navbar, Header } from '../common';
import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
//import Collapse from '@mui/material/Collapse';
import { Collapse } from 'react-collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import classNames from "classnames"; import { tabScrollButtonClasses } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';



const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

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

  const [activeIndex, setActiveIndex] = useState(null);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };



  const [tarinat, setTarinat] = useState([]);

  const [query, setQuery] = useState("");

  const [idtarina, setIdtarina] = useState("");
  const [matkaInserted, setMatkaInserted] = useState(null);
  const [matkadeleted, setMatkaDeleted] = useState(null);

  const [matkamodified, setMatkaModified] = useState(null);
  const [modifiedMatka, setModifiedMatka] = useState(null);
  const [kuvaInserted, setKuvaInserted] = useState(null);
  const [showEditForm, setshowEditForm] = useState(false);
  const [kuva, setKuva] = useState("");
  const [idmatkakohde, setIdMatkakohde] = useState();
  const [muutettavaid, setMuutettavaId] = useState(-1);

  const [muokkaaVailisää, setMuokkaaVaiLisää] = useState();


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
    console.log("HEILAHTI", tarina);
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

  // useEffect(() => {
  //   const insertKuva = async () => {
  //     const r = await fetch("http://localhost:3004/tarina/kuva", {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         idtarina: kuvaInserted.idtarina,
  //         kuva: kuvaInserted.kuva
  //         //kuvausteksti: matkaInserted.kuvausteksti,
  //         //kuva: matkaInserted.kuva,

  //       }),
  //     });
  //     console.log("INSERT:", r);
  //     setQuery(doSearchQuery(tarinat));
  //     setKuvaInserted(null);
  //   };
  //   if (kuvaInserted != null) insertKuva();
  // }, [kuvaInserted]);

  //---------------------LISÄÄ LOPPUU-------------------

  //---------------------MUOKKAA------------------------

  useEffect(() => {
    const modifyMatka = async () => {
      const r = await fetch(
        "http://localhost:3004/tarina/" + modifiedMatka.id,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            teksti: modifiedMatka.teksti
          }),
        }
      );
      console.log("MODIFY:", r);
      setQuery(doSearchQuery(tarinat));
      setModifiedMatka(null);
      setMatkaModified(null);
    };
    if (modifiedMatka != null) modifyMatka();
  }, [modifiedMatka]);

  //---------------------MUOKKAA LOPPU------------------

  const onCancel = () => {
    setshowEditForm(false);
    setMatkaModified(null);
  };

  const onSave = (newTarina) => {
    if (newTarina.id > 0) setModifiedMatka(newTarina);
    else setMatkaInserted(newTarina);
    setshowEditForm(false);
  };

  const onEdit = (tarina) => {
    console.log("Setting tarina", tarina)
    setMuutettavaId(tarina.idmatkakohde);
    setshowEditForm(true);
  };

  // const kuvaClicked = () =>{
  //   setKuvaInserted(true);
  // }


  return (
    <Grid sx={{ width: "80%", margin: "auto" }}>
      <Grid container spacing={0} sx={{ width: "80%", margin: "20px" }} >
        <Button variant="outlined" onClick={() => {
          setMatkaModified(undefined)
          setshowEditForm(true)
        }}>
          Lisää uusi
        </Button>
      </Grid>
      {showEditForm ? (

        <KohdeForm
          onSave={onSave}
          onCancel={onCancel}
          tarina={matkamodified}
        />
      ) : (
        <Grid container spacing={3} sx={{ width: "80%", margin: "auto" }}>
          {tarinat.length > 0 &&
            tarinat.map((tarina, i) => {
              return (
                <Grid item xs={4}>
                  <Card sx={{ maxWidth: 400 }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                          R
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label="settings">
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={tarina.kohdenimi}
                      subheader={tarina.pvm}
                    />
                    <CardMedia
                      component="img"
                      height="194"
                      image={tarina.kuva}
                      alt="Paella dish"
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {tarina.kuvausteksti}
                      </Typography>
                    </CardContent>

                    <Button size="small" onClick={() => deleteClicked(tarina)}>
                      Poista {tarina.id}
                    </Button>

                    <Button size="small" onClick={() => onEdit(tarina)}>
                      Muokkaa tarinaa {tarina.id}
                    </Button>

                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                      </IconButton>
                      <ExpandMore
                        expand={expanded}
                        onClick={event => setActiveIndex(
                          activeIndex === i ? null : i
                        )}
                        data-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>

                    </CardActions>
                    <Collapse isOpened={activeIndex === i} timeout="auto" unmountOnExit>
                      <div
                        className={classNames("alert alert-info msg", {
                          show: activeIndex === i,
                          hide: activeIndex !== i
                        })}
                      ><a>
                          <CardContent>
                            <Typography paragraph>Tarina {1 + i},  Matkakohde:{tarina.kohdenimi} </Typography>
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
                            <Typography paragraph>
                              <p>{tarina.teksti}</p>
                            </Typography>
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
                  />  */}
                          </CardContent>
                        </a>
                      </div>
                    </Collapse>
                  </Card>
                </Grid>
              )
            })}
        </Grid>
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
          label="ID (automaattinen)"
          id="filled-size-normal"
          disabled="true"
          defaultValue=""
          variant="filled"
          value={idmatkakohde}
          onChange={(e) => setIdMatkakohde(e.target.value)}
        />
      </Grid>

      <Grid item>
        <TextField
          label="Pvm (automaattinen)"
          id="filled-size-normal"
          disabled="true"
          defaultValue=""
          variant="filled"
          value={pvm}
          onChange={(e) => setPvm(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextareaAutosize
          placeholder='Tarina'
          id="filled-size-normal"
          defaultValue=""
          variant="filled"
          value={teksti}
          style={{ width: 210, height: 35 }}
          onChange={(e) => setTeksti(e.target.value)}
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