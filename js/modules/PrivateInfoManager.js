/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden - Gebruikt Supabase priveInfoService
 * EXACT ZELFDE ALS SEARCHMANAGER - MET DEZELFDE LAADLOGICA
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        console.log('[PrivateInfoManager] Constructor aangeroepen');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.allDogs = []; // EXACT ZELFDE ALS SEARCHMANAGER
        this.isInitialized = false;
        this.isLoading = false;
        
        // Setup vertalingen
        this.setupTranslations();
    }
    
    setupTranslations() {
        this.translations = {
            nl: {
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                selectDog: "Selecteer Hond",
                dog: "Hond",
                chooseDog: "Kies een hond...",
                typeDogName: "Typ hondennaam...",
                loadInfo: "Info Laden",
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt veilig opgeslagen",
                privateNote: "Deze notities zijn alleen voor u zichtbaar",
                clear: "Wissen",
                save: "Opslaan",
                backup: "Backup",
                restore: "Restore",
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie opgeslagen!",
                clearConfirm: "Weet je zeker dat je alle notities wilt wissen?",
                makingBackup: "Backup maken...",
                backupSuccess: "Backup gemaakt!",
                restoring: "Backup herstellen...",
                loadingDogs: "Honden laden...",
                noDogsFound: "Geen honden gevonden"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    async init() {
        console.log('[PrivateInfoManager] init() aangeroepen');
        
        if (this.isInitialized) {
            console.log('[PrivateInfoManager] Al geïnitialiseerd');
            return;
        }
        
        try {
            // Check of hondenService beschikbaar is
            if (!window.hondenService) {
                console.error('[PrivateInfoManager] hondenService niet gevonden');
                throw new Error('hondenService niet gevonden. Zorg dat Supabase services geladen zijn.');
            }
            
            console.log('[PrivateInfoManager] hondenService gevonden');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('[PrivateInfoManager] Initialisatie fout:', error);
            this.showError('Initialisatie mislukt: ' + error.message);
        }
    }
    
    /**
     * EXACT DEZELFDE LOADING LOGICA ALS SEARCHMANAGER.loadSearchData()
     */
    async loadAllDogs() {
        // Voorkom dubbele laadpogingen - EXACT ZELFDE ALS SEARCHMANAGER
        if (this.isLoading) {
            console.log('[PrivateInfoManager] Al bezig met laden, skip...');
            return;
        }
        
        try {
            this.isLoading = true;
            this.showProgress("Honden laden... (0 geladen)");
            
            // GEBRUIK EXACT DEZELFDE METHODE ALS DogDataManager EN SearchManager
            this.allDogs = await this.loadAllDogsWithPaginationDogDataManagerStyle();
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`[PrivateInfoManager] ${this.allDogs.length} honden geladen voor privé info`);
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij laden honden:', error);
            this.showError(`Laden mislukt: ${error.message}`);
            this.allDogs = [];
        } finally {
            // Zorg dat isLoading altijd wordt gereset - EXACT ZELFDE ALS SEARCHMANAGER
            this.isLoading = false;
            this.hideProgress();
        }
    }
    
    /**
     * EXACT DEZELFDE LOADING LOGICA ALS SearchManager.loadAllDogsWithPaginationDogDataManagerStyle()
     * Dit is DE FUNCTIE DIE WERKT IN SEARCHMANAGER
     */
    async loadAllDogsWithPaginationDogDataManagerStyle() {
        try {
            console.log('[PrivateInfoManager] Laden van alle honden met paginatie (DogDataManager stijl)...');
            
            // Reset array
            let allDogs = [];
            
            let currentPage = 1;
            const pageSize = 1000; // Maximaal wat Supabase toestaat
            let hasMorePages = true;
            let totalLoaded = 0;
            
            // Loop door alle pagina's - ZELFDE LOGICA ALS SEARCHMANAGER
            while (hasMorePages) {
                console.log(`[PrivateInfoManager] Laden pagina ${currentPage}...`);
                
                // Gebruik de getHonden() methode van hondenService (zelfde als SearchManager)
                const result = await window.hondenService.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    // Voeg honden toe aan array
                    allDogs = allDogs.concat(result.honden);
                    totalLoaded += result.honden.length;
                    
                    // Update progress - ZELFDE ALS SEARCHMANAGER
                    this.showProgress(`Honden laden... (${totalLoaded} geladen)`);
                    
                    console.log(`[PrivateInfoManager] Pagina ${currentPage} geladen: ${result.honden.length} honden`);
                    
                    // Controleer of er nog meer pagina's zijn (zelfde als SearchManager)
                    hasMorePages = result.heeftVolgende;
                    
                    if (hasMorePages) {
                        currentPage++;
                    }
                    
                    // Veiligheidslimiet voor oneindige lus (zelfde als SearchManager)
                    if (currentPage > 100) {
                        console.warn('[PrivateInfoManager] Veiligheidslimiet bereikt: te veel pagina\'s geladen');
                        break;
                    }
                } else {
                    hasMorePages = false;
                }
                
                // Kleine pauze om de server niet te overbelasten (zelfde als SearchManager)
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log(`[PrivateInfoManager] TOTAAL ${allDogs.length} honden geladen`);
            
            return allDogs;
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij laden honden voor privé info:', error);
            throw error;
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="privateInfoModal" tabindex="-1" aria-labelledby="privateInfoModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="privateInfoModalLabel">
                                <i class="bi bi-lock"></i> ${t('privateInfo')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-4">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-search"></i> ${t('selectDog')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label for="privateHondSearch" class="form-label">${t('dog')}</label>
                                                <div class="dropdown">
                                                    <input type="text" 
                                                           class="form-control" 
                                                           id="privateHondSearch" 
                                                           placeholder="${t('typeDogName')}"
                                                           autocomplete="off">
                                                    <div class="dropdown-menu w-100" 
                                                         id="dogDropdownMenu" 
                                                         style="max-height: 300px; overflow-y: auto;">
                                                        <div class="dropdown-item text-muted">${t('loadingDogs')}</div>
                                                    </div>
                                                </div>
                                                <input type="hidden" id="selectedDogId">
                                                <input type="hidden" id="selectedDogStamboomnr">
                                                <div class="small text-muted mt-1" id="selectedDogInfo"></div>
                                            </div>
                                            <button class="btn btn-dark w-100" id="loadPrivateInfoBtn">
                                                <i class="bi bi-eye"></i> ${t('loadInfo')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="bi bi-shield"></i> ${t('securityInfo')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="small">
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('privateStorage')}</p>
                                                <p><i class="bi bi-person-check text-info"></i> ${t('privateNote')}</p>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-outline-dark btn-sm" id="backupPrivateInfoBtn">
                                                    <i class="bi bi-download"></i> ${t('backup')}
                                                </button>
                                                <button class="btn btn-outline-dark btn-sm" id="restorePrivateInfoBtn">
                                                    <i class="bi bi-upload"></i> ${t('restore')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="bi bi-journal-text"></i> ${t('privateNotes')}</h6>
                                </div>
                                <div class="card-body">
                                    <div id="privateInfoForm">
                                        <div class="mb-3">
                                            <textarea class="form-control" id="privateNotes" rows="12" 
                                                placeholder="${t('notesPlaceholder')}"></textarea>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between">
                                            <button class="btn btn-secondary" id="clearPrivateInfoBtn">
                                                <i class="bi bi-x-circle"></i> ${t('clear')}
                                            </button>
                                            <button class="btn btn-dark" id="savePrivateInfoBtn">
                                                <i class="bi bi-save"></i> ${t('save')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Sluiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async showModal() {
        console.log('[PrivateInfoManager] showModal() aangeroepen');
        
        try {
            // Zorg voor init
            if (!this.isInitialized) {
                await this.init();
            }
            
            // Inject modal HTML
            if (!document.getElementById('privateInfoModal')) {
                console.log('[PrivateInfoManager] Injecteer modal HTML');
                document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
                
                // Setup events
                this.setupEvents();
            }
            
            // Toon modal EERST
            const modalElement = document.getElementById('privateInfoModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Zorg dat zoekveld focus krijgt
                modalElement.addEventListener('shown.bs.modal', () => {
                    console.log('[PrivateInfoManager] Modal getoond');
                    const searchInput = document.getElementById('privateHondSearch');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    
                    // LAAD HONDEN NU PAS - ALS DE MODAL ZICHTBAAR IS
                    // EXACT ZELFDE TIMING ALS SEARCHMANAGER
                    this.loadAllDogs().then(() => {
                        console.log('[PrivateInfoManager] Honden geladen, update dropdown...');
                        this.setupDogSearch(); // Setup search NA laden
                    });
                });
            }
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij tonen modal:', error);
            this.showError('Kon modal niet tonen: ' + error.message);
        }
    }
    
    setupEvents() {
        console.log('[PrivateInfoManager] setupEvents() aangeroepen');
        
        // Gebruik event delegation voor betrouwbaarheid
        document.addEventListener('click', (e) => {
            // Load button
            if (e.target && (e.target.id === 'loadPrivateInfoBtn' || e.target.closest('#loadPrivateInfoBtn'))) {
                e.preventDefault();
                this.loadPrivateInfoForDog();
            }
            
            // Save button
            if (e.target && (e.target.id === 'savePrivateInfoBtn' || e.target.closest('#savePrivateInfoBtn'))) {
                e.preventDefault();
                this.savePrivateInfo();
            }
            
            // Clear button
            if (e.target && (e.target.id === 'clearPrivateInfoBtn' || e.target.closest('#clearPrivateInfoBtn'))) {
                e.preventDefault();
                this.clearPrivateInfo();
            }
            
            // Backup button
            if (e.target && (e.target.id === 'backupPrivateInfoBtn' || e.target.closest('#backupPrivateInfoBtn'))) {
                e.preventDefault();
                this.backupPrivateInfo();
            }
            
            // Restore button
            if (e.target && (e.target.id === 'restorePrivateInfoBtn' || e.target.closest('#restorePrivateInfoBtn'))) {
                e.preventDefault();
                this.restorePrivateInfo();
            }
        });
    }
    
    setupDogSearch() {
        console.log('[PrivateInfoManager] setupDogSearch() aangeroepen');
        
        const searchInput = document.getElementById('privateHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) {
            console.log('[PrivateInfoManager] Zoekveld niet gevonden, probeer opnieuw...');
            setTimeout(() => this.setupDogSearch(), 100);
            return;
        }
        
        console.log(`[PrivateInfoManager] Setup search met ${this.allDogs.length} honden`);
        
        // Update dropdown direct
        this.updateDropdownWithDogs(this.allDogs);
        
        // Toon dropdown bij focus - EXACT ZELFDE ALS SEARCHMANAGER
        searchInput.addEventListener('focus', () => {
            console.log('[PrivateInfoManager] Search focus');
            this.filterDogsForDropdown('');
            dropdownMenu.classList.add('show');
        });
        
        // Filter bij input - EXACT ZELFDE LOGICA ALS SEARCHMANAGER
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                this.filterDogsForDropdown(searchTerm);
            } else {
                this.filterDogsForDropdown('');
            }
            
            dropdownMenu.classList.add('show');
        });
        
        // Verberg dropdown
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
        // Klik op search
        searchInput.addEventListener('click', () => {
            this.filterDogsForDropdown('');
            dropdownMenu.classList.add('show');
        });
    }
    
    updateDropdownWithDogs(dogs) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) {
            console.log('[PrivateInfoManager] Dropdown menu niet gevonden');
            return;
        }
        
        console.log(`[PrivateInfoManager] Update dropdown met ${dogs.length} honden`);
        
        if (dogs.length === 0) {
            dropdownMenu.innerHTML = `<div class="dropdown-item text-muted">${this.t('loadingDogs')}</div>`;
            return;
        }
        
        dropdownMenu.innerHTML = '';
        
        // Toon maximaal 50 honden in dropdown
        dogs.slice(0, 50).forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam || 'Naam onbekend'}</strong>
                    <div class="small text-muted">
                        ${dog.stamboomnr || ''} 
                        ${dog.ras ? '| ' + dog.ras : ''}
                        ${dog.kennelnaam ? '| ' + dog.kennelnaam : ''}
                    </div>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectDog(dog);
                dropdownMenu.classList.remove('show');
            });
            
            dropdownMenu.appendChild(item);
        });
        
        if (dogs.length > 50) {
            const moreItem = document.createElement('div');
            moreItem.className = 'dropdown-item text-center text-muted small';
            moreItem.textContent = `... en ${dogs.length - 50} meer`;
            dropdownMenu.appendChild(moreItem);
        }
    }
    
    filterDogsForDropdown(searchTerm = '') {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        if (this.allDogs.length === 0) {
            dropdownMenu.innerHTML = `<div class="dropdown-item text-muted">${this.t('loadingDogs')}</div>`;
            return;
        }
        
        let filteredDogs;
        
        if (!searchTerm.trim()) {
            filteredDogs = [...this.allDogs];
        } else {
            filteredDogs = this.allDogs.filter(dog => {
                const naam = (dog.naam || '').toLowerCase();
                const kennel = (dog.kennelnaam || '').toLowerCase();
                const stamboom = (dog.stamboomnr || '').toLowerCase();
                
                // EXACT ZELFDE FILTER LOGICA ALS SEARCHMANAGER
                const combined = `${naam} ${kennel}`.toLowerCase();
                return combined.startsWith(searchTerm) || 
                       naam.includes(searchTerm) || 
                       kennel.includes(searchTerm) || 
                       stamboom.includes(searchTerm);
            });
        }
        
        // Sorteer op naam
        filteredDogs.sort((a, b) => {
            const naamA = (a.naam || '').toLowerCase();
            const naamB = (b.naam || '').toLowerCase();
            return naamA.localeCompare(naamB);
        });
        
        // Update dropdown
        dropdownMenu.innerHTML = '';
        
        if (filteredDogs.length === 0) {
            dropdownMenu.innerHTML = `<div class="dropdown-item text-muted">${this.t('noDogsFound')}</div>`;
            return;
        }
        
        filteredDogs.slice(0, 50).forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam || 'Naam onbekend'}</strong>
                    <div class="small text-muted">
                        ${dog.stamboomnr || ''} 
                        ${dog.ras ? '| ' + dog.ras : ''}
                        ${dog.kennelnaam ? '| ' + dog.kennelnaam : ''}
                    </div>
                </div>
            `;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectDog(dog);
                dropdownMenu.classList.remove('show');
            });
            
            dropdownMenu.appendChild(item);
        });
    }
    
    selectDog(dog) {
        console.log('[PrivateInfoManager] selectDog aangeroepen:', dog);
        
        const searchInput = document.getElementById('privateHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        const infoDiv = document.getElementById('selectedDogInfo');
        
        if (searchInput) searchInput.value = dog.naam || '';
        if (dogIdInput) dogIdInput.value = dog.id;
        if (stamboomnrInput) stamboomnrInput.value = dog.stamboomnr || '';
        
        if (infoDiv) {
            infoDiv.innerHTML = `
                <span class="text-success">
                    <i class="bi bi-check-circle"></i> Geselecteerd: 
                    ${dog.naam || ''} 
                    ${dog.stamboomnr ? '(' + dog.stamboomnr + ')' : ''}
                    ${dog.kennelnaam ? ' - ' + dog.kennelnaam : ''}
                </span>
            `;
        }
    }
    
    async loadPrivateInfoForDog() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId')?.value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
        
        console.log('[PrivateInfoManager] loadPrivateInfoForDog:', { dogId, stamboomnr });
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('loadingInfo'));
        
        try {
            // Check priveInfoService
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            // Haal privé info op
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            const priveInfo = result.priveInfo?.find(info => info.stamboomnr === stamboomnr);
            
            this.currentPriveInfo = priveInfo ? {
                ...priveInfo,
                privateNotes: priveInfo.privatenotes || ''
            } : null;
            
            this.hideProgress();
            this.displayPrivateInfo();
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij laden privé info:', error);
            this.hideProgress();
            this.showError('Fout bij laden: ' + error.message);
        }
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        
        notesTextarea.value = this.currentPriveInfo?.privateNotes || '';
        notesTextarea.removeAttribute('disabled');
    }
    
    async savePrivateInfo() {
        const t = this.t.bind(this);
        
        const dogId = document.getElementById('selectedDogId')?.value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
        const notes = document.getElementById('privateNotes')?.value.trim() || '';
        
        console.log('[PrivateInfoManager] savePrivateInfo:', { dogId, stamboomnr });
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('savingInfo'));
        
        try {
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            const priveInfo = {
                stamboomnr: stamboomnr,
                privateNotes: notes
            };
            
            await window.priveInfoService.bewaarPriveInfo(priveInfo);
            this.currentPriveInfo = priveInfo;
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij opslaan:', error);
            this.hideProgress();
            this.showError('Opslaan mislukt: ' + error.message);
        }
    }
    
    clearPrivateInfo() {
        const t = this.t.bind(this);
        
        if (confirm(t('clearConfirm'))) {
            document.getElementById('privateNotes').value = '';
            this.showSuccess('Notities gewist');
        }
    }
    
    async backupPrivateInfo() {
        const t = this.t.bind(this);
        
        this.showProgress(t('makingBackup'));
        
        try {
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 10000);
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: result.priveInfo?.length || 0,
                appNaam: "Honden Privé Info",
                data: (result.priveInfo || []).map(info => ({
                    stamboomnr: info.stamboomnr,
                    privateNotes: info.privatenotes || '',
                    savedAt: info.laatstgewijzigd || new Date().toISOString()
                }))
            };
            
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `prive-info-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.hideProgress();
            this.showSuccess(t('backupSuccess'));
            
        } catch (error) {
            console.error('[PrivateInfoManager] Backup fout:', error);
            this.hideProgress();
            this.showError('Backup mislukt: ' + error.message);
        }
    }
    
    restorePrivateInfo() {
        const t = this.t.bind(this);
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (!backupData.data || !Array.isArray(backupData.data)) {
                        throw new Error('Ongeldig backup bestand');
                    }
                    
                    if (!confirm('Backup herstellen? Bestaande data wordt overschreven.')) {
                        return;
                    }
                    
                    this.showProgress(t('restoring'));
                    
                    if (!window.priveInfoService) {
                        throw new Error('Privé info service niet beschikbaar');
                    }
                    
                    let successCount = 0;
                    let errorCount = 0;
                    
                    for (const item of backupData.data) {
                        try {
                            if (item.stamboomnr) {
                                await window.priveInfoService.bewaarPriveInfo({
                                    stamboomnr: item.stamboomnr,
                                    privateNotes: item.privateNotes || ''
                                });
                                successCount++;
                            }
                        } catch (error) {
                            console.error('Fout bij restore:', error);
                            errorCount++;
                        }
                    }
                    
                    this.hideProgress();
                    this.showSuccess(`${successCount} records hersteld${errorCount > 0 ? `, ${errorCount} mislukt` : ''}`);
                    
                } catch (error) {
                    this.hideProgress();
                    this.showError('Restore mislukt: ' + error.message);
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Helper methods - EXACT ZELFDE ALS SEARCHMANAGER
    showProgress(message) {
        // Gebruik dezelfde progress methode als SearchManager
        if (window.uiHandler && window.uiHandler.showProgress) {
            window.uiHandler.showProgress(message);
        } else {
            console.log('[PrivateInfoManager] Progress:', message);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            alertDiv.style.zIndex = '9999';
            alertDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    ${message}
                </div>
            `;
            document.body.appendChild(alertDiv);
            this.currentProgress = alertDiv;
        }
    }
    
    hideProgress() {
        // Gebruik dezelfde hideProgress methode als SearchManager
        if (window.uiHandler && window.uiHandler.hideProgress) {
            window.uiHandler.hideProgress();
        } else if (this.currentProgress) {
            this.currentProgress.remove();
            this.currentProgress = null;
        }
    }
    
    showSuccess(message) {
        if (window.uiHandler && window.uiHandler.showSuccess) {
            window.uiHandler.showSuccess(message);
        } else {
            console.log('[PrivateInfoManager] Success:', message);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            alertDiv.style.zIndex = '9999';
            alertDiv.innerHTML = `
                <i class="bi bi-check-circle me-2"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 5000);
        }
    }
    
    showError(message) {
        if (window.uiHandler && window.uiHandler.showError) {
            window.uiHandler.showError(message);
        } else {
            console.error('[PrivateInfoManager] Error:', message);
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
            alertDiv.style.zIndex = '9999';
            alertDiv.innerHTML = `
                <i class="bi bi-exclamation-triangle me-2"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.body.appendChild(alertDiv);
            setTimeout(() => alertDiv.remove(), 5000);
        }
    }
}

// Voeg toe aan window
window.PrivateInfoManager = PrivateInfoManager;
console.log('PrivateInfoManager geladen en beschikbaar via window.PrivateInfoManager');