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


if ( typeof jsGlobal.site_winjs_3 === "undefined" )
	jsGlobal.site_winjs_3 = {};

if ( typeof jsGlobal.site_winjs_3.myapi === "undefined" )
	jsGlobal.site_winjs_3.myapi = {};


//	Class MyApi_c start
//

(function( namespace )
{
	function MyApi_c ()
	{
        try
        {
            //  Windows APIs:   http://msdn.microsoft.com/en-us/library/windows/apps/br211377.aspx
            //  WinJS.xhr:      http://msdn.microsoft.com/en-us/library/windows/apps/br229787.aspx
            //  startLog:       http://msdn.microsoft.com/en-us/library/windows/apps/hh701617.aspx
            //  stopLog:        http://msdn.microsoft.com/en-us/library/windows/apps/hh701626.aspx
            //  winJS.log:      http://msdn.microsoft.com/en-us/library/windows/apps/jj150612.aspx

            
            //  log type can be: error, warn, info, perf
            WinJS.Utilities.startLog( {type: "info", tags: "winjs" } );
            WinJS.log( "MyApi_c, starting", "winjs", "info" );
            //WinJS.Utilities.stopLog();

            
            //  Four of the possible six message types: text, json, blob, arraybuffer


            //  Get some text from the website at "hostname" and "port".
            //  Get it from the rest handler that services "namespace.MyApi_c.restApi"
            this.restRequest    =   location.protocol + "//" + location.hostname + ":" + location.port;
            this.restRequest    +=  "/" + namespace.MyApi_c.restApi + "?name=fred&age=33&returnType=text";
            WinJS.log           ( "MyApi_c, restRequest = " + this.restRequest, "winjs", "info" );
            WinJS.xhr           ({ url: this.restRequest, responseType: "text" } ).done( this.textCompleted, this.textError, this.textProgress );


            //  Get some json.
		    this.restRequest    =   location.protocol + "//" + location.hostname + ":" + location.port;
            this.restRequest    +=  "/" + namespace.MyApi_c.restApi + "?name=fred&age=33&returnType=json";
            WinJS.log           ( "MyApi_c, restRequest = " + this.restRequest, "winjs", "info" );
            WinJS.xhr           ({ url: this.restRequest, responseType: "text" }).done( this.jsonCompleted, this.jsonError, this.jsonProgress );


            //  Get a file.
		    this.restRequest    =   location.protocol + "//" + location.hostname + ":" + location.port;
            this.restRequest    +=  "/" + namespace.MyApi_c.restApi + "?name=fred&age=33&returnType=blob";
            WinJS.log           ( "MyApi_c, restRequest = " + this.restRequest, "winjs", "info" );
            WinJS.xhr           ({ url: this.restRequest, responseType: "blob" }).done( this.blobCompleted, this.blobError, this.blobProgress );


            //  Get some binary data in ArrayBuffer format.
            //  Warning:  this section will not work with vertx 2.0 because
            //  vertx does not provide ArrayBuffer support.  So, you
            //  will see an exception.
		    this.restRequest    =   location.protocol + "//" + location.hostname + ":" + location.port;
            this.restRequest    +=  "/" + namespace.MyApi_c.restApi + "?name=fred&age=33&returnType=arrayBuffer";
            WinJS.log           ( "MyApi_c, restRequest = " + this.restRequest, "winjs", "info" );
            WinJS.xhr           ({ url: this.restRequest, responseType: "arraybuffer" }).done( this.arrayBufferCompleted, this.arrayBufferError, this.arrayBufferProgress );
        }

        catch ( err )
        {
            console.log ( "index.html, catch err = " + err );
        }
	};
	
	MyApi_c.prototype.textCompleted	=function ( result )    {

        WinJS.log( "myApi_c.js, WinJS.xhr, textCompleted, result.status = " + result.status,  "winjs", "info" );

        if ( result.status === 0 )
        {
            WinJS.log( "Failure",  "winjs", "info" );
            WinJS.log( "myApi_c.js, WinJS.xhr, textCompleted, You may need to change the http port ",  "winjs", "info" );
        }
                    
        else if ( result.status === 200 )
        {
            try
            {
                WinJS.log( "myApi_c.js, WinJS.xhr, textCompleted, result.responseText = " + result.responseText,  "winjs", "info" );

                //  Put the text that we got from the server into "<div id='divResult'>"
                var divResult  = document.getElementById( "divResult" );
                    divResult  .innerText               = result.responseText;  //  ie
                    divResult  .textContent             = result.responseText;  //  firefox
                    divResult  .style.backgroundColor   = "lightGreen";

                //WinJS.log( "myApi_c.js, WinJS.xhr, textCompleted, divResult = " + divResult.innerText,  "winjs", "info" );
            }
            catch ( err )
            {
                console.log ( "myApi_c.js, WinJS.xhr, textCompleted, catch err = " + err );
            }
        }
	};
	
	MyApi_c.prototype.textError = function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, textError",  "winjs", "info" );
	};
	
	MyApi_c.prototype.textProgress= function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, textProgress",  "winjs", "info" );
	};
	
	
    MyApi_c.prototype.jsonCompleted	=function ( result )    {

        WinJS.log( "myApi_c.js, WinJS.xhr, jsonCompleted, result.status = " + result.status,  "winjs", "info" );

        if ( result.status === 0 )
        {
            WinJS.log( "Failure",  "winjs", "info" );
            WinJS.log( "myApi_c.js, WinJS.xhr, jsonCompleted, You may need to change the http port ",  "winjs", "info" );
        }
                    
        else if ( result.status === 200 )
        {
            try
            {
                WinJS.log( "myApi_c.js, WinJS.xhr, jsonCompleted, result.responseText = " + result.responseText,  "winjs", "info" );
            }
            catch ( err )
            {
                console.log ( "myApi_c.js, WinJS.xhr, jsonCompleted, catch err = " + err );
            }
        }
	};
	
	MyApi_c.prototype.jsonError = function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, jsonError",  "winjs", "info" );
	};
	
	MyApi_c.prototype.jsonProgress= function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, jsonProgress",  "winjs", "info" );
	};
	
	
	MyApi_c.prototype.blobCompleted	=function ( result )    {

        WinJS.log( "myApi_c.js, WinJS.xhr, blobCompleted, result.status = " + result.status,  "winjs", "info" );

        if ( result.status === 0 )
        {
            WinJS.log( "Failure",  "winjs", "info" );
            WinJS.log( "myApi_c.js, WinJS.xhr, blobCompleted, You may need to change the http port ",  "winjs", "info" );
        }
                    
        else if ( result.status === 200 )
        {
            try
            {
                if( result.response instanceof Blob )
                {
                    WinJS.log( "myApi_c.js, WinJS.xhr, blobCompleted",  "winjs", "info" );

                    //WinJS.log( "myApi_c.js, WinJS.xhr, blobCompleted, Blob = "      + result.response,      "winjs", "info" );
                    //WinJS.log( "myApi_c.js, WinJS.xhr, blobCompleted, Blob.type = " + result.response.type, "winjs", "info" );

                    var divResult   = document.getElementById( "divResult" );
                        divResult   .style.backgroundColor = "lightGreen";

                    //result.response .type = 'image/gif';
                    //WinJS.log( "myApi_c.js, WinJS.xhr, blobCompleted, Blob.type = " + result.response.type, "winjs", "info" );

                    //  http://stackoverflow.com/questions/19672685/setting-binary-data-on-img
                    var img = document.createElement( "IMG" );
                        img .alt = "important alt text";
                        img .src = URL.createObjectURL( result.response );

                    divResult.appendChild( img );
                }
            }
            catch ( err )
            {
                console.log ( "myApi_c.js, WinJS.xhr, blobCompleted, catch err = " + err );
            }
        }
	};
	
	MyApi_c.prototype.blobError = function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, blobError",  "winjs", "info" );
	};
	
	MyApi_c.prototype.blobProgress= function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, blobProgress",  "winjs", "info" );
	};
	
	
	MyApi_c.prototype.arrayBufferCompleted	=function ( result )    {

        WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, result.status = " + result.status,  "winjs", "info" );

        if ( result.status === 0 )
        {
            WinJS.log( "Failure",  "winjs", "info" );
            WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, You may need to change the http port ",  "winjs", "info" );
        }
                    
        else if ( result.status === 200 )
        {
            try
            {
                WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, 1",  "winjs", "info" );

                if( result.response instanceof ArrayBuffer )
                {
                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, 2 = " + result.response,  "winjs", "info" );
                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, 2z = " + result.response.byteLength,  "winjs", "info" );

                    //  Warning:  this section will not work with vertx 2.0 because
                    //  vertx does not provide ArrayBuffer support.  So, you
                    //  will see an exception.

                    //  http://chimera.labs.oreilly.com/books/1230000000545/ch17.html#_receiving_text_and_binary_data
                    var usernameView    = new Uint8Array    ( result.response,  0,  16  );
                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, 2a = " + result.response,  "winjs", "info" );
                    var idView          = new Uint16Array   ( result.response,  16, 1   );
                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, 2b = " + result.response,  "winjs", "info" );
                    var scoresView      = new Float32Array  ( result.response,  20, 32  );
                    //var scoresView      = new Float32Array  ( result.response,  18, 32  );
                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, 2c = " + result.response,  "winjs", "info" );

                    usernameView        = jsGlobal.exec.any.utils.AnyUtils.Utf8ArrayToStr         ( usernameView );

                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, usernameView = "   + usernameView,     "winjs", "info" );
                    WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, idView = "         + idView[ 0 ],      "winjs", "info" );

                    for ( var j = 0; j < 32; j++ )
                        WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, scoresView = " + scoresView[ j ],  "winjs", "info" );
                }
            }
            catch ( err )
            {
                console.log ( "myApi_c.js, WinJS.xhr, vertx 2.0 does not provide ArrayBuffer support" );
                console.log ( "myApi_c.js, WinJS.xhr, arrayBufferCompleted, catch err = " + err );
                console.log ( "myApi_c.js, WinJS.xhr, vertx 2.0 does not provide ArrayBuffer support" );
            }
        }
	};
	
	MyApi_c.prototype.arrayBufferError = function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferError",  "winjs", "info" );
	};
	
	MyApi_c.prototype.arrayBufferProgress= function( result ) {

        WinJS.log( "myApi_c.js, WinJS.xhr, arrayBufferProgress",  "winjs", "info" );
	};


    namespace.MyApi_c	= MyApi_c;
	
	//	Static variables:
	//	{
			//	There may be many classes in this name space so include 
			//	the class name where these statics are located.
			namespace.MyApi_c	.restApi    = "myApi_c";
	//	}

}( jsGlobal.site_winjs_3.myapi ) );	//	Attach to this namespace

if ( typeof module !== "undefined"  &&  module !== null  &&  typeof module === "object" )
{
	//console.log ( "site_winjs_3.underscore module = " + module );
	
	if ( module.exports !== null  &&  typeof module.exports === "object" )
	{
		//console.log ( "site_winjs_3.underscore module.exports = " + module.exports );

		module.exports	= jsGlobal.site_winjs_3.myapi;
		//module.exports.MyApi_c	= site_winjs_3.underscore.MyApi_c;
		//console.log ( "site_winjs_3.underscore module.exports.MyApi_c = " + module.exports.MyApi_c );


		//module.exports.MyApi_c._	= site_winjs_3.underscore.MyApi_c;
		//console.log ( "site_winjs_3.underscore module.exports.MyApi_c = " + module.exports.MyApi_c );
	}
}


//
//	Class MyApi_c end

