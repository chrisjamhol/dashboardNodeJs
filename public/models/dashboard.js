var Dashboard = function(params,view)
{
	this.view = view;

	this.initLayout = function(){
		this.view.setTitel('Dashboard :)');
		this.view.addBody('dashboard',{name:"chris"},function(err,html){});
		this.view.addBody('spotify');
		this.view.send();

		/*this.view.render('dashboard',{name:"chris"},function(err,html){

		});*/
	}
}

exports.do = function(params,view){return new Dashboard(params,view);}