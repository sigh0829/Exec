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

if ( typeof jsGlobal.exec.server === "undefined" )
	jsGlobal.exec.server = {};

if ( typeof jsGlobal.exec.server.mime === "undefined" )
	jsGlobal.exec.server.mime = {};


//	Class MimeTypes start
//

(function( namespace )
{
	function MimeTypes ()
	{
		//this.MimeTypes = namespace.MimeTypes;
		this.statics = namespace.MimeTypes;
		
	    this.mimeTypes	        	= {};
	    this.mimeTypes	.css		= namespace.MimeTypes.css;		//	"text/css;charset=UTF-8";
	    this.mimeTypes	.html		= namespace.MimeTypes.html;		//	"text/html;charset=UTF-8";
	    this.mimeTypes	.ico		= namespace.MimeTypes.ico;		//	"image/x-icon";	//	favicon
	    this.mimeTypes	.js			= namespace.MimeTypes.js;		//	"text/javascript;charset=UTF-8";
	    this.mimeTypes	.json		= namespace.MimeTypes.json;		//	"text/plain;charset=UTF-8";
	    this.mimeTypes	.lang		= namespace.MimeTypes.lang;		//	"text/xml";
	    this.mimeTypes	.metadata	= namespace.MimeTypes.metadata;	//	"text/xml";
	    this.mimeTypes	.pdf		= namespace.MimeTypes.pdf;		//	"application/pdf";	
	    this.mimeTypes	.ttf		= namespace.MimeTypes.ttf;		//	"application/x-font-ttf";// or "application/x-font-truetype"	
	    this.mimeTypes	.txt		= namespace.MimeTypes.txt;		//	"text/plain;charset=UTF-8";
	    this.mimeTypes	.xml		= namespace.MimeTypes.xml;		//	"text/xml";

	    this.mimeTypes	.gif		= namespace.MimeTypes.gif;		//	"image/GIF";
	    this.mimeTypes	.jpg		= namespace.MimeTypes.jpg;		//	"image/JPEG";
	    this.mimeTypes	.jpeg		= namespace.MimeTypes.jpeg;		//	"image/JPEG";
	    this.mimeTypes	.mp3		= namespace.MimeTypes.mp3;		//	"audio/mpeg";
	    this.mimeTypes	.mp4		= namespace.MimeTypes.mp4;		//	"video/mp4";
	    this.mimeTypes	.ogg		= namespace.MimeTypes.ogg;		//	"audio/ogg";
	    this.mimeTypes	.ogv		= namespace.MimeTypes.ogv;		//	"video/ogg";
	    this.mimeTypes	.png		= namespace.MimeTypes.png;		//	"image/png";
	};
	
	MimeTypes.prototype.getMimeTypes = function ()	{
		return this.mimeTypes;
    }
	
	MimeTypes.prototype.getMimeType = function ( name )	{
		return  this.mimeTypes[ name ];
    }
	
	MimeTypes.prototype.addMimeType = function ( name, mimeType )	{
//	not tested
		this.mimeTypes[ name ] = mimeType;
    }
	
	namespace.MimeTypes	= MimeTypes;
	
	//	Static variables:
	//	{
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
		    namespace.MimeTypes	.css		= "text/css;charset=UTF-8";
		    namespace.MimeTypes	.html		= "text/html;charset=UTF-8";
		    namespace.MimeTypes	.ico		= "image/x-icon";	//	favicon
		    namespace.MimeTypes	.js			= "text/javascript;charset=UTF-8";
		    namespace.MimeTypes	.json		= "text/plain;charset=UTF-8";
		    namespace.MimeTypes	.lang		= "text/xml";
		    namespace.MimeTypes	.metadata	= "text/xml";
		    namespace.MimeTypes	.pdf		= "application/pdf";	
		    namespace.MimeTypes	.ttf		= "application/x-font-ttf";// or "application/x-font-truetype"	
		    namespace.MimeTypes	.txt		= "text/plain;charset=UTF-8";
		    namespace.MimeTypes	.xml		= "text/xml";

		    namespace.MimeTypes	.gif		= "image/GIF";
		    namespace.MimeTypes	.jpg		= "image/JPEG";
		    namespace.MimeTypes	.jpeg		= "image/JPEG";
		    namespace.MimeTypes	.mp3		= "audio/mpeg";
		    namespace.MimeTypes	.mp4		= "video/mp4";
		    namespace.MimeTypes	.ogg		= "audio/ogg";
		    namespace.MimeTypes	.ogv		= "video/ogg";
		    namespace.MimeTypes	.png		= "image/png";
			
			//namespace.MimeTypes	.inherit		= function ( Child, Parent )
			//{
			//};
	
			//namespace.MimeTypes.isUrlSafe = function ( pathname )	{
		    //}
	//	}

}( jsGlobal.exec.server.mime ) );	//	Attach to this namespace

if ( typeof module !== "undefined"  &&  module !== null  &&  typeof module === "object" )
{
	if ( module.exports !== null  &&  typeof module.exports === "object" )
		module.exports	= jsGlobal.exec.server.mime;
}


//
//	Class MimeTypes end

//	Add exec app globals:
//
//	When a class is defined in the same file as an assignment 
//	the assignment must come after the class definition.
//exec.utils.globalKmisc	= new exec.utils	.MimeTypes ();

