import React from 'react';
import { getHHAuthUrl } from '../../services/apiService';

interface LoginPageProps {
  onLogin: () => void;
  isLoading: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            отклик24
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Автоматизация поиска работы на HeadHunter
          </p>
        </div>
        
        <div className="card">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Вход в систему
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Авторизуйтесь через HeadHunter для начала работы с автоматическими откликами
              </p>
            </div>
            
            <button
              onClick={() => {
                const authUrl = getHHAuthUrl();
                window.location.href = authUrl;
              }}
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Вход...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Войти через HeadHunter</span>
                </>
              )}
            </button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Нажимая кнопку, вы соглашаетесь с условиями использования сервиса
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div className="flex flex-col items-center space-y-1">
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span>AI-генерация</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.67 2 3 2.67 3 3.5v15C3 19.33 3.67 20 4.5 20h15c.83 0 1.5-.67 1.5-1.5v-15C21 2.67 20.33 2 19.5 2z"/>
                </svg>
              </div>
              <span>Автоматизация</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span>Аналитика</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
