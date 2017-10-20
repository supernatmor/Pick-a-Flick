const express = require('express');

var app = express();

app.use('/', express.static(__dirname));

app.listen(5000, function() {
    console.log('Server listening on http://localhost:5000/');
});