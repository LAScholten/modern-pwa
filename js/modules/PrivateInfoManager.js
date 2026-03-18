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
                notesTab: "Mijn notities"
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
                notesTab: "My notes"
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
                notesTab: "Meine Notizen"
            }
        };
    }
    
    t(key) { 
        const langTranslations = this.translations[this.currentLang];
        if (langTranslations && langTranslations[key]) {
            return langTranslations[key];
        }
        return this.translations['nl'][key] || key; 
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
                                    <textarea class="form-control" id="privateNotes" rows="8" placeholder="${t('notesPlaceholder')}"></textarea>
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
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
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
            const searchInput = document.getElementById('privateHondSearch');
            
            if (searchContainer && searchContainer.style.display !== 'none') {
                if (!searchContainer.contains(e.target) && !(searchInput && searchInput.contains(e.target))) {
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
            document.getElementById('privateNotes').value = '';
            this.showSuccess(this.t('notesCleared'));
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
            const preview = note.privatenotes.substring(0, 80) + (note.privatenotes.length > 80 ? '...' : '');
            const genderText = note.dogData?.geslacht === 'reuen' ? this.t('male') : 
                             note.dogData?.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            html += `
                <div class="note-item" data-stamboomnr="${note.stamboomnr}" data-index="${index}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <div class="fw-bold">
                                ${note.dogName}
                                ${note.kennelName ? `<span class="text-muted ms-2">${note.kennelName}</span>` : ''}
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
                        ${preview}
                    </div>
                    <div class="note-meta">
                        <i class="bi bi-clock"></i> ${this.formatDate(note.datum_aangepast || note.datum_aangemaakt)}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const stamboomnr = item.getAttribute('data-stamboomnr');
                this.loadNoteForDog(stamboomnr);
                
                document.querySelectorAll('.note-item').forEach(i => {
                    i.classList.remove('selected');
                });
                item.classList.add('selected');
            });
        });
    }
    
    async loadNoteForDog(stamboomnr) {
        const note = this.allPriveInfo.find(info => info.stamboomnr === stamboomnr);
        const dog = this.allDogs.find(d => d.stamboomnr === stamboomnr);
        
        if (!note || !dog) {
            this.showError('Hond niet gevonden');
            return;
        }
        
        this.currentPriveInfo = {
            ...note,
            privateNotes: note.privatenotes || ''
        };
        
        this.displayPrivateInfo();
        
        this.selectedDogId = dog.id;
        this.selectedDogStamboomnr = dog.stamboomnr;
        this.selectedDogNaam = dog.naam;
        this.selectedDogData = dog;
        
        document.getElementById('privateHondSearch').value = dog.naam || '';
        this.updateSelectedDogInfo(dog);
        
        this.showSuccess(`Notities geladen voor ${dog.naam}`);
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