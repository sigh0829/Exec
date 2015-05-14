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

var vertx 	= require( 'vertx' )

module.exports = function ()	{

    var luo = {};	//	Local Use Only
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            throw "this file needs a lot of work, do not trust anything in here.";

            //  All execute functions are told by the caller
            //  where to put the return value.  This is the name
            //  of the property in the json object where the caller
            //  will look for the result.  For example if the user
            //  wants the result in a property called "pathname" they
            //  would set up execute() like this:
            //  var	result      = httpImp.execute( { "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR" } );
            //  var pathname    = result.pathname;
            //  if ( pathname === "myERROR" ) {}
            jsonResult  [ params.returnIn ] = params.defaultValue;

            //this.console.log( "nodeHttpServer, execute, 1 = " );

            //this.console.log( "nodeHttpServer, execute, 2 = " );

		    //  These are the functions that vertxHttpServer provides to switch.js
            switch ( params.job )
		    {
			    case "isOK":                jsonResult[ params.returnIn ]  = luo.isOK( params.session );	break;

                case "createServer":        jsonResult[ params.returnIn ] = luo.createServer       ( params.host, params.port, params.callBack ); break;
                case "getErrorMessage":     jsonResult[ params.returnIn ] = luo.getErrorMessage    ( params.session ); break;
                case "getRequestHref":      jsonResult[ params.returnIn ] = luo.getRequestHref     ( params.session ); break;
                case "getRequestMethod":    jsonResult[ params.returnIn ] = luo.getRequestMethod   ( params.session ); break;
                case "getRequestMethod":    jsonResult[ params.returnIn ] = luo.getRequestMethod   ( params.session ); break;
                case "getRequestPathname":  jsonResult[ params.returnIn ] = luo.getRequestPathname ( params.session ); break;
                case "getRequestQuery":     jsonResult[ params.returnIn ] = luo.getRequestQuery    ( params.session ); break;
                case "sendFile":            jsonResult[ params.returnIn ] = luo.sendFile           ( params.session, params.pathname, params.success, params.failure );  break;

			    case "end":			        params.session.response.end		    ( params.data.message );	    break;
			    case "setHeader":	        params.session.response.headers     ().set( params.data.property,	params.data.value );	break;
			    case "statusCode":	        params.session.response.statusCode	= params.data.statusCode;	    break;
			
			    default:
                {
                    jsonResult  [ params.returnIn ] = params.defaultValue;
                    this.console     .log ( "nodeHttpServer, execute, default = " + params.job );
                    break;
                }
		    }
        }

        catch ( err )
        {
            this.console.log( "nodeHttpServer, execute, 3 = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //this.console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }
	
	luo.sendFile = function ( session, pathname, successCallback, errorCallback )	{
		
		try
		{
			//	http://stackoverflow.com/questions/21237769/vertx-simple-web-server-doesnt-find-the-html-file
			
			//this.console.log( 'sendfile, 1 = ' + pathname );
			
			if ( typeof successCallback === "function" )
				successCallback	();
			
            if ( typeof params.type !== "undefined"  &&  params.type === "message" )
            {
    	        this.execute( { "session": session, "job": "end", "data": { "message": params.message } } );
            }

            else
            {
			    session.response.sendFile( pathname );   
            }

			//this.console.log( 'sendfile, 2 = ' + pathname );
		}
		
		catch ( err )
		{
			this.console.log( 'vertxHttpServer, sendfile, catch err = ' + err + ', pathname = ' + pathname );
		}
	}

	luo.getRequestMethod = function ( session )	{
		
		//	The request object has a method method() which returns a string representing what 
		//	HTTP method was requested. Possible return values for method() are: 
		//	GET, PUT, POST, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH.		
		return	session.request.method();
	}

	luo.parseUrl = function ( session )	{
		
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
	}
	
	luo.getErrorMessage = function ( session )	{
		
		return	session.message;
	}
	
	luo.getRequestHref = function ( session )	{
		
		var 	parsedUrl 	= luo.parseUrl	( session );
		return	parsedUrl	.href;
	}
	
	luo.getRequestPathname = function ( session )	{
		
		var 	parsedUrl 	= luo.parseUrl	( session );
		return	parsedUrl	.pathname;
	}
	
	luo.getRequestQuery = function ( session )	{
		
		var 	parsedUrl 	= luo.parseUrl	( session );
		return	parsedUrl	.query;
	}
	
	luo.isOK = function ( params )	{
		
		return params.boolResult;
	}
		
	luo.createServer = function ( host, port, callBack )	{
		
		//this.console.log( "http.createServer 1" );
		//this.console.log( "http.createServer 2, params = " 		+ params );
		//this.console.log( "http.createServer 3, params.port = " 	+ params.port );
		//this.console.log( "http.createServer 4, params.host = " 	+ params.host );
		
		var self			= this;
			self.callBack	= callBack;
		
		vertx.createHttpServer().requestHandler(function(req) {
			
			try
			{
                //  When a request somes in create a json
                //  object to hold session info and pass
                //  it to the callBack()
				var	session				= {};
					session.boolResult	= true;
					session.request		= req;
					session.response	= req.response;
				
				//self.console.log( "http.createServer 7" );
				
				self.callBack ( session );
				
				//self.console.log( "http.createServer 8" );
			}
			
			catch ( err )
			{
				this.console.log( 'vertxHttpServer, createHttpServer, catch err = ' + err );
				
				var	session				= {};
					session.boolResult	= false;
					session.request		= req;
					session.response	= req.response;
					//session.url		= url;
					session.message		= err;
			
				//self.console.log( "http.createServer 10" );
				
				self.callBack ( session );
				
				//self.console.log( "http.createServer 11" );
			}

			//self.console.log( " " );

		}).listen( port, host );
		//}).listen( 7778, 'localhost' );
	}
	
	luo.stopServer = function ( params, callBack )	{
		
	}
};


//this.console.log('Server running at http://127.0.0.1:7777/');


/*

vertx.createHttpServer().requestHandler(function(req) {
  req.response.end("<html><body><h1>Hello from vert.x!</h1></body></html>");
}).listen( 7778 );
*/

/*
var vertx = require('vertx');

vertx.createHttpServer().requestHandler(function(req) {
  req.response.end("Hello World!");
}).listen( 7778, 'localhost');
*/

//this.console.log('Server running at http://127.0.0.1:7778/');


//	http://stackoverflow.com/questions/21237769/vertx-simple-web-server-doesnt-find-the-html-file
//	http://vertx.io/api/javascript/http.HttpServerResponse.html
