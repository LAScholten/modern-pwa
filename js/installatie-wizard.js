// installatie-wizard-compleet.js
(function() {
    'use strict';
    
    // 1. EERST: Injecteer manifest in HTML head
    function injectManifest() {
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = '/manifest.json';
        document.head.appendChild(manifestLink);
        
        // Maak manifest.json dynamisch als die niet bestaat
        fetch('/manifest.json').catch(() => {
            // Fallback: maak meta tags aan
            const metaTags = [
                { name: 'application-name', content: document.title || 'Mijn App' },
                { name: 'theme-color', content: '#007bff' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
                { name: 'apple-mobile-web-app-title', content: document.title || 'Mijn App' },
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
            
            // Favicon
            const favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/png';
            favicon.href = '/modern-pwa/img/icons/icon-192x192.png';
            document.head.appendChild(favicon);
        });
    }
    
    // 2. CLEANUP functie
    function cleanupOldWizard() {
        // Verwijder ALLE oude wizards
        const oldElements = document.querySelectorAll(
            '.installatie-wizard, .wizard-overlay, [id*="wizard"], [id*="Wizard"]'
        );
        oldElements.forEach(el => el.remove());
        
        // Verwijder oude instance
        if (window.installatieWizard) {
            try { window.installatieWizard.closeWizard(); } catch(e) {}
            delete window.installatieWizard;
        }
    }
    
    // 3. HOOFD KLASSE
    class InstallatieWizard {
        constructor() {
            this.deferredPrompt = null;
            this.iconsPath = '/modern-pwa/img/icons/';
            this.currentLanguage = this.detectLanguage();
            this.translations = this.getTranslations();
            this.appName = document.title || 'Mijn App';
            this.init();
        }
        
        detectLanguage() {
            const lang = navigator.language || navigator.userLanguage;
            if (lang.startsWith('nl')) return 'nl';
            if (lang.startsWith('de')) return 'de';
            return 'en';
        }
        
        getTranslations() {
            return {
                nl: {
                    title: "Zo zal de snelkoppeling er uit zien:",
                    pwaTitle: "Snelkoppeling in 2 stappen geregeld",
                    unsupportedTitle: "Uitleg voor het maken van de snelkoppeling voor:",
                    ios: "iPhone/iPad",
                    android: "Android",
                    windows: "Windows",
                    mac: "Mac",
                    chrome: "Chrome",
                    firefox: "Firefox",
                    safari: "Safari",
                    clickHere: "Klik hier",
                    close: "Sluiten",
                    allDevices: "Voor alle apparaten",
                    installed: "Geïnstalleerd"
                },
                de: {
                    title: "So wird die Verknüpfung aussehen:",
                    pwaTitle: "Verknüpfung in 2 Schritten erledigt",
                    unsupportedTitle: "Anleitung zum Erstellen der Verknüpfung für:",
                    ios: "iPhone/iPad",
                    android: "Android",
                    windows: "Windows",
                    mac: "Mac",
                    chrome: "Chrome",
                    firefox: "Firefox",
                    safari: "Safari",
                    clickHere: "Hier klicken",
                    close: "Schließen",
                    allDevices: "Für alle Geräte",
                    installed: "Installiert"
                },
                en: {
                    title: "This is how the shortcut will look:",
                    pwaTitle: "Shortcut in 2 steps arranged",
                    unsupportedTitle: "Instructions for creating the shortcut for:",
                    ios: "iPhone/iPad",
                    android: "Android",
                    windows: "Windows",
                    mac: "Mac",
                    chrome: "Chrome",
                    firefox: "Firefox",
                    safari: "Safari",
                    clickHere: "Click here",
                    close: "Close",
                    allDevices: "For all devices",
                    installed: "Installed"
                }
            };
        }
        
        init() {
            // Injecteer manifest EERST
            injectManifest();
            
            // Events
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.deferredPrompt = e;
                console.log('PWA install prompt available');
            });
            
            window.addEventListener('appinstalled', () => {
                console.log('PWA installed successfully');
                this.markButtonsAsInstalled();
            });
            
            // Bind buttons
            this.bindToExistingButtons();
            
            // Maak globaal beschikbaar
            window.installatieWizard = this;
        }
        
        bindToExistingButtons() {
            const buttonIds = ['pwaInstallBtn', 'pwaInstallBtnMobile'];
            
            buttonIds.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    // Verwijder alle oude events
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                    
                    // Nieuwe event
                    newBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showWizard();
                    });
                }
            });
        }
        
        markButtonsAsInstalled() {
            const buttons = [
                document.getElementById('pwaInstallBtn'),
                document.getElementById('pwaInstallBtnMobile')
            ];
            
            const t = this.translations[this.currentLanguage];
            
            buttons.forEach(btn => {
                if (btn) {
                    btn.innerHTML = `<i class="bi bi-check-circle"></i> ${t.installed}`;
                    btn.classList.remove('btn-warning', 'btn-primary', 'btn-danger');
                    btn.classList.add('btn-success');
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                }
            });
        }
        
        showWizard() {
            // Cleanup eerst
            cleanupOldWizard();
            
            const t = this.translations[this.currentLanguage];
            const isPwaSupported = this.deferredPrompt !== null;
            
            // Timestamp voor cache busting
            const timestamp = Date.now();
            const iconUrl = `${this.iconsPath}icon-192x192.png?t=${timestamp}`;
            
            const wizardHTML = `
                <div id="install-wizard-${timestamp}" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                    z-index: 10001;
                    width: 360px;
                    max-width: 90vw;
                    font-family: Arial, sans-serif;
                ">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">
                            ${t.title}
                        </div>
                        <div style="
                            display: inline-flex;
                            align-items: center;
                            padding: 12px 24px;
                            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                            border-radius: 12px;
                            border: 1px solid #dee2e6;
                        ">
                            <img src="${iconUrl}" 
                                 alt="${this.appName}" 
                                 style="
                                    width: 48px;
                                    height: 48px;
                                    margin-right: 15px;
                                    border-radius: 10px;
                                    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
                                 "
                                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMCIgZmlsbD0iIzAwNzBGRiIvPHRleHQgeD0iMjQiIHk9IjI2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+QXBwPC90ZXh0Pjwvc3ZnPg==';">
                            <div style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600; color: #212529;">${this.appName}</div>
                                <div style="font-size: 12px; color: #6c757d; margin-top: 2px;">PWA • Offline beschikbaar</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="
                        font-size: 15px;
                        font-weight: 600;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #007bff;
                        color: #495057;
                    ">
                        ${isPwaSupported ? t.pwaTitle : t.unsupportedTitle}
                    </div>
                    
                    <div style="max-height: 300px; overflow-y: auto;">
                        ${this.getPlatformListHTML(t)}
                    </div>
                    
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        margin-top: 25px;
                        padding-top: 20px;
                        border-top: 1px solid #dee2e6;
                    ">
                        <button onclick="window.installatieWizard.closeWizard()" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            width: 48%;
                            transition: background 0.3s;
                        " onmouseover="this.style.background='#5a6268'" onmouseout="this.style.background='#6c757d'">
                            ${t.close}
                        </button>
                        <button onclick="window.installatieWizard.installPWA()" style="
                            background: linear-gradient(135deg, #28a745 0%, #218838 100%);
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            width: 48%;
                            transition: transform 0.2s;
                            font-weight: 600;
                        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                            ${t.allDevices}
                        </button>
                    </div>
                </div>
                
                <div id="install-wizard-overlay-${timestamp}" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 10000;
                " onclick="window.installatieWizard.closeWizard()"></div>
            `;
            
            const container = document.createElement('div');
            container.innerHTML = wizardHTML;
            document.body.appendChild(container);
        }
        
        getPlatformListHTML(t) {
            const platforms = [
                { id: 'ios', name: t.ios },
                { id: 'android', name: t.android },
                { id: 'windows', name: t.windows },
                { id: 'mac', name: t.mac },
                { id: 'chrome', name: t.chrome },
                { id: 'firefox', name: t.firefox },
                { id: 'safari', name: t.safari }
            ];
            
            return platforms.map((platform, index) => `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    ${index < platforms.length - 1 ? 'border-bottom: 1px solid #e9ecef;' : ''}
                ">
                    <div style="display: flex; align-items: center;">
                        <span style="font-size: 14px; color: #495057;">${platform.name}</span>
                    </div>
                    <button onclick="window.installatieWizard.platformClick('${platform.id}')" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 6px 15px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 13px;
                        transition: background 0.3s;
                    " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
                        ${t.clickHere}
                    </button>
                </div>
            `).join('');
        }
        
        platformClick(platform) {
            if (this.deferredPrompt) {
                // PWA ondersteund - toon browser prompt
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted PWA install');
                        localStorage.setItem('pwaInstalled', 'true');
                        this.markButtonsAsInstalled();
                    }
                    this.deferredPrompt = null;
                });
            } else {
                // Geen PWA support - toon instructies
                const t = this.translations[this.currentLanguage];
                const instructions = {
                    ios: `${t.ios}:\n\n1. Open in Safari\n2. Tap share icon (📤)\n3. Tap "Add to Home Screen"\n4. Tap "Add"`,
                    android: `${t.android}:\n\n1. Tap menu (⋮)\n2. Tap "Add to Home Screen"\n3. Tap "Add"`,
                    windows: `${t.windows}:\n\n1. Click menu (⋮)\n2. Click "Install app"\n3. Click "Install"`,
                    mac: `${t.mac}:\n\nSafari: File → Add to Dock\nChrome: Menu → Install app`,
                    chrome: `${t.chrome}:\n\n1. Click menu (⋮)\n2. Click "Install app"\n3. Click "Install"`,
                    firefox: `${t.firefox}:\n\n1. Click menu (☰)\n2. Click "Add to Home Screen"`,
                    safari: `${t.safari}:\n\n1. Click File menu\n2. Click "Add to Dock"`
                };
                
                alert(instructions[platform] || t.allDevices);
            }
            this.closeWizard();
        }
        
        installPWA() {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                this.deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        localStorage.setItem('pwaInstalled', 'true');
                        this.markButtonsAsInstalled();
                    }
                    this.deferredPrompt = null;
                });
            } else {
                const t = this.translations[this.currentLanguage];
                alert(`${t.allDevices}:\n\nLook for "Install" or "Add to Home Screen" in your browser menu.`);
            }
            this.closeWizard();
        }
        
        closeWizard() {
            // Verwijder ALLE wizard elementen
            const elements = document.querySelectorAll('[id^="install-wizard"]');
            elements.forEach(el => el.remove());
            
            // Verwijder ook oude klasse elementen
            const oldElements = document.querySelectorAll('.installatie-wizard, .wizard-overlay');
            oldElements.forEach(el => el.remove());
        }
    }
    
    // START de wizard
    window.addEventListener('DOMContentLoaded', () => {
        cleanupOldWizard();
        setTimeout(() => {
            window.installatieWizard = new InstallatieWizard();
        }, 100);
    });
    
    // Fallback voor als DOM al geladen is
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        cleanupOldWizard();
        setTimeout(() => {
            window.installatieWizard = new InstallatieWizard();
        }, 100);
    }
})();