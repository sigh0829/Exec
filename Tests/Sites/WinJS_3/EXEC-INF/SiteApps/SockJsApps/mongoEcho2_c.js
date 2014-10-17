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

//	Because, when run in node or vertx, this is in a module assignments to
//	variables are effectively ignored (or at least never should be used externally).
//	like "var site_winjs_3 = {}".

//	For code that is expected to run with node, vertx, or in the browser
//	it is important to assign properties to the "global" object explicitly.
//	In the future some other provider (not node, vertx, or the browser) may
//	come up with a new name for their "global" object.  Internally I will
//	be using a global variable name that I can "expect" will never be reused.
//	That way no matter what javascript system this code is running on it should
//	continue to work by only making minimum modifications to this intro section.

//	When run in node or vertx window is undefined
if ( typeof window !== "undefined" )
	jsGlobal = window;
else
{
	//	In vertx global hasn't been defined yet inside of a module.
	if ( typeof global !== "undefined" )
		jsGlobal = global;
	else
	{
		//	execGlobal.js is empty.  It's only purpose is to
		//	create a global variable in vertx.  The first
		//	time vertx "requires" a file it sets up an internal
		//	global so that the next time a user tries to load
		//	the file it will check to see if that has already been
		//	done and if so it will not read it again but instead
		//	return a reference to the already created global.
		jsGlobal = require( './vertxGlobal.js' );
	}
}

//	When run in node or vertx need to assign to window
//	so that other files will see that site_winjs_3 has been assigned.
if ( typeof jsGlobal.site_winjs_3 === "undefined" )
	jsGlobal.site_winjs_3 = {};

if ( typeof jsGlobal.site_winjs_3.mongoecho2 === "undefined" )
	jsGlobal.site_winjs_3.mongoecho2 = {};


//	Class MongoEcho2_c start
//

(function( namespace )
{
	function MongoEcho2_c ()
	{
        //console.log		( 'MongoEcho2_c 1 ' );
        
		this.site		= location.protocol + "//" + location.hostname + ":" + location.port;
		this.name		= '/mongoEcho2';
		this.statics	= namespace.MongoEcho2_c;
		
        //console.log		( 'MongoEcho2_c 2 = ' + this.site );
        //console.log		( 'MongoEcho2_c 3 = ' + (this.site + name) );
        
		this.sock 		= new SockJS	( this.site + this.name );
		this.sock		.onopen			= this.onopen;
		this.sock		.onmessage		= this.onmessage;
		this.sock		.onclose		= this.onclose;
        
		//console.log		( 'MongoEcho2_c 4 = ' + (this.site + this.name) );
	};
	
	MongoEcho2_c.prototype.onopen	=function ()
	{
        console.log('open'); 
        this.send ( "mongoEcho2: here here here" );
	};
	
	MongoEcho2_c.prototype.onmessage= function( e )
	{
        console.log('message', e.data); 
	};
	
	MongoEcho2_c.prototype.onclose= function()
	{
        console.log('close mongoEcho2 at ' + this.site ); 
	};
	
	MongoEcho2_c.prototype.send= function( message )
	{
        if ( this.sock.readyState === SockJS.OPEN )
        { 
            console.log("sending message from mongoEcho2") 
            this.sock.send(message); 
        }
        else
        {
            console.log("The socket is not open."); 
        }
	};
	
	namespace.MongoEcho2_c	= MongoEcho2_c;
	
	//	Static variables:
	//	{
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
			namespace.MongoEcho2_c	.pageLoad		= "pageLoad";
			
			namespace.MongoEcho2_c	.someFunc		= function ( param1, param2 )
			{
			};
	//	}

}( jsGlobal.site_winjs_3.mongoecho2 ) );	//	Attach to this namespace

if ( typeof module !== "undefined"  &&  module !== null  &&  typeof module === "object" )
{
	//console.log ( "site_winjs_3.underscore module = " + module );
	
	if ( module.exports !== null  &&  typeof module.exports === "object" )
	{
		//console.log ( "site_winjs_3.underscore module.exports = " + module.exports );

		module.exports	= jsGlobal.site_winjs_3.mongoecho2;
		//module.exports.MongoEcho2_c	= site_winjs_3.underscore.MongoEcho2_c;
		//console.log ( "site_winj_3.underscore module.exports.MongoEcho2_c = " + module.exports.MongoEcho2_c );


		//module.exports.MongoEcho2_c._	= site_winjs_3.underscore.MongoEcho2_c;
		//console.log ( "site_winjs_3.underscore module.exports.MongoEcho2_c = " + module.exports.MongoEcho2_c );
	}
}


//
//	Class MongoEcho2_c end

//	Add site_winjs_3 app globals:
//
//	When a class is defined in the same file as an assignment 
//	the assignment must come after the class definition.
//site_winjs_3.mongoecho2.globalKmisc	= new site_winjs_3.mongoecho2	.MongoEcho2_c ();

var sockJsEcho2 = new site_winjs_3.mongoecho2	.MongoEcho2_c ();
