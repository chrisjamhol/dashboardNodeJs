$('document').ready(function(){
	socket = io.connect('127.0.0.1');
	socket.on('receive socket',function(socketName){
		$('head').append('<script src="'+socketName+'"></script>');
  	});
	socket.emit('loadApps');
	//socket.emit('loadApp','facebook');

	socket.on('loadScript',function(script){$('head').append('<script src="'+script+'"></script>');});
	socket.on('loadStyle',function(style){$('head').append('<link rel="stylesheet" type="text/css" href="'+style+'">');});
});
function htmlEncode(html){return $('<div>').text(html).html();}
function htmlDecode(string){return $('<div>').html(string).text();}