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
var AnyUtils		= require( '../../../Libs/Any/execAnyUtils.js'			).AnyUtils;
var ServerUtils		= require( '../../../Libs/Server/execServerUtils.js'	).ServerUtils;
var SockJsServerBase= require( './SockJsServerBase.js' );

function IojsSockJsServer	()	{
	SockJsServerBase.call	( this );
};

AnyUtils.inherit ( IojsSockJsServer, SockJsServerBase );
	
IojsSockJsServer.prototype.interpretorName = function ()	{

	return  "iojs";
};
	
IojsSockJsServer.prototype.writeData = function ( params )	{
	
	var	result	= params.errorValue;
		
	try
	{
		this.sock   .write( params.data );
    	result	    = params.successValue; 
	}
	
	catch ( err )
	{
		console.log( 'IojsSockJsServer, writeData, catch err = ' + err );
	}
	
	return	result;
};
		
IojsSockJsServer.prototype.create = function ( params )	{
		
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
		//console.log( "IojsSockJsServer.create 1 = " );
		
		this.httpServer	= this.httpImp .execute ( { "system":this.system, "job": "getServer",  
														"returnIn": "server", "defaultValue": null } ).server;
	
		//console.log		( "IojsSockJsServer.create 2 = " + this.httpServer );
	    this.sjsServer	= sockjs.createServer();

		result	= ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		console.log( 'IojsSockJsServer, create, catch err = ' + err );
	}
	
	return	result
};
	
IojsSockJsServer.prototype.install = function ( params )	{
		
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
		var	self = this;
			
		//console.log( "IojsSockJsServer.install 1 = " + this.appName );
			
		this.sjsServer.installHandlers( this.httpServer, { prefix: "/" + this.appName } );
		this.sjsServer.on( 'connection', function( sock ) {
			
			//console.log( "IojsSockJsServer.install 1a = " + sock );
			//console.log( "IojsSockJsServer.install 1a = " + sock.write );
			
	    	self.sock = sock;
            self.requestHandler ( self.sock, "ConnectionOpened", "" );
	    	
			sock.on( 'data', function( data )
            {
                self.requestHandler ( self.sock, "ReadFromClient", data );
	        });
			
			sock.on ( 'close', function() {} );
	    });

		result	= ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		console.log( 'IojsSockJsServer, install, catch 2 err = ' + err );
	}
	
	return	result
};
	
IojsSockJsServer.prototype.stopServer = function ( params, callBack )	{};

module.exports = IojsSockJsServer;

