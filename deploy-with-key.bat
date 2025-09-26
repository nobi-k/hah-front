@echo off
echo Deploying application with SSH key...

echo Creating archive...
if exist app-build.zip del app-build.zip
powershell -Command "Compress-Archive -Path 'dist\*' -DestinationPath 'app-build.zip' -Force"

echo Uploading files...
scp app-build.zip root@193.160.208.161:/tmp/

echo Deploying on server...
ssh root@193.160.208.161 "cd /var/www/html && rm -rf * && cd /tmp && unzip -o app-build.zip -d /var/www/html/ && chmod -R 755 /var/www/html && ls -la /var/www/html"

echo.
echo Deployment completed!
echo Application available at: http://193.160.208.161

pause
