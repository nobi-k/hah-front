@echo off
echo Creating archive for deployment...

if exist app-build.zip del app-build.zip

powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'app-build.zip' -Force"

echo Archive created: app-build.zip
echo.
echo Uploading files to server...
echo When prompted, enter password: iEG#39g*cbSG7A
echo.

scp -o StrictHostKeyChecking=no app-build.zip root@193.160.208.161:/tmp/

echo.
echo Connecting to server for extraction...
echo Please run the following commands on the server:
echo cd /var/www/html
echo rm -rf *
echo cd /tmp
echo unzip -o app-build.zip -d /var/www/html/
echo chmod -R 755 /var/www/html
echo ls -la /var/www/html
echo.

ssh -o StrictHostKeyChecking=no root@193.160.208.161

echo.
echo Deployment completed!
echo Application available at: http://193.160.208.161
