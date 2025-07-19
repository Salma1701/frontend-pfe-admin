import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaToggleOn, FaToggleOff, FaFileCsv } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { toast, ToastContainer } from "react-toastify";
import { LuTrash2, LuPencil } from "react-icons/lu";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCommercial, setSelectedCommercial] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    categorieId: "",
    codeFiscale: "",
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/categorie-client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des catégories.");
    }
  };

  useEffect(() => {
    fetchClients();
    fetchCategories();
  }, []);

  const filterByCommercial = (id) => {
    setSelectedCommercial(id);
    applyFilters(id, selectedCategory);
  };

  const filterByCategory = (id) => {
    setSelectedCategory(id);
    applyFilters(selectedCommercial, id);
  };

  const applyFilters = (commercialId, categoryId, term = searchTerm) => {
  let result = [...clients];

  if (commercialId !== "") {
    result = result.filter((c) => c.commercial?.id === parseInt(commercialId));
  }

  if (categoryId !== "") {
    result = result.filter((c) => c.categorie?.id === parseInt(categoryId));
  }

  if (term !== "") {
    const lowered = term.toLowerCase();
    result = result.filter(
      (c) =>
        c.nom.toLowerCase().includes(lowered) ||
        c.prenom.toLowerCase().includes(lowered) ||
        c.categorie?.nom.toLowerCase().includes(lowered)
    );
  }

  setFilteredClients(result);
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
      categorieId: client.categorie?.id || "",
      codeFiscale: client.codeFiscale || "",
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

  const csvData = filteredClients.map((c) => ({
    Nom: c.nom,
    Prénom: c.prenom,
    Email: c.email,
    Téléphone: c.telephone,
    "Code Fiscal": c.codeFiscale,
    Adresse: c.adresse,
    Catégorie: c.categorie?.nom || "",
    Commercial: c.commercial ? `${c.commercial.nom} ${c.commercial.prenom}` : "",
    Statut: c.isActive ? "Actif" : "Inactif",
  }));
const [currentPage, setCurrentPage] = useState(1);
const clientsPerPage = 10;
const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

const handlePrevious = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNext = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
}
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 flex items-center gap-2">
          <FaUsers /> Liste des Clients
        </h2>

        <div className="mb-6 flex gap-4 items-center">
          <label className="text-sm font-medium">Filtrer par commercial:</label>
          <input
  type="text"
  placeholder=" Rechercher par nom ou catégorie..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    applyFilters(selectedCommercial, selectedCategory, e.target.value);
  }}
  className="border rounded-lg p-2 shadow-sm w-72"
/>
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

          <label className="text-sm font-medium">Filtrer par catégorie:</label>
          <select
            value={selectedCategory}
            onChange={(e) => filterByCategory(e.target.value)}
            className="border rounded-lg p-2 shadow-sm"
          >
            <option value="">Toutes</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>

          <CSVLink data={csvData} filename="clients.csv" className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
            <FaFileCsv /> Export CSV
          </CSVLink>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredClients.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Aucun client trouvé.</p>
          ) : (
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="px-6 py-3 font-semibold text-left">Nom</th>
                  <th className="px-6 py-3 font-semibold text-left">Email</th>
                  <th className="px-6 py-3 font-semibold text-left">Téléphone</th>
                  <th className="px-6 py-3 font-semibold text-left">Code fiscal</th>
                  <th className="px-6 py-3 font-semibold text-left">Adresse</th>
                  <th className="px-6 py-3 font-semibold text-left">Catégorie</th>
                  <th className="px-6 py-3 font-semibold text-left">Commercial</th>
                  <th className="px-6 py-3 font-semibold text-left">Statut</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients
                  .slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)
                  .map((client, idx) => (
                  <tr key={client.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 font-medium capitalize">{client.nom} {client.prenom}</td>
                    <td className="px-6 py-4">{client.email}</td>
                    <td className="px-6 py-4">{client.telephone}</td>
                    <td className="px-6 py-4">{client.codeFiscale || "—"}</td>
                    <td className="px-6 py-4">{client.adresse}</td>
                    <td className="px-6 py-4">{client.categorie?.nom || "—"}</td>
                    <td className="px-6 py-4">
                      {client.commercial ? `${client.commercial.nom} ${client.commercial.prenom}` : "Non assigné"}
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
                <input
                  name="codeFiscale"
                  value={editForm.codeFiscale || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  placeholder="Code fiscal"
                />
                <input name="adresse" value={editForm.adresse} onChange={handleEditChange} className="w-full p-2 border rounded" placeholder="Adresse" />
                <select
                  name="categorieId"
                  value={editForm.categorieId}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Annuler</button>
                <button onClick={submitEdit} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Enregistrer</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
      {filteredClients.length > 0 && (
  <div className="flex items-center justify-between px-4 py-4 bg-gray-50 border-t">
    {/* ➤ Message à gauche */}
    <div className="text-sm text-gray-600">
      {(currentPage - 1) * clientsPerPage + 1} – {Math.min(currentPage * clientsPerPage, filteredClients.length)} sur {filteredClients.length} éléments
    </div>

    {/* ➤ Pagination à droite */}
    <div className="flex items-center gap-1">
      {/* Bouton Précédent */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-sm ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        Précédent
      </button>

      {/* Nombres des pages */}
      {Array.from({ length: Math.ceil(filteredClients.length / clientsPerPage) }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === i + 1
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {i + 1}
        </button>
      ))}

      {/* Bouton Suivant */}
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(prev + 1, Math.ceil(filteredClients.length / clientsPerPage))
          )
        }
        disabled={currentPage >= Math.ceil(filteredClients.length / clientsPerPage)}
        className={`px-3 py-1 rounded-md text-sm ${
          currentPage >= Math.ceil(filteredClients.length / clientsPerPage)
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Suivant
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ClientsPage;
