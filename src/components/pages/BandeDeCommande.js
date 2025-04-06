import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaFileInvoice, FaSearch, FaTrash, FaDownload, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BandeDeCommande = () => {
  const [lignesCommande, setLignesCommande] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [linesPerPage] = useState(5);

  const token = localStorage.getItem("token");

  const fetchLignesCommande = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/lignes-commande", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLignesCommande(res.data);
    } catch (err) {
      console.error("Erreur chargement lignes de commande :", err);
    }
  }, [token]);

  useEffect(() => {
    fetchLignesCommande();
  }, [fetchLignesCommande]);

  const filteredLignes = lignesCommande.filter((ligne) =>
    ligne.commande?.numero_commande?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * linesPerPage;
  const indexOfFirst = indexOfLast - linesPerPage;
  const currentLignes = filteredLignes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLignes.length / linesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteLigne = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette ligne ?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:4000/lignes-commande/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ligne supprimée avec succès !");
      fetchLignesCommande();
    } catch (err) {
      toast.error("Erreur lors de la suppression !");
      console.error(err);
    }
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      lignesCommande.map((ligne) => ({
        Commande: ligne.commande?.numero_commande,
        Produit: ligne.produit?.nom,
        Quantité: ligne.quantite,
        PrixUnitaire: ligne.prix_unitaire,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BandeDeCommande");
    XLSX.writeFile(workbook, "bande-de-commande.xlsx");
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Bande de Commande", 14, 20);

    const tableData = lignesCommande.map((ligne) => [
      ligne.commande?.numero_commande || "—",
      ligne.produit?.nom || "—",
      ligne.quantite,
      ligne.prix_unitaire ? parseFloat(ligne.prix_unitaire).toFixed(2) + " TND" : "—",
    ]);

    doc.autoTable({
      startY: 30,
      head: [["Commande", "Produit", "Quantité", "Prix Unitaire"]],
      body: tableData,
    });

    doc.save("bande-de-commande.pdf");
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-700">
          <FaFileInvoice />
          Bande de Commande
        </h2>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          {/* 🔍 Recherche */}
          <div className="flex items-center bg-white px-4 py-2 rounded shadow w-full md:w-64">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* 📄 Export Excel */}
          <button
            onClick={exportExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <FaDownload />
            Export Excel
          </button>

          {/* 🧾 Export PDF */}
          <button
            onClick={exportPDF}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <FaFilePdf />
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-6">
        {currentLignes.length === 0 ? (
          <p className="text-center text-gray-500">Aucune ligne de commande trouvée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="py-3 px-6">Commande</th>
                  <th className="py-3 px-6">Produit</th>
                  <th className="py-3 px-6">Quantité</th>
                  <th className="py-3 px-6">Prix Unitaire</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLignes.map((ligne) => (
                  <tr key={ligne.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{ligne.commande?.numero_commande || "—"}</td>
                    <td className="py-3 px-6">{ligne.produit?.nom || "—"}</td>
                    <td className="py-3 px-6">{ligne.quantite}</td>
                    <td className="py-3 px-6">
                      {ligne.prix_unitaire
                        ? parseFloat(ligne.prix_unitaire).toFixed(2) + " TND"
                        : "—"}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleDeleteLigne(ligne.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`mx-1 px-4 py-2 rounded-full ${
                currentPage === idx + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" />
    </div>
  );
};

export default BandeDeCommande;
