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

//  http://technologyconversations.com/2014/08/12/rest-api-with-json/
//  http://localhost:7777/books/id/24

var Version	= require( '../../../Libs/Any/execVersion.js' ).Version;

module.exports = function ()	{

    var luo 			= {};	//	Local Use Only
        luo .message    = "";
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            //  Vertx doesn't provide a built in console.
            //  So, it needs to be passed in from vertxConfig.js 
            console     = params.console;

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

            //console.log( "SysApps, books, execute, 1 = " );

            if ( Version.versionOK( params.v, 1, 0, 0 ) === true )
            {
                //console.log( "books, execute, 2 = " );
                jsonResult[ params.returnIn ] = luo._execute ( params.helpers, params.httpImp, params.session, params.methodType, params.method, params.httpStatus, params.console );
            }
            else
            {
                //console.log( "books, execute, 3 = " );
                jsonResult  [ params.returnIn ] = params.defaultValue;
                luo .message                = params.v + " is not handled by this implementation";
            }
        }

        catch ( err )
        {
            console.log( "books, execute, catch = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( helpers, httpImp, session, methodType, method, httpStatus, console )  {

        var result = false; //

        method  = method.toString ();
            
        //console.log( "books, _execute, 1a = " + httpImp );
        //console.log( "books, _execute, 1b = " + session );
        //console.log( "books, _execute, 1c = " + methodType );
        //console.log( "books, _execute, 1d = " + method );
        //console.log( "books, _execute, 1e = " + httpStatus );
        //console.log( "books, _execute, 1f = " + console );

        if ( method === methodType.NAME )
        {
            result = "books";
            //console.log( "books, _execute, 2 = " + result );
        }

        else if ( method === methodType.DELETE )
        {
            //  
        }

        else if (  method === methodType.GET )
        {
            //  http://localhost:7777/books/id/24

		    var	pathname    = httpImp.execute( { "session": session, "job": "getRequestPathname", "returnIn": "pathname", "defaultValue": "ERROR", "vt":"krp", "v": "1.0.0" } ).pathname;
            var split       = pathname  .split  ( '/' );

		    //console.log( "books.GET, split[ 1 ] = "	+ split[ 1 ] );

		    if ( split[ 2 ] === "id" )
		    {
			    //console.log( "books.GET, id.number = "	+ split[ 3 ] );

                var message = "id is " + split[ 3 ];

                //  Use parsedQuery
			    helpers.writeHead   ( session, httpStatus.OK.code );
		        httpImp.execute( { "session": session, "job": "end", "data": { "vt":"krp", "v": "1.0.0", "message": message }, "returnIn": "void", "defaultValue": "void", "vt":"krp", "v": "1.0.0" } );

                result = httpStatus.OK.code;
		    }
        }
            
        else if ( method === methodType.POST )
        {
            //  
        }

        else if ( method === methodType.PUT )
        {
            //  Update
        }

        //console.log( "books, _execute, return = " + result );

        return  result
    }
};
