// 📁 src/api/products.js

import axios from "axios";

// L'URL de ton backend NestJS
const BASE_URL = "http://localhost:4000"; // modifie selon ton backend

// 🔄 GET : récupérer tous les produits
export const fetchProducts = () => axios.get(`${BASE_URL}/products`);

// 🔁 PATCH : activer ou désactiver un produit
export const toggleProductStatus = (id) =>
  axios.patch(`${BASE_URL}/products/${id}/toggle`);

// ➕ POST : ajouter un produit
export const createProduct = (data) =>
  axios.post(`${BASE_URL}/products`, data);
