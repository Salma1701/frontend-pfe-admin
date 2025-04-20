import React, { useEffect, useState } from "react";
import axios from "../../api/axios"; // ✅ Ton instance sécurisée

const AddProductForm = ({ onClose }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [uniteNom, setUniteNom] = useState(''); // 🛠️ Change uniteId ➔ uniteNom
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [unites, setUnites] = useState([]);

  const fetchCategoriesAndUnites = async () => {
    try {
      const resCategories = await axios.get('/categories');
      setCategories(resCategories.data);

      const resUnites = await axios.get('/unite');
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

    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('stock', stock);
    formData.append('categorieId', categorieId); // 🔥 backend attend NOM catégorie
    formData.append('uniteId', uniteNom);  // pas 'unite', pas 'unite_nom', exactement 'uniteId'  // ✅ pas autre chose       // 🔥 backend attend NOM unité (plus ID)
    for (let img of images) {
      formData.append('images', img); // 🔥 images field
    }

    try {
      await axios.post('/produits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('✅ Produit ajouté avec succès');
      onClose();
    } catch (error) {
      console.error('❌ Erreur ajout produit :', error);
      alert('Erreur lors de l’ajout');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Designation"
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
          <option key={cat.id} value={cat.nom}>
            {cat.nom}
          </option>
        ))}
      </select>

      {/* ✅ Select Unités - ENVOIE LE NOM */}
      <select
  value={uniteNom}
  onChange={(e) => setUniteNom(e.target.value)}
  required
>
  <option value="">Choisir une unité</option>
  {unites.map((unit) => (
    <option key={unit.id} value={unit.nom}>
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
