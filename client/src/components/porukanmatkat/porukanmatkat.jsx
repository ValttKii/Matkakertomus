import React from 'react'
import { Navbar, Header } from '../common';
import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';



export const Porukanmatkat = () => {

  const [tarinat, setTarinat] = useState([]);



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
    <Grid container spacing={2} sx={{ width: "80%", margin: "auto" }}>

      {tarinat.length > 0 &&
        tarinat.map((tarina, i) => {
          return (
            <Grid sx={{margin: "auto"}}>
                <h3>Matkakohde {tarina.kohdenimi} ID: {tarina.idmatkakohde}</h3>
              <ImageList key={i} sx={{ width: 500, height: 200, margin: "auto"}} cols={3} rowHeight={164}>
                {tarina.kuvat.map((item, i) => (

                  <ImageListItem key={i} sx={{margin: "auto"}}>
                    <img
                      src={item.kuva}
                    // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    // alt={item.title}
                    // loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              
              <p>{tarina.teksti}</p>
            </Grid>
        )})}
    </Grid >
  )

}
export default Porukanmatkat;