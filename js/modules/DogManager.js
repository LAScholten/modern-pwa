/**
 * Hond Management Module
 * Beheert toevoegen en bewerken van honden
 */

class DogManager extends BaseModule {
    constructor() {
        super('dogmanager', 'Hond Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete van ouders
        this.litterManager = null; // Wordt later geïnitialiseerd indien beschikbaar
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
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
                coatColor: "Vachtkleur",
                recent: "Recent:",
                father: "Vader",
                mother: "Moeder",
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
                thyroid: "Schildklier",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                addPhoto: "Foto toevoegen",
                chooseFile: "Kies bestand",
                noFileChosen: "Geen bestand gekozen",
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
                insufficientPermissionsText: "U heeft geen toestemming om honden te bewerken. Alleen administrators kunnen deze functie gebruiken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                
                // Alerts
                adminOnly: "Alleen administrators mogen honden toevoegen/bewerken",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                savingDog: "Hond opslaan...",
                dogAdded: "Hond succesvol toegevoegd!",
                dogUpdated: "Hond succesvol bijgewerkt!",
                dogDeleted: "Hond succesvol verwijderen!",
                addFailed: "Fout bij toevoegen hond: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                photoError: "Fout bij uploaden foto: "
            },
            en: {
                // Modal titles
                newDog: "Add New Dog",
                editDog: "Edit Dog",
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
                coatColor: "Coat Color",
                recent: "Recent:",
                father: "Father",
                mother: "Mother",
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
                thyroid: "Thyroid",
                thyroidNegative: "Tgaa Negative",
                thyroidPositive: "Tgaa Positive",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                addPhoto: "Add photo",
                chooseFile: "Choose file",
                noFileChosen: "No file chosen",
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
                insufficientPermissionsText: "You do not have permission to edit dogs. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
                // Alerts
                adminOnly: "Only administrators can add/edit dogs",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                savingDog: "Saving dog...",
                dogAdded: "Dog successfully added!",
                dogUpdated: "Dog successfully updated!",
                dogDeleted: "Dog successfully deleted!",
                addFailed: "Error adding dog: ",
                updateFailed: "Error updating dog: ",
                deleteFailed: "Error deleting dog: ",
                confirmDelete: "Are you sure you want to delete this dog?",
                photoAdded: "Photo added",
                photoError: "Error uploading photo: "
            },
            de: {
                // Modal Titel
                newDog: "Neuen Hund hinzufügen",
                editDog: "Hund bearbeiten",
                dogLitterChoice: "Hund of Wurf hinzufügen",
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
                coatColor: "Fellfarbe",
                recent: "Kürzlich:",
                father: "Vater",
                mother: "Mutter",
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
                dandyFreeDNA: "Frei auf DNA",
                dandyFreeParents: "Frei op ouders",
                dandyCarrier: "Träger",
                dandyAffected: "Betroffen",
                thyroid: "Schilddrüse",
                thyroidNegative: "Tgaa Negativ",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                addPhoto: "Foto hinzufügen",
                chooseFile: "Datei wählen",
                noFileChosen: "Keine Datei gewählt",
                remarks: "Bemerkungen",
                requiredFields: "Felder met * zijn Pflichtfelder",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                back: "Zurück",
                
                // Validierung
                dateFormatError: "Datum moet in DD-MM-JJJJ formaat zijn",
                deathBeforeBirthError: "Sterbedatum kan niet voor geboortedatum zijn",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Hunde zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Meldungen
                adminOnly: "Nur Administratoren können Hunde hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse sind Pflichtfelder",
                savingDog: "Hund wird gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualisiert!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                confirmDelete: "Sind Sie sicher, dass Sie diesen Hund löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: "
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    getModalHTML(isEdit = false, dogData = null) {
        // Controleer of gebruiker admin is - EXACT zoals in DogDataManager
        const isAdmin = auth.isAdmin();
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser.role === 'admin' ? 'Admin' : this.t('user');
        
        if (!isAdmin) {
            const modalId = 'addDogModal'; // Alleen voor nieuwe hond toevoegen
            
            return `
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="${modalId}Label">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">${this.t('accessDenied')}</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="alert alert-danger">
                                    <h5><i class="bi bi-shield-lock"></i> ${this.t('insufficientPermissions')}</h5>
                                    <p>${this.t('insufficientPermissionsText')}</p>
                                    <p class="mb-0">${this.t('loggedInAs')}: <strong>${currentUser.username}</strong> (${userRole})</p>
                                </div>
                                
                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h6><i class="bi bi-info-circle text-primary"></i> ${this.t('availableFeatures')}</h6>
                                        <ul>
                                            <li>${this.t('searchDogs')}</li>
                                            <li>${this.t('viewGallery')}</li>
                                            <li>${this.t('managePrivateInfo')}</li>
                                            <li>${this.t('importExport')}</li>
                                        </ul>
                                    </div>
                                </div>
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
            `;
        }
        
        // Als gebruiker admin is, toon direct het hondenformulier
        const t = this.t.bind(this);
        const modalTitle = isEdit ? t('editDog') : t('newDog');
        const modalId = 'addDogModal';
        
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
                            ${this.getDogFormHTML(dogData)}
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
                    
                    /* Mobiel: alles onder elkaar */
                    .ras-vachtkleur-row {
                        flex-direction: column !important;
                    }
                    
                    .ras-col {
                        width: 100% !important;
                        margin-bottom: 15px !important;
                    }
                    
                    .recent-col {
                        width: 100% !important;
                        margin-bottom: 15px !important;
                    }
                    
                    .vachtkleur-col {
                        width: 100% !important;
                    }
                    
                    .recent-breeds-label {
                        margin-bottom: 5px !important;
                    }
                    
                    .recent-breed-btn {
                        font-size: 0.75em !important;
                        padding: 4px 8px !important;
                        margin: 2px !important;
                    }
                }
                
                /* Desktop layout: EXACT zoals scherm2.png */
                .ras-vachtkleur-row {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: flex-start;
                    gap: 15px;
                    width: 100%;
                    margin-bottom: 0;
                }
                
                .ras-col {
                    flex: 2;
                    min-width: 200px;
                }
                
                .recent-col {
                    flex: 1;
                    min-width: 200px;
                }
                
                .vachtkleur-col {
                    flex: 2;
                    min-width: 200px;
                }
                
                .recent-breeds-label {
                    font-size: 0.875em;
                    color: #6c757d;
                    margin-bottom: 5px;
                    display: block;
                }
                
                .recent-breeds-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-top: 0;
                }
                
                .recent-breed-btn {
                    white-space: nowrap;
                    font-size: 0.8em;
                    padding: 4px 8px;
                    margin: 2px 0;
                }
                
                /* Zorg dat de labels op dezelfde hoogte staan */
                .ras-col .form-label,
                .vachtkleur-col .form-label {
                    margin-bottom: 8px;
                    display: block;
                    height: 19px;
                    line-height: 19px;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                .autocomplete-dropdown {
                    position: relative;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                    margin-top: 2px;
                    display: none;
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
                
                /* Datum input styling - gebruik text input voor alle apparaten */
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
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
            </style>
        `;
    }
    
    getLitterFormHTML() {
        console.log('DogManager: getLitterFormHTML aangeroepen');
        
        // Controleer of LitterManager beschikbaar is
        if (typeof LitterManager === 'undefined') {
            console.error('LitterManager is niet gedefinieerd!');
            // Fallback HTML als LitterManager niet beschikbaar is
            return `
                <div class="mb-3">
                    <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                        <i class="bi bi-arrow-left me-1"></i> ${this.t('back')}
                    </button>
                </div>
                
                <div class="text-center py-3">
                    <div class="mb-2">
                        <i class="bi bi-tools" style="font-size: 2.5rem; color: #f39c12;"></i>
                    </div>
                    <h5 class="mb-2">${this.t('development')}</h5>
                    <p class="text-muted small mb-2">Deze functie is momenteel in ontwikkeling en komt binnenkort beschikbaar.</p>
                    <button type="button" class="btn btn-secondary btn-sm back-to-choice-btn">
                        <i class="bi bi-arrow-left me-1"></i> ${this.t('back')}
                    </button>
                </div>
            `;
        }
        
        // Maak LitterManager aan als deze nog niet bestaat
        if (!this.litterManager) {
            console.log('DogManager: Maak nieuwe LitterManager aan');
            this.litterManager = new LitterManager();
            console.log('DogManager: LitterManager aangemaakt:', this.litterManager);
            console.log('DogManager: db beschikbaar?', !!this.db);
            console.log('DogManager: auth beschikbaar?', !!this.auth);
            
            // Injecteer de dependencies van DogManager naar LitterManager
            if (this.litterManager.injectDependencies) {
                console.log('DogManager: Injecteer dependencies in LitterManager');
                this.litterManager.injectDependencies(this.db, this.auth);
                console.log('DogManager: Dependencies geïnjecteerd');
            } else {
                console.error('DogManager: LitterManager heeft geen injectDependencies methode!');
            }
        } else {
            console.log('DogManager: LitterManager bestaat al');
        }
        
        // Terug knop HTML
        const backButtonHTML = `
            <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary btn-sm back-to-choice-btn">
                    <i class="bi bi-arrow-left me-1"></i> ${this.t('back')}
                </button>
            </div>
        `;
        
        // Haal het formulier HTML op van LitterManager
        console.log('DogManager: Haal formulier HTML op van LitterManager');
        const litterFormHTML = this.litterManager.getFormHTML();
        console.log('DogManager: Formulier HTML opgehaald');
        
        return backButtonHTML + litterFormHTML;
    }
    
    getDogFormHTML(dogData = null) {
        const t = this.t.bind(this);
        const data = dogData || {};
        
        console.log('DogManager getDogFormHTML - ontvangen dogData:', data);
        console.log('DogManager getDogFormHTML - vaderId:', data.vaderId);
        console.log('DogManager getDogFormHTML - moederId:', data.moederId);
        
        // Formatteer datums voor weergave (YYYY-MM-DD naar DD-MM-YYYY)
        const formatDateForDisplay = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${year}-${month}-${day}`; // YYYY-MM-DD voor date input
            } catch (e) {
                return dateString;
            }
        };
        
        const birthDateValue = formatDateForDisplay(data.geboortedatum);
        const deathDateValue = formatDateForDisplay(data.overlijdensdatum);
        
        // Bereken recente rassen (maximaal 4)
        const recentBreeds = this.lastBreeds.slice(0, 4);
        let recentBreedsHTML = '';
        if (recentBreeds.length > 0) {
            recentBreedsHTML = recentBreeds.map(breed => `
                <button type="button" class="btn btn-sm btn-outline-secondary recent-breed-btn" data-breed="${breed}">
                    ${breed}
                </button>
            `).join('');
        }
        
        return `
            <form id="addDogForm">
                <input type="hidden" id="fatherId" value="${data.vaderId || ''}">
                <input type="hidden" id="motherId" value="${data.moederId || ''}">
                
                <!-- Rij 1: Naam en Kennelnaam -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="dogName" value="${data.naam || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="kennelName" class="form-label">${t('kennelName')}</label>
                            <input type="text" class="form-control" id="kennelName" value="${data.kennelnaam || ''}">
                        </div>
                    </div>
                </div>
                
                <!-- Rij 2: Stamboomnummer en Geslacht -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
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
                
                <!-- Rij 3: Ras, Recente rassen en Vachtkleur - EXACT zoals scherm2.png -->
                <div class="row">
                    <div class="col-12">
                        <div class="ras-vachtkleur-row">
                            <!-- Ras invoerveld -->
                            <div class="ras-col">
                                <label for="breed" class="form-label">${t('breedRequired')}</label>
                                <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                            </div>
                            
                            <!-- Recente rassen sectie -->
                            <div class="recent-col">
                                <span class="recent-breeds-label">${t('recent')}</span>
                                <div class="recent-breeds-buttons">
                                    ${recentBreedsHTML}
                                </div>
                            </div>
                            
                            <!-- Vachtkleur invoerveld -->
                            <div class="vachtkleur-col">
                                <label for="coatColor" class="form-label">${t('coatColor')}</label>
                                <input type="text" class="form-control" id="coatColor" value="${data.vachtkleur || ''}">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Rij 4: Vader en Moeder (naast elkaar) -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="father" class="form-label">${t('father')}</label>
                            <input type="text" class="form-control parent-search-input" id="father" 
                                   value="${data.vader || ''}" 
                                   placeholder="Typ naam of 'naam kennelnaam'..."
                                   data-parent-type="father"
                                   autocomplete="off">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="mother" class="form-label">${t('mother')}</label>
                            <input type="text" class="form-control parent-search-input" id="mother" 
                                   value="${data.moeder || ''}" 
                                   placeholder="Typ naam of 'naam kennelnaam'..."
                                   data-parent-type="mother"
                                   autocomplete="off">
                        </div>
                    </div>
                </div>
                
                <!-- Rij 5: Geboortedatum en Overlijdensdatum -->
                <div class="row">
                    <div class="col-md-6">
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
                
                <!-- Rij 6: Heupdysplasie, Elleboogdysplasie, Patella Luxatie -->
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
                
                <!-- Rij 7: Ogen en Dandy Walker -->
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
                            <input type="text" class="form-control" id="eyesExplanation" value="${data.ogenVerklaring || ''}">
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
                
                <!-- Rij 8: Schildklier en Land/Postcode -->
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
                        <div class="mb-3" id="thyroidExplanationContainer" style="${data.schildklier === 'Positief' ? '' : 'display: none;'}">
                            <label for="thyroidExplanation" class="form-label">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="thyroidExplanation" value="${data.schildklierVerklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
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
                    </div>
                </div>
                
                <!-- Foto uploaden -->
                <div class="mb-3">
                    <label for="dogPhoto" class="form-label">${t('addPhoto')}</label>
                    <div class="input-group">
                        <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                        <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                    </div>
                    <div class="form-text">${t('noFileChosen')}</div>
                </div>
                
                <!-- Opmerkingen -->
                <div class="mb-3">
                    <label for="remarks" class="form-label">${t('remarks')}</label>
                    <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                </div>
                
                <!-- Verplichte velden info -->
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    ${t('requiredFields')}
                </div>
                
                <!-- Opslaan knop -->
                <div class="text-end">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        ${t('saveDog')}
                    </button>
                </div>
            </form>
        `;
    }
    
