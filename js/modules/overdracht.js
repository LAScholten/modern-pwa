/**
 * OverdrachtModule - Voor het aanvragen en uitvoeren van hond overdrachten
 * @version 1.2.0
 * AANPASSING: Unieke CSS prefixes toegevoegd om conflicten met LitterManager te voorkomen
 */

class OverdrachtModule {
    constructor() {
        this.supabase = window.supabase;
        this.currentUser = null;
        this.currentUserRole = null;
        this.currentUserId = null;
        this.selectedHond = null;
        this.aanvragen = [];
        
        // Vertalingen
        this.translations = {
            nl: {
                moduleTitle: "Hond Overdracht Module",
                transferRequest: "Overdracht Aanvragen",
                transferManagement: "Beheer Aanvragen",
                directTransfer: "Directe Overdracht",
                closeBtn: "Sluiten",
                transferInfo: "Gebruik dit formulier om een overdracht aan te vragen voor een hond die op naam staat van de fokker. Na goedkeuring wordt de hond op jouw naam overgeschreven.",
                searchDogPlaceholder: "Zoek op stamboomnummer of op naam + kennelnaam...",
                search: "Zoeken",
                searching: "Zoeken...",
                noDogsFound: "Geen honden gevonden",
                errorSearching: "Fout bij zoeken",
                selectedDog: "Geselecteerde hond",
                currentOwner: "Huidige eigenaar (fokker):",
                newOwner: "Nieuwe eigenaar (jij):",
                sendRequest: "Verstuur Aanvraag",
                alreadyOwner: "Je bent al de eigenaar van deze hond!",
                selectDogFirst: "Selecteer eerst een hond",
                sendingRequest: "Bezig met versturen...",
                requestSuccess: "Aanvraag succesvol verstuurd! De beheerder zal deze behandelen.",
                requestError: "Fout bij versturen aanvraag",
                tableNotExist: "De overdracht_aanvragen tabel bestaat nog niet. Neem contact op met de beheerder om deze aan te maken.",
                pendingTransfers: "Openstaande Overdracht Aanvragen",
                refresh: "Vernieuwen",
                loadingRequests: "Laden van aanvragen...",
                noPendingRequests: "Geen openstaande aanvragen",
                requestFrom: "Van",
                requestTo: "Naar",
                approve: "Goedkeuren",
                reject: "Afwijzen",
                approved: "goedgekeurd",
                rejected: "afgewezen",
                requested: "aangevraagd",
                directTransferWarning: "Let op: Deze actie voert direct een overdracht uit zonder tussenkomst. Alleen gebruiken bij officiële overdrachten!",
                searchDog: "Zoek hond:",
                searchOwnerPlaceholder: "Zoek op email...",
                createNewOwner: "Nieuwe eigenaar aanmaken",
                transferDate: "Datum overdracht:",
                remarks: "Opmerkingen:",
                executeTransfer: "Voer Directe Overdracht Uit",
                confirmTransfer: "Weet je zeker dat je {hond} wilt overdragen aan {eigenaar}?",
                transferBusy: "Bezig met overdracht...",
                transferSuccess: "Overdracht succesvol uitgevoerd!",
                transferError: "Fout bij overdracht",
                selectHondFirst: "Selecteer eerst een hond",
                selectOwnerFirst: "Selecteer een nieuwe eigenaar",
                name: "Naam",
                stamboomnr: "Stamboomnr",
                breed: "Ras",
                birthdate: "Geboortedatum",
                unknown: "Onbekend",
                owner: "Eigenaar"
            },
            en: {
                moduleTitle: "Dog Transfer Module",
                transferRequest: "Request Transfer",
                transferManagement: "Manage Requests",
                directTransfer: "Direct Transfer",
                closeBtn: "Close",
                transferInfo: "Use this form to request a transfer for a dog registered to a breeder. After approval, the dog will be transferred to your name.",
                searchDogPlaceholder: "Search by registration number or name + kennel name...",
                search: "Search",
                searching: "Searching...",
                noDogsFound: "No dogs found",
                errorSearching: "Error searching",
                selectedDog: "Selected dog",
                currentOwner: "Current owner (breeder):",
                newOwner: "New owner (you):",
                sendRequest: "Send Request",
                alreadyOwner: "You are already the owner of this dog!",
                selectDogFirst: "Select a dog first",
                sendingRequest: "Sending request...",
                requestSuccess: "Request sent successfully! The administrator will handle it.",
                requestError: "Error sending request",
                tableNotExist: "The overdracht_aanvragen table does not exist yet. Contact the administrator to create it.",
                pendingTransfers: "Pending Transfer Requests",
                refresh: "Refresh",
                loadingRequests: "Loading requests...",
                noPendingRequests: "No pending requests",
                requestFrom: "From",
                requestTo: "To",
                approve: "Approve",
                reject: "Reject",
                approved: "approved",
                rejected: "rejected",
                requested: "requested",
                directTransferWarning: "Warning: This performs a direct transfer without intervention. Only use for official transfers!",
                searchDog: "Search dog:",
                searchOwnerPlaceholder: "Search by email...",
                createNewOwner: "Create new owner",
                transferDate: "Transfer date:",
                remarks: "Remarks:",
                executeTransfer: "Execute Direct Transfer",
                confirmTransfer: "Are you sure you want to transfer {hond} to {eigenaar}?",
                transferBusy: "Processing transfer...",
                transferSuccess: "Transfer completed successfully!",
                transferError: "Error during transfer",
                selectHondFirst: "Select a dog first",
                selectOwnerFirst: "Select a new owner",
                name: "Name",
                stamboomnr: "Registration nr",
                breed: "Breed",
                birthdate: "Birth date",
                unknown: "Unknown",
                owner: "Owner"
            },
            de: {
                moduleTitle: "Hundeübertragungsmodul",
                transferRequest: "Übertragung beantragen",
                transferManagement: "Anträge verwalten",
                directTransfer: "Direkte Übertragung",
                closeBtn: "Schließen",
                transferInfo: "Mit diesem Formular können Sie eine Übertragung für einen Hund beantragen, der auf einen Züchter registriert ist. Nach Genehmigung wird der Hund auf Ihren Namen übertragen.",
                searchDogPlaceholder: "Suche nach Zuchtbuchnummer oder Name + Zwingername...",
                search: "Suchen",
                searching: "Suche...",
                noDogsFound: "Keine Hunde gefunden",
                errorSearching: "Fehler bei der Suche",
                selectedDog: "Ausgewählter Hund",
                currentOwner: "Aktueller Besitzer (Züchter):",
                newOwner: "Neuer Besitzer (Sie):",
                sendRequest: "Antrag senden",
                alreadyOwner: "Sie sind bereits der Besitzer dieses Hundes!",
                selectDogFirst: "Wählen Sie zuerst einen Hund",
                sendingRequest: "Antrag wird gesendet...",
                requestSuccess: "Antrag erfolgreich gesendet! Der Administrator wird ihn bearbeiten.",
                requestError: "Fehler beim Senden des Antrags",
                tableNotExist: "Die Tabelle overdracht_aanvragen existiert noch nicht. Kontaktieren Sie den Administrator, um sie zu erstellen.",
                pendingTransfers: "Ausstehende Übertragungsanträge",
                refresh: "Aktualisieren",
                loadingRequests: "Anträge werden geladen...",
                noPendingRequests: "Keine ausstehenden Anträge",
                requestFrom: "Von",
                requestTo: "An",
                approve: "Genehmigen",
                reject: "Ablehnen",
                approved: "genehmigt",
                rejected: "abgelehnt",
                requested: "beantragt",
                directTransferWarning: "Achtung: Dies führt eine direkte Übertragung ohne Intervention durch. Nur für offizielle Übertragungen verwenden!",
                searchDog: "Hund suchen:",
                searchOwnerPlaceholder: "Suche nach E-Mail...",
                createNewOwner: "Neuen Besitzer erstellen",
                transferDate: "Übertragungsdatum:",
                remarks: "Bemerkungen:",
                executeTransfer: "Direkte Übertragung ausführen",
                confirmTransfer: "Sind Sie sicher, dass Sie {hond} an {eigenaar} übertragen möchten?",
                transferBusy: "Übertragung wird verarbeitet...",
                transferSuccess: "Übertragung erfolgreich abgeschlossen!",
                transferError: "Fehler bei der Übertragung",
                selectHondFirst: "Wählen Sie zuerst einen Hund",
                selectOwnerFirst: "Wählen Sie einen neuen Besitzer",
                name: "Name",
                stamboomnr: "Zuchtbuchnr",
                breed: "Rasse",
                birthdate: "Geburtsdatum",
                unknown: "Unbekannt",
                owner: "Besitzer"
            }
        };
        
        // Huidige taal
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        
        // Initialiseer
        this.init();
    }
    
