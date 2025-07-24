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
  const [surveyDetails, setSurveyDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  // Charger les détails d'une enquête
  const loadSurveyDetails = async (survey) => {
    setLoadingDetails(true);
    try {
      // Charger les affectations (commercial et clients)
      const affectationsRes = await axios.get(`/enquetes/${survey.id}/affectations`);
      // Charger les questions
      const questionsRes = await axios.get(`/enquetes/${survey.id}/questions`);
      
      setSurveyDetails({
        affectations: affectationsRes.data,
        questions: questionsRes.data
      });
    } catch (err) {
      console.error("Erreur lors du chargement des détails:", err);
      toast.error("Erreur lors du chargement des détails");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Ouvrir le modal de détails
  const handleViewDetails = (survey) => {
    setSelectedSurvey(survey);
    loadSurveyDetails(survey);
  };

  // Après ajout ou édition, rafraîchir la liste
  const handleModalClose = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedSurvey(null);
    setSurveyDetails(null);
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
                  onClick={() => handleViewDetails(survey)}
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
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setSelectedSurvey(null)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Détails de l'enquête</h2>
              
              {/* Informations de base */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Informations générales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-semibold">Nom :</span> {selectedSurvey.nom}</div>
                  <div><span className="font-semibold">Date début :</span> {selectedSurvey.dateDebut}</div>
                  <div><span className="font-semibold">Date fin :</span> {selectedSurvey.dateFin}</div>
                </div>
              </div>

              {/* Commercial et clients */}
              {loadingDetails ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des détails...</p>
                </div>
              ) : surveyDetails ? (
                <>
                  {/* Commercial sélectionné */}
                  {surveyDetails.affectations && surveyDetails.affectations.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-blue-800">Commercial sélectionné</h3>
                      <div className="bg-white p-3 rounded border">
                        <div className="font-semibold text-blue-700">
                          {surveyDetails.affectations[0].commercial?.nom} {surveyDetails.affectations[0].commercial?.prenom}
                        </div>
                        {surveyDetails.affectations[0].commercial?.zone && (
                          <div className="text-sm text-gray-600">Zone : {surveyDetails.affectations[0].commercial.zone}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Clients affectés */}
                  {surveyDetails.affectations && surveyDetails.affectations.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-green-800">
                        Clients affectés ({surveyDetails.affectations.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {surveyDetails.affectations.map((affectation, index) => (
                          <div key={index} className="bg-white p-3 rounded border">
                            <div className="font-medium text-green-700">
                              {affectation.client?.nom} {affectation.client?.prenom}
                            </div>
                            {affectation.client?.email && (
                              <div className="text-sm text-gray-600">{affectation.client.email}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  {surveyDetails.questions && surveyDetails.questions.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 text-purple-800">
                        Questions ({surveyDetails.questions.length})
                      </h3>
                      <div className="space-y-3">
                        {surveyDetails.questions.map((question, index) => (
                          <div key={question.id || index} className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-purple-700">
                                {index + 1}. {question.text}
                              </div>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                {question.type === 'text' ? 'Texte libre' : 
                                 question.type === 'image' ? 'Image' : 
                                 question.type === 'select' ? 'Oui/Non' : question.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun détail disponible pour cette enquête
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSatisfactionPage;
