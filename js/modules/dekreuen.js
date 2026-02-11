// js/modules/DekReuen.js

/**
 * DekReuen Management Module voor Supabase
 * Beheert dek reuen overzicht en beheer
 */

class DekReuenManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.userRole = localStorage.getItem('userRole') || 'gebruiker';
        this.isAdmin = this.userRole === 'admin';
        this.isUser = this.userRole === 'gebruiker';
        this.isUserPlus = this.userRole === 'gebruiker+';
        this.currentView = 'overview'; // 'overview' of 'beheer'
        
        this.translations = {
            nl: {
                dekReuen: "Dek Reuen",
                dekReuenBeheer: "Dek Reuen Beheer",
                dekReuenOverview: "Dek Reuen Overzicht",
                chooseAction: "Kies een actie:",
                viewOverview: "Dek Reuen Bekijken",
                manageDekReuen: "Dek Reuen Beheren",
                close: "Sluiten",
                noDekReuen: "Er zijn nog geen dek reuen toegevoegd",
                loading: "Dek reuen laden...",
                loadFailed: "Laden mislukt: ",
                dekReuenComingSoon: "De Dek Reuen module is in ontwikkeling",
                placeholder: "Hier komt een overzicht van alle beschikbare dek reuen",
                beheerPlaceholder: "Hier komt het beheer van dek reuen"
            },
            en: {
                dekReuen: "Stud Dogs",
                dekReuenBeheer: "Stud Dog Management",
                dekReuenOverview: "Stud Dog Overview",
                chooseAction: "Choose an action:",
                viewOverview: "View Stud Dogs",
                manageDekReuen: "Manage Stud Dogs",
                close: "Close",
                noDekReuen: "No stud dogs added yet",
                loading: "Loading stud dogs...",
                loadFailed: "Loading failed: ",
                dekReuenComingSoon: "The Stud Dogs module is under development",
                placeholder: "Here will be an overview of all available stud dogs",
                beheerPlaceholder: "Here will be the stud dog management"
            },
            de: {
                dekReuen: "Deckrüden",
                dekReuenBeheer: "Deckrüden Verwaltung",
                dekReuenOverview: "Deckrüden Übersicht",
                chooseAction: "Wählen Sie eine Aktion:",
                viewOverview: "Deckrüden Ansehen",
                manageDekReuen: "Deckrüden Verwalten",
                close: "Schließen",
                noDekReuen: "Noch keine Deckrüden hinzugefügt",
                loading: "Deckrüden laden...",
                loadFailed: "Laden fehlgeschlagen: ",
                dekReuenComingSoon: "Das Deckrüden-Modul befindet sich in Entwicklung",
                placeholder: "Hier kommt eine Übersicht aller verfügbaren Deckrüden",
                beheerPlaceholder: "Hier kommt die Deckrüden-Verwaltung"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('dekReuenModal')) {
            // Hervertaal modal indien geopend
            this.translateModalContent();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        const canManage = !this.isUser; // Kan beheren als admin of gebruiker+
        
        // Als gebruiker: direct naar overzicht
        // Als admin/gebruiker+: keuze menu
        if (this.isUser) {
            return this.getOverviewModalHTML();
        } else {
            return this.getChoiceModalHTML();
        }
    }
    
    getChoiceModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dekReuenModal" tabindex="-1" aria-labelledby="dekReuenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-secondary text-white">
                            <h5 class="modal-title" id="dekReuenModalLabel">
                                <i class="bi bi-gender-male"></i> ${t('dekReuen')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <h4 class="mb-4">${t('chooseAction')}</h4>
                            
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-secondary hover-shadow" style="cursor: pointer;" id="viewOverviewBtn">
                                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                            <i class="bi bi-gender-male display-1 text-secondary mb-3"></i>
                                            <h5 class="card-title">${t('viewOverview')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success hover-shadow" style="cursor: pointer;" id="manageDekReuenBtn">
                                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                            <i class="bi bi-pencil-square display-1 text-success mb-3"></i>
                                            <h5 class="card-title">${t('manageDekReuen')}</h5>
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
    
    getOverviewModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dekReuenModal" tabindex="-1" aria-labelledby="dekReuenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-secondary text-white">
                            <h5 class="modal-title" id="dekReuenModalLabel">
                                <i class="bi bi-gender-male"></i> ${t('dekReuenOverview')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <!-- DEK REUEN OVERZICHT -->
                            <div class="mt-2">
                                <div id="dekReuenContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-gender-male display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('dekReuenComingSoon')}</p>
                                        <p class="text-muted">${t('placeholder')}</p>
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
    
    getBeheerModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="dekReuenModal" tabindex="-1" aria-labelledby="dekReuenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="dekReuenModalLabel">
                                <i class="bi bi-pencil-square"></i> ${t('dekReuenBeheer')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <!-- DEK REUEN BEHEER -->
                            <div class="mt-2">
                                <div id="dekReuenBeheerContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-pencil-square display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('dekReuenComingSoon')}</p>
                                        <p class="text-muted">${t('beheerPlaceholder')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> Terug
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Toon de Dek Reuen modal
     */
    showModal() {
        console.log('DekReuenManager.showModal() aangeroepen');
        
        // Haal de modal HTML op
        const modalHTML = this.getModalHTML();
        
        // Zoek of maak de modals container
        let modalsContainer = document.getElementById('modalsContainer');
        if (!modalsContainer) {
            modalsContainer = document.createElement('div');
            modalsContainer.id = 'modalsContainer';
            document.body.appendChild(modalsContainer);
        }
        
        // Verwijder bestaande modal
        const existingModal = document.getElementById('dekReuenModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Voeg nieuwe modal toe
        modalsContainer.innerHTML = modalHTML;
        
        // Toon de modal
        const modalElement = document.getElementById('dekReuenModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            
            // Setup event listeners
            this.setupEvents();
            
            modal.show();
            
            console.log('✅ DekReuen modal getoond');
        } else {
            console.error('❌ DekReuen modal element niet gevonden na toevoegen');
        }
    }
    
    setupEvents() {
        // Controleer of dit de keuze modal is
        if (this.isUser) {
            // Gebruiker: alleen overview functionaliteit
            this.setupOverviewEvents();
        } else {
            // Admin/gebruiker+: keuze modal events
            this.setupChoiceEvents();
        }
    }
    
    setupChoiceEvents() {
        const viewOverviewBtn = document.getElementById('viewOverviewBtn');
        const manageDekReuenBtn = document.getElementById('manageDekReuenBtn');
        
        if (viewOverviewBtn) {
            viewOverviewBtn.addEventListener('click', () => {
                this.showOverviewView();
            });
        }
        
        if (manageDekReuenBtn) {
            manageDekReuenBtn.addEventListener('click', () => {
                this.showBeheerView();
            });
        }
        
        this.fixModalClose();
    }
    
    setupOverviewEvents() {
        this.fixModalClose();
    }
    
    setupBeheerEvents() {
        const backBtn = document.getElementById('backToChoiceBtn');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showChoiceView();
            });
        }
        
        this.fixModalClose();
    }
    
    async showOverviewView() {
        // Vervang modal met overview view
        const modal = bootstrap.Modal.getInstance(document.getElementById('dekReuenModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#dekReuenModal').parentElement;
        modalContainer.innerHTML = this.getOverviewModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('dekReuenModal'));
        
        // Setup events voor overview
        this.setupOverviewEvents();
        
        newModal.show();
    }
    
    async showBeheerView() {
        // Vervang modal met beheer view
        const modal = bootstrap.Modal.getInstance(document.getElementById('dekReuenModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#dekReuenModal').parentElement;
        modalContainer.innerHTML = this.getBeheerModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('dekReuenModal'));
        
        // Setup events voor beheer
        this.setupBeheerEvents();
        
        newModal.show();
    }
    
    showChoiceView() {
        // Vervang modal met choice view
        const modal = bootstrap.Modal.getInstance(document.getElementById('dekReuenModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#dekReuenModal').parentElement;
        modalContainer.innerHTML = this.getChoiceModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('dekReuenModal'));
        
        // Setup events voor choice
        this.setupChoiceEvents();
        
        newModal.show();
    }
    
    fixModalClose() {
        const modalElement = document.getElementById('dekReuenModal');
        if (!modalElement) return;
        
        modalElement.addEventListener('hide.bs.modal', () => {
            const closeBtn = modalElement.querySelector('.btn-close:focus');
            if (closeBtn) {
                closeBtn.blur();
            }
            
            const focused = modalElement.querySelector(':focus');
            if (focused) {
                focused.blur();
            }
        });
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => {
                this.cleanupModalAfterClose();
            }, 50);
        });
    }
    
    cleanupModalAfterClose() {
        const openModals = document.querySelectorAll('.modal.show');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        
        if (openModals.length === 0 && backdrops.length > 0) {
            backdrops.forEach(backdrop => {
                backdrop.remove();
            });
            
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }
    
    translateModalContent() {
        const modalElement = document.getElementById('dekReuenModal');
        if (!modalElement) return;
        
        const lang = this.currentLang;
        
        // Gebruik de this.t() methode voor vertalingen
        const elements = modalElement.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            const translation = this.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });
    }
    
    // Helper method voor progress tonen
    showProgress(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-muted">${message}</p>
                </div>
            `;
        }
    }
    
    // Helper method voor progress verbergen
    hideProgress() {
        document.querySelectorAll('.spinner-border').forEach(spinner => {
            spinner.remove();
        });
    }
    
    // Helper method voor foutmelding
    showError(message, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger alert-dismissible fade show';
                alertDiv.innerHTML = `
                    <i class="bi bi-exclamation-triangle"></i> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                container.prepend(alertDiv);
            }
        } else {
            // Fallback naar eerste beschikbare container
            const containers = ['dekReuenContainer', 'dekReuenBeheerContainer'];
            for (const id of containers) {
                const container = document.getElementById(id);
                if (container) {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
                    alertDiv.innerHTML = `
                        <i class="bi bi-exclamation-triangle"></i> ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    container.prepend(alertDiv);
                    break;
                }
            }
        }
    }
    
    // Helper method voor succesmelding
    showSuccess(message, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show';
                alertDiv.innerHTML = `
                    <i class="bi bi-check-circle"></i> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `;
                container.prepend(alertDiv);
                
                setTimeout(() => {
                    alertDiv.remove();
                }, 5000);
            }
        } else {
            // Fallback naar eerste beschikbare container
            const containers = ['dekReuenContainer', 'dekReuenBeheerContainer'];
            for (const id of containers) {
                const container = document.getElementById(id);
                if (container) {
                    const alertDiv = document.createElement('div');
                    alertDiv.className = 'alert alert-success alert-dismissible fade show';
                    alertDiv.innerHTML = `
                        <i class="bi bi-check-circle"></i> ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    container.prepend(alertDiv);
                    
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 5000);
                    break;
                }
            }
        }
    }
    
    /**
     * Injecteer afhankelijkheden (voor consistentie met andere managers)
     * @param {Object} db - Database service
     * @param {Object} auth - Auth service
     */
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
        console.log('Dependencies geïnjecteerd in DekReuenManager');
    }
}

// Maak een globale instantie aan
const DekReuenManagerInstance = new DekReuenManager();

// Exporteer voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DekReuenManagerInstance;
} else {
    // Maak globaal beschikbaar in de browser
    window.DekReuenManager = DekReuenManagerInstance;
    window.dekReuenManager = DekReuenManagerInstance;
}

console.log('📦 DekReuenManager geladen en beschikbaar als window.DekReuenManager');