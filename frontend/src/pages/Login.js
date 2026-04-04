import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Connexion réussie !");
        setEmail('');
        setPassword('');
      } else {
        setMessage("❌ Erreur lors de l'envoi");
      }

    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur serveur");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={handleSubmit}>Se connecter</button>
      <p>{message}</p>
    </div>
  );
}

export default Login;