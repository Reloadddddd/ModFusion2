import React, { useState } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
}

interface User {
  username: string;
  isAdmin: boolean;
}

const initialLogs: LogEntry[] = [
  { timestamp: '2025-06-20 10:15:00', message: 'User Alice logged in.' },
  { timestamp: '2025-06-20 11:00:00', message: 'User Bob modified a mod.' },
  { timestamp: '2025-06-20 12:30:00', message: 'User Charlie deleted a comment.' },
];

const initialUsers: User[] = [
  { username: 'Alice', isAdmin: false },
  { username: 'Bob', isAdmin: true },
  { username: 'Charlie', isAdmin: false },
];

export default function AdminPanel() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [input, setInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const appendOutput = (text: string) => {
    setConsoleOutput((prev) => [...prev, text]);
  };

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const base = args[0]?.toLowerCase();

    if (!base) {
      appendOutput('Commande vide. Tapez "help" pour la liste des commandes.');
      return;
    }

    switch (base) {
      case 'help':
        appendOutput('Commandes disponibles:');
        appendOutput('- logs : afficher les logs');
        appendOutput('- list users : afficher la liste des utilisateurs');
        appendOutput('- delete user <username> : supprimer un utilisateur');
        appendOutput('- modify user <username> set admin true|false : modifier admin');
        appendOutput('- clear : effacer la console');
        break;

      case 'logs':
        appendOutput('Logs :');
        logs.forEach((log) => {
          appendOutput(`[${log.timestamp}] ${log.message}`);
        });
        break;

      case 'list':
        if (args[1] === 'users') {
          appendOutput('Utilisateurs :');
          users.forEach((u) => {
            appendOutput(`- ${u.username} (admin: ${u.isAdmin})`);
          });
        } else {
          appendOutput('Commande inconnue après "list". Tapez "help" pour la liste.');
        }
        break;

      case 'delete':
        if (args[1] === 'user' && args[2]) {
          const username = args[2];
          const userExists = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
          if (!userExists) {
            appendOutput(`Utilisateur "${username}" non trouvé.`);
          } else {
            setUsers((prev) => prev.filter((u) => u.username.toLowerCase() !== username.toLowerCase()));
            appendOutput(`Utilisateur "${username}" supprimé.`);
            // Ajouter log de suppression
            setLogs((prev) => [
              ...prev,
              {
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                message: `Utilisateur "${username}" supprimé par admin.`,
              },
            ]);
          }
        } else {
          appendOutput('Usage : delete user <username>');
        }
        break;

      case 'modify':
        if (
          args[1] === 'user' &&
          args[2] &&
          args[3] === 'set' &&
          args[4] === 'admin' &&
          (args[5] === 'true' || args[5] === 'false')
        ) {
          const username = args[2];
          const isAdmin = args[5] === 'true';
          const userIndex = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
          if (userIndex === -1) {
            appendOutput(`Utilisateur "${username}" non trouvé.`);
          } else {
            const updatedUsers = [...users];
            updatedUsers[userIndex] = { ...updatedUsers[userIndex], isAdmin };
            setUsers(updatedUsers);
            appendOutput(`Utilisateur "${username}" mis à jour : admin = ${isAdmin}`);
            // Ajouter log de modification
            setLogs((prev) => [
              ...prev,
              {
                timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                message: `Utilisateur "${username}" modifié par admin : admin = ${isAdmin}`,
              },
            ]);
          }
        } else {
          appendOutput('Usage : modify user <username> set admin true|false');
        }
        break;

      case 'clear':
        setConsoleOutput([]);
        break;

      default:
        appendOutput(`Commande inconnue : "${base}". Tapez "help" pour la liste.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    appendOutput(`> ${input}`);
    handleCommand(input);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">Panneau d'administration - Console</h2>

      <div
        className="bg-black text-green-400 font-mono text-sm p-4 rounded flex-grow overflow-auto mb-4"
        style={{ whiteSpace: 'pre-wrap', minHeight: '300px' }}
      >
        {consoleOutput.length === 0
          ? 'Tapez "help" pour la liste des commandes.'
          : consoleOutput.map((line, i) => <div key={i}>{line}</div>)}
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-gray-800 text-white font-mono text-sm px-3 py-2 rounded-l focus:outline-none"
          placeholder="Tapez une commande..."
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 rounded-r font-semibold transition-colors"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
