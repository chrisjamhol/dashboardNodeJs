fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host, port = config.port;
  //setting up static paths
var path = require("path");
var __publicPaths = {
    publicPathViews : path.join(__dirname, '../', 'public/views/'),
    publicPathScripts : path.join(__dirname, '../', 'public/scripts/'),
    publicPathStyles : path.join(__dirname, '../', 'public/styles/'),
    publicPathStyles : path.join(__dirname, '../', 'public/styles/'),
    publicPathSockets : path.join(__dirname, '../', 'public/sockets/'),
    publicImagePath : path.join(__dirname, '../', 'public/images/')
}
var __modelsPath = path.join(__dirname, '../','public/models/');
var __htmlBuilder = path.join(__dirname, '../','public/commandbridge/htmlBuilder.js');
  //create express server + socked.io connection
var express = require('express')
    ,app = express()
    ,http = require('http')
    ,server = http.createServer(app)
    ,io = require('socket.io').listen(server);
    server.listen(80);
    console.log("Server started");
  //config express server
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(app.router);
app.use(express.compress());
app.use(express.static(__publicPaths.publicPathViews));
app.set('views', __publicPaths.publicPathViews);
app.set('view engine','ejs');
app.set('view options',{open:"<%",close:"%>"});
  //creating database connections
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var host = 'localhost', port = 27017;
db = new Db('dashboard', new Server(host,port,{auto_reconnect:true}),{safe:false});
//db.collection('user').find({}).toArray(function(err,data){console.log(err);console.log(data);});

//-----routes--------
view = "";
params = "";
app.get('/', function (req, res) {
      view = require(__htmlBuilder).do(res,__publicPaths);
      params = req;
      var dashboard = require(__modelsPath+"dashboard.js").do(params,view,db);
      dashboard.initLayout();
});

app.get('/:widgetname', function (req, res) {
    if(req.params['widgetname'] != "favicon.ico")
    {
      view = require(__htmlBuilder).do(res,__publicPaths);
      params = req;
      var widget = require(__modelsPath+req.params['widgetname']+".js").do(params,view);
      widget.sayHi();
    }
});

app.get('/auth/facebook', function(req, res) {

    if (!req.query.code) {
      graph = require('fbgraph');
      var grapfConf = {
          client_id:      '521160077934696'
        , client_secret:  '3813023f0a92c427240714cd976828b8'
        , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
        , redirect_uri:   'http://dashboardnode.pagekite.me/auth/facebook'
      };
      console.log("1");
      var authUrl = graph.getOauthUrl({
          "client_id":     grapfConf.client_id
        , "redirect_uri":  grapfConf.redirect_uri
        , "scope":         grapfConf.scope
      });

      if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
        console.log("2");
        res.redirect(authUrl);
      } else {  //req.query.error == 'access_denied'
        res.send('access denied');
      }
    }
    console.log("2");
    res.redirect('/');
});

//piping css and js
app.get('/public/scripts/:scriptName',function(req,res){res.sendfile(__publicPaths.publicPathScripts+req.params['scriptName']);});
app.get('/public/styles/:styleName',function(req,res){res.sendfile(__publicPaths.publicPathStyles+req.params['styleName']);});
app.get('/public/sockets/:socketName',function(req,res){res.sendfile(__publicPaths.publicPathSockets+req.params['socketName']);});
app.get('/public/images/:imageName',function(req,res){res.sendfile(__publicPaths.publicImagePath+req.params['imageName']);});

app.get('/test',function(req, res){
  res.sendfile(__publicPaths.publicPathViews+'/test.html');
});

//setting up websockeds
io.set('log level', 1); //no debug messages
io.sockets.on('connection', function (socket) {

  socket.on('loadApps',function(){
    db.collection('user',function(err,users){
        users.find({name:"chris"}).toArray(function(err,user){
            db.collection('apps',function(err,apps){
                apps.find({id:{$in:user[0]['apps']}}).toArray(function(err,userapps){
                    userapps.forEach(function(userapp){
                        var widget = require(__modelsPath+userapp['name']+".js").do(params,view,socket,db);
                        socket.emit('receive socket',widget.deploySocket());
                    });
                });
            });
        });
    });

  });

  socket.on('loadApp',function(appname){
        var widget = require(__modelsPath+appname+".js").do(params,view,socket,db);
        socket.emit('receive socket',widget.deploySocket());
  });

});