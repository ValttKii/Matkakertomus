import React from 'react'
import { Navbar, Header } from '../common';
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
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import classNames from "classnames";
import { useState, useEffect } from "react";

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


export const Porukanmatkat = () => {

  const [tarinat, setTarinat] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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

 

  console.log("tarinat", tarinat)

  return (
    <Grid sx={{ width: "80%", margin: "auto" }}>
      <h1>Kaikki tarinat</h1>
    <Grid container spacing={3} sx={{ width: "80%", margin: "auto" }}>
      {tarinat.length > 0 &&
        tarinat.map((tarina, i) => {
          return (
            <Grid item xs={4}>
            <Card sx={{ maxWidth: 400 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor:  "#4caf50"}} aria-label="Tarina">
                    T
                  </Avatar>
                }
                
                title={tarina.kohdenimi}
                subheader={tarina.pvm}
              />
              <CardMedia
                component="img"
                height="194"
                image={tarina.kuva}
                alt="tarina"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                   {tarina.kuvausteksti}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  
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
              <Collapse isOpened={activeIndex === i}  timeout="auto" unmountOnExit>
                <div
              className={classNames("alert alert-info msg", {
                    show: activeIndex === i,
                    hide: activeIndex !== i
                    })}
                ><a>
                <CardContent>
                  <Typography paragraph>Tarina {1 + i} matkakohde:{tarina.kohdenimi} </Typography>
                  <ImageList sx={{ width: 250, height: 200, margin: "auto" }} cols={2} rowHeight={164}>
                    {tarina.kuvat.map((item, i) => (

                      <ImageListItem key={i} sx={{ margin: "auto" }}>
                        <img
                          src={item.kuva}
                          srcSet={`${item.kuva}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          //alt={item.title}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))} </ImageList>
                  <Typography paragraph>
                    {tarina.teksti}
                  </Typography>
                  
                  <Typography>
                    
                  </Typography>
                </CardContent>
                </a>
                </div>
              </Collapse>
            </Card>
            </Grid>
          )
        })}
    </Grid >
    </Grid>
  )

}
export default Porukanmatkat;