import React, { useState } from 'react';
import { User, Mail, Calendar, Clock, Edit3, Save, X, Shield, Key, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const UserProfile: React.FC = () => {
  const { user, updateProfile, promoteToAdmin, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showAdminPromotion, setShowAdminPromotion] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setIsUpdating(true);
    setMessage(null);

    const result = await updateProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
    });

    if (result.success) {
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Erreur lors de la mise à jour' });
    }

    setIsUpdating(false);
  };

  const handleCancel = () => {
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleAdminPromotion = async () => {
    if (!adminCode.trim()) {
      setMessage({ type: 'error', text: 'Veuillez entrer un code administrateur' });
      return;
    }

    const result = await promoteToAdmin(adminCode);
    if (result.success) {
      setMessage({ type: 'success', text: 'Vous avez été promu administrateur !' });
      setShowAdminPromotion(false);
      setAdminCode('');
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: result.error || 'Code administrateur invalide' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    setMessage(null);

    const result = await deleteAccount();
    if (result.success) {
      // Ici, tu peux rediriger ou déconnecter l'utilisateur, selon ton app
      setMessage({ type: 'success', text: 'Compte supprimé avec succès.' });
    } else {
      setMessage({ type: 'error', text: result.error || 'Erreur lors de la suppression du compte' });
    }

    setIsDeleting(false);
    setConfirmDelete(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  {user.role === 'admin' && (
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                      <span className="text-red-400 text-sm font-medium">ADMIN</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-lg">{user.email}</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Sauvegarde...' : 'Sauvegarder'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mx-8 mt-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                : 'bg-red-500/20 border border-red-500/50 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Informations personnelles</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{user.firstName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{user.lastName}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Adresse email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{user.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Promotion - Only for non-admin users */}
              {user.role !== 'admin' && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Devenir administrateur</h3>
                  {!showAdminPromotion ? (
                    <button
                      onClick={() => setShowAdminPromotion(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-600/20 border border-orange-500/50 text-orange-400 hover:bg-orange-600/30 hover:text-orange-300 rounded-lg transition-colors"
                    >
                      <Key className="w-4 h-4" />
                      <span>Entrer un code administrateur</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="password"
                          value={adminCode}
                          onChange={(e) => setAdminCode(e.target.value)}
                          placeholder="Code administrateur"
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                        <button
                          onClick={handleAdminPromotion}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => {
                            setShowAdminPromotion(false);
                            setAdminCode('');
                          }}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Entrez le code administrateur pour obtenir les privilèges d'administration
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Informations du compte */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Informations du compte</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rôle</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Shield className={`w-5 h-5 ${user.role === 'admin' ? 'text-red-400' : 'text-gray-400'}`} />
                    <span className={`font-medium ${user.role === 'admin' ? 'text-red-400' : 'text-white'}`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID utilisateur</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400 font-mono text-sm">{user.id}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Membre depuis</label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-white">{formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {user.lastLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Dernière connexion</label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-white">{formatDate(user.lastLogin)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-300">Mods téléchargés</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-white">0</div>
                    <div className="text-sm text-gray-300">Mods favoris</div>
                  </div>
                </div>
              </div>

              {/* Supprimer le compte */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Supprimer le compte</h3>
                {!confirmDelete ? (
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer mon compte</span>
                  </button>
                ) : (
                  <div className="space-x-4">
                    <span className="text-red-400 font-medium">Êtes-vous sûr ? Cette action est irréversible.</span>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      disabled={isDeleting}
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
