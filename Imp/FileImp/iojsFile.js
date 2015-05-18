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

//	https://iojs.org/api/fs.html
//	https://iojs.org/api/fs.html#fs_fs_readfile_filename_options_callback
//	http://technotip.com/3703/create-read-write-file-using-file-server-node-js/

//	onLoadStart, onProgress
//	onLoad, onAbort,
//	onError, onLoadEnd

var	fs 			= require( "fs"		);
var AnyUtils	= require( '../../Libs/Any/execAnyUtils.js'	).AnyUtils;
var FileImpBase	= require( './FileImpBase.js' );

function IojsFile	()
{
	FileImpBase.call	( this );
};

AnyUtils.inherit ( IojsFile, FileImpBase );

IojsFile.prototype.getInfo = function ( params )	{
	
	var	result	= params.defaultValue;
	
	try
	{
        //console.log( "nodeFile, getInfo, 1 = " + params.get );

		if ( params.get === "exists" )
		{
            //console.log( "nodeFile, getInfo, 2 = " + params.pathname );
			result = fs.existsSync( params.pathname );
            //console.log( "nodeFile, getInfo, 3 = " + result );
		}
		else if ( params.get === "stats" )
		{
			var	stat = fs.statSync( params.pathname );
			
			result	= {};
			result	.date			= stat.ctime;	//	change time, atime is access, mtime is modified
			result	.size			= stat.size;
			result	.isFile			= stat.isFile();
			result	.isDirectory	= stat.isDirectory();
		}
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, getInfo, catch err = ' + err );
	}
	
	return result;
}

IojsFile.prototype.readFile = function ( params, options )	{
	
	var	result	= params.defaultValue;
	
	try
	{
        if ( params.async === true )
        {
        	//	If no encoding is specified, then the raw buffer is returned. 
        	fs.readFile( params.pathname, options,  function (err, data) {
        		params.callback	( { "error": err, "data":data } );
        	} );
        }
        
        else
        {
        	result			= {};
        	result.contents	= fs.readFileSync( params.pathname, options );
        }
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, readFile, catch err = ' + err );
	}
	
	return result;
}

IojsFile.prototype.writeFile = function ( params, options )	{
	
	var	result	= {};
	
	try
	{
        if ( params.async === true )
        {
        	//	If no encoding is specified, then the raw buffer is returned. 
        	fs.writeFile( params.pathname, params.data, options, function ( err ) {
        		params.callback	( { "error": err } );
        	} );
            result.code = 200;
        }
        
        else
        {
        	fs.writeFileSync( params.pathname, params.data, options );
            result.code = 200;
        }
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, writeFile, catch err = ' + err );
		result = params.defaultValue;
	}
	
	return result;
}

IojsFile.prototype.readFileList = function ( params )	{
	
	var	result	= params.defaultValue;
	
	try
	{
        if ( typeof params.async === "undefined"  ||  params.async === false )
        {
        	//	params.pathname = process.cwd(),  
        	result = fs.readdirSync( params.pathname );
        }
        
        else
        {
        	/*
        	//	params.pathname = process.cwd(),  
        	fs.readdir( params.pathname, function ( err, files ) {
        		
        		result	= {};
        		result	.list	= new Array	();
        		
        		//	"files" contains and array files and folders.
        		files.forEach( function( file ) {
        			
        			var	stat = fs.statSync( file );
        			if ( stat.isFile()	||  stat.isDirectory() )
        			{
            	    	var fileInfo	= {};
    	    				fileInfo	.name	= file;
    	    				fileInfo	.isFile = stat.isFile();
        	    	
        	    		result.list[ result.list.length ] = fileInfo;
        			}
        	    });
        		
        		params.callback	( { "error": err, "files": result } );
        	} );
        	*/
        }
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, readFileList, catch err = ' + err );
	}
	
	return result;
}

IojsFile.prototype.createFolder = function ( params )	{
	
	var	result	= {};
	
	try
	{
    	fs.mkdirSync( params.pathname );
        result.code = 200;
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, createFolder, catch err = ' + err );
		result	= params.defaultValue;
	}
	
	return result;
}

IojsFile.prototype.deleteFile = function ( params )	{
	
	var	result	= {};
	
	try
	{
    	fs.unlinkSync( params.pathname );
        result.code = 200;
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, deleteFile, catch err = ' + err );
		result	= params.defaultValue;
	}
	
	return result;
}

IojsFile.prototype.deleteFolder = function ( params )	{
	
	var	result	= {};
	
	try
	{
		if ( typeof params.force === "undefined"  ||  params.force === false )
		{
			fs.rmdirSync( params.pathname );
            result.code = 200;
		}
		else
		{
        	//fs.unlinkSync( params.pathname );
			this.deleteFolderRecursive ( this, params.pathname );
            result.code = 200;
		}
	}
	
	catch ( err )
	{
		console.log( 'nodeFile, deleteFolder, catch err = ' + err );
		result	= params.defaultValue;
	}
	
	return result;
}

IojsFile.prototype.deleteFolderRecursive = function( self, path ) {
	
	//	http://www.geedew.com/2012/10/24/remove-a-directory-that-is-not-empty-in-nodejs/
	//	http://stackoverflow.com/questions/12627586/is-node-js-rmdir-recursive-will-it-work-on-non-empty-directories/12761924#12761924
	
    var files = [];
    
    if( fs.existsSync( path ) )
    {
        files = fs.readdirSync( path );
        
        files.forEach( function( file, index )
        {
            var curPath = path + "/" + file;
            
            if( fs.lstatSync( curPath ).isDirectory() ) // recurse
                self.deleteFolderRecursive( self, curPath );
            else // delete file
                fs.unlinkSync( curPath );
        });
        
        fs.rmdirSync( path );
    }
};	

module.exports = IojsFile;