    async init() {
        this.currentUserId = localStorage.getItem('userId');
        this.currentUserEmail = localStorage.getItem('userEmail');
        this.currentUserRole = localStorage.getItem('userRole');
        
        console.log('📦 OverdrachtModule geïnitialiseerd');
        console.log('👤 Huidige gebruiker:', this.currentUserEmail);
        console.log('👑 Rol:', this.currentUserRole);
        console.log('🌐 Taal:', this.currentLang);
    }
    
    /**
     * VERTAAL FUNCTIE
     */
    t(key, replacements = {}) {
        let text = this.translations[this.currentLang]?.[key] || this.translations.nl[key] || key;
        
        // Vervang placeholders
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        
        return text;
    }
    
    /**
     * TOON HET OVERDRACHT MODAL
     */
    async showModal() {
        console.log('📋 OverdrachtModule showModal');
        
        // Bepaal welke tabs getoond moeten worden op basis van rol
        const isAdmin = this.currentUserRole === 'admin';
        
        // Maak de modal HTML
        const modalHTML = this.getModalHTML(isAdmin);
        
        // Toon modal via UI Handler
        if (window.uiHandler) {
            window.uiHandler.showCustomModal(modalHTML, 'overdrachtModal', 'overdrachtModalLabel');
            
            // Setup events na het tonen van de modal
            setTimeout(() => {
                this.setupModalEvents(isAdmin);
                
                // Als admin, laad direct de aanvragen
                if (isAdmin) {
                    this.loadAanvragen();
                }
            }, 500);
        } else {
            console.error('UI Handler niet beschikbaar');
        }
    }
    
