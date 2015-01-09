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

//	console.log( 'nodeConfig 1 = ' );

//  The server implementation shouldn't know anything about the website.  
//  It should only process files that it is requested to process.
var AnyUtils			= require( './Libs/Any/execAnyUtils.js'			        ).AnyUtils;
var Version	            = require( './Libs/Any/execVersion.js'                  ).Version;
var HttpImp         	= require( './Imp/HttpImp/nodeHttpServer.js'	        );
var FileImp				= require( './Imp/FileImp/nodeFile.js'			        );
var	ServerUtils         = require( './Libs/Server/execServerUtils.js'           ).ServerUtils;
var NodeSockJsServer	= require( './Imp/WsImp/SockJsImp/nodeSockJsServer.js'  );

var	anyUtils	= new AnyUtils	();
var	dirName		= anyUtils.terminatePathWith	( __dirname, "/" );
	dirName		= anyUtils.replaceAll			( dirName, "/" );

var fileImp     = new FileImp();
var	siteType	= "Tests/";
var	site 		= siteType + "Sites/WinJS_3";
var self        = this;

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
        "system"                :   this, 
		"job"                   :   "initCreate", 
        "defaultFilename"       :   "index.html",       //  No extension needed, but if not must handle in noExtensionHandler
        "noExtensionHandler"    :   noExtensionHandler, //  Function to call when the http request does not have an extension (like .html)
        "returnIn"              :   "result", 
        "defaultValue"          :   "error",
        "vt"                    :   "krp",     
        "v"                     :   "1.0.0"
	}).result;

//console.log ( "result = " + result );

if ( result !== "error" )
{
    //  Start two sockJS handlers.  They are found in "Live/SysApps/SockJsApps".
    var	sockJSController = new NodeSockJsServer ();    
	    sockJSController .execute
	    ({
            "system":   this, 
		    "job":		"installCreateInstall", 
		    "appType":	"SysApp", 	
		    "name": 	"sockJsEcho1_s", 
		    "vt":"krp", "v": "1.0.0"
	    });

    var	sockJSController = new NodeSockJsServer ();    
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
	    "port":     7777, 
	    "vt":"krp", "v": "1.0.0" 
    });
}

function setupSystem    ( system )  {
    
    system.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            //console.log( "nodeLive.js, execute, 1" );

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
            console.log( "nodeLive.js, execute, catch, err = " + err );

            //  This might have caused the exception.
            if ( typeof params.returnIn === "undefined" )
                params.returnIn = {};
    
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "nodeLive.js, execute, return, jsonResult[ params.returnIn ] = " + jsonResult[ params.returnIn ] );
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

function noExtensionHandler ( inParams ) {

    var statusCode  = ServerUtils.httpStatus.BadRequest.code;

    try
    {
        /*  This is what inParams is expected to look like.
        var inParams  = 
        {
            "pathname"  :   pathname        //  Used to show the request from the browser.
            "sendFile"  :   localSendfile,  //  Used to return data to the browser.
        };
        */

        console.log( "noExtensionHandler.js, noExtensionHandler, inParams.pathname = " + inParams.pathname );

		var filename    = "";
        var api         = inParams.pathname;

        //  Get the rest api name. For /books/id/24 get "books".
        //  {
                if ( api.indexOf( '/' ) === 0 )
                    api = api.substring ( 1 );

                var index = api.indexOf ( '/' );
                if ( index >= 0 )
                    api = api.substring ( 0, index );

                console.log( "noExtensionHandler.js, noExtensionHandler, api = " + api );
        //  }

        switch ( api )
        {
            default:    break;

            case "myApi":
            {
                //  filename must point to a handler somewhere in the servers "reach".
			    filename = './' + siteType + 'SysApps/Rest/' + api + '.js';
			    //filename = './' + siteType + 'Sites/WinJS_3/EXEC-INF/SiteApps/Rest/' + api + '.js';
                break;
            }

            case "books":
            {
                //  filename must point to a handler somewhere in the servers "reach".
			    filename = './' + siteType + 'SysApps/Rest/' + api + '.js';
			    //filename = './' + siteType + 'Sites/WinJS_3/EXEC-INF/SiteApps/Rest/' + api + '.js';
                break;
            }

            /*case "stripe":
            {
                //  filename must point to a handler somewhere in the servers "reach".
			    filename = './' + siteType + 'SysApps/Rest/' + api + '.js';
			    //filename = './' + siteType + 'Sites/WinJS_3/EXEC-INF/SiteApps/Rest/' + api + '.js';
                break;
            }*/

            case "fileImpTests":
            {
                //  "fileImpTests" is only used by curTests.cmd
                //
                //  filename must point to a handler somewhere in the servers "reach".
			    filename = './' + siteType + 'SysApps/Rest/' + api + '.js';
			    //filename = './' + siteType + 'Sites/WinJS_3/EXEC-INF/SiteApps/Rest/' + api + '.js';
                break;
            }
        }

		console.log( "noExtensionHandler filename = " + filename );

        if ( filename !== "" )
        {
		    var MyApi   = require   ( filename );
		    var myApi   = new MyApi ();

            //  Initialize the rest app
		    myApi   .execute    ( { "system":self, "job": "any", "methodType":ServerUtils.methodType, "method":ServerUtils.methodType.INIT, 
                                        "returnIn": "name", "defaultValue": "none", "vt":"krp", "v": "1.0.0" } );

            //  run the rest app
            statusCode  = myApi.execute ( 
            { 
                "system":       self, 
                "job":          "any", 
                "session":      inParams.session, 
                "methodType":   ServerUtils.methodType, 
                "method":       "GET", 
                "httpStatus":   ServerUtils.httpStatus, 
                "returnIn":     "statusCode", 
                "defaultValue": ServerUtils.httpStatus.InternalServerError.code, 
                "vt":"krp", 	"v": "1.0.0" 
            } ).statusCode;

		    //console.log( "noExtensionHandler statusCode = " + statusCode );
        }
    }

    catch ( err )
    {
        console.log( "noExtensionHandler.js, noExtensionHandler, catch, err = " + err );
    }

    return statusCode;
}


function getErrorPage () {

    var content =   "";

        content +=  "<!DOCTYPE html > ";
        content +=  "<html lang=\"en\"> ";

        content +=  "  <head> ";
        content +=  "    <title>Error On Page</title>";
        content +=  "  </head>";

        content +=  "  <body>";
        content +=  "    Error On Page";
        content +=  "  </body>";

        content +=  "</html>";

    return  content;
}
