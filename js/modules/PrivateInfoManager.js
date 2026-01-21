/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden - Integreert met Supabase
 * Met paginatie ondersteuning voor grote datasets
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.allDogs = [];
        this.isLoading = false;
    }
    
    t(key) {
        const translations = {
            nl: {
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                selectDog: "Selecteer Hond",
                dog: "Hond",
                chooseDog: "Kies een hond...",
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
                loadingDogs: "Honden laden..."
            }
        };
        return translations[this.currentLang][key] || key;
    }
    
    async loadAllDogs() {
        if (this.isLoading || this.allDogs.length > 0) return;
        
        this.isLoading = true;
        try {
            // Toon laadindicator
            this.showProgress(this.t('loadingDogs'));
            
            // Laad alle honden via Supabase service (met paginatie)
            let page = 1;
            const pageSize = 500; // 500 per pagina voor grote datasets
            let hasMore = true;
            let loadedDogs = [];
            
            while (hasMore) {
                const result = await window.hondenService.getHonden(page, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    loadedDogs = [...loadedDogs, ...result.honden];
                    hasMore = result.heeftVolgende;
                    page++;
                } else {
                    hasMore = false;
                }
            }
            
            // Sorteer op naam
            this.allDogs = loadedDogs.sort((a, b) => {
                const naamA = (a.naam || '').toLowerCase();
                const naamB = (b.naam || '').toLowerCase();
                return naamA.localeCompare(naamB);
            });
            
            console.log(`[PrivateInfoManager] ${this.allDogs.length} honden geladen`);
            this.hideProgress();
            
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.showError('Fout bij laden honden: ' + error.message);
            this.hideProgress();
        } finally {
            this.isLoading = false;
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
                                <div class="col-md-6">
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
                                                           placeholder="Typ om te zoeken..."
                                                           autocomplete="off">
                                                    <div class="dropdown-menu w-100" id="dogDropdownMenu" style="max-height: 300px; overflow-y: auto;">
                                                        <div class="dropdown-item text-muted">${t('chooseDog')}</div>
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
                                
                                <div class="col-md-6">
                                    <div class="card h-100">
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
        // Laad eerst alle honden als ze nog niet geladen zijn
        await this.loadAllDogs();
        
        // Toon de modal
        const modal = new bootstrap.Modal(document.getElementById('privateInfoModal'));
        modal.show();
    }
    
    setupEvents() {
        // Load button
        document.getElementById('loadPrivateInfoBtn').addEventListener('click', () => {
            this.loadPrivateInfoForDog();
        });
        
        // Save button
        document.getElementById('savePrivateInfoBtn').addEventListener('click', () => {
            this.savePrivateInfo();
        });
        
        // Clear button
        document.getElementById('clearPrivateInfoBtn').addEventListener('click', () => {
            this.clearPrivateInfo();
        });
        
        // Backup button
        document.getElementById('backupPrivateInfoBtn').addEventListener('click', () => {
            this.backupPrivateInfo();
        });
        
        // Restore button
        document.getElementById('restorePrivateInfoBtn').addEventListener('click', () => {
            this.restorePrivateInfo();
        });
        
        // Setup zoekfunctionaliteit
        this.setupDogSearch();
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('privateHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        // Zoek bij elke toetsaanslag
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filterDogs(searchTerm);
            dropdownMenu.classList.add('show');
        });
        
        // Toon alle honden bij focus
        searchInput.addEventListener('focus', () => {
            this.filterDogs('');
            dropdownMenu.classList.add('show');
        });
        
        // Verberg dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    filterDogs(searchTerm) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = '';
        
        if (this.allDogs.length === 0) {
            dropdownMenu.innerHTML = '<div class="dropdown-item text-muted">Geen honden gevonden</div>';
            return;
        }
        
        const filteredDogs = searchTerm.trim() === '' 
            ? this.allDogs 
            : this.allDogs.filter(dog => {
                const naam = (dog.naam || '').toLowerCase();
                const kennel = (dog.kennelnaam || '').toLowerCase();
                const stamboom = (dog.stamboomnr || '').toLowerCase();
                
                return naam.includes(searchTerm) || 
                       kennel.includes(searchTerm) || 
                       stamboom.includes(searchTerm);
            });
        
        if (filteredDogs.length === 0) {
            dropdownMenu.innerHTML = '<div class="dropdown-item text-muted">Geen resultaten</div>';
            return;
        }
        
        // Toon maximaal 50 resultaten
        filteredDogs.slice(0, 50).forEach(dog => {
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
    }
    
    selectDog(dog) {
        const searchInput = document.getElementById('privateHondSearch');
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        const infoDiv = document.getElementById('selectedDogInfo');
        
        if (searchInput) {
            searchInput.value = dog.naam || '';
        }
        if (dogIdInput) {
            dogIdInput.value = dog.id;
        }
        if (stamboomnrInput) {
            stamboomnrInput.value = dog.stamboomnr || '';
        }
        if (infoDiv) {
            infoDiv.innerHTML = `
                <span class="text-success">
                    <i class="bi bi-check-circle"></i> Geselecteerd: 
                    ${dog.stamboomnr || ''} ${dog.ras ? '| ' + dog.ras : ''}
                </span>
            `;
        }
    }
    
    async loadPrivateInfoForDog() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('loadingInfo'));
        
        try {
            // Gebruik Supabase priveInfoService
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            // Haal privé info op voor deze hond
            this.currentPriveInfo = await this.getSupabasePrivateInfo(stamboomnr);
            this.currentHondId = dogId;
            
            this.hideProgress();
            this.displayPrivateInfo();
            
        } catch (error) {
            this.hideProgress();
            this.showError('Fout bij laden: ' + error.message);
        }
    }
    
    async getSupabasePrivateInfo(stamboomnr) {
        try {
            // Haal alle privé info op voor ingelogde gebruiker
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            
            // Zoek naar specifieke stamboomnr
            const priveInfo = result.priveInfo?.find(info => info.stamboomnr === stamboomnr);
            
            if (priveInfo) {
                return {
                    ...priveInfo,
                    privateNotes: priveInfo.privatenotes || ''
                };
            }
            
            return null;
        } catch (error) {
            console.error('Fout bij ophalen privé info:', error);
            throw error;
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
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        const notes = document.getElementById('privateNotes').value.trim();
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('savingInfo'));
        
        try {
            // Gebruik Supabase priveInfoService
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            const priveInfoData = {
                stamboomnr: stamboomnr,
                privateNotes: notes
            };
            
            await window.priveInfoService.bewaarPriveInfo(priveInfoData);
            
            // Update lokale cache
            this.currentPriveInfo = {
                stamboomnr: stamboomnr,
                privateNotes: notes
            };
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
        } catch (error) {
            this.hideProgress();
            this.showError('Fout bij opslaan: ' + error.message);
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
            // Haal alle privé info op via Supabase service (met paginatie)
            const allPrivateInfo = await this.getAllSupabasePrivateInfo();
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: allPrivateInfo.length,
                appNaam: "Honden Privé Info Backup",
                data: allPrivateInfo
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
            this.hideProgress();
            this.showError('Backup mislukt: ' + error.message);
        }
    }
    
    async getAllSupabasePrivateInfo() {
        if (!window.priveInfoService) {
            throw new Error('Privé info service niet beschikbaar');
        }
        
        let allData = [];
        let page = 1;
        const pageSize = 1000;
        let hasMore = true;
        
        while (hasMore) {
            try {
                const result = await window.priveInfoService.getPriveInfoMetPaginatie(page, pageSize);
                
                if (result.priveInfo && result.priveInfo.length > 0) {
                    // Transformeer data
                    const transformed = result.priveInfo.map(info => ({
                        stamboomnr: info.stamboomnr,
                        privateNotes: info.privatenotes || '',
                        savedAt: info.laatstgewijzigd || new Date().toISOString()
                    }));
                    
                    allData = [...allData, ...transformed];
                    hasMore = page < result.totaalPaginas;
                    page++;
                } else {
                    hasMore = false;
                }
            } catch (error) {
                console.error('Fout bij laden backup pagina:', error);
                throw error;
            }
        }
        
        return allData;
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
                    
                    let successCount = 0;
                    let errorCount = 0;
                    
                    // Restore alle records
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
                            console.error('Fout bij restore item:', error);
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
    
    // Helper methods voor notificaties
    showProgress(message) {
        // Maak progress indicator
        const progressDiv = document.createElement('div');
        progressDiv.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        progressDiv.style.zIndex = '9999';
        progressDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                ${message}
            </div>
        `;
        document.body.appendChild(progressDiv);
        this.currentProgress = progressDiv;
    }
    
    hideProgress() {
        if (this.currentProgress) {
            this.currentProgress.remove();
            this.currentProgress = null;
        }
    }
    
    showSuccess(message) {
        this.showAlert(message, 'success');
    }
    
    showError(message) {
        this.showAlert(message, 'danger');
    }
    
    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

// Voeg toe aan globale scope
window.PrivateInfoManager = PrivateInfoManager;