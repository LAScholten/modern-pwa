/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden - Alleen lokaal opgeslagen
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.allDogs = [];
        this.filteredDogs = [];
        this.translations = {
            nl: {
                // Modal titels
                privateInfo: "Privé Informatie",
                privateNotes: "Privé Notities",
                notesPlaceholder: "Voer hier alle vertrouwelijke informatie in...",
                
                // Selectie sectie
                selectDog: "Selecteer Hond",
                dog: "Hond",
                chooseDog: "Kies een hond...",
                typeDogName: "Typ hondennaam...",
                loadInfo: "Info Laden",
                
                // Beveiligingsinfo
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt alleen lokaal opgeslagen in uw browser",
                privateNote: "Deze notities zijn alleen zichtbaar voor u en worden niet gedeeld",
                
                // Knoppen
                clear: "Wissen",
                save: "Opslaan",
                backup: "Backup",
                restore: "Restore",
                
                // Alerts
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
                // Modal titles
                privateInfo: "Private Information",
                privateNotes: "Private Notes",
                notesPlaceholder: "Enter all confidential information here...",
                
                // Selection section
                selectDog: "Select Dog",
                dog: "Dog",
                chooseDog: "Choose a dog...",
                typeDogName: "Type dog name...",
                loadInfo: "Load Info",
                
                // Security info
                securityInfo: "Security Info",
                privateStorage: "All information is stored locally in your browser only",
                privateNote: "These notes are only visible to you and are not shared",
                
                // Buttons
                clear: "Clear",
                save: "Save",
                backup: "Backup",
                restore: "Restore",
                
                // Alerts
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
            },
            de: {
                // Modal Titel
                privateInfo: "Private Informationen",
                privateNotes: "Private Notizen",
                notesPlaceholder: "Geben Sie hier alle vertraulichen Informationen ein...",
                
                // Auswahlbereich
                selectDog: "Hund auswählen",
                dog: "Hund",
                chooseDog: "Wählen Sie einen Hund...",
                typeDogName: "Hundename eingeben...",
                loadInfo: "Info Laden",
                
                // Sicherheitsinfo
                securityInfo: "Sicherheitsinfo",
                privateStorage: "Alle Informationen werden nur lokal in Ihrem Browser gespeichert",
                privateNote: "Diese Notizen sind nur für Sie sichtbar und werden nicht geteilt",
                
                // Knöpfe
                clear: "Löschen",
                save: "Speichern",
                backup: "Backup",
                restore: "Wiederherstellen",
                
                // Meldungen
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                loadingInfo: "Private Info wird geladen...",
                noInfoFound: "Keine privaten Informationen für diesen Hund gefunden. Sie können neue Informationen hinzufügen.",
                loadFailed: "Laden fehlgeschlagen: ",
                dogNotFound: "Hund nicht in der Datenbank gefunden",
                dogSelectionRequired: "Wählen Sie einen Hund aus der Liste",
                savingInfo: "Private Info wird gespeichert...",
                saveSuccess: "Private Informationen erfolgreich gespeichert!",
                saveFailed: "Speichern fehlgeschlagen: ",
                clearConfirm: "Sind Sie sicher, dass Sie alle Notizen löschen möchten?",
                fieldsCleared: "Notizen gelöscht. Vergessen Sie nicht zu speichern, wenn Sie die Änderungen behalten möchten.",
                makingBackup: "Backup wird erstellt...",
                backupSuccess: "Backup erfolgreich erstellt!",
                backupFailed: "Backup fehlgeschlagen: ",
                invalidBackup: "Ungültige Backup-Datei",
                restoreConfirm: "Sind Sie sicher, dass Sie dieses Backup wiederherstellen möchten?",
                restoring: "Backup wird wiederhergestellt...",
                restoreSuccess: "Backup erfolgreich wiederhergestellt!",
                restoreFailed: "Wiederherstellen fehlgeschlagen: ",
                backupReadError: "Fehler beim Lesen der Backup-Datei",
                noDogsFound: "Keine Hunde gefunden",
                loadingPhotos: "Fotos laden..."
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
                                                        <div class="dropdown-item text-muted">${t('loadingPhotos')}</div>
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
    
    setupEvents() {
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
        
        this.setupDogSearch();
    }
    
    async loadPrivateInfoData() {
        try {
            this.allDogs = await this.db.getHonden();
            this.allDogs.sort((a, b) => a.naam.localeCompare(b.naam));
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allDogs = [];
        }
    }
    
    setupDogSearch() {
        const searchInput = document.getElementById('privateHondSearch');
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        
        if (!searchInput || !dropdownMenu) return;
        
        // Toon dropdown bij focus
        searchInput.addEventListener('focus', () => {
            this.showAllDogs();
            dropdownMenu.classList.add('show');
        });
        
        // Filter honden bij elke toetsaanslag - ALLEEN OP NAAM
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
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
            this.showAllDogs();
            dropdownMenu.classList.add('show');
        });
    }
    
    async showAllDogs() {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        if (this.allDogs.length === 0) {
            await this.loadPrivateInfoData();
        }
        
        this.filteredDogs = [...this.allDogs];
        this.updateDropdownMenu();
    }
    
    async filterDogs(searchTerm) {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        if (!dropdownMenu) return;
        
        if (this.allDogs.length === 0) {
            await this.loadPrivateInfoData();
        }
        
        if (!searchTerm.trim()) {
            this.filteredDogs = [...this.allDogs];
        } else {
            // AANGEPAST: ALLEEN ZOEKEN OP NAAM VAN DE HOND EN ALLEEN ALS HET BEGINT MET DE ZOEKTERM
            this.filteredDogs = this.allDogs.filter(dog => {
                const dogName = dog.naam.toLowerCase();
                // ALLEEN OP NAAM ZOEKEN EN ALLEEN ALS HET BEGINT MET DE ZOEKTERM
                return dogName.startsWith(searchTerm);
            });
        }
        
        this.updateDropdownMenu();
    }
    
    updateDropdownMenu() {
        const dropdownMenu = document.getElementById('dogDropdownMenu');
        const t = this.t.bind(this);
        
        if (!dropdownMenu) return;
        
        dropdownMenu.innerHTML = '';
        
        if (this.filteredDogs.length === 0) {
            dropdownMenu.innerHTML = `
                <div class="dropdown-item text-muted">
                    ${t('noDogsFound')}
                </div>
            `;
            return;
        }
        
        this.filteredDogs.forEach(dog => {
            const item = document.createElement('a');
            item.className = 'dropdown-item';
            item.href = '#';
            item.innerHTML = `
                <div>
                    <strong>${dog.naam}</strong>
                    <div class="small text-muted">
                        ${dog.ras || ''} • ${dog.stamboomnr || ''}
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
            searchInput.value = dog.naam;
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
                    ${dog.stamboomnr ? dog.stamboomnr + ' | ' : ''}
                    ${dog.ras ? dog.ras + ' | ' : ''}
                    Geb: ${dog.geboortedatum || 'onbekend'}
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
        
        this.currentHondId = parseInt(dogId);
        
        this.showProgress(t('loadingInfo'));
        
        try {
            // Haal privé info uit LOKALE OPSLAG (niet uit server database)
            this.currentPriveInfo = await this.getLocalPrivateInfo(stamboomnr);
            
            this.hideProgress();
            this.displayPrivateInfo();
            
            // Update header met de geselecteerde hond
            const selectedDog = this.allDogs.find(d => d.id.toString() === dogId);
            if (selectedDog) {
                this.updatePrivateInfoHeader(selectedDog);
            }
            
        } catch (error) {
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
    
    async getLocalPrivateInfo(stamboomnr) {
        // Haal privé info uit localStorage (lokaal opgeslagen)
        const privateInfoKey = `private_info_${stamboomnr}`;
        const savedInfo = localStorage.getItem(privateInfoKey);
        
        if (savedInfo) {
            return JSON.parse(savedInfo);
        }
        return null;
    }
    
    displayPrivateInfo() {
        const notesTextarea = document.getElementById('privateNotes');
        if (!notesTextarea) return;
        
        notesTextarea.value = '';
        
        if (this.currentPriveInfo) {
            notesTextarea.value = this.currentPriveInfo.privateNotes || '';
        }
        
        // Zorg ervoor dat textarea altijd beschikbaar is
        notesTextarea.removeAttribute('disabled');
    }
    
    updatePrivateInfoHeader(dog) {
        const modalTitle = document.querySelector('#privateInfoModal .modal-title');
        if (modalTitle && dog) {
            modalTitle.innerHTML = `
                <i class="bi bi-lock"></i> ${this.t('privateInfo')} - 
                ${dog.naam} 
                <small class="text-muted">(${dog.stamboomnr || 'Geen stamboomnr'})</small>
            `;
        }
    }
    
    async savePrivateInfo() {
        const t = this.t.bind(this);
        
        const dogId = document.getElementById('selectedDogId').value;
        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
        
        if (!dogId || !stamboomnr) {
            this.showError(t('selectDogFirst'));
            return;
        }
        
        this.showProgress(t('savingInfo'));
        
        try {
            const priveInfo = {
                stamboomnr: stamboomnr,
                privateNotes: document.getElementById('privateNotes').value.trim(),
                savedAt: new Date().toISOString(),
                hondId: dogId
            };
            
            // Opslaan in LOKALE OPSLAG (localStorage)
            await this.saveLocalPrivateInfo(stamboomnr, priveInfo);
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
            // Herlaad de info na opslaan
            this.currentPriveInfo = await this.getLocalPrivateInfo(stamboomnr);
            this.displayPrivateInfo();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    async saveLocalPrivateInfo(stamboomnr, priveInfo) {
        // Sla privé info op in localStorage (lokaal opgeslagen)
        const privateInfoKey = `private_info_${stamboomnr}`;
        localStorage.setItem(privateInfoKey, JSON.stringify(priveInfo));
        
        // Update ook in-memory cache
        this.currentPriveInfo = priveInfo;
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
            // Haal alle privé info op uit localStorage
            const allPriveInfo = this.getAllLocalPrivateInfo();
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: allPriveInfo.length,
                appNaam: "Honden Registratie Prive Info",
                data: allPriveInfo
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const filename = `honden-prive-info-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            this.hideProgress();
            this.showSuccess(t('backupSuccess'));
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('backupFailed')}${error.message}`);
        }
    }
    
    getAllLocalPrivateInfo() {
        // Haal alle privé info op uit localStorage
        const allPrivateInfo = [];
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith('private_info_')) {
                try {
                    const info = JSON.parse(localStorage.getItem(key));
                    if (info && info.stamboomnr) {
                        allPrivateInfo.push(info);
                    }
                } catch (error) {
                    console.error(`Fout bij lezen van ${key}:`, error);
                }
            }
        });
        
        return allPrivateInfo;
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
                    
                    const priveInfoData = backupData.data;
                    
                    let successCount = 0;
                    let errorCount = 0;
                    
                    for (const info of priveInfoData) {
                        try {
                            if (info.stamboomnr) {
                                // Opslaan in localStorage
                                const privateInfoKey = `private_info_${info.stamboomnr}`;
                                localStorage.setItem(privateInfoKey, JSON.stringify(info));
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
                    
                    // Herlaad eventueel huidige info als we die hebben geopend
                    if (this.currentHondId) {
                        const stamboomnr = document.getElementById('selectedDogStamboomnr').value;
                        if (stamboomnr) {
                            this.currentPriveInfo = await this.getLocalPrivateInfo(stamboomnr);
                            this.displayPrivateInfo();
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
    
    // Helper method voor bestandsdownload
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
    
    // Helper methoden voor notificaties
    showProgress(message) {
        // Implementeer een progress indicator
        console.log('Progress:', message);
        // Voorbeeld: this.showToast(message, 'info');
    }
    
    hideProgress() {
        // Implementeer het verbergen van de progress indicator
        console.log('Progress hidden');
    }
    
    showSuccess(message) {
        // Implementeer een success melding
        console.log('Success:', message);
        alert(message); // Tijdelijke oplossing
    }
    
    showError(message) {
        // Implementeer een error melding
        console.error('Error:', message);
        alert(message); // Tijdelijke oplossing
    }
    
    showInfo(message) {
        // Implementeer een info melding
        console.log('Info:', message);
        alert(message); // Tijdelijke oplossing
    }
}