    /**
     * GENEREER MODAL HTML
     */
    getModalHTML(isAdmin) {
        const userTabs = `
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="overdracht-aanvraag-tab" data-bs-toggle="tab" data-bs-target="#overdracht-aanvraag" type="button" role="tab">
                    <i class="bi bi-send"></i> ${this.t('transferRequest')}
                </button>
            </li>
        `;
        
        const adminTabs = isAdmin ? `
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="overdracht-beheer-tab" data-bs-toggle="tab" data-bs-target="#overdracht-beheer" type="button" role="tab">
                    <i class="bi bi-list-check"></i> ${this.t('transferManagement')}
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="overdracht-directe-tab" data-bs-toggle="tab" data-bs-target="#overdracht-directe" type="button" role="tab">
                    <i class="bi bi-arrow-left-right"></i> ${this.t('directTransfer')}
                </button>
            </li>
        ` : '';
        
        return `
            <div class="modal fade" id="overdrachtModal" tabindex="-1" aria-labelledby="overdrachtModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="overdrachtModalLabel">
                                <i class="bi bi-arrow-left-right"></i> 
                                ${this.t('moduleTitle')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div class="modal-body">
                            <!-- TABS -->
                            <ul class="nav nav-tabs mb-3" id="overdrachtTabs" role="tablist">
                                ${userTabs}
                                ${adminTabs}
                            </ul>
                            
                            <!-- TAB CONTENT -->
                            <div class="tab-content" id="overdrachtTabContent">
                                <!-- AANVRAAG TAB (voor alle gebruikers) -->
                                <div class="tab-pane fade show active" id="overdracht-aanvraag" role="tabpanel">
                                    ${this.getAanvraagFormHTML()}
                                </div>
                                
                                ${isAdmin ? `
                                    <!-- BEHEER TAB (alleen admin) -->
                                    <div class="tab-pane fade" id="overdracht-beheer" role="tabpanel">
                                        ${this.getBeheerHTML()}
                                    </div>
                                    
                                    <!-- DIRECTE OVERDRACHT TAB (alleen admin) -->
                                    <div class="tab-pane fade" id="overdracht-directe" role="tabpanel">
                                        ${this.getDirecteOverdrachtHTML()}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="bi bi-x-circle"></i> ${this.t('closeBtn')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * AANVRAAG FORMULIER HTML
     */
    getAanvraagFormHTML() {
        return `
            <div class="overdracht-row">
                <div class="overdracht-col-md-12">
                    <div class="overdracht-alert overdracht-alert-info">
                        <i class="bi bi-info-circle"></i>
                        ${this.t('transferInfo')}
                    </div>
                    
                    <form id="overdrachtAanvraagForm">
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-search"></i> 
                                ${this.t('searchDog')}:
                            </label>
                            <div class="overdracht-input-group">
                                <input type="text" class="overdracht-form-control" id="overdracht-zoekHondAanvraag" 
                                       placeholder="${this.t('searchDogPlaceholder')}">
                                <button class="overdracht-btn overdracht-btn-primary" type="button" id="overdracht-zoekHondBtn">
                                    <i class="bi bi-search"></i> ${this.t('search')}
                                </button>
                            </div>
                            <div id="overdracht-zoekResultatenAanvraag" class="overdracht-mt-2" style="max-height: 200px; overflow-y: auto;"></div>
                        </div>
                        
                        <div id="overdracht-geselecteerdeHondInfo" class="overdracht-card overdracht-mb-3 overdracht-d-none">
                            <div class="overdracht-card-header overdracht-bg-light">
                                <h6 class="overdracht-mb-0">${this.t('selectedDog')}</h6>
                            </div>
                            <div class="overdracht-card-body" id="overdracht-geselecteerdeHondDetails"></div>
                        </div>
                        
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-person"></i> 
                                ${this.t('currentOwner')}
                            </label>
                            <input type="text" class="overdracht-form-control" id="overdracht-huidigeEigenaar" readonly>
                        </div>
                        
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-person-check"></i> 
                                ${this.t('newOwner')}
                            </label>
                            <input type="text" class="overdracht-form-control" id="overdracht-nieuweEigenaar" value="${this.currentUserEmail}" readonly>
                        </div>
                        
                        <div class="overdracht-alert overdracht-alert-warning" id="overdracht-aanvraagStatus"></div>
                        
                        <button type="button" class="overdracht-btn overdracht-btn-success overdracht-w-100" id="overdracht-verstuurAanvraagBtn" disabled>
                            <i class="bi bi-send"></i> ${this.t('sendRequest')}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
    
    /**
     * BEHEER HTML (voor admin)
     */
    getBeheerHTML() {
        return `
            <div class="overdracht-row">
                <div class="overdracht-col-md-12">
                    <div class="overdracht-card">
                        <div class="overdracht-card-header overdracht-bg-light overdracht-d-flex overdracht-justify-content-between overdracht-align-items-center">
                            <h6 class="overdracht-mb-0">
                                <i class="bi bi-list-check"></i> 
                                ${this.t('pendingTransfers')}
                            </h6>
                            <button class="overdracht-btn overdracht-btn-sm overdracht-btn-outline-primary" id="overdracht-refreshAanvragenBtn">
                                <i class="bi bi-arrow-clockwise"></i> ${this.t('refresh')}
                            </button>
                        </div>
                        <div class="overdracht-card-body">
                            <div id="overdracht-aanvragenLijst" style="max-height: 500px; overflow-y: auto;">
                                <div class="overdracht-text-center overdracht-text-muted overdracht-py-5">
                                    <i class="bi bi-hourglass-split" style="font-size: 3rem;"></i>
                                    <p class="overdracht-mt-2">${this.t('loadingRequests')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * DIRECTE OVERDRACHT HTML (voor admin)
     */
    getDirecteOverdrachtHTML() {
        return `
            <div class="overdracht-row">
                <div class="overdracht-col-md-12">
                    <div class="overdracht-alert overdracht-alert-warning">
                        <i class="bi bi-exclamation-triangle"></i>
                        ${this.t('directTransferWarning')}
                    </div>
                    
                    <form id="overdracht-directeForm">
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-search"></i> 
                                ${this.t('searchDog')}
                            </label>
                            <div class="overdracht-input-group">
                                <input type="text" class="overdracht-form-control" id="overdracht-zoekHondDirect" 
                                       placeholder="${this.t('searchDogPlaceholder')}">
                                <button class="overdracht-btn overdracht-btn-primary" type="button" id="overdracht-zoekHondDirectBtn">
                                    <i class="bi bi-search"></i> ${this.t('search')}
                                </button>
                            </div>
                            <div id="overdracht-zoekResultatenDirect" class="overdracht-mt-2" style="max-height: 150px; overflow-y: auto;"></div>
                        </div>
                        
                        <div id="overdracht-geselecteerdeHondDirectInfo" class="overdracht-card overdracht-mb-3 overdracht-d-none">
                            <div class="overdracht-card-header overdracht-bg-light">
                                <h6 class="overdracht-mb-0">${this.t('selectedDog')}</h6>
                            </div>
                            <div class="overdracht-card-body" id="overdracht-geselecteerdeHondDirectDetails"></div>
                        </div>
                        
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-person"></i> 
                                ${this.t('currentOwner')}
                            </label>
                            <input type="text" class="overdracht-form-control" id="overdracht-directHuidigeEigenaar" readonly>
                            <input type="hidden" id="overdracht-directHuidigeEigenaarId">
                        </div>
                        
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-person-plus"></i> 
                                ${this.t('newOwner')}
                            </label>
                            <div class="overdracht-input-group overdracht-mb-2">
                                <input type="text" class="overdracht-form-control" id="overdracht-zoekNieuweEigenaar" 
                                       placeholder="${this.t('searchOwnerPlaceholder')}">
                                <button class="overdracht-btn overdracht-btn-outline-secondary" type="button" id="overdracht-zoekEigenaarBtn">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                            <div id="overdracht-eigenaarZoekResultaten" class="overdracht-mb-2" style="max-height: 150px; overflow-y: auto;"></div>
                            
                            <select class="overdracht-form-select" id="overdracht-geselecteerdeNieuweEigenaar" size="5" style="display: none;"></select>
                            
                            <button class="overdracht-btn overdracht-btn-outline-success overdracht-btn-sm overdracht-w-100" type="button" id="overdracht-maakNieuweEigenaarBtn">
                                <i class="bi bi-person-plus"></i> ${this.t('createNewOwner')}
                            </button>
                        </div>
                        
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-calendar"></i> 
                                ${this.t('transferDate')}
                            </label>
                            <input type="date" class="overdracht-form-control" id="overdracht-datum" 
                                   value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        
                        <div class="overdracht-mb-3">
                            <label class="overdracht-form-label">
                                <i class="bi bi-chat-text"></i> 
                                ${this.t('remarks')}
                            </label>
                            <textarea class="overdracht-form-control" id="overdracht-directOpmerkingen" rows="2"></textarea>
                        </div>
                        
                        <div class="overdracht-alert overdracht-alert-danger" id="overdracht-directStatus"></div>
                        
                        <button type="button" class="overdracht-btn overdracht-btn-warning overdracht-w-100" id="overdracht-voerDirecteUit" disabled>
                            <i class="bi bi-arrow-left-right"></i> ${this.t('executeTransfer')}
                        </button>
                    </form>
                </div>
            </div>
            
            <style>
                /* Unieke CSS voor OverdrachtModule - met overdracht- prefix */
                .overdracht-row {
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                }
                
                .overdracht-col-md-12 {
                    flex: 0 0 100%;
                    max-width: 100%;
                    padding-right: 15px;
                    padding-left: 15px;
                }
                
                .overdracht-card {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    word-wrap: break-word;
                    background-color: #fff;
                    background-clip: border-box;
                    border: 1px solid rgba(0,0,0,.125);
                    border-radius: 0.25rem;
                }
                
                .overdracht-card-header {
                    padding: 0.75rem 1.25rem;
                    margin-bottom: 0;
                    background-color: rgba(0,0,0,.03);
                    border-bottom: 1px solid rgba(0,0,0,.125);
                }
                
                .overdracht-card-body {
                    flex: 1 1 auto;
                    padding: 1.25rem;
                }
                
                .overdracht-mb-0 {
                    margin-bottom: 0 !important;
                }
                
                .overdracht-mb-2 {
                    margin-bottom: 0.5rem !important;
                }
                
                .overdracht-mb-3 {
                    margin-bottom: 1rem !important;
                }
                
                .overdracht-mt-2 {
                    margin-top: 0.5rem !important;
                }
                
                .overdracht-py-5 {
                    padding-top: 3rem !important;
                    padding-bottom: 3rem !important;
                }
                
                .overdracht-d-none {
                    display: none !important;
                }
                
                .overdracht-w-100 {
                    width: 100% !important;
                }
                
                .overdracht-d-flex {
                    display: flex !important;
                }
                
                .overdracht-justify-content-between {
                    justify-content: space-between !important;
                }
                
                .overdracht-align-items-center {
                    align-items: center !important;
                }
                
                .overdracht-text-center {
                    text-align: center !important;
                }
                
                .overdracht-text-muted {
                    color: #6c757d !important;
                }
                
                .overdracht-bg-light {
                    background-color: #f8f9fa !important;
                }
                
                .overdracht-form-control {
                    display: block;
                    width: 100%;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #495057;
                    background-color: #fff;
                    background-clip: padding-box;
                    border: 1px solid #ced4da;
                    border-radius: 0.25rem;
                    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                }
                
                .overdracht-form-select {
                    display: block;
                    width: 100%;
                    padding: 0.375rem 2.25rem 0.375rem 0.75rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    color: #495057;
                    background-color: #fff;
                    border: 1px solid #ced4da;
                    border-radius: 0.25rem;
                }
                
                .overdracht-form-label {
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                
                .overdracht-input-group {
                    position: relative;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: stretch;
                    width: 100%;
                }
                
                .overdracht-input-group > .overdracht-form-control {
                    position: relative;
                    flex: 1 1 auto;
                    width: 1%;
                    min-width: 0;
                }
                
                .overdracht-btn {
                    display: inline-block;
                    font-weight: 400;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    padding: 0.375rem 0.75rem;
                    font-size: 1rem;
                    line-height: 1.5;
                    border-radius: 0.25rem;
                    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
                }
                
                .overdracht-btn-sm {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem;
                    line-height: 1.5;
                    border-radius: 0.2rem;
                }
                
                .overdracht-btn-primary {
                    color: #fff;
                    background-color: #007bff;
                    border-color: #007bff;
                }
                
                .overdracht-btn-success {
                    color: #fff;
                    background-color: #28a745;
                    border-color: #28a745;
                }
                
                .overdracht-btn-warning {
                    color: #212529;
                    background-color: #ffc107;
                    border-color: #ffc107;
                }
                
                .overdracht-btn-outline-secondary {
                    color: #6c757d;
                    border-color: #6c757d;
                    background-color: transparent;
                }
                
                .overdracht-btn-outline-success {
                    color: #28a745;
                    border-color: #28a745;
                    background-color: transparent;
                }
                
                .overdracht-btn-outline-primary {
                    color: #007bff;
                    border-color: #007bff;
                    background-color: transparent;
                }
                
                .overdracht-alert {
                    position: relative;
                    padding: 0.75rem 1.25rem;
                    margin-bottom: 1rem;
                    border: 1px solid transparent;
                    border-radius: 0.25rem;
                }
                
                .overdracht-alert-info {
                    color: #0c5460;
                    background-color: #d1ecf1;
                    border-color: #bee5eb;
                }
                
                .overdracht-alert-warning {
                    color: #856404;
                    background-color: #fff3cd;
                    border-color: #ffeeba;
                }
                
                .overdracht-alert-danger {
                    color: #721c24;
                    background-color: #f8d7da;
                    border-color: #f5c6cb;
                }
            </style>
        `;
    }
    
    /**
     * SETUP MODAL EVENTS
     */
    setupModalEvents(isAdmin) {
        console.log('Setting up modal events, isAdmin:', isAdmin);
        
        // Algemene events
        document.getElementById('overdracht-zoekHondBtn')?.addEventListener('click', () => this.zoekHondVoorAanvraag());
        document.getElementById('overdracht-zoekHondAanvraag')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.zoekHondVoorAanvraag();
            }
        });
        
        document.getElementById('overdracht-verstuurAanvraagBtn')?.addEventListener('click', () => this.verstuurAanvraag());
        
        // Admin events
        if (isAdmin) {
            document.getElementById('overdracht-refreshAanvragenBtn')?.addEventListener('click', () => this.loadAanvragen());
            document.getElementById('overdracht-zoekHondDirectBtn')?.addEventListener('click', () => this.zoekHondDirect());
            document.getElementById('overdracht-zoekEigenaarBtn')?.addEventListener('click', () => this.zoekNieuweEigenaar());
            document.getElementById('overdracht-maakNieuweEigenaarBtn')?.addEventListener('click', () => this.toonNieuweEigenaarModal());
            document.getElementById('overdracht-voerDirecteUit')?.addEventListener('click', () => this.voerDirecteOverdrachtUit());
            
            document.getElementById('overdracht-zoekHondDirect')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.zoekHondDirect();
                }
            });
            
