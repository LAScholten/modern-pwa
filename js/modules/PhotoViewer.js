// js/modules/PhotoViewer.js
/**
 * PhotoViewer Module - Zelf-initialiserend
 * Alleen verantwoordelijk voor het tonen van vergrote foto's
 * Wordt pas actief bij eerste aanroep
 */

class PhotoViewer {
    constructor() {
        this.modalElement = null;
        this.modal = null;
        this.currentLang = localStorage.getItem('appLanguage') || 'nl';
        this.initialized = false;
        
        this.translations = {
            nl: { close: "Sluiten" },
            en: { close: "Close" },
            de: { close: "Schließen" }
        };
        
        // Vaste reference voor de cleanup functie
        this.handleHidden = this.handleHidden.bind(this);
    }

    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    /**
     * Toon een vergrote foto - initialiseert zichzelf indien nodig
     * @param {string} imageUrl - De URL of base64 data van de foto
     * @param {string} dogName - Naam van de hond (wordt in header getoond)
     */
    showPhoto(imageUrl, dogName = '') {
        // Initialiseer bij eerste gebruik
        if (!this.initialized) {
            console.log('📸 PhotoViewer wordt voor eerste keer geïnitialiseerd');
            this.initialized = true;
        }
        
        // ALTIJD eerst grondig opruimen
        this.cleanup();
        
        // Kleine vertraging om zeker te zijn dat cleanup klaar is
        setTimeout(() => {
            // Maak modal HTML
            const modalHTML = `
                <div class="modal fade" id="photoViewerModal" tabindex="-1" aria-hidden="true" style="z-index: 1060;">
                    <div class="modal-dialog modal-fullscreen">
                        <div class="modal-content photo-viewer-content">
                            <div class="modal-header photo-viewer-header">
                                <h5 class="modal-title photo-viewer-title">
                                    <i class="bi bi-image"></i> 
                                    <span id="photoViewerDogName">${this.escapeHtml(dogName)}</span>
                                </h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="${this.t('close')}"></button>
                            </div>
                            <div class="modal-body photo-viewer-body">
                                <div class="photo-viewer-container">
                                    <div class="photo-viewer-image-wrapper">
                                        <img id="photoViewerImage" class="photo-viewer-image" src="${imageUrl}" alt="${this.escapeHtml(dogName)}">
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer photo-viewer-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${this.t('close')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Voeg modal toe aan DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Voeg CSS toe als die nog niet bestaat
            this.addStyles();

            // Toon modal
            this.modalElement = document.getElementById('photoViewerModal');
            this.modal = new bootstrap.Modal(this.modalElement);
            
            // Cleanup bij sluiten - gebruik de gebinde functie
            this.modalElement.addEventListener('hidden.bs.modal', this.handleHidden);

            this.modal.show();
        }, 100);
    }

    /**
     * Grondige cleanup van ALLES
     */
    cleanup() {
        // Verwijder ALLE mogelijke photoviewer modals
        const allModals = document.querySelectorAll('[id*="photoViewerModal"]');
        allModals.forEach(modal => {
            try {
                // Probeer Bootstrap modal te disposen als die bestaat
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.dispose();
                }
            } catch (e) {
                // Negeer fouten
            }
            modal.remove();
        });
        
        // Verwijder alle modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // Reset class variabelen
        this.modalElement = null;
        this.modal = null;
        
        // Verwijder body classes die Bootstrap toevoegt
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }

    /**
     * Handler voor hidden event
     */
    handleHidden() {
        console.log('📸 PhotoViewer wordt opgeruimd');
        this.cleanup();
    }

    /**
     * Escape HTML om XSS te voorkomen
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Voeg CSS styling toe
     */
    addStyles() {
        if (document.getElementById('photoViewerStyles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'photoViewerStyles';
        styleElement.textContent = `
            /* Photo Viewer Modal */
            #photoViewerModal {
                z-index: 1060 !important;
            }
            
            #photoViewerModal .modal-backdrop {
                z-index: 1059 !important;
            }
            
            .photo-viewer-content {
                background-color: rgba(0, 0, 0, 0.95) !important;
                border: none !important;
            }
            
            .photo-viewer-header {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                background-color: rgba(0, 0, 0, 0.8);
                color: white !important;
                padding: 0.75rem 1rem !important;
            }
            
            .photo-viewer-title {
                color: white !important;
                font-size: 1.1rem !important;
            }
            
            .photo-viewer-title i {
                margin-right: 0.5rem;
                color: #ffc107;
            }
            
            .photo-viewer-body {
                padding: 0 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background-color: black !important;
                min-height: calc(100vh - 120px) !important;
            }
            
            .photo-viewer-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .photo-viewer-image-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .photo-viewer-image {
                max-width: 100%;
                max-height: calc(100vh - 140px);
                object-fit: contain;
                border-radius: 4px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            
            .photo-viewer-footer {
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                background-color: rgba(0, 0, 0, 0.8) !important;
                padding: 0.75rem 1rem !important;
                justify-content: center !important;
            }
            
            #photoViewerModal .btn-close {
                filter: invert(1) grayscale(100%) brightness(200%);
            }
        `;

        document.head.appendChild(styleElement);
    }

    /**
     * Update taal
     */
    updateLanguage(lang) {
        this.currentLang = lang;
    }
}

// Maak global beschikbaar, maar initialiseer NIET
window.PhotoViewerClass = PhotoViewer;

// Lazy initialization: maak pas een instance als hij voor het eerst wordt gebruikt
Object.defineProperty(window, 'photoViewer', {
    get: function() {
        if (!this._photoViewer) {
            console.log('📸 PhotoViewer instance wordt lazy aangemaakt');
            this._photoViewer = new PhotoViewer();
        }
        return this._photoViewer;
    },
    configurable: true,
    enumerable: true
});