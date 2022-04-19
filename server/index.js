
const express = require('express')
const app = express()
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json());

const port = 3004;
var cors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(cors);

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // ÄLÄ KOSKAAN käytä root:n tunnusta tuotannossa
    password: 'root',
    database: 'mykanta',
    dateStrings: true
});



app.get('/matkakohde', (req, res) => {

    let maa = req.query.maa;

    let query = "SELECT * from matkakohde WHERE 1=1 "

    if (maa) query = query + " AND maa LIKE '" + maa + "%" + "'";

    connection.query(query, function (error, result, fields) {
        console.log("done")
        if (error) {
            console.log("Virhe", error);
            res.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            res.statusCode = 200;
            res.json(result);
        }
    })

})
app.get('/matkakohde/:id', (req, res) => {

    let id = req.params.id;

    let query = "SELECT * FROM matkakohde where idmatkakohde = ? "

    connection.query(query,[id], function (error, result, fields) {
        console.log("done")
        if (error) {
            console.log("Virhe", error);
            res.json({ status: "NOT OK", msg: "Tekninen virhe!" }).status(500);
        }
        else {
            res.statusCode = 200;
            res.json(result[0]);
        }
    })

})
app.post('/matkakohde', (req, res) => {

    console.log("/asiakastyyppi. BODY:", req.body);

    let kohdenimi = req.body.kohdenimi;
    let maa = req.body.maa;
    let paikkakunta = req.body.paikkakunta;
    let kuvausteksti = req.body.kuvausteksti;
    let kuva = req.body.kuva;

    let query = "INSERT INTO matkakohde (kohdenimi, maa, paikkakunta, kuvausteksti, kuva) VALUES (?, ?, ?, ?, ?) ";

    console.log("query:" + query);

    connection.query(query, [kohdenimi, maa, paikkakunta, kuvausteksti, kuva], function (error, result, fields) {


        if (error) {
            console.log("Virhe", error);
            res.statusCode = 400;
            //res.json({ status: "NOT OK", message: "Pakollisia tietoja puuttuu:" + kentat });
        }
        else {
            console.log("R:", result);
            res.statusCode = 201;
            res.json({ kohdenimi: kohdenimi, maa: maa, paikkakunta: paikkakunta, kuvausteksti: kuvausteksti, kuva: kuva })
        }

    });
})
app.put('/matkakohde/:id', (req, res) => {
    let id = req.params.id;
    let kohdenimi = req.body.kohdenimi;
    let maa = req.body.maa;
    let paikkakunta = req.body.paikkakunta;
    let kuvausteksti = req.body.kuvausteksti;
    let kuva = req.body.kuva;

    let query = "UPDATE matkakohde SET kohdenimi=?, maa=?, paikkakunta=?, kuvausteksti=?, kuva=? where idmatkakohde = ? ";

    connection.query(query, [kohdenimi, maa, paikkakunta, kuvausteksti, kuva, id], function (error, result, fields) {

        if (error) {
            console.log("Virhe", error);
            res.statusCode = 400;
            
        }
        else {
            console.log("R:", result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    })

})
app.delete('/matkakohde/:id', (req, res) => {


    let id = req.params.id;

    let query = "DELETE FROM matkakohde where idmatkakohde = ? "

    connection.query(query, [id], function(error, result, fields){
        if (error) {
            console.log("Virhe", error);
            res.statusCode = 400;
            res.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            console.log("R:", result);
            res.statusCode = 204;   // 204 -> No content -> riittää palauttaa vain statuskoodi

            // HUOM! Jotain pitää aina palauttaa, jotta node "lopettaa" tämän suorituksen.
            // Jos ao. rivi puuttuu, jää kutsuja odottamaan että jotain palautuu api:sta
            res.json()
        }
    })

})
app.get('/tarina', (req, res) => {

   

    let query = "SELECT * from tarina INNER JOIN matkakohde ON tarina.idmatkakohde = matkakohde.idmatkakohde"

    connection.query(query, function (error, result, fields) {
        console.log("done")
        if (error) {
            console.log("Virhe", error);
            res.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            res.statusCode = 200;
            res.json(result);
        }
    })

})

app.get('/tarina/:id/kuva', (req, res) => {

   const id = req.params.id;

    let query = "SELECT * from kuva where idtarina = " + id;

    connection.query(query, function (error, result, fields) {
        console.log("done")
        if (error) {
            console.log("Virhe", error);
            res.json({ status: "NOT OK", msg: "Tekninen virhe!" });
        }
        else {
            res.statusCode = 200;
            res.json(result);
        }
    })
})

app.listen(port, () => {
    console.log('Server started on port 3004')
})