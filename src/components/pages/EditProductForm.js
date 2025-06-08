import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // ✅ utilise ton instance sécurisée

const EditProductForm = ({ product, onClose, refreshProducts }) => {
  const [nom, setNom] = useState(product.nom);
  const [description, setDescription] = useState(product.description);
  const [prix, setPrix] = useState(product.prix);
  const [stock, setStock] = useState(product.stock);
  const [prixUnitaire, setPrixUnitaire] = useState(product.prix_unitaire);
  const [categorieId, setCategorieId] = useState(product.categorie?.nom || '');
  const [uniteId, setUniteId] = useState(product.unite?.nom || '');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get('/categories');
        setCategories(catRes.data);
        const uniteRes = await axios.get('/unite');
        setUnites(uniteRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('stock', stock);
    formData.append('prix_unitaire', prixUnitaire);
    formData.append('categorieId', categorieId);
    formData.append('uniteId', uniteId);
    if (images.length > 0) {
      for (const img of images) {
        formData.append('images', img);
      }
    }

    try {
      await axios.patch(`/produits/${product.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('✅ Produit modifié avec succès');
      refreshProducts();
      onClose();
    } catch (error) {
      console.error(error);
      alert('❌ Erreur modification produit');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="border rounded px-3 py-2" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2" required />
      <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} className="border rounded px-3 py-2" required />
      <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="border rounded px-3 py-2" required />
      <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)} className="border rounded px-3 py-2" required />
      
      <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="border rounded px-3 py-2" required>
        <option value="">Choisir catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.nom}>{cat.nom}</option>
        ))}
      </select>

      <select value={uniteId} onChange={(e) => setUniteId(e.target.value)} className="border rounded px-3 py-2" required>
        <option value="">Choisir unité</option>
        {unites.map((unit) => (
          <option key={unit.id} value={unit.nom}>{unit.nom}</option>
        ))}
      </select>

      <input type="file" multiple onChange={(e) => setImages([...e.target.files])} className="border rounded px-3 py-2" />

      <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Modifier
      </button>
    </form>
  );
};

export default EditProductForm;
