// components/AdminPanel.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [loginLogs, setLoginLogs] = useState([]);
  const [deletionLogs, setDeletionLogs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loginsRes, deletionsRes, usersRes] = await Promise.all([
          axios.get('/api/logs/login'),
          axios.get('/api/logs/deletion'),
          axios.get('/api/users'),
        ]);

        setLoginLogs(loginsRes.data);
        setDeletionLogs(deletionsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Erreur de récupération des logs", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-white">
      <h2 className="text-3xl font-bold mb-6">Panneau d'administration</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">👤 Utilisateurs actifs</h3>
        <ul className="bg-gray-800 p-4 rounded-lg">
          {users.map((user: any) => (
            <li key={user.id} className="py-1 border-b border-gray-700">
              {user.username} – {user.email}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">🔐 Logs de connexion</h3>
        <ul className="bg-gray-800 p-4 rounded-lg">
          {loginLogs.map((log: any) => (
            <li key={log.id} className="py-1 border-b border-gray-700">
              {log.username} s’est connecté le {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🗑️ Logs de suppression</h3>
        <ul className="bg-gray-800 p-4 rounded-lg">
          {deletionLogs.map((log: any) => (
            <li key={log.id} className="py-1 border-b border-gray-700">
              {log.username} a supprimé son compte le {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
