import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie, FaUserPlus, FaTrash } from "react-icons/fa";

const UsersPage = () => {
  const [commercials, setCommercials] = useState([]);
  const [visites, setVisites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    tel: "",
  });

  const token = localStorage.getItem("token");

  const fetchCommercialsAndVisits = async () => {
    try {
      const resCommercials = await axios.get("http://localhost:4000/users/commerciaux", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resVisites = await axios.get("http://localhost:4000/visites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommercials(resCommercials.data);
      setVisites(resVisites.data);
    } catch (error) {
      console.error("Erreur chargement commerciaux ou visites :", error);
    }
  };

  useEffect(() => {
    fetchCommercialsAndVisits();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer ce commercial ?")) return;
    try {
      await axios.delete(`http://localhost:4000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCommercialsAndVisits();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleAddCommercial = async () => {
    if (!form.nom || !form.prenom || !form.email || !form.password || !form.tel) {
      alert("Remplir tous les champs !");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/users/create-commercial",
        {
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          password: form.password,
          tel: form.tel,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowModal(false);
      setForm({ nom: "", prenom: "", email: "", password: "", tel: "" });
      fetchCommercialsAndVisits();
      alert("✅ Commercial ajouté !");
    } catch (err) {
      console.error("Erreur ajout commercial :", err);
      alert("❌ Erreur ajout commercial !");
    }
  };

  // 🆕 Trouver la raison de visite du commercial
  const getVisiteRaison = (userId) => {
    const visite = visites.find((v) => v.user?.id === userId); // 🔥 Très important: v.user.id
    return visite ? visite.raison : "Pas de visite";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
        <FaUserTie /> Liste des Commerciaux
      </h2>

      {/* Tableaux des commerciaux */}
      <div className="bg-white rounded shadow p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-700">Commerciaux</h3>
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
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Téléphone</th>
              <th className="p-3">Raison de visite</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commercials.map((com) => (
              <tr key={com.id} className="border-t">
                <td className="p-3">{com.nom} {com.prenom}</td>
                <td className="p-3">{com.email}</td>
                <td className="p-3">{com.tel}</td>
                <td className="p-3">{getVisiteRaison(com.id)}</td> {/* 🔥 */}
                <td className="p-3">
                  <button onClick={() => deleteUser(com.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal ajout commercial */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">Ajouter un Commercial</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Prénom" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border p-2 rounded" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border p-2 rounded" />
              <input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Téléphone" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} className="w-full border p-2 rounded" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Annuler
                </button>
                <button onClick={handleAddCommercial} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
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
