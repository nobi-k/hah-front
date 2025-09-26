import React, { useEffect, useState } from 'react';
import { exchangeCodeForToken, getHHUserProfile, getHHResumes, getHHApplications } from '../../services/apiService';

interface CallbackPageProps {
  onLogin: (user: any) => void;
}

const CallbackPage: React.FC<CallbackPageProps> = ({ onLogin }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Получаем код авторизации из URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`Ошибка авторизации: ${error}`);
        }

        if (!code) {
          throw new Error('Код авторизации не найден');
        }

        // Обмениваем код на токен доступа
        const accessToken = await exchangeCodeForToken(code);
        
        // Получаем данные пользователя
        const [userProfile, resumesData, applicationsData] = await Promise.all([
          getHHUserProfile(accessToken),
          getHHResumes(accessToken),
          getHHApplications(accessToken)
        ]);

        // Формируем объект пользователя
        const user = {
          id: userProfile.id,
          name: userProfile.first_name + ' ' + userProfile.last_name,
          avatarUrl: userProfile.photo?.url || '',
          subscription: {
            plan: 'premium',
            status: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          paymentMethod: {
            type: 'card',
            last4: '1234',
            expires: '12/25'
          },
          coverLetterConfig: {
            mode: 'ai',
            template: '',
            aiSettings: {
              tone: 'professional'
            }
          },
          accessToken,
          resumes: resumesData,
          applications: applicationsData
        };

        setStatus('success');
        onLogin(user);
      } catch (error) {
        console.error('Ошибка при обработке callback:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
        setStatus('error');
      }
    };

    handleCallback();
  }, [onLogin]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Обработка авторизации...</h2>
          <p className="text-gray-400">Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Ошибка авторизации</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-green-400 text-6xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-white mb-2">Авторизация успешна!</h2>
        <p className="text-gray-400">Перенаправление в приложение...</p>
      </div>
    </div>
  );
};

export default CallbackPage;
