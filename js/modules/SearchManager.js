/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 * GECORRIGEERDE VERSIE - ZONDER ONEINDIGE LOOPS
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        
        // Vertalingen eerst
        this.initializeTranslations();
        
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.searchType = 'name';
        this.stamboomManager = null;
        this.isMobileCollapsed = false;
        this.dogPhotosCache = new Map();
        this.dogOffspringCache = new Map();
        this.isModalOpen = false;
        
        // CRITICAL FIX: Loading state flags
        this.isLoadingAllDogs = false;
        this.hasLoadedAllDogs = false;
        
        // Event listeners
        this.setupGlobalEventListeners();
    }
    
    initializeTranslations() {
        this.translations = {
            nl: {
                searchDog: "Hond Zoeken",
                searchName: "Zoek hond op naam (of naam + kennelnaam)",
                searchKennel: "Zoek hond op kennelnaam",
                searchPlaceholder: "Typ hondennaam... of 'naam kennelnaam'",
                kennelPlaceholder: "Typ kennelnaam...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Begin met typen om te zoeken",
                typeToSearchKennel: "Typ een kennelnaam om te zoeken",
                searchResults: "Zoekresultaten",
                found: "gevonden",
                name: "Naam",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                close: "Sluiten",
                dogDetails: "Hond Details",
                father: "Vader",
                mother: "Moeder",
                parentsUnknown: "Onbekend",
                male: "Reu",
                female: "Teef",
                unknown: "Onbekend",
                loading: "Honden laden...",
                loadingAllDogs: "Alle honden laden... ({loaded} geladen)",
                backToSearch: "Terug naar zoeken",
                viewingParent: "Bekijkt ouder",
                clickToView: "Klik om details te bekijken",
                parents: "Ouders",
                noHealthInfo: "Geen gezondheidsinformatie beschikbaar",
                noAdditionalInfo: "Geen extra informatie beschikbaar",
                selectDogToView: "Selecteer een hond om details te zien",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                eyesExplanation: "Verklaring ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                country: "Land",
                zipCode: "Postcode",
                remarks: "Opmerkingen",
                healthInfo: "Gezondheidsinformatie",
                additionalInfo: "Extra informatie",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                offspring: "Nakomelingen",
                noOffspring: "Geen nakomelingen gevonden",
                viewOffspring: "Bekijk nakomelingen",
                offspringCount: "Nakomelingen",
                offspringModalTitle: "Nakomelingen van {name}",
                loadingOffspring: "Nakomelingen laden...",
                offspringList: "Lijst van nakomelingen",
                fatherColumn: "Vader",
                motherColumn: "Moeder",
                dogName: "Naam hond",
                totalOffspring: "Totaal aantal nakomelingen",
                birthYear: "Geboortejaar",
                showAllOffspring: "Toon alle nakomelingen"
            },
            en: {
                searchDog: "Search Dog",
                searchName: "Search dog by name (or name + kennel)",
                searchKennel: "Search dog by kennel name",
                searchPlaceholder: "Type dog name... or 'name kennelname'",
                kennelPlaceholder: "Type kennel name...",
                noDogsFound: "No dogs found",
                typeToSearch: "Start typing to search",
                typeToSearchKennel: "Type a kennel name to search",
                searchResults: "Search Results",
                found: "found",
                name: "Name",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                close: "Close",
                dogDetails: "Dog Details",
                father: "Father",
                mother: "Mother",
                parentsUnknown: "Unknown",
                male: "Male",
                female: "Female",
                unknown: "Unknown",
                loading: "Loading dogs...",
                loadingAllDogs: "Loading all dogs... ({loaded} loaded)",
                backToSearch: "Back to search",
                viewingParent: "Viewing parent",
                clickToView: "Click to view details",
                parents: "Parents",
                noHealthInfo: "No health information available",
                noAdditionalInfo: "No additional information available",
                selectDogToView: "Select a dog to view details",
                birthDate: "Birth date",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                eyesExplanation: "Eye explanation",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                country: "Country",
                zipCode: "Zip code",
                remarks: "Remarks",
                healthInfo: "Health Information",
                additionalInfo: "Additional Information",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                offspring: "Offspring",
                noOffspring: "No offspring found",
                viewOffspring: "View offspring",
                offspringCount: "Offspring",
                offspringModalTitle: "Offspring of {name}",
                loadingOffspring: "Loading offspring...",
                offspringList: "List of offspring",
                fatherColumn: "Father",
                motherColumn: "Mother",
                dogName: "Dog name",
                totalOffspring: "Total offspring",
                birthYear: "Birth year",
                showAllOffspring: "Show all offspring"
            }
        };
    }
    
    injectDependencies(db, auth) {
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
        console.log('SearchManager: dependencies geïnjecteerd');
    }
    
    initialize() {
        console.log('SearchManager: initializing...');
        return Promise.resolve();
    }
    
    t(key, subKey = null) {
        if (!this.translations) {
            console.error('SearchManager: translations not initialized');
            this.initializeTranslations();
        }
        
        if (!this.currentLang) {
            this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        }
        
        if (!this.translations[this.currentLang]) {
            console.warn(`SearchManager: Language '${this.currentLang}' not found, using 'nl'`);
            this.currentLang = 'nl';
        }
        
        const langTranslations = this.translations[this.currentLang];
        
        if (!langTranslations) {
            console.error(`SearchManager: No translations for language '${this.currentLang}'`);
            return key;
        }
        
        if (subKey && langTranslations[key] && typeof langTranslations[key] === 'object') {
            const result = langTranslations[key][subKey];
            return result !== undefined ? result : subKey;
        }
        
        const result = langTranslations[key];
        return result !== undefined ? result : key;
    }
    
    setupGlobalEventListeners() {
        // Alleen basic event listeners, geen dubbele
    }
    
    async getDogPhotos(dogId) {
        if (!dogId || dogId === 0) return [];
        
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        const cacheKey = `${dogId}_${dog.stamboomnr}`;
        if (this.dogPhotosCache.has(cacheKey)) {
            return this.dogPhotosCache.get(cacheKey);
        }
        
        try {
            let photos = [];
            
            // SIMPLE FIX: Probeer eerst getFotosVoorStamboomnr (de meest waarschijnlijke naam)
            if (window.hondenService && typeof window.hondenService.getFotosVoorStamboomnr === 'function') {
                photos = await window.hondenService.getFotosVoorStamboomnr(dog.stamboomnr);
            } else if (window.hondenService && typeof window.hondenService.getFotosVoorStamboomnummer === 'function') {
                photos = await window.hondenService.getFotosVoorStamboomnummer(dog.stamboomnr);
            } else {
                console.log('SearchManager: Geen foto functie beschikbaar, gebruik lege array');
                photos = [];
            }
            
            this.dogPhotosCache.set(cacheKey, photos || []);
            return photos || [];
        } catch (error) {
            console.error('Fout bij ophalen foto\'s voor hond:', dogId, error);
            return [];
        }
    }
    
    async getDogOffspring(dogId) {
        if (!dogId || dogId === 0) return [];
        
        if (this.dogOffspringCache.has(dogId)) {
            return this.dogOffspringCache.get(dogId);
        }
        
        try {
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) return [];
            
            const offspring = this.allDogs.filter(d => 
                (d.vaderId === dogId) || (d.moederId === dogId)
            );
            
            const offspringWithParents = offspring.map(puppy => {
                let fatherInfo = { naam: this.t('parentsUnknown'), stamboomnr: '' };
                let motherInfo = { naam: this.t('parentsUnknown'), stamboomnr: '' };
                
                if (puppy.vaderId) {
                    const father = this.allDogs.find(d => d.id === puppy.vaderId);
                    if (father) {
                        fatherInfo = {
                            naam: father.naam || this.t('unknown'),
                            stamboomnr: father.stamboomnr || '',
                            kennelnaam: father.kennelnaam || ''
                        };
                    }
                }
                
                if (puppy.moederId) {
                    const mother = this.allDogs.find(d => d.id === puppy.moederId);
                    if (mother) {
                        motherInfo = {
                            naam: mother.naam || this.t('unknown'),
                            stamboomnr: mother.stamboomnr || '',
                            kennelnaam: mother.kennelnaam || ''
                        };
                    }
                }
                
                return {
                    ...puppy,
                    fatherInfo,
                    motherInfo
                };
            });
            
            offspringWithParents.sort((a, b) => {
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateB - dateA;
            });
            
            this.dogOffspringCache.set(dogId, offspringWithParents);
            return offspringWithParents;
        } catch (error) {
            console.error('Fout bij ophalen nakomelingen voor hond:', dogId, error);
            return [];
        }
    }
    
    async getOffspringCount(dogId) {
        const offspring = await this.getDogOffspring(dogId);
        return offspring.length;
    }
    
    async checkDogHasPhotos(dogId) {
        const photos = await this.getDogPhotos(dogId);
        return photos.length > 0;
    }
    
    getModalHTML() {
        // Gebruik een simpele functie voor vertalingen
        const translate = (key) => {
            return this.t(key);
        };
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-fullscreen-lg-down">
                    <div class="modal-content h-100">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search me-2"></i> ${translate('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${translate('close')}" id="searchModalCloseBtn"></button>
                        </div>
                        <div class="modal-body p-0 flex-grow-1">
                            <div class="container-fluid h-100">
                                <div class="row h-100">
                                    <div class="col-md-5 border-end p-0" id="searchColumn">
                                        <div class="h-100 d-flex flex-column">
                                            <div class="sticky-top bg-white z-1 border-bottom" style="top: 0;">
                                                <div class="p-3 pb-2">
                                                    <div class="d-flex mb-3">
                                                        <button type="button" class="btn btn-search-type btn-outline-info active me-2" data-search-type="name">
                                                            ${translate('searchName')}
                                                        </button>
                                                        <button type="button" class="btn btn-search-type btn-outline-info" data-search-type="kennel">
                                                            ${translate('searchKennel')}
                                                        </button>
                                                    </div>
                                                    
                                                    <div class="mb-3" id="nameSearchField">
                                                        <label for="searchNameInput" class="form-label fw-bold small">${translate('searchName')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0">
                                                                <i class="bi bi-person text-muted"></i>
                                                            </span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                                   id="searchNameInput" 
                                                                   placeholder="${translate('searchPlaceholder')}" 
                                                                   autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${translate('typeToSearch')}</div>
                                                    </div>
                                                    
                                                    <div class="mb-3 d-none" id="kennelSearchField">
                                                        <label for="searchKennelInput" class="form-label fw-bold small">${translate('searchKennel')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0">
                                                                <i class="bi bi-house text-muted"></i>
                                                            </span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                                   id="searchKennelInput" 
                                                                   placeholder="${translate('kennelPlaceholder')}" 
                                                                   autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${translate('typeToSearchKennel')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="flex-grow-1 overflow-auto" id="searchResultsContainer">
                                                <div class="p-3">
                                                    <div class="text-center py-5">
                                                        <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                                        <p class="mt-3 text-muted">${translate('typeToSearch')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-7 p-0" id="detailsColumn">
                                        <div class="h-100 d-flex flex-column">
                                            <div class="d-none d-md-block sticky-top bg-white z-1 border-bottom" style="top: 0;">
                                                <div class="p-3">
                                                    <h6 class="mb-0 text-muted">
                                                        <i class="bi bi-info-circle me-2"></i> ${translate('dogDetails')}
                                                    </h6>
                                                </div>
                                            </div>
                                            
                                            <div class="flex-grow-1 overflow-auto" id="detailsContainer">
                                                <div class="p-3">
                                                    <div class="text-center py-5">
                                                        <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                                                        <p class="mt-3 text-muted">${translate('selectDogToView')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="searchModalCloseBtnFooter">
                                <i class="bi bi-x-circle me-1"></i> ${translate('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        console.log('SearchManager: Setting up events');
        this.setupSearch();
    }
    
    setupSearch() {
        console.log('SearchManager: Setting up search');
        
        // Remove any existing listeners first
        this.removeExistingListeners();
        
        // Search type buttons
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const searchType = e.target.getAttribute('data-search-type');
                this.switchSearchType(searchType);
            });
        });
        
        // Setup search inputs
        this.setupNameSearch();
        this.setupKennelSearch();
        
        // Setup modal close events
        this.setupModalCloseEvents();
    }
    
    removeExistingListeners() {
        // Clean up to prevent duplicate listeners
        const nameInput = document.getElementById('searchNameInput');
        const kennelInput = document.getElementById('searchKennelInput');
        
        if (nameInput) {
            const newNameInput = nameInput.cloneNode(true);
            nameInput.parentNode.replaceChild(newNameInput, nameInput);
        }
        
        if (kennelInput) {
            const newKennelInput = kennelInput.cloneNode(true);
            kennelInput.parentNode.replaceChild(newKennelInput, kennelInput);
        }
    }
    
    setupModalCloseEvents() {
        const searchModal = document.getElementById('searchModal');
        if (!searchModal) return;
        
        // Remove any existing listeners
        searchModal.removeEventListener('show.bs.modal', this.handleModalShow);
        searchModal.removeEventListener('shown.bs.modal', this.handleModalShown);
        searchModal.removeEventListener('hidden.bs.modal', this.handleModalHidden);
        
        // Define handlers
        this.handleModalShow = () => {
            console.log('SearchModal wordt geopend');
            this.isModalOpen = true;
            this.resetSearchState();
        };
        
        this.handleModalShown = () => {
            console.log('SearchModal is geopend - focus op zoekveld');
            this.isModalOpen = true;
            
            if (this.searchType === 'name') {
                const nameInput = document.getElementById('searchNameInput');
                if (nameInput) nameInput.focus();
            } else {
                const kennelInput = document.getElementById('searchKennelInput');
                if (kennelInput) kennelInput.focus();
            }
        };
        
        this.handleModalHidden = () => {
            console.log('SearchModal wordt gesloten');
            this.isModalOpen = false;
            this.simpleCleanup();
        };
        
        // Add new listeners
        searchModal.addEventListener('show.bs.modal', this.handleModalShow.bind(this));
        searchModal.addEventListener('shown.bs.modal', this.handleModalShown.bind(this));
        searchModal.addEventListener('hidden.bs.modal', this.handleModalHidden.bind(this));
        
        // Close buttons
        const closeBtn = document.getElementById('searchModalCloseBtn');
        const closeBtnFooter = document.getElementById('searchModalCloseBtnFooter');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.isModalOpen = false;
                this.simpleCleanup();
            });
        }
        
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => {
                this.isModalOpen = false;
                this.simpleCleanup();
            });
        }
    }
    
    setupNameSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) return;
        
        // Debounce timer
        let debounceTimer;
        
        searchInput.addEventListener('focus', async () => {
            console.log('Name search focused');
            
            // CRITICAL FIX: Check if dogs are already loaded or loading
            if (this.hasLoadedAllDogs) {
                console.log('Honden zijn al geladen');
                return;
            }
            
            if (this.isLoadingAllDogs) {
                console.log('Honden worden al geladen');
                return;
            }
            
            console.log('Start loading dogs...');
            await this.loadSearchData();
        });
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            
            debounceTimer = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                if (searchTerm.length >= 1) {
                    this.filterDogsForNameField(searchTerm);
                } else {
                    this.showInitialView();
                    this.clearDetails();
                }
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.filteredDogs.length > 0) {
                e.preventDefault();
                this.selectDog(this.filteredDogs[0]);
            }
        });
    }
    
    setupKennelSearch() {
        const searchInput = document.getElementById('searchKennelInput');
        if (!searchInput) return;
        
        let debounceTimer;
        
        searchInput.addEventListener('focus', async () => {
            console.log('Kennel search focused');
            
            if (this.hasLoadedAllDogs) {
                console.log('Honden zijn al geladen');
                return;
            }
            
            if (this.isLoadingAllDogs) {
                console.log('Honden worden al geladen');
                return;
            }
            
            console.log('Start loading dogs...');
            await this.loadSearchData();
        });
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            
            debounceTimer = setTimeout(() => {
                const searchTerm = e.target.value.toLowerCase().trim();
                
                if (searchTerm.length >= 1) {
                    this.filterDogsByKennel(searchTerm);
                } else {
                    this.showInitialView();
                    this.clearDetails();
                }
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.filteredDogs.length > 0) {
                e.preventDefault();
                this.selectDog(this.filteredDogs[0]);
            }
        });
    }
    
    simpleCleanup() {
        console.log('SearchManager: Simple cleanup');
        
        this.filteredDogs = [];
        this.isMobileCollapsed = false;
        this.dogPhotosCache.clear();
        this.dogOffspringCache.clear();
        this.stamboomManager = null;
        
        console.log('SearchManager: Cleanup voltooid');
    }
    
    resetSearchState() {
        console.log('SearchManager: Reset search state');
        
        this.isMobileCollapsed = false;
        
        const searchColumn = document.getElementById('searchColumn');
        const detailsColumn = document.getElementById('detailsColumn');
        
        if (searchColumn && detailsColumn) {
            searchColumn.classList.remove('d-none');
            detailsColumn.classList.remove('col-12');
            detailsColumn.classList.add('col-md-7');
            
            const backButtonDiv = document.querySelector('.mobile-back-button');
            if (backButtonDiv) {
                backButtonDiv.remove();
            }
        }
        
        const nameInput = document.getElementById('searchNameInput');
        const kennelInput = document.getElementById('searchKennelInput');
        
        if (nameInput) nameInput.value = '';
        if (kennelInput) kennelInput.value = '';
        
        const resultsContainer = document.getElementById('searchResultsContainer');
        const detailsContainer = document.getElementById('detailsContainer');
        
        if (resultsContainer && detailsContainer) {
            this.showInitialView();
            this.clearDetails();
        }
        
        this.filteredDogs = [];
        
        console.log('Search state reset');
    }
    
    switchSearchType(type) {
        console.log('Switching search type to:', type);
        this.searchType = type;
        
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            const btnType = btn.getAttribute('data-search-type');
            if (btnType === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        const nameField = document.getElementById('nameSearchField');
        const kennelField = document.getElementById('kennelSearchField');
        
        if (type === 'name') {
            if (nameField) nameField.classList.remove('d-none');
            if (kennelField) kennelField.classList.add('d-none');
            const nameInput = document.getElementById('searchNameInput');
            if (nameInput) nameInput.focus();
        } else {
            if (nameField) nameField.classList.add('d-none');
            if (kennelField) kennelField.classList.remove('d-none');
            const kennelInput = document.getElementById('searchKennelInput');
            if (kennelInput) kennelInput.focus();
        }
        
        this.showInitialView();
        this.clearDetails();
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        const message = this.searchType === 'name' ? this.t('typeToSearch') : this.t('typeToSearchKennel');
        
        container.innerHTML = `
            <div class="p-3">
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${message}</p>
                </div>
            </div>
        `;
    }
    
    clearDetails() {
        const container = document.getElementById('detailsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="p-3">
                <div class="text-center py-5">
                    <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('selectDogToView')}</p>
                </div>
            </div>
        `;
    }
    
    // CRITICAL FIX: Verbeterde loadSearchData zonder loops
    async loadSearchData() {
        console.log('SearchManager: Loading search data...');
        
        // CRITICAL: Check if already loaded or loading
        if (this.hasLoadedAllDogs) {
            console.log('SearchManager: Honden zijn al geladen, skip');
            return;
        }
        
        if (this.isLoadingAllDogs) {
            console.log('SearchManager: Honden worden al geladen, skip');
            return;
        }
        
        this.isLoadingAllDogs = true;
        this.showProgress(this.t('loading'));
        
        try {
            console.log('SearchManager: Start loading all dogs');
            this.allDogs = await this.loadAllDogsWithPagination();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
            this.hasLoadedAllDogs = true;
            this.isLoadingAllDogs = false;
            
            this.hideProgress();
            console.log(`SearchManager: ${this.allDogs.length} honden geladen`);
            
        } catch (error) {
            console.error('SearchManager: Fout bij laden honden:', error);
            this.hideProgress();
            this.isLoadingAllDogs = false;
            this.showError(`Laden mislukt: ${error.message}`);
        }
    }
    
    // CRITICAL FIX: Eenvoudige paginatie zonder loops
    async loadAllDogsWithPagination() {
        console.log('SearchManager: Loading all dogs with pagination');
        
        try {
            const allDogs = [];
            let currentPage = 1;
            const pageSize = 1000;
            let safetyCounter = 0;
            
            while (true) {
                console.log(`SearchManager: Loading page ${currentPage}`);
                
                // CRITICAL: Add timeout and error handling
                const result = await Promise.race([
                    window.hondenService.getHonden(currentPage, pageSize),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout loading page')), 10000)
                    )
                ]);
                
                if (!result || !result.honden || result.honden.length === 0) {
                    console.log(`SearchManager: No dogs on page ${currentPage}, stopping`);
                    break;
                }
                
                allDogs.push(...result.honden);
                console.log(`SearchManager: Page ${currentPage} loaded: ${result.honden.length} dogs`);
                
                // Update progress
                const progressMessage = this.t('loadingAllDogs').replace('{loaded}', allDogs.length);
                this.showProgress(progressMessage);
                
                // Check if there are more pages
                if (!result.heeftVolgende || result.honden.length < pageSize) {
                    console.log('SearchManager: Last page reached');
                    break;
                }
                
                currentPage++;
                safetyCounter++;
                
                // Safety limit
                if (safetyCounter >= 50) {
                    console.warn('SearchManager: Safety limit reached (50 pages)');
                    break;
                }
                
                // Small delay between pages
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Sort by name
            allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`SearchManager: TOTAL ${allDogs.length} dogs loaded`);
            return allDogs;
            
        } catch (error) {
            console.error('SearchManager: Error loading dogs:', error);
            throw error;
        }
    }
    
    filterDogsForNameField(searchTerm = '') {
        console.log(`Filtering dogs for name field: ${searchTerm}`);
        
        if (!this.allDogs || this.allDogs.length === 0) {
            console.log('No dogs to filter');
            return;
        }
        
        this.filteredDogs = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            
            const combined = `${naam} ${kennelnaam}`;
            return combined.startsWith(searchTerm);
        });
        
        console.log(`Found ${this.filteredDogs.length} dogs`);
        this.displaySearchResults();
    }
    
    filterDogsByKennel(searchTerm = '') {
        console.log(`Filtering dogs by kennel: ${searchTerm}`);
        
        if (!this.allDogs || this.allDogs.length === 0) {
            console.log('No dogs to filter');
            return;
        }
        
        this.filteredDogs = this.allDogs.filter(dog => {
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            return kennelnaam.startsWith(searchTerm);
        });
        
        this.filteredDogs.sort((a, b) => {
            const naamA = a.naam ? a.naam.toLowerCase() : '';
            const naamB = b.naam ? b.naam.toLowerCase() : '';
            return naamA.localeCompare(naamB);
        });
        
        console.log(`Found ${this.filteredDogs.length} dogs`);
        this.displaySearchResults();
    }
    
    displaySearchResults() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        if (this.filteredDogs.length === 0) {
            container.innerHTML = `
                <div class="p-3">
                    <div class="text-center py-5">
                        <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${this.t('noDogsFound')}</p>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="p-3">
                <div class="search-stats">
                    <i class="bi bi-info-circle me-1"></i>
                    ${this.filteredDogs.length} ${this.t('found')}
                </div>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                             dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || this.t('unknown')}</span>
                        ${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}
                    </div>
                    
                    <div class="dog-details-line">
                        ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                        ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                        <span class="geslacht">${genderText}</span>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
        
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = parseInt(item.getAttribute('data-id'));
                this.selectDogById(hondId);
                
                if (window.innerWidth <= 768) {
                    this.collapseSearchResultsOnMobile();
                }
            });
        });
    }
    
    selectDog(dog) {
        console.log('Selecting dog:', dog.naam);
        
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.getAttribute('data-id')) === dog.id) {
                item.classList.add('selected');
            }
        });
        
        this.showDogDetails(dog);
        
        if (window.innerWidth <= 768) {
            this.collapseSearchResultsOnMobile();
        }
    }
    
    selectDogById(hondId) {
        const dog = this.allDogs.find(h => h.id === hondId);
        if (dog) {
            this.selectDog(dog);
        }
    }
    
    collapseSearchResultsOnMobile() {
        if (window.innerWidth <= 768 && !this.isMobileCollapsed) {
            const searchColumn = document.getElementById('searchColumn');
            const detailsColumn = document.getElementById('detailsColumn');
            
            if (searchColumn && detailsColumn) {
                searchColumn.classList.add('d-none');
                detailsColumn.classList.remove('col-md-7');
                detailsColumn.classList.add('col-12');
                this.isMobileCollapsed = true;
                
                this.addMobileBackButton();
            }
        }
    }
    
    addMobileBackButton() {
        const detailsContainer = document.getElementById('detailsContainer');
        if (!detailsContainer) return;
        
        const existingButton = detailsContainer.querySelector('.mobile-back-button');
        if (existingButton) {
            return;
        }
        
        const backButtonDiv = document.createElement('div');
        backButtonDiv.className = 'mobile-back-button';
        backButtonDiv.innerHTML = `
            <button class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-arrow-left me-1"></i> ${this.t('backToSearch')}
            </button>
        `;
        
        backButtonDiv.querySelector('button').addEventListener('click', () => {
            this.restoreSearchViewOnMobile();
        });
        
        const firstChild = detailsContainer.firstChild;
        if (firstChild) {
            detailsContainer.insertBefore(backButtonDiv, firstChild);
        } else {
            detailsContainer.appendChild(backButtonDiv);
        }
    }
    
    restoreSearchViewOnMobile() {
        const searchColumn = document.getElementById('searchColumn');
        const detailsColumn = document.getElementById('detailsColumn');
        
        if (searchColumn && detailsColumn) {
            searchColumn.classList.remove('d-none');
            detailsColumn.classList.remove('col-12');
            detailsColumn.classList.add('col-md-7');
            this.isMobileCollapsed = false;
            
            const backButtonDiv = document.querySelector('.mobile-back-button');
            if (backButtonDiv) {
                backButtonDiv.remove();
            }
            
            const searchInput = this.searchType === 'name' ? 
                document.getElementById('searchNameInput') : 
                document.getElementById('searchKennelInput');
            if (searchInput) {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (searchTerm.length >= 1) {
                    const inputEvent = new Event('input', {
                        bubbles: true,
                        cancelable: true
                    });
                    searchInput.dispatchEvent(inputEvent);
                } else {
                    this.showInitialView();
                    this.clearDetails();
                }
                searchInput.focus();
            }
        }
    }
    
    async showDogDetails(dog, isParentView = false, originalDogId = null) {
        console.log('Showing dog details:', dog.naam);
        
        const container = document.getElementById('detailsContainer');
        if (!container) return;
        
        // Clear container first
        container.innerHTML = '';
        
        if (this.isMobileCollapsed && window.innerWidth <= 768) {
            this.addMobileBackButton();
        }
        
        // Get parent info
        let fatherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        if (dog.vaderId) {
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || this.t('unknown'),
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || '',
                    kennelnaam: father.kennelnaam || ''
                };
            }
        }
        
        if (dog.moederId) {
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || this.t('unknown'),
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || '',
                    kennelnaam: mother.kennelnaam || ''
                };
            }
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 'en-US');
            } catch (e) {
                return dateString;
            }
        };
        
        const displayValue = (value) => {
            return value && value !== '' ? value : this.t('unknown');
        };
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        // Get photos and offspring count
        const [hasPhotos, offspringCount] = await Promise.all([
            this.checkDogHasPhotos(dog.id),
            this.getOffspringCount(dog.id)
        ]);
        
        // Build HTML
        const html = `
            <div class="p-3">
                <div class="details-card">
                    ${isParentView ? `
                    <div class="details-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}">
                                <i class="bi bi-arrow-left me-1"></i> ${this.t('backToSearch')}
                            </button>
                            <div class="text-muted small">
                                <i class="bi bi-info-circle me-1"></i> ${this.t('viewingParent')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="details-header ${isParentView ? 'pt-0' : ''}">
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
                                    
                                    ${offspringCount > 0 ? `
                                    <a href="#" class="offspring-badge offspring-button" 
                                       data-dog-id="${dog.id}" 
                                       data-dog-name="${displayValue(dog.naam)}">
                                        <i class="bi bi-people-fill"></i>
                                        ${offspringCount} ${this.t('offspringCount')}
                                    </a>
                                    ` : `
                                    <span class="offspring-badge" style="background: #6c757d; cursor: default;">
                                        <i class="bi bi-people"></i>
                                        0 ${this.t('offspringCount')}
                                    </span>
                                    `}
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
                    
                    <div class="details-body">
                        ${hasPhotos ? `
                        <div class="photos-section">
                            <div class="photos-title">
                                <div class="photos-title-text">
                                    <i class="bi bi-camera"></i>
                                    <span>${this.t('photos')}</span>
                                </div>
                                <div class="click-hint-text">${this.t('clickToEnlarge')}</div>
                            </div>
                            <div class="photos-grid-container" id="photosGrid${dog.id}">
                                <!-- Foto's worden hier ingeladen -->
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="info-group">
                            <div class="info-group-title d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-people me-1"></i> ${this.t('parents')}
                                </div>
                                <button class="btn btn-sm btn-outline-primary btn-pedigree" data-dog-id="${dog.id}">
                                    <i class="bi bi-diagram-3 me-1"></i> ${this.t('pedigreeButton')}
                                </button>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                        <div class="fw-bold mb-1 text-primary">
                                            <i class="bi bi-gender-male me-1"></i> ${this.t('father')}
                                        </div>
                                        <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                        ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                        ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                                        ${fatherInfo.id ? `
                                        <div class="click-hint">
                                            <i class="bi bi-arrow-right-circle"></i>
                                            ${this.t('clickToView')}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                        <div class="fw-bold mb-1 text-danger">
                                            <i class="bi bi-gender-female me-1"></i> ${this.t('mother')}
                                        </div>
                                        <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                        ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                        ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                                        ${motherInfo.id ? `
                                        <div class="click-hint">
                                            <i class="bi bi-arrow-right-circle"></i>
                                            ${this.t('clickToView')}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-group">
                            <div class="info-group-title">
                                <i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">${this.t('hipDysplasia')}</div>
                                    <div>${displayValue(dog.heupdysplasie)}</div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">${this.t('elbowDysplasia')}</div>
                                    <div>${displayValue(dog.elleboogdysplasie)}</div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">${this.t('patellaLuxation')}</div>
                                    <div>${displayValue(dog.patella)}</div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">${this.t('eyes')}</div>
                                    <div>${displayValue(dog.ogen)}</div>
                                    ${dog.ogenVerklaring ? `<div class="text-muted small mt-1">${dog.ogenVerklaring}</div>` : ''}
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">${this.t('dandyWalker')}</div>
                                    <div>${displayValue(dog.dandyWalker)}</div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">${this.t('thyroid')}</div>
                                    <div>${displayValue(dog.schildklier)}</div>
                                    ${dog.schildklierVerklaring ? `<div class="text-muted small mt-1">${dog.schildklierVerklaring}</div>` : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-group">
                            <div class="info-group-title">
                                <i class="bi bi-info-circle me-1"></i> ${this.t('additionalInfo')}
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <div class="fw-bold mb-1">${this.t('country')}</div>
                                    <div>${displayValue(dog.land)}</div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="fw-bold mb-1">${this.t('zipCode')}</div>
                                    <div>${displayValue(dog.postcode)}</div>
                                </div>
                            </div>
                            
                            <div class="mt-3">
                                <div class="fw-bold mb-2">${this.t('remarks')}</div>
                                <div class="remarks-box">
                                    ${dog.opmerkingen ? dog.opmerkingen : this.t('noAdditionalInfo')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        
        // Load photos if available
        if (hasPhotos) {
            this.loadAndDisplayPhotos(dog);
        }
        
        // Add event listeners for parents
        if (fatherInfo.id) {
            const fatherCard = container.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = container.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                    this.showParentDetails(parentId, originalDogId);
                });
            }
        }
        
        // Add event listener for pedigree button
        container.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        // Back button for parent view
        if (isParentView) {
            const backButton = container.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    const originalDogId = parseInt(backButton.getAttribute('data-original-dog'));
                    const originalDog = this.allDogs.find(d => d.id === originalDogId);
                    if (originalDog) {
                        this.showDogDetails(originalDog);
                    }
                });
            }
        }
    }
    
    async loadAndDisplayPhotos(dog) {
        try {
            const photos = await this.getDogPhotos(dog.id);
            const container = document.getElementById('detailsContainer');
            const photosGrid = container.querySelector(`#photosGrid${dog.id}`);
            
            if (!photosGrid || photos.length === 0) {
                return;
            }
            
            let photosHTML = '';
            photos.forEach((photo, index) => {
                let photoUrl = '';
                if (photo.data && typeof photo.data === 'string') {
                    const mimeType = photo.type || 'image/jpeg';
                    let cleanData = photo.data;
                    if (cleanData.startsWith('data:')) {
                        cleanData = cleanData.split(',')[1];
                    }
                    photoUrl = `data:${mimeType};base64,${cleanData}`;
                } else if (photo.url) {
                    photoUrl = photo.url;
                } else if (photo.filePath) {
                    photoUrl = photo.filePath;
                }
                
                if (photoUrl) {
                    photosHTML += `
                        <div class="photo-thumbnail" 
                             data-photo-id="${photo.id}" 
                             data-dog-id="${dog.id}" 
                             data-photo-index="${index}"
                             data-photo-src="${photoUrl}">
                            <img src="${photoUrl}" 
                                 alt="${dog.naam || ''} - ${photo.filename || ''}" 
                                 class="thumbnail-img"
                                 loading="lazy">
                        </div>
                    `;
                }
            });
            
            photosGrid.innerHTML = photosHTML;
            
        } catch (error) {
            console.error('Fout bij laden foto\'s:', error);
        }
    }
    
    showParentDetails(parentId, originalDogId) {
        const parent = this.allDogs.find(d => d.id === parentId);
        if (parent) {
            this.showDogDetails(parent, true, originalDogId);
            
            document.querySelectorAll('.dog-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === parentId) {
                    item.classList.add('selected');
                }
            });
        }
    }
    
    async openPedigree(dogId) {
        try {
            if (!this.stamboomManager) {
                console.log('Initializing StamboomManager...');
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) {
                this.showError("Hond niet gevonden");
                return;
            }
            
            this.stamboomManager.showPedigree(dog);
            
        } catch (error) {
            console.error('Fout bij openen stamboom:', error);
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    showProgress(message) {
        console.log('Progress:', message);
        // Implementeer je eigen progress indicator
    }
    
    hideProgress() {
        // Implementeer je eigen progress hide
    }
    
    showError(message) {
        console.error('Error:', message);
        alert(message);
    }
    
    showSuccess(message) {
        console.log('Success:', message);
    }
}