/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 * SUPABASE VERSIE MET PAGINATIE - COMPLEET GEFIXED VERSION
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.searchType = 'name';
        this.stamboomManager = null;
        this.isMobileCollapsed = false;
        this.dogPhotosCache = new Map();
        this.dogOffspringCache = new Map();
        this.isLoading = false;
        this.loadedDogCount = 0;
        
        console.log('SearchManager: constructor aangeroepen');
        
        // Vertalingen
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
                loadingFailed: "Laden mislukt"
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
                loadingFailed: "Loading failed"
            },
            de: {
                searchDog: "Hund suchen",
                searchName: "Hund nach Namen suchen (oder Name + Kennel)",
                searchKennel: "Hund nach Kennelname suchen",
                searchPlaceholder: "Hundenamen eingeben... oder 'Name Kennelname'",
                kennelPlaceholder: "Kennelnamen eingeben...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                typeToSearchKennel: "Kennelnamen eingeben um zu suchen",
                searchResults: "Suchergebnisse",
                found: "gefunden",
                name: "Name",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geschlecht",
                close: "Schließen",
                dogDetails: "Hund Details",
                father: "Vater",
                mother: "Mutter",
                parentsUnknown: "Unbekannt",
                male: "Rüde",
                female: "Hündin",
                unknown: "Unbekannt",
                loading: "Hunde laden...",
                loadingAllDogs: "Lade alle Hunde... ({loaded} geladen)",
                backToSearch: "Zurück zur Suche",
                viewingParent: "Elternteil ansehen",
                clickToView: "Klicken für Details",
                parents: "Eltern",
                noHealthInfo: "Keine Gesundheitsinformationen verfügbar",
                noAdditionalInfo: "Keine aanvullende informatie beschikbaar",
                selectDogToView: "Wählen Sie einen Hund, um Details zu sehen",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                offspring: "Nachkommen",
                noOffspring: "Keine Nachkommen gefonden",
                viewOffspring: "Nachkommen anzeigen",
                offspringCount: "Nachkommen",
                offspringModalTitle: "Nachkommen von {name}",
                loadingOffspring: "Nachkommen werden geladen...",
                loadingFailed: "Laden fehlgeschlagen"
            }
        };
        
        this.setupGlobalEventListeners();
    }
    
    injectDependencies(db, auth) {
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
        console.log('SearchManager: Dependencies geïnjecteerd');
    }
    
    initialize() {
        console.log('SearchManager: Initializing...');
        return Promise.resolve();
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    setupGlobalEventListeners() {
        document.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                const photoSrc = thumbnail.getAttribute('data-photo-src');
                if (photoSrc && photoSrc.trim() !== '') {
                    const popupTitle = document.querySelector('.popup-title');
                    let dogName = '';
                    if (popupTitle) {
                        dogName = popupTitle.textContent.trim();
                        dogName = dogName.replace(/^[^a-zA-Z]*/, '').trim();
                    }
                    this.showLargePhoto(photoSrc, dogName);
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('offspring-button') || e.target.closest('.offspring-button')) {
                e.preventDefault();
                e.stopPropagation();
                const btn = e.target.closest('.offspring-button');
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                const dogName = btn.getAttribute('data-dog-name') || '';
                this.showOffspringModal(dogId, dogName);
            }
        });
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
            if (this.db && typeof this.db.getFotosVoorStamboomnr === 'function') {
                photos = await this.db.getFotosVoorStamboomnr(dog.stamboomnr);
            }
            this.dogPhotosCache.set(cacheKey, photos || []);
            return photos || [];
        } catch (error) {
            console.error('Fout bij ophalen foto\'s:', error);
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
            
            this.dogOffspringCache.set(dogId, offspring || []);
            return offspring || [];
        } catch (error) {
            console.error('Fout bij ophalen nakomelingen:', error);
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
    
    showLargePhoto(photoData, dogName = '') {
        const existingOverlay = document.getElementById('photoLargeOverlay');
        if (existingOverlay) existingOverlay.remove();
        
        const overlayHTML = `
            <div class="photo-large-overlay" id="photoLargeOverlay" style="display: flex;">
                <div class="photo-large-container">
                    <div class="photo-large-header">
                        <button type="button" class="btn-close btn-close-white photo-large-close"></button>
                    </div>
                    <div class="photo-large-content">
                        <img src="${photoData}" alt="${dogName}" class="photo-large-img">
                    </div>
                    <div class="photo-large-footer text-center py-3">
                        <button type="button" class="btn btn-secondary photo-large-close-btn">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('closePhoto')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        document.getElementById('photoLargeOverlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.id === 'photoLargeOverlay') {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) overlay.remove();
            }
        });
    }
    
    async showOffspringModal(dogId, dogName = '') {
        const existingOverlay = document.getElementById('offspringModalOverlay');
        if (existingOverlay) existingOverlay.remove();
        
        const overlayHTML = `
            <div class="offspring-modal-overlay" id="offspringModalOverlay" style="display: flex;">
                <div class="offspring-modal-container">
                    <div class="offspring-modal-header">
                        <h5 class="offspring-modal-title">
                            <i class="bi bi-people-fill me-2"></i> ${this.t('offspringModalTitle').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white offspring-modal-close"></button>
                    </div>
                    <div class="offspring-modal-body" id="offspringModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loadingOffspring')}</span>
                            </div>
                            <p class="mt-3">${this.t('loadingOffspring')}</p>
                        </div>
                    </div>
                    <div class="offspring-modal-footer">
                        <button type="button" class="btn btn-secondary offspring-modal-close">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('close')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        await this.loadAndDisplayOffspring(dogId, dogName);
        
        document.getElementById('offspringModalOverlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('offspring-modal-close') || 
                e.target.closest('.offspring-modal-close') ||
                e.target.id === 'offspringModalOverlay') {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) overlay.remove();
            }
        });
    }
    
    async loadAndDisplayOffspring(dogId, dogName) {
        const contentDiv = document.getElementById('offspringModalContent');
        if (!contentDiv) return;
        
        try {
            const offspring = await this.getDogOffspring(dogId);
            const count = offspring.length;
            
            if (count === 0) {
                contentDiv.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-people display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${this.t('noOffspring')}</p>
                    </div>
                `;
                return;
            }
            
            let html = `
                <div class="offspring-stats mb-4">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        Totaal aantal nakomelingen: <strong>${count}</strong>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover table-sm">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Naam</th>
                                <th scope="col">Stamboomnr</th>
                                <th scope="col">Ras</th>
                                <th scope="col">Geboortedatum</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            offspring.forEach((puppy, index) => {
                const birthYear = puppy.geboortedatum ? 
                    new Date(puppy.geboortedatum).getFullYear() : '?';
                
                html += `
                    <tr class="offspring-row" data-dog-id="${puppy.id}">
                        <td class="text-muted">${index + 1}</td>
                        <td>
                            <strong class="text-primary">${puppy.naam || this.t('unknown')}</strong>
                            ${puppy.kennelnaam ? `<br><small class="text-muted">${puppy.kennelnaam}</small>` : ''}
                        </td>
                        <td><code>${puppy.stamboomnr || ''}</code></td>
                        <td>${puppy.ras || ''}</td>
                        <td>${birthYear}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            
            contentDiv.querySelectorAll('.offspring-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const puppyId = parseInt(row.getAttribute('data-dog-id'));
                    const puppy = this.allDogs.find(d => d.id === puppyId);
                    if (puppy) {
                        const overlay = document.getElementById('offspringModalOverlay');
                        if (overlay) overlay.remove();
                        this.selectDogById(puppyId);
                    }
                });
            });
            
        } catch (error) {
            console.error('Fout bij laden nakomelingen:', error);
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Fout bij laden nakomelingen: ${error.message}
                </div>
            `;
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-fullscreen-lg-down">
                    <div class="modal-content h-100">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="searchModalLabel">
                                <i class="bi bi-search me-2"></i> ${t('searchDog')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}"></button>
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
                                                            ${t('searchName')}
                                                        </button>
                                                        <button type="button" class="btn btn-search-type btn-outline-info" data-search-type="kennel">
                                                            ${t('searchKennel')}
                                                        </button>
                                                    </div>
                                                    
                                                    <div class="mb-3" id="nameSearchField">
                                                        <label for="searchNameInput" class="form-label fw-bold small">${t('searchName')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0">
                                                                <i class="bi bi-person text-muted"></i>
                                                            </span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                                   id="searchNameInput" 
                                                                   placeholder="${t('searchPlaceholder')}" 
                                                                   autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${t('typeToSearch')}</div>
                                                    </div>
                                                    
                                                    <div class="mb-3 d-none" id="kennelSearchField">
                                                        <label for="searchKennelInput" class="form-label fw-bold small">${t('searchKennel')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0">
                                                                <i class="bi bi-house text-muted"></i>
                                                            </span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" 
                                                                   id="searchKennelInput" 
                                                                   placeholder="${t('kennelPlaceholder')}" 
                                                                   autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${t('typeToSearchKennel')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="flex-grow-1 overflow-auto" id="searchResultsContainer">
                                                <div class="p-3">
                                                    <div class="text-center py-5">
                                                        <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                                        <p class="mt-3 text-muted">${t('typeToSearch')}</p>
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
                                                        <i class="bi bi-info-circle me-2"></i> ${t('dogDetails')}
                                                    </h6>
                                                </div>
                                            </div>
                                            
                                            <div class="flex-grow-1 overflow-auto" id="detailsContainer">
                                                <div class="p-3">
                                                    <div class="text-center py-5">
                                                        <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                                                        <p class="mt-3 text-muted">${t('selectDogToView')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle me-1"></i> ${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        console.log('SearchManager: setupEvents aangeroepen');
        this.setupSearch();
    }
    
    setupSearch() {
        console.log('SearchManager: setupSearch aangeroepen');
        
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const searchType = e.target.getAttribute('data-search-type');
                console.log('Search type changed to:', searchType);
                this.switchSearchType(searchType);
            });
        });
        
        this.setupNameSearch();
        this.setupKennelSearch();
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
    
    setupNameSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) {
            console.error('searchNameInput niet gevonden!');
            return;
        }
        
        console.log('Setting up name search');
        
        searchInput.addEventListener('focus', async () => {
            console.log('Name input focused, allDogs length:', this.allDogs.length);
            if (this.allDogs.length === 0) {
                console.log('Loading dogs on focus...');
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            console.log('Search input:', searchTerm);
            
            if (searchTerm.length >= 1) {
                this.filterDogsForNameField(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
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
        if (!searchInput) {
            console.error('searchKennelInput niet gevonden!');
            return;
        }
        
        console.log('Setting up kennel search');
        
        searchInput.addEventListener('focus', async () => {
            console.log('Kennel input focused, allDogs length:', this.allDogs.length);
            if (this.allDogs.length === 0) {
                console.log('Loading dogs on focus...');
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            console.log('Kennel search input:', searchTerm);
            
            if (searchTerm.length >= 1) {
                this.filterDogsByKennel(searchTerm);
            } else {
                this.showInitialView();
                this.clearDetails();
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) {
            console.error('searchResultsContainer niet gevonden!');
            return;
        }
        
        const t = this.t.bind(this);
        const message = this.searchType === 'name' ? t('typeToSearch') : t('typeToSearchKennel');
        
        container.innerHTML = `
            <div class="p-3">
                <div class="text-center py-5">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${message}</p>
                    ${this.allDogs.length > 0 ? `<small class="text-muted">${this.allDogs.length} honden geladen</small>` : ''}
                </div>
            </div>
        `;
    }
    
    clearDetails() {
        const container = document.getElementById('detailsContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        container.innerHTML = `
            <div class="p-3">
                <div class="text-center py-5">
                    <i class="bi bi-eye display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${t('selectDogToView')}</p>
                </div>
            </div>
        `;
    }
    
    async loadSearchData() {
        if (this.isLoading) {
            console.log('Already loading dogs, skipping...');
            return;
        }
        
        console.log('SearchManager: loadSearchData aangeroepen');
        
        this.isLoading = true;
        this.showProgress(this.t('loadingAllDogs').replace('{loaded}', '0'));
        
        try {
            console.log('Starting to load all dogs...');
            this.allDogs = await this.loadAllDogsWithPagination();
            console.log(`Totaal ${this.allDogs.length} honden geladen`);
            
            if (this.allDogs.length === 0) {
                this.showError('Geen honden gevonden in database');
                return;
            }
            
            // Controleer of parent IDs bestaan
            const dogsWithVaderId = this.allDogs.filter(d => d.vaderId && d.vaderId !== 0).length;
            const dogsWithMoederId = this.allDogs.filter(d => d.moederId && d.moederId !== 0).length;
            console.log(`Honden met vaderId: ${dogsWithVaderId}/${this.allDogs.length}`);
            console.log(`Honden met moederId: ${dogsWithMoederId}/${this.allDogs.length}`);
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
            
            console.log('Toon initial view na laden');
            this.showInitialView();
            
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.showError(`${this.t('loadingFailed')}: ${error.message}`);
        } finally {
            this.isLoading = false;
            this.hideProgress();
            console.log('Loading completed');
        }
    }
    
    async loadAllDogsWithPagination() {
        console.log('SearchManager: loadAllDogsWithPagination aangeroepen');
        
        try {
            let allDogs = [];
            let currentPage = 1;
            const pageSize = 1000;
            let hasMorePages = true;
            let totalLoaded = 0;
            
            console.log('Start paginatie laden...');
            
            while (hasMorePages) {
                console.log(`Laden pagina ${currentPage}...`);
                
                if (!this.db || typeof this.db.getHonden !== 'function') {
                    console.error('db.getHonden functie niet beschikbaar!');
                    throw new Error('Database service niet beschikbaar');
                }
                
                const result = await this.db.getHonden(currentPage, pageSize);
                console.log(`Pagina ${currentPage} resultaat:`, result);
                
                if (result && result.honden && result.honden.length > 0) {
                    console.log(`Pagina ${currentPage}: ${result.honden.length} honden geladen`);
                    
                    // Debug: toon enkele honden
                    result.honden.slice(0, 3).forEach((dog, i) => {
                        console.log(`  Hond ${i+1}: ID=${dog.id}, Naam=${dog.naam}, vaderId=${dog.vaderId}, moederId=${dog.moederId}`);
                    });
                    
                    allDogs = allDogs.concat(result.honden);
                    totalLoaded = allDogs.length;
                    
                    // Update progress
                    const progressMessage = this.t('loadingAllDogs').replace('{loaded}', totalLoaded);
                    this.showProgress(progressMessage);
                    
                    hasMorePages = result.heeftVolgende || false;
                    currentPage++;
                    
                    if (currentPage > 50) {
                        console.warn('Veiligheidslimiet bereikt bij paginatie');
                        break;
                    }
                } else {
                    console.log('Geen honden meer gevonden op pagina', currentPage);
                    hasMorePages = false;
                }
                
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            console.log(`TOTAAL ${allDogs.length} honden geladen via paginatie`);
            
            if (allDogs.length === 0) {
                console.warn('GEEN HONDEN GELADEN VIA PAGINATIE!');
                // Probeer directe methode als fallback
                try {
                    console.log('Probeer alternatieve methode...');
                    if (typeof this.db.getAllHonden === 'function') {
                        allDogs = await this.db.getAllHonden();
                        console.log(`Alternatieve methode: ${allDogs.length} honden geladen`);
                    }
                } catch (fallbackError) {
                    console.error('Fallback methode faalde:', fallbackError);
                }
            }
            
            return allDogs;
            
        } catch (error) {
            console.error('Fout bij paginatie laden:', error);
            throw error;
        }
    }
    
    filterDogsForNameField(searchTerm = '') {
        console.log(`filterDogsForNameField: zoeken naar "${searchTerm}" in ${this.allDogs.length} honden`);
        
        if (this.allDogs.length === 0) {
            console.error('Geen honden geladen!');
            this.filteredDogs = [];
            this.displaySearchResults();
            return;
        }
        
        // Zoek in naam + kennelnaam (zoals DogDataManager)
        this.filteredDogs = this.allDogs.filter(dog => {
            const naam = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            const stamboomnr = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
            
            // Combineer naam + kennelnaam voor zoeken
            const fullName = `${naam} ${kennelnaam}`.trim().toLowerCase();
            
            // Zoek in volledige naam OF alleen in naam OF in stamboomnr
            return fullName.includes(searchTerm) || 
                   naam.includes(searchTerm) || 
                   stamboomnr.includes(searchTerm);
        });
        
        console.log(`Gevonden: ${this.filteredDogs.length} honden`);
        this.displaySearchResults();
    }
    
    filterDogsByKennel(searchTerm = '') {
        console.log(`filterDogsByKennel: zoeken naar "${searchTerm}" in ${this.allDogs.length} honden`);
        
        if (this.allDogs.length === 0) {
            console.error('Geen honden geladen!');
            this.filteredDogs = [];
            this.displaySearchResults();
            return;
        }
        
        this.filteredDogs = this.allDogs.filter(dog => {
            const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            return kennelnaam.includes(searchTerm);
        });
        
        console.log(`Gevonden: ${this.filteredDogs.length} honden`);
        this.displaySearchResults();
    }
    
    displaySearchResults() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) {
            console.error('searchResultsContainer niet gevonden!');
            return;
        }
        
        if (this.filteredDogs.length === 0) {
            container.innerHTML = `
                <div class="p-3">
                    <div class="text-center py-5">
                        <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                    </div>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="p-3">
                <div class="search-stats">
                    <i class="bi bi-info-circle me-1"></i>
                    ${this.filteredDogs.length} ${t('found')}
                </div>
        `;
        
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            
            html += `
                <div class="dog-result-item" data-id="${dog.id}">
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || t('unknown')}</span>
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
        
        container.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = parseInt(item.getAttribute('data-id'));
                console.log('Hond geselecteerd:', hondId);
                this.selectDogById(hondId);
            });
        });
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
        if (existingButton) return;
        
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
            if (backButtonDiv) backButtonDiv.remove();
        }
    }
    
    selectDog(dog) {
        console.log('selectDog aangeroepen voor:', dog.id, dog.naam);
        
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
        console.log('selectDogById aangeroepen voor ID:', hondId);
        
        const dog = this.allDogs.find(h => h.id === hondId);
        if (dog) {
            console.log('Hond gevonden:', dog.naam);
            this.selectDog(dog);
        } else {
            console.error(`Hond met ID ${hondId} niet gevonden in ${this.allDogs.length} geladen honden`);
            this.showError(`Hond niet gevonden (ID: ${hondId})`);
        }
    }
    
    async showDogDetails(dog, isParentView = false, originalDogId = null) {
        console.log('showDogDetails aangeroepen voor:', dog.id, dog.naam);
        console.log('Parent info:', { vaderId: dog.vaderId, moederId: dog.moederId });
        
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) {
            console.error('detailsContainer niet gevonden!');
            return;
        }
        
        container.innerHTML = '';
        
        if (this.isMobileCollapsed && window.innerWidth <= 768) {
            this.addMobileBackButton();
        }
        
        // Zoek ouders
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        // VADER
        if (dog.vaderId && dog.vaderId !== 0) {
            console.log(`Zoeken vader met ID: ${dog.vaderId}`);
            const father = this.allDogs.find(d => d.id === dog.vaderId);
            if (father) {
                console.log(`Vader gevonden: ${father.naam} (ID: ${father.id})`);
                fatherInfo = { 
                    id: father.id,
                    naam: father.naam || t('unknown'),
                    stamboomnr: father.stamboomnr || '',
                    ras: father.ras || '',
                    kennelnaam: father.kennelnaam || ''
                };
            } else {
                console.warn(`Vader ID ${dog.vaderId} niet gevonden in geladen honden`);
            }
        } else {
            console.log('Geen vaderId voor deze hond');
        }
        
        // MOEDER
        if (dog.moederId && dog.moederId !== 0) {
            console.log(`Zoeken moeder met ID: ${dog.moederId}`);
            const mother = this.allDogs.find(d => d.id === dog.moederId);
            if (mother) {
                console.log(`Moeder gevonden: ${mother.naam} (ID: ${mother.id})`);
                motherInfo = { 
                    id: mother.id,
                    naam: mother.naam || t('unknown'),
                    stamboomnr: mother.stamboomnr || '',
                    ras: mother.ras || '',
                    kennelnaam: mother.kennelnaam || ''
                };
            } else {
                console.warn(`Moeder ID ${dog.moederId} niet gevonden in geladen honden`);
            }
        } else {
            console.log('Geen moederId voor deze hond');
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                              this.currentLang === 'de' ? 'de-DE' : 'en-US');
            } catch (e) {
                return dateString;
            }
        };
        
        const genderText = dog.geslacht === 'reuen' ? t('male') : 
                          dog.geslacht === 'teven' ? t('female') : t('unknown');
        
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const offspringCount = await this.getOffspringCount(dog.id);
        
        const html = `
            <div class="p-3">
                <div class="details-card">
                    ${isParentView ? `
                    <div class="details-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}">
                                <i class="bi bi-arrow-left me-1"></i> ${t('backToSearch')}
                            </button>
                            <div class="text-muted small">
                                <i class="bi bi-info-circle me-1"></i> ${t('viewingParent')}
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="details-header ${isParentView ? 'pt-0' : ''}">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="dog-name-header">${dog.naam || t('unknown')}</div>
                                ${dog.kennelnaam ? `<div class="text-muted mb-2">${dog.kennelnaam}</div>` : ''}
                                
                                <div class="dog-detail-header-line mt-2">
                                    ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                    ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                    <span class="geslacht">${genderText}</span>
                                    ${dog.vachtkleur ? `<span class="vachtkleur">${dog.vachtkleur}</span>` : ''}
                                    
                                    ${offspringCount > 0 ? `
                                    <a href="#" class="offspring-badge offspring-button" 
                                       data-dog-id="${dog.id}" 
                                       data-dog-name="${dog.naam || ''}">
                                        <i class="bi bi-people-fill"></i>
                                        ${offspringCount} ${t('offspringCount')}
                                    </a>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="text-end">
                                ${dog.geboortedatum ? `
                                <div class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>
                                    ${formatDate(dog.geboortedatum)}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="details-body">
                        ${hasPhotos ? `
                        <div class="photos-section">
                            <div class="photos-title">
                                <i class="bi bi-camera"></i>
                                <span>${t('photos')}</span>
                            </div>
                            <div class="photos-grid-container" id="photosGrid${dog.id}">
                                <!-- Foto's worden geladen -->
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="info-group">
                            <div class="info-group-title">
                                <i class="bi bi-people me-1"></i> ${t('parents')}
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                        <div class="fw-bold mb-1 text-primary">
                                            <i class="bi bi-gender-male me-1"></i> ${t('father')}
                                        </div>
                                        <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                        ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                        ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                                        ${fatherInfo.id ? `
                                        <div class="click-hint">
                                            <i class="bi bi-arrow-right-circle"></i>
                                            ${t('clickToView')}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                        <div class="fw-bold mb-1 text-danger">
                                            <i class="bi bi-gender-female me-1"></i> ${t('mother')}
                                        </div>
                                        <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                        ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                        ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                                        ${motherInfo.id ? `
                                        <div class="click-hint">
                                            <i class="bi bi-arrow-right-circle"></i>
                                            ${t('clickToView')}
                                        </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-group">
                            <div class="info-group-title">
                                <i class="bi bi-heart-pulse me-1"></i> Gezondheidsinformatie
                            </div>
                            <div class="row">
                                ${dog.heupdysplasie ? `
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">Heupdysplasie</div>
                                    <div>${dog.heupdysplasie}</div>
                                </div>
                                ` : ''}
                                
                                ${dog.elleboogdysplasie ? `
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">Elleboogdysplasie</div>
                                    <div>${dog.elleboogdysplasie}</div>
                                </div>
                                ` : ''}
                                
                                ${dog.patella ? `
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">Patella Luxatie</div>
                                    <div>${dog.patella}</div>
                                </div>
                                ` : ''}
                                
                                ${dog.ogen ? `
                                <div class="col-md-6 mb-3">
                                    <div class="fw-bold mb-1">Ogen</div>
                                    <div>${dog.ogen}</div>
                                    ${dog.ogenVerklaring ? `<div class="text-muted small mt-1">${dog.ogenVerklaring}</div>` : ''}
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        ${dog.opmerkingen ? `
                        <div class="info-group">
                            <div class="info-group-title">
                                <i class="bi bi-info-circle me-1"></i> Opmerkingen
                            </div>
                            <div class="remarks-box">${dog.opmerkingen}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        
        // Laad foto's
        if (hasPhotos) {
            await this.loadAndDisplayPhotos(dog);
        }
        
        // Event listeners voor ouders
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
            
            if (!photosGrid || photos.length === 0) return;
            
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
                }
                
                if (photoUrl) {
                    photosHTML += `
                        <div class="photo-thumbnail" data-photo-src="${photoUrl}">
                            <img src="${photoUrl}" alt="${dog.naam}" class="thumbnail-img" loading="lazy">
                            <div class="photo-hover">
                                <i class="bi bi-zoom-in"></i>
                            </div>
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
        console.log('showParentDetails aangeroepen voor parent ID:', parentId);
        
        const parent = this.allDogs.find(d => d.id === parentId);
        if (parent) {
            console.log('Parent gevonden:', parent.naam);
            this.showDogDetails(parent, true, originalDogId);
            
            document.querySelectorAll('.dog-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === parentId) {
                    item.classList.add('selected');
                }
            });
        } else {
            console.error(`Parent met ID ${parentId} niet gevonden`);
            this.showError(`Ouder niet gevonden`);
        }
    }
    
    showProgress(message) {
        console.log('Progress:', message);
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        }
    }
    
    hideProgress() {
        console.log('Hide progress');
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        }
    }
    
    showError(message) {
        console.error('Error:', message);
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        }
    }
    
    showSuccess(message) {
        console.log('Success:', message);
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        }
    }
}