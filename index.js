const express = require('express')
const app = express()
const port = 3000


app.get('/',function(req,res) {
  res.sendFile(__dirname + '/custView/inputForm.html');
});


app.get('/',function(req,res) {
  res.sendFile('inputForm.html');
});

app.get('/', (req, res) =>{

  res.send('This is the API Support Challenge HTML')
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.delete('/', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.listen(port, () => {
  console.log(`API Support Chal listening on port ${port}`)
})
