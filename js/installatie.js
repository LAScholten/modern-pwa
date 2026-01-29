// ✅ installatie.js - VOOR GITHUB PAGES ZONDER FAVICON
// LAATSTE - 29 januari 2026 - OPTIMIZED FOR GITHUB PAGES

console.log('🔧 Installatie script laden...');

// 0. MANIFEST SETUP VOOR GITHUB PAGES
(function setupPWAManifest() {
    'use strict';
    
    console.log('📄 PWA manifest setup voor GitHub Pages...');
    
    // Bepaal base path voor GitHub Pages
    const getBasePath = () => {
        const path = window.location.pathname;
        // Voor GitHub Pages project sites: /repository-name/
        if (path.includes('/modern-pwa/')) {
            return '/modern-pwa/';
        }
        return '/';
    };
    
    const basePath = getBasePath();
    console.log('📍 Base path:', basePath);
    
    // Verwijder bestaande manifest link
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
        existingManifest.remove();
    }
    
    // Voeg nieuwe manifest toe met correcte paden
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = `${basePath}manifest.json`;
    document.head.appendChild(manifestLink);
    console.log('✅ Manifest link toegevoegd:', manifestLink.href);
    
    // Deprecated tag vervangen
    const oldMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (oldMeta) {
        oldMeta.remove();
    }
    
    // Voeg correcte meta tags toe
    const metaTags = [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#007bff' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
    ];
    
    metaTags.forEach(tag => {
        if (!document.querySelector(`meta[name="${tag.name}"]`)) {
            const meta = document.createElement('meta');
            meta.name = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
        }
    });
    
    // Voeg ENKEL de icons toe die je wel hebt
    const icons = [
        // PWA icons (die je WEL hebt)
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${basePath}img/icons/icon-192x192.png` },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: `${basePath}img/icons/icon-512x512.png` },
        
        // Gebruik dezelfde icon voor apple-touch-icon (optioneel)
        { rel: 'apple-touch-icon', href: `${basePath}img/icons/icon-192x192.png` }
    ];
    
    icons.forEach(icon => {
        // Verwijder bestaande
        const selector = icon.sizes 
            ? `link[rel="${icon.rel}"][sizes="${icon.sizes}"]`
            : `link[rel="${icon.rel}"]`;
        
        const existing = document.querySelector(selector);
        if (existing) {
            existing.remove();
        }
        
        const link = document.createElement('link');
        link.rel = icon.rel;
        if (icon.type) link.type = icon.type;
        if (icon.sizes) link.sizes = icon.sizes;
        link.href = icon.href;
        document.head.appendChild(link);
        
        console.log(`📁 Icon toegevoegd: ${icon.href}`);
    });
    
    // Verwijder favicon.ico link als die bestaat (om 404 te voorkomen)
    const faviconLink = document.querySelector('link[rel="icon"][href$="favicon.ico"]');
    if (faviconLink) {
        faviconLink.remove();
        console.log('🗑️ favicon.ico link verwijderd');
    }
    
    console.log('✅ Meta tags setup voltooid');
})();

// 1. CLEANUP
(function cleanupOld() {
    'use strict';
    
    console.log('🧹 Oude elementen verwijderen...');
    
    const elements = document.querySelectorAll(
        '[style*="fixed"][style*="z-index: 9"], ' +
        '[style*="fixed"][style*="transform: translate(-50%, -50%)"], ' +
        '.wizard-overlay, .installatie-wizard'
    );
    
    elements.forEach(el => {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    delete window.installatieWizard;
    delete window.showWizard;
    delete window.openWizard;
    
    console.log('✅ Oude elementen verwijderd');
})();

// 2. VERTALINGEN (onveranderd)
const translations = {
    nl: {
        installTitle: "📱 App Installeren",
        shortcutTitle: "📱 Snelkoppeling Maken",
        pwaAvailable: "PWA - Werkt offline",
        websiteShortcut: "Website snelkoppeling",
        directInstall: "⚡ Direct Installeren (PWA)",
        withYourIcon: "Met jouw eigen app icoon",
        forPwa: "Voor PWA (met icoon): gebruik Chrome/Edge op desktop of Android",
        platformInstructions: "Platform instructies:",
        android: "Android",
        androidSub: "Chrome/Edge: Menu → Toevoegen",
        ios: "iPhone/iPad",
        iosSub: "Safari: Deel-icoon → Toevoegen",
        desktop: "Computer",
        desktopSub: "Chrome/Edge: Menu → Installeren",
        close: "Sluiten",
        androidHelp: "📱 ANDROID:\n\n1. Open Chrome of Edge op je telefoon\n2. Tik op menu (⋮) rechtsboven\n3. Kies 'Toevoegen aan beginscherm'\n4. Tik 'Toevoegen'\n\n✅ De app verschijnt op je beginscherm!",
        iosHelp: "🍎 IPHONE/IPAD:\n\n1. Open deze pagina in SAFARI (niet Chrome!)\n2. Tik op het deel-icoon (📤) onderaan\n3. Scroll naar 'Toevoegen aan beginscherm'\n4. Tik 'Toevoegen'\n\n✅ De app verschijnt op je beginscherm!",
        desktopHelp: "💻 COMPUTER:\n\n1. Open Chrome, Edge of Firefox\n2. Klik op menu (⋮) rechtsboven\n3. Zoek naar 'Installeren' of soortgelijke optie\n4. Klik 'Installeren'\n\n✅ De app wordt geïnstalleerd op je computer!",
        installButton: "⚡ Installeer App",
        installed: "Geïnstalleerd",
        installPrompt: "Zoek in je browser menu naar 'Installeren' of 'Toevoegen aan beginscherm'",
        installWarning: "⚠️ Na installatie opent de app vanaf de hoofdpagina."
    },
    en: {
        installTitle: "📱 Install App",
        shortcutTitle: "📱 Create Shortcut",
        pwaAvailable: "PWA - Works offline",
        websiteShortcut: "Website shortcut",
        directInstall: "⚡ Direct Install (PWA)",
        withYourIcon: "With your own app icon",
        forPwa: "For PWA (with icon): use Chrome/Edge on desktop or Android",
        platformInstructions: "Platform instructions:",
        android: "Android",
        androidSub: "Chrome/Edge: Menu → Add to Home",
        ios: "iPhone/iPad",
        iosSub: "Safari: Share icon → Add to Home",
        desktop: "Computer",
        desktopSub: "Chrome/Edge: Menu → Install",
        close: "Close",
        androidHelp: "📱 ANDROID:\n\n1. Open Chrome or Edge on your phone\n2. Tap menu (⋮) top right\n3. Choose 'Add to Home Screen'\n4. Tap 'Add'\n\n✅ The app appears on your home screen!",
        iosHelp: "🍎 IPHONE/IPAD:\n\n1. Open this page in SAFARI (not Chrome!)\n2. Tap the share icon (📤) at the bottom\n3. Scroll to 'Add to Home Screen'\n4. Tap 'Add'\n\n✅ The app appears on your home screen!",
        desktopHelp: "💻 COMPUTER:\n\n1. Open Chrome, Edge or Firefox\n2. Click menu (⋮) top right\n3. Look for 'Install' or similar option\n4. Click 'Install'\n\n✅ The app is installed on your computer!",
        installButton: "⚡ Install App",
        installed: "Installed",
        installPrompt: "Look in your browser menu for 'Install' or 'Add to Home Screen'",
        installWarning: "⚠️ After installation, the app opens from the main page."
    },
    de: {
        installTitle: "📱 App Installieren",
        shortcutTitle: "📱 Verknüpfung Erstellen",
        pwaAvailable: "PWA - Funktioniert offline",
        websiteShortcut: "Website Verknüpfung",
        directInstall: "⚡ Direkt Installieren (PWA)",
        withYourIcon: "Mit Ihrem eigenen App-Symbol",
        forPwa: "Für PWA (mit Symbol): Chrome/Edge auf Desktop oder Android verwenden",
        platformInstructions: "Platform Anleitungen:",
        android: "Android",
        androidSub: "Chrome/Edge: Menü → Zum Startbildschirm",
        ios: "iPhone/iPad",
        iosSub: "Safari: Teilen-Symbol → Zum Startbildschirm",
        desktop: "Computer",
        desktopSub: "Chrome/Edge: Menü → Installieren",
        close: "Schließen",
        androidHelp: "📱 ANDROID:\n\n1. Öffnen Sie Chrome oder Edge auf Ihrem Telefon\n2. Tippen Sie auf Menü (⋮) oben rechts\n3. Wählen Sie 'Zum Startbildschirm hinzufügen'\n4. Tippen Sie 'Hinzufügen'\n\n✅ Die App erscheint auf Ihrem Startbildschirm!",
        iosHelp: "🍎 IPHONE/IPAD:\n\n1. Öffnen Sie deze pagina in SAFARI (nicht Chrome!)\n2. Tippen Sie auf das Teilen-Symbol (📤) unten\n3. Scrollen Sie zu 'Zum Home-Bildschirm hinzufügen'\n4. Tippen Sie 'Hinzufügen'\n\n✅ Die App erscheint auf Ihrem Startbildschirm!",
        desktopHelp: "💻 COMPUTER:\n\n1. Öffnen Sie Chrome, Edge oder Firefox\n2. Klicken Sie auf Menü (⋮) oben rechts\n3. Suchen Sie nach 'Installieren' of ähnlicher Option\n4. Klicken Sie 'Installieren'\n\n✅ Die App wordt op Ihrem Computer installiert!",
        installButton: "⚡ App Installieren",
        installed: "Installiert",
        installPrompt: "Suchen Sie in Ihrem Browser-Menü nach 'Installeren' oder 'Zum Startbildschirm hinzufügen'",
        installWarning: "⚠️ Nach der Installation öffnet sich die App von der Hauptseite."
    }
};

// 3. TAAL BEPALEN (onveranderd)
function getCurrentLanguage() {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }
    
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('nl')) return 'nl';
    if (browserLang.startsWith('de')) return 'de';
    
    return 'en';
}

// 4. SIMPLE INSTALLER (onveranderd behalve favicon verwijdering)
class SimpleInstaller {
    constructor() {
        console.log('🆕 SimpleInstaller aangemaakt');
        
        // Bepaal base path
        this.basePath = window.location.pathname.includes('/modern-pwa/') 
            ? '/modern-pwa/' 
            : '/';
        
        this.prompt = null;
        this.appName = document.title || 'Eurasier Friends';
        this.iconPath = `${this.basePath}img/icons/icon-192x192.png`;
        this.currentLang = getCurrentLanguage();
        this.t = translations[this.currentLang];
        
        console.log('📍 Base path:', this.basePath);
        console.log('📍 Icon path:', this.iconPath);
        
        this.setup();
    }
    
    setup() {
        // PWA install event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA install prompt beschikbaar');
            this.prompt = e;
            
            // Update knop
            this.updateInstallButton(this.t.installButton);
        });
        
        // App geïnstalleerd
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App succesvol geïnstalleerd!');
            this.markAsInstalled();
        });
        
        // Check if already installed
        this.checkIfInstalled();
        
        // Bind buttons
        this.bindButtons();
        
        window.simpleInstaller = this;
        console.log(`✅ Installer setup voltooid (taal: ${this.currentLang})`);
    }
    
    checkIfInstalled() {
        // Display mode check
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches) {
            console.log('📱 App draait in standalone mode');
            this.markAsInstalled();
            return true;
        }
        
        return false;
    }
    
    updateInstallButton(text) {
        ['pwaInstallBtn', 'pwaInstallBtnMobile'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = `<i class="bi bi-download"></i> ${text}`;
                btn.classList.add('btn-warning');
                btn.classList.remove('btn-success');
                btn.disabled = false;
            }
        });
    }
    
    bindButtons() {
        console.log('🔗 Knoppen binden...');
        
        ['pwaInstallBtn', 'pwaInstallBtnMobile'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                // Clone om events te resetten
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openDialog();
                });
            }
        });
    }
    
    openDialog() {
        this.closeDialog();
        
        const appName = this.appName;
        const iconUrl = `${this.iconPath}?t=${Date.now()}`;
        
        // Overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
        `;
        overlay.onclick = () => this.closeDialog();
        
        // Dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 25px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 9999;
            width: 380px;
            max-width: 95%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #333; text-align: center;">
                ${this.prompt ? this.t.installTitle : this.t.shortcutTitle}
            </h3>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${iconUrl}" alt="${appName}" 
                     style="width: 70px; height: 70px; border-radius: 14px; margin-bottom: 10px;">
                <div style="font-weight: 600; color: #212529;">${appName}</div>
                <div style="color: #6c757d; font-size: 13px; margin-top: 2px;">
                    ${this.prompt ? this.t.pwaAvailable : this.t.websiteShortcut}
                </div>
            </div>
            
            ${this.prompt ? `
                <button id="installBtnAction" 
                        style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 14px;
                            border-radius: 10px;
                            font-weight: 600;
                            width: 100%;
                            margin-bottom: 12px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        ">
                    <i class="bi bi-download"></i>
                    ${this.t.directInstall}
                </button>
                
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 13px;">
                    <div style="color: #28a745; margin-bottom: 5px;">
                        <i class="bi bi-check-circle"></i> ${this.t.withYourIcon}
                    </div>
                    <div style="color: #856404; font-size: 12px;">
                        <i class="bi bi-info-circle"></i> ${this.t.installWarning}
                    </div>
                </div>
            ` : `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px; font-size: 14px;">
                    <i class="bi bi-info-circle"></i> ${this.t.forPwa}
                </div>
            `}
            
            <div style="color: #666; font-size: 14px; margin: 15px 0; font-weight: 500; text-align: center;">
                ${this.t.platformInstructions}
            </div>
            
            <div style="display: grid; gap: 8px; margin-bottom: 20px;">
                <button onclick="simpleInstaller.handlePlatform('android')" 
                        style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; 
                               border-radius: 8px; cursor: pointer; text-align: left; display: flex; 
                               align-items: center; gap: 10px;">
                    <span>📱</span>
                    <div>
                        <div style="font-weight: 600;">${this.t.android}</div>
                        <div style="font-size: 12px; color: #6c757d;">${this.t.androidSub}</div>
                    </div>
                </button>
                
                <button onclick="simpleInstaller.handlePlatform('ios')" 
                        style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; 
                               border-radius: 8px; cursor: pointer; text-align: left; display: flex; 
                               align-items: center; gap: 10px;">
                    <span>🍎</span>
                    <div>
                        <div style="font-weight: 600;">${this.t.ios}</div>
                        <div style="font-size: 12px; color: #6c757d;">${this.t.iosSub}</div>
                    </div>
                </button>
                
                <button onclick="simpleInstaller.handlePlatform('desktop')" 
                        style="padding: 12px; background: #f8f9fa; border: 1px solid #dee2e6; 
                               border-radius: 8px; cursor: pointer; text-align: left; display: flex; 
                               align-items: center; gap: 10px;">
                    <span>💻</span>
                    <div>
                        <div style="font-weight: 600;">${this.t.desktop}</div>
                        <div style="font-size: 12px; color: #6c757d;">${this.t.desktopSub}</div>
                    </div>
                </button>
            </div>
            
            <button onclick="simpleInstaller.closeDialog()" 
                    style="background: #6c757d; color: white; border: none; padding: 12px; 
                           border-radius: 8px; width: 100%; cursor: pointer; font-weight: 500;">
                <i class="bi bi-x-circle"></i> ${this.t.close}
            </button>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Bind install button
        if (this.prompt) {
            setTimeout(() => {
                const installBtn = document.getElementById('installBtnAction');
                if (installBtn) {
                    installBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.install();
                    };
                }
            }, 50);
        }
    }
    
    handlePlatform(type) {
        if (this.prompt && (type === 'android' || type === 'desktop')) {
            this.install();
        } else {
            this.showHelp(type);
        }
    }
    
    install() {
        console.log('⚡ PWA installeren...');
        
        if (this.prompt) {
            this.prompt.prompt();
            
            this.prompt.userChoice.then(choiceResult => {
                console.log(`User choice: ${choiceResult.outcome}`);
                
                if (choiceResult.outcome === 'accepted') {
                    localStorage.setItem('pwaInstalled', 'true');
                    this.markAsInstalled();
                }
                
                this.prompt = null;
            });
        } else {
            this.showHelp('desktop');
        }
        
        this.closeDialog();
    }
    
    showHelp(type) {
        const helpTexts = {
            android: this.t.androidHelp,
            ios: this.t.iosHelp,
            desktop: this.t.desktopHelp
        };
        
        alert(`${helpTexts[type]}\n\n${this.t.installWarning}`);
        this.closeDialog();
    }
    
    markAsInstalled() {
        ['pwaInstallBtn', 'pwaInstallBtnMobile'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = `<i class="bi bi-check-circle"></i> ${this.t.installed}`;
                btn.className = 'btn btn-success';
                btn.disabled = true;
            }
        });
    }
    
    closeDialog() {
        const elements = document.querySelectorAll('div[style*="z-index: 999"]');
        elements.forEach(el => el.parentNode?.removeChild(el));
    }
}

// 5. START INSTALLER
console.log('🚀 Installer starten...');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM ready - Installer starten');
        window.simpleInstaller = new SimpleInstaller();
    });
} else {
    console.log('⚡ DOM al klaar - Installer direct starten');
    window.simpleInstaller = new SimpleInstaller();
}

console.log('✅ Installatie script geladen en klaar!');