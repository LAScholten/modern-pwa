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
            // 1. Haal app naam op
            this.appName = document.querySelector('title')?.textContent || 
                          document.querySelector('meta[property="og:site_name"]')?.content ||
                          'Mijn App';
            
            console.log('🔍 Zoek PWA icoon in modern-pwa/img/icons/');
            
            // 2. DIRECT naar jouw PWA icons zoeken
            const yourPwaIcons = [
                // JOUW SPECIFIEKE PWA ICONS
                'modern-pwa/img/icons/icon-512x512.png',
                'modern-pwa/img/icons/icon-192x192.png',
                'modern-pwa/img/icons/icon-256x256.png',
                'modern-pwa/img/icons/icon-384x384.png',
                'modern-pwa/img/icons/icon.png',
                'modern-pwa/img/icons/app-icon.png',
                'modern-pwa/img/icons/logo.png',
                
                // Standaard PWA icon namen in jouw map
                'modern-pwa/img/icons/512x512.png',
                'modern-pwa/img/icons/192x192.png',
                'modern-pwa/img/icons/256x256.png',
                
                // Favicon alternatieven
                'modern-pwa/img/icons/favicon.png',
                'modern-pwa/img/icons/favicon.ico',
                'modern-pwa/img/icons/favicon-192x192.png',
                
                // Apple touch icons
                'modern-pwa/img/icons/apple-touch-icon.png',
                'modern-pwa/img/icons/apple-touch-icon-180x180.png'
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
                    // Doorgaan naar volgende
                    continue;
                }
            }
            
            // 3. Als niet gevonden, check manifest
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink && manifestLink.href) {
                try {
                    const response = await fetch(manifestLink.href);
                    const manifest = await response.json();
                    
                    if (manifest.name) {
                        this.appName = manifest.name;
                    }
                    
                    // Zoek icoon uit manifest
                    if (manifest.icons && Array.isArray(manifest.icons)) {
                        // Neem het grootste icoon
                        const sortedIcons = [...manifest.icons].sort((a, b) => {
                            const sizeA = this.getIconSize(a.sizes);
                            const sizeB = this.getIconSize(b.sizes);
                            return sizeB - sizeA;
                        });
                        
                        const bestIcon = sortedIcons[0];
                        if (bestIcon && bestIcon.src) {
                            const manifestIconUrl = this.makeAbsoluteUrl(bestIcon.src);
                            
                            // Check of dit icoon bestaat
                            try {
                                const iconResponse = await fetch(manifestIconUrl, { method: 'HEAD' });
                                if (iconResponse.ok) {
                                    this.appIcon = manifestIconUrl;
                                    console.log('✅ Icoon gevonden via manifest:', manifestIconUrl);
                                    return;
                                }
                            } catch (error) {
                                console.log('❌ Manifest icoon niet bereikbaar:', error);
                            }
                        }
                    }
                } catch (error) {
                    console.log('⚠️ Kon manifest niet laden:', error);
                }
            }
            
            // 4. Laatste poging: zoek in HTML voor icon links
            const iconLinks = [
                'link[rel="icon"][sizes="512x512"]',
                'link[rel="icon"][sizes="192x192"]',
                'link[rel="apple-touch-icon"][sizes="512x512"]',
                'link[rel="apple-touch-icon"][sizes="192x192"]',
                'link[rel="apple-touch-icon"]',
                'link[rel="icon"]',
                'link[rel="shortcut icon"]'
            ];
            
            for (const selector of iconLinks) {
                const link = document.querySelector(selector);
                if (link && link.href) {
                    const htmlIconUrl = this.makeAbsoluteUrl(link.href);
                    
                    // Check of dit icoon bestaat
                    try {
                        const iconResponse = await fetch(htmlIconUrl, { method: 'HEAD' });
                        if (iconResponse.ok) {
                            this.appIcon = htmlIconUrl;
                            console.log('✅ Icoon gevonden via HTML:', htmlIconUrl);
                            return;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            console.log('⚠️ Geen icoon gevonden. Toon alleen instructies.');
            
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
        
        // Root-relative URL (begint met /)
        if (url.startsWith('/')) {
            return window.location.origin + url;
        }
        
        // Als het een relative URL is zonder leading slash, voeg de huidige base toe
        // Voor jouw icons: "modern-pwa/img/icons/icon-512x512.png"
        const base = window.location.origin;
        const path = window.location.pathname;
        
        // Haal de directory van de huidige pagina
        let currentDir = path.substring(0, path.lastIndexOf('/') + 1);
        
        // Als we in de root zijn, gebruik dan gewoon de root
        if (currentDir === '/' || currentDir === '') {
            return base + '/' + url;
        }
        
        // Ga terug naar root als nodig voor "modern-pwa/" pad
        if (url.startsWith('modern-pwa/')) {
            // Bepaal het pad naar modern-pwa map
            const segments = path.split('/');
            let modernPwaPath = '';
            
            // Zoek naar "modern-pwa" in het huidige pad
            for (let i = 0; i < segments.length; i++) {
                if (segments[i] === 'modern-pwa') {
                    modernPwaPath = segments.slice(0, i + 1).join('/') + '/';
                    break;
                }
            }
            
            if (modernPwaPath) {
                return base + modernPwaPath + url.substring(url.indexOf('/') + 1);
            }
            
            // Fallback: voeg direct toe aan root
            return base + '/' + url;
        }
        
        // Standaard: voeg toe aan huidige directory
        return base + currentDir + url;
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
                    <small class="text-info">
                        <i class="bi bi-info-circle"></i> Icoon gevonden in: modern-pwa/img/icons/
                    </small>
                </div>
            `;
        } else {
            // Als er geen icoon is, toon een simpele instructie
            iconHtml = `
                <div class="alert alert-info">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-info-circle fs-4 me-3"></i>
                        <div>
                            <strong>PWA Snelkoppeling</strong><br>
                            <small>De snelkoppeling gebruikt het icoon dat ingesteld is voor deze Progressive Web App.</small>
                        </div>
                    </div>
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
                    
                    <div class="step">
                        <span class="step-number">5</span> Het icoon <strong>${this.appName}</strong> verschijnt op je beginscherm!
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
                    
                    <div class="step">
                        <span class="step-number">4</span> De snelkoppeling verschijnt op je beginscherm met het ${this.appName} icoon
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
                                <i class="bi bi-pc-display-horizontal me-2"></i>
                                Chrome / Edge
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> Kijk in de adresbalk voor het 
                                    <strong class="text-primary">install-icoon</strong>
                                    <span class="badge bg-primary ms-1"><i class="bi bi-download"></i></span>
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> Klik erop en kies <strong>"Installeren"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> De snelkoppeling wordt toegevoegd aan:
                                    <div class="mt-2">
                                        <span class="badge bg-secondary"><i class="bi bi-windows"></i> Start Menu</span>
                                        <span class="badge bg-secondary"><i class="bi bi-display"></i> Bureaublad</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card h-100 border-success">
                            <div class="card-header bg-success text-white">
                                <i class="bi bi-pc-display-horizontal me-2"></i>
                                Andere Browsers
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> <strong>Firefox:</strong> Klik op <strong>"+"</strong> in adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> <strong>Safari:</strong> Bestand → "Toevoegen aan Dock"
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> Zoek in je browserinstellingen naar "Toevoegen aan bureaublad"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-secondary mt-3">
                    <i class="bi bi-lightbulb me-2"></i>
                    <strong>Tip:</strong> Sommige browsers tonen de installatie knop pas na meerdere bezoeken.
                    Vernieuw de pagina of kom later terug als je de knop niet ziet.
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