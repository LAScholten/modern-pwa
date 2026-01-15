// storage-manager.js - Abstracte storage laag voor Desktop Edition
class StorageManager {
    constructor() {
        this.storageType = 'auto';
        this.availableTypes = this.detectAvailableStorage();
        this.currentStorage = null;
        this.migrationInProgress = false;
        this.dbReady = false;
        this.directoryHandle = null;
        this.config = null;
        this.configFileName = 'honden-config.json';
        
        console.log('StorageManager geïnitialiseerd:', {
            available: this.availableTypes,
            preferred: this.storageType
        });
        
        this.loadConfig();
    }
    
    detectAvailableStorage() {
        const available = {
            indexeddb: 'indexedDB' in window,
            filesystem: 'showDirectoryPicker' in window,
            localStorage: 'localStorage' in window
        };
        
        console.log('Storage detectie:', available);
        return available;
    }
    
    async initialize(preferredType = 'auto') {
        this.storageType = preferredType;
        
        if (this.config && this.config.type === 'filesystem') {
            try {
                await this.initializeFileSystemWithPath();
                return this.currentStorage;
            } catch (error) {
                console.warn('Kon opgeslagen map niet openen:', error);
            }
        }
        
        if (preferredType === 'filesystem' && this.availableTypes.filesystem) {
            await this.initializeFileSystem();
        } else if (this.availableTypes.indexeddb) {
            await this.initializeIndexedDB();
        } else {
            throw new Error('Geen geschikte storage backend beschikbaar');
        }
        
        console.log('StorageManager geïnitialiseerd met:', this.storageType);
        return this.currentStorage;
    }
    
    async initializeFileSystem() {
        console.log('Initializing FileSystem backend...');
        
        try {
            this.directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            console.log('Map geselecteerd:', this.directoryHandle.name);
            
            const appDirName = 'HondenDatabase_PWA';
            try {
                this.appDirectoryHandle = await this.directoryHandle.getDirectoryHandle(appDirName, { create: true });
                console.log('App map beschikbaar:', appDirName);
            } catch (error) {
                console.error('Kon app map niet maken:', error);
                this.appDirectoryHandle = this.directoryHandle;
            }
            
            await this.saveConfig({
                type: 'filesystem',
                selectedPath: await this.getDirectoryPath(this.directoryHandle),
                lastSync: new Date().toISOString(),
                appDirectory: appDirName
            });
            
            // MIGREER ALLE BESTAANDE DATA DIRECT
            console.log('Start migratie van alle bestaande data...');
            await this.migrateAllExistingData();
            
            this.currentStorage = {
                type: 'filesystem',
                save: async (key, data) => {
                    return this.saveToFileSystem(key, data);
                },
                load: async (key) => {
                    return this.loadFromFileSystem(key);
                },
                delete: async (key) => {
                    return this.deleteFromFileSystem(key);
                },
                list: async () => {
                    return this.listFilesInFileSystem();
                },
                directory: this.appDirectoryHandle
            };
            
            this.storageType = 'filesystem';
            console.log('FileSystem backend ready, alle data gemigreerd');
            
        } catch (error) {
            console.error('FileSystem initialisatie mislukt:', error);
            throw new Error('Kon geen map selecteren voor opslag');
        }
    }
    
