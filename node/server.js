var express = require('express');
var app = express.createServer();

app.configure(function () {
    app.use(express['static'](__dirname + '/public'));
});

app.get('/', function (req, res) {
    res.redirect('/blog_comments/');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('server listening on port %d', app.address().port);
});
