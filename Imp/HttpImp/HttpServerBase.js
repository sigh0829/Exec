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

//	https://www.npmjs.org/doc/files/npm-folders.html
//	https://www.npmjs.org/
//	http://nodejs.org/
//	http://nodejs.org/api/http.html#http_http_incomingmessage
//	http://www.hacksparrow.com/how-to-write-node-js-modules.html
//	http://wiki.commonjs.org/wiki/Modules/1.1

var ServerUtils	= require( '../../Libs/Server/execServerUtils.js'	).ServerUtils;
var MimeTypes	= require( '../../Libs/Server/execMimeTypes.js'		).MimeTypes;
var AnyUtils	= require( '../../Libs/Any/execAnyUtils.js'			).AnyUtils;

//class HttpServerBase start
function	HttpServerBase	()
{
    this.system     = null;
	this.server		= null;
	
	//	https://github.com/winjs/winjs
	//	https://github.com/mozbrick/brick , http://brick.readme.io/
	//	https://www.polymer-project.org/
	this.site               = "Sites/TestForm";
    this.defaultFilename    = "index.html";
    this.noExtensionHandler = null;
	
    this.anyUtils			= new AnyUtils	();
	this.mimeTypes			= new MimeTypes ();
	this.fileImp	        = null;
	this.noSqlImp           = null;
	this.sqlImp             = null;
	
    //  Using noExtensionHandler
    //this.restHandlers       = {};
};

HttpServerBase.prototype.execute = function ( params )
{
    var jsonResult  = {};

    try
    {
        //  All execute functions are told by the caller
        //  where to put the return value.  This is the name
        //  of the property in the json object where the caller
        //  will look for the result.  For example if the user
        //  wants the result in a property called "pathname" they
        //  would set up execute() like this:
        //  var	result      = this.execute( { "system":this.system, "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR" } );
        //  var pathname    = result.pathname;
        //  if ( pathname === "myERROR" ) {}
        jsonResult  [ params.returnIn ] = params.defaultValue;

        //  Must call getSystemInfo() first
        //  console.log( "HttpServerBase, execute, 1 = " + params.v);

        if ( this.getSystemInfo( params ) === false )
            jsonResult  [ params.returnIn ] = this.getVersionErrorMessage ( params );
        else
        {
            //console.log( "HttpServerBase, execute, 2 = " );

	        //  These are the functions that vertxHttpServer provides to switch.js
	        switch ( params.job )
	        {
		        case "isOK":                jsonResult[ params.returnIn ] 	= this.isOK( params.session );	break;

                case "init":    			jsonResult[ params.returnIn ]   = this.init    	    ( params ); break;
                case "create":				jsonResult[ params.returnIn ]   = this.create		( params ); break;
                case "listen":				jsonResult[ params.returnIn ]   = this.listen		( params ); break;
                case "initCreate":			jsonResult[ params.returnIn ]   = this.initCreate	( params ); break;
    			
		        case "getServer":			jsonResult[ params.returnIn ] 	= this.getServer	();         break;

                case "getErrorMessage":     jsonResult[ params.returnIn ] 	= this.getErrorMessage    	( params.session );	break;
                case "getRequestHref":      jsonResult[ params.returnIn ] 	= this.getRequestHref     	( params.session ); break;
                case "getRequestMethod":    jsonResult[ params.returnIn ] 	= this.getRequestMethod   	( params.session ); break;
                case "getRequestPathname":	jsonResult[ params.returnIn ] 	= this.getRequestPathname	( params.session ); break;
                case "getRequestQuery":     jsonResult[ params.returnIn ] 	= this.getRequestQuery    	( params.session ); break;
                case "sendFile":            jsonResult[ params.returnIn ] 	= this.sendFile           	( params.session, params.params, params.success, params.failure );  break;

                case "startHandler":        jsonResult[ params.returnIn ] 	= this.startHandler         ( params.session, params.callback );  break;
                case "endHandler":          jsonResult[ params.returnIn ] 	= this.endHandler           ( params.session, params.callback );  break;

		        case "end":			        jsonResult[ params.returnIn ] 	= this.end			( params );  break;
		        case "setHeader":	        jsonResult[ params.returnIn ] 	= this.setHeader	( params );  break;
		        case "statusCode":	        jsonResult[ params.returnIn ] 	= this.statusCode	( params );  break;
		
		        default:
                {
                    jsonResult  	[ params.returnIn ] = params.defaultValue;
                    //console	.log ( "HttpServerBase, execute, default = " + params.job );
                    break;
                }
	        }
        }
    }

    catch ( err )
    {
        console.log( "HttpServerBase, execute, catch = " + err );
        jsonResult  [ params.returnIn ] = params.defaultValue;
    }

    //console.log( "HttpServerBase, execute, 4 = " + jsonResult[ params.returnIn ] );
    return jsonResult;
};

