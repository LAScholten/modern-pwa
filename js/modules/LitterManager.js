/**
 * Nest Management Module
 * Beheert toevoegen en bewerken van nesten
 */

class LitterManager {
    constructor() {
        console.log('LitterManager constructor aangeroepen');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete van ouders
        this.currentLitterDogs = []; // Houdt de ingevoerde honden van het huidige nest bij
        
        // GEBRUIK WINDOW OBJECT VOOR DEPENDENCIES
        this.db = window.hondenService;
        this.auth = window.auth;
        this.isInitialized = !!this.db && !!this.auth;
        
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuw Nest Toevoegen",
                editDog: "Nest Bewerken",
                dogLitterChoice: "Hond of Nest Toevoegen",
                addNewDog: "Nieuwe Hond",
                addNewLitter: "Nieuw Nest",
                development: "In Ontwikkeling",
                
                // Form velden
                name: "Naam",
                nameRequired: "Naam *",
                kennelName: "Kennelnaam",
                pedigreeNumber: "Stamboomnummer *",
                breed: "Ras",
                breedRequired: "Ras *",
                recent: "Recent:",
                father: "Vader *",
                mother: "Moeder *",
                coatColor: "Vachtkleur (selecteer)",
                standardCoatColors: " ",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                gender: "Geslacht",
                chooseGender: "Selecteer geslacht...",
                male: "Reu",
                female: "Teef",
                hipDysplasia: "Heupdysplasie",
                hipGrades: "Selecteer graad...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elleboogdysplasie",
                elbowGrades: "Selecteer graad...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella Luxatie",
                patellaGrades: "Selecteer graad...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Ogen",
                eyesFree: "Vrij",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Overig",
                eyesExplanation: "Verklaring overig",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Selecteer status...",
                dandyFreeDNA: "Vrij op DNA",
                dandyFreeParents: "Vrij op ouders",
                dandyCarrier: "Drager",
                dandyAffected: "Lijder",
                thyroid: "Schildklier (Tgaa)",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                addPhoto: "Foto toevoegen",
                chooseFile: "Kies bestand",
                noFileChosen: "Geen bestand gekozen",
                chosenFile: "Gekozen bestand:",
                remarks: "Opmerkingen",
                requiredFields: "Velden met * zijn verplicht",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                back: "Terug",
                
                // Validatie
                dateFormatError: "Datum moet in DD-MM-JJJJ formaat zijn",
                deathBeforeBirthError: "Overlijdensdatum kan niet voor geboortedatum zijn",
                
                // Toegangscontrole popup teksten
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om nesten te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                
                // Alerts
                adminOnly: "Alleen administrators mogen nesten toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer, ras, vader en moeder zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderen!",
                addFailed: "Fout bij toevoegen hond: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: ",
                addedDogs: "Toegevoegde honden:",
                noDogsAdded: "Nog geen honden toevoegd",
                parentNotSelected: "Selecteer een geldige hond uit de lijst voor zowel vader als moeder",

                // Container titels
                parentDetails: "Ouderdetails",
                litterDetails: "Nestdetails",
                otherDetails: "Overige details",
                
                // Health test labels
                healthHD: "HD",
                healthED: "ED",
                healthPL: "PL",
                healthEyes: "Ogen",
                healthDandy: "Dandy",
                healthThyroid: "Tgaa",
                healthCoat: "Vachtkleur",
                healthGender: "Geslacht"
            },
            en: {
                // Modal titles
                newDog: "Add New Litter",
                editDog: "Edit Litter",
                dogLitterChoice: "Add Dog or Litter",
                addNewDog: "New Dog",
                addNewLitter: "New Litter",
                development: "In Development",
                
                // Form fields
                name: "Name",
                nameRequired: "Name *",
                kennelName: "Kennel Name",
                pedigreeNumber: "Pedigree number *",
                breed: "Breed",
                breedRequired: "Breed *",
                recent: "Recent:",
                father: "Father *",
                mother: "Mother *",
                coatColor: "Coat Color (select)",
                standardCoatColors: " ",
                birthDate: "Birth date",
                deathDate: "Death date",
                gender: "Gender",
                chooseGender: "Select gender...",
                male: "Male",
                female: "Female",
                hipDysplasia: "Hip Dysplasia",
                hipGrades: "Select grade...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Elbow Dysplasia",
                elbowGrades: "Select grade...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Not known)",
                patellaLuxation: "Patella Luxation",
                patellaGrades: "Select grade...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Eyes",
                eyesFree: "Free",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Other",
                eyesExplanation: "Other explanation",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Select status...",
                dandyFreeDNA: "Free on DNA",
                dandyFreeParents: "Free on parents",
                dandyCarrier: "Carrier",
                dandyAffected: "Affected",
                thyroid: "Thyroid (Tgaa)",
                thyroidNegative: "Tgaa Negative",
                thyroidPositive: "Tgaa Positive",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                addPhoto: "Add photo",
                chooseFile: "Choose file",
                noFileChosen: "No file chosen",
                chosenFile: "Chosen file:",
                remarks: "Remarks",
                requiredFields: "Fields with * are required",
                saveDog: "Save Dog",
                cancel: "Cancel",
                delete: "Delete",
                choose: "Choose...",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                back: "Back",
                
                // Validation
                dateFormatError: "Date must be in DD-MM-YYYY format",
                deathBeforeBirthError: "Death date cannot be before birth date",
                
                // Access control popup texts
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to edit litters. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
                // Alerts
                adminOnly: "Only administrators can add/edit litters",
                fieldsRequired: "Name, pedigree number, breed, father and mother are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
                dogUpdated: "Dog successfully updated!",
                dogDeleted: "Dog successfully deleted!",
                addFailed: "Error adding dog: ",
                updateFailed: "Error updating dog: ",
                deleteFailed: "Error deleting dog: ",
                confirmDelete: "Are you sure you want to delete this dog?",
                photoAdded: "Photo added",
                photoError: "Error uploading photo: ",
                addedDogs: "Added dogs:",
                noDogsAdded: "No dogs added yet",
                parentNotSelected: "Select a valid dog from the list for both father and mother",

                // Container titles
                parentDetails: "Parent Details",
                litterDetails: "Litter Details",
                otherDetails: "Other Details",
                
                // Health test labels
                healthHD: "HD",
                healthED: "ED",
                healthPL: "PL",
                healthEyes: "Eyes",
                healthDandy: "Dandy",
                healthThyroid: "Tgaa",
                healthCoat: "Coat Color",
                healthGender: "Gender"
            },
            de: {
                // Modal Titel
                newDog: "Neuen Wurf hinzufügen",
                editDog: "Wurf bearbeiten",
                dogLitterChoice: "Hund oder Wurf hinzufügen",
                addNewDog: "Neuer Hund",
                addNewLitter: "Neuer Wurf",
                development: "In Entwicklung",
                
                // Formular Felder
                name: "Name",
                nameRequired: "Name *",
                kennelName: "Kennelname",
                pedigreeNumber: "Stammbaum-Nummer *",
                breed: "Rasse",
                breedRequired: "Rasse *",
                recent: "Kürzlich:",
                father: "Vater *",
                mother: "Mutter *",
                coatColor: "Fellfarbe (auswählen)",
                standardCoatColors: " ",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                gender: "Geschlecht",
                chooseGender: "Geschlecht wählen...",
                male: "Rüde",
                female: "Hündin",
                hipDysplasia: "Hüftdysplasie",
                hipGrades: "Grad wählen...",
                hipA: "A",
                hipB: "B",
                hipC: "C",
                hipD: "D",
                hipE: "E",
                elbowDysplasia: "Ellbogendysplasie",
                elbowGrades: "Grad wählen...",
                elbow0: "0",
                elbow1: "1",
                elbow2: "2",
                elbow3: "3",
                elbowNB: "NB (Niet bekend)",
                patellaLuxation: "Patella Luxation",
                patellaGrades: "Grad wählen...",
                patella0: "0",
                patella1: "1",
                patella2: "2",
                patella3: "3",
                eyes: "Augen",
                eyesFree: "Frei",
                eyesDistichiasis: "Distichiasis",
                eyesOther: "Andere",
                eyesExplanation: "Erklärung andere",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Status wählen...",
                dandyFreeDNA: "Frei op DNA",
                dandyFreeParents: "Frei op ouders",
                dandyCarrier: "Träger",
                dandyAffected: "Betroffen",
                thyroid: "Schilddrüse (Tgaa)",
                thyroidNegative: "Tgaa Negativ",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                addPhoto: "Foto hinzufügen",
                chooseFile: "Datei wählen",
                noFileChosen: "Keine Datei gewählt",
                chosenFile: "Gewählte Datei:",
                remarks: "Bemerkungen",
                requiredFields: "Felder met * sind Pflichtfelder",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                back: "Zurück",
                
                // Validierung
                dateFormatError: "Datum moet im Format TT-MM-JJJJ sein",
                deathBeforeBirthError: "Sterbedatum kan nicht vor dem Geburtsdatum liegen",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Würfe zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Würfe hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer, Rasse, Vater en Mutter sind Pflichtfelder",
                savingDog: "Hund wordt gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualisiert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: ",
                addedDogs: "Hinzugefügte Hunden:",
                noDogsAdded: "Noch keine Hunde hinzugefügt",
                parentNotSelected: "Wählen Sie einen gültigen Hund aus der Liste für sowohl Vater als auch Mutter",

                // Container Titel
                parentDetails: "Elterndetails",
                litterDetails: "Wurfdetails",
                otherDetails: "Weitere Details",
                
                // Health test labels
                healthHD: "HD",
                healthED: "ED",
                healthPL: "PL",
                healthEyes: "Augen",
                healthDandy: "Dandy",
                healthThyroid: "Tgaa",
                healthCoat: "Fellfarbe",
                healthGender: "Geschlecht"
            }
        };
        
        // Definieer de standaard vachtkleuren per taal
        this.standardCoatColors = {
            nl: ["Blond", "Blondgrijs", "Grijsblond", "Blondrood", "Roodblond", "Rood", "Roodgrijs", "Wolfsgrau", "Wildkleur", "Zwart", "Zwart met aftekeningen", "Wit", "Piebold"],
            en: ["Blond", "Blondgray", "Grayblond", "Blondred", "Redblond", "Red", "Redgray", "Wolfgray", "Wildcolor", "Black", "Black with markings", "White", "Piebold"],
            de: ["Falben", "Falbengrau", "Graufalben", "Falbenrot", "Rotfalben", "Rot", "Rotgrau", "Wolfsgrau", "Wildfarbe", "Schwarz", "Schwarz mit Abzeichen", "Weiß", "Piebold"]
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    /**
     * Injecteer database en auth objecten (fallback voor backward compatibility)
     */
    injectDependencies(db, auth) {
        console.log('LitterManager: injectDependencies aangroepen');
        // Gebruik window object als primaire bron, anders de geïnjecteerde dependencies
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
        this.isInitialized = true;
        console.log('LitterManager: Dependencies geïnjecteerd - db:', !!this.db, 'auth:', !!this.auth);
    }
    
    /**
     * Haal de volledige modal HTML op voor nest toevoegen/bewerken
     * Dit is de methode die DogManager gebruikt om de modal te tonen
     */
    getModalHTML(isEdit = false, litterData = null) {
        console.log('LitterManager: getModalHTML aangeroepen');
        
        // Als gebruiker admin is, toon het nest formulier
        const t = this.t.bind(this);
        const modalTitle = isEdit ? t('editDog') : t('newDog');
        const modalId = 'addLitterModal';
        
        return `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="${modalId}Label">
                                <i class="bi bi-plus-circle"></i> ${modalTitle}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            ${this.getFormHTML(litterData)}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="close">${this.t('close')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                /* Mobiele optimalisaties */
                @media (max-width: 768px) {
                    .modal-dialog {
                        margin: 10px;
                        max-height: 90vh;
                    }
                    
                    .modal-content {
                        max-height: 90vh;
                        overflow-y: auto;
                    }
                    
                    .modal-body {
                        padding: 15px;
                        max-height: calc(90vh - 130px);
                        overflow-y: auto;
                    }
                    
                    .breed-container {
                        gap: 8px !important;
                    }
                    
                    .breed-input-container {
                        flex: 0 0 180px !important;
                        min-width: 180px !important;
                    }
                    
                    .recent-breeds-label {
                        font-size: 0.8em !important;
                    }
                    
                    .recent-breed-btn {
                        font-size: 0.75em !important;
                        padding: 3px 6px !important;
                    }
                    
                    /* Vachtkleur container voor mobiel */
                    .coat-color-container {
                        gap: 8px !important;
                    }
                    
                    .coat-color-input-container {
                        flex: 0 0 180px !important;
                        min-width: 180px !important;
                    }
                    
                    .standard-coat-colors-label {
                        font-size: 0.8em !important;
                    }
                    
                    .standard-coat-color-btn {
                        font-size: 0.5em !important; /* 80% van normaal */
                        padding: 3px 6px !important;
                    }
                    
                    /* Geboortedatum input styling voor mobiel */
                    .date-input-wrapper {
                        position: relative;
                    }
                    
                    .date-input-wrapper input[type="text"] {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;
                    }
                    
                    .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator,
                    .date-input-wrapper input[type="date"]::-webkit-inner-spin-button,
                    .date-input-wrapper input[type="date"]::-webkit-clear-button {
                        display: none;
                        -webkit-appearance: none;
                        appearance: none;
                    }
                    
                    .date-input-wrapper input[type="date"] {
                        -webkit-appearance: textfield;
                        -moz-appearance: textfield;
                        appearance: textfield;
                    }
                    
                    /* Container styling voor mobiel */
                    .form-container {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 15px !important;
                        margin-bottom: 15px;
                    }
                    
                    .container-title {
                        font-size: 0.9em;
                        margin-bottom: 8px;
                    }
                    
                    /* Added dogs container styling voor mobiel */
                    #added-dogs-container {
                        padding: 10px !important;
                    }
                    
                    .dog-item {
                        font-size: 0.9em;
                        padding: 8px 0;
                    }
                    
                    .dog-item-header {
                        font-size: 0.85em;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    
                    .dog-item-health {
                        font-size: 0.8em;
                        margin-top: 5px;
                    }
                    
                    .health-badge {
                        font-size: 0.75em !important;
                        padding: 2px 6px !important;
                        margin-right: 4px;
                        margin-bottom: 4px;
                    }
                    
                    /* Mobiele layout voor opslaan knoppen */
                    .save-buttons-container {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .save-buttons-container .btn {
                        width: 100%;
                    }
                }
                
                /* Desktop styling */
                @media (min-width: 769px) {
                    .form-container {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 20px !important;
                        margin-bottom: 20px;
                        background-color: #f9f9f9;
                    }
                    
                    .container-title {
                        font-weight: 600;
                        color: #495057;
                        margin-bottom: 15px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #dee2e6;
                        font-size: 1.1em;
                    }
                    
                    /* Desktop layout voor ouderdetails container */
                    #ouders-container .row > div {
                        margin-bottom: 10px;
                    }
                    
                    #ouders-container .row {
                        align-items: center;
                    }
                    
                    /* Added dogs container styling voor desktop */
                    #added-dogs-container {
                        padding: 15px !important;
                    }
                    
                    .dog-item {
                        font-size: 1em;
                        padding: 10px 0;
                    }
                    
                    .dog-item-header {
                        font-size: 0.95em;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }
                    
                    .dog-item-health {
                        font-size: 0.85em;
                        margin-top: 8px;
                    }
                    
                    .health-badge {
                        font-size: 0.8em;
                        padding: 4px 8px;
                        margin-right: 5px;
                        margin-bottom: 5px;
                    }
                    
                    /* Desktop layout voor opslaan knoppen */
                    .save-buttons-container {
                        flex-direction: row;
                        justify-content: flex-end;
                        gap: 10px;
                    }
                    
                    .save-buttons-container .btn {
                        width: auto;
                    }
                }
                
                /* Algemene styling voor containers */
                .form-container {
                    transition: all 0.3s ease;
                }
                
                .form-container:hover {
                    border-color: #b3d7ff;
                    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
                }
                
                .container-title {
                    display: flex;
                    align-items: center;
                }
                
                .container-title i {
                    margin-right: 8px;
                    font-size: 1.2em;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                /* Breed container voor onder het invulveld */
                .breed-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .breed-input-container {
                    width: 100%;
                }
                
                .recent-breeds-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .recent-breeds-label {
                    font-size: 0.875em;
                    color: #6c757d;
                    white-space: nowrap;
                    margin-bottom: 0;
                }
                
                .recent-breeds-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
                
                .recent-breed-btn {
                    white-space: nowrap;
                    font-size: 0.8em;
                    padding: 4px 8px;
                }
                
                /* Vachtkleur container voor onder het invulveld (zelfde stijl als ras) */
                .coat-color-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .coat-color-input-container {
                    width: 100%;
                }
                
                .standard-coat-colors-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .standard-coat-colors-label {
                    font-size: 0.875em;
                    color: #6c757d;
                    white-space: nowrap;
                    margin-bottom: 0;
                }
                
                .standard-coat-colors-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
                
                .standard-coat-color-btn {
                    white-space: nowrap;
                    font-size: 0.7em; /* 80% van normaal */
                    padding: 4px 8px;
                }
                
                /* Opslaan knoppen container */
                .save-buttons-container {
                    display: flex;
                    margin-top: 20px;
                }
                
                /* Datum input styling */
                .date-input-wrapper {
                    position: relative;
                }
                
                .date-input-wrapper .form-control {
                    padding-right: 12px;
                }
                
                /* Verberg kalender picker voor alle apparaten */
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-clear-button {
                    display: none;
                    -webkit-appearance: none;
                    appearance: none;
                }
                
                input[type="date"] {
                    -webkit-appearance: textfield;
                    -moz-appearance: textfield;
                    appearance: textfield;
                }
                
                /* Placeholder styling voor datum velden */
                input[type="date"]::placeholder {
                    color: #6c757d;
                    opacity: 0.7;
                }
                
                /* Added dogs container */
                #added-dogs-container {
                    background-color: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                
                .added-dogs-title {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 10px;
                    font-size: 1em;
                }
                
                .dog-item {
                    border-bottom: 1px solid #e9ecef;
                    padding: 12px 0;
                }
                
                .dog-item:last-child {
                    border-bottom: none;
                }
                
                .dog-item-header {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 10px;
                }
                
                .dog-item-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .dog-item-pedigree {
                    color: #7f8c8d;
                    font-size: 0.9em;
                    background-color: #ecf0f1;
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                
                .dog-item-health {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                
                .health-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 0.85em;
                    font-weight: 500;
                }
                
                .health-badge.hd { background-color: #e8f4fd; color: #2980b9; border: 1px solid #3498db; }
                .health-badge.ed { background-color: #e8f8f5; color: #27ae60; border: 1px solid #2ecc71; }
                .health-badge.pl { background-color: #fff3e0; color: #f39c12; border: 1px solid #f39c12; }
                .health-badge.eyes { background-color: #f4ecf7; color: #8e44ad; border: 1px solid #9b59b6; }
                .health-badge.dandy { background-color: #fef9e7; color: #d68910; border: 1px solid #f1c40f; }
                .health-badge.thyroid { background-color: #fbeee6; color: #e74c3c; border: 1px solid #e74c3c; }
                .health-badge.coat { background-color: #e8f6f3; color: #16a085; border: 1px solid #1abc9c; }
                .health-badge.gender { background-color: #f4ecf7; color: #8e44ad; border: 1px solid #9b59b6; }
                
                .health-badge-label {
                    font-weight: 600;
                    margin-right: 4px;
                }
                
                #no-dogs-message {
                    color: #6c757d;
                    font-style: italic;
                    text-align: center;
                    padding: 10px 0;
                }
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Bestand gekozen styling */
                .file-chosen-info {
                    color: #28a745;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Parent validation styling */
                .parent-validation-error {
                    border-color: #dc3545 !important;
                }
            </style>
        `;
    }
    
    /**
     * Haal alleen het formulier HTML op (zonder modal wrapper)
     * Dit wordt gebruikt door DogManager in het keuzescherm
     */
    getFormHTML(litterData = null) {
        console.log('LitterManager: getFormHTML aangeroepen');
        
        const t = this.t.bind(this);
        const data = litterData || {};
        
        // Formatteer datums voor weergave (YYYY-MM-DD naar DD-MM-YYYY)
        const formatDateForDisplay = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // YYYY-MM-DD voor date input
            } catch (e) {
                return dateString;
            }
        };
        
        const birthDateValue = formatDateForDisplay(data.geboortedatum);
        const deathDateValue = formatDateForDisplay(data.overlijdensdatum);
        
        // Genereer recente rassen knoppen (onder het invulveld)
        let recentBreedsHTML = '';
        if (this.lastBreeds && this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="recent-breeds-container">
                    <div class="recent-breeds-label">${t('recent')}</div>
                    <div class="recent-breeds-buttons">
            `;
            this.lastBreeds.forEach(breed => {
                recentBreedsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                        ${breed}
                    </button>
                `;
            });
            recentBreedsHTML += `
                    </div>
                </div>
            `;
        }
        
        // Genereer standaard vachtkleur knoppen voor huidige taal
        let standardCoatColorsHTML = '';
        const currentColors = this.standardCoatColors[this.currentLang] || this.standardCoatColors.nl;
        
        if (currentColors && currentColors.length > 0) {
            standardCoatColorsHTML = `
                <div class="standard-coat-colors-container">
                    <div class="standard-coat-colors-label">${t('standardCoatColors')}</div>
                    <div class="standard-coat-colors-buttons">
            `;
            currentColors.forEach(color => {
                standardCoatColorsHTML += `
                    <button type="button" class="btn btn-sm btn-outline-info standard-coat-color-btn" data-coat-color="${color}">
                        ${color}
                    </button>
                `;
            });
            standardCoatColorsHTML += `
                    </div>
                </div>
            `;
        }
        
        return `
            <form id="litterForm">
                <!-- BELANGRIJK: Gebruik EXACT dezelfde veldnamen als DogManager -->
                <input type="hidden" id="vader_id" value="${data.vader_id || ''}">
                <input type="hidden" id="moeder_id" value="${data.moeder_id || ''}">
                
                <!-- CONTAINER 0: TOEGEVOEGDE HONDEN -->
                <div class="form-container" id="added-dogs-container">
                    <div class="container-title">
                        <i class="bi bi-list-check"></i> ${t('addedDogs')}
                    </div>
                    <div id="added-dogs-list">
                        <div id="no-dogs-message">${t('noDogsAdded')}</div>
                    </div>
                </div>
                
                <!-- CONTAINER 1: OUDERDETAILS -->
                <div class="form-container" id="ouders-container">
                    <div class="container-title">
                        <i class="bi bi-people"></i> ${t('parentDetails')}
                    </div>
                    
                    <!-- RIJ 1: Vader en Moeder (NU VERPLICHT) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="father" class="form-label">${t('father')}</label>
                                <input type="text" class="form-control" id="father" 
                                       value="${data.vader || ''}" 
                                       placeholder="Begin met typen om te zoeken..."
                                       data-parent-type="father"
                                       autocomplete="off"
                                       data-valid-parent="false"
                                       required>
                                <div id="fatherError" class="error-message" style="display: none;"></div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3 parent-input-wrapper">
                                <label for="mother" class="form-label">${t('mother')}</label>
                                <input type="text" class="form-control" id="mother" 
                                       value="${data.moeder || ''}" 
                                       placeholder="Begin met typen om te zoeken..."
                                       data-parent-type="mother"
                                       autocomplete="off"
                                       data-valid-parent="false"
                                       required>
                                <div id="motherError" class="error-message" style="display: none;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- RIJ 2: Kennelnaam en Ras -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="kennelName" class="form-label">${t('kennelName')}</label>
                                <input type="text" class="form-control" id="kennelName" value="${data.kennelnaam || ''}">
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <div class="mb-3">
                                <label for="breed" class="form-label">${t('breedRequired')}</label>
                                <div class="breed-container">
                                    <div class="breed-input-container">
                                        <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                                    </div>
                                    ${recentBreedsHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- RIJ 3: Geboortedatum -->
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3 date-input-wrapper">
                                <label for="birthDate" class="form-label">${t('birthDate')}</label>
                                <input type="date" class="form-control" id="birthDate" 
                                       value="${birthDateValue}"
                                       placeholder="DD-MM-JJJJ"
                                       data-original-value="${birthDateValue}">
                                <div id="birthDateError" class="error-message" style="display: none;"></div>
                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- CONTAINER 2: NESTDETAILS -->
                <div class="form-container" id="nest-container">
                    <div class="container-title">
                        <i class="bi bi-house"></i> ${t('litterDetails')}
                    </div>
                    
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="name" class="form-label">${t('nameRequired')}</label>
                                <input type="text" class="form-control" id="name" value="${data.naam || ''}" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                                <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="gender" class="form-label">${t('gender')}</label>
                                <select class="form-select" id="gender">
                                    <option value="">${t('chooseGender')}</option>
                                    <option value="reuen" ${data.geslacht === 'reuen' ? 'selected' : ''}>${t('male')}</option>
                                    <option value="teven" ${data.geslacht === 'teven' ? 'selected' : ''}>${t('female')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Vachtkleur veld met standaard vachtkleuren -->
                    <div class="row">
                        <div class="col-12 col-md-6">
                            <div class="mb-3">
                                <label for="coatColor" class="form-label">${t('coatColor')}</label>
                                <div class="coat-color-container">
                                    <div class="coat-color-input-container">
                                        <input type="text" class="form-control" id="coatColor" value="${data.vachtkleur || ''}" readonly>
                                    </div>
                                    ${standardCoatColorsHTML}
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-6">
                            <!-- Tweede opslaan knop naast vachtkleur op desktop, onder op mobiel -->
                            <div class="mb-3 d-none d-md-block">
                                <label class="form-label d-block" style="visibility: hidden;">${t('saveDog')}</label>
                                <button type="button" class="btn btn-primary w-100" id="saveDogBtn2">
                                    ${t('saveDog')}
                                </button>
                            </div>
                            <div class="mb-3 d-md-none">
                                <button type="button" class="btn btn-primary w-100" id="saveDogBtn2Mobile">
                                    ${t('saveDog')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- CONTAINER 3: OVERIGE DETAILS -->
                <div class="form-container" id="details-container">
                    <div class="container-title">
                        <i class="bi bi-card-checklist"></i> ${t('otherDetails')}
                    </div>
                    
                    <!-- Land en Postcode (NU als eerste bovenaan) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="country" class="form-label">${t('country')}</label>
                                <input type="text" class="form-control" id="country" value="${data.land || ''}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="zipCode" class="form-label">${t('zipCode')}</label>
                                <input type="text" class="form-control" id="zipCode" value="${data.postcode || ''}">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Gezondheid: Heupdysplasie, Elleboogdysplasie, Patella Luxatie -->
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="hipDysplasia" class="form-label">${t('hipDysplasia')}</label>
                                <select class="form-select" id="hipDysplasia">
                                    <option value="">${t('hipGrades')}</option>
                                    <option value="A" ${data.heupdysplasie === 'A' ? 'selected' : ''}>${t('hipA')}</option>
                                    <option value="B" ${data.heupdysplasie === 'B' ? 'selected' : ''}>${t('hipB')}</option>
                                    <option value="C" ${data.heupdysplasie === 'C' ? 'selected' : ''}>${t('hipC')}</option>
                                    <option value="D" ${data.heupdysplasie === 'D' ? 'selected' : ''}>${t('hipD')}</option>
                                    <option value="E" ${data.heupdysplasie === 'E' ? 'selected' : ''}>${t('hipE')}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="elbowDysplasia" class="form-label">${t('elbowDysplasia')}</label>
                                <select class="form-select" id="elbowDysplasia">
                                    <option value="">${t('elbowGrades')}</option>
                                    <option value="0" ${data.elleboogdysplasie === '0' ? 'selected' : ''}>${t('elbow0')}</option>
                                    <option value="1" ${data.elleboogdysplasie === '1' ? 'selected' : ''}>${t('elbow1')}</option>
                                    <option value="2" ${data.elleboogdysplasie === '2' ? 'selected' : ''}>${t('elbow2')}</option>
                                    <option value="3" ${data.elleboogdysplasie === '3' ? 'selected' : ''}>${t('elbow3')}</option>
                                    <option value="NB" ${data.elleboogdysplasie === 'NB' ? 'selected' : ''}>${t('elbowNB')}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="patellaLuxation" class="form-label">${t('patellaLuxation')}</label>
                                <select class="form-select" id="patellaLuxation">
                                    <option value="">${t('patellaGrades')}</option>
                                    <option value="0" ${data.patella === '0' ? 'selected' : ''}>${t('patella0')}</option>
                                    <option value="1" ${data.patella === '1' ? 'selected' : ''}>${t('patella1')}</option>
                                    <option value="2" ${data.patella === '2' ? 'selected' : ''}>${t('patella2')}</option>
                                    <option value="3" ${data.patella === '3' ? 'selected' : ''}>${t('patella3')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ogen en Dandy Walker -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="eyes" class="form-label">${t('eyes')}</label>
                                <select class="form-select" id="eyes">
                                    <option value="">${t('choose')}</option>
                                    <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>${t('eyesFree')}</option>
                                    <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>${t('eyesDistichiasis')}</option>
                                    <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>${t('eyesOther')}</option>
                                </select>
                            </div>
                            <div class="mb-3" id="eyesExplanationContainer" style="${data.ogen === 'Overig' ? '' : 'display: none;'}">
                                <label for="eyesExplanation" class="form-label">${t('eyesExplanation')}</label>
                                <input type="text" class="form-control" id="eyesExplanation" value="${data.ogenverklaring || ''}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="dandyWalker" class="form-label">${t('dandyWalker')}</label>
                                <select class="form-select" id="dandyWalker">
                                    <option value="">${t('dandyOptions')}</option>
                                    <option value="Vrij op DNA" ${data.dandyWalker === 'Vrij op DNA' ? 'selected' : ''}>${t('dandyFreeDNA')}</option>
                                    <option value="Vrij op ouders" ${data.dandyWalker === 'Vrij op ouders' ? 'selected' : ''}>${t('dandyFreeParents')}</option>
                                    <option value="Drager" ${data.dandyWalker === 'Drager' ? 'selected' : ''}>${t('dandyCarrier')}</option>
                                    <option value="Lijder" ${data.dandyWalker === 'Lijder' ? 'selected' : ''}>${t('dandyAffected')}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Schildklier en Overlijdensdatum (naast elkaar op desktop) -->
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="thyroid" class="form-label">${t('thyroid')}</label>
                                <select class="form-select" id="thyroid">
                                    <option value="">${t('choose')}</option>
                                    <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>${t('thyroidNegative')}</option>
                                    <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>${t('thyroidPositive')}</option>
                                </select>
                            </div>
                            <!-- AANGEPAST: Toelichting vak altijd zichtbaar -->
                            <div class="mb-3" id="thyroidExplanationContainer">
                                <label for="thyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                                <input type="text" class="form-control" id="thyroidExplanation" value="${data.schildklierverklaring || ''}">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3 date-input-wrapper">
                                <label for="deathDate" class="form-label">${t('deathDate')}</label>
                                <input type="date" class="form-control" id="deathDate" 
                                       value="${deathDateValue}"
                                       placeholder="DD-MM-JJJJ"
                                       data-original-value="${deathDateValue}">
                                <div id="deathDateError" class="error-message" style="display: none;"></div>
                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Foto uploaden -->
                    <div class="mb-3">
                        <label for="photo" class="form-label">${t('addPhoto')}</label>
                        <div class="input-group">
                            <input type="file" class="form-control" id="photo" accept="image/*">
                            <label class="input-group-text" for="photo">${t('chooseFile')}</label>
                        </div>
                        <div id="fileInfo" class="form-text">${t('noFileChosen')}</div>
                    </div>
                    
                    <!-- Opmerkingen -->
                    <div class="mb-3">
                        <label for="remarks" class="form-label">${t('remarks')}</label>
                        <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                    </div>
                </div>
                
                <!-- Verplichte velden info -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <!-- Opslaan knop onderaan -->
                <div class="save-buttons-container">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
            
            <style>
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Bestand gekozen styling */
                .file-chosen-info {
                    color: #28a745;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Parent validation styling */
                .parent-validation-error {
                    border-color: #dc3545 !important;
                }
            </style>
        `;
    }
    
    /**
     * Setup events voor wanneer de modal wordt getoond
     * Deze methode wordt aangeroepen door DogManager wanneer het nest formulier wordt geladen
     */
    setupEvents() {
        console.log('LitterManager: setupEvents aangeroepen');
        
        // Reset de lijst met ingevoerde honden wanneer modal wordt geopend
        this.currentLitterDogs = [];
        this.updateAddedDogsList();
        
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Event listeners voor alle drie opslaan knoppen
        const saveBtn = document.getElementById('saveDogBtn');
        const saveBtn2 = document.getElementById('saveDogBtn2');
        const saveBtn2Mobile = document.getElementById('saveDogBtn2Mobile');
        
        const saveHandler = () => {
            console.log('LitterManager: Save button geklikt');
            this.saveDog();
        };
        
        if (saveBtn) {
            console.log('LitterManager: Save button 1 gevonden');
            saveBtn.addEventListener('click', saveHandler);
        } else {
            console.error('LitterManager: Save button 1 niet gevonden!');
        }
        
        if (saveBtn2) {
            console.log('LitterManager: Save button 2 (desktop) gevonden');
            saveBtn2.addEventListener('click', saveHandler);
        } else {
            console.error('LitterManager: Save button 2 (desktop) niet gevonden!');
        }
        
        if (saveBtn2Mobile) {
            console.log('LitterManager: Save button 2 (mobile) gevonden');
            saveBtn2Mobile.addEventListener('click', saveHandler);
        } else {
            console.error('LitterManager: Save button 2 (mobile) niet gevonden!');
        }
        
        // Eyes dropdown handler
        const eyesSelect = document.getElementById('eyes');
        if (eyesSelect) {
            eyesSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('eyesExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Overig' ? 'block' : 'none';
                }
            });
        } else {
            console.log('LitterManager: Eyes select niet gevonden');
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    // AANGEPAST: Verwijder de conditionele logica zodat het vak altijd zichtbaar blijft
                    explanationContainer.style.display = 'block'; // Altijd tonen
                }
            });
        } else {
            console.log('LitterManager: Thyroid select niet gevonden');
        }
        
        // Recente rassen knoppen - Delegatie gebruiken
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                    console.log('LitterManager: Ras geselecteerd:', breed);
                }
            }
            
            // Standaard vachtkleur knoppen - Delegatie gebruiken
            if (e.target.classList.contains('standard-coat-color-btn')) {
                const coatColor = e.target.dataset.coatColor;
                const coatColorInput = document.getElementById('coatColor');
                if (coatColorInput) {
                    coatColorInput.value = coatColor;
                    console.log('LitterManager: Vachtkleur geselecteerd:', coatColor);
                }
            }
        });
        
        // Setup autocomplete voor ouders - zoals in DogManager
        this.setupParentAutocomplete();
        
        // Setup datum velden voor correcte verwerking
        this.setupDateFields();
        
        // Setup datum validatie
        this.setupDateValidation();
        
        // Setup file upload feedback
        this.setupFileUploadFeedback();
        
        console.log('LitterManager: Alle events ingesteld');
    }
    
    /**
     * Setup bestandsfeedback - toont gekozen bestandsnaam
     */
    setupFileUploadFeedback() {
        const photoInput = document.getElementById('photo');
        const fileInfo = document.getElementById('fileInfo');
        
        if (photoInput && fileInfo) {
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    fileInfo.innerHTML = `<span class="file-chosen-info"><i class="bi bi-check-circle"></i> ${this.t('chosenFile')} <strong>${file.name}</strong></span>`;
                    console.log('LitterManager: Bestand gekozen:', file.name);
                } else {
                    fileInfo.textContent = this.t('noFileChosen');
                }
            });
        }
    }
    
    /**
     * Update de lijst met toegevoegde honden in de UI
     */
    updateAddedDogsList() {
        const addedDogsList = document.getElementById('added-dogs-list');
        const noDogsMessage = document.getElementById('no-dogs-message');
        
        if (!addedDogsList) return;
        
        if (this.currentLitterDogs.length === 0) {
            if (!noDogsMessage) {
                addedDogsList.innerHTML = `<div id="no-dogs-message">${this.t('noDogsAdded')}</div>`;
            }
            return;
        }
        
        // Verwijder het "geen honden" bericht als het er is
        if (noDogsMessage) {
            noDogsMessage.remove();
        }
        
        let html = '';
        this.currentLitterDogs.forEach((dog, index) => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                              dog.geslacht === 'teven' ? this.t('female') : '';
            
            // Genereer gezondheidsbadges
            const healthBadges = [];
            
            if (dog.heupdysplasie) {
                healthBadges.push(`<span class="health-badge hd"><span class="health-badge-label">${this.t('healthHD')}:</span>${dog.heupdysplasie}</span>`);
            }
            if (dog.elleboogdysplasie) {
                healthBadges.push(`<span class="health-badge ed"><span class="health-badge-label">${this.t('healthED')}:</span>${dog.elleboogdysplasie}</span>`);
            }
            if (dog.patella) {
                healthBadges.push(`<span class="health-badge pl"><span class="health-badge-label">${this.t('healthPL')}:</span>${dog.patella}</span>`);
            }
            if (dog.ogen) {
                healthBadges.push(`<span class="health-badge eyes"><span class="health-badge-label">${this.t('healthEyes')}:</span>${dog.ogen}</span>`);
            }
            if (dog.dandyWalker) {
                healthBadges.push(`<span class="health-badge dandy"><span class="health-badge-label">${this.t('healthDandy')}:</span>${dog.dandyWalker}</span>`);
            }
            if (dog.schildklier) {
                healthBadges.push(`<span class="health-badge thyroid"><span class="health-badge-label">${this.t('healthThyroid')}:</span>${dog.schildklier}</span>`);
            }
            if (dog.vachtkleur) {
                healthBadges.push(`<span class="health-badge coat"><span class="health-badge-label">${this.t('healthCoat')}:</span>${dog.vachtkleur}</span>`);
            }
            if (genderText) {
                healthBadges.push(`<span class="health-badge gender"><span class="health-badge-label">${this.t('healthGender')}:</span>${genderText}</span>`);
            }
            
            html += `
                <div class="dog-item">
                    <div class="dog-item-header">
                        <span class="dog-item-name">${dog.naam}</span>
                        <span class="dog-item-pedigree">${dog.stamboomnr}</span>
                    </div>
                    ${healthBadges.length > 0 ? `
                        <div class="dog-item-health">
                            ${healthBadges.join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        addedDogsList.innerHTML = html;
    }
    
    /**
     * Setup datum velden voor correcte verwerking
     */
    setupDateFields() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        // Vereenvoudigde datum velden - gebruik gewoon date input
        if (birthDateInput) {
            // Reset type naar date voor correcte browser support
            birthDateInput.type = 'date';
            
            // Voor weergave: show placeholder when empty
            birthDateInput.addEventListener('focus', function() {
                if (!this.value) {
                    this.placeholder = 'dd-mm-jjjj';
                }
            });
            
            birthDateInput.addEventListener('blur', function() {
                this.placeholder = '';
            });
        }
        
        if (deathDateInput) {
            // Reset type naar date voor correcte browser support
            deathDateInput.type = 'date';
            
            deathDateInput.addEventListener('focus', function() {
                if (!this.value) {
                    this.placeholder = 'dd-mm-jjjj';
                }
            });
            
            deathDateInput.addEventListener('blur', function() {
                this.placeholder = '';
            });
        }
    }
    
    /**
     * Setup datum validatie
     */
    setupDateValidation() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        if (birthDateInput) {
            birthDateInput.addEventListener('blur', () => {
                this.validateDates();
            });
        }
        
        if (deathDateInput) {
            deathDateInput.addEventListener('blur', () => {
                this.validateDates();
            });
        }
    }
    
    /**
     * Valideer datums
     */
    validateDates() {
        const t = this.t.bind(this);
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        const birthDateError = document.getElementById('birthDateError');
        const deathDateError = document.getElementById('deathDateError');
        
        if (!birthDateInput || !deathDateInput) return;
        
        let isValid = true;
        
        // Reset error styling
        birthDateInput.classList.remove('date-error');
        deathDateInput.classList.remove('date-error');
        if (birthDateError) birthDateError.style.display = 'none';
        if (deathDateError) deathDateError.style.display = 'none';
        
        const birthValue = birthDateInput.value;
        const deathValue = deathDateInput.value;
        
        // Valideer geboortedatum formaat (alleen als ingevuld)
        if (birthValue) {
            const birthDate = new Date(birthValue);
            if (isNaN(birthDate.getTime())) {
                birthDateInput.classList.add('date-error');
                if (birthDateError) {
                    birthDateError.textContent = t('dateFormatError');
                    birthDateError.style.display = 'block';
                }
                isValid = false;
            }
        }
        
        // Valideer overlijdensdatum formaat (alleen als ingevuld)
        if (deathValue) {
            const deathDate = new Date(deathValue);
            if (isNaN(deathDate.getTime())) {
                deathDateInput.classList.add('date-error');
                if (deathDateError) {
                    deathDateError.textContent = t('dateFormatError');
                    deathDateError.style.display = 'block';
                }
                isValid = false;
            }
        }
        
        // Valideer dat overlijdensdatum niet voor geboortedatum is (alleen als beide ingevuld zijn)
        if (birthValue && deathValue) {
            const birthDate = new Date(birthValue);
            const deathDate = new Date(deathValue);
            
            if (!isNaN(birthDate.getTime()) && !isNaN(deathDate.getTime()) && deathDate < birthDate) {
                deathDateInput.classList.add('date-error');
                if (deathDateError) {
                    deathDateError.textContent = t('deathBeforeBirthError');
                    deathDateError.style.display = 'block';
                }
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    /**
     * Controleer of ouders geldig zijn geselecteerd
     */
    validateParents() {
        const t = this.t.bind(this);
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        const fatherError = document.getElementById('fatherError');
        const motherError = document.getElementById('motherError');
        
        let isValid = true;
        
        // Reset error styling
        if (fatherInput) {
            fatherInput.classList.remove('parent-validation-error');
            fatherInput.setAttribute('data-valid-parent', 'false');
        }
        if (motherInput) {
            motherInput.classList.remove('parent-validation-error');
            motherInput.setAttribute('data-valid-parent', 'false');
        }
        if (fatherError) fatherError.style.display = 'none';
        if (motherError) motherError.style.display = 'none';
        
        // Check vader
        if (fatherInput && fatherInput.value.trim()) {
            const vaderIdInput = document.getElementById('vader_id');
            const hasValidId = vaderIdInput && vaderIdInput.value && !isNaN(parseInt(vaderIdInput.value));
            
            if (!hasValidId) {
                fatherInput.classList.add('parent-validation-error');
                if (fatherError) {
                    fatherError.textContent = t('parentNotSelected');
                    fatherError.style.display = 'block';
                }
                isValid = false;
            } else {
                fatherInput.setAttribute('data-valid-parent', 'true');
            }
        }
        
        // Check moeder
        if (motherInput && motherInput.value.trim()) {
            const moederIdInput = document.getElementById('moeder_id');
            const hasValidId = moederIdInput && moederIdInput.value && !isNaN(parseInt(moederIdInput.value));
            
            if (!hasValidId) {
                motherInput.classList.add('parent-validation-error');
                if (motherError) {
                    motherError.textContent = t('parentNotSelected');
                    motherError.style.display = 'block';
                }
                isValid = false;
            } else {
                motherInput.setAttribute('data-valid-parent', 'true');
            }
        }
        
        return isValid;
    }
    
    /**
     * Reset alleen de nestdetails velden (niet de ouderdetails)
     */
    resetLitterDetails() {
        // Reset naam, stamboomnummer en geslacht
        const nameInput = document.getElementById('name');
        const pedigreeInput = document.getElementById('pedigreeNumber');
        const genderSelect = document.getElementById('gender');
        const coatColorInput = document.getElementById('coatColor'); // Vachtkleur
        
        if (nameInput) nameInput.value = '';
        if (pedigreeInput) pedigreeInput.value = '';
        if (genderSelect) genderSelect.value = '';
        if (coatColorInput) coatColorInput.value = ''; // Reset vachtkleur
        
        // Reset land/postcode (nu bovenaan)
        const countryInput = document.getElementById('country');
        const zipCodeInput = document.getElementById('zipCode');
        if (countryInput) countryInput.value = '';
        if (zipCodeInput) zipCodeInput.value = '';
        
        // Reset gezondheid velden
        const healthFields = [
            'hipDysplasia',
            'elbowDysplasia',
            'patellaLuxation',
            'eyes',
            'dandyWalker',
            'thyroid'
        ];
        
        healthFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        // Reset uitleg velden en verberg ze
        const eyesExplanationContainer = document.getElementById('eyesExplanationContainer');
        const eyesExplanation = document.getElementById('eyesExplanation');
        const thyroidExplanationContainer = document.getElementById('thyroidExplanationContainer');
        const thyroidExplanation = document.getElementById('thyroidExplanation');
        
        if (eyesExplanationContainer) eyesExplanationContainer.style.display = 'none';
        if (eyesExplanation) eyesExplanation.value = '';
        if (thyroidExplanationContainer) thyroidExplanationContainer.style.display = 'block'; // Altijd zichtbaar
        if (thyroidExplanation) thyroidExplanation.value = '';
        
        // Reset overlijdensdatum
        const deathDateInput = document.getElementById('deathDate');
        if (deathDateInput) {
            deathDateInput.value = '';
            deathDateInput.type = 'date';
        }
        
        // Reset foto en file info
        const photoInput = document.getElementById('photo');
        const fileInfo = document.getElementById('fileInfo');
        if (photoInput) photoInput.value = '';
        if (fileInfo) fileInfo.textContent = this.t('noFileChosen');
        
        // Reset opmerkingen
        const remarksTextarea = document.getElementById('remarks');
        if (remarksTextarea) remarksTextarea.value = '';
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        
        // Initialiseer this.lastBreeds als het niet bestaat
        if (!this.lastBreeds) {
            this.lastBreeds = [];
        }
        
        const index = this.lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            this.lastBreeds.splice(index, 1);
        }
        
        this.lastBreeds.unshift(breedStr);
        
        if (this.lastBreeds.length > 5) {
            this.lastBreeds = this.lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
        console.log('LitterManager: Ras toegevoegd aan recente rassen:', breedStr);
    }
    
    async loadAllDogs() {
        console.log('LitterManager: loadAllDogs aangeroepen');
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar voor loadAllDogs!');
            return;
        }
        
        try {
            console.log('LitterManager: Laden van alle honden met paginatie...');
            
            // Reset array
            this.allDogs = [];
            
            let currentPage = 1;
            const pageSize = 1000; // Maximaal wat Supabase toestaat
            let hasMorePages = true;
            
            // Loop door alle pagina's
            while (hasMorePages) {
                console.log(`LitterManager: Laden pagina ${currentPage}...`);
                
                // Gebruik de getHonden() methode van de database service met paginatie
                const result = await this.db.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    // Voeg honden toe aan array
                    this.allDogs = this.allDogs.concat(result.honden);
                    
                    console.log(`LitterManager: Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                    
                    // Controleer of er nog meer pagina's zijn
                    hasMorePages = result.heeftVolgende;
                    currentPage++;
                    
                    // Veiligheidslimiet voor oneindige lus
                    if (currentPage > 100) {
                        console.warn('Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                        break;
                    }
                } else {
                    hasMorePages = false;
                }
                
                // Kleine pauze om de server niet te overbelasten
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`LitterManager: TOTAAL ${this.allDogs.length} honden geladen voor autocomplete`);
            
        } catch (error) {
            console.error('LitterManager: Fout bij laden honden voor autocomplete:', error);
            this.allDogs = []; // Reset op error
        }
    }
    
    setupParentAutocomplete() {
        console.log('LitterManager: setupParentAutocomplete aangeroepen');
        
        // Verwijder bestaande dropdowns (voor het geval dat)
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            if (dropdown.parentElement && dropdown.parentElement.classList.contains('parent-input-wrapper')) {
                // Laat dropdowns staan die al goed zijn opgebouwd
            } else {
                dropdown.remove();
            }
        });
        
        // Maak nieuwe dropdown containers zoals in DogManager
        const fatherInputWrapper = document.querySelector('#father')?.closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother')?.closest('.parent-input-wrapper');
        
        if (fatherInputWrapper) {
            // Controleer of er al een dropdown is
            let fatherDropdown = fatherInputWrapper.querySelector('.autocomplete-dropdown');
            if (!fatherDropdown) {
                fatherDropdown = document.createElement('div');
                fatherDropdown.className = 'autocomplete-dropdown';
                fatherDropdown.id = 'fatherDropdown';
                fatherDropdown.style.display = 'none';
                fatherInputWrapper.appendChild(fatherDropdown);
            }
        }
        
        if (motherInputWrapper) {
            // Controleer of er al een dropdown is
            let motherDropdown = motherInputWrapper.querySelector('.autocomplete-dropdown');
            if (!motherDropdown) {
                motherDropdown = document.createElement('div');
                motherDropdown.className = 'autocomplete-dropdown';
                motherDropdown.id = 'motherDropdown';
                motherDropdown.style.display = 'none';
                motherInputWrapper.appendChild(motherDropdown);
            }
        }
        
        // Event listeners voor vader en moeder velden - GEBRUIK DEZELFDE LOGICA ALS IN SEARCHMANAGER
        document.querySelectorAll('.parent-input-wrapper input').forEach(input => {
            input.addEventListener('focus', () => {
                this.loadAllDogs(); // Zorg dat honden geladen zijn
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                // Wacht even voordat dropdown wordt verborgen (voor klikken op item)
                setTimeout(() => {
                    const dropdown = document.getElementById(`${input.id}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                    
                    // Valideer of de ouder correct is geselecteerd
                    this.validateParents();
                }, 200);
            });
            
            // Clear validation error when user starts typing again
            input.addEventListener('focus', (e) => {
                input.classList.remove('parent-validation-error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
        
        // Klik buiten dropdown om te verbergen - net zoals in DogManager
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        console.log('LitterManager: showParentAutocomplete voor', parentType, 'zoekterm:', searchTerm);
        
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) {
            console.error('LitterManager: Dropdown niet gevonden:', `${parentType}Dropdown`);
            return;
        }
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        console.log('LitterManager: Aantal honden beschikbaar voor autocomplete:', this.allDogs.length);
        
        // Filter honden voor autocomplete - GEBRUIK DEZELFDE LOGICA ALS IN SEARCHMANAGER
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelName = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            
            // Creëer een gecombineerde string: "naam kennelnaam" (zoals in SearchManager)
            const combined = `${dogName} ${kennelName}`;
            
            // Controleer of de gecombineerde string begint met de zoekterm
            const matchesSearch = combined.startsWith(searchTerm.toLowerCase());
            
            // Filter op geslacht
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            }
            return matchesSearch;
        }).slice(0, 8); // Max 8 suggesties
        
        console.log('LitterManager: Aantal suggesties:', suggestions.length);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            // Toon zowel naam als kennelnaam in de autocomplete
            const displayName = dog.kennelnaam ? `${dog.naam} ${dog.kennelnaam}` : dog.naam;
            html += `
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}" data-kennel="${dog.kennelnaam || ''}" data-pedigree="${dog.stamboomnr || ''}">
                    <div class="dog-name">${displayName}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Event listeners voor autocomplete items - net zoals in DogManager
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const dogKennel = item.getAttribute('data-kennel');
                const dogPedigree = item.getAttribute('data-pedigree');
                const input = document.getElementById(parentType);
                // BELANGRIJK: Gebruik vader_id en moeder_id zoals in DogManager
                const idInput = parentType === 'father' ? document.getElementById('vader_id') : document.getElementById('moeder_id');
                
                // Voeg zowel naam als kennelnaam toe aan het input veld
                const displayName = dogKennel ? `${dogName} ${dogKennel}` : dogName;
                
                if (input) {
                    input.value = displayName;
                    input.setAttribute('data-valid-parent', 'true');
                    input.classList.remove('parent-validation-error');
                    
                    // Clear error message
                    const errorElement = document.getElementById(`${parentType}Error`);
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
                if (idInput) {
                    idInput.value = dogId;
                    console.log(`LitterManager: ${parentType} ID opgeslagen:`, dogId, 'in veld:', idInput.id);
                }
                
                // Sla ook het stamboomnummer op in het data attribute van het input veld
                input.setAttribute('data-pedigree', dogPedigree);
                
                dropdown.style.display = 'none';
                console.log('LitterManager: Ouder geselecteerd:', displayName, 'ID:', dogId, 'Stamboomnummer:', dogPedigree);
            });
        });
    }
    
    async saveDog() {
        console.log('=== LitterManager: START saveDog ===');
        
        if (!this.auth) {
            console.error('LitterManager: Auth niet beschikbaar!');
            this.showError('Authenticatie niet beschikbaar');
            return;
        }
        
        if (!this.db) {
            console.error('LitterManager: Database niet beschikbaar!');
            this.showError('Database niet beschikbaar');
            return;
        }
        
        // Valideer datums eerst
        if (!this.validateDates()) {
            this.showError(this.t('dateFormatError'));
            return;
        }
        
        // Valideer ouders - NIEUWE VALIDATIE
        if (!this.validateParents()) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        // Haal datum waarden op
        const birthDateValue = document.getElementById('birthDate').value;
        const deathDateValue = document.getElementById('deathDate').value;
        
        // Formatteer datums voor opslag (YYYY-MM-DD formaat)
        const formatDateForStorage = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return '';
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // YYYY-MM-DD formaat
            } catch (e) {
                return '';
            }
        };
        
        // Haal de vader en moeder ID's op uit de hidden inputs - EXACT ZELFDE VELDNAMEN ALS DogManager
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        const vaderIdValue = vaderIdInput?.value;
        const moederIdValue = moederIdInput?.value;
        
        // Haal stamboomnummers van ouders op uit de input velden
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        const vaderStamboomnr = fatherInput ? fatherInput.getAttribute('data-pedigree') || '' : '';
        const moederStamboomnr = motherInput ? motherInput.getAttribute('data-pedigree') || '' : '';
        
        console.log('LitterManager: vader_id uit hidden input:', vaderIdValue);
        console.log('LitterManager: moeder_id uit hidden input:', moederIdValue);
        console.log('LitterManager: vader_stamboomnr:', vaderStamboomnr);
        console.log('LitterManager: moeder_stamboomnr:', moederStamboomnr);
        console.log('LitterManager: vader_id type:', typeof vaderIdValue);
        console.log('LitterManager: moeder_id type:', typeof moederIdValue);
        
        // VERZAMEL FORMULIER DATA MET EXACT DEZELFDE VELDNAMEN ALS DogManager
        const dogData = {
            // BASISINFORMATIE
            naam: document.getElementById('name')?.value.trim() || '',
            kennelnaam: document.getElementById('kennelName')?.value.trim() || '',
            stamboomnr: document.getElementById('pedigreeNumber')?.value.trim() || '',
            ras: document.getElementById('breed')?.value.trim() || '',
            vachtkleur: document.getElementById('coatColor')?.value.trim() || '',
            geslacht: document.getElementById('gender')?.value || '',
            
            // OUDERS - EXACT DEZELFDE VELDNAMEN ALS DogManager
            vader: document.getElementById('father')?.value.trim() || '',
            vader_id: vaderIdValue && vaderIdValue.trim() !== '' && !isNaN(parseInt(vaderIdValue)) 
                ? parseInt(vaderIdValue) 
                : null,
            vader_stamboomnr: vaderStamboomnr || null, // NIEUW: vader_stamboomnr toegevoegd
            moeder: document.getElementById('mother')?.value.trim() || '',
            moeder_id: moederIdValue && moederIdValue.trim() !== '' && !isNaN(parseInt(moederIdValue)) 
                ? parseInt(moederIdValue) 
                : null,
            moeder_stamboomnr: moederStamboomnr || null, // NIEUW: moeder_stamboomnr toegevoegd
            
            // DATUMS
            geboortedatum: formatDateForStorage(birthDateValue),
            overlijdensdatum: formatDateForStorage(deathDateValue) || null,
            
            // GEZONDHEIDSINFORMATIE - EXACT DEZELFDE VELDNAMEN ALS DogManager
            heupdysplasie: document.getElementById('hipDysplasia')?.value || null,
            elleboogdysplasie: document.getElementById('elbowDysplasia')?.value || null,
            patella: document.getElementById('patellaLuxation')?.value || null,
            ogen: document.getElementById('eyes')?.value || null,
            ogenverklaring: document.getElementById('eyesExplanation')?.value.trim() || null, // CORRECTE VELDNAAM
            dandyWalker: document.getElementById('dandyWalker')?.value || null,
            schildklier: document.getElementById('thyroid')?.value || null,
            schildklierverklaring: document.getElementById('thyroidExplanation')?.value.trim() || null, // CORRECTE VELDNAAM
            
            // LOCATIE
            land: document.getElementById('country')?.value.trim() || null,
            postcode: document.getElementById('zipCode')?.value.trim() || null,
            
            // OPMERKINGEN
            opmerkingen: document.getElementById('remarks')?.value.trim() || null,
            
            // SYSTEEMVELDEN
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString()
        };
        
        console.log('[LitterManager] === DOG DATA VOOR OPSLAG ===');
        console.log('Aantal velden:', Object.keys(dogData).length);
        console.log('Vader:', dogData.vader, 'vader_id:', dogData.vader_id, 'vader_stamboomnr:', dogData.vader_stamboomnr);
        console.log('Moeder:', dogData.moeder, 'moeder_id:', dogData.moeder_id, 'moeder_stamboomnr:', dogData.moeder_stamboomnr);
        console.log('Ogenverklaring:', dogData.ogenverklaring);
        console.log('Schildklierverklaring:', dogData.schildklierverklaring);
        console.log('Volledige data:', JSON.stringify(dogData, null, 2));
        console.log('[LitterManager] === EINDE DOG DATA ===');
        
        // Validatie - OUDERS NU OOK VERPLICHT
        if (!dogData.naam) {
            this.showError('Naam is verplicht');
            return;
        }
        
        if (!dogData.stamboomnr) {
            this.showError('Stamboomnummer is verplicht');
            return;
        }
        
        if (!dogData.ras) {
            this.showError('Ras is verplicht');
            return;
        }
        
        if (!dogData.vader) {
            this.showError('Vader is verplicht');
            return;
        }
        
        if (!dogData.moeder) {
            this.showError('Moeder is verplicht');
            return;
        }
        
        // NIEUWE VALIDATIE: controleer of ouders correct zijn geselecteerd
        if (!dogData.vader_id) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        if (!dogData.moeder_id) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            console.log('LitterManager: Probeer hond op te slaan via database service...');
            
            // GEBRUIK EXACT DEZELFDE LOGICA ALS DogManager
            let result;
            
            if (window.hondenService && window.hondenService.voegHondToe) {
                console.log('LitterManager: Gebruik window.hondenService.voegHondToe methode');
                result = await window.hondenService.voegHondToe(dogData);
            } else if (this.db && this.db.voegHondToe) {
                console.log('LitterManager: Gebruik this.db.voegHondToe methode');
                result = await this.db.voegHondToe(dogData);
            } else {
                throw new Error('voegHondToe methode niet beschikbaar');
            }
            
            console.log('LitterManager: Hond opgeslagen met resultaat:', result);
            
            // Foto uploaden zoals PhotoManager - EXACT DEZELFDE LOGICA
            const photoInput = document.getElementById('photo');
            if (photoInput && photoInput.files.length > 0) {
                console.log('LitterManager: Foto uploaden zoals PhotoManager...');
                const file = photoInput.files[0];
                
                if (file.size > 5 * 1024 * 1024) {
                    this.showError(this.t('fileTooLarge'));
                    return;
                }
                
                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    this.showError(this.t('invalidType'));
                    return;
                }
                
                await this.uploadPhoto(dogData.stamboomnr, file);
            }
            
            // Voeg toe aan de lijst met huidige nest honden met ALLE gezondheidsinformatie
            this.currentLitterDogs.push({
                naam: dogData.naam,
                stamboomnr: dogData.stamboomnr,
                geslacht: dogData.geslacht,
                vachtkleur: dogData.vachtkleur,
                heupdysplasie: dogData.heupdysplasie,
                elleboogdysplasie: dogData.elleboogdysplasie,
                patella: dogData.patella,
                ogen: dogData.ogen,
                dandyWalker: dogData.dandyWalker,
                schildklier: dogData.schildklier,
                vader_id: dogData.vader_id,
                moeder_id: dogData.moeder_id,
                vader_stamboomnr: dogData.vader_stamboomnr,
                moeder_stamboomnr: dogData.moeder_stamboomnr
            });
            
            // Update de UI lijst
            this.updateAddedDogsList();
            
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Reset alleen de nestdetails velden (niet de ouderdetails)
            this.resetLitterDetails();
            
        } catch (error) {
            console.error('LitterManager: Fout bij opslaan hond:', error);
            console.error('LitterManager: Error stack:', error.stack);
            this.hideProgress();
            this.showError(`${this.t('addFailed')}${error.message}`);
        }
    }
    
    async uploadPhoto(pedigreeNumber, file) {
        try {
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        // Haal gebruiker op zoals PhotoManager
                        const user = window.auth ? window.auth.getCurrentUser() : null;
                        if (!user || !user.id) {
                            throw new Error('Niet ingelogd of geen gebruikers-ID beschikbaar');
                        }
                        
                        // Converteer naar Base64 (volledige data met data: prefix) zoals PhotoManager
                        const base64Data = e.target.result;
                        
                        // Maak thumbnail (gereduceerde versie) zoals PhotoManager
                        let thumbnail = null;
                        try {
                            // Maak een kleine thumbnail (max 200px)
                            const img = new Image();
                            img.src = base64Data;
                            
                            await new Promise((resolve) => {
                                img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    
                                    // Bereken nieuwe afmetingen
                                    const maxSize = 200;
                                    let width = img.width;
                                    let height = img.height;
                                    
                                    if (width > height) {
                                        if (width > maxSize) {
                                            height = (height * maxSize) / width;
                                            width = maxSize;
                                        }
                                    } else {
                                        if (height > maxSize) {
                                            width = (width * maxSize) / height;
                                            height = maxSize;
                                        }
                                    }
                                    
                                    canvas.width = width;
                                    canvas.height = height;
                                    ctx.drawImage(img, 0, 0, width, height);
                                    
                                    thumbnail = canvas.toDataURL('image/jpeg', 0.7);
                                    resolve();
                                };
                            });
                        } catch (thumbError) {
                            console.warn('Thumbnail maken mislukt:', thumbError);
                            // Gebruik de originele data als fallback zoals PhotoManager
                            thumbnail = base64Data;
                        }
                        
                        // Maak foto object voor database (VOLGENS FOTOS TABEL STRUCTUUR) zoals PhotoManager
                        const fotoData = {
                            stamboomnr: pedigreeNumber,
                            data: base64Data, // volledige Base64 data met data: prefix
                            thumbnail: thumbnail,   // thumbnail als Base64
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                            uploaded_at: new Date().toISOString(),
                            geupload_door: user.id
                        };
                        
                        console.log('Foto data voor database:', {
                            stamboomnr: fotoData.stamboomnr,
                            filename: fotoData.filename,
                            size: fotoData.size,
                            hasData: !!fotoData.data,
                            hasThumbnail: !!fotoData.thumbnail,
                            geupload_door: fotoData.geupload_door
                        });
                        
                        // Voeg toe aan database via Supabase zoals PhotoManager
                        const { data: dbData, error: dbError } = await window.supabase
                            .from('fotos')
                            .insert(fotoData)
                            .select()
                            .single();
                        
                        if (dbError) {
                            console.error('Database insert error:', dbError);
                            throw dbError;
                        }
                        
                        console.log('Database insert successful:', dbData);
                        this.showSuccess(this.t('photoAdded'));
                        resolve();
                        
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error(this.t('fileReadError')));
                };
                
                reader.readAsDataURL(file);
            });
        } catch (error) {
            this.showError(`${this.t('photoError')}${error.message}`);
        }
    }
    
    resetForm() {
        // Reset alle formulier velden
        const form = document.getElementById('litterForm');
        if (form) {
            form.reset();
        }
        
        // Reset hidden inputs
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        if (vaderIdInput) vaderIdInput.value = '';
        if (moederIdInput) moederIdInput.value = '';
        
        // Reset dropdowns
        const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        // Reset datum velden
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        if (birthDateInput) {
            birthDateInput.type = 'date';
            birthDateInput.placeholder = 'DD-MM-JJJJ';
        }
        if (deathDateInput) {
            deathDateInput.type = 'date';
            deathDateInput.placeholder = 'DD-MM-JJJJ';
        }
        
        // Reset file info
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) {
            fileInfo.textContent = this.t('noFileChosen');
        }
        
        // Reset error berichten
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.style.display = 'none';
        });
        
        // Reset parent validation
        const parentInputs = document.querySelectorAll('.parent-input-wrapper input');
        parentInputs.forEach(input => {
            input.classList.remove('parent-validation-error');
            input.setAttribute('data-valid-parent', 'false');
        });
        
        // Reset de lijst met ingevoerde honden
        this.currentLitterDogs = [];
        this.updateAddedDogsList();
    }
    
    showProgress(message) {
        console.log('LitterManager showProgress:', message);
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            // Fallback
            alert(message);
        }
    }
    
    hideProgress() {
        console.log('LitterManager hideProgress');
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        }
    }
    
    showSuccess(message) {
        console.log('LitterManager showSuccess:', message);
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        console.error('LitterManager showError:', message);
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            alert(message);
        }
    }
}

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.LitterManager = LitterManager;
}