var Spotify = function(params,view,socket,db)
{
	this.params = params;
	this.view = view;
	this.socket = socket;

	function getTemplateVars(callback){
		var playlists = ['<iframe src="https://embed.spotify.com/?uri=spotify:track:2wuXWa84jPUoqN09HwZKs6" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>','<iframe src="https://embed.spotify.com/?uri=spotify:track:2wuXWa84jPUoqN09HwZKs6" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>'];
		var templateVars = {
								heading : 'The Spotifywidget',
								playlists : playlists
							}
		callback(templateVars);
	}

	this.deploySocket = function()
	{
		createSocket(this.socket,this.view);
		return '/public/sockets/spotifySockets.js';
	}

	createSocket = function(socket,view)
	{
		var s = socket;
		s.on('spotify_getHtml',function(){
			getTemplateVars(function(templateVars){
				view.render('spotify',templateVars,function(err,html){
					s.emit('spotify_receiveHtml',html);
				});
			});
		});
	}
}

exports.do = function(params,view,socket){return new Spotify(params,view,socket,db);}