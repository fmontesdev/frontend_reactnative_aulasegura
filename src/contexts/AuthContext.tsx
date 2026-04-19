import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User } from '../types/User';
import { authService } from '../services/authService';
import { AuthContextType } from '../types/Auth';

// Contexto de autenticación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider del contexto de autenticación
 * Maneja el estado global de autenticación y redirige automáticamente según el estado
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  // Obtiene en un array los segmentos de la ruta actual (las partes de la URL divididas por /)
  const segments = useSegments();

  // Verifica autenticación al montar la app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Protección automática de rutas cuando cambia el estado de autenticación
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    if (!user && inAppGroup) {
      // Usuario no autenticado en rutas protegidas (app), redirect a login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Usuario autenticado en pantalla de login (auth), redirect a home
      router.replace('/home');
    }
  }, [user, segments, isLoading]);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { user } = await authService.login({ email, password });
    setUser(user);
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
