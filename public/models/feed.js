var Feed = function()
{
	this.facebook = function()
	{
		var graph = require('../../server/node_modules/fbgraph'),
			fFeed = new facebookFeed(graph);
		return fFeed;
	}
}

var facebookFeed = function(graph){
	this.graph = graph;
	this.homeFeed = "";
	this.getFeedHtml = function(callback){
		fetchApi(graph,'/me/home',function(stream){
			callback(stream);
		});
	}

	this.getHomeFeedNextPage = function(url,callback){
		fetchApi(graph,url,function(stream){
			callback(stream);
		});
	}

	this.getProfilePicture = function(id,callback){
		fetchApi(graph,'/'+id+'/picture/',function(url){
			callback(url,id);
		});
	}

	function fetchApi(graph,querystring,callback)
	{
		getLogin(graph,function(credentials){
			if(credentials.error != "null")
			{
				graph.get(querystring,function(err,res){
					callback(res);
				});
			}
		});
	}

	function getLogin(graph,callback)
	{
		var options = {
						host: 'dashboardnode.pagekite.me',
						path: '/get/fbcode'
					};
		var tokenFetch = require('http').get(options,function(res){
			var codePart = "";
			res.on('data',function(chunk){
				codePart += chunk;
			});
			res.on('end',function(){
				var codeData = JSON.parse(codePart);
				if(codeData.error)
				{
					credentials = {"error": codeData.error};
				}
				else
				{
					credentials = {
								  "client_id":      '521160077934696'
							    , "redirect_uri":   'http://dashboardnode.pagekite.me/login'
							    , "client_secret":  '3813023f0a92c427240714cd976828b8'
							    , "code":           codeData.code
								};
				}
				graph.authorize(credentials, function (err, facebookRes) {
			      	var error = "null";
			      	if(err){error = err;}
			      	callback(error);
			  	});
			});
		}).on('error', function(e){
			console.log('error: '+e.message);
			console.log( e.stack );
		});
	}
}

exports.do = function(){return new Feed();}