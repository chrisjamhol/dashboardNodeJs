var widgetSupervisor = function(params)
{
	this.sayHi = function()
	{
		console.log("widgetsupervisor says hi");
	}
}

exports.do = function(params){return new widgetSupervisor(params);}