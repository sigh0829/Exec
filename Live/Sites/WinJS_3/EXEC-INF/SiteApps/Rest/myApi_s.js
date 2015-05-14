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

//  http://localhost:7777/myApi?prop&value;
//  http://localhost:7777/myApi?name=fred&age=33

//  Cannot change this to lower case because
//  http://localhost:7777/myApi  is different than
//  http://localhost:7777/myapi

//  Use myApi_c.js for both the client and server side.
var myApi_c = require( './myApi_c.js' );

module.exports = function ()	{

    var luo 			    = {};	//	Local Use Only
        luo .message        = "";

        luo .console        = null;
        luo .fileImp        = null;
        luo .httpImp        = null;
        luo .site           = null;
    	luo .system         = null;

        luo .AnyUtils       = null;
        luo .ServerUtils    = null;

	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            //  Get the system support objects
            if (    luo.system === null                     &&  
                    typeof params.system !== "undefined"    &&  
                    params.system !== null                  &&  
                    typeof params.system.execute === "function"
               )
            {
    	        luo.system  = params.system;

                luo.console     = luo.system.execute ({ "get": "console",       "returnIn": "console",      "defaultValue": null }).console;
                luo.fileImp     = luo.system.execute ({ "get": "fileImp",       "returnIn": "fileImp",      "defaultValue": null }).fileImp;
                luo.httpImp     = luo.system.execute ({ "get": "httpImp",       "returnIn": "httpImp",      "defaultValue": null }).httpImp;
                luo.site        = luo.system.execute ({ "get": "site",          "returnIn": "site",         "defaultValue": null }).site;
                
                luo.AnyUtils    = luo.system.execute ({ "get": "AnyUtils",      "returnIn": "AnyUtils",     "defaultValue": null }).AnyUtils;
                luo.ServerUtils = luo.system.execute ({ "get": "ServerUtils",   "returnIn": "ServerUtils",  "defaultValue": null }).ServerUtils;
            }

            //  All execute functions are told by the caller
            //  where to put the return value.  This is the name
            //  of the property in the json object where the caller
            //  will look for the result.  For example if the user
            //  wants the result in a property called "pathname" they
            //  would set up execute() like this:
            //  var	result      = httpImp.execute( { "system":luo.system, "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR" } );
            //  var pathname    = result.pathname;
            //  if ( pathname === "myERROR" ) {}
            jsonResult  [ params.returnIn ] = params.defaultValue;

            //luo.console.log( "myApi_s, execute, 1 = " );

            //luo.console.log( "myApi_s, execute, 3 = " );
            jsonResult  [ params.returnIn ] = params.defaultValue;
            luo .message                    = params.v + " is not handled by this implementation";
        }

        catch ( err )
        {
            luo.console.log( "myApi_s, execute, catch err = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //luo.console.log( "myApi_s, execute, result = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( session, method )  {

        var result = luo.ServerUtils.httpStatus.InternalServerError.code; //

        method  = method.toString ();
            
        if ( method === luo.ServerUtils.methodType.NAME )
        {
            result = myApi_c.MyApi_c	.restApi;
        }

        else if ( method === luo.ServerUtils.methodType.DELETE )
        {
            //  
        }

        else if ( method === luo.ServerUtils.methodType.GET )
        {
            //  http://localhost:7777/myApi?name=fred&age=33

		    var parsedQuery	= luo.httpImp.execute( { "system":luo.system, "session": session, "job": "getRequestQuery", "returnIn": "parsedQuery", "defaultValue": "ERROR" } ).parsedQuery;
		    if ( parsedQuery !== "ERROR" )
		    {
			    //luo.console.log( "myApi.GET, parsedQuery = "  + parsedQuery );
			    //luo.console.log( "myApi.GET, query.name = "	+ parsedQuery.name );
			    //luo.console.log( "myApi.GET, query.age = " 	+ parsedQuery.age );

                var message = "name is " + parsedQuery.name + ", age is " + parsedQuery.age;

                //luo.console.log( "myApi_s, _execute, parsedQuery.returnType = " + parsedQuery.returnType );

                if ( parsedQuery.returnType === "json" )
                    message = JSON.stringify( { "name":parsedQuery.name, "age":parsedQuery.age  } );

                else if ( parsedQuery.returnType === "blob" )
                {
                    //message = JSON.stringify( { "result": message } );

	                //  Get any image and send it.
                    var	pathname	= "./" + luo.site + "/PUB-INF/images/" + "pdf.png";
                        message     = luo.fileImp  .execute	
                                        ( { "system":this.system, "job":"readBinaryFile", "pathname":pathname, 
                                                "async":false, "data":"krp", "returnIn": "result", 
                                                    "defaultValue": { "contents":"" }  } ).result.contents;

                    //luo.console.log( "myApi_s, _execute, pathname = " + pathname );
                }

                else if ( parsedQuery.returnType === "arrayBuffer" )
                {
                    //  vertx as of 10/27/2014 does not implement these:
                    //  ArrayBuffer, Uint16Array, Float32Array
                    try
                    {
                        //  http://chimera.labs.oreilly.com/books/1230000000545/ch17.html#_receiving_text_and_binary_data
                        //  An ArrayBuffer is a generic, fixed-length binary data buffer.
                        //  However, an ArrayBuffer can be used to create one or more
                        //  ArrayBufferView objects, each of which can present the 
                        //  contents of the buffer in a specific format. For example, 
                        //  let's assume we have the following C-like binary data structure:
                        //
                        //  struct someStruct {
                        //      char            username[ 16 ];
                        //      unsigned short  id;
                        //      float           scores[ 32 ];
                        //  };


                        //  http://chimera.labs.oreilly.com/books/1230000000545/ch17.html#_receiving_text_and_binary_data
                        //
                        //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays?redirectlocale=en-US&redirectslug=JavaScript%2FTyped_arrays
                        //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array

                        //  Create a workarea for the output with the following fields:
                        //  Uint8Array: 1 byte, Uint16Array: 2 bytes, Float32Array: 4 bytes
                        message = new ArrayBuffer( 16 + 2 + (4 * 32) + 2 );  

                        //  http://stackoverflow.com/questions/7372124/why-is-creating-a-float32array-with-an-offset-that-isnt-a-multiple-of-the-eleme
                        //  When using Float32Array the interpreter wants to put the data on
                        //  a "divide by 4" boundary.  So, use 20;  Otherwise you'll get an exception

                        //  Send the following letters: "01234567890abcdef".
                        var usernameView    = luo.AnyUtils.str2Uint8Array   ( message,  0,  16, "01234567890abcdef" ); 
                        var idView          = new Uint16Array               ( message,  16, 1   );
                        var scoresView      = new Float32Array              ( message,  20, 32  );

                        //  Send the number 65535.
                        idView [ 0 ] = 65535;

                        //  Send some floating point data.
                        for ( var i = 0; i < 32; i++ )
                            scoresView[ i ] = i * 3.14;

                        //  Convert from arrayBuffer to Buffer for the xhr interface.
                        message = luo.AnyUtils.arrayBufferToBuffer ( message );
                    }

                    catch ( err )
                    {
                        luo.console.log( "myApi_s, _execute, parsedQuery.returnType === \"arrayBuffer\", Vertx 2.0 does not define ArrayBuffer" );
                        luo.console.log( "myApi_s, _execute, parsedQuery.returnType === \"arrayBuffer\", catch err = " + err );
                        luo.console.log( "myApi_s, _execute, parsedQuery.returnType === \"arrayBuffer\", Vertx 2.0 does not define ArrayBuffer" );
                    }
                }

                //  Now send it.
			    luo.httpImp .writeHead  ( session, luo.ServerUtils.httpStatus.OK.code );
		        luo.httpImp .execute    ( { "system":luo.system, "session": session, "job": "end", 
                                                "data": { "message": message }, 
                                                    "returnIn": "void", "defaultValue": "void" } );

                result = luo.ServerUtils.httpStatus.OK.code;
		    }
        }
            
        else if ( method === luo.ServerUtils.methodType.POST )
        {
            //  
        }

        else if ( method === luo.ServerUtils.methodType.PUT )
        {
        }

        //luo.console.log( "myApi_s, _execute, return = " + result );

        return  result
    }
};
