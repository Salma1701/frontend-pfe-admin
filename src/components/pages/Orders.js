import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:4000/commandes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des commandes :", err);
    }
  };

  const deleteOrder = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        await axios.delete(`http://localhost:4000/commandes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchOrders(); // 🔄 Refresh après suppression
      } catch (err) {
        console.error("Erreur suppression commande :", err);
        alert("Erreur : Seul un admin peut supprimer une commande.");
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchSearch = order.numero_commande?.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateFilter
      ? new Date(order.date_creation).toISOString().slice(0, 10) === dateFilter
      : true;
    return matchSearch && matchDate;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <FaClipboardList />
        Liste des Commandes
      </h2>

      {/* 🔍 Recherche + 📅 Filtrer par Date */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow w-full md:w-1/3">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par numéro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded shadow bg-white border w-full md:w-1/4"
        />
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-lg shadow p-6">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">Aucune commande trouvée.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Numéro</th>
                <th className="py-3 px-6 text-left">Prix TTC</th>
                <th className="py-3 px-6 text-left">Prix HT</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{order.id}</td>
                  <td className="py-3 px-6">{order.numero_commande || "—"}</td>
                  <td className="py-3 px-6">
                    {order.prix_total_ttc !== null && order.prix_total_ttc !== undefined
                      ? Number(order.prix_total_ttc).toFixed(2) + " TND"
                      : "—"}
                  </td>
                  <td className="py-3 px-6">
                    {order.prix_hors_taxe !== null && order.prix_hors_taxe !== undefined
                      ? Number(order.prix_hors_taxe).toFixed(2) + " TND"
                      : "—"}
                  </td>
                  <td className="py-3 px-6">
                    {order.date_creation
                      ? new Date(order.date_creation).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-6 text-center flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate(`/bande-de-commande/${order.id}`)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Voir Bon de Commande"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
