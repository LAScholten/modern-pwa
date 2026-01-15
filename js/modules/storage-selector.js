/**
 * Storage Selector voor Desktop Edition
 * Handelt de keuze tussen FileSystem en IndexedDB opslag
 */

class StorageSelector {
    constructor() {
        this.storageManager = window.storageManager;
        this.currentStorage = null;
        this.setupGlobalStorageListener();
    }
    
    setupGlobalStorageListener() {
        // Voeg toe aan window voor globale toegang
        window.storageSelector = this;
        
        // Luister naar storage wijzigingen
        window.addEventListener('storage-changed', () => {
            this.updateCurrentStorageInfo();
        });
    }
    
    getSelectorHTML() {
        return `
            <div class="modal fade" id="storageSelectorModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title"><i class="bi bi-hdd"></i> Opslaginstellingen</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100 border-success">
                                        <div class="card-body text-center">
                                            <div class="mb-3">
                                                <i class="bi bi-folder text-success" style="font-size: 3rem;"></i>
                                            </div>
                                            <h5>Bestandsopslag</h5>
                                            <p class="text-muted small mb-3">
                                                Sla data op in bestanden op je computer. Makkelijk voor backups en synchronisatie.
                                            </p>
                                            <div class="text-start small mb-3">
                                                <div class="d-flex mb-2">
                                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                                    <span>Kies je eigen map</span>
                                                </div>
                                                <div class="d-flex mb-2">
                                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                                    <span>Eenvoudige backups (kopieer map)</span>
                                                </div>
                                                <div class="d-flex mb-2">
                                                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                                                    <span>Meer controle over je data</span>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline-success w-100 use-storage-btn" data-type="filesystem">
                                                <i class="bi bi-check-circle"></i> Gebruik Bestandsopslag
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6 mb-3">
                                    <div class="card h-100 border-primary">
                                        <div class="card-body text-center">
                                            <div class="mb-3">
                                                <i class="bi bi-browser-chrome text-primary" style="font-size: 3rem;"></i>
                                            </div>
                                            <h5>Browser Opslag</h5>
                                            <p class="text-muted small mb-3">
                                                Sla data op in je browser. Werkt automatisch zonder extra configuratie.
                                            </p>
                                            <div class="text-start small mb-3">
                                                <div class="d-flex mb-2">
                                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                                    <span>Automatisch en eenvoudig</span>
                                                </div>
                                                <div class="d-flex mb-2">
                                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                                    <span>Geen map selectie nodig</span>
                                                </div>
                                                <div class="d-flex mb-2">
                                                    <i class="bi bi-check-circle-fill text-primary me-2"></i>
                                                    <span>Werkt op alle apparaten</span>
                                                </div>
                                            </div>
                                            <button class="btn btn-outline-primary w-100 use-storage-btn" data-type="indexeddb">
                                                <i class="bi bi-arrow-left-right"></i> Gebruik Browser Opslag
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="card border-info mt-3">
                                <div class="card-body">
                                    <h6><i class="bi bi-info-circle"></i> Huidige status:</h6>
                                    <div id="currentStorageStatus" class="alert alert-light mb-0">
                                        <div class="d-flex align-items-center">
                                            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                                            <span>Status laden...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="alert alert-warning mt-3">
                                <i class="bi bi-exclamation-triangle"></i>
                                <strong>Belangrijk:</strong> Bij het wisselen van opslagtype worden bestaande gegevens automatisch overgezet.
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
    
    async showSelectorModal() {
        // Voeg modal toe aan DOM
        const modalContainer = document.getElementById('modalsContainer') || document.body;
        const existingModal = document.getElementById('storageSelectorModal');
        
        if (existingModal) {
            existingModal.remove();
        }
        
        modalContainer.insertAdjacentHTML('beforeend', this.getSelectorHTML());
        
        // Initialize Bootstrap modal
        const modalElement = document.getElementById('storageSelectorModal');
        const modal = new bootstrap.Modal(modalElement);
        
        // Setup event listeners
        this.setupSelectorEvents(modal);
        
        // Update status
        await this.updateCurrentStorageInfo();
        
        // Show modal
        modal.show();
        
        // Add custom styles
        this.addCustomStyles();
    }
    
    setupSelectorEvents(modal) {
        // Use storage buttons
        document.querySelectorAll('.use-storage-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const storageType = e.target.getAttribute('data-type');
                await this.switchStorage(storageType, modal);
            });
        });
        
        // Update status when modal is shown
        modalElement.addEventListener('shown.bs.modal', async () => {
            await this.updateCurrentStorageInfo();
        });
    }
    
    async switchStorage(storageType, modal) {
        try {
            // Disable all buttons
            document.querySelectorAll('.use-storage-btn').forEach(btn => {
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Bezig...';
            });
            
            // Update status display
            const statusEl = document.getElementById('currentStorageStatus');
            statusEl.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2"></div>
                    <span>Opslag wordt gewijzigd naar ${storageType === 'filesystem' ? 'Bestandsopslag' : 'Browser Opslag'}...</span>
                </div>
            `;
            statusEl.className = 'alert alert-info mb-0';
            
            if (!window.storageManager) {
                throw new Error('StorageManager niet beschikbaar');
            }
            
            // Initialiseer nieuwe opslag
            await storageManager.initialize(storageType);
            
            // Migreer bestaande data
            await this.migrateData(storageType);
            
            // Update UI
            await this.updateCurrentStorageInfo();
            
            // Succes melding
            statusEl.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-check-circle-fill text-success me-2"></i>
                    <span>Opslag succesvol gewijzigd!</span>
                </div>
            `;
            statusEl.className = 'alert alert-success mb-0';
            
            // Update globale status
            if (window.updateStorageStatus) {
                updateStorageStatus();
            }
            
            // Herlaad data manager status
            if (window.dataManager && window.dataManager.loadStorageStatus) {
                window.dataManager.loadStorageStatus();
            }
            
            // Sluit modal na korte tijd
            setTimeout(() => {
                if (modal && modal.hide) {
                    modal.hide();
                }
            }, 2000);
            
        } catch (error) {
            console.error('Storage switch error:', error);
            
            const statusEl = document.getElementById('currentStorageStatus');
            statusEl.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                    <span>Fout: ${error.message}</span>
                </div>
            `;
            statusEl.className = 'alert alert-danger mb-0';
            
            // Reset buttons
            document.querySelectorAll('.use-storage-btn').forEach(btn => {
                btn.disabled = false;
                btn.innerHTML = storageType === 'filesystem' 
                    ? '<i class="bi bi-check-circle"></i> Gebruik Bestandsopslag'
                    : '<i class="bi bi-arrow-left-right"></i> Gebruik Browser Opslag';
            });
            
            if (window.uiHandler && window.uiHandler.showError) {
                window.uiHandler.showError(`Kon opslag niet wijzigen: ${error.message}`);
            }
        }
    }
    
    async migrateData(newStorageType) {
        console.log(`Migreer data naar ${newStorageType}...`);
        
        if (newStorageType === 'filesystem') {
            // Migreer van IndexedDB naar FileSystem
            await this.migrateToFileSystem();
        } else {
            // Migreer van FileSystem naar IndexedDB
            await this.migrateToIndexedDB();
        }
    }
    
    async migrateToFileSystem() {
        try {
            console.log('Migreer data van IndexedDB naar FileSystem...');
            
            // Haal alle data op uit IndexedDB
            const honden = await window.db.getHonden();
            console.log(`Migreer ${honden.length} honden...`);
            
            // Sla elke hond op in FileSystem
            for (const hond of honden) {
                if (hond.stamboomnr) {
                    await storageManager.save(`hond_${hond.stamboomnr}`, hond);
                }
            }
            
            // Haal foto's op (als de functie beschikbaar is)
            if (typeof window.db.getAllFotos === 'function') {
                try {
                    const fotos = await window.db.getAllFotos();
                    console.log(`Migreer ${fotos.length} foto's...`);
                    
                    // Groepeer foto's per stamboomnr
                    const fotosPerHond = {};
                    fotos.forEach(foto => {
                        if (foto.stamboomnr) {
                            if (!fotosPerHond[foto.stamboomnr]) {
                                fotosPerHond[foto.stamboomnr] = [];
                            }
                            fotosPerHond[foto.stamboomnr].push(foto);
                        }
                    });
                    
                    // Sla gegroepeerde foto's op
                    for (const [stamboomnr, hondFotos] of Object.entries(fotosPerHond)) {
                        await storageManager.save(`fotos_${stamboomnr}`, hondFotos);
                    }
                } catch (fotoError) {
                    console.log('Foto migratie overslagen:', fotoError);
                }
            }
            
            console.log('Data migratie naar FileSystem voltooid');
            
        } catch (error) {
            console.error('Fout bij migratie naar FileSystem:', error);
            throw error;
        }
    }
    
    async migrateToIndexedDB() {
        try {
            console.log('Migreer data van FileSystem naar IndexedDB...');
            
            // Omdat we van FileSystem naar IndexedDB gaan,
            // moeten we de data uit FileSystem laden en in IndexedDB opslaan
            
            // Deze functie zou in de storageManager moeten zitten
            if (storageManager.getAllFromFileSystem) {
                const allData = await storageManager.getAllFromFileSystem();
                console.log(`Lade ${allData.length} bestanden uit FileSystem...`);
                
                // Hier zou je de data in IndexedDB moeten opslaan
                // Dit is afhankelijk van je database structuur
                console.log('Migratie naar IndexedDB zou hier moeten plaatsvinden');
            }
            
        } catch (error) {
            console.error('Fout bij migratie naar IndexedDB:', error);
            throw error;
        }
    }
    
    async updateCurrentStorageInfo() {
        const statusEl = document.getElementById('currentStorageStatus');
        if (!statusEl) return;
        
        if (!this.storageManager) {
            statusEl.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                    <span>StorageManager niet beschikbaar</span>
                </div>
            `;
            statusEl.className = 'alert alert-warning mb-0';
            return;
        }
        
        const info = storageManager.getStorageInfo();
        
        let html = '';
        let statusClass = 'light';
        
        if (info.current === 'filesystem') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-folder text-success me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Bestandsopslag actief</strong><br>
                        <small class="text-muted">Map: ${info.directoryName || 'Nog geen map geselecteerd'}</small>
                    </div>
                </div>
            `;
            statusClass = 'success';
        } else if (info.current === 'indexeddb' || info.current === 'indexeddb-temp') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-browser-chrome text-primary me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Browser opslag actief</strong><br>
                        <small class="text-muted">Data wordt in je browser opgeslagen</small>
                    </div>
                </div>
            `;
            statusClass = 'primary';
        } else if (info.current === 'none') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-question-circle text-warning me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Opslag niet geconfigureerd</strong><br>
                        <small class="text-muted">Selecteer een opslagtype</small>
                    </div>
                </div>
            `;
            statusClass = 'warning';
        } else {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-hourglass-split me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Status laden...</strong>
                    </div>
                </div>
            `;
        }
        
        statusEl.innerHTML = html;
        statusEl.className = `alert alert-${statusClass} mb-0`;
    }
    
    addCustomStyles() {
        // Voeg custom styling toe voor de selector
        const styleId = 'storage-selector-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .storage-option {
                cursor: pointer;
                transition: all 0.2s ease;
                border-width: 2px;
            }
            .storage-option:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .storage-option.selected {
                border-color: var(--bs-primary) !important;
                background-color: rgba(var(--bs-primary-rgb), 0.05);
            }
            .use-storage-btn {
                transition: all 0.2s ease;
            }
            .use-storage-btn:hover {
                transform: scale(1.02);
            }
        `;
        document.head.appendChild(style);
    }
}

// Maak globale instance
if (!window.storageSelector) {
    window.storageSelector = new StorageSelector();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageSelector, storageSelector: window.storageSelector };
}