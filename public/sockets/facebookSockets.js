socket.on('facebook_receiveHtml',function(html) {
	$(html).appendTo('#appSpace');
	socket.emit('facebook_fetchHomeFeed');
});

socket.on('facebook_getHomeFeed',function(html){
	$('#homeFeed').html(html);
	facebook_HomeFeedSetNextPageTrigger(socket);
});

socket.on('facebook_getHomeFeedNextPage',function(html){
	$('#homeFeed').append(html);
	facebook_HomeFeedSetNextPageTrigger(socket);
});

socket.emit('facebook_getHtml');