HttpServerBase.prototype.getSystemInfo = function ( params )
{
    var result  = false;

    try
    {
        if (    this.system === null                    &&  
                typeof params.system !== "undefined"    &&  
                params.system !== null                  &&  
                typeof params.system.execute === "function"
           )
        {
    	    this.system     = params.system;

            this.fileImp    = this.system.execute ({ "get": "fileImp",  "returnIn": "fileImp",  "defaultValue": null }).fileImp;
            this.site       = this.system.execute ({ "get": "site",     "returnIn": "site",     "defaultValue": null }).site;
        }
    	
        //  For version 1 sytle "params" need to check params.console.
        //
        //  Vertx doesn't provide a built in console.
        //  So, it needs to be passed in from vertxConfig.js 
        //if ( console === null )
    	  //  console = params.console;
    	
        //  This must come after console is defined for vertx systems.
        //console.log( "HttpServerBase, getSystemInfo, 1a = " + params.v );
        //console.log( "HttpServerBase, getSystemInfo, 1b = " + (typeof params.v === "string") );

        result = true;

        //console.log( "HttpServerBase, getSystemInfo, 2 = " + result );
    }

    catch ( err )
    {
        result = false;
    }

    return  result;
}

HttpServerBase.prototype.getVersionErrorMessage = function ( params )	{
	
    if ( typeof params.session === "undefined" )
        params.session = {};

    params.session.message	= params.v + " is not handled by this implementation";
	
	return params.defaultValue;
}

HttpServerBase.prototype.initCreate = function ( params )	{
	
	this.init		( params );
	this.create 	( params );
	
	return true;
}

HttpServerBase.prototype.init = function ( params )	{
	
	try
	{
	    //	Read in any config data here.
	    this.readMimeTypes ();
	    
	    
        //  Reset the websites default file name.
        if ( typeof params.defaultFilename !== "undefined" )
            this.defaultFilename = params.defaultFilename;


        //  Any request that is not a rest api, but does not have
        //  and extension will be handled by this.noExtensionHandler
        if ( typeof params.noExtensionHandler !== "undefined" )
            this.noExtensionHandler = params.noExtensionHandler;


        //  Using noExtensionHandler
        /*
	    //	If no rest apps are requested this is undefined.
	    if ( typeof params.rest !== "undefined" )
	    {
		    var	self = this;
		    
		    //  Get all of the rest api's the caller wants this to handle.
		    params.rest.forEach ( function addNumber( value )
		    {
		    	//console.log( "HttpServerBase.prototype.init 1 = " + self.site );
		    	
		    	//	Assume value.appType === "SysApp"
		    	var	filename = '../../Tests/SysApps/Rest/' + value.name + '.js';
		    	if ( self.anyUtils.strStartsWith ( self.site, "Live/" ) === true )	    	
			    	filename = '../../Live/SysApps/Rest/' + value.name + '.js';
		    	
		    	if ( value.appType === "SiteApp" )
		    		filename = '../../' + self.site + '/EXEC-INF/SiteApps/Rest/' + value.name + '.js';
		    	
		    	//console.log( "HttpServerBase.prototype.init ServerUtils.httpStatus = " + ServerUtils.httpStatus );
		    	//console.log( "HttpServerBase.prototype.init value.appType = " + value.appType );
		    	//console.log( "HttpServerBase.prototype.init filename = " + filename );
		    	
		        var MyApi               	= require       ( filename );
		        var myApi               	= new MyApi     ();
		        var name                	= myApi.execute ( { "system":self.system, "job": "any", "httpStatus":ServerUtils.httpStatus, "session":null, "methodType":ServerUtils.methodType, "method":ServerUtils.methodType.NAME, "returnIn": "name", "defaultValue": "none" } ).name;
		                                      myApi.execute ( { "system":self.system, "job": "any", "methodType":ServerUtils.methodType, "method":ServerUtils.methodType.INIT, "returnIn": "name", "defaultValue": "none" } ).name;
		        self.restHandlers[ name ]	= myApi;
		    	
		    	//console.log( "HttpServerBase.prototype.init 3 = " + ServerUtils.httpStatus );

		    	/ *
		    	//	./Apps/Rest/
		    	//value.folderName = this.anyUtils.terminatePathWith ( value.folderName, "/" );
		    	//var	filename2	= value.folderName + value.name + '.js';
		    	//console.log( "HttpServerBase.prototype.init 2 = " + filename2 );
		    	console.log( "HttpServerBase.prototype.init 2 = " + value.folderName );
		    	
		    	//	http://stackoverflow.com/questions/3133243/how-to-get-path-to-current-script-with-node-js
		    	console.log( "HttpServerBase.prototype.init 3 = " + __filename );
		    	console.log( "HttpServerBase.prototype.init 4 = " + __dirname );
		    	console.log( "HttpServerBase.prototype.init 5 = " + require.main.filename );
		    	console.log( "HttpServerBase.prototype.init 6 = " + require('path').dirname(require.main.filename) );
		    	console.log( "HttpServerBase.prototype.init 7 = " + require('path').dirname( value.folderName ) );
		    	* /
		    }); 
	    }
        */
	}
	
	catch ( err )
	{
        console.log( "HttpServerBase, init, catch = " + err );
	}

    return	true;
}

