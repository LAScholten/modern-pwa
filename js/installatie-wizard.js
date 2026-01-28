/**
 * Installatie Wizard voor PWA snelkoppeling instructies
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = document.querySelector('title')?.textContent || 'Mijn App';
        this.currentBrowser = this.detectBrowser();
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        console.log('🌐 Browser:', this.currentBrowser);
        console.log('📱 App naam:', this.appName);
        
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Edg/') || ua.includes('Edge/')) return 'Edge';
        if (ua.includes('Chrome') && !ua.includes('Edg/') && !ua.includes('Edge/')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        
        return 'Unknown';
    }
    
    setupEventListeners() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🚀 beforeinstallprompt event triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.updateInstallButtonText();
            
            setTimeout(() => {
                this.showInstallButton();
            }, 5000);
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('🎉 Snelkoppeling succesvol toegevoegd!');
            this.isInstalled = true;
            this.markAsInstalled();
            this.hideInstallButton();
        });
        
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
            this.markAsInstalled();
        }
    }
    
    setupInstallatieWizard() {
        this.injectStyles();
        window.installatieWizard = this;
        
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
            .step {
                margin-bottom: 15px;
                padding: 12px 15px;
                border-left: 4px solid #0d6efd;
                background: #f8f9fa;
                border-radius: 0 8px 8px 0;
            }
            .step-number {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
                background: #0d6efd;
                color: white;
                border-radius: 50%;
                margin-right: 12px;
                font-weight: bold;
                font-size: 0.9em;
            }
            .keyboard-key {
                display: inline-block;
                padding: 2px 8px;
                font-family: monospace;
                font-size: 0.9em;
                background: #e9ecef;
                border: 1px solid #adb5bd;
                border-radius: 4px;
                box-shadow: 0 2px 0 #adb5bd;
                margin: 0 2px;
            }
            .edge-method {
                background: #e3f2fd;
                border-left: 4px solid #0078d7;
                padding: 15px;
                margin: 15px 0;
                border-radius: 0 10px 10px 0;
            }
            .method-card {
                border: 2px solid #dee2e6;
                border-radius: 10px;
                margin-bottom: 15px;
                overflow: hidden;
            }
            .method-header {
                background: #f8f9fa;
                padding: 12px 15px;
                border-bottom: 1px solid #dee2e6;
                font-weight: bold;
            }
            .method-body {
                padding: 15px;
            }
            .browser-badge {
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 0.85em;
                font-weight: bold;
                margin-right: 8px;
            }
            .edge-badge { background: #0078d7; color: white; }
            .chrome-badge { background: #4285f4; color: white; }
            .firefox-badge { background: #ff7139; color: white; }
            .safari-badge { background: #000000; color: white; }
        `;
        document.head.appendChild(style);
    }
    
    checkIfInstalled() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('📱 App draait in standalone modus');
            this.isInstalled = true;
            this.markAsInstalled();
            return;
        }
        
        if (window.navigator.standalone === true) {
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
            this.deferredPrompt.prompt();
            
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('✅ Snelkoppeling geaccepteerd');
                    localStorage.setItem('pwaInstalled', 'true');
                    this.isInstalled = true;
                    this.markAsInstalled();
                } else {
                    console.log('❌ Snelkoppeling geweigerd');
                    setTimeout(() => {
                        this.showSnelkoppelingInstructions();
                    }, 500);
                }
                this.deferredPrompt = null;
            });
        } else {
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
                <i class="bi bi-plus-circle"></i> ${this.appName}
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
    
    getEdgeInstructions() {
        return {
            title: "Microsoft Edge (Windows)",
            methods: [
                {
                    title: "Methode 1: Developer Tools (altijd werkend)",
                    steps: [
                        "Druk op <span class='keyboard-key'>F12</span>",
                        "Klik op tabblad <strong>'Application'</strong>",
                        "Klik op <strong>'Manifest'</strong> in linker menu",
                        "Klik op <button class='btn btn-sm btn-success'><i class='bi bi-download'></i> Install</button>"
                    ]
                },
                {
                    title: "Methode 2: Via browser menu",
                    steps: [
                        "Klik op <strong>drie puntjes</strong> rechtsboven",
                        "Ga naar <strong>'Apps'</strong>",
                        "Kies <strong>'Deze site installeren'</strong>"
                    ]
                },
                {
                    title: "Methode 3: Handmatig (als bovenstaande niet werkt)",
                    steps: [
                        "Ga naar: edge://apps/",
                        "Klik rechtsboven op <strong>'Sitelijst ophalen uit Microsoft'</strong>",
                        "Zoek deze site en klik op <strong>'Toevoegen'</strong>"
                    ]
                }
            ],
            note: "Edge toont vaak geen installatie-icoon in de adresbalk. Gebruik Methode 1."
        };
    }
    
    getChromeInstructions() {
        return {
            title: "Google Chrome",
            methods: [
                {
                    title: "Standaard methode",
                    steps: [
                        "Kijk in adresbalk voor <strong>download icoon</strong> <i class='bi bi-download'></i>",
                        "Klik erop als het verschijnt",
                        "Kies <strong>'Installeren'</strong>"
                    ]
                },
                {
                    title: "Alternatief via menu",
                    steps: [
                        "Klik op <strong>drie puntjes</strong> rechtsboven",
                        "Ga naar <strong>'Meer tools'</strong>",
                        "Kies <strong>'Toevoegen aan bureaublad'</strong>"
                    ]
                }
            ],
            note: "Chrome toont het icoon vaak pas na meerdere bezoeken."
        };
    }
    
    getFirefoxInstructions() {
        return {
            title: "Mozilla Firefox",
            methods: [
                {
                    title: "Standaard methode",
                    steps: [
                        "Kijk in adresbalk voor <strong>'+' icoon</strong>",
                        "Klik erop als het verschijnt",
                        "Kies <strong>'Toevoegen'</strong>"
                    ]
                },
                {
                    title: "Alternatief",
                    steps: [
                        "Klik met rechts op pagina",
                        "Kies <strong>'Toevoegen aan bureaublad'</strong>"
                    ]
                }
            ],
            note: "Firefox heeft goede PWA ondersteuning."
        };
    }
    
    getSafariInstructions() {
        return {
            title: "Apple Safari (macOS)",
            methods: [
                {
                    title: "Voor macOS",
                    steps: [
                        "Ga naar <strong>Bestand</strong> in menubalk",
                        "Kies <strong>'Toevoegen aan Dock'</strong>",
                        "Of gebruik <span class='keyboard-key'>Cmd</span>+<span class='keyboard-key'>Shift</span>+<span class='keyboard-key'>D</span>"
                    ]
                },
                {
                    title: "Voor iOS/iPadOS",
                    steps: [
                        "Open in <strong>Safari</strong> (niet andere browser)",
                        "Tik op <strong>deel icoon</strong> <i class='bi bi-share'></i>",
                        "Scroll naar <strong>'Voeg toe aan beginscherm'</strong>"
                    ]
                }
            ],
            note: "Alleen Safari ondersteunt PWA op Apple apparaten."
        };
    }
    
    showSnelkoppelingInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let stepsHTML = '';
        let title = `${this.appName} - Snelkoppeling`;
        
        // Eenvoudige intro
        const introHtml = `
            <div class="alert alert-info mb-4">
                <div class="d-flex align-items-center">
                    <i class="bi bi-info-circle fs-4 me-3"></i>
                    <div>
                        <strong>Snelkoppeling maken voor ${this.appName}</strong><br>
                        <small>Voeg deze webapp toe aan je beginscherm, bureaublad of startmenu voor snelle toegang.</small>
                    </div>
                </div>
            </div>
        `;
        
        if (isMobile) {
            if (isIOS) {
                title = `${this.appName} op iPhone/iPad`;
                stepsHTML = `
                    ${introHtml}
                    
                    <div class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong>Belangrijk:</strong> Gebruik <strong>Safari</strong>, andere browsers werken niet voor snelkoppelingen op iOS.
                    </div>
                    
                    <div class="method-card">
                        <div class="method-header">
                            <span class="browser-badge safari-badge">Safari</span> Stappen voor iPhone/iPad
                        </div>
                        <div class="method-body">
                            <div class="step">
                                <span class="step-number">1</span> Open deze pagina in <strong>Safari</strong>
                            </div>
                            <div class="step">
                                <span class="step-number">2</span> Tik op het <strong>deel-icoon</strong> 
                                <span class="badge bg-primary ms-1"><i class="bi bi-share"></i></span> onderin beeld
                            </div>
                            <div class="step">
                                <span class="step-number">3</span> Scroll omlaag en kies <strong>"Voeg toe aan beginscherm"</strong>
                            </div>
                            <div class="step">
                                <span class="step-number">4</span> Tik op <strong class="text-success">"Voeg toe"</strong> rechtsboven
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-success">
                        <i class="bi bi-check-circle me-2"></i>
                        De snelkoppeling verschijnt nu op je beginscherm!
                    </div>
                `;
            } else if (isAndroid) {
                title = `${this.appName} op Android`;
                
                stepsHTML = `
                    ${introHtml}
                    
                    <div class="method-card">
                        <div class="method-header">
                            <span class="browser-badge chrome-badge">Chrome</span> Voor Android (Chrome browser)
                        </div>
                        <div class="method-body">
                            <div class="step">
                                <span class="step-number">1</span> Tik op de <strong>drie puntjes</strong> 
                                <span class="badge bg-info ms-1"><i class="bi bi-three-dots-vertical"></i></span> rechtsboven
                            </div>
                            <div class="step">
                                <span class="step-number">2</span> Selecteer <strong>"Toevoegen aan beginscherm"</strong>
                            </div>
                            <div class="step">
                                <span class="step-number">3</span> Bevestig met <strong class="text-success">"Toevoegen"</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-info mt-3">
                        <i class="bi bi-lightbulb me-2"></i>
                        Werkt ook in Firefox, Samsung Browser en andere Android browsers via hun menu.
                    </div>
                `;
            }
        } else {
            // Desktop instructies - opgedeeld per browser
            title = `${this.appName} op Computer`;
            
            let browserInstructions;
            let browserBadge;
            
            switch(this.currentBrowser) {
                case 'Edge':
                    browserInstructions = this.getEdgeInstructions();
                    browserBadge = `<span class="browser-badge edge-badge">Edge</span>`;
                    break;
                case 'Chrome':
                    browserInstructions = this.getChromeInstructions();
                    browserBadge = `<span class="browser-badge chrome-badge">Chrome</span>`;
                    break;
                case 'Firefox':
                    browserInstructions = this.getFirefoxInstructions();
                    browserBadge = `<span class="browser-badge firefox-badge">Firefox</span>`;
                    break;
                case 'Safari':
                    browserInstructions = this.getSafariInstructions();
                    browserBadge = `<span class="browser-badge safari-badge">Safari</span>`;
                    break;
                default:
                    browserInstructions = this.getEdgeInstructions(); // fallback
                    browserBadge = `<span class="browser-badge bg-secondary">Browser</span>`;
            }
            
            stepsHTML = `
                ${introHtml}
                
                <div class="method-card">
                    <div class="method-header">
                        ${browserBadge} ${browserInstructions.title}
                    </div>
                    <div class="method-body">
                        ${browserInstructions.methods.map((method, methodIndex) => `
                            <div class="${methodIndex > 0 ? 'mt-4' : ''}">
                                <h6 class="mb-3">${method.title}</h6>
                                ${method.steps.map((step, stepIndex) => `
                                    <div class="step">
                                        <span class="step-number">${stepIndex + 1}</span> ${step}
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                        
                        ${browserInstructions.note ? `
                            <div class="alert alert-warning mt-3">
                                <i class="bi bi-info-circle me-2"></i> ${browserInstructions.note}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Andere browsers -->
                <div class="mt-4">
                    <button class="btn btn-outline-secondary btn-sm w-100" 
                            onclick="this.classList.add('d-none'); document.getElementById('otherBrowsers').classList.remove('d-none')">
                        <i class="bi bi-browser-edge me-1"></i> Instructies voor andere browsers
                    </button>
                    
                    <div id="otherBrowsers" class="d-none mt-3">
                        ${this.currentBrowser !== 'Chrome' ? `
                            <div class="method-card">
                                <div class="method-header">
                                    <span class="browser-badge chrome-badge">Chrome</span> Google Chrome
                                </div>
                                <div class="method-body">
                                    <div class="step">
                                        <span class="step-number">1</span> Zoek download icoon in adresbalk
                                    </div>
                                    <div class="step">
                                        <span class="step-number">2</span> Of: Drie puntjes → Meer tools → Toevoegen aan bureaublad
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${this.currentBrowser !== 'Firefox' ? `
                            <div class="method-card">
                                <div class="method-header">
                                    <span class="browser-badge firefox-badge">Firefox</span> Mozilla Firefox
                                </div>
                                <div class="method-body">
                                    <div class="step">
                                        <span class="step-number">1</span> Zoek '+' icoon in adresbalk
                                    </div>
                                    <div class="step">
                                        <span class="step-number">2</span> Of: Rechtsklik → Toevoegen aan bureaublad
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="alert alert-success mt-3">
                    <i class="bi bi-lightbulb me-2"></i>
                    <strong>Tip:</strong> Na toevoegen verschijnt ${this.appName} in je startmenu, op bureaublad of taakbalk voor snelle toegang.
                </div>
            `;
        }
        
        // Update modal
        const modalTitle = document.querySelector('#installModal .modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="bi bi-plus-square me-2"></i>${title}`;
        }
        
        const installStepsElement = document.getElementById('installSteps');
        if (installStepsElement) {
            installStepsElement.innerHTML = stepsHTML;
        }
        
        // Toon modal
        const installModal = new bootstrap.Modal(document.getElementById('installModal'));
        installModal.show();
    }
    
    updateInstallButtonText() {
        const updateButton = (btn) => {
            if (btn && !this.isInstalled) {
                btn.innerHTML = `<i class="bi bi-plus-circle"></i> ${this.appName}`;
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
                btn.innerHTML = `<i class="bi bi-check2-circle"></i> ${this.appName}`;
                btn.classList.remove('btn-warning', 'install-btn-pulse');
                btn.classList.add('btn-success');
                btn.disabled = false;
            }
        };
        
        updateButton(document.getElementById('pwaInstallBtn'));
        updateButton(document.getElementById('pwaInstallBtnMobile'));
        
        this.hideFloatingInstallBadge();
        this.showSuccessMessage();
    }
    
    showSuccessMessage() {
        const platform = /Android/i.test(navigator.userAgent) ? 'Android' :
                        /iPhone|iPad/i.test(navigator.userAgent) ? 'iOS' :
                        'computer';
        
        const toastHTML = `
            <div class="toast align-items-center text-white bg-success border-0" 
                 role="alert" aria-live="assertive" aria-atomic="true" id="installSuccessToast">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <strong>${this.appName}</strong> toegevoegd!
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                            data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        const toastContainer = document.createElement('div');
        toastContainer.innerHTML = toastHTML;
        document.body.appendChild(toastContainer);
        
        const toastElement = document.getElementById('installSuccessToast');
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();
        
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Initialisatie
document.addEventListener('DOMContentLoaded', function() {
    new InstallatieWizard();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstallatieWizard;
}