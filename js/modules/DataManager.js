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
                                            <div id="exportProgress" class="mb-3" style="display: none;">
                                                <div class="progress">
                                                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                                         role="progressbar" style="width: 0%"></div>
                                                </div>
                                                <small class="text-muted mt-1 d-block" id="exportStatus">0%</small>
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
                                            <div id="importProgress" class="mb-3" style="display: none;">
                                                <div class="progress">
                                                    <div class="progress-bar progress-bar-striped progress-bar-animated" 
                                                         role="progressbar" style="width: 0%"></div>
                                                </div>
                                                <small class="text-muted mt-1 d-block" id="importStatus">0%</small>
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
        
        // Reset progress
        this.showExportProgress(0, 'Start export...');
        document.getElementById('exportProgress').style.display = 'block';
        
        try {
            // Stap 1: Honden
            this.showExportProgress(25, 'Honden exporteren...');
            const honden = await this.getAllHonden();
            
            // Stap 2: Foto's
            this.showExportProgress(50, 'Foto\'s exporteren...');
            let fotos = [];
            try {
                fotos = await this.getAllFotos();
            } catch (fotoError) {
                console.log('Geen foto\'s om te exporteren:', fotoError.message);
            }
            
            // Stap 3: Privé info
            this.showExportProgress(75, 'Privé info exporteren...');
            let priveinfo = [];
            try {
                priveinfo = await this.getAllPriveinfo();
            } catch (priveError) {
                console.log('Geen privé info om te exporteren:', priveError.message);
            }
            
            // Stap 4: Backup maken
            this.showExportProgress(90, 'Backup bestand maken...');
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    hondenCount: honden.length,
                    fotosCount: fotos.length,
                    priveinfoCount: priveinfo.length,
                    system: 'Supabase complete backup'
                },
                honden: honden,
                fotos: fotos,
                priveinfo: priveinfo
            };
            
            // Stap 5: Download
            this.showExportProgress(95, 'Download voorbereiden...');
            this.downloadBackup(backup);
            
            // Voltooid
            this.showExportProgress(100, 'Export voltooid!');
            
            setTimeout(() => {
                document.getElementById('exportProgress').style.display = 'none';
                this.showExportProgress(0, '');
            }, 1000);
            
            this.showSuccess(`<strong>Backup gemaakt!</strong><br>
                • ${honden.length} honden<br>
                • ${fotos.length} foto's<br>
                • ${priveinfo.length} privé records`);
            
        } catch (error) {
            document.getElementById('exportProgress').style.display = 'none';
            console.error('Export error:', error);
            this.showError(`Export mislukt: ${error.message}`);
        }
    }
    
    async getAllHonden() {
        console.log('Start export honden...');
        const { data, error } = await this.supabase
            .from('honden')
            .select('*')
            .order('id');
            
        if (error) {
            console.error('Error exporting honden:', error);
            return [];
        }
        
        console.log(`Export honden complete: ${data?.length || 0} records`);
        return data || [];
    }
    
    async getAllFotos() {
        console.log('Start export fotos...');
        const { data, error } = await this.supabase
            .from('fotos')
            .select('*')
            .order('id');
            
        if (error) {
            // Tabel bestaat misschien niet
            if (error.code === 'PGRST116') {
                console.log('Tabel fotos bestaat niet, skip export');
                return [];
            }
            console.error('Error exporting fotos:', error);
            return [];
        }
        
        console.log(`Export fotos complete: ${data?.length || 0} records`);
        return data || [];
    }
    
    async getAllPriveinfo() {
        console.log('Start export priveinfo...');
        const { data, error } = await this.supabase
            .from('priveinfo')
            .select('*')
            .order('id');
            
        if (error) {
            // Tabel bestaat misschien niet
            if (error.code === 'PGRST116') {
                console.log('Tabel priveinfo bestaat niet, skip export');
                return [];
            }
            console.error('Error exporting priveinfo:', error);
            return [];
        }
        
        console.log(`Export priveinfo complete: ${data?.length || 0} records`);
        return data || [];
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
            // Reset progress
            this.showImportProgress(0, 'Backup bestand lezen...');
            document.getElementById('importProgress').style.display = 'block';
            
            // Lees file
            const text = await this.readFile(file);
            const backup = JSON.parse(text);
            
            if (!backup.honden || !Array.isArray(backup.honden)) {
                throw new Error('Ongeldig backup bestand');
            }
            
            // Importeer alles
            this.showImportProgress(10, 'Start import...');
            const result = await this.importCompleteBackup(backup);
            
            this.showImportProgress(100, 'Import voltooid!');
            
            setTimeout(() => {
                document.getElementById('importProgress').style.display = 'none';
                this.showImportProgress(0, '');
            }, 1000);
            
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
            document.getElementById('importProgress').style.display = 'none';
            this.showImportProgress(0, '');
            console.error('Import error:', error);
            this.showError(`Import mislukt: ${error.message}`);
        }
    }
    
    async importCompleteBackup(backup) {
        console.log('DEBUG: Start import, aantal honden:', backup.honden?.length);
        
        const result = {
            honden: { added: 0, updated: 0, errors: 0, relaties: 0 },
            fotos: { added: 0, errors: 0 },
            priveinfo: { updated: 0, errors: 0 }
        };
        
        const stamboomnrMap = new Map();
        
        // 1. Importeer HONDEN
        if (backup.honden && backup.honden.length > 0) {
            const totalHonden = backup.honden.length;
            
            for (let i = 0; i < backup.honden.length; i++) {
                const hond = backup.honden[i];
                const progress = 10 + (i / totalHonden * 40);
                this.showImportProgress(Math.round(progress), `Honden importeren... ${i+1}/${totalHonden}`);
                
                try {
                    const cleanStamboomnr = String(hond.stamboomnr).trim();
                    
                    // Haal eerst alle honden op en filter lokaal
                    const { data: allHonden, error: fetchError } = await this.supabase
                        .from('honden')
                        .select('id, stamboomnr');
                    
                    if (fetchError) {
                        console.error('Error fetching honden:', fetchError);
                        throw fetchError;
                    }
                    
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
                    
                    // Zorg dat stamboomnr altijd een string is
                    importData.stamboomnr = cleanStamboomnr;
                    
                    if (existing) {
                        // Update bestaande hond
                        const { error } = await this.supabase
                            .from('honden')
                            .update(importData)
                            .eq('id', existing.id);
                        
                        if (error) throw error;
                        stamboomnrMap.set(cleanStamboomnr, existing.id);
                        result.honden.updated++;
                    } else {
                        // Nieuwe hond toevoegen
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
            
            // 2. Herstel HONDEN relaties
            this.showImportProgress(50, 'Relaties herstellen tussen honden...');
            
            for (let i = 0; i < backup.honden.length; i++) {
                const hond = backup.honden[i];
                const progress = 50 + (i / backup.honden.length * 15);
                
                try {
                    const cleanStamboomnr = String(hond.stamboomnr).trim();
                    const hondId = stamboomnrMap.get(cleanStamboomnr);
                    if (!hondId) continue;
                    
                    // Zoek parent IDs via stamboomnr
                    const vaderId = hond.vader_stamboomnr ? stamboomnrMap.get(String(hond.vader_stamboomnr).trim()) : null;
                    const moederId = hond.moeder_stamboomnr ? stamboomnrMap.get(String(hond.moeder_stamboomnr).trim()) : null;
                    
                    // Update relaties
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
                
                if (i % 10 === 0) {
                    this.showImportProgress(Math.round(progress), `Relaties herstellen... ${i+1}/${backup.honden.length}`);
                }
            }
        }
        
        // 3. Importeer FOTO'S
        if (backup.fotos && backup.fotos.length > 0) {
            const totalFotos = backup.fotos.length;
            
            for (let i = 0; i < backup.fotos.length; i++) {
                const foto = backup.fotos[i];
                const progress = 65 + (i / totalFotos * 15);
                this.showImportProgress(Math.round(progress), `Foto's importeren... ${i+1}/${totalFotos}`);
                
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
                        // Bereid import data voor
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
            const totalPriveinfo = backup.priveinfo.length;
            
            for (let i = 0; i < backup.priveinfo.length; i++) {
                const prive = backup.priveinfo[i];
                const progress = 80 + (i / totalPriveinfo * 20);
                this.showImportProgress(Math.round(progress), `Privé info importeren... ${i+1}/${totalPriveinfo}`);
                
                try {
                    const cleanStamboomnr = String(prive.stamboomnr).trim();
                    
                    // Bereid import data voor
                    const importData = { ...prive };
                    delete importData.id;
                    delete importData.created_at;
                    importData.stamboomnr = cleanStamboomnr;
                    
                    // Update of insert privé info (upsert op stamboomnr)
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
        
        this.showImportProgress(100, 'Import voltooid!');
        console.log('Complete import finished:', result);
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
    
    showExportProgress(percentage, message) {
        const progressBar = document.querySelector('#exportProgress .progress-bar');
        const statusText = document.getElementById('exportStatus');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (statusText) {
            statusText.textContent = `${percentage}% - ${message}`;
        }
    }
    
    showImportProgress(percentage, message) {
        const progressBar = document.querySelector('#importProgress .progress-bar');
        const statusText = document.getElementById('importStatus');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        if (statusText) {
            statusText.textContent = `${percentage}% - ${message}`;
        }
    }
    
    showSuccess(message) {
        alert('Success: ' + message);
    }
    
    showError(message) {
        alert('Error: ' + message);
    }
}