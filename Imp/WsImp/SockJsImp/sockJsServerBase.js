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

var Version		= require( '../../../Libs/Any/execVersion.js' 			).Version;
var ServerUtils	= require( '../../../Libs/Server/execServerUtils.js'	).ServerUtils;
var MimeTypes	= require( '../../../Libs/Server/execMimeTypes.js'		).MimeTypes;
var AnyUtils	= require( '../../../Libs/Any/execAnyUtils.js'			).AnyUtils;

function SockJsServerBase ()
{
	//	https://github.com/winjs/winjs
	//	https://github.com/mozbrick/brick , http://brick.readme.io/
	//	https://www.polymer-project.org/
	//	this.site	= "Sites/ForTesting";
	
	this.console	= null;
	this.sock		= null;
	
    this.anyUtils	= new AnyUtils	();
	this.mimeTypes	= new MimeTypes ();
	this.fileImp	= null
	this.appHandler	= null;
    this.appName	= "not defined";    

	this.methodType	        		= {};
    this.methodType.NAME     		= "NAME"	
    this.methodType.ReadFromClient	= "ReadFromClient";
    this.methodType.WriteToClient	= "WriteToClient";
};

//  Currently this is called by either of
//  nodeConfig.js  or  vertxConfig.js
SockJsServerBase.prototype.execute = function ( params )	{

    //  Create the json result object.
    var jsonResult  = {};

    try
    {
        //  Vertx doesn't provide a built in console.
        //  So, it needs to be passed in from vertxConfig.js
    	if ( this.console === null )
    		this.console = params.console;

        //this.console.log( "sockJsServerBase, execute, 1 = " );
    	
        jsonResult  [ params.returnIn ] = params.defaultValue;

        //  execute() should handle all previous versions.
        //  Since this is version 1 there is only one version to handle.
        if ( Version.versionOK( params.v, 1, 0, 0 ) === false )
        {
            jsonResult  [ params.returnIn ] = params.defaultValue;
            params      .session.message	= params.v + " is not handled by this implementation";
        }
        else
        {
            //this.console.log( "sockJsServerBase, execute, 2 = " );

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
                    //this.console.log ( "sockJsServerBase, execute, default = " + params.job );
                    break;
                }
	        }
        }
    }

    catch ( err )
    {
    	this.console.log( "sockJsServerBase, execute, catch err = " + err );
        jsonResult  [ params.returnIn ] = params.defaultValue;
    }

    //this.console.log( "sockJsServerBase, execute, 4 = " + jsonResult[ params.returnIn ] );
    return jsonResult;
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
		
	    /*
	    if ( typeof params.fileImp !== "undefined" )
	    {
	    	this.fileImp = params.fileImp;
	    	
	    	//	Read in any config data here.
	    	this.readMimeTypes ( params );
	    }
	    */
	
		var	filename = '../../../Tests/SysApps/SockJsApps/' + params.name + ".js";
    	if ( this.anyUtils.strStartsWith ( params.site, "Live/" ) === true )
    		filename = '../../../Live/SysApps/SockJsApps/' + params.name + ".js";
    		
		if ( params.appType === "SiteApp" )
			filename = '../../../' + params.site + '/EXEC-INF/SiteApps/SockJsApps/' + params.name + ".js";
		
		//this.console.log( "SockJsServerBase.prototype.init 1 = " + filename );
	
	    //  Get all of the wsApp api's the caller wants this to handle.
	    var MyApi   	= require       ( filename );
	    var myApi   	= new MyApi     ();
	    this.appName	= myApi.execute ( { "job": "any", "methodType":this.methodType, "method":"NAME", "console":this.console, "returnIn": "name", "defaultValue": "none", "vt":"krp", "v": "1.0.0" } ).name;
	    this.appHandler	= myApi;
	
	    //this.console.log( "sockJsServerBase.init 1 = " + name );
	    
	    result = ServerUtils.httpStatus.OK.code;
	}
	
	catch ( err )
	{
		this.console.log( "SockJsServerBase.prototype.init catch = " + err );
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
	var	mimeTypesFile	= "./" + params.site + "/exec.config/" + "mimeTypes.json";
	var	exists 			= this.fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":mimeTypesFile, "console":this.console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
	
	//this.console.log( "fileImpTests, testFileImp, mimeTypesFile = " + mimeTypesFile );
	//this.console.log( "fileImpTests, testFileImp, exists = " + exists );
	//this.console.log( "fileImpTests, testFileImp, site = " + params.site );
	
	if ( exists === true )
	{
		var	result	= this.fileImp  .execute	( { "job":"readTextFile", "pathname":mimeTypesFile, "async":false, "data":"krp", "returnIn": "result", "defaultValue": { "contents":"" }, "vt":"krp", "v": "1.0.0", "console":this.console  } ).result;

		if ( result.contents != "" )
		{
			//this.console.log( "fileImpTests, testFileImp, contents = " + result.contents );
			
			try
			{
				result = JSON.parse ( result.contents );
				//this.console.log( "fileImpTests, testFileImp, contents = " + result );
				//this.console.log( "fileImpTests, testFileImp, contents = " + result.mimeTypes );
				//this.console.log( "fileImpTests, testFileImp, contents = " + result.mimeTypes.length );
				
				for ( var i = 0; i < result.mimeTypes.length; i++ )
				{
			        if ( (result.mimeTypes[ i ].ext in this.mimeTypes.getMimeTypes()) === false )
			        {
			        	this.mimeTypes.addMimeType ( result.mimeTypes[ i ].ext, result.mimeTypes[ i ].contentType );
						//this.console.log( "fileImpTests, testFileImp, contents = " + result.mimeTypes[ i ].contentType );
			        }
				}
				
				//this.console.log( " " );
			}
			catch ( err )
			{
				this.console.log( "fileImpTests, testFileImp, catch = " + err );
			}
		}
	}
};

