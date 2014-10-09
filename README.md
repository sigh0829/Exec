Exec
====

Run web sites from either Node or Vertx

<ol>
<li>After cloning open a console and type "node simpleHttpServer.js"</li>
<li>Open a browser to http://127.0.0.1:7777/index.html?name=myName&age=33</li>
<li>You should now see "test" displayed in the browser.</li>
</ol>

<ol>
<li>Edit simpleHttpServer.js and change the line that says <b>var useNode = true;</b> to false.</li>
<li>Open a console and type "vertx run simpleHttpServer.js"</li>
<li>Open a browser to http://127.0.0.1:7778/index.html?name=myName&age=33</li>
<li>You should now see "test" displayed in the browser.</li>
</ol>

=========================
See also <a href="http://kevinpas.github.io/">http://kevinpas.github.io/</a> and <a href="http://www.kevinpas.com">http://www.kevinpas.com</a>


