/**
 * OverdrachtModule - Voor het aanvragen en uitvoeren van hond overdrachten
 * @version 2.0.2
 * FIX: Hond selecteren werkt nu in BEIDE tabs (aanvraag EN directe overdracht)
 * UPDATE: Exact dezelfde zoeklogica als SearchManager
 * UPDATE: Hond moet uit dropdown worden geselecteerd
 */

class OverdrachtModule {
    constructor() {
        this.supabase = window.supabase;
        this.currentUser = null;
        this.currentUserRole = null;
        this.currentUserId = null;
        this.currentUserEmail = null;
        this.selectedHond = null;
        this.aanvragen = [];
        this.searchTimeout = null;
        this.filteredDogs = [];
        this.minSearchLength = 2; // Exact zoals SearchManager
        
        // Vertalingen
        this.translations = {
            nl: {
                moduleTitle: "Hond Overdracht Module",
                transferRequest: "Overdracht Aanvragen",
                transferManagement: "Beheer Aanvragen",
                directTransfer: "Directe Overdracht",
                closeBtn: "Sluiten",
                transferInfo: "Gebruik dit formulier om een overdracht aan te vragen voor een hond die op naam staat van de fokker. Na goedkeuring wordt de hond op jouw naam overgeschreven.",
                searchDog: "Zoek hond",
                searchDogPlaceholder: "Typ hondennaam... of 'naam kennelnaam' of stamboomnummer",
                search: "Zoeken",
                searching: "Zoeken...",
                typeMore: "Typ minimaal 2 tekens om te zoeken...",
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
                owner: "Eigenaar",
                clickToSelect: "Klik om te selecteren",
                selectDogFromList: "Selecteer een hond uit de lijst",
                found: "gevonden"
            },
            en: {
                moduleTitle: "Dog Transfer Module",
                transferRequest: "Request Transfer",
                transferManagement: "Manage Requests",
                directTransfer: "Direct Transfer",
                closeBtn: "Close",
                transferInfo: "Use this form to request a transfer for a dog registered to a breeder. After approval, the dog will be transferred to your name.",
                searchDog: "Search dog",
                searchDogPlaceholder: "Type dog name... or 'name kennelname' or registration number",
                search: "Search",
                searching: "Searching...",
                typeMore: "Type at least 2 characters to search...",
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
                owner: "Owner",
                clickToSelect: "Click to select",
                selectDogFromList: "Select a dog from the list",
                found: "found"
            },
            de: {
                moduleTitle: "Hundeübertragungsmodul",
                transferRequest: "Übertragung beantragen",
                transferManagement: "Anträge verwalten",
                directTransfer: "Direkte Übertragung",
                closeBtn: "Schließen",
                transferInfo: "Mit diesem Formular können Sie eine Übertragung für einen Hund beantragen, der auf einen Züchter registriert ist. Nach Genehmigung wird der Hund auf Ihren Namen übertragen.",
                searchDog: "Hund suchen",
                searchDogPlaceholder: "Hundenamen eingeben... oder 'Name Zwingername' oder Zuchtbuchnummer",
                search: "Suchen",
                searching: "Suche...",
                typeMore: "Geben Sie mindestens 2 Zeichen ein...",
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
                owner: "Besitzer",
                clickToSelect: "Klicken zum Auswählen",
                selectDogFromList: "Wählen Sie einen Hund aus der Liste",
                found: "gefunden"
            }
        };
        
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        
        this.injectCSS();
        this.init();
    }
    
