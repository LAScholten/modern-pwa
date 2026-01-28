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
        this.appIcon = this.createAndInjectIcon(); // Creëer en injecteer icoon
        this.init();
    }
    
    init() {
        console.log('📱 InstallatieWizard geïnitialiseerd');
        console.log('🎯 App naam:', this.appName);
        console.log('🎨 Icoon gemaakt:', this.appIcon);
        this.setupEventListeners();
        this.setupInstallatieWizard();
        this.checkIfInstalled();
    }
    
    createAndInjectIcon() {
        // Maak een dynamisch icoon gebaseerd op de app naam
        const firstLetter = this.appName.charAt(0).toUpperCase();
        const colors = [
            ['#FF6B6B', '#C44569'], // Rood
            ['#4ECDC4', '#2D6A6A'], // Turquoise
            ['#FFD166', '#FF9E00'], // Geel/Orange
            ['#06D6A0', '#048A81'], // Groen
            ['#118AB2', '#0A516B'], // Blauw
            ['#7B2CBF', '#4A0E7A'], // Paars
            ['#EF476F', '#B9134F'], // Roze
            ['#2A9D8F', '#1D6F65']  // Teal
        ];
        
        const colorIndex = this.appName.length % colors.length;
        const [primaryColor, secondaryColor] = colors[colorIndex];
        
        // Maak canvas voor het icoon
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Maak gradient achtergrond
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);
        
        // Achtergrond met afgeronde hoeken
        ctx.fillStyle = gradient;
        this.roundRect(ctx, 0, 0, 512, 512, 100);
        ctx.fill();
        
        // Witte cirkel voor letter
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(256, 256, 180, 0, Math.PI * 2);
        ctx.fill();
        
        // Letter in het midden
        ctx.fillStyle = 'white';
        ctx.font = 'bold 240px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(firstLetter, 256, 256);
        
        // Subtiele schaduw voor diepte
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        
        const dataUrl = canvas.toDataURL('image/png');
        
        // Injecteer het icoon in de HTML head
        this.injectIconIntoHead(dataUrl);
        
        return dataUrl;
    }
    
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    injectIconIntoHead(iconDataUrl) {
        // Verwijder bestaande iconen om conflicten te voorkomen
        const existingIcons = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]'
        ];
        
        existingIcons.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.remove();
        });
        
        // Maak een favicon link element
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = iconDataUrl;
        favicon.type = 'image/png';
        document.head.appendChild(favicon);
        
        // Maak een apple touch icon voor iOS
        const appleIcon = document.createElement('link');
        appleIcon.rel = 'apple-touch-icon';
        appleIcon.href = iconDataUrl;
        appleIcon.sizes = '512x512';
        document.head.appendChild(appleIcon);
        
        // Voeg ook een manifest toe voor PWA ondersteuning
        this.injectManifest();
        
        console.log('✅ Icoon geïnjecteerd in HTML head');
    }
    
    injectManifest() {
        // Verwijder bestaande manifest
        const existingManifest = document.querySelector('link[rel="manifest"]');
        if (existingManifest) existingManifest.remove();
        
        // Maak een eenvoudig manifest voor PWA functionaliteit
        const manifest = {
            "name": this.appName,
            "short_name": this.appName.substring(0, 12),
            "description": `${this.appName} - Snelkoppeling`,
            "start_url": window.location.origin,
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": "#0d6efd",
            "icons": [
                {
                    "src": this.appIcon,
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any maskable"
                }
            ]
        };
        
        // Maak een data URL van het manifest
        const manifestString = JSON.stringify(manifest);
        const manifestDataUrl = 'data:application/manifest+json,' + encodeURIComponent(manifestString);
        
        // Voeg manifest toe aan head
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = manifestDataUrl;
        document.head.appendChild(manifestLink);
        
        console.log('✅ Manifest geïnjecteerd');
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
            
            // Toon bedankt bericht
            this.showThankYouMessage();
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
                width: 100px;
                height: 100px;
                margin: 20px auto;
                border-radius: 22px;
                overflow: hidden;
                box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                background: white;
                border: 4px solid #dee2e6;
                position: relative;
            }
            .icon-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .icon-preview::after {
                content: '${this.appName.charAt(0).toUpperCase()}';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                font-weight: bold;
                color: white;
                background: linear-gradient(135deg, var(--icon-color1), var(--icon-color2));
                font-family: Arial, sans-serif;
            }
            .step {
                margin-bottom: 15px;
                padding: 12px 15px;
                border-left: 4px solid #0d6efd;
                background: #f8f9fa;
                border-radius: 0 10px 10px 0;
                position: relative;
            }
            .step-number {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 30px;
                height: 30px;
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
            .device-icon {
                font-size: 1.2em;
                margin-right: 8px;
                color: #6c757d;
            }
            .screenshot {
                max-width: 200px;
                border-radius: 8px;
                border: 2px solid #dee2e6;
                margin: 10px auto;
                display: block;
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
                <i class="bi bi-plus-circle-fill"></i> Snelkoppeling
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
        
        // Maak icoon preview met CSS variabelen voor kleur
        const colors = this.getAppColors();
        const iconStyle = `--icon-color1: ${colors[0]}; --icon-color2: ${colors[1]};`;
        
        const iconHtml = `
            <div class="icon-preview" style="${iconStyle}">
                <!-- Icoon wordt via CSS weergegeven -->
            </div>
            <p class="text-center mb-4">
                <strong>${this.appName}</strong><br>
                <small class="text-muted">Dit icoon verschijnt op je beginscherm</small>
            </p>
        `;
        
        if (isMobile) {
            if (isIOS) {
                title = `Snelkoppeling op iOS`;
                stepsHTML = `
                    ${iconHtml}
                    <div class="alert alert-primary">
                        <i class="bi bi-phone device-icon"></i>
                        <strong>Voor iPhone & iPad:</strong> Gebruik Safari browser
                    </div>
                    
                    <div class="step">
                        <span class="step-number">1</span> Open deze pagina in <strong>Safari</strong>
                        <div class="mt-2">
                            <span class="badge bg-primary"><i class="bi bi-compass"></i> Safari</span>
                        </div>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Tik op het <strong>deel-icoon</strong> onderin beeld
                        <div class="mt-2 text-center">
                            <span class="badge bg-secondary fs-5"><i class="bi bi-share"></i></span>
                        </div>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Scroll omlaag en kies <strong class="text-primary">"Voeg toe aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> Bevestig met <strong class="text-success">"Voeg toe"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">5</span> Zoek het <strong>${this.appName}</strong> icoon op je beginscherm!
                    </div>
                    
                    <div class="alert alert-success mt-3">
                        <i class="bi bi-lightbulb"></i> 
                        <strong>Tip:</strong> Sleep de snelkoppeling naar je favoriete locatie
                    </div>
                `;
            } else if (isAndroid) {
                title = `Snelkoppeling op Android`;
                const browserInfo = this.getAndroidBrowserInfo(browser);
                
                stepsHTML = `
                    ${iconHtml}
                    <div class="alert alert-info">
                        <i class="bi bi-phone device-icon"></i>
                        <strong>Voor Android telefoons:</strong> Werkt in Chrome, Firefox en andere browsers
                    </div>
                    
                    <div class="step">
                        <span class="step-number">1</span> ${browserInfo.step1}
                        <div class="mt-2">
                            <span class="badge bg-info"><i class="bi ${browserInfo.icon}"></i> ${browser}</span>
                        </div>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">2</span> Selecteer <strong>"Toevoegen aan beginscherm"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">3</span> Klik op <strong class="text-success">"Toevoegen"</strong>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">4</span> De snelkoppeling met het ${this.appName} icoon verschijnt nu!
                    </div>
                    
                    <div class="alert alert-warning mt-3">
                        <i class="bi bi-exclamation-triangle"></i> 
                        <strong>Let op:</strong> Soms moet je eerst toestemming geven voor "Pop-ups"
                    </div>
                `;
            }
        } else {
            // Desktop instructies
            title = `Snelkoppeling op Computer`;
            
            stepsHTML = `
                ${iconHtml}
                
                <div class="row g-3">
                    <!-- Chrome & Edge -->
                    <div class="col-md-6">
                        <div class="card h-100 border-primary">
                            <div class="card-header bg-primary text-white">
                                <i class="bi bi-laptop device-icon"></i>
                                Chrome / Edge
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> Zoek het <strong>install-icoon</strong> in de adresbalk
                                    <div class="mt-2 text-center">
                                        <span class="badge bg-primary fs-5"><i class="bi bi-download"></i></span>
                                    </div>
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> Klik op <strong>"Installeren"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> Snelkoppeling wordt toegevoegd aan:
                                    <div class="mt-2">
                                        <span class="badge bg-secondary"><i class="bi bi-windows"></i> Start Menu</span>
                                        <span class="badge bg-secondary"><i class="bi bi-display"></i> Bureaublad</span>
                                        <span class="badge bg-secondary"><i class="bi bi-list-task"></i> Taakbalk</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Andere browsers -->
                    <div class="col-md-6">
                        <div class="card h-100 border-success">
                            <div class="card-header bg-success text-white">
                                <i class="bi bi-laptop device-icon"></i>
                                Andere Browsers
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">1</span> <strong>Firefox:</strong> Klik op "+" in adresbalk
                                </div>
                                <div class="step">
                                    <span class="step-number">2</span> <strong>Safari:</strong> Bestand → "Toevoegen aan Dock"
                                </div>
                                <div class="step">
                                    <span class="step-number">3</span> <strong>Alle browsers:</strong> Kijk in browserinstellingen
                                </div>
                                <div class="alert alert-info mt-3">
                                    <i class="bi bi-info-circle"></i>
                                    Elk icoon wordt automatisch aangemaakt voor deze snelkoppeling
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-outline-primary w-100" onclick="this.classList.add('d-none'); document.getElementById('advancedOptions').classList.remove('d-none')">
                        <i class="bi bi-gear"></i> Geavanceerde opties
                    </button>
                    
                    <div id="advancedOptions" class="d-none">
                        <div class="card mt-3 border-warning">
                            <div class="card-header bg-warning">
                                <i class="bi bi-tools"></i> Handmatig toevoegen
                            </div>
                            <div class="card-body">
                                <div class="step">
                                    <span class="step-number">A</span> Druk op <kbd>F12</kbd> voor Developer Tools
                                </div>
                                <div class="step">
                                    <span class="step-number">B</span> Ga naar tabblad <strong>"Application"</strong>
                                </div>
                                <div class="step">
                                    <span class="step-number">C</span> Zoek <strong>"Manifest"</strong> en klik op <button class="btn btn-sm btn-success">Install</button>
                                </div>
                            </div>
                        </div>
                    </div>
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
    
    getAppColors() {
        // Genereer consistente kleuren gebaseerd op app naam
        const hash = this.appName.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        const hue = Math.abs(hash % 360);
        return [
            `hsl(${hue}, 70%, 60%)`,
            `hsl(${(hue + 30) % 360}, 80%, 45%)`
        ];
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
                    step1: 'Tik op de <strong>drie puntjes</strong> rechtsboven',
                    icon: 'bi-browser-chrome'
                };
            case 'Firefox':
                return {
                    step1: 'Tik op de <strong>drie puntjes</strong> rechtsboven',
                    icon: 'bi-browser-firefox'
                };
            case 'Samsung':
                return {
                    step1: 'Tik op het <strong>menu-icoon</strong> (3 lijnen)',
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
                btn.innerHTML = '<i class="bi bi-plus-circle-fill"></i> Snelkoppeling Maken';
                btn.classList.add('btn-warning', 'install-btn-pulse');
                btn.style.display = 'inline-block';
                btn.title = `Voeg ${this.appName} toe aan je beginscherm`;
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
                btn.title = `${this.appName} staat op je beginscherm`;
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
    
    showThankYouMessage() {
        const thankYouHTML = `
            <div class="modal fade" id="thankYouModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title"><i class="bi bi-check-circle-fill me-2"></i>Bedankt!</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <div class="icon-preview mx-auto mb-3" style="width: 80px; height: 80px; --icon-color1: #4ECDC4; --icon-color2: #2D6A6A;"></div>
                            <h4>${this.appName} is toegevoegd!</h4>
                            <p class="text-muted">
                                Je kunt de app nu openen vanaf je beginscherm of bureaublad.
                            </p>
                            <div class="mt-4">
                                <button class="btn btn-success" data-bs-dismiss="modal">
                                    <i class="bi bi-check-lg"></i> Begrepen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = thankYouHTML;
        document.body.appendChild(modalContainer);
        
        setTimeout(() => {
            const thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
            thankYouModal.show();
            
            document.getElementById('thankYouModal').addEventListener('hidden.bs.modal', () => {
                modalContainer.remove();
            });
        }, 1000);
    }
}

// Initialisatie
document.addEventListener('DOMContentLoaded', function() {
    new InstallatieWizard();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = InstallatieWizard;
}