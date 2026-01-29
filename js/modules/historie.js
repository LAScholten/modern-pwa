// modules/historie.js

// Historie module vertalingen
const historieTranslations = {
    nl: {
        title: "Historie",
        content: "Historie"
    },
    en: {
        title: "History",
        content: "History"
    },
    de: {
        title: "Geschichte",
        content: "Geschichte"
    }
};

// Functie om historie module te initialiseren
function initHistorieModule() {
    console.log('Historie module initialiseren...');
    
    // Creëer de module HTML
    const historieHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-clock-history"></i> 
                        <span id="historieTitle">Historie</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <h4 id="historieContent">Historie</h4>
            </div>
        </div>
    `;
    
    return historieHTML;
}

// Functie om historie module te vertalen
function translateHistorieModule(lang) {
    const historieTitle = document.getElementById('historieTitle');
    const historieContent = document.getElementById('historieContent');
    
    if (historieTitle && historieTranslations[lang]) {
        historieTitle.textContent = historieTranslations[lang].title;
    }
    
    if (historieContent && historieTranslations[lang]) {
        historieContent.textContent = historieTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHistorieModule,
        translateHistorieModule,
        historieTranslations
    };
}