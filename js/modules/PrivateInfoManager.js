class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.isLoading = false;
        this.currentPriveInfo = null;
        this.searchType = 'name'; // 'name' of 'kennel'
        this.filteredDogs = [];
        this.dogsWithNotes = []; // Nieuwe array voor honden met notities
        this.allPriveInfo = []; // Alle prive info records
        
        // Zoek variabelen
        this.searchTimeout = null;
        this.minSearchLength = 2; // Minimale lengte voor zoeken
        
        // Callback voor het tonen van dog details (wordt gezet door main app)
        this.onShowDogDetails = null;
        
        this.translations = {
            nl: {
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                selectDog: "Selecteer Hond",
                dog: "Hond",
                typeDogName: "Typ hondennaam...",
                loadInfo: "Info Laden",
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt veilig opgeslagen",
                privateNote: "Deze notities zijn alleen voor u zichtbaar",
                clear: "Wissen",
                save: "Opslaan",
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie opgeslagen!",
                clearConfirm: "Weet je zeker dat je alle notities wilt wissen?",
                loadingDogs: "Honden laden...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Typ minimaal 2 tekens om te zoeken...",
                loaded: "geladen",
                loadFailed: "Laden mislukt",
                dogsLoaded: "honden geladen",
                serviceNotAvailable: "Service niet beschikbaar",
                loadError: "Fout bij laden",
                saveError: "Fout bij opslaan",
                notesCleared: "Notities gewist",
                close: "Sluiten",
                
                // Zoekfunctionaliteit vertalingen
                searchName: "Zoek hond op naam (of naam + kennelnaam)",
                searchKennel: "Zoek hond op kennelnaam",
                searchPlaceholder: "Typ naam of kennelnaam...",
                kennelPlaceholder: "Typ kennelnaam...",
                typeToSearchKennel: "Typ een kennelnaam om te zoeken (min. 2 tekens)",
                found: "gevonden",
                name: "Naam",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                male: "Reu",
                female: "Teef",
                unknown: "Onbekend",
                
                // Nieuwe vertalingen voor notities overzicht
                myNotes: "Mijn notities",
                dogsWithNotes: "Honden met notities",
                noNotesFound: "Nog geen notities aangemaakt",
                clickToLoad: "Klik om notities te laden",
                lastEdited: "Laatst bewerkt",
                notesCount: "notities",
                loadNotesList: "Laad notities overzicht",
                loadingNotes: "Notities laden...",
                notesLoaded: "notities geladen",
                searchTab: "Zoeken",
                notesTab: "Mijn notities",
                backToNotes: "Terug naar notities",
                
                // Vertalingen voor detail popup
                dogDetails: "Hond Details",
                dogDetailsModalTitle: "Details van {name}",
                father: "Vader",
                mother: "Moeder",
                parentsUnknown: "Onbekend",
                parents: "Ouders",
                healthInfo: "Gezondheidsinformatie",
                additionalInfo: "Extra informatie",
                remarks: "Opmerkingen",
                noHealthInfo: "Geen gezondheidsinformatie beschikbaar",
                noAdditionalInfo: "Geen extra informatie beschikbaar",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                eyesExplanation: "Verklaring ogen",
                dandyWalker: "Dandy Walker Malformation",
                luw: "LÜW/LTV",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                privateInfoLabel: "Prive Informatie",
                privateInfoOwnerOnly: "Geen informatie",
                pedigreeButton: "Stamboom",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                loading: "Laden...",
                viewDogDetails: "Bekijk hond details",
                
                hipGrades: {
                    A: "A - Geen tekenen van HD",
                    B: "B - Overgangsvorm",
                    C: "C - Lichte HD",
                    D: "D - Matige HD", 
                    E: "E - Ernstige HD"
                },
                elbowGrades: {
                    "0": "0 - Geen ED",
                    "1": "1 - Milde ED",
                    "2": "2 - Matige ED",
                    "3": "3 - Ernstige ED",
                    "NB": "NB - Niet bekend"
                },
                patellaGrades: {
                    "0": "0 - Geen PL",
                    "1": "1 - Af en toe luxatie",
                    "2": "2 - Regelmatig luxatie",
                    "3": "3 - Constante luxatie"
                },
                eyeStatus: {
                    "Vrij": "Vrij",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Overig"
                },
                dandyStatus: {
                    "Vrij op DNA": "Vrij op DNA",
                    "Vrij op ouders": "Vrij op ouders", 
                    "Drager": "Drager",
                    "Lijder": "Lijder"
                },
                luwGrades: {
                    "0": "0 - Vrij",
                    "1": "1 - Licht",
                    "2": "2 - Matig",
                    "3": "3 - Ernstig"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negatief",
                    "Positief": "Tgaa Positive"
                }
            },
            en: {
                privateInfo: "Private Information",
                privateNotes: "Private Notes",
                notesPlaceholder: "Enter all confidential information here...",
                selectDog: "Select Dog",
                dog: "Dog",
                typeDogName: "Type dog name...",
                loadInfo: "Load Info",
                securityInfo: "Security Information",
                privateStorage: "All information is securely stored",
                privateNote: "These notes are only visible to you",
                clear: "Clear",
                save: "Save",
                selectDogFirst: "Select a dog first",
                loadingInfo: "Loading private info...",
                noInfoFound: "No private information found",
                savingInfo: "Saving private info...",
                saveSuccess: "Private information saved!",
                clearConfirm: "Are you sure you want to clear all notes?",
                loadingDogs: "Loading dogs...",
                noDogsFound: "No dogs found",
                typeToSearch: "Type at least 2 characters to search...",
                loaded: "loaded",
                loadFailed: "Load failed",
                dogsLoaded: "dogs loaded",
                serviceNotAvailable: "Service not available",
                loadError: "Load error",
                saveError: "Save error",
                notesCleared: "Notes cleared",
                close: "Close",
                
                // Search functionality translations
                searchName: "Search dog by name (or name + kennel)",
                searchKennel: "Search dog by kennel name",
                searchPlaceholder: "Type name or kennel name...",
                kennelPlaceholder: "Type kennel name...",
                typeToSearchKennel: "Type a kennel name to search (min. 2 characters)",
                found: "found",
                name: "Name",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                male: "Male",
                female: "Female",
                unknown: "Unknown",
                
                // New translations for notes overview
                myNotes: "My notes",
                dogsWithNotes: "Dogs with notes",
                noNotesFound: "No notes created yet",
                clickToLoad: "Click to load notes",
                lastEdited: "Last edited",
                notesCount: "notes",
                loadNotesList: "Load notes overview",
                loadingNotes: "Loading notes...",
                notesLoaded: "notes loaded",
                searchTab: "Search",
                notesTab: "My notes",
                backToNotes: "Back to notes",
                
                // Translations for detail popup
                dogDetails: "Dog Details",
                dogDetailsModalTitle: "Details of {name}",
                father: "Father",
                mother: "Mother",
                parentsUnknown: "Unknown",
                parents: "Parents",
                healthInfo: "Health Information",
                additionalInfo: "Additional Information",
                remarks: "Remarks",
                noHealthInfo: "No health information available",
                noAdditionalInfo: "No additional information available",
                birthDate: "Birth date",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                eyesExplanation: "Eye explanation",
                dandyWalker: "Dandy Walker Malformation",
                luw: "LÜW/LTV",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                privateInfoLabel: "Private Information",
                privateInfoOwnerOnly: "No information",
                pedigreeButton: "Pedigree",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                loading: "Loading...",
                viewDogDetails: "View dog details",
                
                hipGrades: {
                    A: "A - No signs of HD",
                    B: "B - Borderline",
                    C: "C - Mild HD",
                    D: "D - Moderate HD",
                    E: "E - Severe HD"
                },
                elbowGrades: {
                    "0": "0 - No ED",
                    "1": "1 - Mild ED",
                    "2": "2 - Moderate ED",
                    "3": "3 - Severe ED",
                    "NB": "NB - Not known"
                },
                patellaGrades: {
                    "0": "0 - No PL",
                    "1": "1 - Occasional luxation",
                    "2": "2 - Frequent luxation",
                    "3": "3 - Constant luxation"
                },
                eyeStatus: {
                    "Vrij": "Free",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Other"
                },
                dandyStatus: {
                    "Vrij op DNA": "Free on DNA",
                    "Vrij op ouders": "Free on parents",
                    "Drager": "Carrier",
                    "Lijder": "Affected"
                },
                luwGrades: {
                    "0": "0 - Free",
                    "1": "1 - Mild",
                    "2": "2 - Moderate",
                    "3": "3 - Severe"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negative",
                    "Positief": "Tgaa Positive"
                }
            },
            de: {
                privateInfo: "Private Informationen",
                privateNotes: "Private Notizen",
                notesPlaceholder: "Geben Sie hier alle vertraulichen Informationen ein...",
                selectDog: "Hund auswählen",
                dog: "Hund",
                typeDogName: "Hundename eingeben...",
                loadInfo: "Info Laden",
                securityInfo: "Sicherheitsinformationen",
                privateStorage: "Alle Informationen werden sicher gespeichert",
                privateNote: "Diese Notizen sind nur für Sie sichtbar",
                clear: "Löschen",
                save: "Speichern",
                selectDogFirst: "Zuerst einen Hund auswählen",
                loadingInfo: "Private Informationen werden geladen...",
                noInfoFound: "Keine privaten Informationen gefunden",
                savingInfo: "Private Informationen werden gespeichert...",
                saveSuccess: "Private Informationen gespeichert!",
                clearConfirm: "Sind Sie sicher, dass Sie alle Notizen löschen möchten?",
                loadingDogs: "Hunde werden geladen...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Geben Sie mindestens 2 Zeichen ein...",
                loaded: "geladen",
                loadFailed: "Laden fehlgeschlagen",
                dogsLoaded: "Hunde geladen",
                serviceNotAvailable: "Service nicht verfügbar",
                loadError: "Fehler beim Laden",
                saveError: "Fehler beim Speichern",
                notesCleared: "Notizen gelöscht",
                close: "Schließen",
                
                // Suchfunktion Übersetzungen
                searchName: "Hund nach Namen suchen (oder Name + Kennel)",
                searchKennel: "Hund nach Kennelname suchen",
                searchPlaceholder: "Name oder Kennelname eingeben...",
                kennelPlaceholder: "Kennelnamen eingeben...",
                typeToSearchKennel: "Kennelnamen eingeben um zu suchen (min. 2 Zeichen)",
                found: "gefunden",
                name: "Name",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                male: "Rüde",
                female: "Hündin",
                unknown: "Unbekannt",
                
                // Neue Übersetzungen für Notizenübersicht
                myNotes: "Meine Notizen",
                dogsWithNotes: "Hunde mit Notizen",
                noNotesFound: "Noch keine Notizen erstellt",
                clickToLoad: "Klicken um Notizen zu laden",
                lastEdited: "Zuletzt bearbeitet",
                notesCount: "Notizen",
                loadNotesList: "Notizenübersicht laden",
                loadingNotes: "Notizen werden geladen...",
                notesLoaded: "Notizen geladen",
                searchTab: "Suche",
                notesTab: "Meine Notizen",
                backToNotes: "Zurück zu Notizen",
                
                // Übersetzungen für Detail-Popup
                dogDetails: "Hund Details",
                dogDetailsModalTitle: "Details von {name}",
                father: "Vater",
                mother: "Mutter",
                parentsUnknown: "Unbekannt",
                parents: "Eltern",
                healthInfo: "Gesundheitsinformationen",
                additionalInfo: "Zusätzliche Informationen",
                remarks: "Bemerkungen",
                noHealthInfo: "Keine Gesundheitsinformationen verfügbar",
                noAdditionalInfo: "Keine zusätzliche Informationen verfügbar",
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker Malformation",
                luw: "LÜW/LTV",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                privateInfoLabel: "Private Informationen",
                privateInfoOwnerOnly: "Keine Informationen",
                pedigreeButton: "Ahnentafel",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                clickToEnlarge: "Klicken zum Vergrößern",
                loading: "Laden...",
                viewDogDetails: "Hunddetails ansehen",
                
                hipGrades: {
                    A: "A - Keine Anzeichen von HD",
                    B: "B - Grenzform",
                    C: "C - Leichte HD",
                    D: "D - Mittelschwere HD",
                    E: "E - Schwere HD"
                },
                elbowGrades: {
                    "0": "0 - Keine ED",
                    "1": "1 - Leichte ED",
                    "2": "2 - Mittelschwere ED",
                    "3": "3 - Schwere ED",
                    "NB": "NB - Nicht bekannt"
                },
                patellaGrades: {
                    "0": "0 - Keine PL",
                    "1": "1 - Gelegentliche Luxation",
                    "2": "2 - Häufige Luxation",
                    "3": "3 - Ständige Luxation"
                },
                eyeStatus: {
                    "Vrij": "Frei",
                    "Distichiasis": "Distichiasis",
                    "Overig": "Andere"
                },
                dandyStatus: {
                    "Vrij op DNA": "Frei auf DNA",
                    "Vrij op ouders": "Frei auf Eltern",
                    "Drager": "Träger",
                    "Lijder": "Betroffen"
                },
                luwGrades: {
                    "0": "0 - Frei",
                    "1": "1 - Leicht",
                    "2": "2 - Mittel",
                    "3": "3 - Schwer"
                },
                thyroidStatus: {
                    "Negatief": "Tgaa Negativ",
                    "Positief": "Tgaa Positiv"
                }
            }
        };
    }
    
    t(key, subKey = null) { 
        const langTranslations = this.translations[this.currentLang];
        if (subKey && langTranslations && langTranslations[key] && typeof langTranslations[key] === 'object') {
            return langTranslations[key][subKey] || subKey;
        }
        if (langTranslations && langTranslations[key]) {
            return langTranslations[key];
        }
        return this.translations['nl'][key] || key; 
    }
    
    // Set callback voor het tonen van dog details (wordt aangeroepen vanuit main app)
    setCallbacks(onShowDogDetails) {
        this.onShowDogDetails = onShowDogDetails;
    }
    
    async showModal() {
        if (!document.getElementById('privateInfoModal')) {
            document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
            this.setupEvents();
        }
        
        const modalElement = document.getElementById('privateInfoModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        return `
            <div class="modal fade" id="privateInfoModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title"><i class="bi bi-lock"></i> ${t('privateInfo')}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Tabs voor Zoeken en Mijn notities -->
                            <ul class="nav nav-tabs mb-3" id="privateInfoTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="search-tab" data-bs-toggle="tab" data-bs-target="#searchTab" type="button" role="tab">
                                        <i class="bi bi-search"></i> ${t('searchTab')}
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="notes-tab" data-bs-toggle="tab" data-bs-target="#notesTab" type="button" role="tab">
                                        <i class="bi bi-journal-text"></i> ${t('myNotes')}
                                    </button>
                                </li>
                            </ul>
                            
                            <!-- Tab content -->
                            <div class="tab-content" id="privateInfoTabsContent">
                                <!-- Zoek tab -->
                                <div class="tab-pane fade show active" id="searchTab" role="tabpanel">
                                    <div class="row mb-4">
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header"><h6 class="mb-0"><i class="bi bi-search"></i> ${t('selectDog')}</h6></div>
                                                <div class="card-body">
                                                    <!-- Tab knoppen voor zoektype -->
                                                    <div class="d-flex mb-3">
                                                        <button type="button" class="btn btn-search-type btn-outline-dark active me-2" data-search-type="name">
                                                            ${t('searchName')}
                                                        </button>
                                                        <button type="button" class="btn btn-search-type btn-outline-dark" data-search-type="kennel">
                                                            ${t('searchKennel')}
                                                        </button>
                                                    </div>
                                                    
                                                    <!-- Zoekveld -->
                                                    <div class="mb-3" id="searchFieldContainer">
                                                        <label class="form-label fw-bold small" id="searchLabel">${t('searchName')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0">
                                                                <i class="bi bi-search text-muted"></i>
                                                            </span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                                   id="privateHondSearch" 
                                                                   placeholder="${t('searchPlaceholder')}" 
                                                                   autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${t('typeToSearch')}</div>
                                                    </div>
                                                    
                                                    <!-- Zoekresultaten container -->
                                                    <div id="searchResultsContainer" style="max-height: 300px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 6px; margin-top: 10px; display: none;">
                                                        <div id="searchResultsList"></div>
                                                    </div>
                                                    
                                                    <div class="mt-3">
                                                        <div class="small text-muted" id="selectedDogInfo"></div>
                                                    </div>
                                                    
                                                    <button class="btn btn-dark w-100 mt-3" id="loadPrivateInfoBtn">${t('loadInfo')}</button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header"><h6 class="mb-0"><i class="bi bi-shield"></i> ${t('securityInfo')}</h6></div>
                                                <div class="card-body">
                                                    <div class="small">
                                                        <p><i class="bi bi-check-circle text-success"></i> ${t('privateStorage')}</p>
                                                        <p><i class="bi bi-person-check text-info"></i> ${t('privateNote')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Mijn notities tab -->
                                <div class="tab-pane fade" id="notesTab" role="tabpanel">
                                    <div class="row mb-4">
                                        <div class="col-12">
                                            <div class="card">
                                                <div class="card-header d-flex justify-content-between align-items-center">
                                                    <h6 class="mb-0"><i class="bi bi-journal-text"></i> ${t('dogsWithNotes')}</h6>
                                                    <button class="btn btn-sm btn-outline-dark" id="refreshNotesListBtn">
                                                        <i class="bi bi-arrow-repeat"></i> ${t('loadNotesList')}
                                                    </button>
                                                </div>
                                                <div class="card-body">
                                                    <!-- Notities lijst container -->
                                                    <div id="notesListContainer" style="max-height: 400px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 6px;">
                                                        <div id="notesListContent" class="p-3 text-center text-muted">
                                                            <i class="bi bi-journal-text opacity-50" style="font-size: 2rem;"></i>
                                                            <p class="mt-2">${t('clickToLoad')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Notities gedeelte (altijd zichtbaar) -->
                            <div class="card mt-3">
                                <div class="card-header"><h6 class="mb-0"><i class="bi bi-journal-text"></i> ${t('privateNotes')}</h6></div>
                                <div class="card-body">
                                    <textarea class="form-control auto-resize-textarea" id="privateNotes" rows="8" placeholder="${t('notesPlaceholder')}" style="overflow-y: hidden;"></textarea>
                                    <div class="d-flex justify-content-between mt-3">
                                        <button class="btn btn-secondary" id="clearPrivateInfoBtn">${t('clear')}</button>
                                        <button class="btn btn-dark" id="savePrivateInfoBtn">${t('save')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Dog Details Modal Popup (alleen Back to Notes knop) -->
            <div class="modal-overlay dog-details-modal-overlay" id="dogDetailsModalOverlay" style="display: none;">
                <div class="modal-container dog-details-modal-container" style="max-width: 800px;">
                    <div class="modal-header dog-details-modal-header">
                        <h5 class="modal-title dog-details-modal-title">
                            <i class="bi bi-info-circle me-2"></i> <span id="dogDetailsModalTitle">${t('dogDetails')}</span>
                        </h5>
                    </div>
                    <div class="modal-body dog-details-modal-body" id="dogDetailsModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${t('loading')}</span>
                            </div>
                            <p class="mt-3">${t('loading')}</p>
                        </div>
                    </div>
                    <div class="modal-footer dog-details-modal-footer">
                        <button type="button" class="btn btn-primary back-to-notes-btn">
                            <i class="bi bi-arrow-left me-1"></i> ${t('backToNotes')}
                        </button>
                    </div>
                </div>
            </div>
            
            <style>
                .btn-search-type {
                    flex: 1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                
                .btn-search-type.active {
                    background-color: #212529;
                    color: white;
                    border-color: #212529;
                }
                
                .search-input {
                    font-size: 1rem;
                    padding: 8px 12px;
                    border: 2px solid #dee2e6;
                    border-radius: 6px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #212529;
                    box-shadow: 0 0 0 0.25rem rgba(33, 37, 41, 0.25);
                }
                
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 10px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                }
                
                .dog-result-item.selected {
                    background-color: #e8f4fd;
                    border-left: 4px solid #212529;
                }
                
                .dog-name-line {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #212529;
                    margin-bottom: 4px;
                }
                
                .dog-details-line {
                    color: #495057;
                    font-size: 0.85rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    align-items: center;
                }
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 10px;
                    padding: 10px 15px;
                    border-bottom: 1px solid #dee2e6;
                    background-color: #f8f9fa;
                }
                
                /* Styling voor notities lijst */
                .note-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 12px 15px;
                    background: white;
                }
                
                .note-item:hover {
                    background-color: #f8f9fa;
                }
                
                .note-item.selected {
                    background-color: #e8f4fd;
                    border-left: 4px solid #212529;
                }
                
                .note-preview {
                    font-size: 0.9rem;
                    color: #495057;
                    margin-top: 5px;
                    white-space: normal;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                    max-width: 100%;
                }
                
                .note-meta {
                    font-size: 0.8rem;
                    color: #6c757d;
                    margin-top: 5px;
                }
                
                .nav-tabs .nav-link {
                    color: #495057;
                    font-weight: 500;
                }
                
                .nav-tabs .nav-link.active {
                    color: #212529;
                    font-weight: 600;
                    border-bottom: 2px solid #212529;
                }
                
                /* Auto-resize textarea styling */
                .auto-resize-textarea {
                    resize: none;
                    overflow-y: hidden;
                    transition: height 0.1s ease;
                    min-height: 60px;
                }
                
                /* Dog Details Modal Overlay styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 1100;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                }
                
                .modal-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                    width: 90%;
                    max-width: 900px;
                    animation: slideUp 0.3s;
                }
                
                .dog-details-modal-header {
                    background: linear-gradient(135deg, #0d6efd, #0b5ed7);
                    padding: 16px 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .dog-details-modal-title {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                }
                
                .dog-details-modal-body {
                    padding: 20px;
                    overflow-y: auto;
                    flex: 1;
                    max-height: 60vh;
                }
                
                .dog-details-modal-footer {
                    padding: 15px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                    text-align: center;
                }
                
                /* Details card styles */
                .details-card {
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .details-header {
                    background: white;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .dog-name-header {
                    color: #0d6efd;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }
                
                .dog-detail-header-line {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                    margin-top: 8px;
                    color: #495057;
                }
                
                .info-group {
                    margin-bottom: 20px;
                }
                
                .info-group-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    color: #6c757d;
                    letter-spacing: 1px;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .father-card, .mother-card {
                    padding: 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .father-card {
                    background: #e8f4fd;
                    border: 1px solid #cfe2ff;
                }
                
                .father-card:hover {
                    background: #d1e7ff;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .mother-card {
                    background: #fce8f1;
                    border: 1px solid #f8d7e3;
                }
                
                .mother-card:hover {
                    background: #f9d9e9;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .parent-name, .parent-mother-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .parent-name {
                    color: #0d6efd;
                }
                
                .parent-mother-name {
                    color: #dc3545;
                }
                
                .parent-info {
                    color: #6c757d;
                    font-size: 0.85rem;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 15px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                }
                
                .badge-hd { background-color: #20c997; color: white; }
                .badge-ed { background-color: #6f42c1; color: white; }
                .badge-pl { background-color: #fd7e14; color: white; }
                .badge-eyes { background-color: #17a2b8; color: white; }
                .badge-dandy { background-color: #e83e8c; color: white; }
                .badge-luw { background-color: #fd7e14; color: white; }
                .badge-thyroid { background-color: #28a745; color: white; }
                
                .photos-section {
                    margin-bottom: 15px;
                }
                
                .photos-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    color: #6c757d;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .photos-grid-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-top: 5px;
                }
                
                .photo-thumbnail {
                    position: relative;
                    width: 48px;
                    height: 48px;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 1px solid #dee2e6;
                    transition: all 0.2s;
                }
                
                .photo-thumbnail:hover {
                    border-color: #0d6efd;
                    transform: scale(1.1);
                }
                
                .thumbnail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .photo-hover {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .photo-thumbnail:hover .photo-hover {
                    opacity: 1;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .modal-container {
                        width: 95% !important;
                        max-width: 95% !important;
                        margin: 0 10px !important;
                    }
                    .dog-details-modal-body {
                        max-height: 70vh !important;
                    }
                    .photo-thumbnail {
                        width: 40px;
                        height: 40px;
                    }
                }
            </style>
        `;
    }
    
    setupEvents() {
        // Setup zoektype knoppen
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const searchType = e.target.getAttribute('data-search-type');
                this.switchSearchType(searchType);
            });
        });
        
        // Setup zoekveld
        const searchInput = document.getElementById('privateHondSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                
                if (searchTerm.length >= this.minSearchLength) {
                    // Gebruik debounce om te veel zoekopdrachten te voorkomen
                    if (this.searchTimeout) clearTimeout(this.searchTimeout);
                    this.searchTimeout = setTimeout(() => {
                        this.searchDogs(searchTerm);
                    }, 300);
                } else {
                    this.hideSearchResults();
                }
            });
            
            searchInput.addEventListener('focus', () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm.length >= this.minSearchLength) {
                    this.searchDogs(searchTerm);
                }
            });
        }
        
        // Event listeners voor knoppen
        document.addEventListener('click', (e) => {
            if (e.target && (e.target.id === 'loadPrivateInfoBtn' || e.target.closest('#loadPrivateInfoBtn'))) {
                e.preventDefault();
                this.loadPrivateInfoForDog();
            }
            
            if (e.target && (e.target.id === 'savePrivateInfoBtn' || e.target.closest('#savePrivateInfoBtn'))) {
                e.preventDefault();
                this.savePrivateInfo();
            }
            
            if (e.target && (e.target.id === 'clearPrivateInfoBtn' || e.target.closest('#clearPrivateInfoBtn'))) {
                e.preventDefault();
                this.clearPrivateInfo();
            }
            
            if (e.target && (e.target.id === 'refreshNotesListBtn' || e.target.closest('#refreshNotesListBtn'))) {
                e.preventDefault();
                this.loadDogsWithNotes();
            }
        });
        
        // Klik buiten zoekresultaten om ze te verbergen
        document.addEventListener('click', (e) => {
            const searchContainer = document.getElementById('searchResultsContainer');
            const searchInputElem = document.getElementById('privateHondSearch');
            
            if (searchContainer && searchContainer.style.display !== 'none') {
                if (!searchContainer.contains(e.target) && !(searchInputElem && searchInputElem.contains(e.target))) {
                    this.hideSearchResults();
                }
            }
        });
        
        // Event listener voor tab changes
        const notesTab = document.getElementById('notes-tab');
        if (notesTab) {
            notesTab.addEventListener('shown.bs.tab', () => {
                this.loadDogsWithNotes();
            });
        }
        
        // Setup auto-resize voor textarea
        const notesTextarea = document.getElementById('privateNotes');
        if (notesTextarea) {
            this.setupAutoResize(notesTextarea);
        }
        
        // Setup dog details modal event listeners (alleen Back to Notes knop)
        this.setupDogDetailsModalEvents();
    }
    
    setupDogDetailsModalEvents() {
        // Alleen de Back to Notes knop sluit de modal
        document.addEventListener('click', (e) => {
            const backBtn = e.target.closest('.back-to-notes-btn');
            if (backBtn) {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
            }
        });
        
        // Escape key om te sluiten (werkt wel, want dat is standaard gebruikersverwachting)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay && overlay.style.display === 'flex') {
                    overlay.style.display = 'none';
                }
            }
        });
    }
    
    setupAutoResize(textarea) {
        const autoResize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        textarea.addEventListener('input', autoResize);
        textarea.addEventListener('focus', autoResize);
        
        // Kleine vertraging om te zorgen dat de initiële hoogte correct is
        setTimeout(autoResize, 10);
        
        // Sla de functie op zodat we hem later kunnen gebruiken (bijv. na het laden van notities)
        textarea._autoResize = autoResize;
    }
    
    switchSearchType(type) {
        this.searchType = type;
        
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            const btnType = btn.getAttribute('data-search-type');
            if (btnType === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update label en placeholder
        const searchLabel = document.getElementById('searchLabel');
        const searchInput = document.getElementById('privateHondSearch');
        
        if (searchLabel && searchInput) {
            if (type === 'name') {
                searchLabel.textContent = this.t('searchName');
                searchInput.placeholder = this.t('searchPlaceholder');
            } else {
                searchLabel.textContent = this.t('searchKennel');
                searchInput.placeholder = this.t('kennelPlaceholder');
            }
        }
        
        // Maak zoekveld leeg en verberg resultaten
        if (searchInput) {
            searchInput.value = '';
        }
        this.hideSearchResults();
        document.getElementById('selectedDogInfo').innerHTML = '';
        this.selectedDogId = null;
        this.selectedDogStamboomnr = null;
        this.selectedDogNaam = null;
        this.selectedDogData = null;
    }
    
    /**
     * VERBETERDE ZOEKFUNCTIE DIE WERKT MET "NAAM KENNELNAAM"
     */
    async searchDogs(searchTerm) {
        try {
            console.log(`🔍 Zoeken naar: "${searchTerm}"`);
            
            const supabase = window.supabase;
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return;
            }
            
            // Splits de zoekterm in losse woorden
            const words = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
            
            let query = supabase
                .from('honden')
                .select('*');
            
            if (words.length === 1) {
                // Eén woord: zoek in alle velden
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%,stamboomnr.ilike.%${searchTerm}%`);
            } else {
                // Meerdere woorden: maak combinaties voor "naam kennelnaam"
                const conditions = [];
                
                // 1. De hele string in naam
                conditions.push(`naam.ilike.%${searchTerm}%`);
                
                // 2. De hele string in kennelnaam
                conditions.push(`kennelnaam.ilike.%${searchTerm}%`);
                
                // 3. Eerste woord in naam, rest in kennelnaam
                const firstWord = words[0];
                const restWords = words.slice(1).join(' ');
                conditions.push(`and(naam.ilike.%${firstWord}%,kennelnaam.ilike.%${restWords}%)`);
                
                // 4. Eerste woord in kennelnaam, rest in naam
                conditions.push(`and(kennelnaam.ilike.%${firstWord}%,naam.ilike.%${restWords}%)`);
                
                // 5. Alle woorden moeten voorkomen in naam (AND)
                const naamConditions = words.map(w => `naam.ilike.%${w}%`).join(',');
                conditions.push(`and(${naamConditions})`);
                
                // 6. Alle woorden moeten voorkomen in kennelnaam (AND)
                const kennelConditions = words.map(w => `kennelnaam.ilike.%${w}%`).join(',');
                conditions.push(`and(${kennelConditions})`);
                
                // Combineer alle opties met OR
                query = query.or(conditions.join(','));
            }
            
            const { data, error } = await query
                .order('naam')
                .limit(100);
            
            if (error) {
                console.error('❌ Database error:', error);
                return;
            }
            
            this.filteredDogs = data || [];
            console.log(`✅ ${this.filteredDogs.length} honden gevonden`);
            
            this.displaySearchResults();
            
        } catch (error) {
            console.error('❌ Fout bij zoeken:', error);
        }
    }
    
    displaySearchResults() {
        const container = document.getElementById('searchResultsContainer');
        const list = document.getElementById('searchResultsList');
        
        if (!container || !list) return;
        
        if (this.filteredDogs.length === 0) {
            list.innerHTML = `
                <div class="text-center py-3">
                    <i class="bi bi-search-x text-muted opacity-50" style="font-size: 2rem;"></i>
                    <p class="mt-2 text-muted">${this.t('noDogsFound')}</p>
                </div>
            `;
            container.style.display = 'block';
            return;
        }
        
        let html = `
            <div class="search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${this.filteredDogs.length} ${this.t('found')}
            </div>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                             dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}" data-stamboomnr="${dog.stamboomnr || ''}">
                    <!-- REGEL 1: Naam + Kennelnaam -->
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || this.t('unknown')}</span>
                        ${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}
                    </div>
                    
                    <!-- REGEL 2: Stamboomnummer + Ras + Geslacht -->
                    <div class="dog-details-line">
                        ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                        ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                        <span class="geslacht">${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        list.innerHTML = html;
        container.style.display = 'block';
        
        // Scroll naar top
        container.scrollTop = 0;
        
        // Voeg event listeners toe aan de resultaten
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const dogId = parseInt(item.getAttribute('data-id'));
                const stamboomnr = item.getAttribute('data-stamboomnr');
                
                // Verwijder selected class van alle items
                document.querySelectorAll('.dog-result-item').forEach(i => {
                    i.classList.remove('selected');
                });
                
                // Voeg selected class toe aan geklikt item
                item.classList.add('selected');
                
                // Update het zoekveld met de naam van de geselecteerde hond
                const dog = this.filteredDogs.find(d => d.id === dogId);
                if (dog) {
                    document.getElementById('privateHondSearch').value = dog.naam || '';
                    
                    // Update de geselecteerde hond info
                    this.updateSelectedDogInfo(dog);
                    
                    // Sla de geselecteerde hond op
                    this.selectedDogId = dog.id;
                    this.selectedDogStamboomnr = dog.stamboomnr;
                    this.selectedDogNaam = dog.naam;
                    this.selectedDogData = dog;
                }
                
                // Verberg zoekresultaten
                this.hideSearchResults();
            });
        });
    }
    
    hideSearchResults() {
        const container = document.getElementById('searchResultsContainer');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    updateSelectedDogInfo(dog) {
        const infoDiv = document.getElementById('selectedDogInfo');
        if (!infoDiv) return;
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                         dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        infoDiv.innerHTML = `
            <div class="fw-bold">${dog.naam || ''} ${dog.kennelnaam ? `(${dog.kennelnaam})` : ''}</div>
            <div class="small">${dog.stamboomnr || ''} • ${dog.ras || ''} • ${genderText}</div>
        `;
    }
    
    async loadPrivateInfoForDog() {
        if (!this.selectedDogId || !this.selectedDogStamboomnr) {
            this.showError(this.t('selectDogFirst'));
            return;
        }
        
        const stamboomnr = this.selectedDogStamboomnr;
        
        this.showProgress(this.t('loadingInfo'));
        
        try {
            if (!window.priveInfoService) throw new Error(this.t('serviceNotAvailable'));
            
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            const priveInfo = result.priveInfo?.find(info => info.stamboomnr === stamboomnr);
            
            this.currentPriveInfo = priveInfo ? {
                ...priveInfo,
                privateNotes: priveInfo.privatenotes || ''
            } : null;
            
            this.hideProgress();
            this.displayPrivateInfo();
            
        } catch (error) {
            console.error('Error loading private info:', error);
            this.hideProgress();
            this.showError(this.t('loadError') + ': ' + error.message);
        }
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        notesTextarea.value = this.currentPriveInfo?.privateNotes || '';
        notesTextarea.removeAttribute('disabled');
        
        // Trigger de auto-resize functionaliteit
        if (notesTextarea._autoResize) {
            // Kleine vertraging om ervoor te zorgen dat de DOM volledig is bijgewerkt
            setTimeout(() => {
                notesTextarea._autoResize();
            }, 10);
        }
    }
    
    async savePrivateInfo() {
        if (!this.selectedDogId || !this.selectedDogStamboomnr) {
            this.showError(this.t('selectDogFirst'));
            return;
        }
        
        const stamboomnr = this.selectedDogStamboomnr;
        const notes = document.getElementById('privateNotes')?.value.trim() || '';
        
        this.showProgress(this.t('savingInfo'));
        
        try {
            if (!window.priveInfoService) throw new Error(this.t('serviceNotAvailable'));
            
            const priveInfo = { stamboomnr: stamboomnr, privateNotes: notes };
            await window.priveInfoService.bewaarPriveInfo(priveInfo);
            this.currentPriveInfo = priveInfo;
            
            this.hideProgress();
            this.showSuccess(this.t('saveSuccess'));
            
            if (document.getElementById('notes-tab').classList.contains('active')) {
                this.loadDogsWithNotes();
            }
            
        } catch (error) {
            console.error('Error saving:', error);
            this.hideProgress();
            this.showError(this.t('saveError') + ': ' + error.message);
        }
    }
    
    clearPrivateInfo() {
        if (confirm(this.t('clearConfirm'))) {
            const notesTextarea = document.getElementById('privateNotes');
            notesTextarea.value = '';
            this.showSuccess(this.t('notesCleared'));
            
            // Reset de hoogte van de textarea
            if (notesTextarea._autoResize) {
                setTimeout(() => {
                    notesTextarea._autoResize();
                }, 10);
            }
        }
    }
    
    async loadDogsWithNotes() {
        this.showProgress(this.t('loadingNotes'));
        
        try {
            if (!window.priveInfoService) throw new Error(this.t('serviceNotAvailable'));
            
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            this.allPriveInfo = result.priveInfo || [];
            
            console.log(`Geladen prive info records: ${this.allPriveInfo.length}`);
            
            const notesWithContent = this.allPriveInfo.filter(info => 
                info.privatenotes && info.privatenotes.trim() !== ''
            );
            
            const stamboomnrs = notesWithContent.map(info => info.stamboomnr).filter(nr => nr);
            
            let dogs = [];
            if (stamboomnrs.length > 0) {
                const supabase = window.supabase;
                const { data } = await supabase
                    .from('honden')
                    .select('*')
                    .in('stamboomnr', stamboomnrs);
                dogs = data || [];
            }
            
            this.dogsWithNotes = notesWithContent.map(info => {
                const dog = dogs.find(d => d.stamboomnr === info.stamboomnr);
                return {
                    ...info,
                    dogData: dog || null,
                    dogId: dog?.id || null,
                    dogName: dog?.naam || 'Onbekende hond',
                    kennelName: dog?.kennelnaam || '',
                    heeftHondGegevens: !!dog
                };
            }).filter(item => item.heeftHondGegevens);
            
            this.dogsWithNotes.sort((a, b) => a.dogName.localeCompare(b.dogName));
            
            this.hideProgress();
            this.displayNotesList();
            
        } catch (error) {
            console.error('Error loading notes list:', error);
            this.hideProgress();
            this.showError(this.t('loadError') + ': ' + error.message);
        }
    }
    
    displayNotesList() {
        const container = document.getElementById('notesListContent');
        if (!container) return;
        
        if (this.dogsWithNotes.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-journal-x opacity-50" style="font-size: 3rem;"></i>
                    <p class="mt-3 text-muted">${this.t('noNotesFound')}</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.dogsWithNotes.forEach((note, index) => {
            // Toon nu de volledige notitie in het overzicht, niet alleen een preview
            const fullNote = note.privatenotes;
            const genderText = note.dogData?.geslacht === 'reuen' ? this.t('male') : 
                             note.dogData?.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            html += `
                <div class="note-item" data-dog-id="${note.dogId}" data-dog-name="${this.escapeHtml(note.dogName)}" data-stamboomnr="${note.stamboomnr}" data-index="${index}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="fw-bold">
                                ${this.escapeHtml(note.dogName)}
                                ${note.kennelName ? `<span class="text-muted ms-2">${this.escapeHtml(note.kennelName)}</span>` : ''}
                            </div>
                            <div class="small text-muted">
                                ${note.stamboomnr || ''} • ${note.dogData?.ras || ''} • ${genderText}
                            </div>
                        </div>
                        <span class="badge bg-dark-subtle text-dark">
                            <i class="bi bi-journal-text"></i>
                        </span>
                    </div>
                    <div class="note-preview">
                        <i class="bi bi-quote text-muted opacity-50"></i>
                        ${this.escapeHtml(fullNote)}
                    </div>
                    <div class="note-meta">
                        <i class="bi bi-clock"></i> ${this.formatDate(note.datum_aangepast || note.datum_aangemaakt)}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Voeg event listeners toe aan de note items - nu tonen we de detail popup!
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Haal dog ID en naam op van het item
                const dogId = parseInt(item.getAttribute('data-dog-id'));
                const dogName = item.getAttribute('data-dog-name');
                const stamboomnr = item.getAttribute('data-stamboomnr');
                
                if (dogId && dogId > 0) {
                    // Toon de detail popup
                    this.showDogDetailsPopup(dogId, dogName);
                    
                    // Markeer het geselecteerde item
                    document.querySelectorAll('.note-item').forEach(i => {
                        i.classList.remove('selected');
                    });
                    item.classList.add('selected');
                    
                    // Laad ook de notities in het tekstveld (optioneel, maar handig)
                    this.loadNoteForDog(stamboomnr);
                }
            });
        });
    }
    
    /**
     * Toon de dog details popup (zelfde stijl als in OffspringManager)
     */
    async showDogDetailsPopup(dogId, dogName = '') {
        // Haal de hond details op
        const dog = await this.getDogDetails(dogId);
        if (!dog) {
            this.showError(`Hond niet gevonden (ID: ${dogId})`);
            return;
        }
        
        const overlay = document.getElementById('dogDetailsModalOverlay');
        if (!overlay) {
            console.error('Dog details modal overlay not found');
            return;
        }
        
        // Update de titel
        const titleSpan = document.getElementById('dogDetailsModalTitle');
        if (titleSpan) {
            titleSpan.textContent = this.t('dogDetailsModalTitle', '').replace('{name}', dogName || dog.naam || this.t('unknown'));
        }
        
        // Toon de overlay
        overlay.style.display = 'flex';
        
        // Laad en toon de details
        await this.loadAndDisplayDogDetails(dog);
    }
    
    /**
     * Haal hond details op uit de database
     */
    async getDogDetails(dogId) {
        try {
            const supabase = window.supabase;
            if (!supabase) return null;
            
            const { data, error } = await supabase
                .from('honden')
                .select('*')
                .eq('id', dogId)
                .single();
            
            if (error) {
                console.error('Fout bij ophalen hond details:', error);
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Fout bij ophalen hond details:', error);
            return null;
        }
    }
    
    /**
     * Haal foto's op voor een hond
     */
    async getDogPhotos(dogId) {
        if (!dogId || dogId === 0) return [];
        
        try {
            const dog = await this.getDogDetails(dogId);
            if (!dog || !dog.stamboomnr) return [];
            
            const supabase = window.supabase;
            const { data: fotos, error } = await supabase
                .from('fotos')
                .select('*')
                .eq('stamboomnr', dog.stamboomnr)
                .order('uploaded_at', { ascending: false });
            
            if (error) {
                console.error('Supabase error bij ophalen foto\'s:', error);
                return [];
            }
            
            return fotos || [];
        } catch (error) {
            console.error('Fout bij ophalen foto\'s:', error);
            return [];
        }
    }
    
    /**
     * Laad en toon hond details in de popup
     */
    async loadAndDisplayDogDetails(dog) {
        const contentDiv = document.getElementById('dogDetailsModalContent');
        if (!contentDiv) return;
        
        const t = this.t.bind(this);
        
        // Haal ouder informatie op
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        if (dog.vader_id) {
            const father = await this.getDogDetails(dog.vader_id);
            if (father) {
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || t('unknown'),
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || '',
                    kennelnaam: father.kennelnaam || ''
                };
            }
        }
        
        if (dog.moeder_id) {
            const mother = await this.getDogDetails(dog.moeder_id);
            if (mother) {
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || t('unknown'),
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || '',
                    kennelnaam: mother.kennelnaam || ''
                };
            }
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        };
        
        const getHealthBadge = (value, type) => {
            if (!value || value === '') {
                return `<span class="badge bg-secondary">${t('unknown')}</span>`;
            }
            
            let badgeClass = '';
            let badgeText = value;
            
            switch(type) {
                case 'hip':
                    badgeClass = 'badge-hd';
                    badgeText = t('hipGrades', value) || value;
                    break;
                case 'elbow':
                    badgeClass = 'badge-ed';
                    badgeText = t('elbowGrades', value) || value;
                    break;
                case 'patella':
                    badgeClass = 'badge-pl';
                    badgeText = t('patellaGrades', value) || value;
                    break;
                case 'eyes':
                    badgeClass = 'badge-eyes';
                    badgeText = t('eyeStatus', value) || value;
                    break;
                case 'dandy':
                    badgeClass = 'badge-dandy';
                    badgeText = t('dandyStatus', value) || value;
                    break;
                case 'luw':
                    badgeClass = 'badge-luw';
                    badgeText = t('luwGrades', value) || value;
                    break;
                case 'thyroid':
                    badgeClass = 'badge-thyroid';
                    badgeText = t('thyroidStatus', value) || value;
                    break;
                default:
                    badgeClass = 'badge bg-secondary';
            }
            
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        
        const displayValue = (value) => {
            return value && value !== '' ? value : t('unknown');
        };
        
        const genderText = dog.geslacht === 'reuen' ? t('male') : 
                          dog.geslacht === 'teven' ? t('female') : t('unknown');
        
        // Check of er foto's zijn
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        
        let html = `
            <div class="dog-details-content">
                <div class="details-card mb-4">
                    <div class="details-header">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="dog-name-header">${displayValue(dog.naam)}</div>
                                ${dog.kennelnaam ? `<div class="text-muted mb-2">${displayValue(dog.kennelnaam)}</div>` : ''}
                                
                                <div class="dog-detail-header-line mt-2">
                                    ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                    ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                    <span class="geslacht">${genderText}</span>
                                    ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                      `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                      `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                                </div>
                            </div>
                            <div class="text-end">
                                ${dog.geboortedatum ? `
                                <div class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>
                                    ${formatDate(dog.geboortedatum)}
                                </div>
                                ` : ''}
                                
                                ${dog.overlijdensdatum ? `
                                <div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}">
                                    <i class="bi bi-calendar-x me-1"></i>
                                    ${formatDate(dog.overlijdensdatum)}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${hasPhotos ? `
                <div class="photos-section mb-4">
                    <div class="photos-title">
                        <div class="photos-title-text">
                            <i class="bi bi-camera"></i>
                            <span>${t('photos')}</span>
                        </div>
                        <div class="click-hint-text">${t('clickToEnlarge')}</div>
                    </div>
                    <div class="photos-grid-container" id="dogDetailsPhotosGrid${dog.id}">
                    </div>
                </div>
                ` : ''}
                
                <div class="info-group mb-4">
                    <div class="info-group-title d-flex justify-content-between align-items-center">
                        <div>
                            <i class="bi bi-people me-1"></i> ${t('parents')}
                        </div>
                        <button class="btn btn-sm btn-outline-primary btn-pedigree-details" data-dog-id="${dog.id}">
                            <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}"` : ''}>
                                <div class="fw-bold mb-1 text-primary">
                                    <i class="bi bi-gender-male me-1"></i> ${t('father')}
                                </div>
                                <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}"` : ''}>
                                <div class="fw-bold mb-1 text-danger">
                                    <i class="bi bi-gender-female me-1"></i> ${t('mother')}
                                </div>
                                <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="info-group mb-4">
                    <div class="info-group-title">
                        <i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('hipDysplasia')}</div>
                            <div>${getHealthBadge(dog.heupdysplasie, 'hip')}</div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('elbowDysplasia')}</div>
                            <div>${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('patellaLuxation')}</div>
                            <div>${getHealthBadge(dog.patella, 'patella')}</div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('eyes')}</div>
                            <div>${getHealthBadge(dog.ogen, 'eyes')}</div>
                            ${dog.ogenverklaring ? `<div class="text-muted small mt-1">${dog.ogenverklaring}</div>` : ''}
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('dandyWalker')}</div>
                            <div>${getHealthBadge(dog.dandyWalker, 'dandy')}</div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('luw')}</div>
                            <div>${getHealthBadge(dog.LUW, 'luw')}</div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="fw-bold mb-1">${t('thyroid')}</div>
                            <div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>
                            ${dog.schildklierverklaring ? `<div class="text-muted small mt-1">${dog.schildklierverklaring}</div>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="info-group">
                    <div class="info-group-title">
                        <i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <div class="fw-bold mb-1">${t('country')}</div>
                            <div>${displayValue(dog.land)}</div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="fw-bold mb-1">${t('zipCode')}</div>
                            <div>${displayValue(dog.postcode)}</div>
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <div class="fw-bold mb-2">${t('remarks')}</div>
                        <div class="remarks-box">
                            ${dog.opmerkingen ? dog.opmerkingen : t('noAdditionalInfo')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contentDiv.innerHTML = html;
        
        // Laad foto's als die er zijn
        if (hasPhotos) {
            this.loadAndDisplayPhotosForModal(dog);
        }
        
        // Event listeners voor pedigree knop
        contentDiv.querySelectorAll('.btn-pedigree-details').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        // Event listeners voor ouder kaarten
        if (fatherInfo.id) {
            const fatherCard = contentDiv.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    this.showDogDetailsPopup(parentId, fatherInfo.naam);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = contentDiv.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    this.showDogDetailsPopup(parentId, motherInfo.naam);
                });
            }
        }
        
        // Event listeners voor foto thumbnails (worden toegevoegd in loadAndDisplayPhotosForModal)
    }
    
    /**
     * Laad en toon foto's in de modal
     */
    async loadAndDisplayPhotosForModal(dog) {
        try {
            const photos = await this.getDogPhotos(dog.id);
            const container = document.getElementById('dogDetailsModalContent');
            const photosGrid = container.querySelector(`#dogDetailsPhotosGrid${dog.id}`);
            
            if (!photosGrid || photos.length === 0) {
                if (photosGrid) {
                    photosGrid.innerHTML = `
                        <div class="text-muted small">${this.t('noPhotos')}</div>
                    `;
                }
                return;
            }
            
            let photosHTML = '';
            photos.forEach((photo, index) => {
                let thumbnailUrl = photo.thumbnail || photo.data;
                let fullSizeUrl = photo.data;
                
                if (thumbnailUrl && fullSizeUrl) {
                    photosHTML += `
                        <div class="photo-thumbnail" 
                             data-photo-id="${photo.id || index}" 
                             data-dog-id="${dog.id}" 
                             data-photo-index="${index}"
                             data-photo-src="${fullSizeUrl}"
                             data-thumbnail-src="${thumbnailUrl}"
                             data-dog-name="${dog.naam || ''}">
                            <img src="${thumbnailUrl}"
                                 alt="${dog.naam || ''} - ${photo.filename || ''}" 
                                 class="thumbnail-img"
                                 loading="lazy">
                            <div class="photo-hover">
                                <i class="bi bi-zoom-in"></i>
                            </div>
                        </div>
                    `;
                }
            });
            
            photosGrid.innerHTML = photosHTML;
            
            // Event listeners voor foto klikken
            photosGrid.querySelectorAll('.photo-thumbnail').forEach(thumb => {
                thumb.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const photoSrc = thumb.getAttribute('data-photo-src');
                    const dogName = thumb.getAttribute('data-dog-name') || '';
                    if (photoSrc) {
                        this.showPhotoWithViewer(photoSrc, dogName);
                    }
                });
            });
            
        } catch (error) {
            console.error('Fout bij laden foto\'s voor modal:', error);
            const container = document.getElementById('dogDetailsModalContent');
            const photosGrid = container.querySelector(`#dogDetailsPhotosGrid${dog.id}`);
            if (photosGrid) {
                photosGrid.innerHTML = `
                    <div class="text-danger small">
                        <i class="bi bi-exclamation-triangle"></i> Fout bij laden foto's
                    </div>
                `;
            }
        }
    }
    
    /**
     * Check of een hond foto's heeft
     */
    async checkDogHasPhotos(dogId) {
        const photos = await this.getDogPhotos(dogId);
        return photos.length > 0;
    }
    
    /**
     * Toon foto met PhotoViewer
     */
    async showPhotoWithViewer(photoSrc, dogName = '') {
        try {
            // Probeer de PhotoViewer te laden als die nog niet beschikbaar is
            if (!window.photoViewer) {
                await this.loadPhotoViewer();
            }
            
            if (window.photoViewer && window.photoViewer.showPhoto) {
                if (window.photoViewer.updateLanguage) {
                    window.photoViewer.updateLanguage(this.currentLang);
                }
                window.photoViewer.showPhoto(photoSrc, dogName);
            } else {
                console.error('PhotoViewer niet beschikbaar');
                window.open(photoSrc, '_blank');
            }
        } catch (error) {
            console.error('Fout bij tonen foto:', error);
            window.open(photoSrc, '_blank');
        }
    }
    
    /**
     * Laad PhotoViewer module dynamisch
     */
    async loadPhotoViewer() {
        if (window.photoViewer) {
            return true;
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/modules/PhotoViewer.js';
            script.onload = () => {
                setTimeout(() => {
                    if (window.photoViewer) {
                        resolve(true);
                    } else if (window.PhotoViewerClass) {
                        window.photoViewer = new window.PhotoViewerClass();
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }, 100);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Open pedigree voor een hond
     */
    async openPedigree(dogId) {
        try {
            // Probeer de StamboomManager te laden
            if (!window.stamboomManager) {
                if (window.StamboomManager) {
                    window.stamboomManager = new window.StamboomManager(window.supabase, this.currentLang);
                    await window.stamboomManager.initialize();
                } else {
                    console.error('StamboomManager niet beschikbaar');
                    this.showError('Stamboom functionaliteit is niet beschikbaar');
                    return;
                }
            }
            
            const dog = await this.getDogDetails(dogId);
            if (!dog) {
                this.showError("Hond niet gevonden");
                return;
            }
            
            if (window.stamboomManager.showPedigree) {
                window.stamboomManager.showPedigree(dog);
            } else {
                console.error('StamboomManager.showPedigree niet beschikbaar');
                this.showError('Stamboom functionaliteit is niet beschikbaar');
            }
            
        } catch (error) {
            console.error('Fout bij openen stamboom:', error);
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    async loadNoteForDog(stamboomnr) {
        const note = this.allPriveInfo.find(info => info.stamboomnr === stamboomnr);
        const dog = this.dogsWithNotes.find(d => d.stamboomnr === stamboomnr);
        
        if (!note || !dog) {
            this.showError('Hond niet gevonden');
            return;
        }
        
        this.currentPriveInfo = {
            ...note,
            privateNotes: note.privatenotes || ''
        };
        
        this.displayPrivateInfo();
        
        if (dog.dogData) {
            this.selectedDogId = dog.dogData.id;
            this.selectedDogStamboomnr = dog.dogData.stamboomnr;
            this.selectedDogNaam = dog.dogData.naam;
            this.selectedDogData = dog.dogData;
            
            document.getElementById('privateHondSearch').value = dog.dogData.naam || '';
            this.updateSelectedDogInfo(dog.dogData);
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/\n/g, '<br>');
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    showProgress(message) {
        if (window.uiHandler?.showProgress) window.uiHandler.showProgress(message);
    }
    
    hideProgress() {
        if (window.uiHandler?.hideProgress) window.uiHandler.hideProgress();
    }
    
    showSuccess(message) {
        if (window.uiHandler?.showSuccess) window.uiHandler.showSuccess(message);
    }
    
    showError(message) {
        if (window.uiHandler?.showError) window.uiHandler.showError(message);
    }
}

window.PrivateInfoManager = PrivateInfoManager;