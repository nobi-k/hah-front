import React, { useState, useEffect, useCallback } from 'react';
import { User, Resume, Vacancy, FilterSettings, ApplicationLog, ChartData } from '../../types';
import { getResumes, getVacancies, getApplicationLogs, getChartData, generateCoverLetter, checkGigaChatStatus } from '../../services/apiService';
import SubscriptionModal from '../features/SubscriptionModal';

interface DashboardPageProps {
  initialUser: User;
  onShowOnboarding: () => void;
  onReady: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  initialUser, 
  onShowOnboarding, 
  onReady 
}) => {
  const [user] = useState<User>(initialUser);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [applicationLogs, setApplicationLogs] = useState<ApplicationLog[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vacancies' | 'applications' | 'settings'>('dashboard');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [coverLetterConfig, setCoverLetterConfig] = useState(user.coverLetterConfig);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [gigaChatStatus, setGigaChatStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [resumesData, logsData, chartData, gigaStatus] = await Promise.all([
          getResumes(),
          getApplicationLogs(),
          getChartData(),
          checkGigaChatStatus()
        ]);
        
        setResumes(resumesData);
        setApplicationLogs(logsData);
        setChartData(chartData);
        setGigaChatStatus(gigaStatus);
        onReady();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Автоматическая синхронизация каждые 5 минут
    const syncInterval = setInterval(async () => {
      try {
        console.log('Автосинхронизация с HeadHunter...');
        // Здесь будет реальная синхронизация с HH API
        // const newData = await syncWithHeadHunter();
        // setResumes(newData.resumes);
        // setVacancies(newData.vacancies);
      } catch (error) {
        console.error('Ошибка автосинхронизации:', error);
      }
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(syncInterval);
  }, [onReady]);

  const handleSearchVacancies = async (filters: FilterSettings) => {
    try {
      setIsLoading(true);
      const vacanciesData = await getVacancies(filters);
      setVacancies(vacanciesData);
    } catch (error) {
      console.error('Error searching vacancies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverLetterModeChange = (mode: 'none' | 'template' | 'ai') => {
    setCoverLetterConfig(prev => ({
      ...prev,
      mode
    }));
  };

  const handleAiSettingsChange = (field: 'tone', value: 'professional' | 'enthusiastic' | 'formal' | 'friendly') => {
    setCoverLetterConfig(prev => ({
      ...prev,
      aiSettings: {
        ...prev.aiSettings,
        [field]: value
      }
    }));
  };

  const handleTemplateChange = (template: string) => {
    setCoverLetterConfig(prev => ({
      ...prev,
      template
    }));
  };

  const handleGenerateLetter = async () => {
    if (coverLetterConfig.mode !== 'ai') return;
    
    setIsGeneratingLetter(true);
    try {
      // Получаем данные резюме (в реальном приложении из API)
      const resumeData = resumes[0]?.title || 'Frontend Developer с опытом работы с React и TypeScript';
      
      // Получаем описание вакансии (в реальном приложении из выбранной вакансии)
      const vacancyData = 'Ищем Frontend Developer для работы с React, TypeScript, современными инструментами разработки';
      
      const letter = await generateCoverLetter(
        resumeData,
        vacancyData,
        coverLetterConfig.aiSettings.tone
      );
      
      setGeneratedLetter(letter);
    } catch (error) {
      console.error('Ошибка при генерации письма:', error);
      setGeneratedLetter('Не удалось сгенерировать письмо. Попробуйте позже.');
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Добро пожаловать в отклик24, {user.name}!
            </h1>
            <p className="text-gray-400 mt-1">
              Автоматизируйте поиск работы на HeadHunter
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={user.avatarUrl} 
              alt={user.name}
              className="h-12 w-12 rounded-full"
            />
            <div className="text-right">
              <div className="text-sm text-gray-400">План</div>
              <div className="text-white font-medium">{user.subscription.planName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Всего откликов</p>
              <p className="text-2xl font-bold text-white">{applicationLogs.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Просмотрено</p>
              <p className="text-2xl font-bold text-white">
                {applicationLogs.filter(log => log.status === 'Viewed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Приглашений</p>
              <p className="text-2xl font-bold text-white">
                {applicationLogs.filter(log => log.status === 'Invitation').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <h3 className="text-lg font-medium text-white mb-4">Последние отклики</h3>
        <div className="space-y-3">
          {applicationLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="text-white font-medium">{log.vacancy.title}</h4>
                  <span className={`status-${log.status.toLowerCase()}`}>
                    {log.status === 'Applied' ? 'Отправлено' : 
                     log.status === 'Viewed' ? 'Просмотрено' : 'Приглашение'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{log.vacancy.company}</p>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(log.appliedAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVacancies = () => (
    <div className="space-y-6">
      {/* Header с красивым дизайном */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600/20 to-purple-600/20 border border-primary-500/30 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Умные фильтры поиска</h2>
              <p className="text-gray-300 text-lg">Настройте параметры для автоматического поиска подходящих вакансий</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{vacancies.length}</div>
                <div className="text-sm text-gray-300">найдено вакансий</div>
              </div>
              <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Параметры поиска</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Автопоиск активен</span>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Основные фильтры */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="h-5 w-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Ключевые слова
                </h4>
                <input
                  type="text"
                  className="beautiful-input"
                  placeholder="React, TypeScript, Frontend"
                />
                <p className="text-xs text-gray-500 mt-2">Разделяйте слова запятыми</p>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Исключить слова
                </h4>
                <input
                  type="text"
                  className="beautiful-input"
                  placeholder="PHP, WordPress, jQuery"
                />
                <p className="text-xs text-gray-500 mt-2">Слова, которые не должны встречаться</p>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="searchInDescription"
                    className="beautiful-checkbox"
                  />
                  <label htmlFor="searchInDescription" className="text-white font-medium">
                    Искать в описании вакансии
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Зарплата от
                </h4>
                <div className="relative">
                  <input
                    type="number"
                    className="beautiful-input"
                    placeholder="100000"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">₽</span>
                </div>
              </div>
              
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="salaryNotImportant"
                    className="beautiful-checkbox"
                  />
                  <label htmlFor="salaryNotImportant" className="text-white font-medium">
                    Зарплата не важна
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительные фильтры */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-8 border border-gray-600">
            <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
              <svg className="h-6 w-6 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Дополнительные фильтры
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Опыт работы
                </label>
                <select className="beautiful-select">
                  <option value="noExperience">Без опыта</option>
                  <option value="between1And3">1-3 года</option>
                  <option value="between3And6">3-6 лет</option>
                  <option value="moreThan6">Более 6 лет</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Тип занятости
                </label>
                <select className="beautiful-select">
                  <option value="full">Полная занятость</option>
                  <option value="part">Частичная занятость</option>
                  <option value="project">Проектная работа</option>
                  <option value="volunteer">Волонтерство</option>
                  <option value="probation">Стажировка</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  График работы
                </label>
                <select className="beautiful-select">
                  <option value="fullDay">Полный день</option>
                  <option value="shift">Сменный график</option>
                  <option value="flexible">Гибкий график</option>
                  <option value="remote">Удаленная работа</option>
                  <option value="flyInFlyOut">Вахтовый метод</option>
                </select>
              </div>
            </div>
          </div>

          {/* Лимит откликов */}
          <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600 max-w-md">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Лимит откликов в день
            </h4>
            <input
              type="number"
              className="beautiful-input"
              placeholder="10"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-2">Максимальное количество откликов в день</p>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Сбросить фильтры</span>
            </button>
            <button 
              onClick={() => handleSearchVacancies({} as FilterSettings)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-primary-500/25"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Найти вакансии</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vacancies List */}
      <div className="space-y-4">
        {vacancies.length === 0 ? (
          <div className="card text-center py-16">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Вакансии не найдены</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">Настройте фильтры поиска и система автоматически найдет подходящие вакансии</p>
            <button className="btn-primary px-6 py-3">
              Настроить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="card hover:bg-gray-750 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
                      <span className="text-white font-bold text-xl">
                        {vacancy.company.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors cursor-pointer mb-2">
                      {vacancy.title}
                    </h4>
                    <p className="text-gray-400 font-medium mb-3">{vacancy.company}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-primary-400 font-semibold text-sm">{vacancy.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-500 text-sm">{vacancy.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Активная
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        Удаленно
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                        React
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="btn-outline text-sm flex items-center space-x-2 flex-1 justify-center">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Подробнее</span>
                      </button>
                      <button className="btn-primary text-sm flex items-center space-x-2 flex-1 justify-center">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Откликнуться</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium text-white mb-4">История откликов</h3>
        <div className="space-y-3">
          {applicationLogs.map((log) => (
            <div key={log.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-medium">{log.vacancy.title}</h4>
                    <span className={`status-${log.status.toLowerCase()}`}>
                      {log.status === 'Applied' ? 'Отправлено' : 
                       log.status === 'Viewed' ? 'Просмотрено' : 'Приглашение'}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-2">{log.vacancy.company}</p>
                  <p className="text-sm text-gray-500">
                    Отправлено: {new Date(log.appliedAt).toLocaleString('ru-RU')}
                  </p>
                  {log.coverLetter && (
                    <details className="mt-2">
                      <summary className="text-sm text-primary-400 cursor-pointer">
                        Показать сопроводительное письмо
                      </summary>
                      <div className="mt-2 p-3 bg-gray-800 rounded text-sm text-gray-300">
                        {log.coverLetter}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Профиль пользователя */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Профиль пользователя</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Автосинхронизация с HeadHunter</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Имя
              </label>
              <input
                type="text"
                value={user.name}
                className="beautiful-input"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Данные из HeadHunter</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID пользователя
              </label>
              <input
                type="text"
                value={user.id}
                className="beautiful-input"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Уникальный идентификатор в HH</p>
            </div>
          </div>

          {/* Аватар */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Аватар
            </label>
            <div className="flex items-center space-x-4">
              <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-gray-400">Фото из HeadHunter</p>
                <button className="text-primary-400 hover:text-primary-300 text-sm">
                  Обновить фото
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Подписка */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Подписка</h3>
          <button 
            onClick={() => setShowSubscriptionModal(true)}
            className="btn-primary text-sm"
          >
            Управлять подпиской
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <h4 className="text-white font-medium">{user.subscription.planName}</h4>
              <p className="text-sm text-gray-400">
                {user.subscription.status === 'active' ? 'Активна' : 
                 user.subscription.status === 'trial' ? 'Пробный период' : 'Неактивна'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Действует до</div>
              <div className="text-white font-medium">
                {user.subscription.expiresAt.toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Способ оплаты
              </label>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-12 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <span className="text-white">•••• {user.paymentMethod.last4}</span>
                <span className="text-gray-400 text-sm">{user.paymentMethod.expires}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус
              </label>
              <div className="flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${
                  user.subscription.status === 'active' ? 'bg-green-500' : 
                  user.subscription.status === 'trial' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-white capitalize">{user.subscription.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Резюме */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Резюме</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">{resumes.length} резюме</span>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Автосинхронизация</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {resumes.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-white font-medium mb-2">Резюме не найдены</h4>
              <p className="text-gray-400 text-sm mb-4">Синхронизируйтесь с HeadHunter для загрузки резюме</p>
              <button className="btn-primary">
                Синхронизировать с HH
              </button>
            </div>
          ) : (
            resumes.map((resume) => (
              <div key={resume.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{resume.title}</h4>
                    <p className="text-sm text-gray-400">
                      Обновлено: {new Date(resume.updatedAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Активно
                  </span>
                  <button className="btn-outline text-sm">
                    Настроить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Настройки сопроводительных писем */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Сопроводительные письма</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-primary-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">AI-генерация</span>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Режим генерации */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Режим генерации писем
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => handleCoverLetterModeChange('none')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  coverLetterConfig.mode === 'none' 
                    ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                }`}
              >
                <div className="text-center">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors ${
                    coverLetterConfig.mode === 'none' 
                      ? 'bg-primary-500' 
                      : 'bg-gray-700'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium mb-1">Без письма</h4>
                  <p className="text-xs text-gray-400">Отправлять только резюме</p>
                </div>
              </div>
              
              <div 
                onClick={() => handleCoverLetterModeChange('template')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  coverLetterConfig.mode === 'template' 
                    ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                }`}
              >
                <div className="text-center">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors ${
                    coverLetterConfig.mode === 'template' 
                      ? 'bg-primary-500' 
                      : 'bg-blue-600'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium mb-1">Шаблон</h4>
                  <p className="text-xs text-gray-400">Использовать готовый шаблон</p>
                </div>
              </div>
              
              <div 
                onClick={() => handleCoverLetterModeChange('ai')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                  coverLetterConfig.mode === 'ai' 
                    ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
                }`}
              >
                <div className="text-center">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors ${
                    coverLetterConfig.mode === 'ai' 
                      ? 'bg-primary-500' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-white font-medium mb-1">AI-генерация</h4>
                  <p className="text-xs text-gray-400">Умная генерация писем</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI настройки */}
          {coverLetterConfig.mode === 'ai' && (
            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-white mb-4">Настройки AI</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Тон письма
                  </label>
                  <select 
                    className="beautiful-select"
                    value={coverLetterConfig.aiSettings.tone}
                    onChange={(e) => handleAiSettingsChange('tone', e.target.value as 'professional' | 'enthusiastic' | 'formal' | 'friendly')}
                  >
                    <option value="professional">Профессиональный</option>
                    <option value="enthusiastic">Энтузиастичный</option>
                    <option value="formal">Формальный</option>
                    <option value="friendly">Дружелюбный</option>
                  </select>
                </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Статус GigaChat
              </label>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${gigaChatStatus === true ? 'bg-green-500' : gigaChatStatus === false ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-400">
                  {gigaChatStatus === true ? 'Доступен' : gigaChatStatus === false ? 'Недоступен' : 'Проверка...'}
                </span>
              </div>
            </div>
              </div>
            </div>
          )}

          {/* Шаблон */}
          {coverLetterConfig.mode === 'template' && (
            <div className="border-t border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-white mb-4">Шаблон письма</h4>
              <textarea
                className="beautiful-textarea"
                placeholder="Введите ваш шаблон сопроводительного письма..."
                value={coverLetterConfig.template}
                onChange={(e) => handleTemplateChange(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Используйте {`{company}`}, {`{position}`} для подстановки названия компании и должности
              </p>
            </div>
          )}

          {/* AI Генерация */}
          {coverLetterConfig.mode === 'ai' && (
            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-white">AI-генерация писем</h4>
                <button
                  onClick={handleGenerateLetter}
                  disabled={isGeneratingLetter || gigaChatStatus === false}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingLetter ? 'Генерация...' : 'Сгенерировать письмо'}
                </button>
              </div>
              
              {generatedLetter && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Сгенерированное письмо
                  </label>
                  <div className="beautiful-textarea min-h-[200px] whitespace-pre-wrap">
                    {generatedLetter}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Настройки уведомлений */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-6">Уведомления</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Email уведомления</h4>
              <p className="text-sm text-gray-400">Получать уведомления о новых откликах</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="beautiful-checkbox"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Push уведомления</h4>
              <p className="text-sm text-gray-400">Уведомления в браузере</p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="beautiful-checkbox"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white">отклик24</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onShowOnboarding}
                className="btn-outline text-sm"
              >
                Помощь
              </button>
              <div className="flex items-center space-x-2">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-white text-sm">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Дашборд', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
              { id: 'vacancies', label: 'Фильтры', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z' },
              { id: 'applications', label: 'Отклики', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { id: 'settings', label: 'Настройки', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'vacancies' && renderVacancies()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentSubscription={user.subscription}
        paymentMethod={user.paymentMethod}
      />
    </div>
  );
};

export default DashboardPage;
