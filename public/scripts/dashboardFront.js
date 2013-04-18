$('document').ready(function(){
	socket = io.connect('127.0.0.1');
	socket.on('receive socket',function(socketName){
		$('head').append('<script src="'+socketName+'"></script>');
  	});
	//socket.emit('loadApps');
	socket.emit('loadApp','spotify');
});
function htmlEncode(html){return $('<div>').text(html).html();}
function htmlDecode(string){return $('<div>').html(string).text();}