    injectCSS() {
        if (document.getElementById('overdracht-module-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'overdracht-module-styles';
        style.textContent = `
            /* Unieke CSS voor OverdrachtModule */
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
            
            .overdracht-col-md-6 {
                flex: 0 0 50%;
                max-width: 50%;
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
            
            .overdracht-mb-1 {
                margin-bottom: 0.25rem !important;
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
            
            .overdracht-text-end {
                text-align: right !important;
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
            
            .overdracht-alert-success {
                color: #155724;
                background-color: #d4edda;
                border-color: #c3e6cb;
            }
            
            .overdracht-dog-result-item {
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                margin-bottom: 8px;
                padding: 12px 15px;
                background: white;
            }
            
            .overdracht-dog-result-item:hover {
                background-color: #f8f9fa;
                border-color: #007bff;
                transform: translateX(3px);
            }
            
            .overdracht-dog-result-item.selected {
                background-color: #e8f4fd;
                border-color: #007bff;
                border-left: 4px solid #007bff;
            }
            
            .overdracht-dog-name-line {
                font-size: 1.1rem;
                font-weight: 700;
                color: #007bff;
                margin-bottom: 8px;
            }
            
            .overdracht-dog-details-line {
                color: #495057;
                font-size: 0.95rem;
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                align-items: center;
            }
            
            .overdracht-search-stats {
                font-size: 0.85rem;
                color: #6c757d;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid #dee2e6;
            }
            
            .overdracht-search-results-container {
                max-height: 300px;
                overflow-y: auto;
            }
            
            .list-group-item {
                cursor: pointer;
            }
            
            .list-group-item:hover {
                background-color: #f8f9fa;
            }
            
            .overdracht-select-hint {
                font-size: 0.75rem;
                color: #6c757d;
                margin-top: 5px;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    async init() {
        this.currentUserId = localStorage.getItem('userId');
        this.currentUserEmail = localStorage.getItem('userEmail');
        this.currentUserRole = localStorage.getItem('userRole');
        
        console.log('📦 OverdrachtModule v2.0.2 geïnitialiseerd');
        console.log('👤 Huidige gebruiker:', this.currentUserEmail);
        console.log('👑 Rol:', this.currentUserRole);
        console.log('🌐 Taal:', this.currentLang);
    }
    
    t(key, replacements = {}) {
        let text = this.translations[this.currentLang]?.[key] || this.translations.nl[key] || key;
        
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(`{${placeholder}}`, value);
        }
        
        return text;
    }
    
    async showModal() {
        console.log('📋 OverdrachtModule showModal');
        
        const existingModal = document.getElementById('overdrachtModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const isAdmin = this.currentUserRole === 'admin';
        
        const modalHTML = this.getModalHTML(isAdmin);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalElement = document.getElementById('overdrachtModal');
        const modal = new bootstrap.Modal(modalElement);
        
        modalElement.addEventListener('shown.bs.modal', () => {
            this.setupModalEvents(isAdmin);
            
            if (isAdmin) {
                this.loadAanvragen();
            }
        });
        
        modal.show();
    }
    
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
                            <ul class="nav nav-tabs mb-3" id="overdrachtTabs" role="tablist">
                                ${userTabs}
                                ${adminTabs}
                            </ul>
                            
                            <div class="tab-content" id="overdrachtTabContent">
                                <div class="tab-pane fade show active" id="overdracht-aanvraag" role="tabpanel">
                                    ${this.getAanvraagFormHTML()}
                                </div>
                                
                                ${isAdmin ? `
                                    <div class="tab-pane fade" id="overdracht-beheer" role="tabpanel">
                                        ${this.getBeheerHTML()}
                                    </div>
                                    
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
                                       placeholder="${this.t('searchDogPlaceholder')}"
                                       autocomplete="off">
                                <button class="overdracht-btn overdracht-btn-primary" type="button" id="overdracht-zoekHondBtn" style="display: none;">
                                    <i class="bi bi-search"></i> ${this.t('search')}
                                </button>
                            </div>
                            <div class="overdracht-select-hint" id="overdracht-searchHint">
                                <i class="bi bi-info-circle"></i> ${this.t('typeMore')}
                            </div>
                            <div id="overdracht-zoekResultatenAanvraag" class="overdracht-mt-2 overdracht-search-results-container"></div>
                        </div>
                        
                        <div id="overdracht-geselecteerdeHondInfo" class="overdracht-card overdracht-mb-3 overdracht-d-none">
                            <div class="overdracht-card-header overdracht-bg-light">
                                <h6 class="overdracht-mb-0">
                                    <i class="bi bi-check-circle-fill text-success me-1"></i>
                                    ${this.t('selectedDog')}
                                </h6>
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
                            <input type="text" class="overdracht-form-control" id="overdracht-nieuweEigenaar" value="${this.currentUserEmail || ''}" readonly>
                        </div>
                        
                        <div class="overdracht-alert overdracht-alert-warning" id="overdracht-aanvraagStatus" style="display: none;"></div>
                        
                        <button type="button" class="overdracht-btn overdracht-btn-success overdracht-w-100" id="overdracht-verstuurAanvraagBtn" disabled>
                            <i class="bi bi-send"></i> ${this.t('sendRequest')}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
    
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
                                       placeholder="${this.t('searchDogPlaceholder')}"
                                       autocomplete="off">
                                <button class="overdracht-btn overdracht-btn-primary" type="button" id="overdracht-zoekHondDirectBtn" style="display: none;">
                                    <i class="bi bi-search"></i> ${this.t('search')}
                                </button>
                            </div>
                            <div class="overdracht-select-hint" id="overdracht-direct-searchHint">
                                <i class="bi bi-info-circle"></i> ${this.t('typeMore')}
                            </div>
                            <div id="overdracht-zoekResultatenDirect" class="overdracht-mt-2 overdracht-search-results-container"></div>
                        </div>
                        
                        <div id="overdracht-geselecteerdeHondDirectInfo" class="overdracht-card overdracht-mb-3 overdracht-d-none">
                            <div class="overdracht-card-header overdracht-bg-light">
                                <h6 class="overdracht-mb-0">
                                    <i class="bi bi-check-circle-fill text-success me-1"></i>
                                    ${this.t('selectedDog')}
                                </h6>
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
                        
                        <div class="overdracht-alert overdracht-alert-danger" id="overdracht-directStatus" style="display: none;"></div>
                        
                        <button type="button" class="overdracht-btn overdracht-btn-warning overdracht-w-100" id="overdracht-voerDirecteUit" disabled>
                            <i class="bi bi-arrow-left-right"></i> ${this.t('executeTransfer')}
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
    
    setupModalEvents(isAdmin) {
        console.log('Setting up modal events, isAdmin:', isAdmin);
        
        // Setup zoekfunctionaliteit voor aanvraag tab (exact zoals SearchManager)
        this.setupSearchForElement('overdracht-zoekHondAanvraag', 'overdracht-zoekResultatenAanvraag', 'overdracht-searchHint', 'aanvraag');
        
        if (isAdmin) {
            // Setup zoekfunctionaliteit voor directe overdracht tab
            this.setupSearchForElement('overdracht-zoekHondDirect', 'overdracht-zoekResultatenDirect', 'overdracht-direct-searchHint', 'direct');
            
            document.getElementById('overdracht-refreshAanvragenBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadAanvragen();
            });
            
            document.getElementById('overdracht-zoekEigenaarBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.zoekNieuweEigenaar();
            });
            
            document.getElementById('overdracht-maakNieuweEigenaarBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.toonNieuweEigenaarModal();
            });
            
            document.getElementById('overdracht-voerDirecteUit')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.voerDirecteOverdrachtUit();
            });
            
