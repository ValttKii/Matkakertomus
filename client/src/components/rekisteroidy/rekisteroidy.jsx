import React, { useState, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Navbar, Header } from '../common';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/etusivu">
        Rautavaara Software
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export function Rekisteroidy(props) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const [matkaajaInserted, setMatkaajaInserted] = useState(null);
  const [firstnameReg, setFirstnameReg] = useState('');
  const [lastnameReg, setLastnameReg] = useState('');
  const [emailReg, setEmailReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [ matkaaja, setMatkaaja ] = useState('');


  const onSave = (newMatkaaja) => {
    console.log("MO", newMatkaaja)
     setMatkaajaInserted(newMatkaaja);
  };

  const tallennaClicked = () => {
    console.log("MOMO", firstnameReg)
    onSave({ firstnameReg, lastnameReg, emailReg, passwordReg });
  };


 
  

  useEffect(() => {
    const insertMatkaaja = async () => {
      const r = await fetch("http://localhost:3004/matkaaja", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          etunimi: matkaajaInserted.firstnameReg,
          sukunimi: matkaajaInserted.lastnameReg,
          email: matkaajaInserted.emailReg,
          password: matkaajaInserted.passwordReg,

        }),
      });
      console.log("MATKAAJAINSERT:", matkaajaInserted);
      console.log("INSERT:", r);
      setMatkaajaInserted(null);
    };
    if (matkaajaInserted != null) insertMatkaaja();
  }, [matkaajaInserted]);

  

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Rekisteröidy
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Etunimi"
                  autoFocus
                  value={firstnameReg}
                  onChange={(e) => setFirstnameReg(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Sukunimi"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastnameReg}
                  onChange={(e) => setLastnameReg(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Sähköposti"
                  name="email"
                  autoComplete="email"
                  value={emailReg}
                  onChange={(e) => setEmailReg(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Salasana"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={passwordReg}
                  onChange={(e) => setPasswordReg(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => tallennaClicked()}
            >
              Rekisteröi käyttäjä
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/kirjaudu" variant="body2">
                  Onko sinulla jo käyttäjä? Kirjaudu tästä sisään!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
export default Rekisteroidy;