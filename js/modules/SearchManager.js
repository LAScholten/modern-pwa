// js/modules/SearchManager.js

/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 * Inclusief foto functionaliteit met thumbnail viewer en fullscreen viewer
 * Inclusief nakomelingen functionaliteit
 * Beide kolommen zijn nu scrollbaar
 * SUPABASE VERSIE MET PAGINATIE - FIXED VERSION
 * MET JUISTE DATABASE KOLOM NAMEN
 * **FOTO PROBLEEM OPGELOST** - Gebruikt nu EXACT DEZELFDE LOGICA als PhotoManager
 * **NAKOMELINGEN FIXED**: Nakomelingen modal blijft open, hond details in aparte modal
 * **SPECIALE TEKENS FIXED**: Zoeken negeert nu speciale tekens (ä, ö, ü, ß, etc.)
 * **PRIVEINFORMATIE TOEGEVOEGD**: Toont priveinfo als huidige gebruiker eigenaar is
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.filteredDogs = [];
        this.searchType = 'name'; // 'name' of 'kennel'
        this.stamboomManager = null; // Wordt later geïnitialiseerd
        this.isMobileCollapsed = false; // Track of mobiele weergave collapsed is
        this.dogPhotosCache = new Map(); // Cache voor hondenfoto's
        this.dogOffspringCache = new Map(); // Cache voor nakomelingen per hond
        this.isLoading = false; // Voorkom dubbele laadpogingen
        this.currentOffspringModalDogId = null; // Bewaar huidige nakomelingen hond ID
        this.currentOffspringModalDogName = null; // Bewaar huidige nakomelingen hond naam
        this.currentUserId = null; // NIEUW: Huidige gebruiker ID voor priveinfo
        this.privateInfoCache = new Map(); // NIEUW: Cache voor priveinfo per hond
        
        // Vertalingen uitgebreid met nakomelingen functionaliteit
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
                
                // Hond gegevens
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
                
                // Gezondheidsstatussen
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
                    "3": "3 - Constante luxation"
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
                thyroidStatus: {
                    "Negatief": "Tgaa Negatief",
                    "Positief": "Tgaa Positive"
                },
                
                // Labels
                grade: "Graad",
                status: "Status",
                notApplicable: "Niet van toepassing",
                viewMore: "Meer details",
                
                // Stamboom knoppen
                pedigreeButton: "Stamboom",
                pedigreeTitle: "Stamboom van {name}",
                generatingPedigree: "Stamboom genereren...",
                openPedigree: "Stamboom openen",
                pedigree4Gen: "4-generatie stamboom",
                
                // Familierelaties voor stamboom
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                
                // Foto vertalingen
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                
                // NAKOMELINGEN vertalingen
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
                showAllOffspring: "Toon alle nakomelingen",
                
                // NIEUWE VERTALINGEN
                viewDogDetails: "Bekijk hond details",
                closeDogDetails: "Sluit hond details",
                dogDetailsModalTitle: "Details van {name}",
                backToOffspring: "Terug naar nakomelingen",
                
                // PRIVEINFO VERTALINGEN
                privateInfo: "Prive Informatie",
                privateInfoOwnerOnly: "Geen informatie"
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
                
                // Dog details
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
                
                // Health statuses
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
                thyroidStatus: {
                    "Negatief": "Tgaa Negative",
                    "Positief": "Tgaa Positive"
                },
                
                // Labels
                grade: "Grade",
                status: "Status",
                notApplicable: "Not applicable",
                viewMore: "View details",
                
                // Stamboom buttons
                pedigreeButton: "Pedigree",
                pedigreeTitle: "Pedigree of {name}",
                generatingPedigree: "Generating pedigree...",
                openPedigree: "Open pedigree",
                pedigree4Gen: "4-generation pedigree",
                
                // Family relations for pedigree
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                
                // Photo translations
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                
                // OFFSPRING translations
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
                showAllOffspring: "Show all offspring",
                
                // NEW TRANSLATIONS
                viewDogDetails: "View dog details",
                closeDogDetails: "Close dog details",
                dogDetailsModalTitle: "Details of {name}",
                backToOffspring: "Back to offspring",
                
                // PRIVEINFO TRANSLATIONS
                privateInfo: "Private Information",
                privateInfoOwnerOnly: "No information"
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
                gender: "Geslacht",
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
                
                // Hund Details
                birthDate: "Geburtsdatum",
                deathDate: "Sterbedatum",
                hipDysplasia: "Hüftdysplasie",
                elbowDysplasia: "Ellbogendysplasie",
                patellaLuxation: "Patella Luxation",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker Malformation",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüse Erklärung",
                country: "Land",
                zipCode: "Postleitzahl",
                remarks: "Bemerkungen",
                healthInfo: "Gesundheitsinformationen",
                additionalInfo: "Zusätzliche informatie",
                
                // Stamboom buttons
                pedigreeButton: "Ahnentafel",
                pedigreeTitle: "Ahnentafel von {name}",
                generatingPedigree: "Ahnentafel wordt generiert...",
                openPedigree: "Ahnentafel öffnen",
                pedigree4Gen: "4-Generationen Ahnentafel",
                
                // Familienbeziehungen voor Ahnentafel
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                grandfather: "Großvater",
                grandmother: "Großmoeder",
                
                // Foto Übersetzungen
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                
                // NAKOMELINGEN Übersetzungen
                offspring: "Nachkommen",
                noOffspring: "Keine Nachkommen gefonden",
                viewOffspring: "Nachkommen anzeigen",
                offspringCount: "Nachkommen",
                offspringModalTitle: "Nachkommen von {name}",
                loadingOffspring: "Nachkommen werden geladen...",
                offspringList: "Liste der Nachkommen",
                fatherColumn: "Vater",
                motherColumn: "Mutter",
                dogName: "Hundename",
                totalOffspring: "Gesamtzahl der Nachkommen",
                birthYear: "Geburtsjahr",
                showAllOffspring: "Alle Nachkommen anzeigen",
                
                // NEUE ÜBERSETZUNGEN
                viewDogDetails: "Hunddetails ansehen",
                closeDogDetails: "Hunddetails schließen",
                dogDetailsModalTitle: "Details von {name}",
                backToOffspring: "Zurück zu Nachkommen",
                
                // PRIVEINFO ÜBERSETZUNGEN
                privateInfo: "Private Informationen",
                privateInfoOwnerOnly: "Kein information"
            }
        };
        
        // Event delegation setup voor foto clicks
        this.setupGlobalEventListeners();
    }
    
    // Inject dependencies method voor UIHandler compatibiliteit
    injectDependencies(db, auth) {
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
        console.log('SearchManager: dependencies geïnjecteerd');
    }
    
    // Initialize method voor UIHandler compatibiliteit
    async initialize() {
        console.log('SearchManager: initializing...');
        
        // NIEUW: Haal huidige gebruiker ID op voor priveinfo
        this.currentUserId = await this.getCurrentUserId();
        console.log('SearchManager: Huidige gebruiker ID:', this.currentUserId);
        
        return Promise.resolve();
    }
    
    // NIEUW: Methode om huidige gebruiker ID op te halen
    async getCurrentUserId() {
        try {
            // Methode 1: Check window.auth (vanuit je logs)
            if (window.auth && window.auth.currentUser && window.auth.currentUser.id) {
                console.log('SearchManager: Gebruiker ID gevonden via window.auth:', window.auth.currentUser.id);
                return window.auth.currentUser.id;
            }
            
            // Methode 2: Check Supabase auth
            if (window.supabase && window.supabase.auth) {
                const { data: { user } } = await window.supabase.auth.getUser();
                if (user && user.id) {
                    console.log('SearchManager: Gebruiker ID gevonden via Supabase auth:', user.id);
                    return user.id;
                }
            }
            
            // Methode 3: Check localStorage voor auth data
            const authData = localStorage.getItem('sb-auth-token') || localStorage.getItem('supabase.auth.token');
            if (authData) {
                try {
                    const parsed = JSON.parse(authData);
                    if (parsed && parsed.user && parsed.user.id) {
                        console.log('SearchManager: Gebruiker ID gevonden via localStorage:', parsed.user.id);
                        return parsed.user.id;
                    }
                } catch (e) {
                    console.error('Fout bij parsen auth data:', e);
                }
            }
            
            // Methode 4: Check voor globale variabele
            if (window.currentUserId) {
                console.log('SearchManager: Gebruiker ID gevonden via window.currentUserId:', window.currentUserId);
                return window.currentUserId;
            }
            
            // Methode 5: Haal uit je app.html logs - er is een globale auth object
            if (window.authService && window.authService.getCurrentUser) {
                const user = await window.authService.getCurrentUser();
                if (user && user.id) {
                    console.log('SearchManager: Gebruiker ID gevonden via authService:', user.id);
                    return user.id;
                }
            }
            
            console.warn('SearchManager: Geen gebruiker ID gevonden voor priveinfo - controleer authenticatie');
            return null;
            
        } catch (error) {
            console.error('Fout bij ophalen gebruiker ID:', error);
            return null;
        }
    }
    
    // NIEUW: Methode om priveinfo voor een hond op te halen
    async getPrivateInfoForDog(stamboomnr) {
        if (!this.currentUserId || !stamboomnr) {
            console.log('SearchManager: Geen gebruiker ID of stamboomnr voor priveinfo:', { 
                userId: this.currentUserId, 
                stamboomnr: stamboomnr 
            });
            return null;
        }
        
        // Check cache
        const cacheKey = `${stamboomnr}_${this.currentUserId}`;
        if (this.privateInfoCache.has(cacheKey)) {
            return this.privateInfoCache.get(cacheKey);
        }
        
        try {
            // DIRECTE SUPABASE QUERY (zelfde als StamboomManager)
            const { data, error } = await window.supabase
                .from('priveinfo')
                .select('privatenotes')
                .eq('stamboomnr', stamboomnr)
                .eq('toegevoegd_door', this.currentUserId)
                .single();
            
            if (error || !data) {
                this.privateInfoCache.set(cacheKey, null);
                return null;
            }
            
            const notes = data.privatenotes || '';
            this.privateInfoCache.set(cacheKey, notes);
            return notes;
            
        } catch (error) {
            console.error('SearchManager: Fout bij ophalen priveinfo voor hond:', stamboomnr, error);
            return null;
        }
    }
    
    // HELPER METHOD: Normalize text by removing diacritics and special characters
    normalizeText(text) {
        if (!text) return '';
        
        return text
            .toLowerCase()
            .normalize('NFD') // Decompose characters with diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
            .replace(/ß/g, 'ss') // Replace German sharp s with ss
            .trim();
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    // Setup globale event listeners eenmalig
    setupGlobalEventListeners() {
        // Event delegation voor foto thumbnail clicks
        document.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                
                const photoSrc = thumbnail.getAttribute('data-photo-src');
                const dogName = thumbnail.getAttribute('data-dog-name') || '';
                
                console.log('Foto geklikt, src:', photoSrc ? photoSrc.substring(0, 100) + '...' : 'geen src');
                
                if (photoSrc && photoSrc.trim() !== '') {
                    this.showLargePhoto(photoSrc, dogName);
                } else {
                    console.error('Geen geldige foto src gevonden in attribuut');
                    // Probeer img src als fallback
                    const imgElement = thumbnail.querySelector('img');
                    if (imgElement && imgElement.src) {
                        console.log('Gebruik img src als fallback:', imgElement.src.substring(0, 100) + '...');
                        this.showLargePhoto(imgElement.src, dogName);
                    }
                }
            }
        });
        
        // Event delegation voor grote foto sluitknoppen
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('photo-large-close') || 
                e.target.classList.contains('photo-large-close-btn') ||
                e.target.closest('.photo-large-close') ||
                e.target.closest('.photo-large-close-btn')) {
                const overlay = document.getElementById('photoLargeOverlay');
                if (overlay) {
                    this.closePhotoOverlay();
                }
            }
            
            // Klik buiten de grote foto om te sluiten
            if (e.target.id === 'photoLargeOverlay') {
                this.closePhotoOverlay();
            }
        });
        
        // Event delegation voor nakomelingen knoppen in de zoekinterface
        document.addEventListener('click', (e) => {
            const offspringBtn = e.target.closest('.offspring-button');
            if (offspringBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(offspringBtn.getAttribute('data-dog-id'));
                const dogName = offspringBtn.getAttribute('data-dog-name') || '';
                this.showOffspringModal(dogId, dogName);
            }
            
            // Sluit nakomelingen modal
            const closeOffspringBtn = e.target.closest('.offspring-modal-close');
            if (closeOffspringBtn) {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentOffspringModalDogId = null;
                        this.currentOffspringModalDogName = null;
                    }, 300);
                }
            }
            
            // Klik buiten nakomelingen modal om te sluiten
            if (e.target.id === 'offspringModalOverlay') {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentOffspringModalDogId = null;
                        this.currentOffspringModalDogName = null;
                    }, 300);
                }
            }
            
            // Sluit hond details modal
            const closeDogDetailsBtn = e.target.closest('.dog-details-modal-close');
            if (closeDogDetailsBtn) {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            // Klik buiten hond details modal om te sluiten
            if (e.target.id === 'dogDetailsModalOverlay') {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            // Terug naar nakomelingen knop in hond details modal
            const backToOffspringBtn = e.target.closest('.back-to-offspring-btn');
            if (backToOffspringBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
        });
    }
    
    // **VERBETERDE METHODE: Foto's ophalen voor een hond - EXACT ZELFDE ALS PHOTOMANAGER**
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
            // **EXACT DEZELFDE QUERY ALS PHOTOMANAGER**
            const { data: fotos, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('stamboomnr', dog.stamboomnr)
                .order('uploaded_at', { ascending: false });
            
            if (error) {
                console.error('Supabase error bij ophalen foto\'s:', error);
                return [];
            }
            
            console.log(`SearchManager: ${fotos?.length || 0} foto's gevonden voor hond ${dogId} (${dog.stamboomnr})`);
            
            this.dogPhotosCache.set(cacheKey, fotos || []);
            return fotos || [];
            
        } catch (error) {
            console.error('Fout bij ophalen foto\'s voor hond:', dogId, error);
            return [];
        }
    }
    
    // Nakomelingen ophalen voor een hond - GECORRIGEERD: gebruik vader_id en moeder_id ipv vaderId/moederId
    async getDogOffspring(dogId) {
        if (!dogId || dogId === 0) return [];
        
        // Check cache
        if (this.dogOffspringCache.has(dogId)) {
            return this.dogOffspringCache.get(dogId);
        }
        
        try {
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) return [];
            
            // DEBUG: Log voor nakomelingen zoeken
            console.log(`Zoeken naar nakomelingen van hond ID: ${dogId} (${dog.naam})`);
            
            // Zoek nakomelingen waar deze hond vader of moeder is
            // GEBRUIK JUISTE ID NAMEN: vader_id en moeder_id zoals in database
            const allDogs = this.allDogs;
            const offspring = allDogs.filter(d => {
                // Debug logging voor elke hond
                if (d.vader_id === dogId || d.moeder_id === dogId) {
                    console.log(`Nakomeling gevonden: ${d.naam} (ID: ${d.id}), vader_id: ${d.vader_id}, moeder_id: ${d.moeder_id}`);
                    return true;
                }
                return false;
            });
            
            console.log(`Totaal ${offspring.length} nakomelingen gevonden voor hond ID ${dogId}`);
            
            // Voeg ouder informatie toe aan elk nakomeling
            const offspringWithParents = offspring.map(puppy => {
                let fatherInfo = { naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                let motherInfo = { naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                
                // Haal vader info op - gebruik vader_id zoals in database
                if (puppy.vader_id) {
                    const father = allDogs.find(d => d.id === puppy.vader_id);
                    if (father) {
                        fatherInfo = {
                            naam: father.naam || this.t('unknown'),
                            stamboomnr: father.stamboomnr || '',
                            kennelnaam: father.kennelnaam || ''
                        };
                    }
                }
                
                // Haal moeder info op - gebruik moeder_id zoals in database
                if (puppy.moeder_id) {
                    const mother = allDogs.find(d => d.id === puppy.moeder_id);
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
            
            // Sorteer op geboortedatum (nieuwste eerst)
            offspringWithParents.sort((a, b) => {
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateB - dateA; // Nieuwste eerst
            });
            
            this.dogOffspringCache.set(dogId, offspringWithParents);
            return offspringWithParents;
        } catch (error) {
            console.error('Fout bij ophalen nakomelingen voor hond:', dogId, error);
            return [];
        }
    }
    
    // Aantal nakomelingen ophalen (voor display)
    async getOffspringCount(dogId) {
        const offspring = await this.getDogOffspring(dogId);
        return offspring.length;
    }
    
    // Check of een hond foto's heeft
    async checkDogHasPhotos(dogId) {
        const photos = await this.getDogPhotos(dogId);
        return photos.length > 0;
    }
    
    // **GECORRIGEERDE METHODE: Toon grote foto - ADAPTIVE VERSION**
    showLargePhoto(photoData, dogName = '') {
        console.log('Toon grote foto (SearchManager - Adaptive):', photoData ? 'data gevonden' : 'geen data');
        
        // Verwijder bestaande overlay
        const existingOverlay = document.getElementById('photoLargeOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak nieuwe overlay
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
        
        // Event listeners voor sluiten
        this.setupPhotoOverlayEvents();
    }
    
    // **NIEUWE METHODE: Pas foto grootte aan voor optimale weergave**
    adjustPhotoSize(imgElement) {
        if (!imgElement) return;
        
        const container = document.getElementById('photoLargeContainer');
        const content = document.getElementById('photoLargeContent');
        if (!container || !content) return;
        
        // Haal originele afmetingen op
        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;
        
        if (!naturalWidth || !naturalHeight) {
            console.warn('Kan foto afmetingen niet bepalen');
            return;
        }
        
        console.log(`Foto afmetingen: ${naturalWidth}x${naturalHeight}`);
        
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
        
        console.log(`Optimale grootte: ${optimalWidth}x${optimalHeight}`);
        
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
    
    // **NIEUWE METHODE: Setup event listeners voor foto overlay**
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
    
    // **NIEUWE METHODE: Sluit foto overlay netjes**
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
    
    // Toon nakomelingen modal
    async showOffspringModal(dogId, dogName = '') {
        // Verwijder bestaande overlay
        const existingOverlay = document.getElementById('offspringModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Sla huidige hond info op
        this.currentOffspringModalDogId = dogId;
        this.currentOffspringModalDogName = dogName;
        
        // Maak nieuwe overlay voor nakomelingen
        const overlayHTML = `
            <div class="offspring-modal-overlay" id="offspringModalOverlay" style="display: flex;">
                <div class="offspring-modal-container">
                    <div class="offspring-modal-header">
                        <h5 class="offspring-modal-title">
                            <i class="bi bi-people-fill me-2"></i> ${this.t('offspringModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white offspring-modal-close" aria-label="${this.t('close')}"></button>
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
        
        // Laad nakomelingen asynchroon
        this.loadAndDisplayOffspring(dogId, dogName);
        
        // Sluit met Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('offspringModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentOffspringModalDogId = null;
                        this.currentOffspringModalDogName = null;
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Clean up
        const overlay = document.getElementById('offspringModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // Laad en toon nakomelingen in modal
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
                        ${this.t('totalOffspring')}: <strong>${count}</strong>
                    </div>
                </div>
                
                <div class="offspring-list-container">
                    <h6 class="mb-3">
                        <i class="bi bi-list-ul me-2"></i> ${this.t('offspringList')}
                    </h6>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">${this.t('dogName')}</th>
                                    <th scope="col">${this.t('fatherColumn')}</th>
                                    <th scope="col">${this.t('motherColumn')}</th>
                                    <th scope="col">${this.t('pedigreeNumber')}</th>
                                    <th scope="col">${this.t('breed')}</th>
                                    <th scope="col">${this.t('birthYear')}</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            offspring.forEach((puppy, index) => {
                const birthYear = puppy.geboortedatum ? 
                    new Date(puppy.geboortedatum).getFullYear() : '?';
                
                // Format vader naam met kennel
                const fatherDisplay = puppy.fatherInfo.kennelnaam ? 
                    `${puppy.fatherInfo.naam} (${puppy.fatherInfo.kennelnaam})` : 
                    puppy.fatherInfo.naam;
                
                // Format moeder naam met kennel
                const motherDisplay = puppy.motherInfo.kennelnaam ? 
                    `${puppy.motherInfo.naam} (${puppy.motherInfo.kennelnaam})` : 
                    puppy.motherInfo.naam;
                
                html += `
                    <tr class="offspring-row" data-dog-id="${puppy.id}" data-dog-name="${puppy.naam || ''}">
                        <td class="text-muted">${index + 1}</td>
                        <td>
                            <strong class="text-primary">${puppy.naam || this.t('unknown')}</strong>
                            ${puppy.kennelnaam ? `<br><small class="text-muted">${puppy.kennelnaam}</small>` : ''}
                        </td>
                        <td>${fatherDisplay}</td>
                        <td>${motherDisplay}</td>
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
                </div>
                
                <div class="mt-4 text-center">
                    <small class="text-muted">
                        <i class="bi bi-info-circle me-1"></i>
                        ${this.t('viewDogDetails')}
                    </small>
                </div>
            `;
            
            contentDiv.innerHTML = html;
            
            // Voeg click event toe aan elke rij om hond details te tonen in APARTE MODAL
            contentDiv.querySelectorAll('.offspring-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const puppyId = parseInt(row.getAttribute('data-dog-id'));
                    const puppyName = row.getAttribute('data-dog-name');
                    
                    // Toon hond details in aparte modal
                    this.showDogDetailsModal(puppyId, puppyName);
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
    
    // **NIEUWE METHODE: Toon hond details in aparte modal**
    async showDogDetailsModal(dogId, dogName = '') {
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog) {
            this.showError(`Hond niet gevonden (ID: ${dogId})`);
            return;
        }
        
        // Verwijder bestaande hond details overlay
        const existingOverlay = document.getElementById('dogDetailsModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Maak overlay voor hond details
        const overlayHTML = `
            <div class="offspring-modal-overlay" id="dogDetailsModalOverlay" style="display: flex;">
                <div class="offspring-modal-container" style="max-width: 800px;">
                    <div class="offspring-modal-header">
                        <h5 class="offspring-modal-title">
                            <i class="bi bi-info-circle me-2"></i> ${this.t('dogDetailsModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white dog-details-modal-close" aria-label="${this.t('closeDogDetails')}"></button>
                    </div>
                    <div class="offspring-modal-body" id="dogDetailsModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loading')}</span>
                            </div>
                            <p class="mt-3">${this.t('loading')}</p>
                        </div>
                    </div>
                    <div class="offspring-modal-footer">
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-outline-secondary back-to-offspring-btn">
                                <i class="bi bi-arrow-left me-1"></i> ${this.t('backToOffspring')}
                            </button>
                            <button type="button" class="btn btn-secondary dog-details-modal-close">
                                <i class="bi bi-x-lg me-1"></i> ${this.t('closeDogDetails')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Laad en toon hond details
        await this.loadAndDisplayDogDetails(dogId);
        
        // Sluit met Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        // Clean up
        const overlay = document.getElementById('dogDetailsModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // Laad en toon hond details in de modal
    async loadAndDisplayDogDetails(dogId) {
        const contentDiv = document.getElementById('dogDetailsModalContent');
        if (!contentDiv) return;
        
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog) {
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Hond niet gevonden
                </div>
            `;
            return;
        }
        
        // Haal dezelfde hond details op als in showDogDetails
        const t = this.t.bind(this);
        
        // GEBRUIK JUISTE VELDNAMEN: vader_id en moeder_id zoals in database
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        // CORRECT: Gebruik vader_id zoals in database
        if (dog.vader_id) {
            const father = this.allDogs.find(d => d.id === dog.vader_id);
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
        
        // CORRECT: Gebruik moeder_id zoals in database
        if (dog.moeder_id) {
            const mother = this.allDogs.find(d => d.id === dog.moeder_id);
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
        
        // Check of deze hond foto's heeft
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        
        // Haal aantal nakomelingen op
        const offspringCount = await this.getOffspringCount(dog.id);
        
        // NIEUW: Haal priveinfo op voor deze hond
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
        
        console.log('SearchManager: Priveinfo voor hond:', {
            naam: dog.naam,
            stamboomnr: dog.stamboomnr,
            hasPrivateInfo: hasPrivateInfo,
            privateNotes: privateNotes ? privateNotes.substring(0, 100) + '...' : 'leeg',
            currentUserId: this.currentUserId
        });
        
        // NIEUW: PRIVEINFO SECTIE HTML
        let privateInfoHTML = '';
        if (this.currentUserId && dog.stamboomnr) {
            const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
            const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
            
            privateInfoHTML = `
                <div class="mt-4">
                    <div class="fw-bold mb-2">
                        <i class="bi ${hasPrivateInfo ? 'bi-lock-fill' : 'bi-lock'} me-1"></i>
                        ${t('privateInfo')}
                    </div>
                    ${hasPrivateInfo ? `
                    <div class="remarks-box" style="background-color: #fff3cd; border-color: #ffeaa7;">
                        ${privateNotes}
                    </div>
                    ` : `
                    <div class="text-muted">
                        <i>${t('privateInfoOwnerOnly')}</i>
                    </div>
                    `}
                </div>
            `;
        }
        
        // Genereer HTML voor hond details
        let html = `
            <div class="dog-details-content">
                <div class="details-card mb-4">
                    <div class="details-header">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="dog-name-header">${displayValue(dog.naam)}</div>
                                ${dog.kennelnaam ? `<div class="text-muted mb-2">${displayValue(dog.kennelnaam)}</div>` : ''}
                                
                                <!-- VOLGORDE: Stamboomnummer + Ras + Geslacht + Vachtkleur + Nakomelingen - ACHTER ELKAAR -->
                                <div class="dog-detail-header-line mt-2">
                                    ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                    ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                    <span class="geslacht">${genderText}</span>
                                    ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                      `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                      `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                                    
                                    <!-- NAKOMELINGEN KNOOP -->
                                    ${offspringCount > 0 ? `
                                    <a href="#" class="offspring-badge offspring-button" 
                                       data-dog-id="${dog.id}" 
                                       data-dog-name="${displayValue(dog.naam)}">
                                        <i class="bi bi-people-fill"></i>
                                        ${offspringCount} ${t('offspringCount')}
                                    </a>
                                    ` : `
                                    <span class="offspring-badge" style="background: #6c757d; cursor: default;">
                                        <i class="bi bi-people"></i>
                                        0 ${t('offspringCount')}
                                    </span>
                                    `}
                                </div>
                            </div>
                            <div class="text-end">
                                <!-- Geboortedatum -->
                                ${dog.geboortedatum ? `
                                <div class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>
                                    ${formatDate(dog.geboortedatum)}
                                </div>
                                ` : ''}
                                
                                <!-- Overlijdensdatum -->
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
                
                <!-- FOTO'S SECTIE -->
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
                        <!-- Foto's worden hier ingeladen -->
                    </div>
                </div>
                ` : ''}
                
                <!-- OUDERS SECTIE -->
                <div class="info-group mb-4">
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
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- GEZONDHEIDSINFO -->
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
                            <div class="fw-bold mb-1">${t('thyroid')}</div>
                            <div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>
                            ${dog.schildklierverklaring ? `<div class="text-muted small mt-1">${dog.schildklierverklaring}</div>` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- EXTRA INFO -->
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
                    
                    <!-- NIEUW: PRIVEINFO SECTIE -->
                    ${privateInfoHTML}
                </div>
            </div>
        `;
        
        contentDiv.innerHTML = html;
        
        // Laad foto's asynchroon
        if (hasPhotos) {
            this.loadAndDisplayPhotosForModal(dog);
        }
        
        // Event listeners voor nakomelingen knoop
        contentDiv.querySelectorAll('.offspring-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newDogId = parseInt(btn.getAttribute('data-dog-id'));
                const newDogName = btn.getAttribute('data-dog-name') || '';
                
                // Sluit huidige hond details modal
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
                
                // Toon nakomelingen voor deze nieuwe hond
                this.showOffspringModal(newDogId, newDogName);
            });
        });
    }
    
    // Laad en toon foto's voor de hond details modal
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
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close')}" id="searchModalCloseBtn"></button>
                        </div>
                        <div class="modal-body p-0 flex-grow-1">
                            <div class="container-fluid h-100">
                                <div class="row h-100">
                                    <!-- Zoekkolom - scrollbaar gemaakt -->
                                    <div class="col-md-5 border-end p-0" id="searchColumn">
                                        <div class="h-100 d-flex flex-column">
                                            <!-- Vaste header voor zoekfunctionaliteit -->
                                            <div class="sticky-top bg-white z-1 border-bottom" style="top: 0;">
                                                <!-- Tab knoppen voor zoektype -->
                                                <div class="p-3 pb-2">
                                                    <div class="d-flex mb-3">
                                                        <button type="button" class="btn btn-search-type btn-outline-info active me-2" data-search-type="name">
                                                            ${t('searchName')}
                                                        </button>
                                                        <button type="button" class="btn btn-search-type btn-outline-info" data-search-type="kennel">
                                                            ${t('searchKennel')}
                                                        </button>
                                                    </div>
                                                    
                                                    <!-- Zoekveld voor naam -->
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
                                                    
                                                    <!-- Zoekveld voor kennelnaam -->
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
                                            
                                            <!-- Scrollbaar gedeelte voor zoekresultaten -->
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
                                    
                                    <!-- Details kolom - scrollbaar gemaakt -->
                                    <div class="col-md-7 p-0" id="detailsColumn">
                                        <div class="h-100 d-flex flex-column">
                                            <!-- Vaste header voor details -->
                                            <div class="d-none d-md-block sticky-top bg-white z-1 border-bottom" style="top: 0;">
                                                <div class="p-3">
                                                    <h6 class="mb-0 text-muted">
                                                        <i class="bi bi-info-circle me-2"></i> ${t('dogDetails')}
                                                    </h6>
                                                </div>
                                            </div>
                                            
                                            <!-- Scrollbaar gedeelte voor hond details -->
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
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="searchModalCloseBtnFooter">
                                <i class="bi bi-x-circle me-1"></i> ${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Nakomelingen overlay -->
            <style>
                /* RESET VOOR STAMBOOM MODAL */
                .modal-dialog.modal-fullscreen .modal-content {
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                }
                
                .modal-dialog.modal-fullscreen .modal-body {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                .pedigree-container-compact {
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 100vw !important;
                    max-width: 100vw !important;
                }
                
                .pedigree-grid-compact {
                    padding: 0 !important;
                    margin: 0 !important;
                    width: 100vw !important;
                }
                
                .pedigree-generation-row {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                /* SEARCH MANAGER STYLES */
                .modal-xl.modal-fullscreen-lg-down {
                    max-width: 95vw;
                    height: 90vh;
                }
                
                @media (max-width: 992px) {
                    .modal-xl.modal-fullscreen-lg-down {
                        max-width: 100vw;
                        height: 100vh;
                        margin: 0;
                    }
                }
                
                .search-input {
                    font-size: 1.1rem;
                    padding: 10px 15px;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    transition: all 0.3s;
                }
                
                .search-input:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
                }
                
                .btn-search-type {
                    flex: 1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                
                .btn-search-type.active {
                    background-color: #0d6efd;
                    color: white;
                    border-color: #0d6efd;
                }
                
                /* ZOEKRESULTATEN CONTAINER STYLES - scrollbaar */
                #searchResultsContainer {
                    max-height: calc(100vh - 200px);
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                /* DETAILS CONTAINER STYLES - scrollbaar */
                #detailsContainer {
                    max-height: calc(100vh - 150px);
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
                .dog-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    padding: 12px 15px;
                    background: white;
                }
                
                .dog-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd;
                    transform: translateX(3px);
                }
                
                .dog-result-item.selected {
                    background-color: #e8f4fd;
                    border-color: #0d6efd;
                    border-left: 4px solid #0d6efd;
                }
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0d6efd;
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
                    padding-bottom: 8px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .details-card {
                    border-radius: 8px;
                    border: 1px solid #dee2e6;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .details-header {
                    background: white;
                    color: #212529;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .details-body {
                    padding: 20px;
                    background: white;
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
                
                .info-row {
                    display: flex;
                    margin-bottom: 8px;
                    padding: 8px 0;
                    border-bottom: 1px solid #f8f9fa;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #495057;
                    width: 180px;
                    min-width: 180px;
                }
                
                .info-value {
                    color: #212529;
                    flex: 1;
                }
                
                .badge-hd {
                    background-color: #20c997;
                    color: white;
                }
                
                .badge-ed {
                    background-color: #6f42c1;
                    color: white;
                }
                
                .badge-pl {
                    background-color: #fd7e14;
                    color: white;
                }
                
                .badge-eyes {
                    background-color: #17a2b8;
                    color: white;
                }
                
                .badge-dandy {
                    background-color: #e83e8c;
                    color: white;
                }
                
                .badge-thyroid {
                    background-color: #28a745;
                    color: white;
                }
                
                .father-card {
                    background: #e8f4fd;
                    border: 1px solid #cfe2ff;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .father-card:hover {
                    background: #d1e7ff;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .mother-card {
                    background: #fce8f1;
                    border: 1px solid #f8d7e3;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .mother-card:hover {
                    background: #f9d9e9;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .parent-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #0d6efd;
                    margin-bottom: 5px;
                }
                
                .parent-mother-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #dc3545;
                    margin-bottom: 5px;
                }
                
                .parent-info {
                    color: #6c757d;
                    font-size: 0.85rem;
                }
                
                .click-hint {
                    font-size: 0.75rem;
                    color: #6c757d;
                    margin-top: 8px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                
                .back-button {
                    margin-bottom: 15px;
                }
                
                .remarks-box {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 15px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #495057;
                }
                
                .empty-state {
                    color: #adb5bd;
                    font-style: italic;
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
                
                .dog-detail-header-line .geslacht {
                    font-weight: 600;
                    color: #0d6efd;
                }
                
                .dog-detail-header-line .ras {
                    font-weight: 500;
                }
                
                .dog-detail-header-line .stamboom {
                    font-weight: 700;
                    color: #212529;
                }
                
                /* AANPASSING: vachtkleur en nakomelingen nu in dezelfde grootte als de rest */
                .dog-detail-header-line .vachtkleur,
                .dog-detail-header-line .offspring-badge {
                    font-size: 0.95rem; /* Zelfde grootte als de andere elementen */
                }
                
                .dog-detail-header-line .vachtkleur {
                    color: #d63384;
                    font-weight: 500;
                }
                
                /* STIJL VOOR NAKOMELINGEN BADGE/KNOP */
                .offspring-badge {
                    background: linear-gradient(135deg, #6f42c1, #0d6efd);
                    color: white !important;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    text-decoration: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .offspring-badge:hover {
                    background: linear-gradient(135deg, #0d6efd, #6f42c1);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    color: white !important;
                    text-decoration: none;
                }
                
                .offspring-badge:active {
                    transform: translateY(0);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                
                /* ============================================= */
                /* FOTO STYLES - OPTIMIZED */
                /* ============================================= */
                /* FOTO'S SECTIE IN DETAILS - OPTIMIZED LAYOUT */
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
                
                .photos-title-text {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .click-hint-text {
                    font-size: 0.75rem;
                    color: #6c757d;
                    font-style: italic;
                    font-weight: normal;
                    text-transform: none;
                    letter-spacing: normal;
                }
                
                .photos-grid-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-top: 5px;
                    justify-content: flex-start;
                    min-height: auto;
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
                    flex-shrink: 0;
                }
                
                .photo-thumbnail:hover {
                    border-color: #0d6efd;
                    transform: scale(1.1);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.15);
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
                
                .photo-hover i {
                    color: white;
                    font-size: 0.8rem;
                }
                
                /* ============================================= */
                /* GROTE FOTO OVERLAY STYLES - ADAPTIVE CONTAINER */
                /* ============================================= */
                .photo-large-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.97);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.2s;
                }
                
                .photo-large-container {
                    background: #000;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    margin: 0;
                    border: none;
                    border-radius: 4px;
                    box-shadow: 0 15px 50px rgba(0,0,0,0.9);
                    position: relative;
                    max-width: 95vw;
                    max-height: 95vh;
                }
                
                .photo-large-header {
                    padding: 10px 15px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    backdrop-filter: blur(5px);
                }
                
                .photo-large-header .modal-title {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 500;
                    max-width: 70%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: white;
                }
                
                .photo-large-close {
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    color: white;
                    opacity: 0.9;
                    font-size: 1.2rem;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }
                
                .photo-large-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.25);
                }
                
                .photo-large-content {
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex: 1;
                    width: 100%;
                    height: 100%;
                    background: #000;
                }
                
                .photo-large-img {
                    display: block;
                    object-fit: contain;
                    width: 100%;
                    height: 100%;
                }
                
                .photo-large-footer {
                    padding: 10px 15px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    text-align: center;
                    flex-shrink: 0;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    backdrop-filter: blur(5px);
                }
                
                .photo-large-close-btn {
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    min-width: 90px;
                    font-size: 0.9rem;
                    padding: 6px 15px;
                    transition: all 0.2s;
                    border-radius: 4px;
                }
                
                .photo-large-close-btn:hover {
                    background: #5a6268;     /* <-- TOEVOEGEN */
                    border-color: #545b62;   /* <-- TOEVOEGEN */
                    color: white;            /* <-- TOEVOEGEN */
                }
                
                /* Hide controls when not hovering for cleaner view */
                .photo-large-header,
                .photo-large-footer {
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .photo-large-container:hover .photo-large-header,
                .photo-large-container:hover .photo-large-footer {
                    opacity: 1;
                }
                
                /* ============================================= */
                /* NAKOMELINGEN MODAL STYLES - AANGEPAST VOOR MOBIEL */
                /* ============================================= */
                .offspring-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 1080;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s;
                }
                
                .offspring-modal-container {
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
                
                .offspring-modal-header {
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #6f42c1, #0d6efd);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .offspring-modal-title {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                }
                
                .offspring-modal-body {
                    padding: 20px;
                    overflow-y: auto;
                    flex: 1;
                    max-height: 60vh;
                }
                
                .offspring-modal-footer {
                    padding: 15px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                    text-align: right;
                }
                
                .offspring-stats .alert {
                    margin-bottom: 0;
                    border-radius: 8px;
                }
                
                .offspring-row {
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .offspring-row:hover {
                    background-color: #e8f4fd;
                }
                
                .offspring-row td {
                    vertical-align: middle;
                }
                
                /* HOND DETAILS MODAL STYLES */
                .dog-details-content {
                    padding: 5px;
                }
                
                .dog-details-content .details-card {
                    margin-bottom: 20px;
                }
                
                .dog-details-content .photos-section {
                    margin-top: 15px;
                }
                
                /* MOBILE BACK BUTTON STYLES */
                .mobile-back-button {
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    background: white;
                    padding: 10px 15px;
                    margin: -15px -15px 15px -15px;
                    border-bottom: 1px solid #dee2e6;
                }
                
                .mobile-back-button button {
                    width: 100%;
                }
                
                /* Z-INDEX LAYERING */
                #searchModal {
                    z-index: 1055;
                }
                
                #offspringModalOverlay {
                    z-index: 1090;
                }
                
                #dogDetailsModalOverlay {
                    z-index: 1100;
                }
                
                #photoLargeOverlay {
                    z-index: 1110;
                }
                
                /* Scrollbar styling */
                #searchResultsContainer::-webkit-scrollbar,
                #detailsContainer::-webkit-scrollbar,
                .offspring-modal-body::-webkit-scrollbar {
                    width: 8px;
                }
                
                #searchResultsContainer::-webkit-scrollbar-track,
                #detailsContainer::-webkit-scrollbar-track,
                .offspring-modal-body::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                
                #searchResultsContainer::-webkit-scrollbar-thumb,
                #detailsContainer::-webkit-scrollbar-thumb,
                .offspring-modal-body::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                
                #searchResultsContainer::-webkit-scrollbar-thumb:hover,
                #detailsContainer::-webkit-scrollbar-thumb:hover,
                .offspring-modal-body::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
                
                /* Animations */
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
                
                /* Animation */
                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .photo-large-container {
                    animation: zoomIn 0.3s ease-out;
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        max-height: calc(100vh - 200px);
                        overflow-y: auto;
                    }
                    
                    .info-row {
                        flex-direction: column;
                    }
                    
                    .info-label {
                        width: 100%;
                        margin-bottom: 4px;
                    }
                    
                    .dog-name-line {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }
                    
                    /* AANPASSING: Op mobiel zorgen we dat stamboomnummer, ras, geslacht, vachtkleur en nakomelingen achter elkaar blijven */
                    .dog-details-line {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    
                    .dog-detail-header-line {
                        flex-direction: row !important;
                        flex-wrap: wrap !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    
                    /* Responsive photo adjustments */
                    .photo-thumbnail {
                        width: 40px;
                        height: 40px;
                    }
                    
                    /* ADAPTIVE CONTAINER MOBILE RESPONSIVE */
                    .photo-large-container {
                        max-width: 98vw;
                        max-height: 98vh;
                    }
                    
                    .photo-large-header {
                        padding: 8px 12px;
                    }
                    
                    .photo-large-header .modal-title {
                        font-size: 0.9rem;
                    }
                    
                    .photo-large-close {
                        width: 28px;
                        height: 28px;
                        font-size: 1.1rem;
                    }
                    
                    .photo-large-footer {
                        padding: 8px 12px;
                    }
                    
                    .photo-large-close-btn {
                        min-width: 80px;
                        font-size: 0.85rem;
                        padding: 5px 12px;
                    }
                    
                    /* Show controls by default on mobile (easier to close) */
                    .photo-large-header,
                    .photo-large-footer {
                        opacity: 1;
                    }
                    
                    /* AANPASSING: Stamboomnummer, ras, geslacht, vachtkleur en nakomelingen iets kleiner op mobiel */
                    .dog-details-line .stamboom,
                    .dog-details-line .ras,
                    .dog-details-line .geslacht,
                    .dog-details-line .vachtkleur,
                    .dog-details-line .offspring-badge,
                    .dog-detail-header-line .stamboom,
                    .dog-detail-header-line .ras,
                    .dog-detail-header-line .geslacht,
                    .dog-detail-header-line .vachtkleur,
                    .dog-detail-header-line .offspring-badge {
                        font-size: 0.85rem !important;
                    }
                    
                    /* NAKOMELINGEN MODAL AANPASSINGEN VOOR MOBIEL */
                    .offspring-modal-container {
                        width: 95% !important;
                        max-width: 95% !important;
                        margin: 0 10px !important;
                        border-radius: 8px !important;
                    }
                    
                    .offspring-modal-header {
                        padding: 12px 15px !important;
                    }
                    
                    .offspring-modal-title {
                        font-size: 1.1rem !important;
                    }
                    
                    .offspring-modal-body {
                        max-height: 70vh !important;
                        padding: 15px !important;
                    }
                    
                    .offspring-modal-footer {
                        padding: 12px 15px !important;
                    }
                    
                    .offspring-row {
                        font-size: 0.8rem !important;
                    }
                    
                    .offspring-row td {
                        padding: 6px 4px !important;
                    }
                    
                    .offspring-badge {
                        padding: 3px 8px !important;
                        font-size: 0.8rem !important;
                    }
                    
                    /* HOND DETAILS MODAL AANPASSINGEN VOOR MOBIEL */
                    #dogDetailsModalOverlay .offspring-modal-container {
                        max-height: 95vh !important;
                        max-width: 98% !important;
                    }
                    
                    #dogDetailsModalOverlay .offspring-modal-body {
                        max-height: 75vh !important;
                    }
                    
                    /* Scrollbaar maken voor kleine schermen */
                    .table-responsive {
                        max-width: 100%;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    
                    /* Verklein specifieke kolommen op zeer kleine schermen */
                    @media (max-width: 480px) {
                        /* Extra small screens for photo container */
                        .photo-large-container {
                            max-width: 100vw;
                            max-height: 100vh;
                            border-radius: 0;
                        }
                        
                        .photo-large-header {
                            padding: 6px 10px;
                        }
                        
                        .photo-large-header .modal-title {
                            font-size: 0.85rem;
                            max-width: 65%;
                        }
                        
                        .photo-large-close {
                            width: 26px;
                            height: 26px;
                            font-size: 1rem;
                        }
                        
                        .photo-large-footer {
                            padding: 6px 10px;
                        }
                        
                        .photo-large-close-btn {
                            min-width: 70px;
                            font-size: 0.8rem;
                            padding: 4px 10px;
                        }
                        
                        .offspring-modal-container {
                            width: 98% !important;
                            max-width: 98% !important;
                        }
                        
                        .offspring-modal-title {
                            font-size: 1rem !important;
                            max-width: 70%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        
                        .offspring-row {
                            font-size: 0.75rem !important;
                        }
                        
                        .offspring-row td:nth-child(3),
                        .offspring-row td:nth-child(4) {
                            max-width: 80px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                    
                    /* Extra aanpassingen voor extreem kleine schermen */
                    @media (max-width: 360px) {
                        .offspring-modal-container {
                            width: 100% !important;
                            max-width: 100% !important;
                            margin: 0 5px !important;
                            border-radius: 6px !important;
                        }
                        
                        .offspring-modal-header,
                        .offspring-modal-body,
                        .offspring-modal-footer {
                            padding: 10px !important;
                        }
                        
                        .offspring-modal-title {
                            font-size: 0.95rem !important;
                        }
                        
                        .offspring-row {
                            font-size: 0.7rem !important;
                        }
                        
                        /* Verberg enkele kolommen op zeer kleine schermen */
                        .offspring-row td:nth-child(6) {
                            display: none;
                        }
                    }
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
                    
                    .photo-large-overlay,
                    .offspring-modal-overlay,
                    #dogDetailsModalOverlay {
                        display: none !important;
                    }
                }
            </style>
        `;
    }
    
    setupEvents() {
        this.setupSearch();
    }
    
    setupSearch() {
        document.querySelectorAll('.btn-search-type').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const searchType = e.target.getAttribute('data-search-type');
                this.switchSearchType(searchType);
            });
        });
        
        this.setupNameSearch();
        this.setupKennelSearch();
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
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                // Gebruik dezelfde logica als de kennelnaam zoekfunctie
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
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', async () => {
            if (this.allDogs.length === 0) {
                await this.loadSearchData();
            }
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsByKennel(searchTerm);
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
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        const message = this.searchType === 'name' ? t('typeToSearch') : t('typeToSearchKennel');
        
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
        // Voorkom dubbele laadpogingen
        if (this.isLoading) {
            console.log('SearchManager: Al bezig met laden, skip...');
            return;
        }
        
        try {
            this.isLoading = true;
            this.showProgress("Honden laden... (0 geladen)");
            
            // GEBRUIK EXACT DEZELFDE METHODE ALS DogDataManager
            this.allDogs = await this.loadAllDogsWithPaginationDogDataManagerStyle();
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`SearchManager: ${this.allDogs.length} honden geladen voor zoeken`);
            
            // Toon standaard view na laden
            this.showInitialView();
            
        } catch (error) {
            console.error('SearchManager: Fout bij laden honden:', error);
            this.showError(`Laden mislukt: ${error.message}`);
            
            // Toon lege array bij error
            this.allDogs = [];
        } finally {
            // Zorg dat isLoading altijd wordt gereset
            this.isLoading = false;
            // Zorg ervoor dat progress altijd wordt verborgen
            this.hideProgress();
        }
    }
    
    /**
     * EXACT DEZELFDE LOADING LOGICA ALS DogDataManager
     */
    async loadAllDogsWithPaginationDogDataManagerStyle() {
        try {
            console.log('SearchManager: Laden van alle honden met paginatie (DogDataManager stijl)...');
            
            // Reset array
            let allDogs = [];
            
            let currentPage = 1;
            const pageSize = 1000; // Maximaal wat Supabase toestaat
            let hasMorePages = true;
            let totalLoaded = 0;
            
            // Loop door alle pagina's - ZELFDE LOGICA ALS DogDataManager
            while (hasMorePages) {
                console.log(`SearchManager: Laden pagina ${currentPage}...`);
                
                // Gebruik de getHonden() methode van hondenService (zelfde als DogDataManager)
                const result = await hondenService.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    // Voeg honden toe aan array
                    allDogs = allDogs.concat(result.honden);
                    totalLoaded += result.honden.length;
                    
                    // Update progress - ZELFDE ALS DogDataManager
                    this.showProgress(`Honden laden... (${totalLoaded} geladen)`);
                    
                    console.log(`SearchManager: Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                    
                    // Controleer of er nog meer pagina's zijn (zelfde als DogDataManager)
                    hasMorePages = result.heeftVolgende;
                    
                    if (hasMorePages) {
                        currentPage++;
                    }
                    
                    // Veiligheidslimiet voor oneindige lus (zelfde als DogDataManager)
                    if (currentPage > 100) {
                        console.warn('SearchManager: Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                        break;
                    }
                } else {
                    hasMorePages = false;
                }
                
                // Kleine pauze om de server niet te overbelasten (zelfde als DogDataManager)
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // DEBUG: Controleer of de juiste velden worden geladen
            if (allDogs.length > 0) {
                const sampleDog = allDogs[0];
                console.log('Voorbeeld hond velden:', Object.keys(sampleDog));
                console.log('vader_id in sample:', sampleDog.vader_id);
                console.log('moeder_id in sample:', sampleDog.moeder_id);
            }
            
            console.log(`SearchManager: TOTAAL ${allDogs.length} honden geladen`);
            
            return allDogs;
            
        } catch (error) {
            console.error('SearchManager: Fout bij laden honden voor zoeken:', error);
            throw error;
        }
    }
    
    filterDogsForNameField(searchTerm = '') {
        // Normaliseer de zoekterm
        const normalizedSearchTerm = this.normalizeText(searchTerm);
        
        this.filteredDogs = this.allDogs.filter(dog => {
            // Normaliseer de hond naam en kennelnaam
            const normalizedNaam = this.normalizeText(dog.naam);
            const normalizedKennelnaam = this.normalizeText(dog.kennelnaam);
            
            // Controleer of de zoekterm voorkomt in de naam
            if (normalizedNaam.includes(normalizedSearchTerm)) {
                return true;
            }
            
            // Controleer of de zoekterm voorkomt in de kennelnaam
            if (normalizedKennelnaam.includes(normalizedSearchTerm)) {
                return true;
            }
            
            // Controleer of de zoekterm voorkomt in "naam kennelnaam" combinatie
            const combined = `${normalizedNaam} ${normalizedKennelnaam}`;
            if (combined.includes(normalizedSearchTerm)) {
                return true;
            }
            
            return false;
        });
        
        this.displaySearchResults();
    }
    
    filterDogsByKennel(searchTerm = '') {
        // Normaliseer de zoekterm
        const normalizedSearchTerm = this.normalizeText(searchTerm);
        
        this.filteredDogs = this.allDogs.filter(dog => {
            // Normaliseer de kennelnaam
            const normalizedKennelnaam = this.normalizeText(dog.kennelnaam);
            return normalizedKennelnaam.includes(normalizedSearchTerm);
        });
        
        this.filteredDogs.sort((a, b) => {
            const naamA = a.naam ? a.naam.toLowerCase() : '';
            const naamB = b.naam ? b.naam.toLowerCase() : '';
            return naamA.localeCompare(naamB);
        });
        
        this.displaySearchResults();
    }
    
    displaySearchResults() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
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
                    <!-- REGEL 1: Naam + Kennelnaam -->
                    <div class="dog-name-line">
                        <span class="dog-name">${dog.naam || t('unknown')}</span>
                        ${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}
                    </div>
                    
                    <!-- REGEL 2: Stamboomnummer + Ras + Geslacht - ACHTER ELKAAR -->
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
                
                // Verberg de dropdown op mobiele apparaten
                if (window.innerWidth <= 768) {
                    this.collapseSearchResultsOnMobile();
                }
            });
        });
    }
    
    collapseSearchResultsOnMobile() {
        // Op mobiel schermen, toon alleen de details en verberg de zoekresultaten
        if (window.innerWidth <= 768 && !this.isMobileCollapsed) {
            const searchColumn = document.getElementById('searchColumn');
            const detailsColumn = document.getElementById('detailsColumn');
            
            if (searchColumn && detailsColumn) {
                searchColumn.classList.add('d-none');
                detailsColumn.classList.remove('col-md-7');
                detailsColumn.classList.add('col-12');
                this.isMobileCollapsed = true;
                
                // Voeg een terugknop toe voor mobiele weergave
                this.addMobileBackButton();
            }
        }
    }
    
    addMobileBackButton() {
        const detailsContainer = document.getElementById('detailsContainer');
        if (!detailsContainer) return;
        
        // Verwijder bestaande terugknop als die er al is
        const existingButton = detailsContainer.querySelector('.mobile-back-button');
        if (existingButton) {
            return; // Knop bestaat al, niet opnieuw toevoegen
        }
        
        // Maak terugknop
        const backButtonDiv = document.createElement('div');
        backButtonDiv.className = 'mobile-back-button';
        backButtonDiv.innerHTML = `
            <button class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-arrow-left me-1"></i> ${this.t('backToSearch')}
            </button>
        `;
        
        // Voeg event listener toe
        backButtonDiv.querySelector('button').addEventListener('click', () => {
            this.restoreSearchViewOnMobile();
        });
        
        // Voeg de knop toe aan het begin van de details
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
            
            // Verwijder de terugknop
            const backButtonDiv = document.querySelector('.mobile-back-button');
            if (backButtonDiv) {
                backButtonDiv.remove();
            }
            
            // HERSTEL DE ZOEKRESULTATEN VOOR MOBIEL
            const searchInput = this.searchType === 'name' ? 
                document.getElementById('searchNameInput') : 
                document.getElementById('searchKennelInput');
            if (searchInput) {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (searchTerm.length >= 1) {
                    // Simuleer een input event om de zoekresultaten te vernieuwen
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
    
    selectDog(dog) {
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.getAttribute('data-id')) === dog.id) {
                item.classList.add('selected');
            }
        });
        
        this.showDogDetails(dog);
        
        // Verberg de dropdown op mobiele apparaten
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
    
    async showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) return;
        
        // Eerst de container volledig leegmaken voordat we nieuwe inhoud toevoegen
        container.innerHTML = '';
        
        // Voeg mobiele terugknop toe indien nodig
        if (this.isMobileCollapsed && window.innerWidth <= 768) {
            this.addMobileBackButton();
        }
        
        // GEBRUIK JUISTE VELDNAMEN: vader_id en moeder_id zoals in database
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
        // CORRECT: Gebruik vader_id zoals in database
        if (dog.vader_id) {
            const father = this.allDogs.find(d => d.id === dog.vader_id);
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
        
        // CORRECT: Gebruik moeder_id zoals in database
        if (dog.moeder_id) {
            const mother = this.allDogs.find(d => d.id === dog.moeder_id);
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
        
        // **GECORRIGEERD: Check of deze hond foto's heeft**
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        
        // Haal aantal nakomelingen op
        const offspringCount = await this.getOffspringCount(dog.id);
        
        // NIEUW: Haal priveinfo op voor deze hond
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
        
        console.log('SearchManager: Priveinfo voor hond:', {
            naam: dog.naam,
            stamboomnr: dog.stamboomnr,
            hasPrivateInfo: hasPrivateInfo,
            privateNotes: privateNotes ? privateNotes.substring(0, 100) + '...' : 'leeg',
            currentUserId: this.currentUserId
        });
        
        // NIEUW: PRIVEINFO SECTIE HTML
        let privateInfoHTML = '';
        if (this.currentUserId && dog.stamboomnr) {
            const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
            const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
            
            privateInfoHTML = `
                <div class="mt-4">
                    <div class="fw-bold mb-2">
                        <i class="bi ${hasPrivateInfo ? 'bi-lock-fill' : 'bi-lock'} me-1"></i>
                        ${t('privateInfo')}
                    </div>
                    ${hasPrivateInfo ? `
                    <div class="remarks-box" style="background-color: #fff3cd; border-color: #ffeaa7;">
                        ${privateNotes}
                    </div>
                    ` : `
                    <div class="text-muted">
                        <i>${t('privateInfoOwnerOnly')}</i>
                    </div>
                    `}
                </div>
            `;
        }
        
        const html = `
            <div class="p-3">
                <div class="details-card" data-dog-name="${dog.naam || ''}">
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
                                <div class="dog-name-header">${displayValue(dog.naam)}</div>
                                ${dog.kennelnaam ? `<div class="text-muted mb-2">${displayValue(dog.kennelnaam)}</div>` : ''}
                                
                                <!-- VOLGORDE: Stamboomnummer + Ras + Geslacht + Vachtkleur + Nakomelingen - ACHTER ELKAAR -->
                                <div class="dog-detail-header-line mt-2">
                                    ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                    ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                    <span class="geslacht">${genderText}</span>
                                    ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                      `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                      `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                                    
                                    <!-- NAKOMELINGEN KNOOP -->
                                    ${offspringCount > 0 ? `
                                    <a href="#" class="offspring-badge offspring-button" 
                                       data-dog-id="${dog.id}" 
                                       data-dog-name="${displayValue(dog.naam)}">
                                        <i class="bi bi-people-fill"></i>
                                        ${offspringCount} ${t('offspringCount')}
                                    </a>
                                    ` : `
                                    <span class="offspring-badge" style="background: #6c757d; cursor: default;">
                                        <i class="bi bi-people"></i>
                                        0 ${t('offspringCount')}
                                    </span>
                                    `}
                                </div>
                            </div>
                            <div class="text-end">
                                <!-- Geboortedatum - behouden -->
                                ${dog.geboortedatum ? `
                                <div class="text-muted">
                                    <i class="bi bi-calendar me-1"></i>
                                    ${formatDate(dog.geboortedatum)}
                                </div>
                                ` : ''}
                                
                                <!-- Overlijdensdatum - behouden -->
                                ${dog.overlijdensdatum ? `
                                <div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}">
                                    <i class="bi bi-calendar-x me-1"></i>
                                    ${formatDate(dog.overlijdensdatum)}
                                </div>
                                ` : ''}
                                
                                <!-- STAMBOOM KNOOP VERWIJDERD - Nu alleen bij de ouders sectie -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="details-body">
                        <!-- FOTO'S SECTIE BOVENAAN (indien beschikbaar) -->
                        ${hasPhotos ? `
                        <div class="photos-section">
                            <div class="photos-title">
                                <div class="photos-title-text">
                                    <i class="bi bi-camera"></i>
                                    <span>${t('photos')}</span>
                                </div>
                                <div class="click-hint-text">${t('clickToEnlarge')}</div>
                            </div>
                            <div class="photos-grid-container" id="photosGrid${dog.id}">
                                <!-- Foto's worden hier ingeladen -->
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="info-group">
                            <div class="info-group-title d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-people me-1"></i> ${t('parents')}
                                </div>
                                <!-- STAMBOOM KNOOP - alleen hier behouden -->
                                <button class="btn btn-sm btn-outline-primary btn-pedigree" data-dog-id="${dog.id}">
                                    <i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}
                                </button>
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
                            
                            <!-- NIEUW: PRIVEINFO SECTIE -->
                            ${privateInfoHTML}
                        </div>
                        
                        ${dog.createdat || dog.updatedat ? `
                        <div class="info-group">
                            <div class="info-group-title">
                                <i class="bi bi-clock-history me-1"></i> Systeem informatie
                            </div>
                            <div class="row">
                                ${dog.createdat ? `
                                <div class="col-md-6">
                                    <div class="text-muted small">Aangemaakt</div>
                                    <div class="small">${formatDate(dog.createdat)}</div>
                                </div>
                                ` : ''}
                                ${dog.updatedat ? `
                                <div class="col-md-6">
                                    <div class="text-muted small">Laatst bijgewerkt</div>
                                    <div class="small">${formatDate(dog.updatedat)}</div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        
        // **GECORRIGEERD: Laad foto's asynchroon en voeg ze toe**
        if (hasPhotos) {
            this.loadAndDisplayPhotos(dog);
        }
        
        // Event listeners voor parent cards
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
        
        // Event listeners voor stamboom knop
        container.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        // Event listener voor nakomelingen knop
        container.querySelectorAll('.offspring-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                const dogName = btn.getAttribute('data-dog-name') || '';
                this.showOffspringModal(dogId, dogName);
            });
        });
        
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
    
    // **GECORRIGEERDE METHODE: Foto's laden en tonen**
    async loadAndDisplayPhotos(dog) {
        try {
            const photos = await this.getDogPhotos(dog.id);
            const container = document.getElementById('detailsContainer');
            const photosGrid = container.querySelector(`#photosGrid${dog.id}`);
            
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
                // **BELANGRIJK: Voor thumbnails gebruik de thumbnail, voor grote weergave gebruik data**
                // Thumbnail voor het grid
                let thumbnailUrl = photo.thumbnail || photo.data;
                // Originele foto voor grote weergave
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
            
        } catch (error) {
            console.error('Fout bij laden foto\'s:', error);
            const photosGrid = document.getElementById(`photosGrid${dog.id}`);
            if (photosGrid) {
                photosGrid.innerHTML = `
                    <div class="text-danger small">
                        <i class="bi bi-exclamation-triangle"></i> Fout bij laden foto's
                    </div>
                `;
            }
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
    
    // Stamboom openen
    async openPedigree(dogId) {
        try {
            // Initialiseer stamboom manager als nog niet gedaan
            if (!this.stamboomManager) {
                console.log('SearchManager: Initializing StamboomManager...');
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            
            // Zoek de hond
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) {
                this.showError("Hond niet gevonden");
                return;
            }
            
            // Toon stamboom modal
            this.stamboomManager.showPedigree(dog);
            
        } catch (error) {
            console.error('SearchManager: Fout bij openen stamboom:', error);
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    // Helper methodes van BaseModule
    showProgress(message) {
        // Gebruik dezelfde progress methode als DogDataManager
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            console.log('SearchManager Progress:', message);
        }
    }
    
    hideProgress() {
        // Gebruik dezelfde hideProgress methode als DogDataManager
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        } else {
            console.log('SearchManager: Progress hidden');
        }
    }
    
    showError(message) {
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            console.error('SearchManager Error:', message);
            alert(message);
        }
    }
    
    showSuccess(message) {
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            console.log('SearchManager Success:', message);
        }
    }
}