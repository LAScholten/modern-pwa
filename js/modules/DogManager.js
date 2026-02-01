// js/modules/DogManager.js

/**
 * Hond Management Module
 * Beheert toevoegen en bewerken van honden
 * VOLGENS DE DATABASE STRUCTUUR MET LOSSE GEZONDHEIDSVELDEN
 * EXACT ZELFDE ALS DogDataManager.js
 */

class DogManager extends BaseModule {
    constructor() {
        super('dogmanager', 'Hond Beheer');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete van ouders
        this.litterManager = null;
        
        // EXACT DEZELFDE TRANSLATIONS ALS DogDataManager
        this.translations = {
            nl: {
                // Modal titels
                newDog: "Nieuwe Hond Toevoegen",
                editDog: "Hond Bewerken",
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
                selectedFile: "Gekozen bestand: {filename}",
                remarks: "Opmerkingen",
                requiredFields: "Velden met * zijn verplicht",
                saveDog: "Hond Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                choose: "Kies...",
                back: "Terug",
                
                // Validatie
                dateFormatError: "Datum moet in DD-MM-JJJJ formaat zijn",
                deathBeforeBirthError: "Overlijdensdatum kan niet voor geboortedatum zijn",
                
                // Toegangscontrole popup teksten
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om honden toe te voegen. Alleen administrators kunnen deze functie gebruiken.",
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
                photoError: "Fout bij uploaden foto: ",
                
                // Progress messages
                loadingDogs: "Honden laden... ({count} geladen)",
                
                // Status messages
                searchResults: "Zoekresultaten",
                dogSelected: "Hond geselecteerd",
                editingDog: "Bewerken hond",
                savingChanges: "Wijzigingen opslaan...",
                changesSaved: "Wijzigingen opgeslagen!",
                updatingDog: "Hond bijwerken...",
                dogUpdated: "Hond bijgewerkt!",
                deleting: "Verwijderen..."
            },
            en: {
                // EXACT SAME STRUCTURE AS DogDataManager
                newDog: "Add New Dog",
                editDog: "Edit Dog",
                close: "Close",
                refresh: "Refresh Page",
                accessDenied: "Access Denied",
                
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
                selectedFile: "Selected file: {filename}",
                remarks: "Remarks",
                requiredFields: "Fields with * are required",
                saveDog: "Save Dog",
                cancel: "Cancel",
                delete: "Delete",
                choose: "Choose...",
                back: "Back",
                
                dateFormatError: "Date must be in DD-MM-YYYY format",
                deathBeforeBirthError: "Death date cannot be before birth date",
                
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to add dogs. Only administrators can use this function.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                
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
                photoError: "Error uploading photo: ",
                
                loadingDogs: "Loading dogs... ({count} loaded)",
                
                searchResults: "Search results",
                dogSelected: "Dog selected",
                editingDog: "Editing dog",
                savingChanges: "Saving changes...",
                changesSaved: "Changes saved!",
                updatingDog: "Updating dog...",
                dogUpdated: "Dog updated!",
                deleting: "Deleting..."
            },
            de: {
                // EXACT SAME STRUCTURE AS DogDataManager
                newDog: "Neuen Hund hinzufügen",
                editDog: "Hund bearbeiten",
                close: "Schließen",
                refresh: "Seite aktualisieren",
                accessDenied: "Zugriff Verweigert",
                
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
                selectedFile: "Ausgewählte Datei: {filename}",
                remarks: "Bemerkungen",
                requiredFields: "Felder met * sind Pflichtfelder",
                saveDog: "Hund speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                choose: "Wählen...",
                back: "Zurück",
                
                dateFormatError: "Datum moet in DD-MM-JJJJ formaat zijn",
                deathBeforeBirthError: "Sterbedatum kan niet voor geboortedatum sein",
                
                insufficientPermissions: "Unzureichende Berechtigungen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Hunde hinzuzufügen. Nur Administratoren können diese Funktion nutzen.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare Funktionen für Benutzer",
                searchDogs: "Hunde suchen und anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Data importeren/exportieren",
                
                adminOnly: "Nur Administratoren kunnen Hunde hinzufügen/bearbeiten",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse sind Pflichtfelder",
                savingDog: "Hund wordt gespeichert...",
                dogAdded: "Hund erfolgreich hinzugefügt!",
                dogUpdated: "Hund erfolgreich aktualiseerd!",
                dogDeleted: "Hund erfolgreich gelöscht!",
                addFailed: "Fehler beim Hinzufügen des Hundes: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                confirmDelete: "Sind Sie sicher, dat Sie diesen Hund löschen möchten?",
                photoAdded: "Foto hinzugefügt",
                photoError: "Fehler beim Hochladen des Fotos: ",
                
                loadingDogs: "Hunde laden... ({count} geladen)",
                
                searchResults: "Suchergebnisse",
                dogSelected: "Hond ausgewählt",
                editingDog: "Hond bearbeiten",
                savingChanges: "Änderungen speichern...",
                changesSaved: "Änderungen gespeichert!",
                updatingDog: "Hond bijwerken...",
                dogUpdated: "Hond bijgewerkt!",
                deleting: "Verwijderen..."
            }
        };
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        // Vervang placeholders
        for (const [param, value] of Object.entries(params)) {
            text = text.replace(`{${param}}`, value);
        }
        return text;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    getModalHTML(isEdit = false, dogData = null) {
        console.log('DogManager: getModalHTML aangeroepen, isEdit:', isEdit);
        
        // Controleer of gebruiker admin is - EXACT zoals in DogDataManager
        const isAdmin = auth.isAdmin();
        const currentUser = auth.getCurrentUser();
        const userRole = currentUser.role === 'admin' ? 'Admin' : this.t('user');
        
        if (!isAdmin) {
            console.log('DogManager: Gebruiker is geen admin, toon toegang geweigerd scherm');
            const modalId = 'addDogModal';
            
            return `
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header bg-danger text-white">
                                <h5 class="modal-title" id="${modalId}Label">
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
        
        console.log('DogManager: Gebruiker is admin, toon hondenformulier');
        const t = this.t.bind(this);
        const modalTitle = isEdit ? t('editDog') : t('newDog');
        const modalId = 'addDogModal';
        
        return `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="${modalId}Label">
                                <i class="bi bi-plus-circle me-2"></i>
                                <span class="module-title">${modalTitle}</span>
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
                        </div>
                        <div class="modal-body">
                            ${this.getDogFormHTML(dogData, isEdit)}
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
    
    getDogFormHTML(dogData = null, isEdit = false) {
        console.log('DogManager: getDogFormHTML aangeroepen, isEdit:', isEdit);
        const t = this.t.bind(this);
        const data = dogData || {};
        
        // Formatteer datums voor weergave
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
        
        const birthDateValue = formatDateForDisplay(data.geboortedatum);
        const deathDateValue = formatDateForDisplay(data.overlijdensdatum);
        
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
            <form id="addDogForm">
                <!-- BELANGRIJK: Gebruik Nederlandse veldnamen zoals in database en DogDataManager -->
                <input type="hidden" id="vader_id" value="${data.vader_id || ''}">
                <input type="hidden" id="moeder_id" value="${data.moeder_id || ''}">
                
                <div class="alert alert-info mb-3">
                    <i class="bi bi-pencil"></i> 
                    <span class="fw-semibold">${isEdit ? t('editingDog') : t('newDog')}</span>
                </div>
                
                <!-- Rij 1: Naam en Kennelnaam -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dogName" class="form-label fw-semibold">${t('nameRequired')}</label>
                            <input type="text" class="form-control" id="dogName" value="${data.naam || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="kennelName" class="form-label fw-semibold">${t('kennelName')}</label>
                            <input type="text" class="form-control" id="kennelName" value="${data.kennelnaam || ''}">
                        </div>
                    </div>
                </div>
                
                <!-- Rij 2: Stamboomnummer en Geslacht -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="pedigreeNumber" class="form-label fw-semibold">${t('pedigreeNumber')}</label>
                            <input type="text" class="form-control" id="pedigreeNumber" value="${data.stamboomnr || ''}" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="gender" class="form-label fw-semibold">${t('gender')}</label>
                            <select class="form-select" id="gender">
                                <option value="">${t('chooseGender')}</option>
                                <option value="reuen" ${data.geslacht === 'reuen' ? 'selected' : ''}>${t('male')}</option>
                                <option value="teven" ${data.geslacht === 'teven' ? 'selected' : ''}>${t('female')}</option>
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
                                <input type="text" class="form-control" id="breed" value="${data.ras || ''}" required>
                            </div>
                            
                            <!-- Recente rassen sectie -->
                            ${recentBreedsHTML}
                            
                            <!-- Vachtkleur invoerveld -->
                            <div class="vachtkleur-col">
                                <label for="coatColor" class="form-label fw-semibold">${t('coatColor')}</label>
                                <input type="text" class="form-control" id="coatColor" value="${data.vachtkleur || ''}">
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
                                   value="${data.vader || ''}" 
                                   placeholder="Typ naam of 'naam kennelnaam'..."
                                   data-parent-type="vader"
                                   autocomplete="off">
                            <div id="fatherAutocomplete" class="parent-autocomplete-dropdown"></div>
                            <div class="form-text mt-1">Begin met typen om te zoeken</div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 parent-input-wrapper">
                            <label for="mother" class="form-label fw-semibold">${t('mother')}</label>
                            <input type="text" class="form-control parent-search-input" id="mother" 
                                   value="${data.moeder || ''}" 
                                   placeholder="Typ naam of 'naam kennelnaam'..."
                                   data-parent-type="moeder"
                                   autocomplete="off">
                            <div id="motherAutocomplete" class="parent-autocomplete-dropdown"></div>
                            <div class="form-text mt-1">Begin met typen om te zoeken</div>
                        </div>
                    </div>
                </div>
                
                <!-- Rij 5: Geboortedatum en Overlijdensdatum -->
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3 date-input-wrapper">
                            <label for="birthDate" class="form-label fw-semibold">${t('birthDate')}</label>
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
                            <label for="deathDate" class="form-label fw-semibold">${t('deathDate')}</label>
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
                            <label for="hipDysplasia" class="form-label fw-semibold">${t('hipDysplasia')}</label>
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
                            <label for="elbowDysplasia" class="form-label fw-semibold">${t('elbowDysplasia')}</label>
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
                            <label for="patellaLuxation" class="form-label fw-semibold">${t('patellaLuxation')}</label>
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
                            <label for="eyes" class="form-label fw-semibold">${t('eyes')}</label>
                            <select class="form-select" id="eyes">
                                <option value="">${t('choose')}</option>
                                <option value="Vrij" ${data.ogen === 'Vrij' ? 'selected' : ''}>${t('eyesFree')}</option>
                                <option value="Distichiasis" ${data.ogen === 'Distichiasis' ? 'selected' : ''}>${t('eyesDistichiasis')}</option>
                                <option value="Overig" ${data.ogen === 'Overig' ? 'selected' : ''}>${t('eyesOther')}</option>
                            </select>
                        </div>
                        <div class="mb-3" id="eyesExplanationContainer" style="${data.ogen === 'Overig' ? '' : 'display: none;'}">
                            <label for="eyesExplanation" class="form-label fw-semibold">${t('eyesExplanation')}</label>
                            <input type="text" class="form-control" id="eyesExplanation" value="${data.ogenverklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="dandyWalker" class="form-label fw-semibold">${t('dandyWalker')}</label>
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
                            <label for="thyroid" class="form-label fw-semibold">${t('thyroid')}</label>
                            <select class="form-select" id="thyroid">
                                <option value="">${t('choose')}</option>
                                <option value="Negatief" ${data.schildklier === 'Negatief' ? 'selected' : ''}>${t('thyroidNegative')}</option>
                                <option value="Positief" ${data.schildklier === 'Positief' ? 'selected' : ''}>${t('thyroidPositive')}</option>
                            </select>
                        </div>
                        <!-- AANGEPAST: Toelichting vak altijd zichtbaar -->
                        <div class="mb-3" id="thyroidExplanationContainer">
                            <label for="thyroidExplanation" class="form-label fw-semibold">${t('thyroidExplanation')}</label>
                            <input type="text" class="form-control" id="thyroidExplanation" value="${data.schildklierverklaring || ''}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="country" class="form-label fw-semibold">${t('country')}</label>
                                    <input type="text" class="form-control" id="country" value="${data.land || ''}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label for="zipCode" class="form-label fw-semibold">${t('zipCode')}</label>
                                    <input type="text" class="form-control" id="zipCode" value="${data.postcode || ''}">
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
                    <div class="form-text" id="fileStatusText">${t('noFileChosen')}</div>
                </div>
                
                <!-- Opmerkingen -->
                <div class="mb-3">
                    <label for="remarks" class="form-label fw-semibold">${t('remarks')}</label>
                    <textarea class="form-control" id="remarks" rows="3">${data.opmerkingen || ''}</textarea>
                </div>
                
                <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    ${t('requiredFields')}
                </div>
                
                <!-- Opslaan knop -->
                <div class="text-end">
                    <button type="button" class="btn btn-primary" id="saveDogBtn">
                        <i class="bi bi-check-circle me-1"></i>${t('saveDog')}
                    </button>
                </div>
            </form>
            
            <style>
                /* EXACT DEZELFDE STYLING ALS DogDataManager.js */
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
                
                .parent-input-wrapper {
                    position: relative;
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
                
                /* Datum input styling */
                .date-input-wrapper {
                    position: relative;
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
                
                /* Validatie styling */
                .date-error {
                    border-color: #dc3545 !important;
                }
                
                .error-message {
                    color: #dc3545;
                    font-size: 0.875em;
                    margin-top: 0.25rem;
                }
                
                /* Parent dropdown styling - EXACT ZELFDE ALS DogDataManager */
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
    
    setupEvents() {
        console.log('DogManager setupEvents called');
        
        // Controleer of gebruiker admin is
        const isAdmin = auth.isAdmin();
        
        if (!isAdmin) {
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
        console.log('DogManager: setupFormEvents aangeroepen');
        
        // Save knop
        const saveBtn = document.getElementById('saveDogBtn');
        if (saveBtn) {
            console.log('DogManager: Voeg event listener toe aan saveDogBtn');
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
                // AANGEPAST: Verwijder de conditionele logica zodat het vak altijd zichtbaar blijft
                const explanationContainer = document.getElementById('thyroidExplanationContainer');
                if (explanationContainer) {
                    explanationContainer.style.display = 'block'; // Altijd tonen
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
        
        // Setup autocomplete voor ouders - EXACT ZELFDE ALS DogDataManager
        this.setupParentAutocomplete();
        
        // Setup datum velden
        this.setupDateFields();
        
        // Setup datum validatie
        this.setupDateValidation();
        
        // Setup bestandsselectie feedback
        this.setupFileSelectionFeedback();
    }
    
    /**
     * Setup bestandsselectie feedback
     */
    setupFileSelectionFeedback() {
        const photoInput = document.getElementById('dogPhoto');
        const fileStatusText = document.getElementById('fileStatusText');
        
        if (photoInput && fileStatusText) {
            photoInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    // Toon bestandsnaam en grootte
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                    fileStatusText.innerHTML = this.t('selectedFile', { filename: `<strong>${file.name}</strong> (${fileSizeMB} MB)` });
                    fileStatusText.classList.remove('text-muted');
                    fileStatusText.classList.add('text-success', 'fw-semibold');
                } else {
                    // Reset naar standaard tekst
                    fileStatusText.textContent = this.t('noFileChosen');
                    fileStatusText.classList.remove('text-success', 'fw-semibold');
                    fileStatusText.classList.add('text-muted');
                }
            });
        }
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
     * Setup autocomplete voor ouders - EXACT ZELFDE ALS DogDataManager
     */
    setupParentAutocomplete() {
        console.log('DogManager: setupParentAutocomplete aangeroepen');
        
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
                console.log(`[DogManager] ${hiddenIdField} gereset omdat input veld leeg is`);
            }
        });
        
        inputElement.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideParentAutocomplete(parentField);
            }, 200);
        });
    }
    
