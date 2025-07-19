import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BandeDeCommande = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [commande, setCommande] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modifiedProduits, setModifiedProduits] = useState([]);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);

  // 🔄 Récupération des données
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
        tva: parseFloat(p.tva),
        prixUnitaire: parseFloat(p.prixUnitaire),
        prixUnitaireTTC: parseFloat(p.prixUnitaire) * (1 + parseFloat(p.tva) / 100),
      }));
      setModifiedProduits(newProduits);
    } catch (error) {
      console.error("Erreur lors du chargement de la commande:", error);
      alert("Impossible de charger la commande");
    }
  };

  // ⏳ Calcul des totaux à chaque modification
  useEffect(() => {
    if (!modifiedProduits.length) return;
    let ht = 0;
    let montantTVA = 0;

    modifiedProduits.forEach((p) => {
      const totalHT = Number(p.quantite) * Number(p.prixUnitaire);
      ht += totalHT;
      montantTVA += totalHT * (Number(p.tva) / 100);
    });

    setTotalHT(ht);
    setTotalTVA(montantTVA);
    setTotalTTC(ht + montantTVA);
  }, [modifiedProduits]);

  useEffect(() => {
    if (id) fetchCommande();
  }, [id]);

  // 🔢 Modifier quantité d’un produit
  const handleQuantiteChange = (index, value) => {
    const newProduits = [...modifiedProduits];
    newProduits[index].quantite = Number(value);
    setModifiedProduits(newProduits);
  };

  // ✅ Valider la commande
  const handleValider = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:4000/commandes/${id}`,
        {
          modifiePar: 1,
          lignesCommande: modifiedProduits.map((p) => ({
            id: p.idLigneCommande,
            quantite: Number(p.quantite),
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.put(
        `http://localhost:4000/commandes/valider/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Commande modifiée et validée avec succès");
      navigate("/orders");
    } catch (err) {
      console.error("Erreur de validation:", err);
      alert("🚫 Erreur lors de la validation");
    }
  };

  // 📄 Génération du PDF
  const generatePDF = () => {
    if (!commande) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Bon de Commande", 14, 22);
    doc.setFontSize(12);
    doc.text(`Numéro : ${commande.numeroCommande}`, 14, 32);
    doc.text(`Commercial : ${commande.commercial.prenom} ${commande.commercial.nom}`, 14, 40);
    doc.text(`Client : ${commande.client.prenom} ${commande.client.nom}`, 14, 48);
    doc.text(`Code fiscal : ${commande.client.code_fiscal}`, 14, 56);
    doc.text(`Date : ${new Date(commande.date).toLocaleDateString()}`, 14, 64);

    autoTable(doc, {
      startY: 70,
      head: [["Produit", "Quantité", "Prix HT", "TVA", "Prix TTC", "Total HT"]],
      body: modifiedProduits.map((p) => [
        p.nomProduit,
        p.quantite,
        `${p.prixUnitaire.toFixed(2)} €`,
        `${p.tva.toFixed(1)}%`,
        `${p.prixUnitaireTTC.toFixed(2)} €`,
        `${(p.quantite * p.prixUnitaire).toFixed(2)} €`,
      ]),
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 100;
    doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 14, finalY + 10);
    doc.text(`Total TVA : ${totalTVA.toFixed(2)} €`, 14, finalY + 18);
    doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, 14, finalY + 26);
    if (commande.promotion) {
  doc.setFont(undefined, 'bold');
  doc.text(`Promotion : ${commande.promotion.nom}`, 14, finalY + 35);
  doc.setFont(undefined, 'normal');
  doc.text(`Réduction appliquée : ${commande.promotion.reductionPourcentage}%`, 14, finalY + 43);

  const reductionAmount = (totalTTC * commande.promotion.reductionPourcentage) / 100;
  const totalAfterReduction = totalTTC - reductionAmount;

  doc.text(`Montant réduction : -${reductionAmount.toFixed(2)} €`, 14, finalY + 51);
  doc.text(`Total TTC après réduction : ${totalAfterReduction.toFixed(2)} €`, 14, finalY + 59);
}

    doc.save(`Bande_Commande_${commande.numeroCommande}.pdf`);
  };

  if (!commande) return <div className="p-10 text-center">Chargement...</div>;

  // 🖥️ Interface UI
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
         {/* ✅ BOUTON RETOUR */}
      <div>
        <button
          onClick={() => navigate("/orders")}
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow"
        >
          ← 
        </button> 
      </div>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Bon de Commande - {commande.numeroCommande}
        </h2>

        <div className="text-gray-700 space-y-1">
          <p><strong>Client :</strong> {commande.client.prenom} {commande.client.nom}</p>
          <p><strong>Code fiscal :</strong> {commande.client.code_fiscal}</p>
          <p><strong>Commercial :</strong> {commande.commercial.prenom} {commande.commercial.nom}</p>
          <p><strong>Email :</strong> {commande.commercial.email}</p>
          <p><strong>Date :</strong> {new Date(commande.date).toLocaleDateString()}</p>
          {commande.promotion && (
  <p className="text-yellow-800 font-semibold">
    🎉 Promotion : {commande.promotion.nom} (-{commande.promotion.reductionPourcentage}%)
  </p>
)}
        </div>

        <table className="w-full bg-white border rounded overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="py-2 px-4">Produit</th>
              <th className="py-2 px-4">Qté</th>
              <th className="py-2 px-4">Prix HT</th>
              <th className="py-2 px-4">TVA</th>
              <th className="py-2 px-4">Prix TTC</th>
              <th className="py-2 px-4">Total HT</th>
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
                      value={produit.quantite}
                      onChange={(e) => handleQuantiteChange(index, e.target.value)}
                      className="w-16 px-1 py-1 border rounded"
                    />
                  ) : (
                    produit.quantite
                  )}
                </td>
                <td className="py-2 px-4">{produit.prixUnitaire.toFixed(2)} €</td>
                <td className="py-2 px-4">{produit.tva.toFixed(1)}%</td>
                <td className="py-2 px-4">{produit.prixUnitaireTTC.toFixed(2)} €</td>
                <td className="py-2 px-4">{(produit.quantite * produit.prixUnitaire).toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right text-indigo-800 space-y-1">
  {commande.promotion ? (
    <>
      <p><strong>Total HT :</strong> {totalHT.toFixed(2)} €</p>
      <p><strong>Montant TVA :</strong> {totalTVA.toFixed(2)} €</p>
      <p><strong>Total TTC avant réduction :</strong> {(totalHT + totalTVA).toFixed(2)} €</p>
      <p className="text-green-700 font-semibold">
        🎁 Réduction ({commande.promotion.reductionPourcentage}%) :
        {" "}
        -{((totalHT + totalTVA) * commande.promotion.reductionPourcentage / 100).toFixed(2)} €
      </p>
      <p className="text-lg text-indigo-900 font-bold">
        Total TTC après réduction :
        {" "}
        {((totalHT + totalTVA) * (1 - commande.promotion.reductionPourcentage / 100)).toFixed(2)} €
      </p>
    </>
  ) : (
    <>
      <p><strong>Total HT :</strong> {totalHT.toFixed(2)} €</p>
      <p><strong>Montant TVA :</strong> {totalTVA.toFixed(2)} €</p>
      <p className="text-lg text-indigo-900 font-bold">
        Total TTC :
        {" "}
        {(totalHT + totalTVA).toFixed(2)} €
      </p>
    </>
  )}
</div>

        <div className="flex justify-end gap-4 mt-6 flex-wrap">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-5 rounded shadow"
            >
              Modifier
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleValider}
              className="bg-green-700 hover:bg-green-800 text-white py-2 px-5 rounded shadow"
            >
              Valider
            </button>
          )}
          <button
            onClick={generatePDF}
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-5 rounded shadow"
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BandeDeCommande;
