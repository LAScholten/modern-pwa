/**
 * Data Management Module voor HondenDatabase - Supabase versie
 */
class DataManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.supabase = window.supabase;
        
        this.translations = {
            nl: {
                dataManagement: "Data Beheer",
                dataImport: "Data Importeren",
                importDescription: "Importeer backup bestand",
                dataExport: "Data Exporteren", 
                exportDescription: "Exporteer naar backup bestand",
                selectJsonFile: "Selecteer backup bestand",
                startImport: "Start Import",
                startExport: "Start Export",
                exportingData: "Data exporteren...",
                importingData: "Data importeren...",
                buildingRelations: "Relaties herstellen...",
                exportSuccess: "Export succesvol!",
                importSuccess: "Import succesvol!",
                error: "Fout",
                close: "Sluiten",
                selectFileFirst: "Selecteer eerst een bestand"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-database-gear"></i> ${t('dataManagement')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info mb-3">
                                <i class="bi bi-cloud-check"></i> 
                                <strong>Supabase Backup</strong><br>
                                Werkt met stamboomnr relaties
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-header bg-primary text-white">
                                            <h6><i class="bi bi-download"></i> ${t('dataExport')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p>${t('exportDescription')}</p>
                                            <button class="btn btn-primary w-100" id="startExportBtn">
                                                <i class="bi bi-download"></i> ${t('startExport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-header bg-success text-white">
                                            <h6><i class="bi bi-upload"></i> ${t('dataImport')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p>${t('importDescription')}</p>
                                            <div class="mb-3">
                                                <input type="file" class="form-control" id="importFile" accept=".json">
                                            </div>
                                            <button class="btn btn-success w-100" id="startImportBtn">
                                                <i class="bi bi-upload"></i> ${t('startImport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        document.getElementById('startExportBtn')?.addEventListener('click', () => {
            this.handleExport();
        });
        
        document.getElementById('startImportBtn')?.addEventListener('click', () => {
            this.handleImport();
        });
    }
    
    async handleExport() {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        this.showProgress(t('exportingData'));
        
        try {
            // Haal ALLE honden op met paginatie
            const allHonden = await this.getAllHondenWithPagination();
            
            // Maak backup
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    count: allHonden.length,
                    system: 'Supabase met stamboomnr relaties'
                },
                honden: allHonden
            };
            
            // Download
            this.downloadBackup(backup);
            
            this.hideProgress();
            this.showSuccess(`Backup gemaakt! ${allHonden.length} honden geëxporteerd.`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Export error:', error);
            this.showError(`Export mislukt: ${error.message}`);
        }
    }
    
    async getAllHondenWithPagination() {
        const allHonden = [];
        const pageSize = 1000;
        let currentPage = 0;
        let hasMore = true;
        
        console.log('Start paginated export...');
        
        while (hasMore) {
            const from = currentPage * pageSize;
            const to = from + pageSize - 1;
            
            console.log(`Exporting page ${currentPage + 1}: rows ${from}-${to}`);
            
            const { data: honden, error } = await this.supabase
                .from('honden')
                .select('*')
                .order('id')
                .range(from, to);
                
            if (error) {
                throw error;
            }
            
            allHonden.push(...honden);
            
            // Check of er meer zijn
            if (honden.length < pageSize) {
                hasMore = false;
            } else {
                currentPage++;
            }
            
            // Update progress
            this.updateProgressMessage(`Exporting... ${allHonden.length} honden loaded`);
        }
        
        console.log(`Export complete: ${allHonden.length} total honden`);
        return allHonden;
    }
    
    async handleImport() {
        const t = this.t.bind(this);
        const fileInput = document.getElementById('importFile');
        
        if (!fileInput || !fileInput.files.length) {
            this.showError(t('selectFileFirst'));
            return;
        }
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        const file = fileInput.files[0];
        
        try {
            this.showProgress(t('importingData'));
            
            // Lees file
            const text = await this.readFile(file);
            const backup = JSON.parse(text);
            
            if (!backup.honden || !Array.isArray(backup.honden)) {
                throw new Error('Ongeldig backup bestand');
            }
            
            // Importeer in batches
            const result = await this.importHondenInBatches(backup.honden);
            
            this.hideProgress();
            
            const message = `
                Import voltooid!<br>
                - ${result.added} nieuwe honden toegevoegd<br>
                - ${result.updated} honden bijgewerkt<br>
                - ${result.relaties} relaties hersteld<br>
                - ${result.errors} fouten
            `;
            
            this.showSuccess(message);
            
        } catch (error) {
            this.hideProgress();
            console.error('Import error:', error);
            this.showError(`Import mislukt: ${error.message}`);
        }
    }
    
    async importHondenInBatches(hondenData) {
        const result = { added: 0, updated: 0, errors: 0, relaties: 0 };
        const stamboomnrMap = new Map();
        
        console.log(`Importing ${hondenData.length} honden in batches...`);
        
        // Batch size voor import
        const batchSize = 100;
        const totalBatches = Math.ceil(hondenData.length / batchSize);
        
        // FASE 1: Importeer honden (zonder relaties) in batches
        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, hondenData.length);
            const batch = hondenData.slice(start, end);
            
            this.updateProgressMessage(`Importing honden... batch ${batchIndex + 1}/${totalBatches}`);
            
            for (const hond of batch) {
                try {
                    // Check of hond bestaat via stamboomnr
                    const { data: existing } = await this.supabase
                        .from('honden')
                        .select('id')
                        .eq('stamboomnr', hond.stamboomnr)
                        .single()
                        .catch(() => ({ data: null }));
                    
                    // Bereid import data voor
                    const importData = { ...hond };
                    delete importData.id;
                    delete importData.vader_id;
                    delete importData.moeder_id;
                    
                    if (existing) {
                        // Update bestaande hond
                        const { error } = await this.supabase
                            .from('honden')
                            .update(importData)
                            .eq('id', existing.id);
                        
                        if (error) throw error;
                        stamboomnrMap.set(hond.stamboomnr, existing.id);
                        result.updated++;
                    } else {
                        // Nieuwe hond toevoegen
                        const { data: newHond, error } = await this.supabase
                            .from('honden')
                            .insert([importData])
                            .select('id')
                            .single();
                        
                        if (error) throw error;
                        stamboomnrMap.set(hond.stamboomnr, newHond.id);
                        result.added++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij hond ${hond.stamboomnr}:`, error);
                    result.errors++;
                }
            }
        }
        
        console.log('Stamboomnr mapping created:', stamboomnrMap.size, 'entries');
        
        // FASE 2: Herstel relaties in batches
        this.updateProgressMessage('Relaties herstellen...');
        
        const relationBatches = Math.ceil(hondenData.length / batchSize);
        
        for (let batchIndex = 0; batchIndex < relationBatches; batchIndex++) {
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, hondenData.length);
            const batch = hondenData.slice(start, end);
            
            this.updateProgressMessage(`Restoring relations... batch ${batchIndex + 1}/${relationBatches}`);
            
            for (const hond of batch) {
                try {
                    const hondId = stamboomnrMap.get(hond.stamboomnr);
                    if (!hondId) continue;
                    
                    // Zoek parent IDs via stamboomnr
                    const vaderId = hond.vader_stamboomnr ? stamboomnrMap.get(hond.vader_stamboomnr) : null;
                    const moederId = hond.moeder_stamboomnr ? stamboomnrMap.get(hond.moeder_stamboomnr) : null;
                    
                    // Update relaties
                    if (vaderId !== null || moederId !== null) {
                        await this.supabase
                            .from('honden')
                            .update({
                                vader_id: vaderId,
                                moeder_id: moederId
                            })
                            .eq('id', hondId);
                        
                        result.relaties++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij relaties ${hond.stamboomnr}:`, error);
                }
            }
        }
        
        console.log('Import complete:', result);
        return result;
    }
    
    downloadBackup(backup) {
        const date = new Date();
        const filename = `honden_backup_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}_${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}.json`;
        
        const jsonStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Kan bestand niet lezen'));
            reader.readAsText(file);
        });
    }
    
    showProgress(message) {
        this.hideProgress();
        
        const html = `
        <div id="dataManagerProgress" class="modal-backdrop fade show" style="display: block;">
            <div class="modal fade show" style="display: block;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center">
                            <div class="spinner-border text-primary mb-3"></div>
                            <p>${message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }
    
    updateProgressMessage(message) {
        const progress = document.getElementById('dataManagerProgress');
        if (progress) {
            const p = progress.querySelector('p');
            if (p) p.textContent = message;
        }
    }
    
    hideProgress() {
        document.getElementById('dataManagerProgress')?.remove();
    }
    
    showSuccess(message) {
        alert('Success: ' + message);
    }
    
    showError(message) {
        alert('Error: ' + message);
    }
}