/**
 * Data Management Module voor HondenDatabase - Supabase versie
 * Exporteert en importeert: Honden, Foto's, Privé info
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
                                <strong>Supabase Complete Backup</strong><br>
                                Exporteert en importeert:<br>
                                • Honden (via stamboomnr)<br>
                                • Foto's (gekoppeld aan stamboomnr)<br>
                                • Privé info (gekoppeld aan stamboomnr)
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100">
                                        <div class="card-header bg-primary text-white">
                                            <h6><i class="bi bi-download"></i> ${t('dataExport')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p>${t('exportDescription')}</p>
                                            <div id="exportStatus" class="alert alert-info mb-3" style="display: none;">
                                                <i class="bi bi-hourglass-split"></i> <span id="exportText">Bezig...</span>
                                            </div>
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
                                            <div id="importStatus" class="alert alert-info mb-3" style="display: none;">
                                                <i class="bi bi-hourglass-split"></i> <span id="importText">Bezig...</span>
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
        
        // Toon status
        document.getElementById('exportStatus').style.display = 'block';
        this.showExportText('Bezig met exporteren...');
        
        try {
            // Honden
            this.showExportText('Honden exporteren...');
            const honden = await this.supabase
                .from('honden')
                .select('*')
                .order('id');
            
            // Foto's
            this.showExportText('Foto\'s exporteren...');
            let fotos = { data: [] };
            try {
                fotos = await this.supabase
                    .from('fotos')
                    .select('*')
                    .order('id');
            } catch (fotoError) {
                console.log('Geen foto\'s om te exporteren:', fotoError.message);
            }
            
            // Privé info
            this.showExportText('Privé info exporteren...');
            let priveinfo = { data: [] };
            try {
                priveinfo = await this.supabase
                    .from('priveinfo')
                    .select('*')
                    .order('id');
            } catch (priveError) {
                console.log('Geen privé info om te exporteren:', priveError.message);
            }
            
            // Backup maken
            this.showExportText('Backup bestand maken...');
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    hondenCount: honden.data?.length || 0,
                    fotosCount: fotos.data?.length || 0,
                    priveinfoCount: priveinfo.data?.length || 0,
                    system: 'Supabase complete backup'
                },
                honden: honden.data || [],
                fotos: fotos.data || [],
                priveinfo: priveinfo.data || []
            };
            
            // Download
            this.showExportText('Download voorbereiden...');
            this.downloadBackup(backup);
            
            // KLAAR!
            this.showExportText('Klaar! Download gestart.');
            
            // Na 2 seconden verbergen
            setTimeout(() => {
                document.getElementById('exportStatus').style.display = 'none';
            }, 2000);
            
            this.showSuccess(`<strong>Backup gemaakt!</strong><br>
                • ${backup.honden.length} honden<br>
                • ${backup.fotos.length} foto's<br>
                • ${backup.priveinfo.length} privé records`);
            
        } catch (error) {
            document.getElementById('exportStatus').style.display = 'none';
            console.error('Export error:', error);
            this.showError(`Export mislukt: ${error.message}`);
        }
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
            // Toon status
            document.getElementById('importStatus').style.display = 'block';
            this.showImportText('Backup bestand lezen...');
            
            // Lees file
            const text = await this.readFile(file);
            const backup = JSON.parse(text);
            
            if (!backup.honden || !Array.isArray(backup.honden)) {
                throw new Error('Ongeldig backup bestand');
            }
            
            // Importeer alles
            this.showImportText('Honden importeren...');
            const result = await this.importCompleteBackup(backup);
            
            // KLAAR!
            this.showImportText('Klaar! Import voltooid.');
            
            // Na 2 seconden verbergen
            setTimeout(() => {
                document.getElementById('importStatus').style.display = 'none';
            }, 2000);
            
            const message = `
                <strong>Import voltooid!</strong><br><br>
                <strong>Honden:</strong><br>
                • ${result.honden.added} toegevoegd<br>
                • ${result.honden.updated} bijgewerkt<br>
                • ${result.honden.relaties} relaties hersteld<br>
                • ${result.honden.errors} fouten<br><br>
                <strong>Foto's:</strong><br>
                • ${result.fotos.added} toegevoegd<br>
                • ${result.fotos.errors} fouten<br><br>
                <strong>Privé info:</strong><br>
                • ${result.priveinfo.updated} bijgewerkt<br>
                • ${result.priveinfo.errors} fouten
            `;
            
            this.showSuccess(message);
            
        } catch (error) {
            document.getElementById('importStatus').style.display = 'none';
            console.error('Import error:', error);
            this.showError(`Import mislukt: ${error.message}`);
        }
    }
    
    async importCompleteBackup(backup) {
        const result = {
            honden: { added: 0, updated: 0, errors: 0, relaties: 0 },
            fotos: { added: 0, errors: 0 },
            priveinfo: { updated: 0, errors: 0 }
        };
        
        const stamboomnrMap = new Map();
        
        // 1. Importeer HONDEN
        if (backup.honden && backup.honden.length > 0) {
            for (let i = 0; i < backup.honden.length; i++) {
                const hond = backup.honden[i];
                
                try {
                    const cleanStamboomnr = String(hond.stamboomnr).trim();
                    
                    // Haal alle honden op
                    const { data: allHonden, error: fetchError } = await this.supabase
                        .from('honden')
                        .select('id, stamboomnr');
                    
                    if (fetchError) throw fetchError;
                    
                    // Zoek bestaande hond
                    const existing = allHonden.find(h => 
                        String(h.stamboomnr).trim() === cleanStamboomnr
                    );
                    
                    // Bereid import data voor
                    const importData = { ...hond };
                    delete importData.id;
                    delete importData.vader_id;
                    delete importData.moeder_id;
                    delete importData.created_at;
                    delete importData.updated_at;
                    
                    importData.stamboomnr = cleanStamboomnr;
                    
                    if (existing) {
                        // Update
                        const { error } = await this.supabase
                            .from('honden')
                            .update(importData)
                            .eq('id', existing.id);
                        
                        if (error) throw error;
                        stamboomnrMap.set(cleanStamboomnr, existing.id);
                        result.honden.updated++;
                    } else {
                        // Nieuwe
                        const { data: newHond, error } = await this.supabase
                            .from('honden')
                            .insert([importData])
                            .select('id')
                            .single();
                        
                        if (error) throw error;
                        stamboomnrMap.set(cleanStamboomnr, newHond.id);
                        result.honden.added++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij hond ${hond.stamboomnr}:`, error);
                    result.honden.errors++;
                }
            }
            
            // 2. Herstel relaties
            this.showImportText('Relaties herstellen...');
            
            for (const hond of backup.honden) {
                try {
                    const cleanStamboomnr = String(hond.stamboomnr).trim();
                    const hondId = stamboomnrMap.get(cleanStamboomnr);
                    if (!hondId) continue;
                    
                    const vaderId = hond.vader_stamboomnr ? stamboomnrMap.get(String(hond.vader_stamboomnr).trim()) : null;
                    const moederId = hond.moeder_stamboomnr ? stamboomnrMap.get(String(hond.moeder_stamboomnr).trim()) : null;
                    
                    if (vaderId !== null || moederId !== null) {
                        await this.supabase
                            .from('honden')
                            .update({
                                vader_id: vaderId,
                                moeder_id: moederId
                            })
                            .eq('id', hondId);
                        
                        result.honden.relaties++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij relaties ${hond.stamboomnr}:`, error);
                }
            }
        }
        
        // 3. Importeer FOTO'S
        if (backup.fotos && backup.fotos.length > 0) {
            this.showImportText('Foto\'s importeren...');
            
            for (const foto of backup.fotos) {
                try {
                    const cleanStamboomnr = String(foto.stamboomnr).trim();
                    
                    // Controleer of foto al bestaat
                    const { data: existingFotos, error: fetchError } = await this.supabase
                        .from('fotos')
                        .select('id, filename')
                        .eq('stamboomnr', cleanStamboomnr);
                    
                    if (fetchError) {
                        console.warn('Error fetching fotos:', fetchError);
                    }
                    
                    const exists = existingFotos?.some(f => f.filename === foto.filename) || false;
                    
                    if (!exists) {
                        const importData = { ...foto };
                        delete importData.id;
                        delete importData.created_at;
                        importData.stamboomnr = cleanStamboomnr;
                        
                        const { error } = await this.supabase
                            .from('fotos')
                            .insert([importData]);
                        
                        if (!error) result.fotos.added++;
                    }
                    
                } catch (error) {
                    console.error(`Fout bij foto ${foto.filename}:`, error);
                    result.fotos.errors++;
                }
            }
        }
        
        // 4. Importeer PRIVÉ INFO
        if (backup.priveinfo && backup.priveinfo.length > 0) {
            this.showImportText('Privé info importeren...');
            
            for (const prive of backup.priveinfo) {
                try {
                    const cleanStamboomnr = String(prive.stamboomnr).trim();
                    
                    const importData = { ...prive };
                    delete importData.id;
                    delete importData.created_at;
                    importData.stamboomnr = cleanStamboomnr;
                    
                    const { error } = await this.supabase
                        .from('priveinfo')
                        .upsert([importData], {
                            onConflict: 'stamboomnr'
                        });
                    
                    if (!error) result.priveinfo.updated++;
                    
                } catch (error) {
                    console.error(`Fout bij privé info ${prive.stamboomnr}:`, error);
                    result.priveinfo.errors++;
                }
            }
        }
        
        return result;
    }
    
    downloadBackup(backup) {
        const date = new Date();
        const filename = `honden_complete_backup_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}_${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}.json`;
        
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
    
    showExportText(message) {
        const statusText = document.getElementById('exportText');
        if (statusText) {
            statusText.textContent = message;
        }
    }
    
    showImportText(message) {
        const statusText = document.getElementById('importText');
        if (statusText) {
            statusText.textContent = message;
        }
    }
    
    showSuccess(message) {
        alert('Success: ' + message);
    }
    
    showError(message) {
        alert('Error: ' + message);
    }
}