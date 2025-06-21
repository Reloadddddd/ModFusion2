import React, { useState } from "react";
import {
  Eye,
  UserPlus,
  UserMinus,
  Trash2,
  Users,
  Crown,
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
} from "react-feather";

export default function UserManagement({
  users,
  formatDate,
  handlePromoteUser,
  handleDemoteUser,
  handleDeleteUser,
}) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteUserId, setPromoteUserId] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  return (
    <div className="p-4">
      {/* Tableau des utilisateurs */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-xs uppercase text-gray-400">
            <tr>
              <th className="py-3 px-4">Utilisateur</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Rôle</th>
              <th className="py-3 px-4">Créé le</th>
              <th className="py-3 px-4">Dernière connexion</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 mb-2" />
                    Aucun utilisateur trouvé
                  </div>
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-700 hover:bg-gray-900"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === "admin"
                          ? "bg-gradient-to-r from-orange-500 to-red-600"
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      }`}
                    >
                      <span className="text-white text-sm font-semibold">
                        {user.firstName.charAt(0).toUpperCase()}
                        {user.lastName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-gray-400 text-sm font-mono">
                        {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">{user.email}</td>
                <td className="py-4 px-4">
                  {user.role === "admin" ? (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full text-xs font-medium">
                      ADMIN
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/50 rounded-full text-xs font-medium">
                      Utilisateur enregistré
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">{formatDate(user.createdAt)}</td>
                <td className="py-4 px-4">{formatDate(user.lastLogin)}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      title="Voir les détails"
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleDemoteUser(user.id)}
                        title="Rétrograder"
                        className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPromoteUserId(user.id);
                          setShowPromoteModal(true);
                        }}
                        title="Promouvoir admin"
                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => setShowDeleteConfirm(user.id)}
                      title="Supprimer"
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal promotion */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPromoteModal(false)}
          />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-orange-500/50">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-orange-500/20 border border-orange-500/50 rounded-lg">
                  <Crown className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Promouvoir Administrateur
                  </h3>
                  <p className="text-gray-400">Entrez l'ID de l'utilisateur</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ID Utilisateur
                </label>
                <input
                  type="text"
                  value={promoteUserId}
                  onChange={(e) => setPromoteUserId(e.target.value)}
                  placeholder="Entrez l'ID de l'utilisateur"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  L'ID utilisateur se trouve dans le tableau ci-dessus
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handlePromoteUser(promoteUserId);
                    setShowPromoteModal(false);
                    setPromoteUserId("");
                  }}
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Promouvoir
                </button>
                <button
                  onClick={() => {
                    setShowPromoteModal(false);
                    setPromoteUserId("");
                  }}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails utilisateur */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Détails utilisateur
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedUser.role === "admin"
                      ? "bg-gradient-to-r from-orange-500 to-red-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  <span className="text-white text-xl font-bold">
                    {selectedUser.firstName.charAt(0).toUpperCase()}
                    {selectedUser.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-bold text-white">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    {selectedUser.role === "admin" ? (
                      <span className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-red-400 text-sm font-medium">
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full text-gray-400 text-sm font-medium">
                        Utilisateur enregistré
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Informations personnelles
                  </h4>
                  <div className="space-y-3">
                    <InfoRow Icon={User} label="Prénom" value={selectedUser.firstName} />
                    <InfoRow Icon={User} label="Nom" value={selectedUser.lastName} />
                    <InfoRow Icon={Mail} label="Email" value={selectedUser.email} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">
                    Informations système
                  </h4>
                  <div className="space-y-3">
                    <InfoRow label="ID utilisateur" value={selectedUser.id} isMono />
                    <InfoRow
                      Icon={Shield}
                      label="Rôle"
                      value={
                        selectedUser.role === "admin"
                          ? "Administrateur"
                          : "Utilisateur enregistré"
                      }
                      valueClassName={
                        selectedUser.role === "admin"
                          ? "text-red-400 font-medium"
                          : "text-white font-medium"
                      }
                    />
                    <InfoRow
                      Icon={Calendar}
                      label="Créé le"
                      value={formatDate(selectedUser.createdAt)}
                    />
                    <InfoRow
                      Icon={Clock}
                      label="Dernière connexion"
                      value={formatDate(selectedUser.lastLogin)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Données brutes (JSON)
                </h4>
                <pre className="p-4 bg-gray-800 rounded-lg text-sm text-gray-300 overflow-x-auto max-h-64">
                  {JSON.stringify(selectedUser, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/50">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Supprimer l'utilisateur
                  </h3>
                  <p className="text-gray-400">
                    Cette action est irréversible. Voulez-vous continuer ?
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleDeleteUser(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ Icon, label, value, valueClassName = "", isMono = false }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
      {Icon && <Icon className="w-5 h-5 text-gray-400" />}
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div
          className={`${
            isMono ? "font-mono" : ""
          } ${valueClassName} text-white`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
