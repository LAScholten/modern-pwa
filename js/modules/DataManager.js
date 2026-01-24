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
                                <strong>Supabase Backup</strong><br>
                                Exporteert: Honden, Foto's, Privé info
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
            // 1. Exporteer ALLE honden
            const honden = await this.getAllHondenWithPagination();
            
            // 2. Exporteer foto's (als de tabel bestaat) MET JUISTE KOLOMMEN
            let fotos = [];
            try {
                fotos = await this.getAllFotosWithPagination();
            } catch (fotoError) {
                console.log('Geen foto\'s om te exporteren:', fotoError.message);
            }
            
            // 3. Exporteer privé info (als de tabel bestaat) MET JUISTE KOLOMMEN
            let priveInfo = [];
            try {
                priveInfo = await this.getAllPriveInfoWithPagination();
            } catch (priveError) {
                console.log('Geen privé info om te exporteren:', priveError.message);
            }
            
            // 4. Maak complete backup
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    hondenCount: honden.length,
                    fotosCount: fotos.length,
                    priveInfoCount: priveInfo.length,
                    system: 'Supabase complete backup'
                },
                honden: honden,
                fotos: fotos,
                priveInfo: priveInfo
            };
            
            // 5. Download
            this.downloadBackup(backup);
            
            this.hideProgress();
            this.showSuccess(`Backup gemaakt!<br>
                - ${honden.length} honden<br>
                - ${fotos.length} foto's<br>
                - ${priveInfo.length} privé records`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Export error:', error);
            this.showError(`Export mislukt: ${error.message}`);
        }
    }
    
    async getAllHondenWithPagination() {
        return this.getTableWithPagination('honden', 'id');
    }
    
    async getAllFotosWithPagination() {
        return this.getTableWithPagination('fotos', 'id');
    }
    
    async getAllPriveInfoWithPagination() {
        return this.getTableWithPagination('prive_info', 'id');
    }
    
    async getTableWithPagination(tableName, orderBy) {
        const allData = [];
        const pageSize = 1000;
        let currentPage = 0;
        let hasMore = true;
        
        console.log(`Start paginated export for ${tableName}...`);
        
        while (hasMore) {
            const from = currentPage * pageSize;
            const to = from + pageSize - 1;
            
            const { data: rows, error } = await this.supabase
                .from(tableName)
                .select('*')
                .order(orderBy)
                .range(from, to);
                
            if (error) {
                // Tabel bestaat misschien niet
                if (error.code === 'PGRST116') {
                    console.log(`Tabel ${tableName} bestaat niet, skip export`);
                    return [];
                }
                throw error;
            }
            
            allData.push(...rows);
            
            // Check of er meer zijn
            if (rows.length < pageSize) {
                hasMore = false;
            } else {
                currentPage++;
            }
            
            // Update progress
            this.updateProgressMessage(`Exporting ${tableName}... ${allData.length} records`);
        }
        
        console.log(`Export ${tableName} complete: ${allData.length} records`);
        return allData;
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
            
            // Importeer alles
            const result = await this.importCompleteBackup(backup);
            
            this.hideProgress();
            
            const message = `
                Import voltooid!<br>
                <strong>Honden:</strong><br>
                - ${result.honden.added} toegevoegd<br>
                - ${result.honden.updated} bijgewerkt<br>
                - ${result.honden.relaties} relaties<br>
                - ${result.honden.errors} fouten<br><br>
                <strong>Foto's:</strong><br>
                - ${result.fotos.added} toegevoegd<br>
                - ${result.fotos.errors} fouten<br><br>
                <strong>Privé info:</strong><br>
                - ${result.priveInfo.updated} bijgewerkt<br>
                - ${result.priveInfo.errors} fouten
            `;
            
            this.showSuccess(message);
            
        } catch (error) {
            this.hideProgress();
            console.error('Import error:', error);
            this.showError(`Import mislukt: ${error.message}`);
        }
    }
    
    async importCompleteBackup(backup) {
        console.log('DEBUG: Start import, aantal honden:', backup.honden?.length);
        
        const result = {
            honden: { added: 0, updated: 0, errors: 0, relaties: 0 },
            fotos: { added: 0, errors: 0 },
            priveInfo: { updated: 0, errors: 0 }
        };
        
        const stamboomnrMap = new Map();
        const batchSize = 100;
        
        // Helper functie voor veilige stamboomnr matching
        const findHondByStamboomnr = async (stamboomnr) => {
            try {
                const cleanStamboomnr = String(stamboomnr).trim();
                
                // Probeer met ILIKE (case-insensitive, beter voor speciale chars)
                const { data, error } = await this.supabase
                    .from('honden')
                    .select('id')
                    .ilike('stamboomnr', cleanStamboomnr)
                    .limit(1);
                
                if (error) {
                    console.warn('ILike query failed, trying direct query:', error);
                    
                    // Fallback: Gebruik directe query
                    const { data: directData, error: directError } = await this.supabase
                        .from('honden')
                        .select('id')
                        .limit(1)
                        .then(response => {
                            // Filter lokaal als Supabase het niet doet
                            if (response.data) {
                                const found = response.data.find(h => 
                                    String(h.stamboomnr).trim() === cleanStamboomnr
                                );
                                return { data: found ? [found] : [], error: null };
                            }
                            return response;
                        });
                    
                    if (directData && directData.length > 0) {
                        return { data: directData[0], error: null };
                    }
                    
                    return { data: null, error: directError };
                }
                
                return data && data.length > 0 ? { data: data[0], error: null } : { data: null, error: null };
                
            } catch (error) {
                console.error('Error in findHondByStamboomnr:', error);
                return { data: null, error };
            }
        };
        
        // 1. Importeer HONDEN
        if (backup.honden && backup.honden.length > 0) {
            console.log(`Importing ${backup.honden.length} honden...`);
            
            const totalBatches = Math.ceil(backup.honden.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, backup.honden.length);
                const batch = backup.honden.slice(start, end);
                
                this.updateProgressMessage(`Importing honden... batch ${batchIndex + 1}/${totalBatches}`);
                
                for (const hond of batch) {
                    try {
                        const cleanStamboomnr = String(hond.stamboomnr).trim();
                        console.log('DEBUG: Processing stamboomnr:', cleanStamboomnr);
                        
                        // Gebruik de veilige helper functie
                        const { data: existing, error: findError } = await findHondByStamboomnr(cleanStamboomnr);
                        
                        if (findError) {
                            console.warn('Find error, skipping hond:', cleanStamboomnr, findError);
                            result.honden.errors++;
                            continue;
                        }
                        
                        // Bereid import data voor
                        const importData = { ...hond };
                        delete importData.id;
                        delete importData.vader_id;
                        delete importData.moeder_id;
                        delete importData.created_at;
                        delete importData.updated_at;
                        
                        // Zorg dat stamboomnr schoon is
                        importData.stamboomnr = cleanStamboomnr;
                        
                        if (existing) {
                            // Update bestaande hond
                            const { error } = await this.supabase
                                .from('honden')
                                .update(importData)
                                .eq('id', existing.id);
                            
                            if (error) {
                                console.error('Update error:', error);
                                throw error;
                            }
                            
                            stamboomnrMap.set(cleanStamboomnr, existing.id);
                            result.honden.updated++;
                        } else {
                            // Nieuwe hond toevoegen
                            const { data: newHond, error } = await this.supabase
                                .from('honden')
                                .insert([importData])
                                .select('id')
                                .single();
                            
                            if (error) {
                                console.error('Insert error:', error);
                                throw error;
                            }
                            
                            stamboomnrMap.set(cleanStamboomnr, newHond.id);
                            result.honden.added++;
                        }
                        
                    } catch (error) {
                        console.error(`Fout bij hond ${hond.stamboomnr}:`, error);
                        result.honden.errors++;
                    }
                }
            }
            
            // 2. Herstel HONDEN relaties
            this.updateProgressMessage('Relaties herstellen tussen honden...');
            
            const relationBatches = Math.ceil(backup.honden.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < relationBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, backup.honden.length);
                const batch = backup.honden.slice(start, end);
                
                for (const hond of batch) {
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
                }
            }
        }
        
        // 3. Importeer FOTO'S - MET JUISTE KOLOMNAMEN
        if (backup.fotos && backup.fotos.length > 0) {
            console.log(`Importing ${backup.fotos.length} foto's...`);
            this.updateProgressMessage('Foto\'s importeren...');
            
            const totalBatches = Math.ceil(backup.fotos.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, backup.fotos.length);
                const batch = backup.fotos.slice(start, end);
                
                this.updateProgressMessage(`Importing foto's... batch ${batchIndex + 1}/${totalBatches}`);
                
                for (const foto of batch) {
                    try {
                        const cleanStamboomnr = String(foto.stamboomnr).trim();
                        
                        // Controleer of foto al bestaat met veilige matching
                        let existing = null;
                        try {
                            const { data, error } = await this.supabase
                                .from('fotos')
                                .select('id')
                                .ilike('stamboomnr', cleanStamboomnr)
                                .eq('filename', foto.filename)
                                .limit(1);
                            
                            if (!error && data && data.length > 0) {
                                existing = data[0];
                            }
                        } catch (err) {
                            existing = null;
                        }
                        
                        // Bereid import data voor met JUISTE KOLOMNAMEN
                        const importData = {
                            stamboomnr: cleanStamboomnr,
                            data: foto.data || null,
                            thumbnail: foto.thumbnail || null,
                            filename: foto.filename || null,
                            size: foto.size || null,
                            type: foto.type || null,
                            upload_at: foto.upload_at || null,
                            geupload_door: foto.geupload_door || null,
                            hond_id: foto.hond_id || null
                        };
                        
                        // Verwijder mogelijk onnodige velden
                        delete importData.id;
                        delete importData.created_at;
                        
                        if (!existing) {
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
        }
        
        // 4. Importeer PRIVÉ INFO - MET JUISTE KOLOMNAMEN
        if (backup.priveInfo && backup.priveInfo.length > 0) {
            console.log(`Importing ${backup.priveInfo.length} privé records...`);
            this.updateProgressMessage('Privé info importeren...');
            
            const totalBatches = Math.ceil(backup.priveInfo.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, backup.priveInfo.length);
                const batch = backup.priveInfo.slice(start, end);
                
                this.updateProgressMessage(`Importing privé info... batch ${batchIndex + 1}/${totalBatches}`);
                
                for (const prive of batch) {
                    try {
                        const cleanStamboomnr = String(prive.stamboomnr).trim();
                        
                        // Bereid import data voor met JUISTE KOLOMNAMEN
                        const importData = {
                            stamboomnr: cleanStamboomnr,
                            privatenotes: prive.privatenotes || null,
                            vertrouwelijk: prive.vertrouwelijk || false,
                            laatstgewijzigd: prive.laatstgewijzigd || null,
                            toegevoegd_door: prive.toegevoegd_door || null
                        };
                        
                        // Verwijder mogelijk onnodige velden
                        delete importData.id;
                        delete importData.created_at;
                        
                        // Update of insert privé info
                        const { error } = await this.supabase
                            .from('prive_info')
                            .upsert([importData], {
                                onConflict: 'stamboomnr'
                            });
                        
                        if (!error) result.priveInfo.updated++;
                        
                    } catch (error) {
                        console.error(`Fout bij privé info ${prive.stamboomnr}:`, error);
                        result.priveInfo.errors++;
                    }
                }
            }
        }
        
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