HttpServerBase.prototype.create = function ( params )	{
	
	console.log( "HttpServerBase.prototype.create not implemented" );
	return	false;
};

HttpServerBase.prototype.listen = function ( params )	{

    var result  = true;

    try
    {
        this.host   = params.host;
        this.port	= params.port;
    
        //console.log( "HttpServerBase, listen, host = " + this.host );
        //console.log( "HttpServerBase, listen, port = " + this.port );

        if ( typeof this.host !== "undefined" )
	        this.server	.listen( this.port, this.host );
        else if ( typeof this.port !== "undefined" )
	        this.server	.listen( this.port );
        else
	        this.server	.listen( 8080 );
    }

    catch ( err )
    {
        result = false;        
        console.log( "HttpServerBase, listen, catch = " + err );
    }
    
	return	true;
}

HttpServerBase.prototype.readMimeTypes = function ()	{
	
	//	Read web site user defined mime types.
	var	mimeTypesFile	= "./" + this.site + "/EXEC-INF/" + "mimeTypes.json";
	var	exists 			= this.fileImp  .execute	( { "system":this.system, "job":"getInfo", "get":"exists", "pathname":mimeTypesFile, "returnIn": "exists", "defaultValue": "false" } ).exists;
	
	//console.log( "fileImpTests, testFileImp, mimeTypesFile = " + mimeTypesFile );
	//console.log( "fileImpTests, testFileImp, exists = " + exists );
	//console.log( "fileImpTests, testFileImp, site = " + this.site );
	
	if ( exists === true )
	{
		var	result	= this.fileImp  .execute	( { "system":this.system, "job":"readTextFile", "pathname":mimeTypesFile, "async":false, "data":"krp", "returnIn": "result", "defaultValue": { "contents":"" }  } ).result;

		if ( result.contents != "" )
		{
			//console.log( "fileImpTests, testFileImp, contents = " + result.contents );
			
			try
			{
				result = JSON.parse ( result.contents );
				//console.log( "fileImpTests, testFileImp, contents = " + result );
				//console.log( "fileImpTests, testFileImp, contents = " + result.mimeTypes );
				//console.log( "fileImpTests, testFileImp, contents = " + result.mimeTypes.length );
				
				for ( var i = 0; i < result.mimeTypes.length; i++ )
				{
			        if ( (result.mimeTypes[ i ].ext in this.mimeTypes.getMimeTypes()) === false )
			        {
			        	this.mimeTypes.addMimeType ( result.mimeTypes[ i ].ext, result.mimeTypes[ i ].contentType );
						//console.log( "fileImpTests, testFileImp, contents = " + result.mimeTypes[ i ].contentType );
			        }
				}
				
				//console.log( " " );
			}
			catch ( err )
			{
				console.log( "fileImpTests, testFileImp, catch = " + err );
			}
		}
	}
}

