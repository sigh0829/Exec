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

//	http://www.w3.org/TR/FileAPI/
//	file:///path/to/spot/,
//	https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

//	http://nodejs.org/api/fs.html
//	http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
//	http://technotip.com/3703/create-read-write-file-using-file-server-node-js/

//	onLoadStart, onProgress
//	onLoad, onAbort,
//	onError, onLoadEnd

//var	fs 		= require( "fs"		);
var Version	= require( '../../Libs/Any/execVersion.js' ).Version;

function FileImpBase	()
{
	//HttpServerBase.call	( this );
};

//AnyUtils.inherit ( NodeHttpServer, HttpServerBase );

FileImpBase.prototype.execute = function ( params )	{

    var result  = {};

    try
    {
        //  Vertx doesn't provide a built in console.
        //  So, it needs to be passed in from vertxConfig.js 
        console	= params.console;
        
        //  All execute functions are told by the caller
        //  where to put the return value.  This is the name
        //  of the property in the json object where the caller
        //  will look for the result.  For example if the user
        //  wants the result in a property called "pathname" they
        //  would set up execute() like this:
        //  var	result      = httpImp.execute( { "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR", "vt":"krp", "v": "1.0.0" } );
        //  var pathname	= result.pathname;
        //  if ( pathname === "myERROR" ) {}
        result  [ params.returnIn ] = params.defaultValue;

        //console.log( "FileImpBase.prototype, execute, 1 = " );

        if ( Version.versionOK( params.v, 1, 0, 0 ) === false )
        {
            result	[ params.returnIn ] = params.defaultValue;
            params	.session.message	= params.v + " is not handled by this implementation";
        }
        else
        {
            //console.log( "FileImpBase.prototype, execute, 2 = " );

	        //  These are the functions that vertxHttpServer provides to switch.js
	        switch ( params.job )
	        {
                case "getInfo":     	result[ params.returnIn ] = this.getInfo    		( params ); 		break;
                case "readFileList":    result[ params.returnIn ] = this.readFileList	( params ); 		break;

                case "readTextFile":	result[ params.returnIn ] = this.readFile   		( params, 'utf8' ); break;
                case "writeTextFile":   result[ params.returnIn ] = this.writeFile   	( params, 'utf8' );	break;
		
                case "readBinaryFile":  result[ params.returnIn ] = this.readFile    	( params, null ); 	break;
                case "writeBinaryFile":	result[ params.returnIn ] = this.writeFile		( params, null ); 	break;

                case "createFolder":    result[ params.returnIn ] = this.createFolder	( params ); 		break;
                case "deleteFile":      result[ params.returnIn ] = this.deleteFile      ( params ); 		break;
                case "deleteFolder":    result[ params.returnIn ] = this.deleteFolder	( params ); 		break;

                default:
                {
                    result	[ params.returnIn ] = params.defaultValue;
                    console .log ( "FileImpBase.prototype, execute, default = " + params.job );
                    break;
                }
	        }
        }
    }

    catch ( err )
    {
        console.log( "FileImpBase.prototype, execute, 3 = " + err );
        result  [ params.returnIn ] = params.defaultValue;
    }

    //console.log( "FileImpBase.prototype, execute, 4 = " + result[ params.returnIn ] );
    return result;
}

FileImpBase.prototype.getInfo = function ( params )	{
	
	console.log( 'FileImpBase.prototype, getInfo, not implemented ' );
	
	return params.defaultValue;
}

FileImpBase.prototype.readFile = function ( params, options )	{
	
	console.log( 'FileImpBase.prototype, readFile, not implemented ' );
	
	return params.defaultValue;
}

FileImpBase.prototype.writeFile = function ( params, options )	{
	
	console.log( 'FileImpBase.prototype, writeFile, not implemented ' );
	
	var	result		= {};
    	result.code = 400;
	
	return result;
}

FileImpBase.prototype.readFileList = function ( params )	{
	
	console.log( 'FileImpBase.prototype, readFileList, not implemented ' );
	
	return params.defaultValue;
}

FileImpBase.prototype.createFolder = function ( params )	{
	
	console.log( 'FileImpBase.prototype, createFolder, not implemented ' );
	
	var	result		= {};
        result.code = 400;
	
	return result;
}

FileImpBase.prototype.deleteFile = function ( params )	{
	
	console.log( 'FileImpBase.prototype, deleteFile, not implemented ' );
	
	var	result		= {};
        result.code = 400;
	
	return result;
}

FileImpBase.prototype.deleteFolder = function ( params )	{
	
	console.log( 'FileImpBase.prototype, deleteFolder, not implemented ' );
	
	var	result		= {};
		result.code = 400;
	
	return result;
}

module.exports = FileImpBase;
