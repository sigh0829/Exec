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

//var	fs 		= require( "fs"	);
var vertx 		= require( 'vertx' )
var console		= require( 'vertx/console' );
var Version		= require( '../../Libs/Any/execVersion.js' 			).Version;
var ServerUtils	= require( '../../Libs/Server/execServerUtils.js'	).ServerUtils;
var AnyUtils	= require( '../../Libs/Any/execAnyUtils.js'			).AnyUtils;
var FileImpBase	= require( './FileImpBase.js' );

function VertxFile	()
{
	FileImpBase.call( this );
};

AnyUtils.inherit ( VertxFile, FileImpBase );

VertxFile.prototype.getInfo = function ( params )	{
	
	var	result	= params.defaultValue;
	
	try
	{
        //console.log( "vertxFile, getInfo, 1 = " + params.get );

		if ( params.get === "exists" )
		{
            //console.log( "vertxFile, getInfo, 2 = " + params.pathname );
			
            result	= vertx.fileSystem.existsSync( params.pathname );

            /*vertx.fileSystem.exists('some-file.txt', function(err, res) {
                if (!err) {
                    result = (res ? true : false);
                    console.log('File ' + (res ? 'exists' : 'does not exist'));
                }
            });
            */
			
            //console.log( "vertxFile, getInfo, 3 = " + result );
		}

		else if ( params.get === "stats" )
		{
			result	= {};
			
			var		stat 			= vertx.fileSystem.propsSync	( params.pathname );
			result	.date			= stat.creationTime;	//	change time, atime is access, mtime is modified
			result	.isFile			= stat.isRegularFile;
			result	.isDirectory	= stat.isDirectory;
			result	.size			= stat.size;
		}
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, getInfo, catch err = ' + err );
	}
	
	return result;
}

VertxFile.prototype.readFile = function ( params, options )	{
	
	var	result	= params.defaultValue;
	
	try
	{
        if ( params.async === true )
        {
        	//	If no encoding is specified, then the raw buffer is returned. 
        	//fs.readFile( params.pathname, options,  function (err, data) {
        	//	params.callback	( { "error": err, "data":data } );
        	//} );
        }
        
        else
        {
        	result			= {};
        	result.contents	= vertx.fileSystem.readFileSync( params.pathname, params.data );
        	
        	//	vertx returns a Buffer not a string.
        	if ( options === 'utf8' )
        		result.contents	= "" + result.contents;
        	
			//console.log( 'vertxFile, readFile, result.contents = ' + result.contents );
        }
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, readFile, catch err = ' + err );
	}
	
	return result;
}

VertxFile.prototype.writeFile = function ( params, options )	{
	
	var	result	= {};
	
	try
	{
        if ( params.async === true )
        {
        	//vertx.fileSystem.writeFile( params.pathname, params.data, function ( err ) {
        		//params.callback	( { "error": err } );
        	//}) ;
        	
    		result	= params.defaultValue;
        }
        
        else
        {
        	vertx.fileSystem.writeFileSync( params.pathname, params.data );
            result.code = 200;
        }
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, writeFile, catch err = ' + err );
		result = params.defaultValue;
	}
	
	return result;
}

VertxFile.prototype.readFileList = function ( params )	{
	
	var	result	= params.defaultValue;
	
	try
	{
        if ( typeof params.async === "undefined"  ||  params.async === false )
        {
        	//	params.pathname = process.cwd(),  
        	var res 		= vertx.fileSystem.readDirSync	( params.pathname );
    		var	anyUtils	= new AnyUtils();
        	
        	//	Change vertx style to "exec" style list.
        	result	= new Array	();
        	for ( var i = 0; i < res.length; i++ )
        	{
    			//	Change stuff like C:\ to C:/
        		res[ i ]= anyUtils.replaceAll			( res[ i ], "/" );
                
        		var	name	= ServerUtils.getFileName	( res[ i ], false );
                var ext		= ServerUtils.getFileExt	( res[ i ] );
                
                if ( ext.length > 0 )
                	name = name + "." + ext;
                
        		result[ result.length ] = name;
        	}
        }
        
        else
        {
        }
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, readFileList, catch err = ' + err );
	}
	
	return result;
}

VertxFile.prototype.createFolder = function ( params )	{
	
	var	result	= {};
	
	try
	{
		/*
		vertx.fileSystem.mkDir('a/b/c', true, function(err, res) {
			   if (!err) {
			     console.log('Directory created ok');
			   }
			});
		*/
		
		//vertx.fileSystem.mkDir( params.pathname );
		vertx.fileSystem.mkDirSync( params.pathname );
        result.code = 200;
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, createFolder, catch err = ' + err );
		result	= params.defaultValue;
	}
	
	return result;
}

VertxFile.prototype.deleteFile = function ( params )	{
	
	var	result	= {};
	
	try
	{
		vertx.fileSystem.deleteSync( params.pathname, false ); 
        result.code = 200;
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, deleteFile, catch err = ' + err );
		result	= params.defaultValue;
	}
	
	return result;
}

VertxFile.prototype.deleteFolder = function ( params )	{
	
	var	result	= {};
	
	try
	{
		if ( typeof params.force === "undefined"  ||  params.force === false )
		{
			vertx.fileSystem.deleteSync( params.pathname, false ); 
            result.code = 200;
		}
		else
		{
			//	"true" if recusively delete the folder and children
			vertx.fileSystem.deleteSync( params.pathname, true ); 
			//vertx.fileSystem.delete( params.pathname, recursive, handler ); 

            result.code = 200;
		}
	}
	
	catch ( err )
	{
		console.log( 'vertxFile, deleteFolder, catch err = ' + err );
		result	= params.defaultValue;
	}
	
	return result;
}

module.exports = VertxFile;
