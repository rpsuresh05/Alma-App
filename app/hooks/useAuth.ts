import { useMutation, useQuery } from '@tanstack/react-query';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
  });

  return { login, logout };
} 