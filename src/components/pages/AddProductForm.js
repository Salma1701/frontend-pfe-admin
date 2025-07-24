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
    <div className="space-y-4">
      <form id="add-product-form" onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Titre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Désignation *</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              rows="2"
              required
            />
          </div>

          {/* Prix unitaire HT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prix HT *</label>
            <input
              type="number"
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              min="0"
              required
            />
          </div>

          {/* TVA */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">TVA (%) *</label>
            <input
              type="number"
              step="0.01"
              value={tva}
              onChange={(e) => setTva(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              required
            />
          </div>

          {/* Prix TTC */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prix TTC</label>
            <input
              type="number"
              value={prixTTC}
              disabled
              className="w-full px-3 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* Colisage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Colisage *</label>
            <input
              type="number"
              value={colisage}
              onChange={(e) => setColisage(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              min="1"
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie *</label>
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400 appearance-none bg-white"
              required
            >
              <option value="">Choisir une catégorie</option>
              {categories.filter(cat => cat.isActive).map((cat) => (
                <option key={cat.id} value={cat.nom}>{cat.nom}</option>
              ))}
            </select>
          </div>

          {/* Unité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Unité *</label>
            <select
              value={uniteNom}
              onChange={(e) => setUniteNom(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400 appearance-none bg-white"
              required
            >
              <option value="">Choisir une unité</option>
              {unites.filter(unit => unit.isActive).map((unit) => (
                <option key={unit.id} value={unit.nom}>{unit.nom}</option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
