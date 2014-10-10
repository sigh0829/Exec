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
//	like "var exec = {}".

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


//When run in node or vertx need to assign to window
//so that other files will see that exec has been assigned.
if ( typeof jsGlobal.exec === "undefined" )
	jsGlobal.exec = {};

if ( typeof jsGlobal.exec.any === "undefined" )
	jsGlobal.exec.any = {};

if ( typeof jsGlobal.exec.any.version === "undefined" )
	jsGlobal.exec.any.version = {};


(function( namespace )
{
	function Version ()
	{
		//this.Utils = namespace.Utils;
		this.statics = namespace.Version;
	};
	
	namespace.Version	= Version;
	
	//	Static variables:
	//	{
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
			//namespace.Version	.pageLoad		= "pageLoad";
			
			namespace.Version	.versionOK	= function ( version, major, minor, change )    {

		        //  I don't really know what to do here.
		        return  namespace.Version.versionPart( version, 0, -1 ) >= major    &&  
		        		namespace.Version.versionPart( version, 1, -1 ) == minor    &&  
		        		namespace.Version.versionPart( version, 2, -1 ) == change   ;
		    };
		    

		    //  execute() should handle all previous versions.
		    //  Since this is version 1 there is only one version to handle.
		    //	if ( luo.versionOK( params.v, 1, 0, 0 ) === true ) {}
		    namespace.Version.versionPart = function ( version, part, defaultValue )    {

		        var result  = defaultValue;

		        try
		        {
		            var temp    = version.split( '.' );
		            result      = parseFloat( temp[ part ] );
		        }
		        catch ( err )   { result = defaultValue}

		        return result;
		    };
	//	}
	

}( jsGlobal.exec.any.version ) );	//	Attach to this namespace


if ( typeof module !== "undefined"  &&  module !== null  &&  typeof module === "object" )
{
	//console.log ( "exec.underscore module = " + module );
	
	if ( module.exports !== null  &&  typeof module.exports === "object" )
	{
		//console.log ( "exec.underscore module.exports = " + module.exports );

		module.exports	= jsGlobal.exec.any.version;
		//module.exports.Utils	= exec.underscore.Utils;
		//console.log ( "exec.underscore module.exports.Utils = " + module.exports.Utils );


		//module.exports.Utils._	= exec.underscore.Utils;
		//console.log ( "exec.underscore module.exports.Utils = " + module.exports.Utils );
	}
}
