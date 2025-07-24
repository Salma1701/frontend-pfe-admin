import React from 'react';

// Bouton secondaire (Annuler, Fermer, etc.)
export const SecondaryButton = ({ children, onClick, disabled = false, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

// Bouton primaire (Enregistrer, Sauvegarder, etc.)
export const PrimaryButton = ({ children, onClick, disabled = false, className = "", icon: Icon }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// Bouton de danger (Supprimer, etc.)
export const DangerButton = ({ children, onClick, disabled = false, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

// Bouton de succès (Confirmer, etc.)
export const SuccessButton = ({ children, onClick, disabled = false, className = "", icon: Icon }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}; 