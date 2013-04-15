var Spotify = function()
{
	this.sayHi = function()
	{
		console.log("spotify says hi");
	}
}

exports.do = function(){return new Spotify();}