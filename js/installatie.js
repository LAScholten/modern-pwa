// ✅ installatie.js - MET VERTALINGEN NL/EN/DE EN 404 FIX
// LAATSTE - 29 januari 2026 - MET TAALONDERSTEUNING EN PWA FIX

console.log('🔧 Installatie script laden...');

// 0. EENVOUDIGE MANIFEST SETUP ZONDER BLOB
(function setupPWAManifest() {
    'use strict';
    
    console.log('📄 PWA manifest setup...');
    
    // Zorg dat de PWA altijd naar de root startpagina verwijst
    const updateManifestLinks = () => {
        // Verwijder bestaande manifest link
        const existingManifest = document.querySelector('link[rel="manifest"]');
        if (existingManifest) {
            existingManifest.remove();
        }
        
        // Voeg nieuwe manifest toe met absolute URL
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        
        // Gebruik altijd de root van de website voor de PWA
        if (window.location.pathname.includes('/pages/')) {
            // Als we in een subdirectory zijn, ga terug naar root
            manifestLink.href = '/manifest.json';
        } else {
            // Anders gebruik huidige locatie
            manifestLink.href = 'manifest.json';
        }
        
        document.head.appendChild(manifestLink);
        console.log('✅ Manifest link toegevoegd:', manifestLink.href);
    };
    
    updateManifestLinks();
    
    // Voeg basis meta tags toe
    const metaTags = [
        { name: 'theme-color', content: '#007bff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
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
    
    // Voeg iOS touch icons toe
    const iosIcons = [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/img/icons/apple-touch-icon.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/img/icons/apple-touch-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/img/icons/apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: '/img/icons/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: '/img/icons/apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: '/img/icons/apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: '/img/icons/apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '60x60', href: '/img/icons/apple-touch-icon-60x60.png' },
        { rel: 'apple-touch-icon', sizes: '57x57', href: '/img/icons/apple-touch-icon-57x57.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/img/icons/icon-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/img/icons/icon-512x512.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ];
    
    iosIcons.forEach(icon => {
        if (!document.querySelector(`link[rel="${icon.rel}"][sizes="${icon.sizes}"]`)) {
            const link = document.createElement('link');
            link.rel = icon.rel;
            if (icon.sizes) link.sizes = icon.sizes;
            if (icon.type) link.type = icon.type;
            link.href = icon.href;
            document.head.appendChild(link);
        }
    });
    
    console.log('✅ Meta tags setup voltooid');
})();

// 1. VERWIJDER ALLES WAT AL BESTAAT
(function cleanupOld() {
    'use strict';
    
    console.log('🧹 Oude elementen verwijderen...');
    
    // Verwijder alle wizards en overlays
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
    
    // Verwijder oude globale functies
    delete window.installatieWizard;
    delete window.showWizard;
    delete window.openWizard;
    
    console.log('✅ Oude elementen verwijderd');
})();

// 2. VERTALINGEN VOOR ALLE TALEN
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
        installWarning: "⚠️ Let op: Na installatie opent de app vanaf de hoofdpagina (index.html). Dit is normaal gedrag voor PWA's."
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
        installWarning: "⚠️ Note: After installation, the app opens from the main page (index.html). This is normal behavior for PWAs."
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
        iosHelp: "🍎 IPHONE/IPAD:\n\n1. Öffnen Sie diese Seite in SAFARI (nicht Chrome!)\n2. Tippen Sie auf das Teilen-Symbol (📤) unten\n3. Scrollen Sie zu 'Zum Home-Bildschirm hinzufügen'\n4. Tippen Sie 'Hinzufügen'\n\n✅ Die App erscheint auf Ihrem Startbildschirm!",
        desktopHelp: "💻 COMPUTER:\n\n1. Öffnen Sie Chrome, Edge oder Firefox\n2. Klicken Sie auf Menü (⋮) oben rechts\n3. Suchen Sie nach 'Installieren' of ähnlicher Option\n4. Klicken Sie 'Installieren'\n\n✅ Die App wird auf Ihrem Computer installiert!",
        installButton: "⚡ App Installieren",
        installed: "Installiert",
        installPrompt: "Suchen Sie in Ihrem Browser-Menü nach 'Installeren' oder 'Zum Startbildschirm hinzufügen'",
        installWarning: "⚠️ Hinweis: Nach der Installation öffnet sich die App von der Hauptseite (index.html). Dies ist normales Verhalten für PWAs."
    }
};

// 3. FUNCTIE OM HUIDIGE TAAL TE BEPALEN
function getCurrentLanguage() {
    // Eerst: check localStorage (wordt ingesteld door app.html)
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang && translations[savedLang]) {
        return savedLang;
    }
    
    // Dan: check browser taal
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('nl')) return 'nl';
    if (browserLang.startsWith('de')) return 'de';
    
    // Standaard: Engels
    return 'en';
}

