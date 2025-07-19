import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:4000"; // adapte si besoin

const AdminSatisfactionPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrSurveyId, setQrSurveyId] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  // Charger la liste des enquêtes
  const fetchSurveys = async () => {
    try {
      const res = await axios.get(`${API_BASE}/satisfaction/surveys`);
      setSurveys(res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des enquêtes");
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  // Créer une nouvelle enquête
  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    if (!titre.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/satisfaction/survey`, {
        titre,
        description,
      });
      toast.success("Enquête créée !");
      setTitre("");
      setDescription("");
      fetchSurveys();
    } catch (err) {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  // Générer le QR code pour une enquête
  const handleShowQrCode = async (surveyId) => {
    setQrSurveyId(surveyId);
    setQrCode(null);
    try {
      // Adapte baseUrl à ton domaine si besoin
      const baseUrl = window.location.origin;
      const res = await axios.get(
        `${API_BASE}/satisfaction/survey/${surveyId}/qrcode?baseUrl=${baseUrl}`
      );
      setQrCode(res.data.qrCode); // image base64
    } catch (err) {
      toast.error("Erreur lors de la génération du QR code");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Gestion des enquêtes de satisfaction</h2>

      {/* Formulaire de création */}
      <form
        onSubmit={handleCreateSurvey}
        className="bg-white rounded-xl shadow p-6 mb-8 flex flex-col gap-4"
      >
        <h3 className="text-lg font-semibold text-gray-800">Créer une nouvelle enquête</h3>
        <input
          type="text"
          placeholder="Titre de l'enquête"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer l'enquête"}
        </button>
      </form>

      {/* Liste des enquêtes */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Enquêtes existantes</h3>
        {surveys.length === 0 ? (
          <p className="text-gray-500">Aucune enquête pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {surveys.map((survey) => (
              <li key={survey.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-indigo-700">{survey.titre}</div>
                    <div className="text-gray-600 text-sm">{survey.description}</div>
                    <div className="text-xs text-gray-400">
                      Créée le {new Date(survey.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => handleShowQrCode(survey.id)}
                  >
                    Voir QR code
                  </button>
                </div>
                {/* Affichage du QR code */}
                {qrSurveyId === survey.id && qrCode && (
                  <div className="mt-4 flex flex-col items-center">
                    <img src={qrCode} alt="QR Code" className="w-40 h-40" />
                    <div className="text-xs text-gray-500 mt-2">
                      Ce QR code permet d'accéder à l'enquête pour les clients.
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminSatisfactionPage;