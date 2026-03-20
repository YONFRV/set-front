import { createContext, useContext, useEffect, useState } from 'react';
import { loginService as loginService, register as registerService } from '../services/authService';
import { foundAll } from '../services/fondService';
interface User {
  id: string;
  email: string;
}

export interface Fund {
  id: string;
  name: string;
  category: string;
  minAmount: number;
  state: boolean;
}

interface AppContextV1Type {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  availableFunds?: Fund[];
}

const AppContextV1 = createContext<AppContextV1Type>({} as AppContextV1Type);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableFunds, setAvailableFunds] = useState<Fund[]>([]);

  // 🔄 Auto login (cuando recarga la app)
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // ⚠️ Aquí puedes pegarle a /me si tu backend lo tiene
      // Por ahora asumimos que si hay token, el usuario está logueado
      setUser({
        id: 'temp',
        email: 'usuario@demo.com',
      });
    }

    setLoading(false);
  }, []);

  //LOGIN
  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  //REGISTER
  const register = async (email: string, password: string) => {
    try {
      const data = await registerService(email, password);

      localStorage.setItem('token', data.token);
      setUser(data.user);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  //LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

 //Tipos Fondos
  const fundAll = async () => {
    try {
      const data = await foundAll();
      setAvailableFunds(data.user);
      return data.user;
    } catch (error) {
      console.error(error);
      return false;
    }
  };


  return (
    <AppContextV1.Provider value={{ user, loading, login, register, logout, availableFunds }}>
      {children}
    </AppContextV1.Provider>
  );
}

export const useApp = () => useContext(AppContextV1);