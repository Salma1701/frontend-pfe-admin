import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

// Enregistrer les composants de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // Exemples de données (tu peux remplacer par les vraies depuis ton backend)
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Avr", "Mai"],
    datasets: [
      {
        label: "Ventes (en TND)",
        data: [400, 700, 500, 650, 900],
        backgroundColor: "#3f51b5",
      },
    ],
  };

  const productStatusData = {
    labels: ["Actifs", "Inactifs"],
    datasets: [
      {
        data: [10, 5],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="mb-4 text-lg font-bold">Statistiques de ventes</h3>
          <Bar data={salesData} />
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="mb-4 text-lg font-bold">Produits actifs / inactifs</h3>
          <Doughnut data={productStatusData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