            document.getElementById('overdracht-zoekNieuweEigenaar')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.zoekNieuweEigenaar();
                }
            });
            
            document.getElementById('overdracht-geselecteerdeNieuweEigenaar')?.addEventListener('change', () => {
                this.checkDirectOverdrachtReady();
            });
        }
        
        // Tab change events
        document.getElementById('overdrachtTabs')?.addEventListener('shown.bs.tab', (event) => {
            if (event.target.id === 'overdracht-beheer-tab') {
                this.loadAanvragen();
            }
        });
    }
    
    /**
     * ZOEK HOND VOOR AANVRAAG (verbeterd met naam + kennelnaam)
     */
    async zoekHondVoorAanvraag() {
        const zoekTerm = document.getElementById('overdracht-zoekHondAanvraag').value.trim();
        
        if (!zoekTerm) {
            this.showStatus('overdracht-aanvraagStatus', this.t('searchDog'), 'warning');
            return;
        }
        
        try {
            document.getElementById('overdracht-zoekResultatenAanvraag').innerHTML = `
                <div class="overdracht-text-center">
                    <div class="spinner-border spinner-border-sm text-primary"></div> ${this.t('searching')}
                </div>
            `;
            
            let query = this.supabase
                .from('honden')
                .select(`
                    *,
                    profiles!honden_toegevoegd_door_fkey (
                        email,
                        role,
                        is_admin
                    )
                `);
            
            // Controleer of het een stamboomnummer is (bevat meestal letters/cijfers)
            // Of zoek op combinatie van naam en kennelnaam
            if (zoekTerm.includes(' ')) {
                // Mogelijke combinatie van naam + kennelnaam
                const parts = zoekTerm.split(' ');
                const naam = parts[0];
                const kennelnaam = parts.slice(1).join(' ');
                
                query = query.or(`naam.ilike.%${naam}%,kennelnaam.ilike.%${kennelnaam}%`);
            } else {
                // Zoek op stamboomnummer OF naam
                query = query.or(`stamboomnr.ilike.%${zoekTerm}%,naam.ilike.%${zoekTerm}%`);
            }
            
            const { data: honden, error } = await query.limit(10);
            
            if (error) throw error;
            
            if (!honden || honden.length === 0) {
                document.getElementById('overdracht-zoekResultatenAanvraag').innerHTML = `
                    <div class="overdracht-alert overdracht-alert-warning">${this.t('noDogsFound')}</div>
                `;
                return;
            }
            
            // Toon resultaten
            let html = '<div class="list-group">';
            honden.forEach(hond => {
                const eigenaarEmail = hond.profiles?.email || this.t('unknown');
                const kennelNaam = hond.kennelnaam ? ` van ${hond.kennelnaam}` : '';
                
                html += `
                    <button class="list-group-item list-group-item-action overdracht-select-hond-aanvraag" 
                            data-hond='${JSON.stringify(hond)}'>
                        <div class="overdracht-d-flex overdracht-justify-content-between overdracht-align-items-center">
                            <div>
                                <strong>${hond.naam}${kennelNaam}</strong>
                                <br>
                                <small class="text-muted">${hond.stamboomnr || this.t('stamboomnr')}</small>
                            </div>
                            <div>
                                <span class="badge bg-secondary">${this.t('owner')}: ${eigenaarEmail}</span>
                            </div>
                        </div>
                    </button>
                `;
            });
            html += '</div>';
            
            document.getElementById('overdracht-zoekResultatenAanvraag').innerHTML = html;
            
            // Voeg event listeners toe aan resultaten
            document.querySelectorAll('.overdracht-select-hond-aanvraag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const hondData = JSON.parse(btn.dataset.hond);
                    this.selectHondVoorAanvraag(hondData);
                });
            });
            
        } catch (error) {
            console.error('Fout bij zoeken:', error);
            document.getElementById('overdracht-zoekResultatenAanvraag').innerHTML = `
                <div class="overdracht-alert overdracht-alert-danger">${this.t('errorSearching')}: ${error.message}</div>
            `;
        }
    }
    
    /**
     * SELECTEER HOND VOOR AANVRAAG
     */
    selectHondVoorAanvraag(hond) {
        this.selectedHond = hond;
        
        // Controleer of de huidige gebruiker niet al de eigenaar is
        if (hond.toegevoegd_door === this.currentUserId) {
            this.showStatus('overdracht-aanvraagStatus', this.t('alreadyOwner'), 'danger');
            document.getElementById('overdracht-verstuurAanvraagBtn').disabled = true;
            return;
        }
        
        // Toon geselecteerde hond info
        document.getElementById('overdracht-geselecteerdeHondInfo').classList.remove('overdracht-d-none');
        
        const eigenaarEmail = hond.profiles?.email || this.t('unknown');
        const kennelNaam = hond.kennelnaam ? ` van ${hond.kennelnaam}` : '';
        
        document.getElementById('overdracht-geselecteerdeHondDetails').innerHTML = `
            <div class="overdracht-row">
                <div class="overdracht-col-md-6">
                    <p class="overdracht-mb-1"><strong>${this.t('name')}:</strong> ${hond.naam}${kennelNaam}</p>
                    <p class="overdracht-mb-1"><strong>${this.t('stamboomnr')}:</strong> ${hond.stamboomnr || '-'}</p>
                    <p class="overdracht-mb-1"><strong>${this.t('breed')}:</strong> ${hond.ras || '-'}</p>
                </div>
                <div class="overdracht-col-md-6">
                    <p class="overdracht-mb-1"><strong>${this.t('birthdate')}:</strong> ${hond.geboortedatum || '-'}</p>
                    <p class="overdracht-mb-1"><strong>${this.t('currentOwner')}:</strong> ${eigenaarEmail}</p>
                </div>
            </div>
        `;
        
        document.getElementById('overdracht-huidigeEigenaar').value = eigenaarEmail;
        document.getElementById('overdracht-verstuurAanvraagBtn').disabled = false;
        this.showStatus('overdracht-aanvraagStatus', '', 'info');
    }
    
    /**
     * VERSTUUR AANVRAAG
     */
    async verstuurAanvraag() {
        if (!this.selectedHond) {
            this.showStatus('overdracht-aanvraagStatus', this.t('selectDogFirst'), 'warning');
            return;
        }
        
        try {
            document.getElementById('overdracht-verstuurAanvraagBtn').disabled = true;
            this.showStatus('overdracht-aanvraagStatus', this.t('sendingRequest'), 'info');
            
            const { data, error } = await this.supabase
                .from('overdracht_aanvragen')
                .insert({
                    hond_id: this.selectedHond.id,
                    hond_naam: this.selectedHond.naam,
                    hond_stamboomnr: this.selectedHond.stamboomnr,
                    huidige_eigenaar_id: this.selectedHond.toegevoegd_door,
                    huidige_eigenaar_email: this.selectedHond.profiles?.email,
                    nieuwe_eigenaar_id: this.currentUserId,
                    nieuwe_eigenaar_email: this.currentUserEmail,
                    status: 'aangevraagd',
                    aangemaakt_op: new Date().toISOString()
                });
            
            if (error) {
                if (error.code === '42P01') {
                    this.showStatus('overdracht-aanvraagStatus', this.t('tableNotExist'), 'danger');
                    return;
                }
                throw error;
            }
            
            this.showStatus('overdracht-aanvraagStatus', this.t('requestSuccess'), 'success');
            
            // Reset form
            document.getElementById('overdracht-geselecteerdeHondInfo').classList.add('overdracht-d-none');
            document.getElementById('overdracht-zoekHondAanvraag').value = '';
            document.getElementById('overdracht-zoekResultatenAanvraag').innerHTML = '';
            this.selectedHond = null;
            
        } catch (error) {
            console.error('Fout bij versturen aanvraag:', error);
            this.showStatus('overdracht-aanvraagStatus', `${this.t('requestError')}: ${error.message}`, 'danger');
            document.getElementById('overdracht-verstuurAanvraagBtn').disabled = false;
        }
    }
    
    /**
     * LAAD AANVRAGEN (voor admin)
     */
    async loadAanvragen() {
        try {
            document.getElementById('overdracht-aanvragenLijst').innerHTML = `
                <div class="overdracht-text-center overdracht-py-5">
                    <div class="spinner-border text-primary"></div>
                    <p class="overdracht-mt-2">${this.t('loadingRequests')}</p>
                </div>
            `;
            
            const { data: aanvragen, error } = await this.supabase
                .from('overdracht_aanvragen')
                .select('*')
                .eq('status', 'aangevraagd')
                .order('aangemaakt_op', { ascending: false });
            
            if (error) {
                if (error.code === '42P01') {
                    document.getElementById('overdracht-aanvragenLijst').innerHTML = `
                        <div class="overdracht-alert overdracht-alert-info">
                            <i class="bi bi-info-circle"></i>
                            ${this.t('tableNotExist')}
                        </div>
                    `;
                    return;
                }
                throw error;
            }
            
            if (!aanvragen || aanvragen.length === 0) {
                document.getElementById('overdracht-aanvragenLijst').innerHTML = `
                    <div class="overdracht-text-center overdracht-text-muted overdracht-py-5">
                        <i class="bi bi-inbox" style="font-size: 3rem;"></i>
                        <p class="overdracht-mt-2">${this.t('noPendingRequests')}</p>
                    </div>
                `;
                return;
            }
            
            this.toonAanvragenLijst(aanvragen);
            
        } catch (error) {
            console.error('Fout bij laden aanvragen:', error);
            document.getElementById('overdracht-aanvragenLijst').innerHTML = `
                <div class="overdracht-alert overdracht-alert-danger">
                    ${this.t('errorSearching')}: ${error.message}
                </div>
            `;
        }
    }
    
    /**
     * TOON AANVRAGEN LIJST
     */
    toonAanvragenLijst(aanvragen) {
        let html = '<div class="list-group">';
        
        aanvragen.forEach(aanvraag => {
            const statusClass = this.getStatusClass(aanvraag.status);
            const datum = new Date(aanvraag.aangemaakt_op).toLocaleDateString(
                this.currentLang === 'nl' ? 'nl-NL' : this.currentLang === 'de' ? 'de-DE' : 'en-US'
            );
            
            html += `
                <div class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="overdracht-d-flex overdracht-w-100 overdracht-justify-content-between">
                        <h6 class="overdracht-mb-1">${aanvraag.hond_naam} (${aanvraag.hond_stamboomnr || this.t('stamboomnr')})</h6>
                        <small class="text-muted">${datum}</small>
                    </div>
                    
                    <div class="overdracht-row overdracht-mt-2">
                        <div class="overdracht-col-md-12">
                            <p class="overdracht-mb-1"><small>
                                <i class="bi bi-person"></i> ${this.t('requestFrom')}: ${aanvraag.huidige_eigenaar_email}<br>
                                <i class="bi bi-person-check"></i> ${this.t('requestTo')}: ${aanvraag.nieuwe_eigenaar_email}
                            </small></p>
                        </div>
                        <div class="overdracht-col-md-12 overdracht-text-end">
                            <span class="badge ${statusClass}">${this.t(aanvraag.status)}</span>
                            <div class="btn-group btn-group-sm overdracht-mt-2">
                                <button class="btn btn-success overdracht-goedkeuren-btn" data-id="${aanvraag.id}">
                                    <i class="bi bi-check-lg"></i> ${this.t('approve')}
                                </button>
                                <button class="btn btn-danger overdracht-afwijzen-btn" data-id="${aanvraag.id}">
                                    <i class="bi bi-x-lg"></i> ${this.t('reject')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        document.getElementById('overdracht-aanvragenLijst').innerHTML = html;
        
        // Voeg event listeners toe
        document.querySelectorAll('.overdracht-goedkeuren-btn').forEach(btn => {
            btn.addEventListener('click', () => this.behandelAanvraag(btn.dataset.id, 'goedgekeurd'));
        });
        
        document.querySelectorAll('.overdracht-afwijzen-btn').forEach(btn => {
            btn.addEventListener('click', () => this.behandelAanvraag(btn.dataset.id, 'afgewezen'));
        });
    }
    
    /**
     * BEHANDEL AANVRAAG (goedkeuren/afwijzen)
     */
    async behandelAanvraag(aanvraagId, status) {
        try {
            // Haal aanvraag op
            const { data: aanvraag, error: fetchError } = await this.supabase
                .from('overdracht_aanvragen')
                .select('*')
                .eq('id', aanvraagId)
                .single();
            
            if (fetchError) throw fetchError;
            
            if (status === 'goedgekeurd') {
                // Voer de overdracht uit
                const { error: updateError } = await this.supabase
                    .from('honden')
                    .update({ 
                        toegevoegd_door: aanvraag.nieuwe_eigenaar_id,
                        bijgewerkt_op: new Date().toISOString()
                    })
                    .eq('id', aanvraag.hond_id);
                
                if (updateError) throw updateError;
            }
            
            // Update aanvraag status
            const { error: updateAanvraagError } = await this.supabase
                .from('overdracht_aanvragen')
                .update({ 
                    status: status,
                    behandeld_op: new Date().toISOString(),
                    behandeld_door: this.currentUserId
                })
                .eq('id', aanvraagId);
            
            if (updateAanvraagError) throw updateAanvraagError;
            
            // Toon bevestiging
            alert(this.t(status === 'goedgekeurd' ? 'approved' : 'rejected'));
            
            // Herlaad lijst
            this.loadAanvragen();
            
        } catch (error) {
            console.error('Fout bij behandelen aanvraag:', error);
            alert(`${this.t('requestError')}: ${error.message}`);
        }
    }
    
    /**
     * ZOEK HOND VOOR DIRECTE OVERDRACHT (verbeterd met naam + kennelnaam)
     */
    async zoekHondDirect() {
        const zoekTerm = document.getElementById('overdracht-zoekHondDirect').value.trim();
        
        if (!zoekTerm) return;
        
        try {
            let query = this.supabase
                .from('honden')
                .select(`
                    *,
                    profiles!honden_toegevoegd_door_fkey (
                        email,
                        user_id
                    )
                `);
            
            // Verbeterd zoeken zoals in aanvraag
            if (zoekTerm.includes(' ')) {
                const parts = zoekTerm.split(' ');
                const naam = parts[0];
                const kennelnaam = parts.slice(1).join(' ');
                
                query = query.or(`naam.ilike.%${naam}%,kennelnaam.ilike.%${kennelnaam}%`);
            } else {
                query = query.or(`stamboomnr.ilike.%${zoekTerm}%,naam.ilike.%${zoekTerm}%`);
            }
            
            const { data: honden, error } = await query.limit(10);
            
            if (error) throw error;
            
            let html = '<div class="list-group">';
            honden.forEach(hond => {
                const kennelNaam = hond.kennelnaam ? ` van ${hond.kennelnaam}` : '';
                html += `
                    <button class="list-group-item list-group-item-action overdracht-select-hond-direct" 
                            data-hond='${JSON.stringify(hond)}'>
                        <strong>${hond.naam}${kennelNaam}</strong> - ${hond.stamboomnr || this.t('stamboomnr')}
                        <br>
                        <small class="text-muted">${this.t('owner')}: ${hond.profiles?.email || this.t('unknown')}</small>
                    </button>
                `;
            });
            html += '</div>';
            
            document.getElementById('overdracht-zoekResultatenDirect').innerHTML = html;
            
            document.querySelectorAll('.overdracht-select-hond-direct').forEach(btn => {
                btn.addEventListener('click', () => {
                    const hond = JSON.parse(btn.dataset.hond);
                    this.selectHondDirect(hond);
                });
            });
            
        } catch (error) {
            console.error('Fout bij zoeken:', error);
        }
    }
    
    /**
     * SELECTEER HOND VOOR DIRECTE OVERDRACHT
     */
    selectHondDirect(hond) {
        this.selectedHond = hond;
        
        document.getElementById('overdracht-geselecteerdeHondDirectInfo').classList.remove('overdracht-d-none');
        
        const kennelNaam = hond.kennelnaam ? ` van ${hond.kennelnaam}` : '';
        
        document.getElementById('overdracht-geselecteerdeHondDirectDetails').innerHTML = `
            <p class="overdracht-mb-1"><strong>${this.t('name')}:</strong> ${hond.naam}${kennelNaam}</p>
            <p class="overdracht-mb-1"><strong>${this.t('stamboomnr')}:</strong> ${hond.stamboomnr || '-'}</p>
            <p class="overdracht-mb-1"><strong>${this.t('birthdate')}:</strong> ${hond.geboortedatum || '-'}</p>
        `;
        
        document.getElementById('overdracht-directHuidigeEigenaar').value = hond.profiles?.email || this.t('unknown');
        document.getElementById('overdracht-directHuidigeEigenaarId').value = hond.toegevoegd_door || '';
        
        this.checkDirectOverdrachtReady();
    }
    
    /**
     * ZOEK NIEUWE EIGENAAR
     */
    async zoekNieuweEigenaar() {
        const zoekTerm = document.getElementById('overdracht-zoekNieuweEigenaar').value.trim();
        
        if (!zoekTerm) return;
        
        try {
            const { data: profiles, error } = await this.supabase
                .from('profiles')
                .select('user_id, email, role')
                .ilike('email', `%${zoekTerm}%`)
                .limit(10);
            
            if (error) throw error;
            
            if (profiles.length === 0) {
                document.getElementById('overdracht-eigenaarZoekResultaten').innerHTML = `
                    <div class="overdracht-alert overdracht-alert-warning overdracht-py-1">${this.t('noDogsFound')}</div>
                `;
                return;
            }
            
            const select = document.getElementById('overdracht-geselecteerdeNieuweEigenaar');
            select.innerHTML = '';
            select.style.display = 'block';
            
            profiles.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile.user_id;
                option.textContent = `${profile.email} (${profile.role})`;
                select.appendChild(option);
            });
            
            document.getElementById('overdracht-eigenaarZoekResultaten').innerHTML = '';
            
        } catch (error) {
            console.error('Fout bij zoeken eigenaar:', error);
        }
    }
    
    /**
     * CHECK OF DIRECTE OVERDRACHT KLAAR IS
     */
    checkDirectOverdrachtReady() {
        const hondGeselecteerd = this.selectedHond !== null;
        const nieuweEigenaar = document.getElementById('overdracht-geselecteerdeNieuweEigenaar').value;
        
        document.getElementById('overdracht-voerDirecteUit').disabled = !(hondGeselecteerd && nieuweEigenaar);
    }
    
    /**
     * VOER DIRECTE OVERDRACHT UIT
     */
    async voerDirecteOverdrachtUit() {
        if (!this.selectedHond) {
            this.showStatus('overdracht-directStatus', this.t('selectHondFirst'), 'warning');
            return;
        }
        
        const nieuweEigenaarId = document.getElementById('overdracht-geselecteerdeNieuweEigenaar').value;
        const nieuweEigenaarText = document.getElementById('overdracht-geselecteerdeNieuweEigenaar')
            .selectedOptions[0]?.text.split(' ')[0];
        
        if (!nieuweEigenaarId) {
            this.showStatus('overdracht-directStatus', this.t('selectOwnerFirst'), 'warning');
            return;
        }
        
        const datum = document.getElementById('overdracht-datum').value;
        const opmerkingen = document.getElementById('overdracht-directOpmerkingen').value;
        
        if (!confirm(this.t('confirmTransfer', { 
            hond: this.selectedHond.naam, 
            eigenaar: nieuweEigenaarText 
        }))) {
            return;
        }
        
        try {
            document.getElementById('overdracht-voerDirecteUit').disabled = true;
            this.showStatus('overdracht-directStatus', this.t('transferBusy'), 'info');
            
            // Update de hond
            const { error: updateError } = await this.supabase
                .from('honden')
                .update({ 
                    toegevoegd_door: nieuweEigenaarId,
                    bijgewerkt_op: new Date().toISOString()
                })
                .eq('id', this.selectedHond.id);
            
            if (updateError) throw updateError;
            
            // Log de overdracht (optioneel)
            try {
                await this.supabase
                    .from('overdracht_log')
                    .insert({
                        hond_id: this.selectedHond.id,
                        hond_naam: this.selectedHond.naam,
                        oude_eigenaar_id: this.selectedHond.toegevoegd_door,
                        nieuwe_eigenaar_id: nieuweEigenaarId,
                        uitgevoerd_door: this.currentUserId,
                        datum: datum,
                        opmerkingen: opmerkingen,
                        aangemaakt_op: new Date().toISOString()
                    });
            } catch (logError) {
                if (logError.code !== '42P01') {
                    console.warn('Kon overdracht niet loggen:', logError);
                }
            }
            
            this.showStatus('overdracht-directStatus', this.t('transferSuccess'), 'success');
            
            // Reset form
            this.selectedHond = null;
            document.getElementById('overdracht-geselecteerdeHondDirectInfo').classList.add('overdracht-d-none');
            document.getElementById('overdracht-zoekHondDirect').value = '';
            document.getElementById('overdracht-zoekResultatenDirect').innerHTML = '';
            document.getElementById('overdracht-directHuidigeEigenaar').value = '';
            document.getElementById('overdracht-directHuidigeEigenaarId').value = '';
            document.getElementById('overdracht-geselecteerdeNieuweEigenaar').innerHTML = '';
            document.getElementById('overdracht-geselecteerdeNieuweEigenaar').style.display = 'none';
            document.getElementById('overdracht-zoekNieuweEigenaar').value = '';
            document.getElementById('overdracht-directOpmerkingen').value = '';
            
        } catch (error) {
            console.error('Fout bij overdracht:', error);
            this.showStatus('overdracht-directStatus', `${this.t('transferError')}: ${error.message}`, 'danger');
            document.getElementById('overdracht-voerDirecteUit').disabled = false;
        }
    }
    
    /**
     * TOON NIEUWE EIGENAAR MODAL
     */
    toonNieuweEigenaarModal() {
        // Gebruik bestaande functionaliteit voor nieuwe gebruiker
        if (window.uiHandler && window.uiHandler.showModal) {
            window.uiHandler.showModal('addUser');
        } else {
            alert('Functionaliteit voor nieuwe gebruiker komt hier');
        }
    }
    
    /**
     * TOON STATUS
     */
    showStatus(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = `overdracht-alert overdracht-alert-${type}`;
            element.textContent = message;
            element.classList.remove('overdracht-d-none');
            
            if (!message) {
                element.classList.add('overdracht-d-none');
            }
        }
    }
    
    /**
     * GET STATUS CLASS
     */
    getStatusClass(status) {
        switch(status) {
            case 'aangevraagd': return 'bg-warning text-dark';
            case 'goedgekeurd': return 'bg-success';
            case 'afgewezen': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
}

// Maak direct een instantie aan bij het laden
window.overdrachtModule = new OverdrachtModule();

// Exporteer voor gebruik
window.OverdrachtModule = OverdrachtModule;