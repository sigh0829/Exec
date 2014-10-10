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
 	
 	//	mkdir ./Imp/wsImp/SockJsImp/node_modules 
 	//	npm --prefix ./Imp/wsImp/SockJsImp install sockjs  
 
    var http = require('http');
    var server = http.createServer();
    var sockjs = require('sockjs');
    var sjsServer = sockjs.createServer();
    server.listen(9999, '0.0.0.0');
    
    sjsServer.installHandlers(server, {prefix:'/echo'});
    sjsServer.on('connection', function(conn) {
        conn.on('data', function(message) {
            conn.write(message);
        });
        conn.on('close', function() {});
    });

 */

var http 			= require( 'http' 	);
var sockjs 			= require( 'sockjs'	);
var Version			= require( '../../../Libs/Any/execVersion.js' 			).Version;
var AnyUtils		= require( '../../../Libs/Any/execAnyUtils.js'			).AnyUtils;
var ServerUtils		= require( '../../../Libs/Server/execServerUtils.js'	).ServerUtils;
var SockJsServerBase= require( './SockJsServerBase.js' );

function NodeSockJsServer	()	{
	SockJsServerBase.call	( this );
};

AnyUtils.inherit ( NodeSockJsServer, SockJsServerBase );
	
NodeSockJsServer.prototype.writeData = function ( session )	{
	
	var	result	= session.errorValue;
		
	try
	{
		//this.console.log( "nodeSockJsServer.params.session. 1 = " + params.session.sock.write );
		//this.console.log( 'nodeSockJsServer, writeData, 1 = ' + params.data );
		
		//	http://vertx.io/core_manual_js.html#buffers
		//	In vertx 2.1.2, write is throwing an exception if you pass in
		//	a non-buffered string.
		//var buff = new vertx.Buffer( params.data, 'UTF-8' );			
		//params.session.sock.write( buff );
		
		this.sock.write( session.data );
		//params.session.sock.write ( params.data );
		
    	result	= session.successValue; 
	}
	
	catch ( err )
	{
		this.console.log( 'nodeSockJsServer, writeData, catch err = ' + err );
	}
	
	return	result;
};
		
NodeSockJsServer.prototype.create = function ( params )	{
		
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
		//this.console.log( "nodeSockJsServer.create 1 = " );
		
		this.httpServer	= params.httpImp .execute ( { "job": "getServer",  
														"returnIn": "server", "defaultValue": null, 
															"vt":"krp", "v": "1.0.0" } ).server;
	
		//this.console.log		( "nodeSockJsServer.create 2 = " + this.httpServer );
	    this.sjsServer	= sockjs.createServer();

		result	= ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		this.console.log( 'nodeSockJsServer, create, catch err = ' + err );
	}
	
	return	result
};
	
NodeSockJsServer.prototype.install = function ( params )	{
		
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
		var	self = this;
			
		//this.console.log( "nodeSockJsServer.install 1 = " + this.appName );
			
		this.sjsServer.installHandlers( this.httpServer, { prefix: "/" + this.appName } );
		this.sjsServer.on( 'connection', function( sock ) {
			
			//self.console.log( "nodeSockJsServer.install 1a = " + sock );
			//self.console.log( "nodeSockJsServer.install 1a = " + sock.write );
			
	    	self.sock = sock;
	    	
			sock.on( 'data', function( data ) {
				
    			var	session	= {};
 				
	    		try
	    		{
 					session.sock		= self.sock;
    				session.data		= data;
     				session.method 		= "ReadFromClient";
    				session.boolResult	= true;
	    			
	    			//self.console.log( "nodeSockJsServer.install 2 = " + data );
	    			
	    			self.requestHandler ( session );
	    			
	    			//self.console.log( "nodeSockJsServer.install 3" );
	    		}
	    		
	    		catch ( err )
	    		{
	    			self.console.log( 'nodeSockJsServer, install, catch 1 err = ' + err );
	    			
    				session.boolResult	= false;
    				session.message		= err;
	    		
	    			//self.console.log( "nodeSockJsServer.install 10" );
	    			
	    			self.requestHandler ( session );
	    			
	    			//self.console.log( "nodeSockJsServer.install 11" );
	    		}
	        });
			
			sock.on ( 'close', function() {} );
	    });

		result	= ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		this.console.log( 'nodeSockJsServer, install, catch 2 err = ' + err );
	}
	
	return	result
};
	
NodeSockJsServer.prototype.stopServer = function ( params, callBack )	{};

module.exports = NodeSockJsServer;

