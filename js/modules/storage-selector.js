// storage-selector.js - Opslagtype selector voor Desktop Edition
class StorageSelector {
    constructor() {
        this.storageManager = window.storageManager;
        this.currentStorage = null;
    }
    
    getSelectorUI() {
        return `
            <div class="modal fade" id="storageSelectorModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title"><i class="bi bi-hdd"></i> Opslag Type</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-4">
                                <h6>Selecteer hoe je data wilt opslaan:</h6>
                                <p class="text-muted">Je kunt altijd wisselen tussen opslagtypes.</p>
                            </div>
                            
                            <div class="row g-3">
                                <!-- Optie 1: File System API -->
                                <div class="col-md-6">
                                    <div class="card h-100 storage-option" data-type="filesystem">
                                        <div class="card-body text-center">
                                            <div class="mb-3">
                                                <i class="bi bi-folder" style="font-size: 2.5rem; color: #4CAF50;"></i>
                                            </div>
                                            <h5>💾 Bestandsopslag</h5>
                                            <p class="small">
                                                Sla data op in <strong>echte bestanden</strong> op je computer.
                                            </p>
                                            <ul class="text-start small">
                                                <li>📁 Kies zelf een map</li>
                                                <li>💾 Makkelijke backups</li>
                                                <li>🔄 Synchronisatie mogelijk</li>
                                                <li>🔒 Meer controle</li>
                                            </ul>
                                            <div class="mt-3">
                                                <span class="badge bg-success">Aanbevolen voor Desktop</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Optie 2: IndexedDB -->
                                <div class="col-md-6">
                                    <div class="card h-100 storage-option" data-type="indexeddb">
                                        <div class="card-body text-center">
                                            <div class="mb-3">
                                                <i class="bi bi-browser-chrome" style="font-size: 2.5rem; color: #2196F3;"></i>
                                            </div>
                                            <h5>🌐 Browser Opslag</h5>
                                            <p class="small">
                                                Sla data op in de <strong>browser</strong> (zoals voorheen).
                                            </p>
                                            <ul class="text-start small">
                                                <li>⚡ Snel en automatisch</li>
                                                <li>📱 Werkt op alle apparaten</li>
                                                <li>🔄 Geen map selectie nodig</li>
                                                <li>🔧 Eenvoudig in gebruik</li>
                                            </ul>
                                            <div class="mt-3">
                                                <span class="badge bg-info">Standaard</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Huidige status -->
                            <div class="mt-4 pt-3 border-top">
                                <h6><i class="bi bi-info-circle"></i> Huidige status:</h6>
                                <div id="currentStorageInfo" class="alert alert-light">
                                    Laden...
                                </div>
                            </div>
                            
                            <!-- Geavanceerde opties -->
                            <div class="mt-3">
                                <button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#advancedOptions">
                                    <i class="bi bi-gear"></i> Geavanceerde opties
                                </button>
                                
                                <div class="collapse mt-2" id="advancedOptions">
                                    <div class="card card-body">
                                        <h6>Gegevens beheren:</h6>
                                        <div class="d-grid gap-2">
                                            <button class="btn btn-outline-warning btn-sm" id="clearBrowserStorageBtn">
                                                <i class="bi bi-trash"></i> Browser opslag leegmaken
                                            </button>
                                            <button class="btn btn-outline-info btn-sm" id="storageInfoBtn">
                                                <i class="bi bi-info-square"></i> Technische informatie
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                            <button type="button" class="btn btn-primary" id="applyStorageBtn" disabled>
                                Toepassen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async updateCurrentStorageInfo() {
        const infoEl = document.getElementById('currentStorageInfo');
        if (!infoEl) return;
        
        if (!this.storageManager) {
            infoEl.innerHTML = '<span class="text-danger">StorageManager niet beschikbaar</span>';
            return;
        }
        
        const info = this.storageManager.getStorageInfo();
        
        let html = '';
        let statusClass = 'secondary';
        
        if (info.current === 'filesystem') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-folder text-success me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Bestandsopslag actief</strong><br>
                        <small class="text-muted">Map: ${info.directoryName || 'Niet geselecteerd'}</small>
                    </div>
                </div>
            `;
            statusClass = 'success';
            this.currentStorage = 'filesystem';
            
        } else if (info.current === 'indexeddb' || info.current === 'indexeddb-temp') {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-browser-chrome text-info me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Browser opslag actief</strong><br>
                        <small class="text-muted">Data wordt in je browser opgeslagen</small>
                    </div>
                </div>
            `;
            statusClass = 'info';
            this.currentStorage = 'indexeddb';
            
        } else {
            html = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-question-circle text-warning me-2" style="font-size: 1.5rem;"></i>
                    <div>
                        <strong>Niet geconfigureerd</strong><br>
                        <small class="text-muted">Selecteer een opslagtype</small>
                    </div>
                </div>
            `;
            statusClass = 'warning';
            this.currentStorage = null;
        }
        
        infoEl.innerHTML = html;
        infoEl.className = `alert alert-${statusClass} mb-0`;
        
