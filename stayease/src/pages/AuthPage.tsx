import React from 'react';
import AuthHeader from '@/components/auth/AuthHeader';
import HeroSection from '@/components/auth/HeroSection';
import AuthForm from '@/components/auth/AuthForm';

const AuthPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      <AuthHeader />
      <main className="flex flex-1 w-full h-full relative">
        <HeroSection />
        <AuthForm />
      </main>
    </div>
  );
};

export default AuthPage;

