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

//  Usage:
//  This file is only used in curlTests.cmd

//var AnyUtils	= require( '../../../Libs/Any/execAnyUtils.js'	).AnyUtils;


module.exports = function ()	{

    var luo 			    = {};	//	Local Use Only
        luo .message        = "";

        luo .anyUtils       = null;
        luo .console        = null;
        luo .fileImp        = null;
        luo .httpImp        = null;
    	luo .system         = null;

        luo .AnyUtils       = null;
        luo .ServerUtils    = null;
	
	this.execute = function ( params )	{

        var jsonResult  = {};

        try
        {
            if (    luo.system === null                     &&  
                    typeof params.system !== "undefined"    &&  
                    params.system !== null                  &&  
                    typeof params.system.execute === "function"
               )
            {
    	        luo.system     = params.system;

                luo.console    = luo.system.execute ({ "get": "console",        "returnIn": "console",      "defaultValue": null }).console;
                luo.fileImp    = luo.system.execute ({ "get": "fileImp",        "returnIn": "fileImp",      "defaultValue": null }).fileImp;
                luo.httpImp    = luo.system.execute ({ "get": "httpImp",        "returnIn": "httpImp",      "defaultValue": null }).httpImp;
                luo.site       = luo.system.execute ({ "get": "site",           "returnIn": "site",         "defaultValue": ""   }).site;

                luo.AnyUtils    = luo.system.execute ({ "get": "AnyUtils",      "returnIn": "AnyUtils",     "defaultValue": null }).AnyUtils;
                luo.ServerUtils = luo.system.execute ({ "get": "ServerUtils",   "returnIn": "ServerUtils",  "defaultValue": null }).ServerUtils;

                luo .anyUtils   = new luo.AnyUtils	();
            }

            //  All execute functions are told by the caller
            //  where to put the return value.  This is the name
            //  of the property in the json object where the caller
            //  will look for the result.  For example if the user
            //  wants the result in a property called "pathname" they
            //  would set up execute() like this:
            //  var	result      = httpImp.execute( { "system":luo.system, "job": "doSomething"  "returnIn": "pathname", "defaultValue": "myERROR" } );
            //  var pathname    = result.pathname;
            //  if ( pathname === "myERROR" ) {}
            jsonResult  [ params.returnIn ] = params.defaultValue;

            //luo.console.log( "fileImpTests, execute, 1 = " );

            //luo.console.log( "fileImpTests, execute, 2 = " );
            jsonResult[ params.returnIn ] = luo._execute ( params.session, params.method );
        }

        catch ( err )
        {
            //luo.console.log( "fileImpTests, execute, 4 = " + err );
        	//luo.console.log(new Error().stack);
            jsonResult  [ params.returnIn ] = params.defaultValue;
        }

        //luo.console.log( "nodeHttpServer, execute, 4 = " + jsonResult[ params.returnIn ] );
        return jsonResult;
    }

    luo._execute = function ( session, method )  {

        var result = luo.ServerUtils.httpStatus.InternalServerError.code; //

        method  = method.toString ();
            
        //luo.console.log( "fileImpTests, _execute, 1a = " + httpImp );
        //luo.console.log( "fileImpTests, _execute, 1b = " + session );
        //luo.console.log( "fileImpTests, _execute, 1c = " + luo.ServerUtils.methodType );
        //luo.console.log( "fileImpTests, _execute, 1d = " + method );
        //luo.console.log( "fileImpTests, _execute, 1e = " + luo.ServerUtils.httpStatus );
        //luo.console.log( "fileImpTests, _execute, 1f = " + luo.console );

        if ( method === luo.ServerUtils.methodType.NAME )
        {
            result = "fileImpTests";
            //luo.console.log( "fileImpTests, _execute, 2 = " + result );
        }

        else if ( method === luo.ServerUtils.methodType.DELETE )
        {
            //  
        }

        else if ( method === luo.ServerUtils.methodType.GET )
        {
        	//luo.console.log( " " );
        	//luo.console.log( " " );
        	//luo.console.log( " " );
        	//luo.console.log( " " );
        	//luo.console.log( " " );
        	//luo.console.log( "fileImpTests, testFileImp " );
        	
        	//	Run the test in the tests/output folder
        	var	test1File	= "test1.txt";
        	var	data		= "test1";
        	var	list 		= "";
        	var	testsOK		= true;

        	
            var	folder = "./Tests/output/ForTestFileImp/";
            if ( luo.anyUtils.strStartsWith ( luo.site, "Live/" ) === true )	    	
        	    folder  = "./Live/output/ForTestFileImp/";


        	//luo.console.log( "fileImpTests, testFileImp, data = " 	+ data );
        	//luo.console.log( "fileImpTests, testFileImp, folder = "	+ folder );

        	//	Make sure that the folder is not there
        	//	from a previous - failed - test.
        	if ( testsOK === true )
        	{
        		var	exists = luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":folder, "returnIn": "exists", "defaultValue": "false" } ).exists;
        		//luo.console.log( "fileImpTests, testFileImp, exists = " + exists );
        		
        		if ( exists === true )
        		{
        			luo.fileImp  .execute	( { "system":luo.system, "job":"deleteFolder", "force":true, "pathname":folder, "returnIn": "result", "defaultValue": "true" } ).result;
        			
        			var	exists = luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":folder, "returnIn": "exists", "defaultValue": "false" } ).exists;
        			//luo.console.log( "fileImpTests, testFileImp, exists = " + exists );
        			
        			if ( exists === true )
        				testsOK = false;
        		}
        	}

        	//	Create the folder.
        	if ( testsOK === true )
        		testsOK = createFolder	( folder );
        	
        	//	Run some tests on the file like
        	//	write, read, and status.
        	if ( testsOK === true )
        		testsOK = testFile	( folder, test1File, test1File );
        	
        	//	Create a sub folder.
        	if ( testsOK === true )
        		testsOK = createFolder	( folder + "two/" );

        	//	File tests in that sub folder.
        	if ( testsOK === true )
        		testsOK = testFile	( folder + "two/", "test22.txt", "test22.txt" );
        	
        	//	Another sub folder.
        	if ( testsOK === true )
        		testsOK = createFolder	( folder + "two/" + "three/" );
        	
        	//	File tests in that sub folder.
        	if ( testsOK === true )
        		testsOK = testFile	( folder + "two/" + "three/", "test333.txt", "test333.txt" );

        	//	Get a file list and test
        	//	that an expected file is there.
        	if ( testsOK === true )
        	{
        		var	defaultValue = { "result":{ "list": [ { "fileInfo": { "name":"not", "isFile":false } } ] } };
        		list = luo.fileImp.execute	( { "system":luo.system, "job":"readFileList", "pathname":folder, "returnIn": "list", "defaultValue": defaultValue } ).list;
        		//luo.console.log( "fileImpTests, testFileImp, list = " + list 	);
        		
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
        		testsOK = deleteFile	( folder, test1File );

        	//	Test deleting all folders.
        	if ( testsOK === true )
        		testsOK = deleteFolder	( folder );

        	/*
        	//	Summarize the results.
        	if ( testsOK === true )
        	{
        		luo.console.log( " " );
        		luo.console.log( " " );
        		luo.console.log( " " );
        		luo.console.log( "fileImpTests, testFileImp, tests okay " );
        		luo.console.log( "fileImpTests, testFileImp, tests okay " );
        		luo.console.log( "fileImpTests, testFileImp, tests okay " );
        		luo.console.log( "fileImpTests, testFileImp, tests okay " );
        	}

        	else
        	{
        		luo.console.log( " " );
        		luo.console.log( " " );
        		luo.console.log( " " );
        		luo.console.log( "fileImpTests, testFileImp, tests failed " );
        		luo.console.log( "fileImpTests, testFileImp, tests failed " );
        		luo.console.log( "fileImpTests, testFileImp, tests failed " );
        		luo.console.log( "fileImpTests, testFileImp, tests failed " );
        	}
        	*/
        	
    		if ( testsOK === true )
    			result  = luo.ServerUtils.httpStatus.FileImpTestOkay.code;
    		else
    			result  = luo.ServerUtils.httpStatus.BadRequest.code;
        }
            
        else if ( method === luo.ServerUtils.methodType.POST )
        {
            //  
        }

        else if ( method === luo.ServerUtils.methodType.PUT )
        {
            //  Update
        }

        //luo.console.log( "fileImpTests, _execute, return = " + result );

        return  result
    }



    function createFolder	( folder )	{
	
	    var	testsOK		= true;
	
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( "fileImpTests, createFolder, folder = "	+ folder );
	
	    //	The folder should not exist.
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":folder, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === false;
		    //luo.console.log( "fileImpTests, createFolder, testsOK = " + testsOK );
	    }
	
	    //	Create the folder.
	    if ( testsOK === true )
	    {
		    var result	= luo.fileImp  .execute	( { "system":luo.system, "job":"createFolder", "pathname":folder, "async":false, "returnIn": "result", "defaultValue": { "code":400 }  } ).result;
		    testsOK		= (result.code === 200);
		    //luo.console.log( "fileImpTests, createFolder, testsOK = " + testsOK );
	    }

	    //	Now the folder should exist
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":folder, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === true;
		    //luo.console.log( "fileImpTests, createFolder, testsOK = " + testsOK );
	    }

	    return testsOK;
    }

    function testFile	( folder, filename, data )	{
	
	    var	testsOK		= true;
	    var	pathname	= folder + filename;
	
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( "fileImpTests, testFileImp, pathname = "	+ pathname );
	
	    //	The file should not exist.
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":pathname, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === false;
		    //luo.console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	    }

	    //	Test writeTextFile()
	    if ( testsOK === true )
	    {
		    var	result	= luo.fileImp  .execute	( { "system":luo.system, "job":"writeTextFile", "pathname":pathname, "async":false, "data":data, "returnIn": "result", "defaultValue": { "code":400 }  } ).result;
		    testsOK		= (result.code === 200);
		    //luo.console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	    }

	    //	Test exists()
	    if ( testsOK === true )
	    {
		    testsOK = luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":pathname, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    //luo.console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	    }

	    //	Test readTextFile()
	    if ( testsOK === true )
	    {
		    var	result	= luo.fileImp  .execute	( { "system":luo.system, "job":"readTextFile", "pathname":pathname, "async":false, "data":"krp", "returnIn": "result", "defaultValue": { "contents":"" }  } ).result;
		    testsOK 	= (result.contents === data);
		    //luo.console.log( "fileImpTests, testFileImp, testsOK = " + testsOK );
	    }

	    //	Test stats.size
	    var	stats = luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"stats", "pathname":pathname, "returnIn": "stats", "defaultValue": { "size":-1 } } ).stats;
	    if ( testsOK === true )
	    {
		    testsOK = (stats.size === data.length);
		    //luo.console.log( "fileImpTests, testFileImp, size = " 			+ testsOK 		);
		    //luo.console.log( "fileImpTests, testFileImp, stats.size = " 	+ stats.size 	);
		    //luo.console.log( "fileImpTests, testFileImp, data.length = " 	+ data.length 	);
	    }

	    //	Test stats.isFile
	    if ( testsOK === true )
	    {
		    testsOK = (stats.isFile === true);
		    //luo.console.log( "fileImpTests, testFileImp, isFile = " 		+ testsOK 		);
	    }

	    //	Test stats.isDirectory
	    if ( testsOK === true )
	    {
		    testsOK = (stats.isDirectory === false);
		    //luo.console.log( "fileImpTests, testFileImp, isDirectory = "	+ testsOK );
	    }

	    return testsOK;
    }

    function deleteFolder	( folder )	{
	
	    var	testsOK		= true;
	
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( "fileImpTests, deleteFolder, folder = "	+ folder );

	    //	Now the folder should exist
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":folder, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === true;
		    //luo.console.log( "fileImpTests, deleteFolder, testsOK = " + testsOK );
	    }
	
	    //	Delete the folder.
	    if ( testsOK === true )
	    {
		    var result	= luo.fileImp  .execute	( { "system":luo.system, "job":"deleteFolder", "force":true, "pathname":folder, "async":false, "returnIn": "result", "defaultValue": { "code":400 }  } ).result;
		    testsOK		= (result.code === 200);
		    //console.log( "fileImpTests, deleteFolder, testsOK = " + testsOK );
	    }

	    //	Now the folder should not exist
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":folder, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === false;
		    //luo.console.log( "fileImpTests, deleteFolder, testsOK = " + testsOK );
	    }

	    return testsOK;
    }

    function deleteFile	( folder, filename )	{
	
	    var	testsOK	= true;
	
	    filename 	= folder + filename;
	
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( " " );
	    //luo.console.log( "fileImpTests, deleteFile, folder = " + filename );

	    //	Now the file should exist
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":filename, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === true;
		    //luo.console.log( "fileImpTests, deleteFile, testsOK = " + testsOK );
	    }
	
	    //	Delete the file.
	    if ( testsOK === true )
	    {
		    var result	= luo.fileImp  .execute	( { "system":luo.system, "job":"deleteFile", "force":true, "pathname":filename, "async":false, "returnIn": "result", "defaultValue": { "code":400 }  } ).result;
		    testsOK		= (result.code === 200);
		    //luo.console.log( "fileImpTests, deleteFile, testsOK = " + testsOK );
	    }

	    //	Now the file should not exist
	    if ( testsOK === true )
	    {
		    var result 	= luo.fileImp  .execute	( { "system":luo.system, "job":"getInfo", "get":"exists", "pathname":filename, "returnIn": "exists", "defaultValue": "false" } ).exists;
		    testsOK		= result === false;
		    //luo.console.log( "fileImpTests, deleteFile, testsOK = " + testsOK );
	    }

	    return testsOK;
    }

};
