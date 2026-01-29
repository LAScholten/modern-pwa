// dashboard.js - Dashboard module voor Eurasier Friends International PWA

// Initialiseer dashboard module
function initDashboardModule() {
    console.log('Initializing dashboard module...');
    return `
        <div id="dashboardContent">
            <div class="card">
                <div class="card-header bg-light">
                    <h4 class="mb-0"><i class="bi bi-house-door"></i> <span class="app-text" data-key="dashboard">Dashboard</span></h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-success">
                        <h5><i class="bi bi-check-circle"></i> <span class="app-text" data-key="welcomeTitle">Welkom bij de Eurasier Friends International PWA</span></h5>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Functie om dashboard te tonen
function showDashboard() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        console.error('mainContent element niet gevonden');
        return;
    }
    
    mainContent.innerHTML = initDashboardModule();
    
    // Update vertalingen
    const currentLang = localStorage.getItem('appLanguage') || 'nl';
    translateDashboardModule(currentLang);
}

// Vertaal dashboard module
function translateDashboardModule(lang) {
    const translations = {
        nl: {
            dashboard: "Dashboard",
            welcomeTitle: "Welkom bij de Eurasier END Friends International PWA"
        },
        en: {
            dashboard: "Dashboard", 
            welcomeTitle: "Welcome to the Eurasier Friends International PWA"
        },
        de: {
            dashboard: "Dashboard",
            welcomeTitle: "Willkommen bei der Eurasier Friends International PWA"
        }
    };
    
    const elements = document.querySelectorAll('#dashboardContent .app-text');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}