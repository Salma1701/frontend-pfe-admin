import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { FaPlus } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../Modal";
import { SecondaryButton, PrimaryButton } from "../ModalButton";

const RaisonsVisitePage = () => {
  const [raisons, setRaisons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRaison, setSelectedRaison] = useState(null);
  const [newRaison, setNewRaison] = useState("");
  const [editedValue, setEditedValue] = useState("");

  const fetchRaisons = async () => {
    try {
      const res = await axios.get("/raisons");
      setRaisons(res.data);
    } catch {
      toast.error("Erreur lors du chargement des raisons");
    }
  };

  useEffect(() => {
    fetchRaisons();
  }, []);

  const addRaison = async () => {
    if (!newRaison.trim()) return;
    try {
      await axios.post("/raisons", { nom: newRaison, isActive: true });
      toast.success("Raison ajoutée !");
      setNewRaison("");
      setShowAddModal(false);
      fetchRaisons();
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const updateRaison = async () => {
    if (!editedValue.trim()) return;
    try {
      await axios.put(`/raisons/${selectedRaison.id}`, { nom: editedValue });
      toast.success("Raison modifiée !");
      setShowEditModal(false);
      setSelectedRaison(null);
      fetchRaisons();
    } catch {
      toast.error("Erreur lors de la modification");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`/raisons/${id}/status`);
      fetchRaisons();
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-700">
            ⚙️ Gestion des Raisons de Visite
          </h2>
          <button
            onClick={() => {
              setNewRaison("");
              setShowAddModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow"
          >
            <FaPlus /> Ajouter Raison
          </button>
        </div>

        {/* 📋 Tableau des raisons */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="px-6 py-3 font-semibold text-left">Nom</th>
                <th className="px-6 py-3 text-center font-semibold">Statut</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {raisons.map((raison) => (
                <tr key={raison.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {raison.nom}
                  </td>
                  <td className="px-6 py-4 text-center">
                                <button
              onClick={() => toggleStatus(raison.id)}
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                raison.isActive
                  ? "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                  : "bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
              }`}
            >
              {raison.isActive ? "Active" : "Inactive"}
            </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedRaison(raison);
                        setEditedValue(raison.nom);
                        setShowEditModal(true);
                      }}
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

        {/* Modal Ajout */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Ajouter une raison de visite"
          subtitle="Créez une nouvelle raison de visite"
          icon={FaPlus}
          maxWidth="max-w-md"
          footer={
            <>
              <SecondaryButton onClick={() => setShowAddModal(false)}>
                Annuler
              </SecondaryButton>
              <PrimaryButton onClick={addRaison}>
                Ajouter
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de la raison *</label>
              <input
                type="text"
                placeholder="Nom de la nouvelle raison"
                value={newRaison}
                onChange={(e) => setNewRaison(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
                autoFocus
              />
            </div>
          </div>
        </Modal>

        {/* Modal Modification */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRaison(null);
          }}
          title="Modifier la raison de visite"
          subtitle="Mettez à jour le nom de la raison"
          icon={LuPencil}
          maxWidth="max-w-md"
          footer={
            <>
              <SecondaryButton onClick={() => {
                setShowEditModal(false);
                setSelectedRaison(null);
              }}>
                Annuler
              </SecondaryButton>
              <PrimaryButton onClick={updateRaison}>
                Enregistrer
              </PrimaryButton>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom de la raison *</label>
              <input
                type="text"
                placeholder="Nom de la raison"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
                autoFocus
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default RaisonsVisitePage;
