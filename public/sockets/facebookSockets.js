socket.on('facebook_receiveHtml',function(html) {
	$(html).appendTo('#appSpace');
});

socket.emit('facebook_getHtml');