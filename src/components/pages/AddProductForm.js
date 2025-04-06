import React, { useEffect, useState } from "react";
import axios from "axios";

const AddProductForm = ({ onClose }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [uniteId, setUniteId] = useState('');
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);

  // 🔥 Charger catégories et unités depuis API
  const fetchCategoriesAndUnites = async () => {
    const token = localStorage.getItem('token');
    try {
      const resCategories = await axios.get('http://localhost:4000/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(resCategories.data);

      const resUnites = await axios.get('http://localhost:4000/produits/unites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnites(resUnites.data);

    } catch (error) {
      console.error('Erreur chargement catégories/unités :', error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndUnites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('stock', stock);
    formData.append('categorieId', categorieId);
    formData.append('uniteId', uniteId);
    for (let img of images) {
      formData.append('images', img);
    }

    try {
      await axios.post('http://localhost:4000/produits', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Produit ajouté avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur ajout produit :', error);
      alert('Erreur lors de l’ajout');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="number"
        placeholder="Prix"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />

      {/* ✅ Select Catégories */}
      <select
        value={categorieId}
        onChange={(e) => setCategorieId(e.target.value)}
        className="border rounded px-3 py-2"
        required
      >
        <option value="">Choisir une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nom}
          </option>
        ))}
      </select>

      {/* ✅ Select Unités */}
      <select
        value={uniteId}
        onChange={(e) => setUniteId(e.target.value)}
        className="border rounded px-3 py-2"
        required
      >
        <option value="">Choisir une unité</option>
        {unites.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.nom}
          </option>
        ))}
      </select>

      <input
        type="file"
        multiple
        onChange={(e) => setImages([...e.target.files])}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Créer
      </button>
    </form>
  );
};

export default AddProductForm;
