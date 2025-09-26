import { User, Resume, Vacancy, FilterSettings, ApplicationLog, ChartData } from '../types';
import { gigachatService } from './gigachatService';

// HH API Configuration
const HH_API_BASE = 'https://api.hh.ru';
const HH_CLIENT_ID = process.env.HH_CLIENT_ID || 'HS1C0TBDQV7FNH1H2B9M9TMS7SV3E2BF4EPU7ON29SGOV2BNK9NEK0LOTB02DT80';
const HH_CLIENT_SECRET = process.env.HH_CLIENT_SECRET || 'MGUVQPCBD5UTKNLIE6P0VKC1BFCEPCRLO48QFUFNJV3BCUTKVL8J1HL2GGIN420N';
const HH_REDIRECT_URI = process.env.HH_REDIRECT_URI || 'https://otclick24.ru/account';

// HeadHunter OAuth functions
export const getHHAuthUrl = (): string => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: HH_CLIENT_ID,
    redirect_uri: HH_REDIRECT_URI,
    state: 'random_state_string' // В реальном приложении должно быть случайное значение
  });
  
  return `https://hh.ru/oauth/authorize?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string): Promise<string> => {
  try {
    const response = await fetch('https://hh.ru/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: HH_CLIENT_ID,
        client_secret: HH_CLIENT_SECRET,
        redirect_uri: HH_REDIRECT_URI,
        code: code
      })
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Ошибка при получении токена HH:', error);
    throw new Error('Не удалось получить токен доступа');
  }
};

// HeadHunter API service
export const login = async (): Promise<User> => {
  // В реальном приложении здесь будет OAuth авторизация
  // Для демо используем mock данные, но структура соответствует HH API
  
  // Симуляция получения данных пользователя из HH API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Пример структуры данных, которые приходят из HH API
  const hhUserData = {
    id: '12345678',
    first_name: 'Иван',
    last_name: 'Петров',
    middle_name: 'Сергеевич',
    email: 'ivan.petrov@example.com',
    photo: {
      medium: 'https://hhcdn.ru/photo/12345678/medium.jpg'
    },
    // Дополнительные поля из HH API
    created_at: '2020-01-15T10:30:00+0300',
    updated_at: '2024-09-26T19:30:00+0300',
    is_in_search: true,
    is_anonymous: false
  };
  
  return {
    id: hhUserData.id,
    name: `${hhUserData.first_name} ${hhUserData.last_name}`,
    avatarUrl: hhUserData.photo?.medium || 'https://via.placeholder.com/40',
    subscription: {
      status: 'active',
      planName: 'Premium',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 дней
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
    }
  };
};

// Получение профиля пользователя из HH API
export const getHHUserProfile = async (accessToken: string) => {
  try {
    const response = await fetch(`${HH_API_BASE}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении профиля HH:', error);
    throw error;
  }
};

// Получение резюме пользователя из HH API
export const getHHResumes = async (accessToken: string) => {
  try {
    const response = await fetch(`${HH_API_BASE}/resumes/mine`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items.map((resume: any) => ({
      id: resume.id,
      title: resume.title,
      url: resume.url,
      updatedAt: resume.updated_at
    }));
  } catch (error) {
    console.error('Ошибка при получении резюме HH:', error);
    throw error;
  }
};

export const getResumes = async (): Promise<Resume[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      title: 'Frontend Developer',
      url: 'https://hh.ru/resume/123456',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      url: 'https://hh.ru/resume/789012',
      updatedAt: '2024-01-10T14:20:00Z'
    }
  ];
};

export const getVacancies = async (filters: FilterSettings): Promise<Vacancy[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Симуляция поиска вакансий на основе фильтров
  const mockVacancies: Vacancy[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp',
      salary: '150 000 - 200 000 ₽',
      url: 'https://hh.ru/vacancy/123456',
      location: 'Москва'
    },
    {
      id: '2',
      title: 'Frontend Engineer',
      company: 'StartupInc',
      salary: '120 000 - 180 000 ₽',
      url: 'https://hh.ru/vacancy/789012',
      location: 'Санкт-Петербург'
    },
    {
      id: '3',
      title: 'JavaScript Developer',
      company: 'WebAgency',
      salary: '100 000 - 150 000 ₽',
      url: 'https://hh.ru/vacancy/345678',
      location: 'Москва'
    }
  ];
  
  return mockVacancies;
};


