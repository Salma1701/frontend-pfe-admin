import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { FaUsers, FaToggleOn, FaToggleOff, FaFileCsv } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { LuTrash2, LuPencil } from "react-icons/lu";
import "react-toastify/dist/ReactToastify.css";
import { CSVLink } from "react-csv";
import Modal from "../Modal";
import { SecondaryButton, PrimaryButton } from "../ModalButton";

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
  const [editErrors, setEditErrors] = useState({});

  const token = localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const res = await axios.get("/client", {
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
      const res = await axios.get("/categorie-client", {
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
    const searchTermLower = term.toLowerCase();
    result = result.filter(
      (c) =>
        c.nom.toLowerCase().includes(searchTermLower) ||
        c.prenom.toLowerCase().includes(searchTermLower) ||
        (c.categorie?.nom && c.categorie.nom.toLowerCase().includes(searchTermLower))
    );
  }

  setFilteredClients(result);
};

const toggleStatus = async (id, currentStatus) => {
  try {
    await axios({
      method: 'put',
      url: `http://localhost:4000/categorie-client/${id}/status`,
      data: { isActive: !currentStatus }, // booléen natif
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    fetchCategories();
    toast.success(`Catégorie ${!currentStatus ? "activée" : "désactivée"}`);
  } catch (err) {
    console.error("Erreur PUT statut catégorie:", err?.response?.data || err);
    toast.error("Erreur lors du changement de statut");
  }
};

const toggleClientStatus = async (id, currentStatus) => {
  try {
    await axios({
      method: 'put',
      url: `http://localhost:4000/client/${id}/status`,
      data: { isActive: !currentStatus },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    fetchClients();
    toast.success(`Client ${!currentStatus ? "activé" : "désactivé"}`);
  } catch (err) {
    console.error("Erreur PUT statut client:", err?.response?.data || err);
    toast.error("Erreur lors du changement de statut du client");
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
    setEditErrors({});
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
    
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper
    if (editErrors[name]) {
      setEditErrors({ ...editErrors, [name]: "" });
    }
  };

  // Validation côté client
  const validateForm = () => {
    const errors = {};
    
    if (!editForm.nom.trim()) {
      errors.nom = "La raison sociale est requise";
    }
    
    if (!editForm.prenom.trim()) {
      errors.prenom = "Le responsable est requis";
    }
    
    if (!editForm.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = "Format d'email invalide";
    }
    
    if (!editForm.telephone.trim()) {
      errors.telephone = "Le téléphone est requis";
    } else {
      // Nettoyer le numéro de téléphone
      const cleanTelephone = editForm.telephone.replace(/\s+/g, '');
      if (!/^(?:\+33|0)[1-9]\d{8}$/.test(cleanTelephone)) {
        errors.telephone = "Format de téléphone invalide (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)";
      }
    }
    
    if (!editForm.adresse.trim()) {
      errors.adresse = "L'adresse est requise";
    }
    
    if (!editForm.codeFiscale.trim()) {
      errors.codeFiscale = "Le code fiscal est requis";
    } else if (!/^\d{14}$/.test(editForm.codeFiscale)) {
      errors.codeFiscale = "Le SIRET doit contenir exactement 14 chiffres";
    }
    
    if (!editForm.categorieId) {
      errors.categorieId = "La catégorie est requise";
    }
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitEdit = async () => {
    // Validation côté client
    if (!validateForm()) {
      return;
    }

    try {
      // Préparer les données pour l'envoi
      const submitData = {
        ...editForm,
        // Convertir categorieId en nombre
        categorieId: parseInt(editForm.categorieId),
        // Nettoyer le téléphone des espaces
        telephone: editForm.telephone.replace(/\s+/g, '')
      };

      console.log('🔄 Mise à jour du client:', submitData);

      const response = await axios.put(
        `/client/${selectedClient.id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log('✅ Réponse du serveur:', response.data);

      setEditModalOpen(false);
      setEditErrors({});
      
      // Recharger les clients pour voir les modifications
      await fetchClients();
      
      // Appliquer les filtres actuels après le rechargement
      applyFilters(selectedCommercial, selectedCategory, searchTerm);
      
      toast.success("✅ Client modifié avec succès");
    } catch (err) {
      console.error("❌ Erreur mise à jour client:", err.response?.data);
      
      // Afficher les erreurs du serveur
      if (err.response?.data?.message) {
        const serverErrors = {};
        const messages = Array.isArray(err.response.data.message) 
          ? err.response.data.message 
          : [err.response.data.message];
        
        messages.forEach(msg => {
          if (msg.includes('téléphone')) {
            serverErrors.telephone = msg;
          } else if (msg.includes('categorieId')) {
            serverErrors.categorieId = "La catégorie sélectionnée est invalide";
          } else if (msg.includes('email')) {
            serverErrors.email = msg;
          } else if (msg.includes('nom')) {
            serverErrors.nom = msg;
          } else if (msg.includes('prenom')) {
            serverErrors.prenom = msg;
          } else if (msg.includes('adresse')) {
            serverErrors.adresse = msg;
          } else if (msg.includes('codeFiscale')) {
            serverErrors.codeFiscale = msg;
          } else {
            // Erreur générale
            toast.error(`❌ ${msg}`);
          }
        });
        
        setEditErrors(serverErrors);
      } else {
        toast.error("❌ Erreur lors de la mise à jour du client");
      }
    }
  };

  const csvData = filteredClients.map((c) => ({
    "Raison Sociale": c.nom,
    "Responsable": c.prenom,
    Email: c.email,
    Téléphone: c.telephone,
    "SIRET": c.codeFiscale,
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
  placeholder=" Rechercher par raison sociale, responsable ou catégorie..."
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
            <div className="overflow-x-auto rounded-xl shadow-md">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-left">Raison Sociale</th>
                    <th className="px-6 py-3 font-semibold text-left">Responsable</th>
                    <th className="px-6 py-3 font-semibold text-left">Email</th>
                    <th className="px-6 py-3 font-semibold text-left">Téléphone</th>
                    <th className="px-6 py-3 font-semibold text-left">SIRET</th>
                    <th className="px-6 py-3 font-semibold text-left">Adresse</th>
                    <th className="px-6 py-3 font-semibold text-left">Catégorie</th>
                    <th className="px-6 py-3 font-semibold text-left">Commercial</th>
                    <th className="px-6 py-3 font-semibold text-left">Ajouté par</th>
                    <th className="px-6 py-3 font-semibold text-center">Statut</th>
                    <th className="px-6 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients
                    .slice((currentPage - 1) * clientsPerPage, currentPage * clientsPerPage)
                    .map((client, idx) => (
                      <tr
                        key={client.id}
                        className={`transition hover:bg-indigo-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                      >
                        <td className="px-6 py-4 font-medium capitalize">{client.nom}</td>
                        <td className="px-6 py-4 font-medium capitalize">{client.prenom}</td>
                        <td className="px-6 py-4">{client.email}</td>
                        <td className="px-6 py-4">{client.telephone}</td>
                        <td className="px-6 py-4">{client.codeFiscale || "—"}</td>
                        <td className="px-6 py-4">{client.adresse}</td>
                        <td className="px-6 py-4">{client.categorie?.nom || "—"}</td>
                        <td className="px-6 py-4">{client.commercial ? `${client.commercial.nom} ${client.commercial.prenom}` : "Non assigné"}</td>
                        <td className="px-6 py-4">{client.commercial ? `${client.commercial.nom} ${client.commercial.prenom}` : "Admin"}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleClientStatus(client.id, client.isActive)}
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              client.isActive
                                ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                                :  "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
                            }`}
                          >
                            {client.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openEditModal(client)}
                            className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100 mx-auto"
                            title="Modifier"
                          >
                            <LuPencil className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
         


        </div>

        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Modifier le Client"
          subtitle="Mettez à jour les informations du client"
          icon={LuPencil}
          maxWidth="max-w-lg"
          footer={
            <>
              <SecondaryButton onClick={() => setEditModalOpen(false)}>
                Annuler
              </SecondaryButton>
              <PrimaryButton onClick={submitEdit} icon={() => (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}>
                Enregistrer
              </PrimaryButton>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Raison Sociale */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Raison Sociale *
              </label>
              <input 
                name="nom" 
                value={editForm.nom} 
                onChange={handleEditChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  editErrors.nom ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`} 
                placeholder="Entrez la raison sociale" 
              />
              {editErrors.nom && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.nom}
                </div>
              )}
            </div>
            
            {/* Responsable */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Responsable *
              </label>
              <input 
                name="prenom" 
                value={editForm.prenom} 
                onChange={handleEditChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  editErrors.prenom ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`} 
                placeholder="Entrez le nom du responsable" 
              />
              {editErrors.prenom && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.prenom}
                </div>
              )}
            </div>
            
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email *
              </label>
              <input 
                name="email" 
                value={editForm.email} 
                onChange={handleEditChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  editErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`} 
                placeholder="exemple@email.com" 
              />
              {editErrors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.email}
                </div>
              )}
            </div>
            
            {/* Téléphone */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Téléphone *
              </label>
              <input 
                name="telephone" 
                value={editForm.telephone} 
                onChange={handleEditChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  editErrors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`} 
                placeholder="06 12 34 56 78" 
              />
              {editErrors.telephone && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.telephone}
                </div>
              )}
            </div>
            
            {/* Code Fiscal */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                SIRET (14 chiffres) *
              </label>
              <input
                name="codeFiscale"
                value={editForm.codeFiscale || ""}
                onChange={handleEditChange}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  editErrors.codeFiscale ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`}
                placeholder="12345678901234"
              />
              {editErrors.codeFiscale && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.codeFiscale}
                </div>
              )}
            </div>
            
            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresse *
              </label>
              <input 
                name="adresse" 
                value={editForm.adresse} 
                onChange={handleEditChange} 
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  editErrors.adresse ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`} 
                placeholder="Entrez l'adresse complète" 
              />
              {editErrors.adresse && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.adresse}
                </div>
              )}
            </div>
            
            {/* Catégorie */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Catégorie *
              </label>
              <select
                name="categorieId"
                value={editForm.categorieId}
                onChange={handleEditChange}
                className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white ${
                  editErrors.categorieId ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
              {editErrors.categorieId && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {editErrors.categorieId}
                </div>
              )}
            </div>
          </div>
        </Modal>
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
