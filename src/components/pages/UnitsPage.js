import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaBalanceScale } from "react-icons/fa";

const UnitsPage = () => {
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState("");

  const fetchUnits = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:4000/unite", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnits(res.data);
    } catch (err) {
      console.error("Erreur chargement unités :", err);
    }
  };

  const addUnit = async () => {
    if (!newUnit.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:4000/unite",
        { nom: newUnit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUnit("");
      fetchUnits(); // Refresh after adding
    } catch (err) {
      console.error("Erreur ajout unité :", err);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaBalanceScale />
        Gestion des Unités
      </h2>

      {/* Form ajouter unité */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Nom de l'unité (ex: kg, litre)"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          className="border p-3 rounded w-full"
        />
        <button
          onClick={addUnit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Ajouter
        </button>
      </div>

      {/* Liste unités */}
      <div className="bg-white shadow rounded p-4">
        <ul className="divide-y divide-gray-200">
          {units.map((unit) => (
            <li key={unit.id} className="py-3">{unit.nom}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UnitsPage;
