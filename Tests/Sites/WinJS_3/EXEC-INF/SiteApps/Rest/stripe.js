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

//  http://localhost:7777/stripe?prop&value;
//  http://localhost:7777/stripe?name=fred&age=33

//  Cannot change this to lower case because
//  http://localhost:7777/stripe  is different than
//  http://localhost:7777/stripe

var Version	= require( '../../../Libs/Any/execVersion.js' ).Version;
//var stripe = require('stripe')('sk_MY_SECRET_KEY');

module.exports = function ()	{

    var luo 			= {};	//	Local Use Only
        luo .message    = "";
        luo .body       = "";
	
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

            //console.log( "stripe, execute, 1 = " );

            if ( Version.versionOK( params.v, 1, 0, 0 ) === true )
            {
                //console.log( "stripe, execute, 2 = " );
                jsonResult[ params.returnIn ] = luo._execute ( params.helpers, params.httpImp, params.session, params.methodType, params.method, params.httpStatus, params.console );
            }
            else
            {
                //console.log( "stripe, execute, 3 = " );
                jsonResult  [ params.returnIn ] = params.defaultValue;
                luo .message                = params.v + " is not handled by this implementation";
            }
        }

        catch ( err )
        {
            console.log( "stripe, execute, 4 = " + err );
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( helpers, httpImp, session, methodType, method, httpStatus, console )  {

        //  Nothing in here has been tested with a stripe.com account.
        //  Most of this code comes from this post:
        //  http://nairteashop.org/getting-started-with-stripe-part-2/

        var result = false; //

        method  = method.toString ();
            
        //console.log( "stripe, _execute, 1a = " + httpImp );
        //console.log( "stripe, _execute, 1b = " + session );
        //console.log( "stripe, _execute, 1c = " + methodType );
        //console.log( "stripe, _execute, 1d = " + method );
        //console.log( "stripe, _execute, 1e = " + httpStatus );
        //console.log( "stripe, _execute, 1f = " + console );

        if ( method === methodType.NAME )
        {
            result = "stripe";
            //console.log( "stripe.POST, _execute, return = " + result );
        }

        else if ( method === methodType.DELETE )
        {
            //  
        }

        else if ( method === methodType.GET )
        {
            //  http://localhost:7777/stripe?name=fred&age=33

            /*
		    var parsedQuery	= httpImp.execute( { "session": session, "job": "getRequestQuery", "returnIn": "parsedQuery", "defaultValue": "ERROR", "vt":"krp", "v": "1.0.0" } ).parsedQuery;
		    if ( parsedQuery !== "ERROR" )
		    {
			    console.log( "stripe.GET, parsedQuery = "	+ parsedQuery );
			    console.log( "stripe.GET, query.name = "	    + parsedQuery.name );
			    console.log( "stripe.GET, query.age = " 	    + parsedQuery.age );

                var message = "name is " + parsedQuery.name + ", age is " + parsedQuery.age;

                //  Use parsedQuery
			    helpers.writeHead   ( session, httpStatus.OK.code );
		        httpImp.execute( { "session": session, "job": "end", "data": { "vt":"krp", "v": "1.0.0", "message": message }, "returnIn": "void", "defaultValue": "void", "vt":"krp", "v": "1.0.0" } ).parsedQuery;

                result = httpStatus.OK.code;
		    }
            */
        }
            
        else if ( method === methodType.POST )
        {
            //console.log( "stripe.POST, _execute, 1 = " );

            session.request.on ( 'data', function ( data ) {

                //console.log( "stripe.POST, _execute, 2 = " + data );

                luo.body += data;
                
                //console.log( "stripe.POST, _execute, 3 = " + luo.body );

                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if ( luo.body.length > 1e6)
                { 
                    // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    session.request.connection.destroy();
                }
                
                //console.log( "stripe.POST, _execute, 4 = " + luo.body );
            });

            session.request.on('end', function () {

                //var both    = luo.body.split ( "&" );
                //var first   = both[ 0 ].split ( "=" );
                //var second  = both[ 1 ].split ( "=" );
                
                //console.log( "stripe.POST, _execute, 5a = " + luo.body );
                //console.log( "stripe.POST, _execute, 5b = " + first[ 0 ] );
                //console.log( "stripe.POST, _execute, 5c = " + first[ 1 ] );
                //console.log( "stripe.POST, _execute, 5d = " + second[ 0 ] );
                //console.log( "stripe.POST, _execute, 5e = " + second[ 1 ] );

                //  http://nairteashop.org/getting-started-with-stripe-part-2/
                var stripeToken = luo.body.stripeToken;
                var amount      = 1000;

                stripe.charges.create
                (
                    {
                        card:       stripeToken,
                        currency:   'usd',
                        amount:     amount
                    },

                    function( err, charge )
                    {
                        if ( err )
                            session.response.send   ( 500, err );
                        else
                            session.response.send   ( 204 );
                    }
                );


                //  Don't allow it to accumulate any more.
                luo.body    = "";

                //var POST = qs.parse( luo.body );

                // use POST
                //console.log( "stripe.POST, _execute, 6 = " + POST );
            });
        }

        else if ( method === methodType.PUT )
        {
            //  Update
            //console.log( "stripe.PUT, _execute, return = " + result );
        }

        //console.log( "stripe.POST, _execute, return = " + result );

        return  result
    }
};
