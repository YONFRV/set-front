import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginService} from '../services/authService';
import { foundAll } from '../services/fondService';
import { customForEmail } from '../services/customService';
import { transactionForUserId,cancelTransaction } from '../services/transaction';

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
  type: 'APERTURA' | 'CANCELACION' | 'RECAUDO';
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
  logout: () => void;type: string;
  availableFunds: Fund[];
  refreshUser: () => Promise<void>;
  subscribeFund: (fundId: string, amount: number, notificationType: 'Email' | 'SMS') => boolean;
  transactionForUserId: (userId: string) => Promise<TransactionUser[]>;
  cancelTransaction: (transactionId: string) => Promise<TransactionUser[]>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

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

  const transactionForUserIdFn = async (userId: string): Promise<TransactionUser[]> => {
    return  await transactionForUserId(userId);
  };
  const cancelTransactionProcess = async (transactionId: string): Promise<TransactionUser[]> => {
    return  await cancelTransaction(transactionId);
  };
  const subscribeFund = (fundId: string, amount: number, notificationType: 'Email' | 'SMS'): boolean => {
    if (!user) return false;

    const newBalance = user.balance - amount;
    const newFund: UserFund = {
      fundId,
      amount,
      subscribedAt: new Date().toISOString()
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
  

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        availableFunds: availableFunds,
        refreshUser,
        subscribeFund,
        transactionForUserId: transactionForUserIdFn,
        cancelTransaction: cancelTransactionProcess
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

