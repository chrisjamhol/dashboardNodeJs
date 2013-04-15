fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host, port = config.port;

var path = require("path");
var __publicPath = path.join(__dirname, '../', 'public');
var __htmlBuilder = path.join(__dirname, '../','public/commandbridge/htmlBuilder.js');
var express = require('express')
    ,app = express()
    ,io = require('socket.io').listen(app);

console.log("Started");
app.use(app.router);
app.use(express.static(__publicPath));

app.get('/', function (req, res) {
      res.sendfile(__publicPath+'/login/login.html');
      var view = require(__htmlBuilder).do();
      var dashboard = require(__publicPath+"/dashboard/dashboard.js").do(req,view);
      dashboard.init();
});

app.get('/:widgetname', function (req, res) {
    if(req.params['widgetname'] != "favicon.icon")
    {
      res.sendfile(__publicPath+"/"+req.params['widgetname']+'/widget.html');
      var widget = require(__publicPath+"/"+req.params['widgetname']+"/widget.js").do(req);
      widget.sayHi();
    }    
});

app.get('/test',function(req, res){
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