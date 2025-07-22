import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const typesReponse = [
  { value: "text", label: "Texte libre" },
  { value: "image", label: "Image" },
  { value: "select", label: "Sélection unique (Oui/Non)" },
];

const zones = ["Paris", "Nord", "Sud"];

const AddSurveyPage = ({ onClose, survey, isEdit }) => {
  const [step, setStep] = useState(1);

  // Ajout d'un état pour la validation des champs
  const [touched, setTouched] = useState({ nom: false, dateDebut: false, dateFin: false });
  // Ajout d'un état pour la validation des champs destinataires
  const [touchedDest, setTouchedDest] = useState({ zone: false, commercial: false, clients: false });

  // Étape 1 : Infos enquête
  const [nom, setNom] = useState(survey ? survey.nom : "");
  const [dateDebut, setDateDebut] = useState(survey ? survey.dateDebut || "" : "");
  const [dateFin, setDateFin] = useState(survey ? survey.dateFin || "" : "");

  // Étape 2 : Questions
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("text");

  // Étape 3 : Destinataires
  const [commerciaux, setCommerciaux] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedCommercial, setSelectedCommercial] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  // Validation des champs requis (après tous les useState)
  const isNomValid = nom.trim() !== '';
  const isDateDebutValid = dateDebut.trim() !== '';
  const isDateFinValid = dateFin.trim() !== '';
  const isZoneValid = selectedZone.trim() !== '';
  const isCommercialValid = selectedCommercial !== '' && selectedCommercial !== null && selectedCommercial !== undefined;

  const isClientsValid = selectedClients.length > 0;

  // Charger les commerciaux (avec zone)
  useEffect(() => {
    axios.get("/users?role=commercial").then(res => setCommerciaux(res.data));
  }, []);

  // Charger les clients du commercial sélectionné
  useEffect(() => {
    if (selectedCommercial) {
      axios.get(`/client?commercialId=${selectedCommercial}`).then(res => setClients(res.data));
    } else {
      setClients([]);
    }
  }, [selectedCommercial]);

  // Réinitialiser le commercial sélectionné quand la zone change
  useEffect(() => {
    setSelectedCommercial("");
    setSelectedClients([]);
  }, [selectedZone]);

  // Pré-remplir les questions et affectations si édition
  useEffect(() => {
    if (survey && isEdit) {
      setNom(survey.nom);
      setDateDebut(survey.dateDebut || "");
      setDateFin(survey.dateFin || "");
      // Charger les questions existantes
      axios.get(`/enquetes/${survey.id}/questions`).then(res => setQuestions(res.data));
      // Charger les affectations existantes
      axios.get(`/enquetes/${survey.id}/affectations`).then(res => {
        if (res.data && res.data.length > 0) {
          setSelectedCommercial(res.data[0].commercial?.id || "");
          setSelectedClients(res.data.map(a => a.client?.id));
        }
      });
    }
  }, [survey, isEdit]);

  // Filtrer les commerciaux par zone
  const filteredCommerciaux = selectedZone
    ? commerciaux.filter(c => c.zone === selectedZone)
    : commerciaux;

  // Ajout d'une question
  const addQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      if (isEdit && survey) {
        await axios.post(`/enquetes/${survey.id}/questions`, { text: questionText, type: questionType });
        const res = await axios.get(`/enquetes/${survey.id}/questions`);
        setQuestions(res.data);
      } else {
        setQuestions([...questions, { text: questionText, type: questionType }]);
      }
      setQuestionText("");
      setQuestionType("text");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erreur lors de l'ajout de la question");
    }
  };

  // Suppression d'une question (édition uniquement)
  const removeQuestion = async (qid, idx) => {
    if (isEdit && survey) {
      await axios.delete(`/enquetes/${survey.id}/questions/${qid}`);
      const res = await axios.get(`/enquetes/${survey.id}/questions`);
      setQuestions(res.data);
    } else {
      setQuestions(questions.filter((_, i) => i !== idx));
    }
  };

  // Soumission finale
  const handleSubmit = async () => {
    try {
      if (isEdit && survey) {
        // Edition du nom
        await axios.put(`/enquetes/${survey.id}`, { nom });
        // Affectation des clients
        await axios.post(`/enquetes/${survey.id}/affectation`, {
          commercialId: Number(selectedCommercial),
          clientIds: selectedClients.map(Number),
        });
        toast.success("Enquête modifiée !");
      } else {
        // Création
        const res = await axios.post("/enquetes", {
          nom,
          dateDebut,
          dateFin,
        });
        const surveyId = res.data.id;
        // Ajout des questions
        for (const q of questions) {
          await axios.post(`/enquetes/${surveyId}/questions`, q);
        }
        // Affectation des clients
        await axios.post(`/enquetes/${surveyId}/affectation`, {
          commercialId: Number(selectedCommercial),
          clientIds: selectedClients.map(Number),
        });
        toast.success("Enquête créée !");
      }
      if (onClose) onClose();
    } catch (err) {
      toast.error("Erreur lors de la soumission de l'enquête");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-2xl">
      {/* Étape 1 */}
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">{isEdit ? "Modifier l'enquête" : "Créer une enquête"}</h2>
          <label>Nom de l'enquête</label>
          <input
            value={nom}
            onChange={e => setNom(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, nom: true }))}
            className={`border rounded px-3 py-2 mb-2 w-full ${!isNomValid && touched.nom ? 'border-red-500' : ''}`}
          />
          {!isNomValid && touched.nom && <div className="text-red-500 text-sm mb-2">Le nom est obligatoire</div>}
          <label>Date début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={e => setDateDebut(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, dateDebut: true }))}
            className={`border rounded px-3 py-2 mb-2 w-full ${!isDateDebutValid && touched.dateDebut ? 'border-red-500' : ''}`}
          />
          {!isDateDebutValid && touched.dateDebut && <div className="text-red-500 text-sm mb-2">La date de début est obligatoire</div>}
          <label>Date fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={e => setDateFin(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, dateFin: true }))}
            className={`border rounded px-3 py-2 mb-4 w-full ${!isDateFinValid && touched.dateFin ? 'border-red-500' : ''}`}
          />
          {!isDateFinValid && touched.dateFin && <div className="text-red-500 text-sm mb-2">La date de fin est obligatoire</div>}
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setTouched({ nom: true, dateDebut: true, dateFin: true });
              if (isNomValid && isDateDebutValid && isDateFinValid) setStep(2);
            }}
            disabled={false}
          >
            Suivant
          </button>
        </>
      )}

      {/* Étape 2 */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Questions</h2>
          <div className="flex gap-2 mb-2">
            <input value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Intitulé de la question" className="border rounded px-3 py-2 flex-1" />
            <select value={questionType} onChange={e => setQuestionType(e.target.value)} className="border rounded px-3 py-2">
              {typesReponse.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={addQuestion} type="button">Ajouter</button>
          </div>
          <ul className="mb-4">
            {questions.map((q, i) => (
              <li key={q.id || i} className="mb-1 flex items-center justify-between">
                <span>{q.text} <span className="text-xs text-gray-500">({typesReponse.find(t => t.value === q.type)?.label})</span></span>
                <button className="ml-2 text-red-500" onClick={() => removeQuestion(q.id, i)} type="button">Supprimer</button>
              </li>
            ))}
          </ul>
          <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => setStep(1)}>Précédent</button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={() => {
            if (questions.length < 3) {
              toast.error('Veuillez ajouter au moins 3 questions pour continuer.');
              return;
            }
            setStep(3);
          }}>Suivant</button>
        </>
      )}

      {/* Étape 3 */}
      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4">Destinataires</h2>
          <label>Zone</label>
          <select
            value={selectedZone}
            onChange={e => setSelectedZone(e.target.value)}
            onBlur={() => setTouchedDest(t => ({ ...t, zone: true }))}
            className={`border rounded px-3 py-2 mb-2 w-full ${!isZoneValid && touchedDest.zone ? 'border-red-500' : ''}`}
          >
            <option value="">Toutes</option>
            {zones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          {!isZoneValid && touchedDest.zone && <div className="text-red-500 text-sm mb-2">La zone est obligatoire</div>}
          <label>Commercial</label>
          <select
            value={selectedCommercial}
            onChange={e => setSelectedCommercial(e.target.value)}
            onBlur={() => setTouchedDest(t => ({ ...t, commercial: true }))}
            className={`border rounded px-3 py-2 mb-2 w-full ${!isCommercialValid && touchedDest.commercial ? 'border-red-500' : ''}`}
            disabled={filteredCommerciaux.length === 0}
          >
            <option value="">
              {filteredCommerciaux.length === 0 
                ? "Aucun commercial disponible pour cette zone" 
                : "Choisir un commercial"
              }
            </option>
            {filteredCommerciaux.map(c => <option key={c.id} value={String(c.id)}>
              {c.nom} {c.prenom} {c.zone ? `(${c.zone})` : '(Zone non définie)'}
            </option>)}
          </select>
          {filteredCommerciaux.length === 0 && selectedZone && (
            <div className="text-orange-600 text-sm mb-2">
              ⚠️ Aucun commercial n'est assigné à la zone "{selectedZone}". 
              {selectedZone === "Toutes" ? " Veuillez sélectionner une zone spécifique." : " Veuillez sélectionner une autre zone ou assigner des commerciaux à cette zone."}
            </div>
          )}
          {!isCommercialValid && touchedDest.commercial && filteredCommerciaux.length > 0 && (
            <div className="text-red-500 text-sm mb-2">Le commercial est obligatoire</div>
          )}
          <label>
            Clients <span className="text-xs text-gray-500">(Ctrl/Cmd + clic pour sélectionner plusieurs)</span>
          </label>
          <select
            multiple
            value={selectedClients}
            onChange={e => setSelectedClients([...e.target.selectedOptions].map(o => Number(o.value)))}
            onBlur={() => setTouchedDest(t => ({ ...t, clients: true }))}
            className={`border rounded px-3 py-2 mb-4 w-full ${!isClientsValid && touchedDest.clients ? 'border-red-500' : ''}`}
            size={5}
          >
            {clients.map(cl => <option key={cl.id} value={cl.id}>{cl.nom} {cl.prenom}</option>)}
          </select>
          {!isClientsValid && touchedDest.clients && <div className="text-red-500 text-sm mb-2">Au moins un client est obligatoire</div>}
          <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => setStep(2)}>Précédent</button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={async () => {
              setTouchedDest({ zone: true, commercial: true, clients: true });
              if (!isZoneValid || !isCommercialValid || !isClientsValid) return;
              
              // Vérification supplémentaire pour les commerciaux disponibles
              if (filteredCommerciaux.length === 0) {
                toast.error("Aucun commercial disponible pour la zone sélectionnée. Veuillez sélectionner une autre zone.");
                return;
              }
              
              await handleSubmit();
            }}
          >Créer l'enquête</button>
        </>
      )}
    </div>
  );
};

export default AddSurveyPage;