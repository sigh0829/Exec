echo Use echo instead of ### because it gets confused in Windows console.
echo -n does not work in Windows console.

echo In Windows run curTests.cmd from a console/dos window
echo When finished, if it is successful you should only see "OK"

echo http://ss64.com/bash/
echo https://github.com/bmatzelle/gow/wiki/executables_list
echo http://curl.haxx.se/docs/manpage.html
echo http://curl.haxx.se/docs/httpscripting.html
echo http://blogs.plexibus.com/2009/01/15/rest-testing-with-curl/


rmdir output
mkdir output


echo Should end up with "OK"
echo O > ./output/test1.out


echo Test the 9999 when fileImpTests fails
curl -s http://localhost:%1/fileImpTests > ./output/curl.out
sdiff -s -a ./output/curl.out 9999.err > ./output/sdiff.out
cat ./output/test1.out ./output/sdiff.out > ./output/test2.out
cp -f ./output/test2.out ./output/test1.out
### After each test test1.out should only have a "O" in it.


echo Test the 400 is returned when an api is requested that does not exist.
curl -s http://localhost:%1/nothingThere > ./output/curl.out
sdiff -s -a ./output/curl.out 400.err > ./output/sdiff.out
cat ./output/test1.out ./output/sdiff.out > ./output/test2.out
cp -f ./output/test2.out ./output/test1.out
### After each test test1.out should only have a "O" in it.


echo Should return index.html
curl -s http://localhost:%1/ > ./output/curl.out
sdiff -s -a ./output/curl.out ../site/index.html > ./output/sdiff.out
cat ./output/test1.out ./output/sdiff.out > ./output/test2.out
cp -f ./output/test2.out ./output/test1.out
echo After each test test1.out should only have a "O" in it.


echo Should return index.html
curl -s http://localhost:%1/index.html > ./output/curl.out
sdiff -s -a ./output/curl.out ../site/index.html > ./output/sdiff.out
cat ./output/test1.out ./output/sdiff.out > ./output/test2.out
cp -f ./output/test2.out ./output/test1.out
echo After each test test1.out should only have a "O" in it.


echo Should return "name is fred, age is 333"
curl --trace-ascii ./output/trace.out -s "http://localhost:%1/myApi?name=fred&age=333" > ./output/curl.out
echo name is fred, age is 333 > ./output/testmyApi.out
sdiff -b -s -a ./output/curl.out ./output/testmyApi.out > ./output/sdiff.out
cat ./output/test1.out ./output/sdiff.out > ./output/test2.out
cp -f ./output/test2.out ./output/test1.out
echo After each test test1.out should only have a "O" in it.


echo Should return "id is 24"
curl --trace-ascii ./output/trace.out -s "http://localhost:%1/books/id/24" > ./output/curl.out
echo id is 24 > ./output/testmyApi.out
sdiff -b -s -a ./output/curl.out ./output/testmyApi.out > ./output/sdiff.out
cat ./output/test1.out ./output/sdiff.out > ./output/test2.out
cp -f ./output/test2.out ./output/test1.out
echo After each test test1.out should only have a "O" in it.


echo Should end up with "OK"
echo K > ./output/test1.out
cat ./output/test2.out ./output/test1.out > ./output/testResult.out
cat ./output/testResult.out
