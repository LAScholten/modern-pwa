/**
 * Installatie Wizard voor PWA snelkoppeling maken
 * Bestand: js/installatie-wizard.js
 * Standalone versie - creëert alle UI elementen zelf
 */

class InstallatieWizard {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.appName = document.querySelector('meta[name="application-name"]')?.content || 'Mijn App';
        this.appIcon = null;
        this.platforms = [];
        this.init();
    }
    
    async init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        await this.getAppIcon();
        this.detectPlatforms();
        this.setupEventListeners();
        this.createUI();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    async getAppIcon() {
        // Probeer verschillende iconen locaties
        const iconLocations = [
            '/img/icons/icon-512x512.png',
            '/img/icons/icon-192x192.png',
            '/img/icons/icon-256x256.png',
            '/modern-pwa/img/icons/icon-512x512.png',
            '/modern-pwa/img/icons/icon-192x192.png',
            '/modern-pwa/img/icons/icon-256x256.png',
            '/icon-512x512.png',
            '/icon-192x192.png',
            '/icons/icon-512x512.png',
            '/assets/icons/icon-512x512.png',
            '/pwa/icons/icon-512x512.png'
        ];
        
        for (const iconPath of iconLocations) {
            const exists = await this.checkImageExists(iconPath);
            if (exists) {
                this.appIcon = iconPath;
                console.log('🎨 App icoon gevonden:', this.appIcon);
                return;
            }
        }
        
        // Probeer manifest icoon
        try {
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                const response = await fetch(manifestLink.href);
                const manifest = await response.json();
                
                if (manifest.icons && manifest.icons.length > 0) {
                    // Sorteer op grootte (grootste eerst)
                    const sortedIcons = manifest.icons.sort((a, b) => {
                        const sizeA = parseInt(a.sizes?.split('x')[0] || 0);
                        const sizeB = parseInt(b.sizes?.split('x')[0] || 0);
                        return sizeB - sizeA;
                    });
                    
                    // Probeer het grootste icoon
                    for (const icon of sortedIcons) {
                        const exists = await this.checkImageExists(icon.src);
                        if (exists) {
                            this.appIcon = icon.src;
                            console.log('🎨 Manifest icoon gevonden:', this.appIcon);
                            return;
                        }
                    }
                }
            }
        } catch (error) {
            console.log('⚠️ Kon manifest niet laden');
        }
        
        // Geen icoon gevonden
        console.log('⚠️ Geen app icoon gevonden');
        this.appIcon = null;
    }
    
    checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            setTimeout(() => resolve(false), 2000);
        });
    }
    
    detectPlatforms() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobi|android|iphone|ipad|ipod/.test(userAgent);
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent);
        const isFirefox = /firefox/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
        const isEdge = /edge/.test(userAgent);
        const isDesktop = !isMobile;
        
        // Reset platforms
        this.platforms = [];
        
        // Automatische detectie (voor browsers met beforeinstallprompt)
        if (this.deferredPrompt !== null) {
            this.platforms.push({
                id: 'auto',
                name: 'Automatisch',
                icon: 'bi-magic',
                description: 'Laat je browser de beste optie kiezen',
                active: true,
                badge: 'Aanbevolen'
            });
        }
        
        // Mobiele platforms
        if (isMobile) {
            if (isIOS) {
                this.platforms.push({
                    id: 'ios',
                    name: 'iPhone/iPad',
                    icon: 'bi-phone',
                    description: 'Apple iOS apparaten',
                    active: true,
                    badge: 'Mobiel'
                });
            }
            if (isAndroid) {
                this.platforms.push({
                    id: 'android',
                    name: 'Android',
                    icon: 'bi-phone',
                    description: 'Android telefoons & tablets',
                    active: true,
                    badge: 'Mobiel'
                });
            }
        }
        
        // Desktop browsers
        if (isDesktop) {
            if (isChrome) {
                this.platforms.push({
                    id: 'chrome',
                    name: 'Chrome',
                    icon: 'bi-browser-chrome',
                    description: 'Google Chrome browser',
                    active: true,
                    badge: 'Desktop'
                });
            }
            if (isFirefox) {
                this.platforms.push({
                    id: 'firefox',
                    name: 'Firefox',
                    icon: 'bi-browser-firefox',
                    description: 'Mozilla Firefox browser',
                    active: true,
                    badge: 'Desktop'
                });
            }
            if (isSafari) {
                this.platforms.push({
                    id: 'safari',
                    name: 'Safari',
                    icon: 'bi-browser-safari',
                    description: 'Apple Safari browser',
                    active: true,
                    badge: 'Desktop'
                });
            }
            if (isEdge) {
                this.platforms.push({
                    id: 'edge',
                    name: 'Edge',
                    icon: 'bi-browser-edge',
                    description: 'Microsoft Edge browser',
                    active: true,
                    badge: 'Desktop'
                });
            }
        }
        
        // Windows (alleen desktop)
        if (isDesktop && /windows/.test(userAgent)) {
            this.platforms.push({
                id: 'windows',
                name: 'Windows',
                icon: 'bi-windows',
                description: 'Windows computer',
                active: true,
                badge: 'Desktop'
            });
        }
        
        // Mac (alleen desktop)
        if (isDesktop && /mac/.test(userAgent)) {
            this.platforms.push({
                id: 'mac',
                name: 'Mac',
                icon: 'bi-apple',
                description: 'Apple Mac computer',
                active: true,
                badge: 'Desktop'
            });
        }
        
        // Fallback voor onbekende platforms
        if (this.platforms.length === 0) {
            this.platforms.push({
                id: 'browser',
                name: 'Browser',
                icon: 'bi-globe',
                description: 'Je huidige browser',
                active: true
            });
        }
    }
    
    setupEventListeners() {
        // Voor browsers die beforeinstallprompt ondersteunen
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🚀 beforeinstallprompt event triggered');
            e.preventDefault();
            this.deferredPrompt = e;
            this.detectPlatforms();
            this.updateUI();
            
            // Toon installatie opties na 3 seconden
            setTimeout(() => {
                this.showInstallOptions();
            }, 3000);
        });
        
        // Wanneer app is geïnstalleerd
        window.addEventListener('appinstalled', () => {
            console.log('🎉 Snelkoppeling succesvol toegevoegd!');
            this.isInstalled = true;
            localStorage.setItem('pwaInstalled', 'true');
            this.updateUI();
            this.showSuccessMessage();
        });
        
        // Check display mode
        window.addEventListener('DOMContentLoaded', () => {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                console.log('📱 App draait in standalone modus');
                this.isInstalled = true;
                this.updateUI();
            }
        });
        
        // Check op iOS
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            this.updateUI();
        }
    }
    
    setupInstallatieWizard() {
        this.injectStyles();
        window.installatieWizard = this;
    }
    
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pwa-install-container {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            }
            .pwa-icon-preview {
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                margin-bottom: 30px;
                color: white;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            }
            .pwa-icon-img {
                width: 120px;
                height: 120px;
                margin: 0 auto 15px;
                border-radius: 25px;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                border: 5px solid white;
            }
            .pwa-icon-img img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .pwa-platforms-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .pwa-platform-card {
                background: white;
                border-radius: 15px;
                padding: 25px;
                border: 2px solid #e0e0e0;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .pwa-platform-card:hover {
                transform: translateY(-5px);
                border-color: #667eea;
                box-shadow: 0 15px 35px rgba(102, 126, 234, 0.1);
            }
            .pwa-platform-card.active {
                border-color: #667eea;
                background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            }
            .pwa-platform-icon {
                font-size: 40px;
                color: #667eea;
                margin-bottom: 15px;
                text-align: center;
            }
            .pwa-platform-badge {
                position: absolute;
                top: 15px;
                right: 15px;
                background: #667eea;
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            .pwa-platform-name {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin-bottom: 8px;
                text-align: center;
            }
            .pwa-platform-desc {
                color: #666;
                font-size: 14px;
                text-align: center;
                margin-bottom: 20px;
            }
            .pwa-install-btn {
                display: block;
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }
            .pwa-install-btn:hover {
                transform: scale(1.02);
                box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
            }
            .pwa-install-btn:active {
                transform: scale(0.98);
            }
            .pwa-install-btn.installed {
                background: #10b981;
            }
            .pwa-install-btn.installed:hover {
                transform: none;
                box-shadow: none;
                cursor: default;
            }
            .pwa-main-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                z-index: 1000;
                padding: 15px 25px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .pwa-main-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
            }
            .pwa-main-btn.hidden {
                display: none;
            }
            .pwa-success-message {
                position: fixed;
                top: 30px;
                right: 30px;
                background: #10b981;
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                z-index: 1001;
                animation: slideIn 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            .pwa-loading {
                text-align: center;
                padding: 40px;
                color: #666;
            }
            .pwa-no-icon {
                width: 120px;
                height: 120px;
                background: white;
                border-radius: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                color: #667eea;
                margin: 0 auto 15px;
            }
            .pwa-container-title {
                font-size: 24px;
                font-weight: 700;
                color: #333;
                margin-bottom: 10px;
                text-align: center;
            }
            .pwa-container-subtitle {
                color: #666;
                text-align: center;
                margin-bottom: 30px;
                font-size: 16px;
            }
        `;
        document.head.appendChild(style);
    }
    
    createUI() {
        // Verwijder bestaande container als die er is
        const existingContainer = document.querySelector('.pwa-install-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        // Maak hoofdcontainer
        const container = document.createElement('div');
        container.className = 'pwa-install-container';
        container.style.display = 'none';
        container.innerHTML = `
            <div class="pwa-icon-preview">
                <div class="pwa-icon-img">
                    ${this.appIcon ? 
                        `<img src="${this.appIcon}" alt="${this.appName}">` : 
                        '<div class="pwa-no-icon"><i class="bi bi-app"></i></div>'
                    }
                </div>
                <h2 class="pwa-container-title">${this.appName}</h2>
                <p class="pwa-container-subtitle">Zo ziet je snelkoppeling er uit</p>
            </div>
            
            <h3 style="margin-bottom: 20px; color: #333; text-align: center;">Kies je apparaat</h3>
            
            <div class="pwa-platforms-grid" id="pwaPlatformsGrid">
                <!-- Platforms worden hier ingevoegd -->
            </div>
        `;
        
        // Voeg toe aan body
        document.body.appendChild(container);
        
        // Maak vlotterende knop
        this.createFloatingButton();
        
        // Update de UI
        this.updateUI();
    }
    
    createFloatingButton() {
        // Verwijder bestaande knop
        const existingBtn = document.querySelector('.pwa-main-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // Maak nieuwe vlotterende knop
        const floatingBtn = document.createElement('button');
        floatingBtn.className = `pwa-main-btn ${this.isInstalled ? 'hidden' : ''}`;
        floatingBtn.id = 'pwaFloatingBtn';
        floatingBtn.innerHTML = `
            <i class="bi bi-plus-circle"></i>
            <span>Snelkoppeling maken</span>
        `;
        
        floatingBtn.addEventListener('click', () => {
            this.showInstallOptions();
        });
        
        document.body.appendChild(floatingBtn);
    }
    
    updateUI() {
        const container = document.querySelector('.pwa-install-container');
        const floatingBtn = document.querySelector('#pwaFloatingBtn');
        const platformsGrid = document.getElementById('pwaPlatformsGrid');
        
        if (!container || !platformsGrid) return;
        
        // Update floating button
        if (floatingBtn) {
            if (this.isInstalled) {
                floatingBtn.innerHTML = `
                    <i class="bi bi-check-circle"></i>
                    <span>Snelkoppeling gemaakt</span>
                `;
                floatingBtn.classList.add('installed');
                floatingBtn.disabled = true;
            } else {
                floatingBtn.classList.remove('hidden');
            }
        }
        
        // Update icon preview
        const iconImg = container.querySelector('.pwa-icon-img');
        if (iconImg && this.appIcon) {
            iconImg.innerHTML = `<img src="${this.appIcon}" alt="${this.appName}">`;
        }
        
        // Update platforms grid
        platformsGrid.innerHTML = this.platforms.map(platform => `
            <div class="pwa-platform-card ${platform.active ? 'active' : ''}" 
                 data-platform="${platform.id}"
                 onclick="installatieWizard.handlePlatformClick('${platform.id}')">
                ${platform.badge ? `<span class="pwa-platform-badge">${platform.badge}</span>` : ''}
                <div class="pwa-platform-icon">
                    <i class="bi ${platform.icon}"></i>
                </div>
                <div class="pwa-platform-name">${platform.name}</div>
                <div class="pwa-platform-desc">${platform.description}</div>
                <button class="pwa-install-btn ${this.isInstalled ? 'installed' : ''}"
                        data-platform="${platform.id}">
                    ${this.isInstalled ? 
                        '<i class="bi bi-check-circle"></i> Snelkoppeling gemaakt' : 
                        '<i class="bi bi-download"></i> Klik hier voor snelkoppeling'
                    }
                </button>
            </div>
        `).join('');
    }
    
    showInstallOptions() {
        if (this.isInstalled) {
            this.showSuccessMessage();
            return;
        }
        
        const container = document.querySelector('.pwa-install-container');
        if (container) {
            container.style.display = 'block';
            
            // Scroll naar container
            container.scrollIntoView({ behavior: 'smooth' });
            
            // Voeg close button toe als die er niet is
            if (!container.querySelector('.pwa-close-btn')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'pwa-close-btn';
                closeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    color: white;
                    cursor: pointer;
                    z-index: 1;
                `;
                closeBtn.onclick = () => {
                    container.style.display = 'none';
                };
                container.querySelector('.pwa-icon-preview').appendChild(closeBtn);
            }
        }
    }
    
    handlePlatformClick(platformId) {
        if (this.isInstalled) {
            this.showSuccessMessage();
            return;
        }
        
        console.log(`📱 Platform geselecteerd: ${platformId}`);
        
        if (platformId === 'auto' && this.deferredPrompt) {
            this.triggerNativeInstall();
        } else {
            // Voor andere platforms, gebruik dezelfde methode
            // (in een echte implementatie zou je hier platform-specifieke logica toevoegen)
            this.triggerNativeInstall();
        }
    }
    
    triggerNativeInstall() {
        if (!this.deferredPrompt) {
            console.log('⚠️ Geen native installatie beschikbaar');
            this.showManualInstructions();
            return;
        }
        
        this.deferredPrompt.prompt();
        
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ Gebruiker heeft snelkoppeling geaccepteerd');
                this.isInstalled = true;
                localStorage.setItem('pwaInstalled', 'true');
                this.updateUI();
                this.showSuccessMessage();
            } else {
                console.log('❌ Gebruiker heeft snelkoppeling geweigerd');
                this.showManualInstructions();
            }
            this.deferredPrompt = null;
        });
    }
    
    showManualInstructions() {
        // Toon een eenvoudig bericht
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.style.background = '#f59e0b';
        message.innerHTML = `
            <i class="bi bi-info-circle"></i>
            <span>Gebruik het menu van je browser om een snelkoppeling te maken</span>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    checkIfInstalled() {
        // Check localStorage
        if (localStorage.getItem('pwaInstalled') === 'true') {
            this.isInstalled = true;
            this.updateUI();
        }
        
        // Check standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            this.updateUI();
        }
        
        // Check iOS standalone
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            this.updateUI();
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-success-message';
        message.innerHTML = `
            <i class="bi bi-check-circle"></i>
            <span>Snelkoppeling succesvol gemaakt!</span>
        `;
        
        document.body.appendChild(message);
        
        // Verberg de container
        const container = document.querySelector('.pwa-install-container');
        if (container) {
            container.style.display = 'none';
        }
        
        setTimeout(() => {
            message.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                message.remove();
            }, 300);
        }, 3000);
    }
}

// Auto-initialisatie
document.addEventListener('DOMContentLoaded', function() {
    // Wacht even om Bootstrap te laden als dat nodig is
    setTimeout(() => {
        new InstallatieWizard();
    }, 1000);
});

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstallatieWizard;
}