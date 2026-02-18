// js/modules/NestAankondigingen.js

/**
 * NestAankondigingen Management Module voor Supabase
 * Beheert nest aankondigingen overzicht en beheer
 * MET GEZONDHEIDSINFO VAN BEIDE OUDERS IN OVERZICHT (zelfde als DekReuen)
 * Ouders naast elkaar met gezondheidsinfo in exact de gewenste indeling
 * 
 * UPDATE: Toont 1 aankondiging per pagina met paginatie bovenaan
 * UPDATE 2: Tekst in cards kleiner gemaakt (70% van origineel)
 * UPDATE 3: Paginatiebalkje 80% van originele grootte
 */

class NestAankondigingenManager extends BaseModule {
    constructor() {
        super();
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.userRole = localStorage.getItem('userRole') || 'gebruiker';
        this.isAdmin = this.userRole === 'admin';
        this.isUser = this.userRole === 'gebruiker';
        this.isUserPlus = this.userRole === 'gebruiker+';
        this.currentView = 'overview';
        
        // Paginatie variabelen - 1 item per pagina
        this.currentPage = 1;
        this.pageSize = 1;
        this.totalAnnouncements = 0;
        
        // Voor autocomplete van honden
        this.allDogs = [];
        this.db = window.hondenService;
        this.auth = window.auth;
        this.supabase = null;
        
        // Bewerken variabelen
        this.editingAnnouncementId = null;
        this.editingAnnouncementData = null;
        
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
                addAnnouncement: "Nest Aankondiging Toevoegen",
                editAnnouncement: "Nest Aankondiging Bewerken",
                father: "Vader (Reu) *",
                mother: "Moeder (Teef) *",
                kennelName: "Kennelnaam *",
                kennelNamePlaceholder: "Naam van uw kennel",
                description: "Beschrijving",
                email: "Email (voor contact)",
                save: "Opslaan",
                cancel: "Annuleren",
                delete: "Verwijderen",
                confirmDelete: "Weet je zeker dat je deze nest aankondiging wilt verwijderen?",
                parentNotSelected: "Selecteer een geldige hond uit de lijst",
                announcementAdded: "Nest aankondiging succesvol toegevoegd!",
                announcementUpdated: "Nest aankondiging succesvol bijgewerkt!",
                announcementAddFailed: "Fout bij toevoegen: ",
                announcementUpdateFailed: "Fout bij bijwerken: ",
                announcementDeleteFailed: "Fout bij verwijderen: ",
                searchDogs: "Begin met typen om te zoeken...",
                from: "Van",
                date: "Datum",
                noDescription: "Geen beschrijving",
                fatherInfo: "Vader",
                motherInfo: "Moeder",
                back: "Terug",
                noPermission: "Je hebt geen rechten om deze actie uit te voeren",
                announcementFrom: "Aankondiging van",
                
                // Gezondheidsitems
                healthData: "Gezondheidsgegevens",
                hd: "HD",
                ed: "ED",
                patella: "Patella",
                eyes: "Ogen",
                eyesExplanation: "Toelichting ogen",
                dandyWalker: "Dandy Walker",
                thyroid: "Schildklier",
                thyroidExplanation: "Toelichting schildklier",
                notSpecified: "Niet opgegeven",
                country: "Land",
                free: "Vrij",
                
                // Paginatie
                prevPage: "Vorige",
                nextPage: "Volgende",
                pageInfo: "Pagina {page} van {totalPages}",
                showingResults: "Aankondiging {start} van {total}"
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
                addAnnouncement: "Add Nest Announcement",
                editAnnouncement: "Edit Nest Announcement",
                father: "Father (Male) *",
                mother: "Mother (Female) *",
                kennelName: "Kennel name *",
                kennelNamePlaceholder: "Your kennel name",
                description: "Description",
                email: "Email (for contact)",
                save: "Save",
                cancel: "Cancel",
                delete: "Delete",
                confirmDelete: "Are you sure you want to delete this nest announcement?",
                parentNotSelected: "Select a valid dog from the list",
                announcementAdded: "Nest announcement added successfully!",
                announcementUpdated: "Nest announcement updated successfully!",
                announcementAddFailed: "Error adding: ",
                announcementUpdateFailed: "Error updating: ",
                announcementDeleteFailed: "Error deleting: ",
                searchDogs: "Start typing to search...",
                from: "From",
                date: "Date",
                noDescription: "No description",
                fatherInfo: "Father",
                motherInfo: "Mother",
                back: "Back",
                noPermission: "You don't have permission to perform this action",
                announcementFrom: "Announcement from",
                
                // Health items
                healthData: "Health Data",
                hd: "HD",
                ed: "ED",
                patella: "Patella",
                eyes: "Eyes",
                eyesExplanation: "Eyes explanation",
                dandyWalker: "Dandy Walker",
                thyroid: "Thyroid",
                thyroidExplanation: "Thyroid explanation",
                notSpecified: "Not specified",
                country: "Country",
                free: "Free",
                
                // Pagination
                prevPage: "Previous",
                nextPage: "Next",
                pageInfo: "Page {page} of {totalPages}",
                showingResults: "Announcement {start} of {total}"
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
                addAnnouncement: "Wurfankündigung Hinzufügen",
                editAnnouncement: "Wurfankündigung Bearbeiten",
                father: "Vater (Rüde) *",
                mother: "Mutter (Hündin) *",
                kennelName: "Zwinger name *",
                kennelNamePlaceholder: "Ihr Zwinger name",
                description: "Beschreibung",
                email: "Email (für Kontakt)",
                save: "Speichern",
                cancel: "Abbrechen",
                delete: "Löschen",
                confirmDelete: "Sind Sie sicher, dass Sie diese Wurfankündigung löschen möchten?",
                parentNotSelected: "Wählen Sie einen gültigen Hund aus der Liste",
                announcementAdded: "Wurfankündigung erfolgreich hinzugefügt!",
                announcementUpdated: "Wurfankündigung erfolgreich aktualisiert!",
                announcementAddFailed: "Fehler beim Hinzufügen: ",
                announcementUpdateFailed: "Fehler beim Aktualisieren: ",
                announcementDeleteFailed: "Fehler beim Löschen: ",
                searchDogs: "Beginnen Sie mit der Eingabe...",
                from: "Von",
                date: "Datum",
                noDescription: "Keine Beschreibung",
                fatherInfo: "Vater",
                motherInfo: "Mutter",
                back: "Zurück",
                noPermission: "Sie haben keine Berechtigung für diese Aktion",
                announcementFrom: "Ankündigung von",
                
                // Health items
                healthData: "Gesundheitsdaten",
                hd: "HD",
                ed: "ED",
                patella: "Patella",
                eyes: "Augen",
                eyesExplanation: "Augenerklärung",
                dandyWalker: "Dandy Walker",
                thyroid: "Schilddrüse",
                thyroidExplanation: "Schilddrüsenerklärung",
                notSpecified: "Nicht angegeben",
                country: "Land",
                free: "Frei",
                
                // Pagination
                prevPage: "Vorherige",
                nextPage: "Nächste",
                pageInfo: "Seite {page} von {totalPages}",
                showingResults: "Ankündigung {start} von {total}"
            }
        };
    }
    
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    /**
     * Simpele functie om de Supabase client te krijgen
     */
    getSupabase() {
        if (this.supabase) return this.supabase;
        if (window.supabaseClient) {
            this.supabase = window.supabaseClient;
            return this.supabase;
        }
        if (window.supabase) {
            this.supabase = window.supabase;
            return this.supabase;
        }
        return null;
    }
    
    updateLanguage(lang) {
        this.currentLang = lang;
        if (document.getElementById('nestAankondigingenModal')) {
            this.translateModalContent();
        }
    }
    
    /**
     * Toon de Nest Aankondigingen modal
     */
    async showModal() {
        console.log('NestAankondigingenManager.showModal() aangeroepen');
        
        const supabase = this.getSupabase();
        if (!supabase) {
            alert('Geen verbinding met database');
            return;
        }
        
        this.supabase = supabase;
        
        const { data: { user } } = await supabase.auth.getUser();
        this.currentUser = user;
        console.log('Gebruiker:', user?.email);
        
        // Laad alle honden voor autocomplete
        await this.loadAllDogs();
        
        this.currentPage = 1;
        this.currentView = 'overview';
        this.editingAnnouncementId = null;
        this.editingAnnouncementData = null;
        
        // Haal de modal HTML op
        const modalHTML = this.getChoiceModalHTML();
        
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
            this.setupChoiceEvents();
            
            modal.show();
            
            console.log('✅ NestAankondigingen modal getoond');
        } else {
            console.error('❌ NestAankondigingen modal element niet gevonden na toevoegen');
        }
    }
    
    getChoiceModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-megaphone"></i> ${t('nestAnnouncements')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-5">
                            <h4 class="mb-4">${t('chooseAction')}</h4>
                            
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="card h-100 border-primary hover-shadow" style="cursor: pointer;" id="viewOverviewBtn">
                                        <div class="card-body p-5">
                                            <i class="bi bi-megaphone display-1 text-primary mb-3"></i>
                                            <h5>${t('viewOverview')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card h-100 border-success hover-shadow" style="cursor: pointer;" id="manageAnnouncementsBtn">
                                        <div class="card-body p-5">
                                            <i class="bi bi-pencil-square display-1 text-success mb-3"></i>
                                            <h5>${t('manageAnnouncements')}</h5>
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
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-megaphone"></i> ${t('nestAnnouncementsOverview')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- PAGINATIE BOVENAAN - 80% van normale grootte -->
                            <div id="paginationTopContainer" class="mb-2 pagination-sm-container"></div>
                            
                            <!-- Container voor de aankondiging -->
                            <div id="nestAankondigingenContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-primary"></div>
                                    <p class="mt-3 text-muted">${t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> ${t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- CSS voor de gezondheidsinfo layout en kleinere tekst -->
            <style>
                /* Algemene card tekst verkleining naar 70% */
                .announcement-card {
                    font-size: 0.7rem;
                }
                
                /* Hondenamen blijven normale grootte (1rem = 100%) */
                .announcement-card .dog-name {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                /* Pedigree nummer ook normale grootte */
                .announcement-card .pedigree-number {
                    color: #6c757d;
                    font-size: 0.95rem;
                }
                
                /* Health items */
                .health-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    width: 100%;
                }
                
                .health-row-2col {
                    display: flex !important;
                    gap: 15px;
                    width: 100%;
                }
                
                .health-row-2col .health-item {
                    flex: 1;
                    min-width: 0;
                }
                
                .health-row {
                    width: 100%;
                }
                
                .health-item {
                    line-height: 1.4;
                }
                
                .health-label {
                    font-weight: 500;
                    color: #495057;
                    display: inline-block;
                    min-width: 70px;
                }
                
                .health-value {
                    font-weight: 500;
                    color: #212529;
                }
                
                .explanation-item {
                    margin-top: 6px;
                    padding: 4px 8px;
                    background-color: #fff3cd;
                    border-radius: 4px;
                    border: 1px solid #ffeeba;
                    font-size: 0.65rem;
                }
                
                .father-header {
                    background-color: #cce5ff;
                    color: #004085;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                
                .mother-header {
                    background-color: #d4edda;
                    color: #155724;
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.8rem;
                }
                
                /* Card header ook verkleind */
                .announcement-card .card-header {
                    padding: 0.5rem 1rem;
                }
                
                .announcement-card .card-header h5 {
                    font-size: 0.9rem;
                }
                
                /* Card body padding verkleind */
                .announcement-card .card-body {
                    padding: 1rem;
                }
                
                /* Beschrijving tekst */
                .announcement-card .bg-light {
                    padding: 0.5rem !important;
                    font-size: 0.7rem;
                }
                
                /* Email en datum */
                .announcement-card .text-muted.small {
                    font-size: 0.65rem !important;
                }
                
                /* PAGINATIE - 80% van normale grootte */
                .pagination-sm-container .pagination {
                    --bs-pagination-font-size: 0.8rem;
                    --bs-pagination-padding-x: 0.5rem;
                    --bs-pagination-padding-y: 0.25rem;
                }
                
                .pagination-sm-container .pagination-info {
                    font-size: 0.8rem;
                }
                
                .pagination-sm-container .page-link {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                }
                
                @media (max-width: 768px) {
                    .health-row-2col {
                        flex-direction: column;
                        gap: 2px;
                    }
                    
                    .announcement-card .dog-name {
                        font-size: 0.9rem;
                    }
                }
            </style>
        `;
    }
    
    getBeheerModalHTML() {
        const t = this.t.bind(this);
        
        return `
            <div class="modal fade" id="nestAankondigingenModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-pencil-square"></i> ${t('nestAnnouncementsBeheer')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <button class="btn btn-success" id="addAnnouncementBtn">
                                    <i class="bi bi-plus-circle"></i> ${t('addAnnouncement')}
                                </button>
                            </div>
                            <div id="nestAankondigingenBeheerContainer" class="row">
                                <div class="col-12 text-center py-5">
                                    <div class="spinner-border text-secondary"></div>
                                    <p class="mt-3 text-muted">${t('loading')}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${t('close')}</button>
                            <button type="button" class="btn btn-secondary" id="backToChoiceBtn">
                                <i class="bi bi-arrow-left"></i> ${t('back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Modal voor toevoegen/bewerken
     */
    getAddEditModalHTML(mode = 'add') {
        const title = mode === 'add' ? this.t('addAnnouncement') : this.t('editAnnouncement');
        const icon = mode === 'add' ? 'bi-plus-circle' : 'bi-pencil-square';
        const saveButtonText = mode === 'add' ? this.t('save') : this.t('edit');
        const saveButtonIcon = mode === 'add' ? 'bi-check-circle' : 'bi-pencil-square';
        
        return `
            <div class="modal fade" id="addEditNestModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title">
                                <i class="bi ${icon}"></i> ${title}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="nestAnnouncementForm">
                                <input type="hidden" id="nest_id" value="">
                                <input type="hidden" id="vader_id" value="">
                                <input type="hidden" id="moeder_id" value="">
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="father" class="form-label">${this.t('father')}</label>
                                        <div class="parent-input-wrapper" style="position: relative;">
                                            <input type="text" class="form-control" id="father" 
                                                   placeholder="${this.t('searchDogs')}"
                                                   data-parent-type="father"
                                                   autocomplete="off"
                                                   data-valid-parent="false"
                                                   ${mode === 'edit' ? 'readonly' : 'required'}>
                                            <div id="fatherError" class="error-message" style="display: none; color: #dc3545; font-size: 0.875em;"></div>
                                            ${mode === 'edit' ? '<small class="text-muted d-block mt-2">De ouders kunnen niet worden gewijzigd bij bewerken</small>' : ''}
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="mother" class="form-label">${this.t('mother')}</label>
                                        <div class="parent-input-wrapper" style="position: relative;">
                                            <input type="text" class="form-control" id="mother" 
                                                   placeholder="${this.t('searchDogs')}"
                                                   data-parent-type="mother"
                                                   autocomplete="off"
                                                   data-valid-parent="false"
                                                   ${mode === 'edit' ? 'readonly' : 'required'}>
                                            <div id="motherError" class="error-message" style="display: none; color: #dc3545; font-size: 0.875em;"></div>
                                            ${mode === 'edit' ? '<small class="text-muted d-block mt-2">De ouders kunnen niet worden gewijzigd bij bewerken</small>' : ''}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="kennelName" class="form-label">${this.t('kennelName')}</label>
                                    <input type="text" class="form-control" id="kennelName" 
                                           placeholder="${this.t('kennelNamePlaceholder')}" 
                                           maxlength="100" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="email" class="form-label">${this.t('email')}</label>
                                    <input type="email" class="form-control" id="email" placeholder="email@voorbeeld.nl">
                                </div>
                                
                                <div class="mb-3">
                                    <label for="description" class="form-label">${this.t('description')}</label>
                                    <textarea class="form-control" id="description" rows="4" placeholder="Verdere informatie over het nest..."></textarea>
                                </div>
                            </form>
                            
                            <div id="saveStatus" class="mt-2"></div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('cancel')}</button>
                            <button type="button" class="btn btn-success" id="saveNestAnnouncementBtn">
                                <i class="bi ${saveButtonIcon}"></i> ${saveButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .autocomplete-dropdown {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 9999;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    width: 100%;
                }
                
                .autocomplete-item {
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #f0f0f0;
                }
                
                .autocomplete-item:hover {
                    background-color: #f8f9fa;
                }
                
                .autocomplete-item .dog-name {
                    font-weight: bold;
                }
                
                .autocomplete-item .dog-info {
                    font-size: 0.85em;
                    color: #666;
                }
                
                .parent-validation-error {
                    border-color: #dc3545 !important;
                }
            </style>
        `;
    }
    
    async loadAllDogs() {
        console.log('NestAankondigingenManager: loadAllDogs aangeroepen');
        
        if (!this.db) {
            console.error('Database niet beschikbaar!');
            return;
        }
        
        try {
            this.allDogs = [];
            
            let currentPage = 1;
            const pageSize = 1000;
            let hasMorePages = true;
            
            while (hasMorePages) {
                const result = await this.db.getHonden(currentPage, pageSize);
                
                if (result.honden && result.honden.length > 0) {
                    this.allDogs = this.allDogs.concat(result.honden);
                    hasMorePages = result.heeftVolgende;
                    currentPage++;
                    
                    await new Promise(resolve => setTimeout(resolve, 100));
                } else {
                    hasMorePages = false;
                }
            }
            
            // Sorteer op naam
            this.allDogs.sort((a, b) => {
                const naamA = a.naam || '';
                const naamB = b.naam || '';
                return naamA.localeCompare(naamB);
            });
            
            console.log(`${this.allDogs.length} honden geladen voor autocomplete`);
            
        } catch (error) {
            console.error('Fout bij laden honden:', error);
            this.allDogs = [];
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
        const backBtn = document.getElementById('backToChoiceBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showChoiceView();
            });
        }
        
        this.fixModalClose();
    }
    
    setupBeheerEvents() {
        console.log('Setup beheer events');
        
        const backBtn = document.getElementById('backToChoiceBtn');
        const addBtn = document.getElementById('addAnnouncementBtn');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showChoiceView();
            });
        }
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddAnnouncementModal();
            });
        }
        
        this.fixModalClose();
    }
    
    /**
     * Toon modal om nest aankondiging toe te voegen
     */
    async showAddAnnouncementModal() {
        try {
            console.log('Show add announcement modal');
            
            const modalHTML = this.getAddEditModalHTML('add');
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('addEditNestModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('addEditNestModal');
            const modal = new bootstrap.Modal(modalElement);
            
            this.editingAnnouncementId = null;
            this.editingAnnouncementData = null;
            
            this.setupParentAutocomplete();
            
            document.getElementById('saveNestAnnouncementBtn')?.addEventListener('click', () => this.saveAnnouncement());
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.editingAnnouncementId = null;
                this.editingAnnouncementData = null;
            });
            
        } catch (error) {
            console.error('Fout:', error);
            alert('Fout bij laden: ' + error.message);
        }
    }
    
    /**
     * Toon modal om nest aankondiging te bewerken
     */
    async showEditAnnouncementModal(announcement) {
        try {
            console.log('Show edit announcement modal', announcement);
            
            this.editingAnnouncementId = announcement.id;
            this.editingAnnouncementData = announcement;
            
            const modalHTML = this.getAddEditModalHTML('edit');
            
            let modalsContainer = document.getElementById('modalsContainer');
            const existingModal = document.getElementById('addEditNestModal');
            if (existingModal) existingModal.remove();
            
            modalsContainer.insertAdjacentHTML('beforeend', modalHTML);
            
            const modalElement = document.getElementById('addEditNestModal');
            const modal = new bootstrap.Modal(modalElement);
            
            await this.populateEditForm(announcement);
            
            document.getElementById('saveNestAnnouncementBtn')?.addEventListener('click', () => this.saveAnnouncement());
            
            modal.show();
            
            modalElement.addEventListener('hidden.bs.modal', () => {
                modalElement.remove();
                this.editingAnnouncementId = null;
                this.editingAnnouncementData = null;
            });
            
        } catch (error) {
            console.error('Fout bij tonen bewerk modal:', error);
            alert('Fout bij laden nest aankondiging: ' + error.message);
        }
    }
    
    /**
     * Vul bewerk formulier met bestaande data
     */
    async populateEditForm(announcement) {
        try {
            document.getElementById('nest_id').value = announcement.id || '';
            
            // Vader gegevens ophalen
            if (announcement.vader_id) {
                const vader = this.allDogs.find(d => d.id === announcement.vader_id);
                if (vader) {
                    const fatherInput = document.getElementById('father');
                    const vaderIdInput = document.getElementById('vader_id');
                    
                    if (fatherInput) {
                        const displayName = vader.kennelnaam ? `${vader.naam} ${vader.kennelnaam}` : vader.naam;
                        fatherInput.value = displayName;
                    }
                    if (vaderIdInput) {
                        vaderIdInput.value = vader.id;
                    }
                }
            }
            
            // Moeder gegevens ophalen
            if (announcement.moeder_id) {
                const moeder = this.allDogs.find(d => d.id === announcement.moeder_id);
                if (moeder) {
                    const motherInput = document.getElementById('mother');
                    const moederIdInput = document.getElementById('moeder_id');
                    
                    if (motherInput) {
                        const displayName = moeder.kennelnaam ? `${moeder.naam} ${moeder.kennelnaam}` : moeder.naam;
                        motherInput.value = displayName;
                    }
                    if (moederIdInput) {
                        moederIdInput.value = moeder.id;
                    }
                }
            }
            
            // Kennelnaam invullen
            const kennelNameField = document.getElementById('kennelName');
            if (kennelNameField) {
                kennelNameField.value = announcement.kennelnaam_nest || '';
            }
            
            const emailField = document.getElementById('email');
            if (emailField) {
                emailField.value = announcement.email || '';
            }
            
            const descriptionField = document.getElementById('description');
            if (descriptionField) {
                descriptionField.value = announcement.beschrijving || '';
            }
            
        } catch (error) {
            console.error('Fout bij vullen bewerk formulier:', error);
        }
    }
    
    setupParentAutocomplete() {
        console.log('Setup autocomplete voor ouders');
        
        // Verwijder bestaande dropdowns
        document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
            dropdown.remove();
        });
        
        // Maak dropdown containers
        const fatherInputWrapper = document.querySelector('#father')?.closest('.parent-input-wrapper');
        const motherInputWrapper = document.querySelector('#mother')?.closest('.parent-input-wrapper');
        
        if (fatherInputWrapper) {
            const fatherDropdown = document.createElement('div');
            fatherDropdown.className = 'autocomplete-dropdown';
            fatherDropdown.id = 'fatherDropdown';
            fatherDropdown.style.display = 'none';
            fatherInputWrapper.appendChild(fatherDropdown);
        }
        
        if (motherInputWrapper) {
            const motherDropdown = document.createElement('div');
            motherDropdown.className = 'autocomplete-dropdown';
            motherDropdown.id = 'motherDropdown';
            motherDropdown.style.display = 'none';
            motherInputWrapper.appendChild(motherDropdown);
        }
        
        // Event listeners alleen voor niet-readonly inputs
        document.querySelectorAll('.parent-input-wrapper input:not([readonly])').forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const parentType = input.id === 'father' ? 'father' : 'mother';
                this.showParentAutocomplete(searchTerm, parentType);
            });
            
            input.addEventListener('blur', (e) => {
                setTimeout(() => {
                    const dropdown = document.getElementById(`${input.id}Dropdown`);
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                    this.validateParents();
                }, 200);
            });
            
            input.addEventListener('focus', () => {
                input.classList.remove('parent-validation-error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.parent-input-wrapper')) {
                document.querySelectorAll('.autocomplete-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }
    
    showParentAutocomplete(searchTerm, parentType) {
        const dropdown = document.getElementById(`${parentType}Dropdown`);
        if (!dropdown) return;
        
        if (!searchTerm || searchTerm.length < 1) {
            dropdown.style.display = 'none';
            return;
        }
        
        const suggestions = this.allDogs.filter(dog => {
            const dogName = dog.naam ? dog.naam.toLowerCase() : '';
            const kennelName = dog.kennelnaam ? dog.kennelnaam.toLowerCase() : '';
            const combined = `${dogName} ${kennelName}`;
            const matchesSearch = combined.includes(searchTerm.toLowerCase()) || combined.startsWith(searchTerm.toLowerCase());
            
            if (parentType === 'father') {
                return matchesSearch && dog.geslacht === 'reuen';
            } else {
                return matchesSearch && dog.geslacht === 'teven';
            }
        }).slice(0, 8);
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        let html = '';
        suggestions.forEach(dog => {
            const displayName = dog.kennelnaam ? `${dog.naam} ${dog.kennelnaam}` : dog.naam;
            html += `
                <div class="autocomplete-item" data-id="${dog.id}" data-name="${dog.naam}" data-kennel="${dog.kennelnaam || ''}" data-pedigree="${dog.stamboomnr || ''}" data-ras="${dog.ras || ''}">
                    <div class="dog-name">${displayName}</div>
                    <div class="dog-info">
                        ${dog.ras || 'Onbekend ras'} | ${dog.stamboomnr || 'Geen stamboom'}
                    </div>
                </div>
            `;
        });
        
        dropdown.innerHTML = html;
        dropdown.style.display = 'block';
        
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dogId = item.getAttribute('data-id');
                const dogName = item.getAttribute('data-name');
                const dogKennel = item.getAttribute('data-kennel');
                const input = document.getElementById(parentType);
                const idInput = parentType === 'father' ? document.getElementById('vader_id') : document.getElementById('moeder_id');
                
                const displayName = dogKennel ? `${dogName} ${dogKennel}` : dogName;
                
                console.log(`Selected ${parentType}:`, dogId, displayName);
                
                if (input) {
                    input.value = displayName;
                    input.setAttribute('data-valid-parent', 'true');
                    input.classList.remove('parent-validation-error');
                    
                    const errorElement = document.getElementById(`${parentType}Error`);
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
                if (idInput) {
                    idInput.value = dogId;
                }
                
                dropdown.style.display = 'none';
            });
        });
    }
    
    validateParents() {
        const t = this.t.bind(this);
        const fatherInput = document.getElementById('father');
        const motherInput = document.getElementById('mother');
        const fatherError = document.getElementById('fatherError');
        const motherError = document.getElementById('motherError');
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        
        // Als inputs readonly zijn (bij bewerken), altijd valide
        if (fatherInput?.hasAttribute('readonly') && motherInput?.hasAttribute('readonly')) {
            return true;
        }
        
        let isValid = true;
        
        if (fatherInput && !fatherInput.hasAttribute('readonly')) {
            fatherInput.classList.remove('parent-validation-error');
            fatherInput.setAttribute('data-valid-parent', 'false');
        }
        if (motherInput && !motherInput.hasAttribute('readonly')) {
            motherInput.classList.remove('parent-validation-error');
            motherInput.setAttribute('data-valid-parent', 'false');
        }
        if (fatherError) fatherError.style.display = 'none';
        if (motherError) motherError.style.display = 'none';
        
        // Check vader
        if (fatherInput && !fatherInput.hasAttribute('readonly') && fatherInput.value.trim()) {
            const hasValidId = vaderIdInput && vaderIdInput.value && !isNaN(parseInt(vaderIdInput.value));
            
            if (!hasValidId) {
                fatherInput.classList.add('parent-validation-error');
                if (fatherError) {
                    fatherError.textContent = t('parentNotSelected');
                    fatherError.style.display = 'block';
                }
                isValid = false;
            } else {
                fatherInput.setAttribute('data-valid-parent', 'true');
            }
        }
        
        // Check moeder
        if (motherInput && !motherInput.hasAttribute('readonly') && motherInput.value.trim()) {
            const hasValidId = moederIdInput && moederIdInput.value && !isNaN(parseInt(moederIdInput.value));
            
            if (!hasValidId) {
                motherInput.classList.add('parent-validation-error');
                if (motherError) {
                    motherError.textContent = t('parentNotSelected');
                    motherError.style.display = 'block';
                }
                isValid = false;
            } else {
                motherInput.setAttribute('data-valid-parent', 'true');
            }
        }
        
        return isValid;
    }
    
    async saveAnnouncement() {
        console.log('Save announcement...');
        
        const supabase = this.getSupabase();
        if (!supabase) {
            this.showStatus('Geen database verbinding', 'danger');
            return;
        }
        
        const vaderIdInput = document.getElementById('vader_id');
        const moederIdInput = document.getElementById('moeder_id');
        const kennelNameInput = document.getElementById('kennelName');
        
        const vaderId = vaderIdInput?.value;
        const moederId = moederIdInput?.value;
        const kennelnaam_nest = kennelNameInput?.value.trim();
        
        if (!vaderId || !moederId) {
            this.showStatus('Vader en moeder zijn verplicht', 'danger');
            return;
        }
        
        if (!kennelnaam_nest) {
            this.showStatus('Kennelnaam is verplicht', 'danger');
            return;
        }
        
        // Converteer naar integers
        const vaderIdInt = parseInt(vaderId);
        const moederIdInt = parseInt(moederId);
        
        if (isNaN(vaderIdInt) || isNaN(moederIdInt)) {
            this.showStatus('Ongeldige ID waarden', 'danger');
            return;
        }
        
        const email = document.getElementById('email')?.value;
        const beschrijving = document.getElementById('description')?.value;
        
        // Haal huidige gebruiker op
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        
        if (!userId) {
            this.showStatus('Niet ingelogd', 'danger');
            return;
        }
        
        // Data voor opslag
        const data = {
            vader_id: vaderIdInt,
            moeder_id: moederIdInt,
            toegevoegd_door: userId,
            kennelnaam_nest: kennelnaam_nest,
            email: email || null,
            beschrijving: beschrijving || null
        };
        
        console.log('Data to save:', data);
        
        try {
            this.showStatus('Bezig met opslaan...', 'info');
            
            let result, error;
            
            if (this.editingAnnouncementId) {
                // Update bestaande
                ({ data: result, error } = await supabase
                    .from('litters')
                    .update(data)
                    .eq('id', this.editingAnnouncementId)
                    .select());
                    
                if (error) throw error;
                this.showStatus(this.t('announcementUpdated'), 'success');
            } else {
                // Insert nieuwe
                ({ data: result, error } = await supabase
                    .from('litters')
                    .insert([data])
                    .select());
                    
                if (error) {
                    console.error('Supabase error:', error);
                    throw error;
                }
                this.showStatus(this.t('announcementAdded'), 'success');
            }
            
            console.log('Opgeslagen:', result);
            
            // Reset form
            document.getElementById('nestAnnouncementForm')?.reset();
            if (vaderIdInput) vaderIdInput.value = '';
            if (moederIdInput) moederIdInput.value = '';
            
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addEditNestModal'));
                if (modal) modal.hide();
                
                // Ververs de beheer lijst
                this.loadAnnouncementsForBeheer(1);
            }, 2000);
            
        } catch (error) {
            console.error('Fout bij opslaan:', error);
            this.showStatus((this.editingAnnouncementId ? this.t('announcementUpdateFailed') : this.t('announcementAddFailed')) + error.message, 'danger');
        }
    }
    
    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('saveStatus');
        if (statusDiv) {
            statusDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            
            if (type !== 'info') {
                setTimeout(() => {
                    statusDiv.innerHTML = '';
                }, 5000);
            }
        }
    }
    
    /**
     * Laad nest aankondigingen voor overzicht met paginatie
     * Toont 1 aankondiging per pagina
     */
    async loadAnnouncements(page = 1) {
        const container = document.getElementById('nestAankondigingenContainer');
        const paginationTopContainer = document.getElementById('paginationTopContainer');
        
        if (!container) return;
        
        try {
            const supabase = this.getSupabase();
            
            const from = (page - 1) * this.pageSize;
            const to = from + this.pageSize - 1;
            
            const { data: announcements, error, count } = await supabase
                .from('litters')
                .select('*', { count: 'exact' })
                .order('aangemaakt_op', { ascending: false })
                .range(from, to);
            
            if (error) throw error;
            
            this.totalAnnouncements = count || 0;
            
            if (!announcements || announcements.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-megaphone display-1 text-muted"></i>
                        <p class="mt-3 text-muted">${this.t('noAnnouncements')}</p>
                    </div>
                `;
                if (paginationTopContainer) paginationTopContainer.innerHTML = '';
                return;
            }
            
            // Render eerst de paginatie bovenaan
            const totalPages = Math.ceil(this.totalAnnouncements / this.pageSize);
            const paginationHTML = this.getPaginationHTML(this.totalAnnouncements, page, totalPages, false);
            
            if (paginationTopContainer) {
                paginationTopContainer.innerHTML = paginationHTML;
            }
            
            // Render de aankondiging (slechts 1)
            await this.renderOverviewList(announcements, container, this.totalAnnouncements, page);
            
        } catch (error) {
            console.error('Fout bij laden aankondigingen:', error);
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
                    <p class="mt-3 text-danger">${this.t('loadFailed')}${error.message}</p>
                </div>
            `;
        }
    }
    
    /**
     * Laad nest aankondigingen voor beheer met paginatie
     * Alleen eigen aankondigingen voor niet-admin gebruikers
     */
    async loadAnnouncementsForBeheer(page = 1) {
        const container = document.getElementById('nestAankondigingenBeheerContainer');
        if (!container) return;
        
        try {
            const supabase = this.getSupabase();
            const { data: { user } } = await supabase.auth.getUser();
            
            // Controleer of de gebruiker admin is
            let isAdmin = false;
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('user_id', user.id)
                    .single();
                isAdmin = profile?.is_admin === true;
            }
            
            const from = (page - 1) * this.pageSize;
            const to = from + this.pageSize - 1;
            
            let query = supabase
                .from('litters')
                .select('*', { count: 'exact' })
                .order('aangemaakt_op', { ascending: false });
            
            // Alleen filteren op toegevoegd_door voor niet-admin gebruikers
            if (user && !isAdmin) {
                query = query.eq('toegevoegd_door', user.id);
            }
            
            const { data: announcements, error, count } = await query.range(from, to);
            
            if (error) throw error;
            
            this.totalAnnouncements = count || 0;
            
            if (!announcements || announcements.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-megaphone display-1 text-muted"></i>
                        <p class="mt-3 text-muted">${this.t('noAnnouncements')}</p>
                    </div>
                `;
                return;
            }
            
            await this.renderBeheerList(announcements, container, count, page);
            
        } catch (error) {
            console.error('Fout bij laden aankondigingen voor beheer:', error);
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle display-1 text-danger"></i>
                    <p class="mt-3 text-danger">${this.t('loadFailed')}${error.message}</p>
                </div>
            `;
        }
    }
    
    /**
     * Render overzichtslijst met exact de gewenste indeling
     * Eerste rij: HD en ED naast elkaar
     * Tweede rij: Patella en Ogen naast elkaar
     * Derde rij: Dandy Walker op eigen regel
     * Vierde rij: Schildklier op eigen regel
     * Vijfde rij: Land op eigen regel
     */
    async renderOverviewList(announcements, container, total = 0, currentPage = 1) {
        const t = this.t.bind(this);
        let html = '';
        
        for (const announcement of announcements) {
            // Haal vader gegevens op
            const vader = this.allDogs.find(d => d.id === announcement.vader_id) || {};
            
            // Haal moeder gegevens op
            const moeder = this.allDogs.find(d => d.id === announcement.moeder_id) || {};
            
            // Formatteer datum
            const date = new Date(announcement.aangemaakt_op);
            const formattedDate = date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                                           this.currentLang === 'de' ? 'de-DE' : 'en-US');
            
            // Vader display naam
            const vaderNaam = vader.kennelnaam ? `${vader.naam || 'Onbekend'} ${vader.kennelnaam}` : (vader.naam || 'Onbekend');
            
            // Moeder display naam
            const moederNaam = moeder.kennelnaam ? `${moeder.naam || 'Onbekend'} ${moeder.kennelnaam}` : (moeder.naam || 'Onbekend');
            
            // Gebruik kennelnaam_nest voor de header
            const headerTitle = announcement.kennelnaam_nest || 'Nest aankondiging';
            
            html += `
                <div class="col-12 mb-4">
                    <div class="card announcement-card shadow-sm">
                        <div class="card-header bg-light">
                            <h5 class="card-title mb-0">
                                <i class="bi bi-megaphone text-primary me-2"></i>
                                ${headerTitle}
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <!-- Vader Column -->
                                <div class="col-md-6">
                                    <div class="parent-header father-header mb-3">
                                        <i class="bi bi-gender-male me-2"></i>
                                        <strong>${t('fatherInfo')}</strong>
                                    </div>
                                    
                                    <div class="dog-info">
                                        <div class="dog-name">${vaderNaam}</div>
                                        ${vader.stamboomnr ? `<div class="pedigree-number">${vader.stamboomnr}</div>` : ''}
                                    </div>
                                    
                                    <div class="health-info">
                                        <!-- Rij 1: HD en ED naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('hd')}:</span>
                                                <span class="health-value">${vader.heupdysplasie || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('ed')}:</span>
                                                <span class="health-value">${vader.elleboogdysplasie || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 2: Patella en Ogen naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('patella')}:</span>
                                                <span class="health-value">${vader.patella || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('eyes')}:</span>
                                                <span class="health-value">${vader.ogen || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 3: Dandy Walker op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('dandyWalker')}:</span>
                                                <span class="health-value">${vader.dandyWalker || t('free')}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 4: Schildklier op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('thyroid')}:</span>
                                                <span class="health-value">${vader.schildklier || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 5: Land op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('country')}:</span>
                                                <span class="health-value">${vader.land || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${vader.ogenverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('eyesExplanation')}:</span>
                                        <span class="explanation-text">${vader.ogenverklaring}</span>
                                    </div>
                                    ` : ''}
                                    ${vader.schildklierverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('thyroidExplanation')}:</span>
                                        <span class="explanation-text">${vader.schildklierverklaring}</span>
                                    </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Moeder Column -->
                                <div class="col-md-6">
                                    <div class="parent-header mother-header mb-3">
                                        <i class="bi bi-gender-female me-2"></i>
                                        <strong>${t('motherInfo')}</strong>
                                    </div>
                                    
                                    <div class="dog-info">
                                        <div class="dog-name">${moederNaam}</div>
                                        ${moeder.stamboomnr ? `<div class="pedigree-number">${moeder.stamboomnr}</div>` : ''}
                                    </div>
                                    
                                    <div class="health-info">
                                        <!-- Rij 1: HD en ED naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('hd')}:</span>
                                                <span class="health-value">${moeder.heupdysplasie || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('ed')}:</span>
                                                <span class="health-value">${moeder.elleboogdysplasie || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 2: Patella en Ogen naast elkaar -->
                                        <div class="health-row-2col">
                                            <div class="health-item">
                                                <span class="health-label">${t('patella')}:</span>
                                                <span class="health-value">${moeder.patella || '-'}</span>
                                            </div>
                                            <div class="health-item">
                                                <span class="health-label">${t('eyes')}:</span>
                                                <span class="health-value">${moeder.ogen || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 3: Dandy Walker op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('dandyWalker')}:</span>
                                                <span class="health-value">${moeder.dandyWalker || t('free')}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 4: Schildklier op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('thyroid')}:</span>
                                                <span class="health-value">${moeder.schildklier || '-'}</span>
                                            </div>
                                        </div>
                                        
                                        <!-- Rij 5: Land op eigen regel -->
                                        <div class="health-row">
                                            <div class="health-item">
                                                <span class="health-label">${t('country')}:</span>
                                                <span class="health-value">${moeder.land || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${moeder.ogenverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('eyesExplanation')}:</span>
                                        <span class="explanation-text">${moeder.ogenverklaring}</span>
                                    </div>
                                    ` : ''}
                                    ${moeder.schildklierverklaring ? `
                                    <div class="explanation-item">
                                        <span class="explanation-label">${t('thyroidExplanation')}:</span>
                                        <span class="explanation-text">${moeder.schildklierverklaring}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            ${announcement.beschrijving ? `
                                <div class="mt-4 p-3 bg-light rounded">
                                    <p class="card-text mb-0">${announcement.beschrijving}</p>
                                </div>
                            ` : ''}
                            
                            <div class="mt-3 text-muted small d-flex justify-content-between align-items-center">
                                ${announcement.email ? `
                                    <div><i class="bi bi-envelope me-2"></i> ${announcement.email}</div>
                                ` : '<div></div>'}
                                <div><i class="bi bi-calendar me-2"></i> ${formattedDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        container.innerHTML = `<div class="row">${html}</div>`;
        
        this.attachPaginationEvents(false);
    }
    
    /**
     * Render beheer lijst (zelfde opzet als DekReuen beheer)
     */
    async renderBeheerList(announcements, container, total = 0, currentPage = 1) {
        const supabase = this.getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        
        // Controleer of de gebruiker admin is
        let isAdmin = false;
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('user_id', user.id)
                .single();
            isAdmin = profile?.is_admin === true;
        }
        
        const t = this.t.bind(this);
        
        let html = '';
        
        for (const ann of announcements) {
            // Haal vader en moeder gegevens op
            const vader = this.allDogs.find(d => d.id === ann.vader_id) || {};
            const moeder = this.allDogs.find(d => d.id === ann.moeder_id) || {};
            const canEdit = isAdmin || ann.toegevoegd_door === user?.id;
            
            // Formatteer datum
            const date = new Date(ann.aangemaakt_op);
            const formattedDate = date.toLocaleDateString(this.currentLang === 'nl' ? 'nl-NL' : 
                                                           this.currentLang === 'de' ? 'de-DE' : 'en-US');
            
            // Vader display naam
            const vaderNaam = vader.kennelnaam ? `${vader.naam || 'Onbekend'} ${vader.kennelnaam}` : (vader.naam || 'Onbekend');
            
            // Moeder display naam
            const moederNaam = moeder.kennelnaam ? `${moeder.naam || 'Onbekend'} ${moeder.kennelnaam}` : (moeder.naam || 'Onbekend');
            
            html += `
                <div class="col-12 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-md-3">
                                    <h6 class="mb-1">${ann.kennelnaam_nest || `Nest #${ann.id}`}</h6>
                                    <small class="text-muted d-block">${formattedDate}</small>
                                </div>
                                <div class="col-md-3 small">
                                    <strong>${t('fatherInfo')}:</strong><br>
                                    ${vaderNaam}<br>
                                    <span class="text-muted">HD: ${vader.heupdysplasie || '-'} | ED: ${vader.elleboogdysplasie || '-'}</span>
                                </div>
                                <div class="col-md-3 small">
                                    <strong>${t('motherInfo')}:</strong><br>
                                    ${moederNaam}<br>
                                    <span class="text-muted">HD: ${moeder.heupdysplasie || '-'} | ED: ${moeder.elleboogdysplasie || '-'}</span>
                                </div>
                                <div class="col-md-3 text-end">
                                    ${canEdit ? `
                                        <button class="btn btn-sm btn-outline-primary edit-announcement mb-1 w-100" 
                                            data-announcement='${JSON.stringify(ann).replace(/'/g, '&apos;')}'>
                                            <i class="bi bi-pencil"></i> ${t('edit')}
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete-announcement w-100" data-id="${ann.id}">
                                            <i class="bi bi-trash"></i> ${t('delete')}
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                            ${ann.beschrijving ? `
                            <div class="row mt-2">
                                <div class="col-12 small">
                                    <span class="text-muted">${t('description')}:</span> ${ann.beschrijving}
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }
        
        const totalPages = Math.ceil(total / this.pageSize);
        const paginationHTML = this.getPaginationHTML(total, currentPage, totalPages, true);
        
        container.innerHTML = `
            <div class="row">${html}</div>
            ${paginationHTML}
        `;
        
        container.querySelectorAll('.edit-announcement').forEach(btn => {
            btn.addEventListener('click', () => {
                try {
                    const announcement = JSON.parse(btn.dataset.announcement.replace(/&apos;/g, "'"));
                    this.showEditAnnouncementModal(announcement);
                } catch (e) {
                    console.error(e);
                }
            });
        });
        
        container.querySelectorAll('.delete-announcement').forEach(btn => {
            btn.addEventListener('click', () => this.deleteAnnouncement(btn.dataset.id));
        });
        
        this.attachPaginationEvents(true);
    }
    
    /**
     * Verwijder nest aankondiging
     */
    async deleteAnnouncement(id) {
        if (!confirm(this.t('confirmDelete'))) return;
        
        try {
            const supabase = this.getSupabase();
            
            const { error } = await supabase
                .from('litters')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            alert('Verwijderd!');
            
            // Ververs de beheer lijst
            await this.loadAnnouncementsForBeheer(this.currentPage);
            
        } catch (error) {
            console.error(error);
            alert(this.t('announcementDeleteFailed') + error.message);
        }
    }
    
    getPaginationHTML(total, currentPage, totalPages, isBeheer) {
        if (totalPages <= 1) return '';
        
        const start = ((currentPage - 1) * this.pageSize) + 1;
        
        return `
            <div class="row mt-2 mb-3">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="pagination-info">
                            ${this.t('showingResults').replace('{start}', start).replace('{total}', total)}
                        </span>
                        <nav aria-label="Paginatie">
                            <ul class="pagination mb-0">
                                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                    <a class="page-link nest-pagination" href="#" data-page="${currentPage - 1}" data-beheer="${isBeheer}">
                                        ${this.t('prevPage')}
                                    </a>
                                </li>
                                
                                ${this.generatePageNumbers(currentPage, totalPages).map(page => {
                                    if (page === '...') {
                                        return `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                                    }
                                    return `
                                        <li class="page-item ${page === currentPage ? 'active' : ''}">
                                            <a class="page-link nest-pagination" href="#" data-page="${page}" data-beheer="${isBeheer}">
                                                ${page}
                                            </a>
                                        </li>
                                    `;
                                }).join('')}
                                
                                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                                    <a class="page-link nest-pagination" href="#" data-page="${currentPage + 1}" data-beheer="${isBeheer}">
                                        ${this.t('nextPage')}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        `;
    }
    
    generatePageNumbers(currentPage, totalPages) {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    }
    
    attachPaginationEvents(isBeheer) {
        document.querySelectorAll('.nest-pagination').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                const beheer = e.target.dataset.beheer === 'true';
                
                if (!isNaN(page)) {
                    this.currentPage = page;
                    if (beheer) {
                        this.loadAnnouncementsForBeheer(page);
                    } else {
                        this.loadAnnouncements(page);
                    }
                }
            });
        });
    }
    
    async showOverviewView() {
        console.log('Showing overview view');
        
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        setTimeout(async () => {
            const modalContainer = modalElement.parentElement;
            modalContainer.innerHTML = this.getOverviewModalHTML();
            
            const newModalElement = document.getElementById('nestAankondigingenModal');
            const newModal = new bootstrap.Modal(newModalElement);
            
            this.setupOverviewEvents();
            this.currentPage = 1;
            await this.loadAnnouncements(1);
            
            newModal.show();
        }, 300);
    }
    
    async showBeheerView() {
        console.log('Showing beheer view');
        
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        setTimeout(async () => {
            const modalContainer = modalElement.parentElement;
            modalContainer.innerHTML = this.getBeheerModalHTML();
            
            const newModalElement = document.getElementById('nestAankondigingenModal');
            const newModal = new bootstrap.Modal(newModalElement);
            
            this.setupBeheerEvents();
            this.currentPage = 1;
            await this.loadAnnouncementsForBeheer(1);
            
            newModal.show();
        }, 300);
    }
    
    showChoiceView() {
        console.log('Showing choice view');
        
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        setTimeout(() => {
            const modalContainer = modalElement.parentElement;
            modalContainer.innerHTML = this.getChoiceModalHTML();
            
            const newModalElement = document.getElementById('nestAankondigingenModal');
            const newModal = new bootstrap.Modal(newModalElement);
            
            this.setupChoiceEvents();
            
            newModal.show();
        }, 300);
    }
    
    fixModalClose() {
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        modalElement.addEventListener('hidden.bs.modal', () => {
            setTimeout(() => {
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
            }, 50);
        });
    }
    
    translateModalContent() {
        const modalElement = document.getElementById('nestAankondigingenModal');
        if (!modalElement) return;
        
        const elements = modalElement.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            const translation = this.t(key);
            if (translation !== key) {
                element.textContent = translation;
            }
        });
    }
}

// Maak een globale instantie aan
const NestAankondigingenManagerInstance = new NestAankondigingenManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NestAankondigingenManagerInstance;
} else {
    window.NestAankondigingenManager = NestAankondigingenManagerInstance;
    window.nestAankondigingenManager = NestAankondigingenManagerInstance;
}

console.log('📦 NestAankondigingenManager geladen met 1 per pagina, paginatie 80%, tekst 70%');