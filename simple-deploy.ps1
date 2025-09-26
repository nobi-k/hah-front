# Простой скрипт для развертывания приложения
$server = "193.160.208.161"
$username = "root"
$password = "iEG#39g*cbSG7A"

Write-Host "Создаю архив для загрузки..."

# Создаем архив
$archiveName = "app-build.zip"
if (Test-Path $archiveName) {
    Remove-Item $archiveName
}

Compress-Archive -Path "dist\*" -DestinationPath $archiveName -Force
Write-Host "Архив создан: $archiveName"

Write-Host "Загружаю файлы на сервер..."
Write-Host "Введите пароль когда будет запрошен: $password"

# Загружаем архив
& scp -o StrictHostKeyChecking=no $archiveName "${username}@${server}:/tmp/"

Write-Host "Подключаюсь к серверу для распаковки..."
Write-Host "Выполните следующие команды на сервере:"
Write-Host "cd /var/www/html"
Write-Host "rm -rf *"
Write-Host "cd /tmp"
Write-Host "unzip -o $archiveName -d /var/www/html/"
Write-Host "chmod -R 755 /var/www/html"
Write-Host "ls -la /var/www/html"

# Подключаемся к серверу
& ssh -o StrictHostKeyChecking=no "${username}@${server}"

Write-Host "Развертывание завершено!"
Write-Host "Приложение доступно по адресу: http://$server"
