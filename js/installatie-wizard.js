/**
 * Installatie Wizard voor PWA snelkoppeling instructies
 * Bestand: js/installatie-wizard.js
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = document.querySelector('meta[name="application-name"]')?.content || 
                      document.querySelector('title')?.textContent || 'Mijn App';
        this.appIcon = this.findAppIcon(); // Zoek het app icoon
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        console.log('🎯 Gevonden icoon:', this.appIcon);
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    findAppIcon() {
        // Probeer verschillende bronnen voor het icoon
        const iconSources = [
            // Favicon (meest voorkomend)
            document.querySelector('link[rel="icon"]')?.href,
            document.querySelector('link[rel="shortcut icon"]')?.href,
            document.querySelector('link[rel="apple-touch-icon"]')?.href,
            
            // Apple touch icons
            document.querySelector('link[rel="apple-touch-icon-precomposed"]')?.href,
            document.querySelector('link[sizes="192x192"]')?.href,
            document.querySelector('link[sizes="512x512"]')?.href,
            
            // Manifest icoon (indien aanwezig)
            this.getIconFromManifest(),
            
            // Open Graph icoon
            document.querySelector('meta[property="og:image"]')?.content,
            
            // Twitter icoon
            document.querySelector('meta[name="twitter:image"]')?.content,
            
            // Default locaties
            '/favicon.ico',
            '/apple-touch-icon.png',
            '/icon.png',
            '/logo.png',
            '/img/icon.png',
            '/img/logo.png',
            '/assets/img/icon.png',
            '/images/icon.png'
        ];
        
        // Filter lege waardes en retourneer het eerste geldige icoon
        const validIcon = iconSources.find(icon => 
            icon && (typeof icon === 'string') && icon.trim() !== ''
        );
        
        // Als er geen icoon gevonden is, gebruik een fallback
        return validIcon || this.getFallbackIcon();
    }
    
    getIconFromManifest() {
        try {
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink && manifestLink.href) {
                return '/icon-192x192.png'; // Default PWA icoon locatie
            }
        } catch (e) {
            console.log('⚠️ Kon manifest niet lezen:', e);
        }
        return null;
    }
    
    getFallbackIcon() {
        // Maak een dynamisch fallback icoon gebaseerd op de app naam
        const firstLetter = this.appName.charAt(0).toUpperCase();
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', 
            '#118AB2', '#EF476F', '#7B2CBF', '#2A9D8F'
        ];
        const colorIndex = this.appName.length % colors.length;
        
        // Creëer een data URL voor een eenvoudig icoon
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Achtergrond
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(0, 0, 128, 128);
        
        // Tekst
        ctx.fillStyle = 'white';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(firstLetter, 64, 64);
        
        return canvas.toDataURL('image/png');
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
            .icon-preview {
                width: 96px;
                height: 96px;
                margin: 20px auto;
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
            .browser-icon {
                font-size: 1.5em;
                margin-right: 8px;
                vertical-align: middle;
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
                <i class="bi bi-plus-circle"></i> Snelkoppeling
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
        const browser = this.detectBrowser();
        
        let stepsHTML = '';
        let title = 'Snelkoppeling Maken';
        
        // Maak icoon preview
        let iconHtml = '';
        if (this.appIcon.startsWith('data:')) {
            // Data URL (fallback icoon)
            iconHtml = `
                <div class="icon-preview">
                    <img src="${this.appIcon}" alt="${this.appName} icoon">
                </div>
                <p class="text-center small text-muted mb-4">Dit icoon wordt gebruikt voor je snelkoppeling</p>
            `;
        } else {
            // Normale URL
            iconHtml = `
                <div class="icon-preview">
                    <img src="${this.appIcon}" alt="${this.appName} icoon" 
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHJ4PSIxNiIgZmlsbD0iIzBENkVGRCIvPjx0ZXh0IHg9IjQ4IiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+${btoa(this.appName.charAt(0))}</dGV4dD48L3N2Zz4='">
                </div>
                <p class="text-center small text-muted mb-4">Dit icoon wordt gebruikt voor je snelkoppeling</p>
            `;
        }
        
        if (isMobile) {
            if (isIOS) {
                title = `Snelkoppeling op iPhone/iPad`;
                stepsHTML = `
                    ${iconHtml}
                    <div class="alert alert-primary">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong>Belangrijk:</strong> Gebruik <strong>Safari</strong> voor het maken van een snelkoppeling op iOS
                    </div>
                    
                    <div class="step">
                        <span class="step-number">1</span> Open deze pagina in <strong>Safari</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Tik op het <strong class="text-primary">deel-icoon</strong> 
                        <span class="badge bg-primary ms-2"><i class="bi bi-share"></i></span>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Scroll naar beneden en selecteer <strong>"Voeg toe aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> Tik op <strong class="text-success">"Voeg toe"</strong> rechtsboven
                    </div>
                    
                    <div class="step">
                        <span class="step-number">5</span> Zoek de snelkoppeling op je beginscherm met het <strong>${this.appName}</strong> icoon!
                    </div>
                `;
            } else if (isAndroid) {
                title = `Snelkoppeling op Android`;
                const browserInfo = this.getAndroidBrowserInfo(browser);
                
                stepsHTML = `
                    ${iconHtml}
                    
                    <div class="step">
                        <span class="step-number">1</span> ${browserInfo.step1}
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Selecteer <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Bevestig met <strong class="text-success">"Toevoegen"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> De snelkoppeling verschijnt nu op je beginscherm met het ${this.appName} icoon
                    </div>
                    
                    <div class="alert alert-success mt-3">
                        <i class="bi bi-check-circle"></i> 
                        Android gebruikt automatisch het icoon van deze website.
                    </div>
                `;
            }
        } else {
            // Desktop instructies
            title = `Snelkoppeling op Computer`;
            
            stepsHTML = `
                ${iconHtml}
                
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Browser-specifieke instructies:</strong> Kies jouw browser hieronder
                </div>
                
                <div class="row g-3 mt-2">
                    <!-- Chrome & Edge -->
                    <div class="col-md-6">
                        <div class="card h-100 border-primary">
                            <div class="card-header bg-primary text-white">
                                <i class="bi bi-browser-chrome browser-icon"></i>
                                Chrome / Edge
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> Klik op <strong class="text-primary">install-icoon</strong> 
                                    <span class="badge bg-primary ms-1"><i class="bi bi-download"></i></span> rechts in adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> Kies <strong>"Installeren"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> Snelkoppeling wordt toegevoegd aan startmenu/bureaublad
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Firefox -->
                    <div class="col-md-6">
                        <div class="card h-100 border-success">
                            <div class="card-header bg-success text-white">
                                <i class="bi bi-browser-firefox browser-icon"></i>
                                Firefox
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> Klik op <strong class="text-success">"+"</strong> in adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> Selecteer <strong>"Toevoegen aan bureaublad"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> Bevestig met <strong>"Toevoegen"</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-3 border-warning">
                    <div class="card-header bg-warning">
                        <i class="bi bi-tools browser-icon"></i>
                        Alternatieve methode
                    </div>
                    <div class="card-body">
                        <div class="step">
                            <span class="step-number">A</span> Druk op <kbd>F12</kbd> voor Developer Tools
                        </div>
                        <div class="step">
                            <span class="step-number">B</span> Ga naar <strong>"Application"</strong> → <strong>"Manifest"</strong>
                        </div>
                        <div class="step">
                            <span class="step-number">C</span> Klik op <strong>"Install"</strong> of <strong>"Create shortcut"</strong>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Update modal
        const modalTitle = document.querySelector('#installModal .modal-title');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="bi bi-link-45deg me-2"></i>${title}`;
        }
        
        const installStepsElement = document.getElementById('installSteps');
        if (installStepsElement) {
            installStepsElement.innerHTML = stepsHTML;
        }
        
        // Toon modal
        const installModal = new bootstrap.Modal(document.getElementById('installModal'));
        installModal.show();
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome') && !ua.includes('Edge')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
        return 'Unknown';
    }
    
    getAndroidBrowserInfo(browser) {
        switch(browser) {
            case 'Chrome':
                return {
                    step1: 'Tik op de <strong class="text-primary">drie puntjes</strong> <i class="bi bi-three-dots-vertical"></i> rechtsboven',
                    icon: 'bi-browser-chrome'
                };
            case 'Firefox':
                return {
                    step1: 'Tik op de <strong class="text-success">drie puntjes</strong> <i class="bi bi-three-dots"></i> rechtsboven',
                    icon: 'bi-browser-firefox'
                };
            case 'Samsung':
                return {
                    step1: 'Tik op het <strong>menu-icoon</strong> <i class="bi bi-list"></i>',
                    icon: 'bi-phone'
                };
            default:
                return {
                    step1: 'Open het <strong>browsermenu</strong>',
                    icon: 'bi-browser'
                };
        }
    }
    
    updateInstallButtonText() {
        const updateButton = (btn) => {
            if (btn && !this.isInstalled) {
                btn.innerHTML = '<i class="bi bi-plus-circle"></i> Snelkoppeling maken';
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
                btn.innerHTML = '<i class="bi bi-check2-circle"></i> Snelkoppeling bestaat';
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
        const toastHTML = `
            <div class="toast align-items-center text-white bg-success border-0" 
                 role="alert" aria-live="assertive" aria-atomic="true" id="installSuccessToast">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        Snelkoppeling toegevoegd aan je ${/Android|iPhone|iPad/i.test(navigator.userAgent) ? 'beginscherm' : 'bureaublad'}!
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