var Home = function(params,view)
{
	this.view = view;
	this.sayHi = function(){
		this.view.addBody('home');
		this.view.send();
	}
}
exports.do = function(params,view){return new Home(params,view);}