        // Update ook de apply knop
        this.updateApplyButton();
    }
    
    updateApplyButton() {
        const applyBtn = document.getElementById('applyStorageBtn');
        if (!applyBtn) return;
        
        const selectedOption = document.querySelector('.storage-option.selected');
        
        if (selectedOption) {
            const selectedType = selectedOption.getAttribute('data-type');
            
            // Als het geselecteerde type al actief is, disable de knop
            if (selectedType === this.currentStorage) {
                applyBtn.disabled = true;
                applyBtn.textContent = 'Al actief';
                applyBtn.className = 'btn btn-secondary';
            } else {
                applyBtn.disabled = false;
                applyBtn.textContent = 'Toepassen';
                applyBtn.className = 'btn btn-primary';
            }
        } else {
            applyBtn.disabled = true;
            applyBtn.textContent = 'Selecteer een optie';
            applyBtn.className = 'btn btn-secondary';
        }
    }
    
    setupSelectorEvents() {
        // Select storage options
        document.querySelectorAll('.storage-option').forEach(option => {
            option.addEventListener('click', () => {
                // Remove selection from all
                document.querySelectorAll('.storage-option').forEach(opt => {
                    opt.classList.remove('selected', 'border-primary');
                    opt.classList.add('border-light');
                });
                
                // Add selection to clicked
                option.classList.add('selected', 'border-primary');
                option.classList.remove('border-light');
                
                // Update apply button
                this.updateApplyButton();
            });
        });
        
        // Apply button
        const applyBtn = document.getElementById('applyStorageBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', async () => {
                const selectedOption = document.querySelector('.storage-option.selected');
                if (!selectedOption) return;
                
                const storageType = selectedOption.getAttribute('data-type');
                
                try {
                    applyBtn.disabled = true;
                    applyBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Bezig...';
                    
                    await this.storageManager.initialize(storageType);
                    
                    // Update status
                    await this.updateCurrentStorageInfo();
                    
                    // Update global storage status
                    if (window.updateStorageStatus) {
                        updateStorageStatus();
                    }
                    
                    // Show success
                    applyBtn.innerHTML = '<i class="bi bi-check-circle"></i> Toegepast!';
                    
                    // Close modal after delay
                    setTimeout(() => {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('storageSelectorModal'));
                        if (modal) modal.hide();
                        
                        // Reset button
                        setTimeout(() => {
                            applyBtn.disabled = false;
                            applyBtn.innerHTML = 'Toepassen';
                        }, 500);
                    }, 1500);
                    
                } catch (error) {
                    console.error('Storage change error:', error);
                    applyBtn.disabled = false;
                    applyBtn.innerHTML = 'Toepassen';
                    
                    if (window.uiHandler && window.uiHandler.showError) {
                        window.uiHandler.showError('Kon opslagtype niet wijzigen: ' + error.message);
                    }
                }
            });
        }
        
        // Clear browser storage button
        const clearBtn = document.getElementById('clearBrowserStorageBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Weet je zeker dat je alle browser opslag wilt leegmaken? Dit verwijdert alleen de browser data, niet je bestandsopslag.')) {
                    localStorage.clear();
                    if (window.uiHandler && window.uiHandler.showSuccess) {
                        window.uiHandler.showSuccess('Browser opslag geleegd');
                    }
                }
            });
        }
        
        // Storage info button
        const infoBtn = document.getElementById('storageInfoBtn');
        if (infoBtn) {
            infoBtn.addEventListener('click', () => {
                const info = this.storageManager.getStorageInfo();
                alert(
                    `Technische informatie:\n\n` +
                    `Huidige opslag: ${info.current}\n` +
                    `FileSystem ondersteund: ${info.supportsFileSystem ? 'Ja' : 'Nee'}\n` +
                    `IndexedDB ondersteund: ${info.supportsIndexedDB ? 'Ja' : 'Nee'}\n` +
                    `localStorage ondersteund: ${info.supportsLocalStorage ? 'Ja' : 'Nee'}\n` +
                    `Map naam: ${info.directoryName || 'Niet ingesteld'}\n` +
                    `Gebruikte schijfruimte: ${info.usedSpace || 'Onbekend'}`
                );
            });
        }
    }
    
    showSelectorModal() {
        // Add UI to DOM
        const selectorHTML = this.getSelectorUI();
        const modalsContainer = document.getElementById('modalsContainer');
        
        if (modalsContainer) {
            modalsContainer.innerHTML = selectorHTML;
            
            // Show modal
            const selectorModal = new bootstrap.Modal(document.getElementById('storageSelectorModal'));
            selectorModal.show();
            
            // Setup events and update info
            setTimeout(async () => {
                await this.updateCurrentStorageInfo();
                this.setupSelectorEvents();
                
                // Add some styling
                this.addSelectorStyles();
            }, 100);
        }
    }
    
    addSelectorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .storage-option {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid #e9ecef;
            }
            .storage-option:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .storage-option.selected {
                border-color: #0d6efd !important;
                background-color: rgba(13, 110, 253, 0.05);
            }
            .storage-option .card-body ul {
                padding-left: 1.2rem;
                margin-bottom: 0;
            }
            .storage-option .card-body li {
                margin-bottom: 0.3rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Voeg een knop toe aan de UI om de selector te openen
    addSettingsMenuItem() {
        // Deze functie kun je aanroepen vanuit je main script
        // om een menu-item toe te voegen aan de sidebar
        console.log('Storage selector ready - call addSettingsMenuItem() to add to UI');
    }
}

// Maak globale instance
const storageSelector = new StorageSelector();

// Voeg toe aan window object
window.storageSelector = storageSelector;

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageSelector, storageSelector };
}