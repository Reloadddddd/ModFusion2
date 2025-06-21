import { User } from '../types/user';

class LocalDatabase {
  private readonly USERS_KEY = 'modfusion_users';
  private readonly CURRENT_USER_KEY = 'modfusion_current_user';
  private readonly ADMIN_CODE = 'mc557wr25jsbl84c3ol';

  constructor() {
    // Pas d'initialisation automatique
  }

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
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'role'> & { adminCode?: string }): User {
    const users = this.getUsers();
    const emailNormalized = userData.email.trim().toLowerCase();

    if (users.some(user => user.email.trim().toLowerCase() === emailNormalized)) {
      throw new Error('Un compte avec cette adresse email existe déjà');
    }

    const isAdmin = userData.adminCode && this.isValidAdminCode(userData.adminCode);

    const newUser: User = {
      ...userData,
      email: emailNormalized,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      role: isAdmin ? 'admin' : 'Utilisateur enregistré',
    };

    // Nettoyer la propriété adminCode si présente
    if ('adminCode' in newUser) {
      delete (newUser as any).adminCode;
    }

    users.push(newUser);
    this.saveUsers(users);

    return newUser;
  }

  // Authentifier un utilisateur
  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers();
    const emailNormalized = email.trim().toLowerCase();

    const user = users.find(
      u => u.email.trim().toLowerCase() === emailNormalized && u.password === password.trim()
    );

    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      this.setCurrentUser(user);
    }

    return user || null;
  }

  // Définir l'utilisateur actuel dans le localStorage
  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('localUserChange'));
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    window.dispatchEvent(new Event('localUserChange'));
  }

  // Mettre à jour un utilisateur existant
  updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }

    return users[userIndex];
  }

  // Supprimer un utilisateur par ID
  deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);

    if (filteredUsers.length === users.length) return false;

    this.saveUsers(filteredUsers);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }

    return true;
  }

  // Promouvoir un utilisateur en admin (avec code admin)
  promoteToAdmin(userId: string, adminCode: string): boolean {
    if (!this.isValidAdminCode(adminCode)) return false;

    const updatedUser = this.updateUser(userId, { role: 'admin' });
    return !!updatedUser;
  }

  // Promouvoir un utilisateur en admin (sans code, par un admin)
  promoteToAdminById(userId: string): boolean {
    const updatedUser = this.updateUser(userId, { role: 'admin' });
    return !!updatedUser;
  }

  // Rétrograder un admin en utilisateur enregistré
  demoteFromAdmin(userId: string): boolean {
    const updatedUser = this.updateUser(userId, { role: 'Utilisateur enregistré' });
    return !!updatedUser;
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Réinitialiser la base de données locale
  reset(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

export const database = new LocalDatabase();
