/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden - Gebruikt Supabase priveInfoService
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        console.log('[PrivateInfoManager] Constructor aangeroepen');
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.allDogs = [];
        this.filteredDogs = [];
        this.isInitialized = false;
        
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
                privateStorage: "Alle informatie wordt alleen lokaal opgeslagen in uw browser",
                privateNote: "Deze notities zijn alleen zichtbaar voor u en worden niet gedeeld",
                clear: "Wissen",
                save: "Opslaan",
                backup: "Backup",
                restore: "Restore",
                selectDogFirst: "Selecteer eerst een hond",
                loadingInfo: "Privé info laden...",
                noInfoFound: "Geen privé informatie gevonden voor deze hond. U kunt nieuwe informatie toevoegen.",
                loadFailed: "Laden mislukt: ",
                dogNotFound: "Hond niet gevonden in database",
                dogSelectionRequired: "Selecteer een hond uit de lijst",
                savingInfo: "Privé info opslaan...",
                saveSuccess: "Privé informatie succesvol opgeslagen!",
                saveFailed: "Opslaan mislukt: ",
                clearConfirm: "Weet je zeker dat je alle notities wilt wissen?",
                fieldsCleared: "Notities gewist. Vergeet niet op te slaan als je de wijzigingen wilt bewaren.",
                makingBackup: "Backup maken...",
                backupSuccess: "Backup succesvol gemaakt!",
                backupFailed: "Backup mislukt: ",
                invalidBackup: "Ongeldig backup bestand",
                restoreConfirm: "Weet je zeker dat je deze backup wilt herstellen?",
                restoring: "Backup herstellen...",
                restoreSuccess: "Backup succesvol hersteld!",
                restoreFailed: "Herstellen mislukt: ",
                backupReadError: "Fout bij lezen backup bestand",
                noDogsFound: "Geen honden gevonden",
                loadingPhotos: "Foto's laden..."
            },
            en: {
                privateInfo: "Private Information",
                privateNotes: "Private Notes",
                notesPlaceholder: "Enter all confidential information here...",
                selectDog: "Select Dog",
                dog: "Dog",
                chooseDog: "Choose a dog...",
                typeDogName: "Type dog name...",
                loadInfo: "Load Info",
                securityInfo: "Security Info",
                privateStorage: "All information is stored locally in your browser only",
                privateNote: "These notes are only visible to you and are not shared",
                clear: "Clear",
                save: "Save",
                backup: "Backup",
                restore: "Restore",
                selectDogFirst: "Select a dog first",
                loadingInfo: "Loading private info...",
                noInfoFound: "No private information found for this dog. You can add new information.",
                loadFailed: "Loading failed: ",
                dogNotFound: "Dog not found in database",
                dogSelectionRequired: "Select a dog from the list",
                savingInfo: "Saving private info...",
                saveSuccess: "Private information successfully saved!",
                saveFailed: "Save failed: ",
                clearConfirm: "Are you sure you want to clear all notes?",
                fieldsCleared: "Notes cleared. Don't forget to save if you want to keep the changes.",
                makingBackup: "Making backup...",
                backupSuccess: "Backup successfully created!",
                backupFailed: "Backup failed: ",
                invalidBackup: "Invalid backup file",
                restoreConfirm: "Are you sure you want to restore this backup?",
                restoring: "Restoring backup...",
                restoreSuccess: "Backup successfully restored!",
                restoreFailed: "Restore failed: ",
                backupReadError: "Error reading backup file",
                noDogsFound: "No dogs found",
                loadingPhotos: "Loading photos..."
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('privateInfoModal')) {
            this.loadPrivateInfoData();
            this.setupDogSearch();
            if (this.currentHondId) {
                this.loadPrivateInfoForDog();
            }
        }
    }
    
    async init() {
        console.log('[PrivateInfoManager] init() aangeroepen');
        if (this.isInitialized) {
            console.log('[PrivateInfoManager] Al geïnitialiseerd');
            return;
        }
        
        try {
            // Wacht op de Supabase services
            console.log('[PrivateInfoManager] Wachten op hondenService...');
            
            // Check of hondenService beschikbaar is
            if (!window.hondenService) {
                console.error('[PrivateInfoManager] hondenService is niet beschikbaar in window');
                // Probeer opnieuw na korte delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                if (!window.hondenService) {
                    throw new Error('hondenService niet gevonden. Zorg dat de Supabase services geladen zijn.');
                }
            }
            
            // Laad alle honden bij initialisatie
            await this.loadAllDogs();
            console.log(`[PrivateInfoManager] ${this.allDogs.length} honden geladen`);
            
            this.isInitialized = true;
            
        } catch (error) {
            console.error('[PrivateInfoManager] Initialisatie fout:', error);
            throw error;
        }
    }
    
    async loadAllDogs() {
        console.log('[PrivateInfoManager] Laden van alle honden...');
        try {
            // Gebruik de Supabase hondenService
            let page = 1;
            const pageSize = 500; // 500 per pagina voor grote datasets
            let hasMore = true;
            let allLoadedDogs = [];
            
            while (hasMore) {
                console.log(`[PrivateInfoManager] Laden pagina ${page}...`);
                
                const result = await window.hondenService.getHonden(page, pageSize);
                console.log(`[PrivateInfoManager] Pagina ${page} resultaat:`, result.honden ? result.honden.length : 0, 'honden');
                
                if (result.honden && result.honden.length > 0) {
                    allLoadedDogs = [...allLoadedDogs, ...result.honden];
                    console.log(`[PrivateInfoManager] Totaal geladen: ${allLoadedDogs.length}`);
                    
                    // Update dropdown live als modal al open staat
                    if (document.getElementById('dogDropdownMenu')) {
                        this.updateDropdownMenu();
                    }
                    
                    hasMore = result.heeftVolgende;
                    page++;
                    
                    // Korte pauze om Supabase niet te overloaden
                    if (hasMore) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                } else {
                    hasMore = false;
                }
            }
            
            // Sorteer op naam
            this.allDogs = allLoadedDogs.sort((a, b) => {
                const naamA = (a.naam || '').toLowerCase();
                const naamB = (b.naam || '').toLowerCase();
                return naamA.localeCompare(naamB);
            });
            
            this.filteredDogs = [...this.allDogs];
            console.log(`[PrivateInfoManager] Totaal ${this.allDogs.length} honden geladen en gesorteerd`);
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij laden honden:', error);
            this.showError('Fout bij laden honden: ' + error.message);
            this.allDogs = [];
            this.filteredDogs = [];
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
                                                    <input type="text" class="form-control" id="privateHondSearch" 
                                                        placeholder="${t('typeDogName')}" autocomplete="off">
                                                    <div class="dropdown-menu w-100" id="dogDropdownMenu" style="max-height: 300px; overflow-y: auto;">
                                                        <div class="dropdown-item text-muted">${this.allDogs.length === 0 ? t('loadingPhotos') : t('chooseDog')}</div>
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
            // Zorg dat we geïnitialiseerd zijn
            if (!this.isInitialized) {
                await this.init();
            }
            
            // Injecteer de HTML
            if (!document.getElementById('privateInfoModal')) {
                document.body.insertAdjacentHTML('beforeend', this.getModalHTML());
                
                // Setup events
                this.setupEvents();
                
                // Setup dog search
                this.setupDogSearch();
                
                // Vul de dropdown met honden
                if (this.allDogs.length > 0) {
                    this.updateDropdownMenu();
                }
            }
            
            // Toon de modal
            const modalElement = document.getElementById('privateInfoModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                
                // Zorg dat dropdown werkt
                modalElement.addEventListener('shown.bs.modal', () => {
                    console.log('[PrivateInfoManager] Modal getoond, honden:', this.allDogs.length);
                    this.updateDropdownMenu();
                });
            }
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij tonen modal:', error);
            this.showError('Kon privé informatie niet openen: ' + error.message);
        }
    }
    
    setupEvents() {
        console.log('[PrivateInfoManager] setupEvents() aangeroepen');
        
        const loadBtn = document.getElementById('loadPrivateInfoBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadPrivateInfoForDog();
            });
        }
        
        const saveBtn = document.getElementById('savePrivateInfoBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePrivateInfo();
            });
        }
        
        const clearBtn = document.getElementById('clearPrivateInfoBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearPrivateInfo();
            });
        }
        
        const backupBtn = document.getElementById('backupPrivateInfoBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.backupPrivateInfo();
            });
        }
        
        const restoreBtn = document.getElementById('restorePrivateInfoBtn');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => {
                this.restorePrivateInfo();
            });
        }
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('privateHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) {
            console.log('[PrivateInfoManager] Zoekveld of dropdown niet gevonden');
            return;
        }
        
        console.log('[PrivateInfoManager] Dog search setup');
        
        // Toon dropdown bij focus
        searchInput.addEventListener('focus', () => {
            console.log('[PrivateInfoManager] Search focus, honden:', this.allDogs.length);
            this.filterDogs('');
            dropdownMenu.classList.add('show');
        });
        
        // Filter honden bij elke toetsaanslag
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            console.log('[PrivateInfoManager] Zoeken naar:', searchTerm);
            this.filterDogs(searchTerm);
            dropdownMenu.classList.add('show');
        });
        
        // Verberg dropdown bij klik buiten
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
        
        // Toon alle honden bij eerste klik
        searchInput.addEventListener('click', () => {
            console.log('[PrivateInfoManager] Search click, honden:', this.allDogs.length);
            this.filterDogs('');
            dropdownMenu.classList.add('show');
        });
    }
    
    async filterDogs(searchTerm) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        console.log(`[PrivateInfoManager] Filteren met term: "${searchTerm}", totaal honden: ${this.allDogs.length}`);
        
        if (this.allDogs.length === 0) {
            console.log('[PrivateInfoManager] Nog geen honden geladen, probeer te laden...');
            try {
                await this.loadAllDogs();
            } catch (error) {
                console.error('Fout bij laden honden voor filter:', error);
            }
        }
        
        if (!searchTerm.trim()) {
            this.filteredDogs = [...this.allDogs];
        } else {
            // Zoek in naam, kennelnaam en stamboomnummer
            this.filteredDogs = this.allDogs.filter(dog => {
                const dogName = (dog.naam || '').toLowerCase();
                const kennelName = (dog.kennelnaam || '').toLowerCase();
                const stamboomnr = (dog.stamboomnr || '').toLowerCase();
                
                return dogName.includes(searchTerm) || 
                       kennelName.includes(searchTerm) || 
                       stamboomnr.includes(searchTerm);
            });
        }
        
        console.log(`[PrivateInfoManager] ${this.filteredDogs.length} resultaten gevonden`);
        this.updateDropdownMenu();
    }
    
    updateDropdownMenu() {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) {
            console.log('[PrivateInfoManager] Dropdown menu niet gevonden bij update');
            return;
        }
        
        dropdownMenu.innerHTML = '';
        
        if (this.filteredDogs.length === 0) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    ${this.allDogs.length === 0 ? t('loadingPhotos') : t('noDogsFound')}
                </div>
            `;
            return;
        }
        
        // Toon maximaal 100 resultaten voor performance
        const displayDogs = this.filteredDogs.slice(0, 100);
        
        displayDogs.forEach(dog => {
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
                console.log('[PrivateInfoManager] Hond geselecteerd:', dog.id, dog.naam);
                this.selectDog(dog);
                dropdownMenu.classList.remove('show');
            });
            
            dropdownMenu.appendChild(item);
        });
        
        if (this.filteredDogs.length > 100) {
            const moreItem = document.createElement('div');
            moreItem.className = 'dropdown-item text-center text-muted small';
            moreItem.textContent = `... en ${this.filteredDogs.length - 100} meer`;
            dropdownMenu.appendChild(moreItem);
        }
    }
    
    selectDog(dog) {
        console.log('[PrivateInfoManager] selectDog aangeroepen voor:', dog);
        
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
                    ${dog.naam || ''} 
                    ${dog.stamboomnr ? ' (' + dog.stamboomnr + ')' : ''}
                </span>
            `;
        }
        
        console.log('[PrivateInfoManager] Hond geselecteerd:', {
            id: dog.id,
            naam: dog.naam,
            stamboomnr: dog.stamboomnr
        });
    }
    
    async loadPrivateInfoForDog() {
        const t = this.t.bind(this);
        const dogId = document.getElementById('selectedDogId')?.value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
        
        console.log('[PrivateInfoManager] loadPrivateInfoForDog aangeroepen:', { dogId, stamboomnr });
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.currentHondId = parseInt(dogId);
        
        this.showProgress(t('loadingInfo'));
        
        try {
            // Check of priveInfoService beschikbaar is
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            console.log('[PrivateInfoManager] Ophalen privé info voor:', stamboomnr);
            
            // Haal privé info op uit Supabase
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            
            // Zoek de specifieke hond
            const priveInfo = result.priveInfo?.find(info => info.stamboomnr === stamboomnr);
            
            if (priveInfo) {
                this.currentPriveInfo = {
                    ...priveInfo,
                    privateNotes: priveInfo.privatenotes || ''
                };
                console.log('[PrivateInfoManager] Privé info gevonden');
            } else {
                this.currentPriveInfo = null;
                console.log('[PrivateInfoManager] Geen privé info gevonden');
            }
            
            this.hideProgress();
            this.displayPrivateInfo();
            
            // Update header
            const selectedDog = this.allDogs.find(d => d.id.toString() === dogId);
            if (selectedDog) {
                this.updatePrivateInfoHeader(selectedDog);
            }
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij laden privé info:', error);
            this.hideProgress();
            
            if (error.message.includes('niet gevonden') || !this.currentPriveInfo) {
                this.currentPriveInfo = null;
                this.displayPrivateInfo();
                this.showInfo(t('noInfoFound'));
            } else {
                this.showError(`${t('loadFailed')}${error.message}`);
            }
        }
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        
        notesTextarea.value = '';
        
        if (this.currentPriveInfo) {
            notesTextarea.value = this.currentPriveInfo.privateNotes || '';
        }
        
        notesTextarea.removeAttribute('disabled');
    }
    
    updatePrivateInfoHeader(dog) {
        const modalTitle = document.querySelector('#privateInfoModal .modal-title');
        if (modalTitle && dog) {
            modalTitle.innerHTML = `
                <i class="bi bi-lock"></i> ${this.t('privateInfo')} - 
                ${dog.naam || 'Naam onbekend'} 
                <small class="text-muted">(${dog.stamboomnr || 'Geen stamboomnr'})</small>
            `;
        }
    }
    
    async savePrivateInfo() {
        const t = this.t.bind(this);
        
        const dogId = document.getElementById('selectedDogId')?.value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
        const notes = document.getElementById('privateNotes')?.value.trim() || '';
        
        console.log('[PrivateInfoManager] savePrivateInfo aangeroepen:', { dogId, stamboomnr, notesLength: notes.length });
        
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
            
            console.log('[PrivateInfoManager] Opslaan privé info:', priveInfo);
            
            // Gebruik Supabase priveInfoService
            await window.priveInfoService.bewaarPriveInfo(priveInfo);
            
            this.currentPriveInfo = priveInfo;
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij opslaan privé info:', error);
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    clearPrivateInfo() {
        const t = this.t.bind(this);
        
        if (!confirm(t('clearConfirm'))) {
            return;
        }
        
        document.getElementById('privateNotes').value = '';
        
        this.showSuccess(t('fieldsCleared'));
    }
    
    async backupPrivateInfo() {
        const t = this.t.bind(this);
        
        this.showProgress(t('makingBackup'));
        
        try {
            if (!window.priveInfoService) {
                throw new Error('Privé info service niet beschikbaar');
            }
            
            // Haal alle privé info op
            console.log('[PrivateInfoManager] Backup maken...');
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 10000);
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: result.priveInfo?.length || 0,
                appNaam: "Honden Registratie Prive Info",
                data: (result.priveInfo || []).map(info => ({
                    stamboomnr: info.stamboomnr,
                    privateNotes: info.privatenotes || '',
                    savedAt: info.laatstgewijzigd || new Date().toISOString()
                }))
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `honden-prive-info-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(t('backupSuccess'));
            
        } catch (error) {
            console.error('[PrivateInfoManager] Fout bij backup:', error);
            this.hideProgress();
            this.showError(`${t('backupFailed')}${error.message}`);
        }
    }
    
    async restorePrivateInfo() {
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
                        throw new Error(t('invalidBackup'));
                    }
                    
                    if (!confirm(t('restoreConfirm'))) {
                        return;
                    }
                    
                    this.showProgress(t('restoring'));
                    
                    if (!window.priveInfoService) {
                        throw new Error('Privé info service niet beschikbaar');
                    }
                    
                    let successCount = 0;
                    let errorCount = 0;
                    
                    for (const info of backupData.data) {
                        try {
                            if (info.stamboomnr) {
                                await window.priveInfoService.bewaarPriveInfo({
                                    stamboomnr: info.stamboomnr,
                                    privateNotes: info.privateNotes || ''
                                });
                                successCount++;
                            } else {
                                errorCount++;
                            }
                        } catch (error) {
                            console.error('Fout bij importeren privé info:', error);
                            errorCount++;
                        }
                    }
                    
                    this.hideProgress();
                    
                    if (errorCount > 0) {
                        this.showInfo(`${successCount} records hersteld, ${errorCount} mislukt`);
                    } else {
                        this.showSuccess(t('restoreSuccess'));
                    }
                    
                    // Herlaad huidige info als we die hebben geopend
                    if (this.currentHondId) {
                        const stamboomnr = document.getElementById('selectedDogStamboomnr')?.value;
                        if (stamboomnr) {
                            await this.loadPrivateInfoForDog();
                        }
                    }
                    
                } catch (error) {
                    this.hideProgress();
                    this.showError(`${t('restoreFailed')}${error.message}`);
                }
            };
            
            reader.onerror = () => {
                this.showError(t('backupReadError'));
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // Helper methods
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    showProgress(message) {
        // Toon een simpele alert als progress indicator
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
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
    
    showInfo(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <i class="bi bi-info-circle me-2"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

// Voeg toe aan window object
window.PrivateInfoManager = PrivateInfoManager;
console.log('PrivateInfoManager geladen en beschikbaar via window.PrivateInfoManager');