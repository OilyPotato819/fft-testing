const express = require('express');
const fft = require('./fft.js');

const app = express();

app.use(express.static('graph'));

app.listen(3000, () => {
   console.log('Application started and Listening on port 3000');
});

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/graph/graph.html');
});

app.get('/getData', (req, res) => {
   res.json(fft);
});
