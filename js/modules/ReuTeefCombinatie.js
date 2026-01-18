/**
 * Reu en Teef Combinatie Module - HOOFDBESTAND
 * Voor het maken van fokplannen met specifieke reu en teef
 */

import { hondenService } from './supabase-honden.js';

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
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
                selectDogFirst: "Wählen Sie zuerst einen Rüden und eine Hündin",
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
                elbowDysplasia: "Ellbogendysplasie",
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
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    
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
        const cacheKey = `has_${dogId}_${dog.stamboomnr}`;
        if (this.dogHasPhotosCache.has(cacheKey)) {
            return this.dogHasPhotosCache.get(cacheKey);
        }
        try {
            const hasPhotos = await this.db.checkFotosExist(dog.stamboomnr);
            this.dogHasPhotosCache.set(cacheKey, hasPhotos);
            return hasPhotos;
        } catch (error) {
            console.error('Fout bij checken foto\'s voor hond:', dogId, error);
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
            const thumbnails = await this.db.getFotoThumbnails(dog.stamboomnr, limit);
            this.dogThumbnailsCache.set(cacheKey, thumbnails || []);
            return thumbnails || [];
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
            const foto = await this.db.getFotoById(fotoId);
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
        
        // Laad honden data
        await this.loadAllHonden();
        
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
        
        // Setup autocomplete voor teef
        this.setupAutocomplete('teefSearch', 'teefSearchResults', 'teven', (hond) => {
            this.selectTeef(hond);
        });
        
        // Setup autocomplete voor reu
        this.setupAutocomplete('reuSearch', 'reuSearchResults', 'reuen', (hond) => {
            this.selectReu(hond);
        });
        
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
    
    async loadAllHonden() {
        try {
            if (hondenService && typeof hondenService.getHonden === 'function') {
                this.allHonden = await hondenService.getHonden();
                console.log(`✅ Geladen: ${this.allHonden.length} honden uit database voor ReuTeefCombinatie`);
                
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
            } else {
                console.error('❌ Database niet beschikbaar of getHonden functie ontbreekt');
                this.allHonden = [];
            }
        } catch (error) {
            console.error('❌ Fout bij laden honden:', error);
            this.allHonden = [];
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
            const hond = await hondenService.getHondByStamboomnr(id);
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
    
    async findHondByNameOrPedigree(name) {
        if (!name || !name.trim()) return null;
        
        const searchName = name.toLowerCase().trim();
        for (const hond of this.allHonden) {
            const hondNaam = hond.naam?.toLowerCase() || '';
            const stamboomnr = hond.stamboomnr?.toLowerCase() || '';
            if (hondNaam === searchName || stamboomnr === searchName) {
                return hond;
            }
        }
        
        try {
            const result = await hondenService.zoekHonden({ naam: name });
            if (result && result.length > 0) {
                result.forEach(hond => {
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
                    
                    this.hondenCache.set(volledigeHond.id, volledigeHond);
                    if (volledigeHond.stamboomnr) {
                        this.hondenCache.set(volledigeHond.stamboomnr, volledigeHond);
                    }
                    
                    const exists = this.allHonden.some(dog => dog.id === volledigeHond.id);
                    if (!exists) {
                        this.allHonden.push(volledigeHond);
                    }
                });
                return result[0];
            }
        } catch (error) {
            console.error(`❌ Fout bij zoeken hond op naam ${name}:`, error);
        }
        
        return null;
    }
    
    setupAutocomplete(inputId, resultsId, geslacht, onSelect) {
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
                await this.loadAllHonden();
            }
        });
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                dropdown.style.display = 'none';
                showInitialView();
                return;
            }
            
            let filteredHonden = this.allHonden.filter(hond => {
                if (geslacht === 'teven') {
                    return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                } else if (geslacht === 'reuen') {
                    return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                }
                return true;
            });
            
            if (searchTerm.length >= 1) {
                filteredHonden = filteredHonden.filter(dog => {
                    const naam = dog.naam ? dog.naam.toLowerCase() : '';
                    const kennelnaam = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
                    const combined = `${naam} ${kennelnaam}`;
                    return combined.startsWith(searchTerm);
                });
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
            result.vader = await this.findHondByNameOrPedigree(hond.vader);
        }
        
        if (hond.moederId) {
            result.moeder = await this.getHondById(hond.moederId);
        } else if (hond.moeder) {
            result.moeder = await this.findHondByNameOrPedigree(hond.moeder);
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
        
        // Initialiseer stamboom module als die nog niet bestaat
        if (!this.stamboomModule) {
            this.stamboomModule = new ReuTeefStamboom(this);
        }
        
        // Laad de stamboom via het aparte bestand
        await this.stamboomModule.showFuturePuppyPedigree(this.selectedTeef, this.selectedReu);
    }
    
    showAlert(message, type = 'info') {
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
    
    calculateCOI(dogId) {
        console.log('COI berekening voor database ID:', dogId);
        
        if (!dogId || dogId === 0) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        const dog = this.getDogById(dogId);
        if (!dog) return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        
        // Basisgevallen eerst
        if (!dog.vaderId || !dog.moederId) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        
        if (dog.vaderId === dog.moederId) {
            return { coi6Gen: '25.0', homozygosity6Gen: '25.0', kinship6Gen: '25.0' };
        }
        
        // GEBRUIK COICalculator.js als beschikbaar
        if (this.coiCalculator) {
            try {
                const result = this.coiCalculator.calculateCOI(dogId);
                console.log(`COI resultaat via COICalculator:`, result);
                
                // Bereken kinship - EXACT ZOALS STAMBOOMMANAGER
                const kinship = this.calculateAverageKinship(dogId, 6);
                
                return {
                    coi6Gen: result.coi6Gen || '0.0',
                    homozygosity6Gen: result.coiAllGen || '0.0',
                    kinship6Gen: kinship.toFixed(3)
                };
            } catch (error) {
                console.error('Fout in COICalculator:', error);
                // Val terug op eenvoudige berekening
            }
        } else {
            console.warn('COICalculator niet beschikbaar, gebruik eenvoudige berekening');
        }
        
        // Eenvoudige berekening als COICalculator niet werkt
        const vader = this.getDogById(dog.vaderId);
        const moeder = this.getDogById(dog.moederId);
        
        if (!vader || !moeder) {
            return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
        }
        

        // Complexe gevallen - probeer minimaal iets
        return { coi6Gen: '0.0', homozygosity6Gen: '0.0', kinship6Gen: '0.0' };
    }
    
    calculateAverageKinship(dogId, generations = 6) {
        if (!this.coiCalculator || !dogId || dogId === 0) return 0;
        
        try {
            const dog = this.getDogById(dogId);
            if (!dog || !dog.vaderId || !dog.moederId) return 0;
            
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
    
    getCOIColor(coiValue) {
        const value = parseFloat(coiValue);
        if (value < 4.0) return '#28a745';
        if (value <= 6.0) return '#fd7e14';
        return '#dc3545';
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
}

window.reuTeefCombinatie = null;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}