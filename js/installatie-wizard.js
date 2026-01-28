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
        this.manifest = null;
        this.init();
    }
    
    async init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        
        // Laad eerst het manifest en icon
        await this.loadManifestAndIcon();
        
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    async loadManifestAndIcon() {
        try {
            // Zoek het manifest in de HTML
            const manifestLink = document.querySelector('link[rel="manifest"]');
            
            if (manifestLink && manifestLink.href) {
                console.log('🔍 Manifest gevonden:', manifestLink.href);
                
                // Laad het manifest
                const response = await fetch(manifestLink.href);
                this.manifest = await response.json();
                console.log('📄 Manifest geladen:', this.manifest);
                
                // Haal app naam uit manifest
                this.appName = this.manifest.name || 
                              this.manifest.short_name || 
                              document.querySelector('title')?.textContent || 
                              'Mijn App';
                
                // Haal het beste icoon uit het manifest
                this.appIcon = await this.getBestIconFromManifest();
                console.log('🎨 Icoon geselecteerd:', this.appIcon);
                
            } else {
                console.log('⚠️ Geen manifest gevonden, gebruik fallback');
                await this.useFallbackValues();
            }
            
        } catch (error) {
            console.error('❌ Fout bij laden manifest:', error);
            await this.useFallbackValues();
        }
    }
    
    async getBestIconFromManifest() {
        if (!this.manifest || !this.manifest.icons || !Array.isArray(this.manifest.icons)) {
            console.log('⚠️ Geen icons in manifest, zoek favicon');
            return await this.findFavicon();
        }
        
        // Sorteer icons op grootte (grootste eerst)
        const sortedIcons = [...this.manifest.icons].sort((a, b) => {
            const sizeA = this.parseIconSize(a.sizes);
            const sizeB = this.parseIconSize(b.sizes);
            return sizeB - sizeA;
        });
        
        // Probeer eerst het grootste icoon
        for (const icon of sortedIcons) {
            if (!icon.src) continue;
            
            const iconUrl = this.makeAbsoluteUrl(icon.src);
            
            // Check of icoon bestaat
            const exists = await this.checkIconExists(iconUrl);
            if (exists) {
                console.log('✅ Icoon gevonden:', iconUrl);
                return iconUrl;
            }
        }
        
        // Geen werkend icoon gevonden
        console.log('⚠️ Geen werkend icoon in manifest gevonden');
        return await this.findFavicon();
    }
    
    parseIconSize(sizeString) {
        if (!sizeString) return 0;
        
        // Voorbeeld: "192x192" of "512x512"
        const match = sizeString.match(/(\d+)x(\d+)/);
        if (match) {
            return parseInt(match[1], 10);
        }
        
        return 0;
    }
    
    async findFavicon() {
        console.log('🔍 Zoek naar favicon...');
        
        // Zoek naar favicons in de HTML
        const faviconSelectors = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]'
        ];
        
        for (const selector of faviconSelectors) {
            const icon = document.querySelector(selector);
            if (icon && icon.href) {
                const iconUrl = this.makeAbsoluteUrl(icon.href);
                console.log('🔍 Favicon gevonden:', iconUrl);
                
                // Check of het bestaat
                const exists = await this.checkIconExists(iconUrl);
                if (exists) {
                    return iconUrl;
                }
            }
        }
        
        console.log('⚠️ Geen favicon gevonden, gebruik fallback icoon');
        return this.createFallbackIcon();
    }
    
    async checkIconExists(url) {
        // Skip check voor data URLs
        if (url.startsWith('data:')) {
            return true;
        }
        
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.log('❌ Icoon bestaat niet of error:', url, error);
            return false;
        }
    }
    
    makeAbsoluteUrl(url) {
        if (!url) return '';
        
        // Als het al een absolute URL is
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
            return url;
        }
        
        // Als het een root-relative URL is
        if (url.startsWith('/')) {
            return window.location.origin + url;
        }
        
        // Relative URL - probeer base URL te vinden
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        
        // Verwijder "../" en "./" uit pad
        const parts = url.split('/');
        const result = [];
        
        for (const part of parts) {
            if (part === '..') {
                result.pop();
            } else if (part !== '.' && part !== '') {
                result.push(part);
            }
        }
        
        const cleanPath = result.join('/');
        return baseUrl + cleanPath;
    }
    
    createFallbackIcon() {
        const firstLetter = (this.appName || 'A').charAt(0).toUpperCase();
        
        // Eenvoudige SVG als data URL (geen canvas nodig)
        const svg = `
            <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" rx="100" fill="#0d6efd"/>
                <rect x="30" y="30" width="452" height="452" rx="80" fill="#0dcaf0"/>
                <text x="256" y="280" font-family="Arial, sans-serif" font-size="200" 
                      font-weight="bold" fill="white" text-anchor="middle" 
                      dominant-baseline="middle">${firstLetter}</text>
            </svg>
        `;
        
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }
    
    async useFallbackValues() {
        this.appName = document.querySelector('title')?.textContent || 'Mijn App';
        this.appIcon = await this.findFavicon();
        console.log('🔄 Fallback waarden gebruikt:', { 
            name: this.appName, 
            icon: this.appIcon.substring(0, 100) + '...' 
        });
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
            .icon-fallback {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #0d6efd, #0dcaf0);
                color: white;
                font-size: 48px;
                font-weight: bold;
                font-family: Arial, sans-serif;
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
            .icon-loading {
                width: 96px;
                height: 96px;
                margin: 0 auto;
                border-radius: 20px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
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
        const browser = this.detectBrowser();
        
        let stepsHTML = '';
        let title = `${this.appName} - Snelkoppeling`;
        
        // Maak icoon preview - veilig met fallback
        const firstLetter = this.appName.charAt(0).toUpperCase();
        const iconHtml = `
            <div class="icon-preview-container">
                <div class="icon-preview">
                    ${this.appIcon.startsWith('data:') ? 
                        `<img src="${this.appIcon}" alt="${this.appName} icoon" style="opacity: 1;">` :
                        `<img src="${this.appIcon}" 
                              alt="${this.appName} icoon"
                              onload="this.style.opacity='1'"
                              onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'icon-fallback\\'>${firstLetter}</div>';"
                              style="opacity: 0; transition: opacity 0.3s">`
                    }
                </div>
                <h5>${this.appName}</h5>
                <p class="text-muted mb-0">Dit icoon wordt gebruikt voor de snelkoppeling</p>
            </div>
        `;
        
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
                        <span class="step-number">4</span> De snelkoppeling met het ${this.appName} icoon verschijnt nu op je beginscherm
                    </div>
                    
                    <div class="alert alert-success mt-3">
                        <i class="bi bi-phone me-2"></i>
                        Android gebruikt automatisch het icoon uit je PWA-instellingen
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
                                    <span class="step-number">3</span> Snelkoppeling wordt toegevoegd aan:
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
                    <strong>Let op:</strong> Sommige browsers tonen alleen de installatie knop na meerdere bezoeken
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
        if (ua.includes('SamsungBrowser')) return 'Samsung';
        return 'Browser';
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
                    icon: 'bi-list'
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

// Initialisatie - wacht op DOM en laad async
document.addEventListener('DOMContentLoaded', function() {
    new InstallatieWizard();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstallatieWizard;
}