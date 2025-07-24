# Composants Modal Réutilisables

Ce dossier contient des composants modaux réutilisables pour standardiser l'affichage des modales dans toute l'application.

## 📁 Fichiers

- `Modal.js` - Composant modal principal avec design moderne
- `ModalButton.js` - Composants de boutons standardisés
- `README.md` - Documentation d'utilisation

## 🎨 Composant Modal

Le composant `Modal` offre un design moderne et cohérent pour toutes les modales de l'application.

### Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `isOpen` | boolean | - | État d'ouverture de la modal |
| `onClose` | function | - | Fonction appelée pour fermer la modal |
| `title` | string | - | Titre de la modal |
| `subtitle` | string | - | Sous-titre optionnel |
| `icon` | React component | - | Icône à afficher dans le header |
| `children` | React node | - | Contenu de la modal |
| `footer` | React node | - | Contenu du footer (boutons) |
| `maxWidth` | string | "max-w-lg" | Largeur maximale de la modal |
| `showCloseButton` | boolean | true | Afficher le bouton de fermeture |

### Exemple d'utilisation

```jsx
import Modal from '../Modal';
import { SecondaryButton, PrimaryButton } from '../ModalButton';
import { LuPencil } from 'react-icons/lu';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modifier l'élément"
  subtitle="Mettez à jour les informations"
  icon={LuPencil}
  maxWidth="max-w-lg"
  footer={
    <>
      <SecondaryButton onClick={() => setIsModalOpen(false)}>
        Annuler
      </SecondaryButton>
      <PrimaryButton onClick={handleSave}>
        Enregistrer
      </PrimaryButton>
    </>
  }
>
  <div className="space-y-4">
    {/* Contenu de la modal */}
  </div>
</Modal>
```

## 🔘 Composants ModalButton

### SecondaryButton
Bouton secondaire (Annuler, Fermer, etc.)

```jsx
<SecondaryButton onClick={handleCancel} disabled={false}>
  Annuler
</SecondaryButton>
```

### PrimaryButton
Bouton primaire (Enregistrer, Sauvegarder, etc.)

```jsx
<PrimaryButton onClick={handleSave} disabled={false} icon={CheckIcon}>
  Enregistrer
</PrimaryButton>
```

### DangerButton
Bouton de danger (Supprimer, etc.)

```jsx
<DangerButton onClick={handleDelete} disabled={false}>
  Supprimer
</DangerButton>
```

### SuccessButton
Bouton de succès (Confirmer, etc.)

```jsx
<SuccessButton onClick={handleConfirm} disabled={false} icon={CheckIcon}>
  Confirmer
</SuccessButton>
```

## 🎯 Avantages

### ✅ Cohérence visuelle
- Design uniforme dans toute l'application
- Header avec gradient et icône
- Footer standardisé avec boutons

### ✅ Accessibilité
- Focus management automatique
- Support clavier (Echap pour fermer)
- ARIA labels appropriés

### ✅ Responsive
- S'adapte aux écrans mobiles et desktop
- Largeurs configurables
- Scroll automatique si nécessaire

### ✅ Réutilisabilité
- Composant unique pour tous les cas d'usage
- Props flexibles pour personnalisation
- Boutons standardisés

### ✅ Maintenance
- Code centralisé
- Modifications globales faciles
- Tests simplifiés

## 🔧 Personnalisation

### Largeurs disponibles
- `max-w-sm` - Petite modal
- `max-w-md` - Modal moyenne
- `max-w-lg` - Grande modal (défaut)
- `max-w-xl` - Très grande modal
- `max-w-2xl` - Extra large modal
- `max-w-4xl` - Modal très large

### Icônes recommandées
- `LuPencil` - Modification
- `LuPlus` - Ajout
- `FaEye` - Visualisation
- `FaTrash` - Suppression
- `FaCheck` - Validation

## 📝 Bonnes pratiques

1. **Toujours utiliser le composant Modal** pour les nouvelles modales
2. **Utiliser les boutons standardisés** pour la cohérence
3. **Fournir des icônes appropriées** pour le contexte
4. **Ajouter des sous-titres** pour clarifier l'action
5. **Gérer les états de chargement** avec `disabled`
6. **Utiliser des largeurs appropriées** selon le contenu

## 🚀 Migration

Pour migrer une modal existante :

1. Remplacer la structure HTML par le composant `Modal`
2. Utiliser les boutons `ModalButton` au lieu de boutons personnalisés
3. Ajouter une icône et un sous-titre appropriés
4. Tester l'accessibilité et la responsivité 