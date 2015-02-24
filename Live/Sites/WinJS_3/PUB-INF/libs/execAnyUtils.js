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

//	When run in node or vertx need to assign to window
//	so that other files will see that exec has been assigned.
if ( typeof jsGlobal.exec === "undefined" )
	jsGlobal.exec = {};

if ( typeof jsGlobal.exec.any === "undefined" )
	jsGlobal.exec.any = {};

if ( typeof jsGlobal.exec.any.utils === "undefined" )
	jsGlobal.exec.any.utils = {};


//	Class AnyUtils start
//

(function( namespace )
{
	function AnyUtils ()
	{
		//this.AnyUtils = namespace.AnyUtils;
		this.statics = namespace.AnyUtils;
	};
	
	AnyUtils.prototype.isNaN	=function ( item )
	{
		var	temp = "" + item;
	
		return	temp.indexOf( "NaN" ) !== -1  &&  temp.length === "NaN".length;
	};
	
	AnyUtils.prototype.isInfinity	=function ( item )
	{
		var	temp = "" + item;
	
		return	temp.indexOf( "Infinity" ) !== -1  &&  temp.length === "Infinity".length;
	};
	
	AnyUtils.prototype.isArray	=function ( item ) {
		return	item instanceof Array;
	};
	
	AnyUtils.prototype.isString	=function ( item ) {
		return	typeof item === "string";
	};
	
	AnyUtils.prototype.isNumber	=function ( item ) {
		return	typeof item === "number";
	};
	
	AnyUtils.prototype.isBoolean	=function ( item ) {
		return	typeof item === "boolean";
	};
	
	AnyUtils.prototype.isUndefined	=function ( item ) {
		return	typeof item === "undefined";
	};
	
	AnyUtils.prototype.isFunction	=function ( item ) {
		return	typeof item === "function";
	};
	
	AnyUtils.prototype.isObject	=function ( item ) {
		
		//	null is treated as an object.
		//	alert ( "1 = " + typeof null );
		return	typeof item === "object";
	};
	
	AnyUtils.prototype.isPixelValue	=function ( item )
	{
		return this.isNumberWithString( item, 'px' );
	};
	
	AnyUtils.prototype.isPercent	=function ( item )
	{
		return this.isNumberWithString( item, '%' );
	};
	
	AnyUtils.prototype.isNonNullObject	=function ( item ) {
	
		return	this.isUndefined	( item ) === false	&&  
				this.isObject		( item ) === true	&&	
				item !== null;
	};
	
	AnyUtils.prototype.isNonNullArray	=function ( item ) {
	
	    //  http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
		//	null is treated as an object.
		//	alert ( "1 = " + typeof null );
		return	this.isUndefined	( item ) === false	&&  
				this.isArray		( item ) === true	;  
	};
	
	AnyUtils.prototype.isNonNanNumber	=function ( item ) {
	
	    //  http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
		//	null is treated as an object.
		//	alert ( "1 = " + typeof null );
		return	this.isNumber	( item ) === true	&&  
				this.isNaN		( item ) === false	;  
	};
	
	AnyUtils.prototype.isNumberOrStringNumber	=function ( item )	{
	
		//	Cannot call this "isNumber" because item may
		//	be a string like "100" and this is not a number
		//	but a string.  Calling it "isNumber" is too confusing
		//	because when it returns true caller may try to compare
		//	"item" to a number (by using ===) but that will fail because 
		//	a string is not a number even if they are the same in appearance.
	
		var	result	= this.isNonNanNumber( item );
	
		if ( result === false  &&  this.isUndefined( item ) === false )
		{
			try
			{
				//	Json converts "100" into a string type.
				//	And then the above this.isNumber( item ); is false.
				//
				//	If this throws an exception then whatever "item" is 
				//	it is not a number.
				//
				//	Firefox 20.0.1, maybe others, will not throw an exception 
				//	if item in undefined.
				var f	= parseFloat( item );
				result	= this.isNonNanNumber( f );
			}
	
			catch ( err )
			{
				result	= false;
			}
		}
	
		return	result;
	};
	
	AnyUtils.prototype.isNumberInRange	=function ( number, low, high )	{
		
	    var result = false;
	    
		if ( this.isNumberOrStringNumber( number ) === true )
	    {
			//	Convert string "100" to 100.
			number = parseFloat ( number );
	
	        if ( number >= low  &&  number <= high )
	            result = true;
	    }
	
		return	result;
	};
	
	AnyUtils.prototype.isNumberWithString	=function ( item, str )
	{
		var	result	= false;
		var	temp 	= "" + item;
		var	index	= temp.indexOf( str );
		
		//	Does item end with str?
		if ( index !== -1  &&  index === temp.length - str.length )
			result = true;

		//	Now take off the str and test
		//	if the result is a number.
		if ( result === true )
		{
			var str = item.replace( str, "" );
			
			result = this.isNumberOrStringNumber ( str );
		}
	
		return result;
	};
	
	AnyUtils.prototype.toValidString =function ( s, defaultS )
	{
		if ( this.isUndefined( s ) === true )
			s = defaultS;
		
		if ( this.isString( s ) === false )
			s = defaultS;
		
		return	s;
	};
	
	AnyUtils.prototype.toValidBoolean =function ( b, defaultB )
	{
		if ( this.isUndefined( b ) === true )
			b = defaultB;
		
		if ( this.isBoolean( b ) === false )
			b = defaultB;
		
		return	b;
	};
	
	AnyUtils.prototype.toValidNumber =function ( number, defaultN )	{
		
		if ( this.isUndefined( number ) === true )
			number = defaultN;
		
		else if ( number === null )
			number = defaultN;
		
		//	Needed for Opera
		else if ( this.isNaN( number ) === true )
			number = defaultN;
		
		else if ( this.isInfinity( number ) === true )
			number = defaultN;
		
		else if ( this.isPercent( number ) === true )
			number = defaultN;
		
		else if ( this.isNumberOrStringNumber( number ) === false )
			number = defaultN;
		
		//else
		//{
			//	Convert string "100" to 100.
			number = parseFloat ( number );
		//}
		
		return	number;
	};
	    
	AnyUtils.prototype.forceNumberInRange	=function ( number, low, high, defaultValue )	{
		
		if ( this.isNumberOrStringNumber( number ) === false )
			number	= defaultValue;
		else
		{
			//	Convert string "100" to 100.
			number = parseFloat ( number );
		}
	
		if ( number < low )
			number	= low;
	
		if ( number > high )
			number	= high;
	
		return	number;
	};
	
	AnyUtils.prototype.appendStringToNumber	=function ( number, str, defaultValue  )
	{
	    return "" + this.toValidNumber( number, defaultValue ) + str;	
	};

	AnyUtils.prototype.removeStringFromNumber	=function ( number, str, defaultValue  )
	{
		if ( this.isNumberWithString( number, str ) === true )
			str = number.replace( str, "" );
		
	    return	this.toValidNumber( str, defaultValue );
	};
	
	AnyUtils.prototype.strStartsWith 	=function ( str1, str2 )
	{
		var		bResult	= false;
		
		if ( this.isString( str1 ) === true  &&  this.isString( str2 ) === true )
		{
			//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
			if ( this.isFunction( str1.startsWith ) === true )
				bResult = str1.startsWith( str2 );
			else
				bResult = str2.length > 0  &&  str1.indexOf( str2 ) === 0;
		}
		
		return  bResult;
	};
	
	AnyUtils.prototype.replaceAll	=function ( path, newSlash )
	{
		return	path.replace( /\\/g, newSlash ); 
	}
		
	AnyUtils.prototype.terminatePathWith 	=function ( path, terminator )
	{
		//	This will force it to a string.
		if ( this.isString( path ) === false  ||  path.length === 0 )
			path = terminator;
		else
		{
			var	value = path[ path.length - 1 ]; 
	    	if ( value === "\\"  ||  value === "/" )
	    		path = path.substring ( 0, path.length - 1 );
	    		
	    	path += terminator;
		}
		
		return	path;
	};
	
	AnyUtils.prototype.getDate_ms= function( now )
	{
		if ( this.isNonNullObject( now ) === false )
			now	= new Date	();
		
		var	h_ms	= now.getHours			() * 60 * 60 * 1000;
		var	m_ms	= now.getMinutes		()      * 60 * 1000;
		var	s_ms	= now.getSeconds		()           * 1000;
		var	mm_ms	= now.getMilliseconds	();
	
		return		h_ms + m_ms + s_ms + mm_ms;
	};
	
	namespace.AnyUtils	= AnyUtils;
	
	//	Static variables:
	//	{
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
			namespace.AnyUtils	.pageLoad		= "pageLoad";
			namespace.AnyUtils	.pageUnload		= "pageUnload";
			namespace.AnyUtils	.systemMessage	= "systemMessage";
			namespace.AnyUtils	.userDefined	= "userDefined";
			
			namespace.AnyUtils	.inherit		= function ( Child, Parent )    {

				//	http://stackoverflow.com/questions/6519095/problem-extending-class-with-javascript-object-prototype
				//
				//	This method works none of the following do.
				Child.prototype = Object.create( Parent.prototype );
			
				//	None of these work in all cases:
				//
				//	Child.prototype = Parent.prototype;
				//
				//	ChildClass.prototype = new ParentClass();
			
				//	The reason is the others overwrite (they don't override or overload, they overwrite)
				//	the functions of the other object.
				//
				//	Here's how to prove it:
				//	1)  Put an alert() in each of the following: ParentClass.prototype.setSrc= function( src )
				//		and ChildClass.prototype.setSrc= function( src )
				//
				//	2)  Create an instance of ParentClass.  With either of the none working methods
				//		ParentClass will call ChildClass's setSrc() - and you will see its alert() -
				//		even if you only create an instance of ParentClass and nowhere create an 
				//		instance of ChildClass.  (Unless you load the source of ParentClass second 
				//		into the browser so that the browser parses the source for ParentClass last.
				//		The opposite is true too:  If you load ChildClass last then its 
				//		setSrc() will always be called.)
			};

			//namespace.AnyUtils	.Utf8ArrayToStr = function( buf ) {
              //  return String.fromCharCode.apply(null, new Uint8Array(buf));
            //}


            /*
            namespace.AnyUtils	.bufferToArrayBuffer = function  ( buffer ) {

                //  http://www.pressinganswer.com/1783006/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
                var ab      = new ArrayBuffer   ( buffer.length );
                var view    = new Uint8Array    ( ab );
                for ( var i = 0; i < buffer.length; ++i )
                    view[ i ] = buffer[ i ];

                return ab;
            }
            */

            namespace.AnyUtils	.arrayBufferToBuffer = function ( ab ) {

                //  http://www.pressinganswer.com/1783006/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
                var buffer  = new Buffer        ( ab.byteLength );
                var view    = new Uint8Array    ( ab );

                for ( var i = 0; i < buffer.length; ++i )
                    buffer[ i ] = view[ i ];

                return buffer;
            }

            /*
            //  http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
            namespace.AnyUtils	.ab2str = function (buf) {
              return String.fromCharCode.apply(null, new Uint16Array(buf));
            }
            */

            //  http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
            namespace.AnyUtils	.str2Uint8Array = function ( buf, start, size, str ) {

              var bufView = new Uint8Array  ( buf, start, size );
              for ( var i=0, strLen=str.length; i<strLen; i++ )
                bufView[ i ] = str.charCodeAt( i );

              return buf;
            }

            /*
            namespace.AnyUtils	.str2ab = function (str) {
              var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
              var bufView = new Uint16Array(buf);
              for (var i=0, strLen=str.length; i<strLen; i++) {
                bufView[i] = str.charCodeAt(i);
              }
              return buf;
            }
            */
			
			namespace.AnyUtils	.Utf8ArrayToStr = function( array ) {

                //  http://stackoverflow.com/questions/8936984/uint8array-to-string-in-javascript
                //  http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

                //  utf.js - UTF-8 <=> UTF-16 convertion
                //
                //  Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
                //  Version: 1.0
                //  LastModified: Dec 25 1999
                //  This library is free.  You can redistribute it and/or modify it.

                var out = "";
                var len = array.length;
                var i = 0;

                while ( i < len )
                {
                    var c = array[ i++ ];

                    switch( c >> 4 )
                    { 
                        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                        {
                            // 0xxxxxxx
                            out += String.fromCharCode( c );
                            break;
                        }

                        case 12: case 13:
                        {
                            // 110x xxxx   10xx xxxx
                            var char2 = array[ i++ ];
                            out += String.fromCharCode( ((c & 0x1F) << 6) | (char2 & 0x3F) );
                            break;
                        }
                          
                        case 14:
                        {
                            // 1110 xxxx  10xx xxxx  10xx xxxx
                            var char2 = array[ i++ ];
                            var char3 = array[ i++ ];
                            out += String.fromCharCode( (( c & 0x0F )       << 12 ) |
                                                        (( char2 & 0x3F )   << 6)   |
                                                        (( char3 & 0x3F )   << 0)   );
                            break;
                        }

                        default:
                        {
                            break;
                        }
                    }
                }

                return out;
            }

            namespace.AnyUtils	.useThis   =function ( sourceObject, sourceHandler )
            {
                //  useThis() allows the use of "this" inside of an event handler:
                //
                //  this.sock 		        = new SockJS	( this.site + this.name );
                //  this.sock.onmessage		= this.useThis( this, "onmessage"   );
                //
	            //  MyClass.prototype.onmessage = function( e )
	            //  {
                //      this.send   ( e.data );
	            //  };
                //
	            //  MyClass.prototype.send  = function( data )
	            //  {
                //      if ( this.sock.readyState === SockJS.OPEN )
                //          this.sock.send ( message );
	            //  };

	            var	f = function( s ){ return sourceObject[ sourceHandler ]( s ); };

			        //	Allows a "remove event handler" to take this handler
                    //  out of a list:
			        //  f.handler	= sourceHandler;

	            return	f;
            };
	//	}

}( jsGlobal.exec.any.utils ) );	//	Attach to this namespace

if ( typeof module !== "undefined"  &&  module !== null  &&  typeof module === "object" )
{
	//console.log ( "exec.underscore module = " + module );
	
	if ( module.exports !== null  &&  typeof module.exports === "object" )
	{
		//console.log ( "exec.underscore module.exports = " + module.exports );

		module.exports	= jsGlobal.exec.any.utils;
		//module.exports.AnyUtils	= exec.underscore.AnyUtils;
		//console.log ( "exec.underscore module.exports.AnyUtils = " + module.exports.AnyUtils );


		//module.exports.AnyUtils._	= exec.underscore.AnyUtils;
		//console.log ( "exec.underscore module.exports.AnyUtils = " + module.exports.AnyUtils );
	}
}


//
//	Class AnyUtils end

//	Add exec app globals:
//
//	When a class is defined in the same file as an assignment 
//	the assignment must come after the class definition.
//exec.utils.globalKmisc	= new exec.utils	.AnyUtils ();

