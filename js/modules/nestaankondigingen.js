// js/modules/NestAankondigingen.js

/**
 * NestAankondigingen Management Module voor Supabase
 * Beheert nest aankondigingen overzicht en beheer
 */

class NestAankondigingenManager extends BaseModule {
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
                nestAnnouncements: "Nest aankondigingen",
                nestAnnouncementsBeheer: "Nest aankondigingen Beheer",
                nestAnnouncementsOverview: "Nest aankondigingen Overzicht",
                chooseAction: "Kies een actie:",
                viewOverview: "Nest aankondigingen Bekijken",
                manageAnnouncements: "Nest aankondigingen Beheren",
                close: "Sluiten",
                noAnnouncements: "Er zijn nog geen nest aankondigingen",
                loading: "Nest aankondigingen laden...",
                loadFailed: "Laden mislukt: ",
                comingSoon: "De Nest aankondigingen module is in ontwikkeling",
                placeholder: "Hier komt een overzicht van alle nest aankondigingen",
                beheerPlaceholder: "Hier komt het beheer van nest aankondigingen"
            },
            en: {
                nestAnnouncements: "Nest Announcements",
                nestAnnouncementsBeheer: "Nest Announcements Management",
                nestAnnouncementsOverview: "Nest Announcements Overview",
                chooseAction: "Choose an action:",
                viewOverview: "View Nest Announcements",
                manageAnnouncements: "Manage Nest Announcements",
                close: "Close",
                noAnnouncements: "No nest announcements yet",
                loading: "Loading nest announcements...",
                loadFailed: "Loading failed: ",
                comingSoon: "The Nest Announcements module is under development",
                placeholder: "Here will be an overview of all nest announcements",
                beheerPlaceholder: "Here will be the nest announcements management"
            },
            de: {
                nestAnnouncements: "Wurfankündigungen",
                nestAnnouncementsBeheer: "Wurfankündigungen Verwaltung",
                nestAnnouncementsOverview: "Wurfankündigungen Übersicht",
                chooseAction: "Wählen Sie eine Aktion:",
                viewOverview: "Wurfankündigungen Ansehen",
                manageAnnouncements: "Wurfankündigungen Verwalten",
                close: "Schließen",
                noAnnouncements: "Noch keine Wurfankündigungen",
                loading: "Wurfankündigungen laden...",
                loadFailed: "Laden fehlgeschlagen: ",
                comingSoon: "Das Wurfankündigungen-Modul befindet sich in Entwicklung",
                placeholder: "Hier kommt eine Übersicht aller Wurfankündigungen",
                beheerPlaceholder: "Hier kommt die Wurfankündigungen-Verwaltung"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('nestAankondigingenModal')) {
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
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1" aria-labelledby="nestAankondigingenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="nestAankondigingenModalLabel">
                                <i class="bi bi-megaphone"></i> ${t('nestAnnouncements')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <h4 class="mb-4">${t('chooseAction')}</h4>
                            
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-primary hover-shadow" style="cursor: pointer;" id="viewOverviewBtn">
                                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                            <i class="bi bi-megaphone display-1 text-primary mb-3"></i>
                                            <h5 class="card-title">${t('viewOverview')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success hover-shadow" style="cursor: pointer;" id="manageAnnouncementsBtn">
                                        <div class="card-body d-flex flex-column align-items-center justify-content-center p-5">
                                            <i class="bi bi-pencil-square display-1 text-success mb-3"></i>
                                            <h5 class="card-title">${t('manageAnnouncements')}</h5>
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
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1" aria-labelledby="nestAankondigingenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="nestAankondigingenModalLabel">
                                <i class="bi bi-megaphone"></i> ${t('nestAnnouncementsOverview')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <!-- NEST AANKONDIGINGEN OVERZICHT -->
                            <div class="mt-2">
                                <div id="nestAankondigingenContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-megaphone display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('comingSoon')}</p>
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
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1" aria-labelledby="nestAankondigingenModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="nestAankondigingenModalLabel">
                                <i class="bi bi-pencil-square"></i> ${t('nestAnnouncementsBeheer')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <!-- NEST AANKONDIGINGEN BEHEER -->
                            <div class="mt-2">
                                <div id="nestAankondigingenBeheerContainer" class="row">
                                    <div class="col-12 text-center py-5">
                                        <i class="bi bi-pencil-square display-1 text-muted"></i>
                                        <p class="mt-3 text-muted">${t('comingSoon')}</p>
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
     * Toon de Nest Aankondigingen modal
     */
    async showModal() {
        console.log('NestAankondigingenManager.showModal() aangeroepen');
        
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
        const existingModal = document.getElementById('nestAankondigingenModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Voeg nieuwe modal toe
        modalsContainer.innerHTML = modalHTML;
        
        // Toon de modal
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            
            // Setup event listeners
            this.setupEvents();
            
            modal.show();
            
            console.log('✅ NestAankondigingen modal getoond');
        } else {
            console.error('❌ NestAankondigingen modal element niet gevonden na toevoegen');
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
        const manageAnnouncementsBtn = document.getElementById('manageAnnouncementsBtn');
        
        if (viewOverviewBtn) {
            viewOverviewBtn.addEventListener('click', () => {
                this.showOverviewView();
            });
        }
        
        if (manageAnnouncementsBtn) {
            manageAnnouncementsBtn.addEventListener('click', () => {
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
        const modal = bootstrap.Modal.getInstance(document.getElementById('nestAankondigingenModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#nestAankondigingenModal').parentElement;
        modalContainer.innerHTML = this.getOverviewModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('nestAankondigingenModal'));
        
        // Setup events voor overview
        this.setupOverviewEvents();
        
        newModal.show();
    }
    
    async showBeheerView() {
        // Vervang modal met beheer view
        const modal = bootstrap.Modal.getInstance(document.getElementById('nestAankondigingenModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#nestAankondigingenModal').parentElement;
        modalContainer.innerHTML = this.getBeheerModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('nestAankondigingenModal'));
        
        // Setup events voor beheer
        this.setupBeheerEvents();
        
        newModal.show();
    }
    
    showChoiceView() {
        // Vervang modal met choice view
        const modal = bootstrap.Modal.getInstance(document.getElementById('nestAankondigingenModal'));
        if (modal) {
            modal.dispose();
        }
        
        const modalContainer = document.querySelector('#nestAankondigingenModal').parentElement;
        modalContainer.innerHTML = this.getChoiceModalHTML();
        
        const newModal = new bootstrap.Modal(document.getElementById('nestAankondigingenModal'));
        
        // Setup events voor choice
        this.setupChoiceEvents();
        
        newModal.show();
    }
    
    fixModalClose() {
        const modalElement = document.getElementById('nestAankondigingenModal');
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
        const modalElement = document.getElementById('nestAankondigingenModal');
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
                    <div class="spinner-border text-primary" role="status">
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
            const containers = ['nestAankondigingenContainer', 'nestAankondigingenBeheerContainer'];
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
            const containers = ['nestAankondigingenContainer', 'nestAankondigingenBeheerContainer'];
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
        console.log('Dependencies geïnjecteerd in NestAankondigingenManager');
    }
}

// Maak een globale instantie aan
const NestAankondigingenManagerInstance = new NestAankondigingenManager();

// Exporteer voor gebruik in andere modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NestAankondigingenManagerInstance;
} else {
    // Maak globaal beschikbaar in de browser
    window.NestAankondigingenManager = NestAankondigingenManagerInstance;
    window.nestAankondigingenManager = NestAankondigingenManagerInstance;
}

console.log('📦 NestAankondigingenManager geladen en beschikbaar als window.NestAankondigingenManager');