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

if ( typeof jsGlobal.exec.server.utils === "undefined" )
	jsGlobal.exec.server.utils = {};


var	MimeTypes = require( './execMimeTypes.js' ).MimeTypes;


//	Class ServerUtils start
//

(function( namespace )
{
	function ServerUtils ()
	{
		//this.ServerUtils = namespace.ServerUtils;
		this.statics = namespace.ServerUtils;
	};
	
	/*
	ServerUtils.prototype.isUrlSafe = function ( httpImp, session )	{
    	
	    //	http://eloquentjavascript.net/20_node.html
	    //	Now consider the fact that paths passed to the "fs" functions can be relative—they may 
	    //	contain "../" to go up a directory. What happens when a client sends requests to URLs like 
	    //	the ones below?
	    //		http://myhostname:8000/../.config/config/google-chrome/Default/Web%20Data
	    //		http://myhostname:8000/../.ssh/id_dsa
	    //		http://myhostname:8000/../../../etc/passwd
	    //
	    //	Change urlToPath to fix this problem. Take into account the fact that Node on Windows 
	    //	allows both forward slashes and backslashes to separate directories.
	    //
	    //	Also, meditate on the fact that as soon as you expose some half-baked system on the Internet, 
	    //	the bugs in that system might be used to do bad things to your machine.

        //  A complete http server would need to 
        //  handle many forms of input for a website including sub-domains.
        //
        //  http://localhost:7777/myApi?name=fred&age=33
        //  http://localhost:7777/index.html
        //  http://localhost:7777/subFolder1/subPage2.html
        //  http://localhost:7777/books/id/24
        //
        //  Example sub-domain request
        //  http://space.site.com/subFolder1/subPage2.html

	
	    var	okay		= true;
	    var	pathname	= httpImp.execute( { "session": session, "job": "getRequestPathname", "returnIn": "pathname", "defaultValue": "..", "vt":"krp", "v": "1.0.0" } ).pathname;

	    //console.log( "helpers.isUrlSafe, 1a = " + pathname );

        //  Allow the default file and allow all rest api calls

	    //	Don't allow this because it may allow the user
        //  to look into folders outside of the website.
	    if ( okay === true )
		    okay = pathname.indexOf ( ".." ) < 0;
	
	    //console.log( "helpers.isUrlSafe, 4 = " + okay );

        / *
	    //	If it is an approved extension then it may be okay. 
	    if ( okay === true )
        {
            //  The extension can be empty:
            //  http://localhost:7777/books/id/24
            var     ext = helpers.getFileExt( pathname );
		    okay =  ext in extType;
        }
        * /
	
	    //console.log( "helpers.isUrlSafe, 6 = " + okay );
	
	    return	okay;
    }
	*/
	
	namespace.ServerUtils	= ServerUtils;
	
	//	Static variables:
	//	{
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
			//namespace.ServerUtils	.userDefined	= "userDefined";
			
			//namespace.ServerUtils	.inherit		= function ( Child, Parent )
			//{
			//};
	
			namespace.ServerUtils.isServerSideScript = function ( pathname )	{
				
				var	result	= false;
		    	
			    var	test	= '_s.js';
		        var index	= pathname.lastIndexOf ( test );
		        
		        if ( index >= 0 )
		        {
			        //console.log( 'ServerUtils.isServerSideScript 1 = ' + pathname );
			        //console.log( 'ServerUtils.isServerSideScript 2 = ' + index );
			        //console.log( 'ServerUtils.isServerSideScript 3 = ' + pathname.length );
			        //console.log( 'ServerUtils.isServerSideScript 4 = ' + test.length );
			        //console.log( 'ServerUtils.isServerSideScript 5 = ' + (pathname.length - test.length) );
			        
			        
			        //	If it ends with '_s.js' then it is a
			        //	server side script and should not be 
			        //	allowed off of the server.
				    result	= (pathname.length - test.length) === index;

				    //console.log( 'ServerUtils.isServerSideScript 5 = ' + result );
		        }
		        
			    return	result;
		    }
			
			namespace.ServerUtils.isIpAddressAllowed = function ( ipAddress )	{
		    	
			    var	okay	= true;
		
			    return	okay;
		    }
			
			namespace.ServerUtils.otherSessionCoop = function ( ipAddress )	{
		    	
			    var	okay	= false;
		
			    return	okay;
		    }
			
			namespace.ServerUtils.isDosAttach = function ()	{
		    	
			    var	okay	= false;
		
			    return	okay;
		    }
			
			namespace.ServerUtils.isUrlSafe = function ( pathname )	{
		    	
			    //	http://eloquentjavascript.net/20_node.html
			    //	Now consider the fact that paths passed to the "fs" functions can be relative—they may 
			    //	contain "../" to go up a directory. What happens when a client sends requests to URLs like 
			    //	the ones below?
			    //		http://myhostname:8000/../.config/config/google-chrome/Default/Web%20Data
			    //		http://myhostname:8000/../.ssh/id_dsa
			    //		http://myhostname:8000/../../../etc/passwd
			    //
			    //	Change urlToPath to fix this problem. Take into account the fact that Node on Windows 
			    //	allows both forward slashes and backslashes to separate directories.
			    //
			    //	Also, meditate on the fact that as soon as you expose some half-baked system on the Internet, 
			    //	the bugs in that system might be used to do bad things to your machine.
		
		        //  A complete http server would need to 
		        //  handle many forms of input for a website including sub-domains.
		        //
		        //  http://localhost:7777/myApi?name=fred&age=33
		        //  http://localhost:7777/index.html
		        //  http://localhost:7777/subFolder1/subPage2.html
		        //  http://localhost:7777/books/id/24
		        //
		        //  Example sub-domain request
		        //  http://space.site.com/subFolder1/subPage2.html
		
			
			    var	okay		= true;
		
			    //console.log( "helpers.isUrlSafe, 1a = " + pathname );
		
		        //  Allow the default file and allow all rest api calls
		
			    //	Don't allow this because it may allow the user
		        //  to look into folders outside of the website.
			    if ( okay === true )
				    okay = pathname.indexOf ( ".." ) < 0;
			
			    //console.log( "helpers.isUrlSafe, 4 = " + okay );
		
		        /*
			    //	If it is an approved extension then it may be okay. 
			    if ( okay === true )
		        {
		            //  The extension can be empty:
		            //  http://localhost:7777/books/id/24
		            var     ext = helpers.getFileExt( pathname );
				    okay =  ext in extType;
		        }
		        */
			
			    //console.log( "helpers.isUrlSafe, 6 = " + okay );
			
			    return	okay;
		    }
			
			namespace.ServerUtils.getFileName = function ( pathname, restStart )	{
			
		        //  url:        http://localhost:7777/index.html
		        //  filename:   index

			    var	filename 	= "" + pathname;

		        var lastSlash   = pathname.lastIndexOf ( '/' );
		        if ( lastSlash >= 0 )
		            filename = pathname.substring ( lastSlash + 1 );

		        //  html, gif, png?
		        var ext = namespace.ServerUtils.getFileExt ( filename );
		        if ( ext.length > 0 )
		        {
		            //  If there is an extension the filename
		            //  is everything before it.
		            var extIndex    = filename  .indexOf    ( ext );
		            filename        = filename  .substring  ( 0, extIndex - 1 ); // get rid of '.'
		        }

		        else
		        {
		            //  If there is no filename then use the rest api
		            //  as the filename:  http://localhost:7777/myApi?prop&value;
		            //  Does this quiry have a question mark in it?
				    var indexOfQuery = filename.indexOf( "?" );
		            if ( indexOfQuery > 0 )
		            {
		                filename = filename.substring ( 0, indexOfQuery );
			            //console.log( "getFileName 3 = " + filename );
		            }

		            else if ( restStart === true )
		            {
		                //  http://localhost:7777/books/id/24
		                //  comes in here as "/books/id/24"
		                //  so return "books"

		                //  The first "/"
		                var index = pathname.indexOf ( '/' );
		                if ( index === 0 )
		                    pathname = pathname.substring( 1 );

		                filename = pathname;

		                //  return "books"
		                var index = filename.indexOf ( '/' );
		                if ( index > 0 )
		                    filename = filename.substring( 0, index );

			            //console.log( "getFileName 4a = " + site );
			            //console.log( "getFileName 4b = " + filename );
		            }

		            else 
		            {
		                //  C:/folder/books/id

		                filename = pathname;

		                //  return "books"
		                var index = filename.lastIndexOf ( '/' );
		                if ( index > 0 )
		                    filename = filename.substring( index + 1 );
		            }
		        }

			    //console.log( "getFileName 4 = " + filename );
			
		        //  Cannot change this to lower case because
		        //  http://localhost:7777/myApi  is different than
		        //  http://localhost:7777/myapi
		        //
		        //  The caller should decide if they want
		        //  only lower case.
			    return filename;//.toLowerCase();
		    }
			
			namespace.ServerUtils.getFileExt = function ( pathname )	{
			
		        //  for url:    http://localhost:7777/index.html
		        //  ext should be "html"
		    
		        //  TODO:  check errors for:
		        //  http://localhost:7777/api/{ url: something.html }
		        //  http://localhost:7777/api/{ url: something.html
		        //  http://localhost:7777/index.html?
		        //  http://localhost:7777/api/10.6/

			    pathname    = "" + pathname;

			    var	ext 	= "";
			    var okay    = true;
			
			    if ( okay === true )
				    okay = pathname.lastIndexOf( "." ) > 0;
				
			    if ( okay === true )
				    okay = pathname.length > 1;	//	 more than ending with ".".
				
			    if ( okay === true )
				    ext = pathname.substring ( pathname.lastIndexOf( "." ) + 1, pathname.length );

			    //console.log( "getFileExt = " + ext );

		        //  This is a cheating way to check for errors.
		        //if ( okay === true ) //  &&  (ext in extType) === false )
		          //  ext = "";
			
			    //	Some files from the browser can have extensions like: "JPG".
			    return ext.toLowerCase();
		    }


            namespace.ServerUtils.createFolder = function ( system, console, fileImp, toFolder )  {

                try
                {
                    var	exists = fileImp  .execute	( { "system":system, "job":"getInfo", "get":"exists", "pathname":toFolder, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
                    if ( exists === false )
                        fileImp  .execute	( { "system":system, "job":"createFolder", "pathname":toFolder, "async":false, "returnIn": "result", "defaultValue": { "code":400 }, "vt":"krp", "v": "1.0.0"  } ).result;
                }
                catch ( err )
                {
                    console.log ( "function createFolder, catch, err = " + err );
                }
            }

            namespace.ServerUtils.moveFile = function ( system, console, fileImp, toFolder, fromPathName, toPathName )  {

                try
                {
                    //  Read the libray then write it to the new location.
                    var fromContent = fileImp.execute	( { "system":system, "job":"readTextFile", 
                                                                "pathname":fromPathName, "async":false, 
                                                                    "data":"krp", "returnIn": "result", "defaultValue": { "contents":"" }, 
                                                                        "vt":"krp", "v": "1.0.0"  } ).result.contents;

                        fileImp  .execute	( { "system":system, "job":"writeTextFile", 
                                                "pathname":toPathName, "async":false, 
                                                    "data":fromContent, "returnIn": "result", "defaultValue": { "code":400 }, 
                                                        "vt":"krp", "v": "1.0.0"  } ).result;
                }
                catch ( err )
                {
                    console.log ( "function moveFile, catch, err = " + err );
                }
            }
	
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
			
		    //  http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
			namespace.ServerUtils	.httpStatus          			= {};
			namespace.ServerUtils	.httpStatus.OK                  = { code:200, 	contentType: MimeTypes.html, message:"OK"                      };
			namespace.ServerUtils	.httpStatus.NoContent           = { code:204, 	contentType: MimeTypes.html, message:"No Content"              };
			namespace.ServerUtils	.httpStatus.BadRequest          = { code:400, 	contentType: MimeTypes.html, message:"Bad Request"             };
			namespace.ServerUtils	.httpStatus.InternalServerError	= { code:500, 	contentType: MimeTypes.html, message:"Internal Server Error"   };
			namespace.ServerUtils	.httpStatus.NotImplemented      = { code:501, 	contentType: MimeTypes.html, message:"Not Implemented"         };

			//	Used for curlTests.cmd
			namespace.ServerUtils	.httpStatus.FileImpTestOkay		= { code:9999,	contentType: MimeTypes.html, message:"FileImpTestOkay"         };
	//	}

}( jsGlobal.exec.server.utils ) );	//	Attach to this namespace

if ( typeof module !== "undefined"  &&  module !== null  &&  typeof module === "object" )
{
	//console.log ( "exec.underscore module = " + module );
	
	if ( module.exports !== null  &&  typeof module.exports === "object" )
	{
		//console.log ( "exec.underscore module.exports = " + module.exports );

		module.exports	= jsGlobal.exec.server.utils;
		//module.exports.ServerUtils	= exec.underscore.ServerUtils;
		//console.log ( "exec.underscore module.exports.ServerUtils = " + module.exports.ServerUtils );


		//module.exports.ServerUtils._	= exec.underscore.ServerUtils;
		//console.log ( "exec.underscore module.exports.ServerUtils = " + module.exports.ServerUtils );
	}
}


//
//	Class ServerUtils end

//	Add exec app globals:
//
//	When a class is defined in the same file as an assignment 
//	the assignment must come after the class definition.
//exec.utils.globalKmisc	= new exec.utils	.ServerUtils ();