HttpServerBase.prototype.isSafe = function ( session )   {
	
	var	result = true;

    try
    {
    	//	Use this software at your own risk.
    	//
    	//	Currently this software does very little to protect
    	//	your computer or web site from security threats.
    	//
    	//	It does not check for denial of service attacks,
    	//	it does not check for unwanted ip addresses,
    	//	it does not check for unauthorized access, and
    	//	there are - probably - many more security risks that
    	//	this software does not attempt to solve.
    	//
    	//	Use this software at your own risk.
    	//
    	//	Anyone can get this code and look for security
    	//	holes and exploit them.  
    	//
    	//	For some of these problems you may be able to find
    	//	a proxy server to sit in front of this software to
    	//	help.  I am not qualified to assist you in solving these
    	//	problems nor am I qualified to help you select a proxy server.
    	//
    	//	Links:
    	//	https://www.owasp.org/index.php/Main_Page
    	//	https://www.owasp.org/index.php/Testing_for_Reflected_Cross_site_scripting
    	//
    	//	http://blog.risingstack.com/node-js-security-tips/
    	//		danger: 
    	//			1)  sudo node app.js
    	//			2)  No eval, or friends: setInterval(String, 2), setTimeout(String, 2), new Function(String)
    	//			3)  Uploading files can consume a lot of space.
    	//			4)  var cookies = document.cookie.split('; '); and HttpOnly
    	//
    	//	Use this software at your own risk.
    	
	    //console.log( ' ' );
	    //console.log( 'this.isSafe 1' );
    	
	    var	pathname = this.getRequestPathname	( session );
	    
	    //console.log( 'this.isSafe 2 = ' + pathname );
    	
	    //	Currently only allow local ip addresses.
    	if ( ServerUtils.isIpAddressAllowed( "127.0.0.1" ) === false )
    		result = false;
    	
    	else if ( ServerUtils.isUrlSafe( pathname ) === false )
    		result = false;
    	
    	else if ( ServerUtils.isDosAttach( "127.0.0.1" ) === true )
    		result = false;
    	
    	else if ( ServerUtils.otherSessionCoop( session ) === true )
    		result = false;
    	
    	else if ( ServerUtils.isServerSideScript( pathname ) === true )
    		result = false;
    }

    catch ( err )
    {
	    console.log( 'HttpServerBase.prototype.isSafe, catch err = ' + err );
    }

    //console.log( "this.isSafe, 3" );
    //console.log( ' ' );
	
    return	result;
}

HttpServerBase.prototype.httpRequestHandler = function ( session )   {

    try
    {
	    //console.log( ' ' );
	    //console.log( 'this.httpRequestHandler 1' );
    	
	    if ( this.isOK( session ) === false )
	    	console.log( "this.httpRequestHandler, isOK = false with: " + this.getErrorMessage( session ) );
	
	    //  Check to see that the incoming url is not going to cause
        //  any security problems.
        else 
        {
        	//	This code is not safe.  Even though it may return
        	//	true it is not safe.  Read the comments within isSafe().
        	if ( this.isSafe( session ) === false )
        	{
        		this.writeHead ( session, ServerUtils.httpStatus.BadRequest.code );
        		
        		/*for ( var i = 0; i < 10; i++ )
        		{
    		        console.log( 'this.httpRequestHandler isSafe = ' +
    		        		ServerUtils.httpStatus.BadRequest.code + ( ', ' + i ) );
        		}*/
        	}
            else
            {
		        //	Get the http method: GET, POST, PUT, DELETE, ...
            	var	method	= this.getRequestMethod( session );
		        //console.log( 'this.httpRequestHandler method = ' + method );

            	switch ( method )
            	{
		    		case "PUT":	    this.PUT    ( session );	break;
		    		case "GET":     this.GET    ( session );	break;
		    		case "POST":	this.POST   ( session );	break;
		    		
		    		default:	break;
            	}
            }
        }
    }

    catch ( err )
    {
	    console.log( 'this.httpRequestHandler, catch err = ' + err );
    }

    //console.log( "this.httpRequestHandler, 3" );
    //console.log( ' ' );
}

