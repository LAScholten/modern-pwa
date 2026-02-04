// InformatieManager - Module voor het tonen van de werkwijze in 3 talen
class InformatieManager {
    constructor() {
        console.log('InformatieManager geïnitialiseerd');
        this.detectLanguage();
    }

    // Detecteer taal uit localStorage of standaard Nederlands
    detectLanguage() {
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        console.log(`Taal gedetecteerd: ${this.currentLang}`);
    }

    // Get vertalingen - alleen basisteksten
    getTranslations() {
        return {
            nl: {
                modalTitle: 'De werkwijze',
                infoTitle: 'Module nog in ontwikkeling',
                infoText: 'Deze module toont straks informatie over de werkwijze binnen de app.',
                sectionTitle: 'De werkwijze module',
                sectionText: 'Hier komt informatie over de werkwijze binnen de app.',
                closeBtn: 'Sluiten'
            },
            en: {
                modalTitle: 'The Workflow',
                infoTitle: 'Module still in development',
                infoText: 'This module will soon show information about the workflow within the app.',
                sectionTitle: 'The Workflow module',
                sectionText: 'Information about the workflow within the app will appear here.',
                closeBtn: 'Close'
            },
            de: {
                modalTitle: 'Die Arbeitsweise',
                infoTitle: 'Modul noch in Entwicklung',
                infoText: 'Dieses Modul wird bald Informationen über die Arbeitsweise innerhalb der App anzeigen.',
                sectionTitle: 'Das Arbeitsweise-Modul',
                sectionText: 'Hier erscheinen Informationen über die Arbeitsweise innerhalb der App.',
                closeBtn: 'Schließen'
            }
        };
    }

    // Haal vertaalde tekst op
    getText(key) {
        this.detectLanguage(); // Always refresh language
        const translations = this.getTranslations();
        return translations[this.currentLang]?.[key] || translations.nl[key];
    }

    // Toon de werkwijze modal
    showModal() {
        console.log('InformatieManager.showModal() aangeroepen');
        
        const modalHTML = `
            <div class="modal fade" id="informatieModal" tabindex="-1" aria-labelledby="informatieModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title" id="informatieModalLabel">
                                <i class="bi bi-gear"></i> ${this.getText('modalTitle')}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.getText('closeBtn')}"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i>
                                <strong>${this.getText('infoTitle')}</strong><br>
                                ${this.getText('infoText')}
                            </div>
                            
                            <div class="text-center py-4">
                                <i class="bi bi-gear display-1 text-info"></i>
                                <h4 class="mt-3">${this.getText('sectionTitle')}</h4>
                                <p class="text-muted">${this.getText('sectionText')}</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.getText('closeBtn')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Verwijder bestaande modal als die er is
        const existingModal = document.getElementById('informatieModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Voeg de modal toe aan de DOM
        const modalsContainer = document.getElementById('modalsContainer');
        if (modalsContainer) {
            modalsContainer.innerHTML = modalHTML;
            
            // Toon de modal
            const modalElement = document.getElementById('informatieModal');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                console.log('Informatie modal getoond in taal:', this.currentLang);
            }
        } else {
            console.error('Modals container niet gevonden');
        }
    }
}

// Maak de module globaal beschikbaar
window.InformatieManager = new InformatieManager();
window.informatie = window.InformatieManager;

console.log('Informatie module geladen in 3 talen');