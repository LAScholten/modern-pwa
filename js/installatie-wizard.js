/**
 * Installatie Wizard voor PWA installatie instructies
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    setupEventListeners() {
        // Luister naar het beforeinstallprompt event (Chrome, Edge, etc.)
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🚀 beforeinstallprompt event triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.updateInstallButtonText();
            
            // Toon installatie knop automatisch na 5 seconden
            setTimeout(() => {
                this.showInstallButton();
            }, 5000);
        });
        
        // Luister wanneer app is geïnstalleerd
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA succesvol geïnstalleerd!');
            this.isInstalled = true;
            this.markAsInstalled();
            this.hideInstallButton();
        });
        
        // Check of app al in standalone modus draait (iOS)
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            this.markAsInstalled();
        }
    }
    
    setupInstallatieWizard() {
        // Injecteer eventuele extra styles
        this.injectStyles();
        
        // Maak de wizard beschikbaar in window object
        window.installatieWizard = this;
        
        // Voeg klik handlers toe aan installatie knoppen
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
        // Voeg extra styles toe indien nodig
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
        `;
        document.head.appendChild(style);
    }
    
    checkIfInstalled() {
        // Check of app al geïnstalleerd is
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('📱 App draait in standalone modus (geïnstalleerd)');
            this.isInstalled = true;
            this.markAsInstalled();
            return;
        }
        
        // Voor iOS
        if (window.navigator.standalone === true) {
            console.log('📱 iOS app is geïnstalleerd');
            this.isInstalled = true;
            this.markAsInstalled();
        }
        
        // Check localStorage voor installatie status
        if (localStorage.getItem('pwaInstalled') === 'true') {
            this.isInstalled = true;
            this.markAsInstalled();
        }
    }
    
    handleInstallClick() {
        if (this.isInstalled) {
            this.showInstallInstructions();
            return;
        }
        
        // Als er een deferred prompt is, toon die
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('✅ Gebruiker heeft installatie geaccepteerd');
                    localStorage.setItem('pwaInstalled', 'true');
                    this.isInstalled = true;
                    this.markAsInstalled();
                } else {
                    console.log('❌ Gebruiker heeft installatie geweigerd');
                    // Toon instructies als alternatief
                    setTimeout(() => {
                        this.showInstallInstructions();
                    }, 500);
                }
                this.deferredPrompt = null;
            });
        } else {
            // Geen browser prompt beschikbaar, toon instructies
            this.showInstallInstructions();
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
                btn.style.display = 'block';
                btn.classList.add('install-btn-pulse');
            }
        });
        
        // Toon ook een floating badge op mobiel
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
        // Verwijder bestaande badge
        this.hideFloatingInstallBadge();
        
        // Maak nieuwe badge
        const badge = document.createElement('div');
        badge.className = 'install-badge';
        badge.innerHTML = `
            <button class="btn btn-warning btn-lg shadow-lg install-btn-pulse"
                    onclick="installatieWizard.handleInstallClick()">
                <i class="bi bi-download"></i> Install App
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
    
    showInstallInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
        
        let stepsHTML = '';
        let title = 'App Installeren';
        
        if (isMobile) {
            if (isIOS) {
                title = 'Installeren op iPhone/iPad';
                stepsHTML = `
                    <div class="step">
                        <span class="step-number">1</span> Druk op het <strong>deel icoon</strong> <i class="bi bi-share"></i> onderin Safari
                    </div>
                    <div class="step">
                        <span class="step-number">2</span> Scroll naar beneden en klik op <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span> Klik op <strong>"Toevoegen"</strong> in de popup
                    </div>
                    <div class="step">
                        <span class="step-number">4</span> De app verschijnt nu op je beginscherm!
                    </div>
                    <div class="alert alert-info mt-3">
                        <i class="bi bi-info-circle"></i> 
                        <strong>Tip:</strong> Gebruik altijd Safari browser voor de beste ervaring op iOS.
                    </div>
                `;
            } else if (isAndroid) {
                title = 'Installeren op Android';
                if (isSamsung) {
                    stepsHTML = `
                        <div class="step">
                            <span class="step-number">1</span> Druk op het <strong>menu knop</strong> (3 lijnen) in Samsung Browser
                        </div>
                        <div class="step">
                            <span class="step-number">2</span> Kies <strong>"Toevoegen aan beginscherm"</strong>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span> Klik op <strong>"Toevoegen"</strong>
                        </div>
                    `;
                } else {
                    stepsHTML = `
                        <div class="step">
                            <span class="step-number">1</span> Druk op de <strong>3 puntjes</strong> <i class="bi bi-three-dots-vertical"></i> in Chrome
                        </div>
                        <div class="step">
                            <span class="step-number">2</span> Kies <strong>"Toevoegen aan beginscherm"</strong>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span> Klik op <strong>"Toevoegen"</strong>
                        </div>
                        <div class="step">
                            <span class="step-number">4</span> De app verschijnt nu op je beginscherm!
                        </div>
                    `;
                }
            }
        } else {
            title = 'Installeren op Desktop';
            stepsHTML = `
                <div class="step">
                    <span class="step-number">1</span> Zoek in je browser naar de <strong>installatie knop</strong>:
                </div>
                <div class="row text-center mt-3">
                    <div class="col-md-3 col-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <i class="bi bi-browser-chrome" style="font-size: 2rem; color: #4285f4;"></i>
                                <h6>Chrome</h6>
                                <small class="text-muted">Klik op install icoon rechts van adresbalk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <i class="bi bi-browser-edge" style="font-size: 2rem; color: #0078d7;"></i>
                                <h6>Edge</h6>
                                <small class="text-muted">Klik op "+" icoon rechts van adresbalk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <i class="bi bi-browser-firefox" style="font-size: 2rem; color: #ff7139;"></i>
                                <h6>Firefox</h6>
                                <small class="text-muted">Klik op "+" in adresbalk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <i class="bi bi-apple" style="font-size: 2rem;"></i>
                                <h6>Safari</h6>
                                <small class="text-muted">Kies "Toevoegen aan Dock" in menu</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="step mt-4">
                    <span class="step-number">2</span> Als er geen installatie knop verschijnt:
                    <ul class="mt-2">
                        <li>Druk op <kbd>F12</kbd> voor Developer Tools (Chrome/Edge)</li>
                        <li>Ga naar tab <strong>"Application"</strong> → <strong>"Manifest"</strong></li>
                        <li>Klik op <strong>"Install"</strong> knop</li>
                    </ul>
                </div>
                <div class="alert alert-warning mt-3">
                    <i class="bi bi-exclamation-triangle"></i> 
                    <strong>Let op:</strong> Sommige browsers tonen alleen de installatie knop na meerdere bezoeken.
                </div>
            `;
        }
        
        // Update modal titel
        const modalTitle = document.querySelector('#installModal .modal-title');
        if (modalTitle) {
            modalTitle.textContent = title;
        }
        
        // Update de stappen
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
                btn.innerHTML = '<i class="bi bi-download"></i> Installeer App';
                btn.classList.add('btn-warning', 'install-btn-pulse');
                btn.style.display = 'block';
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
    }
    
    markAsInstalled() {
        const updateButton = (btn) => {
            if (btn) {
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Geïnstalleerd';
                btn.classList.remove('btn-warning', 'install-btn-pulse');
                btn.classList.add('btn-success');
                btn.disabled = true;
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
        
        // Verberg floating badge
        this.hideFloatingInstallBadge();
    }
}

// Auto-initialiseer de wizard
document.addEventListener('DOMContentLoaded', function() {
    new InstallatieWizard();
});

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstallatieWizard;
}