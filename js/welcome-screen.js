// welcome-screen.js - Vereenvoudigd Welkomstscherm zonder Storage Manager
class WelcomeScreen {
    constructor() {
        this.isFirstVisit = !localStorage.getItem('desktop-edition-welcomed');
        this.showOnLoad = this.isFirstVisit;
    }
    
    async show() {
        if (!this.showOnLoad) return;
        
        console.log('Toon welkomstscherm');
        
        // Maak het vereenvoudigde welkomstscherm
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
                    <h2>🎉 Welkom bij de Hondendatabase PWA!</h2>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #f0f7ff; border-radius: 5px;">
                        <h3>💾 Browser opslag</h3>
                        <p>Deze PWA slaat alle gegevens <strong>lokaal in je browser</strong> op.</p>
                        <ul>
                            <li>📱 Werkt offline</li>
                            <li>⚡ Snelle toegang tot je gegevens</li>
                            <li>🔒 Veilig binnen je browser</li>
                            <li>📋 Maak regelmatig backups</li>
                        </ul>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #fff0f0; border-radius: 5px; border-left: 4px solid #dc3545;">
                        <h4>⚠️ Belangrijke informatie</h4>
                        <p><strong>Je data is alleen opgeslagen in je huidige browser!</strong></p>
                        <p>Data kan verloren gaan als je:</p>
                        <ul style="margin-bottom: 0;">
                            <li>Browser geschiedenis wist</li>
                            <li>Cookies en sitegegevens verwijdert</li>
                            <li>Een andere browser gebruikt</li>
                            <li>Je apparaat reset</li>
                        </ul>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; background: #fff7e6; border-radius: 5px; border-left: 4px solid #ff9800;">
                        <h4>💡 Tips voor gebruik</h4>
                        <ol style="margin-bottom: 0;">
                            <li>Maak regelmatig backups via "Data Beheer"</li>
                            <li>Sla backups op meerdere plaatsen op</li>
                            <li>Test af en toe of je backups werken</li>
                            <li>Maak backups voor én na belangrijke wijzigingen</li>
                        </ol>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button id="welcome-continue" style="
                            padding: 12px 24px;
                            background: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            flex: 1;
                        ">
                            Beginnen
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Voeg toe aan DOM
        document.body.insertAdjacentHTML('beforeend', welcomeHTML);
        
        // Voeg event listener toe
        document.getElementById('welcome-continue').addEventListener('click', () => this.close());
        
        // Markeer als bezocht
        localStorage.setItem('desktop-edition-welcomed', 'true');
    }
    
    close() {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Maak globale instance
const welcomeScreen = new WelcomeScreen();

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WelcomeScreen, welcomeScreen };
}
