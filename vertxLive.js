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

//  The server implementation shouldn't know anything about the website.
//  It should only process files that it is requested to process.
var console 			= require( 'vertx/console'                              );
var Version	            = require( './Libs/Any/execVersion.js'                  ).Version;
var HttpImp         	= require( './Imp/HttpImp/vertxHttpServer.js'           );
var FileImp         	= require( './Imp/FileImp/vertxFile.js'	                );
var	ServerUtils         = require( './Libs/Server/execServerUtils.js'           ).ServerUtils;
var VertxSockJsServer	= require( './Imp/WsImp/SockJsImp/vertxSockJsServer.js' );

var fileImp     = new FileImp();
var	siteType	= "Live/";
var	site 		= siteType + "Sites/WinJS_3";

setupSystem     ( this );
moveLibraries   ( this );
	
//  Initialize the http handler to look for requests for the following rest services.
//
//  The rest service handlers will be found in one of two places;
//  If you look in the "Live" folder you'll see a sub-folder "SysApps" and a sub-folder "Sites/EXEC-INF/SiteApp".
//  If you look in either of these you'll find the service handlers.
//
//  For example the service handler "myApi" is in "Live/SysApps/Rest.
var httpImp	= new HttpImp	();
var result  = httpImp.execute                
	({ 
		"system":       this, 
		"job":		    "initCreate", 
        "returnIn":     "result", 
        "defaultValue": "error",
		"rest":		    [ 
						    { "appType":"SysApp", 	"name": "myApi" }, 
						    { "appType":"SysApp", 	"name": "books" },   //  first "books" in the list gets served.
						    { "appType":"SiteApp",	"name": "books" },   //  first "books" in the list gets served.
						    { "appType":"SysApp", 	"name": "stripe" }, 
						    { "appType":"SysApp", 	"name": "fileImpTests" }
					    ],

		"vt":"krp",     "v": "1.0.0"

	}).result;

//console.log ( "result = " + result );

if ( result !== "error" )
{
    //  Start two sockJS handlers.  They are found in "Live/SysApps/SockJsApps".
    var	sockJSController = new VertxSockJsServer ();    
	    sockJSController .execute
	    ({
		    "system":   this, 
		    "job":		"installCreateInstall", 
		    "appType":	"SysApp", 	
		    "name": 	"sockJsEcho1_s", 
		    "vt":"krp", "v": "1.0.0"
	    });

    var	sockJSController = new VertxSockJsServer ();    
	    sockJSController .execute
	    ({
		    "system":   this, 
		    "job":		"installCreateInstall", 
		    "appType":	"SiteApp",	
		    "name": 	"sockJsEcho2_s", 
		    "vt":"krp", "v": "1.0.0"
	    });

    //  Now start the http server listening on "port".
    httpImp  .execute    
    ({ 
        "system":   this, 
	    "job":      "listen", 
	    //"host":   "127.0.0.1",        //  Handle loopback address 
	    //"host":   "localhost",        //  Handle localhost 
	    //"host":   "192.168.1.116",    //  Handle LAN assigned ip
        //                              //  If nothing then handle every ip address on this port    
	    "port":     7779, 
	    "vt":"krp", "v": "1.0.0" 
    });
}

function setupSystem    ( system )  {
    
    system.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            //console.log( "vertxTest.js, execute, 1" );

            //  All execute functions are told by the caller
            //  where to put the return value.  This is the name
            //  of the property in the json object where the caller
            //  will look for the result.  For example if the user
            //  wants the result in a property called "pathname" they
            //  would set up execute() like this:
            //  var	result      = httpImp.execute( { "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR", "vt":"krp", "v": "1.0.0" } );
            //  var pathname    = result.pathname;
            //  if ( pathname === "myERROR" ) {}
            jsonResult  [ params.returnIn ] = params.defaultValue;

            if ( typeof params.get !== "undefined" )
            {
                switch ( params.get )
                {
                    default:            break;

		            case "console":	    jsonResult  [ params.returnIn ] = console;  break;
		            case "fileImp":	    jsonResult  [ params.returnIn ] = fileImp;  break;
		            case "httpImp":	    jsonResult  [ params.returnIn ] = httpImp;  break;
		            case "site":		jsonResult  [ params.returnIn ] = site;     break;
		            case "Version":		jsonResult  [ params.returnIn ] = Version;  break;
                }
            }
        }

        catch ( err )
        {
            console.log( "vertxLive.js, execute, catch, err = " + err );

            //  This might have caused the exception.
            if ( typeof params.returnIn === "undefined" )
                params.returnIn = {};
    
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "vertxTest.js, execute, return, jsonResult[ params.returnIn ] = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }
}

function moveLibraries  ( system )  {
    
    //  Move the libraries that the browser needs to
    //  a location that is available to the browser.
    //  Somewhere with in the website "site".

    var filename            =   "execAnyUtils.js";
    var	fromPathName            = "./Libs/Any/" + filename;
    var	toFolder                = "./" + site + "/PUB-INF/libs/";
    var	toPathName              = toFolder + filename;
    ServerUtils.createFolder    ( system, console, fileImp, toFolder )
    ServerUtils.moveFile        ( system, console, fileImp, toFolder, fromPathName, toPathName );
}

//console.log( 'vertxConfig 1 = ' );

//Setup all of the websites that you want here.


//console.log( 'vertxConfig 5 = ' );


/*
//  This instance will handle the website found
//  in the folder "Sites/TestForm" on port 7778
var httpImp         = new HttpImp 	        ();
var httpController  = new HttpController    ();
    httpController  .execute                ( { "system":this, "job":"init", "console":console, "httpImp": httpImp, "port":8080, "host":"0.0.0.0", "site":"Sites/TestForm", "vt":"krp", "v": "1.0.0",
                                                "rest":[ { "name": "myApi" }, { "name": "books" }, { "name": "stripe" }, { "name": "testForm" } ] } );
    httpController  .execute                ( { "system":this, "job":"start", "console":console, "vt":"krp", "v": "1.0.0" } );
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
    