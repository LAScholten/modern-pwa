// ✅ installatie.js - MET VERTALINGEN NL/EN/DE
// LAATSTE - 29 januari 2024 - MET TAALONDERSTEUNING

console.log('🔧 Installatie script laden...');

// 0. EENVOUDIGE MANIFEST SETUP ZONDER BLOB
(function setupPWAManifest() {
    'use strict';
    
    console.log('📄 PWA manifest setup...');
    
    // Voeg manifest.json link toe als die nog niet bestaat
    if (!document.querySelector('link[rel="manifest"]')) {
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = 'manifest.json';
        document.head.appendChild(manifestLink);
        console.log('✅ Manifest link toegevoegd');
    }
    
    // Voeg basis meta tags toe
    const metaTags = [
        { name: 'theme-color', content: '#007bff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
    ];
    
    metaTags.forEach(tag => {
        if (!document.querySelector(`meta[name="${tag.name}"]`)) {
            const meta = document.createElement('meta');
            meta.name = tag.name;
            meta.content = tag.content;
            document.head.appendChild(meta);
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
        installPrompt: "Zoek in je browser menu naar 'Installeren' of 'Toevoegen aan beginscherm'"
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
        installPrompt: "Look in your browser menu for 'Install' or 'Add to Home Screen'"
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
        iosHelp: "🍎 IPHONE/IPAD:\n\n1. Öffnen Sie deze Seite in SAFARI (nicht Chrome!)\n2. Tippen Sie auf das Teilen-Symbol (📤) unten\n3. Scrollen Sie zu 'Zum Home-Bildschirm hinzufügen'\n4. Tippen Sie 'Hinzufügen'\n\n✅ Die App erscheint auf Ihrem Startbildschirm!",
        desktopHelp: "💻 COMPUTER:\n\n1. Öffnen Sie Chrome, Edge oder Firefox\n2. Klicken Sie auf Menü (⋮) oben rechts\n3. Suchen Sie nach 'Installieren' of ähnlicher Option\n4. Klicken Sie 'Installieren'\n\n✅ Die App wird auf Ihrem Computer installiert!",
        installButton: "⚡ App Installieren",
        installed: "Installiert",
        installPrompt: "Suchen Sie in Ihrem Browser-Menü nach 'Installeren' oder 'Zum Startbildschirm hinzufügen'"
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

// 4. NIEUWE INSTALLER KLASSE MET VERTALINGEN
class SimpleInstaller {
    constructor() {
        console.log('🆕 SimpleInstaller aangemaakt');
        this.prompt = null;
        this.appName = document.title || 'Hondendatabase';
        this.iconPath = 'img/icons/icon-192x192.png';
        this.currentLang = getCurrentLanguage();
        this.t = translations[this.currentLang];
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
        });
        
        // App geïnstalleerd event
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App succesvol geïnstalleerd!');
            this.markAsInstalled();
        });
        
        // Bind knoppen
        this.bindButtons();
        
        // Maak globaal beschikbaar
        window.simpleInstaller = this;
        
        console.log(`✅ SimpleInstaller setup voltooid (taal: ${this.currentLang})`);
    }
    
    updateInstallButton(text) {
        const buttons = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = `<i class="bi bi-download"></i> ${text}`;
                btn.classList.add('btn-warning');
                btn.classList.remove('btn-success');
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
            width: 400px;
            max-width: 90%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
                            transition: transform 0.2s;
                        "
                        onmouseover="this.style.transform='translateY(-2px)'"
                        onmouseout="this.style.transform='translateY(0)'">
                    ${this.t.directInstall}
                </button>
                
                <div style="color: #28a745; font-size: 13px; margin-bottom: 15px;">
                    <i class="bi bi-check-circle"></i> ${this.t.withYourIcon}
                </div>
            ` : `
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    border-left: 4px solid #6c757d;
                ">
                    <div style="color: #495057; font-size: 14px;">
                        <i class="bi bi-info-circle"></i> 
                        ${this.t.forPwa}
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
                            transition: background 0.2s;
                        "
                        onmouseover="this.style.background='#e9ecef'"
                        onmouseout="this.style.background='#f8f9fa'">
                    <span style="font-size: 20px;">📱</span>
                    <div>
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
                            transition: background 0.2s;
                        "
                        onmouseover="this.style.background='#e9ecef'"
                        onmouseout="this.style.background='#f8f9fa'">
                    <span style="font-size: 20px;">🍎</span>
                    <div>
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
                            transition: background 0.2s;
                        "
                        onmouseover="this.style.background='#e9ecef'"
                        onmouseout="this.style.background='#f8f9fa'">
                    <span style="font-size: 20px;">💻</span>
                    <div>
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
                        transition: background 0.2s;
                    "
                    onmouseover="this.style.background='#5a6268'"
                    onmouseout="this.style.background='#6c757d'">
                <i class="bi bi-x-circle"></i> ${this.t.close}
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
        
        if (this.prompt) {
            this.prompt.prompt();
            
            this.prompt.userChoice.then(result => {
                console.log(`Gebruiker keuze: ${result.outcome}`);
                
                if (result.outcome === 'accepted') {
                    console.log('✅ Gebruiker heeft geïnstalleerd');
                    localStorage.setItem('pwaInstalled', 'true');
                    this.markAsInstalled();
                }
                
                this.prompt = null;
            });
        } else {
            console.log('ℹ️ Geen PWA prompt, toon instructies');
            alert(this.t.installPrompt);
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
        
        alert(helpTexts[type] || this.t.installPrompt);
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

// 5. START DE INSTALLER
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