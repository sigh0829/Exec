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
//  http://localhost:7777/jsEcho/id/24

//var Version	    = require( '../../../../../../Libs/Any/execVersion.js' ).Version;
//var console 	= require( 'vertx/console' );
var container	= require("vertx/container");
var vertx 		= require("vertx")

module.exports = function ()	{

    var luo 		    = {};	//	Local Use Only
    	luo .self	    = this;
    	luo .sock	    = null;
    	luo .data	    = "";
    	luo .system     = null;
        luo .console    = null;
        luo .fileImp    = null;
        luo .httpImp    = null;
        luo .Version    = null;
	
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
    	        luo.system     = params.system;

                luo.console    = luo.system.execute ({ "get": "console",  "returnIn": "console",  "defaultValue": null }).console;
                luo.fileImp    = luo.system.execute ({ "get": "fileImp",  "returnIn": "fileImp",  "defaultValue": null }).fileImp;
                luo.Version    = luo.system.execute ({ "get": "Version",  "returnIn": "Version",  "defaultValue": null }).Version;
                luo.httpImp    = luo.system.execute ({ "get": "httpImp",  "returnIn": "httpImp",  "defaultValue": null }).httpImp;
            }

            jsonResult  [ params.returnIn ] = params.errorValue;

            //luo.console .log( "vertxMongoEcho2_s, execute, 1 = " );

            if ( luo.Version.versionOK( params.v, 1, 0, 0 ) === false )
            {
                //luo.console .log( "jsEcho, execute, 3 = " );
                jsonResult  [ params.returnIn ] = params.errorValue;
                luo .message                	= params.v + " is not handled by this implementation";
            }
            else
            {
                var	method  = params.method;
                
                //luo.console .log( "vertxMongoEcho2_s, execute, 2 = " + method );

                if ( method === params.methodType.INIT )
                {
	                luo.config =
	                {
	                  address: 			"DB1-Persistor",
	                  db_name: 			"mydb",
	                  "host": 			"127.0.0.1",
	                  "port": 			27017,
	                  "socket_timeout":	5000,  
	                  fake: 			false
	                }

	                luo.collection = "mycollection";

                    //luo.console .log( 'vertxMongoEcho2_s, execute, INIT, luo.config.db_name = ' + luo.config.db_name );
                    //luo.console .log( 'vertxMongoEcho2_s, execute, INIT, luo.collection= ' + luo.collection );

                    //  Deploy the vertx mongo module.
                    container.deployModule  ( 'io.vertx~mod-mongo-persistor~2.1.1', luo.config, 1, function( err, deployID )
                    {
	                    //luo.console .log( 'vertxMongoEcho2_s, execute, INIT, err = ' + err );

	                    if ( err !== null )
		                    err.printStackTrace();
	                    else
	                    {
                            luo.myDeployID = deployID;
	                        
                            //luo.console .log( 'vertxMongoEcho2_s, execute, INIT, deployID = ' + deployID );
	                    }
                    });
                }

                else if ( method === params.methodType.NAME )
                {
                 	jsonResult  [ params.returnIn ] = "vertxMongoEcho2";
                }

                else if (  method === params.methodType.ReadFromClient )
                {
                	//	Read means there is data coming from the
                	//	client.  So use it to access the data base
                	//	or do whatever calculations are required.
                	luo.data 	= params.data; 
                	luo.data	+=	", 222222, vertx mongo -->";
                	//luo.data	+=	", SiteApp";
                    
                	//jsonResult  [ params.returnIn ]	= params.successValue;

	                vertx.eventBus	.send( luo.config.address,
	                {
		                "action": 		'save',
		                "collection":	luo.collection,
		                "document":		{ name:	'vertx_Ed' }
	                },
	                function( reply )
	                {
		                //luo.console .log( 'vertxMongoEcho2_s, execute, GET 1 = ' );
		                //luo.console .log( 'vertxMongoEcho2_s, execute, GET 2 = ' + reply );
		                //luo.console .log( 'vertxMongoEcho2_s, execute, GET 3 = ' + reply.status );

                        luo.data    += ", reply.status = " + reply.status;

		                //luo.console .log( 'vertxMongoEcho2_s, execute, GET 4 = ' + luo.data );

                        //  This is an echo so send it back out.
                        params.method	= params.methodType.WriteToClient;
                        luo.self.execute ( params );

		                //luo.console .log( 'vertxMongoEcho2_s, execute 10 = ' );

	                    //vassert.assertEquals('ok', reply.status);
	                    //vertxTests.startTests(script);
	                });

                    //luo.console .log( "vertxMongoEcho2_s, execute, 11 = " + luo.data );
                    
                	//	Since this is echo call write immediately.
                    //params.method	= params.methodType.WriteToClient;
                    jsonResult [ params.returnIn ]	= params.successValue;

                    //luo.console .log( "vertxMongoEcho2_s, execute, 4 = " + luo.data );
                }
                    
                else if ( method === params.methodType.WriteToClient )
                {
                	//	A write means it is time to send to the 
                	//	client whatever the current state dictates.
                	//jsonResult  [ params.returnIn ] = luo.data; 
                    //jsonResult  [ params.returnIn ] = successValue;

                    //luo.console .log( "vertxMongoEcho2_s, execute, 5 = " + luo.data );
                    
                    var result	= params.socketJsImp.execute
                    ({ 
                    	"session": 		params.session, 
                    	"job": 			"writeData", 
                    	"data":			luo.data, 
                    	"returnIn": 	"result", 
                    	"successValue":	params.successValue, 
                    	"errorValue": 	params.errorValue, 
                    	"vt":"krp", 	"v": "1.0.0"
                    }).result;
                	
                    //luo.console .log( "vertxMongoEcho2_s, execute, 6 = " + luo.data );
                    
                    jsonResult  [ params.returnIn ]	= result;
                }
            }
        }

        catch ( err )
        {
            luo.console .log( "vertxMongoEcho2_s, execute, catch = " + err );
            jsonResult  [ params.returnIn ] = params.errorValue;
        }

        //luo.console .log( "vertxMongoEcho2_s, execute, 7 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }
};
