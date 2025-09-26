import React, { useState } from 'react';

interface OnboardingGuideProps {
  onComplete: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Добро пожаловать в отклик24!',
      description: 'Этот сервис поможет вам автоматизировать процесс поиска работы на HeadHunter.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Что умеет сервис?</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Интеллектуальная автоматизация поиска работы с использованием AI и интеграции с HeadHunter. Домен: otclick24.ru
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 hover:border-primary-500 transition-colors">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Умный поиск</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Находит подходящие вакансии по вашим критериям с использованием машинного обучения</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 hover:border-primary-500 transition-colors">
              <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">AI-письма</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Генерирует персонализированные сопроводительные письма с помощью GPT</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 hover:border-primary-500 transition-colors">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-3">Аналитика</h4>
              <p className="text-sm text-gray-400 leading-relaxed">Отслеживает статистику откликов и эффективность поиска</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Настройка резюме',
      description: 'Выберите резюме, которое будет использоваться для автоматических откликов.',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ваши резюме</h3>
            <p className="text-gray-400">Выберите резюме для автоматических откликов</p>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-gray-700 rounded-lg border-2 border-primary-500">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Frontend Developer</h4>
                  <p className="text-sm text-gray-400">Обновлено 15 января 2024</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-400 text-sm font-medium">Активно</span>
                  <div className="h-3 w-3 bg-primary-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Full Stack Developer</h4>
                  <p className="text-sm text-gray-400">Обновлено 10 января 2024</p>
                </div>
                <button className="btn-outline text-sm">
                  Активировать
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Настройка фильтров',
      description: 'Настройте критерии поиска вакансий для автоматических откликов.',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Критерии поиска</h3>
            <p className="text-gray-400">Настройте параметры для поиска подходящих вакансий</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ключевые слова
              </label>
              <input
                type="text"
                className="beautiful-input"
                placeholder="React, TypeScript, Frontend"
                defaultValue="React, TypeScript, Frontend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Исключить слова
              </label>
              <input
                type="text"
                className="beautiful-input"
                placeholder="PHP, WordPress, jQuery"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Зарплата от
              </label>
              <input
                type="number"
                className="beautiful-input"
                placeholder="100000"
                defaultValue="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Опыт работы
              </label>
              <select className="beautiful-select" defaultValue="between1And3">
                <option value="noExperience">Без опыта</option>
                <option value="between1And3">1-3 года</option>
                <option value="between3And6">3-6 лет</option>
                <option value="moreThan6">Более 6 лет</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'AI-настройки',
      description: 'Настройте параметры генерации сопроводительных писем с помощью искусственного интеллекта.',
      content: (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-генерация писем</h3>
            <p className="text-gray-400">Настройте стиль и язык сопроводительных писем</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Тон письма
              </label>
              <select className="beautiful-select" defaultValue="professional">
                <option value="professional">Профессиональный</option>
                <option value="enthusiastic">Энтузиастичный</option>
                <option value="formal">Формальный</option>
                <option value="friendly">Дружелюбный</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI-генерация
              </label>
              <div className="text-sm text-gray-400">
                Письма будут генерироваться на русском языке с помощью GigaChat
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-700 rounded-lg">
            <h4 className="font-medium text-white mb-2">Пример письма:</h4>
            <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded">
              "Здравствуйте!<br/><br/>
              Меня заинтересовала вакансия Frontend Developer в вашей компании. 
              Имея опыт работы с React и TypeScript, я уверен, что смогу внести 
              значительный вклад в развитие вашей команды.<br/><br/>
              Буду рад возможности обсудить детали сотрудничества на собеседовании.<br/><br/>
              С уважением,<br/>
              Иван Петров"
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Готово к работе!',
      description: 'Вы успешно настроили сервис. Теперь можете начинать автоматические отклики.',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Настройка завершена!</h3>
            <p className="text-gray-400 mb-6">
              Теперь вы можете использовать все возможности сервиса для автоматизации поиска работы
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="font-medium text-white mb-2">Следующие шаги:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Перейдите в раздел "Вакансии"</li>
                <li>• Настройте дополнительные фильтры</li>
                <li>• Запустите автоматический поиск</li>
                <li>• Отслеживайте результаты в "Откликах"</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="font-medium text-white mb-2">Советы:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Регулярно обновляйте резюме</li>
                <li>• Настраивайте фильтры под ваши предпочтения</li>
                <li>• Проверяйте качество AI-писем</li>
                <li>• Анализируйте статистику откликов</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-400 text-sm">
                Шаг {currentStep + 1} из {steps.length}
              </p>
            </div>
            <button
              onClick={skipOnboarding}
              className="text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    index <= currentStep ? 'bg-primary-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            {steps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={skipOnboarding}
                className="text-gray-400 hover:text-white text-sm"
              >
                Пропустить
              </button>
              <button
                onClick={nextStep}
                className="btn-primary"
              >
                {currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
