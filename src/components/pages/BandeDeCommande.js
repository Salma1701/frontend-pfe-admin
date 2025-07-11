import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BandeDeCommande = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modifiedProduits, setModifiedProduits] = useState([]);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

  const fetchCommande = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:4000/commandes/bande/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommande(res.data);
      const newProduits = res.data.produits.map((p) => ({
        idLigneCommande: p.id,
        nomProduit: p.nomProduit,
        quantite: p.quantite,
        prixUnitaire: parseFloat(p.prixUnitaire),
      }));
      setModifiedProduits(newProduits);

      const ht = newProduits.reduce((sum, p) => sum + p.quantite * p.prixUnitaire, 0);
      const ttc = ht * 1.19;
      setTotalHT(ht);
      setTotalTTC(ttc);
    } catch (error) {
      console.error("Erreur lors du chargement de la commande:", error);
      alert("Impossible de charger la commande");
    }
  };

  useEffect(() => {
    if (id) fetchCommande();
  }, [id]);

  useEffect(() => {
    const ht = modifiedProduits.reduce((sum, p) => sum + p.quantite * p.prixUnitaire, 0);
    const ttc = ht * 1.19;
    setTotalHT(ht);
    setTotalTTC(ttc);
  }, [modifiedProduits]);

  const handleQuantiteChange = (index, value) => {
    const newProduits = [...modifiedProduits];
    newProduits[index].quantite = Number(value);
    setModifiedProduits(newProduits);
  };

  const handlePrixUnitaireChange = (index, value) => {
    const newProduits = [...modifiedProduits];
    newProduits[index].prixUnitaire = Number(value);
    setModifiedProduits(newProduits);
  };

  const saveModifications = async () => {
    const token = localStorage.getItem("token");
    try {
      for (const p of modifiedProduits) {
        if (!p.prixUnitaire || isNaN(Number(p.prixUnitaire))) {
          alert(`Prix unitaire invalide pour: ${p.nomProduit}`);
          return;
        }
      }
      for (const p of modifiedProduits) {
        await axios.put(
          `http://localhost:4000/lignes-commande/${p.idLigneCommande}`,
          {
            quantite: Number(p.quantite),
            prix_unitaire: Number(p.prixUnitaire),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setIsEditing(false);
      setTimeout(() => fetchCommande(), 500);
      alert("Modifications enregistrées ✅");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleValider = async () => {
    try {
      const token = localStorage.getItem("token");
      await saveModifications();
      await axios.put(
        `http://localhost:4000/commandes/valider/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Commande validée avec succès ✅");
      fetchCommande();
    } catch (err) {
      console.error("Erreur de validation:", err);
      alert("Erreur lors de la validation 🚫");
    }
  };

  const generatePDF = () => {
    if (!commande) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bon de Commande", 14, 22);
    doc.setFontSize(12);
    doc.text(`Numéro : ${commande.numeroCommande}`, 14, 32);
    doc.text(`Commercial : ${commande.commercial.prenom} ${commande.commercial.nom}`, 14, 40);
    doc.text(`Email : ${commande.commercial.email}`, 14, 48);
    doc.text(`Client : ${commande.client.prenom} ${commande.client.nom}`, 14, 56);
    doc.text(`Code fiscal : ${commande.client.code_fiscal}`, 14, 64);
    doc.text(`Date : ${new Date(commande.date).toLocaleDateString()}`, 14, 72);

    const produits = modifiedProduits.map((p) => [
      p.nomProduit,
      p.quantite,
      `${Number(p.prixUnitaire).toFixed(2)} €`,
      `${(p.prixUnitaire * p.quantite).toFixed(2)} €`,
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["Produit", "Quantité", "Prix Unitaire", "Total"]],
      body: produits,
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 80;
    doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 14, finalY + 10);
    doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, 14, finalY + 20);

    doc.save(`Bande_Commande_${commande.numeroCommande}.pdf`);
  };

  if (!commande) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Bon de Commande - {commande.numeroCommande}
        </h2>

        <div className="text-gray-700">
          <p>
            <strong>Commercial :</strong> {commande.commercial?.prenom}{" "}
            {commande.commercial?.nom}
          </p>
          <p>
            <strong>Email :</strong> {commande.commercial?.email}
          </p>
          <p>
            <strong>Client :</strong> {commande.client?.prenom} {commande.client?.nom}
          </p>
          <p>
            <strong>Code fiscal :</strong> {commande.client?.code_fiscal}
          </p>
          <p>
            <strong>Date :</strong> {new Date(commande.date).toLocaleDateString()}
          </p>
        </div>

        <table className="w-full bg-white border rounded overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="py-2 px-4">Produit</th>
              <th className="py-2 px-4">Quantité</th>
              <th className="py-2 px-4">Prix Unitaire</th>
              <th className="py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {modifiedProduits.map((produit, index) => (
              <tr key={index} className="border-t text-center">
                <td className="py-2 px-4">{produit.nomProduit}</td>
                <td className="py-2 px-4">
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={produit.quantite}
                      onChange={(e) =>
                        handleQuantiteChange(index, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-20 text-center"
                    />
                  ) : (
                    produit.quantite
                  )}
                </td>
                <td className="py-2 px-4">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={produit.prixUnitaire}
                      onChange={(e) =>
                        handlePrixUnitaireChange(index, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-24 text-center"
                    />
                  ) : (
                    `${Number(produit.prixUnitaire).toFixed(2)} €`
                  )}
                </td>
                <td className="py-2 px-4">
                  {(produit.quantite * produit.prixUnitaire).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div className="text-right text-indigo-800 space-y-1">
            <p>
              <strong>Total HT :</strong> {totalHT.toFixed(2)} €
            </p>
            <p>
              <strong>Total TTC :</strong> {totalTTC.toFixed(2)} €
            </p>
          </div>
          <div className="space-x-4 flex flex-wrap gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                disabled={commande.statut === "VALIDEE"}
                className={`font-semibold py-2 px-5 rounded shadow-md ${
                  commande.statut === "VALIDEE"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                Modifier
              </button>
            ) : (
              <button
                onClick={saveModifications}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow-md"
              >
                Valider la modification
              </button>
            )}
            <button
              onClick={handleValider}
              disabled={commande.statut === "validee"}
              className={`font-semibold py-2 px-6 rounded shadow-md ${
                commande.statut === "validee"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Valider
            </button>
            <button
              onClick={generatePDF}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded shadow-md"
            >
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandeDeCommande;
