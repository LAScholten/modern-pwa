// js/modules/DogDataManager.js

/**
 * DogDataManager - Module voor het bewerken en verwijderen van honden
 * MET CORRECTE OPSLAG VAN OUDER ID's volgens database structuur
 */
class DogDataManager extends BaseModule {
    constructor() {
        super('dogdata', 'Data Hond Bewerken');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete
        this.selectedDog = null; // Geselecteerde hond voor bewerking
        this.currentDogId = null; // ID van de huidige hond die wordt bewerkt
        
        console.log('DogDataManager geïnitialiseerd');
        
        this.translations = {
            nl: {
                // Modal titels
                editDogData: "Data Hond Bewerken",
                searchDog: "Zoek Hond",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                
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
                saveChanges: "Wijzigingen Opslaan",
                cancel: "Annuleren",
                deleteDog: "Hond Verwijderen",
                choose: "Kies...",
                searchPlaceholder: "Typ naam of stamboomnummer...",
                
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
                
                // Zoekveld
                loadingDogs: "Honden laden...",
                noResults: "Geen honden gevonden",
                selectDogToEdit: "Selecteer een hond om te bewerken",
                typeToSearch: "Begin met typen om te zoeken",
                
                // Status berichten
                searchResults: "Zoekresultaten",
                dogSelected: "Hond geselecteerd",
                editingDog: "Bewerken hond",
                savingChanges: "Wijzigingen opslaan...",
                changesSaved: "Wijzigingen opgeslagen!",
                dogDeleted: "Hond succesvol verwijderen!",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                updatingDog: "Hond bijwerken...",
                dogUpdated: "Hond bijgewerkt!",
                deleting: "Verwijderen...",
                
                // Foutmeldingen
                searchFailed: "Fout bij zoeken: ",
                loadFailed: "Fout bij laden honden: ",
                updateFailed: "Fout bij bijwerken hond: ",
                deleteFailed: "Fout bij verwijderen hond: ",
                photoError: "Fout bij uploaden foto: ",
                fieldsRequired: "Naam, stamboomnummer en ras zijn verplichte velden",
                dogNotFound: "Hond niet gevonden",
                adminOnly: "Alleen administrators mogen honden bewerken",
                invalidId: "Ongeldig hond ID",
                dateFormatError: "Datum moet in DD-MM-JJJJ formaat zijn",
                deathBeforeBirthError: "Overlijdensdatum kan niet voor geboortedatum zijn"
            },
            en: {
                // Modal titles
                editDogData: "Edit Dog Data",
                searchDog: "Search Dog",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                
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
                saveChanges: "Save Changes",
                cancel: "Cancel",
                deleteDog: "Delete Dog",
                choose: "Choose...",
                searchPlaceholder: "Type name or pedigree number...",
                
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
                
                // Search field
                loadingDogs: "Loading dogs...",
                noResults: "No dogs found",
                selectDogToEdit: "Select a dog to edit",
                typeToSearch: "Start typing to search",
                
                // Status messages
                searchResults: "Search results",
                dogSelected: "Dog selected",
                editingDog: "Editing dog",
                savingChanges: "Saving changes...",
                changesSaved: "Changes saved!",
                dogDeleted: "Dog successfully deleted!",
                confirmDelete: "Are you sure you want to delete this dog?",
                photoAdded: "Photo added",
                updatingDog: "Updating dog...",
                dogUpdated: "Dog updated!",
                deleting: "Deleting...",
                
                // Error messages
                searchFailed: "Error searching: ",
                loadFailed: "Error loading dogs: ",
                updateFailed: "Error updating dog: ",
                deleteFailed: "Error deleting dog: ",
                photoError: "Error uploading photo: ",
                fieldsRequired: "Name, pedigree number and breed are required fields",
                dogNotFound: "Dog not found",
                adminOnly: "Only administrators can edit dogs",
                invalidId: "Invalid dog ID",
                dateFormatError: "Date must be in DD-MM-YYYY format",
                deathBeforeBirthError: "Death date cannot be before birth date"
            },
            de: {
                // Modal Titel
                editDogData: "Hundedaten bearbeiten",
                searchDog: "Hund suchen",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                
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
                dandyFreeDNA: "Frij op DNA",
                dandyFreeParents: "Frij op ouders",
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
                requiredFields: "Felder met * sind Pflichtfelder",
                saveChanges: "Änderungen speichern",
                cancel: "Abbrechen",
                deleteDog: "Hund löschen",
                choose: "Wählen...",
                searchPlaceholder: "Name oder Stammbaum-Nummer eingeben...",
                
                // Zugangskontrolle Popup Texte
                insufficientPermissions: "Unzureichende Berechtigingen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Hunde zu bearbeiten. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare functies voor Benutzer",
                searchDogs: "Hunde suchen en anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                
                // Suchfeld
                loadingDogs: "Hunde laden...",
                noResults: "Keine Hunde gefunden",
                selectDogToEdit: "Wählen Sie einen Hund zum Bearbeiten",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                
                // Status Meldungen
                searchResults: "Suchergebnisse",
                dogSelected: "Hond ausgewählt",
                editingDog: "Hond bearbeiten",
                savingChanges: "Änderungen speichern...",
                changesSaved: "Änderungen gespeichert!",
                dogDeleted: "Hond succesvol verwijderen!",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                updatingDog: "Hond bijwerken...",
                dogUpdated: "Hond bijgewerkt!",
                deleting: "Verwijderen...",
                
                // Fehlermeldungen
                searchFailed: "Fehler bei der Suche: ",
                loadFailed: "Fehler beim Laden der Hunde: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                photoError: "Fehler beim Hochladen des Fotos: ",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse sind Pflichtfelder",
                dogNotFound: "Hund niet gefonden",
                adminOnly: "Nur Administratoren können Hunde bearbeiten",
                invalidId: "Ungültige Hunde-ID",
                dateFormatError: "Datum muss im Format TT-MM-JJJJ sein",
                deathBeforeBirthError: "Sterbedatum kan nicht vor dem Geburtsdatum liegen"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    /**
     * Render de module interface
     */
    getModalHTML() {
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser.role === 'admin' ? 'Admin' : this.t('user');
        
        if (!isAdmin) {
            return `
                <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="dogDataModalLabel">
                                    <i class="bi bi-exclamation-triangle me-2"></i>
                                    <span class="module-title" data-key="accessDenied">${this.t('accessDenied')}</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
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
        
        const t = this.t.bind(this);
        
        // Genereer recente rassen knoppen
        let recentBreedsHTML = '';
        if (this.lastBreeds && this.lastBreeds.length > 0) {
            recentBreedsHTML = `
                <div class="recent-col">
                    <span class="recent-breeds-label">${t('recent')}</span>
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
        
        return `
            <div class="modal fade" id="dogDataModal" tabindex="-1" aria-labelledby="dogDataModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dogDataModalLabel">
                                <i class="bi bi-pencil-square me-2"></i>
                                <span class="module-title" data-key="editDogData">${t('editDogData')}</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Zoek gedeelte -->
                            <div id="searchSection" class="mb-4">
                                <div class="card">
                                    <div class="card-header bg-light">
                                        <i class="bi bi-search me-2"></i>${t('searchDog')}
                                    </div>
                                    <div class="card-body">
                                        <div class="mb-3">
                                            <label for="dogSearch" class="form-label fw-semibold">${t('searchPlaceholder')}</label>
                                            <input type="text" class="form-control form-control-lg" id="dogSearch" 
                                                   placeholder="${t('searchPlaceholder')}"
                                                   autocomplete="off">
                                            <div class="form-text mt-1">${t('typeToSearch')}</div>
                                        </div>
                                        <div id="searchResults" style="max-height: 400px; overflow-y: auto;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Bewerk gedeelte (verborgen initieel) -->
                            <div id="editSection" style="display: none;">
                                <form id="editDogForm">
                                    <input type="hidden" id="dogId">
                                    <!-- BELANGRIJK: Gebruik Nederlandse veldnamen zoals in database -->
                                    <input type="hidden" id="vader_id" value="">
                                    <input type="hidden" id="moeder_id" value="">
                                    
                                    <div class="alert alert-info mb-3">
                                        <i class="bi bi-pencil"></i> 
                                        <span class="fw-semibold">${t('editingDog')}:</span> 
                                        <span id="editingDogName" class="fw-bold text-primary"></span>
                                    </div>
                                    
                                    <!-- Rij 1: Naam en Kennelnaam -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="dogName" class="form-label fw-semibold">${t('nameRequired')}</label>
                                                <input type="text" class="form-control" id="dogName" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="kennelName" class="form-label fw-semibold">${t('kennelName')}</label>
                                                <input type="text" class="form-control" id="kennelName">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 2: Stamboomnummer en Geslacht -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="pedigreeNumber" class="form-label fw-semibold">${t('pedigreeNumber')}</label>
                                                <input type="text" class="form-control" id="pedigreeNumber" required>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="gender" class="form-label fw-semibold">${t('gender')}</label>
                                                <select class="form-select" id="gender">
                                                    <option value="">${t('chooseGender')}</option>
                                                    <option value="reuen">${t('male')}</option>
                                                    <option value="teven">${t('female')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 3: Ras, Recente rassen en Vachtkleur -->
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="ras-vachtkleur-row">
                                                <!-- Ras invoerveld -->
                                                <div class="ras-col">
                                                    <label for="breed" class="form-label fw-semibold">${t('breedRequired')}</label>
                                                    <input type="text" class="form-control" id="breed" required>
                                                </div>
                                                
                                                <!-- Recente rassen sectie -->
                                                ${recentBreedsHTML}
                                                
                                                <!-- Vachtkleur invoerveld -->
                                                <div class="vachtkleur-col">
                                                    <label for="coatColor" class="form-label fw-semibold">${t('coatColor')}</label>
                                                    <input type="text" class="form-control" id="coatColor">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 4: Vader en Moeder (naast elkaar) -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3 parent-input-wrapper">
                                                <label for="father" class="form-label fw-semibold">${t('father')}</label>
                                                <input type="text" class="form-control parent-search-input" id="father" 
                                                       placeholder="Typ naam of 'naam kennelnaam'..."
                                                       data-parent-type="vader"
                                                       autocomplete="off">
                                                <div id="fatherAutocomplete" class="parent-autocomplete-dropdown"></div>
                                                <div class="form-text mt-1">${t('typeToSearch')}</div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3 parent-input-wrapper">
                                                <label for="mother" class="form-label fw-semibold">${t('mother')}</label>
                                                <input type="text" class="form-control parent-search-input" id="mother" 
                                                       placeholder="Typ naam of 'naam kennelnaam'..."
                                                       data-parent-type="moeder"
                                                       autocomplete="off">
                                                <div id="motherAutocomplete" class="parent-autocomplete-dropdown"></div>
                                                <div class="form-text mt-1">${t('typeToSearch')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 5: Geboortedatum en Overlijdensdatum -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3 date-input-wrapper">
                                                <label for="birthDate" class="form-label fw-semibold">${t('birthDate')}</label>
                                                <input type="date" class="form-control" id="birthDate" 
                                                       placeholder="DD-MM-JJJJ"
                                                       data-original-value="">
                                                <div id="birthDateError" class="error-message" style="display: none;"></div>
                                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3 date-input-wrapper">
                                                <label for="deathDate" class="form-label fw-semibold">${t('deathDate')}</label>
                                                <input type="date" class="form-control" id="deathDate" 
                                                       placeholder="DD-MM-JJJJ"
                                                       data-original-value="">
                                                <div id="deathDateError" class="error-message" style="display: none;"></div>
                                                <small class="form-text text-muted">Voer datum in als DD-MM-JJJJ (bijv. 15-01-2023)</small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 6: Heupdysplasie, Elleboogdysplasie, Patella Luxatie -->
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="hipDysplasia" class="form-label fw-semibold">${t('hipDysplasia')}</label>
                                                <select class="form-select" id="hipDysplasia">
                                                    <option value="">${t('hipGrades')}</option>
                                                    <option value="A">${t('hipA')}</option>
                                                    <option value="B">${t('hipB')}</option>
                                                    <option value="C">${t('hipC')}</option>
                                                    <option value="D">${t('hipD')}</option>
                                                    <option value="E">${t('hipE')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="elbowDysplasia" class="form-label fw-semibold">${t('elbowDysplasia')}</label>
                                                <select class="form-select" id="elbowDysplasia">
                                                    <option value="">${t('elbowGrades')}</option>
                                                    <option value="0">${t('elbow0')}</option>
                                                    <option value="1">${t('elbow1')}</option>
                                                    <option value="2">${t('elbow2')}</option>
                                                    <option value="3">${t('elbow3')}</option>
                                                    <option value="NB">${t('elbowNB')}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label for="patellaLuxation" class="form-label fw-semibold">${t('patellaLuxation')}</label>
                                                <select class="form-select" id="patellaLuxation">
                                                    <option value="">${t('patellaGrades')}</option>
                                                    <option value="0">${t('patella0')}</option>
                                                    <option value="1">${t('patella1')}</option>
                                                    <option value="2">${t('patella2')}</option>
                                                    <option value="3">${t('patella3')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 7: Ogen en Dandy Walker -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="eyes" class="form-label fw-semibold">${t('eyes')}</label>
                                                <select class="form-select" id="eyes">
                                                    <option value="">${t('choose')}</option>
                                                    <option value="Vrij">${t('eyesFree')}</option>
                                                    <option value="Distichiasis">${t('eyesDistichiasis')}</option>
                                                    <option value="Overig">${t('eyesOther')}</option>
                                                </select>
                                            </div>
                                            <div class="mb-3" id="eyesExplanationContainer" style="display: none;">
                                                <label for="eyesExplanation" class="form-label fw-semibold">${t('eyesExplanation')}</label>
                                                <input type="text" class="form-control" id="eyesExplanation">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="dandyWalker" class="form-label fw-semibold">${t('dandyWalker')}</label>
                                                <select class="form-select" id="dandyWalker">
                                                    <option value="">${t('dandyOptions')}</option>
                                                    <option value="Vrij op DNA">${t('dandyFreeDNA')}</option>
                                                    <option value="Vrij op ouders">${t('dandyFreeParents')}</option>
                                                    <option value="Drager">${t('dandyCarrier')}</option>
                                                    <option value="Lijder">${t('dandyAffected')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Rij 8: Schildklier en Land/Postcode -->
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="thyroid" class="form-label fw-semibold">${t('thyroid')}</label>
                                                <select class="form-select" id="thyroid">
                                                    <option value="">${t('choose')}</option>
                                                    <option value="Negatief">${t('thyroidNegative')}</option>
                                                    <option value="Positief">${t('thyroidPositive')}</option>
                                                </select>
                                            </div>
                                            <div class="mb-3" id="thyroidExplanationContainer" style="display: none;">
                                                <label for="thyroidExplanation" class="form-label fw-semibold">${t('thyroidExplanation')}</label>
                                                <input type="text" class="form-control" id="thyroidExplanation">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="country" class="form-label fw-semibold">${t('country')}</label>
                                                        <input type="text" class="form-control" id="country">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <label for="zipCode" class="form-label fw-semibold">${t('zipCode')}</label>
                                                        <input type="text" class="form-control" id="zipCode">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Foto uploaden -->
                                    <div class="mb-3">
                                        <label for="dogPhoto" class="form-label fw-semibold">${t('addPhoto')}</label>
                                        <div class="input-group">
                                            <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                                            <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                                        </div>
                                        <div class="form-text">${t('noFileChosen')}</div>
                                    </div>
                                    
                                    <!-- Opmerkingen -->
                                    <div class="mb-3">
                                        <label for="remarks" class="form-label fw-semibold">${t('remarks')}</label>
                                        <textarea class="form-control" id="remarks" rows="3"></textarea>
                                    </div>
                                    
                                    <div class="alert alert-warning">
                                        <i class="bi bi-exclamation-triangle me-2"></i>
                                        ${t('requiredFields')}
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" id="cancelEditBtn" style="display: none;">
                                <i class="bi bi-arrow-left me-1"></i>${t('cancel')}
                            </button>
                            <button type="button" class="btn btn-danger" id="deleteDogBtn" style="display: none;">
                                <i class="bi bi-trash me-1"></i>${t('deleteDog')}
                            </button>
                            <button type="button" class="btn btn-success" id="saveChangesBtn" style="display: none;">
                                <i class="bi bi-check-circle me-1"></i>${t('saveChanges')}
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i>
                                <span class="module-text" data-key="close">${t('close')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                /* Desktop layout */
                .ras-vachtkleur-row {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: flex-start;
                    gap: 15px;
                    width: 100%;
                    margin-bottom: 15px;
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
                
                .ras-col .form-label,
                .vachtkleur-col .form-label {
                    margin-bottom: 8px;
                    display: block;
                    height: 19px;
                    line-height: 19px;
                }
                
                /* Mobiele optimalisaties */
                @media (max-width: 768px) {
                    .ras-vachtkleur-row {
                        flex-direction: column !important;
                        gap: 10px !important;
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
                
                .search-result-item {
                    padding: 12px;
                    border-bottom: 1px solid #dee2e6;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    border-radius: 6px;
                    margin-bottom: 6px;
                    border: 1px solid transparent;
                }
                
                .search-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #dee2e6;
                }
                
                .search-result-item.selected {
                    background-color: #e3f2fd;
                    border-color: #0d6efd;
                    border-left: 4px solid #0d6efd;
                }
                
                .search-result-item .dog-name {
                    font-weight: 600;
                    font-size: 1rem;
                    color: #212529;
                }
                
                .search-result-item .dog-info {
                    font-size: 0.85rem;
                    color: #6c757d;
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-top: 4px;
                }
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                    font-weight: 500;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1050;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    width: 100%;
                }
                
                .autocomplete-item {
                    padding: 10px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #212529;
                    margin-bottom: 2px;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.8rem;
                    color: #666;
                }
                
                .parent-input-wrapper {
                    position: relative;
                }
                
                #dogSearch {
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: border-color 0.3s;
                }
                
                #dogSearch:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                .parent-search-input {
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: border-color 0.3s;
                }
                
                .parent-search-input:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                #editDogForm .form-control:focus,
                #editDogForm .form-select:focus {
                    border-color: #198754;
                    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
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
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Parent dropdown styling */
                .parent-autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1060;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    width: 100%;
                    top: calc(100% + 2px);
                    left: 0;
                    display: none;
                }
                
                .parent-autocomplete-item {
                    padding: 8px 12px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                    transition: background-color 0.2s;
                }
                
                .parent-autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .parent-autocomplete-item .dog-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #212529;
                    margin-bottom: 2px;
                }
                
                .parent-autocomplete-item .dog-info {
                    font-size: 0.8rem;
                    color: #666;
                }
            </style>
        `;
    }
    
    /**
     * Setup event listeners voor deze module
     */
    setupEvents() {
        console.log('DogDataManager setupEvents called');
        
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
            const modal = document.getElementById('dogDataModal');
            if (modal) {
                modal.addEventListener('shown.bs.modal', () => {
                    console.log('DogDataModal is nu zichtbaar (toegang geweigerd)');
                });
            }
            return;
        }
        
        // Laad alle honden voor autocomplete
        this.loadAllDogs();
        
        // Zoekveld event listener
        const searchInput = document.getElementById('dogSearch');
        if (searchInput) {
            searchInput.addEventListener('focus', async () => {
                if (this.allDogs.length === 0) {
                    await this.loadAllDogs();
                }
            });
            
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                if (searchTerm.length >= 1) {
                    this.filterDogsForSearchField(searchTerm);
                } else {
                    this.showInitialView();
                }
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.filteredSearchResults && this.filteredSearchResults.length > 0) {
                    e.preventDefault();
                    this.selectDogForEditing(this.filteredSearchResults[0].id);
                }
            });
        }
        
        // Cancel knop
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.showSearchSection();
            });
        }
        
        // Save knop
        const saveBtn = document.getElementById('saveChangesBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveDogChanges();
            });
        }
        
        // Delete knop
        const deleteBtn = document.getElementById('deleteDogBtn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteDog();
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
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) {
                    breedInput.value = breed;
                }
            }
        });
        
        // Setup autocomplete voor ouders
        this.setupParentAutocomplete();
        
        // Setup datum velden voor correcte verwerking
        this.setupDateFields();
        
        // Setup datum validatie
        this.setupDateValidation();
        
        // Vertaal de modal tekst
        setTimeout(() => {
            this.translateModal();
        }, 100);
    }
    
    /**
     * Setup datum velden voor correcte verwerking
     */
    setupDateFields() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        
        if (birthDateInput) {
            birthDateInput.type = 'date';
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
     * Laad alle honden voor autocomplete
     */
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                console.log('DogDataManager: Laden van alle honden met paginatie...');
                
                // Reset array
                this.allDogs = [];
                
                let currentPage = 1;
                const pageSize = 1000; // Maximaal wat Supabase toestaat
                let hasMorePages = true;
                
                // Toon progress in UI
                this.showProgress(`Honden laden... (0 geladen)`);
                
                // Loop door alle pagina's
                while (hasMorePages) {
                    console.log(`Laden pagina ${currentPage}...`);
                    
                    // Gebruik de getHonden() methode van je hondenService
                    const result = await hondenService.getHonden(currentPage, pageSize);
                    
                    if (result.honden && result.honden.length > 0) {
                        // Voeg honden toe aan array
                        this.allDogs = this.allDogs.concat(result.honden);
                        
                        // Update progress
                        this.showProgress(`Honden laden... (${this.allDogs.length} geladen)`);
                        
                        console.log(`Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                        
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
                
                this.hideProgress();
                console.log(`DogDataManager: TOTAAL ${this.allDogs.length} honden geladen voor zoeken`);
                
                // DEBUG logging
                if (this.allDogs.length > 0) {
                    console.log('Eerste hond:', this.allDogs[0].naam);
                    console.log('Laatste hond:', this.allDogs[this.allDogs.length - 1].naam);
                }
                
            } catch (error) {
                this.hideProgress();
                console.error('Fout bij laden honden voor zoeken:', error);
                this.showError(this.t('loadFailed') + error.message);
                this.allDogs = []; // Reset op error
            }
        }
    }
    
    /**
     * Zoekfunctionaliteit voor hoofdzoekveld
     */
    filterDogsForSearchField(searchTerm = '') {
        // DEBUG: Controleer of we honden hebben
        console.log(`Zoeken naar '${searchTerm}' in ${this.allDogs.length} geladen honden`);
        
        if (this.allDogs.length === 0) {
            console.error('Geen honden geladen!');
            this.filteredSearchResults = [];
            this.displaySearchResults();
            return;
        }
        
        // Filter honden zoals bij ouders: zoek in naam + kennelnaam EN stamboomnummer
        this.filteredSearchResults = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            const stamboomnr = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
            
            // Combineer naam en kennelnaam voor zoeken (zoals bij ouders)
            const fullName = `${naam} ${kennelnaam}`.trim().toLowerCase();
            
            // Controleer op naam + kennelnaam (zoals bij ouders)
            const nameMatch = fullName.includes(searchTerm);
            
            // Controleer op stamboomnummer
            const stamboomMatch = stamboomnr.includes(searchTerm);
            
            return nameMatch || stamboomMatch;
        });
        
        console.log(`Zoeken naar '${searchTerm}': ${this.filteredSearchResults.length} resultaten gevonden`);
        this.displaySearchResults();
    }
    
    /**
     * Toon initiële view voor zoeken
     */
    showInitialView() {
        const container = document.getElementById('searchResults');
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                <small class="text-muted">${this.allDogs.length} honden geladen</small>
            </div>
        `;
    }
    
    /**
     * Display search results
     */
    displaySearchResults() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (this.filteredSearchResults.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${t('noResults')}</p>
                    <small class="text-muted">Zoekopdracht in ${this.allDogs.length} honden</small>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${t('searchResults')}: <strong>${this.filteredSearchResults.length}</strong>
                <span class="ms-3 text-muted">(uit ${this.allDogs.length} geladen honden)</span>
            </div>
        `;
        
        this.filteredSearchResults.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            
            const coatColorText = dog.vachtkleur ? `<span><i class="bi bi-palette me-1"></i>${dog.vachtkleur}</span>` : '';
            
            html += `
                <div class="search-result-item" data-id="${dog.id}">
                    <div class="dog-name">${dog.naam || 'Onbekend'} ${dog.kennelnaam ? dog.kennelnaam : ''}</div>
                    <div class="dog-info">
                        ${dog.ras ? `
                        <span><i class="bi bi-tag me-1"></i>${dog.ras}</span>
                        ` : ''}
                        
                        ${dog.stamboomnr ? `
                        <span><i class="bi bi-hash me-1"></i>${dog.stamboomnr}</span>
                        ` : ''}
                        
                        ${coatColorText}
                        
                        <span><i class="bi bi-gender-ambiguous me-1"></i>${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Voeg click event listeners toe aan zoekresultaten
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                this.selectDogForEditing(dogId);
            });
        });
    }
    
    /**
     * Selecteer hond voor bewerking
     */
    async selectDogForEditing(dogId) {
        try {
            console.log(`Selecting dog with ID: ${dogId}`);
            
            if (!dogId || isNaN(dogId)) {
                this.showError(this.t('invalidId'));
                return;
            }
            
            // DEBUG: Controleer of hond in geladen lijst staat
            const foundInList = this.allDogs.some(d => d.id === dogId);
            console.log(`Hond ID ${dogId} gevonden in geladen lijst: ${foundInList}`);
            
            if (!foundInList) {
                console.warn(`Hond ID ${dogId} niet gevonden in ${this.allDogs.length} geladen honden`);
                
                // Als we minder dan 1153 honden hebben, probeer dan opnieuw te laden
                if (this.allDogs.length < 1153) {
                    console.warn('Mogelijk ontbreken er honden - probeer opnieuw te laden');
                    this.allDogs = []; // Reset cache
                    await this.loadAllDogs();
                }
            }
            
            // Markeer geselecteerd item in zoekresultaten
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === dogId) {
                    item.classList.add('selected');
                }
            });
            
            // Zoek in lokale cache eerst
            let dog = this.allDogs.find(d => d.id === dogId);
            
            if (!dog) {
                // Probeer direct uit database te laden als specifieke methode beschikbaar is
                if (hondenService && typeof hondenService.getHondById === 'function') {
                    console.log(`Probeer hond ${dogId} direct uit database te laden`);
                    dog = await hondenService.getHondById(dogId);
                    
                    if (dog) {
                        // Voeg toe aan cache
                        this.allDogs.push(dog);
                        this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
                        console.log(`Hond ${dogId} toegevoegd aan cache. Totaal: ${this.allDogs.length}`);
                    }
                }
            }
            
            if (!dog) {
                this.showError(this.t('dogNotFound'));
                return;
            }
            
            this.selectedDog = dog;
            this.currentDogId = dogId;
            
            // Vul formulier met hond data
            this.fillFormWithDogData(dog);
            
            // Toon bewerk sectie en knoppen
            this.showEditSection();
            
            this.showSuccess(`${this.t('dogSelected')}: ${dog.naam}`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Fout bij selecteren hond:', error);
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    /**
     * Hulpfunctie: Maak een display naam (naam + kennelnaam)
     */
    makeDisplayName(dog) {
        if (!dog) return '';
        
        let displayName = dog.naam || '';
        if (dog.kennelnaam && dog.kennelnaam.trim()) {
            displayName += ` ${dog.kennelnaam}`;
        }
        
        return displayName.trim();
    }
    
    /**
     * Vul formulier met hond data - MET CORRECTE OUDER ID'S IN HET NEDERLANDS
     */
    fillFormWithDogData(dog) {
        console.log('Filling form with dog data:', dog);
        console.log('vader_id in data:', dog.vader_id);
        console.log('moeder_id in data:', dog.moeder_id);
        
        // Basis velden
        document.getElementById('dogId').value = dog.id || '';
        document.getElementById('dogName').value = dog.naam || '';
        document.getElementById('kennelName').value = dog.kennelnaam || '';
        document.getElementById('pedigreeNumber').value = dog.stamboomnr || '';
        document.getElementById('breed').value = dog.ras || '';
        document.getElementById('gender').value = dog.geslacht || '';
        
        // Vachtkleur
        document.getElementById('coatColor').value = dog.vachtkleur || '';
        
        // Ouders - CORRECT ID'S OPSLAAN IN HET NEDERLANDS (vader_id en moeder_id)
        const vaderId = dog.vader_id || null;
        let vaderDisplayNaam = '';
        
        if (vaderId) {
            const vaderHond = this.allDogs.find(d => d.id === vaderId);
            if (vaderHond) {
                vaderDisplayNaam = this.makeDisplayName(vaderHond);
            } else {
                vaderDisplayNaam = dog.vader || '';
            }
            // Sla ID op in het verborgen veld
            document.getElementById('vader_id').value = vaderId;
            console.log(`Vader ID gevuld: ${vaderId} (display: ${vaderDisplayNaam})`);
        } else {
            vaderDisplayNaam = dog.vader || '';
            document.getElementById('vader_id').value = '';
            console.log('Geen vader ID gevonden in database, gebruik tekst:', vaderDisplayNaam);
        }
        
        const moederId = dog.moeder_id || null;
        let moederDisplayNaam = '';
        
        if (moederId) {
            const moederHond = this.allDogs.find(d => d.id === moederId);
            if (moederHond) {
                moederDisplayNaam = this.makeDisplayName(moederHond);
            } else {
                moederDisplayNaam = dog.moeder || '';
            }
            // Sla ID op in het verborgen veld
            document.getElementById('moeder_id').value = moederId;
            console.log(`Moeder ID gevuld: ${moederId} (display: ${moederDisplayNaam})`);
        } else {
            moederDisplayNaam = dog.moeder || '';
            document.getElementById('moeder_id').value = '';
            console.log('Geen moeder ID gevonden in database, gebruik tekst:', moederDisplayNaam);
        }
        
        document.getElementById('father').value = vaderDisplayNaam;
        document.getElementById('mother').value = moederDisplayNaam;
        
        // Datums
        const formatDateForDisplay = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch (e) {
                return dateString;
            }
        };
        
        document.getElementById('birthDate').value = formatDateForDisplay(dog.geboortedatum);
        document.getElementById('birthDate').setAttribute('data-original-value', formatDateForDisplay(dog.geboortedatum));
        
        document.getElementById('deathDate').value = formatDateForDisplay(dog.overlijdensdatum);
        document.getElementById('deathDate').setAttribute('data-original-value', formatDateForDisplay(dog.overlijdensdatum));
        
        // Gezondheidsinformatie
        document.getElementById('hipDysplasia').value = dog.heupdysplasie || '';
        document.getElementById('elbowDysplasia').value = dog.elleboogdysplasie || '';
        document.getElementById('patellaLuxation').value = dog.patella || '';
        document.getElementById('eyes').value = dog.ogen || '';
        document.getElementById('eyesExplanation').value = dog.ogenverklaring || '';
        document.getElementById('dandyWalker').value = dog.dandyWalker || '';
        document.getElementById('thyroid').value = dog.schildklier || '';
        document.getElementById('thyroidExplanation').value = dog.schildklierverklaring || '';
        
        // Locatie
        document.getElementById('country').value = dog.land || '';
        document.getElementById('zipCode').value = dog.postcode || '';
        
        // Opmerkingen
        document.getElementById('remarks').value = dog.opmerkingen || '';
        
        // Toon titel
        const dogNameElement = document.getElementById('editingDogName');
        if (dogNameElement) {
            dogNameElement.textContent = dog.naam || this.t('unknown');
        }
        
        // Toon/verberg uitleg velden
        const eyesExplanationContainer = document.getElementById('eyesExplanationContainer');
        const thyroidExplanationContainer = document.getElementById('thyroidExplanationContainer');
        
        if (eyesExplanationContainer) {
            eyesExplanationContainer.style.display = (dog.ogen === 'Overig') ? 'block' : 'none';
        }
        if (thyroidExplanationContainer) {
            thyroidExplanationContainer.style.display = (dog.schildklier === 'Positief') ? 'block' : 'none';
        }
    }
    
    /**
     * Toon bewerk sectie
     */
    showEditSection() {
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('editSection').style.display = 'block';
        
        document.getElementById('cancelEditBtn').style.display = 'inline-block';
        document.getElementById('saveChangesBtn').style.display = 'inline-block';
        document.getElementById('deleteDogBtn').style.display = 'inline-block';
        
        // Zet de dropdowns terug op
        this.setupParentAutocomplete();
        
        // Zorg dat datum velden correct zijn ingesteld
        this.setupDateFields();
    }
    
    /**
     * Toon zoek sectie
     */
    showSearchSection() {
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('editSection').style.display = 'none';
        
        document.getElementById('cancelEditBtn').style.display = 'none';
        document.getElementById('saveChangesBtn').style.display = 'none';
        document.getElementById('deleteDogBtn').style.display = 'none';
        
        // Wis formulier
        const form = document.getElementById('editDogForm');
        if (form) {
            form.reset();
        }
        
        // Wis hidden inputs
        document.getElementById('dogId').value = '';
        document.getElementById('vader_id').value = '';
        document.getElementById('moeder_id').value = '';
        
        // Reset datum velden naar date type
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
        
        this.selectedDog = null;
        this.currentDogId = null;
        
        // Herlaad zoekresultaten
        const searchInput = document.getElementById('dogSearch');
        if (searchInput && searchInput.value) {
            this.filterDogsForSearchField(searchInput.value);
        }
    }
    
    /**
     * Opslaan wijzigingen - MET VERBETERDE DEBUGGING EN ERROR HANDLING
     */
    async saveDogChanges() {
        if (!auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        // Valideer datums eerst
        if (!this.validateDates()) {
            this.showError(this.t('dateFormatError'));
            return;
        }
        
        const dogId = document.getElementById('dogId').value;
        if (!dogId) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        const parsedId = parseInt(dogId);
        if (isNaN(parsedId)) {
            this.showError(this.t('invalidId'));
            return;
        }
        
        // Haal datum waarden op
        const birthDateValue = document.getElementById('birthDate').value;
        const deathDateValue = document.getElementById('deathDate').value;
        
        // Formatteer datums voor opslag (YYYY-MM-DD formaat)
        const formatDateForStorage = (dateString) => {
            if (!dateString) return null;
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return null;
                
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch (e) {
                return null;
            }
        };
        
        // Haal ouder IDs op - CORRECT VAN HET NEDERLANDSE HIDDEN INPUT VELD
        const vaderIdValue = document.getElementById('vader_id').value;
        const moederIdValue = document.getElementById('moeder_id').value;
        
        // OPGELOST: Gebruik de correcte oplossing voor parseInt probleem
        const vader_id = vaderIdValue && vaderIdValue.trim() !== '' && !isNaN(parseInt(vaderIdValue)) 
            ? parseInt(vaderIdValue) 
            : null;
        
        const moeder_id = moederIdValue && moederIdValue.trim() !== '' && !isNaN(parseInt(moederIdValue)) 
            ? parseInt(moederIdValue) 
            : null;
        
        // CONSOLE LOGGING VOOR DEBUGGING
        console.log('=== OUDER ID LOGGING ===');
        console.log('Vader ID uit hidden veld (vader_id):', vaderIdValue, '(geparsed:', vader_id, ')');
        console.log('Moeder ID uit hidden veld (moeder_id):', moederIdValue, '(geparsed:', moeder_id, ')');
        console.log('=== EINDE LOGGING ===');
        
        // Zoek ouder namen op basis van IDs
        let vader = '';
        let moeder = '';
        
        if (vader_id) {
            const vaderHond = this.allDogs.find(d => d.id === vader_id);
            vader = vaderHond ? vaderHond.naam || '' : '';
            console.log(`Vader gevonden: ID=${vader_id}, Naam=${vader}`);
        } else {
            console.log('Geen vader ID opgegeven, gebruik tekst uit input veld');
            vader = document.getElementById('father').value.split(' ')[0] || '';
        }
        
        if (moeder_id) {
            const moederHond = this.allDogs.find(d => d.id === moeder_id);
            moeder = moederHond ? moederHond.naam || '' : '';
            console.log(`Moeder gevonden: ID=${moeder_id}, Naam=${moeder}`);
        } else {
            console.log('Geen moeder ID opgegeven, gebruik tekst uit input veld');
            moeder = document.getElementById('mother').value.split(' ')[0] || '';
        }
        
        // Verzamel alle data voor update
        const dogData = {
            id: parsedId,
            naam: document.getElementById('dogName').value.trim(),
            kennelnaam: document.getElementById('kennelName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            vachtkleur: document.getElementById('coatColor').value.trim(),
            geslacht: document.getElementById('gender').value,
            vader: vader,
            vader_id: vader_id,
            moeder: moeder,
            moeder_id: moeder_id,
            geboortedatum: formatDateForStorage(birthDateValue),
            overlijdensdatum: formatDateForStorage(deathDateValue),
            heupdysplasie: document.getElementById('hipDysplasia').value || null,
            elleboogdysplasie: document.getElementById('elbowDysplasia').value || null,
            patella: document.getElementById('patellaLuxation').value || null,
            ogen: document.getElementById('eyes').value || null,
            ogenverklaring: document.getElementById('eyesExplanation')?.value.trim() || null,
            dandyWalker: document.getElementById('dandyWalker').value || null,
            schildklier: document.getElementById('thyroid').value || null,
            schildklierverklaring: document.getElementById('thyroidExplanation')?.value.trim() || null,
            land: document.getElementById('country').value.trim() || null,
            postcode: document.getElementById('zipCode').value.trim() || null,
            opmerkingen: document.getElementById('remarks').value.trim() || null,
            updatedat: new Date().toISOString()
        };
        
        // DEBUG: Toon de data die wordt verzonden
        console.log('=== DATA VOOR UPDATE ===');
        console.log('Dog ID:', dogData.id);
        console.log('Naam:', dogData.naam);
        console.log('Vader ID:', dogData.vader_id, 'Type:', typeof dogData.vader_id);
        console.log('Moeder ID:', dogData.moeder_id, 'Type:', typeof dogData.moeder_id);
        console.log('Volledige data:', JSON.stringify(dogData, null, 2));
        console.log('=== EINDE DATA ===');
        
        // Valideer verplichte velden
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingChanges'));
        
        try {
            // DEBUG: Controleer of hondenService beschikbaar is
            console.log('hondenService beschikbaar:', !!hondenService);
            console.log('updateHond methode beschikbaar:', typeof hondenService?.updateHond);
            
            if (!hondenService || typeof hondenService.updateHond !== 'function') {
                throw new Error('hondenService.updateHond is niet beschikbaar');
            }
            
            // Roep de update methode aan
            console.log('Aanroepen updateHond voor ID:', dogData.id);
            const result = await hondenService.updateHond(dogData);
            
            console.log('Update resultaat:', result);
            
            if (!result) {
                throw new Error('Geen resultaat van update operatie');
            }
            
            if (result.error) {
                throw new Error(result.error.message || 'Update mislukt');
            }
            
            this.hideProgress();
            this.showSuccess(this.t('dogUpdated'));
            
            // Foto uploaden als er een is geselecteerd
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput && photoInput.files.length > 0) {
                try {
                    await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
                } catch (photoError) {
                    console.warn('Foto upload mislukt:', photoError);
                }
            }
            
            // Update lokale cache
            const index = this.allDogs.findIndex(d => d.id === dogData.id);
            if (index !== -1) {
                this.allDogs[index] = { ...this.allDogs[index], ...dogData };
            } else {
                this.allDogs.push(dogData);
                this.allDogs.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
            }
            
            // Refresh zoekresultaten als nodig
            const searchInput = document.getElementById('dogSearch');
            if (searchInput && searchInput.value) {
                this.filterDogsForSearchField(searchInput.value);
            }
            
            // Terug naar zoeken na succes
            setTimeout(() => {
                this.showSearchSection();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Fout bij opslaan wijzigingen:', error);
            
            // Bepaal het type fout voor een betere foutmelding
            let errorMessage = this.t('updateFailed');
            
            if (error.message.includes('permission') || error.message.includes('auth') || error.message.includes('recht')) {
                errorMessage += ' Toegang geweigerd. Controleer uw administrator rechten.';
            } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('internet')) {
                errorMessage += ' Netwerkfout. Controleer uw internetverbinding.';
            } else if (error.message.includes('unique') || error.message.includes('duplicate')) {
                errorMessage += ' Stamboomnummer bestaat al.';
            } else {
                errorMessage += ' ' + error.message;
            }
            
            this.showError(errorMessage);
        }
    }
    
    /**
     * Verwijder hond
     */
    async deleteDog() {
        if (!auth.isAdmin()) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        const dogId = document.getElementById('dogId').value;
        if (!dogId) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        const parsedId = parseInt(dogId);
        if (isNaN(parsedId)) {
            this.showError(this.t('invalidId'));
            return;
        }
        
        const dogName = document.getElementById('dogName').value;
        
        if (!confirm(`${this.t('confirmDelete')}\n\n${dogName} (ID: ${parsedId})`)) {
            return;
        }
        
        this.showProgress(this.t('deleting'));
        
        try {
            // Gebruik de verwijderHond methode van de hondenService
            if (hondenService && typeof hondenService.verwijderHond === 'function') {
                console.log('Calling verwijderHond with ID:', parsedId);
                await hondenService.verwijderHond(parsedId);
            } else {
                throw new Error('Geen geschikte delete methode gevonden in hondenService');
            }
            
            this.hideProgress();
            this.showSuccess(`${this.t('dogDeleted')}: ${dogName}`);
            
            // Update lokale cache
            this.allDogs = this.allDogs.filter(d => d.id !== parsedId);
            
            // Terug naar zoeken
            setTimeout(() => {
                this.showSearchSection();
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error deleting dog:', error);
            this.showError(`${this.t('deleteFailed')}${error.message}`);
        }
    }
    
    /**
     * Upload foto
     */
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
                        
                        if (fotoService && typeof fotoService.voegFotoToe === 'function') {
                            await fotoService.voegFotoToe(photoData);
                            this.showSuccess(this.t('photoAdded'));
                            resolve();
                        } else {
                            console.warn('voegFotoToe methode niet beschikbaar in fotoService');
                            resolve();
                        }
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
    
    /**
     * Setup autocomplete voor ouders - MET CORRECTE NEDERLANDSE ID OPSLAG EN CONSOLE LOGGING
     */
    setupParentAutocomplete() {
        // Event listeners voor vader en moeder velden
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        
        if (fatherInput) {
            this.setupSingleParentAutocomplete(fatherInput, 'father', 'vader_id');
        }
        
        if (motherInput) {
            this.setupSingleParentAutocomplete(motherInput, 'mother', 'moeder_id');
        }
    }
    
    /**
     * Setup autocomplete voor een individueel ouder veld
     */
    setupSingleParentAutocomplete(inputElement, parentField, hiddenIdField) {
        // Verwijder bestaande event listeners
        const oldInput = inputElement.cloneNode(true);
        inputElement.parentNode.replaceChild(oldInput, inputElement);
        inputElement = oldInput;
        
        inputElement.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadAllDogs();
            }
            
            const searchTerm = inputElement.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.showParentAutocomplete(searchTerm, parentField);
            }
        });
        
        inputElement.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.showParentAutocomplete(searchTerm, parentField);
            } else {
                this.hideParentAutocomplete(parentField);
                // Reset hidden ID als het veld leeg is
                document.getElementById(hiddenIdField).value = '';
                console.log(`${hiddenIdField} gereset omdat input veld leeg is`);
            }
        });
        
        inputElement.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideParentAutocomplete(parentField);
            }, 200);
        });
    }
    
    /**
     * Toon parent autocomplete - MET NEDERLANDSE ID OPSLAG EN CONSOLE LOGGING
     */
    showParentAutocomplete(searchTerm, parentField) {
        const input = document.getElementById(parentField);
        const hiddenIdField = parentField === 'father' ? 'vader_id' : 'moeder_id';
        
        if (!input) return;
        
        // Zoek de dropdown
        let dropdown = document.getElementById(`${parentField}Autocomplete`);
        
        // Filter honden voor autocomplete - ALLEEN DIE BEGINT MET ZOEKTERM
        const suggestions = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            
            // Combineer naam en kennelnaam voor zoeken
            const fullName = `${naam} ${kennelnaam}`.trim().toLowerCase();
            
            // Controleer of de volledige naam begint met de zoekterm
            const matchesSearch = fullName.startsWith(searchTerm);
            
            // Filter op geslacht
            if (parentField === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else if (parentField === 'mother') {
                return matchesSearch && dog.geslacht === 'teven';
            }
            return matchesSearch;
        });
        
        console.log(`Autocomplete voor ${parentField}: ${suggestions.length} resultaten gevonden voor zoekterm '${searchTerm}'`);
        
        if (suggestions.length === 0) {
            if (dropdown) {
                dropdown.style.display = 'none';
            }
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                             dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            const displayName = dog.naam ? `${dog.naam} ${dog.kennelnaam ? dog.kennelnaam : ''}`.trim() : 'Onbekend';
            
            html += `
                <div class="parent-autocomplete-item" 
                     data-id="${dog.id}" 
                     data-name="${dog.naam || ''}" 
                     data-kennelnaam="${dog.kennelnaam || ''}">
                    <div class="dog-name">${displayName}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'} | ${genderText}
                    </div>
                </div>
            `;
        });
        
        if (!dropdown) {
            console.error(`Dropdown ${parentField}Autocomplete niet gevonden!`);
            return;
        }
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Event listeners voor autocomplete items
        dropdown.querySelectorAll('.parent-autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                const dogName = item.getAttribute('data-name');
                const dogKennelnaam = item.getAttribute('data-kennelnaam');
                
                // Vul het input veld met de volledige naam + kennelnaam
                const displayName = dogName ? `${dogName} ${dogKennelnaam ? dogKennelnaam : ''}`.trim() : '';
                input.value = displayName;
                
                // Vul het hidden ID veld - BELANGRIJK: Sla op in het Nederlandse veld
                document.getElementById(hiddenIdField).value = dogId;
                
                // CONSOLE LOGGING
                console.log(`Parent autocomplete geselecteerd: ${parentField}`);
                console.log(`- Hond ID: ${dogId}`);
                console.log(`- Naam: ${dogName}`);
                console.log(`- Kennelnaam: ${dogKennelnaam}`);
                console.log(`- Hidden ID veld (${hiddenIdField}): ${dogId}`);
                console.log(`- Display naam in input: ${displayName}`);
                
                // Verberg de dropdown
                dropdown.style.display = 'none';
                
                // Focus terug op het input veld
                input.focus();
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f8f9fa';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });
        });
    }
    
    /**
     * Verberg parent autocomplete
     */
    hideParentAutocomplete(parentField) {
        const dropdown = document.getElementById(`${parentField}Autocomplete`);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
    
    /**
     * Voeg ras toe aan recente rassen
     */
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
    
    /**
     * Vertaal de modal tekst
     */
    translateModal() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: {
                editDogData: "Data Hond Bewerken",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd"
            },
            en: {
                editDogData: "Edit Dog Data",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied"
            },
            de: {
                editDogData: "Hundedaten bearbeiten",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert"
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
    
    /**
     * Initialiseer de module
     */
    async init() {
        console.log('DogDataManager geïnitialiseerd');
        return true;
    }
    
    /**
     * Hulpmethoden voor UI feedback
     */
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
    window.DogDataManager = DogDataManager;
}