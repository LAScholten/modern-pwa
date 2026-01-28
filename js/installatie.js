// ✅ installatie.js - MET MANIFEST CREATIE
// LAATSTE - 29 januari 2024 - MET ICON FIX

console.log('🔧 Installatie script laden...');

// 0. EERST: Maak manifest.json aan als die niet bestaat
(function createManifest() {
    'use strict';
    
    console.log('📄 Controleren manifest...');
    
    // Check of er al een manifest link is
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
        console.log('✅ Manifest al aanwezig');
        return;
    }
    
    // Maak manifest.json link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/modern-pwa/manifest.json';
    document.head.appendChild(manifestLink);
    
    console.log('➕ Manifest link toegevoegd');
    
    // Probeer manifest.json te laden, maak aan als niet bestaat
    fetch('/modern-pwa/manifest.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Manifest not found, creating...');
            }
            return response.json();
        })
        .catch(error => {
            console.log('⚠️ Manifest niet gevonden, maak aan...');
            
            // Maak manifest.json object
            const manifest = {
                "name": document.title || "Hondendatabase PWA",
                "short_name": "Hondendatabase",
                "description": "Hondendatabase Progressive Web App",
                "start_url": "/modern-pwa/",
                "display": "standalone",
                "background_color": "#ffffff",
                "theme_color": "#007bff",
                "icons": [
                    {
                        "src": "/modern-pwa/img/icons/icon-72x72.png",
                        "sizes": "72x72",
                        "type": "image/png"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-96x96.png",
                        "sizes": "96x96",
                        "type": "image/png"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-128x128.png",
                        "sizes": "128x128",
                        "type": "image/png"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-144x144.png",
                        "sizes": "144x144",
                        "type": "image/png"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-152x152.png",
                        "sizes": "152x152",
                        "type": "image/png"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "any maskable"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-384x384.png",
                        "sizes": "384x384",
                        "type": "image/png"
                    },
                    {
                        "src": "/modern-pwa/img/icons/icon-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ]
            };
            
            // Sla manifest op via fetch (POST naar server) - alleen als je server API hebt
            // Voor nu: voeg meta tags toe als fallback
            console.log('📝 Gebruik meta tags als fallback voor manifest');
            
            // Voeg meta tags toe voor PWA
            const metaTags = [
                { name: 'application-name', content: document.title || 'Hondendatabase' },
                { name: 'theme-color', content: '#007bff' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
                { name: 'apple-mobile-web-app-title', content: document.title || 'Hondendatabase' },
                { name: 'mobile-web-app-capable', content: 'yes' }
            ];
            
            metaTags.forEach(tag => {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            });
            
            // Apple touch icons
            const iconSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];
            iconSizes.forEach(size => {
                const link = document.createElement('link');
                link.rel = 'apple-touch-icon';
                link.sizes = `${size}x${size}`;
                link.href = `/modern-pwa/img/icons/icon-${size}x${size}.png`;
                document.head.appendChild(link);
            });
            
            console.log('✅ Meta tags en icons toegevoegd');
        });
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

// 2. NIEUWE INSTALLER KLASSE
class SimpleInstaller {
    constructor() {
        console.log('🆕 SimpleInstaller aangemaakt');
        this.prompt = null;
        this.appName = document.title || 'Hondendatabase';
        this.iconPath = '/modern-pwa/img/icons/icon-192x192.png';
        this.setup();
    }
    
    setup() {
        // PWA install event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA install prompt beschikbaar');
            e.preventDefault();
            this.prompt = e;
            
            // Update knop tekst als PWA beschikbaar is
            this.updateInstallButton('⚡ Installeer App');
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
        
        console.log('✅ SimpleInstaller setup voltooid');
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
        
        // Maak dialoog
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
                📱 ${this.prompt ? 'App Installeren' : 'Snelkoppeling Maken'}
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
                     "
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxNiIgZmlsbD0iIzAwNzBGRiIvPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+RG9nPC90ZXh0Pjwvc3ZnPg==';">
                <div style="font-size: 18px; font-weight: bold; color: #212529;">${appName}</div>
                <div style="color: #6c757d; margin-top: 5px; font-size: 14px;">
                    ${this.prompt ? 'PWA - Werkt offline' : 'Website snelkoppeling'}
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
                    ⚡ Direct Installeren (PWA)
                </button>
                
                <div style="color: #28a745; font-size: 13px; margin-bottom: 15px;">
                    <i class="bi bi-check-circle"></i> Met jouw eigen app icoon
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
                        Voor een app-achtige ervaring met icoon:
                    </div>
                </div>
            `}
            
            <div style="color: #666; font-size: 14px; margin: 20px 0; font-weight: 500;">
                Platform instructies:
            </div>
            
            <div style="display: grid; gap: 10px; margin-bottom: 20px;">
                <button onclick="simpleInstaller.showHelp('android')" 
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
                        <div style="font-weight: bold; color: #212529;">Android</div>
                        <div style="font-size: 12px; color: #6c757d;">Menu → Toevoegen aan beginscherm</div>
                    </div>
                </button>
                
                <button onclick="simpleInstaller.showHelp('ios')" 
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
                        <div style="font-weight: bold; color: #212529;">iPhone/iPad</div>
                        <div style="font-size: 12px; color: #6c757d;">Safari → Deel-icoon → Toevoegen</div>
                    </div>
                </button>
                
                <button onclick="simpleInstaller.showHelp('desktop')" 
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
                        <div style="font-weight: bold; color: #212529;">Computer</div>
                        <div style="font-size: 12px; color: #6c757d;">Browser menu → Installeren</div>
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
                <i class="bi bi-x-circle"></i> Sluiten
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
        
        console.log('✅ Dialog geopend');
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
            this.showHelp('desktop');
        }
        
        this.closeDialog();
    }
    
    showHelp(type) {
        console.log(`ℹ️ Toon help voor: ${type}`);
        
        const messages = {
            android: '📱 ANDROID:\n\n1. Open Chrome of Edge op je telefoon\n2. Tik op menu (⋮)\n3. Kies "Toevoegen aan beginscherm"\n4. Tik "Toevoegen"\n\n✅ De app verschijnt op je beginscherm met icoon!',
            ios: '🍎 IPHONE/IPAD:\n\n1. Open deze pagina in SAFARI (niet Chrome!)\n2. Tik op het deel-icoon (📤) onderaan\n3. Scroll naar "Toevoegen aan beginscherm"\n4. Tik "Toevoegen"\n\n✅ De app verschijnt op je beginscherm met icoon!',
            desktop: '💻 COMPUTER:\n\n1. Open Chrome, Edge of Firefox\n2. Klik op menu (⋮) rechtsboven\n3. Zoek naar "Installeren" of soortgelijke optie\n4. Klik "Installeren"\n\n✅ De app wordt geïnstalleerd met icoon op je bureaublad/startmenu!'
        };
        
        alert(messages[type] || 'Kijk in je browser menu naar "Installeren" of "Toevoegen aan beginscherm"');
        this.closeDialog();
    }
    
    markAsInstalled() {
        console.log('🏷️ Markeren als geïnstalleerd...');
        
        const buttons = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.innerHTML = '<i class="bi bi-check-circle"></i> Geïnstalleerd';
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
        document.querySelectorAll('[style*="z-index: 9998"], [style*="z-index: 9999"]').forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // Verwijder ook op andere manieren
        const overlays = document.querySelectorAll('div[style*="rgba(0,0,0,0.7)"], div[style*="background: rgba(0,0,0,0.7)"]');
        overlays.forEach(el => el.remove());
        
        console.log('✅ Dialog gesloten');
    }
}

// 3. START DE INSTALLER
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

// Maak een manifest.json bestand in je /modern-pwa/ map voor beste resultaten
console.log('💡 Tip: Maak een manifest.json bestand in /modern-pwa/ voor de beste PWA ervaring!');