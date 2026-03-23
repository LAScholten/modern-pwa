// js/modules/SearchManager.js

/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 * GEBRUIKT EXACT DEZELFDE ZOEKLOGICA ALS PRIVATEINFOMANAGER
 */

class SearchManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.searchType = 'name';
        this.stamboomManager = null;
        this.isMobileCollapsed = false;
        this.dogPhotosCache = new Map();
        this.dogOffspringCache = new Map();
        this.dogSiblingsCache = new Map();
        this.dogDetailsCache = new Map();
        this.isLoading = false;
        this.currentOffspringModalDogId = null;
        this.currentOffspringModalDogName = null;
        this.currentSiblingsModalDogId = null;
        this.currentSiblingsModalDogName = null;
        this.currentUserId = null;
        this.photoViewerLoaded = false;
        this.searchTimeout = null;
        this.filteredDogs = [];
        this.filteredKennels = []; // NIEUW: voor kennel-georiënteerde zoekresultaten
        this.minSearchLength = 2; // Minimale lengte voor zoeken (exact zoals PrivateInfoManager)
        
        this.translations = {
            nl: {
                searchDog: "Hond Zoeken",
                searchName: "Zoek hond op naam (of naam + kennelnaam)",
                searchKennel: "Zoek hond op kennelnaam",
                searchPlaceholder: "Typ hondennaam... of 'naam kennelnaam'",
                kennelPlaceholder: "Typ kennelnaam...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Typ minimaal 2 tekens om te zoeken...",
                typeToSearchKennel: "Typ een kennelnaam om te zoeken (min. 2 tekens)",
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
                loadingSearch: "Zoeken...",
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
                thyroidStatus: {
                    "Negatief": "Tgaa Negatief",
                    "Positief": "Tgaa Positive"
                },
                
                grade: "Graad",
                status: "Status",
                notApplicable: "Niet van toepassing",
                viewMore: "Meer details",
                
                pedigreeButton: "Stamboom",
                pedigreeTitle: "Stamboom van {name}",
                generatingPedigree: "Stamboom genereren...",
                openPedigree: "Stamboom openen",
                pedigree4Gen: "4-generatie stamboom",
                
                greatGrandfather: "Overgrootvader",
                greatGrandmother: "Overgrootmoeder",
                grandfather: "Grootvader",
                grandmother: "Grootmoeder",
                
                photos: "Foto's",
                noPhotos: "Geen foto's beschikbaar",
                clickToEnlarge: "Klik om te vergroten",
                closePhoto: "Sluiten",
                loadingPhotoViewer: "Fotoviewer laden...",
                
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
                totalOffspring: "Totaal aantal",
                birthYear: "Geboortejaar",
                showAllOffspring: "Toon alle nakomelingen",
                
                siblings: "Broers & zussen",
                siblingsCount: "Broers/zussen",
                noSiblings: "Geen broers of zussen gevonden",
                viewSiblings: "Bekijk broers & zussen",
                siblingsModalTitle: "Broers en zussen van {name}",
                loadingSiblings: "Broers en zussen laden...",
                siblingsList: "Lijst van broers en zussen",
                fullSiblings: "Volle broers/zussen",
                halfSiblings: "Half broers/zussen",
                siblingType: "Type",
                fullSibling: "Volle broer/zus",
                halfSibling: "Half broer/zus",
                relationship: "Verwantschap",
                commonParent: "Gemeenschappelijke ouder",
                
                viewDogDetails: "Bekijk hond details",
                closeDogDetails: "Sluit hond details",
                dogDetailsModalTitle: "Details van {name}",
                backToOffspring: "Terug naar nakomelingen",
                backToSiblings: "Terug naar broers/zussen",
                
                privateInfo: "Prive Informatie",
                privateInfoOwnerOnly: "Geen informatie",
                
                searching: "Zoeken...",
                typeMore: "Typ minimaal 2 tekens",
                
                kennelResults: "Honden van kennel {kennel}",
                noDogsInKennel: "Geen honden gevonden in deze kennel",
                viewKennelDogs: "Bekijk honden van deze kennel",
                kennelDogs: "Honden van kennel {kennel}",
                kennelDogCount: "Totaal aantal honden"
            },
            en: {
                searchDog: "Search Dog",
                searchName: "Search dog by name (or name + kennel)",
                searchKennel: "Search dog by kennel name",
                searchPlaceholder: "Type dog name... or 'name kennelname'",
                kennelPlaceholder: "Type kennel name...",
                noDogsFound: "No dogs found",
                typeToSearch: "Type at least 2 characters to search...",
                typeToSearchKennel: "Type a kennel name to search (min. 2 characters)",
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
                loadingSearch: "Searching...",
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
                
                pedigreeButton: "Pedigree",
                pedigreeTitle: "Pedigree of {name}",
                generatingPedigree: "Generating pedigree...",
                openPedigree: "Open pedigree",
                pedigree4Gen: "4-generation pedigree",
                
                greatGrandfather: "Great Grandfather",
                greatGrandmother: "Great Grandmother",
                grandfather: "Grandfather",
                grandmother: "Grandmother",
                
                photos: "Photos",
                noPhotos: "No photos available",
                clickToEnlarge: "Click to enlarge",
                closePhoto: "Close",
                loadingPhotoViewer: "Loading photo viewer...",
                
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
                totalOffspring: "Total",
                birthYear: "Birth year",
                showAllOffspring: "Show all offspring",
                
                siblings: "Siblings",
                siblingsCount: "Siblings",
                noSiblings: "No siblings found",
                viewSiblings: "View siblings",
                siblingsModalTitle: "Siblings of {name}",
                loadingSiblings: "Loading siblings...",
                siblingsList: "List of siblings",
                fullSiblings: "Full siblings",
                halfSiblings: "Half siblings",
                siblingType: "Type",
                fullSibling: "Full sibling",
                halfSibling: "Half sibling",
                relationship: "Relationship",
                commonParent: "Common parent",
                
                viewDogDetails: "View dog details",
                closeDogDetails: "Close dog details",
                dogDetailsModalTitle: "Details of {name}",
                backToOffspring: "Back to offspring",
                backToSiblings: "Back to siblings",
                
                privateInfo: "Private Information",
                privateInfoOwnerOnly: "No information",
                
                searching: "Searching...",
                typeMore: "Type at least 2 characters",
                
                kennelResults: "Dogs from kennel {kennel}",
                noDogsInKennel: "No dogs found in this kennel",
                viewKennelDogs: "View dogs from this kennel",
                kennelDogs: "Dogs from kennel {kennel}",
                kennelDogCount: "Total number of dogs"
            },
            de: {
                searchDog: "Hund suchen",
                searchName: "Hund nach Namen suchen (oder Name + Kennel)",
                searchKennel: "Hund nach Kennelname suchen",
                searchPlaceholder: "Hundenamen eingeben... oder 'Name Kennelname'",
                kennelPlaceholder: "Kennelnamen eingeben...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Geben Sie mindestens 2 Zeichen ein...",
                typeToSearchKennel: "Kennelnamen eingeben um zu suchen (min. 2 Zeichen)",
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
                loadingSearch: "Suche...",
                backToSearch: "Zurück zur Suche",
                viewingParent: "Elternteil ansehen",
                clickToView: "Klicken für Details",
                parents: "Eltern",
                noHealthInfo: "Keine Gesundheitsinformationen verfügbar",
                noAdditionalInfo: "Keine zusätzliche Informationen verfügbar",
                selectDogToView: "Wählen Sie einen Hund, um Details zu sehen",
                
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
                additionalInfo: "Zusätzliche Informationen",
                
                pedigreeButton: "Ahnentafel",
                pedigreeTitle: "Ahnentafel von {name}",
                generatingPedigree: "Ahnentafel wird generiert...",
                openPedigree: "Ahnentafel öffnen",
                pedigree4Gen: "4-Generationen Ahnentafel",
                
                greatGrandfather: "Urgroßvater",
                greatGrandmother: "Urgroßmutter",
                grandfather: "Großvater",
                grandmother: "Großmutter",
                
                photos: "Fotos",
                noPhotos: "Keine Fotos verfügbar",
                clickToEnlarge: "Klicken zum Vergrößern",
                closePhoto: "Schließen",
                loadingPhotoViewer: "Fotobetrachter laden...",
                
                offspring: "Nachkommen",
                noOffspring: "Keine Nachkommen gefunden",
                viewOffspring: "Nachkommen anzeigen",
                offspringCount: "Nachkommen",
                offspringModalTitle: "Nachkommen von {name}",
                loadingOffspring: "Nachkommen werden geladen...",
                offspringList: "Liste der Nachkommen",
                fatherColumn: "Vater",
                motherColumn: "Mutter",
                dogName: "Hundename",
                totalOffspring: "Gesamtzahl",
                birthYear: "Geburtsjahr",
                showAllOffspring: "Alle Nachkommen anzeigen",
                
                siblings: "Geschwister",
                siblingsCount: "Geschwister",
                noSiblings: "Keine Geschwister gefunden",
                viewSiblings: "Geschwister anzeigen",
                siblingsModalTitle: "Geschwister von {name}",
                loadingSiblings: "Geschwister werden geladen...",
                siblingsList: "Liste der Geschwister",
                fullSiblings: "Vollgeschwister",
                halfSiblings: "Halbgeschwister",
                siblingType: "Typ",
                fullSibling: "Vollgeschwister",
                halfSibling: "Halbgeschwister",
                relationship: "Verwandtschaft",
                commonParent: "Gemeinsamer Elternteil",
                
                viewDogDetails: "Hunddetails ansehen",
                closeDogDetails: "Hunddetails schließen",
                dogDetailsModalTitle: "Details von {name}",
                backToOffspring: "Zurück zu Nachkommen",
                backToSiblings: "Zurück zu Geschwistern",
                
                privateInfo: "Private Informationen",
                privateInfoOwnerOnly: "Keine Informationen",
                
                searching: "Suche...",
                typeMore: "Geben Sie mindestens 2 Zeichen ein",
                
                kennelResults: "Hunde aus Kennel {kennel}",
                noDogsInKennel: "Keine Hunde in diesem Kennel gefunden",
                viewKennelDogs: "Hunde aus diesem Kennel anzeigen",
                kennelDogs: "Hunde aus Kennel {kennel}",
                kennelDogCount: "Gesamtzahl der Hunde"
            }
        };
        
        this.setupGlobalEventListeners();
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
    
    async loadPhotoViewer() {
        if (window.photoViewer) {
            return true;
        }
        
        if (this.photoViewerLoaded) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (window.photoViewer) {
                        clearInterval(checkInterval);
                        resolve(true);
                    }
                }, 100);
            });
        }
        
        this.photoViewerLoaded = true;
        
        return new Promise((resolve, reject) => {
            console.log('SearchManager: PhotoViewer module wordt dynamisch geladen...');
            
            if (window.uiHandler && window.uiHandler.showToast) {
                window.uiHandler.showToast(this.t('loadingPhotoViewer'), 'info', 1000);
            }
            
            const script = document.createElement('script');
            script.src = 'js/modules/PhotoViewer.js';
            script.onload = () => {
                console.log('SearchManager: PhotoViewer module geladen');
                setTimeout(() => {
                    if (window.photoViewer) {
                        console.log('SearchManager: PhotoViewer instance beschikbaar');
                        resolve(true);
                    } else {
                        console.warn('SearchManager: PhotoViewer class geladen maar instance nog niet, forceren...');
                        window._photoViewer = new window.PhotoViewerClass();
                        Object.defineProperty(window, 'photoViewer', {
                            get: function() { return window._photoViewer; }
                        });
                        resolve(true);
                    }
                }, 50);
            };
            script.onerror = (error) => {
                console.error('SearchManager: Fout bij laden PhotoViewer:', error);
                this.photoViewerLoaded = false;
                reject(error);
            };
            document.head.appendChild(script);
        });
    }
    
    async showPhotoWithViewer(photoSrc, dogName = '') {
        try {
            await this.loadPhotoViewer();
            
            if (window.photoViewer && window.photoViewer.showPhoto) {
                if (window.photoViewer.updateLanguage) {
                    window.photoViewer.updateLanguage(this.currentLang);
                }
                
                window.photoViewer.showPhoto(photoSrc, dogName);
            } else {
                console.error('PhotoViewer niet beschikbaar na laden');
                alert('Fotoviewer kon niet worden geladen');
            }
        } catch (error) {
            console.error('Fout bij tonen foto met PhotoViewer:', error);
            alert('Fotoviewer kon niet worden geladen: ' + error.message);
        }
    }
    
    async getCurrentUserId() {
        try {
            if (window.auth && window.auth.currentUser && window.auth.currentUser.id) {
                console.log('SearchManager: Gebruiker ID gevonden via window.auth:', window.auth.currentUser.id);
                return window.auth.currentUser.id;
            }
            
            if (window.supabase && window.supabase.auth) {
                const { data: { user } } = await window.supabase.auth.getUser();
                if (user && user.id) {
                    console.log('SearchManager: Gebruiker ID gevonden via Supabase auth:', user.id);
                    return user.id;
                }
            }
            
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
            
            if (window.currentUserId) {
                console.log('SearchManager: Gebruiker ID gevonden via window.currentUserId:', window.currentUserId);
                return window.currentUserId;
            }
            
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
    
    async getPrivateInfoForDog(stamboomnr) {
        if (!this.currentUserId || !stamboomnr) {
            console.log('SearchManager: Geen gebruiker ID of stamboomnr voor priveinfo:', { 
                userId: this.currentUserId, 
                stamboomnr: stamboomnr 
            });
            return null;
        }
        
        try {
            if (!window.priveInfoService) {
                console.warn('PriveInfoService niet beschikbaar');
                return null;
            }
            
            console.log('SearchManager: Ophalen priveinfo voor:', {
                stamboomnr: stamboomnr,
                userId: this.currentUserId
            });
            
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            
            if (!result || !result.priveInfo) {
                console.log('Geen priveinfo gevonden in resultaat');
                return null;
            }
            
            console.log(`SearchManager: ${result.priveInfo.length} priveinfo records gevonden`);
            
            const priveInfo = result.priveInfo.find(info => {
                const match = info.stamboomnr === stamboomnr && info.toegevoegd_door === this.currentUserId;
                if (match) {
                    console.log('SearchManager: Priveinfo match gevonden:', {
                        stamboomnr: info.stamboomnr,
                        toegevoegd_door: info.toegevoegd_door,
                        privatenotes: info.privatenotes ? info.privatenotes.substring(0, 50) + '...' : 'leeg'
                    });
                }
                return match;
            });
            
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
                const dogName = thumbnail.getAttribute('data-dog-name') || '';
                
                console.log('Foto geklikt, src:', photoSrc ? photoSrc.substring(0, 100) + '...' : 'geen src');
                
                if (photoSrc && photoSrc.trim() !== '') {
                    this.showPhotoWithViewer(photoSrc, dogName);
                } else {
                    console.error('Geen geldige foto src gevonden in attribuut');
                    const imgElement = thumbnail.querySelector('img');
                    if (imgElement && imgElement.src) {
                        console.log('Gebruik img src als fallback:', imgElement.src.substring(0, 100) + '...');
                        this.showPhotoWithViewer(imgElement.src, dogName);
                    }
                }
            }
        });
        
        document.addEventListener('click', (e) => {
            const offspringBtn = e.target.closest('.offspring-button');
            if (offspringBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(offspringBtn.getAttribute('data-dog-id'));
                const dogName = offspringBtn.getAttribute('data-dog-name') || '';
                this.showOffspringModal(dogId, dogName);
            }
            
            const siblingsBtn = e.target.closest('.siblings-button');
            if (siblingsBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(siblingsBtn.getAttribute('data-dog-id'));
                const dogName = siblingsBtn.getAttribute('data-dog-name') || '';
                this.showSiblingsModal(dogId, dogName);
            }
            
            // NIEUW: Event handler voor kennel-result-item klikken
            const kennelResultItem = e.target.closest('.kennel-result-item');
            if (kennelResultItem) {
                e.preventDefault();
                e.stopPropagation();
                
                const kennelName = kennelResultItem.getAttribute('data-kennel-name');
                if (kennelName) {
                    this.showKennelDogsModal(kennelName);
                }
            }
            
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
            
            const closeSiblingsBtn = e.target.closest('.siblings-modal-close');
            if (closeSiblingsBtn) {
                const overlay = document.getElementById('siblingsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentSiblingsModalDogId = null;
                        this.currentSiblingsModalDogName = null;
                    }, 300);
                }
            }
            
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
            
            if (e.target.id === 'siblingsModalOverlay') {
                const overlay = document.getElementById('siblingsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentSiblingsModalDogId = null;
                        this.currentSiblingsModalDogName = null;
                    }, 300);
                }
            }
            
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
            
            const backToSiblingsBtn = e.target.closest('.back-to-siblings-btn');
            if (backToSiblingsBtn) {
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
            
            // NIEUW: Event handlers voor kennel modal
            const closeKennelDogsBtn = e.target.closest('.kennel-dogs-modal-close');
            if (closeKennelDogsBtn) {
                const overlay = document.getElementById('kennelDogsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
            }
            
            if (e.target.id === 'kennelDogsModalOverlay') {
                const overlay = document.getElementById('kennelDogsModalOverlay');
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
    
    /**
     * VERBETERDE ZOEKFUNCTIE DIE EXACT HETZELFDE WERKT ALS IN PRIVATEINFOMANAGER
     */
    async searchDogs(searchTerm, searchType) {
        try {
            console.log(`🔍 SearchManager zoeken naar: "${searchTerm}" (type: ${searchType})`);
            
            const supabase = window.supabase;
            if (!supabase) {
                console.error('❌ Geen Supabase client');
                return;
            }
            
            // Minimale zoeklengte check (exact zoals PrivateInfoManager)
            if (searchTerm.length < this.minSearchLength) {
                this.filteredDogs = [];
                this.filteredKennels = [];
                this.displaySearchResults();
                return;
            }
            
            if (searchType === 'kennel') {
                // KENNEL-GEORIËNTEERDE ZOEKOPDRACHT
                // Groepeer honden op kennelnaam en toon unieke kennels
                const { data, error } = await supabase
                    .from('honden')
                    .select('id, naam, kennelnaam, stamboomnr, ras, geslacht, geboortedatum')
                    .ilike('kennelnaam', `%${searchTerm}%`)
                    .order('geboortedatum', { ascending: false });
                
                if (error) {
                    console.error('❌ Database error:', error);
                    return;
                }
                
                if (!data || data.length === 0) {
                    this.filteredKennels = [];
                    this.displaySearchResults(searchTerm);
                    return;
                }
                
                // Groepeer honden op kennelnaam
                const kennelMap = new Map();
                
                data.forEach(dog => {
                    const kennelName = dog.kennelnaam ? dog.kennelnaam.trim() : '';
                    if (kennelName && kennelName !== '') {
                        if (!kennelMap.has(kennelName)) {
                            kennelMap.set(kennelName, []);
                        }
                        kennelMap.get(kennelName).push(dog);
                    }
                });
                
                // Maak een array van unieke kennels met een representatieve hond (de meest recente)
                const uniqueKennels = [];
                kennelMap.forEach((dogs, kennelName) => {
                    // Sorteer honden op geboortedatum (nieuwste eerst)
                    const sortedDogs = dogs.sort((a, b) => {
                        const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                        const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                        return dateB - dateA;
                    });
                    
                    uniqueKennels.push({
                        kennelName: kennelName,
                        dogCount: dogs.length,
                        representativeDog: sortedDogs[0]
                    });
                });
                
                // Sorteer kennels op naam
                uniqueKennels.sort((a, b) => a.kennelName.localeCompare(b.kennelName));
                
                this.filteredKennels = uniqueKennels;
                this.filteredDogs = [];
                this.displayKennelSearchResults(searchTerm);
                
            } else {
                // Zoeken op naam (originele functionaliteit)
                const words = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
                
                let query = supabase
                    .from('honden')
                    .select('*');
                
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
                    .limit(100);
                
                if (error) {
                    console.error('❌ Database error:', error);
                    return;
                }
                
                this.filteredDogs = data || [];
                this.filteredKennels = [];
                this.displaySearchResults(searchTerm);
            }
            
        } catch (error) {
            console.error('❌ Fout bij zoeken:', error);
        }
    }
    
    // NIEUW: displayKennelSearchResults methode uit versie 1
    displayKennelSearchResults(searchTerm = '') {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        if (!this.filteredKennels || this.filteredKennels.length === 0) {
            container.innerHTML = `
                <div class="p-3">
                    <div class="text-center py-5">
                        <i class="bi bi-house-x display-1 text-muted opacity-50"></i>
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
                    ${this.filteredKennels.length} kennels gevonden ${searchTerm ? `voor "${searchTerm}"` : ''}
                </div>
        `;
        
        this.filteredKennels.forEach(kennel => {
            const dog = kennel.representativeDog;
            const genderText = dog.geslacht === 'reuen' ? t('male') : 
                             dog.geslacht === 'teven' ? t('female') : t('unknown');
            
            html += `
                <div class="kennel-result-item" data-kennel-name="${kennel.kennelName}">
                    <div class="kennel-name-line">
                        <i class="bi bi-house me-2"></i>
                        <span class="kennel-name">${kennel.kennelName}</span>
                        <span class="kennel-count-badge">${kennel.dogCount} honden</span>
                    </div>
                    
                    <div class="dog-details-line mt-2">
                        <span class="text-muted me-2"><i class="bi bi-arrow-right"></i> Voorbeeld:</span>
                        <span class="fw-bold">${dog.naam || t('unknown')}</span>
                        ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                        ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                        <span class="geslacht">${genderText}</span>
                    </div>
                    
                    <div class="mt-2 text-primary small">
                        <i class="bi bi-info-circle me-1"></i>
                        Klik om alle honden van deze kennel te bekijken
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
        
        document.querySelectorAll('.kennel-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const kennelName = item.getAttribute('data-kennel-name');
                if (kennelName) {
                    this.showKennelDogsModal(kennelName);
                    
                    if (window.innerWidth <= 768) {
                        this.collapseSearchResultsOnMobile();
                    }
                }
            });
        });
    }
    
    // NIEUW: showKennelDogsModal methode uit versie 1
    async showKennelDogsModal(kennelName) {
        const existingOverlay = document.getElementById('kennelDogsModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        const overlayHTML = `
            <div class="modal-overlay kennel-dogs-modal-overlay" id="kennelDogsModalOverlay" style="display: flex;">
                <div class="modal-container kennel-dogs-modal-container">
                    <div class="modal-header offspring-modal-header">
                        <h5 class="modal-title offspring-modal-title">
                            <i class="bi bi-house me-2"></i> ${this.t('kennelDogs', '').replace('{kennel}', kennelName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white kennel-dogs-modal-close" aria-label="${this.t('close')}"></button>
                    </div>
                    <div class="modal-body offspring-modal-body" id="kennelDogsModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loading')}</span>
                            </div>
                            <p class="mt-3">${this.t('loading')}</p>
                        </div>
                    </div>
                    <div class="modal-footer offspring-modal-footer">
                        <button type="button" class="btn btn-secondary kennel-dogs-modal-close">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('close')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        await this.loadAndDisplayKennelDogs(kennelName);
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('kennelDogsModalOverlay');
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
        
        const overlay = document.getElementById('kennelDogsModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    // NIEUW: loadAndDisplayKennelDogs methode uit versie 1
    async loadAndDisplayKennelDogs(kennelName) {
        const contentDiv = document.getElementById('kennelDogsModalContent');
        if (!contentDiv) return;
        
        try {
            const supabase = window.supabase;
            if (!supabase) return;
            
            const { data, error } = await supabase
                .from('honden')
                .select('*')
                .ilike('kennelnaam', kennelName);
            
            if (error) {
                console.error('Fout bij laden kennel honden:', error);
                return;
            }
            
            if (!data || data.length === 0) {
                contentDiv.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-house display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${this.t('noDogsInKennel')}</p>
                    </div>
                `;
                return;
            }
            
            const kennelDogs = data;
            const count = kennelDogs.length;
            
            const sortedDogs = [...kennelDogs].sort((a, b) => {
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateB - dateA;
            });
            
            let html = `
                <div class="kennel-stats mb-4">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        ${this.t('kennelDogCount')}: <strong>${count}</strong>
                    </div>
                </div>
                
                <div class="kennel-list-container">
                    <h6 class="mb-3">
                        <i class="bi bi-list-ul me-2"></i> ${this.t('kennelResults', '').replace('{kennel}', kennelName)}
                    </h6>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead class="table-light">
                                 <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">${this.t('dogName')}</th>
                                    <th scope="col">${this.t('pedigreeNumber')}</th>
                                    <th scope="col">${this.t('breed')}</th>
                                    <th scope="col">${this.t('gender')}</th>
                                    <th scope="col">${this.t('birthYear')}</th>
                                 </tr>
                            </thead>
                            <tbody>
            `;
            
            sortedDogs.forEach((dog, index) => {
                const birthYear = dog.geboortedatum ? 
                    new Date(dog.geboortedatum).getFullYear() : '?';
                
                const genderText = dog.geslacht === 'reuen' ? this.t('male') : 
                                  dog.geslacht === 'teven' ? this.t('female') : this.t('unknown');
                
                html += `
                    <tr class="kennel-dog-row" data-dog-id="${dog.id}" data-dog-name="${dog.naam || ''}">
                        <td class="text-muted">${index + 1}</td>
                        <td>
                            <strong class="text-primary">${dog.naam || this.t('unknown')}</strong>
                        </td>
                        <td><code>${dog.stamboomnr || ''}</code></td>
                        <td>${dog.ras || ''}</td>
                        <td>${genderText}</td>
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
            
            contentDiv.querySelectorAll('.kennel-dog-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const dogId = parseInt(row.getAttribute('data-dog-id'));
                    const dogName = row.getAttribute('data-dog-name');
                    
                    const overlay = document.getElementById('kennelDogsModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    
                    this.showDogDetailsModal(dogId, dogName, 'kennel');
                });
            });
            
        } catch (error) {
            console.error('Fout bij laden kennel honden:', error);
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Fout bij laden kennel honden: ${error.message}
                </div>
            `;
        }
    }
    
    async getDogDetails(dogId) {
        if (this.dogDetailsCache.has(dogId)) {
            console.log(`SearchManager: Gebruik gecachete details voor hond ${dogId}`);
            return this.dogDetailsCache.get(dogId);
        }
        
        try {
            const { data, error } = await window.supabase
                .from('honden')
                .select('*')
                .eq('id', dogId)
                .single();
            
            if (error) {
                console.error('Fout bij ophalen hond details:', error);
                return null;
            }
            
            if (data) {
                this.dogDetailsCache.set(dogId, data);
            }
            
            return data;
            
        } catch (error) {
            console.error('Fout bij ophalen hond details:', error);
            return null;
        }
    }
    
    async getDogPhotos(dogId) {
        if (!dogId || dogId === 0) return [];
        
        const dog = await this.getDogDetails(dogId);
        if (!dog || !dog.stamboomnr) return [];
        
        const cacheKey = `${dogId}_${dog.stamboomnr}`;
        if (this.dogPhotosCache.has(cacheKey)) {
            return this.dogPhotosCache.get(cacheKey);
        }
        
        try {
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
    
    async getDogOffspring(dogId) {
        if (!dogId || dogId === 0) return [];
        
        if (this.dogOffspringCache.has(dogId)) {
            return this.dogOffspringCache.get(dogId);
        }
        
        try {
            const { data: offspringIds, error } = await window.supabase
                .from('honden')
                .select('id, naam, kennelnaam, stamboomnr, ras, geslacht, geboortedatum, vader_id, moeder_id')
                .or(`vader_id.eq.${dogId},moeder_id.eq.${dogId}`);
            
            if (error) {
                console.error('Fout bij ophalen nakomelingen:', error);
                return [];
            }
            
            if (!offspringIds || offspringIds.length === 0) {
                this.dogOffspringCache.set(dogId, []);
                return [];
            }
            
            const offspringWithParents = await Promise.all(offspringIds.map(async (puppy) => {
                let fatherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                let motherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                
                if (puppy.vader_id) {
                    const father = await this.getDogDetails(puppy.vader_id);
                    if (father) {
                        fatherInfo = {
                            id: father.id,
                            naam: father.naam || this.t('unknown'),
                            stamboomnr: father.stamboomnr || '',
                            kennelnaam: father.kennelnaam || ''
                        };
                    }
                }
                
                if (puppy.moeder_id) {
                    const mother = await this.getDogDetails(puppy.moeder_id);
                    if (mother) {
                        motherInfo = {
                            id: mother.id,
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
            }));
            
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
    
    async getDogSiblings(dogId) {
        if (!dogId || dogId === 0) return [];
        
        if (this.dogSiblingsCache.has(dogId)) {
            return this.dogSiblingsCache.get(dogId);
        }
        
        try {
            const dog = await this.getDogDetails(dogId);
            if (!dog) return [];
            
            const fatherId = dog.vader_id;
            const motherId = dog.moeder_id;
            
            if (!fatherId && !motherId) {
                this.dogSiblingsCache.set(dogId, []);
                return [];
            }
            
            let query = window.supabase
                .from('honden')
                .select('id, naam, kennelnaam, stamboomnr, ras, geslacht, geboortedatum, vader_id, moeder_id');
            
            if (fatherId && motherId) {
                query = query.or(`vader_id.eq.${fatherId},moeder_id.eq.${motherId}`);
            } else if (fatherId) {
                query = query.eq('vader_id', fatherId);
            } else if (motherId) {
                query = query.eq('moeder_id', motherId);
            }
            
            const { data: siblings, error } = await query;
            
            if (error) {
                console.error('Fout bij ophalen broers/zussen:', error);
                return [];
            }
            
            if (!siblings || siblings.length === 0) {
                this.dogSiblingsCache.set(dogId, []);
                return [];
            }
            
            const filteredSiblings = siblings.filter(s => s.id !== dogId);
            
            const siblingsWithParents = await Promise.all(filteredSiblings.map(async (sibling) => {
                const sameFather = fatherId && sibling.vader_id === fatherId;
                const sameMother = motherId && sibling.moeder_id === motherId;
                
                let type = 'half';
                let commonParent = '';
                
                if (sameFather && sameMother) {
                    type = 'full';
                    commonParent = 'beide';
                } else if (sameFather) {
                    type = 'half';
                    commonParent = 'vader';
                } else if (sameMother) {
                    type = 'half';
                    commonParent = 'moeder';
                }
                
                let fatherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                let motherInfo = { id: null, naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                
                if (sibling.vader_id) {
                    const father = await this.getDogDetails(sibling.vader_id);
                    if (father) {
                        fatherInfo = {
                            id: father.id,
                            naam: father.naam || this.t('unknown'),
                            stamboomnr: father.stamboomnr || '',
                            kennelnaam: father.kennelnaam || ''
                        };
                    }
                }
                
                if (sibling.moeder_id) {
                    const mother = await this.getDogDetails(sibling.moeder_id);
                    if (mother) {
                        motherInfo = {
                            id: mother.id,
                            naam: mother.naam || this.t('unknown'),
                            stamboomnr: mother.stamboomnr || '',
                            kennelnaam: mother.kennelnaam || ''
                        };
                    }
                }
                
                return {
                    ...sibling,
                    siblingType: type,
                    commonParent: commonParent,
                    fatherInfo,
                    motherInfo,
                    sortOrder: type === 'full' ? 0 : 1
                };
            }));
            
            siblingsWithParents.sort((a, b) => {
                if (a.sortOrder !== b.sortOrder) {
                    return a.sortOrder - b.sortOrder;
                }
                
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateA - dateB;
            });
            
            this.dogSiblingsCache.set(dogId, siblingsWithParents);
            return siblingsWithParents;
            
        } catch (error) {
            console.error('Fout bij ophalen broers/zussen voor hond:', dogId, error);
            return [];
        }
    }
    
    async getSiblingsCount(dogId) {
        if (!dogId || dogId === 0) return 0;
        
        if (this.dogSiblingsCache.has(dogId)) {
            return this.dogSiblingsCache.get(dogId).length;
        }
        
        try {
            const dog = await this.getDogDetails(dogId);
            if (!dog) return 0;
            
            const fatherId = dog.vader_id;
            const motherId = dog.moeder_id;
            
            if (!fatherId && !motherId) {
                return 0;
            }
            
            let query = window.supabase
                .from('honden')
                .select('*', { count: 'exact', head: true });
            
            if (fatherId && motherId) {
                query = query.or(`vader_id.eq.${fatherId},moeder_id.eq.${motherId}`);
            } else if (fatherId) {
                query = query.eq('vader_id', fatherId);
            } else if (motherId) {
                query = query.eq('moeder_id', motherId);
            }
            
            const { count, error } = await query;
            
            if (error) {
                console.error('Fout bij tellen broers/zussen:', error);
                return 0;
            }
            
            return Math.max(0, (count || 0) - 1);
            
        } catch (error) {
            console.error('Fout bij tellen broers/zussen:', error);
            return 0;
        }
    }
    
    async getOffspringCount(dogId) {
        if (!dogId || dogId === 0) return 0;
        
        if (this.dogOffspringCache.has(dogId)) {
            return this.dogOffspringCache.get(dogId).length;
        }
        
        try {
            const { count, error } = await window.supabase
                .from('honden')
                .select('*', { count: 'exact', head: true })
                .or(`vader_id.eq.${dogId},moeder_id.eq.${dogId}`);
            
            if (error) {
                console.error('Fout bij tellen nakomelingen:', error);
                return 0;
            }
            
            return count || 0;
            
        } catch (error) {
            console.error('Fout bij tellen nakomelingen:', error);
            return 0;
        }
    }
    
    async checkDogHasPhotos(dogId) {
        const photos = await this.getDogPhotos(dogId);
        return photos.length > 0;
    }
    
    async showOffspringModal(dogId, dogName = '') {
        const existingOverlay = document.getElementById('offspringModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        this.currentOffspringModalDogId = dogId;
        this.currentOffspringModalDogName = dogName;
        
        const overlayHTML = `
            <div class="modal-overlay offspring-modal-overlay" id="offspringModalOverlay" style="display: flex;">
                <div class="modal-container offspring-modal-container">
                    <div class="modal-header offspring-modal-header">
                        <h5 class="modal-title offspring-modal-title">
                            <i class="bi bi-people-fill me-2"></i> ${this.t('offspringModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white offspring-modal-close" aria-label="${this.t('close')}"></button>
                    </div>
                    <div class="modal-body offspring-modal-body" id="offspringModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loadingOffspring')}</span>
                            </div>
                            <p class="mt-3">${this.t('loadingOffspring')}</p>
                        </div>
                    </div>
                    <div class="modal-footer offspring-modal-footer">
                        <button type="button" class="btn btn-secondary offspring-modal-close">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('close')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        this.loadAndDisplayOffspring(dogId, dogName);
        
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
        
        const overlay = document.getElementById('offspringModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    async showSiblingsModal(dogId, dogName = '') {
        const existingOverlay = document.getElementById('siblingsModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        this.currentSiblingsModalDogId = dogId;
        this.currentSiblingsModalDogName = dogName;
        
        const overlayHTML = `
            <div class="modal-overlay siblings-modal-overlay" id="siblingsModalOverlay" style="display: flex;">
                <div class="modal-container siblings-modal-container">
                    <div class="modal-header siblings-modal-header">
                        <h5 class="modal-title siblings-modal-title">
                            <i class="bi bi-people me-2"></i> ${this.t('siblingsModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white siblings-modal-close" aria-label="${this.t('close')}"></button>
                    </div>
                    <div class="modal-body siblings-modal-body" id="siblingsModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loadingSiblings')}</span>
                            </div>
                            <p class="mt-3">${this.t('loadingSiblings')}</p>
                        </div>
                    </div>
                    <div class="modal-footer siblings-modal-footer">
                        <button type="button" class="btn btn-secondary siblings-modal-close">
                            <i class="bi bi-x-lg me-1"></i> ${this.t('close')}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        this.loadAndDisplaySiblings(dogId, dogName);
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('siblingsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                        this.currentSiblingsModalDogId = null;
                        this.currentSiblingsModalDogName = null;
                    }, 300);
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        
        const overlay = document.getElementById('siblingsModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
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
                
                const fatherDisplay = puppy.fatherInfo.kennelnaam ? 
                    `${puppy.fatherInfo.naam} (${puppy.fatherInfo.kennelnaam})` : 
                    puppy.fatherInfo.naam;
                
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
            
            contentDiv.querySelectorAll('.offspring-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const puppyId = parseInt(row.getAttribute('data-dog-id'));
                    const puppyName = row.getAttribute('data-dog-name');
                    
                    const overlay = document.getElementById('offspringModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    
                    this.showDogDetailsModal(puppyId, puppyName, 'offspring');
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
    
    async loadAndDisplaySiblings(dogId, dogName) {
        const contentDiv = document.getElementById('siblingsModalContent');
        if (!contentDiv) return;
        
        try {
            const siblings = await this.getDogSiblings(dogId);
            const count = siblings.length;
            
            if (count === 0) {
                contentDiv.innerHTML = `
                    <div class="text-center py-5">
                        <i class="bi bi-people display-1 text-muted opacity-50"></i>
                        <p class="mt-3 text-muted">${this.t('noSiblings')}</p>
                    </div>
                `;
                return;
            }
            
            const fullCount = siblings.filter(s => s.siblingType === 'full').length;
            const halfCount = siblings.filter(s => s.siblingType === 'half').length;
            
            let html = `
                <div class="siblings-stats mb-4">
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        ${this.t('totalOffspring')}: <strong>${count}</strong> 
                        (${fullCount} ${this.t('fullSiblings')}, ${halfCount} ${this.t('halfSiblings')})
                    </div>
                </div>
                
                <div class="siblings-list-container">
                    <h6 class="mb-3">
                        <i class="bi bi-list-ul me-2"></i> ${this.t('siblingsList')}
                    </h6>
                    <div class="table-responsive">
                        <table class="table table-hover table-sm">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">${this.t('dogName')}</th>
                                    <th scope="col">${this.t('fatherColumn')}</th>
                                    <th scope="col">${this.t('motherColumn')}</th>
                                    <th scope="col">${this.t('relationship')}</th>
                                    <th scope="col">${this.t('pedigreeNumber')}</th>
                                    <th scope="col">${this.t('breed')}</th>
                                    <th scope="col">${this.t('birthYear')}</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            siblings.forEach((sibling, index) => {
                const birthYear = sibling.geboortedatum ? 
                    new Date(sibling.geboortedatum).getFullYear() : '?';
                
                const relationshipText = sibling.siblingType === 'full' ? 
                    this.t('fullSibling') : this.t('halfSibling');
                
                const fatherDisplay = sibling.fatherInfo.kennelnaam ? 
                    `${sibling.fatherInfo.naam} (${sibling.fatherInfo.kennelnaam})` : 
                    sibling.fatherInfo.naam;
                
                const motherDisplay = sibling.motherInfo.kennelnaam ? 
                    `${sibling.motherInfo.naam} (${sibling.motherInfo.kennelnaam})` : 
                    sibling.motherInfo.naam;
                
                const rowClass = sibling.siblingType === 'full' ? 'full-sibling-row' : 'half-sibling-row';
                
                html += `
                    <tr class="sibling-row ${rowClass}" data-dog-id="${sibling.id}" data-dog-name="${sibling.naam || ''}">
                        <td class="text-muted">${index + 1}</td>
                        <td>
                            <strong class="${sibling.siblingType === 'full' ? 'text-success' : 'text-primary'}">${sibling.naam || this.t('unknown')}</strong>
                            ${sibling.kennelnaam ? `<br><small class="text-muted">${sibling.kennelnaam}</small>` : ''}
                        </td>
                        <td>${fatherDisplay}</td>
                        <td>${motherDisplay}</td>
                        <td>
                            <span class="badge ${sibling.siblingType === 'full' ? 'bg-success' : 'bg-info'}">${relationshipText}</span>
                        </td>
                        <td><code>${sibling.stamboomnr || ''}</code></td>
                        <td>${sibling.ras || ''}</td>
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
            
            contentDiv.querySelectorAll('.sibling-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const siblingId = parseInt(row.getAttribute('data-dog-id'));
                    const siblingName = row.getAttribute('data-dog-name');
                    
                    const overlay = document.getElementById('siblingsModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    
                    this.showDogDetailsModal(siblingId, siblingName, 'siblings');
                });
            });
            
        } catch (error) {
            console.error('Fout bij laden broers/zussen:', error);
            contentDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Fout bij laden broers/zussen: ${error.message}
                </div>
            `;
        }
    }
    
    async showDogDetailsModal(dogId, dogName = '', source = '') {
        const dog = await this.getDogDetails(dogId);
        if (!dog) {
            this.showError(`Hond niet gevonden (ID: ${dogId})`);
            return;
        }
        
        const existingOverlay = document.getElementById('dogDetailsModalOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        if (!this.currentUserId) {
            this.currentUserId = await this.getCurrentUserId();
        }
        
        let backButtonText = this.t('backToSearch');
        let backButtonClass = 'back-to-search-btn';
        if (source === 'offspring') {
            backButtonText = this.t('backToOffspring');
            backButtonClass = 'back-to-offspring-btn';
        } else if (source === 'siblings') {
            backButtonText = this.t('backToSiblings');
            backButtonClass = 'back-to-siblings-btn';
        } else if (source === 'kennel') { // NIEUW: support voor kennel source
            backButtonText = this.t('backToSearch');
            backButtonClass = 'back-to-search-btn';
        }
        
        const overlayHTML = `
            <div class="modal-overlay offspring-modal-overlay" id="dogDetailsModalOverlay" style="display: flex;">
                <div class="modal-container offspring-modal-container" style="max-width: 800px;">
                    <div class="modal-header offspring-modal-header">
                        <h5 class="modal-title offspring-modal-title">
                            <i class="bi bi-info-circle me-2"></i> ${this.t('dogDetailsModalTitle', '').replace('{name}', dogName)}
                        </h5>
                        <button type="button" class="btn-close btn-close-white dog-details-modal-close" aria-label="${this.t('closeDogDetails')}"></button>
                    </div>
                    <div class="modal-body offspring-modal-body" id="dogDetailsModalContent">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">${this.t('loading')}</span>
                            </div>
                            <p class="mt-3">${this.t('loading')}</p>
                        </div>
                    </div>
                    <div class="modal-footer offspring-modal-footer">
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-outline-secondary ${backButtonClass}">
                                <i class="bi bi-arrow-left me-1"></i> ${backButtonText}
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
        
        await this.loadAndDisplayDogDetails(dog, source);
        
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
        
        const overlay = document.getElementById('dogDetailsModalOverlay');
        overlay.addEventListener('animationend', function handler() {
            if (overlay.style.display === 'none') {
                document.removeEventListener('keydown', closeOnEscape);
                overlay.removeEventListener('animationend', handler);
            }
        });
    }
    
    async loadAndDisplayDogDetails(dog, source = '') {
        const contentDiv = document.getElementById('dogDetailsModalContent');
        if (!contentDiv) return;
        
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
        
        console.log('SearchManager: Priveinfo voor hond:', {
            naam: dog.naam,
            stamboomnr: dog.stamboomnr,
            hasPrivateInfo: hasPrivateInfo,
            privateNotes: privateNotes ? privateNotes.substring(0, 100) + '...' : 'leeg',
            currentUserId: this.currentUserId
        });
        
        const t = this.t.bind(this);
        
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
        
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const offspringCount = await this.getOffspringCount(dog.id);
        const siblingsCount = await this.getSiblingsCount(dog.id);
        
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
                                    
                                    <div class="d-flex gap-2 mt-2">
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
                                        
                                        ${siblingsCount > 0 ? `
                                        <a href="#" class="siblings-badge siblings-button" 
                                           data-dog-id="${dog.id}" 
                                           data-dog-name="${displayValue(dog.naam)}">
                                            <i class="bi bi-people"></i>
                                            ${siblingsCount} ${t('siblingsCount')}
                                        </a>
                                        ` : `
                                        <span class="siblings-badge" style="background: #6c757d; cursor: default;">
                                            <i class="bi bi-people"></i>
                                            0 ${t('siblingsCount')}
                                        </span>
                                        `}
                                    </div>
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
                
                <div class="info-group mt-4">
                    <div class="info-group-title">
                        <i class="bi bi-lock me-1"></i> ${t('privateInfo')}
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
            </div>
        `;
        
        contentDiv.innerHTML = html;
        
        if (hasPhotos) {
            this.loadAndDisplayPhotosForModal(dog);
        }
        
        contentDiv.querySelectorAll('.offspring-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newDogId = parseInt(btn.getAttribute('data-dog-id'));
                const newDogName = btn.getAttribute('data-dog-name') || '';
                
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
                
                this.showOffspringModal(newDogId, newDogName);
            });
        });
        
        contentDiv.querySelectorAll('.siblings-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newDogId = parseInt(btn.getAttribute('data-dog-id'));
                const newDogName = btn.getAttribute('data-dog-name') || '';
                
                const overlay = document.getElementById('dogDetailsModalOverlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        if (overlay.parentNode) {
                            overlay.parentNode.removeChild(overlay);
                        }
                    }, 300);
                }
                
                this.showSiblingsModal(newDogId, newDogName);
            });
        });
        
        contentDiv.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        if (fatherInfo.id) {
            const fatherCard = contentDiv.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    
                    const overlay = document.getElementById('dogDetailsModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                        setTimeout(() => {
                            if (overlay.parentNode) {
                                overlay.parentNode.removeChild(overlay);
                            }
                        }, 300);
                    }
                    
                    this.showDogDetailsModal(parentId, fatherInfo.naam, source);
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = contentDiv.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    
                    const overlay = document.getElementById('dogDetailsModalOverlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                        setTimeout(() => {
                            if (overlay.parentNode) {
                                overlay.parentNode.removeChild(overlay);
                            }
                        }, 300);
                    }
                    
                    this.showDogDetailsModal(parentId, motherInfo.naam, source);
                });
            }
        }
    }
    
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
                                                        <div class="form-text mt-1 small" id="searchNameStatus">${t('typeToSearch')}</div>
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
                                                        <div class="form-text mt-1 small" id="searchKennelStatus">${t('typeToSearchKennel')}</div>
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
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="searchModalCloseBtnFooter">
                                <i class="bi bi-x-circle me-1"></i> ${t('close')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
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
                
                #searchResultsContainer {
                    max-height: calc(100vh - 200px);
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }
                
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
                
                /* NIEUW: Kennel result item styling */
                .kennel-result-item {
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    padding: 12px 15px;
                    background: white;
                }
                
                .kennel-result-item:hover {
                    background-color: #f8f9fa;
                    border-color: #0d6efd;
                    transform: translateX(3px);
                }
                
                .kennel-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0d6efd;
                    margin-bottom: 4px;
                }
                
                .kennel-count-badge {
                    display: inline-block;
                    background-color: #6c757d;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    margin-left: 8px;
                }
                
                .dog-name-line {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #0d6efd;
                    margin-bottom: 8px;
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
                
                .private-remarks-box {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    padding: 15px;
                    border-radius: 6px;
                    font-style: italic;
                    color: #856404;
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
                
                .offspring-badge, .siblings-badge {
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
                
                .offspring-badge {
                    background: linear-gradient(135deg, #6f42c1, #0d6efd);
                }
                
                .siblings-badge {
                    background: linear-gradient(135deg, #28a745, #20c997);
                }
                
                .offspring-badge:hover, .siblings-badge:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                    color: white !important;
                    text-decoration: none;
                }
                
                .offspring-badge:hover {
                    background: linear-gradient(135deg, #0d6efd, #6f42c1);
                }
                
                .siblings-badge:hover {
                    background: linear-gradient(135deg, #20c997, #28a745);
                }
                
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
                
                .modal-overlay {
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
                
                .offspring-modal-header, .siblings-modal-header {
                    padding: 16px 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .offspring-modal-header {
                    background: linear-gradient(135deg, #6f42c1, #0d6efd);
                }
                
                .siblings-modal-header {
                    background: linear-gradient(135deg, #28a745, #20c997);
                }
                
                .offspring-modal-title, .siblings-modal-title {
                    margin: 0;
                    font-size: 1.3rem;
                    font-weight: 600;
                }
                
                .offspring-modal-body, .siblings-modal-body {
                    padding: 20px;
                    overflow-y: auto;
                    flex: 1;
                    max-height: 60vh;
                }
                
                .offspring-modal-footer, .siblings-modal-footer {
                    padding: 15px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #dee2e6;
                    text-align: right;
                }
                
                .offspring-row, .sibling-row, .kennel-dog-row {
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .offspring-row:hover, .sibling-row:hover, .kennel-dog-row:hover {
                    background-color: #e8f4fd;
                }
                
                .full-sibling-row {
                    background-color: rgba(40, 167, 69, 0.05);
                }
                
                .full-sibling-row:hover {
                    background-color: rgba(40, 167, 69, 0.15);
                }
                
                .half-sibling-row:hover {
                    background-color: #e8f4fd;
                }
                
                .offspring-row td, .sibling-row td, .kennel-dog-row td {
                    vertical-align: middle;
                }
                
                .dog-details-content {
                    padding: 5px;
                }
                
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
                
                #searchModal {
                    z-index: 1055;
                }
                
                #offspringModalOverlay, #siblingsModalOverlay {
                    z-index: 1090;
                }
                
                #dogDetailsModalOverlay {
                    z-index: 1100;
                }
                
                /* NIEUW: Kennel modal overlay styling */
                #kennelDogsModalOverlay {
                    z-index: 1085;
                }
                
                #searchResultsContainer::-webkit-scrollbar,
                #detailsContainer::-webkit-scrollbar,
                .offspring-modal-body::-webkit-scrollbar,
                .siblings-modal-body::-webkit-scrollbar {
                    width: 8px;
                }
                
                #searchResultsContainer::-webkit-scrollbar-track,
                #detailsContainer::-webkit-scrollbar-track,
                .offspring-modal-body::-webkit-scrollbar-track,
                .siblings-modal-body::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                
                #searchResultsContainer::-webkit-scrollbar-thumb,
                #detailsContainer::-webkit-scrollbar-thumb,
                .offspring-modal-body::-webkit-scrollbar-thumb,
                .siblings-modal-body::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                
                #searchResultsContainer::-webkit-scrollbar-thumb:hover,
                #detailsContainer::-webkit-scrollbar-thumb:hover,
                .offspring-modal-body::-webkit-scrollbar-thumb:hover,
                .siblings-modal-body::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
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
                    
                    .photo-thumbnail {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .modal-container {
                        width: 95% !important;
                        max-width: 95% !important;
                        margin: 0 10px !important;
                        border-radius: 8px !important;
                    }
                    
                    .offspring-modal-header, .siblings-modal-header {
                        padding: 12px 15px !important;
                    }
                    
                    .offspring-modal-title, .siblings-modal-title {
                        font-size: 1.1rem !important;
                    }
                    
                    .offspring-modal-body, .siblings-modal-body {
                        max-height: 70vh !important;
                        padding: 15px !important;
                    }
                    
                    .offspring-modal-footer, .siblings-modal-footer {
                        padding: 12px 15px !important;
                    }
                    
                    .offspring-row, .sibling-row {
                        font-size: 0.8rem !important;
                    }
                    
                    .offspring-row td, .sibling-row td {
                        padding: 6px 4px !important;
                    }
                    
                    .offspring-badge, .siblings-badge {
                        padding: 3px 8px !important;
                        font-size: 0.8rem !important;
                    }
                    
                    #dogDetailsModalOverlay .modal-container {
                        max-height: 95vh !important;
                        max-width: 98% !important;
                    }
                    
                    #dogDetailsModalOverlay .offspring-modal-body {
                        max-height: 75vh !important;
                    }
                    
                    .table-responsive {
                        max-width: 100%;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
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
            if (nameInput) {
                nameInput.focus();
                this.showInitialView();
            }
        } else {
            if (nameField) nameField.classList.add('d-none');
            if (kennelField) kennelField.classList.remove('d-none');
            const kennelInput = document.getElementById('searchKennelInput');
            if (kennelInput) {
                kennelInput.focus();
                this.showInitialView();
            }
        }
        
        this.clearDetails();
    }
    
    setupNameSearch() {
        const searchInput = document.getElementById('searchNameInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', () => {
            this.showInitialView();
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            const statusEl = document.getElementById('searchNameStatus');
            
            if (searchTerm.length === 0) {
                if (statusEl) {
                    statusEl.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${this.t('typeToSearch')}`;
                }
                this.showInitialView();
                this.clearDetails();
                return;
            }
            
            if (searchTerm.length < this.minSearchLength) {
                if (statusEl) {
                    statusEl.innerHTML = `<i class="bi bi-exclamation-circle me-1 text-warning"></i> ${this.t('typeMore')}`;
                }
                return;
            }
            
            if (statusEl) {
                statusEl.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> ${this.t('searching')}`;
            }
            
            this.searchTimeout = setTimeout(() => {
                this.searchDogs(searchTerm, 'name');
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstResult = document.querySelector('.dog-result-item');
                if (firstResult) {
                    e.preventDefault();
                    const dogId = parseInt(firstResult.getAttribute('data-id'));
                    this.selectDogById(dogId);
                }
            }
        });
    }
    
    setupKennelSearch() {
        const searchInput = document.getElementById('searchKennelInput');
        if (!searchInput) return;
        
        searchInput.addEventListener('focus', () => {
            this.showInitialView();
        });
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }
            
            const statusEl = document.getElementById('searchKennelStatus');
            
            if (searchTerm.length === 0) {
                if (statusEl) {
                    statusEl.innerHTML = `<i class="bi bi-info-circle me-1"></i> ${this.t('typeToSearchKennel')}`;
                }
                this.showInitialView();
                this.clearDetails();
                return;
            }
            
            if (searchTerm.length < this.minSearchLength) {
                if (statusEl) {
                    statusEl.innerHTML = `<i class="bi bi-exclamation-circle me-1 text-warning"></i> ${this.t('typeMore')}`;
                }
                return;
            }
            
            if (statusEl) {
                statusEl.innerHTML = `<i class="bi bi-hourglass-split me-1"></i> ${this.t('searching')}`;
            }
            
            this.searchTimeout = setTimeout(() => {
                this.searchDogs(searchTerm, 'kennel');
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstResult = document.querySelector('.kennel-result-item');
                if (firstResult) {
                    e.preventDefault();
                    const kennelName = firstResult.getAttribute('data-kennel-name');
                    if (kennelName) {
                        this.showKennelDogsModal(kennelName);
                    }
                }
            }
        });
    }
    
    showInitialView() {
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        
        const t = this.t.bind(this);
        
        const searchInput = this.searchType === 'name' ? 
            document.getElementById('searchNameInput') : 
            document.getElementById('searchKennelInput');
        
        const hasSearchTerm = searchInput && searchInput.value.trim().length > 0;
        
        if (hasSearchTerm) {
            if (this.searchType === 'name') {
                this.searchDogs(searchInput.value.trim(), 'name');
            } else {
                this.searchDogs(searchInput.value.trim(), 'kennel');
            }
        } else {
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
    
    displaySearchResults(searchTerm = '') {
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
        
        const t = this.t.bind(this);
        
        let html = `
            <div class="p-3">
                <div class="search-stats">
                    <i class="bi bi-info-circle me-1"></i>
                    ${this.filteredDogs.length} ${t('found')} ${searchTerm ? `voor "${searchTerm}"` : ''}
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
                const searchTerm = searchInput.value.trim();
                if (searchTerm.length >= this.minSearchLength) {
                    if (this.searchType === 'name') {
                        this.searchDogs(searchTerm, 'name');
                    } else {
                        this.searchDogs(searchTerm, 'kennel');
                    }
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
        
        if (window.innerWidth <= 768) {
            this.collapseSearchResultsOnMobile();
        }
    }
    
    async selectDogById(hondId) {
        const dog = await this.getDogDetails(hondId);
        if (dog) {
            this.selectDog(dog);
        }
    }
    
    async showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.isMobileCollapsed && window.innerWidth <= 768) {
            this.addMobileBackButton();
        }
        
        if (!this.currentUserId) {
            this.currentUserId = await this.getCurrentUserId();
        }
        
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
        
        console.log('SearchManager: Priveinfo voor hond in main view:', {
            naam: dog.naam,
            stamboomnr: dog.stamboomnr,
            hasPrivateInfo: hasPrivateInfo,
            privateNotes: privateNotes ? privateNotes.substring(0, 100) + '...' : 'leeg',
            currentUserId: this.currentUserId
        });
        
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
        
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const offspringCount = await this.getOffspringCount(dog.id);
        const siblingsCount = await this.getSiblingsCount(dog.id);
        
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
                                
                                <div class="dog-detail-header-line mt-2">
                                    ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                    ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                    <span class="geslacht">${genderText}</span>
                                    ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? 
                                      `<span class="vachtkleur">${dog.vachtkleur}</span>` : 
                                      `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                                    
                                    <div class="d-flex gap-2 mt-2">
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
                                        
                                        ${siblingsCount > 0 ? `
                                        <a href="#" class="siblings-badge siblings-button" 
                                           data-dog-id="${dog.id}" 
                                           data-dog-name="${displayValue(dog.naam)}">
                                            <i class="bi bi-people"></i>
                                            ${siblingsCount} ${t('siblingsCount')}
                                        </a>
                                        ` : `
                                        <span class="siblings-badge" style="background: #6c757d; cursor: default;">
                                            <i class="bi bi-people"></i>
                                            0 ${t('siblingsCount')}
                                        </span>
                                        `}
                                    </div>
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
                                    <span>${t('photos')}</span>
                                </div>
                                <div class="click-hint-text">${t('clickToEnlarge')}</div>
                            </div>
                            <div class="photos-grid-container" id="photosGrid${dog.id}">
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="info-group">
                            <div class="info-group-title d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-people me-1"></i> ${t('parents')}
                                </div>
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
                        </div>
                        
                        <div class="info-group mt-4">
                            <div class="info-group-title">
                                <i class="bi bi-lock me-1"></i> ${t('privateInfo')}
                            </div>
                            
                            ${hasPrivateInfo ? `
                            <div class="remarks-box private-remarks-box">
                                ${privateNotes}
                            </div>
                            ` : `
                            <div class="text-muted">
                                <i>${t('privateInfoOwnerOnly')}</i>
                            </div>
                            `}
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
        
        if (hasPhotos) {
            this.loadAndDisplayPhotos(dog);
        }
        
        container.querySelectorAll('.offspring-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newDogId = parseInt(btn.getAttribute('data-dog-id'));
                const newDogName = btn.getAttribute('data-dog-name') || '';
                this.showOffspringModal(newDogId, newDogName);
            });
        });
        
        container.querySelectorAll('.siblings-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const newDogId = parseInt(btn.getAttribute('data-dog-id'));
                const newDogName = btn.getAttribute('data-dog-name') || '';
                this.showSiblingsModal(newDogId, newDogName);
            });
        });
        
        container.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
        
        if (fatherInfo.id) {
            const fatherCard = container.querySelector('.father-card');
            if (fatherCard) {
                fatherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                    
                    this.getDogDetails(parentId).then(parentDog => {
                        if (parentDog) {
                            this.showDogDetails(parentDog, true, originalDogId);
                        }
                    });
                });
            }
        }
        
        if (motherInfo.id) {
            const motherCard = container.querySelector('.mother-card');
            if (motherCard) {
                motherCard.addEventListener('click', (e) => {
                    const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                    const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                    
                    this.getDogDetails(parentId).then(parentDog => {
                        if (parentDog) {
                            this.showDogDetails(parentDog, true, originalDogId);
                        }
                    });
                });
            }
        }
        
        if (isParentView) {
            const backButton = container.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', (e) => {
                    const originalDogId = parseInt(backButton.getAttribute('data-original-dog'));
                    this.getDogDetails(originalDogId).then(originalDog => {
                        if (originalDog) {
                            this.showDogDetails(originalDog);
                        }
                    });
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
        this.getDogDetails(parentId).then(parent => {
            if (parent) {
                this.showDogDetails(parent, true, originalDogId);
                
                document.querySelectorAll('.dog-result-item').forEach(item => {
                    item.classList.remove('selected');
                    if (parseInt(item.getAttribute('data-id')) === parentId) {
                        item.classList.add('selected');
                    }
                });
            }
        });
    }
    
    async openPedigree(dogId) {
        try {
            if (!this.stamboomManager) {
                console.log('SearchManager: Initializing StamboomManager...');
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            
            const dog = await this.getDogDetails(dogId);
            if (!dog) {
                this.showError("Hond niet gevonden");
                return;
            }
            
            this.stamboomManager.showPedigree(dog);
            
        } catch (error) {
            console.error('SearchManager: Fout bij openen stamboom:', error);
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    showProgress(message) {
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            console.log('SearchManager Progress:', message);
        }
    }
    
    hideProgress() {
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

window.SearchManager = SearchManager;