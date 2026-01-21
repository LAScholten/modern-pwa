/**
 * Reu en Teef Combinatie Module - HOOFDBESTAND
 * Voor het maken van fokplannen met specifieke reu en teef
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = window.hondenService; // VERANDERD: gebruik window object
        this.auth = window.auth; // VERANDERD: gebruik window object
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.hondenCache = new Map();
        
        // Foto caches - IDENTIEK AAN STAMBOOMMANAGER
        this.dogPhotosCache = new Map();
        this.dogHasPhotosCache = new Map();
        this.dogThumbnailsCache = new Map();
        this.fullPhotoCache = new Map();
        
        // COI Calculator instance - LAAT INITIALISEREN
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        // Unieke ID's voor isolatie
        this.uniquePrefix = 'rtc-'; // ReuTeefCombinatie prefix
        this.isolatedEventListeners = new Map();
        
        // Stamboom module referentie
        this.stamboomModule = null;
        
        // Vertalingen - UITGEBREID MET COI LABELS
        this.translations = {
            nl: {
                title: "Reu en Teef Combinatie",
                description: "Selecteer een specifieke reu en teef voor uw fokplan",
                mother: "Teef (Moeder)",
                selectMother: "Selecteer een teef...",
                father: "Reu (Vader)",
                selectFather: "Selecteer een reu...",
                searchPlaceholder: "Typ om te zoeken...",
                back: "Terug",
                showFuturePuppy: "Toon Toekomstige Pup Stamboom",
                pedigreeTitle: "Toekomstige Pup Stamboom",
                close: "Sluiten",
                print: "Afdrukken",
                loading: "Laden...",
                noDogFound: "Geen hond gevonden",
                unknownBreed: "Onbekend ras",
                genderTeef: "Teef",
                genderReu: "Reu",
                kennel: "Kennel:",
                pedigreeNumber: "Stamboomnr:",
                birthDate: "Geboortedatum:",
                healthInfo: "Gezondheidsinformatie",
                color: "Vachtkleur:",
                searchByName: "Zoek op naam of kennel",
                dogDetails: "Hond details",
                selectDogFirst: "Selecteer eerst een reu én een teef",
                loadingPedigree: "Stamboom wordt geladen...",
                unknownAncestor: "Onbekend",
                fatherLabel: "Vader",
                motherLabel: "Moeder",
                grandfatherLabel: "Grootvader",
                grandmotherLabel: "Grootmoeder",
                greatGrandfatherLabel: "Overgrootvader",
                greatGrandmotherLabel: "Overgrootmoeder",
                greatGreatGrandfatherLabel: "Over-overgrootvader",
                greatGreatGrandmotherLabel: "Over-overgrootmoeder",
                typeToSearch: "Begin met typen om te zoeken",
                noDogsFound: "Geen honden gevonden",
                found: "gevonden",
                futurePuppyName: "Toekomstige Pup",
                futurePuppyDescription: "Voorspelling van combinatie {reu} × {teef}",
                futurePuppyTitle: "Stamboom voor toekomstige pup uit combinatie {reu} × {teef}",
                predictedPedigree: "Voorspelde stamboom",
                combinedParents: "Combinatie ouders",
                // COI labels - EXACT ZOALS STAMBOOMMANAGER
                coi6Gen: "COI 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                closePopup: "Sluiten",
                predictedCoi: "Voorspelde Inteeltcoëfficiënt",
                futurePuppyInfo: "Toekomstige Pup Informatie",
                clickForDetails: "Klik voor details",
                healthInLine: "Gezondheid in de lijn 6 generaties",
                healthCategory: "Gezondheidscategorie",
                motherLine: "Moederlijn",
                fatherLine: "Vaderlijn",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD niet bekend",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED niet bekend",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL niet bekend",
                eyesFree: "Ogen vrij",
                eyesDist: "Ogen Dist",
                eyesOther: "Ogen overig",
                eyesUnknown: "Ogen niet bekend",
                dwlmDnaFree: "Dandy Walker (DNA) vrij",
                dwlmParentsFree: "Dandy Walker (ouders) vrij",
                dwlmUnknown: "Dandy Walker niet bekend",
                thyroidTested: "Schildklier getest",
                thyroidUnknown: "Schildklier niet bekend",
                occurrences: "Aantal keer",
                // STAMBOOMMANAGER VERTALINGEN - IDENTIEK
                pedigreeTitle: "Stamboom van {name}",
                pedigree4Gen: "5-generatie stamboom",
                generatingPedigree: "Stamboom genereren...",
                noData: "Geen gegevens",
                unknown: "Onbekend",
                currentDog: "Huidige hond",
                mainDog: "Hoofdhond",
                parents: "Ouders",
                grandparents: "Grootouders",
                greatGrandparents: "Overgrootouders",
                greatGreatGrandparents: "Overovergrootouders",
                paternal: "Paternaal",
                maternal: "Maternaal",
                remarks: "Opmerkingen",
                noRemarks: "Geen opmerkingen",
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                male: "Reu",
                female: "Teef",
                breed: "Ras",
                gender: "Geslacht",
                coatColor: "Vachtkleur",
                country: "Land",
                zipCode: "Postcode",
                deathDate: "Overlijdensdatum",
                hipDysplasia: "Heupdysplasie",
                elbowDysplasia: "Elleboogdysplasie",
                patellaLuxation: "Patella Luxatie",
                eyes: "Ogen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schildklier",
                eyesExplanation: "Verklaring ogen",
                thyroidExplanation: "Toelichting schildklier",
                name: "Naam"
            },
            en: {
                title: "Male and Female Combination",
                description: "Select a specific male and female for your breeding plan",
                mother: "Female (Mother)",
                selectMother: "Select a female...",
                father: "Male (Father)",
                selectFather: "Select a male...",
                searchPlaceholder: "Type to search...",
                back: "Back",
                showFuturePuppy: "Show Future Puppy Pedigree",
                pedigreeTitle: "Future Puppy Pedigree",
                close: "Close",
                print: "Print",
                loading: "Loading...",
                noDogFound: "No dog found",
                unknownBreed: "Unknown breed",
                genderTeef: "Female",
                genderReu: "Male",
                kennel: "Kennel:",
                pedigreeNumber: "Pedigree nr:",
                birthDate: "Birth date:",
                healthInfo: "Health information",
                color: "Color:",
                searchByName: "Search by name or kennel",
                dogDetails: "Dog details",
                selectDogFirst: "Select both a male and a female first",
                loadingPedigree: "Loading pedigree...",
                unknownAncestor: "Unknown",
                fatherLabel: "Father",
                motherLabel: "Mother",
                grandfatherLabel: "Grandfather",
                grandmotherLabel: "Grandmother",
                greatGrandfatherLabel: "Great-grandfather",
                greatGrandmotherLabel: "Great-grandmother",
                greatGreatGrandfatherLabel: "Great-great-grandfather",
                greatGreatGrandmotherLabel: "Great-great-grandmother",
                typeToSearch: "Start typing to search",
                noDogsFound: "No dogs found",
                found: "found",
                futurePuppyName: "Future Puppy",
                futurePuppyDescription: "Prediction of combination {reu} × {teef}",
                futurePuppyTitle: "Pedigree for future puppy from combination {reu} × {teef}",
                predictedPedigree: "Predicted pedigree",
                combinedParents: "Combination parents",
                // COI labels - EXACT ZOALS STAMBOOMMANAGER
                coi6Gen: "COI 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                closePopup: "Close",
                predictedCoi: "Predicted Inbreeding Coefficient",
                futurePuppyInfo: "Future Puppy Information",
                clickForDetails: "Click for details",
                healthInLine: "Health in the line 6 generations",
                healthCategory: "Health category",
                motherLine: "Mother line",
                fatherLine: "Father line",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unknown",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unknown",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unknown",
                eyesFree: "Eyes free",
                eyesDist: "Eyes Dist",
                eyesOther: "Eyes other",
                eyesUnknown: "Eyes unknown",
                dwlmDnaFree: "Dandy Walker (DNA) free",
                dwlmParentsFree: "Dandy Walker (parents) free",
                dwlmUnknown: "Dandy Walker unknown",
                thyroidTested: "Thyroid tested",
                thyroidUnknown: "Thyroid unknown",
                occurrences: "Occurrences",
                // STAMBOOMMANAGER VERTALINGEN - IDENTIEK
                pedigreeTitle: "Pedigree of {name}",
                pedigree4Gen: "5-generation pedigree",
                generatingPedigree: "Generating pedigree...",
                noData: "No data",
                unknown: "Unknown",
                currentDog: "Current Dog",
                mainDog: "Main Dog",
                parents: "Parents",
                grandparents: "Grandparents",
                greatGrandparents: "Great Grandparents",
                greatGreatGrandparents: "Great-great-grandparents",
                paternal: "Paternal",
                maternal: "Maternal",
                remarks: "Remarks",
                noRemarks: "No remarks",
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                male: "Male",
                female: "Female",
                breed: "Breed",
                gender: "Gender",
                coatColor: "Coat color",
                country: "Country",
                zipCode: "Zip code",
                deathDate: "Death date",
                hipDysplasia: "Hip Dysplasia",
                elbowDysplasia: "Elbow Dysplasia",
                patellaLuxation: "Patella Luxation",
                eyes: "Eyes",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Thyroid",
                eyesExplanation: "Eye explanation",
                thyroidExplanation: "Thyroid explanation",
                name: "Name"
            },
            de: {
                title: "Rüde und Hündin Kombination",
                description: "Wählen Sie einen bestimmten Rüden und eine Hündin für Ihren Zuchtplan",
                mother: "Hündin (Mutter)",
                selectMother: "Wählen Sie eine Hündin...",
                father: "Rüde (Vater)",
                selectFather: "Wählen Sie einen Rüden...",
                searchPlaceholder: "Tippen Sie zum Suchen...",
                back: "Zurück",
                showFuturePuppy: "Zukünftigen Welpen-Ahnentafel Zeigen",
                pedigreeTitle: "Zukünftiger Welpen-Ahnentafel",
                close: "Schließen",
                print: "Drucken",
                loading: "Laden...",
                noDogFound: "Kein Hund gefunden",
                unknownBreed: "Unbekannte Rasse",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                kennel: "Zwingername:",
                pedigreeNumber: "Stammbuchnr:",
                birthDate: "Geburtsdatum:",
                healthInfo: "Health information",
                color: "Fellfarbe:",
                searchByName: "Suche nach Name oder Zwingername",
                dogDetails: "Hund Details",
                selectDogFirst: "Wählen Sie zuerst einen Rüden en eine Hündin",
                loadingPedigree: "Stammbaum wird geladen...",
                unknownAncestor: "Unbekannt",
                fatherLabel: "Vater",
                motherLabel: "Mutter",
                grandfatherLabel: "Großvater",
                grandmotherLabel: "Großmutter",
                greatGrandfatherLabel: "Urgroßvater",
                greatGrandmotherLabel: "Urgroßmutter",
                greatGreatGrandfatherLabel: "Ur-urgroßvater",
                greatGreatGrandmotherLabel: "Ur-urgroßmutter",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                noDogsFound: "Keine Hunde gefunden",
                found: "gefunden",
                futurePuppyName: "Zukünftiger Welpe",
                futurePuppyDescription: "Vorhersage der Kombination {reu} × {teef}",
                futurePuppyTitle: "Ahnentafel für zukünftigen Welpen aus Kombination {reu} × {teef}",
                predictedPedigree: "Vorhergesagter Ahnentafel",
                combinedParents: "Kombination Eltern",
                // COI labels - EXACT ZOALS STAMBOOMMANAGER
                coi6Gen: "COI 6 Gen",
                homozygosity6Gen: "Homozygotie 6 Gen",
                kinship6Gen: "Kinship 6 Gen",
                closePopup: "Schließen",
                predictedCoi: "Vorhergesagter Inzuchtkoeffizient",
                futurePuppyInfo: "Zukünftiger Welpen-Informationen",
                clickForDetails: "Klicken für Details",
                healthInLine: "Gesundheit in der Linie 6 Generationen",
                healthCategory: "Gesundheitskategorie",
                motherLine: "Mutterlinie",
                fatherLine: "Vaterlinie",
                hdA: "HD A",
                hdB: "HD B",
                hdC: "HD C",
                hdD: "HD D",
                hdE: "HD E",
                hdUnknown: "HD unbekannt",
                ed0: "ED 0",
                ed1: "ED 1",
                ed2: "ED 2",
                ed3: "ED 3",
                edUnknown: "ED unbekannt",
                pl0: "PL 0",
                pl1: "PL 1",
                pl2: "PL 2",
                pl3: "PL 3",
                plUnknown: "PL unbekannt",
                eyesFree: "Augen frei",
                eyesDist: "Augen Dist",
                eyesOther: "Augen sonstige",
                eyesUnknown: "Augen unbekannt",
                dwlmDnaFree: "Dandy Walker (DNA) frei",
                dwlmParentsFree: "Dandy Walker (Eltern) frei",
                dwlmUnknown: "Dandy Walker unbekannt",
                thyroidTested: "Schilddrüse getestet",
                thyroidUnknown: "Schilddrüse unbekannt",
                occurrences: "Anzahl Mal",
                // STAMBOOMMANAGER VERTALINGEN - IDENTIEK
                pedigreeTitle: "Ahnentafel von {name}",
                pedigree4Gen: "5-Generationen Ahnentafel",
                generatingPedigree: "Ahnentafel wird generiert...",
                noData: "Keine Daten",
                unknown: "Unbekannt",
                currentDog: "Aktueller Hund",
                mainDog: "Haupt-Hund",
                parents: "Eltern",
                grandparents: "Großeltern",
                greatGrandparents: "Urgroßeltern",
                greatGreatGrandparents: "Ur-urgroßeltern",
                paternal: "Väterlich",
                maternal: "Mütterlich",
                remarks: "Bemerkungen",
                noRemarks: "Keine Bemerkungen",
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbaar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                male: "Rüde",
                female: "Hündin",
                breed: "Rasse",
                gender: "Geschlecht",
                coatColor: "Fellfarbe",
                country: "Land",
                zipCode: "Postleitzahl",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasie: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                eyesExplanation: "Augenerklärung",
                thyroidExplanation: "Schilddrüse Erklärung",
                name: "Name"
            }
        };
        
        // Globale event handlers voor foto's
        this._eventHandlers = {};
        this._isActive = true;
        this.setupGlobalEventListeners();
    }
    
    // VERWIJDERD: injectDependencies() functie niet meer nodig
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
        // Vervang parameters in tekst
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
    // ==================== FOTO CACHE METHODES ====================
    
    async checkDogHasPhotos(dogId) {
        if (!dogId || dogId === 0) return false;
        const dog = this.getDogById(dogId);
        if (!dog || !dog.stamboomnr) return false;
        
        // Controleer cache
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        
        try {
            // ALTERNATIEF: Probeer via fotoService als beschikbaar
            if (window.fotoService && typeof window.fotoService.getFotoThumbnails === 'function') {
                const thumbnails = await window.fotoService.getFotoThumbnails(dog.stamboomnr, 1);
                const hasPhotos = thumbnails && thumbnails.length > 0;
                this.dogHasPhotosCache.set(cacheKey, hasPhotos);
                return hasPhotos;
            }
            
            // Als functie niet beschikbaar is, retourneer false
            this.dogHasPhotosCache.set(cacheKey, false);
            return false;
            
        } catch (error) {
            console.error('Fout bij checken foto\'s voor hond:', dogId, error);
            // Cache false om herhaalde fouten te voorkomen
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
            // GEBRUIK window.fotoService in plaats van window.hondenService
            if (window.fotoService && typeof window.fotoService.getFotoThumbnails === 'function') {
                const thumbnails = await window.fotoService.getFotoThumbnails(dog.stamboomnr, limit);
                this.dogThumbnailsCache.set(cacheKey, thumbnails || []);
                return thumbnails || [];
            } else {
                console.warn(`getFotoThumbnails functie niet beschikbaar via fotoService`);
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
            // GEBRUIK window.fotoService in plaats van this.db
            const foto = await window.fotoService.getFotoById(fotoId);
            if (foto) {
                this.fullPhotoCache.set(cacheKey, foto);
            }
            return foto;
        } catch (error) {
            console.error('Fout bij ophalen volledige foto:', fotoId, error);
            return null;
        }
    }
    
    // ==================== GLOBALE EVENT LISTENERS ====================
    
    setupGlobalEventListeners() {
        // Event delegation voor foto thumbnail clicks
        const thumbnailClickHandler = async (e) => {
            if (!this._isActive) return;
            
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                
                const photoId = thumbnail.getAttribute('data-photo-id');
                const isThumbnail = thumbnail.getAttribute('data-is-thumbnail') === 'true';
                
                if (!photoId) return;
                
                try {
                    // Laad pas de volledige foto als er op geklikt wordt
                    const fullPhoto = await this.getFullSizeFoto(photoId);
                    
                    if (fullPhoto && fullPhoto.data) {
                        // Haal hondnaam op uit de popup
                        const popupTitle = document.querySelector('.rtc-popup-title, .popup-title');
                        let dogName = '';
                        if (popupTitle) {
                            dogName = popupTitle.textContent.trim();
                            dogName = dogName.replace(/^[^a-zA-Z]*/, '').trim();
                        }
                        
                        this.showLargePhoto(fullPhoto.data, dogName);
                    } else {
                        console.error('Kon volledige foto niet laden:', photoId);
                        // Probeer de thumbnail als fallback
                        const imgElement = thumbnail.querySelector('img');
                        if (imgElement && imgElement.src) {
                            this.showLargePhoto(imgElement.src, dogName);
                        }
                    }
                } catch (error) {
                    console.error('Fout bij laden volledige foto:', error);
                }
            }
        };
        
        // Event delegation voor grote foto sluitknoppen
        const photoCloseHandler = (e) => {
            if (!this._isActive) return;
            
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.closest('.photo-large-close') ||
                e.target.closest('.photo-large-close-btn')) {
                const overlay = document.getElementById('rtcPhotoLargeOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            // Klik buiten de grote foto om te sluiten
            if (e.target.id === 'rtcPhotoLargeOverlay') {
                const overlay = e.target;
                overlay.style.display = 'none';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        };
        
        // Escape key handler voor foto overlays
        const escapeKeyHandler = (e) => {
            if (!this._isActive) return;
            
            if (e.key === 'Escape') {
                // Sluit grote foto overlay
                const photoOverlay = document.getElementById('rtcPhotoLargeOverlay');
                if (photoOverlay && photoOverlay.style.display !== 'none') {
                    photoOverlay.style.display = 'none';
                    setTimeout(() => {
                        if (photoOverlay.parentNode) {
                            photoOverlay.parentNode.removeChild(photoOverlay);
                        }
                    }, 300);
                    return;
                }
                
                // Sluit detail popup overlay
                const popupOverlay = document.getElementById('rtcPedigreePopupOverlay');
                if (popupOverlay && popupOverlay.style.display !== 'none') {
                    popupOverlay.style.display = 'none';
                }
            }
        };
        
        // Voeg event listeners toe en sla referenties op
        document.addEventListener('click', thumbnailClickHandler);
        document.addEventListener('click', photoCloseHandler);
        document.addEventListener('keydown', escapeKeyHandler);
        
        // Sla referenties op voor cleanup
        this._eventHandlers.thumbnailClick = thumbnailClickHandler;
        this._eventHandlers.photoClose = photoCloseHandler;
        this._eventHandlers.escapeKey = escapeKeyHandler;
    }
    
    removeGlobalEventListeners() {
        // Verwijder alle event listeners die we hebben toegevoegd
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
    
    showLargePhoto(photoData, dogName = '') {
        if (!this._isActive) return;
        
        console.log('Toon grote foto:', photoData.substring(0, 100) + '...');
        
        // Verwijder bestaande overlay
        const existingOverlay = document.getElementById('rtcPhotoLargeOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak nieuwe overlay
        const overlayHTML = `
            <div class="photo-large-overlay" id="rtcPhotoLargeOverlay" style="display: flex;">
                <div class="photo-large-container" id="rtcPhotoLargeContainer">
                    <div class="photo-large-header">
                        <button type="button" class="btn-close btn-close-white photo-large-close"></button>
                    </div>
                    <div class="photo-large-content">
                        <img src="${photoData}" 
                             alt="${dogName || 'Foto'}" 
                             class="photo-large-img"
                             id="rtcPhotoLargeImg"
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
        
        // Sluit met Escape key (we gebruiken de globale handler)
        const overlay = document.getElementById('rtcPhotoLargeOverlay');
        if (overlay) {
            overlay.addEventListener('animationend', function handler() {
                if (overlay.style.display === 'none') {
                    overlay.removeEventListener('animationend', handler);
                }
            });
        }
    }
    
    // ==================== HOOFDFUNCTIES ====================
    
    async loadContent() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        // Reset geselecteerde honden
        this.selectedTeef = null;
        this.selectedReu = null;
        this.hondenCache.clear();
        
        // Laad honden data - GEBRUIK GEPAGINEERDE METHODE
        await this.loadAllHondenPaginated();
        
        // NIET hier initialiseren, maar pas bij berekening
        this.coiCalculator = null;
        this.coiCalculatorReady = false;
        this.coiCalculationInProgress = false;
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                <strong>${t('searchByName')}</strong><br>
                ${t('description')}
            </div>
            
            <h5 class="mb-4">
                <i class="bi bi-gender-male-female text-purple"></i> ${t('title')}
            </h5>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-female text-pink me-2"></i>${t('mother')}
                            </h6>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectMother')}
                                </label>
                                <div class="autocomplete-container">
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control search-input border-start-0 ps-0" 
                                               id="teefSearch" 
                                               placeholder="${t('searchPlaceholder')}"
                                               autocomplete="off">
                                    </div>
                                    <div class="autocomplete-dropdown" id="teefDropdown"></div>
                                </div>
                                <div class="form-text text-muted small mt-2">
                                    <i class="bi bi-info-circle me-1"></i> ${t('typeToSearch')}
                                </div>
                            </div>
                            
                            <!-- Zoekresultaten container -->
                            <div class="search-results-container flex-grow-1 mt-2" id="teefSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="teefDetails" class="d-none">
                                <!-- Teef details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">
                                <i class="bi bi-gender-male text-blue me-2"></i>${t('father')}
                            </h6>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="mb-3">
                                <label class="form-label">
                                    <i class="bi bi-search me-1"></i>${t('selectFather')}
                                </label>
                                <div class="autocomplete-container">
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-end-0">
                                            <i class="bi bi-person text-muted"></i>
                                        </span>
                                        <input type="text" 
                                               class="form-control search-input border-start-0 ps-0" 
                                               id="reuSearch" 
                                               placeholder="${t('searchPlaceholder')}"
                                               autocomplete="off">
                                    </div>
                                    <div class="autocomplete-dropdown" id="reuDropdown"></div>
                                </div>
                                <div class="form-text text-muted small mt-2">
                                    <i class="bi bi-info-circle me-1"></i> ${t('typeToSearch')}
                                </div>
                            </div>
                            
                            <!-- Zoekresultaten container -->
                            <div class="search-results-container flex-grow-1 mt-2" id="reuSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="reuDetails" class="d-none">
                                <!-- Reu details komen hier -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // ALLEEN PAARSE KNOPS
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        // Voeg CSS toe
        this.addStyles();
        
        // Event handlers
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('showPedigreeBtn').addEventListener('click', () => {
            this.showFuturePuppyPedigree();
        });
        
        // Setup autocomplete voor teef - ALLEEN TEVEN
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teven', (hond) => {
            this.selectTeef(hond);
        }, 'female');
        
        // Setup autocomplete voor reu - ALLEEN REUEN
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        }, 'male');
        
        // Update button states
        this.updateButtonStates();
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
                /* CONSISTENTE ZOEKSTIJLEN */
                .search-input {
                    font-size: 1.1rem;
                    padding: 10px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #6f42c1;
                    box-shadow: 0 0 0 0.25rem rgba(111, 66, 193, 0.25);
                }
                
                .search-results-container {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    overflow-y: auto;
                    min-height: 200px;
                    max-height: 300px;
                }
                
                /* AUTCOMPLETE DROPDOWN */
                .autocomplete-container {
                    position: relative;
                }
                
                .autocomplete-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #dee2e6;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1050;
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                    display: none;
                }
                
                /* HOND RESULTAAT ITEMS */
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    transform: translateX(3px);
                }
                
                .dog-result-item.selected {
                    background-color: #f0e6ff;
                    border-left: 4px solid #6f42c1;
                }
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 8px;
                }
                
                .dog-kennel-line {
                    font-size: 0.95rem;
                    color: #6c757d;
                    margin-bottom: 8px;
                    font-style: italic;
                }
                
                .dog-details-line {
                    color: #495057;
                    font-size: 0.95rem;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    align-items: center;
                }
                
                .search-stats {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 12px;
                    padding: 8px 15px;
                    border-bottom: 1px solid #dee2e6;
                    background: #f8f9fa;
                }
                
                /* DETAILS CARD STYLES */
                .dog-details-card {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    padding: 20px;
                    margin-top: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .dog-details-header {
                    margin-bottom: 20px;
                }
                
                .dog-details-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #6f42c1;
                    margin-bottom: 5px;
                }
                
                .dog-details-subtitle {
                    color: #6c757d;
                    font-size: 1rem;
                }
                
                .dog-details-info {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                    margin-bottom: 15px;
                }
                
                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .info-item i {
                    color: #6f42c1;
                }
                
                .dog-details-row {
                    margin-bottom: 15px;
                }
                
                .dog-details-label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 5px;
                }
                
                .dog-details-value {
                    color: #212529;
                }
                
                /* HEALTH ANALYSIS TABLE STYLES */
                .health-analysis-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                    font-size: 0.85rem;
                }
                
                .health-analysis-table th {
                    background-color: #f8f9fa;
                    padding: 10px 8px;
                    text-align: center;
                    border: 1px solid #dee2e6;
                    font-weight: 600;
                    color: #495057;
                }
                
                .health-analysis-table td {
                    padding: 8px;
                    border: 1px solid #dee2e6;
                    text-align: center;
                    vertical-align: middle;
                }
                
                .health-category {
                    text-align: left !important;
                    font-weight: 500;
                    padding-left: 12px;
                    background-color: #f8f9fa;
                }
                
                .mother-count {
                    background-color: #fff3cd;
                    color: #856404;
                }
                
                .father-count {
                    background-color: #d1ecf1;
                    color: #0c5460;
                }
                
                .count-high {
                    font-weight: bold;
                    background-color: #f8d7da !important;
                    color: #721c24 !important;
                }
                
                .count-good {
                    font-weight: bold;
                    background-color: #d4edda !important;
                    color: #155724 !important;
                }
                
                /* RESPONSIVE STYLES */
                @media (max-width: 768px) {
                    .search-input {
                        font-size: 1rem;
                        padding: 8px 12px;
                    }
                    
                    .dog-result-item {
                        padding: 10px 12px;
                    }
                    
                    .dog-name-line {
                        font-size: 1rem;
                    }
                    
                    .dog-details-line {
                        font-size: 0.85rem;
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        gap: 8px !important;
                    }
                    
                    .autocomplete-dropdown {
                        max-height: 250px;
                        position: fixed;
                        top: auto !important;
                        left: 10px !important;
                        right: 10px !important;
                        width: auto !important;
                        z-index: 1060;
                    }
                    
                    .search-results-container {
                        max-height: 250px;
                    }
                    
                    .dog-details-card {
                        padding: 15px;
                        margin-top: 10px;
                    }
                    
                    .dog-details-name {
                        font-size: 1.3rem;
                    }
                    
                    .health-analysis-table {
                        font-size: 0.75rem;
                    }
                    
                    .health-analysis-table th,
                    .health-analysis-table td {
                        padding: 6px 4px;
                    }
                    
                    .health-category {
                        padding-left: 8px;
                    }
                }
                
                @media (max-width: 480px) {
                    .search-results-container {
                        min-height: 180px;
                        max-height: 220px;
                    }
                    
                    .dog-details-info {
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .health-analysis-table {
                        display: block;
                        overflow-x: auto;
                    }
                }
                
                /* HEALTH BADGES - IDENTIEK AAN STAMBOOMMANAGER */
                .badge-hd {
                    background-color: #dc3545 !important;
                    color: white !important;
                }
                
                .badge-ed {
                    background-color: #fd7e14 !important;
                    color: white !important;
                }
                
                .badge-pl {
                    background-color: #6f42c1 !important;
                    color: white !important;
                }
                
                .badge-eyes {
                    background-color: #20c997 !important;
                    color: white !important;
                }
                
                .badge-dandy {
                    background-color: #6610f2 !important;
                    color: white !important;
                }
                
                .badge-thyroid {
                    background-color: #e83e8c !important;
                    color: white !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    async loadAllHondenPaginated() {
        try {
            if (window.hondenService && typeof window.hondenService.getHonden === 'function') {
                let allHonden = [];
                let currentPage = 1;
                let hasMorePages = true;
                const pageSize = 100;
                const maxHonden = 5000;
                
                console.log('📥 Start laden van honden via paginatie...');
                
                while (hasMorePages && allHonden.length < maxHonden) {
                    try {
                        const result = await window.hondenService.getHonden(currentPage, pageSize);
                        
                        if (result && result.honden && result.honden.length > 0) {
                            allHonden = allHonden.concat(result.honden);
                            hasMorePages = result.heeftVolgende;
                            currentPage++;
                            
                            console.log(`📄 Pagina ${currentPage-1}: ${result.honden.length} honden (totaal: ${allHonden.length})`);
                            
                            // Update UI toon voortgang
                            if (currentPage % 5 === 0) {
                                this.updateLoadingMessage(`Laden... ${allHonden.length} honden geladen`);
                            }
                        } else {
                            hasMorePages = false;
                            console.log('❌ Geen honden meer gevonden of error in result');
                        }
                    } catch (pageError) {
                        console.error(`❌ Fout bij laden pagina ${currentPage}:`, pageError);
                        hasMorePages = false;
                        break;
                    }
                }
                
                this.allHonden = allHonden;
                console.log(`✅ Succesvol geladen: ${this.allHonden.length} honden uit Supabase`);
                
                // Zorg dat alle gezondheidsvelden aanwezig zijn
                this.allHonden = this.allHonden.map(hond => {
                    return {
                        ...hond,
                        heupdysplasie: hond.heupdysplasie || '',
                        elleboogdysplasie: hond.elleboogdysplasie || '',
                        patella: hond.patella || '',
                        ogen: hond.ogen || '',
                        ogenVerklaring: hond.ogenVerklaring || '',
                        dandyWalker: hond.dandyWalker || '',
                        schildklier: hond.schildklier || '',
                        schildklierVerklaring: hond.schildklierVerklaring || '',
                        vachtkleur: hond.vachtkleur || '',
                        ras: hond.ras || '',
                        land: hond.land || '',
                        postcode: hond.postcode || '',
                        opmerkingen: hond.opmerkingen || ''
                    };
                });
                
                // Voeg alle honden toe aan cache
                this.allHonden.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
                
                return allHonden.length;
                
            } else {
                console.error('❌ window.hondenService niet beschikbaar of getHonden functie ontbreekt');
                this.allHonden = [];
                return 0;
            }
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            this.allHonden = [];
            return 0;
        }
    }
    
    updateLoadingMessage(message) {
        // Toon voortgang in UI
        const loadingElement = document.querySelector('.loading-message');
        if (loadingElement) {
            loadingElement.textContent = message;
        }
    }
    
    // NIEUWE METHODE: getDogById - Eenvoudige zoekmethode voor honden
    getDogById(id) {
        // Eerst in cache zoeken
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
        // Dan in allHonden array zoeken
        const dog = this.allHonden.find(dog => dog.id === id);
        if (dog) {
            this.hondenCache.set(id, dog);
            return dog;
        }
        
        return null;
    }
    
    async getHondById(id) {
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
        try {
            // VERANDERD: Gebruik window.hondenService
            const hond = await window.hondenService.getHondByStamboomnr(id);
            if (hond) {
                const volledigeHond = {
                    ...hond,
                    heupdysplasie: hond.heupdysplasie || '',
                    elleboogdysplasie: hond.elleboogdysplasie || '',
                    patella: hond.patella || '',
                    ogen: hond.ogen || '',
                    ogenVerklaring: hond.ogenVerklaring || '',
                    dandyWalker: hond.dandyWalker || '',
                    schildklier: hond.schildklier || '',
                    schildklierVerklaring: hond.schildklierVerklaring || '',
                    vachtkleur: hond.vachtkleur || '',
                    ras: hond.ras || ''
                };
                
                this.hondenCache.set(id, volledigeHond);
                if (volledigeHond.stamboomnr) {
                    this.hondenCache.set(volledigeHond.stamboomnr, volledigeHond);
                }
                
                const existsInAllHonden = this.allHonden.some(dog => dog.id === id);
                if (!existsInAllHonden) {
                    this.allHonden.push(volledigeHond);
                }
                return volledigeHond;
            }
            return null;
        } catch (error) {
            console.error(`❌ Fout bij ophalen hond ${id}:`, error);
            return null;
        }
    }
    
    async findHondByNameOrPedigree(name, requiredGender = null) {
        if (!name || !name.trim()) return null;
        
        const searchName = name.toLowerCase().trim();
        
        // Eerst in geladen honden zoeken
        for (const hond of this.allHonden) {
            // Filter op geslacht als requiredGender is opgegeven
            if (requiredGender) {
                if (requiredGender === 'female' && !(hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk')) {
                    continue;
                }
                if (requiredGender === 'male' && !(hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk')) {
                    continue;
                }
            }
            
            const hondNaam = hond.naam?.toLowerCase() || '';
            const stamboomnr = hond.stamboomnr?.toLowerCase() || '';
            const kennelNaam = hond.kennelnaam?.toLowerCase() || '';
            
            if (hondNaam.includes(searchName) || 
                stamboomnr.includes(searchName) || 
                kennelNaam.includes(searchName)) {
                return hond;
            }
        }
        
        // Als niet gevonden, zoek direct in database
        try {
            // VERANDERD: Gebruik gepagineerde zoek
            const result = await window.hondenService.zoekHonden({ naam: name }, 1, 50);
            if (result && result.honden && result.honden.length > 0) {
                // Filter op geslacht
                const genderFiltered = result.honden.filter(hond => {
                    if (!requiredGender) return true;
                    
                    if (requiredGender === 'female') {
                        return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                    } else if (requiredGender === 'male') {
                        return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                    }
                    return true;
                });
                
                if (genderFiltered.length > 0) {
                    // Voeg nieuwe honden toe aan cache en filteredHonden
                    const newHond = genderFiltered[0];
                    if (!this.allHonden.some(d => d.id === newHond.id)) {
                        this.allHonden.push(newHond);
                    }
                    return newHond;
                }
            }
        } catch (error) {
            console.error('Fout bij extra database zoeken:', error);
        }
        
        console.log(`🔍 Geen hond gevonden voor zoekterm: "${name}"`);
        return null;
    }
    
    setupAutocomplete(inputId, resultsId, geslacht, onSelect, requiredGender = null) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId.replace('Search', 'Dropdown'));
        const resultsContainer = document.getElementById(resultsId);
        let activeIndex = -1;
        let currentResults = [];
        
        const showInitialView = () => {
            resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
                </div>
            `;
        };
        
        const displaySearchResults = (filteredHonden) => {
            const t = this.t.bind(this);
            
            if (filteredHonden.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="text-center py-4">
                        <i class="bi bi-search-x display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${t('noDogsFound')}</p>
                    </div>
                `;
                return;
            }
            
            let html = `
                <div class="search-stats">
                    <i class="bi bi-info-circle me-1"></i>
                    ${filteredHonden.length} ${t('found')}
                </div>
            `;
            
            filteredHonden.forEach(dog => {
                const genderText = dog.geslacht === 'reuen' ? this.t('genderReu') : 
                                 dog.geslacht === 'teven' ? this.t('genderTeef') : this.t('unknown');
                
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
            
            resultsContainer.innerHTML = html;
            
            resultsContainer.querySelectorAll('.dog-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const hondId = parseInt(item.getAttribute('data-id'));
                    const hond = currentResults.find(d => d.id === hondId);
                    if (hond) {
                        resultsContainer.querySelectorAll('.dog-result-item').forEach(i => {
                            i.classList.remove('selected');
                        });
                        item.classList.add('selected');
                        
                        const displayName = hond.kennelnaam ? 
                            `${hond.naam} (${hond.kennelnaam})` : 
                            hond.naam;
                        input.value = displayName;
                        
                        onSelect(hond);
                    }
                });
            });
        };
        
        showInitialView();
        
        input.addEventListener('focus', async () => {
            if (this.allHonden.length === 0) {
                await this.loadAllHondenPaginated();
            }
        });
        
        input.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                dropdown.style.display = 'none';
                showInitialView();
                return;
            }
            
            let filteredHonden = this.allHonden.filter(hond => {
                // Filter op geslacht op basis van requiredGender
                if (requiredGender === 'female') {
                    return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                } else if (requiredGender === 'male') {
                    return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                }
                return true;
            });
            
            if (searchTerm.length >= 1) {
                filteredHonden = filteredHonden.filter(dog => {
                    const naam = dog.naam ? dog.naam.toLowerCase() : '';
                    const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
                    const stamboomnr = dog.stamboomnr ? dog.stamboomnr.toLowerCase() : '';
                    const combined = `${naam} ${kennelnaam} ${stamboomnr}`;
                    return combined.includes(searchTerm);
                });
            }
            
            // Als we minder dan 10 resultaten hebben in lokale cache, zoek in database
            if (filteredHonden.length < 10 && searchTerm.length >= 2) {
                try {
                    const result = await window.hondenService.zoekHonden({ naam: searchTerm }, 1, 50);
                    if (result && result.honden && result.honden.length > 0) {
                        // Filter op geslacht
                        const genderFiltered = result.honden.filter(hond => {
                            if (requiredGender === 'female') {
                                return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                            } else if (requiredGender === 'male') {
                                return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                            }
                            return true;
                        });
                        
                        // Voeg nieuwe honden toe aan cache en filteredHonden
                        genderFiltered.forEach(hond => {
                            if (!filteredHonden.some(d => d.id === hond.id)) {
                                filteredHonden.push(hond);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Fout bij extra database zoeken:', error);
                }
            }
            
            currentResults = filteredHonden;
            displaySearchResults(filteredHonden);
            
            if (filteredHonden.length > 0) {
                dropdown.innerHTML = filteredHonden.map((hond, index) => {
                    const geboortejaar = hond.geboortedatum ? 
                        new Date(hond.geboortedatum).getFullYear() : '?';
                    
                    return `
                        <div class="autocomplete-item ${index === activeIndex ? 'active' : ''}" 
                             data-index="${index}"
                             data-id="${hond.id}">
                            <div class="d-flex justify-content-between align-items-start">
                                <div style="flex: 1;">
                                    <div class="dog-name">${hond.naam || 'Onbekend'}</div>
                                    <div class="dog-details">
                                        ${hond.kennelnaam ? `
                                            <span class="kennel-name">
                                                <i class="bi bi-house-door me-1"></i>${hond.kennelnaam}
                                            </span> • 
                                        ` : ''}
                                        ${hond.ras || this.t('unknownBreed')}
                                        ${hond.stamboomnr ? ` • ${hond.stamboomnr}` : ''}
                                    </div>
                                </div>
                                <div class="text-muted small ms-2" style="white-space: nowrap;">
                                    ${geboortejaar}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                dropdown.style.display = 'block';
                
                dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = parseInt(item.getAttribute('data-index'));
                        const hond = currentResults[index];
                        if (hond) {
                            const displayName = hond.kennelnaam ? 
                                `${hond.naam} (${hond.kennelnaam})` : 
                                hond.naam;
                            input.value = displayName;
                            dropdown.style.display = 'none';
                            
                            const resultsItems = resultsContainer.querySelectorAll('.dog-result-item');
                            resultsItems.forEach((resultItem, idx) => {
                                resultItem.classList.remove('selected');
                                if (idx === index) {
                                    resultItem.classList.add('selected');
                                }
                            });
                            
                            onSelect(hond);
                        }
                    });
                });
            } else {
                dropdown.style.display = 'none';
            }
        });
        
        input.addEventListener('keydown', (e) => {
            const items = dropdown.querySelectorAll('.autocomplete-item');
            const resultItems = resultsContainer.querySelectorAll('.dog-result-item');
            
            if (items.length === 0) return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                    this.updateActiveItem(items, activeIndex);
                    this.updateActiveResultItem(resultItems, activeIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    activeIndex = Math.max(activeIndex - 1, -1);
                    this.updateActiveItem(items, activeIndex);
                    this.updateActiveResultItem(resultItems, activeIndex);
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && items[activeIndex]) {
                        const hond = currentResults[activeIndex];
                        if (hond) {
                            const displayName = hond.kennelnaam ? 
                                `${hond.naam} (${hond.kennelnaam})` : 
                                hond.naam;
                            input.value = displayName;
                            dropdown.style.display = 'none';
                            onSelect(hond);
                        }
                    }
                    break;
                    
                case 'Escape':
                    dropdown.style.display = 'none';
                    activeIndex = -1;
                    break;
                    
                case 'Tab':
                    dropdown.style.display = 'none';
                    activeIndex = -1;
                    break;
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                activeIndex = -1;
            }
        });
    }
    
    updateActiveItem(items, activeIndex) {
        items.forEach((item, index) => {
            item.classList.toggle('active', index === activeIndex);
            if (index === activeIndex) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }
    
    updateActiveResultItem(resultItems, activeIndex) {
        resultItems.forEach((item, index) => {
            item.classList.toggle('selected', index === activeIndex);
            if (index === activeIndex) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        });
    }
    
    selectTeef(hond) {
        this.selectedTeef = hond;
        this.showHondDetails('teefDetails', hond, 'teef');
        this.updateButtonStates();
    }
    
    selectReu(hond) {
        this.selectedReu = hond;
        this.showHondDetails('reuDetails', hond, 'reu');
        this.updateButtonStates();
    }
    
    async showHondDetails(elementId, hond, type) {
        const t = this.t.bind(this);
        const detailsContainer = document.getElementById(elementId);
        
        const resultsId = elementId.replace('Details', 'SearchResults');
        const resultsContainer = document.getElementById(resultsId);
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        
        detailsContainer.classList.remove('d-none');
        
        const oudersInfo = await this.getOudersInfo(hond);
        
        detailsContainer.innerHTML = `
            <div class="dog-details-card">
                <div class="dog-details-header">
                    <div class="dog-details-name">${hond.naam || 'Onbekend'}</div>
                    ${hond.kennelnaam ? `<div class="dog-details-subtitle">${hond.kennelnaam}</div>` : ''}
                    
                    <div class="dog-details-info mt-3">
                        ${hond.stamboomnr ? `
                            <div class="info-item">
                                <i class="bi bi-card-checklist"></i>
                                <span>${hond.stamboomnr}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.ras ? `
                            <div class="info-item">
                                <i class="bi bi-tag"></i>
                                <span>${hond.ras}</span>
                            </div>
                        ` : ''}
                        
                        <div class="info-item">
                            <i class="bi bi-gender-${type === 'teef' ? 'female' : 'male'}"></i>
                            <span>${type === 'teef' ? t('genderTeef') : t('genderReu')}</span>
                        </div>
                        
                        ${hond.geboortedatum ? `
                            <div class="info-item">
                                <i class="bi bi-calendar"></i>
                                <span>${new Date(hond.geboortedatum).toLocaleDateString(this.currentLang)}</span>
                            </div>
                        ` : ''}
                        
                        ${hond.vachtkleur ? `
                            <div class="info-item">
                                <i class="bi bi-palette"></i>
                                <span>${hond.vachtkleur}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="dog-details-row">
                    <div class="dog-details-label">${t('parents')}:</div>
                    <div class="dog-details-value">
                        <div class="row">
                            ${oudersInfo.vader ? `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('fatherLabel')}:</strong><br>
                                    ${oudersInfo.vader.naam || 'Onbekend'}
                                    ${oudersInfo.vader.stamboomnr ? `(${oudersInfo.vader.stamboomnr})` : ''}
                                </div>
                            ` : `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('fatherLabel')}:</strong><br>
                                    <span class="text-muted">${t('unknownAncestor')}</span>
                                </div>
                            `}
                            
                            ${oudersInfo.moeder ? `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('motherLabel')}:</strong><br>
                                    ${oudersInfo.moeder.naam || 'Onbekend'}
                                    ${oudersInfo.moeder.stamboomnr ? `(${oudersInfo.moeder.stamboomnr})` : ''}
                                </div>
                            ` : `
                                <div class="col-md-6 mb-2">
                                    <strong>${t('motherLabel')}:</strong><br>
                                    <span class="text-muted">${t('unknownAncestor')}</span>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="mt-3 pt-3 border-top">
                    <button class="btn btn-sm btn-outline-secondary" onclick="window.reuTeefCombinatie.clearSelection('${elementId}', '${resultsId}')">
                        <i class="bi bi-x-circle me-1"></i> Selectie wissen
                    </button>
                </div>
            </div>
        `;
    }
    
    clearSelection(detailsId, resultsId) {
        const detailsContainer = document.getElementById(detailsId);
        const resultsContainer = document.getElementById(resultsId);
        const inputId = detailsId.replace('Details', 'Search');
        const input = document.getElementById(inputId);
        
        if (detailsId === 'teefDetails') {
            this.selectedTeef = null;
        } else if (detailsId === 'reuDetails') {
            this.selectedReu = null;
        }
        
        if (input) {
            input.value = '';
        }
        
        detailsContainer.classList.add('d-none');
        detailsContainer.innerHTML = '';
        
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                    <p class="mt-3 text-muted">${this.t('typeToSearch')}</p>
                </div>
            `;
        }
        
        this.updateButtonStates();
    }
    
    async getOudersInfo(hond) {
        const result = { vader: null, moeder: null };
        
        if (hond.vaderId) {
            result.vader = await this.getHondById(hond.vaderId);
        } else if (hond.vader) {
            result.vader = await this.findHondByNameOrPedigree(hond.vader, 'male');
        }
        
        if (hond.moederId) {
            result.moeder = await this.getHondById(hond.moederId);
        } else if (hond.moeder) {
            result.moeder = await this.findHondByNameOrPedigree(hond.moeder, 'female');
        }
        
        return result;
    }
    
    updateButtonStates() {
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
            showPedigreeBtn.title = bothSelected ? '' : this.t('selectDogFirst');
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
            } else if (window.appUI && window.appUI.modules && window.appUI.modules.breeding) {
                window.appUI.modules.breeding.loadMainScreen();
            } else {
                const modal = bootstrap.Modal.getInstance(breedingModal);
                if (modal) {
                    modal.hide();
                }
            }
        }
    }
    
    async showFuturePuppyPedigree() {
        if (!this.selectedTeef || !this.selectedReu) {
            this.showAlert(this.t('selectDogFirst'), 'warning');
            return;
        }
        
        console.log(`🔍 Toekomstige pup van: ${this.selectedTeef.naam} + ${this.selectedReu.naam}`);
        
        // Maak een virtuele toekomstige pup
        const futurePuppy = {
            id: -999999,
            naam: this.t('futurePuppyName'),
            geslacht: 'onbekend',
            vader_id: this.selectedReu.id,
            moeder_id: this.selectedTeef.id,
            vader: this.selectedReu.naam,
            moeder: this.selectedTeef.naam,
            kennelnaam: this.t('combinedParents'),
            stamboomnr: 'VOORSPELD',
            geboortedatum: new Date().toISOString().split('T')[0],
            vachtkleur: `${this.selectedReu.vachtkleur || ''}/${this.selectedTeef.vachtkleur || ''}`.trim(),
            heupdysplasie: null,
            elleboogdysplasie: null,
            patella: null,
            ogen: null,
            ogenVerklaring: null,
            dandyWalker: null,
            schildklier: null,
            schildklierVerklaring: null,
            land: null,
            postcode: null,
            opmerkingen: null
        };
        
        console.log('🔍 Toekomstige pup aangemaakt voor stamboom:', futurePuppy);
        
        // Gebruik een eenvoudige COI berekening zonder externe calculator
        const coiResult = {
            coi6Gen: '0.0',
            homozygosity6Gen: '0.0',
            kinship6Gen: '0.0'
        };
        
        // Eenvoudige gezondheidsanalyse
        const healthAnalysis = {
            motherLine: { total: 0, counts: {} },
            fatherLine: { total: 0, counts: {} }
        };
        
        try {
            // Toon stamboom met modal
            await this.createFuturePuppyModal(futurePuppy, this.selectedTeef, this.selectedReu, coiResult, healthAnalysis);
        } catch (error) {
            console.error('❌ Fout bij tonen toekomstige pup stamboom:', error);
            this.showAlert('Kon stamboom niet genereren. Probeer opnieuw.', 'danger');
        }
    }
    
    async createFuturePuppyModal(futurePuppy, selectedTeef, selectedReu, coiResult, healthAnalysis) {
        const modalId = 'rtc-futurePuppyModal';
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        const title = this.t('futurePuppyTitle').replace('{reu}', selectedReu.naam || '?').replace('{teef}', selectedTeef.naam || '?');
        
        const modalHTML = `
            <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="rtcFuturePuppyModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-fullscreen">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="rtcFuturePuppyModalLabel">
                                <i class="bi bi-diagram-3 me-2"></i> ${title}
                            </h5>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-light btn-print">
                                    <i class="bi bi-printer me-1"></i> ${this.t('print')}
                                </button>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                        </div>
                        <div class="modal-body p-0" style="overflow: hidden;">
                            <div class="rtc-pedigree-mobile-wrapper" id="rtcFuturePuppyMobileWrapper">
                                <div class="rtc-pedigree-container-compact" id="rtcFuturePuppyContainer">
                                    <div class="text-center py-5">
                                        <div class="spinner-border text-success" role="status">
                                            <span class="visually-hidden">${this.t('loadingPedigree')}</span>
                                        </div>
                                        <p class="mt-3">${this.t('loadingPedigree')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- GEÏSOLEERDE Popup overlay voor toekomstige pup details -->
            <div class="rtc-pedigree-popup-overlay" id="rtcPedigreePopupOverlay" style="display: none;">
                <div class="rtc-pedigree-popup-container" id="rtcPedigreePopupContainer"></div>
            </div>
            
            <style>
                /* UNIEKE PREFIX VOOR ALLE CSS - VOOR ISOLATIE */
                /* MOBIELE WRAPPER - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-pedigree-mobile-wrapper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: #f8f9fa;
                    position: relative;
                    border-radius: 12px;
                }
                
                /* HORIZONTALE PEDIGREE CONTAINER - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-pedigree-container-compact {
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
                    display: flex !important;
                    justify-content: center !important; /* CENTREREN VAN ALLE GENERATIES */
                }
                
                .rtc-pedigree-grid-compact {
                    display: flex;
                    flex-direction: row;
                    height: auto;
                    min-width: fit-content;
                    padding: 10px 15px !important;
                    gap: 20px;
                    align-items: flex-start;
                    box-sizing: border-box !important;
                    margin: 0 auto !important; /* CENTREREN */
                }
                
                /* GENERATIE KOLOM - VERTICALE STACK VAN LIGGENDE CARDS */
                .rtc-pedigree-generation-col {
                    display: flex;
                    flex-direction: column;
                    height: auto;
                    justify-content: flex-start;
                    min-width: 0;
                }
                
                .rtc-pedigree-generation-col.gen0 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen1 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen2 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen3 {
                    gap: 4px !important;
                }
                
                .rtc-pedigree-generation-col.gen4 {
                    gap: 4px !important;
                }
                
                /* BASIS LIGGENDE CARDS - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-pedigree-card-compact.horizontal {
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
                
                /* ZELFDE BREEDTE VOOR ALLE GENERATIES - VERSCHILLENDE HOOGTE */
                .rtc-pedigree-card-compact.horizontal.gen0,
                .rtc-pedigree-card-compact.horizontal.gen1,
                .rtc-pedigree-card-compact.horizontal.gen2 {
                    width: 160px !important;
                    height: 145px !important;
                }
                
                /* OVERGROOTOUDERS: 60% HOOGTE VAN NORMALE CARDS */
                .rtc-pedigree-card-compact.horizontal.gen3 {
                    width: 160px !important;
                    height: 70px !important;
                }
                
                /* OVER-OVERGROOTOUDERS: 34px HOOGTE */
                .rtc-pedigree-card-compact.horizontal.gen4 {
                    width: 160px !important;
                    height: 34px !important;
                    min-height: 34px !important;
                }
                
                /* Hoofdhond extra styling */
                .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                    border: 2px solid #198754 !important;
                    background: #f0fff4;
                    width: 170px !important;
                    height: 145px !important;
                }
                
                /* Geslacht kleuren */
                .rtc-pedigree-card-compact.horizontal.male {
                    border-left: 4px solid #0d6efd !important;
                }
                
                .rtc-pedigree-card-compact.horizontal.female {
                    border-left: 4px solid #dc3545 !important;
                }
                
                .rtc-pedigree-card-compact.horizontal:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.12);
                    transform: translateY(-1px);
                    z-index: 1;
                    position: relative;
                }
                
                .rtc-pedigree-card-compact.horizontal.empty {
                    background: #f8f9fa;
                    cursor: default;
                    opacity: 0.6;
                }
                
                .rtc-pedigree-card-compact.horizontal.empty:hover {
                    transform: none !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.08) !important;
                }
                
                /* CARD HEADER */
                .rtc-pedigree-card-header-compact.horizontal {
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                
                /* Header voor gen0, gen1, gen2 */
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-pedigree-card-header-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-pedigree-card-header-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 5px 8px;
                    font-size: 0.7rem;
                    min-height: 22px;
                }
                
                /* Header voor gen3 (overgrootouders) */
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 3px 6px;
                    font-size: 0.56rem;
                    min-height: 16px;
                }
                
                /* Header voor gen4 (over-overgrootouders) - KLEINER */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-pedigree-card-header-compact.horizontal {
                    padding: 1px 4px !important;
                    font-size: 0.48rem !important;
                    min-height: 10px !important;
                    max-height: 10px !important;
                    overflow: hidden !important;
                }
                
                .rtc-pedigree-card-header-compact.horizontal.bg-success {
                    background: #198754 !important;
                }
                
                .rtc-pedigree-card-header-compact.horizontal.bg-primary {
                    background: #0d6efd !important;
                }
                
                .rtc-pedigree-card-header-compact.horizontal.bg-secondary {
                    background: #6c757d !important;
                }
                
                .rtc-relation-compact {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                    font-weight: 600;
                    overflow: hidden;
                    flex: 1;
                }
                
                .rtc-relation-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: inherit;
                }
                
                .rtc-main-dot {
                    color: #ffc107;
                    font-size: 0.7rem;
                    flex-shrink: 0;
                }
                
                .rtc-gender-icon-compact {
                    flex-shrink: 0;
                    margin-left: 4px;
                }
                
                /* CARD BODY */
                .rtc-pedigree-card-body-compact.horizontal {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }
                
                /* Body voor gen0, gen1, gen2 */
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-pedigree-card-body-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-pedigree-card-body-compact.horizontal,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 6px 8px;
                }
                
                /* Body voor gen3 (overgrootouders) */
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 4px 6px;
                }
                
                /* Body voor gen4 (over-overgrootouders) - ALLEEN NAAM EN KENNEL */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-pedigree-card-body-compact.horizontal {
                    padding: 2px 4px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* CARD ROWS voor liggende layout */
                .rtc-card-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                }
                
                .rtc-card-row-1 {
                    margin-bottom: 2px;
                }
                
                .rtc-card-row-2 {
                    margin-bottom: 2px;
                }
                
                .rtc-card-row-3 {
                    margin-top: auto;
                }
                
                /* NAAM + KENNEL COMBINATIE STYLING - VOOR GEN4 ALLEEN NAAM */
                .rtc-dog-name-kennel-compact {
                    font-weight: 600;
                    color: #0d6efd;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    width: 100%;
                }
                
                /* Voor gen4 (over-overgrootouders): alleen naam, grotere tekst */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-name-kennel-compact {
                    font-size: 0.6rem !important;
                    text-align: center !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    line-height: 1 !important;
                    font-weight: 500 !important;
                }
                
                /* TEKST GROOTTES PER GENERATIE */
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-name-kennel-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-name-kennel-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-name-kennel-compact {
                    font-size: 0.75rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-breed-compact {
                    font-size: 0.65rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen0 .rtc-click-hint-compact,
                .rtc-pedigree-card-compact.horizontal.gen1 .rtc-click-hint-compact,
                .rtc-pedigree-card-compact.horizontal.gen2 .rtc-click-hint-compact {
                    font-size: 0.55rem;
                }
                
                /* Overgrootouders (gen3) */
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-name-kennel-compact {
                    font-size: 0.6rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-breed-compact {
                    font-size: 0.52rem;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3 .rtc-click-hint-compact {
                    font-size: 0.44rem;
                }
                
                /* Over-overgrootouders (gen4) - geen extra info, alleen naam */
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-pedigree-compact,
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-breed-compact,
                .rtc-pedigree-card-compact.horizontal.gen4 .rtc-click-hint-compact {
                    display: none !important;
                }
                
                /* Algemene tekst styling */
                .rtc-dog-pedigree-compact {
                    font-weight: 600;
                    color: #495057;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                }
                
                .rtc-dog-breed-compact {
                    color: #28a745;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                    flex: 1;
                    text-align: right;
                }
                
                .rtc-no-data-text {
                    color: #6c757d;
                    font-style: italic;
                    line-height: 1.3;
                    font-size: 0.7rem;
                }
                
                /* Click hint met fototoestelicoon - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-click-hint-compact {
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
                
                .rtc-click-hint-compact .bi-camera {
                    color: #1a15f4;
                    font-size: 0.7rem;
                }
                
                /* Lege card styling */
                .rtc-pedigree-card-compact.horizontal.empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* VISUELE VERBINDINGEN */
                .rtc-pedigree-generation-col {
                    position: relative;
                }
                
                .rtc-pedigree-generation-col:not(:first-child)::before {
                    content: '';
                    position: absolute;
                    left: -10px;
                    top: 50%;
                    width: 10px;
                    height: 1px;
                    background: #adb5bd;
                    opacity: 0.5;
                }
                
                /* Overgrootouder en over-overgrootouder styling */
                .rtc-pedigree-card-compact.horizontal.gen3,
                .rtc-pedigree-card-compact.horizontal.gen4 {
                    opacity: 0.9;
                }
                
                .rtc-pedigree-card-compact.horizontal.gen3:hover,
                .rtc-pedigree-card-compact.horizontal.gen4:hover {
                    opacity: 1;
                }
                
                /* MOBIELE AANPASSINGEN */
                @media (max-width: 767px) {
                    #rtc-futurePuppyModal.modal.fade .modal-dialog {
                        max-width: 100%;
                        margin: 0.5rem auto;
                        height: auto;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-content {
                        width: 100%;
                        height: auto;
                        margin: 0;
                        border-radius: 12px;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-header {
                        margin: 0;
                        padding: 0.75rem 1rem;
                        border: none;
                        width: 100%;
                        flex-shrink: 0;
                        min-height: auto;
                        z-index: 1;
                        border-radius: 12px 12px 0 0;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-body {
                        width: 100%;
                        padding: 0;
                        margin: 0;
                        flex: 1 1 auto;
                        overflow: hidden;
                        min-height: 0;
                        max-height: 640px;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .rtc-pedigree-mobile-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        background: #f8f9fa;
                        border-radius: 0 0 12px 12px;
                    }
                    
                    .rtc-pedigree-container-compact {
                        height: 640px !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        padding: 10px !important;
                        -webkit-overflow-scrolling: touch;
                        display: flex;
                        flex-direction: column;
                        border-radius: 0 0 12px 12px;
                        justify-content: center !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        display: flex !important;
                        flex-direction: row !important;
                        flex-wrap: nowrap !important;
                        height: 100% !important;
                        min-width: max-content !important;
                        padding: 10px 15px !important;
                        gap: 15px !important;
                        margin: 0 auto !important;
                        align-items: stretch !important;
                        box-sizing: border-box !important;
                        width: auto !important;
                    }
                    
                    .rtc-pedigree-generation-col {
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
                    
                    .rtc-pedigree-generation-col.gen0 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 > .rtc-pedigree-card-compact.horizontal:nth-child(2) {
                        margin-top: -2px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 > .rtc-pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: 2px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(2),
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(3) {
                        margin-top: -4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(4),
                    .rtc-pedigree-generation-col.gen2 > .rtc-pedigree-card-compact.horizontal:nth-child(5) {
                        margin-top: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen3 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen4 {
                        justify-content: center !important;
                        align-items: flex-start !important;
                        min-width: 220px !important;
                        width: 220px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 145px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 220px !important;
                        height: 34px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 145px !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .rtc-pedigree-container-compact {
                        height: 640px !important;
                        padding: 8px !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        padding: 8px 12px !important;
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 220px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 220px !important;
                        height: 70px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 220px !important;
                        height: 34px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 220px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-generation-col {
                        min-width: 220px !important;
                        width: 220px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen0,
                    .rtc-pedigree-generation-col.gen1,
                    .rtc-pedigree-generation-col.gen2,
                    .rtc-pedigree-generation-col.gen3,
                    .rtc-pedigree-generation-col.gen4 {
                        min-width: 220px !important;
                        width: 220px !important;
                    }
                }
                
                /* DESKTOP STYLES */
                @media (min-width: 768px) {
                    #rtc-futurePuppyModal.modal.fade .modal-dialog.modal-fullscreen {
                        width: 100vw !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        max-width: none !important;
                        padding: 0 !important;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-content {
                        width: 100% !important;
                        height: 100vh !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        border-radius: 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-header {
                        margin: 0 !important;
                        padding: 0.75rem 1rem !important;
                        border: none !important;
                        width: 100% !important;
                        flex-shrink: 0 !important;
                        min-height: auto !important;
                        z-index: 1;
                    }
                    
                    #rtc-futurePuppyModal.modal.fade .modal-body {
                        width: 100% !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        flex: 1 1 auto !important;
                        overflow: hidden !important;
                        min-height: 0 !important;
                    }
                    
                    .rtc-pedigree-mobile-wrapper {
                        height: 100%;
                        border-radius: 0;
                    }
                    
                    .rtc-pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        align-items: center;
                        padding: 0 !important;
                        display: flex;
                        border-radius: 0;
                        justify-content: center !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        flex-direction: row;
                        height: 100%;
                        min-width: fit-content;
                        padding: 0 20px !important;
                        gap: 25px;
                        align-items: center;
                        box-sizing: border-box !important;
                        margin: 0 auto !important; /* CENTREREN */
                    }
                    
                    .rtc-pedigree-generation-col {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        min-width: 0;
                    }
                    
                    .rtc-pedigree-generation-col.gen0 {
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen1 {
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen2 {
                        gap: 4px !important;
                    }
                    
                    .rtc-pedigree-generation-col.gen3 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .rtc-pedigree-generation-col.gen4 {
                        gap: 4px !important;
                        justify-content: center;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 70px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 34px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-name-kennel-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-name-kennel-compact,
                    .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-name-kennel-compact {
                        font-size: 0.8rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen2 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-dog-breed-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-dog-breed-compact,
                    .rtc-pedigree-card.compact.horizontal.gen2 .rtc-dog-breed-compact {
                        font-size: 0.7rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0 .rtc-click-hint-compact,
                    .rtc-pedigree-card-compact.horizontal.gen1 .rtc-click-hint-compact,
                    .rtc-pedigree-card-compact.horizontal.gen2 .rtc-click-hint-compact {
                        font-size: 0.6rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-name-kennel-compact {
                        font-size: 0.64rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-pedigree-compact,
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-dog-breed-compact {
                        font-size: 0.56rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 .rtc-click-hint-compact {
                        font-size: 0.48rem;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 .rtc-dog-name-kennel-compact {
                        font-size: 0.6rem !important;
                    }
                }
                
                @media (min-width: 1024px) and (max-width: 1365px) {
                    .rtc-pedigree-container-compact {
                        height: calc(100vh - 60px) !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        gap: 15px;
                        padding: 0 12px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen0,
                    .rtc-pedigree-card-compact.horizontal.gen1,
                    .rtc-pedigree-card-compact.horizontal.gen2 {
                        width: 200px !important;
                        height: 145px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen3 {
                        width: 200px !important;
                        height: 70px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.gen4 {
                        width: 200px !important;
                        height: 34px !important;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal.main-dog-compact {
                        width: 200px !important;
                        height: 145px !important;
                    }
                }
                
                /* GEÏSOLEERDE DETAIL POPUP STYLES - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-pedigree-popup-overlay {
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
                    animation: rtc-fadeIn 0.3s;
                    overflow-y: auto;
                }
                
                @keyframes rtc-fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .rtc-pedigree-popup-container {
                    background: white;
                    border-radius: 12px;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: rtc-slideUp 0.3s;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                    width: calc(100% - 20px);
                    margin: 10px;
                }
                
                @keyframes rtc-slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .rtc-dog-detail-popup {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .rtc-popup-header {
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
                
                .rtc-popup-title {
                    margin: 0;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                
                /* Eigen kruisje styling - WIT KRUISJE - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-popup-header .rtc-btn-close {
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
                
                .rtc-popup-header .rtc-btn-close::before,
                .rtc-popup-header .rtc-btn-close::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 18px;
                    height: 2px;
                    background: #000 !important;
                    transform-origin: center;
                }
                
                .rtc-popup-header .rtc-btn-close::before {
                    transform: translate(-50%, -50%) rotate(45deg);
                }
                
                .rtc-popup-header .rtc-btn-close::after {
                    transform: translate(-50%, -50%) rotate(-45deg);
                }
                
                .rtc-popup-header .rtc-btn-close:hover {
                    opacity: 1;
                }
                
                .rtc-popup-body {
                    padding: 15px;
                    flex: 1;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                /* INFO SECTIES - IDENTIEK AAN STAMBOOMMANAGER */
                .rtc-info-section {
                    margin-bottom: 20px;
                }
                
                .rtc-info-section h6 {
                    color: #495057;
                    margin-bottom: 10px;
                    padding-bottom: 6px;
                    border-bottom: 2px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    font-size: 1rem;
                }
                
                .rtc-info-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .rtc-info-row {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 8px !important;
                    margin-bottom: 0 !important;
                    width: 100% !important;
                }
                
                .rtc-info-item {
                    display: flex;
                    flex-direction: column;
                    width: 100% !important;
                    min-width: 0 !important;
                }
                
                .rtc-info-item-half {
                    grid-column: span 1 !important;
                    width: 100% !important;
                }
                
                .rtc-info-item-full {
                    grid-column: 1 / -1 !important;
                    width: 100% !important;
                    margin-bottom: 4px;
                }
                
                /* DRIE WAARDES NAAST ELKAAR - ZELFDE ALS STAMBOOMMANAGER */
                .rtc-three-values-row {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                    align-items: stretch !important;
                    gap: 8px !important;
                    margin: 10px 0 !important;
                    width: 100% !important;
                }
                
                .rtc-value-box {
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
                
                .rtc-value-label {
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
                
                .rtc-value-number {
                    font-size: 0.85rem !important;
                    font-weight: bold !important;
                    line-height: 1.2 !important;
                    color: #212529 !important;
                }
                
                .rtc-coi-value {
                    font-weight: bold !important;
                }
                
                .rtc-info-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    margin-bottom: 2px;
                    line-height: 1.2;
                }
                
                .rtc-info-value {
                    color: #212529;
                    font-size: 0.95rem;
                    line-height: 1.3;
                    word-break: break-word;
                }
                
                .rtc-remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 12px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                
                /* THUMBNAILS SECTIE IN POPUP - IDENTIEK AAN STAMBOOMMANAGER */
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
                
                .rtc-popup-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 0 0 12px 12px;
                }
                
                .rtc-popup-close-btn {
                    min-width: 130px;
                    padding: 10px 25px;
                    font-size: 1rem;
                }
                
                /* ============================================= */
                /* GROTE FOTO OVERLAY STYLES - IDENTIEK AAN STAMBOOMMANAGER */
                /* ============================================= */
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
                    animation: rtc-fadeIn 0.3s;
                }
                
                .photo-large-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    max-height: 95vh;
                    animation: rtc-slideUp 0.3s;
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
                
                .photo-large-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
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
                
                /* Print styles */
                @media print {
                    .modal-dialog {
                        max-width: none;
                        margin: 0;
                    }
                    
                    .modal-header {
                        display: none !important;
                    }
                    
                    .rtc-pedigree-container-compact {
                        padding: 0;
                        background: white;
                        height: auto !important;
                        overflow-x: visible !important;
                        height: 100vh !important;
                    }
                    
                    .rtc-pedigree-grid-compact {
                        flex-direction: row !important;
                        height: auto;
                        padding: 20px !important;
                        gap: 15px;
                    }
                    
                    .rtc-pedigree-generation-col {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .rtc-pedigree-card-compact.horizontal {
                        break-inside: avoid;
                        box-shadow: none;
                        border: 1px solid #ccc !important;
                        margin-bottom: 10px;
                    }
                    
                    .main-dog-compact {
                        border: 2px solid #000 !important;
                    }
                    
                    .rtc-pedigree-popup-overlay {
                        display: none !important;
                    }
                }
                
                /* HEALTH BADGES - IDENTIEK AAN STAMBOOMMANAGER */
                .badge-hd {
                    background-color: #dc3545 !important;
                    color: white !important;
                }
                
                .badge-ed {
                    background-color: #fd7e14 !important;
                    color: white !important;
                }
                
                .badge-pl {
                    background-color: #6f42c1 !important;
                    color: white !important;
                }
                
                .badge-eyes {
                    background-color: #20c997 !important;
                    color: white !important;
                }
                
                .badge-dandy {
                    background-color: #6610f2 !important;
                    color: white !important;
                }
                
                .badge-thyroid {
                    background-color: #e83e8c !important;
                    color: white !important;
                }
                
                /* RESPONSIVE STYLES */
                @media (max-width: 767px) {
                    /* DRIE WAARDES NAAST ELKAAR OP MOBIEL */
                    .rtc-three-values-row {
                        gap: 4px !important;
                        margin: 8px 0 !important;
                    }
                    
                    .rtc-value-box {
                        padding: 6px 3px !important;
                        min-height: 55px !important;
                    }
                    
                    .rtc-value-label {
                        font-size: 0.61rem !important;
                    }
                    
                    .rtc-value-number {
                        font-size: 0.8rem !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .rtc-three-values-row {
                        gap: 3px !important;
                    }
                    
                    .rtc-value-box {
                        padding: 5px 2px !important;
                        min-height: 50px !important;
                    }
                    
                    .rtc-value-label {
                        font-size: 0.58rem !important;
                    }
                    
                    .rtc-value-number {
                        font-size: 0.75rem !important;
                    }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
        
        this.setupFuturePuppyModalEvents();
        
        // Render de stamboom
        await this.renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu);
    }
    
    setupFuturePuppyModalEvents() {
        const modal = document.getElementById('rtc-futurePuppyModal');
        if (!modal) return;
        
        const printBtn = modal.querySelector('.btn-print');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    async renderFuturePuppyPedigree(futurePuppy, selectedTeef, selectedReu) {
        const container = document.getElementById('rtcFuturePuppyContainer');
        if (!container) return;
        
        // Toon loading state
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">${this.t('loadingPedigree')}</span>
                </div>
                <p class="mt-3">${this.t('loadingPedigree')}</p>
            </div>
        `;
        
        try {
            // Bouw een eenvoudige stamboom
            const pedigreeTree = this.buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu);
            
            // Genereer cards
            const mainDogCard = this.generateDogCard(futurePuppy, this.t('mainDog'), true, 0);
            const fatherCard = this.generateDogCard(selectedReu, this.t('fatherLabel'), false, 1);
            const motherCard = this.generateDogCard(selectedTeef, this.t('motherLabel'), false, 1);
            
            // Grootouders
            const paternalGrandfatherCard = this.generateDogCard(pedigreeTree.paternalGrandfather, this.t('grandfatherLabel'), false, 2);
            const paternalGrandmotherCard = this.generateDogCard(pedigreeTree.paternalGrandmother, this.t('grandmotherLabel'), false, 2);
            const maternalGrandfatherCard = this.generateDogCard(pedigreeTree.maternalGrandfather, this.t('grandfatherLabel'), false, 2);
            const maternalGrandmotherCard = this.generateDogCard(pedigreeTree.maternalGrandmother, this.t('grandmotherLabel'), false, 2);
            
            // Overgrootouders (eenvoudige versie)
            const paternalGreatGrandfather1Card = this.generateDogCard(pedigreeTree.paternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
            const paternalGreatGrandmother1Card = this.generateDogCard(pedigreeTree.paternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
            const paternalGreatGrandfather2Card = this.generateDogCard(pedigreeTree.paternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
            const paternalGreatGrandmother2Card = this.generateDogCard(pedigreeTree.paternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
            const maternalGreatGrandfather1Card = this.generateDogCard(pedigreeTree.maternalGreatGrandfather1, this.t('greatGrandfatherLabel'), false, 3);
            const maternalGreatGrandmother1Card = this.generateDogCard(pedigreeTree.maternalGreatGrandmother1, this.t('greatGrandmotherLabel'), false, 3);
            const maternalGreatGrandfather2Card = this.generateDogCard(pedigreeTree.maternalGreatGrandfather2, this.t('greatGrandfatherLabel'), false, 3);
            const maternalGreatGrandmother2Card = this.generateDogCard(pedigreeTree.maternalGreatGrandmother2, this.t('greatGrandmotherLabel'), false, 3);
            
            // Over-overgrootouders (eenvoudige versie)
            const paternalGreatGreatGrandfather1Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather1, this.t('greatGreatGrandfatherLabel'), false, 4);
            const paternalGreatGreatGrandmother1Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother1, this.t('greatGreatGrandmotherLabel'), false, 4);
            const paternalGreatGreatGrandfather2Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather2, this.t('greatGreatGrandfatherLabel'), false, 4);
            const paternalGreatGreatGrandmother2Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother2, this.t('greatGreatGrandmotherLabel'), false, 4);
            const paternalGreatGreatGrandfather3Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather3, this.t('greatGreatGrandfatherLabel'), false, 4);
            const paternalGreatGreatGrandmother3Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother3, this.t('greatGreatGrandmotherLabel'), false, 4);
            const paternalGreatGreatGrandfather4Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandfather4, this.t('greatGreatGrandfatherLabel'), false, 4);
            const paternalGreatGreatGrandmother4Card = this.generateDogCard(pedigreeTree.paternalGreatGreatGrandmother4, this.t('greatGreatGrandmotherLabel'), false, 4);
            const maternalGreatGreatGrandfather1Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather1, this.t('greatGreatGrandfatherLabel'), false, 4);
            const maternalGreatGreatGrandmother1Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother1, this.t('greatGreatGrandmotherLabel'), false, 4);
            const maternalGreatGreatGrandfather2Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather2, this.t('greatGreatGrandfatherLabel'), false, 4);
            const maternalGreatGreatGrandmother2Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother2, this.t('greatGreatGrandmotherLabel'), false, 4);
            const maternalGreatGreatGrandfather3Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather3, this.t('greatGreatGrandfatherLabel'), false, 4);
            const maternalGreatGreatGrandmother3Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother3, this.t('greatGreatGrandmotherLabel'), false, 4);
            const maternalGreatGreatGrandfather4Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandfather4, this.t('greatGreatGrandfatherLabel'), false, 4);
            const maternalGreatGreatGrandmother4Card = this.generateDogCard(pedigreeTree.maternalGreatGreatGrandmother4, this.t('greatGreatGrandmotherLabel'), false, 4);
            
            const gridHTML = `
                <div class="rtc-pedigree-grid-compact">
                    <!-- Generatie 0: Toekomstige Pup -->
                    <div class="rtc-pedigree-generation-col gen0">
                        ${mainDogCard}
                    </div>
                    
                    <!-- Generatie 1: Ouders -->
                    <div class="rtc-pedigree-generation-col gen1">
                        ${fatherCard}
                        ${motherCard}
                    </div>
                    
                    <!-- Generatie 2: Grootouders -->
                    <div class="rtc-pedigree-generation-col gen2">
                        ${paternalGrandfatherCard}
                        ${paternalGrandmotherCard}
                        ${maternalGrandfatherCard}
                        ${maternalGrandmotherCard}
                    </div>
                    
                    <!-- Generatie 3: Overgrootouders -->
                    <div class="rtc-pedigree-generation-col gen3">
                        ${paternalGreatGrandfather1Card}
                        ${paternalGreatGrandmother1Card}
                        ${paternalGreatGrandfather2Card}
                        ${paternalGreatGrandmother2Card}
                        ${maternalGreatGrandfather1Card}
                        ${maternalGreatGrandmother1Card}
                        ${maternalGreatGrandfather2Card}
                        ${maternalGreatGrandmother2Card}
                    </div>
                    
                    <!-- Generatie 4: Over-overgrootouders -->
                    <div class="rtc-pedigree-generation-col gen4">
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
            
            // Voeg click events toe
            this.setupCardClickEvents();
            
        } catch (error) {
            console.error('❌ Fout bij renderen stamboom:', error);
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-danger display-4"></i>
                    <p class="mt-3">Er is een fout opgetreden bij het laden van de stamboom.</p>
                    <button class="btn btn-primary mt-2" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise"></i> Opnieuw proberen
                    </button>
                </div>
            `;
        }
    }
    
    buildFuturePuppyPedigreeTree(futurePuppy, selectedTeef, selectedReu) {
        const pedigreeTree = {
            mainDog: futurePuppy,
            father: selectedReu,
            mother: selectedTeef,
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
            // Over-overgrootouders velden
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
        
        console.log('🔍 Bouw stamboom voor toekomstige pup...');
        
        // Vaderlijn
        const reuVaderId = selectedReu.vaderId || selectedReu.vader_id;
        if (reuVaderId) {
            pedigreeTree.paternalGrandfather = this.getDogById(reuVaderId);
        }
        
        const reuMoederId = selectedReu.moederId || selectedReu.moeder_id;
        if (reuMoederId) {
            pedigreeTree.paternalGrandmother = this.getDogById(reuMoederId);
        }
        
        // Moederlijn
        const teefVaderId = selectedTeef.vaderId || selectedTeef.vader_id;
        if (teefVaderId) {
            pedigreeTree.maternalGrandfather = this.getDogById(teefVaderId);
        }
        
        const teefMoederId = selectedTeef.moederId || selectedTeef.moeder_id;
        if (teefMoederId) {
            pedigreeTree.maternalGrandmother = this.getDogById(teefMoederId);
        }
        
        // Overgrootouders
        if (pedigreeTree.paternalGrandfather) {
            const vaderId = pedigreeTree.paternalGrandfather.vaderId || pedigreeTree.paternalGrandfather.vader_id;
            const moederId = pedigreeTree.paternalGrandfather.moederId || pedigreeTree.paternalGrandfather.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.paternalGrandmother) {
            const vaderId = pedigreeTree.paternalGrandmother.vaderId || pedigreeTree.paternalGrandmother.vader_id;
            const moederId = pedigreeTree.paternalGrandmother.moederId || pedigreeTree.paternalGrandmother.moeder_id;
            
            if (vaderId) pedigreeTree.paternalGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.paternalGreatGrandmother2 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGrandfather) {
            const vaderId = pedigreeTree.maternalGrandfather.vaderId || pedigreeTree.maternalGrandfather.vader_id;
            const moederId = pedigreeTree.maternalGrandfather.moederId || pedigreeTree.maternalGrandfather.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGrandfather1 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGrandmother1 = this.getDogById(moederId);
        }
        
        if (pedigreeTree.maternalGrandmother) {
            const vaderId = pedigreeTree.maternalGrandmother.vaderId || pedigreeTree.maternalGrandmother.vader_id;
            const moederId = pedigreeTree.maternalGrandmother.moederId || pedigreeTree.maternalGrandmother.moeder_id;
            
            if (vaderId) pedigreeTree.maternalGreatGrandfather2 = this.getDogById(vaderId);
            if (moederId) pedigreeTree.maternalGreatGrandmother2 = this.getDogById(moederId);
        }
        
        console.log('✅ Stamboom opgebouwd voor toekomstige pup');
        return pedigreeTree;
    }
    
    generateDogCard(dog, relation = '', isMainDog = false, generation = 0) {
        if (!dog) {
            return `
                <div class="rtc-pedigree-card-compact horizontal empty gen${generation}" data-dog-id="0">
                    <div class="rtc-pedigree-card-header-compact horizontal bg-secondary">
                        <div class="rtc-relation-compact">
                            <span class="rtc-relation-text">${relation}</span>
                            ${isMainDog ? '<span class="rtc-main-dot">★</span>' : ''}
                        </div>
                        <div class="rtc-gender-icon-compact">
                            <i class="bi bi-question-circle text-secondary"></i>
                        </div>
                    </div>
                    <div class="rtc-pedigree-card-body-compact horizontal text-center py-3">
                        <div class="rtc-no-data-text">${this.t('noData')}</div>
                    </div>
                </div>
            `;
        }
        
        const genderIcon = dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 
                          dog.geslacht === 'teven' ? 'bi-gender-female text-danger' : 'bi-question-circle text-secondary';
        
        const mainDogClass = isMainDog ? 'main-dog-compact' : '';
        const headerColor = isMainDog ? 'bg-success' : 'bg-secondary';
        
        // Voor generatie 4: alleen naam en kennel
        if (generation === 4) {
            const combinedName = dog.naam || this.t('unknown');
            const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
            const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
            
            return `
                <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                     data-dog-id="${dog.id}" 
                     data-dog-name="${dog.naam || ''}"
                     data-relation="${relation}"
                     data-generation="${generation}"
                     data-has-photos="false">
                    <div class="rtc-pedigree-card-header-compact horizontal ${headerColor}">
                        <div class="rtc-relation-compact">
                            <span class="rtc-relation-text">${relation}</span>
                            ${isMainDog ? '<span class="rtc-main-dot">★</span>' : ''}
                        </div>
                        <div class="rtc-gender-icon-compact">
                            <i class="bi ${genderIcon}"></i>
                        </div>
                    </div>
                    <div class="rtc-pedigree-card-body-compact horizontal">
                        <div class="rtc-card-row rtc-card-row-1-only">
                            <div class="rtc-dog-name-kennel-compact" title="${fullDisplayText}">
                                ${fullDisplayText}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Voor generaties 0-3: volledige informatie
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const fullDisplayText = combinedName + (showKennel ? ` ${dog.kennelnaam}` : '');
        
        return `
            <div class="rtc-pedigree-card-compact horizontal ${dog.geslacht === 'reuen' ? 'male' : 'female'} ${mainDogClass} gen${generation}" 
                 data-dog-id="${dog.id}" 
                 data-dog-name="${dog.naam || ''}"
                 data-relation="${relation}"
                 data-generation="${generation}"
                 data-has-photos="false">
                <div class="rtc-pedigree-card-header-compact horizontal ${headerColor}">
                    <div class="rtc-relation-compact">
                        <span class="rtc-relation-text">${relation}</span>
                        ${isMainDog ? '<span class="rtc-main-dot">★</span>' : ''}
                    </div>
                    <div class="rtc-gender-icon-compact">
                        <i class="bi ${genderIcon}"></i>
                    </div>
                </div>
                <div class="rtc-pedigree-card-body-compact horizontal">
                    <div class="rtc-card-row rtc-card-row-1">
                        <div class="rtc-dog-name-kennel-compact" title="${fullDisplayText}">
                            ${fullDisplayText}
                        </div>
                    </div>
                    
                    <div class="rtc-card-row rtc-card-row-2">
                        ${dog.stamboomnr ? `
                        <div class="rtc-dog-pedigree-compact" title="${dog.stamboomnr}">
                            ${dog.stamboomnr}
                        </div>
                        ` : ''}
                        
                        ${dog.ras ? `
                        <div class="rtc-dog-breed-compact" title="${dog.ras}">
                            ${dog.ras}
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="rtc-card-row rtc-card-row-3">
                        <div class="rtc-click-hint-compact">
                            <i class="bi bi-info-circle"></i> ${this.t('clickForDetails')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupCardClickEvents() {
        const cards = document.querySelectorAll('.rtc-pedigree-card-compact.horizontal:not(.empty)');
        cards.forEach(card => {
            card.addEventListener('click', async (e) => {
                const dogId = parseInt(card.getAttribute('data-dog-id'));
                if (dogId === 0 || dogId === -999999) return; // Skip lege cards en toekomstige pup
                
                const dog = this.getDogById(dogId);
                if (!dog) return;
                
                const relation = card.getAttribute('data-relation') || '';
                await this.showDogDetailPopup(dog, relation);
            });
        });
    }
    
    async showDogDetailPopup(dog, relation) {
        const overlay = document.getElementById('rtcPedigreePopupOverlay');
        const container = document.getElementById('rtcPedigreePopupContainer');
        
        if (!overlay || !container) return;
        
        const popupHTML = await this.getDogDetailPopupHTML(dog, relation);
        container.innerHTML = popupHTML;
        
        overlay.style.display = 'flex';
        
        const closeButtons = container.querySelectorAll('.rtc-btn-close, .rtc-popup-close-btn');
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
    }
    
    async getDogDetailPopupHTML(dog, relation = '') {
        if (!dog) return '';
        
        const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                          dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
        
        const combinedName = dog.naam || this.t('unknown');
        const showKennel = dog.kennelnaam && dog.kennelnaam.trim() !== '';
        const kennelSuffix = showKennel ? ` ${dog.kennelnaam}` : '';
        const headerText = combinedName + kennelSuffix;
        
        // COI waarden (standaard 0.0 in deze vereenvoudigde versie)
        const coiValues = { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        const coiColor = this.getCOIColor(coiValues.coi6Gen);
        
        return `
            <div class="rtc-dog-detail-popup">
                <div class="rtc-popup-header">
                    <h5 class="rtc-popup-title">
                        <i class="bi ${dog.geslacht === 'reuen' ? 'bi-gender-male text-primary' : 'bi-gender-female text-danger'} me-2"></i>
                        ${headerText}
                    </h5>
                    <button type="button" class="rtc-btn-close" aria-label="Sluiten"></button>
                </div>
                <div class="rtc-popup-body">
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-card-text me-1"></i> Basisgegevens</h6>
                        <div class="rtc-info-grid">
                            <div class="rtc-info-row">
                                ${dog.stamboomnr ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">Stamboomnummer:</span>
                                    <span class="rtc-info-value">${dog.stamboomnr}</span>
                                </div>
                                ` : ''}
                                
                                ${dog.ras ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">Ras:</span>
                                    <span class="rtc-info-value">${dog.ras}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">Geslacht:</span>
                                    <span class="rtc-info-value">${genderText}</span>
                                </div>
                                
                                ${dog.vachtkleur ? `
                                <div class="rtc-info-item rtc-info-item-half">
                                    <span class="rtc-info-label">Vachtkleur:</span>
                                    <span class="rtc-info-value">${dog.vachtkleur}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <!-- DRIE WAARDES NAAST ELKAAR -->
                            <div class="rtc-three-values-row">
                                <!-- COI 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">COI 6 Gen</div>
                                    <div class="rtc-value-number rtc-coi-value" style="color: ${coiColor} !important;">${coiValues.coi6Gen}%</div>
                                </div>
                                
                                <!-- Homozygotie 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">Homozygotie 6 Gen</div>
                                    <div class="rtc-value-number">${coiValues.homozygosity6Gen}%</div>
                                </div>
                                
                                <!-- Kinship 6 Gen -->
                                <div class="rtc-value-box">
                                    <div class="rtc-value-label">Kinship 6 Gen</div>
                                    <div class="rtc-value-number">${coiValues.kinship6Gen}%</div>
                                </div>
                            </div>
                            
                            ${dog.geboortedatum ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Geboortedatum:</span>
                                    <span class="rtc-info-value">${this.formatDate(dog.geboortedatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.overlijdensdatum ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Overlijdensdatum:</span>
                                    <span class="rtc-info-value">${this.formatDate(dog.overlijdensdatum)}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.land ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Land:</span>
                                    <span class="rtc-info-value">${dog.land}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.postcode ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Postcode:</span>
                                    <span class="rtc-info-value">${dog.postcode}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-heart-pulse me-1"></i> Gezondheidsinformatie</h6>
                        <div class="rtc-info-grid">
                            ${dog.heupdysplasie ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Heupdysplasie:</span>
                                    <span class="rtc-info-value"><span class="badge badge-hd">${dog.heupdysplasie}</span></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.elleboogdysplasie ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Elleboogdysplasie:</span>
                                    <span class="rtc-info-value"><span class="badge badge-ed">${dog.elleboogdysplasie}</span></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.patella ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full">
                                    <span class="rtc-info-label">Patella Luxatie:</span>
                                    <span class="rtc-info-value"><span class="badge badge-pl">${dog.patella}</span></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogen ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full {
                                    <span class="rtc-info-label">Ogen:</span>
                                    <span class="rtc-info-value"><span class="badge badge-eyes">${dog.ogen}</span></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.ogenVerklaring ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full {
                                    <span class="rtc-info-label">Ogen Verklaring:</span>
                                    <span class="rtc-info-value">${dog.ogenVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.dandyWalker ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full {
                                    <span class="rtc-info-label">Dandy Walker Malformation:</span>
                                    <span class="rtc-info-value"><span class="badge badge-dandy">${dog.dandyWalker}</span></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklier ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full {
                                    <span class="rtc-info-label">Schildklier:</span>
                                    <span class="rtc-info-value"><span class="badge badge-thyroid">${dog.schildklier}</span></span>
                                </div>
                            </div>
                            ` : ''}
                            
                            ${dog.schildklierVerklaring ? `
                            <div class="rtc-info-row">
                                <div class="rtc-info-item rtc-info-item-full {
                                    <span class="rtc-info-label">Schildklier Verklaring:</span>
                                    <span class="rtc-info-value">${dog.schildklierVerklaring}</span>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${dog.opmerkingen ? `
                    <div class="rtc-info-section mb-2">
                        <h6><i class="bi bi-chat-text me-1"></i> Opmerkingen</h6>
                        <div class="rtc-remarks-box">
                            ${dog.opmerkingen}
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="rtc-popup-footer">
                    <button type="button" class="btn btn-secondary rtc-popup-close-btn">
                        <i class="bi bi-x-circle me-1"></i> ${this.t('closePopup')}
                    </button>
                </div>
            </div>
        `;
    }
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
    }
    
    showAlert(message, type = 'info') {
        // Verwijder bestaande alerts
        document.querySelectorAll('.alert-dismissible').forEach(alert => {
            if (alert.parentNode) {
                alert.remove();
            }
        });
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const content = document.getElementById('breedingContent');
        if (content) {
            content.insertBefore(alertDiv, content.firstChild);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    const bsAlert = new bootstrap.Alert(alertDiv);
                    bsAlert.close();
                }
            }, 5000);
        }
    }
}

window.reuTeefCombinatie = null;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}