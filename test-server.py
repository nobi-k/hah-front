#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser

# Переходим в папку dist
os.chdir('dist')

PORT = 8080

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Добавляем CORS заголовки
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

# Создаем сервер
with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Сервер запущен на http://localhost:{PORT}")
    print("Нажмите Ctrl+C для остановки")
    
    # Открываем браузер
    webbrowser.open(f'http://localhost:{PORT}')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nСервер остановлен")