// 4. URL FIX VOOR PWA
function getBaseUrl() {
    // Bepaal de basis URL voor PWA installatie
    const currentPath = window.location.pathname;
    
    // Als we in een subdirectory zijn (zoals /pages/)
    if (currentPath.includes('/pages/')) {
        return window.location.origin + '/';
    }
    
    // Anders gebruik huidige directory
    return window.location.origin + currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
}

// 5. NIEUWE INSTALLER KLASSE MET VERTALINGEN EN URL FIX
class SimpleInstaller {
    constructor() {
        console.log('🆕 SimpleInstaller aangemaakt');
        this.prompt = null;
        this.appName = document.title || 'Hondendatabase';
        this.iconPath = 'img/icons/icon-192x192.png';
        this.currentLang = getCurrentLanguage();
        this.t = translations[this.currentLang];
        this.baseUrl = getBaseUrl();
        
        console.log('🌐 Basis URL voor PWA:', this.baseUrl);
        console.log('🌐 Huidige locatie:', window.location.href);
        
        this.setup();
    }
    
    setup() {
        // PWA install event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA install prompt beschikbaar');
            e.preventDefault();
            this.prompt = e;
            
            // Update knop tekst als PWA beschikbaar is
            this.updateInstallButton(this.t.installButton);
            
            // Toon waarschuwing voor PWA gedrag
            console.log('⚠️ PWA zal starten vanaf hoofdpagina (index.html)');
        });
        
        // App geïnstalleerd event
        window.addEventListener('appinstalled', (evt) => {
            console.log('🎉 App succesvol geïnstalleerd!');
            
            // Log de geïnstalleerde app details
            console.log('📦 Geïnstalleerde app info:', {
                platform: navigator.platform,
                userAgent: navigator.userAgent,
                installedFrom: window.location.href
            });
            
            // Markeer als geïnstalleerd
            this.markAsInstalled();
            
            // Toon bevestiging
            setTimeout(() => {
                alert('✅ App succesvol geïnstalleerd!\n\nDe app start automatisch vanaf de hoofdpagina.');
            }, 500);
        });
        
        // Check of app al geïnstalleerd is
        this.checkIfInstalled();
        
        // Bind knoppen
        this.bindButtons();
        
        // Maak globaal beschikbaar
        window.simpleInstaller = this;
        
        console.log(`✅ SimpleInstaller setup voltooid (taal: ${this.currentLang})`);
    }
    
    checkIfInstalled() {
        // Check display mode
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            window.matchMedia('(display-mode: minimal-ui)').matches) {
            console.log('📱 App draait in standalone mode (geïnstalleerd)');
            this.markAsInstalled();
            return true;
        }
        
        // Check of localStorage zegt dat het geïnstalleerd is
        if (localStorage.getItem('pwaInstalled') === 'true') {
            console.log('📱 App gemarkeerd als geïnstalleerd in localStorage');
            this.markAsInstalled();
            return true;
        }
        
        return false;
    }
    
    updateInstallButton(text) {
        const buttons = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
        buttons.forEach(id => {
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
        
        const btnIds = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
        
        btnIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                console.log(`Binding ${id}...`);
                
                // Clone om oude events te verwijderen
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                // Nieuwe event
                newBtn.addEventListener('click', (e) => {
                    console.log(`📱 ${id} geklikt`);
                    e.preventDefault();
                    e.stopPropagation();
                    this.openDialog();
                });
            } else {
                console.warn(`⚠️ Knop niet gevonden: ${id}`);
            }
        });
        
        console.log('✅ Knoppen gebonden');
    }
    
    openDialog() {
        console.log('🪟 Dialog openen...');
        
        // Verwijder eerst eventuele oude dialoog
        this.closeDialog();
        
        // App naam en icon
        const appName = this.appName;
        const iconUrl = `${this.iconPath}?t=${Date.now()}`;
        
        // Maak overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 9998;
            backdrop-filter: blur(3px);
        `;
        overlay.onclick = () => this.closeDialog();
        
        // Maak dialoog met vertaalde tekst
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            z-index: 9999;
            width: 420px;
            max-width: 90%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-height: 90vh;
            overflow-y: auto;
        `;
        
        dialog.innerHTML = `
            <h2 style="margin-top: 0; color: #333; font-size: 24px;">
                ${this.prompt ? this.t.installTitle : this.t.shortcutTitle}
            </h2>
            
            <div style="margin: 25px 0;">
                <img src="${iconUrl}" 
                     alt="${appName}" 
                     style="
                        width: 80px; 
                        height: 80px; 
                        border-radius: 16px; 
                        margin-bottom: 15px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                     ">
                <div style="font-size: 18px; font-weight: bold; color: #212529;">${appName}</div>
                <div style="color: #6c757d; margin-top: 5px; font-size: 14px;">
                    ${this.prompt ? this.t.pwaAvailable : this.t.websiteShortcut}
                </div>
            </div>
            
            ${this.prompt ? `
                <button id="installBtn" 
                        style="
                            background: linear-gradient(135deg, #28a745, #218838);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 10px;
                            font-size: 16px;
                            font-weight: bold;
                            width: 100%;
                            margin-bottom: 15px;
                            cursor: pointer;
                            transition: all 0.3s;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(40,167,69,0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <i class="bi bi-download"></i>
                    ${this.t.directInstall}
                </button>
                
                <div style="color: #28a745; font-size: 13px; margin-bottom: 15px; display: flex; align-items: center; gap: 5px;">
                    <i class="bi bi-check-circle"></i> 
                    <span>${this.t.withYourIcon}</span>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 10px; margin: 15px 0; text-align: left;">
                    <div style="color: #856404; font-size: 13px; display: flex; gap: 8px;">
                        <i class="bi bi-exclamation-triangle"></i>
                        <span>${this.t.installWarning}</span>
                    </div>
                </div>
            ` : `
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    border-left: 4px solid #6c757d;
                ">
                    <div style="color: #495057; font-size: 14px; display: flex; gap: 8px;">
                        <i class="bi bi-info-circle"></i> 
                        <span>${this.t.forPwa}</span>
                    </div>
                </div>
            `}
            
            <div style="color: #666; font-size: 14px; margin: 20px 0; font-weight: 500;">
                ${this.t.platformInstructions}
            </div>
            
            <div style="display: grid; gap: 10px; margin-bottom: 20px;">
                <button onclick="simpleInstaller.handlePlatform('android')" 
                        style="
                            padding: 12px;
                            background: #f8f9fa;
                            border: 1px solid #dee2e6;
                            border-radius: 8px;
                            cursor: pointer;
                            text-align: left;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.background='#e9ecef'; this.style.transform='translateX(5px)'"
                        onmouseout="this.style.background='#f8f9fa'; this.style.transform='translateX(0)'">
                    <span style="font-size: 24px;">📱</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #212529;">${this.t.android}</div>
                        <div style="font-size: 12px; color: #6c757d;">${this.t.androidSub}</div>
                    </div>
                </button>
                
                <button onclick="simpleInstaller.handlePlatform('ios')" 
                        style="
                            padding: 12px;
                            background: #f8f9fa;
                            border: 1px solid #dee2e6;
                            border-radius: 8px;
                            cursor: pointer;
                            text-align: left;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.background='#e9ecef'; this.style.transform='translateX(5px)'"
                        onmouseout="this.style.background='#f8f9fa'; this.style.transform='translateX(0)'">
                    <span style="font-size: 24px;">🍎</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #212529;">${this.t.ios}</div>
                        <div style="font-size: 12px; color: #6c757d;">${this.t.iosSub}</div>
                    </div>
                </button>
                
                <button onclick="simpleInstaller.handlePlatform('desktop')" 
                        style="
                            padding: 12px;
                            background: #f8f9fa;
                            border: 1px solid #dee2e6;
                            border-radius: 8px;
                            cursor: pointer;
                            text-align: left;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            transition: all 0.2s;
                        "
                        onmouseover="this.style.background='#e9ecef'; this.style.transform='translateX(5px)'"
                        onmouseout="this.style.background='#f8f9fa'; this.style.transform='translateX(0)'">
                    <span style="font-size: 24px;">💻</span>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #212529;">${this.t.desktop}</div>
                        <div style="font-size: 12px; color: #6c757d;">${this.t.desktopSub}</div>
                    </div>
                </button>
            </div>
            
            <button onclick="simpleInstaller.closeDialog()" 
                    style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        width: 100%;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                    "
                    onmouseover="this.style.background='#5a6268'; this.style.transform='translateY(-1px)'"
                    onmouseout="this.style.background='#6c757d'; this.style.transform='translateY(0)'">
                <i class="bi bi-x-circle"></i> 
                ${this.t.close}
            </button>
        `;
        
        // Voeg toe aan pagina
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // Bind install knop (alleen als PWA beschikbaar)
        if (this.prompt) {
            setTimeout(() => {
                const installBtn = document.getElementById('installBtn');
                if (installBtn) {
                    installBtn.onclick = (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.install();
                    };
                }
            }, 100);
        }
        
        console.log(`✅ Dialog geopend (taal: ${this.currentLang})`);
    }
    
    handlePlatform(type) {
        console.log(`🖱️ Platform gekozen: ${type}`);
        
        if (this.prompt && (type === 'android' || type === 'desktop')) {
            // Voor Android en Desktop: gebruik PWA install als beschikbaar
            this.install();
        } else {
            // Voor iOS of geen PWA: toon instructies
            this.showHelp(type);
        }
    }
    
    install() {
        console.log('⚡ PWA installeren...');
        console.log('📍 Installeren vanaf:', this.baseUrl);
        
        if (this.prompt) {
            try {
                this.prompt.prompt();
                
                this.prompt.userChoice.then(result => {
                    console.log(`Gebruiker keuze: ${result.outcome}`);
                    
                    if (result.outcome === 'accepted') {
                        console.log('✅ Gebruiker heeft geïnstalleerd');
                        localStorage.setItem('pwaInstalled', 'true');
                        localStorage.setItem('pwaInstallDate', new Date().toISOString());
                        this.markAsInstalled();
                    } else {
                        console.log('❌ Gebruiker heeft geannuleerd');
                    }
                    
                    this.prompt = null;
                }).catch(error => {
                    console.error('❌ Fout bij installatie:', error);
                    this.showHelp('desktop');
                });
            } catch (error) {
                console.error('❌ Fout bij prompt:', error);
                this.showHelp('desktop');
            }
        } else {
            console.log('ℹ️ Geen PWA prompt, toon instructies');
            this.showHelp('desktop');
        }
        
        this.closeDialog();
    }
    
    showHelp(type) {
        console.log(`ℹ️ Toon help voor: ${type}`);
        
        const helpTexts = {
            android: this.t.androidHelp,
            ios: this.t.iosHelp,
            desktop: this.t.desktopHelp
        };
        
        // Toon help in een mooie alert
        const helpMessage = `${helpTexts[type]}\n\n⚠️ ${this.t.installWarning}`;
        alert(helpMessage);
        this.closeDialog();
    }
    
    markAsInstalled() {
        console.log('🏷️ Markeren als geïnstalleerd...');
        
        const buttons = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = `<i class="bi bi-check-circle"></i> ${this.t.installed}`;
                btn.className = 'btn btn-success';
                btn.disabled = true;
                btn.style.cursor = 'default';
                btn.style.opacity = '0.8';
                btn.style.pointerEvents = 'none';
            }
        });
        
        console.log('✅ Knoppen gemarkeerd als geïnstalleerd');
    }
    
    closeDialog() {
        console.log('🔒 Dialog sluiten...');
        
        // Verwijder ALLE dialoog elementen
        const elements = document.querySelectorAll('div[style*="z-index: 999"], div[style*="fixed"][style*="top: 0"][style*="left: 0"]');
        elements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        console.log('✅ Dialog gesloten');
    }
}

// 6. START DE INSTALLER
console.log('🚀 Installer starten...');

// Functie om te controleren of we op de juiste pagina zijn
function isInstallPage() {
    const currentPage = window.location.pathname;
    return currentPage.includes('app.html') || 
           currentPage.includes('index.html') || 
           currentPage.endsWith('/') ||
           currentPage.includes('/pages/');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM ready - Installer starten');
        if (isInstallPage()) {
            window.simpleInstaller = new SimpleInstaller();
        } else {
            console.log('⚠️ Niet op installatie pagina, installer niet gestart');
        }
    });
} else {
    console.log('⚡ DOM al klaar - Installer direct starten');
    if (isInstallPage()) {
        window.simpleInstaller = new SimpleInstaller();
    } else {
        console.log('⚠️ Niet op installatie pagina, installer niet gestart');
    }
}

console.log('✅ Installatie script geladen en klaar!');