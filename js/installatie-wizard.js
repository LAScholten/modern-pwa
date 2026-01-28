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
        this.init();
    }
    
    async init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        
        // Haal PWA informatie op
        await this.getPWAInfo();
        
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    async getPWAInfo() {
        try {
            // 1. Haal app naam op uit de pagina
            this.appName = document.querySelector('title')?.textContent || 
                          document.querySelector('meta[property="og:site_name"]')?.content ||
                          'Mijn App';
            
            // 2. Vind het manifest
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink && manifestLink.href) {
                try {
                    const response = await fetch(manifestLink.href);
                    const manifest = await response.json();
                    
                    // Gebruik naam uit manifest als die er is
                    if (manifest.name) {
                        this.appName = manifest.name;
                    }
                    
                    // Zoek het beste icoon uit het manifest
                    if (manifest.icons && Array.isArray(manifest.icons)) {
                        // Neem het grootste icoon (meestal het beste voor snelkoppelingen)
                        const sortedIcons = [...manifest.icons].sort((a, b) => {
                            const sizeA = this.getIconSize(a.sizes);
                            const sizeB = this.getIconSize(b.sizes);
                            return sizeB - sizeA;
                        });
                        
                        const bestIcon = sortedIcons[0];
                        if (bestIcon && bestIcon.src) {
                            this.appIcon = this.makeAbsoluteUrl(bestIcon.src);
                            console.log('✅ PWA icoon gevonden:', this.appIcon);
                            return;
                        }
                    }
                } catch (error) {
                    console.log('⚠️ Kon manifest niet laden:', error);
                }
            }
            
            // 3. Als er geen manifest icoon is, zoek dan direct naar PWA icons op je site
            await this.findPWAIcon();
            
        } catch (error) {
            console.error('❌ Fout bij ophalen PWA info:', error);
        }
    }
    
    getIconSize(sizeString) {
        if (!sizeString) return 0;
        const match = sizeString.match(/(\d+)x(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }
    
    makeAbsoluteUrl(url) {
        if (!url) return '';
        
        // Als het al een absolute URL is
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        
        // Root-relative URL
        if (url.startsWith('/')) {
            return window.location.origin + url;
        }
        
        // Relative URL
        const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        return base + url;
    }
    
    async findPWAIcon() {
        console.log('🔍 Zoek naar PWA iconen...');
        
        // Standaard PWA icon locaties (waarschijnlijk staan jouw icons hier)
        const pwaIconPaths = [
            // PWA standaard iconen
            '/icon-512x512.png',
            '/icon-192x192.png',
            '/icons/icon-512x512.png',
            '/icons/icon-192x192.png',
            '/img/icon-512x512.png',
            '/img/icon-192x192.png',
            '/images/icon-512x512.png',
            '/images/icon-192x192.png',
            '/assets/icons/icon-512x512.png',
            '/assets/icons/icon-192x192.png',
            
            // Apple touch icons (ook gebruikt voor PWA)
            '/apple-touch-icon.png',
            '/apple-touch-icon-180x180.png',
            '/apple-touch-icon-152x152.png',
            
            // Favicon (laatste optie)
            '/favicon.ico',
            '/favicon.png',
            '/favicon-32x32.png',
            '/favicon-192x192.png'
        ];
        
        // Probeer elk pad
        for (const iconPath of pwaIconPaths) {
            const iconUrl = this.makeAbsoluteUrl(iconPath);
            
            try {
                const response = await fetch(iconUrl, { method: 'HEAD' });
                if (response.ok) {
                    this.appIcon = iconUrl;
                    console.log('✅ PWA icoon gevonden op:', iconUrl);
                    return;
                }
            } catch (error) {
                // Doorgaan naar volgende optie
                continue;
            }
        }
        
        console.log('⚠️ Geen PWA icoon gevonden op standaard locaties');
        
        // Zoek in HTML voor icon links
        const iconLinks = [
            'link[rel="icon"][sizes="512x512"]',
            'link[rel="icon"][sizes="192x192"]',
            'link[rel="apple-touch-icon"][sizes="512x512"]',
            'link[rel="apple-touch-icon"][sizes="192x192"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="icon"]'
        ];
        
        for (const selector of iconLinks) {
            const link = document.querySelector(selector);
            if (link && link.href) {
                this.appIcon = this.makeAbsoluteUrl(link.href);
                console.log('✅ Icoon gevonden via HTML:', this.appIcon);
                return;
            }
        }
        
        // Geen icoon gevonden - toon geen fallback, maar geef gebruiker info
        console.log('❌ Geen icoon gevonden voor PWA');
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
    
    showSnelkoppelingInstructions() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let stepsHTML = '';
        let title = `${this.appName} - Snelkoppeling`;
        
        // Maak icoon preview - ALLEEN als er een icoon is
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
                    <p class="text-muted mb-0">Dit PWA-icoon wordt gebruikt voor de snelkoppeling</p>
                </div>
            `;
        } else {
            iconHtml = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    <strong>PWA icoon:</strong> Het icoon van deze app wordt automatisch gebruikt voor de snelkoppeling.
                </div>
            `;
        }
        
        if (isMobile) {
            if (isIOS) {
                title = `${this.appName} op iPhone/iPad`;
                stepsHTML = `
                    ${iconHtml}
                    <div class="alert alert-primary">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Gebruik Safari browser</strong> voor het beste resultaat op iOS
                    </div>
                    
                    <div class="step">
                        <span class="step-number">1</span> Open deze pagina in <strong>Safari</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Tik op het <strong class="text-primary">deel-icoon</strong> 
                        <span class="badge bg-primary ms-1"><i class="bi bi-share"></i></span> onderin beeld
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Scroll naar beneden en selecteer <strong>"Voeg toe aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> Bevestig met <strong class="text-success">"Voeg toe"</strong>
                    </div>
                    
                    <div class="alert alert-info mt-3">
                        <i class="bi bi-check-circle me-2"></i>
                        Het icoon <strong>${this.appName}</strong> verschijnt automatisch op je beginscherm
                    </div>
                `;
            } else if (isAndroid) {
                title = `${this.appName} op Android`;
                
                stepsHTML = `
                    ${iconHtml}
                    
                    <div class="step">
                        <span class="step-number">1</span> Tik op de <strong>drie puntjes</strong> <i class="bi bi-three-dots-vertical"></i> rechtsboven
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Selecteer <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Bevestig met <strong class="text-success">"Toevoegen"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> De snelkoppeling verschijnt nu op je beginscherm met het PWA-icoon
                    </div>
                    
                    <div class="alert alert-success mt-3">
                        <i class="bi bi-phone me-2"></i>
                        Android gebruikt automatisch het PWA-icoon van deze app
                    </div>
                `;
            }
        } else {
            // Desktop instructies
            title = `${this.appName} op Computer`;
            
            stepsHTML = `
                ${iconHtml}
                
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card h-100 border-primary">
                            <div class="card-header bg-primary text-white">
                                <i class="bi bi-browser-chrome browser-icon"></i>
                                Chrome / Edge
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> Klik op het <strong>install-icoon</strong> 
                                    <span class="badge bg-primary ms-1"><i class="bi bi-download"></i></span> in de adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> Kies <strong>"Installeren"</strong> of <strong>"Toevoegen"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> Snelkoppeling wordt toegevoegd met het PWA-icoon
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card h-100 border-success">
                            <div class="card-header bg-success text-white">
                                <i class="bi bi-browser-firefox browser-icon"></i>
                                Firefox
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> Klik op het <strong>"+"</strong> icoon in de adresbalk
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
                
                <div class="alert alert-warning mt-3">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    <strong>Het icoon:</strong> Browsers gebruiken automatisch het PWA-icoon dat ingesteld is voor deze app.
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