var Feed = function()
{
	this.facebook = function()
	{
		var graph = require('../../server/node_modules/fbgraph'),
			fFeed = new facebookFeed(graph);
		return fFeed;
	}

	this.deploySocket = function()
	{
		createSocket(this.socket,this.view);
		return '/public/sockets/facebookSockets.js';
	}

	createSocket = function(socket,view)
	{
		var s = socket;
		s.on('',function(){

		});
	}
}

var facebookFeed = function(graph){
	this.graph = graph;
	this.homeFeed = "";
	this.getFeedHtml = function(callback){
		var fbdata = fetchApi(graph,'/me/home');
		/*graph.auth()
		.get('/me/home', function(err, res) {
	        var stream = res;
	        for(var i=0; i <= stream.data.length-1; i++)
	        {
	          if(stream.data[i]['message'] != null)
	          {
	            this.homeFeed += '<div><p>'+stream.data[i]['message']+'</p></div><br />';
	          }
	          else if(stream.data[i]['story'] != null)
	          {
	            this.homeFeed += '<div><p>'+stream.data[i]['story']+'</p></div><br />';
	          }
	        }
	    });*/
		this.homeFeed = "<p><strong>hi it's working :)</strong></p>";
		callback(this.homeFeed);
	}

	function fetchApi(graph,querystring)
	{
		console.log("getting login");
		getLogin(this.graph,function(credentials){
			console.log("got login");
			if(!credentials.error)
			{
				graph.authorize(credentials, function (err, facebookRes) {
			      	graph.get('/me/home', function(err, res) {
				        console.log(err);
				        var stream = res;
				        /*for(var i=0; i <= stream.data.length-1; i++)
				        {
				          if(stream.data[i]['message'] != null)
				          {
				            console.log(stream.data[i]['message']);
				          }
				          else if(stream.data[i]['story'] != null)
				          {
				            console.log(stream.data[i]['story']);
				          }
				        }*/
			      });
			  	});
			}
		});


	}

	function getLogin(graph,callback)
	{
		var options = {
						host: 'dashboardnode.pagekite.me',
						path: '/doauth/facebook'
					};
		var tokenFetch = require('http').get(options,function(res){
			console.log("got login");
			console.log(res.query);
			/*if(res.query.code)
			{
				//fetch login
			}*/

			credentials = {

								};
			callback(credentials);
		}).on('error', function(e){
			console.log('error: '+e.message);
			console.log( e.stack );
		});
	}
}

exports.do = function(){return new Feed();}