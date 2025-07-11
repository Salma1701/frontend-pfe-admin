import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminTemplatePage = () => {
  const [template, setTemplate] = useState({
    description: '',
    noteGlobale: '',
    serviceCommercial: '',
    livraison: '',
    gammeProduits: false,
    recommandation: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');

  const fetchTemplate = async () => {
    try {
      const res = await axios.get('http://localhost:4000/satisfaction/template', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplate(res.data || {});
    } catch (error) {
      console.error('❌ Erreur chargement du template', error);
      alert('Erreur lors du chargement du template');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        'http://localhost:4000/satisfaction/template',
        template,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Template mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur sauvegarde', error.response?.data || error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Modèle d'Enquête de Satisfaction</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="number"
          placeholder="Note Globale"
          value={template.noteGlobale || ''}
          onChange={(e) => setTemplate({ ...template, noteGlobale: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Service Commercial"
          value={template.serviceCommercial || ''}
          onChange={(e) => setTemplate({ ...template, serviceCommercial: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Livraison"
          value={template.livraison || ''}
          onChange={(e) => setTemplate({ ...template, livraison: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={template.gammeProduits || false}
            onChange={(e) => setTemplate({ ...template, gammeProduits: e.target.checked })}
          />
          Gamme Produits Satisfaisante
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={template.recommandation || false}
            onChange={(e) => setTemplate({ ...template, recommandation: e.target.checked })}
          />
          Recommandation
        </label>
        <textarea
          placeholder="Description / Commentaire par défaut"
          value={template.description || ''}
          onChange={(e) => setTemplate({ ...template, description: e.target.value })}
          className="border rounded px-3 py-2 col-span-2"
          rows={3}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : 'Sauvegarder'}
      </button>
    </div>
  );
};

export default AdminTemplatePage;
