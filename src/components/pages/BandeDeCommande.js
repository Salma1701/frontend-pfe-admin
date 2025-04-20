import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BandeDeCommande = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modifiedProduits, setModifiedProduits] = useState([]);

  const fetchCommande = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:4000/commandes/bande/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCommande(res.data);
    setModifiedProduits(res.data.produits.map(p => ({ ...p })));
  };

  useEffect(() => {
    if (id) {
      fetchCommande();
    }
  }, [id]);

  const handleQuantiteChange = (index, value) => {
    const newProduits = [...modifiedProduits];
    newProduits[index].quantite = Number(value);
    setModifiedProduits(newProduits);
  };

  const saveModifications = async () => {
    const token = localStorage.getItem("token");
    const lignesCommande = modifiedProduits.map(p => ({
      quantite: p.quantite
    }));

    await axios.patch(`http://localhost:4000/commandes/${id}`, {
      lignesCommande,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('Commande mise à jour avec succès ✅');
    setIsEditing(false);
    fetchCommande();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bon de Commande", 14, 22);

    doc.setFontSize(12);
    doc.text(`Numéro : ${commande.numeroCommande}`, 14, 32);
    doc.text(`Commercial : ${commande.commercial.prenom} ${commande.commercial.nom}`, 14, 40);
    doc.text(`Email : ${commande.commercial.email}`, 14, 48);
    doc.text(`Date : ${new Date(commande.date).toLocaleDateString()}`, 14, 56);

    const produits = modifiedProduits.map((p) => [
      p.nomProduit,
      p.quantite,
      Number(p.prixUnitaire).toFixed(2) + " TND",
      (Number(p.prixUnitaire) * Number(p.quantite)).toFixed(2) + " TND",
    ]);

    doc.autoTable({
      startY: 65,
      head: [["Produit", "Quantité", "Prix Unitaire", "Total"]],
      body: produits,
    });

    doc.text(`Total HT : ${commande.prixHorsTaxe.toFixed(2)} TND`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total TTC : ${commande.prixTotalTTC.toFixed(2)} TND`, 14, doc.lastAutoTable.finalY + 20);

    doc.save(`Bande_Commande_${commande.numeroCommande}.pdf`);
  };

  if (!commande) return <div>Chargement...</div>;

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">
        Bon de Commande - {commande.numeroCommande}
      </h2>

      <div>
        <p><strong>Commercial :</strong> {commande.commercial?.prenom} {commande.commercial?.nom}</p>
        <p><strong>Email :</strong> {commande.commercial?.email}</p>
        <p><strong>Date :</strong> {new Date(commande.date).toLocaleDateString()}</p>
      </div>

      <table className="min-w-full bg-white border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Produit</th>
            <th className="py-2 px-4">Quantité</th>
            <th className="py-2 px-4">Prix Unitaire</th>
            <th className="py-2 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {modifiedProduits.map((produit, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{produit.nomProduit}</td>
              <td className="py-2 px-4">
                {isEditing ? (
                  <input
                    type="number"
                    value={produit.quantite}
                    onChange={(e) => handleQuantiteChange(index, e.target.value)}
                    className="border px-2 py-1 rounded w-16"
                  />
                ) : (
                  produit.quantite
                )}
              </td>
              <td className="py-2 px-4">{Number(produit.prixUnitaire).toFixed(2)} TND</td>
              <td className="py-2 px-4">
                {(Number(produit.prixUnitaire) * Number(produit.quantite)).toFixed(2)} TND
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <div className="space-y-2 text-right">
          <p><strong>Total HT :</strong> {Number(commande.prixHorsTaxe).toFixed(2)} TND</p>
          <p><strong>Total TTC :</strong> {Number(commande.prixTotalTTC).toFixed(2)} TND</p>
        </div>

        <div className="space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Modifier
            </button>
          ) : (
            <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");
                await axios.patch(`http://localhost:4000/commandes/${id}/valider`, {}, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                alert('Commande validée avec succès ✅');
              } catch (err) {
                console.error('Erreur validation:', err);
                alert('Erreur validation 🚫');
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
          >
            Valider
          </button>
          )}
          <button
            onClick={generatePDF}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BandeDeCommande;
