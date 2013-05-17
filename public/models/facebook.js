var Facebook = function(params,view,socket,db)
{
	this.graph = require('../../server/node_modules/fbgraph');

	this.params = params;
	this.view = view;
	this.socket = socket;

	function getTemplateVars(callback){
		var templateVars = {};
		callback(templateVars);
	}

	function getHomeFeed(callback){
		var homeFeed = new HomeFeed(this.graph);
		homeFeed.getFeedHtml(function(feedHtml){
			callback(feedHtml);
		});
	}

	this.deploySocket = function()
	{
		createSocket(this.socket,this.view);
		return '/public/sockets/facebookSockets.js';
	}

	createSocket = function(socket,view)
	{
		var s = socket;
		s.on('facebook_getHtml',function(){
			getTemplateVars(function(templateVars){
				view.render('facebook',templateVars,function(err,html){
					s.emit('facebook_receiveHtml',html);
				});
			});
		});

		s.on('facebook_fetchHomeFeed',function(){
			getHomeFeed(function(homeFeed){
				s.emit('facebook_getHomeFeed',homeFeed);
			});
		});
	}
}

var HomeFeed = function(graph){
	this.homeFeed = "";
	this.getFeedHtml = function(callback){
		graph.get('/me/home', function(err, res) {
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
	    });
		callback(this.homeFeed);
	}
}

exports.do = function(params,view,socket){return new Facebook(params,view,socket,db);}