import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BonDeCommandeView = () => {
  const { id } = useParams();
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    const fetchCommande = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`http://localhost:4000/commandes/bande/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCommande(res.data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      }
    };
    fetchCommande();
  }, [id]);

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

    const produits = commande.produits.map((p) => [
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
    doc.text(`Total HT : ${commande.prixHorsTaxe.toFixed(2)} €`, 14, finalY + 10);
    doc.text(`Total TTC : ${commande.prixTotalTTC.toFixed(2)} €`, 14, finalY + 20);
    doc.save(`Bon_Commande_${commande.numeroCommande}.pdf`);
  };

  if (!commande) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="p-10 bg-white rounded-xl shadow-xl max-w-3xl mx-auto mt-10 font-[Inter]">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Bon de Commande - {commande.numeroCommande}
      </h2>
      <p><strong>Commercial :</strong> {commande.commercial.prenom} {commande.commercial.nom}</p>
      <p><strong>Email :</strong> {commande.commercial.email}</p>
      <p><strong>Client :</strong> {commande.client.prenom} {commande.client.nom}</p>
      <p><strong>Code fiscal :</strong> {commande.client.code_fiscal}</p>
      <p><strong>Date :</strong> {new Date(commande.date).toLocaleDateString()}</p>

      <table className="w-full mt-6 border text-sm">
        <thead className="bg-indigo-100">
          <tr>
            <th className="p-2">Produit</th>
            <th className="p-2">Quantité</th>
            <th className="p-2">Prix Unitaire</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {commande.produits.map((p, i) => (
            <tr key={i} className="text-center border-t">
              <td className="p-2">{p.nomProduit}</td>
              <td className="p-2">{p.quantite}</td>
              <td className="p-2">{Number(p.prixUnitaire).toFixed(2)} €</td>
              <td className="p-2">{(p.quantite * p.prixUnitaire).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <p><strong>Total HT :</strong> {commande.prixHorsTaxe.toFixed(2)} €</p>
        <p><strong>Total TTC :</strong> {commande.prixTotalTTC.toFixed(2)} €</p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={generatePDF}
          className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-indigo-700"
        >
          Télécharger PDF
        </button>
      </div>
    </div>
  );
};

export default BonDeCommandeView;
