//	The MIT License (MIT) 
//	
//	
//	Copyright (c) 2014 Kevin R. Pastorino 
//	 
//	
//	Permission is hereby granted, free of charge, to any person obtaining a copy 
//	of this software and associated documentation files (the "Software"), to deal 
//	in the Software without restriction, including without limitation the rights 
//	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
//	copies of the Software, and to permit persons to whom the Software is 
//	furnished to do so, subject to the following conditions: 
//	 
//	
//	The above copyright notice and this permission notice shall be included in all 
//	copies or substantial portions of the Software. 
//	 
//	
//	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
//	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
//	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
//	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
//	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
//	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
//	SOFTWARE. 

//	http://vertx.io/core_manual_js.html#http-server-responses

//	http://vertx.io/mod-lang-js/docs/1.1.0/http.HttpClientResponse.html
//	http://vertx.io/install.html
//	http://vertx.io/docs.html
//	http://vertx.io/examples.html

//	http://vertx.io/mods_manual.html#what-is-a-vertx-module
//	When a module is executing if it uses vertx to access the filesystem it will, by default, see the module directory as the current directory.

/*
var vertx = require('vertx')
vertx.createHttpServer().requestHandler(function(req) {
   req.response.sendFile('./web/index.html'); // Always serve the index page
}).listen(8080, 'foo.com')
*/

//	vertx version
//	vertx run vertxServer.js

//var console			= require( 'vertx/console' );
var vertx 			= require( 'vertx' )
var Version			= require( '../../Libs/Any/execVersion.js' 	).Version;
var AnyUtils		= require( '../../Libs/Any/execAnyUtils.js'	).AnyUtils;
var HttpServerBase	= require( './HttpServerBase.js' );

function VertxHttpServer ()
{
	HttpServerBase.call	( this );
	this.sockJsServer	= null;
};

AnyUtils.inherit ( VertxHttpServer, HttpServerBase );

VertxHttpServer.prototype.execute = function ( params )	{

    var jsonResult  = {};

    try
    {
    	if ( this.console === null )
    		this.console = params.console;
    	
        //  Vertx doesn't provide a built in console.
        //  So, it needs to be passed in from vertxConfig.js 
        //this.console	= params.console;
        //this.console.log( "VertxHttpServer, execute, 1 = " );

        jsonResult  [ params.returnIn ] = params.defaultValue;

        //this.console.log( "vertxHttpServer, execute, 1 = " );

        if ( Version.versionOK( params.v, 1, 0, 0 ) === false )
        {
            jsonResult  [ params.returnIn ] = params.defaultValue;
            params      .session.message	= params.v + " is not handled by this implementation";
        }
        else
        {
            //this.console.log( "vertxHttpServer, execute, 2 = " );
            
            switch ( params.job )
	        {
		        case "getSockJsServer": jsonResult[ params.returnIn ] = this.getSockJsServer	(); 			break;
		        case "setSockJsServer":	jsonResult[ params.returnIn ] = this.setSockJsServer	( params ); 	break;
		
		        default:
                {
        			var	result = HttpServerBase.prototype.execute.call	( this, params );
	        		jsonResult[ params.returnIn ] = result[  params.returnIn  ]; 
	        		
                    break;
                }
	        }
        }
    }

    catch ( err )
    {
        this.console.log( "vertxHttpServer, execute, catch = " + err );
        jsonResult  [ params.returnIn ] = params.defaultValue;
    }

    //this.console.log( "vertxHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
    return jsonResult;
};

VertxHttpServer.prototype.end = function ( params )	{
	
	params.session.response.end	( params.data.message );
};

VertxHttpServer.prototype.setHeader = function ( params )	{
	
	params.session.response.headers()	.set( params.data.property, params.data.value );
};

VertxHttpServer.prototype.statusCode = function ( params )	{
	
    //this.console.log( "this.statusCode, 1 = " + params );
    //this.console.log( "this.statusCode, 2 = " + params.session );
    //this.console.log( "this.statusCode, 3 = " + params.session.response );
    //this.console.log( "this.statusCode, 4 = " + params.session.response.statusCode );
    //this.console.log( "this.statusCode, 5 = " + params.data );
    //this.console.log( "this.statusCode, 6 = " + params.data.statusCode );
	params.session.response.statusCode	= params.data.statusCode;
};

VertxHttpServer.prototype.sendFile = function ( session, pathname, successCallback, errorCallback )	{
		
	try
	{
		//	http://stackoverflow.com/questions/21237769/vertx-simple-web-server-doesnt-find-the-html-file
		
		//this.console.log( 'sendfile, 1 = ' + pathname );
		
		if ( typeof successCallback === "function" )
			successCallback	();
		
		//this.console.log( 'sendfile, 2 = ' + pathname );
		
		session.response.sendFile( pathname );   

		//this.console.log( 'sendfile, 3 = ' + pathname );
	}
	
	catch ( err )
	{
		this.console.log( 'vertxHttpServer, sendfile, catch err = ' + err + ', pathname = ' + pathname );
	}
};

VertxHttpServer.prototype.getRequestMethod = function ( session )	{
		
	//	The request object has a method method() which returns a string representing what 
	//	HTTP method was requested. Possible return values for method() are: 
	//	GET, PUT, POST, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH.		
	return	session.request.method();
};

VertxHttpServer.prototype.parseUrl = function ( session )	{
		
	var parsedUrl 			= {};
		parsedUrl.href		= session.request.uri();
		parsedUrl.pathname 	= session.request.path();
		
	//	http://vertx.io/core_manual_js.html#request-query
	//	Convert from vertx style query result (MultiMap)
	//	to node style (json object) result.
	parsedUrl.query	= {};//session.request.query();
	session.request	.params()	.forEach( function( key, value )
	{
		parsedUrl.query [ key ] = value;
	});			
		
	return	parsedUrl;
};
	
VertxHttpServer.prototype.getRequestQuery = function ( session )	{
		
	var 	parsedUrl 	= this.parseUrl	( session );
	return	parsedUrl	.query;
};
	
VertxHttpServer.prototype.getSockJsServer = function	()	{
		
	return	this.sockJsServer;
};

VertxHttpServer.prototype.setSockJsServer = function	( params )	{
		
	this.sockJsServer = params.sockJsServer;
};
		
VertxHttpServer.prototype.create = function ( params )	{
		
	//this.console.log( "http.create 1" );
	
	var	self	= this;
		
	this.server	= vertx.createHttpServer();
	this.server	.requestHandler( function( req )
	{
		try
		{
            //  When a request comes in create a json
            //  object to hold session info and pass
            //  it to the callBack()
			var	session				= {};
				session.boolResult	= true;
				session.request		= req;
				session.response	= req.response;
			
			//this.console.log( "http.create 7" );
			
			self.httpRequestHandler ( session );
			
			//this.console.log( "http.create 8" );
		}
		
		catch ( err )
		{
			self.console.log( 'vertxHttpServer, createHttpServer, catch err = ' + err );
			
			var	session				= {};
				session.boolResult	= false;
				session.request		= req;
				session.response	= req.response;
				//session.url		= url;
				session.message		= err;
		
			//this.console.log( "http.create 10" );
			
			self.httpRequestHandler ( session );
			
			//this.console.log( "http.create 11" );
		}

		//this.console.log( " " );

	});//.listen( port, host );
	//}).listen( 7778, 'localhost' );
	
	return	true;
};

module.exports = VertxHttpServer;
