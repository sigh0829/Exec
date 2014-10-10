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

var Version	= require( '../../../../../../Libs/Any/execVersion.js' ).Version;

module.exports = function ()	{

    var luo 		= {};	//	Local Use Only
    	luo .sock	= null;
    	luo .data	= "";
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            //  Vertx doesn't provide a built in console.
            //  So, it needs to be passed in from vertxConfig.js 
            console     = params.console;

            jsonResult  [ params.returnIn ] = params.errorValue;

            //console.log( "sockJsEcho2_s, execute, 1 = " );

            if ( Version.versionOK( params.v, 1, 0, 0 ) === false )
            {
                //console.log( "jsEcho, execute, 3 = " );
                jsonResult  [ params.returnIn ] = params.errorValue;
                luo .message                	= params.v + " is not handled by this implementation";
            }
            else
            {
                var	method  = params.method;
                
                //console.log( "sockJsEcho2_s, execute, 2 = " + method );

                if ( method === params.methodType.NAME )
                {
                 	jsonResult  [ params.returnIn ] = "echo2";
                }

                else if (  method === params.methodType.ReadFromClient )
                {
                	//	Read means there is data coming from the
                	//	client.  So use it to access the data base
                	//	or do whatever calculations are required.
                	luo.data 	= params.data; 
                	luo.data	+=	", 222222";
                	//luo.data	+=	", SiteApp";
                    
                	//jsonResult  [ params.returnIn ]	= params.successValue;

                    //console.log( "sockJsEcho2_s, execute, 3 = " + luo.data );
                    
                	//	Since this is echo call write immediately.
                    params.method	= params.methodType.WriteToClient;
                    jsonResult [ params.returnIn ]	= this.execute ( params );

                    //console.log( "sockJsEcho2_s, execute, 4 = " + luo.data );
                }
                    
                else if ( method === params.methodType.WriteToClient )
                {
                	//	A write means it is time to send to the 
                	//	client whatever the current state dictates.
                	//jsonResult  [ params.returnIn ] = luo.data; 
                    //jsonResult  [ params.returnIn ] = successValue;

                    //console.log( "sockJsEcho2_s, execute, 5 = " + luo.data );
                    
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
                	
                    //console.log( "sockJsEcho2_s, execute, 6 = " + luo.data );
                    
                    jsonResult  [ params.returnIn ]	= result;
                }
            }
        }

        catch ( err )
        {
            console.log( "sockJsEcho2_s, execute, catch = " + err );
            jsonResult  [ params.returnIn ] = params.errorValue;
        }

        //console.log( "sockJsEcho2_s, execute, 7 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }
};
