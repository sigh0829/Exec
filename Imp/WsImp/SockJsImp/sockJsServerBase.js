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

//	http://eloquentjavascript.net/ 20_node.html
//	http://vertx.io/core_manual_js.html#request-method
//	http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback

var ServerUtils	= require( '../../../Libs/Server/execServerUtils.js'	).ServerUtils;
var MimeTypes	= require( '../../../Libs/Server/execMimeTypes.js'		).MimeTypes;
var AnyUtils	= require( '../../../Libs/Any/execAnyUtils.js'			).AnyUtils;

function SockJsServerBase ()
{
    this.system     = null;
	this.server		= null;
    this.httpImp    = null;
	
	//	https://github.com/winjs/winjs
	//	https://github.com/mozbrick/brick , http://brick.readme.io/
	//	https://www.polymer-project.org/
	this.site	    = "Sites/TestForm";
	
	this.sock		= null;
	
    this.anyUtils	= new AnyUtils	();
	this.mimeTypes	= new MimeTypes ();
	this.fileImp	= null
	this.appHandler	= null;
    this.appName	= "not defined";    

	this.methodType	        		    = {};
    this.methodType.NAME     		    = "NAME";
    this.methodType.INIT     		    = "INIT";
    this.methodType.ConnectionOpened	= "ConnectionOpened";
    this.methodType.ReadFromClient	    = "ReadFromClient";
    this.methodType.WriteToClient	    = "WriteToClient";
};

//  Currently this is called by either of
//  nodeConfig.js  or  vertxConfig.js
SockJsServerBase.prototype.execute = function ( params )	{

    //  Create the json result object.
    var jsonResult  = {};

    try
    {
        //console.log( "sockJsServerBase, execute, 1 = " );
    	
        jsonResult  [ params.returnIn ] = params.defaultValue;

        if ( this.getSystemInfo( params ) === false )
            jsonResult  [ params.returnIn ] = this.getVersionErrorMessage ( params );
        else
        {
            //console.log( "sockJsServerBase, execute, 2 = " );

	        switch ( params.job )
	        {
        		case "init":		jsonResult[ params.returnIn ] = this.init		( params ); break;
        		case "create":		jsonResult[ params.returnIn ] = this.create		( params ); break;
            	case "install":		jsonResult[ params.returnIn ] = this.install	( params ); break;
        		case "writeData":	jsonResult[ params.returnIn ] = this.writeData	( params ); break;
    			
            	case "installCreateInstall":	
            		jsonResult[ params.returnIn ] = this.installCreateInstall	( params ); 
            		break;
    			
		        default:
                {
                    jsonResult  [ params.returnIn ] = params.defaultValue;
                    //console.log ( "sockJsServerBase, execute, default = " + params.job );
                    break;
                }
	        }
        }
    }

    catch ( err )
    {
    	console.log( "sockJsServerBase, execute, catch err = " + err );
        jsonResult  [ params.returnIn ] = params.defaultValue;
    }

    //console.log( "sockJsServerBase, execute, 4 = " + jsonResult[ params.returnIn ] );
    return jsonResult;
};

SockJsServerBase.prototype.getSystemInfo = function ( params )
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
            this.httpImp    = this.system.execute ({ "get": "httpImp",  "returnIn": "httpImp",  "defaultValue": null }).httpImp;
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

SockJsServerBase.prototype.getVersionErrorMessage = function ( params )	{
	
    if ( typeof params.session === "undefined" )
        params.session = {};

    params.session.message	= params.v + " is not handled by this implementation";
	
	return params.defaultValue;
}
	
SockJsServerBase.prototype.interpretorName = function ()	{

	return  "";
};
    
SockJsServerBase.prototype.installCreateInstall = function ( params )	{
	
	var	result	= ServerUtils.httpStatus.OK.code;
    	
	result	= this.init ( params );
	
	if ( result === ServerUtils.httpStatus.OK.code )
		result	= this.create 	( params );
	
	if ( result === ServerUtils.httpStatus.OK.code )
		result	= this.install	( params );
	
	return	result;
};
	
SockJsServerBase.prototype.init = function ( params )	{
	
	var result	= ServerUtils.httpStatus.InternalServerError.code;
	
	try
	{
	    //  Get all of the wsApp api's the caller wants this to handle.
	    var MyApi   	= params.module;//require       ( filename );
	    var myApi   	= new MyApi     ();
	    this.appName	= myApi.execute ( { "system":this.system, "job": "any", "methodType":this.methodType, "method":this.methodType.NAME, "returnIn": "name", "defaultValue": "none" } ).name;
	                      myApi.execute ( { "system":this.system, "job": "any", "methodType":this.methodType, "method":this.methodType.INIT, "returnIn": "name", "defaultValue": "none" } ).name;
	    this.appHandler	= myApi;
	    
	    result = ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		console.log( "SockJsServerBase.prototype.init catch = " + err );
	}
	
	return	result;
};
	
SockJsServerBase.prototype.create = function ( params )	{

	var result	= ServerUtils.httpStatus.InternalServerError.code;
};
	
