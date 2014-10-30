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

/*
 	//	https://github.com/sockjs/sockjs-node/blob/master/examples/test_server/sockjs_app.js
    //	https://github.com/vert-x/vertx-examples/blob/master/src/raw/javascript/sockjs/sockjs.js
    //	https://github.com/sockjs/sockjs-node
    
    var vertx = require('vertx') 
    var console = require('vertx/console') 
    var server = vertx.createHttpServer() 
    var sjsServer = new vertx.createSockJSServer(server) 
    server.listen(8080) 

     // The handler for the SockJS app - we just echo data back 
     sjsServer.installApp({prefix: "/testapp"}, function(sock) { 
       sock.dataHandler(function(buff) { 
         sock.write(buff) 
       }) 
     }); 
 */
    
var vertx 			= require( 'vertx' )
var AnyUtils		= require( '../../../Libs/Any/execAnyUtils.js'			).AnyUtils;
var ServerUtils		= require( '../../../Libs/Server/execServerUtils.js'	).ServerUtils;
var SockJsServerBase= require( './SockJsServerBase.js' );

function VertxSockJsServer	()	{
	SockJsServerBase.call	( this );
};

AnyUtils.inherit ( VertxSockJsServer, SockJsServerBase );
	
VertxSockJsServer.prototype.interpretorName = function ()	{

	return  "vertx";
};
	
VertxSockJsServer.prototype.writeData = function ( params )	{
		
	var	result	= params.errorValue;
	
	try
	{
		//this.console.log( 'vertxSockJsServer, writeData, 1 = ' + params.data );
		//this.console.log( 'vertxSockJsServer, writeData, 2 = ' + params.session.charset );
		
		//	http://vertx.io/core_manual_js.html#buffers
		//	In vertx 2.1.2, write is throwing an exception if you pass in
		//	a non-buffered string.

		var buff = null;

        if ( typeof params.session.charset === "undefined" )
        {
		    //this.console.log( 'vertxSockJsServer, writeData, 3 = ' + params.session.charset );
		    buff = new vertx.Buffer( params.data, 'UTF-8' );
        }
        else
        {
		    this.console.log( 'vertxSockJsServer, writeData, 4 = ' + params.session.charset );
		    buff = new vertx.Buffer( params.data );
		    //buff = params.data;
        }
		
		//this.console.log( 'vertxSockJsServer, writeData, 3 = ' + buff );
		
		this.sock.write( buff );
		//params.session.sock.write( buff );
		
    	result	= params.successValue; 
	}
	
	catch ( err )
	{
		this.console.log( 'vertxSockJsServer, writeData, catch err = ' + err );
	}
	
	return	result;
};
		
VertxSockJsServer.prototype.create = function ( params )	{
		
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
		//this.console.log( "vertxSockJsServer.create 1 = " + this.sjsServer );
		
		this.sjsServer = this.httpImp .execute ( { "system":this.system, "job": "getSockJsServer",  
															"returnIn": "sockJsServer", "defaultValue": null, 
																"vt":"krp", "v": "1.0.0" } ).sockJsServer;
		//this.console.log( "vertxSockJsServer.create 1a = " + this.sjsServer );
		
		if ( this.sjsServer === null )
		{
			var	httpServer	= this.httpImp .execute ( { "system":this.system, "job": "getServer",
															"returnIn": "server", "defaultValue": null, 
																"vt":"krp", "v": "1.0.0" } ).server;
		
			//this.console.log		( "vertxSockJsServer.create 2 = " + httpServer );
			
		    //	http://www.boyunjian.com/javasrc/io.vertx/vertx-core/2.0.0-CR1/_/org/vertx/java/core/sockjs/impl/DefaultSockJSServer.java
			//	Can only do this once per server:
			//	"You have overwritten the Http server request handler AFTER the SockJSServer has been created " +
            //	"which will stop the SockJSServer from functioning. Make sure you set http request handler BEFORE " +
            //	"you create the SockJSServer");
			this.sjsServer	= new vertx	.createSockJSServer( httpServer );

			//this.console.log		( "vertxSockJsServer.create 3 = " + this.sjsServer );
			
			this.httpImp .execute ( { "system":this.system, "job": "setSockJsServer",
											"sockJsServer": this.sjsServer,
												"returnIn": "void", "defaultValue": null, 
													"vt":"krp", "v": "1.0.0" } );

			//this.console.log( "vertxSockJsServer.create 4 = " + this.sjsServer );
		}

		//this.console.log( "vertxSockJsServer.create 5 = " + this.sjsServer );
		result	= ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		this.console.log( 'vertxSockJsServer, create, catch err = ' + err );
	}
	
	return	result
};

VertxSockJsServer.prototype.install = function ( params )	{
		
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
		var	self = this;

		//this.console.log( "vertxSockJsServer.install 1 = " + params.socketJsAppName );
			
	    this.sjsServer.installApp( { prefix: "/" + this.appName }, function( sock )
 		{
			//self.console.log( "vertxSockJsServer.install 1a = " + sock );
			//self.console.log( "vertxSockJsServer.install 1a = " + sock.write );

	    	self.sock = sock;

            self.requestHandler ( self.sock, "ConnectionOpened", "" );
	    	
            sock.dataHandler( function( data )
	    	{
                self.requestHandler ( self.sock, "ReadFromClient", data );
	        }) 
	     });

	    result	= ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		this.console.log( 'vertxSockJsServer, install, catch 2 err = ' + err );
	}
	
	return	result
};
	
VertxSockJsServer.prototype.stopServer = function ( params, callBack )	{};

module.exports = VertxSockJsServer;
