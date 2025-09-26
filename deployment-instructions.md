# Инструкции по развертыванию приложения

## Подготовка
1. Проект уже собран в папке `dist/`
2. Создан архив `app-build.zip` с файлами приложения

## Ручное развертывание на сервер

### Шаг 1: Подключение к серверу
```bash
ssh root@193.160.208.161
# Пароль: iEG#39g*cbSG7A
```

### Шаг 2: Подготовка директории
```bash
cd /var/www/html
rm -rf *
```

### Шаг 3: Загрузка файлов
На локальной машине выполните:
```bash
scp app-build.zip root@193.160.208.161:/tmp/
```

### Шаг 4: Распаковка на сервере
```bash
cd /tmp
unzip -o app-build.zip -d /var/www/html/
chmod -R 755 /var/www/html
ls -la /var/www/html
```

### Шаг 5: Проверка
Приложение будет доступно по адресу: http://193.160.208.161

## Локальное тестирование

Для тестирования приложения локально:
```bash
python test-server.py
```
Или просто откройте файл `dist/index.html` в браузере.

## Структура развернутого приложения

```
/var/www/html/
├── index.html
└── assets/
    ├── index-DFMJT2KG.css
    └── index-DtUfTDtI.js
```

## Настройка веб-сервера

Убедитесь, что на сервере настроен веб-сервер (Apache/Nginx) для обслуживания статических файлов из `/var/www/html/`.

Для Apache:
```bash
sudo systemctl enable apache2
sudo systemctl start apache2
```

Для Nginx:
```bash
sudo systemctl enable nginx
sudo systemctl start nginx
```
