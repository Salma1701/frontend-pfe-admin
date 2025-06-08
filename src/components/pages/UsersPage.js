import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie, FaUserPlus } from "react-icons/fa";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    tel: "",
    role: "commercial", // default
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/users${roleFilter !== 'all' ? '?role=' + roleFilter : ''}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs :", err);
    }
  };

  const toggleStatus = async (id) => {
    try {
    const response=  await axios.put(
        `http://localhost:4000/users/${id}/status`,
        {},
      
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
      console.log('statut user updated',response.data.isActive      )
    } catch (err) {
      console.error("Erreur changement statut :", err);
    }
  };

  const handleAddUser = async () => {
    const { nom, prenom, email, password, tel, role } = form;
    if (!nom || !prenom || !email || !password || !tel) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const endpoint =
      role === "admin"
        ? "http://localhost:4000/users/create-admin"
        : "http://localhost:4000/users/create-commercial";

    try {
      await axios.post(
        endpoint,
        { nom, prenom, email, password, tel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowModal(false);
      setForm({ nom: "", prenom: "", email: "", password: "", tel: "", role: "commercial" });
      fetchUsers();
      alert("✅ Utilisateur ajouté !");
    } catch (err) {
      console.error("Erreur ajout :", err);
      alert("❌ Erreur ajout utilisateur.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
        <FaUserTie /> Liste des Utilisateurs
      </h2>

      {/* 🔍 Filtrer par rôle + Ajouter */}
      <div className="flex justify-between mb-6">
        <div>
          <label className="mr-2 font-semibold">Filtrer par rôle :</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="all">Tous</option>
            <option value="admin">Administrateurs</option>
            <option value="commercial">Commerciaux</option>
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaUserPlus /> Ajouter utilisateur
        </button>
      </div>

      {/* 📋 Tableau utilisateurs */}
      <div className="bg-white rounded shadow p-6">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Rôle</th>
              <th className="p-3 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.nom} {user.prenom}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.tel}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3 text-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={user.isActive}
                      onChange={() => toggleStatus(user.id)}
                    />
                    <div className="relative w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300">
                      <div className="absolute left-[2px] top-[2px] bg-white w-7 h-7 rounded-full transition-all duration-300 peer-checked:translate-x-full flex items-center justify-center text-sm">
                        {user.isActive===true ? "✅" : "❌"}
                      </div>
                    </div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ➕ Modal Ajouter Utilisateur */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">Ajouter un utilisateur</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Prénom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border p-2 rounded" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded" />
              <input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Téléphone" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} className="w-full border p-2 rounded" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border p-2 rounded">
                <option value="commercial">Commercial</option>
                <option value="admin">Administrateur</option>
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Annuler
                </button>
                <button onClick={handleAddUser} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
