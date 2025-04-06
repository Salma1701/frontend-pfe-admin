import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie, FaUserPlus, FaTrash } from "react-icons/fa";

const UsersPage = () => {
  const [clients, setClients] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const resClients = await axios.get("http://localhost:4000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resCommercials = await axios.get("http://localhost:4000/users/commerciaux", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(resClients.data.filter(user => user.role === "client"));
      setCommercials(resCommercials.data);
    } catch (error) {
      console.error("Erreur chargement utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`http://localhost:4000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitNewCommercial = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/users/create-commercial",
        { ...formData, role: "commercial" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        tel: "",
        password: "",
      });
      fetchUsers();
      alert("Commercial ajouté avec succès !");
    } catch (err) {
      console.error("Erreur ajout commercial :", err.response?.data || err);
      alert("Erreur ajout commercial !");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2 mb-4">
        <FaUserTie /> Gestion des Utilisateurs
      </h2>

      {/* Commercials */}
      <div className="bg-white rounded shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-700">Commerciaux actifs</h3>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaUserPlus /> Ajouter
          </button>
        </div>
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commercials.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clients */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Liste des clients</h3>
        {/* ... Liste clients si besoin */}
      </div>

      {/* Modal Ajouter Commercial */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-indigo-600">Ajouter un Commercial</h2>
            <form className="space-y-4" onSubmit={submitNewCommercial}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="tel"
                placeholder="Téléphone"
                value={formData.tel}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
