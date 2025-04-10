import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import { FaShoppingCart, FaBoxOpen, FaUsers } from "react-icons/fa";
import axios from "axios";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({ commandes: 0, produits: 0, utilisateurs: 0 });

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:4000/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Ventes (TND)",
      data: [400, 500, 600, 700, 800, 900],
      backgroundColor: "#6366F1",
    }]
  };

  const productsData = {
    labels: ["Électronique", "Vêtements", "Accessoires"],
    datasets: [{
      data: [12, 19, 9],
      backgroundColor: ["#34D399", "#60A5FA", "#FBBF24"],
    }]
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: "Progression des ventes",
      data: [300, 400, 500, 700, 800, 1000],
      borderColor: "#10B981",
      backgroundColor: "#D1FAE5",
      tension: 0.4,
      fill: true,
    }]
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Bienvenue sur votre Dashboard</h2>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
          <FaShoppingCart className="text-indigo-500 text-3xl mr-4" />
          <div>
            <h3 className="text-gray-500">Commandes</h3>
            <p className="text-2xl font-bold">{stats.commandes}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
          <FaBoxOpen className="text-green-500 text-3xl mr-4" />
          <div>
            <h3 className="text-gray-500">Produits</h3>
            <p className="text-2xl font-bold">{stats.produits}</p>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
          <FaUsers className="text-pink-500 text-3xl mr-4" />
          <div>
            <h3 className="text-gray-500">Utilisateurs</h3>
            <p className="text-2xl font-bold">{stats.utilisateurs}</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Ventes par Commercial</h3>
          <Bar data={salesData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Produits par Catégorie</h3>
          <Doughnut data={productsData} />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Évolution des ventes</h3>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default Dashboard;
