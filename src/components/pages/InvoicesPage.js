import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const InvoicesPage = () => {
  const [commandes, setCommandes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [searchClient, setSearchClient] = useState("");
  const commandesPerPage = 10;

  useEffect(() => {
    const fetchCommandes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/commandes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const commandesValidees = res.data.filter(
          (commande) => commande.statut === "validee"
        );
        setCommandes(commandesValidees);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes", error);
      }
    };
    fetchCommandes();
  }, []);

  const filteredCommandes = commandes.filter((cmd) => {
    const dateVal = new Date(cmd.date_validation);
    const matchDateStart = startDate ? dateVal >= new Date(startDate) : true;
    const matchDateEnd = endDate ? dateVal <= new Date(endDate) : true;
    const matchClient = searchClient
      ? cmd.client?.nom?.toLowerCase().includes(searchClient.toLowerCase()) ||
        cmd.client?.prenom?.toLowerCase().includes(searchClient.toLowerCase())
      : true;
    return matchDateStart && matchDateEnd && matchClient;
  });

  const indexOfLast = currentPage * commandesPerPage;
  const indexOfFirst = indexOfLast - commandesPerPage;
  const currentCommandes = filteredCommandes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCommandes.length / commandesPerPage);

  const exportToCSV = () => {
    const headers = ["Numéro", "Date de validation", "Client", "Prix TTC", "Promotion"];
    const rows = filteredCommandes.map((cmd) => [
      cmd.numero_commande,
      cmd.date_validation ? new Date(cmd.date_validation).toLocaleDateString() : "",
      `${cmd.client?.prenom || ""} ${cmd.client?.nom || ""}`,
      Number(cmd.prix_total_ttc).toFixed(2) + " €",
      cmd.promotion?.titre || "",
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "commandes_validees.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-indigo-700">
            Historiques Bon de Commande Validées
          </h2>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Exporter en CSV
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher client..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-full md:w-1/3"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-full md:w-1/3"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-full md:w-1/3"
          />
        </div>

        {/* Tableau */}
        <table className="w-full bg-white rounded overflow-hidden">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="py-3 px-6 text-left">Numéro</th>
              <th className="py-3 px-6 text-left">Date de validation</th>
              <th className="py-3 px-6 text-left">Client</th>
              <th className="py-3 px-6 text-left">Prix TTC</th>
              <th className="py-3 px-6 text-left">Prix HT</th>
              <th className="py-3 px-6 text-left">Promotion</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {currentCommandes.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-400">
                  Aucune commande validée trouvée.
                </td>
              </tr>
            ) : (
              currentCommandes.map((commande) => (
                <tr key={commande.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6 flex items-center gap-2">
                    {commande.numero_commande}
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Validée
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    {commande.date_validation
                      ? new Date(commande.date_validation).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 px-6">
                    {commande.client?.prenom} {commande.client?.nom}
                  </td>
                  <td className="py-3 px-6">
                    {Number(commande.prix_total_ttc).toFixed(2)} €
                  </td>
                  <td className="py-3 px-6">
                    {Number(commande.prix_hors_taxe).toFixed(2)} €
                  </td>
                  <td className="py-3 px-6">
                    {commande.promotion ? (
                      <span className="text-sm text-blue-600 font-semibold">
                        {commande.promotion.titre}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link
                      to={`/bon-de-commande/${commande.id}`}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredCommandes.length > 0 && (
          <div className="mt-6 flex justify-between items-center flex-wrap gap-4 text-sm text-gray-600">
            {/* Message à gauche */}
            <div>
              Affichage de {(currentPage - 1) * commandesPerPage + 1} à{" "}
              {Math.min(currentPage * commandesPerPage, filteredCommandes.length)} sur{" "}
              {filteredCommandes.length} éléments
            </div>

            {/* Pagination à droite */}
            <div className="flex gap-2">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Précédent
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
