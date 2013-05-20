socket.on('facebook_receiveHtml',function(html) {
	$(html).appendTo('#appSpace');
	socket.emit('facebook_fetchHomeFeed');
});

socket.on('facebook_getHomeFeed',function(html){
	$('#homeFeed').html(html);
});

socket.on('facebook_loadStyle',function(style){
	$('head').append('<link rel="stylesheet" href="'+style+'" type="text/css" />');
});

socket.emit('facebook_getHtml');