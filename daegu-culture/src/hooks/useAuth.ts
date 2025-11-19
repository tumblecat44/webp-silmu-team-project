import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

// 임시 인증 훅 (Firebase 연동 전)
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 임시로 로딩 완료 처리
    setIsLoading(false);
  }, []);
  
  const signIn = async (email: string, password: string) => {
    // 임시 구현
    console.log('Sign in:', email, password);
  };
  
  const signUp = async (email: string, password: string, displayName: string) => {
    // 임시 구현
    console.log('Sign up:', email, password, displayName);
  };
  
  const signOut = async () => {
    setUser(null);
  };
  
  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
};