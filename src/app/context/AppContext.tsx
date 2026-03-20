import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginService, register as registerService } from '../services/authService';
import { foundAll, foundForUserId } from '../services/fondService';
import { customForEmail } from '../services/customService';
import { transactionForUserId } from '../services/transaction';

export interface Fund {
  id: string;
  name: string;
  category: 'FPV' | 'FIC';
  minimumAmount: number;
  description: string;
}

export interface FundAvailable {
  id: string;
  name: string;
  minAmount: number;
  category: string;
  state: boolean;
}


export interface UserFund {
  fundId: string;
  amount: number;
  subscribedAt: string;
}

export interface Transaction {
  id: string;
  type: 'Apertura' | 'Cancelación';
  fundId: string;
  fundName: string;
  date: string;
  amount: number;
}

export interface TransactionUser {
  id: string;
  userId: string;
  fundId: string;
  transactionCancele: string;
  nameFund: string;
  amount: string;
  type: string;
  notificationPreference: string;
  date: number;
}

export interface User {
  email: string;
  balance: number;
  funds: UserFund[];
  transactions: Transaction[];
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  availableFunds: Fund[];
  subscribeFund: (fundId: string, amount: number, notificationType: 'Email' | 'SMS') => boolean;
  cancelFund: (fundId: string) => void;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockFunds: Fund[] = [
  {
    id: '1',
    name: 'FPV Renta Fija',
    category: 'FPV',
    minimumAmount: 75000,
    description: 'Fondo de pensión voluntaria orientado a renta fija con bajo riesgo'
  },
  {
    id: '2',
    name: 'FPV Balanceado',
    category: 'FPV',
    minimumAmount: 100000,
    description: 'Combinación de renta fija y variable para perfil moderado'
  },
  {
    id: '3',
    name: 'FIC Acciones Colombia',
    category: 'FIC',
    minimumAmount: 150000,
    description: 'Inversión en acciones del mercado colombiano'
  },
  {
    id: '4',
    name: 'FIC Renta Fija Corto Plazo',
    category: 'FIC',
    minimumAmount: 50000,
    description: 'Inversión conservadora en títulos de deuda de corto plazo'
  },
  {
    id: '5',
    name: 'FPV Agresivo',
    category: 'FPV',
    minimumAmount: 200000,
    description: 'Mayor exposición a renta variable para perfiles de alto riesgo'
  },
  {
    id: '6',
    name: 'FIC Internacional',
    category: 'FIC',
    minimumAmount: 250000,
    description: 'Diversificación en mercados internacionales'
  }
];

const INITIAL_BALANCE = 500000;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availableFunds, setAvailableFunds] = useState<FundAvailable[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('fundapp_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

    const login = async (email: string, password: string) => {
      try {
        const data = await loginService(email, password);
            const token = data.accessToken;
        localStorage.setItem('token', token);
        await customerForEmail(email)
        await fundAll()
        setIsAuthenticated(true);

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    };

    const customerForEmail = async (email: string) => {
      try {
        const data = await customForEmail(email);
        const transactionUserId = await transactionForUserId(data?.id);
        const safeUser = {
            id: data?.id,
            name: data?.name || '',
            email: email,
            balance: data?.balance || 0,
            funds: [], 
            transactions: transactionUserId.map((tx: TransactionUser) => ({
              id: tx.id,
              type: tx.type,
              fundId: tx.fundId,
              fundName: tx.nameFund,
              date: new Date(tx.date).toISOString(),
              amount: parseFloat(tx.amount)
            })) 
          };
        setUser(safeUser);
        localStorage.setItem('fundapp_user', JSON.stringify(safeUser));
        return data;
      } catch (error) {
        console.error(error);
      }
    }



  const register = (email: string, password: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('fundapp_users') || '{}');
    
    if (storedUsers[email]) {
      return false; // User already exists
    }

    const newUser: User = {
      email,
      balance: INITIAL_BALANCE,
      funds: [],
      transactions: []
    };

    storedUsers[email] = {
      password,
      data: newUser
    };

    localStorage.setItem('fundapp_users', JSON.stringify(storedUsers));
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('fundapp_user', JSON.stringify(newUser));
    return true;
  };
const refreshUser = async () => {
 if (!user?.email) return;

  const data = await customForEmail(user.email);
  const transactionUserId = await transactionForUserId(data?.id);

  const safeUser: User = {
    id: data?.id,
    name: data?.name || '',
    email: user.email,
    balance: data?.balance ?? 0,   // <-- usa ?? para no ignorar balance=0
    funds: [],
    transactions: transactionUserId.map((tx: TransactionUser) => ({
      id: tx.id,
      type: tx.type,
      fundId: tx.fundId,
      fundName: tx.nameFund,
      date: new Date(tx.date).toISOString(),
      amount: parseFloat(tx.amount)
    }))
  };

  localStorage.setItem('fundapp_user', JSON.stringify(safeUser));
  setUser(Object.assign({}, safeUser)); 
};
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fundapp_user');
  };

  const fundAll = async () => {
    try {
      const data = await foundAll();
      setAvailableFunds(data);
      return data;
    } catch (error) {
      console.error(error);
      return false;     
    }
  };

  const subscribeFund = (fundId: string, amount: number, notificationType: 'Email' | 'SMS'): boolean => {
    if (!user) return false;

    const fund = mockFunds.find(f => f.id === fundId);
    if (!fund) return false;

    if (amount < fund.minimumAmount) return false;
    if (amount > user.balance) return false;

    const newBalance = user.balance - amount;
    const newFund: UserFund = {
      fundId,
      amount,
      subscribedAt: new Date().toISOString()
    };

    const newTransaction: Transaction = {
      id: `TXN-${Date.now()}`,
      type: 'Apertura',
      fundId,
      fundName: fund.name,
      date: new Date().toISOString(),
      amount
    };

    const updatedUser: User = {
      ...user,
      balance: newBalance,
      funds: [...user.funds, newFund],
      transactions: [newTransaction, ...user.transactions]
    };

    setUser(updatedUser);
    updateUserInStorage(updatedUser);
    return true;
  };

  const cancelFund = (fundId: string) => {
    if (!user) return;

    const userFund = user.funds.find(f => f.fundId === fundId);
    if (!userFund) return;

    const fund = mockFunds.find(f => f.id === fundId);
    if (!fund) return;

    const newBalance = user.balance + userFund.amount;
    const newFunds = user.funds.filter(f => f.fundId !== fundId);

    const newTransaction: Transaction = {
      id: `TXN-${Date.now()}`,
      type: 'Cancelación',
      fundId,
      fundName: fund.name,
      date: new Date().toISOString(),
      amount: userFund.amount
    };

    const updatedUser: User = {
      ...user,
      balance: newBalance,
      funds: newFunds,
      transactions: [newTransaction, ...user.transactions]
    };

    setUser(updatedUser);
    updateUserInStorage(updatedUser);
  };

  const updateUserInStorage = (updatedUser: User) => {
    localStorage.setItem('fundapp_user', JSON.stringify(updatedUser));
    
    const storedUsers = JSON.parse(localStorage.getItem('fundapp_users') || '{}');
    if (storedUsers[updatedUser.email]) {
      storedUsers[updatedUser.email].data = updatedUser;
      localStorage.setItem('fundapp_users', JSON.stringify(storedUsers));
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        availableFunds: availableFunds,
        subscribeFund,
        cancelFund,
        refreshUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