    setupEvents() {
        console.log('DogManager setupEvents called');
        
        // Vertaal de modal tekst
        setTimeout(() => {
            this.translateModal();
        }, 100);
        
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
            // Voeg event listeners toe voor de knoppen in de modal
            const modal = document.getElementById('addDogModal');
            if (modal) {
                modal.addEventListener('shown.bs.modal', () => {
                    console.log('DogManager modal is nu zichtbaar (toegang geweigerd)');
                });
            }
            return;
        }
        
        // Alleen verder gaan als gebruiker admin is
        // Laad honden voor autocomplete
        this.loadAllDogs();
        
        // Event listeners voor formulier
        this.setupFormEvents();
    }
    
    setupFormEvents() {
        // Event listeners voor formulier
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDog();
            });
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
        }
        
        // Thyroid dropdown handler
        const thyroidSelect = document.getElementById('thyroid');
        if (thyroidSelect) {
            thyroidSelect.addEventListener('change', (e) => {
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = e.target.value === 'Positief' ? 'block' : 'none';
                }
            });
        }
        
        // Recente rassen knoppen
        document.querySelectorAll('.recent-breed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                }
            });
        });
        
        // Setup autocomplete voor ouders - MET DE ZOEKFUNCTIE VAN SEARCHMANAGER
        this.setupParentAutocomplete();
        
        // Setup datum velden voor tekst invoer en validatie
        this.setupDateFields();
        
        // Voeg datum validatie toe bij blur
        this.setupDateValidation();
    }
    
    /**
     * Setup datum velden voor correcte verwerking
     */
    setupDateFields() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        // Verwijder alle complexe formatteer logica - gebruik gewoon date input
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
     * Vertaal de modal tekst
     */
    translateModal() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: {
                close: "Sluiten",
                accessDenied: "Toegang Geweigerd",
                choose: "Kies...",
                back: "Terug",
                development: "In Ontwikkeling",
                coatColor: "Vachtkleur",
                recent: "Recent:"
            },
            en: {
                close: "Close",
                accessDenied: "Access Denied",
                choose: "Choose...",
                back: "Back",
                development: "In Development",
                coatColor: "Coat Color",
                recent: "Recent:"
            },
            de: {
                close: "Schließen",
                accessDenied: "Zugriff Verweigert",
                choose: "Wählen...",
                back: "Zurück",
                development: "In Entwicklung",
                coatColor: "Fellfarbe",
                recent: "Kürzlich:"
            }
        };
        
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[currentLang] && translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        
        const breedStr = breed.trim();
        const index = this.lastBreeds.indexOf(breedStr);
        
        if (index > -1) {
            this.lastBreeds.splice(index, 1);
        }
        
        this.lastBreeds.unshift(breedStr);
        
        if (this.lastBreeds.length > 5) {
            this.lastBreeds = this.lastBreeds.slice(0, 5);
        }
        
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
    }
    
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                this.allDogs = await hondenService.getHonden();
                this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            } catch (error) {
                console.error('Fout bij laden honden voor autocomplete:', error);
            }
        }
    }
    
    /**
     * Setup autocomplete voor ouders - MET DE ZOEKFUNCTIE VAN SEARCHMANAGER
     */
    setupParentAutocomplete() {
        console.log('DogManager: setupParentAutocomplete aangeroepen');
        
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak nieuwe dropdown containers
        const fatherInputWrapper = document.querySelector('#father')?.closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother')?.closest('.parent-input-wrapper');
        
        if (fatherInputWrapper) {
            const fatherDropdown = document.createElement('div');
            fatherDropdown.className = 'autocomplete-dropdown';
            fatherDropdown.id = 'fatherDropdown';
            fatherDropdown.style.display = 'none';
            fatherInputWrapper.appendChild(fatherDropdown);
        }
        
        if (motherInputWrapper) {
            const motherDropdown = document.createElement('div');
            motherDropdown.className = 'autocomplete-dropdown';
            motherDropdown.id = 'motherDropdown';
            motherDropdown.style.display = 'none';
            motherInputWrapper.appendChild(motherDropdown);
        }
        
        // Event listeners voor vader en moeder velden - gebruik de SearchManager logica
        document.querySelectorAll('#father, #mother').forEach(input => {
            if (!input) return;
            
            input.addEventListener('focus', async () => {
                if (this.allDogs.length === 0) {
                    await this.loadAllDogs();
                }
                
                const searchTerm = input.value.toLowerCase().trim();
                
                if (searchTerm.length >= 1) {
                    const parentType = input.id === 'father' ? 'father' : 'mother';
                    this.showParentAutocomplete(searchTerm, parentType);
                }
            });
            
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                
                if (searchTerm.length >= 1) {
                    this.showParentAutocomplete(searchTerm, parentType);
                } else {
                    this.hideParentAutocomplete(parentType);
                    // Reset hidden ID als het veld leeg is
                    const idInput = document.getElementById(`${parentType}Id`);
                    if (idInput) {
                        console.log(`${parentType}Id gereset omdat input veld leeg is`);
                        idInput.value = '';
                    }
                }
            });
            
            input.addEventListener('blur', (e) => {
                setTimeout(() => {
                    const parentType = input.id === 'father' ? 'father' : 'mother';
                    this.hideParentAutocomplete(parentType);
                }, 200);
            });
        });
        
        // Klik buiten dropdown om te verbergen
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                this.hideParentAutocomplete('father');
                this.hideParentAutocomplete('mother');
            }
        });
    }
    
    /**
     * NIEUW: Toon parent autocomplete - MET DE ZOEKFUNCTIE VAN SEARCHMANAGER
     */
    showParentAutocomplete(searchTerm, parentType) {
        console.log(`DogManager: showParentAutocomplete voor ${parentType} met zoekterm: "${searchTerm}"`);
        
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) {
            console.log(`Dropdown voor ${parentType} niet gevonden`);
            return;
        }
        
        // Filter honden voor autocomplete - GEBRUIK DE ZOEKFUNCTIE VAN SEARCHMANAGER
        const suggestions = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            
            // Creëer een gecombineerde string: "naam kennelnaam"
            const combined = `${naam} ${kennelnaam}`;
            
            // Controleer of de gecombineerde string begint met de zoekterm
            const matchesSearch = combined.startsWith(searchTerm);
            
            // Filter op geslacht
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else if (parentType === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            }
            return matchesSearch;
        }).slice(0, 8); // Beperk tot 8 suggesties
        
        console.log(`DogManager: ${suggestions.length} suggesties gevonden voor ${parentType}`);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                             dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            html += `
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}">
                    <div class="dog-name">${dog.naam} ${dog.kennelnaam ? dog.kennelnaam : ''}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'} | ${genderText}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Positioneer de dropdown correct onder het input veld
        const input = document.getElementById(parentType);
        if (input) {
            // Verwijder absolute positioning - gebruik relative positioning
            dropdown.style.position = 'relative';
            dropdown.style.top = '0';
            dropdown.style.left = '0';
            dropdown.style.width = '100%';
            dropdown.style.zIndex = '9999';
        }
        
        // Event listeners voor autocomplete items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                
                console.log(`DogManager: Autocomplete item geklikt voor ${parentType}`);
                console.log(`- Geselecteerde hond ID: ${dogId}`);
                console.log(`- Geselecteerde hond naam: ${dogName}`);
                
                // Vul het input veld met de volledige naam
                input.value = dogName;
                
                // Vul het hidden ID veld
                const idInput = document.getElementById(`${parentType}Id`);
                if (idInput) {
                    idInput.value = dogId;
                    console.log(`${parentType}Id ingesteld op: ${dogId}`);
                } else {
                    console.error(`${parentType}Id input niet gevonden!`);
                }
                
                // Verberg de dropdown
                this.hideParentAutocomplete(parentType);
                
                // Focus terug op het input veld
                input.focus();
            });
        });
    }
    
    /**
     * NIEUW: Verberg parent autocomplete
     */
    hideParentAutocomplete(parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    async saveDog() {
        console.log('=== DogManager: saveDog aangeroepen ===');
        
        if (!this.auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        // Valideer datums eerst
        if (!this.validateDates()) {
            this.showError(this.t('dateFormatError'));
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
        
        // Haal ouder ID's op
        const fatherIdInput = document.getElementById('fatherId');
        const motherIdInput = document.getElementById('motherId');
        
        // Log de ouder ID's voor debugging
        console.log('=== OUDER ID DEBUGGING ===');
        console.log('Vader ID input element:', fatherIdInput);
        console.log('Vader ID waarde:', fatherIdInput ? fatherIdInput.value : 'Niet gevonden');
        console.log('Moeder ID input element:', motherIdInput);
        console.log('Moeder ID waarde:', motherIdInput ? motherIdInput.value : 'Niet gevonden');
        
        // Parse ouder ID's
        const vaderId = fatherIdInput && fatherIdInput.value ? parseInt(fatherIdInput.value) : null;
        const moederId = motherIdInput && motherIdInput.value ? parseInt(motherIdInput.value) : null;
        
        console.log('Vader ID geparsed:', vaderId, '(type:', typeof vaderId, ')');
        console.log('Moeder ID geparsed:', moederId, '(type:', typeof moederId, ')');
        
        // Haal ouder namen op
        let vaderNaam = document.getElementById('father').value.trim();
        let moederNaam = document.getElementById('mother').value.trim();
        
        // Als er ID's zijn, zoek dan de bijbehorende hond op voor de naam
        if (vaderId && this.allDogs.length > 0) {
            const vaderHond = this.allDogs.find(dog => dog.id === vaderId);
            if (vaderHond) {
                vaderNaam = vaderHond.naam || '';
                console.log(`Vader naam gevonden via ID ${vaderId}: ${vaderNaam}`);
            }
        }
        
        if (moederId && this.allDogs.length > 0) {
            const moederHond = this.allDogs.find(dog => dog.id === moederId);
            if (moederHond) {
                moederNaam = moederHond.naam || '';
                console.log(`Moeder naam gevonden via ID ${moederId}: ${moederNaam}`);
            }
        }
        
        const dogData = {
            naam: document.getElementById('dogName').value.trim(),
            kennelnaam: document.getElementById('kennelName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            vachtkleur: document.getElementById('coatColor').value.trim(), // Nieuw veld
            geslacht: document.getElementById('gender').value,
            vader: vaderNaam,
            vaderId: vaderId,
            moeder: moederNaam,
            moederId: moederId,
            geboortedatum: formatDateForStorage(birthDateValue),
            overlijdensdatum: formatDateForStorage(deathDateValue),
            heupdysplasie: document.getElementById('hipDysplasia').value,
            elleboogdysplasie: document.getElementById('elbowDysplasia').value,
            patella: document.getElementById('patellaLuxation').value,
            ogen: document.getElementById('eyes').value,
            ogenVerklaring: document.getElementById('eyesExplanation')?.value.trim() || '',
            dandyWalker: document.getElementById('dandyWalker').value,
            schildklier: document.getElementById('thyroid').value,
            schildklierVerklaring: document.getElementById('thyroidExplanation')?.value.trim() || '',
            land: document.getElementById('country').value.trim(),
            postcode: document.getElementById('zipCode').value.trim(),
            opmerkingen: document.getElementById('remarks').value.trim(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Log de volledige data die wordt opgeslagen
        console.log('=== DOG DATA VOOR OPSLAG ===');
        console.log('Volledige dogData:', dogData);
        console.log('vader:', dogData.vader, '(vaderId:', dogData.vaderId, ')');
        console.log('moeder:', dogData.moeder, '(moederId:', dogData.moederId, ')');
        console.log('vaderId type:', typeof dogData.vaderId, 'waarde:', dogData.vaderId);
        console.log('moederId type:', typeof dogData.moederId, 'waarde:', dogData.moederId);
        console.log('=== EINDE DOG DATA LOG ===');
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            console.log('DogManager: Roep hondenService.voegHondToe aan met dogData');
            const result = await hondenService.voegHondToe(dogData);
            console.log('DogManager: Hond toegevoegd met resultaat:', result);
            
            this.hideProgress();
            this.showSuccess(this.t('dogAdded'));
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput && photoInput.files.length > 0) {
                console.log('DogManager: Upload foto');
                await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
            }
            
            // Modal sluiten
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDogModal'));
                if (modal) {
                    console.log('DogManager: Sluit modal');
                    modal.hide();
                }
                
                // Update de lokale cache van honden
                this.loadAllDogs();
            }, 1500);
            
        } catch (error) {
            console.error('DogManager: Fout bij opslaan hond:', error);
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
                        const photoData = {
                            stamboomnr: pedigreeNumber,
                            data: e.target.result,
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                            uploadedAt: new Date().toISOString()
                        };
                        
                        await hondenService.voegFotoToe(photoData);
                        this.showSuccess(this.t('photoAdded'));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                
                reader.onerror = () => {
                    reject(new Error('Fout bij lezen bestand'));
                };
                
                reader.readAsDataURL(file);
            });
        } catch (error) {
            this.showError(`${this.t('photoError')}${error.message}`);
        }
    }
    
    showProgress(message) {
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        } else {
            console.log('Hide progress');
        }
    }
    
    showSuccess(message) {
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }
    
    showError(message) {
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            console.error('Error:', message);
        }
    }
}

// Maak globaal beschikbaar voor debug doeleinden
if (typeof window !== 'undefined') {
    window.DogManager = DogManager;
}