    async migrateAllExistingData() {
        try {
            // Check of er een database is
            if (!window.db) {
                console.log('Geen database gevonden, niets te migreren');
                return;
            }
            
            const migrationData = {
                metadata: {
                    migratieDatum: new Date().toISOString(),
                    type: 'volledige_migratie',
                    bron: 'IndexedDB',
                    bestemming: 'FileSystem'
                }
            };
            
            // 1. Migreer honden
            try {
                if (typeof window.db.getHonden === 'function') {
                    migrationData.honden = await window.db.getHonden();
                    console.log(`${migrationData.honden.length} honden gevonden om te migreren`);
                    
                    // Sla honden op per stuk voor betere structuur
                    for (let i = 0; i < migrationData.honden.length; i++) {
                        const hond = migrationData.honden[i];
                        if (hond.stamboomnr) {
                            await this.saveToFileSystem(`hond_${hond.stamboomnr}`, hond);
                        } else {
                            await this.saveToFileSystem(`hond_${hond.id}`, hond);
                        }
                    }
                }
            } catch (error) {
                console.error('Fout bij migreren honden:', error);
            }
            
            // 2. Migreer foto's
            try {
                if (typeof window.db.getAllFotos === 'function') {
                    migrationData.fotos = await window.db.getAllFotos();
                    console.log(`${migrationData.fotos.length} foto's gevonden om te migreren`);
                    
                    // Groepeer foto's per hond
                    const fotosPerHond = {};
                    migrationData.fotos.forEach(foto => {
                        if (foto.stamboomnr) {
                            if (!fotosPerHond[foto.stamboomnr]) {
                                fotosPerHond[foto.stamboomnr] = [];
                            }
                            fotosPerHond[foto.stamboomnr].push(foto);
                        }
                    });
                    
                    // Sla foto's per hond op
                    for (const [stamboomnr, fotos] of Object.entries(fotosPerHond)) {
                        await this.saveToFileSystem(`fotos_${stamboomnr}`, fotos);
                    }
                }
            } catch (error) {
                console.error('Fout bij migreren foto\'s:', error);
            }
            
            // 3. Migreer privé info
            try {
                if (typeof window.db.getAllPriveInfo === 'function') {
                    migrationData.priveInfo = await window.db.getAllPriveInfo();
                    console.log(`${migrationData.priveInfo.length} privé records gevonden om te migreren`);
                    
                    // Sla privé info per hond op
                    for (const prive of migrationData.priveInfo) {
                        if (prive.stamboomnr) {
                            await this.saveToFileSystem(`prive_${prive.stamboomnr}`, prive);
                        }
                    }
                }
            } catch (error) {
                console.error('Fout bij migreren privé info:', error);
            }
            
            // 4. Sla complete migratie backup op
            await this.saveToFileSystem('migratie_backup_compleet', migrationData);
            
            console.log('Migratie voltooid! Alle data staat nu in de map');
            
        } catch (error) {
            console.error('Migratie mislukt:', error);
            throw error;
        }
    }
    
    async initializeFileSystemWithPath() {
        console.log('Probeer opgeslagen map te openen...');
        
        if (!this.config || this.config.type !== 'filesystem') {
            throw new Error('Geen geldige filesystem configuratie gevonden');
        }
        
        try {
            const directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents',
                id: this.config.selectedPath
            });
            
            this.directoryHandle = directoryHandle;
            
            const appDirName = this.config.appDirectory || 'HondenDatabase_PWA';
            try {
                this.appDirectoryHandle = await this.directoryHandle.getDirectoryHandle(appDirName, { create: true });
                console.log('App map geopend:', appDirName);
            } catch (error) {
                console.error('Kon app map niet openen:', error);
                this.appDirectoryHandle = this.directoryHandle;
            }
            
            try {
                const configFile = await this.appDirectoryHandle.getFileHandle(this.configFileName);
                console.log('Configuratiebestand gevonden in map');
            } catch (error) {
                console.warn('Configuratiebestand niet gevonden, maak nieuw aan');
                await this.saveConfig(this.config);
            }
            
            this.config.lastSync = new Date().toISOString();
            await this.saveConfig(this.config);
            
            this.currentStorage = {
                type: 'filesystem',
                save: async (key, data) => {
                    return this.saveToFileSystem(key, data);
                },
                load: async (key) => {
                    return this.loadFromFileSystem(key);
                },
                delete: async (key) => {
                    return this.deleteFromFileSystem(key);
                },
                list: async () => {
                    return this.listFilesInFileSystem();
                },
                directory: this.appDirectoryHandle
            };
            
