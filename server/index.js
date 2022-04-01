const cors = require('cors')
const express = require('express')
const app = express()
const port = 8080
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Hello world!')
})
app.get('/matkakohde', (req, res)=>{
    const foo = {nimi:'yes'}
    res.json(foo)
})
app.post('/matkakohde', (req, res)=>{
    
})

app.listen(port, ()=>{
    console.log('Server started on port 8080')
})