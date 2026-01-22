/**
 * Stamboom Manager Module
 * Beheert 5-generatie stambomen voor honden - COMPLEET GECORRIGEERDE VERSIE
 * Werkt samen met Supabase services via window object
 */

class StamboomManager extends BaseModule {
    constructor(hondenService, currentLang = 'nl') {
        super();
        this.hondenService = window.hondenService || hondenService;
        this.fotoService = window.fotoService;
        this.currentLang = currentLang;
        this.allDogs = [];
        this.coiCalculator = null;
        
        this.dogPhotosCache = new Map();
        this.dogHasPhotosCache = new Map();
        this.dogThumbnailsCache = new Map();
        this.fullPhotoCache = new Map();
        
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
                waitingData: "Wachten op data...",
                dataLoaded: "Data geladen"
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
                waitingData: "Waiting for data...",
                dataLoaded: "Data loaded"
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
                waitingData: "Warten auf Daten...",
                dataLoaded: "Daten geladen"
            }
        };
        
        this._eventHandlers = {};
        this._isActive = false;
        this._isInitialized = false;
        
        this.setupGlobalEventListeners();
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async initialize() {
        try {
            if (this._isInitialized) {
                console.log('StamboomManager is al geïnitialiseerd');
                return;
            }
            
            console.log('StamboomManager: Initialiseren...');
            this.showProgress(this.t('loadingAllDogs').replace('{loaded}', '0'));
            
            // Wacht even om te zorgen dat het laadscherm zichtbaar is
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Controleer of services beschikbaar zijn
            if (!this.hondenService) {
                console.error('Honden service niet beschikbaar');
                this.showError('Honden service niet beschikbaar');
                this.hideProgress();
                return;
            }
            
            // Gebruik paginatie om ALLE honden te laden
            this.allDogs = await this.loadAllDogsWithPagination();
            
            console.log(`${this.allDogs.length} honden geladen voor stambomen`);
            
            if (typeof COICalculator !== 'undefined') {
                this.coiCalculator = new COICalculator(this.allDogs);
                console.log('COI Calculator geïnitialiseerd vanuit extern bestand');
            } else {
                console.warn('COICalculator klasse niet gevonden, COI berekeningen beperkt');
                this.coiCalculator = null;
            }
            
            this._isActive = true;
            this._isInitialized = true;
            
            console.log('StamboomManager: Initialisatie voltooid');
            this.showSuccess(this.t('dataLoaded'));
            
            // Verberg het laadscherm na 500ms zodat de success message zichtbaar is
            setTimeout(() => {
                this.hideProgress();
            }, 500);
            
        } catch (error) {
            console.error('Fout bij initialiseren StamboomManager:', error);
            this.showError('Kon stamboommanager niet initialiseren: ' + error.message);
            this.hideProgress();
        }
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
                await new Promise(resolve => setTimeout(resolve, 50));
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
        this._isInitialized = false;
        this.removeGlobalEventListeners();
        
        this.dogPhotosCache.clear();
        this.dogHasPhotosCache.clear();
        this.dogThumbnailsCache.clear();
        this.fullPhotoCache.clear();
    }
    
    setupGlobalEventListeners() {
        console.log('StamboomManager: Setup globale event listeners');
        
        const thumbnailClickHandler = async (e) => {
            if (!this._isActive) return;
            
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                
                const photoId = thumbnail.getAttribute('data-photo-id');
                const dogId = thumbnail.getAttribute('data-dog-id');
                const dogName = thumbnail.getAttribute('data-dog-name') || 'Hond';
                
                if (!photoId) {
                    console.warn('Geen photo-id gevonden');
                    return;
                }
                
                try {
                    // Zoek eerst naar een directe img tag in de thumbnail
                    const imgElement = thumbnail.querySelector('img');
                    let photoSrc = null;
                    
                    if (imgElement && imgElement.src) {
                        photoSrc = imgElement.src;
                    }
                    
                    // Als er geen img src is, probeer dan via de service
                    if (!photoSrc && this.fotoService && typeof this.fotoService.getFotoById === 'function') {
                        const fullPhoto = await this.fotoService.getFotoById(photoId);
                        if (fullPhoto && fullPhoto.data) {
                            photoSrc = fullPhoto.data;
                        }
                    }
                    
                    if (photoSrc) {
                        this.showLargePhoto(photoSrc, dogName);
                    } else {
                        console.error('Kon foto niet laden, geen geldige src gevonden');
                        this.showError('Kon foto niet laden');
                    }
                } catch (error) {
                    console.error('Fout bij laden volledige foto:', error);
                    this.showError('Fout bij laden foto: ' + error.message);
                }
            }
        };
        
        const photoCloseHandler = (e) => {
            if (!this._isActive) return;
            
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.closest('.photo-large-close') ||
                e.target.closest('.photo-large-close-btn')) {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            if (e.target.id === 'photoLargeOverlay') {
                const overlay = e.target;
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        };
        
        const escapeKeyHandler = (e) => {
            if (!this._isActive) return;
            
            if (e.key === 'Escape') {
                const photoOverlay = document.getElementById('photoLargeOverlay');
                if (photoOverlay && photoOverlay.style.display !== 'none') {
                    photoOverlay.style.display = 'none';
                    setTimeout(() => {
                        if (photoOverlay.parentNode) {
                            photoOverlay.parentNode.removeChild(photoOverlay);
                        }
                    }, 300);
                    return;
                }
                
                const popupOverlay = document.getElementById('pedigreePopupOverlay');
                if (popupOverlay && popupOverlay.style.display !== 'none') {
                    popupOverlay.style.display = 'none';
                }
            }
        };
        
        // Verwijder eerst eventuele bestaande listeners
        this.removeGlobalEventListeners();
        
        // Voeg nieuwe listeners toe
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
    }
    
    getDogById(id) {
        if (!id || id === 0) return null;
        return this.allDogs.find(dog => dog.id === id);
    }
    
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        
        try {
            // Controleer of de functie bestaat in de service
            if (this.fotoService && typeof this.fotoService.checkFotosExist === 'function') {
                const hasPhotos = await this.fotoService.checkFotosExist(dog.stamboomnr);
                this.dogHasPhotosCache.set(cacheKey, hasPhotos);
                return hasPhotos;
            } else {
                // Als de functie niet bestaat, retourneer false
                console.warn('checkFotosExist functie niet beschikbaar in fotoService');
                this.dogHasPhotosCache.set(cacheKey, false);
                return false;
            }
        } catch (error) {
            console.error('Fout bij checken foto\'s voor hond:', dogId, error);
            this.dogHasPhotosCache.set(cacheKey, false);
            return false;
        }
    }
    
    async getDogThumbnails(dogId, limit = 9) {
        if (!dogId || dogId === 0) return [];
        
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        const cacheKey = `thumbs_${dogId}_${dog.stamboomnr}_${limit}`;
        if (this.dogThumbnailsCache.has(cacheKey)) {
            return this.dogThumbnailsCache.get(cacheKey);
        }
        
        try {
            // Controleer of de functie bestaat in de service
            if (this.fotoService && typeof this.fotoService.getFotoThumbnails === 'function') {
                const thumbnails = await this.fotoService.getFotoThumbnails(dog.stamboomnr, limit);
                
                // Filter lege thumbnails eruit
                const validThumbnails = (thumbnails || []).filter(thumb => 
                    thumb && thumb.thumbnail && thumb.thumbnail.trim() !== ''
                );
                
                this.dogThumbnailsCache.set(cacheKey, validThumbnails);
                return validThumbnails;
            } else {
                // Als de functie niet bestaat, retourneer lege array
                console.warn('getFotoThumbnails functie niet beschikbaar in fotoService');
                this.dogThumbnailsCache.set(cacheKey, []);
                return [];
            }
        } catch (error) {
            console.error('Fout bij ophalen thumbnails voor hond:', dogId, error);
            return [];
        }
    }
    
    async getFullSizeFoto(fotoId) {
        if (!fotoId) return null;
        const cacheKey = `full_${fotoId}`;
        if (this.fullPhotoCache.has(cacheKey)) {
            return this.fullPhotoCache.get(cacheKey);
        }
        try {
            // Controleer of de functie bestaat in de service
            if (this.fotoService && typeof this.fotoService.getFotoById === 'function') {
                const foto = await this.fotoService.getFotoById(fotoId);
                if (foto) {
                    this.fullPhotoCache.set(cacheKey, foto);
                }
                return foto;
            } else {
                // Als de functie niet bestaat, retourneer null
                console.warn('getFotoById functie niet beschikbaar in fotoService');
                return null;
            }
        } catch (error) {
            console.error('Fout bij ophalen volledige foto:', fotoId, error);
            return null;
        }
    }

    calculateCOI(dogId) {
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const vaderId = dog.vader_id || dog.vaderId;
        const moederId = dog.moeder_id || dog.moederId;
        
        if (!vaderId || !moederId) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        if (vaderId === moederId) {
            return { coi6Gen: '25.0', homozygosity6Gen: '25.0', kinship6Gen: '25.0' };
        }
        
        if (this.coiCalculator) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                const kinship = this.calculateAverageKinship(dogId, 6);
                
                return {
                    coi6Gen: (result.coi6Gen || '0.0'),
                    homozygosity6Gen: (result.coiAllGen || '0.0'),
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
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        const coiValues = this.calculateCOI(dog.id);
        const coiColor = this.getCOIColor(coiValues.coi6Gen);
        
        const thumbnails = await this.getDogThumbnails(dog.id, 9);
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        let photosHTML = '';
        if (thumbnails.length > 0) {
            photosHTML = `
                <div class="info-section mb-3">
                    <h6><i class="bi bi-camera me-1"></i> ${this.t('photos')} (${thumbnails.length})</h6>
                    <div class="photos-grid" id="photosGrid${dog.id}">
                        ${thumbnails.map((thumb, index) => `
                            <div class="photo-thumbnail" 
                                 data-photo-id="${thumb.id}" 
                                 data-dog-id="${dog.id}" 
                                 data-dog-name="${dog.naam || ''}"
                                 data-photo-index="${index}"
                                 data-is-thumbnail="true">
                                <img src="${thumb.thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNMzUgNDBDMzUgMzUuNTgyIDM4LjU4MiAzMiA0MyAzMkM0Ny40MTggMzIgNTEgMzUuNTgyIDUxIDQwQzUxIDQ0LjQxOCA0Ny40MTggNDggNDMgNDhDMzguNTgyIDQ4IDM1IDQ0LjQxOCAzNSA0MFpNNzUgMTBDNzUgNS41ODIgNzguNTgyIDIgODMgMkM4Ny40MTggMiA5MSA1LjU4MiA5MSAxMEM5MSAxNC40MTggODcuNDE4IDE4IDgzIDE4Qzc4LjU4MiAxOCA3NSAxNC40MTggNzUgMTBaTTE2IDg0TDQwIDYwTDYwIDgwTDg0IDU2TDg0IDg0SDE2WiIgZmlsbD0iIzk5OTk5OSIvPjwvc3ZnPg=='}" 
                                     alt="${dog.naam || ''} - ${thumb.filename || ''}" 
                                     class="thumbnail-img"
                                     loading="lazy">
                                <div class="photo-hover">
                                    <i class="bi bi-zoom-in"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="photo-hint">
                        <small class="text-muted"><i class="bi bi-info-circle me-1"></i> ${this.t('clickToEnlarge')}</small>
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
                                <div class="info-item info-item-full {
                                    <span class="info-label">${this.t('eyesExplanation')}:</span>
                                    <span class="info-value">${dog.ogenverklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="info-row">
                                <div class="info-item info-item-full {
                                    <span class="info-label">${this.t('dandyWalker')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.dandyWalker, 'dandy')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="info-row">
                                <div class="info-item info-item-full {
                                    <span class="info-label">${this.t('thyroid')}:</span>
                                    <span class="info-value">${this.getHealthBadge(dog.schildklier, 'thyroid')}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierverklaring ? `
                            <div class="info-row">
                                <div class="info-item info-item-full {
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
                </div>
                <div class="popup-footer">
                    <button type="button" class="btn btn-secondary popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    showLargePhoto(photoData, dogName = '') {
        if (!this._isActive) return;
        
        // Verwijder bestaande overlay
        const existingOverlay = document.getElementById('photoLargeOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak een placeholder als photoData niet geldig is
        let actualPhotoData = photoData;
        if (!photoData || photoData === 'null' || photoData === 'undefined') {
            actualPhotoData = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNlZWVlZWUiLz48cGF0aCBkPSJNMjAwIDIwMEMyMDAgMTY1LjkyNSAyMjYuOTI1IDE0OSAyNjUgMTQ5QzMwMy4wNzUgMTQ5IDMzMCAxNjUuOTI1IDMzMCAyMDBDMzMwIDIzNC4wNzUgMzAzLjA3NSAyNTEgMjY1IDI1MUMyMjYuOTI1IDI1MSAyMDAgMjM0LjA3NSAyMDAgMjAwWk00MjAgMTAwQzQyMCA2NS45MjUgNDQ2LjkyNSA0OSA0ODUgNDlDNTIzLjA3NSA0OSA1NTAgNjUuOTI1IDU1MCAxMDBDNTUwIDEzNC4wNzUgNTIzLjA3NSAxNTEgNDg1IDE1MUM0NDYuOTI1IDE1MSA0MjAgMTM0LjA3NSA0MjAgMTAwWk0xMDAgNDQwTDIwMCAzMDVMMzAwIDQwNUw0MjAgMjgxTDQyMCA0NDBIMTAwWiIgZmlsbD0iIzk5OTk5OSIvPjx0ZXh0IHg9IjI1MCIgeT0iNDIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiPkdlZW4gZm90byBiZXNjaWtiYWFyPC90ZXh0Pjwvc3ZnPg==';
        }
        
        const overlayHTML = `
            <div class="photo-large-overlay" id="photoLargeOverlay" style="display: flex;">
                <div class="photo-large-container" id="photoLargeContainer">
                    <div class="photo-large-header">
                        <button type="button" class="btn-close btn-close-white photo-large-close" aria-label="Sluiten"></button>
                    </div>
                    <div class="photo-large-content">
                        <img src="${actualPhotoData}" 
                             alt="${dogName || 'Foto'}" 
                             class="photo-large-img"
                             id="photoLargeImg"
                             style="max-width: 90vw; max-height: 80vh; object-fit: contain;">
                    </div>
                    <div class="photo-large-footer">
                        <button type="button" class="btn btn-secondary photo-large-close-btn">
                            <i class="bi bi-x-circle me-1"></i> ${this.t('closePhoto')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Voeg event listener toe voor sluiten
        const overlay = document.getElementById('photoLargeOverlay');
        const closeBtn = overlay.querySelector('.photo-large-close');
        const closeBtn2 = overlay.querySelector('.photo-large-close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            });
        }
        
        if (closeBtn2) {
            closeBtn2.addEventListener('click', () => {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            });
        }
        
        // Sluit bij klik op overlay achtergrond
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        });
        
        // Sluit met Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    async showPedigree(dog) {
        if (!this._isActive || !this._isInitialized) {
            console.warn('StamboomManager niet geïnitialiseerd, initialiseer eerst');
            this.showError('Stamboom manager niet geladen. Probeer het opnieuw.');
            return;
        }
        
        if (!dog || !dog.id) {
            console.error('Geen geldige hond om stamboom te tonen');
            this.showError('Geen geldige hond geselecteerd');
            return;
        }
        
        console.log('Toon stamboom voor hond:', dog.naam, 'ID:', dog.id);
        
        // Toon laadscherm
        this.showProgress(this.t('generatingPedigree'));
        
        try {
            // Maak modal aan als deze nog niet bestaat
            if (!document.getElementById('pedigreeModal')) {
                this.createPedigreeModal();
            }
            
            const pedigreeTree = this.buildPedigreeTree(dog.id);
            if (!pedigreeTree) {
                this.showError("Kon stamboom niet genereren");
                this.hideProgress();
                return;
            }
            
            const title = this.t('pedigreeTitle').replace('{name}', dog.naam || this.t('unknown'));
            document.getElementById('pedigreeModalLabel').textContent = title;
            
            await this.renderCompactPedigree(pedigreeTree);
            
            // Verberg laadscherm
            this.hideProgress();
            
            // Toon modal
            const modalElement = document.getElementById('pedigreeModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Cleanup bij sluiten modal
                modalElement.addEventListener('hidden.bs.modal', () => {
                    const popupOverlay = document.getElementById('pedigreePopupOverlay');
                    if (popupOverlay) {
                        popupOverlay.style.display = 'none';
                    }
                    
                    const photoOverlay = document.getElementById('photoLargeOverlay');
                    if (photoOverlay) {
                        photoOverlay.style.display = 'none';
                        setTimeout(() => {
                            if (photoOverlay.parentNode) {
                                photoOverlay.parentNode.removeChild(photoOverlay);
                            }
                        }, 300);
                    }
                });
            }
            
        } catch (error) {
            console.error('Fout bij tonen stamboom:', error);
            this.showError('Fout bij genereren stamboom: ' + error.message);
            this.hideProgress();
        }
    }
    
    createPedigreeModal() {
        // Verwijder bestaande modal als die er is
        const existingModal = document.getElementById('pedigreeModal');
        if (existingModal) {
            existingModal.remove();
        }
        
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
    }
    
    async renderCompactPedigree(pedigreeTree) {
        const container = document.getElementById('pedigreeContainer');
        if (!container) {
            console.error('Pedigree container niet gevonden');
            return;
        }
        
        // Toon laadindicator
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">${this.t('generatingPedigree')}</span>
                </div>
                <p class="mt-3">${this.t('generatingPedigree')}</p>
            </div>
        `;
        
        try {
            // Genereer alle cards asynchroon
            const cards = await Promise.all([
                this.getDogCompactCardHTML(pedigreeTree.mainDog, this.t('mainDog'), true, 0),
                this.getDogCompactCardHTML(pedigreeTree.father, this.t('father'), false, 1),
                this.getDogCompactCardHTML(pedigreeTree.mother, this.t('mother'), false, 1),
                this.getDogCompactCardHTML(pedigreeTree.paternalGrandfather, this.t('grandfather'), false, 2),
                this.getDogCompactCardHTML(pedigreeTree.paternalGrandmother, this.t('grandmother'), false, 2),
                this.getDogCompactCardHTML(pedigreeTree.maternalGrandfather, this.t('grandfather'), false, 2),
                this.getDogCompactCardHTML(pedigreeTree.maternalGrandmother, this.t('grandmother'), false, 2),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfather'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmother'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfather'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmother'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfather'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmother'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfather'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmother'), false, 3),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather1, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother1, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather2, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother2, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather3, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother3, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandfather4, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.paternalGreatGreatGrandmother4, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather1, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother1, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather2, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother2, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather3, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother3, this.t('greatGreatGrandmother'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandfather4, this.t('greatGreatGrandfather'), false, 4),
                this.getDogCompactCardHTML(pedigreeTree.maternalGreatGreatGrandmother4, this.t('greatGreatGrandmother'), false, 4)
            ]);
            
            const gridHTML = `
                <div class="pedigree-grid-compact">
                    <div class="pedigree-generation-col gen0">
                        ${cards[0]}
                    </div>
                    
                    <div class="pedigree-generation-col gen1">
                        ${cards[1]}
                        ${cards[2]}
                    </div>
                    
                    <div class="pedigree-generation-col gen2">
                        ${cards[3]}
                        ${cards[4]}
                        ${cards[5]}
                        ${cards[6]}
                    </div>
                    
                    <div class="pedigree-generation-col gen3">
                        ${cards[7]}
                        ${cards[8]}
                        ${cards[9]}
                        ${cards[10]}
                        ${cards[11]}
                        ${cards[12]}
                        ${cards[13]}
                        ${cards[14]}
                    </div>
                    
                    <div class="pedigree-generation-col gen4">
                        ${cards[15]}
                        ${cards[16]}
                        ${cards[17]}
                        ${cards[18]}
                        ${cards[19]}
                        ${cards[20]}
                        ${cards[21]}
                        ${cards[22]}
                        ${cards[23]}
                        ${cards[24]}
                        ${cards[25]}
                        ${cards[26]}
                        ${cards[27]}
                        ${cards[28]}
                        ${cards[29]}
                        ${cards[30]}
                    </div>
                </div>
            `;
            
            container.innerHTML = gridHTML;
            this.setupCardClickEvents();
            
        } catch (error) {
            console.error('Fout bij renderen pedigree:', error);
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Fout bij genereren stamboom: ${error.message}
                    </div>
                    <button class="btn btn-primary mt-3" onclick="window.location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i> Probeer opnieuw
                    </button>
                </div>
            `;
        }
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                if (!this._isActive) return;
                
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0) return;
                
                const dog = this.getDogById(dogId);
                if (!dog) {
                    console.warn('Hond niet gevonden met ID:', dogId);
                    return;
                }
                
                const relation = card.getAttribute('data-relation') || '';
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    async showDogDetailPopup(dog, relation) {
        if (!this._isActive) return;
        
        const overlay = document.getElementById('pedigreePopupOverlay');
        const container = document.getElementById('pedigreePopupContainer');
        
        if (!overlay || !container) {
            console.error('Popup overlay of container niet gevonden');
            return;
        }
        
        // Toon laadscherm
        overlay.style.display = 'flex';
        container.innerHTML = `
            <div class="dog-detail-popup">
                <div class="popup-header">
                    <h5 class="popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${dog.naam || this.t('unknown')}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="Sluiten"></button>
                </div>
                <div class="popup-body text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Laden...</span>
                    </div>
                    <p class="mt-3">Details laden...</p>
                </div>
            </div>
        `;
        
        try {
            // Genereer popup content
            const popupHTML = await this.getDogDetailPopupHTML(dog, relation);
            container.innerHTML = popupHTML;
            
            // Setup close buttons
            const closeButtons = container.querySelectorAll('.btn-close, .popup-close-btn');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    overlay.style.display = 'none';
                });
            });
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.style.display = 'none';
                }
            });
            
            // Close with Escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    overlay.style.display = 'none';
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            
        } catch (error) {
            console.error('Fout bij tonen hond details:', error);
            container.innerHTML = `
                <div class="dog-detail-popup">
                    <div class="popup-header">
                        <h5 class="popup-title">
                            <i class="bi bi-exclamation-triangle me-2 text-warning"></i>
                            Fout bij laden
                        </h5>
                        <button type="button" class="btn-close btn-close-white" aria-label="Sluiten"></button>
                    </div>
                    <div class="popup-body">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            Kon details niet laden: ${error.message}
                        </div>
                        <div class="text-center mt-3">
                            <button type="button" class="btn btn-secondary popup-close-btn">
                                <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Setup close button
            const closeBtn = container.querySelector('.popup-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    overlay.style.display = 'none';
                });
            }
        }
    }
    
    showProgress(message) {
        console.log('Progress:', message);
        if (typeof super.showProgress === 'function') {
            super.showProgress(message);
        } else {
            // Fallback voor als BaseModule.showProgress niet bestaat
            const existingOverlay = document.getElementById('progressOverlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            const overlayHTML = `
                <div id="progressOverlay" class="progress-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div class="text-center text-white">
                        <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                            <span class="visually-hidden">Laden...</span>
                        </div>
                        <p class="mt-3">${message}</p>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', overlayHTML);
        }
    }
    
    hideProgress() {
        console.log('Verberg progress');
        if (typeof super.hideProgress === 'function') {
            super.hideProgress();
        } else {
            // Fallback
            const overlay = document.getElementById('progressOverlay');
            if (overlay) {
                overlay.style.transition = 'opacity 0.3s';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        }
    }
    
    showError(message) {
        console.error('Error:', message);
        if (typeof super.showError === 'function') {
            super.showError(message);
        } else {
            alert(message);
        }
    }
    
    showSuccess(message) {
        console.log('Success:', message);
        if (typeof super.showSuccess === 'function') {
            super.showSuccess(message);
        }
    }
}

// Export de klasse
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StamboomManager;
} else if (typeof window !== 'undefined') {
    window.StamboomManager = StamboomManager;
}