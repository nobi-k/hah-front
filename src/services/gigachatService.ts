import axios from 'axios';

// Функция для генерации UUID в браузере
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// GigaChat API configuration
const GIGACHAT_API_BASE = 'https://gigachat.devices.sberbank.ru/api/v1';
const GIGACHAT_OAUTH_BASE = 'https://ngw.devices.sberbank.ru:9443/api/v2';
const GIGACHAT_MODEL = 'GigaChat-2';

interface GigaChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GigaChatRequest {
  model: string;
  messages: GigaChatMessage[];
  n: number;
  stream: boolean;
  max_tokens: number;
  repetition_penalty: number;
  update_interval: number;
}

interface GigaChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class GigaChatService {
  private accessToken: string | null = null;

  constructor() {
    // В реальном приложении токен должен получаться через OAuth
    // Для демо используем mock токен
    this.accessToken = 'mock_access_token';
  }

  /**
   * Получение токена доступа через OAuth 2.0
   * Согласно документации: https://developers.sber.ru/docs/ru/gigachat/api/reference/rest/gigachat-api
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      // Используем реальные данные GigaChat API
      const clientId = process.env.GIGACHAT_CLIENT_ID || '01998729-eeed-75c4-a31c-d403d300ab9a';
      const clientSecret = process.env.GIGACHAT_CLIENT_SECRET || '4bf43499-46f8-4181-81a5-7e62be1b3d6b';
      
      // Кодируем в base64 для Basic Auth
      const credentials = btoa(`${clientId}:${clientSecret}`);
      
      // Генерируем уникальный RqUID
      const rqUid = generateUUID();
      
      const response = await axios.post(
        `${GIGACHAT_OAUTH_BASE}/oauth`,
        'scope=GIGACHAT_API_PERS',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': rqUid,
            'Authorization': `Basic ${credentials}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Ошибка при получении токена GigaChat:', error);
      // Для демо возвращаем mock токен
      return 'mock_access_token';
    }
  }

  /**
   * Генерация сопроводительного письма на основе резюме и описания вакансии
   */
  async generateCoverLetter(
    resume: string,
    vacancyDescription: string,
    tone: 'professional' | 'enthusiastic' | 'formal' | 'friendly'
  ): Promise<string> {
    try {
      const token = await this.getAccessToken();
      
      const prompt = this.buildPrompt(resume, vacancyDescription, tone);
      
      const request: GigaChatRequest = {
        model: GIGACHAT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'Ты - помощник по составлению сопроводительных писем для поиска работы. Составляй профессиональные, убедительные письма на русском языке.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        n: 1,
        stream: false,
        max_tokens: 1000,
        repetition_penalty: 1.0,
        update_interval: 0
      };

      const response = await axios.post<GigaChatResponse>(
        `${GIGACHAT_API_BASE}/chat/completions`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data.choices[0]?.message?.content || 'Не удалось сгенерировать письмо';
    } catch (error) {
      console.error('Ошибка при генерации письма:', error);
      
      // Для демо возвращаем mock письмо
      return this.generateMockCoverLetter(resume, vacancyDescription, tone);
    }
  }

  /**
   * Построение промпта для генерации письма
   */
  private buildPrompt(resume: string, vacancyDescription: string, tone: string): string {
    const toneInstructions = {
      professional: 'Профессиональный и деловой тон',
      enthusiastic: 'Энтузиастичный и энергичный тон',
      formal: 'Формальный и официальный тон',
      friendly: 'Дружелюбный и открытый тон'
    };

    return `
Составь сопроводительное письмо для отклика на вакансию.

Резюме кандидата:
${resume}

Описание вакансии:
${vacancyDescription}

Требования к письму:
- Тон: ${toneInstructions[tone as keyof typeof toneInstructions]}
- Язык: русский
- Длина: 2-3 абзаца
- Укажи конкретные навыки из резюме, которые подходят для вакансии
- Покажи заинтересованность в позиции
- Заверши призывом к действию

Составь письмо:
    `.trim();
  }

  /**
   * Генерация mock письма для демо (когда API недоступен)
   */
  private generateMockCoverLetter(resume: string, vacancyDescription: string, tone: string): string {
    const toneStyles = {
      professional: 'Профессионально',
      enthusiastic: 'С энтузиазмом',
      formal: 'Формально',
      friendly: 'Дружелюбно'
    };

    return `Здравствуйте!

${toneStyles[tone as keyof typeof toneStyles]} обращаюсь к вам по поводу вакансии. Изучив описание позиции, я убежден, что мой опыт и навыки, указанные в резюме, полностью соответствуют вашим требованиям.

Буду рад возможности обсудить детали сотрудничества на собеседовании.

С уважением,
Иван Петров`;
  }

  /**
   * Проверка доступности API
   * Согласно документации: https://developers.sber.ru/docs/ru/gigachat/api/reference/rest/gigachat-api
   */
  async checkApiStatus(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${GIGACHAT_API_BASE}/models`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('GigaChat API недоступен:', error);
      return false;
    }
  }
}

export const gigachatService = new GigaChatService();
export default gigachatService;
