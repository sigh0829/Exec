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

//	https://www.npmjs.org/doc/files/npm-folders.html
//	https://www.npmjs.org/
//	http://nodejs.org/
//	http://nodejs.org/api/http.html#http_http_incomingmessage
//	http://www.hacksparrow.com/how-to-write-node-js-modules.html
//	http://wiki.commonjs.org/wiki/Modules/1.1

var	http			= require( 'http'	);
var url 			= require( 'url'	);
var	fs 				= require( "fs"		);
var AnyUtils		= require( '../../Libs/Any/execAnyUtils.js'	).AnyUtils;
var HttpServerBase	= require( './HttpServerBase.js' );

function NodeHttpServer	()
{
	HttpServerBase.call	( this );
};

AnyUtils.inherit ( NodeHttpServer, HttpServerBase );

/*
NodeHttpServer.prototype.execute = function ( params )
{
    var jsonResult  = {};

    try
    {
    	if ( this.console === null )
    	{
    		this.console = params.console;
            this.console.log( "NodeServerBase, execute, 00 = " );
    	}
    	
        //  Vertx doesn't provide a built in console.
        //  So, it needs to be passed in from vertxConfig.js 
        this.console	= params.console;
        //this.console.log( "HttpServerBase, execute, 1 = " );

        jsonResult  [ params.returnIn ] = params.defaultValue;

        //this.console.log( "NodeHttpServer, execute, 1 = " );

        if ( Version.versionOK( params.v, 1, 0, 0 ) === false )
        {
            jsonResult  [ params.returnIn ] = params.defaultValue;
            params      .session.message	= params.v + " is not handled by this implementation";
        }
        else
        {
            //this.console.log( "NodeHttpServer, execute, 2 = " );

	        //  These are the functions that vertxHttpServer provides to switch.js
	        switch ( params.job )
	        {
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
        this.console.log( "NodeHttpServer, execute, 3 = " + err );
        jsonResult  [ params.returnIn ] = params.defaultValue;
    }

    //this.console.log( "NodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
    return jsonResult;
};
*/

NodeHttpServer.prototype.end = function ( params )	{
	
	params.session.response.end	( params.data.message );
};

NodeHttpServer.prototype.setHeader = function ( params )	{
	
	params.session.response.setHeader	( params.data.property,	params.data.value );
};

NodeHttpServer.prototype.statusCode = function ( params )	{
	
	params.session.response.statusCode	= params.data.statusCode;
};

NodeHttpServer.prototype.sendFile = function ( session, params, successCallback, errorCallback )	{
	
	try
	{
		//	http://eloquentjavascript.net/20_node.html
		
		//this.console.log( 'NodeHttpServer.prototype.sendfile, 1 = ' );

        //  See HttpServerBase.prototype.GET() where sendFile is called.
        if ( typeof params.message !== "undefined"  &&  params.message === true )
        {
			//	I think this needs to be called before starting to write.
			if ( typeof successCallback === "function" )
				successCallback	();
				
		    //this.console.log( 'NodeHttpServer.prototype.sendfile, 2 = ' + params.content );

    	    this.execute( { "session": session, "job": "end", "data": { "message": params.content } } );
        }

        else
        {
		    //this.console.log( 'NodeHttpServer.prototype.sendfile, 3 = ' + params.pathname );

		    fs.stat( params.pathname, function( error, stats )
		    {
		        if ( error && error.code == "ENOENT" )
		        {
				    //this.console.log( 'NodeHttpServer.prototype.sendfile, 4 = ' + "File not found" );
				
				    if ( typeof errorCallback === "function" )
					    errorCallback( 404, "File not found" );
		        }
		    
		        else if ( error )
		        {
				    //this.console.log( 'NodeHttpServer.prototype.sendfile, 5 = ' + error.toString() );
				
				    if ( typeof errorCallback === "function" )
					    errorCallback( 500, error.toString() );
		        }
		    
		        /*
		        else if ( stats.isDirectory() )
		        {
		    	    fs.readdir(path, function(error, files) {
		        	    if (error)
		          		    respond(500, error.toString());
		        	    else
		          		    respond(200, files.join("\n"));
		      	    });
		        }
		        */
		    
		        else
		        {
		    	    //this.console.log( 'NodeHttpServer.prototype.sendfile, 6 = ' );
		    	    //this.console.log( 'NodeHttpServer.prototype.sendfile, 4a = ' + stats.size );
		    	
				    var body = fs.createReadStream( params.pathname );

				    //	I think this needs to be called before starting to write.
				    if ( typeof successCallback === "function" )
					    successCallback	();
				
				    if ( body && body.pipe )
				    {
					    //this.console.log( 'NodeHttpServer.prototype.sendfile, 7 = ' );
				        body.pipe( session.response );
				    }
				    else
				    {
					    //this.console.log( 'NodeHttpServer.prototype.sendfile, 8 = ' );
					    session.response.end( body );			
				    }
		        }
		      });
        }
	}
	
	catch ( err )
	{
		this.console.log( 'NodeHttpServer.prototype.sendfile, catch err = ' + err + ', filename = ' + pathname );
	}
};

NodeHttpServer.prototype.create = function ( params )	{
	
	//this.console.log( "NodeHttpServer.prototype.create 1" );

	var	self	= this;
	
	//this.console.log( "NodeHttpServer.prototype.create 2" );

	this.server	= http.createServer( function (request, res)	{
		
		try
		{
			//self.console.log( "NodeHttpServer.prototype.create 3" );
			
            //  When a request comes in create a json
            //  object to hold session info and pass
            //  it to the callBack()
			var	session				= {};
				session.boolResult	= true;
				session.request		= request;
				session.response	= res;
			
			//this.console.log( "NodeHttpServer.prototype.create 7" );

			self.httpRequestHandler ( session );
			
			//this.console.log( "NodeHttpServer.prototype.create 8" );
		}
		
		catch ( err )
		{
			self.console.log( 'NodeHttpServer.prototype.create, catch err = ' + err );
			
			var	session				= {};
				session.boolResult	= false;
				session.request		= request;
				session.response	= res;
				session.url			= url;
				session.message		= err;
		
			//this.console.log( "NodeHttpServer.prototype.create 10" );
			
			self.httpRequestHandler ( session );
			
			//this.console.log( "NodeHttpServer.prototype.create 11" );
		}

		//this.console.log( " " );

	//}).listen( 7777, '127.0.0.1' );
	});//.listen( port, host );
	
	return	true;
};

NodeHttpServer.prototype.getRequestMethod = function ( session )	{

	//	The request object has a method method() which returns a string representing what 
	//	HTTP method was requested. Possible return values for method() are: 
	//	GET, PUT, POST, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH.		
	return	session.request.method;
};

NodeHttpServer.prototype.parseUrl = function ( session )	{
	
	return	url.parse( session.request.url );
};

NodeHttpServer.prototype.getRequestQuery = function ( session )	{
	
	var 	parsedUrl	= url.parse( session.request.url, true );
	return	parsedUrl	.query;
};

NodeHttpServer.prototype.startHandler = function	( session, callback )	{
    
    session.request.on ( 'data', function ( data ) {
        callback ( data );
    });
};

NodeHttpServer.prototype.endHandler = function	( session, callback )    {
        
    session.request.on( 'end', function () {
        callback ();
    });
};

module.exports = NodeHttpServer;
