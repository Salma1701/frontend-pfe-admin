import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  MdCalendarToday,
  MdPerson,
  MdInfoOutline,
  MdSearch,
  MdErrorOutline,
  MdFilterList,
  MdDateRange,
} from "react-icons/md";
import { FaEye, FaCalendarAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminVisitePage = () => {
  const [visites, setVisites] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterCommercial, setFilterCommercial] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [commercials, setCommercials] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Suggestions
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const [reasonSuggestions, setReasonSuggestions] = useState([]);
  const [commercialSuggestions, setCommercialSuggestions] = useState([]);

  // Fonction utilitaire pour normaliser les dates
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    // Créer une nouvelle date en utilisant les composants locaux
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

    useEffect(() => {
    const fetchVisites = async () => {
      try {
        const res = await axios.get("/visites/all");
        console.log('=== DEBUG VISITES DATA ===');
        console.log('Raw visites data:', res.data);
        res.data.forEach((visite, index) => {
          if (visite.date) {
            console.log(`Visite ${index}:`, {
              original: visite.date,
              parsed: new Date(visite.date),
              normalized: normalizeDate(visite.date),
              toLocaleDateString: new Date(visite.date).toLocaleDateString()
            });
          }
        });
        console.log('=== END DEBUG VISITES ===');
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
      } catch (error) {
        toast.error("Erreur lors du chargement des visites");
      }
    };

    fetchVisites();
  }, []);

  // Effet pour fermer le calendrier quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      const calendarElement = document.querySelector('[data-calendar]');
      const dateInputElement = document.querySelector('[data-date-input]');
      
      if (showCalendar && 
          calendarElement && 
          !calendarElement.contains(event.target) &&
          dateInputElement &&
          !dateInputElement.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const filteredVisites = visites.filter((v) => {
    const fullName = `${v.user?.prenom ?? ""} ${v.user?.nom ?? ""}`.trim();
    const clientName = v.client?.nom?.toLowerCase() ?? "";
    const reason = v.raison?.nom?.toLowerCase() ?? "";
    const matchesCommercial = filterCommercial
      ? fullName.toLowerCase().includes(filterCommercial.toLowerCase())
      : true;
    
    // Corriger la comparaison de date
    const matchesDate = filterDate
      ? (() => {
          if (!v.date || !filterDate) return false;
          const visiteDate = normalizeDate(v.date);
          const filterDateObj = new Date(filterDate);
          const normalizedFilterDate = normalizeDate(filterDateObj);
          
          // Debug logs
          if (filterDate) {
            console.log('=== DEBUG FILTER ===');
            console.log('Filter date:', filterDate);
            console.log('Visite date:', v.date);
            console.log('Normalized visite date:', visiteDate);
            console.log('Normalized filter date:', normalizedFilterDate);
            console.log('Match:', visiteDate && normalizedFilterDate && visiteDate.getTime() === normalizedFilterDate.getTime());
            console.log('=== END DEBUG FILTER ===');
          }
          
          return visiteDate && normalizedFilterDate && visiteDate.getTime() === normalizedFilterDate.getTime();
        })()
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

  // Fonctions pour le calendrier
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const hasVisitesOnDate = (date) => {
    if (!date) return false;
    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) return false;
    
    return visites.some(visite => {
      if (!visite.date) return false;
      const visiteDate = normalizeDate(visite.date);
      if (!visiteDate) return false;
      
      return visiteDate.getTime() === normalizedDate.getTime();
    });
  };

  const getVisitesForDate = (date) => {
    if (!date) return [];
    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) return [];
    
    return visites.filter(visite => {
      if (!visite.date) return false;
      const visiteDate = normalizeDate(visite.date);
      if (!visiteDate) return false;
      
      return visiteDate.getTime() === normalizedDate.getTime();
    });
  };

  const handleDateClick = (date) => {
    console.log('=== DEBUG DATE CLICK ===');
    console.log('Date clicked (original):', date);
    console.log('Date clicked (toString):', date.toString());
    console.log('Date clicked (toISOString):', date.toISOString());
    console.log('Date clicked (toLocaleDateString):', date.toLocaleDateString());
    
    if (!date) return;
    
    setSelectedCalendarDate(date);
    
    // Utiliser la fonction de formatage
    const formattedDate = formatDateForInput(date);
    console.log('Formatted date for input:', formattedDate);
    setFilterDate(formattedDate);
    setShowCalendar(false);
    
    // Afficher les visites pour cette date
    const visitesForDate = getVisitesForDate(date);
    console.log('Visites for date:', visitesForDate);
    console.log('=== END DEBUG ===');
    
    if (visitesForDate.length > 0) {
      toast.info(`${visitesForDate.length} visite(s) trouvée(s) pour cette date`);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen font-[Inter]">
      <ToastContainer />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
            <MdCalendarToday className="w-8 h-8 text-indigo-600" />
            Visites Commerciales
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`px-4 py-2 rounded-md text-base font-medium flex items-center gap-2 shadow transition-colors ${
                showCalendar 
                  ? 'bg-indigo-700 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <FaCalendarAlt /> {showCalendar ? 'Masquer' : 'Afficher'} Calendrier
            </button>
          </div>
        </div>

        {/* Filtres modernisés */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MdFilterList className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filtrer Commercial */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commercial
              </label>
              <input
                type="text"
                placeholder="Rechercher un commercial..."
                value={filterCommercial}
                onChange={(e) => setFilterCommercial(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
              />
              {filterCommercial && (
                <ul className="absolute z-10 bg-white border-2 border-indigo-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {commercialSuggestions
                    .filter((s) =>
                      s.toLowerCase().includes(filterCommercial.toLowerCase())
                    )
                    .map((s) => (
                      <li
                        key={s}
                        onClick={() => setFilterCommercial(s)}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Filtrer par date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filterDate ? new Date(filterDate).toLocaleDateString('fr-FR') : ''}
                  onClick={() => setShowCalendar(!showCalendar)}
                  readOnly
                  placeholder="Cliquez pour sélectionner une date..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400 cursor-pointer"
                  data-date-input
                />
                <MdDateRange className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                {filterDate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterDate("");
                      setSelectedCalendarDate(null);
                      setShowCalendar(false);
                      toast.info("Filtre de date réinitialisé");
                    }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors z-10"
                    title="Réinitialiser la date"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Recherche client/raison */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Client ou raison..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border-2 border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-400"
                />
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {searchTerm && (
                <ul className="absolute z-10 bg-white border-2 border-indigo-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {[...clientSuggestions, ...reasonSuggestions]
                    .filter((s) =>
                      s.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((s) => (
                      <li
                        key={s}
                        onClick={() => setSearchTerm(s)}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Calendrier */}
        {showCalendar && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative z-50" data-calendar>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaCalendarAlt className="w-5 h-5 text-indigo-600" />
                Calendrier des Visites
                {selectedCalendarDate && (
                  <span className="text-sm text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                    Sélectionné: {selectedCalendarDate.toLocaleDateString('fr-FR')}
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ←
                </button>
                <span className="font-semibold text-gray-700">
                  {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
                  {day}
                </div>
              ))}
              
              {getDaysInMonth(currentMonth).map((date, index) => (
                <div
                  key={index}
                  className={`p-2 text-center text-sm border border-gray-200 min-h-[60px] flex flex-col items-center justify-center ${
                    date ? 'cursor-pointer hover:bg-indigo-50 transition-colors' : 'bg-gray-50'
                  } ${
                    date && hasVisitesOnDate(date) ? 'bg-indigo-100 border-indigo-300' : ''
                  } ${
                    date && selectedCalendarDate && 
                    normalizeDate(date) && normalizeDate(selectedCalendarDate) &&
                    normalizeDate(date).getTime() === normalizeDate(selectedCalendarDate).getTime()
                      ? 'bg-indigo-600 text-white border-indigo-600' : ''
                  }`}
                  onClick={() => {
                    if (date) {
                      console.log('Calendar day clicked:', date);
                      handleDateClick(date);
                    }
                  }}
                  onMouseEnter={() => {
                    if (date && hasVisitesOnDate(date)) {
                      const visitesCount = getVisitesForDate(date).length;
                      console.log(`${visitesCount} visite(s) le ${date.toLocaleDateString()}`);
                    }
                  }}
                >
                  {date && (
                    <>
                      <span className="font-medium">{date.getDate()}</span>
                      {hasVisitesOnDate(date) && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1" title={`${getVisitesForDate(date).length} visite(s)`}></div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des visites */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <MdInfoOutline className="w-5 h-5 text-indigo-600" />
                Liste des Visites
                <span className="ml-auto text-sm text-gray-500">
                  {filteredVisites.length} visite(s)
                </span>
              </h3>
            </div>
            
            <div className="max-h-[600px] overflow-y-auto">
              {Object.entries(groupedVisites).map(([date, visites]) => (
                <div key={date} className="border-b border-gray-100">
                  <div className="px-6 py-3 bg-indigo-50 border-l-4 border-indigo-500">
                    <h4 className="font-semibold text-indigo-700 flex items-center gap-2">
                      <MdCalendarToday className="w-4 h-4" />
                      {date}
                    </h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {visites.map((v) => {
                      const isIncomplete = !v.user || !v.raison;
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelected(v)}
                          className={`p-4 cursor-pointer transition-colors ${
                            selected?.id === v.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 mb-1">
                                {v.client?.nom ?? "Client inconnu"}
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="flex items-center gap-1 mb-1">
                                  <MdPerson className="w-4 h-4" />
                                  {(v.user?.prenom ?? "") + " " + (v.user?.nom ?? "").trim() || "Commercial inconnu"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MdInfoOutline className="w-4 h-4" />
                                  {v.raison?.nom || "Raison inconnue"}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs text-gray-400">
                                {v.date ? new Date(v.date).toLocaleTimeString() : "Heure inconnue"}
                              </span>
                              {isIncomplete && (
                                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center gap-1">
                                  <MdErrorOutline /> Incomplète
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détail visite */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {selected ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaEye className="w-5 h-5 text-indigo-600" />
                  Détail de la Visite
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MdPerson className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-800">Client</span>
                    </div>
                    <p className="text-gray-700">{selected.client?.nom ?? "Client inconnu"}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MdPerson className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-800">Commercial</span>
                    </div>
                    <p className="text-gray-700">
                      {selected.user
                        ? `${selected.user.prenom ?? ""} ${selected.user.nom ?? ""}`.trim()
                        : "Commercial inconnu"}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MdCalendarToday className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-800">Date & Heure</span>
                    </div>
                    <p className="text-gray-700">
                      {selected.date
                        ? new Date(selected.date).toLocaleString('fr-FR')
                        : "Date inconnue"}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MdInfoOutline className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-gray-800">Raison</span>
                    </div>
                    <p className="text-gray-700">{selected.raison?.nom ?? "Raison inconnue"}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FaEye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sélectionnez une visite pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVisitePage;
