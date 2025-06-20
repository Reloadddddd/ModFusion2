import { User } from '../types/user';

class LocalDatabase {
  private readonly USERS_KEY = 'modfusion_users';
  private readonly CURRENT_USER_KEY = 'modfusion_current_user';
  private readonly ADMIN_CODE = 'mc557wr25jsbl84c3ol';

  // Récupérer tous les utilisateurs
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Sauvegarder tous les utilisateurs
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Vérifier si un code admin est valide
  isValidAdminCode(code: string): boolean {
    return code === this.ADMIN_CODE;
  }

  // Créer un nouvel utilisateur
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'role'>): User {
    const users = this.getUsers();
    
    // Vérifier si l'email existe déjà
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Un compte avec cette adresse email existe déjà');
    }

    // Déterminer le rôle basé sur le code admin
    const isAdmin = userData.adminCode && this.isValidAdminCode(userData.adminCode);

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      role: isAdmin ? 'admin' : 'user',
    };

    // Ne pas stocker le code admin dans la base de données
    delete newUser.adminCode;

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  // Authentifier un utilisateur
  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      this.setCurrentUser(user);
    }
    
    return user || null;
  }

  // Définir l'utilisateur actuel
  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Mettre à jour un utilisateur
  updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    
    // Mettre à jour l'utilisateur actuel si c'est lui qui est modifié
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }
    
    return users[userIndex];
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) return false;
    
    this.saveUsers(filteredUsers);
    
    // Déconnecter si c'est l'utilisateur actuel
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }
    
    return true;
  }

  // Promouvoir un utilisateur en admin avec le code
  promoteToAdmin(userId: string, adminCode: string): boolean {
    if (!this.isValidAdminCode(adminCode)) return false;
    
    const updatedUser = this.updateUser(userId, { role: 'admin' });
    return !!updatedUser;
  }

  // Promouvoir un utilisateur en admin par ID (pour les admins)
  promoteToAdminById(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return false;
    
    const updatedUser = this.updateUser(userId, { role: 'admin' });
    return !!updatedUser;
  }

  // Rétrograder un admin en utilisateur normal
  demoteFromAdmin(userId: string): boolean {
    const updatedUser = this.updateUser(userId, { role: 'user' });
    return !!updatedUser;
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Réinitialiser la base de données (pour le développement)
  reset(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

export const database = new LocalDatabase();