export const getApplicationLogs = async (): Promise<ApplicationLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      vacancy: {
        id: '1',
        title: 'Senior React Developer',
        company: 'TechCorp',
        salary: '150 000 - 200 000 ₽',
        url: 'https://hh.ru/vacancy/123456',
        location: 'Москва'
      },
      resume: {
        id: '1',
        title: 'Frontend Developer',
        url: 'https://hh.ru/resume/123456',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      status: 'Applied',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      coverLetter: 'Здравствуйте! Меня заинтересовала ваша вакансия...',
      coverLetterMode: 'ai'
    },
    {
      id: '2',
      vacancy: {
        id: '2',
        title: 'Frontend Engineer',
        company: 'StartupInc',
        salary: '120 000 - 180 000 ₽',
        url: 'https://hh.ru/vacancy/789012',
        location: 'Санкт-Петербург'
      },
      resume: {
        id: '1',
        title: 'Frontend Developer',
        url: 'https://hh.ru/resume/123456',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      status: 'Viewed',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      coverLetter: 'Добрый день! Я очень заинтересован в работе...',
      coverLetterMode: 'ai'
    }
  ];
};

export const getChartData = async (): Promise<ChartData[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { name: 'Понедельник', applications: 5 },
    { name: 'Вторник', applications: 8 },
    { name: 'Среда', applications: 12 },
    { name: 'Четверг', applications: 7 },
    { name: 'Пятница', applications: 9 },
    { name: 'Суббота', applications: 3 },
    { name: 'Воскресенье', applications: 2 }
  ];
};


// Генерация сопроводительного письма с помощью GigaChat
export const generateCoverLetter = async (
  resume: string,
  vacancyDescription: string,
  tone: 'professional' | 'enthusiastic' | 'formal' | 'friendly'
): Promise<string> => {
  try {
    return await gigachatService.generateCoverLetter(resume, vacancyDescription, tone);
  } catch (error) {
    console.error('Ошибка при генерации письма:', error);
    throw new Error('Не удалось сгенерировать сопроводительное письмо');
  }
};

// Получение вакансий из HH API
export const getHHVacancies = async (accessToken: string, filters: any = {}) => {
  try {
    const params = new URLSearchParams({
      text: filters.text || '',
      area: filters.area || '1', // Москва по умолчанию
      experience: filters.experience || '',
      employment: filters.employment || '',
      schedule: filters.schedule || '',
      salary: filters.salary || '',
      currency: filters.currency || 'RUR',
      order_by: 'publication_time',
      per_page: '20'
    });

    const response = await fetch(`${HH_API_BASE}/vacancies?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items.map((vacancy: any) => ({
      id: vacancy.id,
      title: vacancy.name,
      company: vacancy.employer?.name || 'Не указано',
      salary: vacancy.salary ? 
        `${vacancy.salary.from || ''}${vacancy.salary.to ? '-' + vacancy.salary.to : ''} ${vacancy.salary.currency || 'RUR'}` : 
        'Не указана',
      location: vacancy.area?.name || 'Не указано',
      publishedAt: vacancy.published_at,
      url: vacancy.alternate_url,
      description: vacancy.description,
      requirements: vacancy.requirement,
      responsibilities: vacancy.responsibility
    }));
  } catch (error) {
    console.error('Ошибка при получении вакансий HH:', error);
    throw error;
  }
};

// Получение откликов пользователя из HH API
export const getHHApplications = async (accessToken: string) => {
  try {
    const response = await fetch(`${HH_API_BASE}/negotiations`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.items.map((application: any) => ({
      id: application.id,
      vacancyTitle: application.vacancy?.name || 'Не указано',
      company: application.vacancy?.employer?.name || 'Не указано',
      status: application.state?.name || 'Неизвестно',
      createdAt: application.created_at,
      updatedAt: application.updated_at,
      url: application.vacancy?.alternate_url
    }));
  } catch (error) {
    console.error('Ошибка при получении откликов HH:', error);
    throw error;
  }
};

// Отклик на вакансию через HH API
export const applyToVacancy = async (accessToken: string, vacancyId: string, resumeId: string, coverLetter?: string) => {
  try {
    const response = await fetch(`${HH_API_BASE}/negotiations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vacancy_id: vacancyId,
        resume_id: resumeId,
        message: coverLetter || ''
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при отклике на вакансию:', error);
    throw error;
  }
};

// Получение справочников из HH API
export const getHHDictionaries = async () => {
  try {
    const response = await fetch(`${HH_API_BASE}/dictionaries`, {
      headers: {
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении справочников HH:', error);
    throw error;
  }
};

// Получение регионов из HH API
export const getHHAreas = async () => {
  try {
    const response = await fetch(`${HH_API_BASE}/areas`, {
      headers: {
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении регионов HH:', error);
    throw error;
  }
};

// Получение профессиональных ролей из HH API
export const getHHProfessionalRoles = async () => {
  try {
    const response = await fetch(`${HH_API_BASE}/professional_roles`, {
      headers: {
        'User-Agent': 'otclick24/1.0 (https://otclick24.ru)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении профессиональных ролей HH:', error);
    throw error;
  }
};

// Проверка статуса GigaChat API
export const checkGigaChatStatus = async (): Promise<boolean> => {
  try {
    return await gigachatService.checkApiStatus();
  } catch (error) {
    console.error('Ошибка при проверке API:', error);
    return false;
  }
};
