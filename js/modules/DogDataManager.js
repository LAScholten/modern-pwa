// js/modules/DogDataManager.js

/**
 * DogDataManager - Module voor het bewerken en verwijderen van honden
 * MET CORRECTE OPSLAG VAN OUDER ID's volgens database structuur
 * EN met autorisatie: admin ziet alle honden, gebruiker+ alleen eigen honden
 * MET LUW/LTV veld (alleen cijfers, optioneel)
 */
class DogDataManager extends BaseModule {
    constructor() {
        super('dogdata', 'Data Hond Bewerken');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.lastBreeds = JSON.parse(localStorage.getItem('lastBreeds') || '[]');
        this.allDogs = []; // Voor autocomplete cache
        this.selectedDog = null;
        this.currentDogId = null;
        this.currentUser = null;
        this.isAdmin = false;
        this.isUserPlus = false;
        this.filteredSearchResults = [];
        this.minSearchLength = 2;
        this.searchTimeout = null;
        this.parentSearchTimeout = null; // Voor ouder autocomplete debounce
        
        console.log('DogDataManager geïnitialiseerd');
        
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
            this.currentUser = window.auth.getCurrentUser();
            if (this.currentUser) {
                this.isAdmin = this.currentUser.role === 'admin';
                this.isUserPlus = this.currentUser.role === 'gebruiker+';
                console.log(`Huidige gebruiker: ${this.currentUser.username}, Rol: ${this.currentUser.role}`);
            }
        }
        
