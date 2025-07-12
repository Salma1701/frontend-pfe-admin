import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from 'react-toastify';

const AddProductForm = ({ onClose }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [uniteNom, setUniteNom] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndUnites = async () => {
      try {
        const resCategories = await axios.get('/categories');
        setCategories(resCategories.data);
        const resUnites = await axios.get('/unite');
        setUnites(resUnites.data);
      } catch (error) {
        console.error(error);
        toast.error("❌ Erreur chargement catégories/unités.");
      }
    };
    fetchCategoriesAndUnites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(prix) < 0 || Number(stock) < 0 || Number(prixUnitaire) < 0) {
      toast.error("❌ Prix, Stock et Prix unitaire doivent être positifs.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('stock', stock);
    formData.append('prix_unitaire', prixUnitaire);
    formData.append('categorieId', categorieId);
    formData.append('uniteId', uniteNom);

    for (let img of images) {
      formData.append('images', img);
    }

    try {
      await axios.post('/produits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("✅ Produit ajouté avec succès !");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ Échec de l’ajout du produit.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
      <input type="text" placeholder="Désignation" value={nom} onChange={(e) => setNom(e.target.value)} className="border rounded px-3 py-2" required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2" required />
      <input type="number" placeholder="Prix" value={prix} onChange={(e) => setPrix(e.target.value)} className="border rounded px-3 py-2" min="0" required />
      <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border rounded px-3 py-2" min="0" required />
      <input type="number" placeholder="Prix unitaire" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)} className="border rounded px-3 py-2" min="0" required />

      <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="border rounded px-3 py-2" required>
        <option value="">Choisir une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.nom}>{cat.nom}</option>
        ))}
      </select>

      <select value={uniteNom} onChange={(e) => setUniteNom(e.target.value)} className="border rounded px-3 py-2" required>
        <option value="">Choisir une unité</option>
        {unites.map((unit) => (
          <option key={unit.id} value={unit.nom}>{unit.nom}</option>
        ))}
      </select>

      <input type="file" multiple onChange={(e) => setImages([...e.target.files])} className="border rounded px-3 py-2" />

      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Créer
      </button>
    </form>
  );
};

export default AddProductForm;
