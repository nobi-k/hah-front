# Скрипт для развертывания приложения на сервер
$server = "193.160.208.161"
$username = "root"
$password = "iEG#39g*cbSG7A"
$localPath = "dist\*"
$remotePath = "/var/www/html/"

Write-Host "Начинаю загрузку файлов на сервер $server..."

# Создаем временный файл с паролем
$passwordFile = "temp_password.txt"
$password | Out-File -FilePath $passwordFile -Encoding ASCII

try {
    # Используем sshpass для автоматической аутентификации
    Write-Host "Проверяю доступность сервера..."
    
    # Сначала проверим подключение
    $testConnection = Test-NetConnection -ComputerName $server -Port 22
    if ($testConnection.TcpTestSucceeded) {
        Write-Host "Сервер доступен, начинаю загрузку файлов..."
        
        # Создаем архив для загрузки
        $archiveName = "app-build.zip"
        if (Test-Path $archiveName) {
            Remove-Item $archiveName
        }
        
        # Архивируем файлы
        Compress-Archive -Path $localPath -DestinationPath $archiveName -Force
        Write-Host "Архив создан: $archiveName"
        
        # Загружаем архив на сервер
        Write-Host "Загружаю архив на сервер..."
        $scpCommand = "scp -o StrictHostKeyChecking=no $archiveName ${username}@${server}:/tmp/"
        Write-Host "Выполняю команду: $scpCommand"
        
        # Используем expect для автоматического ввода пароля
        $expectScript = @"
#!/usr/bin/expect
set timeout 30
spawn scp -o StrictHostKeyChecking=no $archiveName $username@$server:/tmp/
expect "password:"
send "$password\r"
expect eof
"@
        
        $expectScript | Out-File -FilePath "upload.exp" -Encoding ASCII
        
        # Если expect доступен, используем его
        if (Get-Command expect -ErrorAction SilentlyContinue) {
            expect upload.exp
        } else {
            Write-Host "Expect не найден, попробуйте ввести пароль вручную:"
            & scp -o StrictHostKeyChecking=no $archiveName "$username@$server`:/tmp/"
        }
        
        # Распаковываем архив на сервере
        Write-Host "Распаковываю файлы на сервере..."
        $unpackScript = @"
#!/usr/bin/expect
set timeout 30
spawn ssh -o StrictHostKeyChecking=no $username@$server
expect "password:"
send "$password\r"
expect "#"
send "cd /var/www/html && rm -rf * && cd /tmp && unzip -o $archiveName -d /var/www/html/ && chmod -R 755 /var/www/html && ls -la /var/www/html\r"
expect "#"
send "exit\r"
expect eof
"@
        
        $unpackScript | Out-File -FilePath "unpack.exp" -Encoding ASCII
        
        if (Get-Command expect -ErrorAction SilentlyContinue) {
            expect unpack.exp
        } else {
            Write-Host "Expect не найден, подключитесь к серверу вручную и выполните:"
            Write-Host "cd /var/www/html; rm -rf *; cd /tmp; unzip -o $archiveName -d /var/www/html/; chmod -R 755 /var/www/html"
        }
        
        Write-Host "Развертывание завершено!"
        Write-Host "Приложение доступно по адресу: http://$server"
        
    } else {
        Write-Host "Ошибка: Не удается подключиться к серверу $server на порту 22"
    }
} catch {
    Write-Host "Ошибка при развертывании: $($_.Exception.Message)"
} finally {
    # Очищаем временные файлы
    if (Test-Path $passwordFile) { Remove-Item $passwordFile }
    if (Test-Path "upload.exp") { Remove-Item "upload.exp" }
    if (Test-Path "unpack.exp") { Remove-Item "unpack.exp" }
    if (Test-Path $archiveName) { Remove-Item $archiveName }
}
