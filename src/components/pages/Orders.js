import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaSearch } from "react-icons/fa";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/commandes", {
          headers: { Authorization: `Bearer ${token}` },
        });
         const commandesEnattente = res.data.filter(
          (commande) => commande.statut !== "validee"
        );
        setOrders(commandesEnattente);
        console.log(res.data)
      } catch (err) {
        console.error("Erreur lors du chargement des commandes :", err);
      }
    };
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await axios.delete(`http://localhost:4000/commandes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } catch (err) {
        console.error("Erreur suppression commande :", err);
        alert("Erreur : Seul un admin peut supprimer une commande.");
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.numero_commande
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchDate = dateFilter
      ? new Date(order.dateCreation).toISOString().slice(0, 10) === dateFilter
      : true;
    return matchSearch && matchDate;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
          Liste des Commandes
        </h2>

        {/* 🔍 Recherche et Date */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par numéro..."
              className="pl-10 pr-4 py-2 w-full border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded shadow bg-white border w-full md:w-1/3"
          />
        </div>

        {/* 🧾 Tableau */}
        <table className="w-full bg-white rounded overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="py-3 px-6 text-left">Numéro</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Prix TTC</th>
              <th className="py-3 px-6 text-left">Prix HT</th>
              <th className="py-3 px-6 text-left">Statut</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  Aucune commande trouvée.
                </td>
              </tr>
            ) : (
              filteredOrders.map((commande) => (
                <tr key={commande.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6">{commande.numero_commande}</td>
                  <td className="py-3 px-6">
                    {new Date(commande.dateCreation).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    {commande.prix_total_ttc
                      ? `${Number(commande.prix_total_ttc).toFixed(2)} TND`
                      : "—"}
                  </td>
                  <td className="py-3 px-6">
                    {commande.prix_hors_taxe
                      ? `${Number(commande.prix_hors_taxe).toFixed(2)} TND`
                      : "—"}
                  </td>
                  <td className="py-3 px-6">
                    {commande.statut === "validée" ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Validée
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link
                      to={`/bande-de-commande/${commande.id}`}
                      className="text-indigo-600 hover:underline font-semibold mr-3"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => deleteOrder(commande.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