            document.getElementById('overdracht-geselecteerdeNieuweEigenaar')?.addEventListener('change', () => {
                this.checkDirectOverdrachtReady();
            });
        }
        
        document.getElementById('overdracht-verstuurAanvraagBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.verstuurAanvraag();
        });
        
        document.getElementById('overdrachtTabs')?.addEventListener('shown.bs.tab', (event) => {
            if (event.target.id === 'overdracht-beheer-tab') {
                this.loadAanvragen();
            }
        });
    }
    
    /**
     * Setup zoekfunctionaliteit voor een specifiek element
     * EXACT DEZELFDE ZOEKLOGICA ALS SEARCHMANAGER
     */
    setupSearchForElement(inputId, resultsId, hintId, context) {
        const searchInput = document.getElementById(inputId);
        const resultsContainer = document.getElementById(resultsId);
        const hintElement = document.getElementById(hintId);
        
        if (!searchInput) return;
        
        let searchTimeout = null;
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            if (searchTerm.length === 0) {
                if (hintElement) {
                    hintElement.innerHTML = `<i class="bi bi-info-circle"></i> ${this.t('typeMore')}`;
                    hintElement.style.color = '#6c757d';
                }
                if (resultsContainer) {
                    resultsContainer.innerHTML = '';
                }
                if (context === 'aanvraag') {
                    document.getElementById('overdracht-geselecteerdeHondInfo')?.classList.add('overdracht-d-none');
                    this.selectedHond = null;
                    const verstuurBtn = document.getElementById('overdracht-verstuurAanvraagBtn');
                    if (verstuurBtn) verstuurBtn.disabled = true;
                } else if (context === 'direct') {
                    document.getElementById('overdracht-geselecteerdeHondDirectInfo')?.classList.add('overdracht-d-none');
                    this.selectedHond = null;
                    this.checkDirectOverdrachtReady();
                }
                return;
            }
            
            if (searchTerm.length < this.minSearchLength) {
                if (hintElement) {
                    hintElement.innerHTML = `<i class="bi bi-exclamation-circle text-warning"></i> ${this.t('typeMore')}`;
                    hintElement.style.color = '#856404';
                }
                return;
            }
            
            if (hintElement) {
                hintElement.innerHTML = `<i class="bi bi-hourglass-split"></i> ${this.t('searching')}`;
                hintElement.style.color = '#0c5460';
            }
            
            searchTimeout = setTimeout(() => {
                this.searchDogs(searchTerm, context);
            }, 300);
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const firstResult = resultsContainer?.querySelector('.overdracht-dog-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            }
        });
    }
    
    /**
     * ZOEK HONDEN - EXACT DEZELFDE LOGICA ALS SEARCHMANAGER
     */
    async searchDogs(searchTerm, context) {
        try {
            console.log(`🔍 OverdrachtModule zoeken naar: "${searchTerm}" (context: ${context})`);
            
            if (!this.supabase) {
                console.error('❌ Geen Supabase client');
                return;
            }
            
            if (searchTerm.length < this.minSearchLength) {
                this.displaySearchResults([], context, searchTerm);
                return;
            }
            
            const words = searchTerm.trim().split(/\s+/).filter(word => word.length > 0);
            
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
            
            // EXACT DEZELFDE ZOEKLOGICA ALS SEARCHMANAGER
            if (words.length === 1) {
                // Eén woord: zoek in alle velden
                query = query.or(`naam.ilike.%${searchTerm}%,kennelnaam.ilike.%${searchTerm}%,stamboomnr.ilike.%${searchTerm}%`);
            } else {
                // Meerdere woorden: maak combinaties voor "naam kennelnaam"
                const conditions = [];
                
                // 1. De hele string in naam
                conditions.push(`naam.ilike.%${searchTerm}%`);
                
                // 2. De hele string in kennelnaam
                conditions.push(`kennelnaam.ilike.%${searchTerm}%`);
                
                // 3. Eerste woord in naam, rest in kennelnaam
                const firstWord = words[0];
                const restWords = words.slice(1).join(' ');
                conditions.push(`and(naam.ilike.%${firstWord}%,kennelnaam.ilike.%${restWords}%)`);
                
                // 4. Eerste woord in kennelnaam, rest in naam
                conditions.push(`and(kennelnaam.ilike.%${firstWord}%,naam.ilike.%${restWords}%)`);
                
                // 5. Alle woorden moeten voorkomen in naam (AND)
                const naamConditions = words.map(w => `naam.ilike.%${w}%`).join(',');
                conditions.push(`and(${naamConditions})`);
                
                // 6. Alle woorden moeten voorkomen in kennelnaam (AND)
                const kennelConditions = words.map(w => `kennelnaam.ilike.%${w}%`).join(',');
                conditions.push(`and(${kennelConditions})`);
                
                // Combineer alle opties met OR
                query = query.or(conditions.join(','));
            }
            
            const { data, error } = await query
                .order('naam')
                .limit(100);
            
            if (error) {
                console.error('❌ Database error:', error);
                this.displaySearchResults([], context, searchTerm);
                return;
            }
            
            console.log(`✅ ${data?.length || 0} honden gevonden`);
            this.displaySearchResults(data || [], context, searchTerm);
            
        } catch (error) {
            console.error('❌ Fout bij zoeken:', error);
            this.displaySearchResults([], context, searchTerm);
        }
    }
    
    /**
     * TOON ZOEKRESULTATEN - MET SELECTIE UIT DROPDOWN
     * Gebruikt event delegation voor betrouwbare click handlers
     */
    displaySearchResults(dogs, context, searchTerm) {
        const resultsId = context === 'aanvraag' ? 'overdracht-zoekResultatenAanvraag' : 'overdracht-zoekResultatenDirect';
        const resultsContainer = document.getElementById(resultsId);
        const hintId = context === 'aanvraag' ? 'overdracht-searchHint' : 'overdracht-direct-searchHint';
        const hintElement = document.getElementById(hintId);
        
        if (!resultsContainer) return;
        
        if (!dogs || dogs.length === 0) {
            resultsContainer.innerHTML = `
                <div class="overdracht-alert overdracht-alert-warning">
                    <i class="bi bi-exclamation-triangle"></i> 
                    ${this.t('noDogsFound')}
                </div>
            `;
            if (hintElement) {
                hintElement.innerHTML = `<i class="bi bi-info-circle"></i> ${this.t('typeMore')}`;
                hintElement.style.color = '#6c757d';
            }
            return;
        }
        
        if (hintElement) {
            hintElement.innerHTML = `<i class="bi bi-check-circle text-success"></i> ${dogs.length} ${this.t('found')}`;
            hintElement.style.color = '#155724';
        }
        
        let html = `
            <div class="overdracht-search-stats">
                <i class="bi bi-info-circle me-1"></i>
                ${dogs.length} honden gevonden ${searchTerm ? `voor "${this.escapeHtml(searchTerm)}"` : ''}
                <br>
                <small><i class="bi bi-hand-index"></i> ${this.t('clickToSelect')}</small>
            </div>
            <div class="overdracht-dog-results-list">
        `;
        
        dogs.forEach(dog => {
            const genderText = dog.geslacht === 'reuen' ? 'Reu' : 
                              dog.geslacht === 'teven' ? 'Teef' : this.t('unknown');
            
            // Gebruik een unieke ID voor elk item om problemen met apostrofs te voorkomen
            const dogId = dog.id;
            
            html += `
                <div class="overdracht-dog-result-item" data-dog-id="${dogId}" data-context="${context}">
                    <div class="overdracht-dog-name-line">
                        <span class="overdracht-dog-name">${this.escapeHtml(dog.naam || this.t('unknown'))}</span>
                        ${dog.kennelnaam ? `<span class="text-muted ms-2">${this.escapeHtml(dog.kennelnaam)}</span>` : ''}
                    </div>
                    
                    <div class="overdracht-dog-details-line">
                        ${dog.stamboomnr ? `<span class="stamboom">${this.escapeHtml(dog.stamboomnr)}</span>` : ''}
                        ${dog.ras ? `<span class="ras">${this.escapeHtml(dog.ras)}</span>` : ''}
                        <span class="geslacht">${genderText}</span>
                        <span class="owner">${this.t('owner')}: ${this.escapeHtml(dog.profiles?.email || this.t('unknown'))}</span>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        resultsContainer.innerHTML = html;
        
        // Sla de honden data op in een Map voor snelle toegang
        if (!this.dogsCache) {
            this.dogsCache = new Map();
        }
        dogs.forEach(dog => {
            this.dogsCache.set(dog.id, dog);
        });
        
        // Gebruik event delegation op de container voor betrouwbare click handling
        resultsContainer.removeEventListener('click', this.handleDogClick);
        this.handleDogClick = (e) => {
            // Zoek het dichtstbijzijnde .overdracht-dog-result-item element
            const resultItem = e.target.closest('.overdracht-dog-result-item');
            if (!resultItem) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            const dogId = resultItem.getAttribute('data-dog-id');
            const itemContext = resultItem.getAttribute('data-context');
            
            if (!dogId) return;
            
            const hondData = this.dogsCache.get(parseInt(dogId));
            if (!hondData) {
                console.error('Hond data niet gevonden voor ID:', dogId);
                return;
            }
            
            // Verwijder selected class van alle items in deze container
            resultsContainer.querySelectorAll('.overdracht-dog-result-item').forEach(item => {
                item.classList.remove('selected');
            });
            resultItem.classList.add('selected');
            
            console.log(`🐕 Hond geselecteerd voor context: ${itemContext}`, hondData.naam);
            
            if (itemContext === 'aanvraag') {
                this.selectHondVoorAanvraag(hondData);
            } else if (itemContext === 'direct') {
                this.selectHondDirect(hondData);
            }
        };
        resultsContainer.addEventListener('click', this.handleDogClick);
    }
    
    selectHondVoorAanvraag(hond) {
        console.log('🐕 Hond geselecteerd voor aanvraag:', hond.naam);
        this.selectedHond = hond;
        
        const eigenaarEmail = hond.profiles?.email || this.t('unknown');
        
        // Controleer of de huidige gebruiker niet al de eigenaar is
        if (hond.toegevoegd_door === this.currentUserId) {
            this.showStatus('overdracht-aanvraagStatus', this.t('alreadyOwner'), 'danger');
            const verstuurBtn = document.getElementById('overdracht-verstuurAanvraagBtn');
            if (verstuurBtn) verstuurBtn.disabled = true;
            return;
        }
        
        const infoDiv = document.getElementById('overdracht-geselecteerdeHondInfo');
        if (infoDiv) infoDiv.classList.remove('overdracht-d-none');
        
        const kennelNaam = hond.kennelnaam ? ` van ${hond.kennelnaam}` : '';
        
        const detailsDiv = document.getElementById('overdracht-geselecteerdeHondDetails');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <div class="overdracht-row">
                    <div class="overdracht-col-md-6">
                        <p class="overdracht-mb-1"><strong><i class="bi bi-tag"></i> ${this.t('name')}:</strong> ${this.escapeHtml(hond.naam)}${this.escapeHtml(kennelNaam)}</p>
                        <p class="overdracht-mb-1"><strong><i class="bi bi-upc-scan"></i> ${this.t('stamboomnr')}:</strong> ${this.escapeHtml(hond.stamboomnr || '-')}</p>
                        <p class="overdracht-mb-1"><strong><i class="bi bi-puzzle"></i> ${this.t('breed')}:</strong> ${this.escapeHtml(hond.ras || '-')}</p>
                    </div>
                    <div class="overdracht-col-md-6">
                        <p class="overdracht-mb-1"><strong><i class="bi bi-calendar"></i> ${this.t('birthdate')}:</strong> ${this.escapeHtml(hond.geboortedatum || '-')}</p>
                        <p class="overdracht-mb-1"><strong><i class="bi bi-person"></i> ${this.t('currentOwner')}:</strong> ${this.escapeHtml(eigenaarEmail)}</p>
                    </div>
                </div>
            `;
        }
        
        const huidigeEigenaarInput = document.getElementById('overdracht-huidigeEigenaar');
        if (huidigeEigenaarInput) huidigeEigenaarInput.value = eigenaarEmail;
        
        const verstuurBtn = document.getElementById('overdracht-verstuurAanvraagBtn');
        if (verstuurBtn) verstuurBtn.disabled = false;
        
        this.showStatus('overdracht-aanvraagStatus', '', 'info');
    }
    
    selectHondDirect(hond) {
        console.log('🐕 Hond geselecteerd voor directe overdracht:', hond.naam);
        this.selectedHond = hond;
        
        const infoDiv = document.getElementById('overdracht-geselecteerdeHondDirectInfo');
        if (infoDiv) infoDiv.classList.remove('overdracht-d-none');
        
        const kennelNaam = hond.kennelnaam ? ` van ${hond.kennelnaam}` : '';
        
        const detailsDiv = document.getElementById('overdracht-geselecteerdeHondDirectDetails');
        if (detailsDiv) {
            detailsDiv.innerHTML = `
                <div class="overdracht-row">
                    <div class="overdracht-col-md-6">
                        <p class="overdracht-mb-1"><strong><i class="bi bi-tag"></i> ${this.t('name')}:</strong> ${this.escapeHtml(hond.naam)}${this.escapeHtml(kennelNaam)}</p>
                        <p class="overdracht-mb-1"><strong><i class="bi bi-upc-scan"></i> ${this.t('stamboomnr')}:</strong> ${this.escapeHtml(hond.stamboomnr || '-')}</p>
                        <p class="overdracht-mb-1"><strong><i class="bi bi-puzzle"></i> ${this.t('breed')}:</strong> ${this.escapeHtml(hond.ras || '-')}</p>
                    </div>
                    <div class="overdracht-col-md-6">
                        <p class="overdracht-mb-1"><strong><i class="bi bi-calendar"></i> ${this.t('birthdate')}:</strong> ${this.escapeHtml(hond.geboortedatum || '-')}</p>
                        <p class="overdracht-mb-1"><strong><i class="bi bi-person"></i> ${this.t('owner')}:</strong> ${this.escapeHtml(hond.profiles?.email || this.t('unknown'))}</p>
                    </div>
                </div>
            `;
        }
        
        const huidigeEigenaarInput = document.getElementById('overdracht-directHuidigeEigenaar');
        if (huidigeEigenaarInput) huidigeEigenaarInput.value = hond.profiles?.email || this.t('unknown');
        
        const huidigeEigenaarIdInput = document.getElementById('overdracht-directHuidigeEigenaarId');
        if (huidigeEigenaarIdInput) huidigeEigenaarIdInput.value = hond.toegevoegd_door || '';
        
        this.checkDirectOverdrachtReady();
    }
    
    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    async verstuurAanvraag() {
        if (!this.selectedHond) {
            this.showStatus('overdracht-aanvraagStatus', this.t('selectDogFirst'), 'warning');
            return;
        }
        
        try {
            const verstuurBtn = document.getElementById('overdracht-verstuurAanvraagBtn');
            if (verstuurBtn) verstuurBtn.disabled = true;
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
            const infoDiv = document.getElementById('overdracht-geselecteerdeHondInfo');
            if (infoDiv) infoDiv.classList.add('overdracht-d-none');
            
            const searchInput = document.getElementById('overdracht-zoekHondAanvraag');
            if (searchInput) searchInput.value = '';
            
            const resultsContainer = document.getElementById('overdracht-zoekResultatenAanvraag');
            if (resultsContainer) resultsContainer.innerHTML = '';
            
            this.selectedHond = null;
            
            const hintElement = document.getElementById('overdracht-searchHint');
            if (hintElement) {
                hintElement.innerHTML = `<i class="bi bi-info-circle"></i> ${this.t('typeMore')}`;
                hintElement.style.color = '#6c757d';
            }
            
            // Her-enable button na 2 seconden
            setTimeout(() => {
                if (verstuurBtn) verstuurBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Fout bij versturen aanvraag:', error);
            this.showStatus('overdracht-aanvraagStatus', `${this.t('requestError')}: ${error.message}`, 'danger');
            const verstuurBtn = document.getElementById('overdracht-verstuurAanvraagBtn');
            if (verstuurBtn) verstuurBtn.disabled = false;
        }
    }
    
    async loadAanvragen() {
        try {
            const lijstContainer = document.getElementById('overdracht-aanvragenLijst');
            if (!lijstContainer) return;
            
            lijstContainer.innerHTML = `
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
                    lijstContainer.innerHTML = `
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
                lijstContainer.innerHTML = `
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
            const lijstContainer = document.getElementById('overdracht-aanvragenLijst');
            if (lijstContainer) {
                lijstContainer.innerHTML = `
                    <div class="overdracht-alert overdracht-alert-danger">
                        ${this.t('errorSearching')}: ${error.message}
                    </div>
                `;
            }
        }
    }
    
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
                        <h6 class="overdracht-mb-1">${this.escapeHtml(aanvraag.hond_naam)} (${this.escapeHtml(aanvraag.hond_stamboomnr || this.t('stamboomnr'))})</h6>
                        <small class="text-muted">${datum}</small>
                    </div>
                    
                    <div class="overdracht-row overdracht-mt-2">
                        <div class="overdracht-col-md-12">
                            <p class="overdracht-mb-1"><small>
                                <i class="bi bi-person"></i> ${this.t('requestFrom')}: ${this.escapeHtml(aanvraag.huidige_eigenaar_email)}<br>
                                <i class="bi bi-person-check"></i> ${this.t('requestTo')}: ${this.escapeHtml(aanvraag.nieuwe_eigenaar_email)}
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
        
        const lijstContainer = document.getElementById('overdracht-aanvragenLijst');
        if (lijstContainer) {
            lijstContainer.innerHTML = html;
        }
        
        document.querySelectorAll('.overdracht-goedkeuren-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.behandelAanvraag(btn.dataset.id, 'goedgekeurd');
            });
        });
        
        document.querySelectorAll('.overdracht-afwijzen-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.behandelAanvraag(btn.dataset.id, 'afgewezen');
            });
        });
    }
    
    async behandelAanvraag(aanvraagId, status) {
        try {
            const { data: aanvraag, error: fetchError } = await this.supabase
                .from('overdracht_aanvragen')
                .select('*')
                .eq('id', aanvraagId)
                .single();
            
            if (fetchError) throw fetchError;
            
            if (status === 'goedgekeurd') {
                const { error: updateError } = await this.supabase
                    .from('honden')
                    .update({ 
                        toegevoegd_door: aanvraag.nieuwe_eigenaar_id,
                        bijgewerkt_op: new Date().toISOString()
                    })
                    .eq('id', aanvraag.hond_id);
                
                if (updateError) throw updateError;
            }
            
            const { error: updateAanvraagError } = await this.supabase
                .from('overdracht_aanvragen')
                .update({ 
                    status: status,
                    behandeld_op: new Date().toISOString(),
                    behandeld_door: this.currentUserId
                })
                .eq('id', aanvraagId);
            
            if (updateAanvraagError) throw updateAanvraagError;
            
            alert(this.t(status === 'goedgekeurd' ? 'approved' : 'rejected'));
            this.loadAanvragen();
            
        } catch (error) {
            console.error('Fout bij behandelen aanvraag:', error);
            alert(`${this.t('requestError')}: ${error.message}`);
        }
    }
    
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
    
    checkDirectOverdrachtReady() {
        const hondGeselecteerd = this.selectedHond !== null;
        const nieuweEigenaarSelect = document.getElementById('overdracht-geselecteerdeNieuweEigenaar');
        const nieuweEigenaar = nieuweEigenaarSelect ? nieuweEigenaarSelect.value : null;
        
        const voerUitBtn = document.getElementById('overdracht-voerDirecteUit');
        if (voerUitBtn) {
            voerUitBtn.disabled = !(hondGeselecteerd && nieuweEigenaar);
        }
    }
    
    async voerDirecteOverdrachtUit() {
        if (!this.selectedHond) {
            this.showStatus('overdracht-directStatus', this.t('selectHondFirst'), 'warning');
            return;
        }
        
        const nieuweEigenaarSelect = document.getElementById('overdracht-geselecteerdeNieuweEigenaar');
        const nieuweEigenaarId = nieuweEigenaarSelect ? nieuweEigenaarSelect.value : null;
        const nieuweEigenaarText = nieuweEigenaarSelect && nieuweEigenaarSelect.selectedOptions[0] 
            ? nieuweEigenaarSelect.selectedOptions[0].text.split(' ')[0] 
            : '';
        
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
            const voerUitBtn = document.getElementById('overdracht-voerDirecteUit');
            if (voerUitBtn) voerUitBtn.disabled = true;
            this.showStatus('overdracht-directStatus', this.t('transferBusy'), 'info');
            
            const { error: updateError } = await this.supabase
                .from('honden')
                .update({ 
                    toegevoegd_door: nieuweEigenaarId,
                    bijgewerkt_op: new Date().toISOString()
                })
                .eq('id', this.selectedHond.id);
            
            if (updateError) throw updateError;
            
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
            const infoDiv = document.getElementById('overdracht-geselecteerdeHondDirectInfo');
            if (infoDiv) infoDiv.classList.add('overdracht-d-none');
            
            const searchInput = document.getElementById('overdracht-zoekHondDirect');
            if (searchInput) searchInput.value = '';
            
            const resultsContainer = document.getElementById('overdracht-zoekResultatenDirect');
            if (resultsContainer) resultsContainer.innerHTML = '';
            
            const huidigeEigenaarInput = document.getElementById('overdracht-directHuidigeEigenaar');
            if (huidigeEigenaarInput) huidigeEigenaarInput.value = '';
            
            const huidigeEigenaarIdInput = document.getElementById('overdracht-directHuidigeEigenaarId');
            if (huidigeEigenaarIdInput) huidigeEigenaarIdInput.value = '';
            
            const eigenaarSelect = document.getElementById('overdracht-geselecteerdeNieuweEigenaar');
            if (eigenaarSelect) {
                eigenaarSelect.innerHTML = '';
                eigenaarSelect.style.display = 'none';
            }
            
            const zoekEigenaarInput = document.getElementById('overdracht-zoekNieuweEigenaar');
            if (zoekEigenaarInput) zoekEigenaarInput.value = '';
            
            const opmerkingenInput = document.getElementById('overdracht-directOpmerkingen');
            if (opmerkingenInput) opmerkingenInput.value = '';
            
            const hintElement = document.getElementById('overdracht-direct-searchHint');
            if (hintElement) {
                hintElement.innerHTML = `<i class="bi bi-info-circle"></i> ${this.t('typeMore')}`;
                hintElement.style.color = '#6c757d';
            }
            
            this.checkDirectOverdrachtReady();
            
            // Her-enable button na 2 seconden
            setTimeout(() => {
                if (voerUitBtn) voerUitBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Fout bij overdracht:', error);
            this.showStatus('overdracht-directStatus', `${this.t('transferError')}: ${error.message}`, 'danger');
            const voerUitBtn = document.getElementById('overdracht-voerDirecteUit');
            if (voerUitBtn) voerUitBtn.disabled = false;
        }
    }
    
    toonNieuweEigenaarModal() {
        if (window.uiHandler && window.uiHandler.showModal) {
            window.uiHandler.showModal('addUser');
        } else {
            alert('Functionaliteit voor nieuwe gebruiker komt hier');
        }
    }
    
    showStatus(elementId, message, type) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = `overdracht-alert overdracht-alert-${type}`;
            element.textContent = message;
            element.style.display = message ? 'block' : 'none';
        }
    }
    
    getStatusClass(status) {
        switch(status) {
            case 'aangevraagd': return 'bg-warning text-dark';
            case 'goedgekeurd': return 'bg-success';
            case 'afgewezen': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }
}

window.overdrachtModule = new OverdrachtModule();
window.OverdrachtModule = OverdrachtModule;