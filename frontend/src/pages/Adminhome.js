import React, { useEffect, useState } from 'react';
import { FiFilter, FiBell } from 'react-icons/fi';

export default function Adminhome() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/pending-users');
      const data = await res.json();

      console.log("USERS:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMessage('Erreur serveur');
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        fetchPendingUsers();
      }
    } catch (err) {
      setMessage('Erreur serveur');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reject/${id}`, {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        fetchPendingUsers();
      }
    } catch (err) {
      setMessage('Erreur serveur');
    }
  };

  return (
    <div className="container">

      <h1>Administration des utilisateurs</h1>

      {message && <div className="toast">{message}</div>}

     
      <div className="top-bar">
        <div className="right-icons">

          <div className="icon-box">
            <FiFilter className="icon" />
            <span>Filtre</span>
          </div>

          <div className="icon-box">
            <FiBell className="icon" />
          </div>

        </div>
      </div>

     
      {users.length === 0 ? (
        <p>Aucun utilisateur en attente.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>id</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Âge</th>
                <th>Sexe</th>
                <th>CIN</th>
                <th>Adresse</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Mot de passe</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={user.id ?? index}>
                  <td>{user.id ?? '-'}</td>
                  <td>{user.nom ?? '-'}</td>
                  <td>{user.prenom ?? '-'}</td>
                  <td>{user.age ?? '-'}</td>
                  <td>{user.sexe ?? '-'}</td>

                  <td>{user.cin ?? '-'}</td>
                  <td>{user.adresse ?? '-'}</td>
                  <td>{user.email ?? '-'}</td>
                  <td>{user.phone ?? '-'}</td>

                  <td>{user.role ?? '-'}</td>
                  <td>••••••</td>

                  <td>
                    <button onClick={() => handleApprove(user.id)} className="approve">
                      Approuver
                    </button>
                    <button onClick={() => handleReject(user.id)} className="reject">
                      Rejeter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .container {
          padding: 30px;
          font-family: sans-serif;
          margin-top: 5%;
        }

        h1 {
          color: #0f5ed7;
          text-align: center;
          margin-bottom: 20px;
        }

        .top-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 15px;
        }

        .right-icons {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .icon-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: 0.2s;
        }

        .icon-box:hover {
          background: #e6e6e6;
        }

        .icon {
          font-size: 22px;
          color: #333;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1200px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          font-size: 14px;
          text-align: left;
        }

        th {
          background: #f3f3f3;
        }

        tr:hover {
          background: #f9f9f9;
        }

        button {
          padding: 5px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          color: white;
          margin-right: 5px;
        }

        .approve {
          background: #19af2d;
        }

        .reject {
          background: #ef4444;
        }

        .toast {
          background: #0f5ed7;
          color: white;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 5px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}