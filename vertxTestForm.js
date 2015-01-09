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

//  Usage:
//  This server handles the "TestForm" website.
//  The only thing it does is write what it gets from a POST request
//  from the form that is in Sites/TestForm/index.html

//  The server implementation shouldn't know anything about the website.
//  It should only process files that it is requested to process.
var console 	= require( 'vertx/console' );
var Version	    = require( './Libs/Any/execVersion.js'          ).Version;
var HttpImp     = require( './Imp/HttpImp/vertxHttpServer.js'   );
var FileImp     = require( './Imp/FileImp/vertxFile.js'	)       ;

var fileImp     = new FileImp();
var	siteType	= "Live/";
var	site 		= siteType + "Sites/TestForm";
var self        = this;

setupSystem     ( this );
	
var httpImp	= new HttpImp	();
var result  = httpImp.execute                
	({ 
		"system"        :   this, 
		"job"           :	"initCreate", 
        "returnIn"      :   "result", 
        "defaultValue"  :   "error",
		"rest"          :	[ { "appType":"SysApp", "name": "testForm" } ],

		"vt":"krp",     "v": "1.0.0"

	}).result;

if ( result !== "error" )
{
    httpImp  .execute    
    ({ 
        "system":   this, 
	    "job":      "listen", 
	    //"host":"127.0.0.1",       //  Handle loopback address 
	    //"host":"localhost",       //  Handle localhost 
	    //"host":"192.168.1.116",   //  Handle LAN assigned ip
        //                          //  If nothing then handle every ip address on this port    
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
