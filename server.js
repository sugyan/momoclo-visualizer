var express = require('express');
var app = express.createServer();

app.configure(function () {
    app.use(express['static'](__dirname + '/public'));
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server listening on port %d', app.address().port);
});
