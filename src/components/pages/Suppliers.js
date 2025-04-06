import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaPlus, FaTrash } from "react-icons/fa";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // 🔥 Charger la liste des fournisseurs
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/fournisseurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (err) {
      console.error("Erreur chargement fournisseurs:", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ➕ Ajouter un fournisseur
  const addSupplier = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/fournisseurs",
        { nom: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Fournisseur ajouté avec succès !");
      setError("");
      setName("");
      fetchSuppliers(); // 🔁 Recharger la liste
    } catch (err) {
      console.error("Erreur ajout fournisseur:", err);
      setError("Erreur lors de l'ajout du fournisseur.");
      setSuccess("");
    }
  };

  // 🗑️ Supprimer un fournisseur
  const deleteSupplier = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) {
      try {
        await axios.delete(`http://localhost:4000/fournisseurs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchSuppliers();
      } catch (err) {
        console.error("Erreur suppression fournisseur:", err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔥 Titre */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <FaTruck />
        Gestion des Fournisseurs
      </h2>

      {/* ➕ Formulaire Ajouter */}
      <form onSubmit={addSupplier} className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Nom du fournisseur"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 border rounded-lg w-full md:w-1/2"
          required
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          <FaPlus />
          Ajouter
        </button>
      </form>

      {/* Messages */}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* 📋 Liste des Fournisseurs */}
      <div className="bg-white shadow rounded-lg p-6">
        {suppliers.length === 0 ? (
          <p className="text-gray-500">Aucun fournisseur trouvé.</p>
        ) : (
          <table className="min-w-full text-gray-700 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nom</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{supplier.id}</td>
                  <td className="py-3 px-6">{supplier.nom}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => deleteSupplier(supplier.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Suppliers;
