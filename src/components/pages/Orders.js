import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaSearch, FaEye } from "react-icons/fa";



const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/commandes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const commandesEnAttente = res.data.filter(
          (commande) => commande.statut !== "validee"
        );
        setOrders(commandesEnAttente);
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

    const orderDate = new Date(order.dateCreation);
    const matchStart = startDate ? orderDate >= new Date(startDate) : true;
    const matchEnd = endDate ? orderDate <= new Date(endDate) : true;

    return matchSearch && matchStart && matchEnd;
  });
  // 2. Pagination : découpage des commandes
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

// 3. Navigation pagination
const handleNext = () => {
  if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};
const handlePrev = () => {
  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">
          Liste des Commandes
        </h2>

        {/* 🔍 Recherche et Dates */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
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
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 rounded shadow bg-white border w-full md:w-1/4"
            placeholder="Date de début"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 rounded shadow bg-white border w-full md:w-1/4"
            placeholder="Date de fin"
          />
        </div>

        {/* 🧾 Tableau des commandes */}
        <table className="w-full bg-white rounded overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="py-3 px-6 text-left">Numéro</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Prix TTC</th>
              <th className="py-3 px-6 text-left">Prix HT</th>
              <th className="py-3 px-6 text-center">Statut</th>
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
              currentOrders.map((commande)=> (
                <tr key={commande.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6">{commande.numero_commande}</td>
                  <td className="py-3 px-6">
                    {new Date(commande.dateCreation).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    {commande.prix_total_ttc
                      ? `${Number(commande.prix_total_ttc).toFixed(2)} €`
                      : "—"}
                  </td>
                  <td className="py-3 px-6">
                    {commande.prix_hors_taxe
                      ? `${Number(commande.prix_hors_taxe).toFixed(2)} €`
                      : "—"}
                  </td>
                  <td className="py-3 px-6 text-center">
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
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/bande-de-commande/${commande.id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Voir la commande"
                      >
                        <FaEye className="inline-block text-lg" />
                      </Link>
                      <button
                        onClick={() => deleteOrder(commande.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="mb-4 flex justify-end">
  
</div>
        {/* 🔢 Pagination */}
{/* 🔢 Pagination numérotée */}
{/* 🔢 Pagination */} 
<div className="mt-6 flex flex-col md:flex-row justify-between items-center">
  <div className="text-sm text-gray-600 mb-2 md:mb-0">
    {filteredOrders.length > 0 && (
      <>
        {(indexOfFirstOrder + 1)}–{Math.min(indexOfLastOrder, filteredOrders.length)} sur {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""}
      </>
    )}
  </div>

  <div className="flex items-center space-x-1">
    {/* Bouton Précédent */}
    <button
      onClick={handlePrev}
      disabled={currentPage === 1}
      className={`px-3 py-1 rounded ${
        currentPage === 1
          ? "bg-gray-200 cursor-not-allowed text-gray-500"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
      }`}
    >
      Précédent
    </button>

    {/* Pagination Numérotée */}
    {[...Array(totalPages)].map((_, index) => {
      const pageNum = index + 1;
      return (
        <button
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          className={`w-8 h-8 rounded-md text-sm ${
            currentPage === pageNum
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800"
          } hover:bg-indigo-400`}
        >
          {pageNum}
        </button>
      );
    })}

    {/* Bouton Suivant */}
    <button
      onClick={handleNext}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded ${
        currentPage === totalPages
          ? "bg-gray-200 cursor-not-allowed text-gray-500"
          : "px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
      }`}
    >
      Suivant
    </button>
  </div>
</div>
      </div>
    </div>
  );
}

export default OrdersPage;
