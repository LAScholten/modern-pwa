/**
 * Data Management Module voor HondenDatabase
 * COMPLEET MET ALLE FIXES
 */

class DataManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = {
            nl: {
                dataManagement: "Data Beheer",
                dataImport: "Data Importeren",
                importDescription: "Importeer data uit een eerder geëxporteerd bestand.",
                selectJsonFile: "Selecteer exportbestand",
                chooseExportedFile: "Kies een bestand dat eerder is geëxporteerd uit deze applicatie",
                importStrategy: "Import strategie",
                importStrategyDescription: "Volledige herstel: Herstel alle data uit export",
                updateAndComplete: "Volledige herstel",
                startImport: "Start Import",
                importingData: "Data importeren...",
                buildingRelations: "Relaties opbouwen...",
                dataExport: "Data Exporteren",
                exportDescription: "Exporteer data naar een bestand voor backup of delen.",
                exportOptions: "Export opties",
                exportData: "Data exporteren",
                exportDataDescription: "Alle hondengegevens zonder foto's",
                exportPhotos: "Foto's exporteren",
                exportPhotosDescription: "Foto metadata en relaties",
                exportPrivateInfo: "Privé informatie exporteren",
                exportPrivateInfoDescription: "Vertrouwelijke notities en informatie",
                exportFormat: "Export formaat",
                jsonFormat: "JSON (aanbevolen)",
                csvFormat: "CSV (alleen hondengegevens)",
                startExport: "Start Export",
                exportingData: "Data exporteren...",
                databaseStatistics: "Database Statistieken",
                dogs: "Honden",
                photos: "Foto's",
                privateRecords: "Privé records",
                selectFileFirst: "Selecteer eerst een bestand om te importeren",
                fileReadError: "Fout bij lezen bestand",
                importFailed: "Import mislukt: ",
                importComplete: "Import voltooid!",
                importSummary: "Import samenvatting",
                newDogsAdded: "Nieuwe honden toegevoegd",
                dogsUpdated: "Honden bijgewerkt",
                photosImported: "Foto's geïmporteerd",
                privateUpdated: "Privé records bijgewerkt",
                relationshipsBuilt: "Relaties hersteld",
                exportSuccess: "Export succesvol voltooid!",
                exportFailed: "Export mislukt: ",
                exportFileSaved: "Bestand opgeslagen als: ",
                loadingStats: "Laden statistieken...",
                statsError: "Fout bij laden statistieken: ",
                nothingToExport: "Niets te exporteren - geen exportopties geselecteerd",
                error: "Fout",
                exportComplete: "Export compleet",
                totalDogsExported: "Totaal honden geëxporteerd: ",
                totalPhotosExported: "Totaal foto's geëxporteerd: ",
                totalPrivateExported: "Totaal privé records geëxporteerd: ",
                backupType: "Backup type",
                backupEverything: "Backup alles (veilig opslaan)",
                backupEverythingDescription: "Exporteer alle data inclusief privé notities",
                shareData: "Exporteren voor delen",
                shareDataDescription: "Exporteer naar keuze wat je wilt delen",
                backupStatusWarning: "Backup aanbevolen",
                backupStatusDanger: "Belangrijk",
                backupWarningText: "Laatste backup was {days} dagen geleden",
                backupDangerText: "Je hebt nog nooit een backup gemaakt!"
            },
            en: {
                dataManagement: "Data Management",
                dataImport: "Data Import",
                importDescription: "Import data from a previously exported file.",
                selectJsonFile: "Select export file",
                chooseExportedFile: "Choose a file that was previously exported from this application",
                importStrategy: "Import strategy",
                importStrategyDescription: "Full restore: Restore all data from export",
                updateAndComplete: "Full restore",
                startImport: "Start Import",
                importingData: "Importing data...",
                buildingRelations: "Building relationships...",
                dataExport: "Data Export",
                exportDescription: "Export data to a file for backup or sharing.",
                exportOptions: "Export options",
                exportData: "Export data",
                exportDataDescription: "All dog data without photos",
                exportPhotos: "Export photos",
                exportPhotosDescription: "Photo metadata and relationships",
                exportPrivateInfo: "Export private information",
                exportPrivateInfoDescription: "Confidential notes and information",
                exportFormat: "Export format",
                jsonFormat: "JSON (recommended)",
                csvFormat: "CSV (dog data only)",
                startExport: "Start Export",
                exportingData: "Exporting data...",
                databaseStatistics: "Database Statistics",
                dogs: "Dogs",
                photos: "Photos",
                privateRecords: "Private records",
                selectFileFirst: "First select a file to import",
                fileReadError: "Error reading file",
                importFailed: "Import failed: ",
                importComplete: "Import completed!",
                importSummary: "Import summary",
                newDogsAdded: "New dogs added",
                dogsUpdated: "Dogs updated",
                photosImported: "Photos imported",
                privateUpdated: "Private records updated",
                relationshipsBuilt: "Relationships restored",
                exportSuccess: "Export successfully completed!",
                exportFailed: "Export failed: ",
                exportFileSaved: "File saved as: ",
                loadingStats: "Loading statistics...",
                statsError: "Error loading statistics: ",
                nothingToExport: "Nothing to export - no export options selected",
                error: "Error",
                exportComplete: "Export complete",
                totalDogsExported: "Total dogs exported: ",
                totalPhotosExported: "Total photos exported: ",
                totalPrivateExported: "Total private records exported: ",
                backupType: "Backup type",
                backupEverything: "Backup everything (safe storage)",
                backupEverythingDescription: "Export all data including private notes",
                shareData: "Export for sharing",
                shareDataDescription: "Export what you want to share",
                backupStatusWarning: "Backup recommended",
                backupStatusDanger: "Important",
                backupWarningText: "Last backup was {days} days ago",
                backupDangerText: "You have never made a backup!"
            },
            de: {
                dataManagement: "Datenverwaltung",
                dataImport: "Datenimport",
                importDescription: "Importieren Sie Daten aus einer zuvor exportierten Datei.",
                selectJsonFile: "Exportdatei auswählen",
                chooseExportedFile: "Wählen Sie eine Datei, die zuvor aus dieser Anwendung exportiert wurde",
                importStrategy: "Importstrategie",
                importStrategyDescription: "Vollständige Wiederherstellung: Alle Daten aus dem Export wiederherstellen",
                updateAndComplete: "Vollständige Wiederherstellung",
                startImport: "Import starten",
                importingData: "Daten werden importiert...",
                buildingRelations: "Beziehungen werden aufgebaut...",
                dataExport: "Datenexport",
                exportDescription: "Exportieren Sie Daten in eine Datei für Backup oder Teilen.",
                exportOptions: "Exportoptionen",
                exportData: "Daten exportieren",
                exportDataDescription: "Alle Hunde-Daten ohne Fotos",
                exportPhotos: "Fotos exportieren",
                exportPhotosDescription: "Foto-Metadaten und Beziehungen",
                exportPrivateInfo: "Private Informationen exportieren",
                exportPrivateInfoDescription: "Vertrauliche Notizen und Informationen",
                exportFormat: "Exportformat",
                jsonFormat: "JSON (empfohlen)",
                csvFormat: "CSV (nur Hunde-Daten)",
                startExport: "Export starten",
                exportingData: "Daten werden exportiert...",
                databaseStatistics: "Datenbankstatistiken",
                dogs: "Hunde",
                photos: "Fotos",
                privateRecords: "Private Aufzeichnungen",
                selectFileFirst: "Wählen Sie zuerst eine Datei zum Importieren",
                fileReadError: "Fehler beim Lesen der Datei",
                importFailed: "Import fehlgeschlagen: ",
                importComplete: "Import abgeschlossen!",
                importSummary: "Import-Zusammenfassung",
                newDogsAdded: "Neue Hunde hinzugefügt",
                dogsUpdated: "Hunde aktualisiert",
                photosImported: "Fotos importiert",
                privateUpdated: "Private Aufzeichnungen aktualisiert",
                relationshipsBuilt: "Beziehungen wiederhergestellt",
                exportSuccess: "Export erfolgreich abgeschlossen!",
                exportFailed: "Export fehlgeschlagen: ",
                exportFileSaved: "Datei gespeichert als: ",
                loadingStats: "Statistiken werden geladen...",
                statsError: "Fehler beim Laden der Statistiken: ",
                nothingToExport: "Nichts zu exportieren - geen Exportoptionen ausgewählt",
                error: "Fehler",
                exportComplete: "Export abgeschlossen",
                totalDogsExported: "Gesamte Hunde exportiert: ",
                totalPhotosExported: "Gesamte Fotos exportiert: ",
                totalPrivateExported: "Gesamte private Aufzeichnungen exportiert: ",
                backupType: "Backup-Typ",
                backupEverything: "Alles sichern (sichere Aufbewahrung)",
                backupEverythingDescription: "Exportieren Sie alle data einschließlich privater Notizen",
                shareData: "Zum Teilen exportieren",
                shareDataDescription: "Exportieren Sie was Sie teilen möchten",
                backupStatusWarning: "Backup empfohlen",
                backupStatusDanger: "Wichtig",
                backupWarningText: "Letztes Backup was vor {days} Tagen",
                backupDangerText: "Sie haben noch nie ein Backup erstellt!"
            }
        };
        
        // Database lazy loading - niet meteen proberen te vinden
        this._db = null; // Private property
        
        // Luister naar database-ready event
        document.addEventListener('database-ready', () => {
            this.initializeDatabaseConnection();
        });
        
        // Probeer ook na een korte delay
        setTimeout(() => {
            if (!this._db) {
                this.initializeDatabaseConnection();
            }
        }, 1000);
    }
    
    // Methode om database connectie te initialiseren
    initializeDatabaseConnection() {
        if (window.hondenService) {
            this._db = window.hondenService;
            console.log('DataManager: Database verbonden via window.hondenService');
        } else if (window.fotoService) {
            // Foto service apart bewaren
            console.log('DataManager: Foto service gevonden');
        } else if (window.priveInfoService) {
            // Privé info service apart bewaren
            console.log('DataManager: Privé info service gevonden');
        } else {
            console.log('DataManager: Services nog niet beschikbaar, zal later proberen');
            // Plan nog een poging
            setTimeout(() => this.initializeDatabaseConnection(), 2000);
        }
    }
    
    // Getter voor database met lazy loading
    get db() {
        if (!this._db) {
            this.initializeDatabaseConnection();
        }
        return this._db;
    }
    
    // Setter voor database
    set db(value) {
        this._db = value;
    }
    
    // Methode om te controleren of database beschikbaar is
    isDatabaseAvailable() {
        return !!this._db || !!window.hondenService;
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('dataManagementModal')) {
            this.loadDatabaseStats();
            this.updateModalTexts();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        let backupStatusHTML = '';
        if (window.backupManager) {
            const status = window.backupManager.getStatus();
            const daysSince = window.backupManager.getDaysSinceLastBackup();
            
            if (status.level === 'danger') {
                backupStatusHTML = `<div class="alert alert-danger mb-3">
                    <i class="bi bi-exclamation-triangle-fill"></i> 
                    <strong>${t('backupStatusDanger')}</strong><br>
                    ${t('backupDangerText')}
                </div>`;
            } else if (status.level === 'warning') {
                const warningText = t('backupWarningText').replace('{days}', daysSince);
                backupStatusHTML = `<div class="alert alert-warning mb-3">
                    <i class="bi bi-exclamation-triangle"></i> 
                    <strong>${t('backupStatusWarning')}</strong><br>
                    ${warningText}
                </div>`;
            }
        }
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1" aria-labelledby="dataManagementModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="dataManagementModalLabel">
                                <i class="bi bi-database-gear"></i> ${t('dataManagement')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${t('close') || 'Sluiten'}"></button>
                        </div>
                        <div class="modal-body">
                            ${backupStatusHTML}
                            
                            <div class="row">
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0">
                                                <i class="bi bi-upload"></i> ${t('dataImport')}
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                ${t('importDescription')}
                                            </p>
                                            
                                            <div class="mb-3">
                                                <label for="importFile" class="form-label">${t('selectJsonFile')}</label>
                                                <input class="form-control" type="file" id="importFile" accept=".json,.csv">
                                                <div class="form-text">
                                                    ${t('chooseExportedFile')}
                                                </div>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <label for="importStrategy" class="form-label">${t('importStrategy')}</label>
                                                <select class="form-select" id="importStrategy">
                                                    <option value="fullRestore" selected>${t('updateAndComplete')}</option>
                                                </select>
                                                <div class="form-text">
                                                    ${t('importStrategyDescription')}
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-success w-100" id="startImportBtn">
                                                <i class="bi bi-upload"></i> ${t('startImport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-primary">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">
                                                <i class="bi bi-download"></i> ${t('dataExport')}
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                ${t('exportDescription')}
                                            </p>
                                            
                                            <div class="mb-4">
                                                <label class="form-label">${t('backupType')}</label>
                                                
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="exportType" id="backupEverything" value="backup" checked>
                                                        <label class="form-check-label" for="backupEverything">
                                                            <strong>${t('backupEverything')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('backupEverythingDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="radio" name="exportType" id="shareData" value="share">
                                                        <label class="form-check-label" for="shareData">
                                                            <strong>${t('shareData')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('shareDataDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4" id="exportOptionsSection">
                                                <label class="form-label">${t('exportOptions')}</label>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportData" checked>
                                                        <label class="form-check-label" for="exportData">
                                                            <strong>${t('exportData')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportDataDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPhotos" checked>
                                                        <label class="form-check-label" for="exportPhotos">
                                                            <strong>${t('exportPhotos')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportPhotosDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-3">
                                                    <div class="form-check">
                                                        <input class="form-check-input" type="checkbox" id="exportPrivateInfo" checked>
                                                        <label class="form-check-label" for="exportPrivateInfo">
                                                            <strong>${t('exportPrivateInfo')}</strong>
                                                        </label>
                                                        <div class="form-text">
                                                            ${t('exportPrivateInfoDescription')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="mb-4">
                                                <label for="exportFormat" class="form-label">${t('exportFormat')}</label>
                                                <select class="form-select" id="exportFormat">
                                                    <option value="json" selected>${t('jsonFormat')}</option>
                                                    <option value="csv">${t('csvFormat')}</option>
                                                </select>
                                                <div class="form-text">
                                                    CSV is alleen beschikbaar wanneer "Data exporteren" is geselecteerd
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-primary w-100" id="startExportBtn">
                                                <i class="bi bi-download"></i> ${t('startExport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card border-info mt-4">
                                <div class="card-header bg-info text-white">
                                    <h5 class="mb-0">
                                        <i class="bi bi-graph-up"></i> ${t('databaseStatistics')}
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row" id="databaseStats">
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-primary" id="statsHonden">...</div>
                                            <div class="text-muted">${t('dogs')}</div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-success" id="statsFotos">...</div>
                                            <div class="text-muted">${t('photos')}</div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="display-6 text-warning" id="statsPrive">...</div>
                                            <div class="text-muted">${t('privateRecords')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close') || 'Sluiten'}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        const importBtn = document.getElementById('startImportBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.handleImport();
            });
        }
        
        const exportBtn = document.getElementById('startExportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.handleExport();
            });
        }
        
        const backupEverythingRadio = document.getElementById('backupEverything');
        const shareDataRadio = document.getElementById('shareData');
        const exportDataCheckbox = document.getElementById('exportData');
        const exportPhotosCheckbox = document.getElementById('exportPhotos');
        const exportPrivateInfoCheckbox = document.getElementById('exportPrivateInfo');
        const exportFormatSelect = document.getElementById('exportFormat');
        
        if (backupEverythingRadio) {
            backupEverythingRadio.addEventListener('change', () => {
                if (exportDataCheckbox) exportDataCheckbox.checked = true;
                if (exportPhotosCheckbox) exportPhotosCheckbox.checked = true;
                if (exportPrivateInfoCheckbox) exportPrivateInfoCheckbox.checked = true;
                this.updateExportFormatOptions();
            });
        }
        
        if (shareDataRadio) {
            shareDataRadio.addEventListener('change', () => {
                // Bij delen: alles staat standaard aan, maar kan worden uitgeschakeld
                if (exportDataCheckbox) exportDataCheckbox.checked = true;
                if (exportPhotosCheckbox) exportPhotosCheckbox.checked = true;
                if (exportPrivateInfoCheckbox) exportPrivateInfoCheckbox.checked = true;
                this.updateExportFormatOptions();
            });
        }
        
        if (exportDataCheckbox) {
            exportDataCheckbox.addEventListener('change', () => {
                this.updateExportFormatOptions();
            });
        }
        
        if (exportFormatSelect) {
            exportFormatSelect.addEventListener('change', () => {
                this.updateExportFormatOptions();
            });
        }
        
        const modal = document.getElementById('dataManagementModal');
        if (modal) {
            modal.addEventListener('shown.bs.modal', () => {
                // Controleer of database beschikbaar is
                if (!this.isDatabaseAvailable()) {
                    console.warn('DataManager: Database niet beschikbaar bij openen modal');
                    this.showError('Database niet beschikbaar. Probeer opnieuw.');
                    return;
                }
                
                this.loadDatabaseStats();
                this.updateExportFormatOptions();
            });
        }
        
        document.querySelectorAll('.app-lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.updateLanguage(lang);
            });
        });
    }
    
    updateExportFormatOptions() {
        const exportDataCheckbox = document.getElementById('exportData');
        const exportFormatSelect = document.getElementById('exportFormat');
        const csvOption = exportFormatSelect?.querySelector('option[value="csv"]');
        
        if (exportDataCheckbox && exportFormatSelect && csvOption) {
            const isDataChecked = exportDataCheckbox.checked;
            const isCSVSelected = exportFormatSelect.value === 'csv';
            
            csvOption.disabled = !isDataChecked;
            
            if (isCSVSelected && !isDataChecked) {
                exportFormatSelect.value = 'json';
            }
            
            const formText = exportFormatSelect.nextElementSibling;
            if (formText && formText.classList.contains('form-text')) {
                formText.textContent = isDataChecked 
                    ? 'CSV is alleen beschikbaar wanneer "Data exporteren" is geselecteerd' 
                    : 'CSV is niet beschikbaar zonder "Data exporteren"';
            }
        }
    }
    
    updateModalTexts() {
        const t = this.t.bind(this);
        const modal = document.getElementById('dataManagementModal');
        
        if (!modal) return;
        
        const title = modal.querySelector('#dataManagementModalLabel');
        if (title) {
            title.innerHTML = `<i class="bi bi-database-gear"></i> ${t('dataManagement')}`;
        }
        
        const importCard = modal.querySelector('.card.border-success .card-header h5');
        if (importCard) {
            importCard.innerHTML = `<i class="bi bi-upload"></i> ${t('dataImport')}`;
        }
        
        const importDesc = modal.querySelector('.card.border-success .card-body p.card-text');
        if (importDesc) {
            importDesc.textContent = t('importDescription');
        }
        
        const importLabel = modal.querySelector('label[for="importFile"]');
        if (importLabel) {
            importLabel.textContent = t('selectJsonFile');
        }
        
        const importHelp = modal.querySelector('.card.border-success .form-text');
        if (importHelp) {
            importHelp.textContent = t('chooseExportedFile');
        }
        
        const strategyLabel = modal.querySelector('label[for="importStrategy"]');
        if (strategyLabel) {
            strategyLabel.textContent = t('importStrategy');
        }
        
        const strategyHelp = modal.querySelectorAll('.card.border-success .form-text')[1];
        if (strategyHelp) {
            strategyHelp.textContent = t('importStrategyDescription');
        }
        
        const importBtn = modal.querySelector('#startImportBtn');
        if (importBtn) {
            importBtn.innerHTML = `<i class="bi bi-upload"></i> ${t('startImport')}`;
        }
        
        const exportCard = modal.querySelector('.card.border-primary .card-header h5');
        if (exportCard) {
            exportCard.innerHTML = `<i class="bi bi-download"></i> ${t('dataExport')}`;
        }
        
        const exportDesc = modal.querySelector('.card.border-primary .card-body p.card-text');
        if (exportDesc) {
            exportDesc.textContent = t('exportDescription');
        }
        
        const backupTypeLabel = modal.querySelector('.card.border-primary .form-label');
        if (backupTypeLabel) {
            backupTypeLabel.textContent = t('backupType');
        }
        
        const backupEverythingLabel = modal.querySelector('label[for="backupEverything"] strong');
        if (backupEverythingLabel) {
            backupEverythingLabel.textContent = t('backupEverything');
        }
        
        const backupEverythingHelp = modal.querySelectorAll('.card.border-primary .form-text')[0];
        if (backupEverythingHelp) {
            backupEverythingHelp.textContent = t('backupEverythingDescription');
        }
        
        const shareDataLabel = modal.querySelector('label[for="shareData"] strong');
        if (shareDataLabel) {
            shareDataLabel.textContent = t('shareData');
        }
        
        const shareDataHelp = modal.querySelectorAll('.card.border-primary .form-text')[1];
        if (shareDataHelp) {
            shareDataHelp.textContent = t('shareDataDescription');
        }
        
        const exportOptionsLabel = modal.querySelector('#exportOptionsSection .form-label');
        if (exportOptionsLabel) {
            exportOptionsLabel.textContent = t('exportOptions');
        }
        
        const exportDataLabel = modal.querySelector('label[for="exportData"] strong');
        if (exportDataLabel) {
            exportDataLabel.textContent = t('exportData');
        }
        
        const exportDataHelp = modal.querySelectorAll('.card.border-primary .form-text')[2];
        if (exportDataHelp) {
            exportDataHelp.textContent = t('exportDataDescription');
        }
        
        const exportPhotosLabel = modal.querySelector('label[for="exportPhotos"] strong');
        if (exportPhotosLabel) {
            exportPhotosLabel.textContent = t('exportPhotos');
        }
        
        const exportPhotosHelp = modal.querySelectorAll('.card.border-primary .form-text')[3];
        if (exportPhotosHelp) {
            exportPhotosHelp.textContent = t('exportPhotosDescription');
        }
        
        const exportPrivateInfoLabel = modal.querySelector('label[for="exportPrivateInfo"] strong');
        if (exportPrivateInfoLabel) {
            exportPrivateInfoLabel.textContent = t('exportPrivateInfo');
        }
        
        const exportPrivateInfoHelp = modal.querySelectorAll('.card.border-primary .form-text')[4];
        if (exportPrivateInfoHelp) {
            exportPrivateInfoHelp.textContent = t('exportPrivateInfoDescription');
        }
        
        const formatLabel = modal.querySelector('label[for="exportFormat"]');
        if (formatLabel) {
            formatLabel.textContent = t('exportFormat');
        }
        
        const jsonOption = modal.querySelector('#exportFormat option[value="json"]');
        if (jsonOption) {
            jsonOption.textContent = t('jsonFormat');
        }
        
        const csvOption = modal.querySelector('#exportFormat option[value="csv"]');
        if (csvOption) {
            csvOption.textContent = t('csvFormat');
        }
        
        const exportBtn = modal.querySelector('#startExportBtn');
        if (exportBtn) {
            exportBtn.innerHTML = `<i class="bi bi-download"></i> ${t('startExport')}`;
        }
        
        const statsCard = modal.querySelector('.card.border-info .card-header h5');
        if (statsCard) {
            statsCard.innerHTML = `<i class="bi bi-graph-up"></i> ${t('databaseStatistics')}`;
        }
        
        const statsLabels = modal.querySelectorAll('#databaseStats .text-muted');
        if (statsLabels.length >= 3) {
            statsLabels[0].textContent = t('dogs');
            statsLabels[1].textContent = t('photos');
            statsLabels[2].textContent = t('privateRecords');
        }
        
        const closeBtn = modal.querySelector('.modal-footer .btn-secondary');
        if (closeBtn) {
            closeBtn.textContent = t('close') || 'Sluiten';
        }
        
        this.updateBackupWarningText();
        this.updateExportFormatOptions();
    }
    
    updateBackupWarningText() {
        if (!window.backupManager) return;
        
        const status = window.backupManager.getStatus();
        const daysSince = window.backupManager.getDaysSinceLastBackup();
        const t = this.t.bind(this);
        
        const warningDiv = document.querySelector('#dataManagementModal .alert');
        if (!warningDiv) return;
        
        if (status.level === 'danger') {
            warningDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> 
                <strong>${t('backupStatusDanger')}</strong><br>
                ${t('backupDangerText')}`;
        } else if (status.level === 'warning') {
            const warningText = t('backupWarningText').replace('{days}', daysSince);
            warningDiv.innerHTML = `<i class="bi bi-exclamation-triangle"></i> 
                <strong>${t('backupStatusWarning')}</strong><br>
                ${warningText}`;
        }
    }
    
    async handleImport() {
        // Controleer eerst of database beschikbaar is
        if (!this.isDatabaseAvailable()) {
            this.showError('Database niet beschikbaar. Probeer opnieuw of refresh de pagina.');
            return;
        }
        
        const t = this.t.bind(this);
        const fileInput = document.getElementById('importFile');
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectFileFirst'));
            return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                this.showProgress(t('importingData'));
                
                let importData;
                if (file.name.endsWith('.csv')) {
                    importData = await this.parseCSV(e.target.result);
                } else {
                    importData = JSON.parse(e.target.result);
                }
                
                console.log('Start import...');
                const result = await this.processImportWithRelations(importData);
                
                this.hideProgress();
                this.showImportResults(result);
                await this.loadDatabaseStats();
                
            } catch (error) {
                this.hideProgress();
                this.showError(`${t('importFailed')}${error.message}`);
            }
        };
        
        reader.onerror = () => {
            this.showError(t('fileReadError'));
        };
        
        reader.readAsText(file);
    }
    
    async handleExport() {
        // Controleer eerst of database beschikbaar is
        if (!this.isDatabaseAvailable()) {
            this.showError('Database niet beschikbaar. Probeer opnieuw of refresh de pagina.');
            return;
        }
        
        const t = this.t.bind(this);
        const isBackup = document.getElementById('backupEverything')?.checked;
        const exportData = document.getElementById('exportData').checked;
        const exportPhotos = document.getElementById('exportPhotos').checked;
        const exportPrivateInfo = document.getElementById('exportPrivateInfo').checked;
        const exportFormat = document.getElementById('exportFormat').value;
        
        if (!exportData && !exportPhotos && !exportPrivateInfo) {
            this.showError(t('nothingToExport'));
            return;
        }
        
        if (exportFormat === 'csv' && !exportData) {
            this.showError('CSV export is alleen beschikbaar met "Data exporteren"');
            return;
        }
        
        this.showProgress(t('exportingData'));
        
        try {
            const exportDataObj = {
                metadata: {
                    exportDatum: new Date().toISOString(),
                    exportDoor: window.auth?.getCurrentUser()?.username || 'unknown',
                    exportType: isBackup ? 'backup' : 'share',
                    exportFormat: exportFormat,
                    containsData: exportData,
                    containsPhotos: exportPhotos,
                    containsPrivate: exportPrivateInfo,
                    versie: "2.0"
                }
            };
            
            let hondenCount = 0;
            let fotosCount = 0;
            let priveCount = 0;
            
            if (exportData) {
                try {
                    const honden = await window.hondenService.getHonden();
                    
                    const parentLookupMap = new Map();
                    honden.forEach(hond => {
                        if (hond.stamboomnr) {
                            parentLookupMap.set(hond.id, {
                                stamboomnr: hond.stamboomnr,
                                naam: hond.naam,
                                kennelnaam: hond.kennelnaam
                            });
                        }
                    });
                    
                    exportDataObj.honden = honden.map(hond => {
                        const exportHond = { ...hond };
                        
                        if (hond.vaderId && parentLookupMap.has(hond.vaderId)) {
                            const vader = parentLookupMap.get(hond.vaderId);
                            exportHond.vaderStamboomnr = vader.stamboomnr;
                            exportHond.vaderNaam = vader.naam;
                            exportHond.vaderKennel = vader.kennelnaam;
                        }
                        
                        if (hond.moederId && parentLookupMap.has(hond.moederId)) {
                            const moeder = parentLookupMap.get(hond.moederId);
                            exportHond.moederStamboomnr = moeder.stamboomnr;
                            exportHond.moederNaam = moeder.naam;
                            exportHond.moederKennel = moeder.kennelnaam;
                        }
                        
                        return exportHond;
                    });
                    
                    hondenCount = exportDataObj.honden.length;
                } catch (error) {
                    console.error('Kon honden niet ophalen:', error);
                    exportDataObj.honden = [];
                }
            }
            
            if (exportPhotos) {
                try {
                    if (window.fotoService && typeof window.fotoService.getAllFotos === 'function') {
                        try {
                            exportDataObj.fotos = await window.fotoService.getAllFotos();
                            fotosCount = exportDataObj.fotos.length;
                        } catch (fotoError) {
                            console.log('Kon foto\'s niet exporteren:', fotoError);
                            exportDataObj.fotos = [];
                        }
                    } else {
                        exportDataObj.fotos = [];
                    }
                } catch (error) {
                    console.error('Kon foto\'s niet ophalen:', error);
                    exportDataObj.fotos = [];
                }
            }
            
            if (exportPrivateInfo) {
                try {
                    if (window.priveInfoService && typeof window.priveInfoService.getAllPriveInfo === 'function') {
                        try {
                            exportDataObj.priveInfo = await window.priveInfoService.getAllPriveInfo();
                            priveCount = exportDataObj.priveInfo.length;
                        } catch (priveError) {
                            console.log('Geen rechten voor privé info export:', priveError);
                            exportDataObj.priveInfo = [];
                        }
                    } else {
                        exportDataObj.priveInfo = [];
                    }
                } catch (error) {
                    console.error('Kon privé info niet ophalen:', error);
                    exportDataObj.priveInfo = [];
                }
            }
            
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
            let filenamePrefix = isBackup ? 'backup' : 'share';
            
            // Bepaal een duidelijke bestandsnaam op basis van wat wordt geëxporteerd
            if (exportData && exportPhotos && exportPrivateInfo) {
                filenamePrefix = isBackup ? 'backup_compleet' : 'share_compleet';
            } else if (exportData && !exportPhotos && !exportPrivateInfo) {
                filenamePrefix = 'data';
            } else if (!exportData && exportPhotos && !exportPrivateInfo) {
                filenamePrefix = 'fotos';
            } else if (!exportData && !exportPhotos && exportPrivateInfo) {
                filenamePrefix = 'prive';
            } else if (exportData && exportPhotos && !exportPrivateInfo) {
                filenamePrefix = 'data_fotos';
            } else if (exportData && !exportPhotos && exportPrivateInfo) {
                filenamePrefix = 'data_prive';
            } else if (!exportData && exportPhotos && exportPrivateInfo) {
                filenamePrefix = 'fotos_prive';
            }
            
            let filename = `${filenamePrefix}_${dateStr}_${timeStr}`;
            let fullFilename;
            
            if (exportFormat === 'csv' && exportData) {
                const csv = this.convertHondenToCSV(exportDataObj.honden);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                fullFilename = `${filename}.csv`;
                this.downloadFile(blob, fullFilename);
            } else {
                const jsonString = JSON.stringify(exportDataObj, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                fullFilename = `${filename}.json`;
                this.downloadFile(blob, fullFilename);
            }
            
            this.hideProgress();
            
            // Backup registratie alleen bij volledige backup
            if (isBackup && window.backupManager && exportData && exportPhotos && exportPrivateInfo) {
                window.backupManager.recordBackup(
                    'full',
                    fullFilename
                );
            }
            
            let successDetails = `${t('exportComplete')}<br>`;
            if (exportData) {
                successDetails += `${t('totalDogsExported')}${hondenCount}<br>`;
            }
            if (exportPhotos && fotosCount > 0) {
                successDetails += `${t('totalPhotosExported')}${fotosCount}<br>`;
            }
            if (exportPrivateInfo && priveCount > 0) {
                successDetails += `${t('totalPrivateExported')}${priveCount}<br>`;
            }
            
            const successMessage = `${t('exportSuccess')}<br>
                                  <small>${t('exportFileSaved')} <strong>${fullFilename}</strong></small><br>
                                  <small>${successDetails}</small>`;
            this.showSuccess(successMessage);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('exportFailed')}${error.message}`);
        }
    }
    
    async processImportWithRelations(importData) {
        const t = this.t.bind(this);
        const result = {
            honden: { toegevoegd: 0, bijgewerkt: 0 },
            fotos: { toegevoegd: 0 },
            priveInfo: { bijgewerkt: 0 },
            relaties: { hersteld: 0 }
        };
        
        console.log('=== START IMPORT ===');
        
        // Extra veiligheidscontrole
        if (!window.hondenService) {
            throw new Error('Database niet beschikbaar voor import.');
        }
        
        // === FASE 1: Importeer alle honden (indien aanwezig) ===
        const stamboomToIdMap = new Map();
        const oldIdToStamboomMap = new Map();
        
        if (importData.honden && Array.isArray(importData.honden)) {
            console.log(`Fase 1: Importeer ${importData.honden.length} honden...`);
            
            const existingHonden = await window.hondenService.getHonden();
            const existingStamboomMap = new Map();
            existingHonden.forEach(hond => {
                if (hond.stamboomnr) {
                    existingStamboomMap.set(hond.stamboomnr, hond);
                }
            });
            
            for (const importedHond of importData.honden) {
                try {
                    const stamboomnr = importedHond.stamboomnr;
                    if (!stamboomnr) continue;
                    
                    if (importedHond.id) {
                        oldIdToStamboomMap.set(importedHond.id, stamboomnr);
                    }
                    
                    const existingHond = existingStamboomMap.get(stamboomnr);
                    
                    if (!existingHond) {
                        const hondZonderIds = {
                            naam: importedHond.naam || '',
                            kennelnaam: importedHond.kennelnaam || '',
                            stamboomnr: stamboomnr,
                            ras: importedHond.ras || '',
                            vachtkleur: importedHond.vachtkleur || '',
                            geslacht: importedHond.geslacht || '',
                            geboortedatum: importedHond.geboortedatum || '',
                            overlijdensdatum: importedHond.overlijdensdatum || '',
                            heupdysplasie: importedHond.heupdysplasie || '',
                            elleboogdysplasie: importedHond.elleboogdysplasie || '',
                            patella: importedHond.patella || '',
                            ogen: importedHond.ogen || '',
                            ogenVerklaring: importedHond.ogenVerklaring || '',
                            dandyWalker: importedHond.dandyWalker || '',
                            schildklier: importedHond.schildklier || '',
                            schildklierVerklaring: importedHond.schildklierVerklaring || '',
                            land: importedHond.land || '',
                            postcode: importedHond.postcode || '',
                            opmerkingen: importedHond.opmerkingen || '',
                            vader: importedHond.vader || '',
                            moeder: importedHond.moeder || '',
                            vaderId: null,
                            moederId: null,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            createdBy: window.auth?.getCurrentUser()?.username || 'unknown'
                        };
                        
                        try {
                            const newId = await window.hondenService.voegHondToe(hondZonderIds);
                            stamboomToIdMap.set(stamboomnr, newId);
                            result.honden.toegevoegd++;
                        } catch (addError) {
                            console.error(`Fout bij toevoegen hond ${stamboomnr}:`, addError);
                        }
                    } else {
                        const updateData = {
                            id: existingHond.id,
                            naam: importedHond.naam || existingHond.naam,
                            kennelnaam: importedHond.kennelnaam || existingHond.kennelnaam,
                            stamboomnr: stamboomnr,
                            ras: importedHond.ras || existingHond.ras,
                            vachtkleur: importedHond.vachtkleur || existingHond.vachtkleur,
                            geslacht: importedHond.geslacht || existingHond.geslacht,
                            geboortedatum: importedHond.geboortedatum || existingHond.geboortedatum,
                            overlijdensdatum: importedHond.overlijdensdatum || existingHond.overlijdensdatum,
                            heupdysplasie: importedHond.heupdysplasie || existingHond.heupdysplasie,
                            elleboogdysplasie: importedHond.elleboogdysplasie || existingHond.elleboogdysplasie,
                            patella: importedHond.patella || existingHond.patella,
                            ogen: importedHond.ogen || existingHond.ogen,
                            ogenVerklaring: importedHond.ogenVerklaring || existingHond.ogenVerklaring,
                            dandyWalker: importedHond.dandyWalker || existingHond.dandyWalker,
                            schildklier: importedHond.schildklier || existingHond.schildklier,
                            schildklierVerklaring: importedHond.schildklierVerklaring || existingHond.schildklierVerklaring,
                            land: importedHond.land || existingHond.land,
                            postcode: importedHond.postcode || existingHond.postcode,
                            opmerkingen: importedHond.opmerkingen || existingHond.opmerkingen,
                            vader: importedHond.vader || existingHond.vader,
                            moeder: importedHond.moeder || existingHond.moeder,
                            updatedAt: new Date().toISOString(),
                            updatedBy: window.auth?.getCurrentUser()?.username || 'unknown'
                        };
                        
                        try {
                            await window.hondenService.updateHond(updateData);
                            stamboomToIdMap.set(stamboomnr, existingHond.id);
                            result.honden.bijgewerkt++;
                        } catch (updateError) {
                            console.error(`Fout bij updaten hond ${stamboomnr}:`, updateError);
                        }
                    }
                } catch (error) {
                    console.error(`Fout bij verwerken hond:`, error);
                }
            }
        }
        
        console.log(`Fase 1 voltooid: ${result.honden.toegevoegd} toegevoegd, ${result.honden.bijgewerkt} bijgewerkt`);
        
        // === FASE 2: Herstel relaties (indien honden aanwezig) ===
        if (importData.honden && Array.isArray(importData.honden)) {
            console.log('Fase 2: Herstel relaties...');
            this.updateProgressMessage(t('buildingRelations'));
            
            let relatiesGemaakt = 0;
            
            for (const importedHond of importData.honden) {
                try {
                    const stamboomnr = importedHond.stamboomnr;
                    if (!stamboomnr) continue;
                    
                    const hondId = stamboomToIdMap.get(stamboomnr);
                    if (!hondId) continue;
                    
                    let vaderId = null;
                    let moederId = null;
                    
                    if (importedHond.vaderStamboomnr) {
                        vaderId = stamboomToIdMap.get(importedHond.vaderStamboomnr);
                    } else if (importedHond.vaderId) {
                        const oudVaderStamboomnr = oldIdToStamboomMap.get(importedHond.vaderId);
                        if (oudVaderStamboomnr) {
                            vaderId = stamboomToIdMap.get(oudVaderStamboomnr);
                        }
                    }
                    
                    if (importedHond.moederStamboomnr) {
                        moederId = stamboomToIdMap.get(importedHond.moederStamboomnr);
                    } else if (importedHond.moederId) {
                        const oudMoederStamboomnr = oldIdToStamboomMap.get(importedHond.moederId);
                        if (oudMoederStamboomnr) {
                            moederId = stamboomToIdMap.get(oudMoederStamboomnr);
                        }
                    }
                    
                    if (vaderId !== null || moederId !== null) {
                        const updateData = {
                            id: hondId,
                            vaderId: vaderId,
                            moederId: moederId,
                            updatedAt: new Date().toISOString()
                        };
                        
                        try {
                            await window.hondenService.updateHond(updateData);
                            relatiesGemaakt++;
                        } catch (updateError) {
                            console.error(`Fout bij updaten relaties voor ${stamboomnr}:`, updateError);
                        }
                    }
                } catch (error) {
                    console.error(`Fout bij herstellen relaties:`, error);
                }
            }
            
            result.relaties.hersteld = relatiesGemaakt;
            console.log(`Fase 2 voltooid: ${result.relaties.hersteld} relaties hersteld`);
        }
        
        // === FASE 3: Foto's (indien aanwezig) ===
        if (importData.fotos && Array.isArray(importData.fotos) && window.fotoService && typeof window.fotoService.voegFotoToe === 'function') {
            console.log(`Fase 3: Importeer ${importData.fotos.length} foto's...`);
            
            let existingFotos = [];
            try {
                if (typeof window.fotoService.getAllFotos === 'function') {
                    existingFotos = await window.fotoService.getAllFotos();
                }
            } catch (error) {
                console.log('Kon bestaande foto\'s niet ophalen:', error);
            }
            
            const existingFotoSet = new Set();
            existingFotos.forEach(foto => {
                if (foto.id) existingFotoSet.add(foto.id);
                if (foto.bestandsnaam) existingFotoSet.add(`file_${foto.bestandsnaam}`);
            });
            
            for (const foto of importData.fotos) {
                try {
                    let fotoBestaatAl = false;
                    if (foto.id && existingFotoSet.has(foto.id)) {
                        fotoBestaatAl = true;
                    } else if (foto.bestandsnaam && existingFotoSet.has(`file_${foto.bestandsnaam}`)) {
                        fotoBestaatAl = true;
                    }
                    
                    if (!fotoBestaatAl) {
                        const hondId = stamboomToIdMap.get(foto.stamboomnr);
                        if (hondId) {
                            const fotoZonderId = {
                                stamboomnr: foto.stamboomnr,
                                data: foto.data || '',
                                thumbnail: foto.thumbnail || '',
                                filename: foto.filename || 'onbekend.jpg',
                                size: foto.size || 0,
                                type: foto.type || 'image/jpeg',
                                uploadedAt: foto.uploadedAt || new Date().toISOString(),
                                geuploadDoor: foto.geuploadDoor || window.auth?.getCurrentUser()?.username || 'unknown'
                            };
                            
                            await window.fotoService.voegFotoToe(fotoZonderId);
                            result.fotos.toegevoegd++;
                        }
                    }
                } catch (error) {
                    console.log(`Foto ${foto.id} kan niet worden toegevoegd:`, error);
                }
            }
        }
        
        // === FASE 4: Privé info (indien aanwezig) ===
        if (importData.priveInfo && Array.isArray(importData.priveInfo) && window.priveInfoService && typeof window.priveInfoService.bewaarPriveInfo === 'function') {
            console.log(`Fase 4: Importeer ${importData.priveInfo.length} privé records...`);
            
            try {
                for (const prive of importData.priveInfo) {
                    try {
                        const hondId = stamboomToIdMap.get(prive.stamboomnr);
                        if (hondId) {
                            const priveZonderId = {
                                stamboomnr: prive.stamboomnr,
                                privateNotes: prive.privateNotes || '',
                                vertrouwelijk: true,
                                laatstGewijzigd: new Date().toISOString(),
                                gewijzigdDoor: window.auth?.getCurrentUser()?.username || 'unknown'
                            };
                            
                            await window.priveInfoService.bewaarPriveInfo(priveZonderId);
                            result.priveInfo.bijgewerkt++;
                        }
                    } catch (error) {
                        console.log(`Privé info voor ${prive.stamboomnr} kan niet worden opgeslagen:`, error);
                    }
                }
            } catch (authError) {
                console.log('Geen rechten voor privé info import:', authError);
            }
        }
        
        console.log('=== IMPORT VOLTOOID ===', result);
        return result;
    }
    
    updateProgressMessage(message) {
        const progressDiv = document.getElementById('dataManagerProgress');
        if (progressDiv) {
            const messageElement = progressDiv.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }
    }
    
    showProgress(message) {
        this.hideProgress();
        
        const progressHtml = `
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show" style="display: block; background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center">
                            <div class="spinner-border text-primary mb-3" role="status"></div>
                            <p>${message}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const progressDiv = document.createElement('div');
        progressDiv.id = 'dataManagerProgress';
        progressDiv.innerHTML = progressHtml;
        document.body.appendChild(progressDiv);
    }
    
    hideProgress() {
        const progressDiv = document.getElementById('dataManagerProgress');
        if (progressDiv) {
            progressDiv.remove();
        }
        document.querySelectorAll('.modal-backdrop.fade.show').forEach(backdrop => {
            if (backdrop.parentNode) {
                backdrop.remove();
            }
        });
    }
    
    showImportResults(result) {
        const t = this.t.bind(this);
        let summary = `<h5>${t('importSummary')}</h5><div class="alert alert-success">`;
        
        if (result.honden.toegevoegd > 0) {
            summary += `<strong>${result.honden.toegevoegd}</strong> ${t('newDogsAdded')}<br>`;
        }
        if (result.honden.bijgewerkt > 0) {
            summary += `<strong>${result.honden.bijgewerkt}</strong> ${t('dogsUpdated')}<br>`;
        }
        if (result.fotos.toegevoegd > 0) {
            summary += `<strong>${result.fotos.toegevoegd}</strong> ${t('photosImported')}<br>`;
        }
        if (result.priveInfo.bijgewerkt > 0) {
            summary += `<strong>${result.priveInfo.bijgewerkt}</strong> ${t('privateUpdated')}<br>`;
        }
        if (result.relaties.hersteld > 0) {
            summary += `<strong>${result.relaties.hersteld}</strong> ${t('relationshipsBuilt')}<br>`;
        }
        
        summary += `</div>`;
        
        this.showSuccess(`${t('importComplete')}<br>${summary}`);
    }
    
    showSuccess(message) {
        this.hideProgress();
        
        const modalId = 'successModal-' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-check-circle"></i> Succes</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();"></button>
                    </div>
                    <div class="modal-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const backdrop = document.createElement('div');
        backdrop.id = modalId + '-backdrop';
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    }
    
    showError(message) {
        this.hideProgress();
        
        const modalId = 'errorModal-' + Date.now();
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title"><i class="bi bi-exclamation-triangle"></i> Fout</h5>
                        <button type="button" class="btn-close btn-close-white" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();"></button>
                    </div>
                    <div class="modal-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" onclick="document.getElementById('${modalId}').remove(); document.querySelector('#${modalId}-backdrop').remove();">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const backdrop = document.createElement('div');
        backdrop.id = modalId + '-backdrop';
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
    }
    
    convertHondenToCSV(honden) {
        if (!honden || honden.length === 0) return '';
        
        const allHeaders = new Set(['id']);
        honden.forEach(hond => {
            Object.keys(hond).forEach(key => {
                if (typeof hond[key] !== 'object' && hond[key] !== null) {
                    allHeaders.add(key);
                }
            });
        });
        
        const headers = Array.from(allHeaders).sort();
        
        let csv = headers.join(';') + '\n';
        
        honden.forEach(hond => {
            const row = headers.map(header => {
                const value = hond[header];
                if (value === null || value === undefined || value === '') {
                    return '';
                }
                if (typeof value === 'string' && value.includes(';')) {
                    return `"${value}"`;
                }
                return String(value);
            });
            csv += row.join(';') + '\n';
        });
        
        return csv;
    }
    
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        if (lines.length < 2) return { honden: [] };
        
        const headers = lines[0].split(';').map(h => h.trim());
        const honden = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ';' && !inQuotes) {
                    values.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current);
            
            const hond = {};
            headers.forEach((header, index) => {
                if (values[index] !== undefined) {
                    let value = values[index];
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    hond[header] = value || null;
                }
            });
            
            if (hond.id || hond.stamboomnr || hond.naam) {
                honden.push(hond);
            }
        }
        
        return { honden };
    }
    
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
    
    async loadDatabaseStats() {
        try {
            if (!this.isDatabaseAvailable()) {
                console.warn('DataManager: Database niet beschikbaar voor statistieken');
                return;
            }
            
            if (typeof window.hondenService.getStatistieken !== 'function') {
                console.error('getStatistieken functie niet beschikbaar');
                return;
            }
            
            const stats = await window.hondenService.getStatistieken();
            
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = stats.totaalHonden || 0;
            if (fotosElement) fotosElement.textContent = stats.totaalFotos || 0;
            if (priveElement) priveElement.textContent = stats.totaalPriveInfo || 0;
            
        } catch (error) {
            console.error(`${this.t('statsError')}${error}`);
            
            // Fallback: toon 0's
            const hondenElement = document.getElementById('statsHonden');
            const fotosElement = document.getElementById('statsFotos');
            const priveElement = document.getElementById('statsPrive');
            
            if (hondenElement) hondenElement.textContent = '0';
            if (fotosElement) fotosElement.textContent = '0';
            if (priveElement) priveElement.textContent = '0';
        }
    }
}