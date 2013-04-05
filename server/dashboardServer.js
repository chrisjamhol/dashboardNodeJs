fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host, port = config.port;

var path = require("path");
var __publicPath = path.join(__dirname, '../', 'public');
var express = require('express')
    ,app = express()
    ,io = require('socket.io').listen(app);

console.log("Started");
app.use(app.router);
app.use(express.static(__publicPath));

app.get('/', function (req, res) {
    console.log("check");
    res.sendfile(__dirname+'/index.html');
});

app.get('/test',function(req, res){
  console.log("test");
  res.sendfile(__publicPath+'/test.html');
});

io.sockets.on('connection', function (socket) {
  console.log("socket working");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

app.listen(80);