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
        
        // Unieke ID's voor isolatie
        this.uniquePrefix = 'rtc-'; // ReuTeefCombinatie prefix
        this.isolatedEventListeners = new Map();
        
        // Stamboom module referentie
        this.stamboomModule = null;
        
        // Vertalingen
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
                greatGrandmotherLabel: "Overgrootmoemer",
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
    }
    
    t(key, params = {}) {
        let text = this.translations[this.currentLang][key] || key;
        
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
    
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
                // Filter op geslacht als requiredGender is opgegeven
                const filteredHonden = result.honden.filter(hond => {
                    if (!requiredGender) return true;
                    
                    if (requiredGender === 'female') {
                        return hond.geslacht === 'teven' || hond.geslacht === 'vrouwelijk';
                    } else if (requiredGender === 'male') {
                        return hond.geslacht === 'reuen' || hond.geslacht === 'mannelijk';
                    }
                    return true;
                });
                
                if (filteredHonden.length > 0) {
                    filteredHonden.forEach(hond => {
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
                    return filteredHonden[0];
                }
            }
        } catch (error) {
            console.error(`❌ Fout bij zoeken hond op naam "${name}":`, error);
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
        
        try {
            // Controleer eerst of ReuTeefStamboom bestaat
            if (typeof ReuTeefStamboom === 'undefined' && typeof window.ReuTeefStamboom === 'undefined') {
                console.warn('⚠️ ReuTeefStamboom is niet beschikbaar, laag basis stamboom');
                await this.showBasicPedigree();
                return;
            }
            
            // Initialiseer stamboom module als die nog niet bestaat
            if (!this.stamboomModule) {
                // Gebruik globale variant als beschikbaar
                const StamboomClass = typeof ReuTeefStamboom !== 'undefined' ? ReuTeefStamboom : window.ReuTeefStamboom;
                this.stamboomModule = new StamboomClass(this);
            }
            
            // Laad de stamboom
            await this.stamboomModule.showFuturePuppyPedigree(this.selectedTeef, this.selectedReu);
            
        } catch (error) {
            console.error('❌ Fout bij tonen stamboom:', error);
            this.showAlert('Kan stamboom niet tonen. Probeer een eenvoudige versie.', 'warning');
            await this.showBasicPedigree();
        }
    }
    
    async showBasicPedigree() {
        const t = this.t.bind(this);
        
        // Simpele stamboom weergave
        const modal = new bootstrap.Modal(document.getElementById('pedigreeModal') || this.createBasicModal());
        const title = t('pedigreeTitle', { name: t('futurePuppyName') });
        const content = `
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    Basis stamboom weergave voor combinatie ${this.selectedTeef.naam} × ${this.selectedReu.naam}
                </div>
                
                <div class="card mb-3">
                    <div class="card-header">
                        <strong>Toekomstige Pup</strong>
                    </div>
                    <div class="card-body">
                        <p>Combinatie van:</p>
                        <ul>
                            <li><strong>Vader:</strong> ${this.selectedReu.naam} ${this.selectedReu.stamboomnr ? `(${this.selectedReu.stamboomnr})` : ''}</li>
                            <li><strong>Moeder:</strong> ${this.selectedTeef.naam} ${this.selectedTeef.stamboomnr ? `(${this.selectedTeef.stamboomnr})` : ''}</li>
                        </ul>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <strong>Gezondheidsoverzicht</strong>
                    </div>
                    <div class="card-body">
                        <p>Volledige stamboomfunctionaliteit is momenteel niet beschikbaar.</p>
                        <p>Controleer of het bestand <code>ReuTeefStamboom.js</code> correct geladen is.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
            </div>
        `;
        
        const modalElement = document.getElementById('pedigreeModal') || this.createBasicModal();
        modalElement.querySelector('.modal-content').innerHTML = content;
        modal.show();
    }
    
    createBasicModal() {
        const modalId = 'basicPedigreeModal';
        let modalElement = document.getElementById(modalId);
        
        if (!modalElement) {
            modalElement = document.createElement('div');
            modalElement.id = modalId;
            modalElement.className = 'modal fade';
            modalElement.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content"></div>
                </div>
            `;
            document.body.appendChild(modalElement);
        }
        
        return modalElement;
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
}

window.reuTeefCombinatie = null;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}