        this.translations = {
            nl: {
                editDogData: "Data Hond Bewerken",
                searchDog: "Zoek Hond",
                close: "Sluiten",
                refresh: "Pagina Vernieuwen",
                accessDenied: "Toegang Geweigerd",
                name: "Naam",
                nameRequired: "Naam *",
                kennelName: "Kennelnaam",
                pedigreeNumber: "Stamboomnummer *",
                breed: "Ras",
                breedRequired: "Ras *",
                coatColor: "Vachtkleur",
                chooseColor: "Selecteer kleur...",
                blond: "Blond",
                blondgrijs: "Blondgrijs",
                grijsblond: "Grijsblond",
                blondrood: "Blondrood",
                roodblond: "Roodblond",
                rood: "Rood",
                roodgrijs: "Roodgrijs",
                wolfsgrau: "Wolfsgrau",
                wildkleur: "Wildkleur",
                zwart: "Zwart",
                zwartMetAftekeningen: "Zwart met aftekeningen",
                wit: "Wit",
                piebold: "Piebold",
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
                eyesExplanation: "Verklaring ogen",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Selecteer status...",
                dandyFreeDNA: "Vrij op DNA",
                dandyFreeParents: "Vrij op ouders",
                dandyCarrier: "Drager",
                dandyAffected: "Lijder",
                luw: "LÜW/LTV",
                luwPlaceholder: "Alleen een getal",
                luwHelp: "Voer alleen een getal in",
                thyroid: "Schildklier",
                thyroidNegative: "Tgaa Negatief",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                addPhoto: "Foto toevoegen",
                chooseFile: "Kies bestand",
                noFileChosen: "Geen bestand gekozen",
                chosenFile: "Gekozen bestand",
                remarks: "Opmerkingen",
                requiredFields: "Velden met * zijn verplicht",
                saveChanges: "Wijzigingen Opslaan",
                cancel: "Annuleren",
                deleteDog: "Hond Verwijderen",
                choose: "Kies...",
                searchPlaceholder: "Typ naam of stamboomnummer...",
                insufficientPermissions: "Onvoldoende rechten",
                insufficientPermissionsText: "U heeft geen toestemming om honden te bewerken.",
                loggedInAs: "U bent ingelogd als:",
                user: "Gebruiker",
                availableFeatures: "Beschikbare functies voor gebruikers",
                searchDogs: "Honden zoeken en bekijken",
                viewGallery: "Foto galerij bekijken",
                managePrivateInfo: "Privé informatie beheren",
                importExport: "Data importeren/exporteren",
                loadingDogs: "Honden laden...",
                noResults: "Geen honden gevonden",
                selectDogToEdit: "Selecteer een hond om te bewerken",
                typeToSearch: "Typ minimaal 2 tekens om te zoeken...",
                loadingUserDogs: "Uw honden laden...",
                loadingAllDogs: "Alle honden laden...",
                adminMode: "Admin modus: alle honden",
                userPlusMode: "Uw honden",
                searchResults: "Zoekresultaten",
                dogSelected: "Hond geselecteerd",
                editingDog: "Bewerken hond",
                savingChanges: "Wijzigingen opslaan...",
                changesSaved: "Wijzigingen opgeslagen!",
                dogDeleted: "Hond succesvol verwijderd!",
                confirmDelete: "Weet u zeker dat u deze hond wilt verwijderen?",
                photoAdded: "Foto toegevoegd",
                updatingDog: "Hond bijwerken...",
                dogUpdated: "Hond bijgewerkt!",
                deleting: "Verwijderen...",
                notYourDog: "U kunt alleen uw eigen honden bewerken",
                accessDeniedEdit: "Geen toegang om deze hond te bewerken",
                parentNotSelected: "Selecteer een geldige hond uit de lijst voor zowel vader als moeder",
                searching: "Zoeken...",
                typeMore: "Typ minimaal 2 tekens",
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
                deathBeforeBirthError: "Overlijdensdatum kan niet voor geboortedatum zijn",
                searchParent: "Zoek ouder...",
                searchingParent: "Zoeken...",
                invalidLuw: "LÜW/LTV mag alleen een getal bevatten"
            },
            en: {
                editDogData: "Edit Dog Data",
                searchDog: "Search Dog",
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
                chooseColor: "Select color...",
                blond: "Blond",
                blondgrijs: "Blondgray",
                grijsblond: "Grayblond",
                blondrood: "Blondred",
                roodblond: "Redblond",
                rood: "Red",
                roodgrijs: "Redgray",
                wolfsgrau: "Wolfgray",
                wildkleur: "Wildcolor",
                zwart: "Black",
                zwartMetAftekeningen: "Black with markings",
                wit: "White",
                piebold: "Piebold",
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
                eyesExplanation: "Eye explanation",
                dandyWalker: "Dandy Walker Malformation",
                dandyOptions: "Select status...",
                dandyFreeDNA: "Free on DNA",
                dandyFreeParents: "Free on parents",
                dandyCarrier: "Carrier",
                dandyAffected: "Affected",
                luw: "LÜW/LTV",
                luwPlaceholder: "Number only",
                luwHelp: "Enter only a number",
                thyroid: "Thyroid",
                thyroidNegative: "Tgaa Negative",
                thyroidPositive: "Tgaa Positive",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                addPhoto: "Add photo",
                chooseFile: "Choose file",
                noFileChosen: "No file chosen",
                chosenFile: "Chosen file",
                remarks: "Remarks",
                requiredFields: "Fields with * are required",
                saveChanges: "Save Changes",
                cancel: "Cancel",
                deleteDog: "Delete Dog",
                choose: "Choose...",
                searchPlaceholder: "Type name or pedigree number...",
                insufficientPermissions: "Insufficient permissions",
                insufficientPermissionsText: "You do not have permission to edit dogs.",
                loggedInAs: "You are logged in as:",
                user: "User",
                availableFeatures: "Available features for users",
                searchDogs: "Search and view dogs",
                viewGallery: "View photo gallery",
                managePrivateInfo: "Manage private information",
                importExport: "Import/export data",
                loadingDogs: "Loading dogs...",
                noResults: "No dogs found",
                selectDogToEdit: "Select a dog to edit",
                typeToSearch: "Type at least 2 characters to search...",
                loadingUserDogs: "Loading your dogs...",
                loadingAllDogs: "Loading all dogs...",
                adminMode: "Admin mode: all dogs",
                userPlusMode: "Your dogs",
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
                notYourDog: "You can only edit your own dogs",
                accessDeniedEdit: "No access to edit this dog",
                parentNotSelected: "Select a valid dog from the list for both father and mother",
                searching: "Searching...",
                typeMore: "Type at least 2 characters",
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
                deathBeforeBirthError: "Death date cannot be before birth date",
                searchParent: "Search parent...",
                searchingParent: "Searching...",
                invalidLuw: "LÜW/LTV can only contain a number"
            },
            de: {
                editDogData: "Hundedaten bearbeiten",
                searchDog: "Hund suchen",
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
                chooseColor: "Farbe wählen...",
                blond: "Falben",
                blondgrijs: "Falbengrau",
                grijsblond: "Graufalben",
                blondrood: "Falbenrot",
                roodblond: "Rotfalben",
                rood: "Rot",
                roodgrijs: "Rotgrau",
                wolfsgrau: "Wolfsgrau",
                wildkleur: "Wildfarbe",
                zwart: "Schwarz",
                zwartMetAftekeningen: "Schwarz mit Abzeichen",
                wit: "Weiß",
                piebold: "Piebold",
                recent: "Kürzlich:",
                father: "Vater",
                mother: "Mutter",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                gender: "Geslacht",
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
                luw: "LÜW/LTV",
                luwPlaceholder: "Nur ein Zahl",
                luwHelp: "Nur ein Zah eingeben",
                thyroid: "Schilddrüse",
                thyroidNegative: "Tgaa Negativ",
                thyroidPositive: "Tgaa Positief",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                addPhoto: "Foto hinzufügen",
                chooseFile: "Datei wählen",
                noFileChosen: "Keine Datei gewählt",
                chosenFile: "Ausgewählte Datei",
                remarks: "Bemerkungen",
                requiredFields: "Felder met * sind Pflichtfelder",
                saveChanges: "Änderungen speichern",
                cancel: "Abbrechen",
                deleteDog: "Hund löschen",
                choose: "Wählen...",
                searchPlaceholder: "Name oder Ahnen-Nummer eingeben...",
                insufficientPermissions: "Unzureichende Berechtigingen",
                insufficientPermissionsText: "Sie haben keine Berechtigung, Hunde zu bearbeiten.",
                loggedInAs: "Sie sind eingeloggt als:",
                user: "Benutzer",
                availableFeatures: "Verfügbare functies voor Benutzer",
                searchDogs: "Hunde suchen en anzeigen",
                viewGallery: "Fotogalerie anzeigen",
                managePrivateInfo: "Private Informationen verwalten",
                importExport: "Daten importieren/exportieren",
                loadingDogs: "Hunde laden...",
                noResults: "Keine Hunde gefunden",
                selectDogToEdit: "Wählen Sie einen Hund zum Bearbeiten",
                typeToSearch: "Geben Sie mindestens 2 Zeichen ein...",
                loadingUserDogs: "Ihre Hunde laden...",
                loadingAllDogs: "Alle Hunde laden...",
                adminMode: "Admin-Modus: alle Hunde",
                userPlusMode: "Ihre Hunde",
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
                notYourDog: "Sie können nur Ihre eigenen Hunde bearbeiten",
                accessDeniedEdit: "Kein Zugriff zum Bearbeiten dieses Hundes",
                parentNotSelected: "Wählen Sie einen gültigen Hund aus der Liste für sowohl Vater als auch Mutter",
                searching: "Suche...",
                typeMore: "Geben Sie mindestens 2 Zeichen ein",
                searchFailed: "Fehler bei der Suche: ",
                loadFailed: "Fehler beim Laden der Hunde: ",
                updateFailed: "Fehler beim Aktualisieren des Hundes: ",
                deleteFailed: "Fehler beim Löschen des Hundes: ",
                photoError: "Fehler beim Hochladen des Fotos: ",
                fieldsRequired: "Name, Stammbaum-Nummer en Rasse sind Pflichtfelder",
                dogNotFound: "Hund niet gefonden",
                adminOnly: "Nur Administratoren können Hunde bearbeiten",
                invalidId: "Ungültige Hunde-ID",
                dateFormatError: "Datum moet im Format TT-MM-JJJJ sein",
                deathBeforeBirthError: "Sterbedatum kan nicht vor dem Geburtsdatum liegen",
                searchParent: "Elternteil suchen...",
                searchingParent: "Suche...",
                invalidLuw: "LÜW/LTV darf nur ein Zahl enthalten"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
    }
    
    getModalHTML() {
        const currentUser = auth.getCurrentUser();
        const t = this.t.bind(this);
        
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
        
        const isAdmin = currentUser.role === 'admin';
        const readOnlyAttr = isAdmin ? '' : 'readonly';
        
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
                            <div class="alert alert-info mb-3" id="userInfoBanner">
                                <i class="bi bi-person-circle me-2"></i>
                                <span id="modeIndicator">
                                    ${this.isAdmin ? t('adminMode') : t('userPlusMode')}
                                </span>
                            </div>
                            
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
                                            <div class="form-text mt-1" id="searchStatus">${t('typeToSearch')}</div>
                                        </div>
                                        <div id="searchResults" style="max-height: 400px; overflow-y: auto;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="editSection" style="display: none;">
                                <form id="editDogForm">
                                    <input type="hidden" id="dogId">
                                    <input type="hidden" id="vader_id" value="">
                                    <input type="hidden" id="moeder_id" value="">
                                    <input type="hidden" id="vader_stamboomnr" value="">
                                    <input type="hidden" id="moeder_stamboomnr" value="">
                                    <input type="hidden" id="toegevoegd_door" value="">
                                    
                                    <div class="alert alert-info mb-3">
                                        <i class="bi bi-pencil"></i> 
                                        <span class="fw-semibold">${t('editingDog')}:</span> 
                                        <span id="editingDogName" class="fw-bold text-primary"></span>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="dogName" class="form-label fw-semibold">${t('nameRequired')}</label>
                                                <input type="text" class="form-control" id="dogName" required ${readOnlyAttr}>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="kennelName" class="form-label fw-semibold">${t('kennelName')}</label>
                                                <input type="text" class="form-control" id="kennelName" ${readOnlyAttr}>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="pedigreeNumber" class="form-label fw-semibold">${t('pedigreeNumber')}</label>
                                                <input type="text" class="form-control" id="pedigreeNumber" required ${readOnlyAttr}>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="gender" class="form-label fw-semibold">${t('gender')}</label>
                                                <select class="form-select" id="gender" ${!isAdmin ? 'disabled' : ''}>
                                                    <option value="">${t('chooseGender')}</option>
                                                    <option value="reuen">${t('male')}</option>
                                                    <option value="teven">${t('female')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="ras-vachtkleur-row">
                                                <div class="ras-col">
                                                    <label for="breed" class="form-label fw-semibold">${t('breedRequired')}</label>
                                                    <input type="text" class="form-control" id="breed" required ${readOnlyAttr}>
                                                </div>
                                                ${recentBreedsHTML}
                                                <div class="vachtkleur-col">
                                                    <label for="coatColor" class="form-label fw-semibold">${t('coatColor')}</label>
                                                    <select class="form-select" id="coatColor">
                                                        <option value="">${t('chooseColor')}</option>
                                                        <option value="${t('blond')}">${t('blond')}</option>
                                                        <option value="${t('blondgrijs')}">${t('blondgrijs')}</option>
                                                        <option value="${t('grijsblond')}">${t('grijsblond')}</option>
                                                        <option value="${t('blondrood')}">${t('blondrood')}</option>
                                                        <option value="${t('roodblond')}">${t('roodblond')}</option>
                                                        <option value="${t('rood')}">${t('rood')}</option>
                                                        <option value="${t('roodgrijs')}">${t('roodgrijs')}</option>
                                                        <option value="${t('wildkleur')}">${t('wildkleur')}</option>
                                                        <option value="${t('wolfsgrau')}">${t('wolfsgrau')}</option>
                                                        <option value="${t('zwart')}">${t('zwart')}</option>
                                                        <option value="${t('zwartMetAftekeningen')}">${t('zwartMetAftekeningen')}</option>
                                                        <option value="${t('wit')}">${t('wit')}</option>
                                                        <option value="${t('piebold')}">${t('piebold')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3 parent-input-wrapper">
                                                <label for="father" class="form-label fw-semibold">${t('father')}</label>
                                                <input type="text" class="form-control parent-search-input" id="father" 
                                                       placeholder="${t('searchParent')}"
                                                       data-parent-type="vader"
                                                       autocomplete="off"
                                                       data-valid-parent="false"
                                                       ${readOnlyAttr}>
                                                <div id="fatherError" class="error-message" style="display: none;"></div>
                                                <div id="fatherAutocomplete" class="parent-autocomplete-dropdown"></div>
                                                <div class="form-text mt-1" id="fatherSearchStatus">${t('typeToSearch')}</div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3 parent-input-wrapper">
                                                <label for="mother" class="form-label fw-semibold">${t('mother')}</label>
                                                <input type="text" class="form-control parent-search-input" id="mother" 
                                                       placeholder="${t('searchParent')}"
                                                       data-parent-type="moeder"
                                                       autocomplete="off"
                                                       data-valid-parent="false"
                                                       ${readOnlyAttr}>
                                                <div id="motherError" class="error-message" style="display: none;"></div>
                                                <div id="motherAutocomplete" class="parent-autocomplete-dropdown"></div>
                                                <div class="form-text mt-1" id="motherSearchStatus">${t('typeToSearch')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="mb-3 date-input-wrapper">
                                                <label for="birthDate" class="form-label fw-semibold">${t('birthDate')}</label>
                                                <input type="date" class="form-control" id="birthDate" 
                                                       placeholder="DD-MM-JJJJ"
                                                       data-original-value=""
                                                       ${readOnlyAttr}>
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
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="eyesExplanation" class="form-label fw-semibold">${t('eyesExplanation')}</label>
                                                <input type="text" class="form-control" id="eyesExplanation">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
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
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label for="luw" class="form-label fw-semibold">${t('luw')}</label>
                                                <input type="text" class="form-control" id="luw" 
                                                       placeholder="${t('luwPlaceholder')}"
                                                       maxlength="1"
                                                       pattern="[0-9]"
                                                       title="${t('luwHelp')}">
                                                <small class="form-text text-muted">${t('luwHelp')}</small>
                                                <div id="luwError" class="error-message" style="display: none;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
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
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3" id="thyroidExplanationContainer" style="display: block;">
                                                <label for="thyroidExplanation" class="form-label fw-semibold">${t('thyroidExplanation')}</label>
                                                <input type="text" class="form-control" id="thyroidExplanation">
                                            </div>
                                        </div>
                                    </div>
                                    
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
                                    
                                    <div class="mb-3">
                                        <label for="dogPhoto" class="form-label fw-semibold">${t('addPhoto')}</label>
                                        <div class="input-group">
                                            <input type="file" class="form-control" id="dogPhoto" accept="image/*">
                                            <label class="input-group-text" for="dogPhoto">${t('chooseFile')}</label>
                                        </div>
                                        <div id="fileStatus" class="form-text">${t('noFileChosen')}</div>
                                    </div>
                                    
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
                            ${currentUser.role === 'admin' ? `
                            <button type="button" class="btn btn-danger" id="deleteDogBtn" style="display: none;">
                                <i class="bi bi-trash me-1"></i>${t('deleteDog')}
                            </button>
                            ` : ''}
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
                .ras-vachtkleur-row {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: flex-start;
                    gap: 15px;
                    width: 100%;
                    margin-bottom: 15px;
                }
                .ras-col { flex: 2; min-width: 200px; }
                .recent-col { flex: 1; min-width: 200px; }
                .vachtkleur-col { flex: 2; min-width: 200px; }
                .recent-breeds-label { font-size: 0.875em; color: #6c757d; margin-bottom: 5px; display: block; }
                .recent-breeds-buttons { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 0; }
                .recent-breed-btn { white-space: nowrap; font-size: 0.8em; padding: 4px 8px; margin: 2px 0; }
                @media (max-width: 768px) {
                    .ras-vachtkleur-row { flex-direction: column !important; gap: 10px !important; }
                    .ras-col, .recent-col, .vachtkleur-col { width: 100% !important; }
                }
                .search-result-item {
                    padding: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    border-radius: 6px;
                    margin-bottom: 6px;
                    border: 1px solid transparent;
                }
                .search-result-item:hover { background-color: #f8f9fa; border-color: #dee2e6; }
                .search-result-item.selected { background-color: #e3f2fd; border-color: #0d6efd; border-left: 4px solid #0d6efd; }
                .search-result-item .dog-name { font-weight: 600; font-size: 1rem; color: #212529; }
                .search-result-item .dog-info { font-size: 0.85rem; color: #6c757d; display: flex; gap: 15px; flex-wrap: wrap; margin-top: 4px; }
                .search-stats { font-size: 0.85rem; color: #6c757d; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #dee2e6; font-weight: 500; }
                .parent-input-wrapper { position: relative; }
                #dogSearch, .parent-search-input {
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: border-color 0.3s;
                }
                #dogSearch:focus, .parent-search-input:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
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
                .parent-autocomplete-item:hover { background-color: #f8f9fa; }
                .parent-autocomplete-item .dog-name { font-weight: 600; font-size: 0.9rem; color: #212529; margin-bottom: 2px; }
                .parent-autocomplete-item .dog-info { font-size: 0.8rem; color: #666; }
                .error-message { color: #dc3545; font-size: 0.875em; margin-top: 0.25rem; }
                .parent-validation-error { border-color: #dc3545 !important; }
                .date-error { border-color: #dc3545 !important; }
                #userInfoBanner { padding: 8px 12px; margin-bottom: 15px; }
                #modeIndicator { font-weight: 600; }
                #fileStatus.file-selected { color: #198754; font-weight: 600; }
                .luw-error { border-color: #dc3545 !important; }
            </style>
        `;
    }
    
    setupEvents() {
        console.log('DogDataManager setupEvents called');
        
        this.updateUserInfoBanner();
        
        const searchInput = document.getElementById('dogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                const statusEl = document.getElementById('searchStatus');
                
                if (this.searchTimeout) clearTimeout(this.searchTimeout);
                
                if (searchTerm.length === 0) {
                    if (statusEl) statusEl.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${this.t('typeToSearch')}`;
                    this.showInitialView();
                    return;
                }
                
                if (searchTerm.length < this.minSearchLength) {
                    if (statusEl) statusEl.innerHTML = `<i class="bi bi-exclamation-circle me-1 text-warning"></i> ${this.t('typeMore')}`;
                    this.showInitialView();
                    return;
                }
                
                if (statusEl) statusEl.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> ${this.t('searching')}`;
                
                this.searchTimeout = setTimeout(() => {
                    this.searchDogs(searchTerm);
                }, 300);
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.filteredSearchResults && this.filteredSearchResults.length > 0) {
                    e.preventDefault();
                    this.selectDogForEditing(this.filteredSearchResults[0].id);
                }
            });
        }
        
        const cancelBtn = document.getElementById('cancelEditBtn');
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.showSearchSection());
        
        const saveBtn = document.getElementById('saveChangesBtn');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveDogChanges());
        
        const deleteBtn = document.getElementById('deleteDogBtn');
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteDog());
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recent-breed-btn')) {
                const breed = e.target.dataset.breed;
                const breedInput = document.getElementById('breed');
                if (breedInput) breedInput.value = breed;
            }
        });
        
        this.setupParentAutocomplete();
        this.setupDateFields();
        this.setupDateValidation();
        this.setupFileInputStatus();
        this.setupLuwValidation();
        
        setTimeout(() => this.translateModal(), 100);
    }
    
    /**
     * NIEUWE ZOEKFUNCTIE VOOR OUDERS - EXACT ZOALS SEARCHMANAGER MET DATABASE QUERIES
     */
    async searchParents(searchTerm, parentType) {
        try {
            console.log(`🔍 DogDataManager zoeken naar ouder: "${searchTerm}" (type: ${parentType})`);
            
            const supabase = window.supabase;
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return [];
            }
            
            if (searchTerm.length < this.minSearchLength) {
                return [];
            }
            
            const words = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
            
            let query = supabase
                .from('honden')
                .select('*');
            
            // Filter op geslacht voor ouder
            if (parentType === 'father') {
                query = query.eq('geslacht', 'reuen');
            } else if (parentType === 'mother') {
                query = query.eq('geslacht', 'teven');
            }
            
            // Zoeklogica exact zoals SearchManager
            if (words.length === 1) {
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%,stamboomnr.ilike.%${searchTerm}%`);
            } else {
                const conditions = [];
                conditions.push(`naam.ilike.%${searchTerm}%`);
                conditions.push(`kennelnaam.ilike.%${searchTerm}%`);
                
                const firstWord = words[0];
                const restWords = words.slice(1).join(' ');
                conditions.push(`and(naam.ilike.%${firstWord}%,kennelnaam.ilike.%${restWords}%)`);
                conditions.push(`and(kennelnaam.ilike.%${firstWord}%,naam.ilike.%${restWords}%)`);
                
                const naamConditions = words.map(w => `naam.ilike.%${w}%`).join(',');
                conditions.push(`and(${naamConditions})`);
                
                const kennelConditions = words.map(w => `kennelnaam.ilike.%${w}%`).join(',');
                conditions.push(`and(${kennelConditions})`);
                
                query = query.or(conditions.join(','));
            }
            
            const { data, error } = await query
                .order('naam')
                .limit(50);
            
            if (error) {
                console.error('❌ Database error bij ouder zoeken:', error);
                return [];
            }
            
            console.log(`✅ ${data?.length || 0} ${parentType} opties gevonden`);
            return data || [];
            
        } catch (error) {
            console.error('❌ Fout bij zoeken ouders:', error);
            return [];
        }
    }
    
    /**
     * NIEUWE ZOEKFUNCTIE VOOR HOOFDZOEK - EXACT ZOALS SEARCHMANAGER
     */
    async searchDogs(searchTerm) {
        try {
            console.log(`🔍 DogDataManager zoeken naar: "${searchTerm}" (via database query)`);
            
            const supabase = window.supabase;
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                this.showError('Database verbinding niet beschikbaar');
                return;
            }
            
            if (searchTerm.length < this.minSearchLength) {
                this.filteredSearchResults = [];
                this.displaySearchResults();
                return;
            }
            
            const words = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
            
            let query = supabase.from('honden').select('*');
            
            if (words.length === 1) {
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%,stamboomnr.ilike.%${searchTerm}%`);
            } else {
                const conditions = [];
                conditions.push(`naam.ilike.%${searchTerm}%`);
                conditions.push(`kennelnaam.ilike.%${searchTerm}%`);
                
                const firstWord = words[0];
                const restWords = words.slice(1).join(' ');
                conditions.push(`and(naam.ilike.%${firstWord}%,kennelnaam.ilike.%${restWords}%)`);
                conditions.push(`and(kennelnaam.ilike.%${firstWord}%,naam.ilike.%${restWords}%)`);
                
                const naamConditions = words.map(w => `naam.ilike.%${w}%`).join(',');
                conditions.push(`and(${naamConditions})`);
                
                const kennelConditions = words.map(w => `kennelnaam.ilike.%${w}%`).join(',');
                conditions.push(`and(${kennelConditions})`);
                
                query = query.or(conditions.join(','));
            }
            
            const { data, error } = await query.order('naam').limit(100);
            
            if (error) {
                console.error('❌ Database error:', error);
                this.showError(this.t('searchFailed') + error.message);
                return;
            }
            
            let filteredDogs = data || [];
            
            if (!this.isAdmin) {
                filteredDogs = filteredDogs.filter(dog => this.hasAccessToDog(dog));
            }
            
            this.filteredSearchResults = filteredDogs;
            console.log(`✅ ${this.filteredSearchResults.length} honden gevonden`);
            this.displaySearchResults(searchTerm);
            
        } catch (error) {
            console.error('❌ Fout bij zoeken:', error);
            this.showError(this.t('searchFailed') + error.message);
        }
    }
    
    updateUserInfoBanner() {
        const banner = document.getElementById('userInfoBanner');
        const modeIndicator = document.getElementById('modeIndicator');
        if (banner && modeIndicator) {
            if (this.isAdmin) {
                banner.className = 'alert alert-info mb-3';
                modeIndicator.textContent = this.t('adminMode');
            } else if (this.isUserPlus) {
                banner.className = 'alert alert-success mb-3';
                modeIndicator.textContent = this.t('userPlusMode');
            }
        }
    }
    
    setupFileInputStatus() {
        const fileInput = document.getElementById('dogPhoto');
        const fileStatus = document.getElementById('fileStatus');
        if (fileInput && fileStatus) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    fileStatus.textContent = `${this.t('chosenFile')}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                    fileStatus.classList.add('file-selected');
                } else {
                    fileStatus.textContent = this.t('noFileChosen');
                    fileStatus.classList.remove('file-selected');
                }
            });
        }
    }
    
    setupDateFields() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        if (birthDateInput) birthDateInput.type = 'date';
        if (deathDateInput) deathDateInput.type = 'date';
    }
    
    setupDateValidation() {
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        if (birthDateInput) birthDateInput.addEventListener('blur', () => this.validateDates());
        if (deathDateInput) deathDateInput.addEventListener('blur', () => this.validateDates());
    }
    
    validateDates() {
        const t = this.t.bind(this);
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        const birthDateError = document.getElementById('birthDateError');
        const deathDateError = document.getElementById('deathDateError');
        
        if (!birthDateInput || !deathDateInput) return true;
        
        let isValid = true;
        birthDateInput.classList.remove('date-error');
        deathDateInput.classList.remove('date-error');
        if (birthDateError) birthDateError.style.display = 'none';
        if (deathDateError) deathDateError.style.display = 'none';
        
        const birthValue = birthDateInput.value;
        const deathValue = deathDateInput.value;
        
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
    
    validateLuw() {
        const luwInput = document.getElementById('luw');
        const luwError = document.getElementById('luwError');
        
        if (!luwInput) return true;
        
        const value = luwInput.value.trim();
        
        if (value === '') {
            if (luwError) luwError.style.display = 'none';
            luwInput.classList.remove('luw-error');
            return true;
        }
        
        const isValid = /^[0-9]$/.test(value);
        
        if (!isValid) {
            luwInput.classList.add('luw-error');
            if (luwError) {
                luwError.textContent = this.t('invalidLuw');
                luwError.style.display = 'block';
            }
        } else {
            luwInput.classList.remove('luw-error');
            if (luwError) luwError.style.display = 'none';
        }
        
        return isValid;
    }
    
    setupLuwValidation() {
        const luwInput = document.getElementById('luw');
        if (luwInput) {
            luwInput.addEventListener('input', (e) => {
                let value = e.target.value;
                // Alleen cijfers toestaan
                value = value.replace(/[^0-9]/g, '');
                if (value.length > 1) value = value.charAt(0);
                e.target.value = value;
                this.validateLuw();
            });
            
            luwInput.addEventListener('blur', () => {
                this.validateLuw();
            });
        }
    }
    
    validateParents() {
        const t = this.t.bind(this);
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        const fatherError = document.getElementById('fatherError');
        const motherError = document.getElementById('motherError');
        
        let isValid = true;
        
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
    
    hasAccessToDog(dog) {
        if (!dog) return false;
        if (this.isAdmin) return true;
        if (this.isUserPlus) return dog.user_id === this.currentUser?.id;
        return false;
    }
    
    showInitialView() {
        const container = document.getElementById('searchResults');
        const t = this.t.bind(this);
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-search display-1 text-muted opacity-50"></i>
                <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                <small class="text-muted">${this.isAdmin ? this.t('adminMode') : this.t('userPlusMode')}</small>
            </div>
        `;
    }
    
    displaySearchResults(searchTerm = '') {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (this.filteredSearchResults.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${t('noResults')}</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${t('searchResults')}: <strong>${this.filteredSearchResults.length}</strong>
                ${searchTerm ? `voor "${searchTerm}"` : ''}
            </div>
        `;
        
        this.filteredSearchResults.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : dog.geslacht === 'teven' ? t('female') : t('unknown');
            html += `
                <div class="search-result-item" data-id="${dog.id}">
                    <div class="dog-name">${dog.naam || 'Onbekend'} ${dog.kennelnaam || ''}</div>
                    <div class="dog-info">
                        ${dog.ras ? `<span><i class="bi bi-tag me-1"></i>${dog.ras}</span>` : ''}
                        ${dog.stamboomnr ? `<span><i class="bi bi-hash me-1"></i>${dog.stamboomnr}</span>` : ''}
                        <span><i class="bi bi-gender-ambiguous me-1"></i>${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                this.selectDogForEditing(dogId);
            });
        });
    }
    
    async selectDogForEditing(dogId) {
        try {
            console.log(`[DEBUG] Selecting dog with ID: ${dogId}`);
            if (!dogId || isNaN(dogId)) {
                this.showError(this.t('invalidId'));
                return;
            }
            
            let dog = null;
            
            if (hondenService && typeof hondenService.getHondById === 'function') {
                dog = await hondenService.getHondById(dogId);
            }
            
            if (!dog) {
                this.showError(this.t('dogNotFound'));
                return;
            }
            
            if (!this.hasAccessToDog(dog)) {
                this.showError(this.isUserPlus ? this.t('notYourDog') : this.t('accessDeniedEdit'));
                return;
            }
            
            this.selectedDog = dog;
            this.currentDogId = dogId;
            
            // Haal de volledige data op voor vader en moeder voordat we het formulier vullen
            await this.loadParentNames(dog);
            
            this.fillFormWithDogData(dog);
            this.showEditSection();
            this.showSuccess(`${this.t('dogSelected')}: ${dog.naam}`);
            
        } catch (error) {
            console.error('Fout bij selecteren hond:', error);
            this.showError(`${this.t('searchFailed')}${error.message}`);
        }
    }
    
    async loadParentNames(dog) {
        // Laad vader data als vader_id bestaat
        if (dog.vader_id) {
            try {
                const vaderData = await hondenService.getHondById(dog.vader_id);
                if (vaderData) {
                    dog.vader_naam = vaderData.naam;
                    dog.vader_kennelnaam = vaderData.kennelnaam;
                    dog.vader_stamboomnr = vaderData.stamboomnr;
                }
            } catch (e) {
                console.warn('Kon vader data niet laden:', e);
            }
        }
        
        // Laad moeder data als moeder_id bestaat
        if (dog.moeder_id) {
            try {
                const moederData = await hondenService.getHondById(dog.moeder_id);
                if (moederData) {
                    dog.moeder_naam = moederData.naam;
                    dog.moeder_kennelnaam = moederData.kennelnaam;
                    dog.moeder_stamboomnr = moederData.stamboomnr;
                }
            } catch (e) {
                console.warn('Kon moeder data niet laden:', e);
            }
        }
    }
    
    makeDisplayName(dog) {
        if (!dog) return '';
        let displayName = dog.naam || '';
        if (dog.kennelnaam && dog.kennelnaam.trim()) displayName += ` ${dog.kennelnaam}`;
        return displayName.trim();
    }
    
    fillFormWithDogData(dog) {
        document.getElementById('dogId').value = dog.id || '';
        document.getElementById('dogName').value = dog.naam || '';
        document.getElementById('kennelName').value = dog.kennelnaam || '';
        document.getElementById('pedigreeNumber').value = dog.stamboomnr || '';
        document.getElementById('breed').value = dog.ras || '';
        document.getElementById('gender').value = dog.geslacht || '';
        document.getElementById('toegevoegd_door').value = dog.user_id || '';
        
        const coatColorSelect = document.getElementById('coatColor');
        if (coatColorSelect) {
            let found = false;
            for (let i = 0; i < coatColorSelect.options.length; i++) {
                if (coatColorSelect.options[i].value === dog.vachtkleur) {
                    coatColorSelect.selectedIndex = i;
                    found = true;
                    break;
                }
            }
            if (!found) coatColorSelect.selectedIndex = 0;
        }
        
        const vaderId = dog.vader_id || null;
        if (vaderId) {
            document.getElementById('vader_id').value = vaderId;
            document.getElementById('vader_stamboomnr').value = dog.vader_stamboomnr || '';
            document.getElementById('father').setAttribute('data-valid-parent', 'true');
            
            // VUL DE VOLLEDIGE NAAM IN VOOR VADER (naam + kennelnaam)
            const fatherName = dog.vader_naam || dog.vader || '';
            const fatherKennel = dog.vader_kennelnaam || '';
            let fullFatherName = fatherName;
            if (fatherKennel && fatherKennel.trim()) {
                fullFatherName = `${fatherName} ${fatherKennel}`.trim();
            }
            document.getElementById('father').value = fullFatherName;
        } else {
            document.getElementById('vader_id').value = '';
            document.getElementById('vader_stamboomnr').value = '';
            document.getElementById('father').setAttribute('data-valid-parent', 'false');
            document.getElementById('father').value = dog.vader || '';
        }
        
        const moederId = dog.moeder_id || null;
        if (moederId) {
            document.getElementById('moeder_id').value = moederId;
            document.getElementById('moeder_stamboomnr').value = dog.moeder_stamboomnr || '';
            document.getElementById('mother').setAttribute('data-valid-parent', 'true');
            
            // VUL DE VOLLEDIGE NAAM IN VOOR MOEDER (naam + kennelnaam)
            const motherName = dog.moeder_naam || dog.moeder || '';
            const motherKennel = dog.moeder_kennelnaam || '';
            let fullMotherName = motherName;
            if (motherKennel && motherKennel.trim()) {
                fullMotherName = `${motherName} ${motherKennel}`.trim();
            }
            document.getElementById('mother').value = fullMotherName;
        } else {
            document.getElementById('moeder_id').value = '';
            document.getElementById('moeder_stamboomnr').value = '';
            document.getElementById('mother').setAttribute('data-valid-parent', 'false');
            document.getElementById('mother').value = dog.moeder || '';
        }
        
        const formatDateForDisplay = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            } catch (e) {
                return dateString;
            }
        };
        
        document.getElementById('birthDate').value = formatDateForDisplay(dog.geboortedatum);
        document.getElementById('deathDate').value = formatDateForDisplay(dog.overlijdensdatum);
        
        document.getElementById('hipDysplasia').value = dog.heupdysplasie || '';
        document.getElementById('elbowDysplasia').value = dog.elleboogdysplasie || '';
        document.getElementById('patellaLuxation').value = dog.patella || '';
        document.getElementById('eyes').value = dog.ogen || '';
        document.getElementById('eyesExplanation').value = dog.ogenverklaring || '';
        document.getElementById('dandyWalker').value = dog.dandyWalker || '';
        document.getElementById('luw').value = dog.luw || '';
        document.getElementById('thyroid').value = dog.schildklier || '';
        document.getElementById('thyroidExplanation').value = dog.schildklierverklaring || '';
        document.getElementById('country').value = dog.land || '';
        document.getElementById('zipCode').value = dog.postcode || '';
        document.getElementById('remarks').value = dog.opmerkingen || '';
        
        const dogNameElement = document.getElementById('editingDogName');
        if (dogNameElement) dogNameElement.textContent = dog.naam || this.t('unknown');
        
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            fileStatus.textContent = this.t('noFileChosen');
            fileStatus.classList.remove('file-selected');
        }
        
        const fatherError = document.getElementById('fatherError');
        const motherError = document.getElementById('motherError');
        if (fatherError) fatherError.style.display = 'none';
        if (motherError) motherError.style.display = 'none';
        document.getElementById('father').classList.remove('parent-validation-error');
        document.getElementById('mother').classList.remove('parent-validation-error');
        
        // Reset LUW error state
        const luwError = document.getElementById('luwError');
        if (luwError) luwError.style.display = 'none';
        const luwInput = document.getElementById('luw');
        if (luwInput) luwInput.classList.remove('luw-error');
    }
    
    showEditSection() {
        const searchSection = document.getElementById('searchSection');
        const editSection = document.getElementById('editSection');
        const cancelBtn = document.getElementById('cancelEditBtn');
        const saveBtn = document.getElementById('saveChangesBtn');
        const deleteBtn = document.getElementById('deleteDogBtn');
        
        if (searchSection) searchSection.style.display = 'none';
        if (editSection) editSection.style.display = 'block';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (deleteBtn) deleteBtn.style.display = 'inline-block';
        
        this.setupParentAutocomplete();
        this.setupDateFields();
        this.setupLuwValidation();
        
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            fileStatus.textContent = this.t('noFileChosen');
            fileStatus.classList.remove('file-selected');
        }
    }
    
    showSearchSection() {
        const searchSection = document.getElementById('searchSection');
        const editSection = document.getElementById('editSection');
        const cancelBtn = document.getElementById('cancelEditBtn');
        const saveBtn = document.getElementById('saveChangesBtn');
        const deleteBtn = document.getElementById('deleteDogBtn');
        
        if (searchSection) searchSection.style.display = 'block';
        if (editSection) editSection.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        if (deleteBtn) deleteBtn.style.display = 'none';
        
        const form = document.getElementById('editDogForm');
        if (form) form.reset();
        
        const dogIdInput = document.getElementById('dogId');
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        const vaderStamboomnrInput = document.getElementById('vader_stamboomnr');
        const moederStamboomnrInput = document.getElementById('moeder_stamboomnr');
        const toegevoegdDoorInput = document.getElementById('toegevoegd_door');
        
        if (dogIdInput) dogIdInput.value = '';
        if (vaderIdInput) vaderIdInput.value = '';
        if (moederIdInput) moederIdInput.value = '';
        if (vaderStamboomnrInput) vaderStamboomnrInput.value = '';
        if (moederStamboomnrInput) moederStamboomnrInput.value = '';
        if (toegevoegdDoorInput) toegevoegdDoorInput.value = '';
        
        const fileInput = document.getElementById('dogPhoto');
        if (fileInput) fileInput.value = '';
        
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            fileStatus.textContent = this.t('noFileChosen');
            fileStatus.classList.remove('file-selected');
        }
        
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        if (fatherInput) {
            fatherInput.setAttribute('data-valid-parent', 'false');
            fatherInput.classList.remove('parent-validation-error');
        }
        if (motherInput) {
            motherInput.setAttribute('data-valid-parent', 'false');
            motherInput.classList.remove('parent-validation-error');
        }
        
        // Reset LUW error state
        const luwError = document.getElementById('luwError');
        if (luwError) luwError.style.display = 'none';
        const luwInput = document.getElementById('luw');
        if (luwInput) {
            luwInput.classList.remove('luw-error');
            luwInput.value = '';
        }
        
        this.selectedDog = null;
        this.currentDogId = null;
        this.filteredSearchResults = [];
        this.showInitialView();
        
        const searchInput = document.getElementById('dogSearch');
        if (searchInput) searchInput.value = '';
        const statusEl = document.getElementById('searchStatus');
        if (statusEl) statusEl.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${this.t('typeToSearch')}`;
    }
    
    /**
     * NIEUWE SETUP VOOR OUDER AUTOCOMPLETE - MET DATABASE QUERIES
     */
    setupParentAutocomplete() {
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        
        if (fatherInput) {
            this.setupSingleParentAutocomplete(fatherInput, 'father', 'vader_id', 'vader_stamboomnr');
        }
        if (motherInput) {
            this.setupSingleParentAutocomplete(motherInput, 'mother', 'moeder_id', 'moeder_stamboomnr');
        }
    }
    
    setupSingleParentAutocomplete(inputElement, parentField, hiddenIdField, hiddenStamboomnrField) {
        const oldInput = inputElement.cloneNode(true);
        inputElement.parentNode.replaceChild(oldInput, inputElement);
        inputElement = oldInput;
        
        const statusEl = document.getElementById(`${parentField}SearchStatus`);
        
        inputElement.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            
            if (this.parentSearchTimeout) clearTimeout(this.parentSearchTimeout);
            
            if (searchTerm.length === 0) {
                if (statusEl) statusEl.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${this.t('typeToSearch')}`;
                this.hideParentAutocomplete(parentField);
                const hiddenIdElement = document.getElementById(hiddenIdField);
                const hiddenStamboomnrElement = document.getElementById(hiddenStamboomnrField);
                if (hiddenIdElement) hiddenIdElement.value = '';
                if (hiddenStamboomnrElement) hiddenStamboomnrElement.value = '';
                return;
            }
            
            if (searchTerm.length < this.minSearchLength) {
                if (statusEl) statusEl.innerHTML = `<i class="bi bi-exclamation-circle me-1 text-warning"></i> ${this.t('typeMore')}`;
                this.hideParentAutocomplete(parentField);
                return;
            }
            
            if (statusEl) statusEl.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> ${this.t('searchingParent')}`;
            
            this.parentSearchTimeout = setTimeout(async () => {
                const results = await this.searchParents(searchTerm, parentField);
                this.showParentAutocomplete(results, parentField, searchTerm);
                if (statusEl) statusEl.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${this.t('typeToSearch')}`;
            }, 300);
        });
        
        inputElement.addEventListener('blur', () => {
            setTimeout(() => this.hideParentAutocomplete(parentField), 200);
        });
        
        inputElement.addEventListener('focus', () => {
            inputElement.classList.remove('parent-validation-error');
            const errorElement = document.getElementById(`${parentField}Error`);
            if (errorElement) errorElement.style.display = 'none';
        });
    }
    
    showParentAutocomplete(results, parentField, searchTerm) {
        const input = document.getElementById(parentField);
        const dropdown = document.getElementById(`${parentField}Autocomplete`);
        const hiddenIdField = parentField === 'father' ? 'vader_id' : 'moeder_id';
        const hiddenStamboomnrField = parentField === 'father' ? 'vader_stamboomnr' : 'moeder_stamboomnr';
        
        if (!input || !dropdown) return;
        
        if (results.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        results.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : this.t('female');
            const displayName = dog.naam ? `${dog.naam} ${dog.kennelnaam || ''}`.trim() : 'Onbekend';
            
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
        
        dropdown.querySelectorAll('.parent-autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                const dogName = item.getAttribute('data-name');
                const dogKennelnaam = item.getAttribute('data-kennelnaam');
                const dogStamboomnr = item.getAttribute('data-stamboomnr');
                
                const displayName = dogName ? `${dogName} ${dogKennelnaam || ''}`.trim() : '';
                input.value = displayName;
                input.setAttribute('data-valid-parent', 'true');
                input.classList.remove('parent-validation-error');
                
                const errorElement = document.getElementById(`${parentField}Error`);
                if (errorElement) errorElement.style.display = 'none';
                
                const hiddenIdElement = document.getElementById(hiddenIdField);
                const hiddenStamboomnrElement = document.getElementById(hiddenStamboomnrField);
                if (hiddenIdElement) hiddenIdElement.value = dogId;
                if (hiddenStamboomnrElement) hiddenStamboomnrElement.value = dogStamboomnr;
                
                dropdown.style.display = 'none';
                input.focus();
            });
        });
    }
    
    hideParentAutocomplete(parentField) {
        const dropdown = document.getElementById(`${parentField}Autocomplete`);
        if (dropdown) dropdown.style.display = 'none';
    }
    
    async saveDogChanges() {
        console.log('[DEBUG] === START saveDogChanges ===');
        
        if (!this.validateDates()) {
            this.showError(this.t('dateFormatError'));
            return;
        }
        
        if (!this.validateParents()) {
            this.showError(this.t('parentNotSelected'));
            return;
        }
        
        if (!this.validateLuw()) {
            this.showError(this.t('invalidLuw'));
            return;
        }
        
        const dogId = document.getElementById('dogId');
        if (!dogId || !dogId.value) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        const parsedId = parseInt(dogId.value);
        if (isNaN(parsedId)) {
            this.showError(this.t('invalidId'));
            return;
        }
        
        let originalDog = null;
        if (hondenService && typeof hondenService.getHondById === 'function') {
            originalDog = await hondenService.getHondById(parsedId);
        }
        
        if (!originalDog) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        if (!this.hasAccessToDog(originalDog)) {
            this.showError(this.isUserPlus ? this.t('notYourDog') : this.t('accessDeniedEdit'));
            return;
        }
        
        const birthDateInput = document.getElementById('birthDate');
        const deathDateInput = document.getElementById('deathDate');
        const birthDateValue = birthDateInput ? birthDateInput.value : '';
        const deathDateValue = deathDateInput ? deathDateInput.value : '';
        
        const formatDateForStorage = (dateString) => {
            if (!dateString) return null;
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return null;
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            } catch (e) {
                return null;
            }
        };
        
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        const vaderStamboomnrInput = document.getElementById('vader_stamboomnr');
        const moederStamboomnrInput = document.getElementById('moeder_stamboomnr');
        
        const vader_id = vaderIdInput && vaderIdInput.value && !isNaN(parseInt(vaderIdInput.value)) ? parseInt(vaderIdInput.value) : null;
        const moeder_id = moederIdInput && moederIdInput.value && !isNaN(parseInt(moederIdInput.value)) ? parseInt(moederIdInput.value) : null;
        const vader_stamboomnr = vaderStamboomnrInput && vaderStamboomnrInput.value.trim() ? vaderStamboomnrInput.value.trim() : null;
        const moeder_stamboomnr = moederStamboomnrInput && moederStamboomnrInput.value.trim() ? moederStamboomnrInput.value.trim() : null;
        
        // Haal de volledige namen op voor vader en moeder
        let vaderNaam = '';
        let vaderKennelnaam = '';
        let moederNaam = '';
        let moederKennelnaam = '';
        
        if (vader_id) {
            try {
                const vaderData = await hondenService.getHondById(vader_id);
                if (vaderData) {
                    vaderNaam = vaderData.naam || '';
                    vaderKennelnaam = vaderData.kennelnaam || '';
                }
            } catch (e) {
                console.warn('Kon vader data niet ophalen:', e);
            }
        }
        
        if (moeder_id) {
            try {
                const moederData = await hondenService.getHondById(moeder_id);
                if (moederData) {
                    moederNaam = moederData.naam || '';
                    moederKennelnaam = moederData.kennelnaam || '';
                }
            } catch (e) {
                console.warn('Kon moeder data niet ophalen:', e);
            }
        }
        
        const luwInput = document.getElementById('luw');
        const luwValue = luwInput && luwInput.value.trim() ? luwInput.value.trim() : null;
        
        const dogData = {
            id: parsedId,
            naam: document.getElementById('dogName').value.trim(),
            kennelnaam: document.getElementById('kennelName').value.trim(),
            stamboomnr: document.getElementById('pedigreeNumber').value.trim(),
            ras: document.getElementById('breed').value.trim(),
            vachtkleur: document.getElementById('coatColor').value || null,
            geslacht: document.getElementById('gender').value,
            vader: vaderNaam,
            vader_kennelnaam: vaderKennelnaam,
            vader_id: vader_id,
            vader_stamboomnr: vader_stamboomnr,
            moeder: moederNaam,
            moeder_kennelnaam: moederKennelnaam,
            moeder_id: moeder_id,
            moeder_stamboomnr: moeder_stamboomnr,
            geboortedatum: formatDateForStorage(birthDateValue),
            overlijdensdatum: formatDateForStorage(deathDateValue),
            heupdysplasie: document.getElementById('hipDysplasia').value || null,
            elleboogdysplasie: document.getElementById('elbowDysplasia').value || null,
            patella: document.getElementById('patellaLuxation').value || null,
            ogen: document.getElementById('eyes').value || null,
            ogenverklaring: document.getElementById('eyesExplanation')?.value.trim() || null,
            dandyWalker: document.getElementById('dandyWalker').value || null,
            luw: luwValue,
            schildklier: document.getElementById('thyroid').value || null,
            schildklierverklaring: document.getElementById('thyroidExplanation')?.value.trim() || null,
            land: document.getElementById('country').value.trim() || null,
            postcode: document.getElementById('zipCode').value.trim() || null,
            opmerkingen: document.getElementById('remarks').value.trim() || null,
            updatedat: new Date().toISOString()
        };
        
        if (!dogData.naam || !dogData.stamboomnr || !dogData.ras) {
            this.showError(this.t('fieldsRequired'));
            return;
        }
        
        this.addToLastBreeds(dogData.ras);
        this.showProgress(this.t('savingChanges'));
        
        try {
            const result = await hondenService.updateHond(dogData);
            if (result && result.error) throw new Error(result.error.message || 'Update mislukt');
            
            this.hideProgress();
            this.showSuccess(this.t('dogUpdated'));
            
            const photoInput = document.getElementById('dogPhoto');
            if (photoInput && photoInput.files && photoInput.files.length > 0) {
                try {
                    await this.uploadPhoto(dogData.stamboomnr, photoInput.files[0]);
                } catch (photoError) {
                    console.warn('Foto upload mislukt:', photoError);
                }
            }
            
            setTimeout(() => this.showSearchSection(), 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Fout bij opslaan wijzigingen:', error);
            this.showError(`${this.t('updateFailed')} ${error.message}`);
        }
    }
    
    async deleteDog() {
        const dogId = document.getElementById('dogId');
        if (!dogId || !dogId.value) {
            this.showError(this.t('dogNotFound'));
            return;
        }
        
        const parsedId = parseInt(dogId.value);
        if (isNaN(parsedId)) {
            this.showError(this.t('invalidId'));
            return;
        }
        
        if (!this.isAdmin) {
            this.showError(this.t('adminOnly'));
            return;
        }
        
        const dogNameInput = document.getElementById('dogName');
        const dogName = dogNameInput ? dogNameInput.value : `Hond ID: ${parsedId}`;
        
        if (!confirm(`${this.t('confirmDelete')}\n\n${dogName} (ID: ${parsedId})`)) return;
        
        this.showProgress(this.t('deleting'));
        
        try {
            if (hondenService && typeof hondenService.verwijderHond === 'function') {
                await hondenService.verwijderHond(parsedId);
            } else {
                throw new Error('verwijderHond methode niet beschikbaar');
            }
            
            this.hideProgress();
            this.showSuccess(`${this.t('dogDeleted')}: ${dogName}`);
            setTimeout(() => this.showSearchSection(), 1500);
            
        } catch (error) {
            this.hideProgress();
            console.error('Error deleting dog:', error);
            this.showError(`${this.t('deleteFailed')}${error.message}`);
        }
    }
    
    async uploadPhoto(pedigreeNumber, file) {
        const t = this.t.bind(this);
        
        try {
            if (file.size > 5 * 1024 * 1024) throw new Error('Bestand te groot (max 5MB)');
            
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) throw new Error('Ongeldig bestandstype');
            
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        const user = window.auth ? window.auth.getCurrentUser() : null;
                        if (!user || !user.id) throw new Error('Niet ingelogd');
                        
                        const base64Data = e.target.result;
                        
                        let thumbnail = null;
                        try {
                            const img = new Image();
                            img.src = base64Data;
                            await new Promise((resolve) => {
                                img.onload = () => {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    const maxSize = 200;
                                    let width = img.width, height = img.height;
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
                            thumbnail = base64Data;
                        }
                        
                        const fotoData = {
                            stamboomnr: pedigreeNumber,
                            data: base64Data,
                            thumbnail: thumbnail,
                            filename: file.name,
                            size: file.size,
                            type: file.type,
                            uploaded_at: new Date().toISOString(),
                            geupload_door: user.id
                        };
                        
                        const { error: dbError } = await window.supabase.from('fotos').insert(fotoData);
                        if (dbError) throw dbError;
                        
                        this.showSuccess(this.t('photoAdded'));
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error('Fout bij lezen bestand'));
                reader.readAsDataURL(file);
            });
        } catch (error) {
            this.showError(`${this.t('photoError')}${error.message}`);
            throw error;
        }
    }
    
    addToLastBreeds(breed) {
        if (!breed || breed.trim() === '') return;
        const breedStr = breed.trim();
        const index = this.lastBreeds.indexOf(breedStr);
        if (index > -1) this.lastBreeds.splice(index, 1);
        this.lastBreeds.unshift(breedStr);
        if (this.lastBreeds.length > 5) this.lastBreeds = this.lastBreeds.slice(0, 5);
        localStorage.setItem('lastBreeds', JSON.stringify(this.lastBreeds));
    }
    
    translateModal() {
        const currentLang = localStorage.getItem('appLanguage') || 'nl';
        const translations = {
            nl: { editDogData: "Data Hond Bewerken", close: "Sluiten", refresh: "Pagina Vernieuwen", accessDenied: "Toegang Geweigerd" },
            en: { editDogData: "Edit Dog Data", close: "Close", refresh: "Refresh Page", accessDenied: "Access Denied" },
            de: { editDogData: "Hundedaten bearbeiten", close: "Schließen", refresh: "Seite aktualisieren", accessDenied: "Zugriff Verweigert" }
        };
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[currentLang] && translations[currentLang][key]) el.textContent = translations[currentLang][key];
        });
    }
    
    async init() {
        console.log('DogDataManager geïnitialiseerd');
        return true;
    }
    
    showProgress(message) {
        if (window.uiHandler && window.uiHandler.showProgress) window.uiHandler.showProgress(message);
        else console.log('Progress:', message);
    }
    
    hideProgress() {
        if (window.uiHandler && window.uiHandler.hideProgress) window.uiHandler.hideProgress();
        else console.log('Hide progress');
    }
    
    showSuccess(message) {
        if (window.uiHandler && window.uiHandler.showSuccess) window.uiHandler.showSuccess(message);
        else console.log('Success:', message);
    }
    
    showError(message) {
        if (window.uiHandler && window.uiHandler.showError) window.uiHandler.showError(message);
        else console.error('Error:', message);
    }
}

if (typeof window !== 'undefined') {
    window.DogDataManager = DogDataManager;
}