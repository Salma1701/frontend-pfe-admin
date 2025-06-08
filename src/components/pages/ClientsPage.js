import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editForm, setEditForm] = useState({ nom: "", prenom: "", email: "", telephone: "", adresse: "" });

  const token = localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:4000/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des clients.");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(
        `http://localhost:4000/client/${id}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchClients();
      toast.success(`Client ${!currentStatus ? "activé" : "désactivé"} avec succès.`);
    } catch (err) {
      console.error("Erreur activation:", err);
      toast.error(" pppppppppppppppp  ");
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditModalOpen(false);
      fetchClients();
      toast.success("✅ Client modifié avec succès");
    } catch (err) {
      console.error("Erreur mise à jour:", err);
      toast.error("❌ Erreur lors de la mise à jour du client");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2 mb-6">
        <FaUsers /> Liste des Clients
      </h2>

      <div className="bg-white rounded-lg shadow p-6">
        {clients.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun client trouvé.</p>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Nom</th>
                <th className="p-3">Email</th>
                <th className="p-3">Téléphone</th>
                <th className="p-3">Adresse</th>
                <th className="p-3">Statut</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 capitalize font-medium">{client.nom} {client.prenom}</td>
                  <td className="p-3">{client.email}</td>
                  <td className="p-3">{client.telephone}</td>
                  <td className="p-3">{client.adresse}</td>
                  <td className="p-3">
                    <span className={`font-medium ${client.isActive ? "text-green-600" : "text-red-500"}`}>
                      {client.isActive ? "✅ Actif" : "❌ Inactif"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(client)}
                      title="Modifier"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => toggleStatus(client.id, client.isActive)}
                      title={client.isActive ? "Désactiver" : "Activer"}
                      className={
                        client.isActive
                          ? "text-red-500 hover:text-red-700"
                          : "text-green-500 hover:text-green-700"
                      }
                    >
                      {client.isActive ? <FaToggleOff size={20} /> : <FaToggleOn size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md bg-white rounded-lg p-6 shadow-xl space-y-4">
            <Dialog.Title className="text-lg font-bold">Modifier Client</Dialog.Title>
            <div className="space-y-2">
              <input name="nom" value={editForm.nom} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="Nom" />
              <input name="prenom" value={editForm.prenom} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="Prénom" />
              <input name="email" value={editForm.email} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="Email" />
              <input name="telephone" value={editForm.telephone} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="Téléphone" />
              <input name="adresse" value={editForm.adresse} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="Adresse" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Annuler</button>
              <button onClick={submitEdit} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Enregistrer</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ClientsPage;