    /**
     * Toon parent autocomplete - EXACT ZELFDE ALS DogDataManager
     */
    showParentAutocomplete(searchTerm, parentField) {
        const input = document.getElementById(parentField);
        const hiddenIdField = parentField === 'father' ? 'vader_id' : 'moeder_id';
        
        if (!input) return;
        
        // Zoek de dropdown
        let dropdown = document.getElementById(`${parentField}Autocomplete`);
        
        if (!dropdown) {
            console.error(`[DogManager] Dropdown ${parentField}Autocomplete niet gevonden!`);
            return;
        }
        
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
        }).slice(0, 8); // Beperk tot 8 suggesties
        
        console.log(`[DogManager] Autocomplete voor ${parentField}: ${suggestions.length} resultaten gevonden voor zoekterm '${searchTerm}'`);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
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
                     data-kennelnaam="${dog.kennelnaam || ''}"
                     data-stamboomnr="${dog.stamboomnr || ''}">
                    <div class="dog-name">${displayName}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'} | ${genderText}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        // Event listeners voor autocomplete items
        dropdown.querySelectorAll('.parent-autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                const dogName = item.getAttribute('data-name');
                const dogKennelnaam = item.getAttribute('data-kennelnaam');
                const dogStamboomnr = item.getAttribute('data-stamboomnr');
                
                // Vul het input veld met de volledige naam + kennelnaam
                const displayName = dogName ? `${dogName} ${dogKennelnaam ? dogKennelnaam : ''}`.trim() : '';
                input.value = displayName;
                
                // Vul het hidden ID veld
                document.getElementById(hiddenIdField).value = dogId;
                
                // DEBUG LOGGING
                console.log(`[DogManager] Parent autocomplete geselecteerd: ${parentField}`);
                console.log(`- Hond ID: ${dogId}`);
                console.log(`- Naam: ${dogName}`);
                console.log(`- Stamboomnr: ${dogStamboomnr}`);
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
     * Laad alle honden voor autocomplete
     */
    async loadAllDogs() {
        if (this.allDogs.length === 0) {
            try {
                console.log('DogManager: Laden van alle honden met paginatie...');
                
                this.allDogs = [];
                
                let currentPage = 1;
                const pageSize = 1000;
                let hasMorePages = true;
                
                // Toon progress in UI
                this.showProgress(`Honden laden... (0 geladen)`);
                
                // Loop door alle pagina's
                while (hasMorePages) {
                    console.log(`DogManager: Laden pagina ${currentPage}...`);
                    
                    const result = await hondenService.getHonden(currentPage, pageSize);
                    
                    if (result.honden && result.honden.length > 0) {
                        this.allDogs = this.allDogs.concat(result.honden);
                        
                        this.showProgress(`Honden laden... (${this.allDogs.length} geladen)`);
                        
                        console.log(`DogManager: Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                        
                        hasMorePages = result.heeftVolgende;
                        currentPage++;
                        
                        if (currentPage > 100) {
                            console.warn('DogManager: Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                            break;
                        }
                    } else {
                        hasMorePages = false;
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Sorteer op naam
                this.allDogs.sort((a, b) => {
                    const naamA = a.naam || '';
                    const naamB = b.naam || '';
                    return naamA.localeCompare(naamB);
                });
                
                this.hideProgress();
                console.log(`DogManager: TOTAAL ${this.allDogs.length} honden geladen voor autocomplete`);
                
            } catch (error) {
                this.hideProgress();
                console.error('DogManager: Fout bij laden honden voor autocomplete:', error);
                this.showError(this.t('loadFailed') + error.message);
                this.allDogs = [];
            }
        }
    }
    
    async saveDog() {
        console.log('=== DogManager: START saveDog ===');
        
        if (!auth.isAdmin()) {
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
        
        console.log(`[DogManager] Geboortedatum: ${birthDateValue}`);
        console.log(`[DogManager] Overlijdensdatum: ${deathDateValue}`);
        
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
        
        console.log(`[DogManager] Vader ID raw: ${vaderIdValue}`);
        console.log(`[DogManager] Moeder ID raw: ${moederIdValue}`);
        
        const vader_id = vaderIdValue && vaderIdValue.trim() !== '' && !isNaN(parseInt(vaderIdValue)) 
            ? parseInt(vaderIdValue) 
            : null;
        
        const moeder_id = moederIdValue && moederIdValue.trim() !== '' && !isNaN(parseInt(moederIdValue)) 
            ? parseInt(moederIdValue) 
            : null;
        
        console.log(`[DogManager] Vader ID geparsed: ${vader_id} (type: ${typeof vader_id})`);
        console.log(`[DogManager] Moeder ID geparsed: ${moeder_id} (type: ${typeof moeder_id})`);
        
        // Zoek ouder namen en stamboomnummers op basis van IDs
        let vader = '';
        let moeder = '';
        let vader_stamboomnr = null;
        let moeder_stamboomnr = null;
        
        if (vader_id) {
            const vaderHond = this.allDogs.find(d => d.id === vader_id);
            vader = vaderHond ? vaderHond.naam || '' : '';
            vader_stamboomnr = vaderHond ? vaderHond.stamboomnr || null : null;
            console.log(`[DogManager] Vader gevonden: ID=${vader_id}, Naam=${vader}, Stamboomnr=${vader_stamboomnr}`);
        } else {
            console.log('[DogManager] Geen vader ID opgegeven, gebruik tekst uit input veld');
            vader = document.getElementById('father').value.split(' ')[0] || '';
        }
        
        if (moeder_id) {
            const moederHond = this.allDogs.find(d => d.id === moeder_id);
            moeder = moederHond ? moederHond.naam || '' : '';
            moeder_stamboomnr = moederHond ? moederHond.stamboomnr || null : null;
            console.log(`[DogManager] Moeder gevonden: ID=${moeder_id}, Naam=${moeder}, Stamboomnr=${moeder_stamboomnr}`);
        } else {
            console.log('[DogManager] Geen moeder ID opgegeven, gebruik tekst uit input veld');
            moeder = document.getElementById('mother').value.split(' ')[0] || '';
        }
        
        // EXACT DEZELFDE DATABASESTRUCTUUR ALS DogDataManager
        const dogData = {
            // BASISINFORMATIE
            naam: document.getElementById('dogName').value.trim(),
            kennelnaam: document.getElementById('kennelName').value.trim() || null,
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            vachtkleur: document.getElementById('coatColor').value.trim() || null,
            geslacht: document.getElementById('gender').value || null,
            
            // OUDERS
            vader: vader || null,
            vader_id: vader_id,
            vader_stamboomnr: vader_stamboomnr,  // NIEUWE KOLOM
            moeder: moeder || null,
            moeder_id: moeder_id,
            moeder_stamboomnr: moeder_stamboomnr,  // NIEUWE KOLOM
            
            // DATUMS
            geboortedatum: formatDateForStorage(birthDateValue),
            overlijdensdatum: formatDateForStorage(deathDateValue) || null,
            
            // GEZONDHEIDSINFORMATIE - LOSSE KOLOMMEN zoals in DogDataManager
            heupdysplasie: document.getElementById('hipDysplasia').value || null,
            elleboogdysplasie: document.getElementById('elbowDysplasia').value || null,
            patella: document.getElementById('patellaLuxation').value || null,
            ogen: document.getElementById('eyes').value || null,
            ogenverklaring: document.getElementById('eyesExplanation')?.value.trim() || null,
            dandyWalker: document.getElementById('dandyWalker').value || null,
            schildklier: document.getElementById('thyroid').value || null,
            schildklierverklaring: document.getElementById('thyroidExplanation')?.value.trim() || null,
            
            // LOCATIE
            land: document.getElementById('country').value.trim() || null,
            postcode: document.getElementById('zipCode').value.trim() || null,
            
            // OPMERKINGEN
            opmerkingen: document.getElementById('remarks').value.trim() || null,
            
            // SYSTEEMVELDEN
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString()
            
            // GEEN 'gezondheidsinfo' JSON veld!
            // GEEN 'status' veld!
        };
        
        console.log('[DogManager] === DOG DATA VOOR OPSLAG ===');
        console.log('Aantal velden:', Object.keys(dogData).length);
        console.log('Heupdysplasie:', dogData.heupdysplasie);
        console.log('Elleboogdysplasie:', dogData.elleboogdysplasie);
        console.log('Patella:', dogData.patella);
        console.log('Ogen:', dogData.ogen);
        console.log('Dandy Walker:', dogData.dandyWalker);
        console.log('Schildklier:', dogData.schildklier);
        console.log('Vader ID:', dogData.vader_id);
        console.log('Vader stamboomnr:', dogData.vader_stamboomnr);
        console.log('Moeder ID:', dogData.moeder_id);
        console.log('Moeder stamboomnr:', dogData.moeder_stamboomnr);
        console.log('Volledige data:', JSON.stringify(dogData, null, 2));
        console.log('[DogManager] === EINDE DOG DATA ===');
        
        // Valideer verplichte velden
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        // Voeg ras toe aan recente rassen
        this.addToLastBreeds(dogData.ras);
        
        this.showProgress(this.t('savingDog'));
        
        try {
            console.log('[DogManager] Aanroepen voegHondToe...');
            
            // GEBRUIK EXACT DEZELFDE LOGICA ALS DogDataManager
            let result;
            
            if (hondenService && hondenService.voegHondToe) {
                console.log('[DogManager] Gebruik voegHondToe methode');
                result = await hondenService.voegHondToe(dogData);
            } else {
                throw new Error('voegHondToe methode niet beschikbaar');
            }
            
            console.log('[DogManager] Resultaat:', result);
            
            if (result && result.error) {
                throw new Error(result.error.message || 'Toevoegen mislukt met fout');
            }
            
            this.hideProgress();
            console.log('[DogManager] Toevoegen succesvol!');
            this.showSuccess(this.t('dogAdded'));
            
            // Foto uploaden als er een is geselecteerd - EXACT ZELFDE LOGICA ALS PhotoManager
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput && photoInput.files.length > 0) {
                try {
                    console.log('[DogManager] Foto uploaden...');
                    await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0], dogData.naam);
                    console.log('[DogManager] Foto upload succesvol!');
                } catch (photoError) {
                    console.warn('[DogManager] Foto upload mislukt:', photoError);
                }
            }
            
            // Modal sluiten
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addDogModal'));
                if (modal) {
                    modal.hide();
                }
                
                console.log('[DogManager] === EINDE saveDog (succes) ===');
            }, 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('[DogManager] Fout bij opslaan hond:', error);
            console.error('[DogManager] Error stack:', error.stack);
            
            let errorMessage = this.t('addFailed');
            
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
            console.log('[DogManager] === EINDE saveDog (error) ===');
        }
    }
    
    async uploadPhoto(pedigreeNumber, file, dogName = null) {
        try {
            // EXACT DEZELFDE LOGICA ALS PhotoManager.uploadPhoto()
            if (file.size > 5 * 1024 * 1024) {
                this.showError("Bestand is te groot (maximaal 5MB)");
                return;
            }
            
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                this.showError("Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan");
                return;
            }
            
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        // Haal gebruiker op - EXACT ZELFDE ALS PhotoManager
                        const user = window.auth ? window.auth.getCurrentUser() : null;
                        if (!user || !user.id) {
                            throw new Error('Niet ingelogd of geen gebruikers-ID beschikbaar');
                        }
                        
                        // Maak thumbnail (gereduceerde versie) - EXACT ZELFDE ALS PhotoManager
                        let thumbnail = null;
                        try {
                            const img = new Image();
                            img.src = e.target.result;
                            
                            await new Promise((resolveThumb) => {
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
                                    resolveThumb();
                                };
                            });
                        } catch (thumbError) {
                            console.warn('Thumbnail maken mislukt:', thumbError);
                            thumbnail = e.target.result;
                        }
                        
                        // Maak foto object voor database - EXACT ZELFDE ALS PhotoManager
                        const fotoData = {
                            stamboomnr: pedigreeNumber,
                            data: e.target.result, // volledige Base64 data met data: prefix
                            thumbnail: thumbnail,   // thumbnail als Base64
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                            uploaded_at: new Date().toISOString(),
                            geupload_door: user.id,
                            hond_id: null // Wordt later ingevuld als hond is aangemaakt
                        };
                        
                        console.log('DogManager Foto data voor database:', {
                            stamboomnr: fotoData.stamboomnr,
                            filename: fotoData.filename,
                            size: fotoData.size,
                            hasData: !!fotoData.data,
                            hasThumbnail: !!fotoData.thumbnail,
                            geupload_door: fotoData.geupload_door
                        });
                        
                        // Voeg toe aan database via Supabase - EXACT ZELFDE ALS PhotoManager
                        const { data: dbData, error: dbError } = await window.supabase
                            .from('fotos')
                            .insert(fotoData)
                            .select()
                            .single();
                        
                        if (dbError) {
                            console.error('Database insert error:', dbError);
                            throw dbError;
                        }
                        
                        console.log('DogManager Database insert successful:', dbData);
                        this.showSuccess("Foto toegevoegd");
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
            console.error('Error uploading photo:', error);
            throw error;
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

// Maak globaal beschikbaar
if (typeof window !== 'undefined') {
    window.DogManager = DogManager;
}