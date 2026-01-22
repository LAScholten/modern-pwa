/**
 * Reu en Teef Combinatie Module - HOOFDBESTAND
 * Voor het maken van fokplannen met specifieke reu en teef
 */

class ReuTeefCombinatie {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = window.hondenService;
        this.auth = window.auth;
        this.selectedTeef = null;
        this.selectedReu = null;
        this.allHonden = [];
        this.hondenCache = new Map();
        
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
                searchByName: "Zoek op naam of kennel",
                typeToSearch: "Begin met typen om te zoeken",
                noDogsFound: "Geen honden gevonden",
                found: "gevonden",
                genderTeef: "Teef",
                genderReu: "Reu",
                unknown: "Onbekend",
                unknownBreed: "Onbekend ras",
                selectDogFirst: "Selecteer eerst een reu én een teef",
                parents: "Ouders",
                fatherLabel: "Vader",
                motherLabel: "Moeder",
                unknownAncestor: "Onbekend"
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
                searchByName: "Search by name or kennel",
                typeToSearch: "Start typing to search",
                noDogsFound: "No dogs found",
                found: "found",
                genderTeef: "Female",
                genderReu: "Male",
                unknown: "Unknown",
                unknownBreed: "Unknown breed",
                selectDogFirst: "Select both a male and a female first",
                parents: "Parents",
                fatherLabel: "Father",
                motherLabel: "Mother",
                unknownAncestor: "Unknown"
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
                searchByName: "Suche nach Name oder Zwingername",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen",
                noDogsFound: "Keine Hunde gefunden",
                found: "gefunden",
                genderTeef: "Hündin",
                genderReu: "Rüde",
                unknown: "Unbekannt",
                unknownBreed: "Unbekannte Rasse",
                selectDogFirst: "Wählen Sie zuerst einen Rüden en eine Hündin",
                parents: "Eltern",
                fatherLabel: "Vater",
                motherLabel: "Mutter",
                unknownAncestor: "Unbekannt"
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
        
        this.selectedTeef = null;
        this.selectedReu = null;
        this.hondenCache.clear();
        
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
                            
                            <div class="search-results-container flex-grow-1 mt-2" id="teefSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="teefDetails" class="d-none"></div>
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
                            
                            <div class="search-results-container flex-grow-1 mt-2" id="reuSearchResults">
                                <div class="text-center py-4">
                                    <i class="bi bi-search display-1 text-muted opacity-50"></i>
                                    <p class="mt-3 text-muted">${t('typeToSearch')}</p>
                                </div>
                            </div>
                            
                            <div id="reuDetails" class="d-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backBtn">
                <i class="bi bi-arrow-left me-1"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-purple" id="showPedigreeBtn" disabled>
                <i class="bi bi-diagram-3 me-1"></i> ${t('showFuturePuppy')}
            </button>
        `;
        
        this.addStyles();
        
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });
        
        document.getElementById('showPedigreeBtn').addEventListener('click', () => {
            this.showFuturePuppyPedigree();
        });
        
        this.setupAutocomplete('teefSearch', 'teefSearchResults', (hond) => {
            this.selectTeef(hond);
        }, 'female');
        
        this.setupAutocomplete('reuSearch', 'reuSearchResults', (hond) => {
            this.selectReu(hond);
        }, 'male');
        
        this.updateButtonStates();
    }
    
    addStyles() {
        if (!document.querySelector('#reuteef-combinatie-styles')) {
            const style = document.createElement('style');
            style.id = 'reuteef-combinatie-styles';
            style.textContent = `
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
                
                .dog-details-card {
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    background: white;
                    padding: 20px;
                    margin-top: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
                    }
                    
                    .autocomplete-dropdown {
                        max-height: 250px;
                        position: fixed;
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
                
                while (hasMorePages && allHonden.length < 5000) {
                    try {
                        const result = await window.hondenService.getHonden(currentPage, pageSize);
                        
                        if (result && result.honden && result.honden.length > 0) {
                            allHonden = allHonden.concat(result.honden);
                            hasMorePages = result.heeftVolgende;
                            currentPage++;
                        } else {
                            hasMorePages = false;
                        }
                    } catch (pageError) {
                        hasMorePages = false;
                        break;
                    }
                }
                
                this.allHonden = allHonden;
                
                this.allHonden.forEach(hond => {
                    this.hondenCache.set(hond.id, hond);
                    if (hond.stamboomnr) {
                        this.hondenCache.set(hond.stamboomnr, hond);
                    }
                });
                
                return allHonden.length;
            } else {
                this.allHonden = [];
                return 0;
            }
        } catch (error) {
            this.allHonden = [];
            return 0;
        }
    }
    
    getDogById(id) {
        if (this.hondenCache.has(id)) {
            return this.hondenCache.get(id);
        }
        
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
            const hond = await window.hondenService.getHondByStamboomnr(id);
            if (hond) {
                this.hondenCache.set(id, hond);
                if (hond.stamboomnr) {
                    this.hondenCache.set(hond.stamboomnr, hond);
                }
                
                const existsInAllHonden = this.allHonden.some(dog => dog.id === id);
                if (!existsInAllHonden) {
                    this.allHonden.push(hond);
                }
                return hond;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    
    setupAutocomplete(inputId, resultsId, onSelect, requiredGender = null) {
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
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }
    
    updateActiveResultItem(resultItems, activeIndex) {
        resultItems.forEach((item, index) => {
            item.classList.toggle('selected', index === activeIndex);
            if (index === activeIndex) {
                item.scrollIntoView({ block: 'nearest' });
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
    
    async findHondByNameOrPedigree(name, requiredGender = null) {
        if (!name || !name.trim()) return null;
        
        const searchName = name.toLowerCase().trim();
        
        for (const hond of this.allHonden) {
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
        
        return null;
    }
    
    updateButtonStates() {
        const showPedigreeBtn = document.getElementById('showPedigreeBtn');
        const bothSelected = this.selectedTeef && this.selectedReu;
        
        if (showPedigreeBtn) {
            showPedigreeBtn.disabled = !bothSelected;
        }
    }
    
    goBack() {
        const breedingModal = document.getElementById('breedingPlanModal');
        if (breedingModal) {
            if (window.uiHandler && window.uiHandler.modules && window.uiHandler.modules.breeding) {
                window.uiHandler.modules.breeding.loadMainScreen();
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
            alert(this.t('selectDogFirst'));
            return;
        }
        
        if (!this.stamboomModule) {
            this.stamboomModule = new ReuTeefStamboom(this);
        }
        
        await this.stamboomModule.showFuturePuppyPedigree(this.selectedTeef, this.selectedReu);
    }
}

window.reuTeefCombinatie = null;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReuTeefCombinatie;
}