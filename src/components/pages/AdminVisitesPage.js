import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdCalendarToday,
  MdPerson,
  MdInfoOutline,
  MdSearch,
  MdErrorOutline,
} from "react-icons/md";

const AdminVisitePage = () => {
  const [visites, setVisites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterCommercial, setFilterCommercial] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [commercials, setCommercials] = useState([]);

  // Suggestions
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [reasonSuggestions, setReasonSuggestions] = useState([]);
  const [commercialSuggestions, setCommercialSuggestions] = useState([]);

  useEffect(() => {
    const fetchVisites = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/visites/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisites(res.data);

      // Extraire commerciaux
      const allCommercials = res.data
        .filter((v) => v.user?.prenom && v.user?.nom)
        .map((v) => ({
          fullName: `${v.user.prenom} ${v.user.nom}`,
          value: v.user.id,
        }));

      const uniqueCommercials = Array.from(
        new Map(allCommercials.map((c) => [c.fullName, c])).values()
      );
      setCommercials(uniqueCommercials);
      setCommercialSuggestions(uniqueCommercials.map((c) => c.fullName));

      // Suggestions client et raison
      const clientSet = new Set(res.data.map((v) => v.client?.nom).filter(Boolean));
      const reasonSet = new Set(res.data.map((v) => v.raison?.nom).filter(Boolean));
      setClientSuggestions([...clientSet]);
      setReasonSuggestions([...reasonSet]);
    };

    fetchVisites();
  }, []);

  const filteredVisites = visites.filter((v) => {
    const fullName = `${v.user?.prenom ?? ""} ${v.user?.nom ?? ""}`.trim();
    const clientName = v.client?.nom?.toLowerCase() ?? "";
    const reason = v.raison?.nom?.toLowerCase() ?? "";
    const matchesCommercial = filterCommercial
      ? fullName.toLowerCase().includes(filterCommercial.toLowerCase())
      : true;
    const matchesDate = filterDate
      ? new Date(v.date).toISOString().slice(0, 10) === filterDate
      : true;
    const matchesSearch = searchTerm
      ? clientName.includes(searchTerm.toLowerCase()) ||
        reason.includes(searchTerm.toLowerCase())
      : true;
    return matchesCommercial && matchesDate && matchesSearch;
  });

  const groupedVisites = filteredVisites.reduce((acc, visite) => {
    const dateKey = new Date(visite.date).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(visite);
    return acc;
  }, {});

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        📋 Visites Commerciales
      </h2>

      {/* Filtres */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* Filtrer Commercial */}
        <div className="relative flex-1 min-w-[200px]">
          <label className="text-sm text-gray-600 block mb-1">
            Filtrer par commercial
          </label>
          <input
            type="text"
            placeholder="Rechercher un commercial..."
            value={filterCommercial}
            onChange={(e) => setFilterCommercial(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          />
          {filterCommercial && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
              {commercialSuggestions
                .filter((s) =>
                  s.toLowerCase().includes(filterCommercial.toLowerCase())
                )
                .map((s) => (
                  <li
                    key={s}
                    onClick={() => setFilterCommercial(s)}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {s}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Filtrer par date */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">Filtrer par date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Recherche client/raison */}
        <div className="relative flex-1">
          <label className="text-sm text-gray-600 block mb-1">
            🔍 Recherche (client ou raison)
          </label>
          <div className="flex items-center border border-gray-300 rounded">
            <MdSearch className="ml-2 text-gray-400" />
            <input
              type="text"
              placeholder="Nom du client ou raison..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 w-full outline-none"
            />
          </div>
          {searchTerm && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
              {[...clientSuggestions, ...reasonSuggestions]
                .filter((s) =>
                  s.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((s) => (
                  <li
                    key={s}
                    onClick={() => setSearchTerm(s)}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                  >
                    {s}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* Liste des visites */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/5 w-full bg-white shadow-md rounded-xl border border-gray-200 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-700 p-4 border-b">
            🗂️ Liste des Visites
          </h3>
          {Object.entries(groupedVisites).map(([date, visites]) => (
            <div key={date} className="border-b border-gray-100">
              <h4 className="text-md font-semibold text-indigo-600 bg-indigo-50 px-4 py-2">
                📅 {date}
              </h4>
              <ul className="divide-y divide-gray-100">
                {visites.map((v) => {
                  const isIncomplete = !v.user || !v.raison;
                  return (
                    <li
                      key={v.id}
                      onClick={() => setSelected(v)}
                      className="p-4 cursor-pointer hover:bg-blue-50 transition group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {v.client?.nom ?? "Client inconnu"}
                        </span>
                        <span className="text-sm text-gray-400">
                          {v.date
                            ? new Date(v.date).toLocaleTimeString()
                            : "Heure inconnue"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1 flex justify-between items-center">
                        <span>
                          {(v.raison?.nom || "Raison inconnue") +
                            " — " +
                            (
                              (v.user?.prenom ?? "") +
                              " " +
                              (v.user?.nom ?? "")
                            ).trim()}
                        </span>
                        {isIncomplete && (
                          <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded flex items-center gap-1">
                            <MdErrorOutline /> Incomplète
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Détail visite */}
        <div className="lg:w-3/5 w-full bg-white shadow-xl rounded-xl p-6 border border-gray-200">
          {selected ? (
            <>
              <h3 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
                <MdInfoOutline /> Détail de la Visite
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-semibold">👤 Client :</span>{" "}
                  {selected.client?.nom ?? "Client inconnu"}
                </p>
                <p>
                  <span className="font-semibold">👨‍💼 Commercial :</span>{" "}
                  {selected.user
                    ? `${selected.user.prenom ?? ""} ${
                        selected.user.nom ?? ""
                      }`.trim()
                    : "Commercial inconnu"}
                </p>
                <p>
                  <span className="font-semibold">🗓️ Date :</span>{" "}
                  {selected.date
                    ? new Date(selected.date).toLocaleString()
                    : "Date inconnue"}
                </p>
                <p>
                  <span className="font-semibold">📌 Raison :</span>{" "}
                  {selected.raison?.nom ?? "Raison inconnue"}
                </p>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-lg text-center pt-20">
              👉 Cliquez sur une visite pour en voir les détails.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVisitePage;
