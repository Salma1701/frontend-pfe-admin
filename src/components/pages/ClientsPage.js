import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const token = localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:4000/client", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(res.data);
    } catch (error) {
      console.error("Erreur chargement clients :", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
        <FaUsers />
        Liste des Clients
      </h2>

      <div className="bg-white rounded-lg shadow p-6">
        {clients.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun client trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Adresse</th>
                  <th className="p-3">Commercial</th> {/* 🔥 Afficher Commercial */}
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{client.nom} {client.prenom}</td>
                    <td className="p-3">{client.email}</td>
                    <td className="p-3">{client.telephone}</td>
                    <td className="p-3">{client.adresse}</td>
                    <td className="p-3">
                      {client.commercial
                        ? `${client.commercial.nom} ${client.commercial.prenom}`
                        : "Non assigné"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
