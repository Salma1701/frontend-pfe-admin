import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import { FaShoppingCart, FaBoxOpen, FaUsers } from "react-icons/fa";
import axios from "axios";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalCommandes: 0, totalProduits: 0, totalUtilisateurs: 0 });
  const [ventesCommercial, setVentesCommercial] = useState([]);
  const [ventesCategorie, setVentesCategorie] = useState([]);
  const [ventesMois, setVentesMois] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [statsRes, commercialRes, categorieRes, moisRes] = await Promise.all([
        axios.get("http://localhost:4000/dashboard/stats", { headers }),
        axios.get("http://localhost:4000/dashboard/ventes-par-commercial", { headers }),
        axios.get("http://localhost:4000/dashboard/ventes-par-categorie", { headers }),
        axios.get("http://localhost:4000/dashboard/ventes-par-mois", { headers }),
      ]);
      setStats(statsRes.data);
      setVentesCommercial(commercialRes.data);
      setVentesCategorie(categorieRes.data);
      setVentesMois(moisRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ventesCommercialData = {
    labels: ventesCommercial.map((v) => v.commercial),
    datasets: [{
      label: "Ventes par Commercial (TND)",
      data: ventesCommercial.map((v) => v.total),
      backgroundColor: "#4F46E5",
    }],
  };

  const ventesCategorieData = {
    labels: ventesCategorie.map((v) => v.categorie),
    datasets: [{
      label: "Produits par Catégorie",
      data: ventesCategorie.map((v) => v.quantite),
      backgroundColor: ["#34D399", "#60A5FA", "#FBBF24", "#F472B6"],
    }],
  };

  const ventesMoisData = {
    labels: ventesMois.map((v) => v.mois),
    datasets: [{
      label: "Ventes par Mois (TND)",
      data: ventesMois.map((v) => v.montant),
      borderColor: "#10B981",
      backgroundColor: "#D1FAE5",
      tension: 0.4,
      fill: true,
    }],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Force de Vente</h1>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card icon={<FaShoppingCart className="text-indigo-500 text-3xl" />} title="Commandes" value={stats.totalCommandes} />
        <Card icon={<FaBoxOpen className="text-green-500 text-3xl" />} title="Produits" value={stats.totalProduits} />
        <Card icon={<FaUsers className="text-pink-500 text-3xl" />} title="Utilisateurs" value={stats.totalUtilisateurs} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Ventes par Commercial">
          <Bar data={ventesCommercialData} />
        </ChartCard>
        <ChartCard title="Produits par Catégorie">
          <Doughnut data={ventesCategorieData} />
        </ChartCard>
      </div>

      <div className="mt-10">
        <ChartCard title="Évolution des Ventes par Mois">
          <Line data={ventesMoisData} />
        </ChartCard>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center">
    <div className="mr-4">{icon}</div>
    <div>
      <h4 className="text-gray-500">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-bold mb-4 text-gray-700">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
