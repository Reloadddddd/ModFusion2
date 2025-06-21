import React, { useState, useEffect } from "react";
import {
  Eye,
  UserPlus,
  UserMinus,
  Trash2,
  Users,
} from "react-feather";

function UserManagement({
  users,
  formatDate,
  handlePromoteUser,
  handleDemoteUser,
  handleDeleteUser,
}) {
  return (
    <div className="p-4">
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <Users className="w-12 h-12 mb-2" />
                    Aucun utilisateur trouvé
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
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
                        onClick={() => alert(`Voir détails de ${user.firstName}`)}
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
                          onClick={() => handlePromoteUser(user.id)}
                          title="Promouvoir admin"
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        title="Supprimer"
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UserManagementContainer() {
  const [users, setUsers] = useState([
    {
      id: "1",
      firstName: "Alice",
      lastName: "Dupont",
      email: "alice@example.com",
      role: "user",
      createdAt: new Date(2023, 0, 1),
      lastLogin: new Date(2023, 5, 20),
    },
    {
      id: "2",
      firstName: "Bob",
      lastName: "Martin",
      email: "bob@example.com",
      role: "admin",
      createdAt: new Date(2022, 10, 12),
      lastLogin: new Date(2023, 5, 18),
    },
  ]);

  // Formatte une date au format français simple
  function formatDate(date) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  }

  function handlePromoteUser(userId) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: "admin" } : user
      )
    );
  }

  function handleDemoteUser(userId) {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: "user" } : user
      )
    );
  }

  function handleDeleteUser(userId) {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  }

  // Simule la mise à jour de la liste chaque seconde
  useEffect(() => {
    const interval = setInterval(() => {
      // Ici tu ferais un fetch vers ton API pour récupérer la dernière liste
      // Exemple simulé : on ajoute un nouvel utilisateur toutes les 5 sec et on update lastLogin de Bob

      setUsers((prevUsers) => {
        const newUsers = [...prevUsers];

        // Mise à jour lastLogin de Bob
        const bobIndex = newUsers.findIndex((u) => u.firstName === "Bob");
        if (bobIndex !== -1) {
          newUsers[bobIndex] = {
            ...newUsers[bobIndex],
            lastLogin: new Date(),
          };
        }

        // Toutes les 5 secondes, ajoute un nouvel utilisateur fictif
        if (newUsers.length < 5) {
          const nextId = (newUsers.length + 1).toString();
          newUsers.push({
            id: nextId,
            firstName: `New${nextId}`,
            lastName: "User",
            email: `new${nextId}@example.com`,
            role: "user",
            createdAt: new Date(),
            lastLogin: new Date(),
          });
        }

        return newUsers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <UserManagement
      users={users}
      formatDate={formatDate}
      handlePromoteUser={handlePromoteUser}
      handleDemoteUser={handleDemoteUser}
      handleDeleteUser={handleDeleteUser}
    />
  );
}