HttpServerBase.prototype.writeHead = function ( session, code, contentType, message )	{

    //	https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

    //  Force problems to return "html"
    if ( typeof contentType === "undefined"  ||  contentType === null )
	    contentType = this.mimeTypes.getMimeTypes().html;

    //console.log( "this.writeHead, code = " 		+ code );
    //console.log( "this.writeHead, contentType = " 	+ contentType );
    
    //  What is the return code that
    //  is being returned to the browser?
    switch ( code )
    {
	    case ServerUtils.httpStatus.OK.code:                   	message	= null; break;                              	        //	don't send "end" for 200.
	    case ServerUtils.httpStatus.NoContent.code:            	message	= ServerUtils.httpStatus.NoContent.message             	+ ", "	+	ServerUtils.httpStatus.NoContent.code;	            break;
	    case ServerUtils.httpStatus.BadRequest.code:           	message	= ServerUtils.httpStatus.BadRequest.message            	+ ", "	+	ServerUtils.httpStatus.BadRequest.code;	        	break;
	    case ServerUtils.httpStatus.InternalServerError.code:	message	= ServerUtils.httpStatus.InternalServerError.message	+ ", "	+	ServerUtils.httpStatus.InternalServerError.code;	break;
	    case ServerUtils.httpStatus.NotImplemented.code:       	message	= ServerUtils.httpStatus.NotImplemented.message 	    + ", "	+	ServerUtils.httpStatus.NotImplemented.code;	    	break;
		
	    case ServerUtils.httpStatus.FileImpTestOkay.code:		message	= ServerUtils.httpStatus.FileImpTestOkay.message 	    + ", "	+	ServerUtils.httpStatus.FileImpTestOkay.code;		break;
		
	    default: 
	    {
            //  If the message is defined you need to put a comma 
            //  in front of the code.  otherwise return the code without
            //  anything else so that the test routines always get the
            //  same result.
		    if ( typeof message === "undefined"  ||  message === null )
			    message = "";
            else
                message += ", ";
		
		    message += "" + code;
		    break;
	    }
    }

    //  Set up the status code and header.
    this.execute( { "session": session, "job": "statusCode",	"data": { "statusCode" : code } } );
    this.execute( { "session": session, "job": "setHeader",		"data": { "property" : 'Content-Type', "value": contentType } } );

    //  If there's a problem return some 
    //  content that describes the problem.
    if ( message !== null )
    {
        //  The browser will not display some messages like 204
    	this.execute( { "session": session, "job": "end", "data":	{ "message": message } } );
    }
}

HttpServerBase.prototype.PUT 		= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.PUT 	); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }
HttpServerBase.prototype.DELETE 	= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.DELETE  ); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }
HttpServerBase.prototype.HEAD 		= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.HEAD 	); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }
HttpServerBase.prototype.OPTIONS 	= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.OPTIONS ); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }
HttpServerBase.prototype.CONNECT	= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.CONNECT ); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }
HttpServerBase.prototype.TRACE 		= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.TRACE 	); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }
HttpServerBase.prototype.PATCH		= function ( session )	{ console.log( ' ' ); console.log( ServerUtils.methodType.PATCH	); this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); }

HttpServerBase.prototype.POST 		= function ( session )	{ 

    //console.log( ' ' ); 
    //console.log( "this.POST  method = "   + ServerUtils.methodType.POST ); 
    //this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); 

    try
    {
	    //console.log( ' ' ); 

        //  if This is an ajax request then the file name
        //  will be the ajax prefix "api" in 
        //  http://localhost:8888/api?property&value
        //  or "myApi" in http://localhost:8888/myApi?property&value

        var statusCode  = ServerUtils.httpStatus.OK.code;
	    var	pathname 	= this.getRequestPathname	( session );
        var apiAnyCase  = ServerUtils.getFileName   ( pathname, true )
        var apiLower    = apiAnyCase.toLowerCase	();


        //console.log( "this.POST, 1a = " + pathname );
        //console.log( "this.POST, 1b = " + apiAnyCase );
        //console.log( "this.POST, 1c = " + apiLower );
        

        if ( this.noExtensionHandler === null  ||  this.anyUtils.isFunction( this.noExtensionHandler ) === false )
        {
            //console.log( "this.POST, 5, ext = " + ext );
            statusCode  = ServerUtils.httpStatus.BadRequest.code;
        }
        else
        {
            //console.log( "this.POST, 6" );

            //  See nodeLive.js
            statusCode  = this.noExtensionHandler ( { "sendFile":AnyUtils.useThis ( this, "__localSendfile" ), "pathname":pathname, "session":session } );
        }


	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //console.log( 'this.POST 7, statusCode = '    + statusCode    );
		
	    	this.writeHead   ( session, statusCode );
	    }

	    //console.log( 'this.POST 8' );
    }

    catch ( err )
    {
	    console.log( 'this.POST, catch err = ' + err );
    }
}

