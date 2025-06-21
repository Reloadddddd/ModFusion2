import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { database } from '../services/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUserFromStorage = () => {
      const currentUser = database.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    updateUserFromStorage();

    window.addEventListener('localUserChange', updateUserFromStorage);

    return () => {
      window.removeEventListener('localUserChange', updateUserFromStorage);
    };
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const authenticatedUser = database.authenticateUser(
        credentials.email,
        credentials.password
      );

      if (authenticatedUser) {
        database.setCurrentUser(authenticatedUser);
        setUser(authenticatedUser);
        return { success: true };
      }

      return { success: false, error: 'Email ou mot de passe incorrect' };
    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de la connexion',
      };
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (data.password !== data.confirmPassword) {
        return {
          success: false,
          error: 'Les mots de passe ne correspondent pas',
        };
      }

      const newUser = database.createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        adminCode: data.adminCode,
      });

      database.setCurrentUser(newUser);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur lors de l’inscription',
      };
    }
  };

  const logout = () => {
    database.logout();
    setUser(null);
  };

  const updateProfile = async (
    updates: Partial<User>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      const updatedUser = database.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        database.setCurrentUser(updatedUser);
        return { success: true };
      }

      return {
        success: false,
        error: 'Erreur lors de la mise à jour du profil',
      };
    } catch {
      return {
        success: false,
        error: 'Erreur lors de la mise à jour du profil',
      };
    }
  };

  const promoteToAdmin = async (
    adminCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      const success = database.promoteToAdmin(user.id, adminCode);
      if (success) {
        const updatedUser = database.getCurrentUser();
        setUser(updatedUser);
        return { success: true };
      }

      return { success: false, error: 'Code administrateur invalide' };
    } catch {
      return { success: false, error: 'Erreur lors de la promotion' };
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    promoteToAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};
