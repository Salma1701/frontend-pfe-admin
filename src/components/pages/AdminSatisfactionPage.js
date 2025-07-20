import React, { useState, useEffect } from "react";
import AddSurveyPage from "./AddSurveyPage";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { LuPencil } from "react-icons/lu";

const AdminSatisfactionPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // Charger les enquêtes
  const fetchSurveys = async () => {
    try {
      const res = await axios.get("/enquetes");
      setSurveys(res.data);
      toast.info("Liste des enquêtes mise à jour");
    } catch (err) {
      toast.error("Erreur lors du chargement des enquêtes");
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Ouvrir le modal d'édition
  const handleEdit = (survey) => {
    setSelectedSurvey(survey);
    setShowEditModal(true);
  };

  // Après ajout ou édition, rafraîchir la liste
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedSurvey(null);
    setTimeout(fetchSurveys, 300); // Ajoute un léger délai pour garantir la mise à jour
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-700">Gestion des enquêtes de satisfaction</h2>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
            onClick={() => setShowAddModal(true)}
          >
            + Ajouter une enquête
          </button>
        </div>
        {/* Liste des enquêtes */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">Enquêtes existantes</h3>
          {surveys.length === 0 ? (
            <div className="text-gray-500">Aucune enquête trouvée.</div>
          ) : (
            <ul>
              {surveys.map((survey) => (
                <li
                  key={survey.id}
                  className="flex justify-between items-center border-b py-2 cursor-pointer hover:bg-indigo-50 transition"
                  onClick={() => setSelectedSurvey(survey)}
                >
                  <div>
                    <span className="font-bold text-indigo-700 text-lg">{survey.nom}</span>
                    <span className="ml-4 text-xs text-gray-500">Début : {survey.dateDebut}</span>
                    <span className="ml-2 text-xs text-gray-500">Fin : {survey.dateFin}</span>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-blue-400 flex items-center justify-center text-blue-600 hover:bg-blue-100 mx-auto"
                      onClick={e => { e.stopPropagation(); handleEdit(survey); }}
                      title="Modifier"
                    >
                      <LuPencil className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Modal ajout */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <AddSurveyPage onClose={handleModalClose} />
          </div>
        )}
        {/* Modal édition */}
        {showEditModal && selectedSurvey && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <AddSurveyPage survey={selectedSurvey} onClose={handleModalClose} isEdit />
          </div>
        )}
        {/* Modal détails */}
        {selectedSurvey && !showEditModal && !showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedSurvey(null)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Détails de l'enquête</h2>
              <div className="mb-2"><span className="font-semibold">Nom :</span> {selectedSurvey.nom}</div>
              <div className="mb-2"><span className="font-semibold">Date début :</span> {selectedSurvey.dateDebut}</div>
              <div className="mb-2"><span className="font-semibold">Date fin :</span> {selectedSurvey.dateFin}</div>
              {/* Tu peux ajouter ici l'affichage des questions et des clients affectés si tu veux */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSatisfactionPage;
