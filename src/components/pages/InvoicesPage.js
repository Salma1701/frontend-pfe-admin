import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const InvoicesPage = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/commandes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // 🧹 Filtrer seulement les commandes validées
        const commandesValidees = res.data.filter(
          (commande) => commande.statut === "validee"
        );
        setCommandes(commandesValidees);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes", error);
      }
    };

    fetchCommandes(); // 🔥 On l'appelle UNE seule fois
  }, []); // ✅ Tableau vide pour PAS de boucle infinie

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Toutes les Bandes de Commande Validées ✅</h2>

      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Numéro</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Prix TTC</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {commandes.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-400">
                Aucune commande validée trouvée.
              </td>
            </tr>
          ) : (
            commandes.map((commande) => (
              <tr key={commande.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 flex items-center gap-2">
                  {commande.numero_commande}
                  {/* 🏷️ Badges validé */}
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Validée
                  </span>
                </td>
                <td className="py-3 px-6">
                  {new Date(commande.date_creation).toLocaleDateString()}
                </td>
                <td className="py-3 px-6">
                  {Number(commande.prix_total_ttc).toFixed(2)} TND
                </td>
                <td className="py-3 px-6 text-center">
                  <Link
                    to={`/bande-de-commande/${commande.id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    Voir
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesPage;
