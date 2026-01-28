/**
 * Installatie Wizard voor PWA snelkoppeling instructies
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = '';
        this.appIcon = '';
        this.currentBrowser = this.detectBrowser();
        this.init();
    }
    
    async init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        console.log('🌐 Browser:', this.currentBrowser);
        
        // Haal PWA informatie op
        await this.getPWAInfo();
        
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Edg/') || ua.includes('Edge/')) {
            return 'Edge';
        }
        if (ua.includes('Chrome') && !ua.includes('Edg/') && !ua.includes('Edge/')) {
            return 'Chrome';
        }
        if (ua.includes('Firefox')) {
            return 'Firefox';
        }
        if (ua.includes('Safari') && !ua.includes('Chrome')) {
            return 'Safari';
        }
        
        return 'Unknown';
    }
    
    async getPWAInfo() {
        try {
            // 1. Haal app naam op
            this.appName = document.querySelector('title')?.textContent || 
                          document.querySelector('meta[property="og:site_name"]')?.content ||
                          'Mijn App';
            
            console.log('🔍 Zoek PWA icoon in modern-pwa/img/icons/');
            
            // 2. DIRECT naar jouw PWA icons zoeken
            const yourPwaIcons = [
                'modern-pwa/img/icons/icon-512x512.png',
                'modern-pwa/img/icons/icon-192x192.png',
                'modern-pwa/img/icons/icon-256x256.png',
                'modern-pwa/img/icons/icon.png',
                'modern-pwa/img/icons/app-icon.png',
                'modern-pwa/img/icons/logo.png',
            ];
            
            // Probeer elk icoon
            for (const iconPath of yourPwaIcons) {
                const iconUrl = this.makeAbsoluteUrl(iconPath);
                
                try {
                    const response = await fetch(iconUrl, { method: 'HEAD' });
                    if (response.ok) {
                        this.appIcon = iconUrl;
                        console.log('✅ JOUW PWA icoon gevonden:', iconUrl);
                        return;
                    }
                } catch (error) {
                    continue;
                }
            }
            
            // Geen icoon gevonden
            console.log('⚠️ Geen icoon gevonden');
            
        } catch (error) {
            console.error('❌ Fout bij ophalen PWA info:', error);
        }
    }
    
    makeAbsoluteUrl(url) {
        if (!url) return '';
        
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        
        if (url.startsWith('/')) {
            return window.location.origin + url;
        }
        
        const base = window.location.origin;
        return base + '/' + url;
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
            .icon-preview-container {
                text-align: center;
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
                border: 2px solid #dee2e6;
            }
            .icon-preview {
                width: 96px;
                height: 96px;
                margin: 0 auto 15px;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                background: white;
                border: 3px solid #dee2e6;
            }
            .icon-preview img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                padding: 8px;
                display: block;
            }
            .step {
                margin-bottom: 15px;
                padding: 12px;
                border-left: 4px solid #0d6efd;
                background: #f8f9fa;
                border-radius: 0 8px 8px 0;
            }
            .step-number {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                background: #0d6efd;
                color: white;
                border-radius: 50%;
                margin-right: 12px;
                font-weight: bold;
                font-size: 0.9em;
            }
            .keyboard-key {
                display: inline-block;
                padding: 2px 6px;
                font-family: monospace;
                font-size: 0.9em;
                background: #e9ecef;
                border: 1px solid #adb5bd;
                border-radius: 4px;
                box-shadow: 0 2px 0 #adb5bd;
                margin: 0 2px;
            }
            .edge-specific {
                background: #e3f2fd;
                border-left: 4px solid #0078d7;
                padding: 12px;
                margin: 10px 0;
                border-radius: 0 8px 8px 0;
            }
            .method-tabs {
                border-bottom: 2px solid #dee2e6;
                margin-bottom: 20px;
            }
            .method-tab {
                padding: 10px 20px;
                background: none;
                border: none;
                border-bottom: 3px solid transparent;
                cursor: pointer;
            }
            .method-tab.active {
                border-bottom: 3px solid #0d6efd;
                font-weight: bold;
                color: #0d6efd;
            }
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
        // Edge specifieke instructies omdat het icoon vaak niet verschijnt
        return {
            method1: {
                title: "Methode 1: Via Developer Tools (meest betrouwbaar)",
                steps: [
                    "Druk op <span class='keyboard-key'>F12</span> of <span class='keyboard-key'>Ctrl</span>+<span class='keyboard-key'>Shift</span>+<span class='keyboard-key'>I</span>",
                    "Klik op het tabblad <strong>'Application'</strong> aan de bovenkant",
                    "Klik in het linker menu op <strong>'Manifest'</strong>",
                    "Klik op de knop <button class='btn btn-sm btn-success'><i class='bi bi-download'></i> Install</button>",
                    "Bevestig het toevoegen van de snelkoppeling"
                ]
            },
            method2: {
                title: "Methode 2: Via browser instellingen",
                steps: [
                    "Klik op de <strong>drie puntjes</strong> <i class='bi bi-three-dots'></i> rechtsboven",
                    "Ga naar <strong>'Apps'</strong> in het menu",
                    "Kies <strong>'Deze site installeren'</strong>",
                    "Volg de instructies om de app toe te voegen"
                ]
            },
            method3: {
                title: "Methode 3: Via adresbalk (als het icoon verschijnt)",
                steps: [
                    "Kijk in de adresbalk voor een <strong>'+' icoon</strong> of <strong>download icoon</strong>",
                    "Klik erop als het verschijnt",
                    "Kies <strong>'Installeren'</strong>",
                    "Let op: Dit icoon verschijnt niet altijd in Edge"
                ]
            },
            warning: "Edge laat het installatie-icoon vaak niet zien. Gebruik Methode 1 voor het beste resultaat."
        };
    }
    
    showSnelkoppelingInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let stepsHTML = '';
        let title = `${this.appName} - Snelkoppeling`;
        
        // Toon het gevonden icoon
        let iconHtml = '';
        if (this.appIcon) {
            iconHtml = `
                <div class="icon-preview-container">
                    <div class="icon-preview">
                        <img src="${this.appIcon}" 
                             alt="${this.appName} icoon"
                             style="width:100%;height:100%;object-fit:contain;">
                    </div>
                    <h5>${this.appName}</h5>
                    <p class="text-muted mb-0">Dit icoon wordt gebruikt voor de snelkoppeling</p>
                </div>
            `;
        }
        
        if (isMobile) {
            if (isIOS) {
                title = `${this.appName} op iPhone/iPad`;
                stepsHTML = `
                    ${iconHtml}
                    <div class="alert alert-primary">
                        <i class="bi bi-phone me-2"></i>
                        <strong>Voor iOS:</strong> Gebruik Safari voor het toevoegen aan beginscherm
                    </div>
                    
                    <div class="step">
                        <span class="step-number">1</span> Open deze pagina in <strong>Safari</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Tik op het <strong class="text-primary">deel-icoon</strong> 
                        <span class="badge bg-primary ms-1"><i class="bi bi-share"></i></span> onderin beeld
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Scroll omlaag en kies <strong>"Voeg toe aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> Bevestig met <strong class="text-success">"Voeg toe"</strong>
                    </div>
                `;
            } else if (isAndroid) {
                title = `${this.appName} op Android`;
                
                stepsHTML = `
                    ${iconHtml}
                    
                    <div class="alert alert-info">
                        <i class="bi bi-android me-2"></i>
                        <strong>Voor Android:</strong> Werkt in Chrome, Firefox en andere browsers
                    </div>
                    
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
                `;
            }
        } else {
            // Desktop instructies - SPECIALE VERSIE VOOR EDGE
            title = `${this.appName} op Computer`;
            
            if (this.currentBrowser === 'Edge') {
                const edgeInfo = this.getEdgeInstructions();
                
                stepsHTML = `
                    ${iconHtml}
                    
                    <div class="alert alert-info mb-4">
                        <div class="d-flex align-items-center">
                            <i class="bi bi-browser-edge fs-4 me-3"></i>
                            <div>
                                <strong>Microsoft Edge detecteerd</strong><br>
                                <small>Edge laat het installatie-icoon vaak niet zien in de adresbalk. Gebruik één van onderstaande methodes:</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="edge-specific">
                        <h6><i class="bi bi-tools me-2"></i> ${edgeInfo.method1.title}</h6>
                        ${edgeInfo.method1.steps.map((step, index) => `
                            <div class="step">
                                <span class="step-number">${index + 1}</span> ${step}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="mt-4">
                        <button class="btn btn-outline-secondary btn-sm w-100" 
                                onclick="this.classList.add('d-none'); document.getElementById('edgeAlternativeMethods').classList.remove('d-none')">
                            <i class="bi bi-chevron-down"></i> Alternatieve methodes voor Edge
                        </button>
                        
                        <div id="edgeAlternativeMethods" class="d-none mt-3">
                            <div class="card mb-3">
                                <div class="card-header bg-light">
                                    <i class="bi bi-gear me-2"></i> ${edgeInfo.method2.title}
                                </div>
                                <div class="card-body">
                                    ${edgeInfo.method2.steps.map((step, index) => `
                                        <div class="step">
                                            <span class="step-number">${index + 1}</span> ${step}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="card">
                                <div class="card-header bg-light">
                                    <i class="bi bi-link-45deg me-2"></i> ${edgeInfo.method3.title}
                                </div>
                                <div class="card-body">
                                    ${edgeInfo.method3.steps.map((step, index) => `
                                        <div class="step">
                                            <span class="step-number">${index + 1}</span> ${step}
                                        </div>
                                    `).join('')}
                                    <div class="alert alert-warning mt-2">
                                        <i class="bi bi-exclamation-triangle"></i> ${edgeInfo.warning}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Voor andere browsers (Chrome, Firefox, etc.)
                const browserName = this.currentBrowser === 'Chrome' ? 'Chrome' : 
                                  this.currentBrowser === 'Firefox' ? 'Firefox' : 'je browser';
                
                stepsHTML = `
                    ${iconHtml}
                    
                    <div class="alert alert-primary mb-4">
                        <i class="bi bi-${this.currentBrowser === 'Chrome' ? 'browser-chrome' : 'browser-firefox'} me-2"></i>
                        <strong>${browserName} detecteerd</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">1</span> Zoek in de adresbalk naar een <strong>install-icoon</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Klik erop en kies <strong>"Installeren"</strong> of <strong>"Toevoegen"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> De snelkoppeling wordt toegevoegd aan:
                        <div class="mt-2">
                            <span class="badge bg-secondary"><i class="bi bi-windows"></i> Start Menu</span>
                            <span class="badge bg-secondary"><i class="bi bi-display"></i> Bureaublad</span>
                        </div>
                    </div>
                    
                    <div class="alert alert-warning mt-3">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong>Als je geen icoon ziet:</strong> Probeer de pagina te vernieuwen of kom later terug. 
                        Sommige browsers tonen de knop pas na meerdere bezoeken.
                    </div>
                    
                    <div class="mt-3">
                        <button class="btn btn-outline-info btn-sm w-100" 
                                onclick="this.classList.add('d-none'); document.getElementById('devToolsMethod').classList.remove('d-none')">
                            <i class="bi bi-terminal"></i> Alternatief: Via Developer Tools
                        </button>
                        
                        <div id="devToolsMethod" class="d-none mt-3">
                            <div class="card">
                                <div class="card-header bg-light">
                                    <i class="bi bi-tools me-2"></i> Voor als de knop niet verschijnt
                                </div>
                                <div class="card-body">
                                    <div class="step">
                                        <span class="step-number">A</span> Druk op <span class='keyboard-key'>F12</span>
                                    </div>
                                    <div class="step">
                                        <span class="step-number">B</span> Ga naar <strong>"Application"</strong> → <strong>"Manifest"</strong>
                                    </div>
                                    <div class="step">
                                        <span class="step-number">C</span> Klik op <button class='btn btn-sm btn-success'><i class='bi bi-download'></i> Install</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
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
                        <strong>${this.appName}</strong> toegevoegd aan je ${platform === 'computer' ? 'bureaublad' : 'beginscherm'}!
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