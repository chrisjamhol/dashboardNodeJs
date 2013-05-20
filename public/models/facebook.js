var Facebook = function(params,view,socket,db)
{
	this.feedWrapper = require('./feed.js').do(); //inherit Feed from feed.js
	this.params = params;
	this.view = view;
	this.socket = socket;

	function getTemplateVars(view,callback){
		var templateVars = {};
		callback(templateVars);
	}

	function getHomeFeed(feedWrapper,callback){
		var fFeed = feedWrapper.facebook();
		fFeed.getFeedHtml(function(homeFeedData){			
			callback(homeFeedData);
		});
	}

	this.deploySocket = function()
	{
		createSocket(this.socket,this.view,this.feedWrapper);
		return '/public/sockets/facebookSockets.js';
	}

	function createSocket(socket,view,feedWrapper)
	{
		var s = socket;
		s.on('facebook_getHtml',function(){
			s.emit('facebook_loadStyle','/public/styles/facebook.css');
			getTemplateVars(view,function(templateVars){
				view.render('facebook',templateVars,function(err,html){
					s.emit('facebook_receiveHtml',html);
				});
			});
		});

		s.on('facebook_fetchHomeFeed',function(){
			getHomeFeed(feedWrapper,function(homeFeedData){
				console.log(homeFeedData['data'][0]);
				view.render('facebook_homeFeed',{"streamData": homeFeedData},function(err,homeFeedHtml){
					console.log("\t\t-------------- error-----------------");
					console.log(err);
					console.log("\t\t-------------- hmtl-----------------");
					console.log(homeFeedHtml);
					s.emit('facebook_getHomeFeed',homeFeedHtml);
				});				
			});
		});
	}
}

exports.do = function(params,view,socket){return new Facebook(params,view,socket,db);}