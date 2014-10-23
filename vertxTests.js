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

//	http://127.0.0.1:7777/index.html
//	http://127.0.0.1:7777/myApi?name=myName&age=33
//	http://127.0.0.1:7777/api2?name=myName&age=33


//  The server implementation shouldn't know anything about the website.
//  It should only process files that it is requested to process.
var console 			= require( 'vertx/console' );

//var HttpController  	= require( './Imp/HttpImp/httpController2.js' 		);
var HttpImp         	= require( './Imp/HttpImp/vertxHttpServer.js' );

var FileImp         	= require( './Imp/FileImp/vertxFile.js'	);
var fileImp     		= new FileImp();

//var SockJSController 	= require( './Imp/WsImp/SockJsImp/sockJsServerBase.js' );
var VertxSockJsServer	= require( './Imp/WsImp/SockJsImp/vertxSockJsServer.js'	);


var	siteType	= 	"Tests/";
var	site 		=	siteType + "Sites/WinJS_3";
					//siteType + "Sites/ForTesting";	//	will see catch "site app not found" but html should work
					//	siteType + "Sites/TestForm";		//	will see catch "site app not found" but html should work

var httpImp	= new HttpImp	();
	httpImp	.execute                
	({ 
		"job":		"initCreate", 
		"console":	console, 
		"fileImp":	fileImp, 
		"site":		site,
		"rest":		[ 
						{ "appType":"SysApp", 	"name": "myApi" }, 
						{ "appType":"SysApp", 	"name": "books" }, 
						{ "appType":"SiteApp",	"name": "books" }, 
						{ "appType":"SysApp", 	"name": "stripe" }, 
						{ "appType":"SysApp", 	"name": "testForm" }, 
						{ "appType":"SiteApp", 	"name": "vertxMongo" }, 
						{ "appType":"SysApp", 	"name": "fileImpTests" }
					],
		"vt":"krp", "v": "1.0.0"
	});


var	sockJSController = new VertxSockJsServer ();    
	sockJSController .execute
	({
		"job":		"installCreateInstall", 
		"console":	console,
		"fileImp":	fileImp,
		"httpImp": 	httpImp,
		"site":		site,
		"appType":	"SysApp", 	
		"name": 	"sockJsEcho1_s", 
		"vt":"krp", "v": "1.0.0"
	});

var	sockJSController = new VertxSockJsServer ();    
	sockJSController .execute
	({
		"job":		"installCreateInstall", 
		"console":	console,
		"fileImp":	fileImp,
		"httpImp": 	httpImp,
		"site":		site,
		"appType":	"SiteApp",	
		"name": 	"sockJsEcho2_s", 
		"vt":"krp", "v": "1.0.0"
	});

var	sockJSController = new VertxSockJsServer ();    
	sockJSController .execute
	({
		"job":		"installCreateInstall", 
		"console":	console,
		"fileImp":	fileImp,
		"httpImp": 	httpImp,
		"site":		site,
		"appType":	"SiteApp",	
		"name": 	"vertxMongoEcho2_s", 
		"vt":"krp", "v": "1.0.0"
	});

httpImp  .execute    
({ 
	"job":"listen", 
	"console":console, 
	//"host":"127.0.0.1",       //  Handle loopback address 
	//"host":"localhost",       //  Handle localhost 
	//"host":"192.168.1.116",   //  Handle LAN assigned ip
    //                          //  If nothing then handle every ip address on this port    
	"port":7779, 
	"vt":"krp", "v": "1.0.0" 
});

//console.log( 'vertxConfig 1 = ' );

//Setup all of the websites that you want here.


//This instance will handle the website found
//in the folder "Sites/ForTesting" on port 7777
//var httpImp         = new HttpImp 	        ();
//var httpController  = new HttpController    ();
//  httpController  .execute                ( { "job":"init", "console":console, "fileImp": fileImp, "httpImp": httpImp, "host":"127.0.0.1", "port":7778, "site":"Sites/ForTesting", "vt":"krp", "v": "1.0.0",
  //                                          "rest":[ { "name": "myApi" }, { "name": "books" }, { "name": "stripe" }, { "name": "testForm" } ] } );
//httpController  .execute                ( { "job":"start", "console":console, "vt":"krp", "v": "1.0.0" } );


/*
//This instance will handle the website found
//in the folder "Sites/ForTesting" on port 7777
var httpImp         = new HttpImp 	        ();
var httpController  = new HttpController    ();
httpController  .execute                ( { "job":"init", "console":console, "fileImp": fileImp, "httpImp": httpImp, "host":"127.0.0.1", "port":7778, "site":"Sites/TestForm", "vt":"krp", "v": "1.0.0",
                                            "rest":[ { "name": "myApi" }, { "name": "books" }, { "name": "stripe" }, { "name": "testForm" }, { "name": "fileImpTests" } ] } );
httpController  .execute                ( { "job":"start", "console":console, "vt":"krp", "v": "1.0.0" } );
*/

//This instance will handle the website found
//in the folder "Sites/TestForm" on port 7778
/*
var httpImp = new HttpImp	();
httpImp	.execute                
({ 
	"job":"initCreate", 
	"console":console, 
	"fileImp": fileImp, 
	"httpImp": httpImp, 
	"site":"Sites/WinJS_3",
	"rest":[ { "appType":"SysApp", "name": "myApi" }, { "appType":"SysApp", "name": "books" }, { "appType":"SysApp", "name": "stripe" }, { "appType":"SysApp", "name": "testForm" }, { "appType":"SysApp", "name": "fileImpTests" } ],
    //"rest":[ { "name": "myApi" }, { "name": "books" }, { "name": "stripe" }, { "name": "testForm" }, { "name": "fileImpTests" } ],
    "vt":"krp", "v": "1.0.0"
});
*/



//console.log( 'vertxConfig 5 = ' );


/*
//  This instance will handle the website found
//  in the folder "Sites/TestForm" on port 7778
var httpImp         = new HttpImp 	        ();
var httpController  = new HttpController    ();
    httpController  .execute                ( { "job":"init", "console":console, "httpImp": httpImp, "port":8080, "host":"0.0.0.0", "site":"Sites/TestForm", "vt":"krp", "v": "1.0.0",
                                                "rest":[ { "name": "myApi" }, { "name": "books" }, { "name": "stripe" }, { "name": "testForm" } ] } );
    httpController  .execute                ( { "job":"start", "console":console, "vt":"krp", "v": "1.0.0" } );
*/

//console.log( 'vertxConfig 2 = ' );

    /*
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
    