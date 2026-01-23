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
                            
                            <div class="mt-3">
                                <button class="btn btn-info w-100" id="debugDatabaseBtn">
                                    <i class="bi bi-bug"></i> Debug Database Structuur
                                </button>
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
        
        document.getElementById('debugDatabaseBtn')?.addEventListener('click', () => {
            this.debugDatabaseStructure();
        });
    }
    
    // NIEUWE FUNCTIE: Debug database structuur
    async debugDatabaseStructure() {
        console.log('=== DATABASE STRUCTUUR DEBUG ===');
        
        if (!this.supabase) {
            console.error('Supabase niet beschikbaar');
            return;
        }
        
        try {
            // 1. Controleer Honden tabel
            console.log('1. Honden tabel:');
            try {
                const { data, error } = await this.supabase
                    .from('honden')
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    console.log('   Fout:', error.message);
                } else if (data && data.length > 0) {
                    console.log('   Kolommen:', Object.keys(data[0]));
                    console.log('   Voorbeeld:', {
                        id: data[0].id,
                        stamboomnr: data[0].stamboomnr,
                        naam: data[0].naam,
                        vader_id: data[0].vader_id,
                        moeder_id: data[0].moeder_id
                    });
                } else {
                    console.log('   Tabel is leeg');
                }
            } catch (err) {
                console.log('   Exception:', err.message);
            }
            
            // 2. Controleer Foto's tabel
            console.log('2. Foto\'s tabel:');
            try {
                const { data, error } = await this.supabase
                    .from('fotos')
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    console.log('   Fout:', error.message);
                } else if (data && data.length > 0) {
                    console.log('   Kolommen:', Object.keys(data[0]));
                    console.log('   Voorbeeld:', {
                        id: data[0].id,
                        stamboomnr: data[0].stamboomnr,
                        filename: data[0].filename,
                        size: data[0].size,
                        type: data[0].type,
                        hasData: !!data[0].data,
                        hasThumbnail: !!data[0].thumbnail,
                        uploaded_at: data[0].uploaded_at
                    });
                } else {
                    console.log('   Tabel is leeg');
                }
            } catch (err) {
                console.log('   Exception:', err.message);
            }
            
            // 3. Controleer Priveinfo tabel (probeer beide namen)
            console.log('3. Priveinfo tabellen:');
            const priveTables = ['priveinfo', 'prive_info', 'private_info', 'prive'];
            
            for (const tableName of priveTables) {
                console.log(`   Test tabel: ${tableName}`);
                try {
                    const { data, error } = await this.supabase
                        .from(tableName)
                        .select('*')
                        .limit(1);
                        
                    if (error) {
                        console.log(`     Fout: ${error.message}`);
                    } else if (data && data.length > 0) {
                        console.log(`     GEVONDEN! Kolommen:`, Object.keys(data[0]));
                        console.log(`     Voorbeeld:`, data[0]);
                        break;
                    } else {
                        console.log(`     Tabel bestaat maar is leeg`);
                        break;
                    }
                } catch (err) {
                    console.log(`     Exception: ${err.message}`);
                }
            }
            
            console.log('=== EINDE DEBUG ===');
            
            // Toon resultaat in alert
            this.showInfo('Database debug voltooid. Bekijk console voor details.');
            
        } catch (error) {
            console.error('Debug error:', error);
            this.showError(`Debug mislukt: ${error.message}`);
        }
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
            
            // 2. Exporteer foto's (als de tabel bestaat)
            let fotos = [];
            try {
                fotos = await this.getAllFotosWithPagination();
                if (fotos.length > 0) {
                    console.log('EXPORT DEBUG: Eerste foto:', {
                        kolommen: Object.keys(fotos[0]),
                        data: {
                            filename: fotos[0].filename,
                            size: fotos[0].size,
                            type: fotos[0].type,
                            uploaded_at: fotos[0].uploaded_at,
                            hasData: !!fotos[0].data,
                            hasThumbnail: !!fotos[0].thumbnail
                        }
                    });
                }
            } catch (fotoError) {
                console.log('Geen foto\'s om te exporteren:', fotoError.message);
            }
            
            // 3. Exporteer priveinfo (als de tabel bestaat)
            let priveinfo = [];
            // Probeer eerst de meest waarschijnlijke tabelnamen
            const priveTables = ['priveinfo', 'prive_info'];
            for (const tableName of priveTables) {
                try {
                    priveinfo = await this.getTableWithPagination(tableName, 'id');
                    if (priveinfo.length > 0) {
                        console.log(`EXPORT DEBUG: Priveinfo tabel gevonden: ${tableName}`);
                        console.log('EXPORT DEBUG: Eerste priveinfo:', {
                            kolommen: Object.keys(priveinfo[0]),
                            data: priveinfo[0]
                        });
                        break;
                    }
                } catch (error) {
                    // Ga door naar volgende tabel
                }
            }
            
            // 4. Maak complete backup
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
            
            // 5. Download
            this.downloadBackup(backup);
            
            this.hideProgress();
            this.showSuccess(`Backup gemaakt!<br>
                - ${honden.length} honden<br>
                - ${fotos.length} foto's<br>
                - ${priveinfo.length} priveinfo records`);
            
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
    
    async getAllPriveinfoWithPagination() {
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
                if (error.code === 'PGRST116' || error.code === '404') {
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
            
            // DEBUG: Toon backup structuur
            console.log('=== IMPORT DEBUG ===');
            console.log('Backup info:', {
                honden: backup.honden?.length,
                fotos: backup.fotos?.length,
                priveinfo: backup.priveinfo?.length
            });
            
            if (backup.fotos && backup.fotos.length > 0) {
                const firstFoto = backup.fotos[0];
                console.log('Eerste foto uit backup:', {
                    kolommen: Object.keys(firstFoto),
                    voorbeeld: {
                        filename: firstFoto.filename,
                        stamboomnr: firstFoto.stamboomnr,
                        size: firstFoto.size,
                        type: firstFoto.type
                    }
                });
            }
            
            if (backup.priveinfo && backup.priveinfo.length > 0) {
                const firstPrive = backup.priveinfo[0];
                console.log('Eerste priveinfo uit backup:', {
                    kolommen: Object.keys(firstPrive),
                    voorbeeld: firstPrive
                });
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
                <strong>Priveinfo:</strong><br>
                - ${result.priveinfo.added} toegevoegd<br>
                - ${result.priveinfo.updated} bijgewerkt<br>
                - ${result.priveinfo.errors} fouten
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
            priveinfo: { added: 0, updated: 0, errors: 0 }
        };
        
        const stamboomnrMap = new Map();
        const batchSize = 100;
        
        // SIMPELE import: alleen honden voor nu
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
                        
                        // Bereid import data voor
                        const importData = { ...hond };
                        delete importData.id;
                        delete importData.vader_id;
                        delete importData.moeder_id;
                        delete importData.created_at;
                        delete importData.updated_at;
                        
                        // Zorg dat stamboomnr schoon is
                        importData.stamboomnr = cleanStamboomnr;
                        
                        // Nieuwe hond toevoegen
                        const { data: newHond, error } = await this.supabase
                            .from('honden')
                            .insert([importData])
                            .select('id')
                            .single();
                        
                        if (error) {
                            console.error('Insert error:', error);
                            result.honden.errors++;
                            continue;
                        }
                        
                        stamboomnrMap.set(cleanStamboomnr, newHond.id);
                        result.honden.added++;
                        
                    } catch (error) {
                        console.error(`Fout bij hond ${hond.stamboomnr}:`, error);
                        result.honden.errors++;
                    }
                }
            }
        }
        
        // Foto's overslaan voor nu
        if (backup.fotos && backup.fotos.length > 0) {
            console.log(`Foto's overslaan voor nu: ${backup.fotos.length} foto's`);
            result.fotos.errors = backup.fotos.length;
        }
        
        // Priveinfo overslaan voor nu
        if (backup.priveinfo && backup.priveinfo.length > 0) {
            console.log(`Priveinfo overslaan voor nu: ${backup.priveinfo.length} records`);
            result.priveinfo.errors = backup.priveinfo.length;
        }
        
        console.log('Import finished (alleen honden):', result);
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
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Succes',
                html: message,
                confirmButtonText: 'OK'
            });
        } else {
            alert(message.replace(/<br\s*\/?>/gi, '\n'));
        }
    }
    
    showError(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Fout',
                text: message,
                confirmButtonText: 'OK'
            });
        } else {
            alert('Fout: ' + message);
        }
    }
    
    showInfo(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'info',
                title: 'Info',
                text: message,
                confirmButtonText: 'OK'
            });
        } else {
            alert('Info: ' + message);
        }
    }
}