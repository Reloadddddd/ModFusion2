import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { database } from '../services/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null); // Email en attente de code

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

  // Étape 1 : connexion avec email + mdp, puis envoi du code par email
  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; requiresVerification?: boolean; error?: string }> => {
    try {
      // Vérifie email + mdp
      const authenticatedUser = database.authenticateUser(
        credentials.email,
        credentials.password
      );

      if (authenticatedUser) {
        // Envoie un code de vérification par email (simulé)
        const codeSent = database.sendVerificationCode(credentials.email);

        if (codeSent) {
          // Stocke l'email en attente de vérification
          setPendingEmail(credentials.email);
          // Retourne succès mais nécessite la vérification du code
          return { success: true, requiresVerification: true };
        } else {
          return { success: false, error: 'Impossible d\'envoyer le code de vérification' };
        }
      }

      return { success: false, error: 'Email ou mot de passe incorrect' };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la connexion' };
    }
  };

  // Étape 2 : validation du code envoyé par email
  const verifyCode = async (
    code: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!pendingEmail) {
      return { success: false, error: 'Aucune connexion en attente' };
    }

    try {
      // Vérifie si le code est valide
      const valid = database.verifyCode(pendingEmail, code);

      if (valid) {
        // Récupère l'utilisateur et finalise la connexion
        const authenticatedUser = database.getUserByEmail(pendingEmail);
        if (authenticatedUser) {
          database.setCurrentUser(authenticatedUser);
          setUser(authenticatedUser);
          setPendingEmail(null); // Reset de l'email en attente
          return { success: true };
        }
        return { success: false, error: 'Utilisateur non trouvé après vérification' };
      }

      return { success: false, error: 'Code de vérification incorrect' };
    } catch {
      return { success: false, error: 'Erreur lors de la vérification du code' };
    }
  };

  // Inscription standard
  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' };
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
        error: error instanceof Error ? error.message : 'Erreur lors de l’inscription',
      };
    }
  };

  // Déconnexion
  const logout = () => {
    database.logout();
    setUser(null);
  };

  // Mise à jour du profil
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

      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    } catch {
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    }
  };

  // Promotion administrateur
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
    verifyCode,
    register,
    logout,
    updateProfile,
    promoteToAdmin,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};
