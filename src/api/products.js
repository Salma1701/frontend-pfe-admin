// 📁 src/api/products.js
import axios from "./axios"; // ✅ Import correct de ton instance axios sécurisée

// 🔄 GET : récupérer tous les produits
export const fetchProducts = () => axios.get("/produits");

// 🔁 PATCH : activer ou désactiver un produit
export const toggleProductStatus = (id) =>
  axios.patch(`/produits/${id}/status`);

// ➕ POST : ajouter un produit
export const createProduct = (data) =>
  axios.post("/produits", data);