HttpServerBase.prototype.GET     = function ( session )	{

    try
    {
	    //console.log( ' ' ); 

        //  if This is an ajax request then the file name
        //  will be the ajax prefix "api" in 
        //  http://localhost:8888/api?property&value
        //  or "myApi" in http://localhost:8888/myApi?property&value

        var statusCode  = ServerUtils.httpStatus.OK .code;
	    var	pathname 	= this.getRequestPathname	( session );
        var apiAnyCase  = ServerUtils.getFileName	( pathname, true )
        var apiLower    = apiAnyCase.toLowerCase	();


        //console.log( "this.GET, 1a = " + pathname );
        //console.log( "this.GET, 1b = " + apiAnyCase );
        //console.log( "this.GET, 1c = " + apiLower );
        

        //  This is not a rest api it must be
        //  a request for a html page, image, etc.

	    if ( pathname === "/" )
        {
	        //	Change 	http://www.mysite.com/ 
	        //	to 		http://www.mysite.com/index.html:  

		    pathname = "/" + this.defaultFilename;
        }
	
	    //  Make the "site" variable happy.
        if ( pathname.indexOf( "/" ) !== 0 )
		    pathname = "/" + pathname;
	
        //console.log( "this.GET, 4, this.site = " + this.site );
        //console.log( "this.GET, 4, pathname = " + pathname );

	    //  If this implementation doesn't handle
        //  this type of file.
        var ext	= ServerUtils.getFileExt( this.site + pathname );
	    if ( (ext in this.mimeTypes.getMimeTypes()) === false )
        {
            if ( this.noExtensionHandler === null  ||  this.anyUtils.isFunction( this.noExtensionHandler ) === false )
            {
                //console.log( "this.GET, 5, ext = " + ext );
                statusCode  = ServerUtils.httpStatus.BadRequest.code;
            }
            else
            {
                //  See kevinRichardPastorino_s.js
                //statusCode  = this.noExtensionHandler ( { "sendFile":localSendfile, "pathname":pathname, "session":session } );
                statusCode  = this.noExtensionHandler ( { "sendFile":AnyUtils.useThis ( this, "__localSendfile" ), "pathname":pathname, "session":session } );
            }
        }
        else
	    {
            //console.log( "this.GET, 6 = " + ext );

            var params =
            {
                "session"       :   session,
                "message"       :   false,      //  A file not a message
                "pathname"      :   pathname,   //  Name of the file
                "contentType"   :   this.mimeTypes.getMimeType( ext )
            }

            //  Send the requested file.
            statusCode = this.__localSendfile ( params );
	    }
	
	
	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //console.log( 'this.GET 7, statusCode = '    + statusCode    );
	    	this.writeHead   ( session, statusCode );
	    }

	    //console.log( 'this.GET 9' );
    }

    catch ( err )
    {
	    console.log( 'HttpServerBase.GET, catch err = ' + err );
    }

    //console.log( "this.GET, 10" );
    //console.log( ' ' );
}

HttpServerBase.prototype.   __localSendfile    = function ( params )	{

    var statusCode  = ServerUtils.httpStatus.BadRequest.code;

    try
    {
        if ( typeof params.pathname !== "undefined" )
        {
	        //  Make the "site" variable happy.
            if ( params.pathname.indexOf( "/" ) !== 0 )
		        params.pathname = "/" + params.pathname;
	
	        //  site gives us the sub-folder where
            //  the website is located on disk.
            params.pathname = this.site + params.pathname;
        }

        //console.log( "__localSendfile, 1, params.pathname = " + params.pathname );

        //  sendFile() will process the file asynchronously so
        //  the result must be assumed to be true.
        var self        = this;
	    var success     = function()				{ self.writeHead( params.session, ServerUtils.httpStatus.OK.code, params.contentType   );	};
	    var failure     = function( code, message )	{ self.writeHead( params.session, code, self.mimeTypes.getMimeTypes().html, message    );	};
	    self.sendFile	( params.session, params, success, failure );

        //  We don't know if this is ok because
        //  sendFile is asynchronous.  But it should
        //  take care of it's own status.
        statusCode = ServerUtils.httpStatus.OK.code;
    }

    catch ( err )
    {
        console.log( "__localSendfile, catch, err = " + err );
    }

    return statusCode;
}

HttpServerBase.prototype.end = function ( params )	{
	
	console.log( 'HttpServerBase, end, not implemented ' );
};

HttpServerBase.prototype.setHeader = function ( params )	{
	
	console.log( 'HttpServerBase, setHeader, not implemented ' );
};

HttpServerBase.prototype.statusCode = function ( params )	{
	
	console.log( 'HttpServerBase, statusCode, not implemented ' );
};

HttpServerBase.prototype.sendFile = function ( session, params, successCallback, errorCallback )	{
	
	console.log( 'HttpServerBase, sendfile, not implemented ' );
};

HttpServerBase.prototype.getRequestMethod = function ( session )	{

	//	The request object has a method method() which returns a string representing what 
	//	HTTP method was requested. Possible return values for method() are: 
	//	GET, PUT, POST, DELETE, HEAD, OPTIONS, CONNECT, TRACE, PATCH.		
	return	"not implemented";
};

HttpServerBase.prototype.parseUrl = function ( session )	{
	
	return	"not implemented"; //url.parse( session.request.url );
};

