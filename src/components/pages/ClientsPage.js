import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Dialog } from "@headlessui/react";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editForm, setEditForm] = useState({ nom: "", prenom: "", email: "", telephone: "", adresse: "" });

  const currentUser = {
    role: localStorage.getItem("role"),
    id: Number(localStorage.getItem("userId")),
  };
  const token = localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:4000/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (error) {
      console.error("Erreur chargement clients:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    try {
      await axios.delete(`http://localhost:4000/client/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClients();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      await axios.patch(
        `http://localhost:4000/client/${id}/status`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClients();
    } catch (err) {
      console.error("Erreur activation:", err);
    }
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setEditForm({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone,
      adresse: client.adresse,
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    try {
      await axios.put(
        `http://localhost:4000/client/${selectedClient.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditModalOpen(false);
      fetchClients();
    } catch (err) {
      console.error("Erreur mise à jour:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
          <FaUsers /> Liste des Clients
        </h2>
  
        {(currentUser.role === "admin" || currentUser.role === "commercial") && (
          <button
            onClick={() => console.log("/client-create")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            + Ajouter Client
          </button>
        )}
      </div>
  
      <div className="bg-white rounded-lg shadow p-6">
        {clients.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun client trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              {/* 🔹 Table head */}
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Adresse</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Commercial</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
  
              {/* 🔹 Table body */}
              <tbody>
                {clients.map((client) => {
                  const peutModifier =
                    currentUser.role === "admin" ||
                    client.commercial?.id === currentUser.id;
  
                  return (
                    <tr key={client.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 capitalize font-medium">
                        {client.nom} {client.prenom}
                      </td>
                      <td className="p-3">{client.email}</td>
                      <td className="p-3">{client.telephone}</td>
                      <td className="p-3">{client.adresse}</td>
                      <td className="p-3">
                        <span
                          className={`font-medium flex items-center gap-1 ${
                            client.isActive
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {client.isActive ? "✅ Actif" : "❌ Inactif"}
                        </span>
                      </td>
                      <td className="p-3 text-indigo-700">
                        {client.commercial?.nom} {client.commercial?.prenom}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-3">
                          {peutModifier && (
                            <>
                              {/* ✏️ Modifier */}
                              <button
                                onClick={() => openEditModal(client)}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
  
                              {/* 🔁 Activer/Désactiver */}
                              <button
                                onClick={() =>
                                  toggleStatus(client.id, !client.isActive)
                                }
                                className={
                                  client.isActive
                                    ? "text-red-500 hover:text-red-700"
                                    : "text-green-500 hover:text-green-700"
                                }
                                title={
                                  client.isActive
                                    ? "Désactiver"
                                    : "Activer"
                                }
                              >
                                {client.isActive ? (
                                  <FaToggleOff size={20} />
                                ) : (
                                  <FaToggleOn size={20} />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ClientsPage;
