var express = require('express'),
    htmlDir = './dist/'
var app = express();


//Set content directories
app.use(express.static(__dirname + '/dist'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use("/image", express.static(__dirname + '/image'));

app.get('/', function(request, response) {
    response.sendfile(htmlDir + 'index.html');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});