HttpServerBase.prototype.getErrorMessage = function ( session )	{
	
	return	session.message;
};

HttpServerBase.prototype.getRequestHref = function ( session )	{
	
	var 	parsedUrl 	= this.parseUrl	( session );
	return	parsedUrl	.href;
};

HttpServerBase.prototype.getRequestPathname = function ( session )	{
	
	var 	parsedUrl 	= this.parseUrl	( session );
	return	parsedUrl	.pathname;
};

HttpServerBase.prototype.getRequestQuery = function ( session )	{
	
	//var 	parsedUrl	= url.parse( session.request.url, true );
	return	"not implemented";//parsedUrl	.query;
};

HttpServerBase.prototype.isOK = function ( params )	{
	
	return params.boolResult;
};

HttpServerBase.prototype.getServer = function	()	{
	
	return	this.server;
};

HttpServerBase.prototype.setServer = function	( server, console )	{
	
	this.server = server;
};

HttpServerBase.prototype.startHandler = function	( server, callback )	{};

HttpServerBase.prototype.endHandler = function	( server, callback )	{};


HttpServerBase.prototype.stopServer = function ( params, callBack )	{};


module.exports = HttpServerBase;


/*
HttpServerBase.prototype.POST_orig 		= function ( session )	{ 

    //console.log( ' ' ); 
    //console.log( "this.POST  method = "   + ServerUtils.methodType.POST ); 
    //this.writeHead ( session, ServerUtils.httpStatus.NotImplemented.code ); 


    try
    {
	    //console.log( ' ' ); 

        //  if This is an ajax request then the file name
        //  will be the ajax prefix "api" in 
        //  http://localhost:8888/api?property&value
        //  or "myApi" in http://localhost:8888/myApi?property&value

        var statusCode  = ServerUtils.httpStatus.OK.code;
	    var	pathname 	= this.getRequestPathname	( session );
        var apiAnyCase  = ServerUtils.getFileName   ( pathname, true )
        var apiLower    = apiAnyCase.toLowerCase	();


        //console.log( "this.POST, 1a = " + pathname );
        //console.log( "this.POST, 1b = " + apiAnyCase );
        //console.log( "this.POST, 1c = " + apiLower );
        

        //  Look for "myApi"  or  "myapi"
	    if ( apiAnyCase in this.restHandlers || apiLower in this.restHandlers )
        {
            if ( apiLower in this.restHandlers )
                apiAnyCase = apiLower;

            //  Call the defined rest api handler.
            //  To see where restHandlers is set up 
            //  look in (below):
            //  module.exports = function ()	{
            //      this.init = function ( params )	{
            //
            //console.log( "this.POST, 2 = " + apiAnyCase );
            statusCode = this.restHandlers[ apiAnyCase ].execute   ( 
            { 
                "system":       this.system, 
                "job":          "any", 
                "session":      session, 
                "methodType":   ServerUtils.methodType, 
                "method":       "POST", 
                "httpStatus":   ServerUtils.httpStatus, 
                "returnIn":     "statusCode", 
                "defaultValue": ServerUtils.httpStatus.InternalServerError.code
            } ).statusCode;
        }

	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //console.log( 'this.POST 7, statusCode = '    + statusCode    );
		
	    	this.writeHead   ( session, statusCode );
	    }

	    //console.log( 'this.POST 9' );
    }

    catch ( err )
    {
	    console.log( 'this.GET, catch err = ' + err );
    }

}
*/