SockJsServerBase.prototype.isSafe = function ( session )   {
    	
	var	result = true;

    try
    {
    }

    catch ( err )
    {
    	this.console.log( 'SockJsServerBase.isSafe, catch err = ' + err );
    }
	
    return	result;
};

SockJsServerBase.prototype.requestHandler = function ( session )   {

    try
    {
    	//this.console.log( ' ' );
    	//this.console.log( 'SockJsServerBase.prototype.requestHandler 1' );
    	
        //  Check to see if everything is ok.
		if ( this.isOK( session ) === false )
			this.console.log( "sockJsServerBase, this.requestHandler, isOK = false with: " + this.getErrorMessage( session ) );
	
	    //  Check to see that the incoming url is not going to cause
        //  any security problems.
        else 
        {
        	//	This code is not safe.  Even though it may return
        	//	true it is not safe.  Read the comments within isSafe().
        	if ( this.isSafe( session ) === true )
            {
		        //	Get the http method: GET, POST, PUT, DELETE, ...
		        var	method = this.getRequestMethod   ( session );
		        //this.console.log( 'sockJsServerBase, this.requestHandler method = ' + method );
			
		        //	Call the function that handles the GET, POST, PUT, DELETE, ...
		        //if ( method in this.methods )
		        	//this.methods[ method ]( session );
		        
		        switch ( method )
		        {
	        		//case this.methodType.NAME: break;
	        		case this.methodType.ReadFromClient:	this.ReadFromClient	( session );	break;
	        		case this.methodType.WriteToClient:		this.WriteToClient	( session );	break;
	        		
	        		default:	break;
		        }
		
		        //this.console.log( 'sockJsServerBase, this.requestHandler 2' );
            }
        }
    }

    catch ( err )
    {
    	this.console.log( 'sockJsServerBase, this.requestHandler, catch err = ' + err );
    }

    //this.console.log( "this.requestHandler, 3" );
    //this.console.log( ' ' );
};

SockJsServerBase.prototype.WriteToClient	= function ( session )	{
    	
	//this.console.log( ' ' );
	//this.console.log( "SockJsServerBase.prototype.WriteToClient" );
    
    var statusCode = this.appHandler.execute   ( 
    { 
        "job":          "any", 
        "helpers":      this, 
        "socketJsImp":  this,
        "fileImp":		this.fileImp,
        "session":      session, 
        "methodType":   this.methodType, 
        "method":       "WriteToClient", 
        "data":   		session.data, 
        "console":      this.console, 
        "returnIn":     "statusCode", 
        "successValue": ServerUtils.httpStatus.OK.code, 
        "errorValue": 	ServerUtils.httpStatus.InternalServerError.code, 
        "vt":"krp", 	"v": "1.0.0" 
    } ).statusCode;
	
    if ( statusCode !== ServerUtils.httpStatus.OK.code )
    {
	    //this.console.log( 'sockJsServerBase, this.ReadFromClient 7, statusCode = '    + statusCode    );
    	//this.writeHead   ( session, statusCode );
    }
};

SockJsServerBase.prototype.writeData = function ( session )	{
	
	this.console.log( 'SockJsServerBase.prototype.writeData, not implemented' );
};

SockJsServerBase.prototype.ReadFromClient     = function ( session )	{
	
    try
    {
    	//this.console.log( ' ' ); 
    	//this.console.log( "SockJsServerBase.prototype.ReadFromClient");

        var statusCode = this.appHandler.execute   ( 
        { 
            "job":          "any", 
            "helpers":      this, 
            "socketJsImp":  this,
            "fileImp":		this.fileImp,
            "session":      session, 
            "methodType":   this.methodType, 
            "method":       "ReadFromClient", 
            "data":   		session.data, 
            "console":      this.console, 
            "returnIn":     "statusCode", 
            "successValue": ServerUtils.httpStatus.OK.code, 
            "errorValue": 	ServerUtils.httpStatus.InternalServerError.code, 
            "vt":"krp", 	"v": "1.0.0" 
        } ).statusCode;
	
	    if ( statusCode !== ServerUtils.httpStatus.OK.code )
	    {
		    //this.console.log( 'sockJsServerBase, this.ReadFromClient 7, statusCode = '    + statusCode    );
	    	//this.writeHead   ( session, statusCode );
	    }

	    //this.console.log( 'sockJsServerBase, this.ReadFromClient 9' );
    }

    catch ( err )
    {
    	this.console.log( 'sockJsServerBase, this.ReadFromClient, catch err = ' + err );
    }

    //this.console.log( "sockJsServerBase, this.ReadFromClient, 10" );
    //this.console.log( ' ' );
};

SockJsServerBase.prototype.getRequestMethod = function ( session )	{

	return	session.method;
};

SockJsServerBase.prototype.getErrorMessage = function ( session )	{
		
	return	session.message;
};

SockJsServerBase.prototype.getappName = function ()	{
		
	return	this.appName;
};

SockJsServerBase.prototype.isOK = function ( session )	{
		
	return session.boolResult;
};

module.exports = SockJsServerBase;