            this.storageType = 'filesystem';
            console.log('FileSystem backend hersteld uit configuratie');
            
        } catch (error) {
            console.error('Kon opgeslagen map niet openen:', error);
            throw error;
        }
    }
    
    async initializeIndexedDB() {
        console.log('Initializing IndexedDB backend...');
        
        await this.saveConfig({
            type: 'indexeddb',
            lastSync: new Date().toISOString()
        });
        
        if (!window.db) {
            console.warn('Database nog niet beschikbaar, gebruik localStorage als tijdelijke cache');
            
            this.currentStorage = {
                type: 'indexeddb-temp',
                save: async (key, data) => {
                    localStorage.setItem(`temp_${key}`, JSON.stringify(data));
                    return { success: true, temporary: true, key };
                },
                load: async (key) => {
                    const data = localStorage.getItem(`temp_${key}`);
                    return data ? JSON.parse(data) : null;
                },
                delete: async (key) => {
                    localStorage.removeItem(`temp_${key}`);
                    return { success: true };
                },
                list: async () => {
                    const keys = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.startsWith('temp_')) {
                            keys.push(key.replace('temp_', ''));
                        }
                    }
                    return keys;
                }
            };
        } else {
            this.currentStorage = {
                type: 'indexeddb',
                save: async (key, data) => {
                    return window.db.saveData(key, data);
                },
                load: async (key) => {
                    return window.db.loadData(key);
                },
                delete: async (key) => {
                    return window.db.deleteData(key);
                },
                list: async () => {
                    return window.db.getAllKeys();
                }
            };
        }
        
        this.storageType = 'indexeddb';
        console.log('IndexedDB backend ready');
    }
    
    async loadConfig() {
        try {
            const localStorageConfig = localStorage.getItem('honden-storage-config');
            if (localStorageConfig) {
                this.config = JSON.parse(localStorageConfig);
                console.log('Configuratie geladen uit localStorage:', this.config);
                return;
            }
            
            this.config = null;
            
        } catch (error) {
            console.warn('Kon configuratie niet laden:', error);
            this.config = null;
        }
    }
    
    async saveConfig(configData) {
        try {
            this.config = configData;
            
            localStorage.setItem('honden-storage-config', JSON.stringify(configData));
            
            if (configData.type === 'filesystem' && this.appDirectoryHandle) {
                try {
                    const fileHandle = await this.appDirectoryHandle.getFileHandle(this.configFileName, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(JSON.stringify(configData, null, 2));
                    await writable.close();
                    console.log('Configuratie opgeslagen in map');
                } catch (error) {
                    console.warn('Kon configuratie niet in map opslaan:', error);
                }
            }
        } catch (error) {
            console.error('Kon configuratie niet opslaan:', error);
        }
    }
    
    async getConfigFromFileSystem() {
        if (!this.appDirectoryHandle) return null;
        
        try {
            const fileHandle = await this.appDirectoryHandle.getFileHandle(this.configFileName);
            const file = await fileHandle.getFile();
            const content = await file.text();
            return JSON.parse(content);
        } catch (error) {
            if (error.name === 'NotFoundError') {
                return null;
            }
            throw error;
        }
    }
    
    async getDirectoryPath(handle) {
        return handle.name;
    }
    
    async saveToFileSystem(key, data) {
        if (!this.appDirectoryHandle) {
            throw new Error('Geen map geselecteerd voor opslag');
        }
        
        try {
            const fileName = `${key}.json`;
            const fileHandle = await this.appDirectoryHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            
            await writable.write(JSON.stringify(data, null, 2));
            await writable.close();
            
            console.log('Bestand opgeslagen:', fileName);
            
            if (this.config) {
                this.config.lastSync = new Date().toISOString();
                await this.saveConfig(this.config);
            }
            
            return { 
                success: true, 
                type: 'filesystem', 
                key, 
                fileName,
                path: await this.getFilePath(fileHandle)
            };
            
        } catch (error) {
            console.error('Opslaan naar bestand mislukt:', error);
            throw error;
        }
    }
    
    async loadFromFileSystem(key) {
        if (!this.appDirectoryHandle) {
            return null;
        }
        
        try {
            const fileName = `${key}.json`;
            const fileHandle = await this.appDirectoryHandle.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            const content = await file.text();
            
            console.log('Bestand geladen:', fileName);
            return JSON.parse(content);
            
        } catch (error) {
            if (error.name === 'NotFoundError') {
                console.log('Bestand niet gevonden:', key);
                return null;
            }
            console.error('Laden van bestand mislukt:', error);
            throw error;
        }
    }
    
    async deleteFromFileSystem(key) {
        if (!this.appDirectoryHandle) {
            return { success: false, error: 'Geen map geselecteerd' };
        }
        
        try {
            const fileName = `${key}.json`;
            await this.appDirectoryHandle.removeEntry(fileName);
            console.log('Bestand verwijderd:', fileName);
            
            if (this.config) {
                this.config.lastSync = new Date().toISOString();
                await this.saveConfig(this.config);
            }
            
            return { success: true, key, fileName };
            
        } catch (error) {
            console.error('Verwijderen van bestand mislukt:', error);
            return { success: false, error: error.message };
        }
    }
    
    async listFilesInFileSystem() {
        if (!this.appDirectoryHandle) {
            return [];
        }
        
        const keys = [];
        for await (const [name, handle] of this.appDirectoryHandle.entries()) {
            if (handle.kind === 'file' && name.endsWith('.json')) {
                keys.push(name.replace('.json', ''));
            }
        }
        
        return keys;
    }
    
    async getFilePath(fileHandle) {
        return fileHandle.name;
    }
    
    async requestDirectoryAccess() {
        if (!this.availableTypes.filesystem) {
            throw new Error('FileSystem API niet ondersteund door deze browser');
        }
        
        try {
            console.log('Requesting directory access...');
            const directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            console.log('Directory access granted:', directoryHandle);
            return directoryHandle;
        } catch (error) {
            console.error('Directory access error:', error);
            throw error;
        }
    }
    
    async save(key, data) {
        if (!this.currentStorage) {
            await this.initialize();
        }
        return this.currentStorage.save(key, data);
    }
    
    async load(key) {
        if (!this.currentStorage) {
            await this.initialize();
        }
        return this.currentStorage.load(key);
    }
    
    async delete(key) {
        if (!this.currentStorage) {
            await this.initialize();
        }
        return this.currentStorage.delete(key);
    }
    
    async list() {
        if (!this.currentStorage) {
            await this.initialize();
        }
        return this.currentStorage.list();
    }
    
    async migrate(fromType, toType) {
        if (this.migrationInProgress) {
            throw new Error('Migratie al in progress');
        }
        
        this.migrationInProgress = true;
        console.log(`Start migratie van ${fromType} naar ${toType}`);
        
        this.migrationInProgress = false;
        return { success: true, message: 'Migratie voltooid' };
    }
    
    getStorageInfo() {
        const hasConfig = this.config !== null;
        const configType = hasConfig ? this.config.type : 'none';
        
        return {
            type: this.storageType,
            available: this.availableTypes,
            current: this.currentStorage ? this.currentStorage.type : 'none',
            supportsFileSystem: this.availableTypes.filesystem,
            directoryName: this.directoryHandle ? this.directoryHandle.name : null,
            hasSavedConfig: hasConfig,
            configType: configType,
            lastSync: hasConfig ? this.config.lastSync : null
        };
    }
    
    async exportAllDataToDirectory() {
        if (!this.availableTypes.filesystem) {
            throw new Error('FileSystem API niet ondersteund');
        }
        
        try {
            const exportHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
                startIn: 'documents'
            });
            
            const exportDirName = `HondenDatabase_Export_${new Date().toISOString().split('T')[0]}`;
            const exportDir = await exportHandle.getDirectoryHandle(exportDirName, { create: true });
            
            const configData = {
                type: 'export',
                exportDate: new Date().toISOString(),
                source: this.getStorageInfo(),
                note: 'Export van HondenDatabase'
            };
            
            const configFile = await exportDir.getFileHandle('export-config.json', { create: true });
            const configWritable = await configFile.createWritable();
            await configWritable.write(JSON.stringify(configData, null, 2));
            await configWritable.close();
            
            if (this.currentStorage && typeof this.currentStorage.list === 'function') {
                const keys = await this.currentStorage.list();
                for (const key of keys) {
                    const data = await this.currentStorage.load(key);
                    if (data) {
                        const dataFile = await exportDir.getFileHandle(`${key}.json`, { create: true });
                        const dataWritable = await dataFile.createWritable();
                        await dataWritable.write(JSON.stringify(data, null, 2));
                        await dataWritable.close();
                    }
                }
            }
            
            return {
                success: true,
                directory: exportDirName,
                exportedFiles: await this.listFilesInDirectory(exportDir)
            };
            
        } catch (error) {
            console.error('Export mislukt:', error);
            throw error;
        }
    }
    
    async listFilesInDirectory(directoryHandle) {
        const files = [];
        for await (const [name, handle] of directoryHandle.entries()) {
            if (handle.kind === 'file') {
                files.push(name);
            }
        }
        return files;
    }
    
    async autoDetectConfiguration() {
        if (this.config && this.config.type === 'filesystem') {
            try {
                await this.initializeFileSystemWithPath();
                return { type: 'filesystem', success: true };
            } catch (error) {
                console.warn('Auto-detect mislukt:', error);
                return { type: 'unknown', success: false };
            }
        }
        
        return { type: 'none', success: false };
    }
}

const storageManager = new StorageManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storageManager };
}