/**
 * Supabase DataManager voor HondenDatabase
 * Werkt met vader_stamboomnr en moeder_stamboomnr kolommen
 */
class DataManager extends BaseModule {
    constructor() {
        super();
        this.supabase = window.supabase; // Supabase client
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.translations = { /* ... (zelfde translations blijven) ... */ };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dataManagementModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-database-gear"></i> ${t('dataManagement')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-info-circle"></i>
                                <strong>Supabase Backup</strong><br>
                                Exporteert naar JSON met stamboomnr relaties. Import herstelt automatisch.
                            </div>
                            
                            <div class="row">
                                <!-- Import Sectie -->
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-success">
                                        <div class="card-header bg-success text-white">
                                            <h5 class="mb-0"><i class="bi bi-upload"></i> ${t('dataImport')}</h5>
                                        </div>
                                        <div class="card-body">
                                            <p>${t('importDescription')}</p>
                                            
                                            <div class="mb-3">
                                                <label class="form-label">${t('selectJsonFile')}</label>
                                                <input class="form-control" type="file" id="importFile" accept=".json">
                                                <div class="form-text">${t('chooseExportedFile')}</div>
                                            </div>
                                            
                                            <button class="btn btn-success w-100" id="startImportBtn">
                                                <i class="bi bi-upload"></i> ${t('startImport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Export Sectie -->
                                <div class="col-lg-6 mb-4">
                                    <div class="card h-100 border-primary">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0"><i class="bi bi-download"></i> ${t('dataExport')}</h5>
                                        </div>
                                        <div class="card-body">
                                            <p>${t('exportDescription')}</p>
                                            
                                            <div class="mb-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="exportHonden" checked>
                                                    <label class="form-check-label">
                                                        <strong>${t('exportData')}</strong>
                                                    </label>
                                                    <div class="form-text">${t('exportDataDescription')}</div>
                                                </div>
                                            </div>
                                            
                                            <button class="btn btn-primary w-100" id="startExportBtn">
                                                <i class="bi bi-download"></i> ${t('startExport')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        // Import knop
        document.getElementById('startImportBtn')?.addEventListener('click', () => {
            this.handleImport();
        });
        
        // Export knop  
        document.getElementById('startExportBtn')?.addEventListener('click', () => {
            this.handleExport();
        });
        
        // Modal open event
        document.getElementById('dataManagementModal')?.addEventListener('shown.bs.modal', () => {
            console.log('DataManager ready for Supabase');
        });
    }
    
    async handleExport() {
        const t = this.t.bind(this);
        const fileInput = document.getElementById('importFile');
        
        this.showProgress(t('exportingData'));
        
        try {
            // 1. Export metadata
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    exportBy: window.auth?.getCurrentUser()?.username || 'unknown',
                    version: '2.0',
                    format: 'supabase_stamboomnr',
                    description: 'Export met stamboomnr relaties'
                },
                honden: []
            };
            
            // 2. Haal ALLE honden op MET relatie informatie
            const { data: honden, error } = await this.supabase
                .from('honden')
                .select('*')
                .order('naam');
                
            if (error) throw error;
            
            // 3. Bereid export voor
            exportData.honden = honden.map(hond => {
                // Exporteer ALLE velden, inclusief de nieuwe stamboomnr kolommen
                const exportHond = { ...hond };
                
                // Zorg dat we de stamboomnr relaties hebben
                // Deze staan al in vader_stamboomnr en moeder_stamboomnr kolommen!
                return exportHond;
            });
            
            // 4. Download als JSON
            const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
            const timeStr = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
            const filename = `honden_backup_${dateStr}_${timeStr}.json`;
            
            this.downloadJSON(exportData, filename);
            
            this.hideProgress();
            this.showSuccess(`${t('exportSuccess')}<br>${exportData.honden.length} honden geëxporteerd`);
            
        } catch (error) {
            this.hideProgress();
            this.showError(`${t('exportFailed')}${error.message}`);
        }
    }
    
    async handleImport() {
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
                
                // 1. Parse JSON
                const importData = JSON.parse(e.target.result);
                
                if (!importData.honden || !Array.isArray(importData.honden)) {
                    throw new Error('Ongeldig backup bestand');
                }
                
                // 2. Importeer in Supabase
                const result = await this.importToSupabase(importData.honden);
                
                this.hideProgress();
                this.showImportResults(result);
                
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
    
    async importToSupabase(hondenData) {
        const result = {
            added: 0,
            updated: 0,
            errors: 0,
            relatiesHersteld: 0
        };
        
        console.log(`Start import van ${hondenData.length} honden...`);
        
        // STAP 1: Importeer alle honden ZONDER relaties eerst
        const stamboomnrToIdMap = new Map();
        
        for (const hondData of hondenData) {
            try {
                // Check of hond al bestaat (op basis van stamboomnr)
                const { data: existing } = await this.supabase
                    .from('honden')
                    .select('id')
                    .eq('stamboomnr', hondData.stamboomnr)
                    .single();
                
                // Bereid import data voor (zonder ID en relatie velden)
                const importHond = { ...hondData };
                delete importHond.id; // Laat Supabase nieuwe ID genereren
                delete importHond.vader_id; // Deze vullen we later
                delete importHond.moeder_id; // Deze vullen we later
                
                if (existing) {
                    // Update bestaande hond
                    const { error } = await this.supabase
                        .from('honden')
                        .update(importHond)
                        .eq('id', existing.id);
                    
                    if (error) throw error;
                    stamboomnrToIdMap.set(hondData.stamboomnr, existing.id);
                    result.updated++;
                } else {
                    // Nieuwe hond toevoegen
                    const { data: newHond, error } = await this.supabase
                        .from('honden')
                        .insert([importHond])
                        .select('id')
                        .single();
                    
                    if (error) throw error;
                    stamboomnrToIdMap.set(hondData.stamboomnr, newHond.id);
                    result.added++;
                }
                
            } catch (error) {
                console.error(`Fout bij importeren hond ${hondData.stamboomnr}:`, error);
                result.errors++;
            }
        }
        
        console.log(`Fase 1 voltooid: ${result.added} toegevoegd, ${result.updated} bijgewerkt`);
        console.log('Mapping:', stamboomnrToIdMap);
        
        // STAP 2: Herstel relaties op basis van stamboomnr
        this.updateProgressMessage('Relaties herstellen...');
        
        for (const hondData of hondenData) {
            try {
                const hondId = stamboomnrToIdMap.get(hondData.stamboomnr);
                if (!hondId) continue;
                
                let vaderId = null;
                let moederId = null;
                
                // Zoek vader ID op basis van vader_stamboomnr
                if (hondData.vader_stamboomnr) {
                    vaderId = stamboomnrToIdMap.get(hondData.vader_stamboomnr);
                }
                
                // Zoek moeder ID op basis van moeder_stamboomnr  
                if (hondData.moeder_stamboomnr) {
                    moederId = stamboomnrToIdMap.get(hondData.moeder_stamboomnr);
                }
                
                // Update alleen als er relaties zijn
                if (vaderId !== null || moederId !== null) {
                    const updateData = {
                        vader_id: vaderId,
                        moeder_id: moederId
                    };
                    
                    const { error } = await this.supabase
                        .from('honden')
                        .update(updateData)
                        .eq('id', hondId);
                    
                    if (!error) {
                        result.relatiesHersteld++;
                    }
                }
                
            } catch (error) {
                console.error(`Fout bij herstellen relaties voor ${hondData.stamboomnr}:`, error);
            }
        }
        
        console.log(`Import voltooid: ${result.relatiesHersteld} relaties hersteld`);
        return result;
    }
    
    downloadJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
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
    
    showProgress(message) {
        // Eenvoudige progress indicator
        const progressHtml = `
            <div class="modal-backdrop fade show"></div>
            <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-body text-center">
                            <div class="spinner-border text-primary mb-3"></div>
                            <p>${message}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.id = 'backupProgress';
        div.innerHTML = progressHtml;
        document.body.appendChild(div);
    }
    
    hideProgress() {
        document.getElementById('backupProgress')?.remove();
    }
    
    updateProgressMessage(message) {
        const progress = document.getElementById('backupProgress');
        if (progress) {
            const messageEl = progress.querySelector('p');
            if (messageEl) messageEl.textContent = message;
        }
    }
    
    showSuccess(message) {
        alert('Success: ' + message); // Vereenvoudigd
    }
    
    showError(message) {
        alert('Error: ' + message); // Vereenvoudigd
    }
    
    showImportResults(result) {
        const message = `
            Import voltooid!<br>
            - ${result.added} nieuwe honden toegevoegd<br>
            - ${result.updated} honden bijgewerkt<br>
            - ${result.relatiesHersteld} relaties hersteld<br>
            - ${result.errors} fouten
        `;
        this.showSuccess(message);
    }
}

// Initialize
window.supabaseDataManager = new SupabaseDataManager();