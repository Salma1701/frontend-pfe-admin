import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import { LuTrash2, LuPencil } from "react-icons/lu";
import "react-toastify/dist/ReactToastify.css";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [selectedCommercial, setSelectedCommercial] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const token = localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:4000/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
      setFilteredClients(res.data);

      const uniqueCommercials = [
        ...new Map(
          res.data
            .filter((c) => c.commercial)
            .map((c) => [c.commercial.id, c.commercial])
        ).values(),
      ];
      setCommercials(uniqueCommercials);
    } catch (error) {
      toast.error("Erreur lors du chargement des clients.");
    }
  };

  const filterByCommercial = (id) => {
    setSelectedCommercial(id);
    setFilteredClients(
      id === ""
        ? clients
        : clients.filter((c) => c.commercial?.id === parseInt(id))
    );
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(
  `http://localhost:4000/client/${id}/status`,
  { isActive: !currentStatus },
  { headers: { Authorization: `Bearer ${token}` } }
);
      fetchClients();
      toast.success(`Client ${!currentStatus ? "activé" : "désactivé"} avec succès.`);
    } catch (err) {
      toast.error("Erreur lors du changement de statut.");
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
      toast.error("❌ Erreur lors de la mise à jour du client");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-2">
          <FaUsers /> Liste des Clients
        </h2>

        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium">Filtrer par commercial:</label>
          <select
            value={selectedCommercial}
            onChange={(e) => filterByCommercial(e.target.value)}
            className="border rounded-lg p-2 shadow-sm"
          >
            <option value="">Tous</option>
            {commercials.map((com) => (
              <option key={com.id} value={com.id}>
                {com.nom} {com.prenom}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredClients.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Aucun client trouvé.</p>
          ) : (
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-50 text-indigo-800">
                <tr>
                  <th className="px-6 py-3 font-semibold text-left">Nom</th>
                  <th className="px-6 py-3 font-semibold text-left">Email</th>
                  <th className="px-6 py-3 font-semibold text-left">Téléphone</th>
                  <th className="px-6 py-3 font-semibold text-left">Adresse</th>
                  <th className="px-6 py-3 font-semibold text-left">Commercial</th>
                  <th className="px-6 py-3 font-semibold text-left">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, idx) => (
                  <tr key={client.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium capitalize">{client.nom} {client.prenom}</td>
                    <td className="px-6 py-4">{client.email}</td>
                    <td className="px-6 py-4">{client.telephone}</td>
                    <td className="px-6 py-4">{client.adresse}</td>
                    <td className="px-6 py-4">
                      {client.commercial
                        ? `${client.commercial.nom} ${client.commercial.prenom}`
                        : "Non assigné"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${client.isActive ? "text-green-600" : "text-red-500"}`}>
                        {client.isActive ? "✅ Actif" : "❌ Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(client)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Modifier"
                      >
                        <LuPencil />
                      </button>
                      <button
                        onClick={() => toggleStatus(client.id, client.isActive)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Changer le statut"
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
    </div>
  );
};

export default ClientsPage;
