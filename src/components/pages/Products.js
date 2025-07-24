import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTags,
  FaBoxOpen,
  FaThLarge,
  FaList,
  FaEdit,
  FaFileExport,
  FaEye,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { CSVLink } from "react-csv";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import Modal from "../Modal";
import { SecondaryButton, PrimaryButton } from "../ModalButton";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [loadingToggleId, setLoadingToggleId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/produits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
      const uniqueCats = [...new Set(res.data.map((p) => p.categorie?.nom))];
      setCategories(uniqueCats);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
    }
  };

  const toggleProductStatus = async (id, currentStatus) => {
    // Vérifications préliminaires
    if (!id) {
      alert("Erreur: ID du produit manquant");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Erreur: Token d'authentification manquant. Veuillez vous reconnecter.");
      return;
    }

    try {
      setLoadingToggleId(id);
      
      // Log pour debug
      console.log("Tentative de changement de statut:", {
        id,
        currentStatus,
        newStatus: !currentStatus
      });

      // Utiliser directement l'endpoint PUT correct
      const response = await axios.put(
        `/produits/${id}/status`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Réponse du serveur:", response.data);
      
      // Mise à jour optimiste de l'interface
      setProducts(prevProducts => 
        prevProducts.map(prod => 
          prod.id === id 
            ? { ...prod, isActive: !currentStatus }
            : prod
        )
      );

      // Rechargement des données pour s'assurer de la cohérence
      await fetchProducts();
      
    } catch (error) {
      console.error("Erreur détaillée lors du changement de statut:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      
      // Message d'erreur plus informatif
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Erreur lors du changement de statut du produit";
      
      alert(`Erreur: ${errorMessage}`);
      
      // Rechargement pour restaurer l'état correct
      await fetchProducts();
    } finally {
      setLoadingToggleId(null);
    }
  };

  const csvData = products.map((p) => ({
    Nom: p.nom,
    Description: p.description,
    Catégorie: p.categorie?.nom || "",
    Unité: p.unite?.nom || "",
    "Prix TTC (€)": Number(p.prix_unitaire_ttc).toFixed(2),
    "TVA (%)": p.tva,
    Statut: p.isActive ? "Actif" : "Inactif",
  }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.nom?.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCat ? p.categorie?.nom === selectedCat : true)
  );

  // Remettre à la première page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCat]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
              <FaBoxOpen className="text-indigo-500" /> Gestion des Produits
            </h2>
            
            {/* Indicateur de filtrage et pagination */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {filteredProducts.length} produit(s) trouvé(s)
              </span>
              {(search || selectedCat) && (
                <span className="text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                  Filtré
                </span>
              )}
              {totalPages > 1 && (
                <span className="text-gray-500">
                  Page {currentPage} sur {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Boutons Grille / Liste */}
          <div className="flex gap-2 text-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              <FaList />
            </button>
          </div>
        </div>

        {/* Ligne : recherche & filtre à gauche, boutons à droite */}
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-6 gap-4 w-full">
          {/* 🔍 Recherche + 📦 Catégories (à gauche) */}
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="border border-gray-300 px-6 py-2 rounded-md text-base font-medium w-[200px]"
            />

            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="border border-gray-300 px-6 py-2 rounded-md text-base font-medium w-[200px] bg-white"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 📁 Export + ➕ Ajouter (à droite) */}
          <div className="flex items-center gap-4">
            {/* Bouton réinitialiser les filtres */}
            {(search || selectedCat) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCat("");
                  setCurrentPage(1);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow"
                title="Réinitialiser les filtres"
              >
                <FaTimes className="text-white" /> Réinitialiser
              </button>
            )}

            <CSVLink 
              data={csvData} 
              filename="produits.csv"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow"
            >
              <FaFileExport className="text-white" /> Export CSV
            </CSVLink>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow"
            >
              <FaPlus className="text-white" /> Ajouter Produit
            </button>
          </div>
        </div>

        {/* Cartes Produits */}
        {/* Affichage conditionnel selon viewMode */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setViewProduct(prod)}
                  className="bg-white border shadow rounded-lg p-4 relative cursor-pointer hover:shadow-lg transition group"
                >
                  {prod.images?.[0] && (
                    <div className="relative group">
                      <img
                        src={`http://localhost:4000${prod.images[0]}`}
                        alt={prod.nom}
                        className="w-full h-40 object-cover rounded mb-2 transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Image hover agrandie */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <img
                          src={`http://localhost:4000${prod.images[0]}`}
                          alt={prod.nom}
                          className="w-80 h-60 object-cover rounded-lg shadow-2xl transform -translate-y-4 -translate-x-4"
                        />
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1">{prod.nom}</h3>
                  <p className="text-sm text-gray-500 mb-1">{prod.description}</p>
                  <p className="text-sm">Catégorie: {prod.categorie?.nom}</p>
                  <p className="text-sm">Unité: {prod.unite?.nom}</p>
                  <p className="text-sm font-semibold text-indigo-700">
                    {Number(prod.prix_unitaire_ttc).toFixed(2)} € TTC
                  </p>

                  {/* Statut du produit */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      prod.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {prod.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  <div
                    className="absolute top-2 right-2 flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setShowEditModal(true);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                      title="Modifier"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => toggleProductStatus(prod.id, prod.isActive)}
                      disabled={loadingToggleId === prod.id}
                      className={`px-2 py-1 rounded text-sm text-white transition-colors ${
                        prod.isActive 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-red-600 hover:bg-red-700"
                      } ${loadingToggleId === prod.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={prod.isActive ? "Désactiver" : "Activer"}
                    >
                      {loadingToggleId === prod.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : prod.isActive ? (
                        <FaToggleOn className="w-4 h-4" />
                      ) : (
                        <FaToggleOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FaBoxOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filteredProducts.length === 0 
                    ? "Aucun produit trouvé avec les filtres actuels" 
                    : "Aucun produit sur cette page"}
                </p>
                {(search || selectedCat) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCat("");
                      setCurrentPage(1);
                    }}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          // Mode liste ici ⬇️
          <div className="overflow-x-auto">
            {currentProducts.length > 0 ? (
              <table className="min-w-full border border-gray-300 rounded-xl">
                <thead className="bg-indigo-100 text-indigo-800">
                  <tr>
                    <th className="py-2 px-4 text-left">Nom</th>
                    <th className="py-2 px-4 text-left">Catégorie</th>
                    <th className="py-2 px-4 text-left">Unité</th>
                    <th className="py-2 px-4 text-left">Prix TTC (€)</th>
                    <th className="py-2 px-4 text-left">TVA</th>
                    <th className="py-2 px-4 text-center">Statut</th>
                    <th className="py-2 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentProducts.map((prod) => (
                    <tr
                      key={prod.id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => setViewProduct(prod)}
                    >
                      <td className="py-2 px-4">{prod.nom}</td>
                      <td className="py-2 px-4">{prod.categorie?.nom}</td>
                      <td className="py-2 px-4">{prod.unite?.nom}</td>
                      <td className="py-2 px-4">
                        {Number(prod.prix_unitaire_ttc).toFixed(2)} €
                      </td>
                      <td className="py-2 px-4">{prod.tva ?? "—"}</td>
                      <td className="py-2 px-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          prod.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {prod.isActive ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(prod);
                              setShowEditModal(true);
                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => toggleProductStatus(prod.id, prod.isActive)}
                            disabled={loadingToggleId === prod.id}
                            className={`px-2 py-1 rounded text-sm text-white transition-colors ${
                              prod.isActive 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "bg-red-600 hover:bg-red-700"
                            } ${loadingToggleId === prod.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={prod.isActive ? "Désactiver" : "Activer"}
                          >
                            {loadingToggleId === prod.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : prod.isActive ? (
                              <FaToggleOn className="w-4 h-4" />
                            ) : (
                              <FaToggleOff className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <FaBoxOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {filteredProducts.length === 0 
                    ? "Aucun produit trouvé avec les filtres actuels" 
                    : "Aucun produit sur cette page"}
                </p>
                {(search || selectedCat) && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCat("");
                      setCurrentPage(1);
                    }}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            )}
          </div>
        )}  

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-t bg-gray-50 mt-6">
            <div className="text-sm text-gray-600 mb-2 md:mb-0">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} sur {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 cursor-not-allowed text-gray-500"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  } hover:bg-indigo-400`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 cursor-not-allowed text-gray-500"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* ➕ Modal Ajouter */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Ajouter un produit"
          subtitle="Créez un nouveau produit dans le catalogue"
          icon={FaPlus}
          maxWidth="max-w-xl"
          showCloseButton={true}
          footer={
            <>
              <SecondaryButton onClick={() => setShowAddModal(false)}>
                Annuler
              </SecondaryButton>
              <PrimaryButton 
                onClick={() => {
                  // Le formulaire gère sa propre soumission
                  const form = document.querySelector('#add-product-form');
                  if (form) form.requestSubmit();
                }}
              >
                Créer
              </PrimaryButton>
            </>
          }
        >
          <AddProductForm
            onClose={() => {
              setShowAddModal(false);
              fetchProducts();
            }}
          />
        </Modal>

                 {/* ✏️ Modal Modifier */}
         <Modal
           isOpen={showEditModal}
           onClose={() => {
             setShowEditModal(false);
             setSelectedProduct(null);
           }}
           title="Modifier un produit"
           subtitle="Mettez à jour les informations du produit"
           icon={LuPencil}
           maxWidth="max-w-lg"
           showCloseButton={true}
           footer={
             <>
               <SecondaryButton onClick={() => {
                 setShowEditModal(false);
                 setSelectedProduct(null);
               }}>
                 Annuler
               </SecondaryButton>
               <PrimaryButton 
                 onClick={() => {
                   // Le formulaire gère sa propre soumission
                   const form = document.querySelector('#edit-product-form');
                   if (form) form.requestSubmit();
                 }}
               >
                 Modifier
               </PrimaryButton>
             </>
           }
         >
          {selectedProduct && (
            <EditProductForm
              product={selectedProduct}
              onClose={() => {
                setShowEditModal(false);
                setSelectedProduct(null);
                fetchProducts();
              }}
              refreshProducts={fetchProducts}
            />
          )}
        </Modal>

        {/* 👁️ Modal Visualisation */}
        <Modal
          isOpen={!!viewProduct}
          onClose={() => setViewProduct(null)}
          title={viewProduct?.nom || "Détails du produit"}
          icon={FaEye}
          maxWidth="max-w-lg"
          footer={
            <SecondaryButton onClick={() => setViewProduct(null)}>
              Fermer
            </SecondaryButton>
          }
        >
          {viewProduct && (
            <>
              {/* Image */}
              {viewProduct.images?.[0] && (
                <div className="text-center mb-4">
                  <img
                    src={`http://localhost:4000${viewProduct.images[0]}`}
                    alt={viewProduct.nom}
                    className="w-[500px] h-72 object-cover rounded-xl border mx-auto"
                  />
                </div>
              )}

              {/* Détails produit */}
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Description :</span><br />
                    {viewProduct.description || "Non renseignée"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Catégorie :</span><br />
                    {viewProduct.categorie?.nom || "Non définie"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Unité :</span><br />
                    {viewProduct.unite?.nom || "Non définie"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold">Statut :</span><br />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      viewProduct.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {viewProduct.isActive ? "Actif" : "Inactif"}
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Products; 