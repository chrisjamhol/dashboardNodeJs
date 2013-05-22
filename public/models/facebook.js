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

	function getHomeFeedNextPage(feedWrapper,url,callback){
		var fFeed = feedWrapper.facebook();
		fFeed.getHomeFeedNextPage(url,function(homeFeedNextPageData){
			callback(homeFeedNextPageData);
		});
	}

	function getProfilePicture(feedWrapper,data,callback){
		var pictures = {};
		var fFeed = feedWrapper.facebook();
		var called = 0;
		for(var i = 0; i <= data.length-1; i++){
			fFeed.getProfilePicture(data[i]['from']['id'],function(url,id){
				if(typeof(pictures[id]) == "undefined"){
					pictures[id] = url.location;
				}else{}
				if(called >= data.length-1){callback(pictures);}else{called++;}
			});
		}
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
			s.emit('loadStyle','/public/styles/facebook.css');
			s.emit('loadScript','/public/scripts/facebookFront.js');
			getTemplateVars(view,function(templateVars){
				view.render('facebook',templateVars,function(err,html){
					s.emit('facebook_receiveHtml',html);
				});
			});
		});

		s.on('facebook_fetchHomeFeed',function(){
			getHomeFeed(feedWrapper,function(homeFeedData){
				getProfilePicture(feedWrapper,homeFeedData['data'],function(pictures){
					console.log(homeFeedData['data']);
					view.render('facebook_homeFeed',{"streamData": homeFeedData, "profilePicturesData": pictures},function(err,homeFeedHtml){
						var debug = 0;
						if(debug == 1){
							console.log("\t\t-------------- error-----------------");
							console.log(err);
							console.log("\t\t-------------- hmtl-----------------");
							console.log(homeFeedHtml);
						}
						s.emit('facebook_getHomeFeed',homeFeedHtml);
					});
				});
			});
		});

		s.on('facebook_fetchHomeFeedNextPage',function(url){
			var url = url.replace("https://graph.facebook.com","");
			getHomeFeedNextPage(feedWrapper,url,function(nextPageData){
				getProfilePicture(feedWrapper,nextPageData['data'],function(pictures){
					view.render('facebook_homeFeed',{'streamData': nextPageData, 'profilePicturesData': pictures},function(err,homeFeedHtml){
						var debug = 0;
						if(debug == 1){
							console.log("\t\t-------------- error-----------------");
							console.log(err);
							console.log("\t\t-------------- hmtl-----------------");
							console.log(homeFeedHtml);
						}
						s.emit('facebook_getHomeFeedNextPage',homeFeedHtml);
					});
				});
			});
		});
	}
}

exports.do = function(params,view,socket){return new Facebook(params,view,socket,db);}