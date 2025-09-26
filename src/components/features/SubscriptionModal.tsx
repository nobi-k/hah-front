import React, { useState } from 'react';
import { Subscription, PaymentMethod } from '../../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: Subscription;
  paymentMethod: PaymentMethod;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  paymentMethod
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Базовый',
      price: '990',
      period: 'месяц',
      description: 'Для начинающих поиск работы',
      features: [
        'До 50 откликов в месяц',
        'Базовые фильтры поиска',
        'AI-генерация писем',
        'Email поддержка'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: '1990',
      period: 'месяц',
      description: 'Для активного поиска работы',
      features: [
        'До 200 откликов в месяц',
        'Расширенные фильтры',
        'AI-генерация писем',
        'Приоритетная поддержка',
        'Аналитика и отчеты',
        'Автоматические отклики'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Корпоративный',
      price: '4990',
      period: 'месяц',
      description: 'Для HR-агентств и рекрутеров',
      features: [
        'Безлимитные отклики',
        'Все фильтры и функции',
        'Персональный менеджер',
        'API доступ',
        'Кастомные интеграции',
        'Белый лейбл'
      ],
      popular: false
    }
  ];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // Симуляция обработки платежа
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Управление подпиской
              </h2>
              <p className="text-gray-400 mt-1">
                Выберите подходящий план для ваших потребностей
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Subscription */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Текущая подписка</h3>
                <p className="text-gray-400">
                  {currentSubscription.planName} • 
                  {currentSubscription.status === 'active' ? ' Активна' : 
                   currentSubscription.status === 'trial' ? ' Пробный период' : ' Неактивна'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Действует до {currentSubscription.expiresAt.toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Способ оплаты</div>
                <div className="text-white font-medium">
                  •••• {paymentMethod.last4} • {paymentMethod.expires}
                </div>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                } ${plan.popular ? 'ring-2 ring-primary-500/50' : ''}`}
                onClick={() => setSelectedPlan(plan.id as any)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      Популярный
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">₽/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-500 text-white'
                  }`}
                  onClick={() => setSelectedPlan(plan.id as any)}
                >
                  {selectedPlan === plan.id ? 'Выбрано' : 'Выбрать'}
                </button>
              </div>
            ))}
          </div>

          {/* Payment Info */}
          <div className="bg-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Способ оплаты</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-12 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <span className="text-white">•••• {paymentMethod.last4}</span>
              </div>
              <button className="text-primary-400 hover:text-primary-300 text-sm">
                Изменить
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="btn-outline"
            >
              Отмена
            </button>
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Обработка...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>Обновить подписку</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
