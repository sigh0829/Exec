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

            console.log( "SiteApps, vertxMongo, execute, 1 = " );

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

        if ( method === methodType.NAME )
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
            //  http://localhost:7777/vertxMongo/id/24

		    var	pathname    = httpImp   .execute    ( { "session": session, "job": "getRequestPathname", "returnIn": "pathname", "defaultValue": "ERROR", "vt":"krp", "v": "1.0.0" } ).pathname;
            var split       = pathname  .split      ( '/' );

		    console.log( "vertxMongo.GET, 1, split[ 1 ] = "	+ split[ 1 ] );

		    if ( split[ 2 ] === "id" )
		    {
			    console.log( "vertxMongo.GET, 2, id.number = "	+ split[ 3 ] );

                var message = "id is " + split[ 3 ];

                this.deploymentID   = "";

                var address = "DB1-Persistor";

	            this.config =
	            {
	              address: 			address,
	              db_name: 			"mydb",
	              "host": 			"127.0.0.1",
	              "port": 			27017,
	              "socket_timeout":	5000,  
	              fake: 			false
	            }

	            console.log( 'vertxMongo.GET, 3 = ' );

	            this.collection     = "mycollection";

                console.log( 'vertxMongo.prototype.init 1 = ' + this.dbName );
                console.log( 'vertxMongo.prototype.init 2 = ' + this.collection );

                var self = this;

                //  Deploy the vertx mongo module.
                container.deployModule  ( 'io.vertx~mod-mongo-persistor~2.1.1', this.config, 1, function( err, deployID )
                {
	                console.log( 'deployModule 1 = ' + err );

	                if ( err !== null )
		                err.printStackTrace();
	                else
	                {
		                console.log( 'deployModule 4 = ' + deployID );
            
                        self.deploymentID = deployID;

	                    vertx.eventBus	.send( address,
	                    {
		                    "action": 		'save',
		                    "collection":	self.collection,
		                    "document":		{ name: 	'vertx_Ed' }
	                    },
	                    function( reply )
	                    {
		                    console.log( 'vertxMongo.prototype.update 9 = ' );
		                    console.log( 'vertxMongo.prototype.update 10 = ' + reply );
		                    console.log( 'vertxMongo.prototype.update 11 = ' + reply.status );

                            message += ", reply.status = " + reply.status;

			                helpers.writeHead   ( session, httpStatus.OK.code );
		                    console.log( 'vertxMongo.GET 5c = ' );
		                    httpImp.execute( { "session": session, "job": "end", "data": { "vt":"krp", "v": "1.0.0", "message": message }, "returnIn": "void", "defaultValue": "void", "vt":"krp", "v": "1.0.0" } );
		                    console.log( 'vertxMongo.GET 5d = ' );

	                        //vassert.assertEquals('ok', reply.status);
	                        //vertxTests.startTests(script);
	                    });


		                console.log( 'deployModule 5 = ' );
	                }
                });

                //container   .undeployVerticle  ( this.deploymentID );

                //this.remove ( {} );
                //self.update ( {} );
                console.log( 'vertxMongo.prototype.init 6 = ' );

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
