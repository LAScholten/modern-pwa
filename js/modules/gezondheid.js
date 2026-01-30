// modules/gezondheid.js

// Gezondheid module vertalingen
const gezondheidTranslations = {
    nl: {
        title: "Gezondheid",
        content: `
            <div class="gezondheid-content">
                <p>GEZONDHEID</p>
            </div>
        `
    },
    en: {
        title: "Health",
        content: `
            <div class="gezondheid-content">
                <p>HEALTH</p>
            </div>
        `
    },
    de: {
        title: "Gesundheit",
        content: `
            <div class="gezondheid-content">
                <p>GESUNDHEIT</p>
            </div>
        `
    }
};

// Functie om gezondheid module te initialiseren
function initGezondheidModule() {
    console.log('Gezondheid module initialiseren...');
    
    // Creëer de module HTML - exact dezelfde structuur als boek.js
    const gezondheidHTML = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-heart-pulse"></i> 
                        <span id="gezondheidTitle">Gezondheid</span>
                    </h5>
                </div>
            </div>
            <div class="card-body module-content">
                <div id="gezondheidContent">${gezondheidTranslations.nl.content}</div>
            </div>
        </div>
    `;
    
    return gezondheidHTML;
}

// Functie om gezondheid module te vertalen
function translateGezondheidModule(lang) {
    const gezondheidTitle = document.getElementById('gezondheidTitle');
    const gezondheidContent = document.getElementById('gezondheidContent');
    
    if (gezondheidTitle && gezondheidTranslations[lang]) {
        gezondheidTitle.textContent = gezondheidTranslations[lang].title;
    }
    
    if (gezondheidContent && gezondheidTranslations[lang]) {
        gezondheidContent.innerHTML = gezondheidTranslations[lang].content;
    }
}

// Exporteer functies
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initGezondheidModule,
        translateGezondheidModule,
        gezondheidTranslations
    };
}