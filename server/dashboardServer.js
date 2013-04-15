fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host, port = config.port;
  //setting up static paths
var path = require("path");
var __publicPathViews = path.join(__dirname, '../', 'public/views/');
var __modelsPath = path.join(__dirname, '../','public/models/');
var __htmlBuilder = path.join(__dirname, '../','public/commandbridge/htmlBuilder.js');
  //create express server
var express = require('express')
    ,app = express()
    ,io = require('socket.io').listen(app);
console.log("Started");
  //config express server
app.use(app.router);
app.use(express.static(__publicPathViews));
app.set('views', __publicPathViews);
app.set('view engine','ejs');
app.set('view options',{open:"<%",close:"%>"});

//-----routes--------

app.get('/', function (req, res) {
      var view = require(__htmlBuilder).do(res,__publicPathViews);
      var dashboard = require(__modelsPath+"dashboard.js").do(req,view);
      dashboard.initLayout();
});

app.get('/:widgetname', function (req, res) {
    if(req.params['widgetname'] != "favicon.ico")
    {
      var view = require(__htmlBuilder).do(res,__publicPathViews);
      var widget = require(__modelsPath+req.params['widgetname']+".js").do(req,view);
      widget.sayHi();
    }
});

app.get('/test',function(req, res){
  res.sendfile(__publicPathViews+'/test.html');
});

//setting up websockeds

io.sockets.on('connection', function (socket) {
  console.log("socket working");
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

app.listen(80);