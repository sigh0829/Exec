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
//  http://localhost:7777/vertxMongo/id/24

var Version     = require( '../../../../../../Libs/Any/execVersion.js' ).Version;
var console 	= require( 'vertx/console' );
var container	= require("vertx/container");
var vertx 		= require("vertx")

module.exports = function ()	{

    var luo 			= {};	//	Local Use Only
        luo .message    = "";
        luo .deployID   = null;
	
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

            //console.log( "SiteApps, vertxMongo, execute, 1 = " );

            if ( Version.versionOK( params.v, 1, 0, 0 ) === true )
            {
                //console.log( "vertxMongo, execute, 2 = " );
                jsonResult[ params.returnIn ] = luo._execute ( params.helpers, params.httpImp, params.session, params.methodType, params.method, params.httpStatus, params.console );
            }
            else
            {
                //console.log( "vertxMongo, execute, 3 = " );
                jsonResult  [ params.returnIn ] = params.defaultValue;
                luo .message                = params.v + " is not handled by this implementation";
            }
        }

        catch ( err )
        {
            console.log( "vertxMongo, execute, 4 = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( helpers, httpImp, session, methodType, method, httpStatus, console )  {

        var result = false; //

        method  = method.toString ();
            
        //console.log( "vertxMongo, _execute, 1a = " + httpImp );
        //console.log( "vertxMongo, _execute, 1b = " + session );
        //console.log( "vertxMongo, _execute, 1c = " + methodType );
        //console.log( "vertxMongo, _execute, 1d = " + method );
        //console.log( "vertxMongo, _execute, 1e = " + httpStatus );
        //console.log( "vertxMongo, _execute, 1f = " + console );

        if ( method === methodType.INIT )
        {
            //console.log( "vertxMongo, _execute, INIT 1 = " );

	        luo.config =
	        {
	            address: 			"DB1-Persistor",
	            db_name: 			"mydb",
	            "host": 			"127.0.0.1",
	            "port": 			27017,
	            "socket_timeout":	5000,  
	            fake: 			    false
	        }

            //console.log( "vertxMongo, _execute, INIT 2 = " );

	        luo.collection     = "mycollection";

            //console.log( "vertxMongo, _execute, INIT 3, luo.dbName = "  + luo.dbName );
            //console.log( "vertxMongo, _execute, INIT 4, luo.collection = " + luo.collection );

            //  Deploy the vertx mongo module.
            container.deployModule  ( 'io.vertx~mod-mongo-persistor~2.1.1', luo.config, 1, function( err, deployID )
            {
                //console.log( "vertxMongo, _execute, INIT 4a = " );

	            if ( err !== null )
		            err.printStackTrace();
	            else
	            {
                    luo.deployID = deployID;

                    //console.log( "vertxMongo, _execute, INIT 4b = " + luo.deployID );
	            }
            });

            //console.log( "vertxMongo, _execute, INIT 3 = " );
        }

        else if ( method === methodType.NAME )
        {
            result = "vertxMongo";
            //console.log( "vertxMongo, _execute, 2 = " + result );
        }

        else if ( method === methodType.DELETE )
        {
            //  
        }

        else if (  method === methodType.GET )
        {
            //  http://localhost:7779/vertxMongo/id/24

		    var	pathname    = httpImp   .execute    ( { "session": session, "job": "getRequestPathname", "returnIn": "pathname", "defaultValue": "ERROR", "vt":"krp", "v": "1.0.0" } ).pathname;
            var split       = pathname  .split      ( '/' );

		    //console.log( "vertxMongo.GET, 1, split[ 1 ] = "	+ split[ 1 ] );

		    if ( split[ 2 ] === "id" )
		    {
			    //console.log( "vertxMongo.GET, 2, id.number = "	+ split[ 3 ] );

                var message = "id is " + split[ 3 ];

	            vertx.eventBus	.send( luo.config.address,
	            {
		            "action": 		'save',
		            "collection":	luo.collection,
		            "document":		{ name: 'vertx_Ed' }
	            },
	            function( reply )
	            {
		            //console.log( 'vertxMongo.GET 3 = ' );
		            //console.log( 'vertxMongo.GET 4 = ' + reply );
		            //console.log( 'vertxMongo.GET 5 = ' + reply.status );

                    message += ", reply.status = " + reply.status;

			        helpers.writeHead   ( session, httpStatus.OK.code );
		                    
                    //console.log( 'vertxMongo.GET 6 = ' );
		                    
                    httpImp.execute( { "session": session, "job": "end", 
                                        "data": { "vt":"krp", "v": "1.0.0", "message": message }, 
                                        "returnIn": "void", "defaultValue": "void", "vt":"krp", "v": "1.0.0" } );
		                    
                    //console.log( 'vertxMongo.GET 7 = ' );
	            });

                //container   .undeployVerticle  ( this.deploymentID );

                //this.remove ( {} );
                //self.update ( {} );
                //console.log( 'vertxMongo.prototype.init 6 = ' );

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

        //console.log( "vertxMongo, _execute, return = " + result );

        return  result
    }
};
