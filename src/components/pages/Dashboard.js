import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaShoppingCart, FaBoxOpen, FaUsers } from "react-icons/fa";
import axios from "axios";

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCommandes: 0,
    totalProduits: 0,
    totalUtilisateurs: 0,
  });
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
    datasets: [
      {
        label: "Ventes par Commercial (euro)",
        data: ventesCommercial.map((v) => v.total),
        backgroundColor: "#4F46E5",
      },
    ],
  };

  // Palette de couleurs pour les catégories
  const categoryColors = [
    "#3B82F6", // Bleu
    "#10B981", // Vert
    "#F59E0B", // Orange
    "#EF4444", // Rouge
    "#8B5CF6", // Violet
    "#06B6D4", // Cyan
    "#F97316", // Orange foncé
    "#84CC16", // Vert lime
    "#EC4899", // Rose
    "#6366F1", // Indigo
    "#14B8A6", // Teal
    "#F43F5E", // Rose foncé
  ];

  const ventesCategorieData = {
    labels: ventesCategorie.map((v) => v.categorie),
    datasets: [
      {
        label: "Produits par Catégorie",
        data: ventesCategorie.map((v) => v.quantite),
        backgroundColor: ventesCategorie.map((_, index) => 
          categoryColors[index % categoryColors.length]
        ),
        borderColor: ventesCategorie.map((_, index) => 
          categoryColors[index % categoryColors.length]
        ),
        borderWidth: 2,
        hoverBackgroundColor: ventesCategorie.map((_, index) => 
          categoryColors[index % categoryColors.length]
        ),
        hoverBorderColor: ventesCategorie.map((_, index) => 
          categoryColors[index % categoryColors.length]
        ),
      },
    ],
  };

  // Configuration améliorée pour les ventes par mois
  const ventesMoisData = {
    labels: ventesMois.map((v) => v.mois),
    datasets: [
      {
        label: "Ventes par Mois (euro)",
        data: ventesMois.map((v) => v.montant),
        backgroundColor: "#10B981",
        borderColor: "#047857",
        borderWidth: 1,
      },
    ],
  };

  // Options spécifiques pour le graphique à barres des ventes mensuelles
  const ventesMoisOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: Math.max(...ventesMois.map(v => v.montant)) * 1.2 || 100, // 20% de marge
        title: {
          display: true,
          text: 'Montant (euro)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {
            return value + ' euro';
          },
          stepSize: 500, // Pas de 500 euro
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mois',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Ventes: ${context.parsed.y.toFixed(2)} euro`;
          }
        }
      },
      legend: {
        display: false // Cache la légende pour ce graphique
      }
    }
  };

  return (
    <div className="space-responsive">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Dashboard Force de Vente</h1>
        <p className="text-gray-600 text-lg">Vue d'ensemble de vos performances commerciales</p>
      </div>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card 
          icon={<FaShoppingCart className="text-indigo-500 text-4xl" />} 
          title="Commandes" 
          value={stats.totalCommandes} 
        />
        <Card 
          icon={<FaBoxOpen className="text-green-500 text-4xl" />} 
          title="Produits" 
          value={stats.totalProduits} 
        />
        <Card 
          icon={<FaUsers className="text-pink-500 text-4xl" />} 
          title="Utilisateurs" 
          value={stats.totalUtilisateurs} 
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <ChartCard title="Ventes par Commercial">
          <div className="h-80">
            <Bar 
              data={ventesCommercialData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        </ChartCard>
        <ChartCard title="Produits par Catégorie">
          <div className="h-80">
            <Doughnut 
              data={ventesCategorieData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      font: {
                        size: 12,
                        weight: 'bold'
                      },
                      generateLabels: function(chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                          return data.labels.map((label, i) => {
                            const dataset = data.datasets[0];
                            const value = dataset.data[i];
                            const backgroundColor = dataset.backgroundColor[i];
                            
                            return {
                              text: `${label}: ${value}`,
                              fillStyle: backgroundColor,
                              strokeStyle: backgroundColor,
                              lineWidth: 0,
                              pointStyle: 'circle',
                              hidden: false,
                              index: i
                            };
                          });
                        }
                        return [];
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </ChartCard>
      </div>

      {/* Graphique des ventes mensuelles */}
      <div className="mb-6">
        <ChartCard title="Ventes par Mois">
          <div className="h-96">
            <Bar 
              data={ventesMoisData} 
              options={ventesMoisOptions}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex items-center hover:shadow-xl transition-shadow duration-300">
    <div className="mr-6 flex-shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <h4 className="text-lg text-gray-600 font-medium mb-1">{title}</h4>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h3 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">{title}</h3>
    <div className="relative">
      {children}
    </div>
  </div>
);

export default Dashboard;