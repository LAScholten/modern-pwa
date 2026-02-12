// js/modules/SearchManager.js

/**
 * Search Manager Module
 * Beheert het zoeken naar honden met real-time filtering op naam en kennelnaam
 * Inclusief foto functionaliteit met thumbnail viewer en fullscreen viewer
 * Inclusief nakomelingen functionaliteit
 * Beide kolommen zijn nu scrollbaar
 * SUPABASE VERSIE MET PAGINATIE - FIXED VERSION
 * MET JUISTE DATABASE KOLOM NAMEN
 * **FOTO PROBLEEM OPGELOST** - Gebruikt nu EXACT DEZELFDE LOGICA als DekReuen.js
 * **FOTO VERGROTING**: Gebruikt exact dezelfde Bootstrap modal als DekReuen module
 * **GEEN DUBBELE FOTOS MEER** - Alleen event delegation, geen onclick attributes
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
        this.currentOffspringModalDogId = null;
        this.currentOffspringModalDogName = null;
        this.currentUserId = null;
        
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
                pedigreeButton: "Stamboom",
                pedigreeTitle: "Stamboom van {name}",
                generatingPedigree: "Stamboom genereren...",
                openPedigree: "Stamboom openen",
                pedigree4Gen: "4-generatie stamboom",
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
                showAllOffspring: "Toon alle nakomelingen",
                viewDogDetails: "Bekijk hond details",
                closeDogDetails: "Sluit hond details",
                dogDetailsModalTitle: "Details van {name}",
                backToOffspring: "Terug naar nakomelingen",
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
                showAllOffspring: "Show all offspring",
                viewDogDetails: "View dog details",
                closeDogDetails: "Close dog details",
                dogDetailsModalTitle: "Details of {name}",
                backToOffspring: "Back to offspring",
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
                noAdditionalInfo: "Keine aanvullende informatie beschikbar",
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
                additionalInfo: "Zusätzliche informatie",
                pedigreeButton: "Ahnentafel",
                pedigreeTitle: "Ahnentafel von {name}",
                generatingPedigree: "Ahnentafel wordt generiert...",
                openPedigree: "Ahnentafel öffnen",
                pedigree4Gen: "4-Generationen Ahnentafel",
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
                offspringList: "Liste der Nachkommen",
                fatherColumn: "Vater",
                motherColumn: "Mutter",
                dogName: "Hundename",
                totalOffspring: "Gesamtzahl der Nachkommen",
                birthYear: "Geburtsjahr",
                showAllOffspring: "Alle Nachkommen anzeigen",
                viewDogDetails: "Hunddetails ansehen",
                closeDogDetails: "Hunddetails schließen",
                dogDetailsModalTitle: "Details von {name}",
                backToOffspring: "Zurück zu Nachkommen",
                privateInfo: "Private Informationen",
                privateInfoOwnerOnly: "Kein information"
            }
        };
        
        // ALLEEN event delegation, GEEN onclick attributes in HTML
        this.setupGlobalEventListeners();
    }
    
    injectDependencies(db, auth) {
        this.db = window.hondenService || db;
        this.auth = window.auth || auth;
    }
    
    initialize() {
        return Promise.resolve();
    }
    
    async getCurrentUserId() {
        try {
            if (window.auth && window.auth.currentUser && window.auth.currentUser.id) {
                return window.auth.currentUser.id;
            }
            if (window.supabase && window.supabase.auth) {
                const { data: { user } } = await window.supabase.auth.getUser();
                if (user && user.id) return user.id;
            }
            const authData = localStorage.getItem('sb-auth-token') || localStorage.getItem('supabase.auth.token');
            if (authData) {
                try {
                    const parsed = JSON.parse(authData);
                    if (parsed && parsed.user && parsed.user.id) return parsed.user.id;
                } catch (e) {}
            }
            if (window.currentUserId) return window.currentUserId;
            if (window.authService && window.authService.getCurrentUser) {
                const user = await window.authService.getCurrentUser();
                if (user && user.id) return user.id;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    
    async getPrivateInfoForDog(stamboomnr) {
        if (!this.currentUserId || !stamboomnr) return null;
        try {
            if (!window.priveInfoService) return null;
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            if (!result || !result.priveInfo) return null;
            const priveInfo = result.priveInfo.find(info => 
                info.stamboomnr === stamboomnr && info.toegevoegd_door === this.currentUserId
            );
            return priveInfo ? priveInfo.privatenotes || '' : null;
        } catch (error) {
            return null;
        }
    }
    
    normalizeText(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ß/g, 'ss')
            .trim();
    }
    
    t(key, subKey = null) {
        if (subKey && this.translations[this.currentLang][key] && typeof this.translations[this.currentLang][key] === 'object') {
            return this.translations[this.currentLang][key][subKey] || subKey;
        }
        return this.translations[this.currentLang][key] || key;
    }
    
    // ALLEEN event delegation - GEEN onclick attributes
    setupGlobalEventListeners() {
        // Event delegation voor foto thumbnail clicks - EENMALIG
        document.removeEventListener('click', this.handlePhotoClick);
        this.handlePhotoClick = (e) => {
            const thumbnail = e.target.closest('.photo-thumbnail');
            if (thumbnail) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // VOORKOMT DUBBELE EVENTS
                
                const photoSrc = thumbnail.getAttribute('data-photo-src');
                const dogName = thumbnail.getAttribute('data-dog-name') || '';
                
                if (photoSrc && photoSrc.trim() !== '') {
                    this.showLargePhoto(photoSrc, dogName);
                } else {
                    const imgElement = thumbnail.querySelector('img');
                    if (imgElement && imgElement.src) {
                        this.showLargePhoto(imgElement.src, dogName);
                    }
                }
            }
        };
        document.addEventListener('click', this.handlePhotoClick);
        
        // Nakomelingen knoppen
        document.addEventListener('click', (e) => {
            const offspringBtn = e.target.closest('.offspring-button');
            if (offspringBtn) {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = parseInt(offspringBtn.getAttribute('data-dog-id'));
                const dogName = offspringBtn.getAttribute('data-dog-name') || '';
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
            const { data: fotos, error } = await window.supabase
                .from('fotos')
                .select('*')
                .eq('stamboomnr', dog.stamboomnr)
                .order('uploaded_at', { ascending: false });
            if (error) return [];
            this.dogPhotosCache.set(cacheKey, fotos || []);
            return fotos || [];
        } catch (error) {
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
            const allDogs = this.allDogs;
            const offspring = allDogs.filter(d => d.vader_id === dogId || d.moeder_id === dogId);
            const offspringWithParents = offspring.map(puppy => {
                let fatherInfo = { naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
                let motherInfo = { naam: this.t('parentsUnknown'), stamboomnr: '', kennelnaam: '' };
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
                return { ...puppy, fatherInfo, motherInfo };
            });
            offspringWithParents.sort((a, b) => {
                const dateA = a.geboortedatum ? new Date(a.geboortedatum) : new Date(0);
                const dateB = b.geboortedatum ? new Date(b.geboortedatum) : new Date(0);
                return dateB - dateA;
            });
            this.dogOffspringCache.set(dogId, offspringWithParents);
            return offspringWithParents;
        } catch (error) {
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
    
    // **EXACT DEZELFDE METHODE ALS DEKREUEN.JS**
    showLargePhoto(photoData, dogName = '') {
        const existingModal = document.getElementById('searchPhotoModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const t = this.t.bind(this);
        
        const modalHTML = `
            <div class="modal fade" id="searchPhotoModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-image"></i> ${dogName || t('photos')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <div class="mb-4">
                                <img src="${photoData}" alt="${dogName}" 
                                     class="img-fluid rounded shadow" style="max-height: 70vh; max-width: 100%;">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('closePhoto')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }
        
        modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalElement = document.getElementById('searchPhotoModal');
        const modal = new bootstrap.Modal(modalElement);
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        });
        
        modal.show();
    }
    
    async showOffspringModal(dogId, dogName = '') {
        const existingOverlay = document.getElementById('offspringModalOverlay');
        if (existingOverlay) existingOverlay.remove();
        
        this.currentOffspringModalDogId = dogId;
        this.currentOffspringModalDogName = dogName;
        
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
        await this.loadAndDisplayOffspring(dogId, dogName);
    }
    
    async loadAndDisplayOffspring(dogId, dogName) {
        const contentDiv = document.getElementById('offspringModalContent');
        if (!contentDiv) return;
        
        try {
            const offspring = await this.getDogOffspring(dogId);
            const count = offspring.length;
            
            if (count === 0) {
                contentDiv.innerHTML = `<div class="text-center py-5"><i class="bi bi-people display-1 text-muted opacity-50"></i><p class="mt-3 text-muted">${this.t('noOffspring')}</p></div>`;
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
                    <h6 class="mb-3"><i class="bi bi-list-ul me-2"></i> ${this.t('offspringList')}</h6>
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
                const birthYear = puppy.geboortedatum ? new Date(puppy.geboortedatum).getFullYear() : '?';
                const fatherDisplay = puppy.fatherInfo.kennelnaam ? `${puppy.fatherInfo.naam} (${puppy.fatherInfo.kennelnaam})` : puppy.fatherInfo.naam;
                const motherDisplay = puppy.motherInfo.kennelnaam ? `${puppy.motherInfo.naam} (${puppy.motherInfo.kennelnaam})` : puppy.motherInfo.naam;
                html += `<tr class="offspring-row" data-dog-id="${puppy.id}" data-dog-name="${puppy.naam || ''}">
                    <td class="text-muted">${index + 1}</td>
                    <td><strong class="text-primary">${puppy.naam || this.t('unknown')}</strong>${puppy.kennelnaam ? `<br><small class="text-muted">${puppy.kennelnaam}</small>` : ''}</td>
                    <td>${fatherDisplay}</td>
                    <td>${motherDisplay}</td>
                    <td><code>${puppy.stamboomnr || ''}</code></td>
                    <td>${puppy.ras || ''}</td>
                    <td>${birthYear}</td>
                </tr>`;
            });
            
            html += `</tbody></table></div></div><div class="mt-4 text-center"><small class="text-muted"><i class="bi bi-info-circle me-1"></i>${this.t('viewDogDetails')}</small></div>`;
            contentDiv.innerHTML = html;
            
            contentDiv.querySelectorAll('.offspring-row').forEach(row => {
                row.addEventListener('click', (e) => {
                    const puppyId = parseInt(row.getAttribute('data-dog-id'));
                    const puppyName = row.getAttribute('data-dog-name');
                    this.showDogDetailsModal(puppyId, puppyName);
                });
            });
        } catch (error) {
            contentDiv.innerHTML = `<div class="alert alert-danger">Fout bij laden nakomelingen: ${error.message}</div>`;
        }
    }
    
    async showDogDetailsModal(dogId, dogName = '') {
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog) {
            this.showError(`Hond niet gevonden (ID: ${dogId})`);
            return;
        }
        
        const existingOverlay = document.getElementById('dogDetailsModalOverlay');
        if (existingOverlay) existingOverlay.remove();
        
        if (!this.currentUserId) this.currentUserId = await this.getCurrentUserId();
        
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
                        <div class="text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">${this.t('loading')}</span></div><p class="mt-3">${this.t('loading')}</p></div>
                    </div>
                    <div class="offspring-modal-footer">
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-outline-secondary back-to-offspring-btn"><i class="bi bi-arrow-left me-1"></i> ${this.t('backToOffspring')}</button>
                            <button type="button" class="btn btn-secondary dog-details-modal-close"><i class="bi bi-x-lg me-1"></i> ${this.t('closeDogDetails')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        await this.loadAndDisplayDogDetails(dogId);
    }
    
    async loadAndDisplayDogDetails(dogId) {
        const contentDiv = document.getElementById('dogDetailsModalContent');
        if (!contentDiv) return;
        
        const dog = this.allDogs.find(d => d.id === dogId);
        if (!dog) {
            contentDiv.innerHTML = `<div class="alert alert-danger">Hond niet gevonden</div>`;
            return;
        }
        
        const t = this.t.bind(this);
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
        
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        
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
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : this.currentLang === 'de' ? 'de-DE' : 'en-US');
        };
        
        const getHealthBadge = (value, type) => {
            if (!value || value === '') return `<span class="badge bg-secondary">${t('unknown')}</span>`;
            let badgeClass = '';
            let badgeText = value;
            switch(type) {
                case 'hip': badgeClass = 'badge-hd'; badgeText = t('hipGrades', value) || value; break;
                case 'elbow': badgeClass = 'badge-ed'; badgeText = t('elbowGrades', value) || value; break;
                case 'patella': badgeClass = 'badge-pl'; badgeText = t('patellaGrades', value) || value; break;
                case 'eyes': badgeClass = 'badge-eyes'; badgeText = t('eyeStatus', value) || value; break;
                case 'dandy': badgeClass = 'badge-dandy'; badgeText = t('dandyStatus', value) || value; break;
                case 'thyroid': badgeClass = 'badge-thyroid'; badgeText = t('thyroidStatus', value) || value; break;
                default: badgeClass = 'badge bg-secondary';
            }
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        
        const displayValue = (value) => value && value !== '' ? value : t('unknown');
        const genderText = dog.geslacht === 'reuen' ? t('male') : dog.geslacht === 'teven' ? t('female') : t('unknown');
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const offspringCount = await this.getOffspringCount(dog.id);
        
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
                                    ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? `<span class="vachtkleur">${dog.vachtkleur}</span>` : `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                                    ${offspringCount > 0 ? 
                                        `<a href="#" class="offspring-badge offspring-button" data-dog-id="${dog.id}" data-dog-name="${displayValue(dog.naam)}"><i class="bi bi-people-fill"></i> ${offspringCount} ${t('offspringCount')}</a>` : 
                                        `<span class="offspring-badge" style="background: #6c757d; cursor: default;"><i class="bi bi-people"></i> 0 ${t('offspringCount')}</span>`}
                                </div>
                            </div>
                            <div class="text-end">
                                ${dog.geboortedatum ? `<div class="text-muted"><i class="bi bi-calendar me-1"></i> ${formatDate(dog.geboortedatum)}</div>` : ''}
                                ${dog.overlijdensdatum ? `<div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}"><i class="bi bi-calendar-x me-1"></i> ${formatDate(dog.overlijdensdatum)}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${hasPhotos ? `
                <div class="photos-section mb-4">
                    <div class="photos-title">
                        <div class="photos-title-text"><i class="bi bi-camera"></i><span>${t('photos')}</span></div>
                        <div class="click-hint-text">${t('clickToEnlarge')}</div>
                    </div>
                    <div class="photos-grid-container" id="dogDetailsPhotosGrid${dog.id}"></div>
                </div>` : ''}
                
                <div class="info-group mb-4">
                    <div class="info-group-title"><i class="bi bi-people me-1"></i> ${t('parents')}</div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                <div class="fw-bold mb-1 text-primary"><i class="bi bi-gender-male me-1"></i> ${t('father')}</div>
                                <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                <div class="fw-bold mb-1 text-danger"><i class="bi bi-gender-female me-1"></i> ${t('mother')}</div>
                                <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="info-group mb-4">
                    <div class="info-group-title"><i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}</div>
                    <div class="row">
                        <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('hipDysplasia')}</div><div>${getHealthBadge(dog.heupdysplasie, 'hip')}</div></div>
                        <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('elbowDysplasia')}</div><div>${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</div></div>
                        <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('patellaLuxation')}</div><div>${getHealthBadge(dog.patella, 'patella')}</div></div>
                        <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('eyes')}</div><div>${getHealthBadge(dog.ogen, 'eyes')}</div>${dog.ogenverklaring ? `<div class="text-muted small mt-1">${dog.ogenverklaring}</div>` : ''}</div>
                        <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('dandyWalker')}</div><div>${getHealthBadge(dog.dandyWalker, 'dandy')}</div></div>
                        <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('thyroid')}</div><div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>${dog.schildklierverklaring ? `<div class="text-muted small mt-1">${dog.schildklierverklaring}</div>` : ''}</div>
                    </div>
                </div>
                
                <div class="info-group">
                    <div class="info-group-title"><i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}</div>
                    <div class="row mb-3">
                        <div class="col-md-6"><div class="fw-bold mb-1">${t('country')}</div><div>${displayValue(dog.land)}</div></div>
                        <div class="col-md-6"><div class="fw-bold mb-1">${t('zipCode')}</div><div>${displayValue(dog.postcode)}</div></div>
                    </div>
                    <div class="mt-3"><div class="fw-bold mb-2">${t('remarks')}</div><div class="remarks-box">${dog.opmerkingen ? dog.opmerkingen : t('noAdditionalInfo')}</div></div>
                </div>
                
                <div class="info-group mt-4">
                    <div class="info-group-title"><i class="bi bi-lock me-1"></i> ${t('privateInfo')}</div>
                    ${hasPrivateInfo ? `<div class="remarks-box" style="background-color: #fff3cd; border-color: #ffeaa7;">${privateNotes}</div>` : `<div class="text-muted"><i>${t('privateInfoOwnerOnly')}</i></div>`}
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
                    setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 300);
                }
                this.showOffspringModal(newDogId, newDogName);
            });
        });
    }
    
    async loadAndDisplayPhotosForModal(dog) {
        try {
            const photos = await this.getDogPhotos(dog.id);
            const container = document.getElementById('dogDetailsModalContent');
            const photosGrid = container.querySelector(`#dogDetailsPhotosGrid${dog.id}`);
            if (!photosGrid || photos.length === 0) {
                if (photosGrid) photosGrid.innerHTML = `<div class="text-muted small">${this.t('noPhotos')}</div>`;
                return;
            }
            let photosHTML = '';
            photos.forEach((photo, index) => {
                let thumbnailUrl = photo.thumbnail || photo.data;
                let fullSizeUrl = photo.data;
                if (thumbnailUrl && fullSizeUrl) {
                    photosHTML += `<div class="photo-thumbnail" data-photo-id="${photo.id || index}" data-dog-id="${dog.id}" data-photo-index="${index}" data-photo-src="${fullSizeUrl}" data-thumbnail-src="${thumbnailUrl}" data-dog-name="${dog.naam || ''}"><img src="${thumbnailUrl}" alt="${dog.naam || ''} - ${photo.filename || ''}" class="thumbnail-img" loading="lazy"><div class="photo-hover"><i class="bi bi-zoom-in"></i></div></div>`;
                }
            });
            photosGrid.innerHTML = photosHTML;
        } catch (error) {
            console.error('Fout bij laden foto\'s:', error);
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
                                                        <button type="button" class="btn btn-search-type btn-outline-info active me-2" data-search-type="name">${t('searchName')}</button>
                                                        <button type="button" class="btn btn-search-type btn-outline-info" data-search-type="kennel">${t('searchKennel')}</button>
                                                    </div>
                                                    <div class="mb-3" id="nameSearchField">
                                                        <label for="searchNameInput" class="form-label fw-bold small">${t('searchName')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-person text-muted"></i></span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" id="searchNameInput" placeholder="${t('searchPlaceholder')}" autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${t('typeToSearch')}</div>
                                                    </div>
                                                    <div class="mb-3 d-none" id="kennelSearchField">
                                                        <label for="searchKennelInput" class="form-label fw-bold small">${t('searchKennel')}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text bg-white border-end-0"><i class="bi bi-house text-muted"></i></span>
                                                            <input type="text" class="form-control search-input border-start-0 ps-0" id="searchKennelInput" placeholder="${t('kennelPlaceholder')}" autocomplete="off">
                                                        </div>
                                                        <div class="form-text mt-1 small">${t('typeToSearchKennel')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex-grow-1 overflow-auto" id="searchResultsContainer">
                                                <div class="p-3"><div class="text-center py-5"><i class="bi bi-search display-1 text-muted opacity-50"></i><p class="mt-3 text-muted">${t('typeToSearch')}</p></div></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-7 p-0" id="detailsColumn">
                                        <div class="h-100 d-flex flex-column">
                                            <div class="d-none d-md-block sticky-top bg-white z-1 border-bottom" style="top: 0;">
                                                <div class="p-3"><h6 class="mb-0 text-muted"><i class="bi bi-info-circle me-2"></i> ${t('dogDetails')}</h6></div>
                                            </div>
                                            <div class="flex-grow-1 overflow-auto" id="detailsContainer">
                                                <div class="p-3"><div class="text-center py-5"><i class="bi bi-eye display-1 text-muted opacity-50"></i><p class="mt-3 text-muted">${t('selectDogToView')}</p></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="searchModalCloseBtnFooter"><i class="bi bi-x-circle me-1"></i> ${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                /* Search Manager styles */
                .modal-xl.modal-fullscreen-lg-down { max-width: 95vw; height: 90vh; }
                @media (max-width: 992px) { .modal-xl.modal-fullscreen-lg-down { max-width: 100vw; height: 100vh; margin: 0; } }
                .search-input { font-size: 1.1rem; padding: 10px 15px; border: 2px solid #dee2e6; border-radius: 8px; transition: all 0.3s; }
                .search-input:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13,110,253,0.25); }
                .btn-search-type { flex: 1; border-radius: 8px; padding: 8px 12px; transition: all 0.3s; font-size: 0.9rem; }
                .btn-search-type.active { background-color: #0d6efd; color: white; border-color: #0d6efd; }
                #searchResultsContainer { max-height: calc(100vh - 200px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
                #detailsContainer { max-height: calc(100vh - 150px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
                .dog-result-item { cursor: pointer; transition: all 0.2s; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 8px; padding: 12px 15px; background: white; }
                .dog-result-item:hover { background-color: #f8f9fa; border-color: #0d6efd; transform: translateX(3px); }
                .dog-result-item.selected { background-color: #e8f4fd; border-color: #0d6efd; border-left: 4px solid #0d6efd; }
                .dog-name-line { font-size: 1.1rem; font-weight: 700; color: #0d6efd; margin-bottom: 8px; }
                .dog-details-line { color: #495057; font-size: 0.95rem; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
                .search-stats { font-size: 0.85rem; color: #6c757d; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #dee2e6; }
                .details-card { border-radius: 8px; border: 1px solid #dee2e6; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .details-header { background: white; color: #212529; padding: 20px; border-radius: 8px 8px 0 0; border-bottom: 1px solid #dee2e6; }
                .details-body { padding: 20px; background: white; }
                .info-group { margin-bottom: 20px; }
                .info-group-title { font-size: 0.9rem; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #f0f0f0; }
                .badge-hd { background-color: #20c997; color: white; }
                .badge-ed { background-color: #6f42c1; color: white; }
                .badge-pl { background-color: #fd7e14; color: white; }
                .badge-eyes { background-color: #17a2b8; color: white; }
                .badge-dandy { background-color: #e83e8c; color: white; }
                .badge-thyroid { background-color: #28a745; color: white; }
                .father-card { background: #e8f4fd; border: 1px solid #cfe2ff; padding: 15px; border-radius: 6px; margin-bottom: 15px; cursor: pointer; transition: all 0.2s; }
                .father-card:hover { background: #d1e7ff; transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .mother-card { background: #fce8f1; border: 1px solid #f8d7e3; padding: 15px; border-radius: 6px; margin-bottom: 15px; cursor: pointer; transition: all 0.2s; }
                .mother-card:hover { background: #f9d9e9; transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .parent-name { font-size: 1.1rem; font-weight: 600; color: #0d6efd; margin-bottom: 5px; }
                .parent-mother-name { font-size: 1.1rem; font-weight: 600; color: #dc3545; margin-bottom: 5px; }
                .parent-info { color: #6c757d; font-size: 0.85rem; }
                .click-hint { font-size: 0.75rem; color: #6c757d; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
                .remarks-box { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; border-radius: 6px; font-style: italic; color: #495057; }
                .dog-name-header { color: #0d6efd; font-size: 1.5rem; font-weight: 700; margin-bottom: 5px; }
                .dog-detail-header-line { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 8px; color: #495057; }
                .dog-detail-header-line .geslacht { font-weight: 600; color: #0d6efd; }
                .dog-detail-header-line .ras { font-weight: 500; }
                .dog-detail-header-line .stamboom { font-weight: 700; color: #212529; }
                .dog-detail-header-line .vachtkleur { color: #d63384; font-weight: 500; }
                .offspring-badge { background: linear-gradient(135deg, #6f42c1, #0d6efd); color: white !important; padding: 4px 10px; border-radius: 20px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .offspring-badge:hover { background: linear-gradient(135deg, #0d6efd, #6f42c1); transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); color: white !important; text-decoration: none; }
                .photos-section { margin-bottom: 15px; }
                .photos-title { font-size: 0.9rem; text-transform: uppercase; color: #6c757d; letter-spacing: 1px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; }
                .photos-title-text { display: flex; align-items: center; gap: 6px; }
                .click-hint-text { font-size: 0.75rem; color: #6c757d; font-style: italic; font-weight: normal; text-transform: none; letter-spacing: normal; }
                .photos-grid-container { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; justify-content: flex-start; min-height: auto; }
                .photo-thumbnail { position: relative; width: 48px; height: 48px; border-radius: 4px; overflow: hidden; cursor: pointer; border: 1px solid #dee2e6; transition: all 0.2s; flex-shrink: 0; }
                .photo-thumbnail:hover { border-color: #0d6efd; transform: scale(1.1); box-shadow: 0 2px 5px rgba(0,0,0,0.15); }
                .thumbnail-img { width: 100%; height: 100%; object-fit: cover; }
                .photo-hover { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
                .photo-thumbnail:hover .photo-hover { opacity: 1; }
                .photo-hover i { color: white; font-size: 0.8rem; }
                .offspring-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 1090; display: none; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
                .offspring-modal-container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; max-height: 90vh; width: 90%; max-width: 900px; animation: slideUp 0.3s; }
                .offspring-modal-header { padding: 16px 20px; background: linear-gradient(135deg, #6f42c1, #0d6efd); color: white; display: flex; justify-content: space-between; align-items: center; }
                .offspring-modal-title { margin: 0; font-size: 1.3rem; font-weight: 600; }
                .offspring-modal-body { padding: 20px; overflow-y: auto; flex: 1; max-height: 60vh; }
                .offspring-modal-footer { padding: 15px 20px; background: #f8f9fa; border-top: 1px solid #dee2e6; text-align: right; }
                .offspring-row { cursor: pointer; transition: all 0.2s; }
                .offspring-row:hover { background-color: #e8f4fd; }
                #searchModal { z-index: 1055; }
                #offspringModalOverlay { z-index: 1090; }
                #dogDetailsModalOverlay { z-index: 1100; }
                #searchPhotoModal { z-index: 1110; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @media (max-width: 768px) {
                    .photo-thumbnail { width: 40px; height: 40px; }
                    .offspring-modal-container { width: 95% !important; max-width: 95% !important; }
                    .offspring-modal-title { font-size: 1.1rem !important; }
                    .offspring-row { font-size: 0.8rem !important; }
                    .dog-detail-header-line .stamboom, .dog-detail-header-line .ras, .dog-detail-header-line .geslacht, .dog-detail-header-line .vachtkleur, .dog-detail-header-line .offspring-badge { font-size: 0.85rem !important; }
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
            if (btnType === type) btn.classList.add('active');
            else btn.classList.remove('active');
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
            if (this.allDogs.length === 0) await this.loadSearchData();
        });
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm.length >= 1) this.filterDogsForNameField(searchTerm);
            else { this.showInitialView(); this.clearDetails(); }
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
            if (this.allDogs.length === 0) await this.loadSearchData();
        });
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm.length >= 1) this.filterDogsByKennel(searchTerm);
            else { this.showInitialView(); this.clearDetails(); }
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
        container.innerHTML = `<div class="p-3"><div class="text-center py-5"><i class="bi bi-search display-1 text-muted opacity-50"></i><p class="mt-3 text-muted">${message}</p></div></div>`;
    }
    
    clearDetails() {
        const container = document.getElementById('detailsContainer');
        if (!container) return;
        const t = this.t.bind(this);
        container.innerHTML = `<div class="p-3"><div class="text-center py-5"><i class="bi bi-eye display-1 text-muted opacity-50"></i><p class="mt-3 text-muted">${t('selectDogToView')}</p></div></div>`;
    }
    
    async loadSearchData() {
        if (this.isLoading) return;
        try {
            this.isLoading = true;
            this.showProgress("Honden laden... (0 geladen)");
            if (!this.currentUserId) this.currentUserId = await this.getCurrentUserId();
            this.allDogs = await this.loadAllDogsWithPaginationDogDataManagerStyle();
            this.allDogs.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
            console.log(`SearchManager: ${this.allDogs.length} honden geladen`);
            this.showInitialView();
        } catch (error) {
            console.error('SearchManager: Fout bij laden honden:', error);
            this.showError(`Laden mislukt: ${error.message}`);
            this.allDogs = [];
        } finally {
            this.isLoading = false;
            this.hideProgress();
        }
    }
    
    async loadAllDogsWithPaginationDogDataManagerStyle() {
        try {
            let allDogs = [];
            let currentPage = 1;
            const pageSize = 1000;
            let hasMorePages = true;
            let totalLoaded = 0;
            while (hasMorePages) {
                const result = await hondenService.getHonden(currentPage, pageSize);
                if (result.honden && result.honden.length > 0) {
                    allDogs = allDogs.concat(result.honden);
                    totalLoaded += result.honden.length;
                    this.showProgress(`Honden laden... (${totalLoaded} geladen)`);
                    hasMorePages = result.heeftVolgende;
                    if (hasMorePages) currentPage++;
                    if (currentPage > 100) break;
                } else hasMorePages = false;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return allDogs;
        } catch (error) {
            throw error;
        }
    }
    
    filterDogsForNameField(searchTerm = '') {
        const normalizedSearchTerm = this.normalizeText(searchTerm);
        this.filteredDogs = this.allDogs.filter(dog => {
            const normalizedNaam = this.normalizeText(dog.naam);
            const normalizedKennelnaam = this.normalizeText(dog.kennelnaam);
            if (normalizedNaam.includes(normalizedSearchTerm)) return true;
            if (normalizedKennelnaam.includes(normalizedSearchTerm)) return true;
            const combined = `${normalizedNaam} ${normalizedKennelnaam}`;
            return combined.includes(normalizedSearchTerm);
        });
        this.displaySearchResults();
    }
    
    filterDogsByKennel(searchTerm = '') {
        const normalizedSearchTerm = this.normalizeText(searchTerm);
        this.filteredDogs = this.allDogs.filter(dog => {
            const normalizedKennelnaam = this.normalizeText(dog.kennelnaam);
            return normalizedKennelnaam.includes(normalizedSearchTerm);
        });
        this.filteredDogs.sort((a, b) => (a.naam || '').toLowerCase().localeCompare((b.naam || '').toLowerCase()));
        this.displaySearchResults();
    }
    
    displaySearchResults() {
        const t = this.t.bind(this);
        const container = document.getElementById('searchResultsContainer');
        if (!container) return;
        if (this.filteredDogs.length === 0) {
            container.innerHTML = `<div class="p-3"><div class="text-center py-5"><i class="bi bi-search-x display-1 text-muted opacity-50"></i><p class="mt-3 text-muted">${t('noDogsFound')}</p></div></div>`;
            return;
        }
        let html = `<div class="p-3"><div class="search-stats"><i class="bi bi-info-circle me-1"></i> ${this.filteredDogs.length} ${t('found')}</div>`;
        this.filteredDogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? t('male') : dog.geslacht === 'teven' ? t('female') : t('unknown');
            html += `<div class="dog-result-item" data-id="${dog.id}">
                <div class="dog-name-line"><span class="dog-name">${dog.naam || t('unknown')}</span>${dog.kennelnaam ? `<span class="text-muted ms-2">${dog.kennelnaam}</span>` : ''}</div>
                <div class="dog-details-line">${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}<span class="geslacht">${genderText}</span></div>
            </div>`;
        });
        html += `</div>`;
        container.innerHTML = html;
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const hondId = parseInt(item.getAttribute('data-id'));
                this.selectDogById(hondId);
                if (window.innerWidth <= 768) this.collapseSearchResultsOnMobile();
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
        if (detailsContainer.querySelector('.mobile-back-button')) return;
        const backButtonDiv = document.createElement('div');
        backButtonDiv.className = 'mobile-back-button';
        backButtonDiv.innerHTML = `<button class="btn btn-sm btn-outline-secondary"><i class="bi bi-arrow-left me-1"></i> ${this.t('backToSearch')}</button>`;
        backButtonDiv.querySelector('button').addEventListener('click', () => this.restoreSearchViewOnMobile());
        const firstChild = detailsContainer.firstChild;
        if (firstChild) detailsContainer.insertBefore(backButtonDiv, firstChild);
        else detailsContainer.appendChild(backButtonDiv);
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
            const searchInput = this.searchType === 'name' ? document.getElementById('searchNameInput') : document.getElementById('searchKennelInput');
            if (searchInput) {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (searchTerm.length >= 1) {
                    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
                    searchInput.dispatchEvent(inputEvent);
                } else { this.showInitialView(); this.clearDetails(); }
                searchInput.focus();
            }
        }
    }
    
    selectDog(dog) {
        document.querySelectorAll('.dog-result-item').forEach(item => {
            item.classList.remove('selected');
            if (parseInt(item.getAttribute('data-id')) === dog.id) item.classList.add('selected');
        });
        this.showDogDetails(dog);
        if (window.innerWidth <= 768) this.collapseSearchResultsOnMobile();
    }
    
    selectDogById(hondId) {
        const dog = this.allDogs.find(h => h.id === hondId);
        if (dog) this.selectDog(dog);
    }
    
    async showDogDetails(dog, isParentView = false, originalDogId = null) {
        const t = this.t.bind(this);
        const container = document.getElementById('detailsContainer');
        if (!container) return;
        container.innerHTML = '';
        if (this.isMobileCollapsed && window.innerWidth <= 768) this.addMobileBackButton();
        if (!this.currentUserId) this.currentUserId = await this.getCurrentUserId();
        const privateNotes = await this.getPrivateInfoForDog(dog.stamboomnr);
        const hasPrivateInfo = privateNotes !== null && privateNotes.trim() !== '';
        let fatherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        let motherInfo = { id: null, naam: t('parentsUnknown'), stamboomnr: '', ras: '', kennelnaam: '' };
        if (dog.vader_id) {
            const father = this.allDogs.find(d => d.id === dog.vader_id);
            if (father) {
                fatherInfo = { id: father.id, naam: father.naam || t('unknown'), stamboomnr: father.stamboomnr || '', ras: father.ras || '', kennelnaam: father.kennelnaam || '' };
            }
        }
        if (dog.moeder_id) {
            const mother = this.allDogs.find(d => d.id === dog.moeder_id);
            if (mother) {
                motherInfo = { id: mother.id, naam: mother.naam || t('unknown'), stamboomnr: mother.stamboomnr || '', ras: mother.ras || '', kennelnaam: mother.kennelnaam || '' };
            }
        }
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : this.currentLang === 'de' ? 'de-DE' : 'en-US');
        };
        const getHealthBadge = (value, type) => {
            if (!value || value === '') return `<span class="badge bg-secondary">${t('unknown')}</span>`;
            let badgeClass = '';
            let badgeText = value;
            switch(type) {
                case 'hip': badgeClass = 'badge-hd'; badgeText = t('hipGrades', value) || value; break;
                case 'elbow': badgeClass = 'badge-ed'; badgeText = t('elbowGrades', value) || value; break;
                case 'patella': badgeClass = 'badge-pl'; badgeText = t('patellaGrades', value) || value; break;
                case 'eyes': badgeClass = 'badge-eyes'; badgeText = t('eyeStatus', value) || value; break;
                case 'dandy': badgeClass = 'badge-dandy'; badgeText = t('dandyStatus', value) || value; break;
                case 'thyroid': badgeClass = 'badge-thyroid'; badgeText = t('thyroidStatus', value) || value; break;
                default: badgeClass = 'badge bg-secondary';
            }
            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
        };
        const displayValue = (value) => value && value !== '' ? value : t('unknown');
        const genderText = dog.geslacht === 'reuen' ? t('male') : dog.geslacht === 'teven' ? t('female') : t('unknown');
        const hasPhotos = await this.checkDogHasPhotos(dog.id);
        const offspringCount = await this.getOffspringCount(dog.id);
        const html = `
            <div class="p-3">
                <div class="details-card" data-dog-name="${dog.naam || ''}">
                    ${isParentView ? `
                    <div class="details-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-sm btn-outline-secondary back-button" data-original-dog="${originalDogId}"><i class="bi bi-arrow-left me-1"></i> ${t('backToSearch')}</button>
                            <div class="text-muted small"><i class="bi bi-info-circle me-1"></i> ${t('viewingParent')}</div>
                        </div>
                    </div>` : ''}
                    <div class="details-header ${isParentView ? 'pt-0' : ''}">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="dog-name-header">${displayValue(dog.naam)}</div>
                                ${dog.kennelnaam ? `<div class="text-muted mb-2">${displayValue(dog.kennelnaam)}</div>` : ''}
                                <div class="dog-detail-header-line mt-2">
                                    ${dog.stamboomnr ? `<span class="stamboom">${dog.stamboomnr}</span>` : ''}
                                    ${dog.ras ? `<span class="ras">${dog.ras}</span>` : ''}
                                    <span class="geslacht">${genderText}</span>
                                    ${dog.vachtkleur && dog.vachtkleur.trim() !== '' ? `<span class="vachtkleur">${dog.vachtkleur}</span>` : `<span class="text-muted fst-italic">geen vachtkleur</span>`}
                                    ${offspringCount > 0 ? 
                                        `<a href="#" class="offspring-badge offspring-button" data-dog-id="${dog.id}" data-dog-name="${displayValue(dog.naam)}"><i class="bi bi-people-fill"></i> ${offspringCount} ${t('offspringCount')}</a>` : 
                                        `<span class="offspring-badge" style="background: #6c757d; cursor: default;"><i class="bi bi-people"></i> 0 ${t('offspringCount')}</span>`}
                                </div>
                            </div>
                            <div class="text-end">
                                ${dog.geboortedatum ? `<div class="text-muted"><i class="bi bi-calendar me-1"></i> ${formatDate(dog.geboortedatum)}</div>` : ''}
                                ${dog.overlijdensdatum ? `<div class="text-muted ${dog.geboortedatum ? 'mt-1' : ''}"><i class="bi bi-calendar-x me-1"></i> ${formatDate(dog.overlijdensdatum)}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="details-body">
                        ${hasPhotos ? `
                        <div class="photos-section">
                            <div class="photos-title">
                                <div class="photos-title-text"><i class="bi bi-camera"></i><span>${t('photos')}</span></div>
                                <div class="click-hint-text">${t('clickToEnlarge')}</div>
                            </div>
                            <div class="photos-grid-container" id="photosGrid${dog.id}"></div>
                        </div>` : ''}
                        <div class="info-group">
                            <div class="info-group-title d-flex justify-content-between align-items-center">
                                <div><i class="bi bi-people me-1"></i> ${t('parents')}</div>
                                <button class="btn btn-sm btn-outline-primary btn-pedigree" data-dog-id="${dog.id}"><i class="bi bi-diagram-3 me-1"></i> ${t('pedigreeButton')}</button>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="father-card" ${fatherInfo.id ? `data-parent-id="${fatherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                        <div class="fw-bold mb-1 text-primary"><i class="bi bi-gender-male me-1"></i> ${t('father')}</div>
                                        <div class="parent-name">${fatherInfo.naam} ${fatherInfo.kennelnaam}</div>
                                        ${fatherInfo.stamboomnr ? `<div class="parent-info">${fatherInfo.stamboomnr}</div>` : ''}
                                        ${fatherInfo.ras ? `<div class="parent-info">${fatherInfo.ras}</div>` : ''}
                                        ${fatherInfo.id ? `<div class="click-hint"><i class="bi bi-arrow-right-circle"></i> ${t('clickToView')}</div>` : ''}
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="mother-card" ${motherInfo.id ? `data-parent-id="${motherInfo.id}" data-original-dog="${dog.id}"` : ''}>
                                        <div class="fw-bold mb-1 text-danger"><i class="bi bi-gender-female me-1"></i> ${t('mother')}</div>
                                        <div class="parent-mother-name">${motherInfo.naam} ${motherInfo.kennelnaam}</div>
                                        ${motherInfo.stamboomnr ? `<div class="parent-info">${motherInfo.stamboomnr}</div>` : ''}
                                        ${motherInfo.ras ? `<div class="parent-info">${motherInfo.ras}</div>` : ''}
                                        ${motherInfo.id ? `<div class="click-hint"><i class="bi bi-arrow-right-circle"></i> ${t('clickToView')}</div>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="info-group">
                            <div class="info-group-title"><i class="bi bi-heart-pulse me-1"></i> ${t('healthInfo')}</div>
                            <div class="row">
                                <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('hipDysplasia')}</div><div>${getHealthBadge(dog.heupdysplasie, 'hip')}</div></div>
                                <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('elbowDysplasia')}</div><div>${getHealthBadge(dog.elleboogdysplasie, 'elbow')}</div></div>
                                <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('patellaLuxation')}</div><div>${getHealthBadge(dog.patella, 'patella')}</div></div>
                                <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('eyes')}</div><div>${getHealthBadge(dog.ogen, 'eyes')}</div>${dog.ogenverklaring ? `<div class="text-muted small mt-1">${dog.ogenverklaring}</div>` : ''}</div>
                                <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('dandyWalker')}</div><div>${getHealthBadge(dog.dandyWalker, 'dandy')}</div></div>
                                <div class="col-md-6 mb-3"><div class="fw-bold mb-1">${t('thyroid')}</div><div>${getHealthBadge(dog.schildklier, 'thyroid')}</div>${dog.schildklierverklaring ? `<div class="text-muted small mt-1">${dog.schildklierverklaring}</div>` : ''}</div>
                            </div>
                        </div>
                        <div class="info-group">
                            <div class="info-group-title"><i class="bi bi-info-circle me-1"></i> ${t('additionalInfo')}</div>
                            <div class="row mb-3">
                                <div class="col-md-6"><div class="fw-bold mb-1">${t('country')}</div><div>${displayValue(dog.land)}</div></div>
                                <div class="col-md-6"><div class="fw-bold mb-1">${t('zipCode')}</div><div>${displayValue(dog.postcode)}</div></div>
                            </div>
                            <div class="mt-3"><div class="fw-bold mb-2">${t('remarks')}</div><div class="remarks-box">${dog.opmerkingen ? dog.opmerkingen : t('noAdditionalInfo')}</div></div>
                        </div>
                        <div class="info-group mt-4">
                            <div class="info-group-title"><i class="bi bi-lock me-1"></i> ${t('privateInfo')}</div>
                            ${hasPrivateInfo ? `<div class="remarks-box private-remarks-box">${privateNotes}</div>` : `<div class="text-muted"><i>${t('privateInfoOwnerOnly')}</i></div>`}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
        if (hasPhotos) this.loadAndDisplayPhotos(dog);
        if (fatherInfo.id) {
            const fatherCard = container.querySelector('.father-card');
            if (fatherCard) fatherCard.addEventListener('click', (e) => {
                const parentId = parseInt(fatherCard.getAttribute('data-parent-id'));
                const originalDogId = parseInt(fatherCard.getAttribute('data-original-dog'));
                this.showParentDetails(parentId, originalDogId);
            });
        }
        if (motherInfo.id) {
            const motherCard = container.querySelector('.mother-card');
            if (motherCard) motherCard.addEventListener('click', (e) => {
                const parentId = parseInt(motherCard.getAttribute('data-parent-id'));
                const originalDogId = parseInt(motherCard.getAttribute('data-original-dog'));
                this.showParentDetails(parentId, originalDogId);
            });
        }
        container.querySelectorAll('.btn-pedigree').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const dogId = parseInt(btn.getAttribute('data-dog-id'));
                await this.openPedigree(dogId);
            });
        });
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
            if (backButton) backButton.addEventListener('click', (e) => {
                const originalDogId = parseInt(backButton.getAttribute('data-original-dog'));
                const originalDog = this.allDogs.find(d => d.id === originalDogId);
                if (originalDog) this.showDogDetails(originalDog);
            });
        }
    }
    
    async loadAndDisplayPhotos(dog) {
        try {
            const photos = await this.getDogPhotos(dog.id);
            const container = document.getElementById('detailsContainer');
            const photosGrid = container.querySelector(`#photosGrid${dog.id}`);
            if (!photosGrid || photos.length === 0) {
                if (photosGrid) photosGrid.innerHTML = `<div class="text-muted small">${this.t('noPhotos')}</div>`;
                return;
            }
            let photosHTML = '';
            photos.forEach((photo, index) => {
                let thumbnailUrl = photo.thumbnail || photo.data;
                let fullSizeUrl = photo.data;
                if (thumbnailUrl && fullSizeUrl) {
                    photosHTML += `<div class="photo-thumbnail" data-photo-id="${photo.id || index}" data-dog-id="${dog.id}" data-photo-index="${index}" data-photo-src="${fullSizeUrl}" data-thumbnail-src="${thumbnailUrl}" data-dog-name="${dog.naam || ''}"><img src="${thumbnailUrl}" alt="${dog.naam || ''} - ${photo.filename || ''}" class="thumbnail-img" loading="lazy"><div class="photo-hover"><i class="bi bi-zoom-in"></i></div></div>`;
                }
            });
            photosGrid.innerHTML = photosHTML;
        } catch (error) {
            const photosGrid = document.getElementById(`photosGrid${dog.id}`);
            if (photosGrid) photosGrid.innerHTML = `<div class="text-danger small">Fout bij laden foto's</div>`;
        }
    }
    
    showParentDetails(parentId, originalDogId) {
        const parent = this.allDogs.find(d => d.id === parentId);
        if (parent) {
            this.showDogDetails(parent, true, originalDogId);
            document.querySelectorAll('.dog-result-item').forEach(item => {
                item.classList.remove('selected');
                if (parseInt(item.getAttribute('data-id')) === parentId) item.classList.add('selected');
            });
        }
    }
    
    async openPedigree(dogId) {
        try {
            if (!this.stamboomManager) {
                this.stamboomManager = new StamboomManager(this.db, this.currentLang);
                await this.stamboomManager.initialize();
            }
            const dog = this.allDogs.find(d => d.id === dogId);
            if (!dog) { this.showError("Hond niet gevonden"); return; }
            this.stamboomManager.showPedigree(dog);
        } catch (error) {
            this.showError(`Fout bij openen stamboom: ${error.message}`);
        }
    }
    
    showProgress(message) {
        if (window.uiHandler?.showProgress) window.uiHandler.showProgress(message);
        else console.log('SearchManager Progress:', message);
    }
    
    hideProgress() {
        if (window.uiHandler?.hideProgress) window.uiHandler.hideProgress();
        else console.log('SearchManager: Progress hidden');
    }
    
    showError(message) {
        if (window.uiHandler?.showError) window.uiHandler.showError(message);
        else { console.error('SearchManager Error:', message); alert(message); }
    }
    
    showSuccess(message) {
        if (window.uiHandler?.showSuccess) window.uiHandler.showSuccess(message);
        else console.log('SearchManager Success:', message);
    }
}

// Maak instance aan
const SearchManagerInstance = new SearchManager();

// Zet globaal
window.SearchManager = SearchManagerInstance;
window.searchManager = SearchManagerInstance;

console.log('📦 SearchManager geladen - GEEN DUBBELE FOTOS MEER');