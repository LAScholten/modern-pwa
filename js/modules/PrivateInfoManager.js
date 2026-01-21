/**
 * Privé Informatie Module
 * Beheert vertrouwelijke informatie over honden - Integreert met Supabase
 * Laadt alle honden bij opstarten (gepagineerd voor grote datasets)
 */

class PrivateInfoManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.currentHondId = null;
        this.currentPriveInfo = null;
        this.allDogs = [];
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
                loadingDogs: "Honden laden...",
                
                // Beveiligingsinfo
                securityInfo: "Beveiligingsinfo",
                privateStorage: "Alle informatie wordt veilig opgeslagen in Supabase (alleen voor eigenaar)",
                privateNote: "Deze notities zijn alleen zichtbaar voor de ingelogde gebruiker",
                
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
                loadingAllDogs: "Alle honden laden..."
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
                loadingDogs: "Loading dogs...",
                
                // Security info
                securityInfo: "Security Info",
                privateStorage: "All information is securely stored in Supabase (owner only)",
                privateNote: "These notes are only visible to the logged in user",
                
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
                loadingAllDogs: "Loading all dogs..."
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
                loadingDogs: "Hunde laden...",
                
                // Sicherheitsinfo
                securityInfo: "Sicherheitsinfo",
                privateStorage: "Alle Informationen werden sicher in Supabase gespeichert (nur für Besitzer)",
                privateNote: "Diese Notizen sind nur für den eingeloggten Benutzer sichtbar",
                
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
                loadingAllDogs: "Alle Hunde laden..."
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('privateInfoModal')) {
            this.setupDogSearch();
            if (this.currentHondId) {
                this.loadPrivateInfoForDog();
            }
        }
    }
    
    async init() {
        // Laad alle honden bij het opstarten van de module
        await this.loadAllDogs();
    }
    
    async loadAllDogs() {
        try {
            this.showProgress(this.t('loadingAllDogs'));
            
            let page = 1;
            const pageSize = 500; // Haal 500 per pagina op voor grote datasets
            let hasMore = true;
            let allDogs = [];
            
            // Paginerend alle honden laden
            while (hasMore) {
                const result = await window.hondenService.getHonden(page, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    allDogs = [...allDogs, ...result.honden];
                    hasMore = result.heeftVolgende;
                    page++;
                    
                    // Update progress
                    this.showProgress(`${this.t('loadingAllDogs')} (${allDogs.length} geladen)`);
                } else {
                    hasMore = false;
                }
                
                // Voeg kleine vertraging toe om Supabase rate limiting te voorkomen
                if (hasMore) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            // Sorteer op naam
            this.allDogs = allDogs.sort((a, b) => {
                const naamA = (a.naam || '').toLowerCase();
                const naamB = (b.naam || '').toLowerCase();
                return naamA.localeCompare(naamB);
            });
            
            console.log(`[PrivateInfoManager] ${this.allDogs.length} honden geladen`);
            this.hideProgress();
            
        } catch (error) {
            console.error('Fout bij laden alle honden:', error);
            this.hideProgress();
            this.showError('Fout bij laden honden: ' + error.message);
            this.allDogs = [];
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
                                                <select class="form-select" id="privateHondSelect">
                                                    <option value="">${t('chooseDog')}</option>
                                                    ${this.allDogs.map(dog => `
                                                        <option value="${dog.id}" data-stamboomnr="${dog.stamboomnr || ''}">
                                                            ${dog.naam || 'Naam onbekend'} 
                                                            ${dog.stamboomnr ? `(${dog.stamboomnr})` : ''}
                                                            ${dog.kennelnaam ? ` - ${dog.kennelnaam}` : ''}
                                                        </option>
                                                    `).join('')}
                                                </select>
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
        
        const hondSelect = document.getElementById('privateHondSelect');
        if (hondSelect) {
            hondSelect.addEventListener('change', (e) => {
                this.selectDogFromDropdown(e.target.value);
            });
        }
    }
    
    selectDogFromDropdown(dogId) {
        const dog = this.allDogs.find(d => d.id.toString() === dogId);
        if (dog) {
            this.selectDog(dog);
        }
    }
    
    selectDog(dog) {
        const dogIdInput = document.getElementById('selectedDogId');
        const stamboomnrInput = document.getElementById('selectedDogStamboomnr');
        const infoDiv = document.getElementById('selectedDogInfo');
        
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
                    ${dog.geboortedatum ? 'Geb: ' + new Date(dog.geboortedatum).toLocaleDateString('nl-NL') : ''}
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
            // Gebruik de Supabase priveInfoService om privé info op te halen
            this.currentPriveInfo = await this.getSupabasePrivateInfo(stamboomnr);
            
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
    
    async getSupabasePrivateInfo(stamboomnr) {
        // Controleer of de priveInfoService beschikbaar is
        if (!window.priveInfoService) {
            throw new Error('Privé info service niet beschikbaar');
        }
        
        // Haal alle privé info op voor de ingelogde gebruiker
        try {
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            
            // Zoek de specifieke stamboomnr in de resultaten
            const priveInfo = result.priveInfo.find(info => info.stamboomnr === stamboomnr);
            
            if (priveInfo) {
                return {
                    ...priveInfo,
                    privateNotes: priveInfo.privatenotes || ''
                };
            }
            
            return null;
        } catch (error) {
            console.error('Fout bij ophalen Supabase privé info:', error);
            throw error;
        }
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
                ${dog.naam || 'Naam onbekend'} 
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
                privateNotes: document.getElementById('privateNotes').value.trim()
            };
            
            // Gebruik Supabase priveInfoService om op te slaan
            await this.saveSupabasePrivateInfo(priveInfo);
            
            this.hideProgress();
            this.showSuccess(t('saveSuccess'));
            
            // Herlaad de info na opslaan
            this.currentPriveInfo = await this.getSupabasePrivateInfo(stamboomnr);
            this.displayPrivateInfo();
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('saveFailed')}${error.message}`);
        }
    }
    
    async saveSupabasePrivateInfo(priveInfo) {
        // Controleer of de priveInfoService beschikbaar is
        if (!window.priveInfoService) {
            throw new Error('Privé info service niet beschikbaar');
        }
        
        // Sla privé info op in Supabase
        const supabaseData = {
            stamboomnr: priveInfo.stamboomnr,
            privateNotes: priveInfo.privateNotes
        };
        
        await window.priveInfoService.bewaarPriveInfo(supabaseData);
        
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
            // Haal alle privé info op uit Supabase
            const allPriveInfo = await this.getAllSupabasePrivateInfo();
            
            const backupData = {
                backupDatum: new Date().toISOString(),
                aantalRecords: allPriveInfo.length,
                appNaam: "Honden Registratie Prive Info (Supabase)",
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
    
    async getAllSupabasePrivateInfo() {
        if (!window.priveInfoService) {
            throw new Error('Privé info service niet beschikbaar');
        }
        
        const allPrivateInfo = [];
        
        try {
            // Haal eerste pagina op
            const result = await window.priveInfoService.getPriveInfoMetPaginatie(1, 1000);
            
            if (result.priveInfo && result.priveInfo.length > 0) {
                // Transformeer Supabase data naar backup formaat
                const transformedData = result.priveInfo.map(info => ({
                    stamboomnr: info.stamboomnr,
                    privateNotes: info.privatenotes || '',
                    savedAt: info.laatstgewijzigd || new Date().toISOString(),
                    userId: info.toegevoegd_door
                }));
                
                allPrivateInfo.push(...transformedData);
                
                // Als er meer pagina's zijn, laad die ook (max 5 pagina's voor backup)
                const totalPages = Math.min(result.totaalPaginas || 1, 5);
                for (let page = 2; page <= totalPages; page++) {
                    try {
                        const pageResult = await window.priveInfoService.getPriveInfoMetPaginatie(page, 1000);
                        if (pageResult.priveInfo && pageResult.priveInfo.length > 0) {
                            const pageTransformedData = pageResult.priveInfo.map(info => ({
                                stamboomnr: info.stamboomnr,
                                privateNotes: info.privatenotes || '',
                                savedAt: info.laatstgewijzigd || new Date().toISOString(),
                                userId: info.toegevoegd_door
                            }));
                            allPrivateInfo.push(...pageTransformedData);
                        }
                    } catch (pageError) {
                        console.error('Fout bij laden backup pagina', page, ':', pageError);
                    }
                }
            }
            
        } catch (error) {
            console.error('Fout bij ophalen Supabase privé info voor backup:', error);
            throw error;
        }
        
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
                                // Opslaan in Supabase
                                await this.saveSupabasePrivateInfo(info);
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
                            this.currentPriveInfo = await this.getSupabasePrivateInfo(stamboomnr);
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
        // Toon een progress indicator
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
        
        // Verwijder na 30 seconden (voor lange operaties)
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 30000);
    }
    
    hideProgress() {
        // Verwijder alle progress alerts
        const alerts = document.querySelectorAll('.alert-info.position-fixed');
        alerts.forEach(alert => alert.remove());
    }
    
    showSuccess(message) {
        this.showAlert(message, 'success');
    }
    
    showError(message) {
        this.showAlert(message, 'danger');
    }
    
    showInfo(message) {
        this.showAlert(message, 'info');
    }
    
    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Verwijder na 5 seconden
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}