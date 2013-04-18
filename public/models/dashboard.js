var Dashboard = function(params,view,db)
{
	this.view = view;
	tempVars = {};

	this.initLayout = function(){
		this.view.setTitel('Dashboard :)');
		this.view.useJquery(true);
		this.view.addStyle('/public/styles/dashboard.css');
		this.view.useSocketIo(true);
		this.view.addScript('/public/scripts/dashboardFront.js');
		//this.view.addScript('/public/scripts/dashboardSocked.js');
		getAppNavItems(function(){
			console.log(tempVars);
			this.view.addBody('dashboard',tempVars);
			this.view.send();
		});
	}

	function getAppNavItems(callback){
		var appNavItems = "";
		db.collection('user',function(err,users){
			users.find({id:params.userId}).toArray(function(err,user){
				db.collection('apps',function(err,userapps){
					userapps.find({id:{$in:user[0]['apps']}}).toArray(function(err,apps){
						apps.forEach(function(app){
							appNavItems += '<li><img src="'+app.logo+'" /></li>';
						});
						console.log(appNavItems);
						tempVars.appNavItems = appNavItems;
						callback();
					});
				});
			});
		});
	}
}

exports.do = function(params,view){return new Dashboard(params,view,db);}