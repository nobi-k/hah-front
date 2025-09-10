import React, { useState, useCallback } from 'react';
import DashboardPage from './components/pages/DashboardPage';
import LoginPage from './components/pages/LoginPage';
import OnboardingGuide from './components/features/OnboardingGuide';
import { User } from './types';
import { login } from './services/apiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isDashboardReady, setIsDashboardReady] = useState(false);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const loggedInUser = await login();
      setUser(loggedInUser);
      // Onboarding should only appear if it has not been completed before.
      if (localStorage.getItem('onboardingCompleted') !== 'true') {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Here you could set an error state and display a message
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };
  
  const handleDashboardReady = useCallback(() => {
    setIsDashboardReady(true);
  }, []);

  if (!user) {
    return <LoginPage onLogin={handleLogin} isLoading={isAuthenticating} />;
  }

  return (
    <>
      <DashboardPage 
        initialUser={user} 
        onShowOnboarding={handleShowOnboarding} 
        onReady={handleDashboardReady} 
      />
      {showOnboarding && isDashboardReady && <OnboardingGuide onComplete={handleOnboardingComplete} />}
    </>
  );
};

export default App;