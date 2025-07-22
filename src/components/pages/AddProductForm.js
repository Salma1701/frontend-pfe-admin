import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from 'react-toastify';

const AddProductForm = ({ onClose }) => {
  const [designation, setDesignation] = useState('');
  const [description, setDescription] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [tva, setTva] = useState('');
  const [colisage, setColisage] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [uniteNom, setUniteNom] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);

  const prixTTC = (Number(prixUnitaire) + (Number(prixUnitaire) * Number(tva) / 100)).toFixed(2);

  useEffect(() => {
    const fetchCategoriesAndUnites = async () => {
      try {
        const resCategories = await axios.get('/categories');
        setCategories(resCategories.data);
        const resUnites = await axios.get('/unite');
        setUnites(resUnites.data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("❌ Erreur chargement catégories/unités.");
      }
    };
    fetchCategoriesAndUnites();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(prixUnitaire) < 0 || Number(tva) < 0 || Number(colisage) < 1) {
      toast.error("❌ TVA, Prix unitaire et colisage doivent être positifs.");
      return;
    }

    const formData = new FormData();
    formData.append('nom', designation);
    formData.append('description', description);
    formData.append('prix_unitaire', prixUnitaire);
    formData.append('tva', tva);
    formData.append('colisage', colisage);
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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-4 p-4 bg-white rounded shadow-md overflow-y-auto">
      <label className="font-semibold">Designation</label>
      <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="border rounded px-3 py-2" required />

      <label className="font-semibold">Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2" required />

      <label className="font-semibold">Prix unitaire HT</label>
      <input type="number" value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)} className="border rounded px-3 py-2" min="0" required />

      <label className="font-semibold">TVA (%)</label>
      <input type="number" step="0.01" value={tva} onChange={(e) => setTva(e.target.value)} className="border rounded px-3 py-2" required />

      <label className="font-semibold">Prix unitaire TTC</label>
      <input type="number" value={prixTTC} disabled className="bg-gray-100 border rounded px-3 py-2" />

      <label className="font-semibold">Colisage</label>
      <input type="number" value={colisage} onChange={(e) => setColisage(e.target.value)} className="border rounded px-3 py-2" min="1" required />

      <label className="font-semibold">Catégorie</label>
      <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)} className="border rounded px-3 py-2" required>
        <option value="">Choisir une catégorie</option>
        {categories.filter(cat => cat.isActive).map((cat) => (
          <option key={cat.id} value={cat.nom}>{cat.nom}</option>
        ))}
      </select>

      <label className="font-semibold">Unité</label>
      <select value={uniteNom} onChange={(e) => setUniteNom(e.target.value)} className="border rounded px-3 py-2" required>
        <option value="">Choisir une unité</option>
        {unites.filter(unit => unit.isActive).map((unit) => (
          <option key={unit.id} value={unit.nom}>{unit.nom}</option>
        ))}
      </select>

      <label className="font-semibold">Images</label>
      <input type="file" multiple onChange={(e) => setImages([...e.target.files])} className="border rounded px-3 py-2" />

      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Créer
      </button>
    </form>
  );
};

export default AddProductForm;
