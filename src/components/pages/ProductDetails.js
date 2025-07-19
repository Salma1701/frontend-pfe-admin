import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const fetchProduct = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:4000/produits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduct(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement du produit :", err);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-indigo-600 hover:underline"
        >
          ← Retour
        </button>

        <h2 className="text-3xl font-bold text-indigo-800 mb-4">{product.nom}</h2>
        {product.images?.[0] && (
          <img
            src={`http://localhost:4000${product.images[0]}`}
            alt={product.nom}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        <p className="mb-2"><strong>Description :</strong> {product.description}</p>
        <p className="mb-2"><strong>Catégorie :</strong> {product.categorie?.nom}</p>
        <p className="mb-2"><strong>Unité :</strong> {product.unite?.nom}</p>
        <p className="mb-2"><strong>Prix HT :</strong> {Number(product.prix_unitaire_ht).toFixed(2)} €</p>
        <p className="mb-2"><strong>TVA :</strong> {product.tva}%</p>
        <p className="mb-2"><strong>Prix TTC :</strong> {Number(product.prix_unitaire_ttc).toFixed(2)} €</p>
        <p className="mb-2">
          <strong>Statut :</strong>{" "}
          <span className={product.isActive ? "text-green-600" : "text-red-600"}>
            {product.isActive ? "Actif" : "Inactif"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
