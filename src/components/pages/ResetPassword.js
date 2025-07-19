import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(res.data.message);

      // ✅ Redirection automatique après 3 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Réinitialiser votre mot de passe</h2>
      {success ? (
        <p style={{ color: 'green' }}>
          {success} <br /> Vous serez redirigé vers la page de connexion...
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Nouveau mot de passe :</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ margin: '0.5rem 0', padding: '0.5rem' }}
          />
          <br />
          <button type="submit">Valider</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
