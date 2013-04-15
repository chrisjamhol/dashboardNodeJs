var HtmlBuilder = function(res, __publicPath)
{
	this.publicPath = __publicPath;
	this.res = res;
	_htmlCont = '<body>';
	_headCont = '';
	_start = '<!Doctype html><html>';
	_end = '</html>';
	_title = '<title></title>'

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

	this.addHead = function(){

	}
	this.resetTitle = function(){_title = '';}

	this.setTitel = function(title){_title = '<title>'+title+'</title>'}

	this.send = function(){this.res.write(_start+'<head>'+_title+_headCont+"</head>"+_htmlCont+'</body>'+_end);this.res.end();}

}

exports.do = function(res,__publicPath){return new HtmlBuilder(res,__publicPath);}