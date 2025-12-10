import React, { createContext, useContext, useState } from 'react';
import type { Staff } from '../types';

interface StaffContextType {
  currentStaff: Staff | null;
  setCurrentStaff: (staff: Staff | null) => void;
  staffs: Staff[];
  refreshStaffs: () => Promise<void>;
  loading: boolean;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Mock data for development if backend not connected
const MOCK_STAFFS: Staff[] = [
  { id: '1', name: 'Главный Штаб', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Региональный Центр', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(MOCK_STAFFS[0]);
  const [staffs] = useState<Staff[]>(MOCK_STAFFS);
  const [loading, setLoading] = useState(false);

  const refreshStaffs = async () => {
    setLoading(true);
    // TODO: Fetch from Supabase
    // const { data, error } = await supabase.from('staffs').select('*');
    // if (data) setStaffs(data);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <StaffContext.Provider value={{ currentStaff, setCurrentStaff, staffs, refreshStaffs, loading }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
