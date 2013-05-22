var facebook_HomeFeedSetNextPageTrigger = function(socket){
	var socket = socket;
	$('#facebook_homeFeedNextPageButton').unbind('click').click(function(){
		console.log($('#facebook_homeFeedNextPageButton').data('url'));
		socket.emit('facebook_fetchHomeFeedNextPage',$('#facebook_homeFeedNextPageButton').data('url'));
		$(this).remove();
	});
}