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

var Version	= require( '../../../Libs/Any/execVersion.js' ).Version;

module.exports = function ()	{

    var luo 			= {};	//	Local Use Only
        luo .message    = "";
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            //  Vertx doesn't provide a built in console.
            //  So, it needs to be passed in from vertxConfig.js 
            console     = params.console;

            //  All execute functions are told by the caller
            //  where to put the return value.  This is the name
            //  of the property in the json object where the caller
            //  will look for the result.  For example if the user
            //  wants the result in a property called "pathname" they
            //  would set up execute() like this:
            //  var	result      = httpImp.execute( { "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR", "vt":"krp", "v": "1.0.0" } );
            //  var pathname    = result.pathname;
            //  if ( pathname === "myERROR" ) {}
            jsonResult  [ params.returnIn ] = params.defaultValue;

            //console.log( "fileImpTests, execute, 1 = " );

            if ( Version.versionOK( params.v, 1, 0, 0 ) === true )
            {
                //console.log( "fileImpTests, execute, 2 = " );
                jsonResult[ params.returnIn ] = luo._execute ( params.helpers, params.httpImp, params.fileImp, params.session, params.methodType, params.method, params.httpStatus, params.console );
            }
            else
            {
                //console.log( "fileImpTests, execute, 3 = " );
                jsonResult  [ params.returnIn ] = params.defaultValue;
                luo .message                	= params.v + " is not handled by this implementation";
            }
        }

        catch ( err )
        {
            //console.log( "fileImpTests, execute, 4 = " + err );
        	//console.log(new Error().stack);
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( helpers, httpImp, fileImp, session, methodType, method, httpStatus, console )  {

        var result = false; //

        method  = method.toString ();
            
        //console.log( "fileImpTests, _execute, 1a = " + httpImp );
        //console.log( "fileImpTests, _execute, 1b = " + session );
        //console.log( "fileImpTests, _execute, 1c = " + methodType );
        //console.log( "fileImpTests, _execute, 1d = " + method );
        //console.log( "fileImpTests, _execute, 1e = " + httpStatus );
        //console.log( "fileImpTests, _execute, 1f = " + console );

        if ( method === methodType.NAME )
        {
            result = "fileImpTests";
            //console.log( "fileImpTests, _execute, 2 = " + result );
        }

        else if ( method === methodType.DELETE )
        {
            //  
        }

        else if ( method === methodType.GET )
        {
        	//console.log( " " );
        	//console.log( " " );
        	//console.log( " " );
        	//console.log( " " );
        	//console.log( " " );
        	//console.log( "fileImpTests, testFileImp " );
        	
        	//	Run the test in the tests/output folder
        	var	folder		= "./Tests/output/ForTestFileImp/";
        	var	test1File	= "test1.txt";
        	var	data		= "test1";
        	var	list 		= "";
        	var	testsOK		= true;

        	//console.log( "fileImpTests, testFileImp, data = " 	+ data );
        	//console.log( "fileImpTests, testFileImp, folder = "	+ folder );

        	//	Make sure that the folder is not there
        	//	from a previous - failed - test.
        	if ( testsOK === true )
        	{
        		var	exists = fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":folder, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
        		//console.log( "fileImpTests, testFileImp, exists = " + exists );
        		
        		if ( exists === true )
        		{
        			fileImp  .execute	( { "job":"deleteFolder", "force":true, "pathname":folder, "console":console, "returnIn": "result", "defaultValue": "true", "vt":"krp", "v": "1.0.0" } ).result;
        			
        			var	exists = fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":folder, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
        			//console.log( "fileImpTests, testFileImp, exists = " + exists );
        			
        			if ( exists === true )
        				testsOK = false;
        		}
        	}

        	//	Create the folder.
        	if ( testsOK === true )
        		testsOK = createFolder	( fileImp, folder );
        	
        	//	Run some tests on the file like
        	//	write, read, and status.
        	if ( testsOK === true )
        		testsOK = testFile	( fileImp, folder, test1File, test1File );
        	
        	//	Create a sub folder.
        	if ( testsOK === true )
        		testsOK = createFolder	( fileImp, folder + "two/" );

        	//	File tests in that sub folder.
        	if ( testsOK === true )
        		testsOK = testFile	( fileImp, folder + "two/", "test22.txt", "test22.txt" );
        	
        	//	Another sub folder.
        	if ( testsOK === true )
        		testsOK = createFolder	( fileImp, folder + "two/" + "three/" );
        	
        	//	File tests in that sub folder.
        	if ( testsOK === true )
        		testsOK = testFile	( fileImp, folder + "two/" + "three/", "test333.txt", "test333.txt" );

        	//	Get a file list and test
        	//	that an expected file is there.
        	if ( testsOK === true )
        	{
        		var	defaultValue = { "result":{ "list": [ { "fileInfo": { "name":"not", "isFile":false } } ] } };
        		list = fileImp.execute	( { "job":"readFileList", "pathname":folder, "console":console, "returnIn": "list", "defaultValue": defaultValue, "vt":"krp", "v": "1.0.0" } ).list;
        		//console.log( "fileImpTests, testFileImp, list = " + list 	);
        		
        		if ( list[ 0 ] !== test1File )
        			testsOK = false;
        	}

        	//	Verify that an expected
        	//	folder is there.
        	if ( testsOK === true )
        	{
        		if ( list[ 1 ] !== "two" )
        			testsOK = false;
        	}
        	
        	//	Test deleting a flie.
        	if ( testsOK === true )
        		testsOK = deleteFile	( fileImp, folder, test1File );

        	//	Test deleting all folders.
        	if ( testsOK === true )
        		testsOK = deleteFolder	( fileImp, folder );

        	/*
        	//	Summarize the results.
        	if ( testsOK === true )
        	{
        		console.log( " " );
        		console.log( " " );
        		console.log( " " );
        		console.log( "fileImpTests, testFileImp, tests okay " );
        		console.log( "fileImpTests, testFileImp, tests okay " );
        		console.log( "fileImpTests, testFileImp, tests okay " );
        		console.log( "fileImpTests, testFileImp, tests okay " );
        	}

        	else
        	{
        		console.log( " " );
        		console.log( " " );
        		console.log( " " );
        		console.log( "fileImpTests, testFileImp, tests failed " );
        		console.log( "fileImpTests, testFileImp, tests failed " );
        		console.log( "fileImpTests, testFileImp, tests failed " );
        		console.log( "fileImpTests, testFileImp, tests failed " );
        	}
        	*/
        	
    		if ( testsOK === true )
    			result  = httpStatus.FileImpTestOkay.code;
    		else
    			result  = httpStatus.BadRequest.code;
        }
            
        else if ( method === methodType.POST )
        {
            //  
        }

        else if ( method === methodType.PUT )
        {
            //  Update
        }

        //console.log( "fileImpTests, _execute, return = " + result );

        return  result
    }
};



