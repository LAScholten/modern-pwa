/**
 * Fok Planning Module - Hoofdbestand
 * Beheert fokplannen en nest planning
 */

class BreedingManager {
    constructor() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.db = null;
        this.auth = null;
        this.translations = {
            nl: {
                breedingPlan: "Fok Planning",
                breedingInfo: "Maak en beheer fokplannen voor uw honden. Kies een methode:",
                method1: "1. Reu en Teef Combinatie",
                method1Desc: "Selecteer een specifieke reu en teef voor een fokplan",
                method2: "2. Zoek een Reu",
                method2Desc: "Zoek een geschikte reu voor uw teef op basis van criteria",
                chooseMethod: "Kies een methode",
                cancel: "Annuleren",
                back: "Terug"
            },
            en: {
                breedingPlan: "Breeding Plan",
                breedingInfo: "Create and manage breeding plans for your dogs. Choose a method:",
                method1: "1. Male and Female Combination",
                method1Desc: "Select a specific male and female for a breeding plan",
                method2: "2. Find a Male",
                method2Desc: "Find a suitable male for your female based on criteria",
                chooseMethod: "Choose a method",
                cancel: "Cancel",
                back: "Back"
            },
            de: {
                breedingPlan: "Zuchtplanung",
                breedingInfo: "Erstellen und verwalten Sie Zuchtpläne für Ihre Hunde. Wählen Sie eine Methode:",
                method1: "1. Rüde und Hündin Kombination",
                method1Desc: "Wählen Sie einen bestimmten Rüden und eine Hündin für einen Zuchtplan",
                method2: "2. Finde einen Rüden",
                method2Desc: "Finden Sie einen geeigneten Rüden für Ihre Hündin basierend auf Kriterien",
                chooseMethod: "Wählen Sie eine Methode",
                cancel: "Abbrechen",
                back: "Zurück"
            }
        };
    }
    
    injectDependencies(db, auth) {
        this.db = db;
        this.auth = auth;
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('breedingPlanModal')) {
            this.loadMainScreen();
        }
    }
    
    getModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="breedingPlanModal" tabindex="-1" aria-labelledby="breedingPlanModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-purple text-white">
                            <h5 class="modal-title" id="breedingPlanModalLabel">
                                <i class="bi bi-calendar-heart"></i> ${t('breedingPlan')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Sluiten"></button>
                        </div>
                        <div class="modal-body">
                            <div id="breedingContent">
                                <!-- Hier komt de inhoud van de gekozen module -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div id="breedingButtons">
                                <!-- Knoppen worden dynamisch geladen -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    setupEvents() {
        // Event handlers worden dynamisch ingesteld
    }
    
    async loadMainScreen() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        content.innerHTML = `
            <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle"></i>
                ${t('breedingInfo')}
            </div>
            
            <div class="row g-4">
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body text-center p-4">
                            <div class="mb-3">
                                <i class="bi bi-gender-male-female text-purple" style="font-size: 3rem;"></i>
                            </div>
                            <h5 class="card-title">${t('method1')}</h5>
                            <p class="card-text text-muted">${t('method1Desc')}</p>
                            <button class="btn btn-purple mt-3" id="method1Btn">
                                <i class="bi bi-arrow-right"></i> ${t('method1')}
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card h-100">
                        <div class="card-body text-center p-4">
                            <div class="mb-3">
                                <i class="bi bi-search text-purple" style="font-size: 3rem;"></i>
                            </div>
                            <h5 class="card-title">${t('method2')}</h5>
                            <p class="card-text text-muted">${t('method2Desc')}</p>
                            <button class="btn btn-purple mt-3" id="method2Btn">
                                <i class="bi bi-arrow-right"></i> ${t('method2')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <small class="text-muted">${t('chooseMethod')}</small>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
        `;
        
        // Event handlers instellen
        document.getElementById('method1Btn').addEventListener('click', () => {
            this.loadReuTeefCombinatie();
        });
        
        document.getElementById('method2Btn').addEventListener('click', () => {
            this.loadZoekReu();
        });
    }
    
    async loadReuTeefCombinatie() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Laden...</span>
                </div>
                <p class="mt-3">Reu en Teef Combinatie module wordt geladen...</p>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backToMainBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
        `;
        
        document.getElementById('backToMainBtn').addEventListener('click', () => {
            this.loadMainScreen();
        });
        
        // Laad de ReuTeefCombinatie module
        try {
            const module = new ReuTeefCombinatie();
            module.injectDependencies(this.db, this.auth);
            await module.loadContent();
            
        } catch (error) {
            console.error('Fout bij laden ReuTeefCombinatie:', error);
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    Kon de Reu en Teef Combinatie module niet laden. Probeer het opnieuw.
                    <br><small>${error.message}</small>
                </div>
            `;
        }
    }
    
    async loadZoekReu() {
        const t = this.t.bind(this);
        const content = document.getElementById('breedingContent');
        const buttons = document.getElementById('breedingButtons');
        
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Laden...</span>
                </div>
                <p class="mt-3">Zoek Reu module wordt geladen...</p>
            </div>
        `;
        
        buttons.innerHTML = `
            <button type="button" class="btn btn-secondary" id="backToMainBtn">
                <i class="bi bi-arrow-left"></i> ${t('back')}
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('cancel')}</button>
        `;
        
        document.getElementById('backToMainBtn').addEventListener('click', () => {
            this.loadMainScreen();
        });
        
        // Laad de ZoekReu module
        try {
            const module = new ZoekReu();
            module.injectDependencies(this.db, this.auth);
            await module.loadContent();
            
        } catch (error) {
            console.error('Fout bij laden ZoekReu:', error);
            content.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    Kon de Zoek Reu module niet laden. Probeer het opnieuw.
                    <br><small>${error.message}</small>
                </div>
            `;
        }
    }
    
    async loadBreedingData() {
        // Laad het hoofdscherm
        await this.loadMainScreen();
    }
}
