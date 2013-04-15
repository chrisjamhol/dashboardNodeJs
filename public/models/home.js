var Home = function(params,view)
{
	this.view = view;
	this.sayHi = function(){
		console.log("hiii");
		this.view.addBody('home');
		this.view.send();
	}
}
exports.do = function(params,view){return new Home(params,view);}