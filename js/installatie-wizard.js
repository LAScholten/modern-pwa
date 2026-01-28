/**
 * Installatie Wizard voor PWA snelkoppeling instructies
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = document.querySelector('meta[name="application-name"]')?.content || 'Mijn App';
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    setupEventListeners() {
        // Voor browsers die beforeinstallprompt ondersteunen (Chrome, Edge, etc.)
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🚀 beforeinstallprompt event triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Laat zien dat er een snelkoppeling kan worden gemaakt
            this.updateInstallButtonText();
            
            // Toon knop automatisch na 5 seconden
            setTimeout(() => {
                this.showInstallButton();
            }, 5000);
        });
        
        // Wanneer app is toegevoegd aan beginscherm
        window.addEventListener('appinstalled', () => {
            console.log('🎉 Snelkoppeling succesvol toegevoegd!');
            this.isInstalled = true;
            this.markAsInstalled();
            this.hideInstallButton();
        });
        
        // Check of app al in standalone modus draait
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            this.markAsInstalled();
        }
    }
    
    setupInstallatieWizard() {
        this.injectStyles();
        window.installatieWizard = this;
        
        // Klik handlers voor installatie knoppen
        document.addEventListener('click', (e) => {
            if (e.target.id === 'pwaInstallBtn' || 
                e.target.id === 'pwaInstallBtnMobile' ||
                e.target.closest('#pwaInstallBtn') || 
                e.target.closest('#pwaInstallBtnMobile')) {
                this.handleInstallClick();
            }
        });
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .install-btn-pulse {
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
            }
            .install-badge {
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 9999;
            }
            .icon-preview {
                width: 64px;
                height: 64px;
                margin: 10px auto;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                background: #f8f9fa;
                border: 2px solid #dee2e6;
            }
            .step {
                margin-bottom: 15px;
                padding: 10px;
                border-left: 3px solid #0d6efd;
                background: #f8f9fa;
                border-radius: 0 8px 8px 0;
            }
            .step-number {
                display: inline-block;
                width: 25px;
                height: 25px;
                background: #0d6efd;
                color: white;
                border-radius: 50%;
                text-align: center;
                margin-right: 10px;
                line-height: 25px;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
    
    checkIfInstalled() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('📱 App draait in standalone modus (snelkoppeling bestaat)');
            this.isInstalled = true;
            this.markAsInstalled();
            return;
        }
        
        if (window.navigator.standalone === true) {
            console.log('📱 iOS snelkoppeling bestaat');
            this.isInstalled = true;
            this.markAsInstalled();
        }
        
        if (localStorage.getItem('pwaInstalled') === 'true') {
            this.isInstalled = true;
            this.markAsInstalled();
        }
    }
    
    handleInstallClick() {
        if (this.isInstalled) {
            this.showSnelkoppelingInstructions();
            return;
        }
        
        if (this.deferredPrompt) {
            // Browser ondersteunt native installatie prompt
            this.deferredPrompt.prompt();
            
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('✅ Gebruiker heeft snelkoppeling geaccepteerd');
                    localStorage.setItem('pwaInstalled', 'true');
                    this.isInstalled = true;
                    this.markAsInstalled();
                } else {
                    console.log('❌ Gebruiker heeft snelkoppeling geweigerd');
                    setTimeout(() => {
                        this.showSnelkoppelingInstructions();
                    }, 500);
                }
                this.deferredPrompt = null;
            });
        } else {
            // Toon handmatige instructies
            this.showSnelkoppelingInstructions();
        }
    }
    
    showInstallButton() {
        if (this.isInstalled) return;
        
        const buttons = [
            document.getElementById('pwaInstallBtn'),
            document.getElementById('pwaInstallBtnMobile')
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.style.display = 'inline-block';
                btn.classList.add('install-btn-pulse');
            }
        });
        
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            this.showFloatingInstallBadge();
        }
    }
    
    hideInstallButton() {
        const buttons = [
            document.getElementById('pwaInstallBtn'),
            document.getElementById('pwaInstallBtnMobile')
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.style.display = 'none';
            }
        });
        
        this.hideFloatingInstallBadge();
    }
    
    showFloatingInstallBadge() {
        this.hideFloatingInstallBadge();
        
        const badge = document.createElement('div');
        badge.className = 'install-badge';
        badge.innerHTML = `
            <button class="btn btn-warning btn-lg shadow-lg install-btn-pulse"
                    onclick="installatieWizard.handleInstallClick()">
                <i class="bi bi-plus-square"></i> Snelkoppeling
            </button>
        `;
        badge.id = 'floatingInstallBadge';
        document.body.appendChild(badge);
    }
    
    hideFloatingInstallBadge() {
        const badge = document.getElementById('floatingInstallBadge');
        if (badge) {
            badge.remove();
        }
    }
    
    showSnelkoppelingInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);
        
        let stepsHTML = '';
        let title = 'Snelkoppeling Maken';
        
        // Haal het icoon op uit het manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        let iconUrl = '/icon-192x192.png'; // Default icoon
        let iconHtml = '';
        
        if (manifestLink) {
            fetch(manifestLink.href)
                .then(response => response.json())
                .then(manifest => {
                    if (manifest.icons && manifest.icons.length > 0) {
                        // Zoek het beste icoon voor preview
                        const bestIcon = manifest.icons.sort((a, b) => 
                            parseInt(b.sizes?.split('x')[0] || 0) - parseInt(a.sizes?.split('x')[0] || 0)
                        )[0];
                        
                        // Update preview in modal
                        const iconPreview = document.querySelector('.icon-preview');
                        if (iconPreview) {
                            iconPreview.innerHTML = `<img src="${bestIcon.src}" alt="${this.appName} icoon" style="width:100%;height:100%;border-radius:12px;">`;
                        }
                    }
                })
                .catch(console.error);
        }
        
        iconHtml = `
            <div class="icon-preview">
                <i class="bi bi-app-indicator text-primary"></i>
            </div>
            <p class="text-center small text-muted">Dit icoon wordt gebruikt voor je snelkoppeling</p>
        `;
        
        if (isMobile) {
            if (isIOS) {
                title = 'Snelkoppeling op iPhone/iPad';
                stepsHTML = `
                    ${iconHtml}
                    <div class="step">
                        <span class="step-number">1</span> Open deze pagina in <strong>Safari</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span> Tik op het <strong>deel-icoon</strong> <i class="bi bi-share"></i> onderin beeld
                    </div>
                    <div class="step">
                        <span class="step-number">3</span> Scroll omlaag en kies <strong>"Voeg toe aan beginscherm"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span> Tik op <strong>"Voeg toe"</strong> rechtsboven
                    </div>
                    <div class="step">
                        <span class="step-number">5</span> Je ziet nu een snelkoppeling met het ${this.appName} icoon op je beginscherm!
                    </div>
                    <div class="alert alert-info mt-3">
                        <i class="bi bi-lightbulb"></i> 
                        <strong>Belangrijk:</strong> Gebruik altijd Safari voor het beste resultaat. Het icoon komt uit je PWA-instellingen.
                    </div>
                `;
            } else if (isAndroid) {
                title = 'Snelkoppeling op Android';
                let browserName = 'je browser';
                let browserIcon = '<i class="bi bi-three-dots-vertical"></i>';
                let step1 = '';
                
                if (isChrome) {
                    browserName = 'Chrome';
                    browserIcon = '<i class="bi bi-three-dots-vertical"></i>';
                    step1 = 'Tik op de 3 puntjes rechtsboven';
                } else if (isFirefox) {
                    browserName = 'Firefox';
                    browserIcon = '<i class="bi bi-three-dots"></i>';
                    step1 = 'Tik op de 3 puntjes rechtsboven';
                } else {
                    step1 = 'Open het menu van je browser';
                }
                
                stepsHTML = `
                    ${iconHtml}
                    <div class="step">
                        <span class="step-number">1</span> ${step1} ${browserIcon}
                    </div>
                    <div class="step">
                        <span class="step-number">2</span> Kies <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span> Tik op <strong>"Toevoegen"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span> Een snelkoppeling met het ${this.appName} icoon verschijnt nu op je beginscherm!
                    </div>
                    <div class="alert alert-success mt-3">
                        <i class="bi bi-check-circle"></i> 
                        <strong>Tip:</strong> Android gebruikt automatisch het icoon uit je PWA-instellingen.
                    </div>
                `;
            }
        } else {
            // Desktop instructies
            title = 'Snelkoppeling op Computer';
            stepsHTML = `
                ${iconHtml}
                <div class="step">
                    <span class="step-number">1</span> Zoek in je browser naar de <strong>snelkoppeling optie</strong>:
                </div>
                
                <div class="row mt-3">
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-header bg-primary text-white">
                                <i class="bi bi-browser-chrome"></i> Chrome / Edge
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">A</span> Klik op het <strong>installatie-icoon</strong> <i class="bi bi-download"></i> rechts van de adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">B</span> Kies <strong>"Installen"</strong> of <strong>"Toevoegen"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">C</span> De snelkoppeling met ${this.appName} icoon wordt toegevoegd aan je startmenu/bureaublad
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-header bg-success text-white">
                                <i class="bi bi-browser-firefox"></i> Firefox
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">A</span> Klik op het <strong>"+"</strong> icoon in de adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">B</span> Kies <strong>"Toevoegen aan bureaublad"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">C</span> Klik op <strong>"Toevoegen"</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="step mt-3">
                    <span class="step-number">2</span> <strong>Handmatig toevoegen (als bovenstaande niet werkt):</strong>
                    <div class="mt-2">
                        <ul>
                            <li>Druk op <kbd>F12</kbd> voor Developer Tools</li>
                            <li>Ga naar tab <strong>"Application"</strong> → <strong>"Manifest"</strong></li>
                            <li>Klik op <strong>"Install"</strong> of <strong>"Create shortcut"</strong></li>
                        </ul>
                    </div>
                </div>
                
                <div class="alert alert-warning mt-3">
                    <i class="bi bi-info-circle"></i> 
                    <strong>Het icoon:</strong> Alle browsers gebruiken automatisch het icoon dat is ingesteld in je PWA. 
                    Dit kan een paar seconden duren bij de eerste keer.
                </div>
            `;
        }
        
        // Update modal
        const modalTitle = document.querySelector('#installModal .modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="bi bi-link-45deg"></i> ${title}`;
        }
        
        const installStepsElement = document.getElementById('installSteps');
        if (installStepsElement) {
            installStepsElement.innerHTML = stepsHTML;
        }
        
        // Toon de modal
        const installModal = new bootstrap.Modal(document.getElementById('installModal'));
        installModal.show();
    }
    
    updateInstallButtonText() {
        const updateButton = (btn) => {
            if (btn && !this.isInstalled) {
                btn.innerHTML = '<i class="bi bi-plus-square"></i> Snelkoppeling maken';
                btn.classList.add('btn-warning', 'install-btn-pulse');
                btn.style.display = 'inline-block';
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
    }
    
    markAsInstalled() {
        const updateButton = (btn) => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Snelkoppeling bestaat';
                btn.classList.remove('btn-warning', 'install-btn-pulse');
                btn.classList.add('btn-success');
                btn.disabled = false;
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
        
        this.hideFloatingInstallBadge();
        
        // Toon succesmelding
        this.showSuccessMessage();
    }
    
    showSuccessMessage() {
        const toastHTML = `
            <div class="toast align-items-center text-white bg-success border-0" 
                 role="alert" aria-live="assertive" aria-atomic="true" id="installSuccessToast">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        Snelkoppeling succesvol toegevoegd!
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        // Voeg toast toe aan body
        const toastContainer = document.createElement('div');
        toastContainer.innerHTML = toastHTML;
        document.body.appendChild(toastContainer);
        
        // Toon de toast
        const toastElement = document.getElementById('installSuccessToast');
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();
        
        // Verwijder na animatie
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Auto-initialisatie
document.addEventListener('DOMContentLoaded', function() {
    new InstallatieWizard();
});

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstallatieWizard;
}