/**
 * Stamboom Manager Module
 * Beheert 5-generatie stambomen voor honden - GECORRIGEERDE VERSIE
 * Werkt samen met Supabase services via window object
 * **FOTO PROBLEEM OPGELOST** - Gebruikt nu EXACT DEZELFDE LOGICA als SearchManager
 * **PRIVEINFO TOEGEVOEGD** - Toont priveinfo als huidige gebruiker eigenaar is
 */

class StamboomManager extends BaseModule {
    constructor(hondenService, currentLang = 'nl') {
        super();
        this.hondenService = window.hondenService || hondenService;
        this.fotoService = window.fotoService;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.coiCalculator = null;
        this.currentUserId = null; // NIEUW: Huidige gebruiker ID voor priveinfo
        
        this.dogPhotosCache = new Map(); // Cache voor hondenfoto's - ZELFDE ALS SEARCHMANAGER
        
        this.translations = {
            nl: {
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "5-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                loadingAllDogs: "Alle honden laden... ({loaded} geladen)",
                close: "Sluiten",
                print: "Afdrukken",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                father: "Vader",
                mother: "Moeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                greatGreatGrandfather: "Overovergrootvader",
                greatGreatGrandmother: "Overovergrootmoeder",
                name: "Naam",
                kennel: "Kennel",
                pedigreeNumber: "Stamboomnummer",
                breed: "Ras",
                gender: "Geslacht",
                birthDate: "Geboortedatum",
                deathDate: "Overlijdensdatum",
                coatColor: "Vachtkleur",
                country: "Land",
                zipCode: "Postcode",
                healthInfo: "Gezondheidsinformatie",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                male: "Reu",
                female: "Teef",
                paternal: "Paternaal",
                maternal: "Maternaal",
                clickForDetails: "Klik voor details",
                closePopup: "Sluiten",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                greatGreatGrandparents: "Overovergrootouders",
                coi6Gen: "COI 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                loadFailed: "Fout bij laden: ",
                privateInfo: "Prive Informatie", // NIEUW
                privateInfoOwnerOnly: "Alleen zichtbaar voor eigenaar" // NIEUW
            },
            en: {
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "5-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                loadingAllDogs: "Loading all dogs... ({loaded} loaded)",
                close: "Close",
                print: "Print",
                noData: "No data",
                unknown: "Unknown",
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                father: "Father",
                mother: "Mother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                greatGreatGrandfather: "Great Great Grandfather",
                greatGreatGrandmother: "Great Great Grandmother",
                name: "Name",
                kennel: "Kennel",
                pedigreeNumber: "Pedigree number",
                breed: "Breed",
                gender: "Gender",
                birthDate: "Birth date",
                deathDate: "Death date",
                coatColor: "Coat color",
                country: "Country",
                zipCode: "Zip code",
                healthInfo: "Health Information",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                male: "Male",
                female: "Female",
                paternal: "Paternal",
                maternal: "Maternaal",
                clickForDetails: "Click for details",
                closePopup: "Close",
                remarks: "Remarks",
                noRemarks: "No remarks",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                greatGreatGrandparents: "Great Great Grandparents",
                coi6Gen: "COI 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                loadFailed: "Loading failed: ",
                privateInfo: "Private Information", // NIEUW
                privateInfoOwnerOnly: "Visible to owner only" // NIEUW
            },
            de: {
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "5-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                loadingAllDogs: "Lade alle Hunde... ({loaded} geladen)",
                close: "Schließen",
                print: "Drucken",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                father: "Vader",
                mother: "Mutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                greatGrandfather: "Urgroßvader",
                greatGrandmother: "Urgroßmutter",
                greatGreatGrandfather: "Ururgroßvater",
                greatGreatGrandmother: "Ururgroßmutter",
                name: "Name",
                kennel: "Kennel",
                pedigreeNumber: "Stammbaum-Nummer",
                breed: "Rasse",
                gender: "Geslacht",
                birthDate: "Geboortedatum",
                deathDate: "Sterbedatum",
                coatColor: "Fellfarbe",
                country: "Country",
                zipCode: "Postleitzahl",
                healthInfo: "Gesundheitsinformationen",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                male: "Rüde",
                female: "Hündin",
                paternal: "Väterlich",
                maternal: "Mütterlich",
                clickForDetails: "Klicken voor Details",
                closePopup: "Schließen",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                greatGreatGrandparents: "Ururgroßeltern",
                coi6Gen: "COI 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                loadFailed: "Fehler beim Laden: ",
                privateInfo: "Private Informationen", // NIEUW
                privateInfoOwnerOnly: "Nur für den Eigentümer sichtbar" // NIEUW
            }
        };
        
        this._eventHandlers = {};
        this._isActive = false;
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async initialize() {
        try {
            console.log('StamboomManager: Initialiseren...');
            
            // Haal huidige gebruiker ID op voor priveinfo
            this.currentUserId = await this.getCurrentUserId();
            console.log('StamboomManager: Huidige gebruiker ID:', this.currentUserId);
            
            this.showProgress(this.t('loadingAllDogs').replace('{loaded}', '0'));
            
            // Gebruik paginatie om ALLE honden te laden
            this.allDogs = await this.loadAllDogsWithPagination();
            
            console.log(`${this.allDogs.length} honden geladen voor stambomen`);
            
            if (typeof COICalculator !== 'undefined') {
                this.coiCalculator = new COICalculator(this.allDogs);
                console.log('COI Calculator geïnitialiseerd vanuit extern bestand');
            } else {
                console.error('COICalculator klasse niet gevonden!');
                this.coiCalculator = null;
            }
            
            this._isActive = true;
            this.setupGlobalEventListeners();
            
            // DIRECT het laadscherm verbergen
            console.log('StamboomManager: Initialisatie voltooid, verberg voortgangsindicator...');
            this.forceHideProgress();
            
        } catch (error) {
            console.error('Fout bij initialiseren StamboomManager:', error);
            this.showError('Kon stamboommanager niet initialiseren: ' + error.message);
            
            // Zorg dat het laadscherm ook bij fouten wordt verborgen
            this.forceHideProgress();
        }
    }
    
    // NIEUW: Methode om huidige gebruiker ID op te halen
    async getCurrentUserId() {
        try {
            // Probeer verschillende methodes om huidige gebruiker ID te krijgen
            if (window.currentUser && window.currentUser.id) {
                return window.currentUser.id;
            }
            
            if (window.auth && window.auth.getCurrentUser) {
                const user = await window.auth.getCurrentUser();
                if (user && user.id) return user.id;
            }
            
            if (window.supabase && window.supabase.auth) {
                const { data: { user } } = await window.supabase.auth.getUser();
                if (user && user.id) return user.id;
            }
            
            // Controleer localStorage of sessionStorage
            const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    if (user && user.id) return user.id;
                } catch (e) {
                    console.error('Fout bij parsen user data:', e);
                }
            }
            
            console.warn('StamboomManager: Geen gebruiker ID gevonden voor priveinfo');
            return null;
        } catch (error) {
            console.error('Fout bij ophalen gebruiker ID:', error);
            return null;
        }
    }
    
    // NIEUW: Methode om priveinfo voor een hond op te halen
    async getPrivateInfoForDog(stamboomnr) {
        if (!this.currentUserId || !stamboomnr) return null;
        
        try {
            if (!window.priveInfoService) {
                console.warn('PriveInfoService niet beschikbaar');
                return null;
            }
            
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            
            if (!result || !result.priveInfo) {
                console.log('Geen priveinfo gevonden in resultaat');
                return null;
            }
            
            // Zoek priveinfo voor deze hond EN deze gebruiker
            const priveInfo = result.priveInfo.find(info => 
                info.stamboomnr === stamboomnr && 
                info.toegevoegd_door === this.currentUserId
            );
            
            if (priveInfo) {
                console.log(`Priveinfo gevonden voor hond ${stamboomnr} en gebruiker ${this.currentUserId}`);
                return priveInfo.privatenotes || '';
            } else {
                console.log(`Geen priveinfo voor hond ${stamboomnr} en gebruiker ${this.currentUserId}`);
                return null;
            }
            
        } catch (error) {
            console.error('Fout bij ophalen priveinfo voor hond:', stamboomnr, error);
            return null;
        }
    }
    
    // Nieuwe methode om het laadscherm zeker te verbergen
    forceHideProgress() {
        console.log('forceHideProgress aangeroepen');
        
        // Methode 1: Roep de parent hideProgress aan
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
            console.log('Parent hideProgress aangeroepen');
        }
        
        // Methode 2: Direct DOM manipulatie om zeker te zijn
        setTimeout(() => {
            const progressOverlay = document.querySelector('.progress-overlay, .loading-overlay, .spinner-overlay');
            const progressModal = document.querySelector('.modal.progress-modal, .loading-modal');
            const loadingElements = document.querySelectorAll('.spinner-border, .progress, .loading-indicator');
            
            console.log('DOM cleanup:');
            console.log('- Progress overlay gevonden:', !!progressOverlay);
            console.log('- Progress modal gevonden:', !!progressModal);
            console.log('- Loading elements gevonden:', loadingElements.length);
            
            // Verberg alle mogelijke laadelementen
            if (progressOverlay) {
                progressOverlay.style.display = 'none';
                console.log('Progress overlay verborgen');
            }
            
            if (progressModal) {
                progressModal.style.display = 'none';
                console.log('Progress modal verborgen');
            }
            
            loadingElements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.style.display = 'none';
                    console.log('Loading element verborgen');
                }
            });
            
            // Verberg ook Bootstrap modals die laadschermen kunnen zijn
            const bootstrapModals = document.querySelectorAll('.modal.show');
            bootstrapModals.forEach(modal => {
                if (modal.id.includes('progress') || modal.id.includes('loading') || 
                    modal.classList.contains('progress') || modal.classList.contains('loading')) {
                    modal.style.display = 'none';
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove();
                    }
                    console.log('Bootstrap modal verborgen');
                }
            });
            
        }, 100);
    }
    
    async loadAllDogsWithPagination() {
        try {
            let allDogs = [];
            let currentPage = 1;
            const pageSize = 1000; // Maximaal wat Supabase toestaat
            let hasMorePages = true;
            let totalLoaded = 0;
            
            console.log('StamboomManager: Laden van alle honden met paginatie...');
            
            // Loop door alle pagina's
            while (hasMorePages) {
                console.log(`Laden pagina ${currentPage}...`);
                
                // Gebruik de getHonden() methode van je hondenService
                const result = await this.hondenService.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    // Voeg honden toe aan array
                    allDogs = allDogs.concat(result.honden);
                    totalLoaded = allDogs.length;
                    
                    // Update progress
                    const progressMessage = this.t('loadingAllDogs').replace('{loaded}', totalLoaded);
                    this.showProgress(progressMessage);
                    
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
            allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`StamboomManager: TOTAAL ${allDogs.length} honden geladen`);
            return allDogs;
            
        } catch (error) {
            console.error('Fout bij laden honden voor stambomen:', error);
            this.showError(this.t('loadFailed') + error.message);
            return [];
        }
    }
    
    cleanup() {
        this._isActive = false;
        this.removeGlobalEventListeners();
        
        this.dogPhotosCache.clear();
    }
    
    setupGlobalEventListeners() {
        // **EXACT DEZELFDE LOGICA ALS SEARCHMANAGER**
        const thumbnailClickHandler = (e) => {
            if (!this._isActive) return;
            
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                
                const photoSrc = thumbnail.getAttribute('data-photo-src');
                const dogName = thumbnail.getAttribute('data-dog-name') || '';
                
                console.log('StamboomManager: Foto geklikt, src:', photoSrc ? photoSrc.substring(0, 100) + '...' : 'geen src');
                
                if (photoSrc && photoSrc.trim() !== '') {
                    this.showLargePhoto(photoSrc, dogName);
                } else {
                    console.error('StamboomManager: Geen geldige foto src gevonden in attribuut');
                    // Probeer img src als fallback
                    const imgElement = thumbnail.querySelector('img');
                    if (imgElement && imgElement.src) {
                        console.log('StamboomManager: Gebruik img src als fallback:', imgElement.src.substring(0, 100) + '...');
                        this.showLargePhoto(imgElement.src, dogName);
                    }
                }
            }
        };
        
        const photoCloseHandler = (e) => {
            if (!this._isActive) return;
            
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.closest('.photo-large-close') ||
                e.target.closest('.photo-large-close-btn')) {
                this.closePhotoOverlay();
            }
            
            // Klik buiten de grote foto om te sluiten
            if (e.target.id === 'photoLargeOverlay') {
                this.closePhotoOverlay();
            }
        };
        
        const escapeKeyHandler = (e) => {
            if (!this._isActive) return;
            
            if (e.key === 'Escape') {
                const photoOverlay = document.getElementById('photoLargeOverlay');
                if (photoOverlay) {
                    this.closePhotoOverlay();
                    return;
                }
                
                const popupOverlay = document.getElementById('pedigreePopupOverlay');
                if (popupOverlay && popupOverlay.style.display !== 'none') {
                    popupOverlay.style.display = 'none';
                }
            }
        };
        
        document.addEventListener('click', thumbnailClickHandler);
        document.addEventListener('click', photoCloseHandler);
        document.addEventListener('keydown', escapeKeyHandler);
        
        this._eventHandlers.thumbnailClick = thumbnailClickHandler;
        this._eventHandlers.photoClose = photoCloseHandler;
        this._eventHandlers.escapeKey = escapeKeyHandler;
    }
    
    removeGlobalEventListeners() {
        if (this._eventHandlers.thumbnailClick) {
            document.removeEventListener('click', this._eventHandlers.thumbnailClick);
            delete this._eventHandlers.thumbnailClick;
        }
        
        if (this._eventHandlers.photoClose) {
            document.removeEventListener('click', this._eventHandlers.photoClose);
            delete this._eventHandlers.photoClose;
        }
        
        if (this._eventHandlers.escapeKey) {
            document.removeEventListener('keydown', this._eventHandlers.escapeKey);
            delete this._eventHandlers.escapeKey;
        }
        
        const overlays = [
            document.getElementById('pedigreeModal'),
            document.getElementById('pedigreePopupOverlay'),
            document.getElementById('photoLargeOverlay')
        ];
        
        overlays.forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }
    
    getDogById(id) {
        return this.allDogs.find(dog => dog.id === id);
    }
    
    // **EXACT DEZELFDE METHODE ALS SEARCHMANAGER: Foto's ophalen voor een hond**
    async getDogPhotos(dogId) {
        if (!dogId || dogId === 0) return [];
        
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        // Check cache
        const cacheKey = `${dogId}_${dog.stamboomnr}`;
        if (this.dogPhotosCache.has(cacheKey)) {
            return this.dogPhotosCache.get(cacheKey);
        }
        
        try {
            // **EXACT DEZELFDE QUERY ALS SEARCHMANAGER**
            const { data: fotos, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('stamboomnr', dog.stamboomnr)
                .order('uploaded_at', { ascending: false });
            
            if (error) {
                console.error('Supabase error bij ophalen foto\'s:', error);
                return [];
            }
            
            console.log(`StamboomManager: ${fotos?.length || 0} foto's gevonden voor hond ${dogId} (${dog.stamboomnr})`);
            
            this.dogPhotosCache.set(cacheKey, fotos || []);
            return fotos || [];
            
        } catch (error) {
            console.error('Fout bij ophalen foto\'s voor hond:', dogId, error);
            return [];
        }
    }
    
    // **EXACT DEZELFDE METHODE ALS SEARCHMANAGER: Check of een hond foto's heeft**
    async checkDogHasPhotos(dogId) {
        const photos = await this.getDogPhotos(dogId);
        return photos.length > 0;
    }
    
    // **EXACT DEZELFDE METHODE ALS SEARCHMANAGER: Toon grote foto**
    showLargePhoto(photoData, dogName = '') {
        console.log('StamboomManager: Toon grote foto:', photoData ? 'data gevonden' : 'geen data');
        
        // Verwijder bestaande overlay
        const existingOverlay = document.getElementById('photoLargeOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak nieuwe overlay - ZELFDE HTML ALS SEARCHMANAGER
        const overlayHTML = `
            <div class="photo-large-overlay" id="photoLargeOverlay" style="display: flex;">
                <div class="photo-large-container" id="photoLargeContainer">
                    <div class="photo-large-header">
                        <h5 class="modal-title mb-0 text-white">
                            <i class="bi bi-image me-2"></i> ${dogName || 'Foto'}
                        </h5>
                        <button type="button" class="btn-close btn-close-white photo-large-close" aria-label="${this.t('closePhoto')}"></button>
                    </div>
                    <div class="photo-large-content" id="photoLargeContent">
                        <img src="${photoData}" 
                             alt="${dogName || 'Foto'}" 
                             class="photo-large-img"
                             id="photoLargeImg"
                             onload="window.currentPhotoManager && window.currentPhotoManager.adjustPhotoSize(this)">
                    </div>
                    <div class="photo-large-footer">
                        <button type="button" class="btn btn-secondary photo-large-close-btn">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('closePhoto')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Zet een referentie naar deze manager zodat de onload functie hem kan vinden
        window.currentPhotoManager = this;
        
        // Als de foto al geladen is (cached), pas dan direct de grootte aan
        const img = document.getElementById('photoLargeImg');
        if (img.complete) {
            this.adjustPhotoSize(img);
        }
        
        // Event listeners voor sluiten - ZELFDE LOGICA ALS SEARCHMANAGER
        this.setupPhotoOverlayEvents();
    }
    
    // **EXACT DEZELFDE METHODE ALS SEARCHMANAGER: Pas foto grootte aan**
    adjustPhotoSize(imgElement) {
        if (!imgElement) return;
        
        const container = document.getElementById('photoLargeContainer');
        const content = document.getElementById('photoLargeContent');
        if (!container || !content) return;
        
        // Haal originele afmetingen op
        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;
        
        if (!naturalWidth || !naturalHeight) {
            console.warn('StamboomManager: Kan foto afmetingen niet bepalen');
            return;
        }
        
        console.log(`StamboomManager: Foto afmetingen: ${naturalWidth}x${naturalHeight}`);
        
        // Bereken beschikbare ruimte (met veilige marge)
        const maxContainerWidth = window.innerWidth * 0.95;
        const maxContainerHeight = window.innerHeight * 0.95;
        const safeMargin = 60; // Ruimte voor header/footer
        
        const availableWidth = maxContainerWidth;
        const availableHeight = maxContainerHeight - safeMargin;
        
        // Bereken optimale grootte
        let optimalWidth = naturalWidth;
        let optimalHeight = naturalHeight;
        
        // Als foto breder is dan beschikbaar
        if (optimalWidth > availableWidth) {
            const ratio = availableWidth / optimalWidth;
            optimalWidth = availableWidth;
            optimalHeight = optimalHeight * ratio;
        }
        
        // Als foto nu te hoog is
        if (optimalHeight > availableHeight) {
            const ratio = availableHeight / optimalHeight;
            optimalHeight = availableHeight;
            optimalWidth = optimalWidth * ratio;
        }
        
        // Als de foto erg klein is (thumbnail), vergroot hem dan een beetje
        const minSize = 300; // Minimale grootte voor leesbaarheid
        if (optimalWidth < minSize && optimalHeight < minSize) {
            // Vergroot proportioneel tot minSize
            const scale = minSize / Math.max(optimalWidth, optimalHeight);
            optimalWidth *= scale;
            optimalHeight *= scale;
            
            // Zorg dat we niet buiten het scherm gaan
            if (optimalWidth > availableWidth) {
                optimalWidth = availableWidth;
                optimalHeight = (optimalHeight / optimalWidth) * availableWidth;
            }
            if (optimalHeight > availableHeight) {
                optimalHeight = availableHeight;
                optimalWidth = (optimalWidth / optimalHeight) * availableHeight;
            }
        }
        
        // Pas container grootte aan
        container.style.width = optimalWidth + 'px';
        container.style.height = (optimalHeight + safeMargin) + 'px';
        
        console.log(`StamboomManager: Optimale grootte: ${optimalWidth}x${optimalHeight}`);
        
        // Centreren
        container.style.position = 'absolute';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        
        // Voor portret foto's: iets anders centreren
        if (optimalHeight > optimalWidth) {
            // Portret foto's iets hoger plaatsen voor betere balans
            container.style.transform = 'translate(-50%, -48%)';
        }
    }
    
    // **EXACT DEZELFDE METHODE ALS SEARCHMANAGER: Setup event listeners voor foto overlay**
    setupPhotoOverlayEvents() {
        const overlay = document.getElementById('photoLargeOverlay');
        if (!overlay) return;
        
        // Sluit met Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                this.closePhotoOverlay();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Sluit knop
        const closeBtn = overlay.querySelector('.photo-large-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closePhotoOverlay();
            });
        }
        
        // Sluit knop footer
        const closeBtnFooter = overlay.querySelector('.photo-large-close-btn');
        if (closeBtnFooter) {
            closeBtnFooter.addEventListener('click', () => {
                this.closePhotoOverlay();
            });
        }
        
        // Klik buiten container om te sluiten
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closePhotoOverlay();
            }
        });
        
        // Cleanup on animation end
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
        
        // Window resize event - pas grootte aan bij resizen
        const resizeHandler = () => {
            const img = document.getElementById('photoLargeImg');
            if (img && img.complete) {
                this.adjustPhotoSize(img);
            }
        };
        
        window.addEventListener('resize', resizeHandler);
        
        // Sla resize handler op voor later cleanup
        overlay.dataset.resizeHandler = 'active';
        overlay._resizeHandler = resizeHandler;
    }
    
    // **EXACT DEZELFDE METHODE ALS SEARCHMANAGER: Sluit foto overlay netjes**
    closePhotoOverlay() {
        const overlay = document.getElementById('photoLargeOverlay');
        if (overlay) {
            // Verwijder resize listener
            if (overlay._resizeHandler) {
                window.removeEventListener('resize', overlay._resizeHandler);
            }
            
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.2s ease';
            
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                // Cleanup globale referentie
                window.currentPhotoManager = null;
            }, 200);
        }
    }

    calculateCOI(dogId) {
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        if (!dog.vader_id && !dog.vaderId) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        if (!dog.moeder_id && !dog.moederId) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        const vaderId = dog.vader_id || dog.vaderId;
        const moederId = dog.moeder_id || dog.moederId;
        
        if (vaderId === moederId) {
            return { coi6Gen: '25.0', homozygosity6Gen: '25.0', kinship6Gen: '25.0' };
        }
        
        if (this.coiCalculator) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                const kinship = this.calculateAverageKinship(dogId, 6);
                
                return {
                    coi6Gen: result.coi6Gen || '0.0',
                    homozygosity6Gen: result.coiAllGen || '0.0',
                    kinship6Gen: kinship.toFixed(3)
                };
            } catch (error) {
                console.error('Fout in COICalculator:', error);
            }
        }
        
        return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
    }
    
    calculateAverageKinship(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const dog = this.getDogById(dogId);
            if (!dog) return 0;
            
            const vaderId = dog.vader_id || dog.vaderId;
            const moederId = dog.moeder_id || dog.moederId;
            
            if (!vaderId || !moederId) return 0;
            
            const allAncestors = this.coiCalculator._getAllAncestors(dogId, generations);
            const ancestorIds = Array.from(allAncestors.keys());
            
            if (ancestorIds.length <= 1) return 0;
            
            let totalKinship = 0;
            let pairCount = 0;
            
            const sampleSize = Math.min(ancestorIds.length, 30);
            const step = Math.max(1, Math.floor(ancestorIds.length / sampleSize));
            
            for (let i = 0; i < ancestorIds.length; i += step) {
                for (let j = i + step; j < ancestorIds.length; j += step) {
                    if (i !== j) {
                        const kinship = this.coiCalculator._calculateKinship(ancestorIds[i], ancestorIds[j], generations);
                        totalKinship += kinship;
                        pairCount++;
                    }
                }
            }
            
            return pairCount > 0 ? (totalKinship / pairCount) * 100 : 0;
        } catch (error) {
            console.error('Fout bij berekenen kinship:', error);
            return 0;
        }
    }
    
    getCOIColor(value) {
        const numValue = parseFloat(value);
        if (numValue < 4.0) return '#28a745';
        if (numValue <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    buildPedigreeTree(dogId) {
        const pedigreeTree = {
            mainDog: null,
            father: null,
            mother: null,
            paternalGrandfather: null,
            paternalGrandmother: null,
            maternalGrandfather: null,
            maternalGrandmother: null,
            paternalGreatGrandfather1: null,
            paternalGreatGrandmother1: null,
            paternalGreatGrandfather2: null,
            paternalGreatGrandmother2: null,
            maternalGreatGrandfather1: null,
            maternalGreatGrandmother1: null,
            maternalGreatGrandfather2: null,
            maternalGreatGrandmother2: null,
            paternalGreatGreatGrandfather1: null,
            paternalGreatGreatGrandmother1: null,
            paternalGreatGreatGrandfather2: null,
            paternalGreatGreatGrandmother2: null,
            paternalGreatGreatGrandfather3: null,
            paternalGreatGreatGrandmother3: null,
            paternalGreatGreatGrandfather4: null,
            paternalGreatGreatGrandmother4: null,
            maternalGreatGreatGrandfather1: null,
            maternalGreatGreatGrandmother1: null,
            maternalGreatGreatGrandfather2: null,
            maternalGreatGreatGrandmother2: null,
            maternalGreatGreatGrandfather3: null,
            maternalGreatGreatGrandmother3: null,
            maternalGreatGreatGrandfather4: null,
            maternalGreatGreatGrandmother4: null
        };
        
        const mainDog = this.getDogById(dogId);
        if (!mainDog) return null;
        
        pedigreeTree.mainDog = mainDog;
        
        // Ouders - gebruik de juiste veldnamen
        if (mainDog.vader_id || mainDog.vaderId) {
            const vaderId = mainDog.vader_id || mainDog.vaderId;
            pedigreeTree.father = this.getDogById(vaderId);
        }
        
        if (mainDog.moeder_id || mainDog.moederId) {
            const moederId = mainDog.moeder_id || mainDog.moederId;
            pedigreeTree.mother = this.getDogById(moederId);
        }
        
        // Grootouders
        if (pedigreeTree.father) {
            const vaderId = pedigreeTree.father.vader_id || pedigreeTree.father.vaderId;
            const moederId = pedigreeTree.father.moeder_id || pedigreeTree.father.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGrandfather = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGrandmother = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.mother) {
            const vaderId = pedigreeTree.mother.vader_id || pedigreeTree.mother.vaderId;
            const moederId = pedigreeTree.mother.moeder_id || pedigreeTree.mother.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGrandfather = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGrandmother = this.getDogById(moederId);
            }
        }
        
        // Overgrootouders
        if (pedigreeTree.paternalGrandfather) {
            const vaderId = pedigreeTree.paternalGrandfather.vader_id || pedigreeTree.paternalGrandfather.vaderId;
            const moederId = pedigreeTree.paternalGrandfather.moeder_id || pedigreeTree.paternalGrandfather.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGrandfather1 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGreatGrandmother1 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.paternalGrandmother) {
            const vaderId = pedigreeTree.paternalGrandmother.vader_id || pedigreeTree.paternalGrandmother.vaderId;
            const moederId = pedigreeTree.paternalGrandmother.moeder_id || pedigreeTree.paternalGrandmother.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGrandfather2 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGreatGrandmother2 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.maternalGrandfather) {
            const vaderId = pedigreeTree.maternalGrandfather.vader_id || pedigreeTree.maternalGrandfather.vaderId;
            const moederId = pedigreeTree.maternalGrandfather.moeder_id || pedigreeTree.maternalGrandfather.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGrandfather1 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGreatGrandmother1 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.maternalGrandmother) {
            const vaderId = pedigreeTree.maternalGrandmother.vader_id || pedigreeTree.maternalGrandmother.vaderId;
            const moederId = pedigreeTree.maternalGrandmother.moeder_id || pedigreeTree.maternalGrandmother.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGrandfather2 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGreatGrandmother2 = this.getDogById(moederId);
            }
        }
        
        // Overovergrootouders
        if (pedigreeTree.paternalGreatGrandfather1) {
            const vaderId = pedigreeTree.paternalGreatGrandfather1.vader_id || pedigreeTree.paternalGreatGrandfather1.vaderId;
            const moederId = pedigreeTree.paternalGreatGrandfather1.moeder_id || pedigreeTree.paternalGreatGrandfather1.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGreatGrandfather1 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGreatGreatGrandmother1 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.paternalGreatGrandmother1) {
            const vaderId = pedigreeTree.paternalGreatGrandmother1.vader_id || pedigreeTree.paternalGreatGrandmother1.vaderId;
            const moederId = pedigreeTree.paternalGreatGrandmother1.moeder_id || pedigreeTree.paternalGreatGrandmother1.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGreatGrandfather2 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGreatGreatGrandmother2 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.paternalGreatGrandfather2) {
            const vaderId = pedigreeTree.paternalGreatGrandfather2.vader_id || pedigreeTree.paternalGreatGrandfather2.vaderId;
            const moederId = pedigreeTree.paternalGreatGrandfather2.moeder_id || pedigreeTree.paternalGreatGrandfather2.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGreatGrandfather3 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGreatGreatGrandmother3 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.paternalGreatGrandmother2) {
            const vaderId = pedigreeTree.paternalGreatGrandmother2.vader_id || pedigreeTree.paternalGreatGrandmother2.vaderId;
            const moederId = pedigreeTree.paternalGreatGrandmother2.moeder_id || pedigreeTree.paternalGreatGrandmother2.moederId;
            
            if (vaderId) {
                pedigreeTree.paternalGreatGreatGrandfather4 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.paternalGreatGreatGrandmother4 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.maternalGreatGrandfather1) {
            const vaderId = pedigreeTree.maternalGreatGrandfather1.vader_id || pedigreeTree.maternalGreatGrandfather1.vaderId;
            const moederId = pedigreeTree.maternalGreatGrandfather1.moeder_id || pedigreeTree.maternalGreatGrandfather1.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGreatGrandfather1 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGreatGreatGrandmother1 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.maternalGreatGrandmother1) {
            const vaderId = pedigreeTree.maternalGreatGrandmother1.vader_id || pedigreeTree.maternalGreatGrandmother1.vaderId;
            const moederId = pedigreeTree.maternalGreatGrandmother1.moeder_id || pedigreeTree.maternalGreatGrandmother1.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGreatGrandfather2 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGreatGreatGrandmother2 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.maternalGreatGrandfather2) {
            const vaderId = pedigreeTree.maternalGreatGrandfather2.vader_id || pedigreeTree.maternalGreatGrandfather2.vaderId;
            const moederId = pedigreeTree.maternalGreatGrandfather2.moeder_id || pedigreeTree.maternalGreatGrandfather2.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGreatGrandfather3 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGreatGreatGrandmother3 = this.getDogById(moederId);
            }
        }
        
        if (pedigreeTree.maternalGreatGrandmother2) {
            const vaderId = pedigreeTree.maternalGreatGrandmother2.vader_id || pedigreeTree.maternalGreatGrandmother2.vaderId;
            const moederId = pedigreeTree.maternalGreatGrandmother2.moeder_id || pedigreeTree.maternalGreatGrandmother2.moederId;
            
            if (vaderId) {
                pedigreeTree.maternalGreatGreatGrandfather4 = this.getDogById(vaderId);
            }
            
            if (moederId) {
                pedigreeTree.maternalGreatGreatGrandmother4 = this.getDogById(moederId);
            }
        }
        
        return pedigreeTree;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                          this.currentLang === 'de' ? 'de-DE' : 'en-US');
        } catch {
            return dateString;
        }
    }
    
    getHealthBadge(value, type) {
        if (!value || value === '') {
            return `<span class="badge bg-secondary">${this.t('unknown')}</span>`;
        }
        
        let badgeClass = 'badge ';
        switch(type) {
            case 'hip': badgeClass += 'badge-hd'; break;
            case 'elbow': badgeClass += 'badge-ed'; break;
            case 'patella': badgeClass += 'badge-pl'; break;
            case 'eyes': badgeClass += 'badge-eyes'; break;
            case 'dandy': badgeClass += 'badge-dandy'; break;
            case 'thyroid': badgeClass += 'badge-thyroid'; break;
            default: badgeClass += 'bg-secondary';
        }
        
        return `<span class="${badgeClass}">${value}</span>`;
    }
    
    async getDogCompactCardHTML(dog, relation = '', isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="pedigree-card-compact horizontal empty gen${generation}" data-dog-id="0">
                    <div class="pedigree-card-header-compact horizontal">
                        <div class="relation-compact">${relation}</div>
                    </div>
                    <div class="pedigree-card-body-compact horizontal text-center py-3">
                        <div class="no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-primary' : 'bg-secondary';
        
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const cameraIcon = hasPhotos ? '<i class="bi bi-camera text-danger ms-1"></i>' : '';

        if (generation === 4) {
            const combinedName = dog.naam || this.t('unknown');
            const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
            const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
            
            return `
                <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                     data-dog-id="${dog.id}" 
                     data-dog-name="${dog.naam || ''}"
                     data-relation="${relation}"
                     data-generation="${generation}"
                     data-has-photos="${hasPhotos}">
                    <div class="pedigree-card-header-compact horizontal ${headerColor}">
                        <div class="relation-compact">
                            <span class="relation-text">${relation}</span>
                            ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                        </div>
                        <div class="gender-icon-compact">
                            <i class="bi ${genderIcon}"></i>
                        </div>
                    </div>
                    <div class="pedigree-card-body-compact horizontal">
                        <div class="card-row card-row-1-only">
                            <div class="dog-name-kennel-only" title="${fullDisplayText}">
                                ${fullDisplayText}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        return `
            <div class="pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-has-photos="${hasPhotos}">
                <div class="pedigree-card-header-compact horizontal ${headerColor}">
                    <div class="relation-compact">
                        <span class="relation-text">${relation}</span>
                        ${isMainDog ? '<span class="main-dot">★</span>' : ''}
                    </div>
                    <div class="gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="pedigree-card-body-compact horizontal">
                    <div class="card-row card-row-1">
                        <div class="dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <div class="card-row card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${dog.ras ? `
                        <div class="dog-breed-compact" title="${dog.ras}">
                            ${dog.ras}
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="card-row card-row-3">
                        <div class="click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}${cameraIcon}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        // NIEUW: Haal priveinfo op voor deze hond en huidige gebruiker
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null;
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        const coiValues = this.calculateCOI(dog.id);
        const coiColor = this.getCOIColor(coiValues.coi6Gen);
        
        // **GECORRIGEERD: Gebruik nu dezelfde getDogPhotos methode als SearchManager**
        const photos = await this.getDogPhotos(dog.id);
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        let photosHTML = '';
        if (photos.length > 0) {
            photosHTML = `
                <div class="info-section mb-3">
                    <h6><i class="bi bi-camera me-1"></i> ${this.t('photos')} (${photos.length})</h6>
                    <div class="photos-grid" id="photosGrid${dog.id}">
                        ${photos.map((photo, index) => {
                            // **BELANGRIJK: Gebruik dezelfde logica als SearchManager voor thumbnails**
                            let thumbnailUrl = photo.thumbnail || photo.data;
                            let fullSizeUrl = photo.data;
                            
                            return `
                                <div class="photo-thumbnail" 
                                     data-photo-id="${photo.id || index}" 
                                     data-dog-id="${dog.id}" 
                                     data-dog-name="${dog.naam || ''}"
                                     data-photo-index="${index}"
                                     data-photo-src="${fullSizeUrl}"
                                     data-thumbnail-src="${thumbnailUrl}">
                                    <img src="${thumbnailUrl}"
                                         alt="${dog.naam || ''} - ${photo.filename || ''}" 
                                         class="thumbnail-img"
                                         loading="lazy">
                                    <div class="photo-hover">
                                        <i class="bi bi-zoom-in"></i>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="photo-hint">
                        <small class="text-muted"><i class="bi bi-info-circle me-1"></i> ${this.t('clickToEnlarge')}</small>
                    </div>
                </div>
            `;
        }
        
        // NIEUW: Priveinfo HTML sectie
        let privateInfoHTML = '';
        if (hasPrivateInfo) {
            privateInfoHTML = `
                <div class="info-section mb-2">
                    <h6><i class="bi bi-lock-fill me-1"></i> ${this.t('privateInfo')}</h6>
                    <div class="remarks-box" style="background-color: #fff3cd; border-color: #ffeaa7;">
                        ${privateNotes}
                    </div>
                </div>
            `;
        } else {
            privateInfoHTML = `
                <div class="info-section mb-2">
                    <h6><i class="bi bi-lock me-1"></i> ${this.t('privateInfo')}</h6>
                    <div class="text-muted">
                        <i>${this.t('privateInfoOwnerOnly')}</i>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="Sluiten"></button>
                </div>
                <div class="popup-body">
                    ${photosHTML}
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="info-grid">
                            <div class="info-row">
                                ${dog.stamboomnr ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('pedigreeNumber')}:</span>
                                    <span class="info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('breed')}:</span>
                                    <span class="info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="info-row">
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('gender')}:</span>
                                    <span class="info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="info-item info-item-half">
                                    <span class="info-label">${this.t('coatColor')}:</span>
                                    <span class="info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- DRIE WAARDES NAAST ELKAAR -->
                            <div class="three-values-row">
                                <!-- COI 6 Gen -->
                                <div class="value-box">
                                    <div class="value-label">${this.t('coi6Gen')}</div>
                                    <div class="value-number coi-value" style="color: ${coiColor} !important;">${coiValues.coi6Gen}%</div>
                                </div>
                                
                                <!-- Homozygotie 6 Gen -->
                                <div class="value-box">
                                    <div class="value-label">${this.t('homozygosity6Gen')}</div>
                                    <div class="value-number">${coiValues.homozygosity6Gen}%</div>
                                </div>
                                
                                <!-- Kinship 6 Gen -->
                                <div class="value-box">
                                    <div class="value-label">${this.t('kinship6Gen')}</div>
                                    <div class="value-number">${coiValues.kinship6Gen}%</div>
                                </div>
                            </div>
                            
                            ${dog.geboortedatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('birthDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('deathDate')}:</span>
                                    <span class="info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.land ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('country')}:</span>
                                    <span class="info-value">${dog.land}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('zipCode')}:</span>
                                    <span class="info-value">${dog.postcode}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> ${this.t('healthInfo')}</h6>
                        <div class="info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('hipDysplasia')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.heupdysplasie, 'hip')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('elbowDysplasia')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.elleboogdysplasie, 'elbow')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('patellaLuxation')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.patella, 'patella')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyes')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.ogen, 'eyes')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogenverklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('eyesExplanation')}:</span>
                                    <span class="info-value">${dog.ogenverklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('dandyWalker')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroid')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierverklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full">
                                    <span class="info-label">${this.t('thyroidExplanation')}:</span>
                                    <span class="info-value">${dog.schildklierverklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : `
                    <div class="info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> ${this.t('remarks')}</h6>
                        <div class="text-muted">${this.t('noRemarks')}</div>
                    </div>
                    `}
                    
                    <!-- NIEUW: Priveinfo sectie -->
                    ${privateInfoHTML}
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    async showPedigree(dog) {
        if (!this._isActive) return;
        
        // Verberg eerst eventuele voortgangsindicatoren die nog zichtbaar zijn
        this.forceHideProgress();
        
        if (!document.getElementById('pedigreeModal')) {
            this.createPedigreeModal();
        }
        
        const pedigreeTree = this.buildPedigreeTree(dog.id);
        if (!pedigreeTree) {
            this.showError("Kon stamboom niet genereren");
            return;
        }
        
        const title = this.t('pedigreeTitle').replace('{name}', dog.naam || this.t('unknown'));
        document.getElementById('pedigreeModalLabel').textContent = title;
        
        await this.renderCompactPedigree(pedigreeTree);
        
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal'));
        modal.show();
        
        const modalElement = document.getElementById('pedigreeModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', () => {
                const popupOverlay = document.getElementById('pedigreePopupOverlay');
                if (popupOverlay) {
                    popupOverlay.style.display = 'none';
                }
                
                const photoOverlay = document.getElementById('photoLargeOverlay');
                if (photoOverlay) {
                    this.closePhotoOverlay();
                }
            });
        }
    }
    
    createPedigreeModal() {
        const modalHTML = `
            <div class="modal fade" id="pedigreeModal" tabindex="-1" aria-labelledby="pedigreeModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="pedigreeModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${this.t('pedigree4Gen')}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <div class="pedigree-mobile-wrapper" id="pedigreeMobileWrapper">
                                <div class="pedigree-container-compact" id="pedigreeContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">${this.t('generatingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('generatingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="pedigree-popup-overlay" id="pedigreePopupOverlay" style="display: none;">
                <div class="pedigree-popup-container" id="pedigreePopupContainer">
                </div>
            </div>
            
            <style>
                /* DRIE WAARDES NAAST ELKAAR */
                .three-values-row {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                    align-items: stretch !important;
                    gap: 8px !important;
                    margin: 10px 0 !important;
                    width: 100% !important;
                }
                
                .value-box {
                    flex: 1 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-align: center !important;
                    padding: 8px 4px !important;
                    background: #f8f9fa !important;
                    border-radius: 6px !important;
                    border: 1px solid #dee2e6 !important;
                    min-height: 60px !important;
                    min-width: 0 !important;
                }
                
                .value-label {
                    font-size: 0.68rem !important;
                    font-weight: 600 !important;
                    color: #495057 !important;
                    margin-bottom: 4px !important;
                    line-height: 1.2 !important;
                    white-space: normal !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    hyphens: auto !important;
                    width: 100% !important;
                    display: block !important;
                }
                
                .value-number {
                    font-size: 0.85rem !important;
                    font-weight: bold !important;
                    line-height: 1.2 !important;
                    color: #212529 !important;
                }
                
                .coi-value {
                    font-weight: bold !important;
                }
                
                /* Rest van de CSS blijft hetzelfde */
                .pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
                .pedigree-container-compact {
                    padding: 15px !important;
                    margin: 0 !important;
                    width: 100% !important;
                    background: #f8f9fa;
                    overflow-x: auto !important;
                    overflow-y: auto !important;
                    position: relative;
                    min-height: 0 !important;
                    box-sizing: border-box !important;
                    border-radius: inherit;
                }
                
                .pedigree-grid-compact {
                    display: flex;
                    flex-direction: row;
                    height: auto;
                    min-width: fit-content;
                    padding: 10px 15px !important;
                    gap: 20px;
                    align-items: flex-start;
                    box-sizing: border-box !important;
                    margin: 0 auto;
                }
                
                .pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                .pedigree-generation-col.gen0,
                .pedigree-generation-col.gen1,
                .pedigree-generation-col.gen2,
                .pedigree-generation-col.gen3,
                .pedigree-generation-col.gen4 {
                    gap: 4px !important;
                }
                
                .pedigree-card-compact.horizontal {
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #dee2e6;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin: 0 !important;
                    padding: 0 !important;
                    flex-shrink: 0;
                }
                
                .pedigree-card-compact.horizontal.gen0,
                .pedigree-card-compact.horizontal.gen1,
                .pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 140px !important;
                }
                
                .pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 70px !important;
                }
                
                .pedigree-card-compact.horizontal.gen4 {
                    width: 160px !important;
                    height: 35px !important;
                }
                
                .pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #0d6efd !important;
                    background: #f0f7ff;
                    width: 170px !important;
                    height: 140px !important;
                }
                
                .pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
                }
                
                .pedigree-card-compact.horizontal:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                    transform: translateY(-1px);
                    z-index: 1;
                    position: relative;
                }
                
                .pedigree-card-compact.horizontal.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .pedigree-card-compact.horizontal.empty:hover {
                    transform: none !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
                }
                
                .pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-header-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;
                    min-height: 16px;
                }
                
                .pedigree-card-compact.horizontal.gen4 .pedigree-card-header-compact.horizontal {
                    padding: 1px 4px;
                    font-size: 0.45rem;
                    min-height: 12px;
                }
                
                .pedigree-card-header-compact.horizontal.bg-primary {
                    background: #0d6efd !important;
                }
                
                .pedigree-card-header-compact.horizontal.bg-secondary {
                    background: #6c757d !important;
                }
                
                .relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-weight: 600;
                    overflow: hidden;
                    flex: 1;
                }
                
                .relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .main-dot {
                    color: #ffc107;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }
                
                .gender-icon-compact {
                    flex-shrink: 0;
                    margin-left: 4px;
                }
                
                .pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                .pedigree-card-compact.horizontal.gen0 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen1 .pedigree-card-body-compact.horizontal,
                .pedigree-card-compact.horizontal.gen2 .pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                .pedigree-card-compact.horizontal.gen3 .pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                .pedigree-card-compact.horizontal.gen4 .pedigree-card-body-compact.horizontal {
                    padding: 2px 4px;
                }
                
                .card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .card-row-1-only {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: 100% !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                .dog-name-kennel-only {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1;
                    width: 100%;
                    font-size: 0.5rem;
                    text-align: center;
                }
                
                .card-row-1 {
                    margin-bottom: 2px;
                }
                
                .card-row-2 {
                    margin-bottom: 2px;
                }
                
                .card-row-3 {
                    margin-top: auto;
                }
                
                .dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                    font-size: 0.75rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                    font-size: 0.65rem;
                }
                
                .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                    font-size: 0.55rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                    font-size: 0.6rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                    font-size: 0.52rem;
                }
                
                .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                    font-size: 0.44rem;
                }
                
                .dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                }
                
                .dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                }
                
                .no-data-text {
                    color: #6c757d;
                    font-style: italic;
                    line-height: 1.3;
                    font-size: 0.7rem;
                }
                
                .click-hint-compact {
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 3px;
                    line-height: 1;
                    width: 100%;
                    padding-top: 2px;
                    border-top: 1px dashed #dee2e6;
                    font-size: 0.55rem;
                }
                
                .pedigree-card-compact.horizontal.gen4 .click-hint-compact {
                    display: none !important;
                }
                
                .click-hint-compact .bi-camera {
                    color: #1a15f4;
                    font-size: 0.7rem;
                }
                
                @media (max-width: 767px) {
                    #pedigreeModal.modal.fade .modal-dialog {
                        max-width: 100%;
                        margin: 0.5rem auto;
                        height: auto;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100%;
                        height: auto;
                        margin: 0;
                        border-radius: 12px;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    #pedigreeModal.modal.fade .modal-header {
                        margin: 0;
                        padding: 0.75rem 1rem;
                        border: none;
                        width: 100%;
                        flex-shrink: 0;
                        min-height: auto;
                        z-index: 1;
                        border-radius: 12px 12px 0 0;
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        flex: 1 1 auto;
                        overflow: hidden;
                        min-height: 0;
                        max-height: 640px;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .pedigree-mobile-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8f9fa;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .pedigree-grid-compact {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        height: 100% !important;
                        min-width: max-content !important;
                        padding: 10px 15px !important;
                        gap: 15px !important;
                        margin: 0 !important;
                        align-items: stretch !important;
                        box-sizing: border-box !important;
                        width: auto !important;
                    }
                    
                    .pedigree-generation-col {
                        display: flex !important;
                        flex-direction: column !important;
                        height: 100% !important;
                        flex-shrink: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        position: relative;
                        justify-content: center !important;
                        align-items: flex-start !important;
                    }
                    
                    .pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 200px !important;
                        width: 200px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 200px !important;
                        width: 200px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(2) {
                        margin-top: -2px !important;
                    }
                    
                    .pedigree-generation-col.gen1 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: 2px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 200px !important;
                        width: 200px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen2 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 200px !important;
                        width: 200px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(2),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -8px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(4),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: -4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(6),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(7) {
                        margin-top: 0px !important;
                    }
                    
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(8),
                    .pedigree-generation-col.gen3 > .pedigree-card-compact.horizontal:nth-child(9) {
                        margin-top: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen4 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 200px !important;
                        width: 200px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 150px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 75px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 34px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 150px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .pedigree-generation-col > * {
                        width: 100% !important;
                    }
                    
                    /* DRIE WAARDES NAAST ELKAAR OP MOBIEL */
                    .three-values-row {
                        gap: 4px !important;
                        margin: 8px 0 !important;
                    }
                    
                    .value-box {
                        padding: 6px 3px !important;
                        min-height: 55px !important;
                    }
                    
                    .value-label {
                        font-size: 0.61rem !important;
                    }
                    
                    .value-number {
                        font-size: 0.8rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .pedigree-container-compact {
                        height: 640px !important;
                        padding: 8px !important;
                    }
                    
                    .pedigree-grid-compact {
                        padding: 8px 12px !important;
                        gap: 4px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 150px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 75px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 34px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 150px !important;
                    }
                    
                    .pedigree-generation-col {
                        min-width: 200px !important;
                        width: 200px !important;
                    }
                    
                    .pedigree-generation-col.gen0,
                    .pedigree-generation-col.gen1,
                    .pedigree-generation-col.gen2,
                    .pedigree-generation-col.gen3,
                    .pedigree-generation-col.gen4 {
                        min-width: 200px !important;
                        width: 200px !important;
                    }
                    
                    .three-values-row {
                        gap: 3px !important;
                    }
                    
                    .value-box {
                        padding: 5px 2px !important;
                        min-height: 50px !important;
                    }
                    
                    .value-label {
                        font-size: 0.58rem !important;
                    }
                    
                    .value-number {
                        font-size: 0.75rem !important;
                    }
                }
                
                @media (min-width: 768px) {
                    #pedigreeModal.modal.fade .modal-dialog.modal-fullscreen {
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    
                    #pedigreeModal.modal.fade .modal-content {
                        width: 100% !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        border-radius: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    #pedigreeModal.modal.fade .modal-header {
                        margin: 0 !important;
                        padding: 0.75rem 1rem !important;
                        border: none !important;
                        width: 100% !important;
                        flex-shrink: 0 !important;
                        min-height: auto !important;
                        z-index: 1;
                    }
                    
                    #pedigreeModal.modal.fade .modal-body {
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 1 auto !important;
                        overflow: hidden !important;
                        min-height: 0 !important;
                    }
                    
                    .pedigree-mobile-wrapper {
                        height: 100%;
                        border-radius: 0;
                    }
                    
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        align-items: center;
                        padding: 0 !important;
                        display: flex;
                        border-radius: 0;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row;
                        height: 100%;
                        min-width: fit-content;
                        padding: 0 20px !important;
                        gap: 25px;
                        align-items: center;
                        box-sizing: border-box !important;
                        margin: 0 auto;
                    }
                    
                    .pedigree-generation-col {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        min-width: 0;
                    }
                    
                    .pedigree-generation-col.gen0 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen1 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen2 {
                        gap: 4px !important;
                    }
                    
                    .pedigree-generation-col.gen3 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .pedigree-generation-col.gen4 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 140px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 70px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 35px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 140px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-name-kennel-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-name-kennel-compact {
                        font-size: 0.8rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen0 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen1 .dog-breed-compact,
                    .pedigree-card-compact.horizontal.gen2 .dog-breed-compact {
                        font-size: 0.7rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen1 .click-hint-compact,
                    .pedigree-card-compact.horizontal.gen2 .click-hint-compact {
                        font-size: 0.6rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-name-kennel-compact {
                        font-size: 0.64rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .dog-pedigree-compact,
                    .pedigree-card-compact.horizontal.gen3 .dog-breed-compact {
                        font-size: 0.56rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 .click-hint-compact {
                        font-size: 0.48rem;
                    }
                    
                    .pedigree-card-compact.horizontal.gen4 .dog-name-kennel-only {
                        font-size: 0.54rem;
                    }
                }
                
                @media (min-width: 1024px) and (max-width: 1365px) {
                    .pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                    }
                    
                    .pedigree-grid-compact {
                        gap: 15px;
                        padding: 0 12px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen0,
                    .pedigree-card-compact.horizontal.gen1,
                    .pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 150px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 75px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 35px !important;
                    }
                    
                    .pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 150px !important;
                    }
                }
                
                .pedigree-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1060;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .pedigree-popup-container {
                    background: white;
                    border-radius: 12px;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    width: calc(100% - 20px);
                    margin: 10px;
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
                
                .dog-detail-popup {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .popup-header {
                    background: #0d6efd;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 12px 12px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }
                
                .popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                .popup-header .btn-close {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    background: transparent;
                    border: none;
                    position: relative;
                    cursor: pointer;
                    opacity: 0.8;
                    z-index: 2;
                    filter: invert(1) grayscale(100%) brightness(200%) !important;
                }
                
                .popup-header .btn-close::before,
                .popup-header .btn-close::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 18px;
                    height: 2px;
                    background: #000 !important;
                    transform-origin: center;
                }
                
                .popup-header .btn-close::before {
                    transform: translate(-50%, -50%) rotate(45deg);
                }
                
                .popup-header .btn-close::after {
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
                
                .popup-header .btn-close:hover {
                    opacity: 1;
                }
                
                .popup-body {
                    padding: 15px;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                .info-section {
                    margin-bottom: 20px;
                }
                
                .info-section h6 {
                    color: #495057;
                    margin-bottom: 10px;
                    padding-bottom: 6px;
                    border-bottom: 2px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    font-size: 1rem;
                }
                
                .info-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .info-row {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 8px !important;
                    margin-bottom: 0 !important;
                    width: 100% !important;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    width: 100% !important;
                    min-width: 0 !important;
                }
                
                .info-item-half {
                    grid-column: span 1 !important;
                    width: 100% !important;
                }
                
                .info-item-full {
                    grid-column: 1 / -1 !important;
                    width: 100% !important;
                    margin-bottom: 4px;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                    line-height: 1.2;
                }
                
                .info-value {
                    color: #212529;
                    font-size: 0.95rem;
                    line-height: 1.3;
                    word-break: break-word;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 12px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                .photos-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 6px;
                    margin-bottom: 10px;
                    max-width: 240px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .photo-thumbnail {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    border-radius: 4px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                }
                
                .photo-thumbnail:hover {
                    border-color: #0d6efd;
                    transform: scale(1.05);
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
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .photo-thumbnail:hover .photo-hover {
                    opacity: 1;
                }
                
                .photo-hover i {
                    color: white;
                    font-size: 1.2rem;
                }
                
                .photo-hint {
                    text-align: center;
                    margin-bottom: 15px;
                    font-size: 0.85rem;
                }
                
                .popup-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 0 0 12px 12px;
                }
                
                .popup-close-btn {
                    min-width: 130px;
                    padding: 10px 25px;
                    font-size: 1rem;
                }
                
                .photo-large-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 1070;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                }
                
                .photo-large-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    max-height: 95vh;
                    animation: slideUp 0.3s;
                }
                
                .photo-large-header {
                    padding: 12px 16px;
                    background: #0d6efd;
                    color: white;
                    display: flex;
                    justify-content: flex-end;
                }
                
                .photo-large-close {
                    background: none;
                    border: none;
                    color: white;
                    opacity: 0.8;
                    font-size: 1.3rem;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }
                
                .photo-large-close-btn:hover {
                    background: #5a6268;     /* <-- TOEVOEGEN */
                    border-color: #545b62;   /* <-- TOEVOEGEN */
                    color: white;            /* <-- TOEVOEGEN */
                }
                
                .photo-large-content {
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex: 1;
                    min-height: 300px;
                }
                
                .photo-large-img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    border-radius: 4px;
                }
                
                .photo-large-footer {
                    padding: 16px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                }
                
                .photo-large-close-btn {
                    min-width: 120px;
                    padding: 8px 20px;
                }
                
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header {
                        display: none !important;
                    }
                    
                    .pedigree-container-compact {
                        padding: 0;
                        background: white;
                        height: auto !important;
                        overflow-x: visible !important;
                        height: 100vh !important;
                    }
                    
                    .pedigree-grid-compact {
                        flex-direction: row !important;
                        height: auto;
                        padding: 20px !important;
                        gap: 15px;
                    }
                    
                    .pedigree-generation-col {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .pedigree-card-compact.horizontal {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #ccc !important;
                        margin-bottom: 10px;
                    }
                    
                    .main-dog-compact {
                        border: 2px solid #000 !important;
                    }
                    
                    .pedigree-popup-overlay,
                    .photo-large-overlay {
                        display: none !important;
                    }
                }
                
                .pedigree-card-compact.horizontal.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .pedigree-generation-col {
                    position: relative;
                }
                
                .pedigree-generation-col:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    width: 10px;
                    height: 1px;
                    background: #adb5bd;
                    opacity: 0.5;
                }
                
                .pedigree-card-compact.horizontal.gen3 {
                    opacity: 0.9;
                }
                
                .pedigree-card-compact.horizontal.gen3:hover {
                    opacity: 1;
                }
                
                .pedigree-card-compact.horizontal.gen4 {
                    opacity: 0.8;
                }
                
                .pedigree-card-compact.horizontal.gen4:hover {
                    opacity: 1;
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupPedigreeModalEvents();
    }
    
    setupPedigreeModalEvents() {
        const modal = document.getElementById('pedigreeModal');
        if (!modal) return;
        
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
        
        modal.addEventListener('hidden.bs.modal', () => {
            if (!this._isActive) return;
            
            const popupOverlay = document.getElementById('pedigreePopupOverlay');
            if (popupOverlay) {
                popupOverlay.style.display = 'none';
            }
            
            const photoOverlay = document.getElementById('photoLargeOverlay');
            if (photoOverlay) {
                this.closePhotoOverlay();
            }
        });
    }
    
    async renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) return;
        
        const mainDogCard = await this.getDogCompactCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true, 0);
        const fatherCard = await this.getDogCompactCardHTML(pedigreeTree.father, this.t('father'), false, 1);
        const motherCard = await this.getDogCompactCardHTML(pedigreeTree.mother, this.t('mother'), false, 1);
        const paternalGrandfatherCard = await this.getDogCompactCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'), false, 2);
        const paternalGrandmotherCard = await this.getDogCompactCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'), false, 2);
        const maternalGrandfatherCard = await this.getDogCompactCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'), false, 2);
        const maternalGrandmotherCard = await this.getDogCompactCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'), false, 2);
        
        const paternalGreatGrandfather1Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'), false, 3);
        const paternalGreatGrandmother1Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'), false, 3);
        const paternalGreatGrandfather2Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'), false, 3);
        const paternalGreatGrandmother2Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'), false, 3);
        const maternalGreatGrandfather1Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'), false, 3);
        const maternalGreatGrandmother1Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'), false, 3);
        const maternalGreatGrandfather2Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'), false, 3);
        const maternalGreatGrandmother2Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'), false, 3);
        
        const paternalGreatGreatGrandfather1Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather1, this.t('greatGreatGrandfather'), false, 4);
        const paternalGreatGreatGrandmother1Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother1, this.t('greatGreatGrandmother'), false, 4);
        const paternalGreatGreatGrandfather2Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather2, this.t('greatGreatGrandfather'), false, 4);
        const paternalGreatGreatGrandmother2Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother2, this.t('greatGreatGrandmother'), false, 4);
        const paternalGreatGreatGrandfather3Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather3, this.t('greatGreatGrandfather'), false, 4);
        const paternalGreatGreatGrandmother3Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother3, this.t('greatGreatGrandmother'), false, 4);
        const paternalGreatGreatGrandfather4Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather4, this.t('greatGreatGrandfather'), false, 4);
        const paternalGreatGreatGrandmother4Card = await this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother4, this.t('greatGreatGrandmother'), false, 4);
        const maternalGreatGreatGrandfather1Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather1, this.t('greatGreatGrandfather'), false, 4);
        const maternalGreatGreatGrandmother1Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother1, this.t('greatGreatGrandmother'), false, 4);
        const maternalGreatGreatGrandfather2Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather2, this.t('greatGreatGrandfather'), false, 4);
        const maternalGreatGreatGrandmother2Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother2, this.t('greatGreatGrandmother'), false, 4);
        const maternalGreatGreatGrandfather3Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather3, this.t('greatGreatGrandfather'), false, 4);
        const maternalGreatGreatGrandmother3Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother3, this.t('greatGreatGrandmother'), false, 4);
        const maternalGreatGreatGrandfather4Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather4, this.t('greatGreatGrandfather'), false, 4);
        const maternalGreatGreatGrandmother4Card = await this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother4, this.t('greatGreatGrandmother'), false, 4);
        
        const gridHTML = `
            <div class="pedigree-grid-compact">
                <div class="pedigree-generation-col gen0">
                    ${mainDogCard}
                </div>
                
                <div class="pedigree-generation-col gen1">
                    ${fatherCard}
                    ${motherCard}
                </div>
                
                <div class="pedigree-generation-col gen2">
                    ${paternalGrandfatherCard}
                    ${paternalGrandmotherCard}
                    ${maternalGrandfatherCard}
                    ${maternalGrandmotherCard}
                </div>
                
                <div class="pedigree-generation-col gen3">
                    ${paternalGreatGrandfather1Card}
                    ${paternalGreatGrandmother1Card}
                    ${paternalGreatGrandfather2Card}
                    ${paternalGreatGrandmother2Card}
                    ${maternalGreatGrandfather1Card}
                    ${maternalGreatGrandmother1Card}
                    ${maternalGreatGrandfather2Card}
                    ${maternalGreatGrandmother2Card}
                </div>
                
                <div class="pedigree-generation-col gen4">
                    ${paternalGreatGreatGrandfather1Card}
                    ${paternalGreatGreatGrandmother1Card}
                    ${paternalGreatGreatGrandfather2Card}
                    ${paternalGreatGreatGrandmother2Card}
                    ${paternalGreatGreatGrandfather3Card}
                    ${paternalGreatGreatGrandmother3Card}
                    ${paternalGreatGreatGrandfather4Card}
                    ${paternalGreatGreatGrandmother4Card}
                    ${maternalGreatGreatGrandfather1Card}
                    ${maternalGreatGreatGrandmother1Card}
                    ${maternalGreatGreatGrandfather2Card}
                    ${maternalGreatGreatGrandmother2Card}
                    ${maternalGreatGreatGrandfather3Card}
                    ${maternalGreatGreatGrandmother3Card}
                    ${maternalGreatGreatGrandfather4Card}
                    ${maternalGreatGreatGrandmother4Card}
                </div>
            </div>
        `;
        
        container.innerHTML = gridHTML;
        
        this.setupCardClickEvents();
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                if (!this._isActive) return;
                
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return;
                
                const dog = this.getDogById(dogId);
                if (!dog) return;
                
                const relation = card.getAttribute('data-relation') || '';
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    async showDogDetailPopup(dog, relation) {
        if (!this._isActive) return;
        
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const popupHTML = await this.getDogDetailPopupHTML(dog, relation);
        container.innerHTML = popupHTML;
        
        overlay.style.display = 'flex';
        
        const closeButtons = container.querySelectorAll('.btn-close, .popup-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                overlay.style.display = 'none';
            });
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
        
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    showProgress(message) {
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
        } else {
            console.log('Progress:', message);
        }
    }
    
    hideProgress() {
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
        } else {
            console.log('Progress hidden');
        }
    }
    
    showError(message) {
        if (typeof super.showError === 'function') {
            super.showError(message);
        } else {
            console.error('Error:', message);
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        } else {
            console.log('Success:', message);
        }
    }
}

// Export de klasse
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StamboomManager;
} else if (typeof window !== 'undefined') {
    window.StamboomManager = StamboomManager;
}