var HtmlBuilder = function(res, __publicPaths)
{
	this.publicPaths = __publicPaths;
	this.publicPath = __publicPaths.publicPathViews;
	this.res = res;
	_htmlCont = '<body>';
	_headCont = '';
	_start = '<!Doctype html><html>';
	_end = '</html>';
	_title = '<title></title>';
	this.fs = require('fs');

	this.render = function(file,options,callback){
		if(typeof(options) == 'undefined'){
			this.res.render(file);}
		else if(typeof(options) == 'function'){
			this.res.render(file,function(err,html){options(err,html);});}
		else if(typeof(callback) == 'function'){
			this.res.render(file,options,function(err,html){
				if(typeof(callback) == 'function'){callback(err,html);}});
			}
		else{
			this.res.render(file,options);}
	}

	this.addBody = function(file,options,callback){
		if(typeof(options)==='function'){callback = options;}
		if(typeof(options)==='undefined'||typeof(options)==='function'){options = {};}
		this.render(file,options,function(err,html){_htmlCont += html;if(typeof(callback)=='function'){callback(err,html);}});
	}
	this.resetBody = function(){_htmlCont = '<body>';}

	this.addHead = function(newheadcont){
		_headCont += newheadcont;
	}
		this.addScript = function(src){this.addHead('<script src="'+src+'"></script>');}
		this.addStyle = function(href){this.addHead('<link rel="stylesheet" type="text/css" href="'+href+'">');}
	this.resetTitle = function(){_title = '';}

	this.setTitel = function(title){_title = '<title>'+title+'</title>'}

	this.send = function(){this.res.write(_start+'<head>'+_title+_headCont+"</head>"+_htmlCont+'</body>'+_end);this.res.end();}

	this.useJquery = function(option){
		if(option){this.addHead('<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>');}else{}
	}

	this.useSocketIo = function(option){
		if(option){this.addHead('<script src="socket.io/socket.io.js"></script>');}else{}
	}
}

exports.do = function(res,__publicPaths){return new HtmlBuilder(res,__publicPaths);}