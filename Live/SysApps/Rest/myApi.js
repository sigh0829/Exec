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
//  http://localhost:7777/myApi?prop&value;
//  http://localhost:7777/myApi?name=fred&age=33

//  Cannot change this to lower case because
//  http://localhost:7777/myApi  is different than
//  http://localhost:7777/myapi

//var Version	= require( '../../../Libs/Any/execVersion.js' ).Version;

module.exports = function ()	{

    var luo 			    = {};	//	Local Use Only
        luo .message        = "";

        luo .fileImp        = null;
        luo .httpImp        = null;
    	luo .system         = null;

        luo .ServerUtils    = null;
        luo .Version        = null;
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            if (    luo.system === null                     &&  
                    typeof params.system !== "undefined"    &&  
                    params.system !== null                  &&  
                    typeof params.system.execute === "function"
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

            //console.log( "myApi, execute, 1 = " );

            //console.log( "myApi, execute, 2 = " );
            jsonResult[ params.returnIn ] = luo._execute ( params.session, params.method );
        }

        catch ( err )
        {
            console.log( "myApi, execute, 4 = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( session, method )  {

        var result = luo.ServerUtils.httpStatus.InternalServerError.code; //

        method  = method.toString ();
            
        //console.log( "myApi, _execute, 1a = " + httpImp );
        //console.log( "myApi, _execute, 1b = " + session );
        //console.log( "myApi, _execute, 1c = " + luo.ServerUtils.methodType );
        //console.log( "myApi, _execute, 1d = " + method );
        //console.log( "myApi, _execute, 1e = " + luo.ServerUtils.httpStatus );
        //console.log( "myApi, _execute, 1f = " + console );

        if ( method === luo.ServerUtils.methodType.NAME )
        {
            result = "myApi";
            //console.log( "myApi, _execute, 2 = " + result );
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
			    //console.log( "myApi.GET, parsedQuery = "	+ parsedQuery );
			    //console.log( "myApi.GET, query.name = "	    + parsedQuery.name );
			    //console.log( "myApi.GET, query.age = " 	    + parsedQuery.age );

                var message = "name is " + parsedQuery.name + ", age is " + parsedQuery.age;

                //  Use parsedQuery
			    luo.httpImp .writeHead  ( session, luo.ServerUtils.httpStatus.OK.code );
		        luo.httpImp .execute    ( { "system":luo.system, "session": session, "job": "end", "data": { "message": message }, "returnIn": "void", "defaultValue": "void" } ).parsedQuery;

                result = luo.ServerUtils.httpStatus.OK.code;
		    }
        }
            
        else if ( method === luo.ServerUtils.methodType.POST )
        {
            //  
        }

        else if ( method === luo.ServerUtils.methodType.PUT )
        {
            //  Update
        }

        //console.log( "myApi, _execute, return = " + result );

        return  result
    }
};
