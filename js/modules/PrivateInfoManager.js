/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden - Gebruikt Supabase priveInfoService
 * Met paginatie en efficiënte zoekfunctie
 */

class PrivateInfoManager {
    constructor() {
        console.log('[PrivateInfoManager] Constructor aangeroepen');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.isInitialized = false;
        
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
                typeDogName: "Typ hondennaam, stamboomnr of kennel...",
                loadInfo: "Info Laden",
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt veilig opgeslagen in Supabase",
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
                loadingResults: "Resultaten laden...",
                noResults: "Geen resultaten gevonden",
                searching: "Zoeken..."
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
            // Check of services beschikbaar zijn
            if (!window.hondenService) {
                console.error('[PrivateInfoManager] hondenService niet gevonden');
                throw new Error('hondenService niet gevonden. Zorg dat Supabase services geladen zijn.');
            }
            
            console.log('[PrivateInfoManager] Services gevonden');
            this.isInitialized = true;
            
        } catch (error) {
            console.error('[PrivateInfoManager] Initialisatie fout:', error);
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
                                                        <div class="dropdown-item text-muted">${t('typeDogName')}</div>
                                                    </div>
                                                </div>
                                                <input type="hidden" id="selectedDogId">
                                                <input type="hidden" id="selectedDogStamboomnr">
                                                <div class="small text-muted mt-1" id="selectedDogInfo"></div>
                                                <div id="searchStatus" class="small mt-1"></div>
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
            
            // Inject modal HTML als die er nog niet is
            if (!document.getElementById('privateInfoModal')) {
                console.log('[PrivateInfoManager] Injecteer modal HTML');
                document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
                
                // Setup events
                this.setupEvents();
                
                // Setup search (met debounce voor efficiency)
                this.setupDogSearch();
            }
            
            // Toon modal
            const modalElement = document.getElementById('privateInfoModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Focus op search field
                modalElement.addEventListener('shown.bs.modal', () => {
                    console.log('[PrivateInfoManager] Modal getoond');
                    const searchInput = document.getElementById('privateHondSearch');
                    if (searchInput) {
                        searchInput.focus();
                    }
                });
            }
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij tonen modal:', error);
            this.showError('Kon privé informatie niet openen: ' + error.message);
        }
    }
    
    setupEvents() {
        console.log('[PrivateInfoManager] setupEvents() aangeroepen');
        
        // Gebruik event delegation
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Load button
            if (target && (target.id === 'loadPrivateInfoBtn' || target.closest('#loadPrivateInfoBtn'))) {
                e.preventDefault();
                this.loadPrivateInfoForDog();
                return;
            }
            
            // Save button
            if (target && (target.id === 'savePrivateInfoBtn' || target.closest('#savePrivateInfoBtn'))) {
                e.preventDefault();
                this.savePrivateInfo();
                return;
            }
            
            // Clear button
            if (target && (target.id === 'clearPrivateInfoBtn' || target.closest('#clearPrivateInfoBtn'))) {
                e.preventDefault();
                this.clearPrivateInfo();
                return;
            }
            
            // Backup button
            if (target && (target.id === 'backupPrivateInfoBtn' || target.closest('#backupPrivateInfoBtn'))) {
                e.preventDefault();
                this.backupPrivateInfo();
                return;
            }
            
            // Restore button
            if (target && (target.id === 'restorePrivateInfoBtn' || target.closest('#restorePrivateInfoBtn'))) {
                e.preventDefault();
                this.restorePrivateInfo();
                return;
            }
        });
    }
    
    setupDogSearch() {
        // Wacht tot DOM ready
        setTimeout(() => {
            const searchInput = document.getElementById('privateHondSearch');
            const dropdownMenu = document.getElementById('dogDropdownMenu');
            const searchStatus = document.getElementById('searchStatus');
            
            if (!searchInput || !dropdownMenu) {
                console.log('[PrivateInfoManager] Zoekveld niet gevonden, probeer later...');
                setTimeout(() => this.setupDogSearch(), 100);
                return;
            }
            
            console.log('[PrivateInfoManager] Dog search setup');
            
            let searchTimeout;
            let currentSearchTerm = '';
            
            // Debounced search bij input
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                currentSearchTerm = searchTerm;
                
                // Clear previous timeout
                clearTimeout(searchTimeout);
                
                // Als search term leeg is, toon niets
                if (searchTerm.length === 0) {
                    dropdownMenu.innerHTML = `<div class="dropdown-item text-muted">${this.t('typeDogName')}</div>`;
                    dropdownMenu.classList.remove('show');
                    if (searchStatus) searchStatus.innerHTML = '';
                    return;
                }
                
                // Toon "zoeken..." status
                if (searchStatus) {
                    searchStatus.innerHTML = `<span class="text-info">${this.t('searching')}...</span>`;
                }
                
                // Debounce de zoekopdracht (300ms)
                searchTimeout = setTimeout(async () => {
                    await this.performSearch(searchTerm);
                }, 300);
            });
            
            // Toon dropdown bij focus
            searchInput.addEventListener('focus', () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm.length > 0) {
                    dropdownMenu.classList.add('show');
                }
            });
            
            // Verberg dropdown bij klik buiten
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
            
        }, 100);
    }
    
    async performSearch(searchTerm) {
        console.log(`[PrivateInfoManager] Zoeken naar: "${searchTerm}"`);
        
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const searchStatus = document.getElementById('searchStatus');
        
        if (!dropdownMenu) return;
        
        try {
            // Gebruik Supabase zoekfunctie MET PAGINATIE
            const searchCriteria = {};
            
            // Bepaal waar we op zoeken
            if (searchTerm.length > 0) {
                // Probeer op naam, kennel of stamboomnr
                searchCriteria.naam = searchTerm;
                // We kunnen ook op meerdere velden zoeken door meerdere criteria
            }
            
            // Doe de zoekopdracht (eerste 50 resultaten)
            const result = await window.hondenService.zoekHonden(searchCriteria, 1, 50);
            
            // Update status
            if (searchStatus) {
                if (result.honden && result.honden.length > 0) {
                    searchStatus.innerHTML = `<span class="text-success">${result.honden.length} resultaten gevonden</span>`;
                } else {
                    searchStatus.innerHTML = `<span class="text-warning">${this.t('noResults')}</span>`;
                }
            }
            
            // Update dropdown
            this.updateSearchResults(result.honden || []);
            dropdownMenu.classList.add('show');
            
        } catch (error) {
            console.error('[PrivateInfoManager] Zoekfout:', error);
            if (searchStatus) {
                searchStatus.innerHTML = `<span class="text-danger">Zoekfout: ${error.message}</span>`;
            }
            dropdownMenu.innerHTML = `<div class="dropdown-item text-danger">Zoekfout: ${error.message}</div>`;
        }
    }
    
    updateSearchResults(dogs) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = '';
        
        if (!dogs || dogs.length === 0) {
            dropdownMenu.innerHTML = `<div class="dropdown-item text-muted">${t('noResults')}</div>`;
            return;
        }
        
        // Toon resultaten
        dogs.forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam || 'Naam onbekend'}</strong>
                    <div class="small text-muted">
                        ${dog.stamboomnr ? dog.stamboomnr + ' | ' : ''}
                        ${dog.ras ? dog.ras + ' | ' : ''}
                        ${dog.kennelnaam || ''}
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
        
        // Als er meer resultaten zijn dan we tonen
        const searchInput = document.getElementById('privateHondSearch');
        if (searchInput && searchInput.value.trim().length > 0) {
            const moreItem = document.createElement('div');
            moreItem.className = 'dropdown-item text-center small';
            moreItem.innerHTML = `
                <span class="text-info">
                    <i class="bi bi-info-circle"></i> Typ meer karakters voor specifiekere zoekresultaten
                </span>
            `;
            dropdownMenu.appendChild(moreItem);
        }
    }
    
    selectDog(dog) {
        console.log('[PrivateInfoManager] selectDog aangeroepen:', dog);
        
        const searchInput = document.getElementById('privateHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        const infoDiv = document.getElementById('selectedDogInfo');
        const searchStatus = document.getElementById('searchStatus');
        
        if (searchInput) searchInput.value = dog.naam || '';
        if (dogIdInput) dogIdInput.value = dog.id;
        if (stamboomnrInput) stamboomnrInput.value = dog.stamboomnr || '';
        if (searchStatus) searchStatus.innerHTML = '';
        
        if (infoDiv) {
            infoDiv.innerHTML = `
                <span class="text-success">
                    <i class="bi bi-check-circle"></i> Geselecteerd: 
                    ${dog.naam || ''} 
                    ${dog.stamboomnr ? '(' + dog.stamboomnr + ')' : ''}
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
            
            // Haal privé info op (gebruik paginatie)
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 100);
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
            
            // Haal ALLE privé info op met paginatie
            let allPrivateInfo = [];
            let page = 1;
            const pageSize = 1000;
            let hasMore = true;
            
            while (hasMore) {
                const result = await window.priveInfoService.getPriveInfoMetPaginatie(page, pageSize);
                
                if (result.priveInfo && result.priveInfo.length > 0) {
                    allPrivateInfo = [...allPrivateInfo, ...result.priveInfo];
                    hasMore = page < result.totaalPaginas;
                    page++;
                } else {
                    hasMore = false;
                }
            }
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: allPrivateInfo.length,
                appNaam: "Honden Privé Info Backup",
                data: allPrivateInfo.map(info => ({
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
                    
                    // Verwerk in batches van 50 voor performance
                    const batchSize = 50;
                    for (let i = 0; i < backupData.data.length; i += batchSize) {
                        const batch = backupData.data.slice(i, i + batchSize);
                        
                        for (const item of batch) {
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
                        
                        // Kleine pauze tussen batches
                        if (i + batchSize < backupData.data.length) {
                            await new Promise(resolve => setTimeout(resolve, 100));
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
    
    // Helper methods voor notificaties
    showProgress(message) {
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
    
    hideProgress() {
        if (this.currentProgress) {
            this.currentProgress.remove();
            this.currentProgress = null;
        }
    }
    
    showSuccess(message) {
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
    
    showError(message) {
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

// Voeg toe aan window
window.PrivateInfoManager = PrivateInfoManager;
console.log('PrivateInfoManager geladen en beschikbaar via window.PrivateInfoManager');