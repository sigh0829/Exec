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


echo Should end up with "OK"
echo K > ./output/test1.out
cat ./output/test2.out ./output/test1.out > ./output/testResult.out
cat ./output/testResult.out
