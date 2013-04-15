var Dashboard = function(params,view)
{
	this.init = function()
	{	
		console.log(view);
		//view.init();
	}
}

exports.do = function(params,view){return new Dashboard(params,view);}