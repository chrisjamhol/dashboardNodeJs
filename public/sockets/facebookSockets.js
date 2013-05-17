socket.on('facebook_receiveHtml',function(html) {
	$(html).appendTo('#appSpace');
	socket.emit('facebook_fetchHomeFeed');
});

socket.on('facebook_getHomeFeed',function(html){
	$(html).appendTo('#homeFeed');
});

socket.emit('facebook_getHtml');