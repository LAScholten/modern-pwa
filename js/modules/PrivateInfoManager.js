class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.allDogs = [];
        this.isLoading = false;
        this.currentPriveInfo = null;
        
        this.translations = {
            nl: {
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                selectDog: "Selecteer Hond",
                dog: "Hond",
                typeDogName: "Typ hondennaam...",
                loadInfo: "Info Laden",
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt veilig opgeslagen",
                privateNote: "Deze notities zijn alleen voor u zichtbaar",
                clear: "Wissen",
                save: "Opslaan",
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie opgeslagen!",
                clearConfirm: "Weet je zeker dat je alle notities wilt wissen?",
                loadingDogs: "Honden laden...",
                noDogsFound: "Geen honden gevonden",
                typeToSearch: "Begin met typen om te zoeken"
            },
            en: {
                privateInfo: "Private Information",
                privateNotes: "Private Notes",
                notesPlaceholder: "Enter all confidential information here...",
                selectDog: "Select Dog",
                dog: "Dog",
                typeDogName: "Type dog name...",
                loadInfo: "Load Info",
                securityInfo: "Security Information",
                privateStorage: "All information is securely stored",
                privateNote: "These notes are only visible to you",
                clear: "Clear",
                save: "Save",
                selectDogFirst: "Select a dog first",
                loadingInfo: "Loading private info...",
                noInfoFound: "No private information found",
                savingInfo: "Saving private info...",
                saveSuccess: "Private information saved!",
                clearConfirm: "Are you sure you want to clear all notes?",
                loadingDogs: "Loading dogs...",
                noDogsFound: "No dogs found",
                typeToSearch: "Start typing to search"
            },
            de: {
                privateInfo: "Private Informationen",
                privateNotes: "Private Notizen",
                notesPlaceholder: "Geben Sie hier alle vertraulichen Informationen ein...",
                selectDog: "Hund auswählen",
                dog: "Hund",
                typeDogName: "Hundename eingeben...",
                loadInfo: "Info Laden",
                securityInfo: "Sicherheitsinformationen",
                privateStorage: "Alle Informationen werden sicher gespeichert",
                privateNote: "Diese Notizen sind nur für Sie sichtbar",
                clear: "Löschen",
                save: "Speichern",
                selectDogFirst: "Zuerst einen Hund auswählen",
                loadingInfo: "Private Informationen werden geladen...",
                noInfoFound: "Keine privaten Informationen gefunden",
                savingInfo: "Private Informationen werden gespeichert...",
                saveSuccess: "Private Informationen gespeichert!",
                clearConfirm: "Sind Sie sicher, dass Sie alle Notizen löschen möchten?",
                loadingDogs: "Hunde werden geladen...",
                noDogsFound: "Keine Hunde gefunden",
                typeToSearch: "Beginnen Sie mit der Eingabe, um zu suchen"
            }
        };
    }
    
    t(key) { 
        const langTranslations = this.translations[this.currentLang];
        if (langTranslations && langTranslations[key]) {
            return langTranslations[key];
        }
        // Fallback naar Nederlands als de vertaling niet bestaat
        return this.translations['nl'][key] || key; 
    }
    
    async loadSearchData() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showProgress(this.t('loadingDogs') + " (0 " + this.t('loaded') + ")");
            
            this.allDogs = await this.loadAllDogsWithPaginationDogDataManagerStyle();
            
            this.allDogs.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
            
            console.log(`PrivateInfoManager: ${this.allDogs.length} ${this.t('dogsLoaded')}`);
            
        } catch (error) {
            console.error('PrivateInfoManager: Error loading dogs:', error);
            this.showError(`${this.t('loadFailed')}: ${error.message}`);
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
                    
                    this.showProgress(`${this.t('loadingDogs')}... (${totalLoaded} ${this.t('loaded')})`);
                    
                    hasMorePages = result.heeftVolgende;
                    
                    if (hasMorePages) currentPage++;
                    if (currentPage > 100) break;
                } else {
                    hasMorePages = false;
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            return allDogs;
            
        } catch (error) {
            console.error('PrivateInfoManager: Error loading dogs:', error);
            throw error;
        }
    }
    
    async showModal() {
        if (!document.getElementById('privateInfoModal')) {
            document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
            this.setupEvents();
        }
        
        const modalElement = document.getElementById('privateInfoModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        return `
            <div class="modal fade" id="privateInfoModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title"><i class="bi bi-lock"></i> ${t('privateInfo')}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header"><h6 class="mb-0"><i class="bi bi-search"></i> ${t('selectDog')}</h6></div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <label class="form-label">${t('dog')}</label>
                                                <div class="dropdown">
                                                    <input type="text" class="form-control" id="privateHondSearch" placeholder="${t('typeDogName')}" autocomplete="off">
                                                    <div class="dropdown-menu w-100" id="dogDropdownMenu" style="max-height: 300px; overflow-y: auto;">
                                                        <div class="dropdown-item text-muted">${t('typeToSearch')}</div>
                                                    </div>
                                                </div>
                                                <input type="hidden" id="selectedDogId">
                                                <input type="hidden" id="selectedDogStamboomnr">
                                                <div class="small text-muted mt-1" id="selectedDogInfo"></div>
                                            </div>
                                            <button class="btn btn-dark w-100" id="loadPrivateInfoBtn">${t('loadInfo')}</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header"><h6 class="mb-0"><i class="bi bi-shield"></i> ${t('securityInfo')}</h6></div>
                                        <div class="card-body">
                                            <div class="small">
                                                <p><i class="bi bi-check-circle text-success"></i> ${t('privateStorage')}</p>
                                                <p><i class="bi bi-person-check text-info"></i> ${t('privateNote')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header"><h6 class="mb-0"><i class="bi bi-journal-text"></i> ${t('privateNotes')}</h6></div>
                                <div class="card-body">
                                    <textarea class="form-control" id="privateNotes" rows="12" placeholder="${t('notesPlaceholder')}"></textarea>
                                    <div class="d-flex justify-content-between mt-3">
                                        <button class="btn btn-secondary" id="clearPrivateInfoBtn">${t('clear')}</button>
                                        <button class="btn btn-dark" id="savePrivateInfoBtn">${t('save')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    
    setupEvents() {
        const searchInput = document.getElementById('privateHondSearch');
        if (searchInput) {
            searchInput.addEventListener('focus', async () => {
                if (this.allDogs.length === 0) {
                    await this.loadSearchData();
                }
                this.setupDogSearch();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (e.target && (e.target.id === 'loadPrivateInfoBtn' || e.target.closest('#loadPrivateInfoBtn'))) {
                e.preventDefault();
                this.loadPrivateInfoForDog();
            }
            
            if (e.target && (e.target.id === 'savePrivateInfoBtn' || e.target.closest('#savePrivateInfoBtn'))) {
                e.preventDefault();
                this.savePrivateInfo();
            }
            
            if (e.target && (e.target.id === 'clearPrivateInfoBtn' || e.target.closest('#clearPrivateInfoBtn'))) {
                e.preventDefault();
                this.clearPrivateInfo();
            }
        });
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('privateHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        this.updateDropdownWithDogs(this.allDogs);
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length >= 1) {
                const filteredDogs = this.allDogs.filter(dog => {
                    const naam = (dog.naam || '').toLowerCase();
                    const kennel = (dog.kennelnaam || '').toLowerCase();
                    const combined = `${naam} ${kennel}`;
                    return combined.startsWith(searchTerm);
                });
                this.updateDropdownWithDogs(filteredDogs);
            } else {
                this.updateDropdownWithDogs(this.allDogs);
            }
            
            dropdownMenu.classList.add('show');
        });
        
        searchInput.addEventListener('focus', () => {
            dropdownMenu.classList.add('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    updateDropdownWithDogs(dogs) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = '';
        
        if (dogs.length === 0) {
            dropdownMenu.innerHTML = `<div class="dropdown-item text-muted">${this.t('noDogsFound')}</div>`;
            return;
        }
        
        dogs.slice(0, 50).forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `<strong>${dog.naam || ''}</strong><div class="small text-muted">${dog.stamboomnr || ''}</div>`;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('privateHondSearch').value = dog.naam || '';
                document.getElementById('selectedDogId').value = dog.id;
                document.getElementById('selectedDogStamboomnr').value = dog.stamboomnr || '';
                dropdownMenu.classList.remove('show');
            });
            dropdownMenu.appendChild(item);
        });
    }
    
    async loadPrivateInfoForDog() {
        const dogId = document.getElementById('selectedDogId')?.value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
        
        if (!dogId || !stamboomnr) {
            this.showError(this.t('selectDogFirst'));
            return;
        }
        
        this.showProgress(this.t('loadingInfo'));
        
        try {
            if (!window.priveInfoService) throw new Error(this.t('serviceNotAvailable'));
            
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            const priveInfo = result.priveInfo?.find(info => info.stamboomnr === stamboomnr);
            
            this.currentPriveInfo = priveInfo ? {
                ...priveInfo,
                privateNotes: priveInfo.privatenotes || ''
            } : null;
            
            this.hideProgress();
            this.displayPrivateInfo();
            
        } catch (error) {
            console.error('Error loading private info:', error);
            this.hideProgress();
            this.showError(this.t('loadError') + ': ' + error.message);
        }
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        notesTextarea.value = this.currentPriveInfo?.privateNotes || '';
        notesTextarea.removeAttribute('disabled');
    }
    
    async savePrivateInfo() {
        const dogId = document.getElementById('selectedDogId')?.value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
        const notes = document.getElementById('privateNotes')?.value.trim() || '';
        
        if (!dogId || !stamboomnr) {
            this.showError(this.t('selectDogFirst'));
            return;
        }
        
        this.showProgress(this.t('savingInfo'));
        
        try {
            if (!window.priveInfoService) throw new Error(this.t('serviceNotAvailable'));
            
            const priveInfo = { stamboomnr: stamboomnr, privateNotes: notes };
            await window.priveInfoService.bewaarPriveInfo(priveInfo);
            this.currentPriveInfo = priveInfo;
            
            this.hideProgress();
            this.showSuccess(this.t('saveSuccess'));
            
        } catch (error) {
            console.error('Error saving:', error);
            this.hideProgress();
            this.showError(this.t('saveError') + ': ' + error.message);
        }
    }
    
    clearPrivateInfo() {
        if (confirm(this.t('clearConfirm'))) {
            document.getElementById('privateNotes').value = '';
            this.showSuccess(this.t('notesCleared'));
        }
    }
    
    showProgress(message) {
        if (window.uiHandler?.showProgress) window.uiHandler.showProgress(message);
    }
    
    hideProgress() {
        if (window.uiHandler?.hideProgress) window.uiHandler.hideProgress();
    }
    
    showSuccess(message) {
        if (window.uiHandler?.showSuccess) window.uiHandler.showSuccess(message);
    }
    
    showError(message) {
        if (window.uiHandler?.showError) window.uiHandler.showError(message);
    }
}

window.PrivateInfoManager = PrivateInfoManager;