function createFolder	( fileImp, folder )	{
	
	var	testsOK		= true;
	
	//console.log( " " );
	//console.log( " " );
	//console.log( " " );
	//console.log( "fileImpTests, createFolder, folder = "	+ folder );
	
	//	The folder should not exist.
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":folder, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === false;
		//console.log( "fileImpTests, createFolder, testsOK = " + testsOK );
	}
	
	//	Create the folder.
	if ( testsOK === true )
	{
		var result	= fileImp  .execute	( { "job":"createFolder", "pathname":folder, "async":false, "returnIn": "result", "defaultValue": { "code":400 }, "vt":"krp", "v": "1.0.0", "console":console  } ).result;
		testsOK		= (result.code === 200);
		//console.log( "fileImpTests, createFolder, testsOK = " + testsOK );
	}

	//	Now the folder should exist
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":folder, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === true;
		//console.log( "fileImpTests, createFolder, testsOK = " + testsOK );
	}

	return testsOK;
}

function testFile	( fileImp, folder, filename, data )	{
	
	var	testsOK		= true;
	var	pathname	= folder + filename;
	
	//console.log( " " );
	//console.log( " " );
	//console.log( " " );
	//console.log( "fileImpTests, testFileImp, pathname = "	+ pathname );
	
	//	The file should not exist.
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":pathname, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === false;
		//console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	}

	//	Test writeTextFile()
	if ( testsOK === true )
	{
		var	result	= fileImp  .execute	( { "job":"writeTextFile", "pathname":pathname, "async":false, "data":data, "returnIn": "result", "defaultValue": { "code":400 }, "vt":"krp", "v": "1.0.0", "console":console  } ).result;
		testsOK		= (result.code === 200);
		//console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	}

	//	Test exists()
	if ( testsOK === true )
	{
		testsOK = fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":pathname, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		//console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	}

	//	Test readTextFile()
	if ( testsOK === true )
	{
		var	result	= fileImp  .execute	( { "job":"readTextFile", "pathname":pathname, "async":false, "data":"krp", "returnIn": "result", "defaultValue": { "contents":"" }, "vt":"krp", "v": "1.0.0", "console":console  } ).result;
		testsOK 	= (result.contents === data);
		//console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	}

	//	Test stats.size
	var	stats = fileImp  .execute	( { "job":"getInfo", "get":"stats", "pathname":pathname, "console":console, "returnIn": "stats", "defaultValue": { "size":-1 }, "vt":"krp", "v": "1.0.0" } ).stats;
	if ( testsOK === true )
	{
		testsOK = (stats.size === data.length);
		//console.log( "fileImpTests, testFileImp, size = " 			+ testsOK 		);
		//console.log( "fileImpTests, testFileImp, stats.size = " 	+ stats.size 	);
		//console.log( "fileImpTests, testFileImp, data.length = " 	+ data.length 	);
	}

	//	Test stats.isFile
	if ( testsOK === true )
	{
		testsOK = (stats.isFile === true);
		//console.log( "fileImpTests, testFileImp, isFile = " 		+ testsOK 		);
	}

	//	Test stats.isDirectory
	if ( testsOK === true )
	{
		testsOK = (stats.isDirectory === false);
		//console.log( "fileImpTests, testFileImp, isDirectory = "	+ testsOK );
	}

	return testsOK;
}

function deleteFolder	( fileImp, folder )	{
	
	var	testsOK		= true;
	
	//console.log( " " );
	//console.log( " " );
	//console.log( " " );
	//console.log( "fileImpTests, deleteFolder, folder = "	+ folder );

	//	Now the folder should exist
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":folder, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === true;
		//console.log( "fileImpTests, deleteFolder, testsOK = " + testsOK );
	}
	
	//	Delete the folder.
	if ( testsOK === true )
	{
		var result	= fileImp  .execute	( { "job":"deleteFolder", "force":true, "pathname":folder, "async":false, "returnIn": "result", "defaultValue": { "code":400 }, "vt":"krp", "v": "1.0.0", "console":console  } ).result;
		testsOK		= (result.code === 200);
		//console.log( "fileImpTests, deleteFolder, testsOK = " + testsOK );
	}

	//	Now the folder should not exist
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":folder, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === false;
		//console.log( "fileImpTests, deleteFolder, testsOK = " + testsOK );
	}

	return testsOK;
}

function deleteFile	( fileImp, folder, filename )	{
	
	var	testsOK	= true;
	
	filename 	= folder + filename;
	
	//console.log( " " );
	//console.log( " " );
	//console.log( " " );
	//console.log( "fileImpTests, deleteFile, folder = " + filename );

	//	Now the file should exist
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":filename, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === true;
		//console.log( "fileImpTests, deleteFile, testsOK = " + testsOK );
	}
	
	//	Delete the file.
	if ( testsOK === true )
	{
		var result	= fileImp  .execute	( { "job":"deleteFile", "force":true, "pathname":filename, "async":false, "returnIn": "result", "defaultValue": { "code":400 }, "vt":"krp", "v": "1.0.0", "console":console  } ).result;
		testsOK		= (result.code === 200);
		//console.log( "fileImpTests, deleteFile, testsOK = " + testsOK );
	}

	//	Now the file should not exist
	if ( testsOK === true )
	{
		var result 	= fileImp  .execute	( { "job":"getInfo", "get":"exists", "pathname":filename, "console":console, "returnIn": "exists", "defaultValue": "false", "vt":"krp", "v": "1.0.0" } ).exists;
		testsOK		= result === false;
		//console.log( "fileImpTests, deleteFile, testsOK = " + testsOK );
	}

	return testsOK;
}