SockJsServerBase.prototype.install = function ( params )	{

	var result	= ServerUtils.httpStatus.InternalServerError.code;
};
	
SockJsServerBase.prototype.readMimeTypes = function ( params )	{
		
	//	Read web site user defined mime types.
	var	mimeTypesFile	= "./" + this.site + "/exec.config/" + "mimeTypes.json";
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
};

SockJsServerBase.prototype.requestHandler = function ( sock, method, data )   {

    try
    {
    	//console.log( ' ' );
    	//console.log( 'SockJsServerBase.prototype.requestHandler 1' );
    	
        var	session	            = {};
 		    session.sock		= sock;
    	    session.data		= data;
     	    session.method 		= method;
    	    session.boolResult  = true;

		    switch ( method )
		    {
	        	//case this.methodType.NAME: break;
	        	case this.methodType.ConnectionOpened:	this.ConnectionOpened	( session );	break;
	        	case this.methodType.ReadFromClient:	this.ReadFromClient	    ( session );	break;
	        	case this.methodType.WriteToClient:		this.WriteToClient	    ( session );	break;
	        		
	        	default:	break;
		    }
    }

    catch ( err )
    {
    	console.log( 'sockJsServerBase, this.requestHandler, catch err = ' + err );
    }

    //console.log( "this.requestHandler, 3" );
    //console.log( ' ' );
};

SockJsServerBase.prototype.WriteToClient	= function ( session )	{
    	
	//console.log( ' ' );
	//console.log( "SockJsServerBase.prototype.WriteToClient" );
    
    var statusCode = this.appHandler.execute   ( 
    { 
        "system":       this.system, 
        "job":          "any", 
        "socketJsImp":  this,
        "session":      session, 
        "methodType":   this.methodType, 
        "method":       "WriteToClient", 
        "data":   		session.data, 
        "returnIn":     "statusCode", 
        "successValue": ServerUtils.httpStatus.OK.code, 
        "errorValue": 	ServerUtils.httpStatus.InternalServerError.code
    } ).statusCode;
	
    if ( statusCode !== ServerUtils.httpStatus.OK.code )
    {
	    //console.log( 'sockJsServerBase, this.ReadFromClient 7, statusCode = '    + statusCode    );
    	//this.writeHead   ( session, statusCode );
    }
};

SockJsServerBase.prototype.ConnectionOpened     = function ( session )	{
	
    try
    {
    	//console.log( ' ' ); 
    	//console.log( "SockJsServerBase.prototype.ConnectionOpened");

        var statusCode = this.appHandler.execute   ( 
        { 
            "system":       this.system, 
            "job":          "any", 
            "socketJsImp":  this,
            "session":      session, 
            "methodType":   this.methodType, 
            "method":       "ConnectionOpened", 
            "data":   		session.data, 
            "returnIn":     "statusCode", 
            "successValue": ServerUtils.httpStatus.OK.code, 
            "errorValue": 	ServerUtils.httpStatus.InternalServerError.code
        } ).statusCode;
	
	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //console.log( 'sockJsServerBase, this.ConnectionOpened 7, statusCode = '    + statusCode    );
	    	//this.writeHead   ( session, statusCode );
	    }

	    //console.log( 'sockJsServerBase, this.ConnectionOpened 9' );
    }

    catch ( err )
    {
    	console.log( 'sockJsServerBase, this.ConnectionOpened, catch err = ' + err );
    }

    //console.log( "sockJsServerBase, this.ConnectionOpened, 10" );
    //console.log( ' ' );
};

SockJsServerBase.prototype.writeData = function ( session )	{
	
	console.log( 'SockJsServerBase.prototype.writeData, not implemented' );
};

SockJsServerBase.prototype.ReadFromClient     = function ( session )	{
	
    try
    {
    	//console.log( ' ' ); 
    	//console.log( "SockJsServerBase.prototype.ReadFromClient");

        var statusCode = this.appHandler.execute   ( 
        { 
            "system":       this.system, 
            "job":          "any", 
            "socketJsImp":  this,
            "session":      session, 
            "methodType":   this.methodType, 
            "method":       "ReadFromClient", 
            "data":   		session.data, 
            "returnIn":     "statusCode", 
            "successValue": ServerUtils.httpStatus.OK.code, 
            "errorValue": 	ServerUtils.httpStatus.InternalServerError.code
        } ).statusCode;
	
	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //console.log( 'sockJsServerBase, this.ReadFromClient 7, statusCode = '    + statusCode    );
	    	//this.writeHead   ( session, statusCode );
	    }

	    //console.log( 'sockJsServerBase, this.ReadFromClient 9' );
    }

    catch ( err )
    {
    	console.log( 'sockJsServerBase, this.ReadFromClient, catch err = ' + err );
    }

    //console.log( "sockJsServerBase, this.ReadFromClient, 10" );
    //console.log( ' ' );
};

SockJsServerBase.prototype.getErrorMessage = function ( session )	{
		
	return	session.message;
};

SockJsServerBase.prototype.getappName = function ()	{
		
	return	this.appName;
};

module.exports = SockJsServerBase;
