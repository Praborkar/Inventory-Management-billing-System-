
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Mock users for demo
  const mockUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin' as const
    },
    {
      id: '2',
      name: 'Cashier User',
      email: 'cashier@example.com',
      password: 'cashier123',
      role: 'cashier' as const
    }
  ];
  
  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    try {
      // For demo, we'll use mock data
      const matchedUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      
      if (matchedUser) {
        const { password, ...userWithoutPassword } = matchedUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${userWithoutPassword.name}!`
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password"
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };
  
  const register = async (name: string, email: string, password: string) => {
    // In a real app, this would be an API call
    try {
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already in use"
        });
        return false;
      }
      
      // In a real app, would save to database
      toast({
        title: "Registration successful",
        description: "Please login with your new account"
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "An unexpected error occurred"
      });
      return false;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      login, 
      logout, 
      register,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
