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
                hondenExport: "Honden Data Exporteren",
                hondenImport: "Honden Data Importeren",
                fotosExport: "Foto's Exporteren",
                fotosImport: "Foto's Importeren",
                priveinfoExport: "Privé Info Exporteren",
                priveinfoImport: "Privé Info Importeren",
                exportDescription: "Exporteer naar backup bestand",
                importDescription: "Importeer backup bestand",
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
                selectFileFirst: "Selecteer eerst een bestand",
                dataBackup: "Data Backup",
                fotosBackup: "Foto's Backup",
                priveinfoBackup: "Privé Info Backup"
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
                                Drie aparte backup types voor betrouwbaarheid
                            </div>
                            
                            <div class="row">
                                <!-- Data (Honden) Backup Card -->
                                <div class="col-md-4 mb-3">
                                    <div class="card h-100">
                                        <div class="card-header bg-primary text-white">
                                            <h6><i class="bi bi-database"></i> ${t('dataBackup')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="small mb-2"><strong>Alleen hondendata</strong></p>
                                            <p class="small mb-3">Excl. foto's en privé info</p>
                                            <div class="row g-2">
                                                <div class="col-6">
                                                    <button class="btn btn-primary btn-sm w-100" id="exportDataBtn">
                                                        <i class="bi bi-download"></i> ${t('hondenExport')}
                                                    </button>
                                                </div>
                                                <div class="col-6">
                                                    <input type="file" class="form-control form-control-sm mb-2 d-none" id="importDataFile" accept=".json">
                                                    <button class="btn btn-outline-primary btn-sm w-100" id="importDataBtn">
                                                        <i class="bi bi-upload"></i> ${t('hondenImport')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Foto's Backup Card -->
                                <div class="col-md-4 mb-3">
                                    <div class="card h-100">
                                        <div class="card-header bg-warning text-dark">
                                            <h6><i class="bi bi-image"></i> ${t('fotosBackup')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="small mb-2"><strong>Alleen foto's</strong></p>
                                            <p class="small mb-3">Foto metadata en thumbnails</p>
                                            <div class="row g-2">
                                                <div class="col-6">
                                                    <button class="btn btn-warning btn-sm w-100" id="exportFotosBtn">
                                                        <i class="bi bi-download"></i> ${t('fotosExport')}
                                                    </button>
                                                </div>
                                                <div class="col-6">
                                                    <input type="file" class="form-control form-control-sm mb-2 d-none" id="importFotosFile" accept=".json">
                                                    <button class="btn btn-outline-warning btn-sm w-100" id="importFotosBtn">
                                                        <i class="bi bi-upload"></i> ${t('fotosImport')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Privé Info Backup Card -->
                                <div class="col-md-4 mb-3">
                                    <div class="card h-100">
                                        <div class="card-header bg-danger text-white">
                                            <h6><i class="bi bi-shield-lock"></i> ${t('priveinfoBackup')}</h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="small mb-2"><strong>Alleen privé info</strong></p>
                                            <p class="small mb-3">Vertrouwelijke gegevens</p>
                                            <div class="row g-2">
                                                <div class="col-6">
                                                    <button class="btn btn-danger btn-sm w-100" id="exportPriveinfoBtn">
                                                        <i class="bi bi-download"></i> ${t('priveinfoExport')}
                                                    </button>
                                                </div>
                                                <div class="col-6">
                                                    <input type="file" class="form-control form-control-sm mb-2 d-none" id="importPriveinfoFile" accept=".json">
                                                    <button class="btn btn-outline-danger btn-sm w-100" id="importPriveinfoBtn">
                                                        <i class="bi bi-upload"></i> ${t('priveinfoImport')}
                                                    </button>
                                                </div>
                                            </div>
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
        // Data (Honden) buttons
        document.getElementById('exportDataBtn')?.addEventListener('click', () => {
            this.handleDataExport();
        });
        
        document.getElementById('importDataBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('importDataFile');
            if (fileInput.files.length) {
                this.handleDataImport(fileInput.files[0]);
            } else {
                fileInput.click();
                fileInput.onchange = () => {
                    if (fileInput.files.length) {
                        this.handleDataImport(fileInput.files[0]);
                    }
                };
            }
        });
        
        // Foto's buttons
        document.getElementById('exportFotosBtn')?.addEventListener('click', () => {
            this.handleFotosExport();
        });
        
        document.getElementById('importFotosBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('importFotosFile');
            if (fileInput.files.length) {
                this.handleFotosImport(fileInput.files[0]);
            } else {
                fileInput.click();
                fileInput.onchange = () => {
                    if (fileInput.files.length) {
                        this.handleFotosImport(fileInput.files[0]);
                    }
                };
            }
        });
        
        // Priveinfo buttons
        document.getElementById('exportPriveinfoBtn')?.addEventListener('click', () => {
            this.handlePriveinfoExport();
        });
        
        document.getElementById('importPriveinfoBtn')?.addEventListener('click', () => {
            const fileInput = document.getElementById('importPriveinfoFile');
            if (fileInput.files.length) {
                this.handlePriveinfoImport(fileInput.files[0]);
            } else {
                fileInput.click();
                fileInput.onchange = () => {
                    if (fileInput.files.length) {
                        this.handlePriveinfoImport(fileInput.files[0]);
                    }
                };
            }
        });
    }
    
    // =============================================
    // DATA (HONDEN) FUNCTIES
    // =============================================
    
    async handleDataExport() {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        this.showProgress(t('exportingData'));
        
        try {
            // Exporteer ALLE honden
            const honden = await this.getAllHondenWithPagination();
            
            // Maak DATA backup met DUDELLIJKE MARKERS
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    type: 'DATA_BACKUP',
                    hondenCount: honden.length,
                    system: 'Supabase DATA backup'
                },
                // ===== BEGIN DATA SECTION =====
                data_section: {
                    description: "HONDEN DATA - Alle hondengegevens",
                    honden: honden
                }
                // ===== END DATA SECTION =====
            };
            
            // Download
            this.downloadBackup(backup, 'honden_data_backup');
            
            this.hideProgress();
            this.showSuccess(`Data backup gemaakt!<br>
                - ${honden.length} honden`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Data export error:', error);
            this.showError(`Data export mislukt: ${error.message}`);
        }
    }
    
    async handleDataImport(file) {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        try {
            this.showProgress(t('importingData'));
            
            // Lees file
            const text = await this.readFile(file);
            const backup = JSON.parse(text);
            
            if (!backup.data_section || !backup.data_section.honden || !Array.isArray(backup.data_section.honden)) {
                throw new Error('Ongeldig DATA backup bestand');
            }
            
            const result = await this.importDataSection(backup.data_section.honden);
            
            this.hideProgress();
            
            const message = `
                Data import voltooid!<br>
                <strong>Honden:</strong><br>
                - ${result.added} toegevoegd<br>
                - ${result.updated} bijgewerkt<br>
                - ${result.relaties} relaties<br>
                - ${result.errors} fouten
            `;
            
            this.showSuccess(message);
            
        } catch (error) {
            this.hideProgress();
            console.error('Data import error:', error);
            this.showError(`Data import mislukt: ${error.message}`);
        }
    }
    
    async importDataSection(honden) {
        console.log('DEBUG: Start data import, aantal honden:', honden?.length);
        
        const result = { added: 0, updated: 0, errors: 0, relaties: 0 };
        const stamboomnrMap = new Map();
        const batchSize = 100;
        
        const findHondByStamboomnr = async (stamboomnr) => {
            try {
                const cleanStamboomnr = String(stamboomnr).trim();
                
                const { data, error } = await this.supabase
                    .from('honden')
                    .select('id')
                    .ilike('stamboomnr', cleanStamboomnr)
                    .limit(1);
                
                if (error) {
                    console.warn('ILike query failed:', error);
                    return { data: null, error };
                }
                
                return data && data.length > 0 ? { data: data[0], error: null } : { data: null, error: null };
                
            } catch (error) {
                console.error('Error in findHondByStamboomnr:', error);
                return { data: null, error };
            }
        };
        
        if (honden && honden.length > 0) {
            console.log(`Importing ${honden.length} honden...`);
            
            const totalBatches = Math.ceil(honden.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, honden.length);
                const batch = honden.slice(start, end);
                
                this.updateProgressMessage(`Importing honden... batch ${batchIndex + 1}/${totalBatches}`);
                
                for (const hond of batch) {
                    try {
                        const cleanStamboomnr = String(hond.stamboomnr).trim();
                        
                        const { data: existing, error: findError } = await findHondByStamboomnr(cleanStamboomnr);
                        
                        if (findError) {
                            console.warn('Find error, skipping hond:', cleanStamboomnr, findError);
                            result.errors++;
                            continue;
                        }
                        
                        const importData = { ...hond };
                        delete importData.id;
                        delete importData.vader_id;
                        delete importData.moeder_id;
                        delete importData.created_at;
                        delete importData.updated_at;
                        
                        importData.stamboomnr = cleanStamboomnr;
                        
                        if (existing) {
                            const { error } = await this.supabase
                                .from('honden')
                                .update(importData)
                                .eq('id', existing.id);
                            
                            if (error) throw error;
                            
                            stamboomnrMap.set(cleanStamboomnr, existing.id);
                            result.updated++;
                        } else {
                            const { data: newHond, error } = await this.supabase
                                .from('honden')
                                .insert([importData])
                                .select('id')
                                .single();
                            
                            if (error) throw error;
                            
                            stamboomnrMap.set(cleanStamboomnr, newHond.id);
                            result.added++;
                        }
                        
                    } catch (error) {
                        console.error(`Fout bij hond ${hond.stamboomnr}:`, error);
                        result.errors++;
                    }
                }
            }
            
            this.updateProgressMessage('Relaties herstellen tussen honden...');
            
            const relationBatches = Math.ceil(honden.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < relationBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, honden.length);
                const batch = honden.slice(start, end);
                
                for (const hond of batch) {
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
                            
                            result.relaties++;
                        }
                        
                    } catch (error) {
                        console.error(`Fout bij relaties ${hond.stamboomnr}:`, error);
                    }
                }
            }
        }
        
        console.log('Data import finished:', result);
        return result;
    }
    
    // =============================================
    // FOTO'S FUNCTIES
    // =============================================
    
    async handleFotosExport() {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        this.showProgress('Foto\'s exporteren...');
        
        try {
            let fotos = [];
            try {
                fotos = await this.getAllFotosWithPagination();
            } catch (fotoError) {
                console.log('Geen foto\'s om te exporteren:', fotoError.message);
            }
            
            // Maak FOTO'S backup met DUDELLIJKE MARKERS
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    type: 'FOTOS_BACKUP',
                    fotosCount: fotos.length,
                    system: 'Supabase FOTO\'S backup'
                },
                // ===== BEGIN FOTO'S SECTION =====
                fotos_section: {
                    description: "FOTO'S DATA - Alle foto metadata en thumbnails",
                    fotos: fotos
                }
                // ===== END FOTO'S SECTION =====
            };
            
            // Download
            this.downloadBackup(backup, 'fotos_backup');
            
            this.hideProgress();
            this.showSuccess(`Foto's backup gemaakt!<br>
                - ${fotos.length} foto's`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Foto\'s export error:', error);
            this.showError(`Foto's export mislukt: ${error.message}`);
        }
    }
    
    async handleFotosImport(file) {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        try {
            this.showProgress('Foto\'s importeren...');
            
            const text = await this.readFile(file);
            const backup = JSON.parse(text);
            
            if (!backup.fotos_section || !backup.fotos_section.fotos || !Array.isArray(backup.fotos_section.fotos)) {
                throw new Error('Ongeldig FOTO\'S backup bestand');
            }
            
            const result = await this.importFotosSection(backup.fotos_section.fotos);
            
            this.hideProgress();
            
            const message = `
                Foto's import voltooid!<br>
                <strong>Foto's:</strong><br>
                - ${result.added} toegevoegd<br>
                - ${result.errors} fouten
            `;
            
            this.showSuccess(message);
            
        } catch (error) {
            this.hideProgress();
            console.error('Foto\'s import error:', error);
            this.showError(`Foto's import mislukt: ${error.message}`);
        }
    }
    
    async importFotosSection(fotos) {
        console.log('DEBUG: Start foto\'s import, aantal foto\'s:', fotos?.length);
        
        const result = { added: 0, errors: 0 };
        const batchSize = 50;
        
        if (fotos && fotos.length > 0) {
            console.log(`Importing ${fotos.length} foto's...`);
            
            const totalBatches = Math.ceil(fotos.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, fotos.length);
                const batch = fotos.slice(start, end);
                
                this.updateProgressMessage(`Importing foto's... batch ${batchIndex + 1}/${totalBatches}`);
                
                for (const foto of batch) {
                    try {
                        const cleanStamboomnr = String(foto.stamboomnr).trim();
                        
                        // Controleer of foto al bestaat
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
                        
                        // Bereid import data voor met CORRECTE kolomnamen
                        const importData = {
                            stamboomnr: cleanStamboomnr,
                            data: foto.data,
                            thumbnail: foto.thumbnail,
                            filename: foto.filename,
                            size: foto.size,
                            type: foto.type,
                            upload_at: foto.upload_at,
                            geupload_door: foto.geupload_door,
                            hond_id: foto.hond_id
                        };
                        
                        // Verwijder onnodige velden
                        delete importData.id;
                        delete importData.created_at;
                        
                        if (!existing) {
                            const { error } = await this.supabase
                                .from('fotos')
                                .insert([importData]);
                            
                            if (!error) result.added++;
                        }
                        
                    } catch (error) {
                        console.error(`Fout bij foto ${foto.filename}:`, error);
                        result.errors++;
                    }
                }
            }
        }
        
        console.log('Foto\'s import finished:', result);
        return result;
    }
    
    // =============================================
    // PRIVEINFO FUNCTIES
    // =============================================
    
    async handlePriveinfoExport() {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        this.showProgress('Privé info exporteren...');
        
        try {
            let priveinfo = [];
            try {
                priveinfo = await this.getAllPriveinfoWithPagination();
            } catch (priveError) {
                console.log('Geen prive info om te exporteren:', priveError.message);
            }
            
            // Maak PRIVEINFO backup met DUDELLIJKE MARKERS
            const backup = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0',
                    type: 'PRIVEINFO_BACKUP',
                    priveinfoCount: priveinfo.length,
                    system: 'Supabase PRIVEINFO backup'
                },
                // ===== BEGIN PRIVEINFO SECTION =====
                priveinfo_section: {
                    description: "PRIVÉ INFO DATA - Alle vertrouwelijke gegevens",
                    priveinfo: priveinfo
                }
                // ===== END PRIVEINFO SECTION =====
            };
            
            // Download
            this.downloadBackup(backup, 'priveinfo_backup');
            
            this.hideProgress();
            this.showSuccess(`Privé info backup gemaakt!<br>
                - ${priveinfo.length} records`);
            
        } catch (error) {
            this.hideProgress();
            console.error('Privé info export error:', error);
            this.showError(`Privé info export mislukt: ${error.message}`);
        }
    }
    
    async handlePriveinfoImport(file) {
        const t = this.t.bind(this);
        
        if (!this.supabase) {
            this.showError('Supabase niet beschikbaar');
            return;
        }
        
        try {
            this.showProgress('Privé info importeren...');
            
            const text = await this.readFile(file);
            const backup = JSON.parse(text);
            
            if (!backup.priveinfo_section || !backup.priveinfo_section.priveinfo || !Array.isArray(backup.priveinfo_section.priveinfo)) {
                throw new Error('Ongeldig PRIVÉ INFO backup bestand');
            }
            
            const result = await this.importPriveinfoSection(backup.priveinfo_section.priveinfo);
            
            this.hideProgress();
            
            const message = `
                Privé info import voltooid!<br>
                <strong>Privé info:</strong><br>
                - ${result.updated} bijgewerkt<br>
                - ${result.errors} fouten
            `;
            
            this.showSuccess(message);
            
        } catch (error) {
            this.hideProgress();
            console.error('Privé info import error:', error);
            this.showError(`Privé info import mislukt: ${error.message}`);
        }
    }
    
    async importPriveinfoSection(priveinfoArray) {
        console.log('DEBUG: Start priveinfo import, aantal records:', priveinfoArray?.length);
        
        const result = { updated: 0, errors: 0 };
        const batchSize = 100;
        
        if (priveinfoArray && priveinfoArray.length > 0) {
            console.log(`Importing ${priveinfoArray.length} priveinfo records...`);
            
            const totalBatches = Math.ceil(priveinfoArray.length / batchSize);
            
            for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, priveinfoArray.length);
                const batch = priveinfoArray.slice(start, end);
                
                this.updateProgressMessage(`Importing prive info... batch ${batchIndex + 1}/${totalBatches}`);
                
                for (const prive of batch) {
                    try {
                        const cleanStamboomnr = String(prive.stamboomnr).trim();
                        
                        // Bereid import data voor met CORRECTE kolomnamen
                        const importData = {
                            stamboomnr: cleanStamboomnr,
                            privatenotes: prive.privatenotes,
                            vertrouwelijk: prive.vertrouwelijk,
                            laatstgewijzigd: prive.laatstgewijzigd,
                            toegevoegd_door: prive.toegevoegd_door
                        };
                        
                        // Verwijder onnodige velden
                        delete importData.id;
                        delete importData.created_at;
                        
                        // Update of insert prive info
                        const { error } = await this.supabase
                            .from('priveinfo')
                            .upsert([importData], {
                                onConflict: 'stamboomnr'
                            });
                        
                        if (!error) result.updated++;
                        
                    } catch (error) {
                        console.error(`Fout bij prive info ${prive.stamboomnr}:`, error);
                        result.errors++;
                    }
                }
            }
        }
        
        console.log('Priveinfo import finished:', result);
        return result;
    }
    
    // =============================================
    // GEMEENSCHAPPELIJKE FUNCTIES
    // =============================================
    
    async getAllHondenWithPagination() {
        return this.getTableWithPagination('honden', 'id');
    }
    
    async getAllFotosWithPagination() {
        return this.getTableWithPagination('fotos', 'id');
    }
    
    async getAllPriveinfoWithPagination() {
        return this.getTableWithPagination('priveinfo', 'id');
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
                if (error.code === 'PGRST116') {
                    console.log(`Tabel ${tableName} bestaat niet, skip export`);
                    return [];
                }
                throw error;
            }
            
            allData.push(...rows);
            
            if (rows.length < pageSize) {
                hasMore = false;
            } else {
                currentPage++;
            }
            
            this.updateProgressMessage(`Exporting ${tableName}... ${allData.length} records`);
        }
        
        console.log(`Export ${tableName} complete: ${allData.length} records`);
        return allData;
    }
    
    downloadBackup(backup, baseName) {
        const date = new Date();
        const filename = `${baseName}_${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}_${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}.json`;
        
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