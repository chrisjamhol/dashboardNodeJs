var Facebook = function(params,view,socket,db)
{
	this.feedWrapper = require('./feed.js').do(); //inherit Feed from feed.js
	this.params = params;
	this.view = view;
	this.socket = socket;

	function getTemplateVars(view,callback){
		view.addStyle('/public/styles/facebook.css');
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
			getTemplateVars(view,function(templateVars){
				view.render('facebook',templateVars,function(err,html){
					s.emit('facebook_receiveHtml',html);
				});
			});
		});

		s.on('facebook_fetchHomeFeed',function(){
			getHomeFeed(feedWrapper,function(homeFeedData){
				view.render('facebook_homeFeed',{"streamData": homeFeedData},function(err,homeFeedHtml){
					s.emit('facebook_getHomeFeed',homeFeedHtml);
				});				
			});
		});
	}
}

exports.do = function(params,view,socket){return new Facebook(params,view,socket,db);}