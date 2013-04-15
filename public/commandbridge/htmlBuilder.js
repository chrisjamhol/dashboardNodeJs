var HtmlBuilder = function(res)
{
	this.init = function()
	{
		console.log("HtmlBuilder says hi");
	}
}

exports.do = function(res){return new HtmlBuilder(res);}