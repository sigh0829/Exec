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
//  All this example does is write what it gets from 
//  the form submit to the server console.

//var Version	= require( '../../../Libs/Any/execVersion.js' ).Version;

module.exports = function ()	{

    var luo 			    = {};	//	Local Use Only
        luo .message        = "";
        luo .body           = "";

        luo .fileImp        = null;
        luo .httpImp        = null;
    	luo .system         = null;

        luo .ServerUtils    = null;
        luo .Version        = null;
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            if (    luo.system                      === null            &&  
                    typeof params.system            !== "undefined"     &&  
                    params.system                   !== null            &&  
                    typeof params.system.execute    === "function"
               )
            {
    	        luo.system      = params.system;

                luo.fileImp     = luo.system.execute ({ "get": "fileImp",       "returnIn": "fileImp",      "defaultValue": null }).fileImp;
                luo.httpImp     = luo.system.execute ({ "get": "httpImp",       "returnIn": "httpImp",      "defaultValue": null }).httpImp;

                luo.ServerUtils = luo.system.execute ({ "get": "ServerUtils",   "returnIn": "ServerUtils",  "defaultValue": null }).ServerUtils;
                luo.Version     = luo.system.execute ({ "get": "Version",       "returnIn": "Version",      "defaultValue": null }).Version;
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

            //console.log( "testForm, execute, 1 = " );

            //  execute() should handle all previous versions.
            //  Since this is version 1 there is only one version to handle.
            //console.log( "testForm, execute, 2 = " );

            //  For now only handling POST and  NAME.
            jsonResult[ params.returnIn ] = luo._execute ( params.session, params.method );
        }

        catch ( err )
        {
            console.log( "testForm, execute, 4 = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "testForm, execute, 5 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( session, method )  {

        var result = luo.ServerUtils.httpStatus.InternalServerError.code; //

        method  = method.toString ();
            
        //console.log( "testForm, _execute, 1b = " + session );
        //console.log( "testForm, _execute, 1c = " + luo.ServerUtils.methodType );
        //console.log( "testForm, _execute, 1d = " + method );
        //console.log( "testForm, _execute, 1e = " + luo.ServerUtils.httpStatus );
        //console.log( "testForm, _execute, 1f = " + console );

        if ( method === luo.ServerUtils.methodType.NAME )
        {
            result = "testForm";
            //console.log( "testForm.POST, _execute, return = " + result );
        }

        else if ( method === luo.ServerUtils.methodType.DELETE )
        {
            //  
        }

        else if ( method === luo.ServerUtils.methodType.GET )
        {
            //  http://localhost:7777/testForm?name=fred&age=33

			//console.log( "testForm.GET " );

            /*
		    var parsedQuery	= httpImp.execute( { "system":luo.system, "session": session, "job": "getRequestQuery", "returnIn": "parsedQuery", "defaultValue": "ERROR" } ).parsedQuery;
		    if ( parsedQuery !== "ERROR" )
		    {
			    console.log( "testForm.GET, parsedQuery = "	+ parsedQuery );
			    console.log( "testForm.GET, query.name = "	    + parsedQuery.name );
			    console.log( "testForm.GET, query.age = " 	    + parsedQuery.age );

                var message = "name is " + parsedQuery.name + ", age is " + parsedQuery.age;

                //  Use parsedQuery
			    helpers.writeHead   ( session, luo.ServerUtils.httpStatus.OK.code );
		        httpImp.execute( { "system":luo.system, "session": session, "job": "end", "data": { "message": message }, "returnIn": "void", "defaultValue": "void" } ).parsedQuery;

                result = luo.ServerUtils.httpStatus.OK.code;
		    }
            */
        }
            
        else if ( method === luo.ServerUtils.methodType.POST )
        {
            //console.log( "testForm.POST, _execute, 1 = " );

            function startHandler ( data ) {

                try
                {
                    //console.log( "testForm.POST, _execute, 2 = " + data );

                    luo.body += data;
                
                    //console.log( "testForm.POST, _execute, 3 = " + luo.body );

                    // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                    if ( luo.body.length > 1e6 )
                    { 
                        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                        session.request.connection.destroy();
                    }
                
                    //console.log( "testForm.POST, _execute, 4 = " + luo.body );
                }

                catch ( err )
                {
                    console.log( "testForm, startHandler, catch, err = " + err );
                }
            };

            function endHandler () {

                try
                {
                    var both    = luo.body  .split ( "&" );
                    var name    = both[ 0 ] .split ( "=" );
                    var email   = both[ 1 ] .split ( "=" );
                
                    console.log( "testForm.POST, _execute, body = "             + luo.body      );
                    console.log( "testForm.POST, _execute, name  property = "   + name[ 0 ]     );
                    console.log( "testForm.POST, _execute, name  value    = "   + name[ 1 ]     );
                    console.log( "testForm.POST, _execute, email property = "   + email[ 0 ]    );
                    console.log( "testForm.POST, _execute, email value    = "   + email[ 1 ]    );

                    //  Don't allow it to accumulate any more.
                    luo.body    = "";

                    //var POST = qs.parse( luo.body );

                    // use POST
                    //console.log( "testForm.POST, _execute, 6 = " + POST );
                }

                catch ( err )
                {
                    console.log( "testForm, endHandler, catch, err = " + err );
                }
            };

            //  Register the callbacks for POST data handling.
		    luo.httpImp .execute    ( { "system":luo.system, "session": session, "job": "startHandler", "callback":startHandler,
                                            "returnIn": "void", "defaultValue": "void" } );

		    luo.httpImp .execute    ( { "system":luo.system, "session": session, "job": "endHandler", "callback":endHandler,
                                            "returnIn": "void", "defaultValue": "void" } );

            var message = "Only http://localhost:nnnn/ causes a write to the server console, not http://localhost:nnnn/testForm";

            //  Use parsedQuery
			luo.httpImp .writeHead  ( session, luo.ServerUtils.httpStatus.OK.code );
		    luo.httpImp .execute    ( { "system":luo.system, "session": session, "job": "end", "data": { "message": message }, "returnIn": "void", "defaultValue": "void" } );

            result = luo.ServerUtils.httpStatus.OK.code;
        }

        else if ( method === luo.ServerUtils.methodType.PUT )
        {
            //  Update
            //console.log( "testForm.PUT, _execute, return = " + result );
        }

        //console.log( "testForm.POST, _execute, return = " + result );

        return  result
    }
};