/*
HttpServerBase.prototype.GET_orig     = function ( session )	{

    try
    {
	    //console.log( ' ' ); 

        //  if This is an ajax request then the file name
        //  will be the ajax prefix "api" in 
        //  http://localhost:8888/api?property&value
        //  or "myApi" in http://localhost:8888/myApi?property&value

        var statusCode  = ServerUtils.httpStatus.OK .code;
	    var	pathname 	= this.getRequestPathname	( session );
        var apiAnyCase  = ServerUtils.getFileName	( pathname, true )
        var apiLower    = apiAnyCase.toLowerCase	();


        //console.log( "this.GET, 1a = " + pathname );
        //console.log( "this.GET, 1b = " + apiAnyCase );
        //console.log( "this.GET, 1c = " + apiLower );
        

        //  If some rest api's have been defined.
        //  Look for "myApi"  or  "myapi"
        if ( apiAnyCase in this.restHandlers || apiLower in this.restHandlers )
        {
            if ( apiLower in this.restHandlers )
                apiAnyCase = apiLower;

            //  Call the defined rest api handler.
            //  To see where restHandlers is set up 
            //  look in (below):
            //  module.exports = function ()	{
            //      this.init = function ( params )	{
            //
            //console.log( "this.GET, 2 = " + apiAnyCase );
            statusCode = this.restHandlers[ apiAnyCase ].execute   ( 
            { 
                "system":       this.system, 
                "job":          "any", 
                "session":      session, 
                "methodType":   ServerUtils.methodType, 
                "method":       "GET", 
                "httpStatus":   ServerUtils.httpStatus, 
                "returnIn":     "statusCode", 
                "defaultValue": ServerUtils.httpStatus.InternalServerError.code
            } ).statusCode;

            //console.log( "this.GET, 3 = " + statusCode );
        }

        else
        {
            //  This is not a rest api it must be
            //  a request for a html page, image, etc.

	        if ( pathname === "/" )
            {
	            //	Change 	http://www.mysite.com/ 
	            //	to 		http://www.mysite.com/index.html:  

		        pathname = "/" + this.defaultFilename;
            }
	
	        //  Make the "site" variable happy.
            if ( pathname.indexOf( "/" ) !== 0 )
		        pathname = "/" + pathname;
	
            //console.log( "this.GET, 4, this.site = " + this.site );
            //console.log( "this.GET, 4, pathname = " + pathname );

            //  localSendfile can be called from users of Exec
            //  when they want to allow users to make requests
            //  for pages without extensions like: http://mysite.com/index
            //  instead of http://mysite.com/index.html
            var site            = this.site;
            var	ext	            = "";
            var self		    = this;

            / *
            var localSendfile   = function( params )
            {
                if ( typeof params.pathname !== "undefined" )
                {
	                //  Make the "site" variable happy.
                    if ( params.pathname.indexOf( "/" ) !== 0 )
		                params.pathname = "/" + params.pathname;
	
	                //  site gives us the sub-folder where
                    //  the website is located on disk.
                    params.pathname = site + params.pathname;
                }

                //console.log( "localSendfile, 1, params.pathname = " + params.pathname );

                //  sendFile() will process the file asynchronously so
                //  the result must be assumed to be true.
		        var success     = function()				{ self.writeHead( session, ServerUtils.httpStatus.OK.code, params.contentType   );	};
		        var failure     = function( code, message )	{ self.writeHead( session, code, self.mimeTypes.getMimeTypes().html, message    );	};
		        self.sendFile	( session, params, success, failure );
            };
            * /

	        //  If this implementation doesn't handle
            //  this type of file.
            ext	= ServerUtils.getFileExt( site + pathname );
	        if ( (ext in this.mimeTypes.getMimeTypes()) === false )
            {
                if ( this.noExtensionHandler === null  ||  
                     this.anyUtils.isFunction( this.noExtensionHandler ) === false )
                {
                    //console.log( "this.GET, 5, ext = " + ext );
                    statusCode  = ServerUtils.httpStatus.BadRequest.code;
                }
                else
                {
                    //console.log( "this.GET, 5, pathname = " + pathname );
                    //console.log( "this.GET, 5, localSendfile = " + localSendfile );
                    //console.log( "this.GET, 5, this.noExtensionHandler = " + this.noExtensionHandler );

                    //  See kevinRichardPastorino_s.js
                    //statusCode  = this.noExtensionHandler ( { "sendFile":localSendfile, "pathname":pathname, "session":session } );
                    statusCode  = this.noExtensionHandler ( { "sendFile":AnyUtils.useThis ( this, "__localSendfile" ), "pathname":pathname, "session":session } );
                }
            }
            else
	        {
                //console.log( "this.GET, 6 = " + ext );

                var params =
                {
                    "message"       :   false,      //  A file not a message
                    "pathname"      :   pathname,   //  Name of the file
                    "contentType"   :   self.mimeTypes.getMimeType( ext )
                }

                //  Send the requested file.
                localSendfile ( params );

                //  We don't know if this is ok because
                //  sendFile is asynchronous.  But it should
                //  take care of it's own status.
                statusCode = ServerUtils.httpStatus.OK.code;
	        }
        }
	
	
	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //console.log( 'this.GET 7, statusCode = '    + statusCode    );
	    	this.writeHead   ( session, statusCode );
	    }

	    //console.log( 'this.GET 9' );
    }

    catch ( err )
    {
	    console.log( 'HttpServerBase.GET, catch err = ' + err );
    }

    //console.log( "this.GET, 10" );
    //console.log( ' ' );
}
*/
