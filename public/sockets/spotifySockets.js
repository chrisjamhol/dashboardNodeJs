socket.on('spotify_receiveHtml',function(html) {
	$(html).appendTo('#appSpace');
});

socket.emit('spotify_getHtml');
