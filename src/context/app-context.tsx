import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';
import http from '../axios/http';
import { RolesResponse } from '@types/role';

interface GlobalData {
  availableRoles?: RolesResponse[];
}

const AppContext = createContext<GlobalData | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [globalData, setGlobalData] = useState<GlobalData>({});

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const [roles] = await Promise.all([
          http.get('/global/available-roles'),
        ]);

        setGlobalData({
          availableRoles: roles.data,
        });
      } catch (err) {
        console.error('Error loading global data:', err);
      }
    };

    fetchGlobalData();
  }, []);

  return (
    <AppContext.Provider value={globalData}>{children}</AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
