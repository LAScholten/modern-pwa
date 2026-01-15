// welcome-screen.js - Welkomstscherm voor Desktop Edition
class WelcomeScreen {
    constructor() {
        this.storageManager = window.storageManager;
        this.isFirstVisit = !localStorage.getItem('desktop-edition-welcomed');
        
        // Controleer of er een opgeslagen configuratie is
        const hasConfig = this.storageManager.config !== null;
        
        // Toon alleen welkomstscherm als het de eerste keer is EN er geen config is
        this.showOnLoad = this.isFirstVisit && !hasConfig && this.storageManager.getStorageInfo().supportsFileSystem;
        
        // Als er wel een config is, probeer deze automatisch te laden
        if (hasConfig && !this.showOnLoad) {
            this.autoLoadConfiguration();
        }
    }
    
    async autoLoadConfiguration() {
        console.log('Auto-loading configuration...');
        try {
            const result = await this.storageManager.autoDetectConfiguration();
            if (result.success) {
                console.log('Configuratie automatisch geladen:', result.type);
                
                // Update globale status
                if (window.updateStorageStatus) {
                    updateStorageStatus();
                }
            }
        } catch (error) {
            console.warn('Kon configuratie niet automatisch laden:', error);
        }
    }
    
    async show() {
        // Als er al een configuratie is, toon dan een aangepast welkomstscherm
        if (this.storageManager.config) {
            await this.showConfigurationRestore();
            return;
        }
        
        if (!this.showOnLoad) return;
        
        console.log('Toon welkomstscherm voor Desktop Edition');
        
        // Maak het welkomstscherm
        const welcomeHTML = `
            <div id="welcome-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <h2>🎉 Welkom bij de Desktop Edition!</h2>
                    <p>Deze versie heeft extra mogelijkheden:</p>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #f0f7ff; border-radius: 5px;">
                        <h3>💾 Bestandsopslag</h3>
                        <p>Sla je data op in <strong>echte bestanden</strong> op je computer in plaats van alleen in de browser.</p>
                        <ul>
                            <li>📁 Kies zelf een opslagmap</li>
                            <li>💾 Maak backups op je harde schijf</li>
                            <li>🔄 Synchroniseer tussen apparaten (handmatig)</li>
                            <li>🔒 Meer controle over je data</li>
                            <li>📋 <strong>Configuratie wordt opgeslagen in de map</strong></li>
                            <li>💾 <strong>Werkt zelfs na browser wissen</strong></li>
                        </ul>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #fff0f0; border-radius: 5px; border-left: 4px solid #dc3545;">
                        <h4>📋 Hoe werkt het?</h4>
                        <ol style="margin-bottom: 0;">
                            <li>Je selecteert een map op je computer</li>
                            <li>De app slaat een <code>honden-config.json</code> bestand op in die map</li>
                            <li>Bij volgende bezoeken herkent de app deze map automatisch</li>
                            <li>Je kunt de hele map kopiëren naar een andere computer</li>
                            <li>Daar werkt de app dan meteen met al je data!</li>
                        </ol>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button id="welcome-use-filesystem" style="
                            padding: 12px 24px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">
                            💾 Bestandsopslag gebruiken
                        </button>
                        
                        <button id="welcome-use-browser" style="
                            padding: 12px 24px;
                            background: #2196F3;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">
                            🌐 Browser opslag (huidig)
                        </button>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                        <button id="welcome-later" style="
                            padding: 8px 16px;
                            background: transparent;
                            color: #666;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                            cursor: pointer;
                        ">
                            Later beslissen
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Voeg toe aan DOM
        document.body.insertAdjacentHTML('beforeend', welcomeHTML);
        
        // Voeg event listeners toe
        document.getElementById('welcome-use-filesystem').addEventListener('click', () => this.useFileSystem());
        document.getElementById('welcome-use-browser').addEventListener('click', () => this.useBrowserStorage());
        document.getElementById('welcome-later').addEventListener('click', () => this.close());
        
        // Markeer als bezocht
        localStorage.setItem('desktop-edition-welcomed', 'true');
    }
    
    async showConfigurationRestore() {
        console.log('Toon configuratie herstel scherm');
        
        const config = this.storageManager.config;
        
        const restoreHTML = `
            <div id="welcome-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <h2>🔍 Configuratie gevonden!</h2>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #f0fff0; border-radius: 5px; border-left: 4px solid #4CAF50;">
                        <h4>📋 Opgeslagen configuratie:</h4>
                        <ul style="margin-bottom: 0;">
                            <li><strong>Type:</strong> ${config.type === 'filesystem' ? 'Bestandsopslag' : 'Browser opslag'}</li>
                            ${config.type === 'filesystem' ? `<li><strong>Map:</strong> ${config.selectedPath || 'Niet gespecificeerd'}</li>` : ''}
                            <li><strong>Laatste sync:</strong> ${config.lastSync ? new Date(config.lastSync).toLocaleString() : 'Onbekend'}</li>
                        </ul>
                    </div>
                    
                    <p>Wil je deze configuratie herstellen?</p>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button id="restore-config-yes" style="
                            padding: 12px 24px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">
                            ✅ Ja, herstel configuratie
                        </button>
                        
                        <button id="restore-config-no" style="
                            padding: 12px 24px;
                            background: #f44336;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">
                            ❌ Nee, nieuwe configuratie
                        </button>
                    </div>
                    
                    ${config.type === 'filesystem' ? `
                    <div style="margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px; font-size: 0.9em;">
                        <strong>💡 Tip:</strong> Als je je bestaande map kopieert naar een nieuwe computer,
                        selecteer dan "Ja" en wijs de app naar de gekopieerde map.
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Voeg toe aan DOM
        document.body.insertAdjacentHTML('beforeend', restoreHTML);
        
        // Voeg event listeners toe
        document.getElementById('restore-config-yes').addEventListener('click', () => this.restoreConfiguration());
        document.getElementById('restore-config-no').addEventListener('click', () => {
            // Verwijder configuratie en toon normaal welkomstscherm
            localStorage.removeItem('honden-storage-config');
            this.storageManager.config = null;
            this.close();
            this.show();
        });
    }
    
    async restoreConfiguration() {
        this.close();
        this.showLoading('Configuratie herstellen...');
        
        try {
            await this.storageManager.initialize(this.storageManager.config.type);
            
            // Update status indicator
            if (window.updateStorageStatus) {
                updateStorageStatus();
            }
            
            this.showMessage('✅ Configuratie hersteld!', 'Je werkt nu weer met je bestaande opslaginstellingen.');
            
        } catch (error) {
            console.error('Configuratie herstel fout:', error);
            this.showMessage('❌ Kon configuratie niet herstellen', error.message || 'Onbekende fout. Kies een nieuwe opslagmethode.');
            
            // Verwijder defecte configuratie
            localStorage.removeItem('honden-storage-config');
            this.storageManager.config = null;
        }
    }
    
    async useFileSystem() {
        try {
            console.log('Gebruiker kiest voor FileSystem opslag');
            
            // Verwijder welkomstscherm
            this.close();
            
            // Toon loading
            this.showLoading('Map selecteren...');
            
            // Initialiseer met FileSystem
            await this.storageManager.initialize('filesystem');
            
            // Update status indicator
            if (window.updateStorageStatus) {
                updateStorageStatus();
            }
            
            // Toon success melding
            this.showMessage(
                '✅ Bestandsopslag geactiveerd!', 
                `Configuratie opgeslagen in de geselecteerde map.<br><br>
                <strong>Belangrijk:</strong><br>
                • Je kunt deze map nu kopiëren naar andere computers<br>
                • De app zal deze map automatisch herkennen bij volgende bezoeken<br>
                • Zelfs na het wissen van browsergegevens blijft je data beschikbaar`
            );
            
        } catch (error) {
            console.error('FileSystem init fout:', error);
            this.showMessage('❌ Kon map niet selecteren', 'We gebruiken browser opslag. Je kunt dit later wijzigen in instellingen.');
        }
    }
    
    useBrowserStorage() {
        console.log('Gebruiker kiest voor browser opslag');
        this.close();
        
        // Sla configuratie op voor browser opslag
        this.storageManager.saveConfig({
            type: 'indexeddb',
            lastSync: new Date().toISOString()
        });
        
        // StorageManager is al geïnitialiseerd met IndexedDB
        if (window.updateStorageStatus) {
            updateStorageStatus();
        }
    }
    
    close() {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    showLoading(message) {
        this.close();
        
        const loadingHTML = `
            <div id="welcome-loading" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                color: white;
            ">
                <div style="font-size: 24px; margin-bottom: 20px;">⏳</div>
                <div>${message}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }
    
    showMessage(title, text) {
        this.close();
        
        const messageHTML = `
            <div id="welcome-message" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                ">
                    <h3>${title}</h3>
                    <p>${text}</p>
                    <button onclick="document.getElementById('welcome-message').remove()" style="
                        padding: 10px 20px;
                        margin-top: 20px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">
                        OK
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', messageHTML);
    }
}

// Maak globale instance
const welcomeScreen = new WelcomeScreen();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WelcomeScreen, welcomeScreen };
}
